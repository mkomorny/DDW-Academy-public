/**
 * Sanity checks for the instrument manifest. Run: node tools/test-instruments.mjs
 *
 * Kills the "dropdown entry that silently doesn't play" class of bug: every
 * check here is something that would otherwise only surface as a dead key,
 * a jarring volume jump, or a limiter-pumping chord — discovered by a user,
 * not by a build. instruments.js has no DOM dependency so it (and
 * note-utils.js) import cleanly under plain Node, same as theory.js.
 */
import { existsSync, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INSTRUMENTS, instrumentGroups, fileFor, STRETCH, DEFAULT_INSTRUMENT } from '../src/renderer/lib/instruments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_DIR = path.join(__dirname, '../src/renderer/samples');
const SAMPLE_MAKEUP = 8.5;      // must match audio.js's SAMPLE_MAKEUP
const SAFE_PEAK_LINEAR = 4.0;   // must match the cap audio.js/calibrate-gains.mjs enforce
// Real measured gains (tools/calibrate-gains.mjs) landed lower than a
// pre-measurement guess would suggest — winds/brass in particular, whose
// tonejs recordings run much hotter than the piano's deliberately-quiet
// Salamander reference. This floor is a sanity net against a genuinely
// broken value (0, undefined, negative), not a taste judgement.
const GAIN_RANGE = [0.02, 1.05];

let pass = 0;
let fail = 0;
const ok = (label, cond, detail = '') => {
  if (cond) { pass++; } else { fail++; console.log(`FAIL ${label}${detail ? '  — ' + detail : ''}`); }
};

/* ------------------------------------------------------------- manifest -- */

ok('at least the piano loaded', INSTRUMENTS.some((i) => i.id === DEFAULT_INSTRUMENT));
ok('default instrument is pinned', INSTRUMENTS.find((i) => i.id === DEFAULT_INSTRUMENT)?.pinned === true);

for (const inst of INSTRUMENTS) {
  const label = `[${inst.id}]`;

  ok(`${label} has at least one root`, inst.roots.length > 0);

  const midis = inst.roots.map((r) => r.midi);
  const ascending = midis.every((m, i) => i === 0 || m > midis[i - 1]);
  ok(`${label} roots strictly ascending, no duplicates`, ascending, JSON.stringify(midis));

  const maxGap = Math.max(0, ...midis.slice(1).map((m, i) => m - midis[i]));
  // Generous sanity bound, not a tuning target. The worst case in the
  // shipped set is french-horn's C4-D5 gap (14 semitones) — a genuine hole
  // in the upstream sample set, not a thinning artifact (that folder's 10
  // files are ALL kept; see tools/fetch_instruments.mjs's output). Even at
  // 14, worst-case stretch from the nearest root is 7 semitones, which
  // audio.js's rate clamp (0.35-2.85x, ~±16.7 semitones) still plays —
  // just with more audible pitch-shift character right at that seam.
  ok(`${label} no gap so large a note would need extreme pitch-shift`, maxGap <= 14, `max gap ${maxGap} semitones`);

  ok(`${label} range matches roots ± STRETCH`,
    inst.range.lo === midis[0] - STRETCH && inst.range.hi === midis[midis.length - 1] + STRETCH,
    JSON.stringify(inst.range));

  ok(`${label} gain in sane range`, inst.gain >= GAIN_RANGE[0] && inst.gain <= GAIN_RANGE[1], `gain ${inst.gain}`);

  ok(`${label} pinned only for the default instrument`,
    inst.id === DEFAULT_INSTRUMENT ? inst.pinned === true : inst.pinned === false);
}

/* ---------------------------------------------------------- group/order -- */

const groups = instrumentGroups();
ok('every group non-empty', groups.every((g) => g.items.length > 0));
for (const g of groups) {
  const orders = g.items.map((i) => i.order);
  ok(`[${g.group}] order values unique`, new Set(orders).size === orders.length, JSON.stringify(orders));
}

/* --------------------------------------------- manifest <-> disk, both ways */

for (const inst of INSTRUMENTS) {
  const dir = path.join(SAMPLES_DIR, inst.folder);
  const expected = new Set();
  for (const root of inst.roots) {
    for (const layer of inst.layers || [null]) {
      expected.add(fileFor(inst, root.name, layer));
    }
  }

  let onDisk = [];
  try {
    onDisk = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.ogg'));
  } catch {
    ok(`[${inst.id}] sample folder exists`, false, dir);
    continue;
  }

  const missing = [...expected].filter((f) => !existsSync(path.join(dir, f)));
  ok(`[${inst.id}] every manifest file exists on disk`, missing.length === 0, missing.join(', '));

  const orphaned = onDisk.filter((f) => !expected.has(f));
  ok(`[${inst.id}] no orphaned .ogg files the manifest doesn't reference`, orphaned.length === 0, orphaned.join(', '));
}

/* ------------------------------------------------------- limiter safety -- */

let calibration = null;
try {
  calibration = JSON.parse(await readFile(path.join(__dirname, 'gain-calibration.json'), 'utf8'));
} catch {
  console.log('  (skipping limiter-safety check — run tools/calibrate-gains.mjs first for peak data)');
}
if (calibration) {
  const byFolder = new Map(calibration.instruments.map((r) => [r.folder, r]));
  for (const inst of INSTRUMENTS) {
    if (inst.id === DEFAULT_INSTRUMENT) continue; // piano isn't in the tonejs calibration set
    const measured = byFolder.get(inst.folder);
    if (!measured) continue;
    const peakLinear = Math.pow(10, measured.maxDb / 20);
    const worstCase = peakLinear * inst.gain * SAMPLE_MAKEUP;
    // 1% tolerance: instruments.js's gain is calibrate-gains.mjs's exact
    // computed value rounded to 3 decimals for readability, which can round
    // up just past the exact cap that produced it.
    ok(`[${inst.id}] worst-case peak stays under the limiter's safe ceiling`,
      worstCase <= SAFE_PEAK_LINEAR * 1.01, `${worstCase.toFixed(3)} vs ${SAFE_PEAK_LINEAR}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
