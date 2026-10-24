/**
 * Module 1 — The Player
 * Fully hand-authored (Sections 1.1–1.3, 22 lessons) — see each section
 * file's own header for its conversion notes and check-drafting provenance.
 */
import s1_1 from './sections/1.1.js';
import s1_2 from './sections/1.2.js';
import s1_3 from './sections/1.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l1',
  number: 1,
  title: 'The Player',
  skillBand: 'Pre–Early Elementary',
  duration: '1–2 weeks',
  summary: 'Choose the instrument, sit without pain, and build a practice you can keep.',
  modules: [s1_1, s1_2, s1_3],
});
