#!/usr/bin/env node
/**
 * tools/fetch_instruments.mjs — vendors sampled instrument banks from
 * nbrosowsky/tonejs-instruments (code MIT, samples CC-BY 3.0) into
 * src/renderer/samples/<folder>/, thinned to a semitone spacing the
 * pitch-shifting sampler actually needs, and regenerates
 * src/renderer/lib/instrument-roots.generated.js from whatever landed on disk.
 *
 * Usage:
 *   node tools/fetch_instruments.mjs             fetch/verify everything, from cache
 *   node tools/fetch_instruments.mjs --refresh    re-resolve the file listing + re-pin the SHA
 *   node tools/fetch_instruments.mjs --force      re-download every file even if already present
 *   node tools/fetch_instruments.mjs --prune      remove on-disk files no longer in the keep-list
 *   node tools/fetch_instruments.mjs --max-gap 4  thinning spacing in semitones (default 3)
 *
 * Never touches src/renderer/samples/piano/ (the Salamander Grand Piano) —
 * that folder is hard-excluded everywhere in this script, even under --prune.
 *
 * Idempotent by design: a file already on disk whose size matches the cached
 * listing is skipped, not re-downloaded. A failed download is retried up to
 * 3 times; if a folder still has any failure, that instrument is omitted
 * from the generated manifest entirely for this run rather than shipped
 * half-playable — re-run the script to retry just the missing files.
 */

import {
  readFile, writeFile, rename, mkdir, stat, unlink, readdir,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { noteNameToMidi, fromSharpLetterForm } from '../src/renderer/lib/note-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SAMPLES_DIR = path.join(ROOT, 'src/renderer/samples');
const SOURCES_CACHE = path.join(__dirname, 'instrument-sources.json');
const GENERATED_FILE = path.join(ROOT, 'src/renderer/lib/instrument-roots.generated.js');
const CREDITS_FILE = path.join(SAMPLES_DIR, 'CREDITS.md');

const REPO = 'nbrosowsky/tonejs-instruments';
const DEFAULT_REF = 'master';

// 19 folders taken from the source repo. Its own `piano` is skipped — this
// project keeps the higher-quality bundled Salamander Grand Piano instead,
// and that folder must never be overwritten by this script.
const FOLDERS = [
  'bass-electric', 'bassoon', 'cello', 'clarinet', 'contrabass', 'flute',
  'french-horn', 'guitar-acoustic', 'guitar-electric', 'guitar-nylon',
  'harmonium', 'harp', 'organ', 'saxophone', 'trombone', 'trumpet', 'tuba',
  'violin', 'xylophone',
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const REFRESH = flag('refresh');
const FORCE = flag('force');
const PRUNE = flag('prune');
const MAX_GAP = parseInt(opt('max-gap', '3'), 10);

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return fallback; }
}

async function ghApi(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ddw-academy-fetch-instruments' } });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return res.json();
}

/** Resolve and pin the commit SHA for DEFAULT_REF. Cached across runs. */
async function resolveSha(cache) {
  if (cache.sha && !REFRESH) return cache.sha;
  const commit = await ghApi(`https://api.github.com/repos/${REPO}/commits/${DEFAULT_REF}`);
  return commit.sha;
}

/** List every .ogg file in one sample folder at the pinned SHA. */
async function listFolder(sha, folder) {
  const entries = await ghApi(
    `https://api.github.com/repos/${REPO}/contents/samples/${folder}?ref=${sha}`);
  return entries
    .filter((e) => e.type === 'file' && e.name.toLowerCase().endsWith('.ogg'))
    .map((e) => ({ name: e.name, size: e.size, download_url: e.download_url }));
}

/** Parse a tonejs filename stem ("As3", "C5") into a canonical root name + MIDI. */
function parseStem(filename) {
  const stem = filename.replace(/\.ogg$/i, '');
  const canonical = fromSharpLetterForm(stem);
  return { canonical, midi: noteNameToMidi(canonical) };
}

/**
 * Greedily thin a folder's file list to roughly `maxGap` semitones between
 * consecutive kept roots — matching the ±1.5-semitone pitch-shift budget the
 * sampler already uses for the bundled Salamander piano. Always keeps the
 * lowest and highest root so a thinned instrument never loses range. A
 * folder whose native samples are already sparser than `maxGap` is left
 * untouched, since every gap already clears the threshold.
 */
function thin(files, maxGap) {
  const withMidi = files
    .map((f) => ({ ...f, ...parseStem(f.name) }))
    .sort((a, b) => a.midi - b.midi);
  if (withMidi.length <= 1) return withMidi;

  const kept = [withMidi[0]];
  for (let i = 1; i < withMidi.length - 1; i++) {
    if (withMidi[i].midi - kept[kept.length - 1].midi >= maxGap) kept.push(withMidi[i]);
  }
  const last = withMidi[withMidi.length - 1];
  if (kept[kept.length - 1].midi !== last.midi) kept.push(last);
  return kept;
}

