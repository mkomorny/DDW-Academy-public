/**
 * Section 6.2 — Motion Types: Similar, Contrary, Parallel, and Oblique
 * Module 6 — Two Hands
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_06_Two_Hands/
 * Section_6.2_Motion_Types_Similar_Contrary_Parallel_Oblique.md).
 *
 * The four motion types are taught with keyboard() range highlights standing
 * in for the source's ASCII arrow diagrams (RH/LH direction is shown via
 * which register each highlight sits in, not literal arrows), plus finger-
 * mapping tables reproducing the source's digit sequences. Two asserts:
 * 6.2.3's parallel-octave interval (C3->C4, 12 semitones = P8, the first
 * course use of the P8 id) and 6.2.5's Study 1 RH ascent, which reuses the
 * C major pentascale pcSet spelling already asserted in 5.1.2/5.1.4 (the
 * LH mirror descent C-B-A-G-F is adjacent white keys, not a named scale
 * pattern, so it gets no assert of its own — matching the "only assert a
 * stated theory claim" rule, not "assert everything with pitches in it").
 *
 * Study 1's contrary pentascale reuses the "Bass C = C2" register convention
 * one octave up (C3/C4 thumbs meeting at Middle C) since the source's own
 * diagram places both thumbs on Middle C itself, not on the Gate C/D bass
 * drone register.
 *
 * Per-step sources() split: definitions come from Piano Skill Levels
 * Explained.pdf (Hoffman Academy elementary texture standards), fingering/
 * biomechanics detail from Piano hand exercises.pdf (bilateral stabilization),
 * and the C-Major Coordination Étude Family (lesson 5) from 5 effective
 * warm-up exercises.pdf, since the source attributes those three studies
 * specifically to Pianist Magazine / Jazer Lee.
 *
 * Check-drafting provenance: 10/10 questions passed shape + entailment on
 * the first attempt.
 */
