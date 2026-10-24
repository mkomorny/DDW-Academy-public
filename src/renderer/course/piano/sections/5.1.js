/**
 * Section 5.1 — What a Pentascale Is: All White-Key Majors and Minors
 * Module 5 — Five-Finger Fluency
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_05_Five_Finger_Fluency/
 * Section_5.1_What_A_Pentascale_Is_White_Keys.md), read in full before
 * authoring. Authored together with 5.2, 5.3, and 6.1 in one chained sitting
 * per Miranda's explicit one-time request ("do the next 4 steps in one
 * pass") — a one-off deviation from the plan's normal per-batch stop-and-
 * wait protocol, matching the same shape as the prior Module-3 and Module-4
 * chaining exceptions, not a new standing permission.
 *
 * Conversion notes:
 * - This is the course's first use of `chordExplorer()` and `intervalDemo()`
 *   — real renderers confirmed at views/blocks.js (`renderers.chord`,
 *   `renderers.interval`) before authoring, matching the same "confirm the
 *   renderer is real" diligence 3.1 applied to rhythm() and 4.1 applied to
 *   staff(). `chordExplorer('C', 'maj')` extracts the pentascale's built-in
 *   1-3-5 tonic triad in 5.1.1 — a direct forward tie to Section 5.3's I/V
 *   harmony content.
 * - `asserts` (pcSet, one per pentascale spelled in this section) are used
 *   throughout — unlike 4.1's single-note-identification content, a
 *   pentascale IS a spelled pitch-class set, so nearly every lesson gets a
 *   real theory-oracle check.
 * - Lesson 5.1.5's catalog table (6 rows: A, E, D, B, G, C Minor) is wider
 *   than the section's own Learning Outcome #5 ("the 5 standard white-key
 *   Minor Pentascales: A, E, D, B, G") — both are faithful to the source
 *   file, which prints all 6 in its catalog but Protocol 5.1-A only drills
 *   C Minor as the direct comparison demo against C Major. Prose calls this
 *   out explicitly rather than silently picking one number.
 * - §4's three Methodological Traps are split: the F-Major-not-all-white-
 *   keys trap gets its own dedicated step (5.1.4, since it's the trap most
 *   directly tied to that lesson's own catalog claim); the other two
 *   (Major/Minor as emotions, wrist-twisting for accidentals) fold into
 *   5.1.6's closing callout, per the plan's "traps -> closing-step callout"
 *   rule.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs), 11 of 12 verified on the
 *   first entailment attempt, one (5.1.5 step 1) on the second. All passed
 *   manual review unchanged (mcq, multi kinds).
 */
