# Corpus pipeline

Build-time only — nothing here ships in the Electron app. Turns the 302M-char
NotebookLM export library into a queryable, source-attributed retrieval index
for the course-authoring pipeline (`tools/author/`, Phase 4).

## Pipeline

```
node --max-old-space-size=8192 tools/corpus/01-ingest.mjs   # bulk exports -> SQLite
node --max-old-space-size=8192 tools/corpus/02-clean.mjs    # strip scrape boilerplate
node --max-old-space-size=8192 tools/corpus/03-chunk.mjs    # chunk + SimHash near-dup removal
node tools/corpus/04-index-fts.mjs                          # rebuild/optimize FTS5 (optional — 03 already populates it)
```

Output: `build/corpus/corpus.db` (gitignored, ~200MB+). Rerun from `01-ingest.mjs`
any time `notebooks.json` triage changes or the source exports are refreshed —
every stage is idempotent (`DELETE`s its own output before re-inserting).

## Current numbers (last run)

- 41 of 59 notebooks kept (see `notebooks.json` for the triage — the 18 dropped
  are AI-provider dev docs and one unrelated web-dev-stack notebook, not music)
- 236.8M raw chars -> 231.4M after cleaning -> 76,766 surviving chunks after
  51.6% near-duplicate removal (heavier than expected — several notebooks scrape
  the same sites)

## Retrieval

```js
import { search } from './query.mjs';
const results = search('four on the floor kick pattern', { k: 8, tracks: ['drums'] });
```

Or from the shell:

```bash
node tools/corpus/cli.mjs "four on the floor kick pattern" --k 8 --tracks drums,production
```

BM25-only (SQLite FTS5, `porter` tokenizer) — no API key needed, $0 cost. This
is a deliberate downgrade from the original design brief's hybrid BM25+embedding
plan: for a build-time, human-reviewed authoring pipeline, lexical search is
very likely good enough. Add a Gemini-embedding rerank stage (fused via
Reciprocal Rank Fusion) only if the Phase 5 pilot lesson shows retrieval isn't
surfacing the right passages.

Results carry a diversity cap (max 2 chunks per source, 4 per notebook by
default) so a single well-optimized blog post can't dominate every result set.

## What ships

Nothing, yet. `tools/author/` (Phase 4) will add an `export-app-snippets.mjs`
that pulls only the passages actually cited by shipped lessons into
`src/data/snippets.json` (target: ~1.2MB) — that file is the only piece of this
corpus that ever reaches the packaged app, powering the "where this came from"
source expander and the offline half of the AI depth-escape-hatch grounding.

## Files

| File | Stage |
|---|---|
| `notebooks.json` | Hand-curated triage — which notebooks to keep, per-track tags, weights |
| `01-ingest.mjs` | Dedup 9 bulk exports by notebook title, load into SQLite |
| `02-clean.mjs` | Cross-document line-frequency boilerplate filter, nav-block detection, per-host affix stripping, consent-banner regex sweep |
| `03-chunk.mjs` | Heading-aware chunking (~1400 chars, 200 overlap) + 64-bit SimHash near-dup removal + FTS5 population |
| `04-index-fts.mjs` | Standalone FTS5 rebuild/optimize (usually unnecessary — 03 already does this) |
| `query.mjs` | `search()` / `stats()` — the retrieval API used by `tools/author/` |
| `cli.mjs` | `node tools/corpus/cli.mjs "<query>"` for manually testing retrieval quality |
| `lib/config.mjs` | Shared paths (source dir, DB path — override `CORPUS_SOURCE_DIR` env var if run on a different machine) |
| `lib/db.mjs` | SQLite schema + connection helper (`node:sqlite`, zero npm dependencies) |
