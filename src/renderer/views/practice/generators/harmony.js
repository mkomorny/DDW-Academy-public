/**
 * generators/harmony.js — diatonic, progression, cadence-drill and
 * circle-drill generators. Extracted intact from the original
 * views/practice.js; no behavior changes.
 */
import { pcOf, randomOf, shuffle, chordMidi, chordPcs, diatonicChords, MAJOR_KEYS } from '../../../lib/theory.js';
import { ROOTS, CORE_KEYS, nameOf, ladder, rung, chordChain, clockText } from '../tier-helpers.js';

export const harmonyGenerators = {

  /* ────────────────────────────────────────────────────────────── diatonic */
  diatonic: {
    describe: (t) => rung(t, [
      'Triads in C major',
      'Triads in G, D, F and A',
      'Any major key',
      'Diatonic SEVENTHS',
      'Minor keys (harmonic minor harmony)',
    ]) || `Degree chains of ${t - 4} chords`,
    make: (app, tier) => {
      const MAJOR = [2, 2, 1, 2, 2, 2, 1];
      const HARM = [2, 1, 2, 2, 1, 3, 1];
      const key = ladder(tier, [['C'], ['G', 'D', 'F', 'A'], ROOTS, ROOTS, ROOTS])
        ? randomOf(ladder(tier, [['C'], ['G', 'D', 'F', 'A'], ROOTS, ROOTS, ROOTS]))
        : randomOf(ROOTS);
      const minor = tier === 5 || (tier > 5 && Math.random() < 0.4);
      const steps = minor ? HARM : MAJOR;
      const seventh = tier === 4 || tier > 5;
      const chords = diatonicChords(pcOf(key), steps, seventh);
      const keyLabel = `${key} ${minor ? 'minor' : 'major'}`;

      const one = () => {
        const c = randomOf(chords);
        const q2 = c.quality === 'unknown' ? 'maj' : c.quality;
        return { label: `${c.numeral} of ${keyLabel}`,
          expect: chordPcs(c.rootPc, q2), byPitchClass: true,
          play: chordMidi(c.rootPc, q2, 4), sub: `${nameOf(c.rootPc)}${c.symbol} — degree ${c.degree} (${c.degreeName})` };
      };
      if (tier >= 6) {
        const chain = chordChain(tier - 4, one);
        return { prompt: chain.chords.map((c) => c.label.split(' of ')[0]).join(' → ') + `  in ${keyLabel}`,
          sub: 'Play the degrees in order', ...chain };
      }
      const c = one();
      return { prompt: c.label, sub: c.sub, expect: c.expect, mode: 'chord',
        byPitchClass: true, play: c.play };
    },
  },

  /* ─────────────────────────────────────────────────────────── progression */
  progression: {
    describe: (t) => rung(t, [
      'One chord from I–IV–V–I in C',
      'Pop progressions, easy keys',
      'Any key',
      'Play the WHOLE progression in sequence',
      'Whole progression with sevenths',
    ]) || `${4 + (t - 4)}-chord progressions in sequence`,
    make: (app, tier) => {
      const SHAPES = tier === 1 ? [[0, 3, 4, 0]]
        : [[0, 3, 4, 0], [0, 4, 5, 3], [5, 3, 0, 4], [0, 5, 3, 4], [1, 4, 0, 0]];
      const key = tier === 1 ? 'C' : tier === 2 ? randomOf(['C', 'G', 'F', 'D']) : randomOf(ROOTS);
      const seventh = tier >= 5;
      const chords = diatonicChords(pcOf(key), [2, 2, 1, 2, 2, 2, 1], seventh);
      let shape = randomOf(SHAPES);
      if (tier >= 6) {
        // Extend the progression length without bound.
        const extra = tier - 4;
        shape = [...shape];
        for (let i = 0; i < extra; i++) shape.push(randomOf([0, 1, 3, 4, 5]));
      }

      const items = shape.map((d) => {
        const c = chords[d];
        const q2 = c.quality === 'unknown' ? 'maj' : c.quality;
        return { label: c.numeral, expect: chordPcs(c.rootPc, q2), byPitchClass: true,
          play: chordMidi(c.rootPc, q2, 4), sym: `${nameOf(c.rootPc)}${c.symbol}` };
      });

      if (tier >= 4) {
        return { prompt: items.map((i) => i.label).join(' – ') + `  in ${key}`,
          sub: 'Play the whole progression, one chord at a time',
          mode: 'chordSeq', chords: items };
      }
      const step = Math.floor(Math.random() * shape.length);
      const c = items[step];
      return {
        prompt: items.map((x, i) => i === step ? `[${x.label}]` : x.label).join(' – '),
        sub: `In ${key} major — play the bracketed chord: ${c.sym}`,
        expect: c.expect, mode: 'chord', byPitchClass: true, play: c.play,
      };
    },
  },

  /* ───────────────────────────────────────────────────────── cadence-drill */
  'cadence-drill': {
    describe: (t) => rung(t, [
      'I – V – I in C',
      'Authentic cadences in any major key',
      'IV–V–I and ii–V–I join',
      'Minor cadences (iiø–V–i)',
      'Plagal and deceptive cadences join',
    ]) || `Cadence chains, ${3 + (t - 5)} chords`,
    make: (app, tier) => {
      const MAJOR = [2, 2, 1, 2, 2, 2, 1];
      const HARM = [2, 1, 2, 2, 1, 3, 1];
      const key = tier === 1 ? 'C' : randomOf(tier === 2 ? CORE_KEYS : ROOTS);
      const minor = tier === 4 || (tier >= 5 && Math.random() < 0.4);
      const chords = diatonicChords(pcOf(key), minor ? HARM : MAJOR, tier >= 4);

      let degrees, name;
      const cadences = [];
      cadences.push({ d: [0, 4, 0], n: 'Authentic (I–V–I)' });
      if (tier >= 3) cadences.push({ d: [3, 4, 0], n: 'IV–V–I' }, { d: [1, 4, 0], n: 'ii–V–I' });
      if (tier >= 5) cadences.push({ d: [3, 0], n: 'Plagal (IV–I)' }, { d: [0, 4, 5], n: 'Deceptive (V–vi)' });
      const pick = randomOf(cadences);
      degrees = [...pick.d]; name = pick.n;
      if (tier >= 6) {
        for (let i = 0; i < tier - 5; i++) degrees.unshift(randomOf([0, 1, 3, 5]));
        name = 'Extended cadence';
      }

      const items = degrees.map((d) => {
        const c = chords[d];
        const q2 = c.quality === 'unknown' ? 'maj' : c.quality;
        return { label: c.numeral, expect: chordPcs(c.rootPc, q2), byPitchClass: true,
          play: chordMidi(c.rootPc, q2, 4) };
      });
      return {
        prompt: `${name}  ·  ${key} ${minor ? 'minor' : 'major'}`,
        sub: items.map((i) => i.label).join(' – ') + ' — play it through',
        mode: 'chordSeq', chords: items,
      };
    },
  },

  /* ────────────────────────────────────────────────────────── circle-drill */
  'circle-drill': {
    choice: true,
    timedFromTier: 5,
    describe: (t) => rung(t, [
      'Signatures with 0–2 accidentals',
      'All key signatures',
      'Relative minors join',
      'Order of sharps and flats',
    ]) || `Everything, mixed · ${clockText(t, 5)}`,
    make: (app, tier) => {
      const pool = tier === 1 ? MAJOR_KEYS.filter((k) => Math.abs(k.sharps) <= 2) : MAJOR_KEYS;
      const key = randomOf(pool);
      const kinds = ['count'];
      if (tier >= 3) kinds.push('relative');
      if (tier >= 4) kinds.push('order');
      const kind = randomOf(kinds);

      if (kind === 'relative') {
        const answer = key.relMinor + ' minor';
        return { prompt: `${key.name} major`, sub: 'What is its relative minor?',
          options: shuffle([answer, ...shuffle(MAJOR_KEYS.filter((k) => k.relMinor !== key.relMinor))
            .slice(0, 3).map((k) => k.relMinor + ' minor')]),
          answer };
      }
      if (kind === 'order') {
        const SHARPS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
        const n = 2 + Math.floor(Math.random() * 5);
        const sharps = Math.random() < 0.5;
        const seq = sharps ? SHARPS : [...SHARPS].reverse();
        const answer = seq[n - 1];
        return {
          prompt: sharps ? `Sharp number ${n}` : `Flat number ${n}`,
          sub: `Which accidental is added ${n === 1 ? 'first' : `${n}th`} in ${sharps ? 'sharp' : 'flat'} keys?`,
          options: shuffle([answer, ...shuffle(seq.filter((x) => x !== answer)).slice(0, 3)]).map((x) => x + (sharps ? '♯' : '♭')),
          answer: answer + (sharps ? '♯' : '♭'),
        };
      }
      const n = key.sharps;
      const answer = n === 0 ? 'None' : n > 0 ? `${n} sharp${n > 1 ? 's' : ''}` : `${-n} flat${-n > 1 ? 's' : ''}`;
      const poolOpts = ['None', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps',
        '1 flat', '2 flats', '3 flats', '4 flats', '5 flats', '6 flats'];
      return { prompt: `${key.name} major`, sub: 'How many accidentals?',
        options: shuffle([answer, ...shuffle(poolOpts.filter((p) => p !== answer)).slice(0, 3)]), answer };
    },
  },
};
