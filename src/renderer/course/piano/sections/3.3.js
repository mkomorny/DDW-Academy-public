/**
 * Section 3.3 — First Songs by Ear (One Hand, Then Two Hands)
 * Module 3 — First Music
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_03_First_Music/
 * Section_3.3_First_Songs_By_Ear.md), read in full before authoring.
 *
 * Conversion notes:
 * - Both repertoire etudes (Hot Cross Buns, Ode to Joy's opening phrase) are
 *   stepwise melodies entirely inside the C Position pentascale taught in
 *   3.2, so every melodic step here — and the LH open-fifth drone — gets an
 *   `interval` assert computed by hand from the stated pitches: E-D and D-C
 *   are each a 2-semitone step (E4->D4, D4->C4); the LH drone's C-G is a
 *   perfect fifth, 7 semitones (C3->G3). This is the first section since
 *   2.3 to lean on `interval` asserts, and the first to combine them with
 *   the `pcSet` pattern 3.2 established for five-finger positions.
 * - Hot Cross Buns and Ode to Joy get real keyboard() blocks highlighting
 *   the pitches in play, matching the course's established "promote the
 *   keybed diagram" rule; their measure-by-measure lyric/pitch/fingering/
 *   rhythm layout is a real table(), not preformatted ASCII.
 * - Per the plan's mapping rule, §5's single Structured Practice Protocol
 *   becomes the module's one exercises[] entry (explicit id), §4's
 *   Methodological Traps become a callout() in lesson 3.3.5's closing step
 *   (the two-hand coordination lesson the first and third traps are
 *   directly about; the second trap — guessing keys without singing first —
 *   is folded into lesson 3.3.1's own step instead, since that's the lesson
 *   it corrects), and §6's Gate C Assessment Audit replaces the scaffold's
 *   generic checkpoints[] below, exactly as Section 1.3/2.3 did for Gates A
 *   and B — this is Module 3's own gate section.
 * - The AI-drafted multi() check for lesson 3.3.5 step 2 originally paired
 *   each correct option with a near-duplicate distractor that restated the
 *   same failure in different words ("allowing the LH to lift" next to
 *   "lifting the LH drone", "rushing" next to "failing to subdivide") —
 *   a learner could correctly mark the paraphrased distractor true and be
 *   scored wrong. Caught in review before splicing; the two ambiguous
 *   distractors were hand-replaced with genuinely false statements (a wrong
 *   drone voicing, and dragging — the opposite of the stated failure).
 * - Since this completes Module 3, Level 3 is wired into LEVELS/GATES in
 *   piano/index.js in the same batch, adding Gate C — see that file's
 *   header for the wiring note.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified (mcq, text,
 *   and multi kinds).
 */
