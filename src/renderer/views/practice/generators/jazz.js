/**
 * generators/jazz.js — blues and jazz-voicing drill generators. Extracted
 * intact from the original views/practice.js; no behavior changes.
 */
import { pcOf, randomOf, CHORD_TYPES, CIRCLE_OF_FIFTHS } from '../../../lib/theory.js';
import { ROOTS, nameOf, rung, bluesChoruses } from '../tier-helpers.js';

export const jazzGenerators = {

  /* ───────────────────────────────────────────────────────────────── blues */
  blues: {
    describe: (t) => rung(t, [
      'Shell voicings (root + ♭7) in C, bar by bar',
      'Random bars, keys C, G and F',
      'Any key',
      'Three-note voicings: root, 3rd, ♭7',
      'Play a whole 12-bar chorus in sequence',
    ]) || `${bluesChoruses(t)} choruses back to back, modulating`,
    make: (app, tier) => {
      const FORM = [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7];
      const key = tier === 1 ? 'C' : tier === 2 ? randomOf(['C', 'G', 'F']) : randomOf(ROOTS);
      const pc = pcOf(key);
      const voice = (chordPc2) => tier >= 4
        ? [chordPc2, (chordPc2 + 4) % 12, (chordPc2 + 10) % 12]
        : [chordPc2, (chordPc2 + 10) % 12];

      if (tier >= 5) {
        // Past one chorus the form keeps stacking: each extra chorus modulates
        // up a fourth, so the drill never stops growing.
        const n = bluesChoruses(tier);
        const chords = [];
        for (let ch = 0; ch < n; ch++) {
          const base = (pc + ch * 5) % 12;
          for (const off of FORM) {
            const cp = (base + off) % 12;
            chords.push({ label: `${nameOf(cp)}7`, byPitchClass: true,
              expect: voice(cp), play: voice(cp).map((p) => 48 + p) });
          }
        }
        return {
          prompt: n === 1 ? `12-bar blues in ${key} — full chorus`
            : `${n} choruses from ${key}, up a 4th each time`,
          sub: tier >= 4 ? 'Root + 3rd + ♭7 for every bar' : 'Root + ♭7 for every bar',
          mode: 'chordSeq',
          chords,
        };
      }
      const bar = Math.floor(Math.random() * 12);
      const chordPc2 = (pc + FORM[bar]) % 12;
      const numeral = FORM[bar] === 0 ? 'I7' : FORM[bar] === 5 ? 'IV7' : 'V7';
      return {
        prompt: `Bar ${bar + 1} — ${numeral}`,
        sub: `Blues in ${key}: play ${nameOf(chordPc2)}7 as ${tier >= 4 ? 'root + 3rd + ♭7' : 'root + ♭7 shell'}`,
        expect: voice(chordPc2), mode: 'chord', byPitchClass: true,
        play: voice(chordPc2).map((p) => 48 + p),
      };
    },
  },

  /* ─────────────────────────────────────────────────────────── jazz-voicing */
  'jazz-voicing': {
    describe: (t) => rung(t, [
      'Guide tones (3rd + 7th) in C',
      'Guide tones around the circle',
      'Full ii–V–I guide-tone sequence',
      'Minor ii–V–i',
      'Shell voicings: root + 3rd + 7th',
    ]) || `ii–V–I chains through ${t - 4} keys${t >= 17 ? ' — more than one lap of the circle' : ''}`,
    make: (app, tier) => {
      const key = tier === 1 ? 'C' : randomOf(CIRCLE_OF_FIFTHS);
      const pc = pcOf(key);
      const minor = tier === 4 || (tier >= 5 && Math.random() < 0.35);

      const spec = minor
        ? [{ label: 'iiø7', rootPc: (pc + 2) % 12, type: 'min7b5' },
           { label: 'V7', rootPc: (pc + 7) % 12, type: 'dom7' },
           { label: 'i m7', rootPc: pc, type: 'min7' }]
        : [{ label: 'ii7', rootPc: (pc + 2) % 12, type: 'min7' },
           { label: 'V7', rootPc: (pc + 7) % 12, type: 'dom7' },
           { label: 'Imaj7', rootPc: pc, type: 'maj7' }];

      const voice = (s) => {
        const t2 = CHORD_TYPES.find((c) => c.id === s.type);
        const guide = [(s.rootPc + t2.intervals[1]) % 12, (s.rootPc + t2.intervals[3]) % 12];
        return tier >= 5 ? [s.rootPc, ...guide] : guide;
      };

      if (tier >= 3) {
        let seq = [...spec];
        if (tier >= 6) {
          // Chain ii-V-Is through successive keys anticlockwise round the
          // circle. The lap is deliberately NOT capped at 12: past one full
          // revolution it keeps going round again, so the chain length grows
          // with tier forever instead of plateauing.
          let k = CIRCLE_OF_FIFTHS.indexOf(key);
          for (let i = 0; i < tier - 5; i++) {
            k = (k + 11) % 12;
            const p2 = pcOf(CIRCLE_OF_FIFTHS[k]);
            seq.push({ label: 'ii7', rootPc: (p2 + 2) % 12, type: 'min7' },
              { label: 'V7', rootPc: (p2 + 7) % 12, type: 'dom7' },
              { label: 'Imaj7', rootPc: p2, type: 'maj7' });
          }
        }
        return {
          prompt: `${minor ? 'Minor ii–V–i' : 'ii–V–I'} in ${key}${tier >= 6 ? ' → around the circle' : ''}`,
          sub: tier >= 5 ? 'Shell voicings: root + 3rd + 7th' : 'Guide tones only: 3rd + 7th',
          mode: 'chordSeq',
          chords: seq.map((s) => ({ label: `${s.label} (${nameOf(s.rootPc)})`, byPitchClass: true,
            expect: voice(s), play: voice(s).map((p) => 55 + p) })),
        };
      }
      const s = randomOf(spec);
      return {
        prompt: `${s.label} in ${key}`,
        sub: `Guide tones of ${nameOf(s.rootPc)} — the 3rd and the 7th only`,
        expect: voice(s), mode: 'chord', byPitchClass: true,
        play: voice(s).map((p) => 55 + p),
      };
    },
  },
};
