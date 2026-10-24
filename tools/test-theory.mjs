/**
 * Sanity checks for the theory engine. Run: node tools/test-theory.mjs
 * These are the cases where a subtle bug would quietly teach something wrong.
 */
import { readFileSync } from 'node:fs';
import {
  spellFromDegrees, noteToString, diatonicChords, pcsFromSteps,
  identifyChord, chordMidi, realiseScale, samePcSet, MAJOR_KEYS, parseNote,
} from '../src/renderer/lib/theory.js';

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; }
  else { fail++; console.log(`FAIL ${label}\n   got  ${g}\n   want ${w}`); }
};

const MAJOR = [2, 2, 1, 2, 2, 2, 1];
const NAT_MINOR = [2, 1, 2, 2, 1, 2, 2];
const HARM_MINOR = [2, 1, 2, 2, 1, 3, 1];
const MAJ_DEG = ['1', '2', '3', '4', '5', '6', '7'];
const MIN_DEG = ['1', '2', 'b3', '4', '5', 'b6', 'b7'];

const spell = (root, deg, steps) => spellFromDegrees(root, deg, steps).map(noteToString);

/* --- spelling: every degree must use its own letter, exactly once --------- */
eq('C major spelling',  spell('C', MAJ_DEG, MAJOR),  ['C','D','E','F','G','A','B']);
eq('F# major spelling', spell('F#', MAJ_DEG, MAJOR), ['F♯','G♯','A♯','B','C♯','D♯','E♯']);
eq('Cb major spelling', spell('Cb', MAJ_DEG, MAJOR), ['C♭','D♭','E♭','F♭','G♭','A♭','B♭']);
// The classic trap: D minor's 6th is B-flat, never A-sharp.
eq('D natural minor',   spell('D', MIN_DEG, NAT_MINOR), ['D','E','F','G','A','B♭','C']);
eq('G# harmonic minor', spell('G#', ['1','2','b3','4','5','b6','7'], HARM_MINOR),
   ['G♯','A♯','B','C♯','D♯','E','F𝄪'.replace('𝄪','##')].map(s=>s.replace('##','♯♯')));

/* --- no letter may repeat inside a 7-note scale -------------------------- */
for (const root of ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']) {
  const letters = spellFromDegrees(root, MAJ_DEG, MAJOR).map(n => n.letter);
  eq(`${root} major uses 7 distinct letters`, new Set(letters).size, 7);
}

/* --- diatonic harmony ---------------------------------------------------- */
const cMaj = diatonicChords(0, MAJOR);
eq('C major numerals', cMaj.map(c => c.numeral), ['I','ii','iii','IV','V','vi','vii°']);
eq('C major degree names', cMaj[4].degreeName, 'Dominant');
const aMin = diatonicChords(9, NAT_MINOR);
eq('A minor numerals', aMin.map(c => c.numeral), ['i','ii°','III','iv','v','VI','VII']);
const cMaj7 = diatonicChords(0, MAJOR, true);
eq('C major 7ths', cMaj7.map(c => c.symbol), ['maj7','m7','m7','maj7','7','m7','m7♭5']);
// Harmonic minor must yield a MAJOR dominant - that is its whole purpose.
const aHarm = diatonicChords(9, HARM_MINOR);
eq('A harmonic minor V is major', aHarm[4].numeral, 'V');

/* --- chord identification ------------------------------------------------ */
eq('identify C major',  (identifyChord([60,64,67])||{}).type.id, 'maj');
eq('identify A minor',  (identifyChord([57,60,64])||{}).type.id, 'min');
eq('identify G7',       (identifyChord([55,59,62,65])||{}).type.id, 'dom7');
eq('identify Cmaj7',    (identifyChord([60,64,67,71])||{}).type.id, 'maj7');
eq('identify Bm7b5',    (identifyChord([59,62,65,69])||{}).type.id, 'min7b5');
eq('C major 1st inv',   (identifyChord([64,67,72])||{}).inversion, 1);
eq('two notes -> null', identifyChord([60,64]), null);

/* --- inversions preserve pitch-class content ----------------------------- */
for (let inv = 0; inv < 3; inv++) {
  eq(`C major inv${inv} same pcs`, samePcSet(chordMidi(0,'maj',4,inv), [0,4,7]), true);
}

/* --- key signature table integrity --------------------------------------- */
for (const k of MAJOR_KEYS) {
  eq(`${k.name}: accidental count matches sharps`, k.accidentals.length, Math.abs(k.sharps));
}
// Relative minor sits a minor third below the major tonic.
for (const k of MAJOR_KEYS) {
  const maj = parseNote(k.name).pc, min = parseNote(k.relMinor).pc;
  eq(`${k.name} rel minor is m3 below`, ((maj - min) + 12) % 12, 3);
}

/* --- mined scale library ------------------------------------------------- */
const lib = JSON.parse(readFileSync(new URL('../src/data/scales.json', import.meta.url))).scales;
eq('scale library non-empty', lib.length > 50, true);
for (const s of lib) {
  eq(`${s.id} steps sum to 12`, s.steps.reduce((a,b)=>a+b,0), 12);
  eq(`${s.id} has no zero step`, s.steps.every(x => x > 0), true);
}
// Every scale must realise in all 12 keys without throwing or losing notes.
for (const s of lib) {
  for (const root of ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']) {
    const r = realiseScale(s, root);
    if (!r || r.names.length !== r.pcs.length || r.names.some(n => !n)) {
      fail++; console.log(`FAIL realise ${s.id} in ${root}`); break;
    }
  }
}
pass++;

// Spot-check a mined scale against the pitch content stated in its PDF.
const superLoc = lib.find(s => s.id === 'super-locrian-altered-scale');
eq('Super Locrian steps', superLoc && superLoc.steps, [1,2,1,2,2,2,2]);
eq('C Super Locrian pcs', pcsFromSteps(0, superLoc.steps), [0,1,3,4,6,8,10]);
const harmMaj = lib.find(s => s.id === 'harmonic-major');
eq('Harmonic major corrected', harmMaj && harmMaj.steps, [2,2,1,2,1,3,1]);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
