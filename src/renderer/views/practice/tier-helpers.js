/**
 * tier-helpers.js — pure functions and constants shared by every drill
 * generator in views/practice/generators/*.js. No DOM, no store, no MIDI:
 * everything here is a deterministic (or seeded-random) function of a tier
 * number, safe to unit test and safe to import from a Node script.
 */
import { SHARP_NAMES, CHORD_TYPES, scaleToMidi } from '../../lib/theory.js';

export const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const WHITE_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const CORE_KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];
export const WINS_NEEDED = 10;

/* Two tier-ladder helpers, and the difference between them matters.
 *
 * ladder() SATURATES: past the end of the list it keeps returning the last
 * entry. That is what content pools want — once every chord quality is in
 * play, tier 40 should still use every chord quality.
 *
 * rung() returns undefined past the end instead, so `rung(t, [...]) || expr`
 * hands over to a formula that keeps growing. describe() must use this one:
 * with ladder() the `||` can never fire, and the header would freeze on the
 * last fixed description while make() went on escalating — the UI would
 * quietly misdescribe every tier above the ladder.
 */
export const ladder = (tier, arr) => arr[Math.min(tier, arr.length) - 1];
export const rung = (tier, arr) => (tier <= arr.length ? arr[tier - 1] : undefined);

export const nameOf = (pc) => SHARP_NAMES[((pc % 12) + 12) % 12];

/* Look up a chord type by id.
 *
 * Roll the random pick BEFORE the lookup, never inside the predicate: writing
 * CHORD_TYPES.find((c) => c.id === randomOf(quals)) re-rolls for every element
 * find() tests, so it matches only when a roll happens to equal the element
 * being compared — usually returning undefined, and skewing hard toward the
 * front of the list when it does hit.
 */
export function typeById(id) {
  const t = CHORD_TYPES.find((c) => c.id === id);
  if (!t) throw new Error(`unknown chord type "${id}"`);
  return t;
}

/* The drill keyboard spans MIDI 36–96, so a run can never exceed five
   octaves however high the tier goes. Octave growth therefore CAPS here, and
   the drills that used it carry on getting harder along a different axis —
   chaining several runs back to back. Without the cap the prompt would claim
   "49 octaves" while the notes were silently clipped at 96: the drill would
   stop getting harder and the header would be lying about it. */
export const KB_LOW = 36, KB_HIGH = 96;
export const MAX_OCTAVES = 5;

/** Octaves at `tier`, capped to what actually fits on the keyboard. */
export const octavesAt = (tier, from, base = 2) =>
  Math.min(MAX_OCTAVES, base + Math.max(0, Math.floor((tier - from) / 2)));

/** How many separate runs to chain once the octave span has maxed out. */
export const runsAt = (tier, from, base = 2) => {
  const uncapped = base + Math.max(0, Math.floor((tier - from) / 2));
  return 1 + Math.max(0, Math.ceil((uncapped - MAX_OCTAVES) / 2));
};

/** Ascending scale run that is guaranteed to fit under KB_HIGH. */
export function fittedRun(rootPc, steps, octaves) {
  const oct = Math.max(1, Math.min(MAX_OCTAVES, octaves));
  let start = 4;
  while (start > 1 && (start + 1) * 12 + rootPc + oct * 12 > KB_HIGH) start -= 1;
  return scaleToMidi(rootPc, steps, start, oct).filter((n) => n >= KB_LOW && n <= KB_HIGH);
}

/* Interval Builder grows in two stages for the same reason: an interval can
   only be compounded until it runs off the end of the keyboard (four octaves
   is already 48 semitones), so widening caps and chain length takes over. */
export const intervalOctaves = (tier) => Math.min(4, 1 + Math.max(0, Math.floor((tier - 7) / 3)));
export const intervalChain = (tier) => 1 + Math.max(0, Math.floor((tier - 16) / 2));

/* Per-question time budget for button-answered drills, in ms, or null while
   the drill is still untimed. It shrinks asymptotically towards 1.2s — it
   approaches but never reaches it, which is what keeps these drills getting
   harder forever once their content ladder is exhausted. Shared by the runner
   and by describe(), so the header can never disagree with the actual clock. */
export function timeBudgetMs(tier, from = 4) {
  return tier < from ? null : 1200 + 6000 / (1 + 0.35 * (tier - from));
}
export const clockText = (tier, from = 4) => `${(timeBudgetMs(tier, from) / 1000).toFixed(1)}s per question`;

/* How many 12-bar choruses the blues drill asks for at a given tier. One
   chorus arrives at tier 5, then a further chorus every second tier — so the
   drill keeps growing rather than plateauing at "play the whole form". */
export const bluesChoruses = (tier) => 1 + Math.max(0, Math.floor((tier - 5) / 2));

/** A chain of independent chord tasks, used by several drills at high tiers. */
export function chordChain(n, makeOne) {
  const chords = Array.from({ length: n }, makeOne);
  return {
    mode: 'chordSeq',
    chords: chords.map((c) => ({ label: c.label, expect: c.expect, byPitchClass: c.byPitchClass, play: c.play })),
  };
}
