#!/usr/bin/env node
// Stage 2: strip scrape boilerplate from every source's rawText, write cleanText.
//
// Four deterministic passes, no LLM:
//   1. Cross-document line-frequency filter — any short line repeated across many
//      distinct sources is chrome (nav menus, cookie banners, country/currency lists).
//   2. Nav-block detector — runs of short, unpunctuated lines.
//   3. Per-host affix stripping — common prefix/suffix across a host's sources.
//   4. Regex sweep for consent/subscribe/related-articles residue.
//
// YouTube transcripts skip passes 1-3 (no line structure to exploit) and only get
// filler-word / stutter-repeat trimming.
//
// Run: node --max-old-space-size=8192 tools/corpus/02-clean.mjs
import fs from 'node:fs';
import { openDb, closeDb } from './lib/db.mjs';
import { CLEAN_REVIEW_PATH } from './lib/config.mjs';

const MIN_KEPT_CHARS = 400;
const LINE_FREQ_THRESHOLD = 25; // a line appearing in >= this many distinct sources is chrome
const LINE_FREQ_MAX_LEN = 60;

const CONSENT_PATTERNS = [
  /accept all cookies?/gi,
  /we use cookies[^.\n]{0,120}\./gi,
  /subscribe to our newsletter[^.\n]{0,120}\.?/gi,
  /related articles?:?/gi,
  /you might also like:?/gi,
  /sign up for our newsletter[^.\n]{0,120}\.?/gi,
  /this site uses cookies[^.\n]{0,160}\./gi,
];

