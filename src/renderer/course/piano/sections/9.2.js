/**
 * Section 9.2 — Scale vs. Key: C Major and A Minor Full 1-Octave Scales
 * Module 9 — Intervals and First Keys
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_09_Intervals_And_First_Keys/
 * Section_9.2_Scale_Vs_Key_C_Major_A_Minor_Full_Octaves.md), read in full
 * before authoring. Second section of Module 9 — authored together with 9.3,
 * 10.1, and 10.2 under Miranda's explicit one-time chaining override ("do
 * the next 4 steps in one pass"), documented per the plan's one-off-exception
 * rule (the sixth such exception). This section alone does NOT complete
 * Module 9 (9.3 also authored this batch completes it and wires Level 9).
 *
 * Conversion notes:
 * - First live use of `scaleExplorer()` in the course. Confirmed against
 *   src/data/scales.json before authoring: the app's mined scale ids are
 *   'major-scales' and 'minor-scales' (not 'major'/'natural-minor' as might
 *   be guessed) — checked via the data file directly to avoid a silent
 *   "Scale not found" callout.
 * - The two half-step locations (Mi-Fa / Ti-Do for major; degrees 2-3 / 5-6
 *   for natural minor) are exactly what the theory oracle's `interval`
 *   assert kind checks, so both get real asserts from the source's own
 *   stated scale-degree letters.
 * - Lesson 9.2.3's Natural Minor step also carries a `pcSet` assert for the
 *   full A-B-C-D-E-F-G collection, grounding the "same white keys as C
 *   Major" claim the source makes explicitly.
 * - The ASCII fingering matrix, degree-name table, and 4-step memorization
 *   box are all converted to real `table()` blocks, not left as `<pre>` —
 *   they're literal tabular data, not diagrammatic art.
 * - Check-drafting provenance: all 8 step checks were drafted via the xAI
 *   client, 8 of 8 verified on the first entailment attempt (part of a
 *   26/26 first-attempt run across all four sections in this chained batch).
 *   All passed manual review unchanged (mcq, multi, order kinds).
 */
