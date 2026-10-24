/**
 * Module 7 — Time
 * Fully hand-authored (Sections 7.1–7.3, 16 lessons) — see each section
 * file's own header for its own conversion notes and check-drafting
 * provenance.
 *
 * duration is a real hand judgment, not the schema default: 16 lessons
 * covering note values/rests/dots/ties and the Rhythm Words system (7.1),
 * simple meters 2/4-3/4-4/4 (7.2), and compound meter (6/8) plus straight/
 * swing/syncopation feel (7.3). Comparable in lesson count to Module 6, but
 * this module is read-and-feel literacy rather than repertoire memorization
 * with a recorded-performance gate, and it carries no gate of its own —
 * "1 week" fits better than Module 6's "1–2 weeks".
 */
import s7_1 from './sections/7.1.js';
import s7_2 from './sections/7.2.js';
import s7_3 from './sections/7.3.js';
import { level } from '../schema.js';

export default level({
  id: 'piano-l7',
  number: 7,
  title: 'Time',
  skillBand: 'Early Elementary → Elementary',
  duration: '1 week',
  summary: 'Read values, rests, dots, and ties; keep 2/4, 3/4, 4/4, and a first 6/8; feel straight, swing, and syncopation.',
  modules: [s7_1, s7_2, s7_3],
});
