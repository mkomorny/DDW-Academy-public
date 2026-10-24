/**
 * verify-theory.mjs — the theory oracle: machine-checks a step's `asserts`
 * array against lib/theory.js's synchronous exports. Shared by
 * tools/validate-course.mjs (checks content already wired into the course)
 * and tools/author/run.mjs (checks a draft before it's wired in at all) —
 * one implementation, so the two can never quietly disagree about what
 * counts as a correct scale/interval/key-signature claim.
 */
import { pcOf, toMidi, keyByName } from '../../../src/renderer/lib/theory.js';

function splitNoteOctave(name) {
  const m = /^([A-Ga-g][#b]?)(-?\d+)$/.exec(String(name));
  if (!m) return [name, NaN];
  return [m[1], parseInt(m[2], 10)];
}

/**
 * @param {object[]} asserts
 * @returns {{ ok: boolean, problems: string[] }} problems is empty iff every
 *   assertion checked out; ok is false only on a structural error (not an
 *   array, missing assert type) that prevented checking at all.
 */
export function checkAssertions(asserts) {
  const problems = [];
  if (!Array.isArray(asserts)) return { ok: false, problems: ['asserts must be an array'] };

  asserts.forEach((a, i) => {
    const W = `assert[${i}]`;
    if (!a || !a.assert) { problems.push(`${W}: assertion with no "assert" type`); return; }

    if (a.assert === 'pcSet') {
      const rootPc = pcOf(a.root);
      if (rootPc === undefined) { problems.push(`${W}: unparseable root "${a.root}"`); return; }
      if (!Array.isArray(a.semitones) || !a.semitones.length) { problems.push(`${W}: pcSet needs a non-empty semitones array`); return; }
      if (!Array.isArray(a.notes) || !a.notes.length) { problems.push(`${W}: pcSet needs a non-empty notes array`); return; }
      const computed = new Set(a.semitones.map((s) => ((rootPc + s) % 12 + 12) % 12));
      const claimed = new Set(a.notes.map((n) => pcOf(n)));
      if (claimed.has(undefined)) { problems.push(`${W}: notes array contains an unparseable note name`); return; }
      const same = computed.size === claimed.size && [...computed].every((pc) => claimed.has(pc));
      if (!same) {
        problems.push(`${W}: pcSet mismatch — root ${a.root} + semitones ${JSON.stringify(a.semitones)} -> {${[...computed].sort((x, y) => x - y).join(',')}}, but notes ${JSON.stringify(a.notes)} -> {${[...claimed].sort((x, y) => x - y).join(',')}}`);
      }
    } else if (a.assert === 'interval') {
      const from = toMidi(...splitNoteOctave(a.from));
      const to = toMidi(...splitNoteOctave(a.to));
      if (from == null || to == null || Number.isNaN(from) || Number.isNaN(to)) { problems.push(`${W}: unparseable interval endpoints "${a.from}" / "${a.to}"`); return; }
      const actual = Math.abs(to - from);
      if (actual !== a.semitones) problems.push(`${W}: interval mismatch — ${a.from} to ${a.to} is ${actual} semitones, assertion claims ${a.semitones}`);
    } else if (a.assert === 'keySignature') {
      const k = keyByName(a.key);
      if (!k) { problems.push(`${W}: unknown major key "${a.key}"`); return; }
      if (k.sharps !== a.sharps) problems.push(`${W}: keySignature mismatch — ${a.key} major has ${k.sharps} sharps in MAJOR_KEYS, assertion claims ${a.sharps}`);
    } else {
      problems.push(`${W}: unknown assertion type "${a.assert}"`);
    }
  });

  return { ok: true, problems };
}