import { module_, lesson, step, prose, table, callout, scaleExplorer, sources, mcq, multi, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l9-2-1',
      'The Formal Major Scale Formula (W - W - H - W - W - W - H)',
      [
        step(
          'A Key Is a Home, a Scale Is a Tool',
          [
            prose(
              '<p>A <strong>Key</strong> is the tonal home — a piece in the Key of G Major has G as its acoustic resting center, governed by a key signature. A <strong>Scale</strong> is a tool — a specific ladder of notes arranged by step. A piece in the Key of G may use the G Major Scale, G Pentatonic Scale, or G Blues Scale interchangeably; the key stays G, but the scale used to build a given melody can change.</p>',
            ),
            sources(['The difference between scales and keys.pdf']),
          ],
          mcq(
            'According to the text, what remains the same when a melody in the Key of G switches from using the G Major Scale to the G Blues Scale?',
            ['The scale', 'The tonal home', 'The ladder of notes', 'The acoustic center changes'],
            1,
            'The step text states that the key stays G even though the scale used to build the melody can change.',
          ),
        ),
        step(
          'The Major Scale Formula',
          [
            prose(
              '<p>A full 1-octave diatonic Major Scale spans 8 notes (7 scale steps) using the invariant interval formula <strong>W - W - H - W - W - W - H</strong>. The two half steps occur strictly between Scale Degrees 3-4 (Mi-Fa) and Scale Degrees 7-8 (Ti-Do); every other step is a whole step.</p>',
            ),
            scaleExplorer('major-scales', 'C', { showFingering: true, caption: 'C Major — W-W-H-W-W-W-H. Use the root selector to check any of the twelve major scales.' }),
            sources(['Theory of scales in music.pdf', 'Major Scales.pdf']),
          ],
          mcq(
            'Where do the two half steps occur in the 1-octave diatonic Major Scale?',
            [
              'Between scale degrees 1-2 and 4-5',
              'Strictly between scale degrees 3-4 and 7-8',
              'Between scale degrees 2-3 and 5-6',
              'Between scale degrees 6-7 and 8-1',
            ],
            1,
            'The step text states that the two half steps occur strictly between Scale Degrees 3-4 (Mi-Fa) and Scale Degrees 7-8 (Ti-Do).',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'F4', semitones: 1 },
            { assert: 'interval', from: 'B4', to: 'C5', semitones: 1 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-2-2',
      'Standard C Major Fingering and the Thumb-Under Mechanism',
      [
        step(
          'The Fingering Matrix',
          [
            prose(
              '<p>Because the human hand has 5 fingers but a scale requires 8 notes, the thumb must tuck under fingers 2 and 3. Ascending RH, Group 1 (fingers 1-2-3 on C-D-E) tucks the thumb under to land on F, then Group 2 (fingers 1-2-3-4-5 on F-G-A-B-C) carries the scale to the top. LH ascending mirrors this with a finger-3 crossover instead of a thumb tuck.</p>',
            ),
            table(
              ['Hand / Direction', 'Fingering'],
              [
                ['RH ascending', '1 (C) - 2 (D) - 3 (E) - [tuck] - 1 (F) - 2 (G) - 3 (A) - 4 (B) - 5 (C)'],
                ['RH descending', '5 (C) - 4 (B) - 3 (A) - 2 (G) - 1 (F) - [cross] - 3 (E) - 2 (D) - 1 (C)'],
                ['LH ascending', '5 (C) - 4 (D) - 3 (E) - 2 (F) - 1 (G) - [cross] - 3 (A) - 2 (B) - 1 (C)'],
                ['LH descending', '1 (C) - 2 (B) - 3 (A) - [tuck] - 1 (G) - 2 (F) - 3 (E) - 4 (D) - 5 (C)'],
              ],
              'C Major 1-octave fingering, both hands, both directions.',
            ),
            sources(['Major Scales Fingering Guide.pdf']),
          ],
          mcq(
            'According to the step text, what does the right hand do after playing Group 1 (fingers 1-2-3 on C-D-E) when ascending the C Major scale?',
            [
              'Cross finger 3 over the thumb',
              'Carry the scale to the top with fingers 1-2-3-4-5',
              'Tuck the thumb under to land on F',
              'Play fingers 4 and 5 on A and B',
            ],
            2,
            'The step text explicitly states that ascending RH, Group 1 (fingers 1-2-3 on C-D-E) tucks the thumb under to land on F, then Group 2 (fingers 1-2-3-4-5 on F-G-A-B-C) carries the scale to the top.',
          ),
        ),
        step(
          'The Thumb Tuck Mechanic',
          [
            prose(
              '<p>When RH Finger 3 strikes E, Finger 1 immediately glides horizontally beneath the palm to position itself over F. When Finger 1 strikes F, the hand seamlessly releases E and re-aligns over the upper tetrachord (F-G-A-B-C). The elbow stays quiet during the pass — the thumb flexes naturally beneath the palm rather than the elbow lifting into the air, and the crossover must flow like an unbroken ribbon of sound rather than a rigid, jerky speed change.</p>',
            ),
            callout(
              'warning',
              'Two thumb-tuck traps',
              '<p>Don’t lift the elbow high into the air during the tuck — the elbow stays quiet. And don’t run out of fingers at the top of the scale — stick to the standard 1-2-3-1-2-3-4-5 pattern rather than improvising a fingering mid-scale.</p>',
            ),
            sources(['Major Scales Fingering Guide.pdf']),
          ],
          mcq(
            'According to the instructions, what should the elbow do during the thumb tuck when playing the C major scale?',
            ['Lift high into the air', 'Stay quiet', 'Flex beneath the palm', 'Move in a jerky motion'],
            1,
            'The step text explicitly states that the elbow stays quiet during the pass and warns against lifting the elbow high into the air during the tuck.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-2-3',
      'A Natural Minor: Same White Keys, Different Home',
      [
        step(
          'The Relative Minor of C Major',
          [
            prose(
              '<p>A Natural Minor is the Relative Minor of C Major. It uses the exact identical white-key pitch collection (A-B-C-D-E-F-G-A) but shifts the tonal gravitational center to A, using the Natural Minor Formula: <strong>W - H - W - W - H - W - W</strong>. Fingering uses the identical 1-2-3-1-2-3-4-5 pattern for RH starting on A.</p>',
            ),
            scaleExplorer('minor-scales', 'A', { showFingering: true, caption: 'A Natural Minor — same seven pitch classes as C Major, home shifted to A.' }),
            sources(['The difference between scales and keys.pdf', 'Theory of scales in music.pdf']),
          ],
          mcq(
            'According to the step, what is the formula for the Natural Minor scale?',
            [
              'W - W - H - W - W - W - H',
              'W - H - W - W - H - W - W',
              'W - H - W - W - W - H - W',
              'H - W - W - H - W - W - W',
            ],
            1,
            'The step text explicitly states the Natural Minor Formula as W - H - W - W - H - W - W.',
          ),
          [
            { assert: 'pcSet', root: 'A', semitones: [0, 2, 3, 5, 7, 8, 10], notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          ],
        ),
        step(
          'Half Step Locations in Natural Minor',
          [
            prose(
              '<p>In Natural Minor, half steps occur between Scale Degrees 2-3 (B-C) and Scale Degrees 5-6 (E-F) — different degree numbers than the Major Scale’s 3-4 and 7-8, even though the two scales share every pitch.</p>',
            ),
            sources(['Theory of scales in music.pdf']),
          ],
          mcq(
            'In the A Natural Minor scale, between which scale degrees do the half steps occur?',
            ['3-4 and 7-8', '2-3 and 5-6', '1-2 and 4-5', '4-5 and 7-8'],
            1,
            'The step text explicitly states that in Natural Minor, half steps occur between Scale Degrees 2-3 (B-C) and Scale Degrees 5-6 (E-F).',
          ),
          [
            { assert: 'interval', from: 'B4', to: 'C5', semitones: 1 },
            { assert: 'interval', from: 'E4', to: 'F4', semitones: 1 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-2-4',
      'Technical Names of the Seven Scale Degrees',
      [
        step(
          'The Seven Degree Names',
          [
            prose('<p>Classical theory assigns specific functional names to every scale degree.</p>'),
            table(
              ['Degree', 'Technical Name', 'Functional Meaning'],
              [
                ['1', 'Tonic', 'The tonal center, keynote, and point of rest.'],
                ['2', 'Supertonic', '“Above the Tonic.”'],
                ['3', 'Mediant', '“Midway” between Tonic and Dominant.'],
                ['4', 'Subdominant', 'The fifth below the tonic (or step below dominant).'],
                ['5', 'Dominant', 'The primary harmonic pillar of tension.'],
                ['6', 'Submediant', '“Midway” between Tonic and lower Subdominant.'],
                ['7', 'Leading Tone (or Subtonic)', 'One half step below tonic; strongly pulls up to 1 (Subtonic if a whole step below).'],
              ],
            ),
            sources(['Scale degrees dictionary.pdf', 'Technical Names of Scale Degrees']),
          ],
          multi(
            'Which scale degrees are described as being "midway" between other degrees?',
            ['Supertonic', 'Mediant', 'Subdominant', 'Submediant', 'Leading Tone'],
            [1, 3],
            'The step text explicitly states that the Mediant is “Midway” between Tonic and Dominant and that the Submediant is “Midway” between Tonic and lower Subdominant.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l9-2-5',
      'The 4-Step Scale Memorization Method',
      [
        step(
          'The Conservatory Scale Memorization Method',
          [
            prose('<p>A published 4-step method for memorizing any scale:</p>'),
            table(
              ['Step', 'Instruction'],
              [
                ['1. Visualize Pattern & Accidentals', 'Identify all sharps or flats in the key signature before playing.'],
                ['2. Isolate the Finger Groupings (3 + 5)', 'Mentally split the 8 notes into Group 1 (3 fingers) and Group 2 (5/4 fingers). Know exactly where the thumb tuck occurs.'],
                ['3. Hyper-Slow Finger-Glide Rehearsal', 'Play up and down at 40 BPM with silent, fluid thumb tucks.'],
                ['4. Scale Rotation Integration', 'Incorporate into weekly technical rotation with varied dynamics.'],
              ],
            ),
            sources(['How to Learn and Memorize Scales.pdf']),
          ],
          order(
            'What is the correct order of the 4-step method for memorizing any scale?',
            [
              'Hyper-Slow Finger-Glide Rehearsal',
              'Visualize Pattern & Accidentals',
              'Scale Rotation Integration',
              'Isolate the Finger Groupings (3 + 5)',
            ],
            [
              'Visualize Pattern & Accidentals',
              'Isolate the Finger Groupings (3 + 5)',
              'Hyper-Slow Finger-Glide Rehearsal',
              'Scale Rotation Integration',
            ],
            'The step text presents the published 4-step method in a numbered table with Visualize Pattern & Accidentals as step 1, Isolate the Finger Groupings (3 + 5) as step 2, Hyper-Slow Finger-Glide Rehearsal as step 3, and Scale Rotation Integration as step 4.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m9-2-ex-a',
      type: 'Scalework drill',
      title: 'Protocol 9.2-A — C Major 1-Octave Scalework',
      prompt: 'Place RH on Middle C. Play C Major 1 octave up and down at 60 BPM (quarter notes). Focus on the E-to-F transition: Finger 1 must already be tucked under the palm before Finger 3 releases E. Repeat with LH starting on Bass C (Finger 5).',
    },
  ],
  checkpoints: [
    'Scale vs. Key Definition: can state in one sentence why a key is a tonal home while a scale is a melodic tool.',
    'Major Scale Formula: can recite W-W-H-W-W-W-H from memory.',
    'C Major Fingering Mastery: can execute 1-octave C Major ascending and descending with both RH and LH using standard fingering at 60 BPM.',
    'A Natural Minor Execution: can play 1-octave A Natural Minor and explain its relative relationship to C Major.',
    'Scale Degree Names: can identify the Mediant (3), Subdominant (4), and Dominant (5) of C Major.',
  ],
  outcomes: [
    'Articulate the theoretical distinction between a Key (the tonal home/framework) and a Scale (a melodic tool/pitch collection) in a precise, objective sentence.',
    'Construct the full 1-octave Major Scale Formula: W - W - H - W - W - W - H.',
    'Execute the full 1-octave C Major Scale hands separately with standard fingering (RH: 1-2-3-1-2-3-4-5; LH: 5-4-3-2-1-3-2-1) and fluid thumb-under passes.',
    'Construct and execute the full 1-octave A Natural Minor Scale as the relative minor of C Major (W-H-W-W-H-W-W).',
    'Recite and apply the 7 formal technical scale degree names: Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone / Subtonic.',
    'Apply the published conservatory 4-step scale memorization method (How to Learn and Memorize Scales).',
  ],
  sources: [
    'The difference between scales and keys.pdf',
    'Theory of scales in music.pdf',
    'Scale degrees dictionary.pdf',
    'Major Scales.pdf',
    'How to Learn and Memorize Scales.pdf',
  ],
  practiceFocus: ['C major and A natural minor one octave HS with the published fingering.'],
  id: 'piano-m9-2',
  code: '9.2',
  title: 'Scale vs. Key: C Major and A Minor Full 1-Octave Scales',
});
