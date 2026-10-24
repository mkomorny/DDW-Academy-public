/**
 * Module 2 — The Keyboard
 * Fully hand-authored (Sections 2.1–2.3, 18 lessons) — see each section
 * file's own header for its conversion notes and check-drafting provenance.
 *
 * duration is a real hand judgment, not the schema default: 18 lessons of
 * mostly memorization/recognition content (key names, octave numbering,
 * enharmonics, half/whole steps) plus 4 Structured Practice Protocols that
 * need repeated tactile drilling to stick — comparable in scope to Module 1
 * (22 lessons, also practice-driven), so the same 1-2 week estimate applies.
 */
import s2_1 from './sections/2.1.js';
import s2_2 from './sections/2.2.js';
import s2_3 from './sections/2.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l2',
  number: 2,
  title: 'The Keyboard',
  skillBand: 'Early Elementary',
  duration: '1–2 weeks',
  summary: 'Name every reachable key and treat Middle C as a place, including the C3/C4 naming conflict.',
  modules: [s2_1, s2_2, s2_3],
});
