#!/usr/bin/env node
/**
 * emit-roundtrip.mjs — the objective test that the emitter produces house
 * style: import a REAL hand-authored level, run its data through the
 * emitter, import the emitted source back, and check the result is
 * semantically identical to the original.
 *
 * Per the plan: do this BEFORE generating a single new lesson. If the
 * emitter can't faithfully round-trip content a human already approved,
 * nothing it produces for new content can be trusted either.
 *
 * Correctness bar is SEMANTIC (deep equality of the re-imported object),
 * not byte-identical text — see emit.mjs's file header for why matching
 * hand-picked line wraps isn't a meaningful target for a pretty-printer.
 *
 * Run: node tools/author/emit-roundtrip.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitLevel } from './lib/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const PIANO_DIR = path.join(ROOT, 'src', 'renderer', 'course', 'piano');
const OUT_DIR = path.join(__dirname, 'out', 'roundtrip');
const SCHEMA_URL = path.relative(OUT_DIR, path.join(ROOT, 'src', 'renderer', 'course', 'schema.js')).split(path.sep).join('/');

/* Discovered at runtime rather than hardcoded: the course-material rebuild
 * (2026-08-16) replaced the original level0.js…level7.js with a new
 * level01.js…level16.js scheme built one section batch at a time, so a
 * fixed list would either miss new files or throw ENOENT on deleted ones
 * mid-rebuild. Sorted by the numeric part so level10 doesn't sort before
 * level2 regardless of zero-padding. */
const LEVEL_FILES = fs.readdirSync(PIANO_DIR)
  .filter((f) => /^level\d+\.js$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const FACTORY_NAMES = [
  'level', 'module_', 'lesson', 'step', 'prose', 'heading', 'callout', 'list', 'table',
  'keyboard', 'staff', 'scaleExplorer', 'chordExplorer', 'circleOfFifths', 'intervalDemo',
  'rhythm', 'tryIt', 'progression', 'sources', 'gap', 'depth', 'drumGrid', 'padMap', 'arrangement', 'diagram',
  'mcq', 'multi', 'text', 'play', 'ear', 'order', 'eitherMode',
];

function diffDeep(a, b, p = '$') {
  const diffs = [];
  if (a === b) return diffs;
  if (typeof a !== typeof b) { diffs.push(`${p}: type ${typeof a} vs ${typeof b}`); return diffs; }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) { diffs.push(`${p}: array vs non-array`); return diffs; }
    if (a.length !== b.length) { diffs.push(`${p}: length ${a.length} vs ${b.length}`); return diffs; }
    a.forEach((x, i) => diffs.push(...diffDeep(x, b[i], `${p}[${i}]`)));
    return diffs;
  }
  if (a && b && typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a)) { diffs.push(`${p}.${k}: missing in emitted`); continue; }
      if (!(k in b)) { diffs.push(`${p}.${k}: extra in emitted`); continue; }
      diffs.push(...diffDeep(a[k], b[k], `${p}.${k}`));
    }
    return diffs;
  }
  diffs.push(`${p}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  return diffs;
}

async function roundtripOne(file) {
  const src = path.join(PIANO_DIR, file);
  const original = (await import(new URL(`file://${src.replace(/\\/g, '/')}`))).default;

  const body = emitLevel(original);
  const emittedSource = `import {\n  ${FACTORY_NAMES.join(', ')},\n} from '${SCHEMA_URL}';\n\nexport default ${body};\n`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, file.replace('.js', '.emitted.mjs'));
  fs.writeFileSync(outFile, emittedSource, 'utf8');

  let reimported;
  try {
    reimported = (await import(`file://${outFile.replace(/\\/g, '/')}?t=${Date.now()}`)).default;
  } catch (err) {
    return { file, ok: false, parseError: err.message, diffs: [] };
  }

  const diffs = diffDeep(original, reimported);
  return { file, ok: diffs.length === 0, diffs, emittedChars: emittedSource.length };
}

async function main() {
  if (!LEVEL_FILES.length) {
    console.log('No level*.js files in src/renderer/course/piano/ — nothing to round-trip yet.');
    console.log('Expected right after old course content is removed and before the new levels are scaffolded; not an emitter defect.');
    process.exit(0);
  }

  console.log(`Round-tripping all ${LEVEL_FILES.length} piano level file(s) through the emitter...\n`);
  let allOk = true;
  for (const file of LEVEL_FILES) {
    const r = await roundtripOne(file);
    if (r.parseError) {
      allOk = false;
      console.log(`✗ ${r.file} — emitted source failed to import: ${r.parseError}`);
      continue;
    }
    if (r.ok) {
      console.log(`✓ ${r.file} — semantically identical (${r.emittedChars.toLocaleString()} chars emitted)`);
    } else {
      allOk = false;
      console.log(`✗ ${r.file} — ${r.diffs.length} difference(s):`);
      for (const d of r.diffs.slice(0, 20)) console.log(`    ${d}`);
      if (r.diffs.length > 20) console.log(`    … and ${r.diffs.length - 20} more`);
    }
  }
  console.log(`\nEmitted files written to ${OUT_DIR} for manual style comparison.`);
  console.log(allOk ? `\n✓ roundtrip PASSED on all ${LEVEL_FILES.length} level(s) — emitter is safe to use for new content` : '\n✗ roundtrip FAILED — fix emit.mjs before generating anything');
  process.exit(allOk ? 0 : 1);
}

main();
