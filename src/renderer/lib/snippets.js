/**
 * snippets.js — lookup into src/data/snippets.json, the small, curated set
 * of corpus passages actually cited by shipped lessons (see
 * tools/corpus/README.md). Populated by Phase 4's authoring pipeline;
 * ships as `[]` until then, so every caller here must degrade gracefully
 * rather than assume content exists.
 *
 * Two consumers: the "where this came from" source expander (future), and
 * the AI depth-escape-hatch's offline grounding (views/ai-explain.js) — it
 * cites real passages instead of relying purely on model memory.
 */

let _cache = null;

async function loadAll() {
  if (_cache) return _cache;
  try {
    // Plain relative fetch, same pattern as lib/theory.js's loadScales() —
    // resolved against the document (src/renderer/index.html), not this
    // module's own location, so '../data/snippets.json' reaches src/data/.
    const res = await fetch('../data/snippets.json');
    _cache = res.ok ? await res.json() : [];
  } catch (err) {
    console.warn('snippets.json not available:', err);
    _cache = [];
  }
  return _cache;
}

/**
 * Snippets whose cited source title matches one of `sourceFiles` (the
 * filenames a lesson's `sources([...])` block names), capped at `limit`.
 * Returns [] harmlessly if snippets.json is empty/missing/malformed.
 */
export async function snippetsFor(sourceFiles = [], limit = 6) {
  if (!sourceFiles || !sourceFiles.length) return [];
  const all = await loadAll();
  if (!Array.isArray(all) || !all.length) return [];
  const wanted = new Set(sourceFiles);
  return all.filter((s) => s && wanted.has(s.source?.title)).slice(0, limit);
}
