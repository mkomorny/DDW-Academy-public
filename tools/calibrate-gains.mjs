#!/usr/bin/env node
/**
 * tools/calibrate-gains.mjs — measures each instrument bank's loudness
 * relative to the reference Grand Piano and proposes a `gain` value for
 * instruments.js's META table.
 *
 * The plan called for measuring this inside the app with an
 * OfflineAudioContext (Web Audio isn't available under plain Node, and
 * spinning up a full Electron renderer headlessly just to render 20 short
 * buffers is a lot of machinery for one number per instrument). ffmpeg's
 * `volumedetect` filter gives the same two numbers that measurement would
 * have produced — mean_volume (≈RMS, dBFS) and max_volume (true peak,
 * dBFS) — computed directly from the actual shipped OGG files, offline,
 * reproducibly, and without touching a browser. Same intent, lighter tool.
 *
 * Method:
 *   1. Measure the piano's reference note (C4, medium velocity layer) and
 *      each instrument's root nearest MIDI 60.
 *   2. gain = 10^((pianoMeanDb - instMeanDb) / 20)   — equal-RMS starting point.
 *   3. Trim by category: sustaining instruments (organ, bowed strings, winds,
 *      brass) read louder than a decaying sample at matched RMS, so pull
 *      down ~x0.65; plucked/percussive instruments read quieter, push up
 *      ~x1.2 — per the plan's calibration procedure.
 *   4. Cap so peak * gain * SAMPLE_MAKEUP never exceeds 4.0 (the threshold
 *      past which the limiter starts audibly pumping on a stacked chord),
 *      clamping down and flagging any instrument that needed it.
 *
 * Usage: node tools/calibrate-gains.mjs
 * Prints a table and writes tools/gain-calibration.json for reference. The
 * `gain` values in instruments.js are hand-copied from this output, not
 * read automatically — same reasoning as the roots/metadata split: a
 * calibration run should never silently change a shipped tuning.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOTS } from '../src/renderer/lib/instrument-roots.generated.js';
import { noteNameToMidi } from '../src/renderer/lib/note-utils.js';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SAMPLES_DIR = path.join(ROOT, 'src/renderer/samples');

const SAMPLE_MAKEUP = 8.5;      // must match audio.js
const SAFE_PEAK_LINEAR = 4.0;   // must match the cap audio.js/tests enforce

// Sustaining vs. plucked/percussive category, per the plan's calibration
// procedure. Piano is the reference and excluded.
const SUSTAINING = new Set([
  'organ', 'harmonium', 'violin', 'cello', 'contrabass', 'flute', 'clarinet',
  'saxophone', 'bassoon', 'trumpet', 'french-horn', 'trombone', 'tuba',
]);
const PLUCKED = new Set([
  'guitar-acoustic', 'guitar-nylon', 'guitar-electric', 'bass-electric', 'harp', 'xylophone',
]);

function nearestRootName(rootNames, targetMidi) {
  let best = rootNames[0];
  let bestDist = Math.abs(noteNameToMidi(best) - targetMidi);
  for (const name of rootNames) {
    const d = Math.abs(noteNameToMidi(name) - targetMidi);
    if (d < bestDist) { best = name; bestDist = d; }
  }
  return best;
}

async function volumeDetect(file) {
  const { stderr } = await execFileP(
    'ffmpeg', ['-nostats', '-i', file, '-af', 'volumedetect', '-f', 'null', '-'],
    { maxBuffer: 8 * 1024 * 1024 },
  ).catch((err) => ({ stderr: err.stderr || '' })); // ffmpeg exits nonzero for -f null, output is still on stderr
  const mean = /mean_volume:\s*(-?[\d.]+)\s*dB/.exec(stderr);
  const max = /max_volume:\s*(-?[\d.]+)\s*dB/.exec(stderr);
  if (!mean || !max) throw new Error(`could not parse volumedetect output for ${file}`);
  return { meanDb: parseFloat(mean[1]), maxDb: parseFloat(max[1]) };
}

const dbToLinear = (db) => Math.pow(10, db / 20);

async function main() {
  const pianoFile = path.join(SAMPLES_DIR, 'piano', 'C4v6.ogg');
  const piano = await volumeDetect(pianoFile);
  console.log(`reference: piano C4v6  mean ${piano.meanDb.toFixed(2)} dB  peak ${piano.maxDb.toFixed(2)} dB\n`);

  const rows = [];
  for (const [folder, roots] of Object.entries(ROOTS)) {
    const rootName = nearestRootName(roots, 60);
    const file = path.join(SAMPLES_DIR, folder, `${rootName.replace('#', 's')}.ogg`);
    const m = await volumeDetect(file);

    let gain = dbToLinear(piano.meanDb - m.meanDb);
    const category = SUSTAINING.has(folder) ? 'sustaining' : PLUCKED.has(folder) ? 'plucked' : 'neutral';
    if (category === 'sustaining') gain *= 0.65;
    if (category === 'plucked') gain *= 1.2;

    const peakLinear = dbToLinear(m.maxDb);
    const worstCase = peakLinear * gain * SAMPLE_MAKEUP;
    let capped = false;
    if (worstCase > SAFE_PEAK_LINEAR) {
      gain *= SAFE_PEAK_LINEAR / worstCase;
      capped = true;
    }

    rows.push({
      folder, rootName, category,
      meanDb: m.meanDb, maxDb: m.maxDb,
      gain: Math.round(gain * 1000) / 1000,
      capped,
    });
  }

  console.log(
    'folder'.padEnd(18), 'root'.padEnd(6), 'category'.padEnd(11),
    'mean dB'.padEnd(9), 'peak dB'.padEnd(9), 'gain'.padEnd(7), 'capped');
  for (const r of rows) {
    console.log(
      r.folder.padEnd(18), r.rootName.padEnd(6), r.category.padEnd(11),
      r.meanDb.toFixed(2).padEnd(9), r.maxDb.toFixed(2).padEnd(9),
      r.gain.toFixed(3).padEnd(7), r.capped ? 'yes' : '');
  }

  await writeFile(
    path.join(__dirname, 'gain-calibration.json'),
    JSON.stringify({ reference: piano, instruments: rows }, null, 2));
  console.log('\nWrote tools/gain-calibration.json');
}

main().catch((err) => { console.error(err); process.exit(1); });