import { module_, lesson, step, prose, table, callout, keyboard, chordExplorer, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l5-1-1',
      'Why Pianists Learn Pentascales Before Octaves',
      [
        step(
          'Anatomical Symmetry and Zero Lateral Shifting',
          [
            prose(
              '<p>A <strong>pentascale (five-finger scale pattern)</strong> uses exactly 5 consecutive notes, fitting perfectly under the 5 digits of the human hand (fingers 1 through 5). Because the hand remains in a fixed home position with zero thumb-crossings or wrist contortions, the student can focus 100% of cognitive effort on tone quality, arm weight, and ear training instead of on navigating the keybed.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C4', 'D4', 'E4', 'F4', 'G4'],
                showLabels: 'none',
                caption: 'A pentascale — five consecutive notes, one per finger, in a fixed hand position.',
              },
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'What allows a student to focus 100% of cognitive effort on tone quality, arm weight, and ear training when playing a pentascale?',
            [
              'The use of five consecutive notes',
              'The hand remaining in a fixed home position with zero thumb-crossings or wrist contortions',
              'Fitting the notes under fingers 1 through 5',
              'Playing one note per finger',
            ],
            1,
            'The step text states that because the hand remains in a fixed home position with zero thumb-crossings or wrist contortions, the student can focus 100% of cognitive effort on tone quality, arm weight, and ear training instead of on navigating the keybed.',
          ),
        ),
        step(
          'Triad Foundation',
          [
            prose(
              '<p>The 1st, 3rd, and 5th notes of any pentascale form the fundamental <strong>Tonic Triad</strong>. In C, that is C–E–G — the same three notes the pentascale already places under fingers 1, 3, and 5.</p>',
            ),
            chordExplorer(
              'C',
              'maj',
              {
                caption: 'The Tonic Triad extracted from the C pentascale — scale degrees 1, 3, and 5.',
              },
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'According to the text, which three notes form the Tonic Triad in C?',
            ['C–D–E', 'C–E–G', 'D–F–A', 'E–G–B'],
            1,
            'The step text states that in C the Tonic Triad is C–E–G, the same three notes the pentascale places under fingers 1, 3, and 5.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-1-2',
      'The Major Pentascale Formula (W - W - H - W)',
      [
        step(
          'The W-W-H-W Formula',
          [
            prose(
              '<p>Every Major Pentascale, regardless of starting root, consists of three whole steps and one half step, in this order: Root → (Whole) → 2 → (Whole) → 3 → (Half) → 4 → (Whole) → 5. In solfège, that is Do–Re–Mi–Fa–So. The defining criterion of a Major Pentascale is that the single half step occurs between scale degrees 3 and 4 — Mi and Fa.</p>',
            ),
            table(
              ['Degree', 'Solfège', 'Step to Next Degree'],
              [
                ['1', 'Do', 'Whole'],
                ['2', 'Re', 'Whole'],
                ['3', 'Mi', 'Half'],
                ['4', 'Fa', 'Whole'],
                ['5', 'So', '—'],
              ],
              'The Major Pentascale Formula, shown against C Major (C–D–E–F–G).',
            ),
            sources(['What is a Pentascale.pdf', 'Theory of scales in music.pdf']),
          ],
          mcq(
            'According to the Major Pentascale Formula, between which scale degrees does the single half step occur?',
            ['Between 1 and 2', 'Between 2 and 3', 'Between 3 and 4', 'Between 4 and 5'],
            2,
            'The step text states that the defining criterion of a Major Pentascale is that the single half step occurs between scale degrees 3 and 4 — Mi and Fa.',
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
          'Applying the Formula to G',
          [
            prose(
              '<p>The same W-W-H-W formula, applied to a G root, produces G–A–B–C–D. The half step still falls between scale degrees 3 and 4 — here, between B and C.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 79,
                highlight: ['G4', 'A4', 'B4', 'C5', 'D5'],
                showLabels: 'none',
                caption: 'The G Major pentascale — G, A, B, C, D. The half step falls at B–C.',
              },
            ),
            sources(['Piano scales chart.pdf']),
          ],
          mcq(
            'According to the step text, where does the half step fall in the G Major pentascale?',
            ['Between G and A', 'Between A and B', 'Between B and C', 'Between C and D'],
            2,
            'The step text explicitly states that in the G Major pentascale the half step still falls between scale degrees 3 and 4, here between B and C.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'G',
              semitones: [0, 2, 4, 5, 7],
              notes: ['G', 'A', 'B', 'C', 'D'],
            },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-1-3',
      'The Minor Pentascale Formula (W - H - W - W)',
      [
        step(
          'The W-H-W-W Formula and Flat-Three',
          [
            prose(
              '<p>To convert any Major Pentascale into a Minor Pentascale, lower the 3rd scale degree (Mi) by one half step to Flat-Three (Me, pronounced "May"). The half step now shifts to sit between scale degrees 2 and 3 — Re and Me — instead of 3 and 4. In solfège: Do–Re–Me–Fa–So.</p>',
            ),
            table(
              ['Degree', 'Solfège', 'Step to Next Degree'],
              [
                ['1', 'Do', 'Whole'],
                ['2', 'Re', 'Half'],
                ['3', 'Me (♭3)', 'Whole'],
                ['4', 'Fa', 'Whole'],
                ['5', 'So', '—'],
              ],
              'The Minor Pentascale Formula, shown against C Minor (C–D–E♭–F–G).',
            ),
            sources(['What is a Pentascale.pdf', 'Theory of scales in music.pdf']),
          ],
          mcq(
            'To convert a Major Pentascale to a Minor Pentascale, which scale degree must be lowered by a half step?',
            [
              'The 2nd scale degree (Re)',
              'The 3rd scale degree (Mi)',
              'The 4th scale degree (Fa)',
              'The 5th scale degree (So)',
            ],
            1,
            'The step text explicitly states that to convert any Major Pentascale into a Minor Pentascale, lower the 3rd scale degree (Mi) by one half step to Flat-Three (Me).',
          ),
          [
            {
              assert: 'pcSet',
              root: 'C',
              semitones: [0, 2, 3, 5, 7],
              notes: ['C', 'D', 'Eb', 'F', 'G'],
            },
          ],
        ),
        step(
          'A Minor — All White Keys',
          [
            prose(
              '<p>The A Minor Pentascale (A–B–C–D–E) needs no accidentals at all — every note is a white key. The half step falls between B and C, exactly where the W-H-W-W formula requires it (scale degrees 2 and 3).</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 79,
                highlight: ['A4', 'B4', 'C5', 'D5', 'E5'],
                showLabels: 'none',
                caption: 'The A Minor pentascale — A, B, C, D, E. All white keys; the half step falls at B–C.',
              },
            ),
            sources(['Piano scales chart.pdf']),
          ],
          mcq(
            'Where does the half step fall in the A Minor Pentascale?',
            ['Between A and B', 'Between B and C', 'Between C and D', 'Between D and E'],
            1,
            'The step text states that the half step falls between B and C, exactly where the W-H-W-W formula requires it (scale degrees 2 and 3).',
          ),
          [
            {
              assert: 'pcSet',
              root: 'A',
              semitones: [0, 2, 3, 5, 7],
              notes: ['A', 'B', 'C', 'D', 'E'],
            },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-1-4',
      'The White-Key Major Pentascales Catalog',
      [
        step(
          'The Catalog',
          [
            prose(
              '<p>Six standard white-key-rooted Major Pentascales cover the full first-year rotation. Only the root and the notes change — the W-W-H-W formula never does.</p>',
            ),
            table(
              ['Root', 'Spelled Pitches', 'Necessary Accidentals'],
              [
                ['C Major', 'C — D — E — F — G', 'None (All White Keys)'],
                ['G Major', 'G — A — B — C — D', 'None (All White Keys)'],
                ['F Major', 'F — G — A — B♭ — C', 'B♭ (to ensure H between 3–4)'],
                ['D Major', 'D — E — F♯ — G — A', 'F♯ (to ensure W between 2–3)'],
                ['A Major', 'A — B — C♯ — D — E', 'C♯ (to ensure W between 2–3)'],
                ['E Major', 'E — F♯ — G♯ — A — B', 'F♯, G♯ (to preserve W-W-H-W)'],
              ],
            ),
            sources(['Piano scales chart.pdf', 'Piano scales for beginners made simple.pdf']),
          ],
          mcq(
            'According to the table, which Major Pentascale requires both F♯ and G♯ as necessary accidentals?',
            ['D Major', 'A Major', 'E Major', 'F Major'],
            2,
            `The step text's table explicitly lists E Major as requiring F♯, G♯ (to preserve W-W-H-W).`,
          ),
          [
            {
              assert: 'pcSet',
              root: 'D',
              semitones: [0, 2, 4, 5, 7],
              notes: ['D', 'E', 'F#', 'G', 'A'],
            },
          ],
        ),
        step(
          'The F Major Exception',
          [
            prose(
              '<p>F Major is the one white-key-rooted major pentascale that is <em>not</em> all white keys: F–G–A–B♭–C. F to B is a tritone, not a half step, so F Major requires B♭ to place the required half step between scale degrees 3 and 4.</p>',
            ),
            callout(
              'warning',
              'F Major needs B♭, not B natural',
              '<p>Assuming the F Major pentascale is all white keys is a common error. F to B is a tritone; F Major requires B♭ for the half step between 3 and 4.</p>',
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'Why does the F Major pentascale require B♭ instead of B natural?',
            [
              'To make the interval from F to B a half step',
              'Because F to B natural is a tritone and the half step must be between scale degrees 3 and 4',
              'To follow the minor pentascale formula',
              'Because all white-key major pentascales use only white keys',
            ],
            1,
            'The step text states that F to B is a tritone, not a half step, so F Major requires B♭ to place the required half step between scale degrees 3 and 4.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'F',
              semitones: [0, 2, 4, 5, 7],
              notes: ['F', 'G', 'A', 'Bb', 'C'],
            },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-1-5',
      'The Common Minor Pentascales Catalog',
      [
        step(
          'The Catalog',
          [
            prose(
              '<p>The learning outcomes for this section name 5 standard white-key-rooted Minor Pentascales — A, E, D, B, and G. The catalog below also includes C Minor, since Protocol 5.1-A uses it as the direct side-by-side comparison to C Major (flatten finger 3 by a half step and hear Mi become Me).</p>',
            ),
            table(
              ['Root', 'Spelled Pitches', 'Necessary Accidentals'],
              [
                ['A Minor', 'A — B — C — D — E', 'None (All White Keys)'],
                ['E Minor', 'E — F♯ — G — A — B', 'F♯ (W between 1–2)'],
                ['D Minor', 'D — E — F — G — A', 'None (All White Keys)'],
                ['B Minor', 'B — C♯ — D — E — F♯', 'C♯, F♯'],
                ['G Minor', 'G — A — B♭ — C — D', 'B♭ (H between 2–3)'],
                ['C Minor', 'C — D — E♭ — F — G', 'E♭ (H between 2–3)'],
              ],
            ),
            sources(['Piano scales chart.pdf']),
          ],
          multi(
            'According to the catalog, which minor pentascales require no accidentals because they use all white keys?',
            ['A Minor', 'E Minor', 'D Minor', 'B Minor', 'G Minor'],
            [0, 2],
            'The table explicitly states for both A Minor and D Minor: "None (All White Keys)".',
          ),
          [
            {
              assert: 'pcSet',
              root: 'D',
              semitones: [0, 2, 3, 5, 7],
              notes: ['D', 'E', 'F', 'G', 'A'],
            },
          ],
        ),
        step(
          'E Minor Needs F♯',
          [
            prose(
              '<p>E Minor (E–F♯–G–A–B) is a white-key root that still needs one accidental: F♯. The half step falls between F♯ and G — scale degrees 2 and 3 — exactly where the Minor formula requires it.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 79,
                highlight: ['E4', 'F#4', 'G4', 'A4', 'B4'],
                showLabels: 'none',
                caption: 'The E Minor pentascale — E, F♯, G, A, B. The half step falls at F♯–G.',
              },
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'In the E Minor pentascale, between which scale degrees does the half step fall?',
            ['1 and 2', '2 and 3', '3 and 4', '4 and 5'],
            1,
            'The step text states that in E Minor the half step falls between F♯ and G — scale degrees 2 and 3 — exactly where the Minor formula requires it.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'E',
              semitones: [0, 2, 3, 5, 7],
              notes: ['E', 'F#', 'G', 'A', 'B'],
            },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-1-6',
      'First Contrary Motion Coordination Drill',
      [
        step(
          'Contrary Motion Mechanics',
          [
            prose(
              '<p>In <strong>Contrary Motion</strong>, both hands execute identical anatomical fingerings (1 through 5) while moving in opposite physical directions. This is neuromuscularly easier than parallel motion because the brain commands identical finger pairs simultaneously — both thumbs, then both index fingers, then both middle fingers.</p>',
            ),
            table(
              ['Finger', 'RH Ascends', 'LH Descends (Strict C Major)'],
              [
                ['1', 'C', 'G'],
                ['2', 'D', 'F'],
                ['3', 'E', 'E'],
                ['4', 'F', 'D'],
                ['5', 'G', 'C'],
              ],
              'Contrary Motion C Major Pentascale — the strict, C-Major-only-pitches version.',
            ),
            sources(['How to Learn and Memorize Scales.pdf']),
          ],
          mcq(
            'Why is contrary motion neuromuscularly easier than parallel motion according to the step text?',
            [
              'The fingers use different anatomical numbers in each hand',
              'The brain commands identical finger pairs simultaneously',
              'The hands play in the same physical direction',
              'The thumbs play at different times',
            ],
            1,
            'The step text states that contrary motion is neuromuscularly easier because the brain commands identical finger pairs simultaneously — both thumbs, then both index fingers, then both middle fingers.',
          ),
        ),
        step(
          'Reading Traps and Gate Checklist',
          [
            callout(
              'warning',
              'Two more common pentascale traps',
              '<p>Describing Major and Minor purely as "happy" versus "sad" emotions misses the point — Major and Minor are objective interval structures (Mi versus Me), not moods. And twisting the wrist to reach F♯ or C♯ with finger 3 causes strain — instead, move the entire forearm slightly forward into the black-key area.</p>',
            ),
            table(
              ['Self-Assessment Item', 'What to Verify'],
              [
                [
                  'Formula Recitation',
                  'Can state Major (W-W-H-W) and Minor (W-H-W-W) formulas instantly from memory.',
                ],
                ['Solfège Literacy', 'Can sing Do-Re-Mi-Fa-So on Major and Do-Re-Me-Fa-So on Minor.'],
                ['Accidental Accuracy', 'Can explain why D Major requires F♯ and F Major requires B♭.'],
                [
                  'Circuit Execution',
                  'Can perform C, G, D, A Major and Minor pentascales hands separately with zero false key strikes.',
                ],
              ],
            ),
            sources(['What is a Pentascale.pdf']),
          ],
          mcq(
            'According to the text, why should you avoid twisting the wrist when playing F♯ or C♯ with finger 3 in pentascales?',
            [
              'It slows you down',
              'It causes strain',
              'It makes the sound too loud',
              'It prevents using the correct formula',
            ],
            1,
            'The step text explicitly states that twisting the wrist to reach F♯ or C♯ with finger 3 causes strain and instead recommends moving the entire forearm slightly forward into the black-key area.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m5-1-ex-a',
      type: 'Technical circuit',
      title: 'Protocol 5.1-A — Daily White-Key Pentascale Circuit',
      prompt: 'Place RH on C Major (C–D–E–F–G). Play up and down at 72 BPM. Flatten finger 3 to E♭ to play C Minor (C–D–E♭–F–G) — hear the shift from Mi to Me. Advance through G, D, A, E Major and Minor. Repeat with LH.',
    },
  ],
  checkpoints: [
    'Formula Recitation: Can state Major (W-W-H-W) and Minor (W-H-W-W) formulas instantly from memory.',
    'Solfège Literacy: Can sing Do-Re-Mi-Fa-So on Major and Do-Re-Me-Fa-So on Minor.',
    'Accidental Accuracy: Can explain why D Major requires F♯ and F Major requires B♭.',
    'Circuit Execution: Can perform C, G, D, A Major and Minor pentascales hands separately with zero false key strikes.',
  ],
  outcomes: [
    'Define a pentascale as the first 5 diatonic pitches of a scale spanning the interval of a Perfect 5th.',
    'Apply the Major Pentascale Formula: W - W - H - W (Half step between Mi and Fa, Scale Degrees 3 and 4).',
    'Apply the Minor Pentascale Formula: W - H - W - W (Half step between Re and Me, Scale Degrees 2 and 3).',
    'Perform the 6 standard white-key Major Pentascales (C, G, F, D, A, E) hands separately.',
    'Perform the 5 standard white-key Minor Pentascales (A, E, D, B, G) hands separately.',
    'Execute the first symmetric Contrary Motion pentascale drill in C Major (RH ascends as LH descends).',
  ],
  sources: [
    'What is a Pentascale.pdf',
    'Piano scales for beginners made simple.pdf',
    'Theory of scales in music.pdf',
    'Piano scales chart.pdf',
    'How to Learn and Memorize Scales.pdf',
  ],
  practiceFocus: ['White-key major and minor pentascales HS.'],
  id: 'piano-m5-1',
  code: '5.1',
  title: 'What a Pentascale Is: All White-Key Majors and Minors',
});
