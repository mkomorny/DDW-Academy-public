/**
 * drums-manifest.js — canonical drum voice ids and per-kit synthesis
 * parameters. Pure data: no Web Audio, no DOM, nothing browser-only, so
 * tools/validate-course.mjs and tools/test-drums.mjs can import this under
 * plain Node the same way lib/instruments.js already is.
 *
 * Sound is synthesized, not sampled (see lib/drums.js for why). A `drumGrid`
 * block declares which VOICES it uses; the *kit* decides how each voice
 * actually sounds. That split is what makes "play this exact pattern on
 * 909 vs. 808 vs. EDM" a one-line authoring move instead of three separate
 * patterns — and it's the best demo in the drum course.
 *
 * Every voice resolves to one of the synthesis TYPES below. A kit only needs
 * to override the parameters that actually define its character (mainly
 * kick/snare/hat/clap); everything else falls back to sensible shared
 * defaults. Numbers here are standard, widely-documented characteristics of
 * the real machines (909/808 kick pitch-sweep ranges, hat inharmonic
 * oscillator ratios, clap multi-burst timing) — general audio-engineering
 * knowledge, not content requiring a corpus citation.
 */

/** Canonical voice ids. A drumGrid lane's `voice` must be one of these. */
export const VOICES = [
  'kick', 'snare', 'clap', 'rim',
  'hatClosed', 'hatOpen',
  'tomLow', 'tomMid', 'tomHigh',
  'crash', 'ride',
  'perc', 'shaker', 'cowbell',
];

/** Triggering a voice in a group chokes (cuts) every other voice in that group. */
export const CHOKE_GROUPS = {
  hihat: ['hatClosed', 'hatOpen'],
};

/** Which choke group (if any) a voice belongs to. */
export function chokeGroupOf(voice) {
  for (const [group, members] of Object.entries(CHOKE_GROUPS)) {
    if (members.includes(voice)) return group;
  }
  return null;
}

/**
 * Per-synthesis-type default parameters. A kit's voice entry is
 * `{ type, ...overrides }` — overrides merge on top of these defaults.
 *
 *   kick     sine with a pitch envelope f0->f1, plus a short noise click
 *   snare    a toned body (triangle) + filtered noise, two independent decays
 *   clap     several short noise bursts in quick succession, then one longer tail
 *   hat      six square oscillators at classic inharmonic ratios through a highpass
 *            (also used for shaker/crash/ride — same algorithm, different tuning)
 *   tom      sine with a pitch envelope, single decay
 *   rim      a very short, high, noisy tick
 *   cowbell  two square oscillators a tritone-ish interval apart, bandpassed
 */
export const TYPE_DEFAULTS = {
  kick: { f0: 180, f1: 52, pitchDecay: 0.045, ampDecay: 0.32, clickLevel: 0.35, clickHz: 1800 },
  snare: { toneFreq: 190, toneDecay: 0.14, noiseFreq: 1700, noiseQ: 1.1, noiseDecay: 0.16, toneLevel: 0.45 },
  clap: { bursts: 4, burstGapSec: 0.011, noiseFreq: 1100, noiseQ: 1.4, tailDecay: 0.28 },
  hat: { ratios: [2, 3, 4.16, 5.43, 6.79, 8.21], baseFreq: 40, decay: 0.06, hpFreq: 7500 },
  tom: { f0: 150, f1: 100, decay: 0.28 },
  rim: { freq: 1900, decay: 0.045 },
  cowbell: { f1: 800, f2: 540, decay: 0.3, bpFreq: 650, bpQ: 2.2 },
};

/**
 * KITS — three synth kits now (all `kind: 'synth'`). An `acoustic` sample-
 * based kit is planned but not yet built; the whole drum curriculum works
 * without it (see the Phase 2a design notes).
 *
 * Only kick/snare/clap/hats are meaningfully overridden per kit — those are
 * what a listener actually identifies a kit by. Other voices share close-to-
 * default character across kits; refine further during content authoring if
 * a specific lesson needs a more distinctive tom/crash/cowbell sound.
 */
