/**
 * Section 5.2 — Black-Key Pentascales and the First Position Shifts
 * Module 5 — Five-Finger Fluency
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_05_Five_Finger_Fluency/
 * Section_5.2_Black_Key_Pentascales_First_Position_Shifts.md), read in full
 * before authoring. Authored together with 5.1, 5.3, and 6.1 in one chained
 * sitting per Miranda's explicit one-time request — see 5.1.js's header for
 * the full one-off-chaining note (same exception, not repeated here).
 *
 * Conversion notes:
 * - Continues 5.1's pcSet-assert pattern for the two black-key pentascales
 *   this section spells out in full (D♭, B♭); E♭'s spelling is stated in
 *   the catalog table but not separately asserted, since 5.1 already
 *   established the pattern with 8 asserts across 6 lessons and this
 *   section's real technical content is position shifts and thumb-under
 *   mechanics, not further pentascale spellings.
 * - Lesson 5.2.1's forward-plane keyboard() reuses the same 5-black-key
 *   highlight pattern 2.1 used for octave topography, here recontextualized
 *   as "the whole hand glides forward into this plane," not a labeling
 *   exercise.
 * - Manual review caught one drafted-question defect not flagged by the
 *   shape/entailment pipeline: 5.2.2 step 1's drafted mcq asked which
 *   black-key pentascale "has the step analysis W(root-2), W(2-3), H(3-4),
 *   W(4-5)" — that abstract, letter-free phrasing is true of every Major
 *   Pentascale (D♭ and E♭ included), not distinctively true of the intended
 *   answer (B♭), so the question could not actually be answered from its
 *   own stated criterion. Fixed by hand-editing the drafted JSON before
 *   splicing to reference the table's actual letter-named intervals
 *   (W(B♭-C), W(C-D), H(D-E♭), W(E♭-F)), which uniquely identify B♭. This is
 *   a new defect class, distinct from both defects caught in the prior
 *   batch (a mis-kinded multi and a wrongly-excluded true option) — here
 *   the stated criterion simply failed to discriminate among the options,
 *   even though every option's truth value was individually correct.
 * - Check-drafting provenance: all 10 step checks were drafted via the xAI
 *   client, all verified on the first entailment attempt (mcq, multi
 *   kinds).
 */
