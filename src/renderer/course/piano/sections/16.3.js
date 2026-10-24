/**
 * Section 16.3 — The Master Capstone Recital and Final Course Certification (Gate K)
 * Module 16 — Modes, Studio, and Capstone
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_16_Modes_Studio_Capstone/
 * Section_16.3_Master_Capstone_Recital_And_Gate_K.md), read in full before
 * authoring.
 *
 * Conversion notes:
 * - §2's 4 citations match the scaffold's sources exactly.
 * - Structural note: unlike every prior section, this file has no separate
 *   §5 Structured Practice Protocols or §6 Self-Assessment — the capstone's
 *   own §4 "GATE K: MASTER GRADUATION CERTIFICATE AUDIT" (4 numbered items)
 *   serves both roles at once, since the entire section IS the course's
 *   final practice-and-assessment act. That §4 content became Lesson
 *   16.3.2's own second step (see below) rather than a separate closing
 *   callout, since Learning Outcome 3 ("pass the Master Exit Audit … Gates A
 *   through K") needs its own graded check distinct from the general
 *   11-gate summary table that opens the same lesson.
 * - Lesson 16.3.2 therefore carries 2 steps: step 1 is the Gate-by-gate
 *   summary matrix (Gates A–K, one row each — the first time Gate K's own
 *   requires text appears anywhere, feeding piano/index.js's GATES entry);
 *   step 2 is the Gate K Master Graduation Certificate Audit itself.
 * - §4's own architecture diagram (3-piece recital: classical reading,
 *   accompaniment étude, lead-sheet/modal piece) and the "GRADUATION STATUS:
 *   CERTIFIED" banner are narrative framing, not separate teachable claims —
 *   folded into 16.3.2's step 2 prose rather than given their own blocks.
 * - No `asserts` anywhere — this section is performance psychology, an exit
 *   audit summary, and forward-looking repertoire pointers, not new scale/
 *   chord/interval/key-signature claims (those were already asserted where
 *   first taught, across Modules 1–16).
 * - checkpoints[] replaces the scaffold's generic placeholder with the real
 *   4-item Gate K audit (mirrors §4 exactly, giving Gate K a `requires`
 *   string for piano/index.js's GATES).
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, sources, mcq } from '../../schema.js';

export default module_({
  id: 'piano-m16-3',
  code: '16.3',
  title: 'The Master Capstone Recital and Final Course Certification (Gate K)',
  outcomes: [
    'Curate, rehearse, and perform a cohesive three-piece graduation programme: one classical reading piece, one multi-pattern accompaniment étude, and one lead-sheet or modal improvisation.',
    'Execute a continuous, unedited recital recording in single-take conditions.',
    'Pass the Master Exit Audit across Gates A–K.',
    'Write a next-six-months plan into intermediate repertoire (the textbook names Bach inventions, classical sonatas, Chopin nocturnes, and jazz standards as *direction*, not required scores).',
  ],
  sources: [
    'Piano Skill Levels Explained.pdf',
    'The Hoffman Method of Learning Piano.pdf',
    'Tips on how to practice piano.pdf',
    'A perfect guide to learning piano.pdf',
  ],
  practiceFocus: ['Capstone programme recorded; honest placement written (Gate K).'],
  lessons: [
    lesson(
      'piano-l16-3-1',
      'Concert Performance Psychology & Protocol',
      [
        step(
          'The Three Rules of Recital Protocol',
          [
            prose(
              '<p>This is the culminating act of "Piano Playing for Beginners": the Master Capstone Graduation Recital. Three simple rules govern how the performance itself is conducted.</p>',
            ),
            list(
              [
                'Pre-Performance Silence: sit at the bench in silence for 5 seconds before beginning. Establish breathing, seat geometry, and mental tempo.',
                'Unbroken Focus Across Pieces: transition between the three repertoire selections with deliberate poise.',
                'The Unbroken Clock: if a minor slip occurs, never restart the measure. Keep the metric clock moving forward.',
              ],
              true,
            ),
            sources(['The Hoffman Method of Learning Piano.pdf', 'Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the three simple rules for the Master Capstone Graduation Recital performance, what must you do if a minor slip occurs during a piece?',
            ['Restart the measure immediately', 'Keep the metric clock moving forward', 'Pause for 5 seconds to recover', 'Transition to the next piece early'],
            1,
            'The step text states under "The Unbroken Clock" that if a minor slip occurs, never restart the measure and instead keep the metric clock moving forward.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l16-3-2',
      'The Master Exit Audit Matrix (Gates A through K)',
      [
        step(
          'The Eleven-Gate Competency Matrix',
          [
            prose(
              '<p>Graduation requires passing the Master Exit Audit: a review across every one of the eleven gates earned throughout this course.</p>',
            ),
            table(
              ['Gate', 'Core Competency Domain', 'Definitive Exit Standard Verified'],
              [
                ['A', 'Postural Mechanics', '3-point bench geometry, arm weight.'],
                ['B', 'Keyboard Geography', 'All 88 keys, Middle C, accidentals.'],
                ['C', 'Aural Foundations', 'Sing-then-find, Hot Cross Buns / Ode.'],
                ['D', 'Five-Finger Fluency', 'Major/Minor pentascales, I–V harmony.'],
                ['E', 'Bilateral Independence', '2 complete two-hand pieces recorded.'],
                ['F', 'Touch & Expression', 'Dynamic staircase (pp–ff), articulations.'],
                ['G', 'Reading & Intervals', 'Intervals m2–P8, 0–2 key signatures.'],
                ['H', 'The Scale System', '12 Majors, 3 Minor forms, Chromatic.'],
                ['I', 'Accompaniment Craft', 'Multi-pattern fusion, Alberti bass.'],
                ['J', 'Lead Sheet Realization', '3-chorus lead sheet arrangement.'],
                ['K', 'Master Graduation', '3-Piece Capstone Recital complete.'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'How many gates must be reviewed in the Master Exit Audit?',
            ['8', '10', '11', '12'],
            2,
            'The step text states that Graduation requires passing the Master Exit Audit: a review across every one of the eleven gates earned throughout this course.',
          ),
        ),
        step(
          'Gate K: The Master Graduation Certificate Audit',
          [
            prose(
              '<p>To achieve certified graduation from "Piano Playing for Beginners," the student must verify all four of the following:</p>',
            ),
            list(
              [
                'Complete 3-Piece Recital Recorded: an unedited, continuous concert performance containing one classical score-reading piece, one multi-pattern accompaniment étude, and one self-directed lead sheet or modal arrangement.',
                'Theory & Harmonic Mastery: can construct any Major, Minor, Diminished, or Augmented triad; can voice-lead diatonic Roman numeral progressions (I, ii, IV, V, vi); can diagram the 12-key Circle of Fifths and the 7 Church Modes.',
                'Technical & Biomechanical Rigor: executes relaxed gravitational arm weight, loose-wrist trampoline rebounds, flawless thumb-under passes, and clean syncopated pedaling without mud.',
                'Notation Literacy: reads Grand Staff notation fluently from Low C2 to High C6 inclusive of ledger lines and 0–2 key signatures.',
              ],
              true,
            ),
            sources(['Piano Skill Levels Explained.pdf', 'The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'According to the requirements for certified graduation from "Piano Playing for Beginners," what must the 3-Piece Recital Recorded contain?',
            [
              'Three classical score-reading pieces',
              'One classical score-reading piece, one multi-pattern accompaniment étude, and one self-directed lead sheet or modal arrangement',
              'One multi-pattern accompaniment étude and two lead sheets',
              'One classical piece and two modal improvisations',
            ],
            1,
            'The step text explicitly states that the unedited, continuous concert performance must contain one classical score-reading piece, one multi-pattern accompaniment étude, and one self-directed lead sheet or modal arrangement.',
          ),
        ),
      ],
      { minutes: 14 },
    ),
    lesson(
      'piano-l16-3-3',
      'The Road Ahead: Intermediate Repertoire Trajectories',
      [
        step(
          'Where to Go Next',
          [
            prose(
              '<p>Graduation from this textbook marks the entry point into intermediate conservatory literature — a direction to grow toward, not a required score list.</p>',
            ),
            list([
              'Polyphonic Counterpoint: J.S. Bach Two-Part Inventions (BWV 772–786) and Little Preludes.',
              'Classical Sonata Form: full Sonatinas by Clementi, Kuhlau, and Beethoven (Op. 49).',
              'Romantic Lyricism: Frédéric Chopin Waltzes & Nocturnes, Robert Schumann Kinderszenen.',
              'Jazz & Contemporary Lead Sheets: The Real Book, Bill Evans rootless voicings, and modal improvisation.',
            ]),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'What does graduation from this textbook represent according to the text?',
            ['A required list of specific scores to perform', 'The entry point into intermediate conservatory literature', 'Completion of all piano study', 'Mastery of jazz improvisation only'],
            1,
            'The step text states that graduation marks the entry point into intermediate conservatory literature — a direction to grow toward, not a required score list.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m16-3-ex-a',
      type: 'Capstone recital',
      title: 'The Master Capstone Graduation Recital',
      prompt: 'Record a continuous, unedited, single-take performance of three pieces: (1) a classical score-reading piece (Clementi Sonatina Op. 36 No. 1 theme, or Petzold/Bach Minuet in G Major), (2) a 16-to-32 bar multi-pattern accompaniment étude moving from pulsing blocked chords to Alberti broken chords to a cross-hand sweep, and (3) a self-arranged lead sheet with Model 3 harmonized voicings or a modal improvisation in D Dorian or F Lydian. Never restart a measure after a minor slip — keep the metric clock moving forward.',
    },
  ],
  checkpoints: [
    'Complete 3-Piece Recital Recorded: an unedited, continuous concert performance containing one classical score-reading piece, one multi-pattern accompaniment étude, and one self-directed lead sheet or modal arrangement.',
    'Theory & Harmonic Mastery: can construct any Major, Minor, Diminished, or Augmented triad; can voice-lead diatonic Roman numeral progressions (I, ii, IV, V, vi); can diagram the 12-key Circle of Fifths and the 7 Church Modes.',
    'Technical & Biomechanical Rigor: executes relaxed gravitational arm weight, loose-wrist trampoline rebounds, flawless thumb-under passes, and clean syncopated pedaling without mud.',
    'Notation Literacy: reads Grand Staff notation fluently from Low C2 to High C6 inclusive of ledger lines and 0–2 key signatures.',
  ],
});
