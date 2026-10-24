#!/usr/bin/env node
// Stage 1: walk the NotebookLM markdown exports (restructured 2026-08-12 from the old
// notebooklm-bulk-export*.json blobs into one .md/.txt file per source, grouped
// Category/Notebook/file), plus the small curated Grok Build Research Results folder,
// and load everything into SQLite.
//
// Notebook titles are matched against the hand-curated triage in notebooks.json by a
// normalized (emoji-stripped, punctuation-collapsed) comparison, since folder names carry
// an emoji prefix and Windows-illegal characters (":", "/") got swapped for "-" when the
// notebooks were exported to folders. Any notebook found under a relevant category that
// has no triage entry is auto-triaged (keep:true, tracks defaulted from its category) and
// appended back to notebooks.json for later human review — the category filter already
// did the hard work of excluding off-topic material (Astrology, Genealogy, AI dev docs,
// etc. live in categories this script never walks).
//
// Run: node --max-old-space-size=8192 tools/corpus/01-ingest.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { CORPUS_SOURCE_DIR, NOTEBOOKLM_EXPORTS_DIR, NOTEBOOKS_TRIAGE_PATH } from './lib/config.mjs';
import { openDb, closeDb } from './lib/db.mjs';

const RELEVANT_CATEGORIES = ['Ableton Live 12', 'Music Production', 'Music Theory', 'Launchkey'];
const CATEGORY_DEFAULT_TRACKS = {
  'Ableton Live 12': ['production'],
  'Music Production': ['production', 'drums'],
  'Music Theory': ['theory'],
  Launchkey: ['drums', 'hardware'],
};

const GROK_DIR = path.join(CORPUS_SOURCE_DIR, 'Grok Build Research Results');
const GROK_TITLE = 'Grok Build Research Results';
// Meta-instructions aimed at Claude Code, not teaching material — never ingest as corpus text.
const GROK_SKIP_FILES = new Set(['claude-code-instructions.md', 'INCORPORATE NEW MATERIAL.txt']);

const PDF_EXTRACT_PY = `
import sys
from pypdf import PdfReader
r = PdfReader(sys.argv[1])
print("\\n".join((p.extract_text() or "") for p in r.pages))
`;

function stableId(str) {
  return crypto.createHash('sha1').update(str).digest('hex').slice(0, 16);
}

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// Folder names look like "🎹 Piano Lessons - Extracted Course Text" — drop the leading
// emoji/symbol run (and its following space) to recover the notebook title.
function stripEmojiPrefix(name) {
  return name.replace(/^[^\p{L}\p{N}]+\s*/u, '').trim();
}

function cleanSourceTitle(filename) {
  return filename
    .replace(/\.(md|txt)$/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/^\d+-/, '')
    .trim();
}

function walkFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walkFiles(full));
    else if (/\.(md|txt|pdf)$/i.test(entry.name)) results.push(full);
  }
  return results.sort();
}

const SOURCE_URL_LINE = /^>\s*Source:\s*(\S+)\s*\n+/;

// Many exported .md files carry their real origin as a leading "> Source: <url>" line —
// pull it out for accurate citation/attribution and strip it from the body text.
function extractSourceUrl(text) {
  const m = text.match(SOURCE_URL_LINE);
  if (!m) return { url: null, text };
  return { url: m[1], text: text.slice(m[0].length) };
}

