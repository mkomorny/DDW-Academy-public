/**
 * Section 4.2 — Landmarks, Then Steps and Skips (Interval Reading)
 * Module 4 — The Page
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_04_The_Page/
 * Section_4.2_Landmarks_Then_Steps_And_Skips.md), read in full before
 * authoring.
 *
 * Conversion notes:
 * - Lesson 4.2.2 and 4.2.6 draw their own worked note sequences on top of
 *   the source's step/skip and Twinkle Twinkle examples, so unlike 4.1 this
 *   section DOES use `interval` asserts — one per adjacent-note pair the
 *   step's own staff() diagram claims is a step or a skip, computed by hand
 *   the same way 3.3 did: C4->D4 and G4->A4/A4->G4/D4->C4 are each a
 *   2-semitone whole-step; C4->E4 is a 4-semitone skip (major 3rd); C4->G4
 *   is the "skip-skip" the source calls out by name, a 7-semitone perfect
 *   5th. F4->E4 needed correcting by hand from an initial 2-semitone guess
 *   to the correct 1 semitone — E-F is a half step, not a whole step, the
 *   same half-step pair the course has flagged since level02 — caught
 *   immediately by validate-course.mjs's theory oracle on the first
 *   `--module` run, exactly the kind of arithmetic error asserts exist to
 *   catch.
 * - The source's lesson-roster title for 4.2.4 says "See, Speak, Feel,
 *   Play", but the lesson's own detailed box (§3) uses "Scan, Speak, Feel,
 *   Play" with Scan meaning "check clef, time signature, and initial guide
 *   note anchor" — the more specific and concrete of the two phrasings.
 *   This file teaches the box's own wording (Scan) since that's the actual
 *   grounded procedure; "See" survives only as a synonym in the outcome
 *   text, unchanged.
 * - Lesson 4.2.6 (the Twinkle Twinkle reading lab) reuses the C-position
 *   pentascale vocabulary 3.2 established (C4-G4) and gets a real `staff()`
 *   transcription of the source's own measure-by-measure breakdown, split
 *   across two steps (measures 1-2, then 3-4) to keep each step's table and
 *   diagram a manageable single unit for the AI check-drafter to ground a
 *   question in.
 * - Per the plan's mapping rule, §5's one Structured Practice Protocol
 *   becomes the module's one exercises[] entry, and §6's checklist replaces
 *   the scaffold's generic checkpoints[]. §4's three Methodological Traps
 *   are close paraphrases of traps 4.1 already covered (letter-name
 *   scaffolding, looking down, stopping to spell every note) rather than
 *   new material, so — to avoid teaching the same corrective three times —
 *   they are not repeated as a separate callout here; 4.1.6's callout
 *   already covers the underlying anti-pattern this section's traps restate
 *   in reading-specific language.
 * - Two AI-drafted checks were hand-fixed before splicing, caught in review
 *   rather than by any validator: lesson 4.2.1 step 2 was drafted as a
 *   `multi` question with only one correct answer out of five whole-string
 *   options (the schema's own drafting brief requires 2+ correct answers
 *   for `multi`) — converted to `mcq` with the same options/answer/explain.
 *   Lesson 4.3.5 step 1 (spliced from this batch's sibling file, same
 *   review pass) excluded a true, text-grounded option ("four quarter-note
 *   beats per measure", explicitly stated as "4/4 time" in the step's own
 *   text) from its `multi` answer key — added back in.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified (mcq and
 *   multi kinds).
 */
