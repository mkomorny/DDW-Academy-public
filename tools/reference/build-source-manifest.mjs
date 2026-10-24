#!/usr/bin/env node
/**
 * Builds tools/reference/known-sources.json — the union of every source
 * title/filename known to exist across BOTH corpora course content can cite:
 *
 *   1. content/corpus-index.json — the original extracted-PDF corpus
 *      (tools/extract_pdfs.py), which the current 173 course citations draw
 *      from ("Difference between a digital piano and a keyboard.pdf" etc).
 *   2. build/corpus/corpus.db — the NotebookLM export corpus (tools/corpus/,
 *      Phase 0c), source of truth for new content going forward.
 *
 * This is the source-whitelist gate's data: tools/validate-course.mjs checks
 * every `sources([...])` filename against this list. It catches a typo'd or
 * invented citation — it does NOT (yet) check that a specific lesson's
 * retrieval actually surfaced that passage; that provenance check belongs to
 * the Phase 4 authoring pipeline, which has per-lesson retrieval logs this
 * whole-corpus existence check doesn't.
 *
 * Run: node tools/reference/build-source-manifest.mjs
 * Rerun whenever either corpus changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const known = new Set();

// 1. original extracted-PDF corpus
const corpusIndexPath = path.join(ROOT, 'content', 'corpus-index.json');
if (fs.existsSync(corpusIndexPath)) {
  const idx = JSON.parse(fs.readFileSync(corpusIndexPath, 'utf8'));
  for (const doc of idx.documents || []) known.add(doc.source);
  console.log(`extracted-PDF corpus: ${idx.documents.length} sources`);
} else {
  console.warn('content/corpus-index.json not found — skipping that corpus');
}

// 2. NotebookLM export corpus (Phase 0c)
const dbPath = path.join(ROOT, 'build', 'corpus', 'corpus.db');
if (fs.existsSync(dbPath)) {
  const db = new DatabaseSync(dbPath);
  const rows = db.prepare('SELECT DISTINCT title FROM sources WHERE title IS NOT NULL').all();
  for (const r of rows) known.add(r.title);
  console.log(`NotebookLM export corpus: ${rows.length} distinct source titles`);
} else {
  console.warn('build/corpus/corpus.db not found — run tools/corpus/01-ingest.mjs first. Skipping that corpus.');
}

const outPath = path.join(__dirname, 'known-sources.json');
const sorted = [...known].sort();
fs.writeFileSync(outPath, JSON.stringify(sorted, null, 1));
console.log(`\nWrote ${sorted.length} known source titles to ${outPath}`);
