/**
 * retrieve.mjs — thin wrapper over tools/corpus/query.mjs for a lesson spec's
 * multi-query retrieval: run every query in spec.queries, merge and dedupe
 * by chunkId, keep the diversity cap query.mjs already applies per-call, and
 * cap the combined set so a drafting prompt doesn't balloon.
 */
import { search } from '../../corpus/query.mjs';

/**
 * @param {string[]} queries
 * @param {object} opts passed through to corpus query.mjs's search() (tracks, notebooks, k, ...)
 * @param {number} [totalCap=24]
 */
export function retrieveForSpec(queries, opts = {}, totalCap = 24) {
  const seen = new Map(); // chunkId -> passage
  for (const q of queries) {
    for (const r of search(q, { k: 10, ...opts })) {
      if (!seen.has(r.chunkId)) seen.set(r.chunkId, r);
    }
  }
  return [...seen.values()].sort((a, b) => b.score - a.score).slice(0, totalCap);
}

/**
 * Numbered, source-attributed text block for a drafting prompt.
 * Only the bare source title is shown — never the local:// file path. An
 * earlier version showed both in "(title, url)" and the model would grab
 * the url's basename (e.g. "16-EDM Production and Workflow Guide.pdf.md")
 * for its "sources" citation instead of the title. known-sources.json
 * whitelists titles, not path basenames, so every one of those citations
 * failed the source check even though the underlying source was real.
 */
export function formatPassagesForPrompt(passages) {
  return passages
    .map((p, i) => `[${i + 1}] SOURCE TITLE: "${p.source.title || 'untitled'}"\n${p.text}`)
    .join('\n\n');
}
