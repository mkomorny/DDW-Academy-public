#!/usr/bin/env node
// Stage 3: split cleanText into heading-aware chunks (~1400 chars, 200 overlap,
// never mid-sentence), then remove near-duplicate chunks via SimHash.
//
// Run: node --max-old-space-size=8192 tools/corpus/03-chunk.mjs
import { openDb, closeDb } from './lib/db.mjs';

const TARGET_CHARS = 1400;
const OVERLAP_CHARS = 200;
const SIMHASH_HAMMING_THRESHOLD = 3;

function looksLikeHeading(line) {
  const t = line.trim();
  if (!t || t.length > 80) return false;
  if (/[.!?,;:]$/.test(t)) return false; // headings don't end mid-sentence
  const words = t.split(/\s+/);
  const titleCaseish = words.filter((w) => /^[A-Z0-9]/.test(w)).length / Math.max(1, words.length);
  const allCaps = t === t.toUpperCase() && /[A-Z]/.test(t);
  return allCaps || titleCaseish > 0.6;
}

// Split into sentence-safe boundaries; we chunk on paragraphs first, falling back to
// sentence splitting only when a paragraph alone exceeds TARGET_CHARS.
function splitIntoUnits(text) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const units = []; // { text, heading: boolean }
  for (const p of paras) {
    if (looksLikeHeading(p) && p.split('\n').length === 1) {
      units.push({ text: p, heading: true });
      continue;
    }
    if (p.length <= TARGET_CHARS * 1.4) {
      units.push({ text: p, heading: false });
    } else {
      // paragraph too big — split on sentence boundaries
      const sentences = p.match(/[^.!?]+[.!?]+(\s+|$)/g) || [p];
      let buf = '';
      for (const s of sentences) {
        if (buf.length + s.length > TARGET_CHARS && buf) {
          units.push({ text: buf.trim(), heading: false });
          buf = s;
        } else {
          buf += s;
        }
      }
      if (buf.trim()) units.push({ text: buf.trim(), heading: false });
    }
  }
  return units;
}

function packUnits(units) {
  const chunks = []; // { text, headingPath }
  let currentHeading = null;
  let buf = [];
  let bufChars = 0;

  function flush() {
    if (buf.length) {
      chunks.push({ text: buf.join('\n\n'), headingPath: currentHeading });
    }
    buf = [];
    bufChars = 0;
  }

  for (const u of units) {
    if (u.heading) {
      flush();
      currentHeading = u.text;
      continue;
    }
    if (bufChars + u.text.length > TARGET_CHARS && buf.length) {
      flush();
      // carry a small overlap from the tail of the previous chunk
      const prevText = chunks[chunks.length - 1]?.text || '';
      const tail = prevText.slice(-OVERLAP_CHARS);
      if (tail) {
        buf.push('…' + tail);
        bufChars += tail.length;
      }
    }
    buf.push(u.text);
    bufChars += u.text.length;
  }
  flush();
  return chunks.filter((c) => c.text.length >= 80); // drop scraps
}

// --- 64-bit SimHash for near-dup detection ---

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter((w) => w.length > 2);
}