function hostOf(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function isYouTube(sourceType, url) {
  return sourceType === 'SOURCE_TYPE_YOUTUBE_VIDEO' || /youtu\.?be/.test(url || '');
}

// --- pass 1+2: line-frequency + nav-block, computed globally then applied per-source ---

function buildLineFrequency(sources) {
  const freq = new Map();
  for (const s of sources) {
    if (isYouTube(s.sourceType, s.url)) continue;
    const seenInThisSource = new Set();
    for (const raw of (s.rawText || '').split('\n')) {
      const line = raw.trim();
      if (!line || line.length > LINE_FREQ_MAX_LEN) continue;
      if (seenInThisSource.has(line)) continue; // count each source once per line
      seenInThisSource.add(line);
      freq.set(line, (freq.get(line) || 0) + 1);
    }
  }
  const chrome = new Set();
  for (const [line, count] of freq) if (count >= LINE_FREQ_THRESHOLD) chrome.add(line);
  return chrome;
}

function looksLikeSentence(line) {
  return /[.!?]["')\]]?\s*$/.test(line) || line.length > 90;
}

function stripNavBlocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    // find a run of short, punctuation-free lines
    let j = i;
    while (j < lines.length) {
      const t = lines[j].trim();
      if (t && t.length <= 40 && !looksLikeSentence(t)) j++;
      else break;
    }
    const runLen = j - i;
    if (runLen >= 8) {
      i = j; // drop the whole run
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out;
}

// --- pass 3: per-host affix stripping ---

function longestCommonPrefixLines(textsLines) {
  if (textsLines.length < 5) return 0;
  let n = Math.min(200, ...textsLines.map((t) => t.length));
  let common = 0;
  for (let k = 0; k < n; k++) {
    const line = textsLines[0][k];
    if (textsLines.every((t) => t[k] === line)) common = k + 1;
    else break;
  }
  return common;
}

function longestCommonSuffixLines(textsLines) {
  if (textsLines.length < 5) return 0;
  let n = Math.min(200, ...textsLines.map((t) => t.length));
  let common = 0;
  for (let k = 0; k < n; k++) {
    const line = textsLines[0][textsLines[0].length - 1 - k];
    if (textsLines.every((t) => t[t.length - 1 - k] === line)) common = k + 1;
    else break;
  }
  return common;
}

function stripYouTubeArtifacts(text) {
  return text
    .replace(/\[(music|applause|laughter|inaudible)\]/gi, '')
    .replace(/\b(\w+)( \1\b){2,}/gi, '$1') // stutter repeats e.g. "the the the"
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function applyRegexSweep(text) {
  let out = text;
  for (const re of CONSENT_PATTERNS) out = out.replace(re, '');
  return out;
}

function main() {
  const db = openDb();
  const sources = db.prepare('SELECT id, notebookId, url, sourceType, rawText FROM sources').all();
  console.log(`Cleaning ${sources.length} sources...`);

  console.log('Building cross-document line-frequency chrome set...');
  const chromeLines = buildLineFrequency(sources);
  console.log(`  ${chromeLines.size} lines flagged as chrome (appear in >=${LINE_FREQ_THRESHOLD} sources).`);

  // group by host for pass 3
  const byHost = new Map();
  for (const s of sources) {
    const h = hostOf(s.url);
    if (!h) continue;
    if (!byHost.has(h)) byHost.set(h, []);
    byHost.get(h).push(s);
  }
  const hostAffix = new Map(); // host -> {prefix, suffix}
  for (const [host, group] of byHost) {
    if (group.length < 5) continue;
    const linesPerSource = group.map((s) => (s.rawText || '').split('\n'));
    const prefix = longestCommonPrefixLines(linesPerSource);
    const suffix = longestCommonSuffixLines(linesPerSource);
    if (prefix > 2 || suffix > 2) hostAffix.set(host, { prefix, suffix });
  }
  console.log(`  Per-host affix stripping applies to ${hostAffix.size} host(s).`);

  const update = db.prepare(
    'UPDATE sources SET cleanText = ?, cleanChars = ?, excluded = ?, excludeReason = ? WHERE id = ?'
  );

  const reviewSamples = [];
  let excludedCount = 0;
  let totalRaw = 0;
  let totalClean = 0;

  db.exec('BEGIN');
  for (const s of sources) {
    const raw = s.rawText || '';
    totalRaw += raw.length;
    let text;

    if (isYouTube(s.sourceType, s.url)) {
      text = stripYouTubeArtifacts(raw);
    } else {
      let lines = raw.split('\n').filter((l) => !chromeLines.has(l.trim()));
      const host = hostOf(s.url);
      const affix = host ? hostAffix.get(host) : null;
      if (affix) {
        if (affix.prefix > 0) lines = lines.slice(affix.prefix);
        if (affix.suffix > 0) lines = lines.slice(0, Math.max(0, lines.length - affix.suffix));
      }
      lines = stripNavBlocks(lines);
      text = applyRegexSweep(lines.join('\n')).replace(/\n{3,}/g, '\n\n').trim();
    }

    totalClean += text.length;

    let excluded = 0;
    let reason = null;
    const punctCount = (text.match(/[.!?]/g) || []).length;
    const prosePunctDensity = text.length > 0 ? punctCount / (text.length / 100) : 0;
    if (text.length < MIN_KEPT_CHARS) {
      excluded = 1;
      reason = `too short after cleaning (${text.length} chars)`;
    } else if (prosePunctDensity < 0.15 && !isYouTube(s.sourceType, s.url)) {
      excluded = 1;
      reason = `low prose-punctuation density (${prosePunctDensity.toFixed(2)}/100 chars) — likely still boilerplate`;
    }
    if (excluded) excludedCount++;

    update.run(text, text.length, excluded, reason, s.id);

    if (reviewSamples.length < 20 && Math.random() < 0.005) {
      reviewSamples.push({ id: s.id, url: s.url, before: raw.slice(0, 800), after: text.slice(0, 800) });
    }
  }
  db.exec('COMMIT');

  console.log(
    `\nDone. ${(totalRaw / 1e6).toFixed(1)}M -> ${(totalClean / 1e6).toFixed(1)}M chars (${(100 * (1 - totalClean / totalRaw)).toFixed(1)}% removed). ${excludedCount} sources excluded (too short / not prose).`
  );

  const reviewText = reviewSamples
    .map(
      (r, i) =>
        `\n${'='.repeat(80)}\n[${i + 1}] ${r.id}  ${r.url || '(no url)'}\n--- BEFORE ---\n${r.before}\n--- AFTER ---\n${r.after}\n`
    )
    .join('\n');
  fs.writeFileSync(CLEAN_REVIEW_PATH, reviewText || '(no samples captured this run)');
  console.log(`Wrote ${reviewSamples.length} before/after samples to ${CLEAN_REVIEW_PATH} — please eyeball these.`);
  console.log('Next: node tools/corpus/03-chunk.mjs');
  closeDb(db);
}

main();
