/**
 * Section 13.2 — Sight-Reading Craft: Visual Chunking, Eye Discipline, and the 30-Second Scan
 * Module 13 — Reading II and Sight-Reading Craft
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_13_Reading_II_And_
 * Sight_Reading_Craft/Section_13.2_Sight_Reading_Craft_Chunking_Eye_
 * Discipline.md), read in full before authoring.
 *
 * Conversion notes:
 * - This section is entirely practice methodology (mode discipline, visual
 *   chunking categories, a scan checklist, a daily protocol) — no scale,
 *   chord, interval, or key-signature claim is made anywhere in it, so no
 *   step carries `asserts`, the same reasoning 12.1 and 12.2's
 *   technique/discipline-only steps already applied.
 * - §4's three Methodological Traps become a closing `callout('warning', …)`
 *   on 13.2.5, per the plan's mapping rule.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, callout, sources, mcq, multi, order } from '../../schema.js';

export default module_({
  id: 'piano-m13-2',
  code: '13.2',
  title: 'Sight-Reading Craft: Visual Chunking, Eye Discipline, and the 30-Second Scan',
  outcomes: [
    'State the fundamental operational distinction between Sight-Reading (unbroken real-time performance) and Repertoire Practice (isolated error correction).',
    'Enforce the Cardinal Law of Sight-Reading: The metric pulse must NEVER stop, stutter, or reset under any circumstance.',
    'Apply Visual Chunking: reading notes not as isolated letters (C–E–G) but as unified cognitive objects (triad shapes, scalar runs, interval leaps).',
    'Maintain Eye Discipline: locking gaze on the score 1 full measure ahead of the physical fingers without looking down at the hands.',
    'Execute the structured 30-Second Pre-Flight Scan Routine (Clef, Key, Meter, Roadblocks, Starting Hand Position).',
    'Implement the daily 3-Minute Sight-Reading Practice Protocol.',
  ],
  sources: [
    'How to read piano notes for beginners.pdf',
    'Tips on how to practice piano.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Eight new bars, first-take rules, 30-second scan first.'],
  lessons: [
    lesson(
      'piano-l13-2-1',
      'The Cardinal Law: The Pulse Never Dies',
      [
        step(
          'Time Is Inviolable',
          [
            prose(
              '<p>In professional ensemble, choral, and studio environments, a pianist who stops to correct a wrong note halts the entire production.</p>',
            ),
            callout(
              'key',
              'The Golden Rule',
              '<p>When sight-reading, time is inviolable. If a finger misses a note or plays a wrong accidental, you must never stop, hesitate, grimace, or restart. Sacrifice the note to preserve the beat.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the Golden Rule for sight-reading, what must a pianist do if they play a wrong note?',
            [
              'Stop and correct the note immediately',
              'Hesitate briefly then continue',
              'Never stop, hesitate, grimace, or restart',
              'Restart the piece from the beginning',
            ],
            2,
            'The step text states the Golden Rule: When sight-reading, time is inviolable. If a finger misses a note or plays a wrong accidental, you must never stop, hesitate, grimace, or restart.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l13-2-2',
      'Visual Chunking: Reading Shapes, Not Letters',
      [
        step(
          'The Three Primary Visual Chunks',
          [
            prose(
              '<p>An untrained reader reads letter-by-letter (C … then E … then G), causing massive cognitive lag. A trained pianist reads macro-chunks.</p>',
            ),
            table(
              ['Chunk type', 'How it is read'],
              [
                ['Interval shapes', 'Line to adjacent space = Step (2nd). Line to next line (or space to space) = Skip (3rd). Line to space skipping one line = Fourth (4th). Line to line skipping one line = Fifth (5th).'],
                ['Chord harmonic shapes', 'Three stacked lines (or three stacked spaces) = Root Triad. Two stacked lines with an offset note = Inverted Triad.'],
                ['Scalar runs', 'Continuous alternating line-space-line-space = a 5-finger or 1-octave scale run.'],
              ],
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          multi(
            'According to the table in the step text, which of the following are ways a trained pianist reads macro-chunks?',
            [
              'Line to adjacent space = Step (2nd)',
              'Three stacked lines (or three stacked spaces) = Root Triad',
              'Continuous alternating line-space-line-space = a 5-finger or 1-octave scale run',
              'Letter-by-letter (C … then E … then G)',
            ],
            [0, 1, 2],
            'The step text\'s table explicitly lists interval shapes, chord harmonic shapes, and scalar runs as the macro-chunk types a trained pianist reads, in direct contrast to the untrained letter-by-letter approach.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l13-2-3',
      'Eye Discipline: Looking One Measure Ahead',
      [
        step(
          'The Look-Ahead Cognitive Buffer',
          [
            prose(
              '<p>While the physical fingers play from muscle memory encoded moments earlier, the eyes and brain read ahead — parsing the notes, rhythm, and finger shifts of the next measure and pre-loading the motor buffer.</p>',
            ),
            callout(
              'key',
              'The Rule of the Fixed Gaze',
              '<p>Never look down at your hands while sight-reading. Trust your tactile proprioception — feeling the black and white key contours with your fingertips.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the Rule of the Fixed Gaze, what should you never do while sight-reading?',
            ['Look at the next measure', 'Look down at your hands', 'Reset the metric pulse', 'Read notes as isolated letters'],
            1,
            'The step text explicitly states the Rule of the Fixed Gaze: Never look down at your hands while sight-reading.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l13-2-4',
      'The 30-Second Pre-Flight Scan Routine',
      [
        step(
          'Five Questions Before the First Note',
          [
            prose(
              '<p>Before placing your fingers on the keys to sight-read an unfamiliar piece, spend exactly 30 seconds scanning the score.</p>',
            ),
            table(
              ['Step', 'Scan target', 'Key question to answer'],
              [
                ['1', 'Clef and Key', 'What clefs are used? How many sharps or flats? What is the tonal home?'],
                ['2', 'Time Signature', '2/4, 3/4, or 4/4? What is the beat unit?'],
                ['3', 'Roadblock Scan', 'Are there fast 16ths, big leaps, or accidentals in bars 5–8?'],
                ['4', 'Starting Position', 'Which finger goes on which starting note for both hands?'],
                ['5', 'Silent Audiation', 'Count "1-2-3-4" and tap the rhythm.'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          order(
            'What is the correct order of the five targets in the 30-second pre-flight scan routine?',
            ['Starting Position', 'Roadblock Scan', 'Clef and Key', 'Silent Audiation', 'Time Signature'],
            ['Clef and Key', 'Time Signature', 'Roadblock Scan', 'Starting Position', 'Silent Audiation'],
            'The step text presents the scan routine in a numbered table whose rows explicitly list the targets from 1 to 5 in the order Clef and Key, Time Signature, Roadblock Scan, Starting Position, Silent Audiation.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l13-2-5',
      'The Daily 3-Minute Sight-Reading Protocol',
      [
        step(
          'One Pass, Then Turn the Page',
          [
            list(
              [
                'Obtain a volume of simple, unfamiliar piano music (one to two grade levels below your current repertoire level).',
                'Execute the 30-second pre-flight scan.',
                'Set the metronome to a modest, manageable tempo (e.g., 50–60 BPM).',
                'Play the 8-to-16 measure excerpt from start to finish exactly once.',
                'Do not repeat it. Turn the page. Sight-reading can only be practiced on material you have never played before.',
              ],
              true,
            ),
            callout(
              'warning',
              'Sight-reading traps',
              '<p><strong>Looking down at the keys</strong> after every note — keep eyes locked on the score and use fingertip proprioception. <strong>Stopping to fix errors</strong> and restarting the measure — never stop the clock; drop a wrong note to maintain the next downbeat. <strong>Practicing the same sight-reading piece multiple times</strong> — once you play an excerpt once, it becomes repertoire practice; move to new, fresh music every time.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          multi(
            'According to the instructions, which of these are sight-reading traps to avoid?',
            [
              'Looking down at the keys after every note',
              'Stopping to fix errors and restarting the measure',
              'Practicing the same sight-reading piece multiple times',
              'Repeating the excerpt before turning the page',
            ],
            [0, 1, 2],
            'The step text explicitly lists these three behaviors as sight-reading traps: looking down at the keys, stopping to fix errors and restarting, and practicing the same piece multiple times.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m13-2-ex-a',
      type: 'Reading drill',
      title: 'Protocol 13.2-A — The Unbroken 8-Bar Sight-Reading Drill',
      prompt: 'Open a new 8-bar study in C Major or G Major. Execute the 30-second scan. Count 1 full measure aloud: "1-2-3-4". Execute the piece at 50 BPM without pausing for any reason.',
    },
  ],
  checkpoints: [
    'Sight-Reading Definition: can explain why stopping to fix errors during sight-reading is prohibited.',
    'Pre-Flight Routine: automatically executes the 30-second scan (Key, Time, Roadblocks, Starting Digits) before touching the keyboard.',
    'Visual Chunking: can identify a root triad vs. an inverted triad shape on the staff in under 1 second.',
    'Eye Lead: demonstrates looking ahead at Measure 2 while fingers are still completing Measure 1.',
  ],
});
