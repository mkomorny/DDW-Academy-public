/**
 * generators/chords.js — triad-drill, inversion-drill, seventh-drill,
 * extended-drill, chord-spelling and arpeggio generators. Extracted intact
 * from the original views/practice.js; no behavior changes.
 */
import { pcOf, randomOf, shuffle, chordMidi, chordPcs, CHORD_TYPES } from '../../../lib/theory.js';
import {
  ROOTS, WHITE_ROOTS, CORE_KEYS, nameOf, typeById, ladder, rung, chordChain,
  octavesAt, runsAt, KB_LOW, KB_HIGH, clockText,
} from '../tier-helpers.js';

export const chordsGenerators = {

  /* ─────────────────────────────────────────────────────────── triad-drill */
  'triad-drill': {
    describe: (t) => rung(t, [
      'Major and minor, white-key roots',
      'Major and minor, any root',
      'Diminished and augmented join',
      'Sus2 and sus4 join',
      'Exact register — play it where it is shown',
    ]) || `Chains of ${t - 4} triads in a row`,
    make: (app, tier) => {
      const quals = ladder(tier, [
        ['maj', 'min'], ['maj', 'min'], ['maj', 'min', 'dim', 'aug'],
        ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4'],
      ]) || ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4'];
      const rootPool = tier === 1 ? WHITE_ROOTS.map(pcOf) : ROOTS.map(pcOf);

      const one = () => {
        const t2 = typeById(randomOf(quals));
        const rootPc = randomOf(rootPool);
        return {
          label: `${nameOf(rootPc)}${t2.symbol}`,
          expect: tier === 5 ? chordMidi(rootPc, t2.id, 4) : chordPcs(rootPc, t2.id),
          byPitchClass: tier !== 5,
          play: chordMidi(rootPc, t2.id, 4),
          name: t2.name,
        };
      };

      if (tier >= 6) {
        const chain = chordChain(tier - 4, one);
        return { prompt: chain.chords.map((c) => c.label).join('  →  '),
          sub: 'Play each chord in order; release between chords', ...chain };
      }
      const c = one();
      return { prompt: c.label, sub: `${c.name} triad${tier === 5 ? ' — in the exact octave highlighted' : ''}`,
        expect: c.expect, mode: 'chord', byPitchClass: c.byPitchClass, play: c.play,
        highlight: tier === 5 ? c.expect : undefined, highlightByPitchClass: tier !== 5 };
    },
  },

  /* ─────────────────────────────────────────────────────── inversion-drill */
  'inversion-drill': {
    describe: (t) => rung(t, [
      'Root position, exact register',
      'First inversion',
      'Second inversion',
      'Any inversion on demand',
      'All triad qualities, any inversion',
      'Seventh chords — four positions',
    ]) || `Chains of ${t - 5} inverted chords`,
    make: (app, tier) => {
      const POS = ['root position', '1st inversion', '2nd inversion', '3rd inversion'];
      const one = () => {
        let quals, inv;
        if (tier === 1) { quals = ['maj', 'min']; inv = 0; }
        else if (tier === 2) { quals = ['maj', 'min']; inv = 1; }
        else if (tier === 3) { quals = ['maj', 'min']; inv = 2; }
        else if (tier === 4) { quals = ['maj', 'min']; inv = Math.floor(Math.random() * 3); }
        else if (tier === 5) { quals = ['maj', 'min', 'dim', 'aug']; inv = Math.floor(Math.random() * 3); }
        else { quals = ['maj7', 'min7', 'dom7', 'min7b5']; inv = Math.floor(Math.random() * 4); }
        const t2 = typeById(randomOf(quals));
        const rootPc = pcOf(randomOf(tier < 3 ? WHITE_ROOTS : ROOTS));
        const notes = chordMidi(rootPc, t2.id, 4, inv);
        return { label: `${nameOf(rootPc)}${t2.symbol} · ${POS[inv]}`,
          expect: notes, byPitchClass: false, play: notes };
      };
      if (tier >= 7) {
        const chain = chordChain(tier - 5, one);
        return { prompt: chain.chords.map((c) => c.label).join('  →  '),
          sub: 'Exact notes, in order, release between chords', ...chain };
      }
      const c = one();
      return { prompt: c.label, sub: 'Play the exact notes — register matters here',
        expect: c.expect, mode: 'chord', byPitchClass: false, play: c.play };
    },
  },

  /* ───────────────────────────────────────────────────────── seventh-drill */
  'seventh-drill': {
    describe: (t) => rung(t, [
      'maj7 and dominant 7, white roots',
      'm7 joins, any root',
      'Half-diminished and dim7 join',
      'Minor-major 7 and 6th chords join',
      'Exact register',
    ]) || `Chains of ${t - 4} seventh chords`,
    make: (app, tier) => {
      const quals = ladder(tier, [
        ['maj7', 'dom7'], ['maj7', 'dom7', 'min7'],
        ['maj7', 'dom7', 'min7', 'min7b5', 'dim7'],
        ['maj7', 'dom7', 'min7', 'min7b5', 'dim7', 'minMaj7', 'maj6', 'min6'],
      ]) || ['maj7', 'dom7', 'min7', 'min7b5', 'dim7', 'minMaj7', 'maj6', 'min6'];
      const rootPool = tier === 1 ? WHITE_ROOTS.map(pcOf) : ROOTS.map(pcOf);
      const one = () => {
        const t2 = typeById(randomOf(quals));
        const rootPc = randomOf(rootPool);
        return { label: `${nameOf(rootPc)}${t2.symbol}`, name: t2.name,
          expect: tier === 5 ? chordMidi(rootPc, t2.id, 4) : chordPcs(rootPc, t2.id),
          byPitchClass: tier !== 5, play: chordMidi(rootPc, t2.id, 4) };
      };
      if (tier >= 6) {
        const chain = chordChain(tier - 4, one);
        return { prompt: chain.chords.map((c) => c.label).join('  →  '),
          sub: 'Play each in order; release between chords', ...chain };
      }
      const c = one();
      return { prompt: c.label, sub: c.name, expect: c.expect,
        mode: 'chord', byPitchClass: c.byPitchClass, play: c.play };
    },
  },

  /* ──────────────────────────────────────────────────────── extended-drill */
  'extended-drill': {
    describe: (t) => rung(t, [
      'Ninth chords (maj9, m9, 9)',
      'Altered ninths: 7♭9 and 7♯9',
      '7♯11 and 13 join',
      'Guide tones + one extension (rootless feel)',
    ]) || `Chains of ${t - 3} extended chords`,
    make: (app, tier) => {
      const quals = ladder(tier, [
        ['maj9', 'min9', 'dom9'],
        ['maj9', 'min9', 'dom9', 'dom7b9', 'dom7s9'],
        ['maj9', 'min9', 'dom9', 'dom7b9', 'dom7s9', 'dom7s11', 'dom13'],
      ]) || ['maj9', 'min9', 'dom9', 'dom7b9', 'dom7s9', 'dom7s11', 'dom13'];

      const one = () => {
        const t2 = typeById(randomOf(quals));
        const rootPc = pcOf(randomOf(tier === 1 ? CORE_KEYS : ROOTS));
        if (tier === 4) {
          // Rootless: 3rd, 7th, and the color tone — the jazz comping voicing.
          const iv = t2.intervals;
          const picks = [iv[1], iv[3] ?? iv[2], iv[iv.length - 1]];
          const pcs = [...new Set(picks.map((x) => (rootPc + x) % 12))];
          return { label: `${nameOf(rootPc)}${t2.symbol} (rootless)`,
            expect: pcs, byPitchClass: true,
            play: pcs.map((p) => 60 + p) };
        }
        return { label: `${nameOf(rootPc)}${t2.symbol}`,
          expect: [...new Set(t2.intervals.map((x) => (rootPc + x) % 12))],
          byPitchClass: true, play: chordMidi(rootPc, t2.id, 4) };
      };
      if (tier >= 5) {
        const chain = chordChain(tier - 3, one);
        return { prompt: chain.chords.map((c) => c.label).join('  →  '),
          sub: 'Play each in order; release between chords', ...chain };
      }
      const c = one();
      return { prompt: c.label,
        sub: tier === 4 ? 'Rootless: 3rd + 7th + color tone only' : 'All chord tones, any octaves',
        expect: c.expect, mode: 'chord', byPitchClass: true, play: c.play };
    },
  },

  /* ──────────────────────────────────────────────────────── chord-spelling */
  'chord-spelling': {
    choice: true,
    timedFromTier: 4,
    describe: (t) => rung(t, [
      'Spell major and minor triads',
      'Diminished and augmented join',
      'Seventh chords',
      'Timed — the clock starts',
    ]) || `Extended chords · ${clockText(t, 4)}`,
    make: (app, tier) => {
      const quals = ladder(tier, [
        ['maj', 'min'], ['maj', 'min', 'dim', 'aug'],
        ['maj', 'min', 'dim', 'aug', 'maj7', 'dom7', 'min7'],
        ['maj7', 'dom7', 'min7', 'min7b5', 'dim7'],
      ]) || ['maj7', 'dom7', 'min7', 'min7b5', 'dim7', 'maj9', 'dom7b9', 'min9'];
      const t2 = typeById(randomOf(quals));
      const rootPc = pcOf(randomOf(tier === 1 ? WHITE_ROOTS : ROOTS));
      const spell = (pcs) => pcs.map(nameOf).join(' – ');
      const right = spell(t2.intervals.map((x) => (rootPc + x) % 12));

      // Wrong options: same root, different quality — the confusable set.
      const others = shuffle(CHORD_TYPES.filter((c) => c.id !== t2.id && c.intervals.length === t2.intervals.length))
        .slice(0, 3)
        .map((c) => spell(c.intervals.map((x) => (rootPc + x) % 12)));
      return {
        prompt: `${nameOf(rootPc)}${t2.symbol}`,
        sub: `Which notes make up this ${t2.name.toLowerCase()} chord?`,
        options: shuffle([right, ...new Set(others)].slice(0, 4)),
        answer: right,
      };
    },
  },

  /* ────────────────────────────────────────────────────────────── arpeggio */
  arpeggio: {
    describe: (t) => rung(t, [
      'Major arpeggios, white roots',
      'Major and minor, any root',
      'Diminished and augmented join',
      'Seventh-chord arpeggios',
      'Two octaves',
      'Up AND down',
    ]) || (runsAt(t, 5) > 1
      ? `${runsAt(t, 5)} arpeggios back to back, ${octavesAt(t, 5)} octaves each`
      : `${octavesAt(t, 5)} octaves, up and down`),
    make: (app, tier) => {
      const quals = ladder(tier, [
        ['maj'], ['maj', 'min'], ['maj', 'min', 'dim', 'aug'],
      ]) || ['maj', 'min', 'dim', 'aug', 'maj7', 'min7', 'dom7'];
      const octaves = tier < 5 ? 1 : octavesAt(tier, 5);
      const runs = tier < 5 ? 1 : runsAt(tier, 5);

      // One arpeggio, spanning `octaves` and starting low enough to fit.
      const one = () => {
        const t2 = typeById(randomOf(quals));
        const rootPc = pcOf(randomOf(tier === 1 ? WHITE_ROOTS : ROOTS));
        let start = 4;
        while (start > 1 && (start + 1) * 12 + rootPc + octaves * 12 > KB_HIGH) start -= 1;
        let up = [];
        for (let o = 0; o < octaves; o++) {
          up.push(...t2.intervals.map((x) => (start + o + 1) * 12 + rootPc + x));
        }
        up.push((start + octaves + 1) * 12 + rootPc);
        up = up.filter((n) => n >= KB_LOW && n <= KB_HIGH);
        return { label: `${nameOf(rootPc)}${t2.symbol}`,
          notes: tier >= 6 ? [...up, ...up.slice(0, -1).reverse()] : up };
      };

      const picks = Array.from({ length: runs }, one);
      const notes = picks.flatMap((p) => p.notes);
      return {
        prompt: `${picks.map((p) => p.label).join('  →  ')} arpeggio${runs > 1 ? 's' : ''}`
          + `${octaves > 1 ? ` · ${octaves} oct` : ''}${tier >= 6 ? ' · up & down' : ''}`,
        sub: runs > 1 ? `Play all ${runs} arpeggios in order` : 'Play the notes in order',
        expect: notes, mode: 'sequence', byPitchClass: false,
        labels: notes.map((n) => nameOf(n % 12)),
      };
    },
  },
};
