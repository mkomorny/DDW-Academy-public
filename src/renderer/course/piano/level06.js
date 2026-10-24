/**
 * Module 6 — Two Hands
 * Fully hand-authored (Sections 6.1–6.3, 16 lessons) — see each section
 * file's own header for its own conversion notes and check-drafting
 * provenance.
 *
 * duration is a real hand judgment, not the schema default: 16 lessons that
 * take the learner from the hands-separate/together practice method (6.1)
 * through the four contrapuntal motion types and a daily coordination
 * circuit (6.2) to two fully recorded two-hand pieces and the Gate E
 * rubric (6.3) — comparable in scope to Module 5 (also 1-2 weeks), so the
 * same estimate applies.
 */
import s6_1 from './sections/6.1.js';
import s6_2 from './sections/6.2.js';
import s6_3 from './sections/6.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l6',
  number: 6,
  title: 'Two Hands',
  skillBand: 'Early Elementary',
  duration: '1–2 weeks',
  summary: 'Use hands-separate then hands-together as a method, then record two complete two-hand pieces.',
  modules: [s6_1, s6_2, s6_3],
});
