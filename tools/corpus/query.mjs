#!/usr/bin/env node
// Retrieval API used by the authoring pipeline (tools/author/).
//
// search(query, opts) -> [{ chunkId, text, score, headingPath, source:{title,url,sourceType}, notebook }]
//
// BM25-only for now (see plan Phase 0c) — cheap, needs no API key, and for a
// human-reviewed build-time pipeline it's very likely sufficient. Add an
// embedding-rerank stage only if the Phase 5 pilot shows grounding gaps.
import { openDb } from './lib/db.mjs';

let _db = null;
function db() {
  if (!_db) _db = openDb();
  return _db;
}

function escapeFtsQuery(q) {
  // Quote each token so punctuation/hyphens in the query don't break MATCH syntax,
  // then OR them together with a couple of the top phrases boosted via AND groups.
  const terms = (q.match(/[a-z0-9']+/gi) || []).filter(Boolean);
  if (!terms.length) return null;
  return terms.map((t) => `"${t.replace(/"/g, '')}"`).join(' OR ');
}

/**
 * @param {string} query
 * @param {object} opts
 * @param {number} [opts.k=12] max results returned
 * @param {string[]} [opts.tracks] restrict to notebooks tagged with any of these tracks
 * @param {string[]} [opts.notebooks] restrict to these notebook titles
 * @param {string[]} [opts.sourceTypes] restrict to these sourceType values
 * @param {number} [opts.maxPerSource=2] diversity cap per source
 * @param {number} [opts.maxPerNotebook=4] diversity cap per notebook
 */
export function search(query, opts = {}) {
  const {
    k = 12,
    tracks = null,
    notebooks = null,
    sourceTypes = null,
    maxPerSource = 2,
    maxPerNotebook = 4,
  } = opts;

  const ftsQuery = escapeFtsQuery(query);
  if (!ftsQuery) return [];

  const d = db();
  const rows = d
    .prepare(
      `SELECT c.id as chunkId, c.text, c.headingPath, c.notebookId, c.sourceId,
              bm25(chunks_fts) as bm25score,
              n.title as notebookTitle, n.tracks as notebookTracks, n.weight as notebookWeight,
              s.title as sourceTitle, s.url as sourceUrl, s.sourceType
       FROM chunks_fts
       JOIN chunks c ON c.id = chunks_fts.rowid
       JOIN notebooks n ON n.id = c.notebookId
       JOIN sources s ON s.id = c.sourceId
       WHERE chunks_fts MATCH ? AND c.dropped = 0
       ORDER BY bm25score
       LIMIT 300`
    )
    .all(ftsQuery);

  let filtered = rows;
  if (tracks && tracks.length) {
    filtered = filtered.filter((r) => {
      const t = JSON.parse(r.notebookTracks || '[]');
      return tracks.some((want) => t.includes(want));
    });
  }
  if (notebooks && notebooks.length) {
    filtered = filtered.filter((r) => notebooks.includes(r.notebookTitle));
  }
  if (sourceTypes && sourceTypes.length) {
    filtered = filtered.filter((r) => sourceTypes.includes(r.sourceType));
  }

  // bm25() in SQLite returns *lower is better*; fold in notebook weight (higher is better).
  const scored = filtered.map((r) => ({
    ...r,
    score: -r.bm25score * (r.notebookWeight || 1.0),
  }));
  scored.sort((a, b) => b.score - a.score);

  // diversity cap: max N per source, M per notebook
  const perSource = new Map();
  const perNotebook = new Map();
  const out = [];
  for (const r of scored) {
    const sCount = perSource.get(r.sourceId) || 0;
    const nCount = perNotebook.get(r.notebookId) || 0;
    if (sCount >= maxPerSource || nCount >= maxPerNotebook) continue;
    perSource.set(r.sourceId, sCount + 1);
    perNotebook.set(r.notebookId, nCount + 1);
    out.push({
      chunkId: r.chunkId,
      text: r.text,
      score: r.score,
      headingPath: r.headingPath,
      source: { title: r.sourceTitle, url: r.sourceUrl, sourceType: r.sourceType },
      notebook: r.notebookTitle,
    });
    if (out.length >= k) break;
  }
  return out;
}

export function stats() {
  const d = db();
  const notebooks = d.prepare('SELECT count(*) n FROM notebooks').get().n;
  const sources = d.prepare('SELECT count(*) n FROM sources WHERE excluded = 0').get().n;
  const chunks = d.prepare('SELECT count(*) n FROM chunks WHERE dropped = 0').get().n;
  const chars = d.prepare('SELECT sum(chars) n FROM chunks WHERE dropped = 0').get().n;
  return { notebooks, sources, chunks, chars };
}
