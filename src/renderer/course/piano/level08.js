/**
 * Module 8 — Touch and Expression
 * Fully hand-authored (Sections 8.1–8.3, 17 lessons) — see each section
 * file's own header for its own conversion notes and check-drafting
 * provenance.
 *
 * duration is a real hand judgment, not the schema default: 17 lessons
 * covering tone production, warm-up craft, and the Hanon safety protocol
 * (8.1), articulation touch types (8.2), and dynamics/tempo/mood vocabulary
 * culminating in a planned-and-performed known piece plus the Gate F rubric
 * (8.3). Comparable in scope to Module 6 (repertoire application plus a
 * recorded/performed gate), so the same "1–2 weeks" estimate applies.
 */
import s8_1 from './sections/8.1.js';
import s8_2 from './sections/8.2.js';
import s8_3 from './sections/8.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l8',
  number: 8,
  title: 'Touch and Expression',
  skillBand: 'Elementary',
  duration: '1–2 weeks',
  summary: 'Warm up honestly, choose articulation, and mark dynamics, tempo, and mood on a known piece.',
  modules: [s8_1, s8_2, s8_3],
});