import { module_, lesson, step, prose, list, table, callout, keyboard, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l6-2-1',
      'Similar Motion Mechanics',
      [
        step(
          'Same Direction, Both Hands',
          [
            prose(
              'This section introduces the four classical <b>Contrapuntal Motion Types</b> that govern all multi-voice piano literature. The first is <b>Similar Motion</b>: both hands travel in the same physical and pitch direction — both ascending rightward, or both descending leftward.',
            ),
            list(
              [
                'Example: both hands play an ascending scale together.',
                'The two hands are always moving the same way — up together, or down together.',
              ],
            ),
            keyboard({ high: 79, highlight: [48, 60, 67] }),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the text, what is Similar Motion?',
            [
              'Both hands moving in opposite directions',
              'One hand stationary while the other moves',
              'Both hands traveling in the same physical and pitch direction',
              'Both hands moving at a fixed harmonic interval',
            ],
            2,
            'The step text explicitly defines Similar Motion as both hands traveling in the same physical and pitch direction — both ascending rightward, or both descending leftward.',
          ),
        ),
        step(
          'The Asymmetrical Neurological Load',
          [
            prose(
              'In similar motion, the physical fingers do <b>not</b> match between the hands. When both hands ascend together, RH uses fingers 1→2→3→4→5 while LH uses fingers 5→4→3→2→1 — the two hands are doing mirror-opposite fingering work even though the keys are moving the same direction.',
            ),
            table(
              ['Hand', 'Direction', 'Fingering (ascending)'],
              [
                ['RH', 'Ascends →', '1 → 2 → 3 → 4 → 5'],
                ['LH', 'Ascends →', '5 → 4 → 3 → 2 → 1'],
              ],
              'Same direction, different finger sequence — this is the asymmetrical load.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'In similar motion when both hands ascend, what fingering does the left hand use?',
            ['1 → 2 → 3 → 4 → 5', '5 → 4 → 3 → 2 → 1', '1 → 3 → 5 → 2 → 4', '5 → 3 → 1 → 4 → 2'],
            1,
            'The step text states that when both hands ascend in similar motion, LH uses fingers 5→4→3→2→1.',
          ),
        ),
      ],
      { intro: 'Both hands moving the same direction — with mismatched fingering underneath.' },
    ),
    lesson(
      'piano-l6-2-2',
      'Contrary Motion Mechanics',
      [
        step(
          'Opposite Directions',
          [
            prose(
              'In <b>Contrary Motion</b>, the hands move in opposite directions. As the Right Hand ascends rightward away from the center of the body, the Left Hand descends leftward away from the center — the two hands move apart (or, played in reverse, move back together).',
            ),
            keyboard({ low: 36, highlight: [60] }),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'In contrary motion, as the right hand ascends rightward away from the center of the body, which way does the left hand move?',
            [
              'Ascends rightward away from the center',
              'Descends leftward away from the center',
              'Remains stationary',
              'Moves in the same direction as the right hand',
            ],
            1,
            'The step text states that as the Right Hand ascends rightward away from the center, the Left Hand descends leftward away from the center.',
          ),
        ),
        step(
          'The Symmetrical Neurological Advantage',
          [
            prose(
              'Symmetrical contrary motion allows both hands to use <b>identical anatomical digit pairs simultaneously</b> — both thumbs, both index fingers, both middle fingers move together, even though the hands are heading opposite ways. This is the physically easier of the four motion types to coordinate.',
            ),
            table(
              ['Hand', 'Direction', 'Fingering'],
              [
                ['RH', 'Ascends →', '1 → 2 → 3 → 4 → 5'],
                ['LH', 'Descends ←', '1 → 2 → 3 → 4 → 5'],
              ],
              'Same finger numbers fire together — this is why contrary motion feels more natural than similar motion at first.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the text, why does symmetrical contrary motion feel more natural than similar motion at first?',
            [
              'The hands move in the same direction',
              'Same finger numbers fire together',
              'The thumbs never play together',
              'It uses different anatomical digit pairs',
            ],
            1,
            'The step text states that same finger numbers fire together and this is why contrary motion feels more natural than similar motion at first.',
          ),
        ),
      ],
      { intro: 'Hands moving apart (or together) with matching finger numbers on each side.' },
    ),
    lesson(
      'piano-l6-2-3',
      'Parallel Motion Mechanics',
      [
        step(
          'Locked at a Fixed Interval',
          [
            prose(
              'In <b>Parallel Motion</b>, both hands move in the same direction while maintaining an <b>unvarying, fixed harmonic interval</b> between the two voices. Parallel Octaves are the clearest example: both hands play the identical pitch class, separated by 8 scale steps — for example RH plays C4-D4-E4 while LH plays C3-D3-E3 at the same time.',
            ),
            keyboard({ low: 36, highlight: [48, 60] }),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'In parallel motion, what remains unvarying between the two voices?',
            ['The pitch class', 'The dynamic level', 'The harmonic interval', 'The rhythmic pattern'],
            2,
            'The step text states that in Parallel Motion, both hands move in the same direction while maintaining an unvarying, fixed harmonic interval between the two voices.',
          ),
          [
            { assert: 'interval', from: 'C3', to: 'C4', semitones: 12 },
          ],
        ),
        step(
          'Parallel Thirds and Sixths',
          [
            prose(
              'Parallel Octaves are not the only locked interval. Parallel Thirds and Parallel Sixths are highly resonant classical textures where the two voices move in the same direction, separated the entire time by a 3rd or a 6th instead of a full octave.',
            ),
            table(
              ['Locked interval', 'Feel'],
              [
                ['Octave', 'Both hands double the same pitch class an octave apart.'],
                ['3rd', 'Close, sweet harmonic doubling — a common classical texture.'],
                ['6th', 'Open, resonant harmonic doubling — also very common.'],
              ],
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the table, what feel is associated with locked 6ths?',
            [
              'Both hands double the same pitch class an octave apart.',
              'Close, sweet harmonic doubling — a common classical texture.',
              'Open, resonant harmonic doubling — also very common.',
              'Both hands move in contrary motion separated by a 6th.',
            ],
            2,
            `The step text's table explicitly lists the feel for 6th as "Open, resonant harmonic doubling — also very common."`,
          ),
        ),
      ],
      {
        intro: 'Both hands moving the same way, locked together at one interval the whole time.',
      },
    ),
    lesson(
      'piano-l6-2-4',
      'Oblique Motion Mechanics',
      [
        step(
          'One Hand Still, One Hand Moving',
          [
            prose(
              'In <b>Oblique Motion</b>, one musical voice moves in pitch while the other voice remains entirely stationary — holding a sustained pedal point, drone, or repeating a single pitch. Example: the Left Hand holds a sustained Bass C whole note while the Right Hand executes an active 4-measure melodic phrase.',
            ),
            keyboard({ low: 36, highlight: [36] }),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'In oblique motion, what does one of the voices do?',
            [
              'Moves in the same direction as the other voice',
              'Moves in the opposite direction to the other voice',
              'Remains entirely stationary — holding a sustained pedal point, drone, or repeating a single pitch',
              'Moves in parallel locked at a fixed interval such as 3rds',
            ],
            2,
            'The step text states that in oblique motion one musical voice moves in pitch while the other voice remains entirely stationary — holding a sustained pedal point, drone, or repeating a single pitch.',
          ),
        ),
        step(
          'The Biomechanical Demand',
          [
            prose(
              'Oblique motion requires the stationary hand to maintain quiet, relaxed keybed contact without tensing in sympathy with the active hand. The most common failure is <b>sympathetic finger twitching</b> in the stationary hand while the other hand is busy.',
            ),
            callout(
              'warning',
              'Keep the Holding Hand Relaxed',
              'Practice oblique drills deliberately; keep the holding hand relaxed like dead weight resting on the keys, not gripping or twitching in time with the active hand.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'What is the most common failure when practicing oblique motion?',
            [
              'The active hand moving too quickly',
              'The stationary hand tensing or showing sympathetic finger twitching',
              'Both hands losing alignment in parallel intervals',
              'Forgetting to keep the holding hand in dead weight contact',
            ],
            1,
            'The step text explicitly states that the most common failure is sympathetic finger twitching in the stationary hand while the other hand is busy.',
          ),
        ),
      ],
      { intro: 'One hand sustains a drone while the other hand does all the moving.' },
    ),
    lesson(
      'piano-l6-2-5',
      'The C-Major Coordination Étude Family (Pianist Magazine / Jazer Lee)',
      [
        step(
          'Study 1 — Contrary Motion Pentascale (Symmetrical Mirror)',
          [
            prose(
              'The conservatory coordination warm-up studies, in C major, integrate all four motion types into daily practice. <b>Study 1</b> is a contrary-motion mirror pentascale: both thumbs start on Middle C (C3 and C4), then move outward and back in a perfect mirror image.',
            ),
            table(
              ['Hand', 'Sequence'],
              [
                ['RH', '(1:C) → (2:D) → (3:E) → (4:F) → (5:G) → (4:F) → (3:E) → (2:D) → (1:C)'],
                ['LH', '(1:C) → (2:B) → (3:A) → (4:G) → (5:F) → (4:G) → (3:A) → (2:B) → (1:C)'],
              ],
              'Both thumbs start together on Middle C and mirror outward — RH ascends the C major pentascale while LH descends the white keys below it.',
            ),
            keyboard({ high: 67, highlight: [48, 60] }),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          mcq(
            'In the conservatory coordination warm-up Study 1, what do both thumbs start on before moving outward in contrary motion?',
            ['Middle C', 'C major pentascale', 'White keys below', 'G note'],
            0,
            'The step text states that both thumbs start on Middle C (C3 and C4), then move outward and back in a perfect mirror image.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'C',
              semitones: [0, 2, 4, 5, 7],
              notes: ['C', 'D', 'E', 'F', 'G'],
            },
          ],
        ),
        step(
          'Studies 2 and 3, and the Daily Circuit',
          [
            prose(
              '<b>Study 2</b> (Oblique) splits the hands by articulation: RH plays smooth 5-finger legato (C-D-E-F-G) while LH plays repeated staccato Bass C eighth notes underneath. <b>Study 3</b> (Similar Motion) has both hands play a 2-voice counterpoint in parallel octaves: RH climbs (1:C)→(2:D)→(3:E)→(4:F)→(5:G) while LH climbs the octave below with mirrored fingers (5:C)→(4:D)→(3:E)→(2:F)→(1:G).',
            ),
            table(
              ['Step', 'Study', 'Tempo', 'Reps'],
              [
                ['1', 'Contrary Motion — Study 1 (Mirror Pentascale)', '80 BPM', '×4'],
                ['2', 'Similar Motion — Study 3 (Parallel Octaves)', '60 BPM', '×4'],
                ['3', 'Oblique Motion — Study 2 (Legato RH / Staccato LH)', '60 BPM', '×4'],
              ],
              'Protocol 6.2-A: the Daily 4-Motion Coordination Circuit.',
            ),
            callout(
              'key',
              'Do Not Confuse the Two Easiest to Mix Up',
              'Similar motion means both hands move the same direction; contrary motion means they move opposite directions — the names describe direction, not difficulty. Strive for equal dynamic volume between the hands during contrary motion unless you are deliberately voicing the melody louder.',
            ),
            table(
              ['Self-check', 'Target'],
              [
                [
                  'Motion Type Taxonomy',
                  'Can define Similar, Contrary, Parallel, and Oblique motion without hesitation.',
                ],
                [
                  'Contrary Pentascale Execution',
                  'Can play the C Major contrary pentascale at 80 BPM with perfect symmetrical coordination.',
                ],
                [
                  'Oblique Isolation',
                  'Can hold a sustained LH chord while RH plays an active scale without releasing the LH early.',
                ],
              ],
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          mcq(
            'According to the protocol, what is the tempo and number of repetitions for the Similar Motion — Study 3 step in the Daily 4-Motion Coordination Circuit?',
            ['80 BPM ×4', '60 BPM ×4', '80 BPM ×8', '60 BPM ×2'],
            1,
            `The step text's Protocol 6.2-A table explicitly lists Step 2 as Similar Motion — Study 3 (Parallel Octaves) at 60 BPM ×4.`,
          ),
        ),
      ],
      {
        intro: 'Three studies that drill contrary, similar, and oblique motion in one daily circuit.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m6-2-ex-a',
      type: 'Coordination circuit',
      title: 'Protocol 6.2-A — Daily 4-Motion Coordination Circuit',
      prompt: 'Execute Study 1 (Contrary Motion Mirror Pentascale) at 80 BPM ×4 repetitions. Execute Study 3 (Similar Motion, Parallel Octaves) at 60 BPM ×4 repetitions. Execute Study 2 (Oblique Motion, Legato RH / Staccato LH) at 60 BPM ×4 repetitions.',
    },
  ],
  checkpoints: [
    'Motion Type Taxonomy: can define Similar, Contrary, Parallel, and Oblique motion without hesitation.',
    'Contrary Pentascale Execution: can play the C Major contrary pentascale at 80 BPM with perfect symmetrical coordination.',
    'Oblique Isolation: can hold a sustained LH chord while RH plays an active scale without releasing the LH early.',
  ],
  outcomes: [
    'Define and execute Similar Motion (both hands moving in the same upward or downward direction).',
    'Define and execute Contrary Motion (hands moving in opposite directions away from or toward each other).',
    'Define and execute Parallel Motion (both hands moving in the same direction locked at a fixed harmonic interval, such as 3rds, 6ths, or Octaves).',
    'Define and execute Oblique Motion (one hand remains stationary or sustains while the other hand moves melodically).',
    'Perform the standard C-Major Coordination Étude Family (*Pianist Magazine* / Jazer Lee progression) as an integrated daily coordination warm-up.',
  ],
  sources: [
    '5 effective warm-up exercises.pdf',
    'Piano Skill Levels Explained.pdf',
    'Piano hand exercises.pdf',
  ],
  practiceFocus: ['Four motion types on a C-major coordination pattern.'],
  id: 'piano-m6-2',
  code: '6.2',
  title: 'Motion Types: Similar, Contrary, Parallel, and Oblique',
});
