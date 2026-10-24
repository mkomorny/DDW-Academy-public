#!/usr/bin/env node
// Quick CLI for testing retrieval quality.
// Usage: node tools/corpus/cli.mjs "four on the floor" --k 8 [--tracks drums,production]
import { search, stats } from './query.mjs';

function parseArgs(argv) {
  const args = { query: '', k: 8, tracks: null, notebooks: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--k') args.k = parseInt(argv[++i], 10);
    else if (a === '--tracks') args.tracks = argv[++i].split(',');
    else if (a === '--notebooks') args.notebooks = argv[++i].split(',');
    else rest.push(a);
  }
  args.query = rest.join(' ');
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.query) {
    console.log(`Usage: node tools/corpus/cli.mjs "<query>" [--k 8] [--tracks drums,production] [--notebooks "Title A,Title B"]`);
    const s = stats();
    console.log(`\nCorpus index: ${s.notebooks} notebooks, ${s.sources} sources, ${s.chunks} chunks, ${(s.chars / 1e6).toFixed(1)}M chars.`);
    process.exit(0);
  }

  const results = search(args.query, { k: args.k, tracks: args.tracks, notebooks: args.notebooks });
  console.log(`Query: "${args.query}"  (${results.length} results)\n`);
  results.forEach((r, i) => {
    console.log(`${'='.repeat(78)}`);
    console.log(`[${i + 1}] score=${r.score.toFixed(2)}  notebook="${r.notebook}"`);
    console.log(`    source: ${r.source.title || '(untitled)'}  ${r.source.url || ''}`);
    if (r.headingPath) console.log(`    heading: ${r.headingPath}`);
    console.log(`    ${r.text.slice(0, 400).replace(/\n/g, ' ')}${r.text.length > 400 ? '…' : ''}`);
  });
}

main();