async function downloadFile(url, destPath, expectedSize) {
  if (!FORCE && existsSync(destPath)) {
    const st = await stat(destPath);
    if (st.size === expectedSize) return 'skipped';
  }
  const tmp = `${destPath}.part`;
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(destPath), { recursive: true });
      await writeFile(tmp, buf);
      await rename(tmp, destPath);
      return 'downloaded';
    } catch (err) {
      lastErr = err;
      await new Promise((r) => { setTimeout(r, attempt * 400); });
    }
  }
  throw lastErr;
}

async function writeCredits(sha, results) {
  const body = `# Sample credits

## Grand Piano (default instrument)

Salamander Grand Piano V3 (Yamaha C5), recorded and edited by Alexander Holm.
Licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
https://archive.org/details/SalamanderGrandPianoV3

## Everything else

The remaining ${Object.keys(results).length} instrument banks are vendored from
[${REPO}](https://github.com/${REPO}) at commit \`${sha}\`, thinned from its
full sample set down to the roots this app actually loads (see
tools/fetch_instruments.mjs). Code there is MIT; the samples themselves are
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), sourced by that
project from Freesound, Versilian Studios (VSO2 / VSCO Community), Karoryfer
Samples, and the University of Iowa Electronic Music Studios instrument
database — see that repository's own \`sample-source-info.txt\` for the
per-file breakdown.

Instruments included: ${Object.keys(results).sort().join(', ')}.
`;
  await writeFile(CREDITS_FILE, body);
}

async function main() {
  await mkdir(SAMPLES_DIR, { recursive: true });
  const cache = await readJson(SOURCES_CACHE, {});
  const sha = await resolveSha(cache);
  cache.sha = sha;
  cache.folders = cache.folders || {};

  const results = {}; // folder -> [canonical root names], ascending
  let anyFailed = false;

  for (const folder of FOLDERS) {
    console.log(`\n== ${folder} ==`);
    let files = cache.folders[folder]?.files;
    if (!files || REFRESH) {
      files = await listFolder(sha, folder);
      cache.folders[folder] = { files };
      await writeFile(SOURCES_CACHE, JSON.stringify(cache, null, 2));
    }

    const keep = thin(files, MAX_GAP);
    console.log(`  ${files.length} files upstream -> keeping ${keep.length} (max-gap ${MAX_GAP} st)`);

    const destDir = path.join(SAMPLES_DIR, folder);
    let ok = 0;
    let failed = 0;
    for (const f of keep) {
      const dest = path.join(destDir, f.name);
      try {
        const outcome = await downloadFile(f.download_url, dest, f.size);
        console.log(`  ${outcome === 'skipped' ? '·' : '↓'} ${f.name}`);
        ok++;
      } catch (err) {
        console.warn(`  ✗ ${f.name} — ${err.message}`);
        failed++;
      }
    }

    if (PRUNE && existsSync(destDir)) {
      const keepNames = new Set(keep.map((f) => f.name));
      for (const name of await readdir(destDir)) {
        if (name.toLowerCase().endsWith('.ogg') && !keepNames.has(name)) {
          await unlink(path.join(destDir, name));
          console.log(`  – pruned ${name} (not in current keep-list)`);
        }
      }
    }

    if (failed > 0 || ok === 0) {
      anyFailed = true;
      console.warn(`  ${folder}: ${failed} file(s) failed — omitting from the manifest this run.`);
      continue;
    }
    results[folder] = keep.map((f) => f.canonical).sort((a, b) => noteNameToMidi(a) - noteNameToMidi(b));
  }

  // Regenerate the manifest's roots wholesale from what's ACTUALLY on disk and
  // verified this run — an instrument with any missing file is entirely
  // omitted rather than shipped half-playable.
  const lines = [
    '/**',
    ' * instrument-roots.generated.js — GENERATED FILE. DO NOT EDIT BY HAND.',
    ' *',
    ` * Produced by tools/fetch_instruments.mjs from ${REPO}@${sha.slice(0, 12)}.`,
    ' * Re-run that script to update; it rewrites this file wholesale from what',
    ' * actually landed in src/renderer/samples/. Hand-tuned instrument metadata',
    ' * (name, gain, release, grouping…) lives in instruments.js instead, which',
    ' * this file never touches.',
    ' */',
    '',
    'export const ROOTS = {',
    ...Object.entries(results).map(([folder, roots]) =>
      `  '${folder}': [${roots.map((r) => `'${r}'`).join(', ')}],`),
    '};',
    '',
  ];
  await writeFile(GENERATED_FILE, lines.join('\n'));
  console.log(`\nWrote ${GENERATED_FILE.replace(ROOT, '.')} (${Object.keys(results).length}/${FOLDERS.length} instruments)`);

  await writeCredits(sha, results);

  if (anyFailed) {
    console.warn('\nOne or more instruments had a failed download and were omitted this run. Re-run to retry.');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
