/**
 * Sanity checks for the drum manifest and (once any exist) drumGrid/padMap
 * course content. Run: node tools/test-drums.mjs
 *
 * drums-manifest.js has no Web Audio or DOM dependency, so it imports
 * cleanly under plain Node, same as instruments.js/theory.js. This does NOT
 * exercise lib/drums.js's actual synthesis (that needs a real AudioContext,
 * i.e. a browser) — it checks the DATA every synth call depends on: that
 * every voice resolves in every kit, and that the parameters are the kind of
 * numbers that produce sound rather than silence or a Web Audio exception
 * (e.g. a zero or negative decay time throws on exponentialRampToValueAtTime).
 */
import { VOICES, KITS, DEFAULT_KIT, TYPE_DEFAULTS, chokeGroupOf, voiceParams, CHOKE_GROUPS } from '../src/renderer/lib/drums-manifest.js';

let pass = 0;
let fail = 0;
const ok = (label, cond, detail = '') => {
  if (cond) { pass++; } else { fail++; console.log(`FAIL ${label}${detail ? '  — ' + detail : ''}`); }
};

/* --------------------------------------------------------------- kits --- */

ok('at least one kit defined', Object.keys(KITS).length > 0);
ok('DEFAULT_KIT resolves to a real kit', !!KITS[DEFAULT_KIT]);

for (const [kitId, kit] of Object.entries(KITS)) {
  const label = `[${kitId}]`;
  ok(`${label} has a name`, typeof kit.name === 'string' && kit.name.length > 0);
  ok(`${label} declares a kind`, kit.kind === 'synth' || kit.kind === 'sample');

  for (const voice of VOICES) {
    const entry = kit.voices[voice];
    ok(`${label} defines voice "${voice}"`, !!entry, 'missing from kit.voices');
    if (!entry) continue;
    ok(`${label}.${voice} has a known synth type`, !!TYPE_DEFAULTS[entry.type], `type="${entry.type}"`);
  }

  // no stray voices in the kit that aren't in the canonical VOICES list
  const extra = Object.keys(kit.voices).filter((v) => !VOICES.includes(v));
  ok(`${label} has no voices outside the canonical VOICES list`, extra.length === 0, extra.join(', '));
}

/* -------------------------------------------------------- choke groups -- */

for (const [group, members] of Object.entries(CHOKE_GROUPS)) {
  ok(`choke group "${group}" has at least 2 members`, members.length >= 2);
  for (const m of members) {
    ok(`choke group "${group}" member "${m}" is a real voice`, VOICES.includes(m));
  }
}
ok('chokeGroupOf resolves hatClosed/hatOpen to the same group',
  chokeGroupOf('hatClosed') === chokeGroupOf('hatOpen') && chokeGroupOf('hatClosed') !== null);
ok('chokeGroupOf returns null for a voice in no group', chokeGroupOf('kick') === null);

/* --------------------------------------------------- parameter sanity --- */
// Numbers that would make Web Audio throw or produce silence, per synth type.

for (const kitId of Object.keys(KITS)) {
  for (const voice of VOICES) {
    const p = voiceParams(kitId, voice);
    const label = `[${kitId}].${voice}`;
    if (!p) continue;

    switch (p.type) {
      case 'kick':
        ok(`${label} f0 > f1 > 0 (falling pitch sweep)`, p.f0 > 0 && p.f1 > 0 && p.f0 >= p.f1);
        ok(`${label} pitchDecay/ampDecay > 0`, p.pitchDecay > 0 && p.ampDecay > 0);
        break;
      case 'snare':
        ok(`${label} toneFreq/noiseFreq > 0`, p.toneFreq > 0 && p.noiseFreq > 0);
        ok(`${label} toneDecay/noiseDecay > 0`, p.toneDecay > 0 && p.noiseDecay > 0);
        break;
      case 'clap':
        ok(`${label} bursts >= 2`, p.bursts >= 2);
        ok(`${label} burstGapSec/tailDecay > 0`, p.burstGapSec > 0 && p.tailDecay > 0);
        break;
      case 'hat':
        ok(`${label} has ratios array`, Array.isArray(p.ratios) && p.ratios.length > 0);
        ok(`${label} baseFreq/decay/hpFreq > 0`, p.baseFreq > 0 && p.decay > 0 && p.hpFreq > 0);
        break;
      case 'tom':
        ok(`${label} f0 >= f1 > 0`, p.f0 > 0 && p.f1 > 0 && p.f0 >= p.f1);
        ok(`${label} decay > 0`, p.decay > 0);
        break;
      case 'rim':
        ok(`${label} freq/decay > 0`, p.freq > 0 && p.decay > 0);
        break;
      case 'cowbell':
        ok(`${label} f1/f2/decay > 0`, p.f1 > 0 && p.f2 > 0 && p.decay > 0);
        break;
      default:
        ok(`${label} unknown type not sanity-checked`, false, p.type);
    }
  }
}

/* ---------------------------------------------- course content (if any) -- */
// Once drumGrid/padMap blocks exist in course content, every voice/kit they
// reference must be real. Written now so Phase 6 authoring is checked from
// day one instead of silently shipping a typo'd voice id.

try {
  const { ALL_LESSONS, flatBlocks } = await import('../src/renderer/course/index.js');
  let drumGridCount = 0;
  let padMapCount = 0;
  for (const lesson of ALL_LESSONS) {
    for (const b of flatBlocks(lesson)) {
      if (b.type === 'drums') {
        drumGridCount++;
        for (const lane of b.lanes || []) {
          ok(`lesson ${lesson.id} drumGrid references real voice "${lane.voice}"`, VOICES.includes(lane.voice));
        }
        if (b.kit) ok(`lesson ${lesson.id} drumGrid references real kit "${b.kit}"`, !!KITS[b.kit]);
      }
      if (b.type === 'pads') {
        padMapCount++;
        for (const pad of b.pads || []) {
          if (pad.voice) ok(`lesson ${lesson.id} padMap references real voice "${pad.voice}"`, VOICES.includes(pad.voice));
        }
      }
    }
  }
  console.log(`  (checked ${drumGridCount} drumGrid block(s), ${padMapCount} padMap block(s) across the course)`);
} catch (err) {
  console.log(`  (skipping course-content check — course/index.js not importable yet: ${err.message})`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
