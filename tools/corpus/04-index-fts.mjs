#!/usr/bin/env node
// Stage 4: (re)build and optimize the FTS5 index from the `chunks` table.
// Idempotent — safe to re-run any time after 03-chunk.mjs without re-chunking.
// (03-chunk.mjs already populates chunks_fts as its last step; this script exists
// as a standalone rebuild/optimize path, e.g. after only re-tuning retrieval.)
//
// KNOWN ISSUE (2026-08-12): on this machine, opening a fresh process against a
// freshly-built corpus.db and running DELETE FROM chunks_fts here reproducibly throws
// "database disk image is malformed" — reproduced 3x across full rebuilds, including with
// PRAGMA synchronous=NORMAL and an explicit WAL checkpoint+close in 03. The chunks_fts
// data 03-chunk.mjs wrote is NOT actually corrupt (query.mjs/cli.mjs read and MATCH
// against it fine from a separate process) — this looks like a node:sqlite / FTS5
// external-content quirk specific to the delete-and-reinsert-and-optimize sequence, not a
// real durability problem. Until root-caused, treat this script as unreliable and rely on
// 03-chunk.mjs's own indexing instead of re-running this after every ingest.
import { openDb, closeDb } from './lib/db.mjs';

function main() {
  const db = openDb();
  const before = db.prepare('SELECT count(*) n FROM chunks_fts').get().n;

  db.exec('DELETE FROM chunks_fts;');
  db.exec(`
    INSERT INTO chunks_fts(rowid, text, headingPath)
    SELECT id, text, COALESCE(headingPath, '') FROM chunks WHERE dropped = 0;
  `);
  db.exec(`INSERT INTO chunks_fts(chunks_fts) VALUES('optimize');`);

  const after = db.prepare('SELECT count(*) n FROM chunks_fts').get().n;
  console.log(`FTS5 index rebuilt: ${before} -> ${after} indexed chunks.`);
  closeDb(db);
}

main();
