/**
 * Module 5 — Five-Finger Fluency
 * Fully hand-authored (Sections 5.1–5.3, 16 lessons) — see each section
 * file's own header for its own conversion notes and check-drafting
 * provenance.
 *
 * duration is a real hand judgment, not the schema default: 16 lessons
 * covering the technical foundation the rest of the course builds on —
 * every major and minor pentascale in both hands (5.1), black-key roots and
 * the first lateral position shifts and thumb-under mechanics (5.2), and
 * two-note harmonic intervals culminating in I/V accompaniment under a real
 * tune plus the Gate D rubric (5.3). Comparable in scope and technical
 * density to Module 4 (also 1-2 weeks), so the same estimate applies.
 */
import s5_1 from './sections/5.1.js';
import s5_2 from './sections/5.2.js';
import s5_3 from './sections/5.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l5',
  number: 5,
  title: 'Five-Finger Fluency',
  skillBand: 'Early Elementary',
  duration: '1–2 weeks',
  summary: 'Play major and minor pentascales and put I / V under a known tune.',
  modules: [s5_1, s5_2, s5_3],
});
