/**
 * Module 3 — First Music
 * Fully hand-authored (Sections 3.1–3.3, 18 lessons) — see each section
 * file's own header for its conversion notes and check-drafting provenance.
 *
 * duration is a real hand judgment, not the schema default: 18 lessons
 * spanning three genuinely different skill types — rhythm/pulse work (3.1),
 * hand-position/finger-independence drilling (3.2), and the first real
 * repertoire with two-hand coordination (3.3) — plus 3 Structured Practice
 * Protocols and Gate C's own recorded-performance requirement, all of which
 * need repeated physical practice rather than one-time reading. Comparable
 * in scope to Modules 1–2 (both 1-2 weeks), so the same estimate applies.
 */
import s3_1 from './sections/3.1.js';
import s3_2 from './sections/3.2.js';
import s3_3 from './sections/3.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l3',
  number: 3,
  title: 'First Music',
  skillBand: 'Early Elementary',
  duration: '1–2 weeks',
  summary: 'Feel pulse before counting, park the hands in C position, and play the first songs by ear.',
  modules: [s3_1, s3_2, s3_3],
});
