// Thin wrapper around node:sqlite (built into Node 22.5+/24.x — no npm dependency).
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { DB_PATH, BUILD_DIR } from './config.mjs';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS notebooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  srcFile TEXT,
  keep INTEGER NOT NULL DEFAULT 1,
  tracks TEXT NOT NULL DEFAULT '[]',
  weight REAL NOT NULL DEFAULT 1.0,
  rawChars INTEGER NOT NULL DEFAULT 0,
  sourceCount INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  notebookId TEXT NOT NULL REFERENCES notebooks(id),
  title TEXT,
  url TEXT,
  sourceType TEXT,
  rawChars INTEGER NOT NULL DEFAULT 0,
  cleanChars INTEGER NOT NULL DEFAULT 0,
  rawText TEXT,
  cleanText TEXT,
  excluded INTEGER NOT NULL DEFAULT 0,
  excludeReason TEXT
);
CREATE INDEX IF NOT EXISTS idx_sources_notebook ON sources(notebookId);

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceId TEXT NOT NULL REFERENCES sources(id),
  notebookId TEXT NOT NULL REFERENCES notebooks(id),
  ord INTEGER NOT NULL,
  text TEXT NOT NULL,
  chars INTEGER NOT NULL,
  headingPath TEXT,
  simhash TEXT,
  dropped INTEGER NOT NULL DEFAULT 0,
  dropReason TEXT
);
CREATE INDEX IF NOT EXISTS idx_chunks_source ON chunks(sourceId);
CREATE INDEX IF NOT EXISTS idx_chunks_notebook ON chunks(notebookId);
CREATE INDEX IF NOT EXISTS idx_chunks_simhash ON chunks(simhash);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  text, headingPath,
  content='chunks', content_rowid='id',
  tokenize='porter unicode61 remove_diacritics 2'
);
`;

export function openDb({ fresh = false } = {}) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  if (fresh) {
    // Drop WAL/SHM sidecars too — a stale one left over from an earlier run can make
    // the *new* main file read as corrupt the moment SQLite tries to replay it.
    for (const p of [DB_PATH, DB_PATH + '-wal', DB_PATH + '-shm']) {
      if (fs.existsSync(p)) fs.rmSync(p);
    }
  }
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  // NORMAL, not OFF: with WAL, NORMAL still skips most fsyncs (fast bulk-load) but SQLite
  // guarantees the file stays structurally valid; OFF does not and reliably corrupted the
  // 300k+-row FTS5 write in this pipeline.
  db.exec('PRAGMA synchronous = NORMAL;');
  db.exec('PRAGMA foreign_keys = OFF;'); // bulk-load friendly; nothing here needs cascade behavior
  db.exec(SCHEMA);
  return db;
}

export function dbPathExists() {
  return fs.existsSync(DB_PATH);
}

// synchronous=OFF (bulk-load friendly) means an unflushed WAL can leave the file in a
// state the next `new DatabaseSync()` reads as corrupt if the process just exits — always
// checkpoint the WAL back into the main file and close explicitly before exiting.
export function closeDb(db) {
  db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  db.close();
}