function readFileAsText(fullPath) {
  if (fullPath.toLowerCase().endsWith('.pdf')) {
    // Windows' console codepage (cp1252) can't encode arbitrary PDF text (bullets, etc.)
    // on the way through python's stdout — force UTF-8 there.
    return execFileSync('py', ['-c', PDF_EXTRACT_PY, fullPath], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 64,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function loadTriage() {
  const raw = JSON.parse(fs.readFileSync(NOTEBOOKS_TRIAGE_PATH, 'utf8'));
  const byNorm = new Map();
  for (const n of raw.notebooks) byNorm.set(normalizeTitle(n.title), n);
  return { raw, byNorm };
}

function ingestNotebook({ db, insertNotebook, insertSource, title, srcFile, files, triageEntry }) {
  if (!files.length) return null;
  const notebookId = stableId(title);
  let rawChars = 0;
  const rows = [];
  for (const full of files) {
    const file = path.basename(full);
    let text;
    try {
      text = readFileAsText(full);
    } catch (err) {
      console.warn(`  WARN: failed to read ${full}: ${err.message}`);
      continue;
    }
    const rel = path.relative(CORPUS_SOURCE_DIR, full).replace(/\\/g, '/');
    const { url: realUrl, text: body } = extractSourceUrl(text);
    rawChars += body.length;
    rows.push({
      id: stableId(title + '|' + rel),
      title: cleanSourceTitle(file),
      url: realUrl || `local://${rel}`,
      sourceType:
        realUrl && /youtu\.?be/.test(realUrl)
          ? 'SOURCE_TYPE_YOUTUBE_VIDEO'
          : file.toLowerCase().endsWith('.pdf')
            ? 'SOURCE_TYPE_PDF'
            : 'SOURCE_TYPE_TEXT',
      rawChars: body.length,
      rawText: body,
    });
  }
  if (!rows.length) return null;

  insertNotebook.run(
    notebookId,
    title,
    srcFile,
    JSON.stringify(triageEntry.tracks || []),
    triageEntry.weight ?? 1.0,
    rawChars,
    rows.length
  );
  for (const r of rows) {
    insertSource.run(r.id, notebookId, r.title, r.url, r.sourceType, r.rawChars, r.rawText);
  }
  return { sources: rows.length, chars: rawChars };
}

function main() {
  const { raw: triageRaw, byNorm: triage } = loadTriage();
  const db = openDb({ fresh: true });
  const insertNotebook = db.prepare(
    `INSERT INTO notebooks (id, title, srcFile, keep, tracks, weight, rawChars, sourceCount)
     VALUES (?, ?, ?, 1, ?, ?, ?, ?)`
  );
  const insertSource = db.prepare(
    `INSERT INTO sources (id, notebookId, title, url, sourceType, rawChars, rawText)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  let totalNotebooks = 0;
  let totalSources = 0;
  let totalChars = 0;
  const newlyTriaged = [];

  db.exec('BEGIN');
  try {
    for (const category of RELEVANT_CATEGORIES) {
      const categoryDir = path.join(NOTEBOOKLM_EXPORTS_DIR, category);
      if (!fs.existsSync(categoryDir)) {
        console.warn(`WARN: expected category folder missing: ${categoryDir}`);
        continue;
      }
      for (const entry of fs.readdirSync(categoryDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const notebookFolder = entry.name;
        const notebookPath = path.join(categoryDir, notebookFolder);
        const title = stripEmojiPrefix(notebookFolder);
        const norm = normalizeTitle(title);
        let triageEntry = triage.get(norm);

        if (triageEntry && triageEntry.keep === false) continue;

        if (!triageEntry) {
          triageEntry = {
            title,
            keep: true,
            tracks: CATEGORY_DEFAULT_TRACKS[category] || [],
            weight: 1.0,
            note: 'auto-triaged on corpus restructure (2026-08-12) — please review',
          };
          triage.set(norm, triageEntry);
          triageRaw.notebooks.push(triageEntry);
          newlyTriaged.push(`${category}/${notebookFolder}`);
        }

        const result = ingestNotebook({
          db,
          insertNotebook,
          insertSource,
          title,
          srcFile: `${category}/${notebookFolder}`,
          files: walkFiles(notebookPath),
          triageEntry,
        });
        if (result) {
          totalNotebooks++;
          totalSources += result.sources;
          totalChars += result.chars;
        }
      }
    }

    // Grok Build Research Results — small curated folder outside the NotebookLM tree.
    if (fs.existsSync(GROK_DIR)) {
      const norm = normalizeTitle(GROK_TITLE);
      let triageEntry = triage.get(norm);
      if (!triageEntry) {
        triageEntry = {
          title: GROK_TITLE,
          keep: true,
          tracks: ['production', 'piano', 'theory', 'sound-design'],
          weight: 1.0,
          note: 'curated Grok deep-research knowledge bases, added on corpus restructure (2026-08-12)',
        };
        triage.set(norm, triageEntry);
        triageRaw.notebooks.push(triageEntry);
        newlyTriaged.push(GROK_TITLE);
      }
      if (triageEntry.keep !== false) {
        const files = walkFiles(GROK_DIR).filter((f) => !GROK_SKIP_FILES.has(path.basename(f)));
        const result = ingestNotebook({
          db,
          insertNotebook,
          insertSource,
          title: GROK_TITLE,
          srcFile: GROK_TITLE,
          files,
          triageEntry,
        });
        if (result) {
          totalNotebooks++;
          totalSources += result.sources;
          totalChars += result.chars;
        }
      }
    }

    // User Manuals
    const MANUALS_DIR = 'B:\\\\Documents\\\\User Manuals';
    if (fs.existsSync(MANUALS_DIR)) {
      const norm = normalizeTitle('User Manuals');
      let triageEntry = triage.get(norm);
      if (!triageEntry) {
        triageEntry = {
          title: 'User Manuals',
          keep: true,
          tracks: ['production', 'hardware', 'sound-design', 'drums'],
          weight: 1.0,
          note: 'hardware and plugin manuals, added on corpus restructure',
        };
        triage.set(norm, triageEntry);
        triageRaw.notebooks.push(triageEntry);
        newlyTriaged.push('User Manuals');
      }
      if (triageEntry.keep !== false) {
        const files = walkFiles(MANUALS_DIR);
        const result = ingestNotebook({
          db,
          insertNotebook,
          insertSource,
          title: 'User Manuals',
          srcFile: 'User Manuals',
          files,
          triageEntry,
        });
        if (result) {
          totalNotebooks++;
          totalSources += result.sources;
          totalChars += result.chars;
        }
      }
    }

    // Training Docs
    const TRAINING_DIR = 'B:\\\\Documents\\\\TRAINING DOCS';
    if (fs.existsSync(TRAINING_DIR)) {
      const norm = normalizeTitle('Training Docs');
      let triageEntry = triage.get(norm);
      if (!triageEntry) {
        triageEntry = {
          title: 'Training Docs',
          keep: true,
          tracks: ['production', 'piano', 'theory', 'sound-design', 'drums', 'djing'],
          weight: 1.0,
          note: 'general training material in root, added on corpus restructure',
        };
        triage.set(norm, triageEntry);
        triageRaw.notebooks.push(triageEntry);
        newlyTriaged.push('Training Docs');
      }
      if (triageEntry.keep !== false) {
        const files = walkFiles(TRAINING_DIR).filter((f) => !f.includes('NotebookLMs - Source Exports') && !f.includes('Grok Build Research Results'));
        const result = ingestNotebook({
          db,
          insertNotebook,
          insertSource,
          title: 'Training Docs',
          srcFile: 'Training Docs',
          files,
          triageEntry,
        });
        if (result) {
          totalNotebooks++;
          totalSources += result.sources;
          totalChars += result.chars;
        }
      }
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  if (newlyTriaged.length) {
    fs.writeFileSync(NOTEBOOKS_TRIAGE_PATH, JSON.stringify(triageRaw, null, 2) + '\n');
    console.log(
      `\nAuto-triaged ${newlyTriaged.length} notebook(s) not previously in notebooks.json (added as keep:true — please review):`
    );
    for (const t of newlyTriaged) console.log(`  - ${t}`);
  }

  console.log(
    `\nIngested ${totalNotebooks} notebooks, ${totalSources} sources, ${(totalChars / 1e6).toFixed(1)}M chars into SQLite.`
  );
  console.log('Next: node tools/corpus/02-clean.mjs');
  closeDb(db);
}

main();