export const KITS = {
  '909': {
    name: 'TR-909',
    kind: 'synth',
    description: 'Punchy, short kick; noisy metallic snare; bright, short-decay hats. The house/techno workhorse.',
    voices: {
      kick: { type: 'kick', f0: 200, f1: 50, pitchDecay: 0.045, ampDecay: 0.28, clickLevel: 0.4 },
      snare: { type: 'snare', toneFreq: 200, toneDecay: 0.1, noiseFreq: 1900, noiseDecay: 0.15 },
      clap: { type: 'clap', bursts: 4, burstGapSec: 0.01, tailDecay: 0.22 },
      rim: { type: 'rim', freq: 2000, decay: 0.04 },
      hatClosed: { type: 'hat', decay: 0.05, hpFreq: 8000 },
      hatOpen: { type: 'hat', decay: 0.45, hpFreq: 7000 },
      tomLow: { type: 'tom', f0: 120, f1: 90, decay: 0.3 },
      tomMid: { type: 'tom', f0: 160, f1: 120, decay: 0.27 },
      tomHigh: { type: 'tom', f0: 220, f1: 170, decay: 0.23 },
      crash: { type: 'hat', ratios: [1, 1.5, 2.1, 2.76, 3.41, 4.05], baseFreq: 90, decay: 1.8, hpFreq: 5000 },
      ride: { type: 'hat', ratios: [1, 1.9, 2.7, 3.5, 4.4], baseFreq: 130, decay: 1.1, hpFreq: 4500 },
      perc: { type: 'tom', f0: 400, f1: 380, decay: 0.1 },
      shaker: { type: 'hat', ratios: [2, 3, 4.16, 5.43], baseFreq: 60, decay: 0.08, hpFreq: 6500 },
      cowbell: { type: 'cowbell', f1: 800, f2: 540, decay: 0.28 },
    },
  },

  '808': {
    name: 'TR-808',
    kind: 'synth',
    description: 'Long, tuned sub kick; low, soft snare/clap; sizzly, long-decay hats. Hip-hop, trap, dubstep.',
    voices: {
      kick: { type: 'kick', f0: 130, f1: 45, pitchDecay: 0.09, ampDecay: 0.65, clickLevel: 0.18 },
      snare: { type: 'snare', toneFreq: 160, toneDecay: 0.2, noiseFreq: 1400, noiseDecay: 0.24, toneLevel: 0.55 },
      clap: { type: 'clap', bursts: 4, burstGapSec: 0.013, tailDecay: 0.35 },
      rim: { type: 'rim', freq: 1500, decay: 0.06 },
      hatClosed: { type: 'hat', decay: 0.08, hpFreq: 7000 },
      hatOpen: { type: 'hat', decay: 0.6, hpFreq: 6500 },
      tomLow: { type: 'tom', f0: 100, f1: 75, decay: 0.4 },
      tomMid: { type: 'tom', f0: 135, f1: 100, decay: 0.36 },
      tomHigh: { type: 'tom', f0: 180, f1: 140, decay: 0.32 },
      crash: { type: 'hat', ratios: [1, 1.5, 2.1, 2.76, 3.41, 4.05], baseFreq: 80, decay: 2.0, hpFreq: 4500 },
      ride: { type: 'hat', ratios: [1, 1.9, 2.7, 3.5], baseFreq: 110, decay: 1.3, hpFreq: 4000 },
      perc: { type: 'tom', f0: 350, f1: 330, decay: 0.12 },
      shaker: { type: 'hat', ratios: [2, 3, 4.16, 5.43], baseFreq: 55, decay: 0.1, hpFreq: 6000 },
      cowbell: { type: 'cowbell', f1: 700, f2: 480, decay: 0.32 },
    },
  },

  edm: {
    name: 'Modern EDM',
    kind: 'synth',
    description: 'Punchy layered kick with extra click, wide bright snare/clap layer, crisp hats. General big-room/house/dubstep default.',
    voices: {
      kick: { type: 'kick', f0: 190, f1: 48, pitchDecay: 0.055, ampDecay: 0.4, clickLevel: 0.55, clickHz: 2400 },
      snare: { type: 'snare', toneFreq: 210, toneDecay: 0.12, noiseFreq: 2000, noiseDecay: 0.19, toneLevel: 0.4 },
      clap: { type: 'clap', bursts: 5, burstGapSec: 0.009, tailDecay: 0.3 },
      rim: { type: 'rim', freq: 2100, decay: 0.04 },
      hatClosed: { type: 'hat', decay: 0.045, hpFreq: 9000 },
      hatOpen: { type: 'hat', decay: 0.35, hpFreq: 8000 },
      tomLow: { type: 'tom', f0: 125, f1: 92, decay: 0.26 },
      tomMid: { type: 'tom', f0: 165, f1: 124, decay: 0.24 },
      tomHigh: { type: 'tom', f0: 225, f1: 172, decay: 0.2 },
      crash: { type: 'hat', ratios: [1, 1.5, 2.1, 2.76, 3.41, 4.05], baseFreq: 100, decay: 1.6, hpFreq: 5500 },
      ride: { type: 'hat', ratios: [1, 1.9, 2.7, 3.5, 4.4], baseFreq: 140, decay: 1.0, hpFreq: 5000 },
      perc: { type: 'tom', f0: 420, f1: 400, decay: 0.09 },
      shaker: { type: 'hat', ratios: [2, 3, 4.16, 5.43], baseFreq: 65, decay: 0.07, hpFreq: 7000 },
      cowbell: { type: 'cowbell', f1: 850, f2: 570, decay: 0.26 },
    },
  },
};

export const DEFAULT_KIT = '909';

export function kitById(id) {
  return KITS[id] || KITS[DEFAULT_KIT];
}

/** Resolve one voice's full synthesis params for a kit: type defaults <- kit overrides. */
export function voiceParams(kitId, voice) {
  const kit = kitById(kitId);
  const entry = kit.voices[voice];
  if (!entry) return null;
  return { ...TYPE_DEFAULTS[entry.type], ...entry };
}