import { module_, lesson, step, prose, table, callout, list, staff, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l4-2-1',
      'Landmark Plus Neighbors: The Relative Reading Model',
      [
        step(
          'Reading as Topography',
          [
            prose(
              '<p>Reading music is identical to reading topographical terrain. Once an anchor landmark is identified — for example, Middle C — all subsequent notes are read by their relative vector: direction and distance from that anchor, not by re-spelling each note from scratch.</p>',
            ),
            sources(['Piano theory basics for beginners.pdf']),
          ],
          mcq(
            'According to the text, how are notes after the anchor landmark read?',
            [
              'By re-spelling each note from scratch every time',
              'By their relative vector of direction and distance from the anchor',
              'By looking down at the hands on the piano',
              'By treating each note as an independent vertical spelling',
            ],
            1,
            'The step text states that once an anchor landmark such as Middle C is identified, all subsequent notes are read by their relative vector: direction and distance from that anchor, not by re-spelling each note from scratch.',
          ),
        ),
        step(
          'The Relative Reading Algorithm',
          [
            list(
              [
                'Anchor: locate the starting Guide Note (e.g., Middle C).',
                'Direction: does the next note move up, down, or repeat?',
                'Distance: does the note move by a step (line to space) or a skip (line to line / space to space)?',
                'Motor Action: translate the visual interval directly into finger motion, without consciously converting to letter names first.',
              ],
              true,
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the step, what three things should you identify immediately after locating the starting Guide Note?',
            [
              'Direction, Distance, Motor Action',
              'Direction, Distance, Letter Name',
              'Letter Name, Distance, Motor Action',
              'Direction, Letter Name, Motor Action',
              'Distance, Motor Action, Letter Name',
            ],
            0,
            'The step text explicitly lists Anchor (locate Guide Note), then Direction (up/down/repeat), Distance (step or skip), and Motor Action as the sequence to follow.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-2-2',
      'Visual Topography: Steps vs. Skips',
      [
        step(
          'Repeats, Steps, and Skips Defined',
          [
            table(
              ['Interval Type', 'Visual Staff Pattern', 'Physical Key / Finger Action'],
              [
                [
                  'Repeat (Unison)',
                  'Same line to same line, or same space to same space',
                  'Strike the SAME key with the SAME finger',
                ],
                [
                  'Step (2nd)',
                  'Line to adjacent space, or space to adjacent line (alternating pattern)',
                  'Move to the IMMEDIATELY ADJACENT white key; use the adjacent finger (e.g., 1→2 or 3→2)',
                ],
                [
                  'Skip (3rd)',
                  'Line to adjacent line, or space to adjacent space (matching pattern)',
                  'SKIP one white key; skip one finger (e.g., 1→3 or 3→5)',
                ],
              ],
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          multi(
            'According to the table, which of the following are true for a Skip (3rd)?',
            [
              'Line to adjacent line or space to adjacent space (matching pattern)',
              'SKIP one white key; skip one finger (e.g., 1→3 or 3→5)',
              'Same line to same line or same space to same space',
              'Strike the SAME key with the SAME finger',
              'Line to adjacent space or space to adjacent line (alternating pattern)',
            ],
            [0, 1],
            `The step text's table explicitly states that a Skip (3rd) has the visual staff pattern of line to adjacent line or space to adjacent space (matching pattern) and the physical action of skipping one white key and one finger (e.g., 1→3 or 3→5).`,
          ),
        ),
        step(
          'Seeing It on the Staff',
          [
            prose(
              `<p>A step keeps the same visual pattern-type direction (line-to-space or space-to-line); a skip preserves the type (line-to-line or space-to-space). The source's own examples: C to D is a step (adjacent letter name); C to E is a skip (skips one letter name).</p>`,
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'q', label: 'C' },
                  { notes: ['D4'], duration: 'q', label: 'D (step)' },
                  { notes: ['C4'], duration: 'q', label: 'C' },
                  { notes: ['E4'], duration: 'q', label: 'E (skip)' },
                ],
              },
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the text, what is the visual pattern for a step?',
            [
              'line-to-line',
              'space-to-space',
              'line-to-space or space-to-line',
              'skips one letter name',
            ],
            2,
            'The step text states that a step keeps the same visual pattern-type direction (line-to-space or space-to-line).',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'D4', semitones: 2 },
            { assert: 'interval', from: 'C4', to: 'E4', semitones: 4 },
          ],
        ),
      ],
    ),
    lesson(
      'piano-l4-2-3',
      'The Cognitive Science of Chunking',
      [
        step(
          'Level 0 Reading: Sounding Out Each Note',
          [
            prose(
              `<p>Reading note-by-note is as inefficient as sounding out individual letters ("c - a - t") while reading prose. Level 0 reading looks like this: "That note is on line 1, so it's E. The next note is on space 1, that's F. The next note is on line 2, that's G..." — a slow, thirty-second decoding process for a handful of notes.</p>`,
            ),
            sources(['Piano theory basics for beginners.pdf']),
          ],
          mcq(
            'According to the text, what does Level 0 reading sound like when decoding a few notes?',
            [
              'See → Name Interval → Feel Distance → Play',
              `That note is on line 1, so it's E. The next note is on space 1, that's F. The next note is on line 2, that's G...`,
              'Recognize entire scalar runs and triad shapes as unified visual objects',
              `That note is a step from the landmark, so it's a 2nd`,
            ],
            1,
            'The step text explicitly gives this example as what Level 0 reading looks like, describing it as a slow, thirty-second decoding process for a handful of notes.',
          ),
        ),
        step(
          'Fluent Chunking: Seeing Patterns as Objects',
          [
            prose(
              '<p>Theory provides the vocabulary for chunking. A fluent reader does not decode note-by-note; they recognize entire scalar runs and triad shapes as unified visual objects — for example, seeing "an ascending 4-note stepwise scalar run in C position starting on Finger 3: 3-4-5-1" in about half a second, instead of thirty.</p>',
            ),
            sources(['Piano theory basics for beginners.pdf']),
          ],
          mcq(
            'According to the text, how does theory help a fluent reader process an ascending 4-note stepwise scalar run in C position starting on Finger 3?',
            [
              'By decoding it note-by-note over thirty seconds',
              'By recognizing it as a unified visual object in about half a second',
              `By spelling out each note's letter name vertically`,
              'By glancing down at the hands to feel the distance',
            ],
            1,
            'The step text states that theory provides the vocabulary for chunking so a fluent reader recognizes entire scalar runs and triad shapes as unified visual objects — for example, seeing "an ascending 4-note stepwise scalar run in C position starting on Finger 3: 3-4-5-1" in about half a second instead of thirty.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-2-4',
      'The Four-Phase Reading Routine: Scan, Speak, Feel, Play',
      [
        step(
          'Scan and Speak',
          [
            prose(
              '<p><strong>Scan:</strong> before playing a single note, check the clef, the time signature, and the initial Guide Note anchor. <strong>Speak:</strong> chant the melodic contour aloud — for example, "Step up, step up, repeat, skip down" — verbalizing the intervals before your fingers touch a key.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the Scan step, what three things must you check before playing a single note?',
            [
              'The clef, time signature, and key signature',
              'The clef, time signature, and initial Guide Note anchor',
              'The time signature, key signature, and first note name',
              'The clef, first interval, and Guide Note anchor',
            ],
            1,
            'The step text explicitly states to check the clef, the time signature, and the initial Guide Note anchor before playing a single note.',
          ),
        ),
        step(
          'Feel and Play',
          [
            prose(
              '<p><strong>Feel:</strong> place the hand in C position and ghost-tap the fingers over the keys without producing sound, rehearsing the motor pattern silently. <strong>Play:</strong> only after Scan, Speak, and Feel are complete, execute the passage slowly against a steady metronomic pulse.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the instructions, when should you begin to Play the passage?',
            [
              'Immediately after placing the hand in C position',
              'Only after completing Scan, Speak, and Feel',
              'While ghost-tapping the fingers',
              'Before rehearsing the motor pattern silently',
            ],
            1,
            'The step text states that Play should occur only after Scan, Speak, and Feel are complete.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-2-5',
      'Spatial Proprioception: Keeping Eyes on the Score',
      [
        step(
          'Visual Oscillation Breaks Reading',
          [
            prose(
              '<p>A primary cause of reading breakdown is visual oscillation — constantly jerking the eyes back and forth between the sheet music and the physical hands. When your eyes look down at your hand, you lose your place on the score. When your eyes return to the score, tempo collapses while you search for the measure.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'What is a primary cause of reading breakdown according to the text?',
            [
              'Forgetting the note names',
              'Visual oscillation between score and hands',
              'Playing too fast',
              'Not using chunking',
            ],
            1,
            'The step text explicitly states that a primary cause of reading breakdown is visual oscillation — constantly jerking the eyes back and forth between the sheet music and the physical hands.',
          ),
        ),
        step(
          'The Golden Rule of Reading',
          [
            callout(
              'key',
              'The Golden Rule of Reading',
              '<p>Your eyes belong on the page. Your fingers must learn to feel the topography of the keys through tactile proprioception. Looking down is a rare luxury, permitted only during large leaps across octaves.</p>',
            ),
            prose(
              '<p>This single rule resolves the visual oscillation problem directly: if your eyes never leave the score, they can never lose their place on it.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the Golden Rule of Reading, when is looking down at the keys permitted?',
            [
              'Never',
              'Only during large leaps across octaves',
              'Only when playing scales',
              'Only at the beginning of a piece',
            ],
            1,
            'The step text states that looking down is a rare luxury, permitted only during large leaps across octaves.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-2-6',
      'Repertoire Reading Lab: Twinkle, Twinkle, Little Star',
      [
        step(
          'Measures 1–2: Anchor, Leap, and Step',
          [
            prose(
              '<p>Treble Clef, RH C Position (1=C, 2=D, 3=E, 4=F, 5=G), 4/4 time — all quarter notes except the held half notes closing measures 2 and 4. Measure 1 anchors on Middle C, repeats it, then leaps up a "skip-skip" to Treble G and repeats it. Measure 2 steps up to A, repeats it, then steps back down to G, held for two beats.</p>',
            ),
            table(
              ['Measure', 'Notes', 'Interval', 'Fingering'],
              [
                ['1', 'C4 – C4 – G4 – G4', 'Anchor – Repeat – Skip-Skip – Repeat', '1 – 1 – 5 – 5'],
                ['2', 'A4 – A4 – G4 (held 2 beats)', 'Step Up – Repeat – Step Down', '5 – 5 – 4'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'q' },
                  { notes: ['C4'], duration: 'q' },
                  { notes: ['G4'], duration: 'q' },
                  { notes: ['G4'], duration: 'q' },
                  { notes: ['A4'], duration: 'q' },
                  { notes: ['A4'], duration: 'q' },
                  { notes: ['G4'], duration: 'h' },
                ],
              },
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the description, what interval pattern occurs in measure 1 of the melody?',
            [
              'Anchor – Repeat – Skip-Skip – Repeat',
              'Step Up – Repeat – Step Down',
              'Anchor – Skip – Repeat – Step',
              'Repeat – Skip-Skip – Step Down',
            ],
            0,
            'The step text explicitly lists the interval pattern for measure 1 as "Anchor – Repeat – Skip-Skip – Repeat" along with the notes C4 – C4 – G4 – G4.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
            { assert: 'interval', from: 'G4', to: 'A4', semitones: 2 },
            { assert: 'interval', from: 'A4', to: 'G4', semitones: 2 },
          ],
        ),
        step(
          'Measures 3–4: Stepwise Descent to the Tonic',
          [
            prose(
              '<p>Measure 3 descends stepwise from F to E, each repeated. Measure 4 continues the stepwise descent from D to the tonic, Middle C, held for two beats to close the phrase.</p>',
            ),
            table(
              ['Measure', 'Notes', 'Interval', 'Fingering'],
              [
                ['3', 'F4 – F4 – E4 – E4', 'Step Down – Repeat – Step Down – Repeat', '4 – 4 – 3 – 3'],
                ['4', 'D4 – D4 – C4 (held 2 beats)', 'Step Down – Repeat – Step Down', '2 – 2 – 1'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['F4'], duration: 'q' },
                  { notes: ['F4'], duration: 'q' },
                  { notes: ['E4'], duration: 'q' },
                  { notes: ['E4'], duration: 'q' },
                  { notes: ['D4'], duration: 'q' },
                  { notes: ['D4'], duration: 'q' },
                  { notes: ['C4'], duration: 'h' },
                ],
              },
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the description, what is the full sequence of notes and their durations in measures 3 and 4?',
            [
              'F4 (1 beat) – E4 (1 beat) – D4 (1 beat) – C4 (1 beat)',
              'F4 – F4 – E4 – E4 then D4 – D4 – C4 held for two beats',
              'F4 – E4 – D4 – C4 all held for two beats each',
              'F4 repeated, E4 repeated, then Middle C held for four beats',
            ],
            1,
            'The step text explicitly states that measure 3 has F4 – F4 – E4 – E4 and measure 4 has D4 – D4 – C4 (held 2 beats).',
          ),
          [
            { assert: 'interval', from: 'F4', to: 'E4', semitones: 1 },
            { assert: 'interval', from: 'D4', to: 'C4', semitones: 2 },
          ],
        ),
      ],
      { minutes: 14 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m4-2-ex-a',
      type: 'Reading drill',
      title: 'Protocol 4.2-A — Step vs. Skip Interval Drill',
      prompt: 'Open a beginner score in C position. Without playing, point along the notes with a pencil and chant only the interval relationships — "Anchor on C, step up to D, step up to E, skip down to C, step up to D." Execute at a strict 60 BPM pulse.',
    },
  ],
  checkpoints: [
    'Visual Interval Distinction: can look at two consecutive notes and immediately declare whether they form a Step, Skip, or Repeat.',
    'No Letter Scaffolding: can read a 4-bar beginner melody without having letter names penciled in.',
    'Visual Discipline: can perform Twinkle, Twinkle, Little Star (Section A) from sheet music while keeping eyes on the page more than 90% of the time.',
  ],
  outcomes: [
    'Identify a note by relative distance from a landmark rather than vertical spelling.',
    'Distinguish visually between a Step (Line-to-Space or Space-to-Line / 2nd) and a Skip (Line-to-Line or Space-to-Space / 3rd).',
    'Apply cognitive Theory Chunking to recognize entire scalar runs and triad shapes as unified visual objects.',
    'Execute the multi-sensory reading cycle: See → Name Interval → Feel Distance → Play.',
    'Maintain visual focus on the printed score, treating glancing down at hands as a brief exception.',
    'Decode and execute the public-domain melody Twinkle, Twinkle, Little Star directly from notation in C Position.',
  ],
  sources: [
    'Piano theory basics for beginners.pdf',
    'How to read piano notes for beginners.pdf',
    'Fingerings.pdf',
    'How to Read Music Essential Tips for Beginners.pdf',
  ],
  practiceFocus: ['Read Twinkle by landmarks and steps, eyes on the page.'],
  id: 'piano-m4-2',
  code: '4.2',
  title: 'Landmarks, Then Steps and Skips (Interval Reading)',
});
