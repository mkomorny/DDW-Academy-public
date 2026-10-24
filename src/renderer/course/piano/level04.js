/**
 * Module 4 — The Page
 * Fully hand-authored (Sections 4.1–4.3, 17 lessons) — see each section
 * file's own header for its conversion notes and check-drafting provenance.
 *
 * duration is a real hand judgment, not the schema default: 17 lessons
 * covering three tightly sequential reading skills — staff/clef/guide-note
 * identification (4.1), interval reading and chunking (4.2), and full
 * hands-separate score literacy across both clefs with real note-value and
 * rest discipline (4.3) — that build directly on each other and need
 * repeated drilling (the flash-card guide-note drill, the step/skip
 * chanting drill, and two full reading études) rather than one-time
 * reading. Comparable in scope to Modules 1–3 (each 1-2 weeks), so the same
 * estimate applies.
 */
import s4_1 from './sections/4.1.js';
import s4_2 from './sections/4.2.js';
import s4_3 from './sections/4.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l4',
  number: 4,
  title: 'The Page',
  skillBand: 'Early Elementary',
  duration: '1–2 weeks',
  summary: 'Read beginner grand-staff music by landmarks, steps, and skips — not by counting every line from the bottom.',
  modules: [s4_1, s4_2, s4_3],
});
