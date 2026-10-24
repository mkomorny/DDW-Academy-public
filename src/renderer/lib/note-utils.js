/**
 * note-utils.js — canonical note-name <-> MIDI conversions.
 *
 * Shared by the audio engine (audio.js), the instrument manifest
 * (instruments.js), and the offline sample-fetch tool
 * (tools/fetch_instruments.mjs, which imports this file directly under plain
 * Node). Keep this free of DOM/browser globals so all three can use it.
 */

export const PC_MAP = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};

const PC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Canonical sharp-spelled name ("C#4") -> MIDI. Returns 60 (middle C) on bad input. */
export function noteNameToMidi(name) {
  const m = /^([A-G]#?)(-?\d+)$/.exec(name);
  if (!m) return 60;
  return (parseInt(m[2], 10) + 1) * 12 + PC_MAP[m[1]];
}

/** MIDI -> canonical sharp-spelled name ("C#4"). */
export function midiToNoteName(midi) {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${PC_NAMES[pc]}${octave}`;
}

/**
 * tonejs-instruments spells sharps with a trailing 's' rather than '#'
 * (Cs4, not C#4) — '#' is awkward in a bare filename. Convert a canonical
 * name to that form for building tonejs-style filenames.
 */
export function toSharpLetterForm(name) {
  return name.replace('#', 's');
}

/** Inverse of toSharpLetterForm — parse a tonejs-style filename stem back to canonical. */
export function fromSharpLetterForm(name) {
  const m = /^([A-G])s(-?\d+)$/.exec(name);
  return m ? `${m[1]}#${m[2]}` : name;
}