function hash32(str) {
  // FNV-1a, good enough for SimHash feature hashing (not cryptographic)
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function simhash64(text) {
  const tokens = tokenize(text);
  const bitCounts = new Array(64).fill(0);
  for (const tok of tokens) {
    const h1 = hash32(tok);
    const h2 = hash32(tok + ''); // second 32 bits via salted hash
    for (let b = 0; b < 32; b++) {
      const bit = (h1 >>> b) & 1;
      bitCounts[b] += bit ? 1 : -1;
    }
    for (let b = 0; b < 32; b++) {
      const bit = (h2 >>> b) & 1;
      bitCounts[32 + b] += bit ? 1 : -1;
    }
  }
  let hashHex = '';
  let word = 0n;
  for (let b = 0; b < 64; b++) {
    if (bitCounts[b] > 0) word |= 1n << BigInt(b);
  }
  hashHex = word.toString(16).padStart(16, '0');
  return hashHex;
}

function hammingDistanceHex(aHex, bHex) {
  let a = BigInt('0x' + aHex);
  let b = BigInt('0x' + bHex);
  let x = a ^ b;
  let dist = 0;
  while (x) {
    dist += Number(x & 1n);
    x >>= 1n;
  }
  return dist;
}

function main() {
  const db = openDb();
  db.exec('DELETE FROM chunks;'); // idempotent re-run
  db.exec("DELETE FROM chunks_fts;");

  const sources = db
    .prepare(
      `SELECT s.id, s.notebookId, s.cleanText, n.weight
       FROM sources s JOIN notebooks n ON n.id = s.notebookId
       WHERE s.excluded = 0`
    )
    .all();
  console.log(`Chunking ${sources.length} sources...`);

  const insertChunk = db.prepare(
    `INSERT INTO chunks (sourceId, notebookId, ord, text, chars, headingPath, simhash)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  let totalChunks = 0;
  db.exec('BEGIN');
  for (const s of sources) {
    const units = splitIntoUnits(s.cleanText || '');
    const chunks = packUnits(units);
    chunks.forEach((c, ord) => {
      const sh = simhash64(c.text);
      insertChunk.run(s.id, s.notebookId, ord, c.text, c.text.length, c.headingPath, sh);
      totalChunks++;
    });
  }
  db.exec('COMMIT');
  console.log(`Created ${totalChunks} chunks.`);

  // --- near-dup removal via SimHash banding ---
  console.log('Removing near-duplicate chunks (SimHash, Hamming <= ' + SIMHASH_HAMMING_THRESHOLD + ')...');
  const rows = db
    .prepare(
      `SELECT c.id, c.simhash, n.weight, c.chars
       FROM chunks c JOIN notebooks n ON n.id = c.notebookId
       ORDER BY n.weight DESC, c.chars DESC`
    )
    .all(); // higher-weight, longer chunks processed first and preferentially kept

  // band into 4x16-bit buckets for candidate lookup instead of O(n^2).
  // keptHash is an id->simhash Map so candidate lookup is O(1), not a linear scan.
  const bands = [new Map(), new Map(), new Map(), new Map()];
  const keptHash = new Map();
  const dropUpdate = db.prepare('UPDATE chunks SET dropped = 1, dropReason = ? WHERE id = ?');

  db.exec('BEGIN');
  let droppedCount = 0;
  let processed = 0;
  for (const row of rows) {
    const hex = row.simhash;
    const bandKeys = [hex.slice(0, 4), hex.slice(4, 8), hex.slice(8, 12), hex.slice(12, 16)];
    let isDup = false;
    const seenCandidates = new Set();
    for (let b = 0; b < 4 && !isDup; b++) {
      const candidates = bands[b].get(bandKeys[b]);
      if (!candidates) continue;
      for (const candId of candidates) {
        if (seenCandidates.has(candId)) continue;
        seenCandidates.add(candId);
        const candHex = keptHash.get(candId);
        if (!candHex) continue;
        if (hammingDistanceHex(hex, candHex) <= SIMHASH_HAMMING_THRESHOLD) {
          isDup = true;
          break;
        }
      }
    }
    if (isDup) {
      dropUpdate.run('near-duplicate of a higher-weight/longer chunk', row.id);
      droppedCount++;
    } else {
      keptHash.set(row.id, hex);
      for (let b = 0; b < 4; b++) {
        if (!bands[b].has(bandKeys[b])) bands[b].set(bandKeys[b], []);
        bands[b].get(bandKeys[b]).push(row.id);
      }
    }
    processed++;
    if (processed % 20000 === 0) console.log(`  ...${processed}/${rows.length} chunks compared`);
  }
  db.exec('COMMIT');

  console.log(
    `Dropped ${droppedCount} near-duplicate chunks (${((droppedCount / totalChunks) * 100).toFixed(1)}%). ${totalChunks - droppedCount} chunks remain.`
  );

  // populate FTS index from surviving chunks
  console.log('Populating FTS5 index...');
  db.exec(`
    INSERT INTO chunks_fts(rowid, text, headingPath)
    SELECT id, text, COALESCE(headingPath, '') FROM chunks WHERE dropped = 0;
  `);
  console.log('Done. Next: node tools/corpus/query.mjs / cli.mjs to test retrieval.');
  closeDb(db);
}

main();
