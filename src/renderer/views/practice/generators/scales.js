/**
 * generators/scales.js — scale-runner and mode-runner drill generators.
 * Extracted intact from the original views/practice.js; no behavior changes.
 */
import { realiseScale, findScale, randomOf } from '../../../lib/theory.js';
import { ROOTS, WHITE_ROOTS, CORE_KEYS, nameOf, octavesAt, runsAt, fittedRun, rung } from '../tier-helpers.js';

export const scalesGenerators = {

  /* ─────────────────────────────────────────────────────────── scale-runner */
  'scale-runner': {
    describe: (t) => rung(t, [
      'C major, one octave',
      'G, D and F major',
      'All twelve majors',
      'Natural, harmonic and melodic minors',
      'Blues and pentatonic scales',
      'Two octaves, any of the above',
      'Random scale from the full library',
    ]) || (runsAt(t, 6) > 1
      ? `${runsAt(t, 6)} scales back to back, ${octavesAt(t, 6)} octaves each`
      : `${octavesAt(t, 6)} octaves, full library`),
    make: (app, tier) => {
      let scale, root;
      const majors = () => findScale(app.scales, 'major-scales');
      if (tier === 1) { scale = majors(); root = 'C'; }
      else if (tier === 2) { scale = majors(); root = randomOf(['G', 'D', 'F']); }
      else if (tier === 3) { scale = majors(); root = randomOf(ROOTS); }
      else if (tier === 4) {
        scale = findScale(app.scales, randomOf(['minor-scales', 'harmonic-minor-scales', 'melodic-minor-scales']));
        root = randomOf(CORE_KEYS);
      } else if (tier === 5) {
        scale = findScale(app.scales, randomOf(['major-blues', 'minor-blues', 'major-scales', 'minor-scales']));
        root = randomOf(ROOTS);
      } else {
        scale = tier >= 7 ? randomOf(app.scales)
          : findScale(app.scales, randomOf(['major-scales', 'minor-scales', 'harmonic-minor-scales', 'major-blues', 'minor-blues']));
        root = randomOf(ROOTS);
      }
      const octaves = tier < 6 ? 1 : octavesAt(tier, 6);
      const runs = tier < 6 ? 1 : runsAt(tier, 6);

      // Each run is an independent scale once the octave span has maxed out,
      // so the drill keeps growing after the keyboard stops being able to.
      const picks = [{ scale, root }];
      for (let i = 1; i < runs; i++) {
        picks.push({ scale: tier >= 7 ? randomOf(app.scales) : scale, root: randomOf(ROOTS) });
      }

      const notes = [], labels = [];
      let first = null;
      for (const p of picks) {
        const r = realiseScale(p.scale, p.root);
        if (!first) first = r;
        const run = fittedRun(r.root.pc, p.scale.steps, octaves);
        run.forEach((n, i) => {
          notes.push(n);
          labels.push(r.names[i % r.names.length] ?? nameOf(n % 12));
        });
      }
      const single = picks.length === 1;
      return {
        prompt: single
          ? `${root} ${scale.name}${octaves > 1 ? ` · ${octaves} octaves` : ''}`
          : picks.map((p) => `${p.root} ${p.scale.name}`).join('  →  '),
        sub: single ? 'Play the scale ascending' : `Play all ${runs} scales ascending, one after another`,
        expect: notes, mode: 'sequence', byPitchClass: false, labels,
        fingering: single && octaves === 1 && first.fingering.rh
          && first.fingering.rh.length >= notes.length ? first.fingering.rh : null,
      };
    },
  },

  /* ─────────────────────────────────────────────────────────── mode-runner */
  'mode-runner': {
    describe: (t) => rung(t, [
      'White-key modes (D Dorian, E Phrygian…)',
      'The seven modes from any root',
      'Variant families: Lydian dominant, altered…',
      'The entire 63-scale library',
      'Two octaves',
    ]) || (runsAt(t, 5) > 1
      ? `${runsAt(t, 5)} modes back to back, ${octavesAt(t, 5)} octaves each`
      : `${octavesAt(t, 5)} octaves, full library`),
    make: (app, tier) => {
      const MODES = ['ionian-scales', 'dorian-scales', 'phrygian-scales', 'lydian-scales',
        'mixolydian-scales', 'aeolian-scales', 'locrian-scales'];
      const VARIANTS = [...MODES, 'lydian-dominant-scales', 'super-locrian-altered-scale',
        'harmonic-major', 'phrygian-dominant', 'hungarian-minor', 'mi-sheberach-scales-dorian-4'];
      let scale, root;
      if (tier === 1) {
        const whiteMode = Math.floor(Math.random() * 7);
        scale = findScale(app.scales, MODES[whiteMode]);
        root = WHITE_ROOTS[whiteMode];
      } else if (tier === 2) { scale = findScale(app.scales, randomOf(MODES)); root = randomOf(ROOTS); }
      else if (tier === 3) { scale = findScale(app.scales, randomOf(VARIANTS)); root = randomOf(CORE_KEYS); }
      else { scale = randomOf(app.scales); root = randomOf(ROOTS); }
      const octaves = tier < 5 ? 1 : octavesAt(tier, 5);
      const runs = tier < 5 ? 1 : runsAt(tier, 5);

      const picks = [{ scale, root }];
      for (let i = 1; i < runs; i++) picks.push({ scale: randomOf(app.scales), root: randomOf(ROOTS) });

      const notes = [], labels = [];
      for (const p of picks) {
        const r = realiseScale(p.scale, p.root);
        fittedRun(r.root.pc, p.scale.steps, octaves).forEach((n, i) => {
          notes.push(n);
          labels.push(r.names[i % r.names.length] ?? nameOf(n % 12));
        });
      }
      const single = picks.length === 1;
      return {
        prompt: single
          ? `${root} ${scale.name}${octaves > 1 ? ` · ${octaves} octaves` : ''}`
          : picks.map((p) => `${p.root} ${p.scale.name}`).join('  →  '),
        sub: single
          ? (scale.degrees.length ? scale.degrees.join(' · ') : `steps ${scale.steps.join('-')}`)
          : `Play all ${runs} modes ascending, one after another`,
        expect: notes, mode: 'sequence', byPitchClass: false, labels,
      };
    },
  },
};