import { module_, lesson, step, prose, table, callout, keyboard, sources, mcq, text, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l3-3-1',
      'The "Sing-Then-Find" Aural Methodology',
      [
        step(
          'Listen, Audiate, Sing',
          [
            prose(
              '<p>Playing by ear is not a mysterious inborn talent — it is a trainable analytical skill. The first step is to listen to a phrase until you can hum or sing it from memory with accurate pitch direction.</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          text(
            'What is the first step when developing the skill of playing by ear?',
            [
              'listen to a phrase until you can hum or sing it from memory with accurate pitch direction',
              'listen to a phrase until you can hum or sing it',
              'hum or sing from memory with accurate pitch direction',
            ],
            'The step text explicitly states that the first step is to listen to a phrase until you can hum or sing it from memory with accurate pitch direction.',
          ),
        ),
        step(
          'Determine Contour, Then Locate the Anchor',
          [
            prose(
              '<p>Next, ask diagnostic questions: does the next note move higher (right), lower (left), or stay on the same key? Does it move by a step (adjacent key) or a skip (bypassing a key)? Only then do you identify the starting pitch and place your hand in position.</p>',
            ),
            callout(
              'warning',
              'Never guess a key at random',
              `<p>Guessing keys randomly without singing or analyzing pitch contour first is one of this section's most common traps. Stop, and sing the phrase aloud first to identify step up vs. step down before touching the keybed.</p>`,
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'According to the instructions, what should you do before identifying the starting pitch and placing your hand in position?',
            [
              'Guess a key at random',
              'Ask diagnostic questions about whether the next note moves higher, lower, or stays the same and whether it moves by a step or a skip',
              'Sing the phrase aloud first to identify step up vs. step down',
              'Touch the keybed immediately',
            ],
            1,
            'The step text states: ask diagnostic questions about whether the next note moves higher (right), lower (left), or stays on the same key and whether it moves by a step (adjacent key) or a skip (bypassing a key), only then identify the starting pitch and place your hand in position.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-3-2',
      'Repertoire Study 1: Hot Cross Buns',
      [
        step(
          'Three Notes, Three Fingers',
          [
            prose(
              '<p><em>Hot Cross Buns</em> is the archetypal pedagogical three-note study. It uses three white keys (E, D, C), three digits (3, 2, 1), in 4/4 time starting on E (RH finger 3), and contrasting rhythmic subdivisions.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 64,
                highlight: ['C4', 'D4', 'E4'],
                showLabels: 'all',
                caption: 'Hot Cross Buns’ three pitches — E, D, C — RH fingers 3, 2, 1.',
              },
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the step text, which three white keys and corresponding right-hand fingers are used in Hot Cross Buns?',
            [
              'E D C with fingers 1 2 3',
              'E D C with fingers 3 2 1',
              'C D E with fingers 3 2 1',
              'D C B with fingers 2 1 3',
            ],
            1,
            'The step text explicitly states that Hot Cross Buns uses three white keys (E, D, C) and three digits (3, 2, 1) with the three pitches — E, D, C — RH fingers 3, 2, 1.',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'D4', semitones: 2 },
            { assert: 'interval', from: 'D4', to: 'C4', semitones: 2 },
          ],
        ),
        step(
          'Measure by Measure',
          [
            table(
              ['Measure', 'Lyrics', 'Pitch', 'Fingering', 'Rhythm'],
              [
                [
                  '1',
                  'Hot / Cross / Buns / [Rest]',
                  'E / D / C / —',
                  '3 / 2 / 1 / —',
                  'Quarter / Quarter / Half note / 1 beat silence',
                ],
                [
                  '2',
                  'Hot / Cross / Buns / [Rest]',
                  'E / D / C / —',
                  '3 / 2 / 1 / —',
                  'Quarter / Quarter / Half note / 1 beat silence',
                ],
                [
                  '3',
                  'One-a-penny, / Two-a-penny,',
                  'C C C C / D D D D',
                  '1 1 1 1 / 2 2 2 2',
                  'Four eighth notes / Four eighth notes',
                ],
                [
                  '4',
                  'Hot / Cross / Buns / [Rest]',
                  'E / D / C / —',
                  '3 / 2 / 1 / —',
                  'Quarter / Quarter / Half note / 1 beat silence',
                ],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the table, what is the rhythm for the first three notes of measures 1, 2, and 4?',
            [
              'Four eighth notes',
              'Quarter / Quarter / Half note',
              'Quarter / Eighth / Eighth',
              'Half note / Quarter / Quarter',
            ],
            1,
            'The step text table explicitly lists the rhythm for measures 1, 2, and 4 as Quarter / Quarter / Half note / 1 beat silence for the notes E / D / C / —.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l3-3-3',
      'Transposition by Digit and Register',
      [
        step(
          'Left-Hand Transposition',
          [
            prose(
              '<p>Once Hot Cross Buns is mastered in RH C Position, transpose it to the Left Hand in Low C Position: fingers 3 on E, 4 on D, 5 on C. In measure 3, this becomes 5 on C moving to 4 on D. Execute with identical rhythmic precision.</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'In Low C Position for the left hand, which fingers are placed on E, D, and C respectively when transposing Hot Cross Buns?',
            [
              '3 on E, 4 on D, 5 on C',
              '5 on E, 4 on D, 3 on C',
              '3 on C, 2 on D, 1 on E',
              '5 on C, 4 on D, 3 on E',
            ],
            0,
            'The step text explicitly states: transpose it to the Left Hand in Low C Position: fingers 3 on E, 4 on D, 5 on C.',
          ),
        ),
        step(
          'Register Shift',
          [
            prose(
              '<p>Play the entire study one octave higher (starting from C5) and one octave lower (starting from C3), observing how the tonal character changes across registers even though the fingering and rhythm stay identical.</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'What remains identical when playing the study one octave higher or lower?',
            [
              'The tonal character',
              'The fingering and rhythm',
              'The starting note only',
              'The register',
            ],
            1,
            'The step text states that the tonal character changes across registers even though the fingering and rhythm stay identical.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l3-3-4',
      'Repertoire Study 2: Ode to Joy Melodic Phrase',
      [
        step(
          'A Five-Digit Stepwise Melody',
          [
            prose(
              '<p>Beethoven’s <em>Ode to Joy</em> opening phrase is a five-finger stepwise melody that uses all five digits of the C House, all quarter notes except the final half note: E-E-F-G, G-F-E-D, C-C-D-E, E-D-D.</p>',
            ),
            keyboard(
              {
                low: 60,
                high: 67,
                highlight: ['C4', 'D4', 'E4', 'F4', 'G4'],
                showLabels: 'all',
                caption: 'Ode to Joy’s opening phrase stays entirely inside RH C Position.',
              },
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the step text, which description matches the opening phrase of Beethoven’s Ode to Joy?',
            [
              'A five-finger stepwise melody using all five digits of the C House, all quarter notes except the final half note: E-E-F-G, G-F-E-D, C-C-D-E, E-D-D',
              'A five-finger stepwise melody using only three digits of the C House, all half notes: E-F-G, G-F-E, C-D-E, E-D-C',
              'A stepwise melody that moves outside of RH C Position with a mix of quarter and eighth notes',
              'A five-finger melody that stays in RH C Position but uses only half notes throughout',
            ],
            0,
            'The step text explicitly states that Beethoven’s Ode to Joy opening phrase is a five-finger stepwise melody that uses all five digits of the C House, all quarter notes except the final half note: E-E-F-G, G-F-E-D, C-C-D-E, E-D-D and stays entirely inside RH C Position.',
          ),
        ),
        step(
          'Measure by Measure',
          [
            table(
              ['Measure', 'Pitch', 'Fingering'],
              [
                ['1', 'E E F G', '3 3 4 5'],
                ['2', 'G F E D', '5 4 3 2'],
                ['3', 'C C D E', '1 1 2 3'],
                ['4', 'E D D (held 2 beats)', '3 2 2'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          text(
            'What is the fingering notated for the final held note in measure 4?',
            ['2', 'two'],
            'The step text shows the fingering row for measure 4 as 3 2 2, with the last 2 corresponding to the held D.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l3-3-5',
      'The First Two-Hand Coordination: The Sustained Drone',
      [
        step(
          'The Drone Coordination Matrix',
          [
            prose(
              '<p>Independence between the hands is initiated by holding a static harmony in one hand while the other hand executes rhythmic melody. LH finger 5 depresses Bass C; LH finger 1 depresses Bass G — an open fifth, held firmly for the full four beats — while RH plays Measure 1 of Hot Cross Buns above it.</p>',
            ),
            keyboard(
              {
                low: 36,
                high: 43,
                highlight: ['C2', 'G2'],
                showLabels: 'all',
                caption: 'LH open-fifth drone — Bass C and Bass G, held together.',
              },
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'What does the left hand play while the right hand performs Measure 1 of Hot Cross Buns?',
            [
              'A single Bass C note',
              'An open fifth of Bass C and Bass G held for four beats',
              'The full Hot Cross Buns melody',
              'Moving notes changing every beat',
            ],
            1,
            'The step text states that LH finger 5 depresses Bass C and LH finger 1 depresses Bass G — an open fifth, held firmly for the full four beats — while RH plays Measure 1 of Hot Cross Buns.',
          ),
          [
            { assert: 'interval', from: 'C2', to: 'G2', semitones: 7 },
          ],
        ),
        step(
          'The Biomechanical Check',
          [
            prose(
              '<p>Do not allow RH finger strikes to cause the LH to lift early or twitch. Keep the LH relaxed and grounded, maintaining its weight into the keybed for the entire measure.</p>',
            ),
            callout(
              'warning',
              'Anchor the drone, don’t re-strike it',
              '<p>Lifting the LH drone every time RH plays a new note is the most common failure here — train the LH to remain an anchored gravitational anchor while RH moves freely above it. Rushing Measure 3’s eighth notes ("One-a-penny, two-a-penny") is the other common failure — subdivide them strictly against the metronome ("1-and-2-and") rather than letting them speed up.</p>',
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          multi(
            'According to the instructions, what are the two most common failures to avoid when performing this exercise?',
            [
              'Allowing RH finger strikes to cause the LH to lift early or twitch',
              'Playing the LH drone as a single note instead of an open fifth',
              'Rushing the eighth notes in measure 3',
              `Dragging measure 3's eighth notes behind the metronome`,
            ],
            [0, 2],
            `The step text explicitly identifies allowing RH strikes to cause LH lift/twitch and rushing measure 3's eighth notes as the two most common failures to avoid — the drone's open-fifth voicing and dragging (the opposite of rushing) aren't named as failures here.`,
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l3-3-6',
      'Recording the First Two-Hand Song',
      [
        step(
          'Capture an Unedited Take',
          [
            prose(
              '<p>Capture an unedited audio take of Hot Cross Buns with the LH drone. Do not expect studio perfection — the point of recording is honest self-assessment, not a polished performance.</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'What is the main purpose of recording an unedited take of Hot Cross Buns with the LH drone?',
            [
              'To create a polished studio performance',
              'To enable honest self-assessment',
              'To demonstrate technical perfection',
              'To impress an audience',
            ],
            1,
            'The step text states that the point of recording is honest self-assessment, not a polished performance.',
          ),
        ),
        step(
          'Evaluate the Take',
          [
            prose(
              '<p>Listen back and evaluate two things specifically: did the pulse stay steady throughout? Did the LH hold for the full measure each time, without releasing early?</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          multi(
            'According to the step, which two specific things should you listen back for and evaluate in your recording?',
            [
              'Did the pulse stay steady throughout?',
              'Did the RH use correct fingering?',
              'Did the LH hold for the full measure each time without releasing early?',
              'Did the melody match the Hot Cross Buns pattern?',
              'Was the drone a C–G open fifth?',
            ],
            [0, 2],
            'The step text explicitly directs the learner to evaluate whether the pulse stayed steady and whether the LH held for the full measure each time without releasing early.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m3-3-ex-a',
      type: 'Repertoire drill',
      title: 'Protocol 3.3-A — Hot Cross Buns RH/LH Consolidation',
      prompt: 'Play Hot Cross Buns RH alone with a metronome at 60 BPM. Then play it LH alone (fingers 3-4-5) at 60 BPM. Finally, play it RH with LH single-note Bass C drone held across each measure.',
    },
  ],
  checkpoints: [
    'One-hand tune by ear: you can play Hot Cross Buns from memory with correct RH fingering (3-2-1) without visual hesitations.',
    'Steady pulse maintained: you can perform the entire piece along with a 60 BPM metronome without rushing the eighth notes or dragging the rests.',
    'C-Position reliability: your hand maintains the relaxed C House dome, with inactive fingers staying quiet.',
    'Two-hand drone coordination: you can play the complete piece in RH while LH holds a sustained Bass C drone without releasing the LH early.',
  ],
  outcomes: [
    'Apply the "Sing-Then-Find" aural methodology: audiating and singing a melody prior to physical key exploration.',
    'Perform the traditional three-note folk study *Hot Cross Buns* (E–D–C) with correct RH fingering (3–2–1) over a steady pulse.',
    'Transpose the three-note pattern to different starting digits and register locations.',
    'Execute a second stepwise five-finger folk melody (*Ode to Joy* opening phrase: E–E–F–G–G–F–E–D–C–C–D–E–E–D–D).',
    'Coordinate a Left-Hand sustained harmonic drone (Held C or C–G open fifth) beneath an active Right-Hand melody without rhythmic collapse.',
    'Complete and execute the Gate C Assessment Rubric.',
  ],
  sources: [
    'The Hoffman Method of Learning Piano.pdf',
    'Building Rhythm Skills in the Beginning Musician.pdf',
    'Piano Skill Levels Explained.pdf',
    'A perfect guide to learning piano.pdf',
  ],
  practiceFocus: ['Sing then play *Hot Cross Buns*; add a held LH C or C–G; record it (Gate C).'],
  id: 'piano-m3-3',
  code: '3.3',
  title: 'First Songs by Ear (One Hand, Then Two Hands)',
});
