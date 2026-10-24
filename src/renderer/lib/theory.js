/**
 * theory.js — the computational core of the course.
 *
 * Everything downstream (lessons, drills, games, MIDI grading) asks this
 * module questions. It is deliberately free of DOM and audio concerns so it
 * can be reasoned about — and tested — on its own.
 *
 * Two representations are used throughout and it matters which is which:
 *   - pitch class (pc): 0-11, C=0. Answers "which piano key", ignores spelling.
 *   - spelled note:     { letter, alter, pc } e.g. F# and Gb share pc 6.
 * Grading MIDI input compares pitch classes. Displaying a scale uses spelling.
 */

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NAMES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const mod = (n, m) => ((n % m) + m) % m;

/* ------------------------------------------------------------ note parsing */

/** Parse "F#", "Bbb", "C" into { letter, alter, pc }. Returns null if invalid. */
export function parseNote(name) {
  const m = /^([A-Ga-g])([#b♯♭]*)$/.exec(String(name).trim());
  if (!m) return null;
  const letter = m[1].toUpperCase();
  let alter = 0;
  for (const ch of m[2]) alter += (ch === '#' || ch === '♯') ? 1 : -1;
  return { letter, alter, pc: mod(LETTER_PC[letter] + alter, 12) };
}

export function noteToString(n) {
  const acc = n.alter > 0 ? '♯'.repeat(n.alter) : '♭'.repeat(-n.alter);
  return n.letter + acc;
}

/** Plain-ASCII form, for matching against corpus text and for filenames. */
export function noteToAscii(n) {
  return n.letter + (n.alter > 0 ? '#'.repeat(n.alter) : 'b'.repeat(-n.alter));
}

export const pcOf = (name) => (parseNote(name) || {}).pc;

/* ------------------------------------------------------------------- MIDI  */

/** MIDI note number -> { pc, octave, name }. Middle C (C4) is MIDI 60. */
export function fromMidi(midi, preferFlats = false) {
  const pc = mod(midi, 12);
  return {
    midi,
    pc,
    octave: Math.floor(midi / 12) - 1,
    name: (preferFlats ? FLAT_NAMES : SHARP_NAMES)[pc],
  };
}

export function toMidi(noteName, octave) {
  const n = parseNote(noteName);
  if (!n) return null;
  return (octave + 1) * 12 + n.pc;
}

/** Equal-tempered frequency. A4 = MIDI 69 = 440 Hz. */
export const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

export const isBlackKey = (midi) => [1, 3, 6, 8, 10].includes(mod(midi, 12));

/* --------------------------------------------------------------- spelling  */

/**
 * Spell a scale correctly from a root and a list of degree labels.
 *
 * This is what stops the app printing "D minor: D E F G A A# C" — the sixth
 * degree of D minor is a B-flat, not an A-sharp, because every scale degree
 * must use its own letter. The degree label ("b6") tells us which letter to
 * use; the pitch class tells us how many accidentals that letter needs.
 */
export function spellFromDegrees(rootName, degrees, steps) {
  const root = parseNote(rootName);
  if (!root) return [];

  const pcs = pcsFromSteps(root.pc, steps);
  const rootLetterIdx = LETTERS.indexOf(root.letter);
  const out = [];

  for (let i = 0; i < pcs.length; i++) {
    const label = degrees && degrees[i];
    const degNum = label ? parseInt(String(label).replace(/[^0-9]/g, ''), 10) : i + 1;

    if (!degNum || degNum > 14) {          // no usable degree label — fall back
      out.push(fallbackSpelling(pcs[i], root));
      continue;
    }
    const letter = LETTERS[mod(rootLetterIdx + degNum - 1, 7)];
    let alter = pcs[i] - LETTER_PC[letter];
    // Choose the representation nearest zero (handles the octave wrap).
    if (alter > 6) alter -= 12;
    if (alter < -6) alter += 12;

    if (Math.abs(alter) > 2) {             // triple accidental => unspellable
      out.push(fallbackSpelling(pcs[i], root));
    } else {
      out.push({ letter, alter, pc: pcs[i] });
    }
  }
  return out;
}

function fallbackSpelling(pc, root) {
  const useFlats = root.alter < 0 || ['F'].includes(root.letter);
  return parseNote((useFlats ? FLAT_NAMES : SHARP_NAMES)[pc]);
}

/** Turn a root pitch class + step pattern into the scale's pitch classes. */
export function pcsFromSteps(rootPc, steps) {
  const out = [rootPc];
  let cur = rootPc;
  // The final step closes the octave, so it produces no new note.
  for (let i = 0; i < steps.length - 1; i++) {
    cur += steps[i];
    out.push(mod(cur, 12));
  }
  return out;
}

/** Ascending MIDI notes for a scale, `octaves` long, ending on the tonic. */
export function scaleToMidi(rootPc, steps, startOctave = 4, octaves = 1) {
  const notes = [];
  let midi = (startOctave + 1) * 12 + rootPc;
  notes.push(midi);
  for (let o = 0; o < octaves; o++) {
    for (const s of steps) {
      midi += s;
      notes.push(midi);
    }
  }
  return notes;
}

/* -------------------------------------------------------------- intervals  */

/**
 * The thirteen intervals taught in Module 3.1, one per source PDF.
 * `semitones` is what the ear and the keyboard care about; `abbr` is how it
 * gets written on the page.
 */
export const INTERVALS = [
  { id: 'P1',  semitones: 0,  name: 'Unison',         abbr: 'P1',  quality: 'perfect',    source: 'Unison and octave intervals.pdf' },
  { id: 'm2',  semitones: 1,  name: 'Minor 2nd',      abbr: 'm2',  quality: 'minor',      source: 'Minor second interval.pdf' },
  { id: 'M2',  semitones: 2,  name: 'Major 2nd',      abbr: 'M2',  quality: 'major',      source: 'Major second interval.pdf' },
  { id: 'm3',  semitones: 3,  name: 'Minor 3rd',      abbr: 'm3',  quality: 'minor',      source: 'Minor third interval.pdf' },
  { id: 'M3',  semitones: 4,  name: 'Major 3rd',      abbr: 'M3',  quality: 'major',      source: 'Major third interval.pdf' },
  { id: 'P4',  semitones: 5,  name: 'Perfect 4th',    abbr: 'P4',  quality: 'perfect',    source: 'Perfect fourth interval.pdf' },
  { id: 'TT',  semitones: 6,  name: 'Tritone',        abbr: 'A4/d5', quality: 'tritone',  source: 'Intervals in Music Theory.pdf' },
  { id: 'P5',  semitones: 7,  name: 'Perfect 5th',    abbr: 'P5',  quality: 'perfect',    source: 'Perfect fifth interval.pdf' },
  { id: 'm6',  semitones: 8,  name: 'Minor 6th',      abbr: 'm6',  quality: 'minor',      source: 'Minor sixth interval.pdf' },
  { id: 'M6',  semitones: 9,  name: 'Major 6th',      abbr: 'M6',  quality: 'major',      source: 'Major sixth interval.pdf' },
  { id: 'm7',  semitones: 10, name: 'Minor 7th',      abbr: 'm7',  quality: 'minor',      source: 'Minor seventh interval.pdf' },
  { id: 'M7',  semitones: 11, name: 'Major 7th',      abbr: 'M7',  quality: 'major',      source: 'Major seventh interval.pdf' },
  { id: 'P8',  semitones: 12, name: 'Octave',         abbr: 'P8',  quality: 'perfect',    source: 'Unison and octave intervals.pdf' },
];

export const intervalBySemitones = (n) => INTERVALS.find((i) => i.semitones === mod(n, 12) || i.semitones === n);

/* ------------------------------------------------------------------ chords */

/**
 * Chord formulas as semitone offsets from the root.
 * Sourced from Triads and Chords.pdf, Complete Guide to Triads.pdf,
 * The Ultimate Piano Chord Chart.pdf and How to play jazz chords on piano.pdf.
 */
export const CHORD_TYPES = [
  { id: 'maj',      name: 'Major',              symbol: '',        intervals: [0, 4, 7],            family: 'triad' },
  { id: 'min',      name: 'Minor',              symbol: 'm',       intervals: [0, 3, 7],            family: 'triad' },
  { id: 'dim',      name: 'Diminished',         symbol: 'dim',     intervals: [0, 3, 6],            family: 'triad' },
  { id: 'aug',      name: 'Augmented',          symbol: 'aug',     intervals: [0, 4, 8],            family: 'triad' },
  { id: 'sus2',     name: 'Suspended 2nd',      symbol: 'sus2',    intervals: [0, 2, 7],            family: 'triad' },
  { id: 'sus4',     name: 'Suspended 4th',      symbol: 'sus4',    intervals: [0, 5, 7],            family: 'triad' },
  { id: 'maj7',     name: 'Major 7th',          symbol: 'maj7',    intervals: [0, 4, 7, 11],        family: 'seventh' },
  { id: 'min7',     name: 'Minor 7th',          symbol: 'm7',      intervals: [0, 3, 7, 10],        family: 'seventh' },
  { id: 'dom7',     name: 'Dominant 7th',       symbol: '7',       intervals: [0, 4, 7, 10],        family: 'seventh' },
  { id: 'min7b5',   name: 'Half-diminished',    symbol: 'm7♭5',    intervals: [0, 3, 6, 10],        family: 'seventh' },
  { id: 'dim7',     name: 'Diminished 7th',     symbol: 'dim7',    intervals: [0, 3, 6, 9],         family: 'seventh' },
  { id: 'minMaj7',  name: 'Minor-Major 7th',    symbol: 'mMaj7',   intervals: [0, 3, 7, 11],        family: 'seventh' },
  { id: 'maj6',     name: 'Major 6th',          symbol: '6',       intervals: [0, 4, 7, 9],         family: 'sixth' },
  { id: 'min6',     name: 'Minor 6th',          symbol: 'm6',      intervals: [0, 3, 7, 9],         family: 'sixth' },
  { id: 'maj9',     name: 'Major 9th',          symbol: 'maj9',    intervals: [0, 4, 7, 11, 14],    family: 'extended' },
  { id: 'min9',     name: 'Minor 9th',          symbol: 'm9',      intervals: [0, 3, 7, 10, 14],    family: 'extended' },
  { id: 'dom9',     name: 'Dominant 9th',       symbol: '9',       intervals: [0, 4, 7, 10, 14],    family: 'extended' },
  { id: 'dom7b9',   name: 'Dominant 7♭9',       symbol: '7♭9',     intervals: [0, 4, 7, 10, 13],    family: 'altered' },
  { id: 'dom7s9',   name: 'Dominant 7♯9',       symbol: '7♯9',     intervals: [0, 4, 7, 10, 15],    family: 'altered' },
  { id: 'dom7s11',  name: 'Dominant 7♯11',      symbol: '7♯11',    intervals: [0, 4, 7, 10, 18],    family: 'altered' },
  { id: 'dom13',    name: 'Dominant 13th',      symbol: '13',      intervals: [0, 4, 7, 10, 14, 21], family: 'extended' },
];

export const chordType = (id) => CHORD_TYPES.find((c) => c.id === id);

/** Pitch classes of a chord built on a root. */
export function chordPcs(rootPc, typeId) {
  const t = chordType(typeId);
  return t ? t.intervals.map((i) => mod(rootPc + i, 12)) : [];
}

/** MIDI notes of a chord in a given inversion (0 = root position). */
export function chordMidi(rootPc, typeId, octave = 4, inversion = 0) {
  const t = chordType(typeId);
  if (!t) return [];
  let notes = t.intervals.map((i) => (octave + 1) * 12 + rootPc + i);
  for (let k = 0; k < inversion; k++) notes = [...notes.slice(1), notes[0] + 12];
  return notes;
}

/**
 * Identify a chord from a set of MIDI notes. Returns best match or null.
 *
 * Some pitch-class sets are genuinely ambiguous — B-D-F-A is both Bm7♭5 and
 * Dm6, because every half-diminished seventh is an inversion of a minor sixth.
 * The bass note breaks the tie: a reading that puts the chord's own root in
 * the bass (root position) is preferred over an inverted reading of the same
 * notes. Ties beyond that fall back to CHORD_TYPES order, which lists the
 * more common chord qualities first.
 */
export function identifyChord(midiNotes) {
  const pcs = [...new Set(midiNotes.map((m) => mod(m, 12)))].sort((a, b) => a - b);
  if (pcs.length < 3) return null;

  const bassPc = mod(Math.min(...midiNotes), 12);
  const matches = [];

  for (const root of pcs) {
    for (const t of CHORD_TYPES) {
      const want = [...new Set(t.intervals.map((i) => mod(root + i, 12)))].sort((a, b) => a - b);
      if (want.length === pcs.length && want.every((v, i) => v === pcs[i])) {
        const inversion = t.intervals.findIndex((i) => mod(root + i, 12) === bassPc);
        matches.push({ rootPc: root, type: t, inversion: Math.max(0, inversion) });
      }
    }
  }
  if (!matches.length) return null;

  matches.sort((a, b) => (a.inversion === 0 ? 0 : 1) - (b.inversion === 0 ? 0 : 1));
  return matches[0];
}

/* -------------------------------------------------------- keys & the circle */

/**
 * Key signatures, from Key Signature Chart.pdf and Circle of Fifths.pdf.
 * `sharps` is positive for sharp keys, negative for flat keys.
 */
export const MAJOR_KEYS = [
  { name: 'C',  sharps: 0,  relMinor: 'A',  accidentals: [] },
  { name: 'G',  sharps: 1,  relMinor: 'E',  accidentals: ['F#'] },
  { name: 'D',  sharps: 2,  relMinor: 'B',  accidentals: ['F#', 'C#'] },
  { name: 'A',  sharps: 3,  relMinor: 'F#', accidentals: ['F#', 'C#', 'G#'] },
  { name: 'E',  sharps: 4,  relMinor: 'C#', accidentals: ['F#', 'C#', 'G#', 'D#'] },
  { name: 'B',  sharps: 5,  relMinor: 'G#', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  { name: 'F#', sharps: 6,  relMinor: 'D#', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
  { name: 'C#', sharps: 7,  relMinor: 'A#', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] },
  { name: 'F',  sharps: -1, relMinor: 'D',  accidentals: ['Bb'] },
  { name: 'Bb', sharps: -2, relMinor: 'G',  accidentals: ['Bb', 'Eb'] },
  { name: 'Eb', sharps: -3, relMinor: 'C',  accidentals: ['Bb', 'Eb', 'Ab'] },
  { name: 'Ab', sharps: -4, relMinor: 'F',  accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
  { name: 'Db', sharps: -5, relMinor: 'Bb', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  { name: 'Gb', sharps: -6, relMinor: 'Eb', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
  { name: 'Cb', sharps: -7, relMinor: 'Ab', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] },
];

/** Clockwise order of the circle of fifths, starting at C. */
export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export const keyByName = (n) => MAJOR_KEYS.find((k) => k.name === n);

/** The order sharps and flats are written in a key signature. */
export const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER  = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

/* ---------------------------------------------------- diatonic harmony ---- */

export const SCALE_DEGREE_NAMES = [
  'Tonic', 'Supertonic', 'Mediant', 'Subdominant',
  'Dominant', 'Submediant', 'Leading Tone',
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/**
 * Harmonize a seven-note scale into its diatonic triads (or sevenths).
 * Implements "How to build chords from scales.pdf": stack thirds by skipping
 * every other scale degree, then read off the resulting quality.
 */
export function diatonicChords(rootPc, steps, seventh = false) {
  const pcs = pcsFromSteps(rootPc, steps);
  if (pcs.length !== 7) return [];
  const out = [];

  for (let d = 0; d < 7; d++) {
    const pick = (n) => pcs[(d + n) % 7];
    const iv = [0, 2, 4, ...(seventh ? [6] : [])].map((n) => mod(pick(n) - pick(0), 12));

    const match = CHORD_TYPES.find(
      (t) =>
        t.intervals.length === iv.length &&
        t.intervals.every((x, i) => mod(x, 12) === iv[i])
    );

    const quality = match ? match.id : 'unknown';
    const isMinorish = ['min', 'min7', 'min7b5', 'dim', 'dim7'].includes(quality);
    let numeral = isMinorish ? ROMAN[d].toLowerCase() : ROMAN[d];
    if (quality === 'dim' || quality === 'dim7') numeral += '°';
    if (quality === 'min7b5') numeral += 'ø';
    if (quality === 'aug') numeral += '+';

    out.push({
      degree: d + 1,
      degreeName: SCALE_DEGREE_NAMES[d],
      rootPc: pick(0),
      quality,
      symbol: match ? match.symbol : '?',
      name: match ? match.name : 'Unknown',
      numeral,
    });
  }
  return out;
}

/* ------------------------------------------------------------ scale library */

let _scales = null;

/** Load the mined scale library (63 scales derived from the PDF corpus). */
export async function loadScales() {
  if (_scales) return _scales;
  const res = await fetch('../data/scales.json');
  const data = await res.json();
  _scales = data.scales.map((s) => ({
    ...s,
    // Precompute the C-rooted pitch classes; cheap and used constantly.
    pcsFromC: pcsFromSteps(0, s.steps),
  }));
  return _scales;
}

export function findScale(list, id) {
  return list.find((s) => s.id === id) || null;
}

/**
 * Everything a view needs to render one scale in one key.
 * Prefers the spelling printed in the source PDF for that exact root, and
 * falls back to computing the spelling from degree labels.
 */
export function realiseScale(scale, rootName) {
  const root = parseNote(rootName);
  if (!root) return null;

  const pcs = pcsFromSteps(root.pc, scale.steps);
  const fromPdf = scale.roots && scale.roots[String(root.pc)];

  let spelled;
  if (fromPdf && fromPdf.notes && fromPdf.notes.length >= pcs.length) {
    spelled = fromPdf.notes.slice(0, pcs.length).map(parseNote).filter(Boolean);
    if (spelled.length !== pcs.length) spelled = null;
  }
  if (!spelled) spelled = spellFromDegrees(rootName, scale.degrees, scale.steps);

  return {
    scale,
    root,
    pcs,
    spelled,
    names: spelled.map(noteToString),
    fingering: fromPdf ? { lh: fromPdf.lh || null, rh: fromPdf.rh || null } : { lh: null, rh: null },
    fromSourcePdf: Boolean(fromPdf),
  };
}

/* --------------------------------------------------------------- utilities */

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Compare two pitch-class sets regardless of order/octave. Used for grading. */
export function samePcSet(a, b) {
  const A = [...new Set(a.map((x) => mod(x, 12)))].sort((x, y) => x - y);
  const B = [...new Set(b.map((x) => mod(x, 12)))].sort((x, y) => x - y);
  return A.length === B.length && A.every((v, i) => v === B[i]);
}