import { module_, lesson, step, prose, table, list, callout, keyboard, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l5-2-1',
      'The Forward/Backward Keyboard Plane',
      [
        step(
          'The Wrist-Twisting Error',
          [
            prose(
              '<p>When playing keys containing accidentals, beginners often leave their arm stationary at the front edge of the keybed and twist their wrists outward to poke at black keys with fingers 3 or 4. This causes severe ulnar and radial wrist strain.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'What problem do beginners often create when reaching for black keys?',
            [
              'They move their whole arm forward on the keybed',
              'They leave their arm stationary and twist their wrists outward',
              'They use only finger 5 to reach the black keys',
              'They lift their wrists too high when playing accidentals',
            ],
            1,
            'The step text explicitly states that beginners often leave their arm stationary at the front edge of the keybed and twist their wrists outward to poke at black keys, causing severe ulnar and radial wrist strain.',
          ),
        ),
        step(
          'The Forearm Glide',
          [
            prose(
              '<p>The corrective law: the entire forearm and hand must glide gently forward toward the fallboard, placing fingers 2, 3, and 4 naturally atop the black keys while the thumb rests comfortably on its white key.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'],
                showLabels: 'none',
                caption: 'Playing keys with accidentals means the whole hand glides forward into the black-key plane, not just the reaching finger.',
              },
            ),
            sources(['Fingerings.pdf', 'Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the corrective law, what must the entire forearm and hand do when playing keys with accidentals?',
            [
              'Stay in the white-key plane',
              'Glide gently forward toward the fallboard',
              'Reach only with the finger that needs the black key',
              'Lift upward away from the keys',
            ],
            1,
            'The step text states that the corrective law requires the entire forearm and hand to glide gently forward toward the fallboard when playing keys with accidentals, placing fingers 2, 3, and 4 atop the black keys.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-2-2',
      'Black-Key Major Pentascales',
      [
        step(
          'The Catalog',
          [
            prose(
              '<p>The W-W-H-W Major Pentascale formula applies identically to black-key roots. Three standard black-key Major Pentascales — D♭, E♭, and B♭ — extend the white-key catalog from Section 5.1.</p>',
            ),
            table(
              ['Root', 'Spelled Pitches', 'Step Analysis'],
              [
                ['D♭ Major', 'D♭ — E♭ — F — G♭ — A♭', 'W (D♭-E♭), W (E♭-F), H (F-G♭), W (G♭-A♭)'],
                ['E♭ Major', 'E♭ — F — G — A♭ — B♭', 'W (E♭-F), W (F-G), H (G-A♭), W (A♭-B♭)'],
                ['B♭ Major', 'B♭ — C — D — E♭ — F', 'W (B♭-C), W (C-D), H (D-E♭), W (E♭-F)'],
              ],
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'Which black-key Major Pentascale has the step analysis W (B♭-C), W (C-D), H (D-E♭), W (E♭-F)?',
            ['D♭ Major', 'E♭ Major', 'B♭ Major', 'C Major'],
            2,
            `The step text's table explicitly lists B♭ Major as having the pitches B♭—C—D—E♭—F with exactly those intervals: W (B♭-C), W (C-D), H (D-E♭), W (E♭-F).`,
          ),
          [
            {
              assert: 'pcSet',
              root: 'Db',
              semitones: [0, 2, 4, 5, 7],
              notes: ['Db', 'Eb', 'F', 'Gb', 'Ab'],
            },
          ],
        ),
        step(
          'B♭ Major on the Keybed',
          [
            prose(
              '<p>B♭ Major (B♭–C–D–E♭–F) is the black-key pentascale with the fewest accidentals of the three — only two. The half step falls between D and E♭, scale degrees 3 and 4, exactly as the Major formula requires.</p>',
            ),
            keyboard(
              {
                low: 66,
                high: 79,
                highlight: ['A#4', 'C5', 'D5', 'D#5', 'F5'],
                showLabels: 'none',
                caption: 'The B♭ Major pentascale — B♭, C, D, E♭, F.',
              },
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'In the B♭ Major pentascale, between which scale degrees does the half step fall?',
            ['1 and 2', '2 and 3', '3 and 4', '4 and 5'],
            2,
            'The step text states that the half step falls between D and E♭, scale degrees 3 and 4, exactly as the Major formula requires.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'Bb',
              semitones: [0, 2, 4, 5, 7],
              notes: ['Bb', 'C', 'D', 'Eb', 'F'],
            },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-2-3',
      'The First Position Shift: Leaving the House',
      [
        step(
          'The Shift Mechanics',
          [
            prose(
              '<p>Most genuine piano literature exceeds the 5-note boundary of a single hand position. In the phrase C–D–E–F–G–[A]–G–E–C (fingering 1–2–3–4–5–[5]–4–2–1), the hand rests in C Position for measures 1–2 (finger 1 on C, finger 5 on G). After playing finger 5 on G, the entire hand glides one step rightward so finger 5 strikes A — then, as the melody descends, the hand glides back so finger 1 realigns with Middle C.</p>',
            ),
            table(
              ['Phase', 'What Happens'],
              [
                ['1 — Home Position', 'Hand rests in C Position: finger 1 on C, finger 5 on G.'],
                [
                  '2 — The Shift',
                  'After finger 5 plays G, the entire hand glides one step rightward so finger 5 strikes A.',
                ],
                [
                  '3 — The Return',
                  'As the melody descends, the hand glides back so finger 1 realigns with Middle C.',
                ],
              ],
            ),
            sources(['Fingerings.pdf']),
          ],
          multi(
            'In the described C–D–E–F–G–A–G–E–C phrase, what does the hand do during the shift and return phases?',
            [
              'After finger 5 plays G the hand glides one step right so finger 5 strikes A',
              'The hand remains in C Position throughout with no gliding',
              'As the melody descends the hand glides back so finger 1 realigns with Middle C',
              'Finger 1 stays on C while only the thumb stretches to reach A',
            ],
            [0, 2],
            'The step text states that after finger 5 plays G the entire hand glides one step rightward so finger 5 strikes A, and that as the melody descends the hand glides back so finger 1 realigns with Middle C.',
          ),
        ),
        step(
          'Rule for Shifting',
          [
            callout(
              'tip',
              'Move the hand as a unified dome',
              '<p>Never reach for note 6 by hyper-stretching finger 5 while anchoring the thumb. Move the entire hand as a unified dome instead.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'How should you play note 6 instead of hyper-stretching finger 5 while anchoring the thumb?',
            [
              'Reach for it by stretching finger 5',
              'Move the entire hand as a unified dome',
              'Anchor the thumb and stretch finger 4',
              'Play it with finger 1',
            ],
            1,
            'The step text explicitly states to move the entire hand as a unified dome instead of reaching for note 6 by hyper-stretching finger 5 while anchoring the thumb.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-2-4',
      'Thumb-Under Preview Drill',
      [
        step(
          'The Four-Step Protocol',
          [
            prose(
              '<p>To play continuous scales across one or two octaves, the thumb must learn to pass smoothly beneath the arch of fingers 2 and 3.</p>',
            ),
            list(
              [
                'Place RH Finger 2 on D, Finger 3 on E.',
                'Play D (Finger 2) → E (Finger 3).',
                'While Finger 3 holds E, glide Finger 1 (Thumb) smoothly beneath the palm to touch F.',
                'Depress F with Finger 1, and release Finger 3 as the hand glides rightward into the new position.',
              ],
              true,
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'In the thumb-under preparation for scales, while finger 3 holds E what does the thumb do?',
            [
              'Play F immediately',
              'Glide smoothly beneath the palm to touch F',
              'Stay on D',
              'Lift and cross over finger 3',
            ],
            1,
            'The step text explicitly states: While Finger 3 holds E, glide Finger 1 (Thumb) smoothly beneath the palm to touch F.',
          ),
        ),
        step(
          'The Biomechanical Law',
          [
            callout(
              'warning',
              'Do not "chicken wing" the thumb tuck',
              '<p>Do not lift the elbow high into the air ("chicken wing") during the thumb tuck. The wrist remains supple and level throughout.</p>',
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'What should you avoid doing with your elbow during the thumb tuck?',
            [
              'Lifting it high into the air',
              'Dropping it below the wrist',
              'Rotating it outward',
              'Bending it sharply',
            ],
            0,
            'The step text explicitly states: Do not lift the elbow high into the air ("chicken wing") during the thumb tuck.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-2-5',
      'Pentascales Hands Together in Similar Motion',
      [
        step(
          'Similar Motion Mechanics',
          [
            prose(
              '<p>In <strong>Similar Motion</strong>, both hands move in the same musical direction simultaneously. Playing a C Major pentascale hands together in similar motion, the RH ascends 1-2-3-4-5 (C-D-E-F-G) while the LH descends 5-4-3-2-1 (also C-D-E-F-G, one or two octaves lower) — the same pitches, moving the same direction, with mirrored fingerings.</p>',
            ),
            table(
              ['RH Finger', 'Pitch', 'LH Finger'],
              [
                ['1', 'C', '5'],
                ['2', 'D', '4'],
                ['3', 'E', '3'],
                ['4', 'F', '2'],
                ['5', 'G', '1'],
              ],
              'Similar Motion C Major Pentascale, hands together, ascending.',
            ),
            sources(['Piano scales exercises.pdf']),
          ],
          mcq(
            'In similar motion for the C Major pentascale hands together, what does the left hand do while the right hand ascends with fingers 1-2-3-4-5?',
            [
              'Ascends with fingers 1-2-3-4-5',
              'Descends with fingers 5-4-3-2-1',
              'Plays the same fingers as the right hand',
              'Stays on the same note',
            ],
            1,
            'The step text states that in similar motion the LH descends 5-4-3-2-1 while the RH ascends 1-2-3-4-5 using the same pitches and mirrored fingerings.',
          ),
        ),
        step(
          'The Neurological Challenge and Gate Checklist',
          [
            prose(
              '<p>Notice that RH Finger 1 plays simultaneously with LH Finger 5, and RH Finger 2 plays with LH Finger 4 — the two hands never share the same finger number at the same instant. This is the first test of asymmetrical bilateral finger independence.</p>',
            ),
            callout(
              'warning',
              'Two more common shift-and-coordination traps',
              '<p>Hesitating during hands-together similar motion because the finger numbers do not match between hands — practice at an ultra-slow tempo (40 BPM) until the symmetrical motion is locked in.</p>',
            ),
            table(
              ['Self-Assessment Item', 'What to Verify'],
              [
                [
                  'Black-Key Pentascales',
                  'Can build and play E♭ Major (E♭–F–G–A♭–B♭) applying whole and half steps.',
                ],
                [
                  'Forward Plane Adjustment',
                  'Hand glides forward into black keys without twisting the wrist.',
                ],
                [
                  'Thumb Tuck Fluidity',
                  'Can execute a thumb-under pass under Finger 3 without flaring the elbow.',
                ],
                [
                  'Hands-Together Unison',
                  'Can perform C Major pentascale HT in similar motion at 60 BPM with perfect note alignment.',
                ],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the text, which fingers play simultaneously in the hands-together pentascale?',
            [
              'RH 1 with LH 5, and RH 2 with LH 4',
              'RH 1 with LH 1, and RH 2 with LH 2',
              'RH 1 with LH 4, and RH 2 with LH 5',
              'RH 3 with LH 3, and RH 5 with LH 1',
            ],
            0,
            'The step text explicitly states that RH Finger 1 plays simultaneously with LH Finger 5, and RH Finger 2 plays with LH Finger 4.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m5-2-ex-a',
      type: 'Technical circuit',
      title: 'Protocol 5.2-A — Hands-Together Similar Motion Circuit',
      prompt: 'Place RH in Middle C Position (1 on C), LH in Low C Position (5 on C). Set metronome to 50 BPM. Play ascending and descending similar motion pentascales, focusing on exact rhythmic unison — both notes must strike at the exact identical millisecond. Repeat in G Major (G–A–B–C–D).',
    },
  ],
  checkpoints: [
    'Black-Key Pentascales: Can build and play E♭ Major (E♭–F–G–A♭–B♭) applying whole and half steps.',
    'Forward Plane Adjustment: Hand glides forward into black keys without twisting the wrist.',
    'Thumb Tuck Fluidity: Can execute a thumb-under pass under Finger 3 without flaring the elbow.',
    'Hands-Together Unison: Can perform C Major pentascale HT in similar motion at 60 BPM with perfect note alignment.',
  ],
  outcomes: [
    'Construct and execute black-key rooted pentascales (D♭ Major, E♭ Major, B♭ Major) applying the invariant W-W-H-W formula.',
    'Adjust the forward/backward position of the hand on the keybed, playing deeper between black keys to accommodate thumb placement.',
    'Execute a lateral 1-key Position Shift in a melody (e.g., reaching for note 6) and return to home position seamlessly.',
    'Execute a basic Thumb-Under Preparation Drill (tucking the thumb beneath Finger 2 or 3 to extend scalar reach).',
    'Perform C Major and G Major pentascales Hands Together in Similar Motion at a steady tempo.',
  ],
  sources: [
    'What is a Pentascale.pdf',
    'Piano Skill Levels Explained.pdf',
    'Fingerings.pdf',
    'Piano scales exercises.pdf',
  ],
  practiceFocus: ['One black-key pentascale and one shift out of the house.'],
  id: 'piano-m5-2',
  code: '5.2',
  title: 'Black-Key Pentascales and the First Position Shifts',
});
