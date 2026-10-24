/**
 * resolve-citation.mjs — turns one of Miranda's absolute-path citations
 * (e.g. `` `B:\Documents\TRAINING DOCS\Music Production\Music Theory\How to
 * label piano keys for beginners.pdf` ``) into the bare title
 * `sources()` and the validator's whitelist (`tools/reference/known-sources.json`)
 * actually require. Never fuzzy-matches — every resolution here is either an
 * exact string match against the whitelist or a hand-verified synonym in
 * MANUAL_OVERRIDES below. Anything else is reported as unresolved for a
 * human to look at, never silently guessed or dropped.
 *
 * Resolution order, cheapest/most-certain first:
 *   1. exact basename            "Foo.pdf"        in whitelist as-is
 *   2. basename minus extension  "Foo"             in whitelist (NotebookLM
 *                                                   source titles usually
 *                                                   carry no extension)
 *   3. manual override table     hand-verified synonyms for citations whose
 *                                wording drifted from the corpus's own title
 *                                (apostrophe/dash variants, a stray numeric
 *                                prefix, etc) — add an entry here, never edit
 *                                known-sources.json by hand: that file is
 *                                regenerated from the real corpus by
 *                                tools/reference/build-source-manifest.mjs,
 *                                so a hand-added string would just be a lie
 *                                that vanishes on the next regen.
 *
 * A citation whose path has no filename at all (ends in a path separator —
 * Miranda cited a folder, not a file) is reported separately: it needs a
 * real filename from her before that section can ship, not a resolution.
 */

import fs from 'node:fs';
import path from 'node:path';

const WHITELIST_PATH = path.join(import.meta.dirname, '..', 'reference', 'known-sources.json');

/**
 * Hand-verified synonyms: citation basename (as it literally appears in
 * Miranda's markdown, with extension) -> the exact whitelist title to emit
 * instead. Every entry here was confirmed to be the same source document
 * under a different spelling, not a guess.
 */
const MANUAL_OVERRIDES = {
  // Piano Section — the corpus/whitelist title has no leading "5-" (that
  // numeral belongs to the source folder's own filing scheme, not the
  // document's title) and no extension.
  '5-Easy Chord Theory - Diatonic Chords of Major Keys.md': 'Easy Chord Theory - Diatonic Chords of Major Keys',
};

let _whitelist = null;
function whitelist() {
  if (!_whitelist) {
    _whitelist = new Set(JSON.parse(fs.readFileSync(WHITELIST_PATH, 'utf8')));
  }
  return _whitelist;
}

/**
 * @param {string} citedPath  the raw text inside the backticks, e.g.
 *   `B:\Documents\TRAINING DOCS\Music Production\Music Theory\Foo.pdf`
 * @returns {{ok:true, title:string, via:'basename'|'stem'|'override'} |
 *           {ok:false, reason:'no-filename'|'unresolved', basename:string}}
 */
export function resolveCitation(citedPath) {
  const known = whitelist();
  const base = citedPath.split(/[\\/]/).pop() ?? '';

  if (!base) return { ok: false, reason: 'no-filename', basename: base };

  if (known.has(base)) return { ok: true, title: base, via: 'basename' };

  const stem = base.replace(/\.(pdf|md|txt)$/i, '');
  if (known.has(stem)) return { ok: true, title: stem, via: 'stem' };

  if (MANUAL_OVERRIDES[base]) {
    const title = MANUAL_OVERRIDES[base];
    if (!known.has(title)) {
      // The override table itself has drifted from the whitelist — fail
      // loudly rather than emit a citation that will fail validate-course.
      throw new Error(`resolve-citation: override target "${title}" for "${base}" is not in known-sources.json — override is stale`);
    }
    return { ok: true, title, via: 'override' };
  }

  return { ok: false, reason: 'unresolved', basename: base };
}

/**
 * Extract every `` `B:\...` `` citation in a markdown string and resolve
 * each. Returns { titles, problems } where titles is de-duplicated and
 * sorted (ready to hand straight to schema.js's sources()), and problems
 * lists anything that couldn't be resolved (basename + reason) for the
 * author to fix or flag before shipping that section.
 */
export function resolveCitationsInText(text) {
  const re = /`(B:\\[^`]+)`/g;
  const titles = new Set();
  const problems = [];
  for (const m of text.matchAll(re)) {
    const res = resolveCitation(m[1]);
    if (res.ok) titles.add(res.title);
    else problems.push({ raw: m[1], ...res });
  }
  return { titles: [...titles].sort((a, b) => a.localeCompare(b)), problems };
}
