/**
 * generators/fundamentals.js — note-finder and interval-build drill generators.
 * Extracted intact from the original views/practice.js; no behavior changes.
 */
import { INTERVALS, pcOf, randomOf } from '../../../lib/theory.js';
import { ROOTS, WHITE_ROOTS, nameOf, KB_LOW, KB_HIGH, intervalOctaves, intervalChain, rung } from '../tier-helpers.js';

export const fundamentalsGenerators = {

  /* ─────────────────────────────────────────────────────────── note-finder */
  'note-finder': {
    describe: (t) => rung(t, [
      'Natural notes, anywhere on the keyboard',
      'Sharps join in',
      'Flat names too — one key, two names',
      'Exact octave required',
      'Two-note chains, exact octave',
    ]) || `${t - 3}-note chains, exact octave`,
    make: (app, tier) => {
      const pool = tier === 1 ? WHITE_ROOTS.map(pcOf) : ROOTS.map(pcOf);
      const preferFlat = tier >= 3 && Math.random() < 0.5;
      const label = (pc) => preferFlat && [1, 3, 6, 8, 10].includes(pc)
        ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'][pc]
        : nameOf(pc);

      if (tier <= 3) {
        const pc = randomOf(pool);
        return { prompt: label(pc), sub: 'Play this note anywhere on the keyboard',
          expect: [pc], mode: 'chord', byPitchClass: true, play: [60 + pc] };
      }
      const chain = Math.max(1, tier - 3);
      const notes = Array.from({ length: chain }, () => {
        const pc = randomOf(pool);
        const oct = 2 + Math.floor(Math.random() * 4);   // C2..B5
        return { midi: (oct + 1) * 12 + pc, name: `${label(pc)}${oct}` };
      });
      return {
        prompt: notes.map((n) => n.name).join('  '),
        sub: chain === 1 ? 'Play this exact note — right octave' : 'Play these exact notes in order',
        expect: notes.map((n) => n.midi), mode: 'sequence', byPitchClass: false,
        labels: notes.map((n) => n.name),
      };
    },
  },

  /* ──────────────────────────────────────────────────────── interval-build */
  'interval-build': {
    describe: (t) => rung(t, [
      'Major 3rd and perfect 5th above C',
      'Perfect and major intervals, white-key roots',
      'Minor intervals join, any root',
      'Everything including the tritone',
      'Intervals BELOW the root',
      'Above or below at random',
    ]) || (intervalChain(t) > 1
      ? `Chains of ${intervalChain(t)} intervals, compound up to ${12 * intervalOctaves(t)} semitones`
      : `Compound intervals up to ${12 * intervalOctaves(t) + 11} semitones`),
    make: (app, tier) => {
      let pool, rootPc, below = false;
      if (tier === 1) { pool = INTERVALS.filter((i) => ['M3', 'P5'].includes(i.id)); rootPc = 0; }
      else if (tier === 2) { pool = INTERVALS.filter((i) => ['M2','M3','P4','P5','M6','M7','P8'].includes(i.id)); rootPc = pcOf(randomOf(WHITE_ROOTS)); }
      else if (tier === 3) { pool = INTERVALS.filter((i) => i.semitones > 0 && i.id !== 'TT'); rootPc = Math.floor(Math.random() * 12); }
      else { pool = INTERVALS.filter((i) => i.semitones > 0); rootPc = Math.floor(Math.random() * 12); }
      if (tier === 5) below = true;
      if (tier >= 6) below = Math.random() < 0.5;

      // One dyad: a simple or compound interval placed so that both notes fit
      // on the keyboard. Compounding is capped by intervalOctaves(); past that
      // the drill grows by asking for several dyads in a row instead.
      const dyad = (pc, goDown) => {
        const iv = randomOf(pool);
        let semis = iv.semitones;
        let name = iv.name;
        const octs = tier >= 7 ? Math.floor(Math.random() * intervalOctaves(tier)) : 0;
        if (octs > 0) {
          semis += 12 * octs;
          name = `Compound ${iv.name} (${octs === 1 ? 'octave' : `${octs} octaves`} + ${iv.name.toLowerCase()})`;
        }
        // Anchor the root so root±semis stays inside KB_LOW..KB_HIGH.
        let root = 60 + pc;
        while (goDown && root - semis < KB_LOW) root += 12;
        while (!goDown && root + semis > KB_HIGH) root -= 12;
        const other = goDown ? root - semis : root + semis;
        return { name, semis, lo: Math.min(root, other), hi: Math.max(root, other), goDown };
      };

      const n = intervalChain(tier);
      if (n > 1) {
        const chords = Array.from({ length: n }, () => {
          const d = dyad(Math.floor(Math.random() * 12), Math.random() < 0.5);
          return { label: `${d.name} ${d.goDown ? 'below' : 'above'} ${nameOf(d.lo % 12)}`,
            expect: [d.lo, d.hi], byPitchClass: false, play: [d.lo, d.hi] };
        });
        return {
          prompt: chords.map((c) => c.label).join('  →  '),
          sub: `Play all ${n} intervals in order — release between them`,
          mode: 'chordSeq', chords,
        };
      }

      const d = dyad(rootPc, below);
      return {
        prompt: `${d.name} ${below ? 'below' : 'above'} ${nameOf(rootPc)}`,
        sub: `Play both notes together (${d.semis} semitones apart)`,
        expect: [d.lo, d.hi],
        mode: 'chord', byPitchClass: false, highlight: [rootPc],
      };
    },
  },
};
