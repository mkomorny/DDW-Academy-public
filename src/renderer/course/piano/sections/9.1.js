/**
 * Section 9.1 — Intervals: The Distances Music Is Made Of
 * Module 9 — Intervals and First Keys
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_09_Intervals_And_First_Keys/
 * Section_9.1_Intervals_The_Distances_Music_Is_Made_Of.md), read in full
 * before authoring. First section of Module 9 — authored on its own, per
 * Miranda's explicit go-ahead for one section (not chained with 9.2/9.3),
 * so Module 9 and Level 9 remain unwired until 9.2 and 9.3 are also done.
 *
 * Conversion notes:
 * - This is the course's first interval-DENSE section: every named interval
 *   from the source's "Complete Interval Spectrum" table gets its own
 *   `intervalDemo()` block and a real `{ assert: 'interval', ... }` claim
 *   (from C4, matching the source's own C-rooted spectrum table) — a
 *   departure from Sections 7.1-8.3's zero-assert run, since interval
 *   quality/semitone facts are exactly what the theory oracle's `interval`
 *   assert kind exists to check (already used in Sections 2.2, 2.3, 3.3,
 *   4.2, and 5.3 — not a new assert kind, just the first section since 5.3
 *   to lean on it this heavily).
 * - The tritone gets real coverage (Lesson 9.1.6's Protocol 9.1-A step) even
 *   though it isn't one of the six numbered lessons the syllabus names,
 *   because Outcome 2 explicitly requires identifying "Tritone (d5/A4)" and
 *   the source's own chromatic-ladder protocol walks straight through it.
 *   The app's INTERVALS table (src/renderer/lib/theory.js) ids the tritone
 *   as `'TT'`, not `'d5'`/`'A4'` as the textbook's own notation reads — used
 *   `intervalDemo('TT', 'C4', ...)` and confirmed against theory.js before
 *   authoring, so the block renders instead of silently no-op'ing on an
 *   unknown id.
 * - Lesson 9.1.5 (Sixths and Sevenths) follows the source's own pairing —
 *   one step for m6+M6 together, one step for m7+M7 together — since the
 *   source itself bullets them that way rather than as four separate
 *   sub-lessons.
 * - Lesson 9.1.1's "Number" step reuses C-to-E (a Major 3rd, 4 semitones) as
 *   its own worked example, exactly as the source's own text does when
 *   introducing the letter-counting rule, so it carries a real interval
 *   assert too even though the step's teaching point is about counting
 *   letters, not semitones.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client, 12 of 12 verified on the first entailment attempt. All passed
 *   manual review unchanged (mcq, text kinds) — the second fully clean batch
 *   in a row with zero hand-fixed defects (matching Section 8.2's precedent
 *   two sections ago).
 */
import { module_, lesson, step, prose, table, callout, intervalDemo, sources, mcq, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l9-1-1',
      'The Anatomy of an Interval: Number and Quality',
      [
        step(
          'The Number: Diatonic Distance',
          [
            prose(
              '<p>An interval’s name has two parts. The first is the <strong>Number</strong>, the diatonic distance: the count of letter names spanned, counting both endpoints. C up to E spans three letters — C, D, E — so that interval’s number is a 3rd.</p>',
            ),
            sources(['Intervals in Music Theory.pdf', 'Musical terms for piano.pdf']),
          ],
          text(
            'According to the text, how many letter names does the interval from C up to E span, counting both endpoints?',
            ['3', 'three', 'a 3rd', 'third'],
            'The step text explicitly states that C up to E spans three letters — C, D, E — so that interval’s number is a 3rd.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'E4', semitones: 4 },
          ],
        ),
        step(
          'The Quality: Chromatic Exactness',
          [
            prose(
              '<p>The second part is the <strong>Quality</strong>, governed by the exact number of semitones (half steps). Unisons, 4ths, 5ths, and Octaves are called <strong>Perfect</strong> — highly stable, acoustic consonances. 2nds, 3rds, 6ths, and 7ths are called <strong>Major</strong> or <strong>Minor</strong> instead: a minor interval is exactly one half step smaller than its major equivalent.</p>',
            ),
            table(
              ['Semitones', 'Interval Name', 'Abbrev.', 'From C', 'Aural Song Hook'],
              [
                ['0', 'Perfect Unison (Prime)', 'P1', 'C — C', 'Same pitch'],
                ['1', 'Minor Second', 'm2', 'C — D♭', '*Jaws* Theme'],
                ['2', 'Major Second', 'M2', 'C — D', '*Happy Birthday* (1st step)'],
                ['3', 'Minor Third', 'm3', 'C — E♭', '*Greensleeves* / *Lullaby*'],
                ['4', 'Major Third', 'M3', 'C — E', '*When the Saints*'],
                ['5', 'Perfect Fourth', 'P4', 'C — F', '*Here Comes the Bride*'],
                ['6', 'Tritone (Dim 5th / Aug 4th)', 'd5 / A4', 'C — F♯ / G♭', '*The Simpsons* / *Maria*'],
                ['7', 'Perfect Fifth', 'P5', 'C — G', '*Star Wars* / *Twinkle*'],
                ['8', 'Minor Sixth', 'm6', 'C — A♭', '*The Entertainer* (pickup)'],
                ['9', 'Major Sixth', 'M6', 'C — A', '*My Bonnie Lies Over the Ocean*'],
                ['10', 'Minor Seventh', 'm7', 'C — B♭', '*Somewhere* (West Side Story)'],
                ['11', 'Major Seventh', 'M7', 'C — B', '*Take On Me* (chorus leap)'],
                ['12', 'Perfect Octave', 'P8', 'C — C (higher)', '*Somewhere Over the Rainbow*'],
              ],
              'The complete interval spectrum, measured from root C.',
            ),
            callout(
              'warning',
              'Two common interval traps',
              '<p>Never call a 4th or a 5th “Major” or “Minor” — unisons, 4ths, 5ths, and octaves are always <strong>Perfect</strong> (or augmented/diminished). And don’t calculate an interval by counting semitones alone: count the letter names first for the number, then verify the quality.</p>',
            ),
            sources(['Intervals in Music Theory.pdf']),
          ],
          mcq(
            'According to the text, which intervals are called Perfect?',
            [
              '2nds, 3rds, 6ths, and 7ths',
              'Unisons, 4ths, 5ths, and Octaves',
              'Only unisons and octaves',
              'Major and minor intervals',
            ],
            1,
            'The step text explicitly states that Unisons, 4ths, 5ths, and Octaves are called Perfect.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-1-2',
      'Seconds (m2 / M2): The Steps',
      [
        step(
          'The Minor 2nd — The Half Step',
          [
            prose(
              '<p>A <strong>Minor 2nd</strong> spans 1 semitone — the half step. It is highly dissonant, a grinding friction between two adjacent pitches. Aural model: the <em>Jaws</em> motif.</p>',
            ),
            intervalDemo('m2', 'C4', { caption: 'Minor 2nd — C to D♭, 1 semitone.' }),
            sources(['Minor second interval.pdf']),
          ],
          mcq(
            'How many semitones does a Minor 2nd span?',
            ['1', '2', '3', '4'],
            0,
            'The step text states that a Minor 2nd spans 1 semitone — the half step.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'Db4', semitones: 1 },
          ],
        ),
        step(
          'The Major 2nd — The Whole Step',
          [
            prose(
              '<p>A <strong>Major 2nd</strong> spans 2 semitones — the whole step, and the standard diatonic stepping stone between scale degrees. Aural model: the first two notes of <em>Happy Birthday</em>.</p>',
            ),
            intervalDemo('M2', 'C4', { caption: 'Major 2nd — C to D, 2 semitones.' }),
            sources(['Major second interval.pdf']),
          ],
          mcq(
            'According to the step, how many semitones does a Major 2nd span?',
            ['1', '2', '3', '4'],
            1,
            'The step text explicitly states that a Major 2nd spans 2 semitones.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'D4', semitones: 2 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-1-3',
      'Thirds (m3 / M3): The Skip That Builds Chords',
      [
        step(
          'The Minor 3rd — Builds Minor Triads',
          [
            prose(
              '<p>Thirds are the primary harmonic building blocks of Western chord structure. A <strong>Minor 3rd</strong> spans 3 semitones and generates minor triads. Aural model: <em>Greensleeves</em>, or the child’s playground taunt (“Nyee-nah”).</p>',
            ),
            intervalDemo('m3', 'C4', { caption: 'Minor 3rd — C to E♭, 3 semitones.' }),
            sources(['Minor third interval.pdf']),
          ],
          mcq(
            'According to the step text, how many semitones does a Minor 3rd span?',
            ['2', '3', '4', '5'],
            1,
            'The step text explicitly states that a Minor 3rd spans 3 semitones.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'Eb4', semitones: 3 },
          ],
        ),
        step(
          'The Major 3rd — Builds Major Triads',
          [
            prose(
              '<p>A <strong>Major 3rd</strong> spans 4 semitones and generates major triads. Aural model: the opening of <em>When the Saints Go Marching In</em>.</p>',
            ),
            intervalDemo('M3', 'C4', { caption: 'Major 3rd — C to E, 4 semitones.' }),
            sources(['Major third interval.pdf']),
          ],
          mcq(
            'How many semitones does a Major 3rd span according to the step text?',
            ['3', '4', '5', '6'],
            1,
            'The step text explicitly states that "A Major 3rd spans 4 semitones".',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'E4', semitones: 4 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-1-4',
      'Perfect 4ths and 5ths: The Structural Pillars',
      [
        step(
          'The Perfect 4th',
          [
            prose(
              '<p>A <strong>Perfect 4th</strong> spans 5 semitones (2.5 whole steps). It is clean, open, and resonant. Aural model: <em>Amazing Grace</em> (“A-ma-”) or <em>Here Comes the Bride</em>.</p>',
            ),
            intervalDemo('P4', 'C4', { caption: 'Perfect 4th — C to F, 5 semitones.' }),
            sources(['Perfect fourth interval.pdf']),
          ],
          mcq(
            'How many semitones does a Perfect 4th span?',
            ['4', '5', '6', '7'],
            1,
            'The step text explicitly states that a Perfect 4th spans 5 semitones (2.5 whole steps).',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'F4', semitones: 5 },
          ],
        ),
        step(
          'The Perfect 5th',
          [
            prose(
              '<p>A <strong>Perfect 5th</strong> spans 7 semitones (3.5 whole steps) — the boundary of the five-finger house, and the foundation of the overtone series. Aural model: the <em>Star Wars</em> main theme, or <em>Twinkle, Twinkle, Little Star</em>.</p>',
            ),
            intervalDemo('P5', 'C4', { caption: 'Perfect 5th — C to G, 7 semitones.' }),
            sources(['Perfect fifth interval.pdf']),
          ],
          mcq(
            'How many semitones does a Perfect 5th span according to the lesson?',
            ['5', '6', '7', '8'],
            2,
            'The step text explicitly states that a Perfect 5th spans 7 semitones (3.5 whole steps).',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-1-5',
      'Sixths and Sevenths: Wide Expressive Leaps',
      [
        step(
          'Minor and Major 6ths',
          [
            prose(
              '<p>A <strong>Minor 6th</strong> spans 8 semitones and a <strong>Major 6th</strong> spans 9 semitones. Both are romantic, expressive melodic leaps. Aural model for the Major 6th: <em>My Bonnie Lies Over the Ocean</em>.</p>',
            ),
            intervalDemo('m6', 'C4', { caption: 'Minor 6th — C to A♭, 8 semitones.' }),
            intervalDemo('M6', 'C4', { caption: 'Major 6th — C to A, 9 semitones.' }),
            sources(['Minor sixth interval.pdf', 'Major sixth interval.pdf']),
          ],
          mcq(
            'How many semitones does a Major 6th span according to the lesson?',
            ['7', '8', '9', '10'],
            2,
            'The step text explicitly states that a Major 6th spans 9 semitones.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'Ab4', semitones: 8 },
            { assert: 'interval', from: 'C4', to: 'A4', semitones: 9 },
          ],
        ),
        step(
          'Minor and Major 7ths',
          [
            prose(
              '<p>A <strong>Minor 7th</strong> spans 10 semitones — essential for dominant seventh chords (V⁷) and blues harmonies. A <strong>Major 7th</strong> spans 11 semitones — a highly piercing leading-tone tension, one half step below the octave.</p>',
            ),
            intervalDemo('m7', 'C4', { caption: 'Minor 7th — C to B♭, 10 semitones.' }),
            intervalDemo('M7', 'C4', { caption: 'Major 7th — C to B, 11 semitones.' }),
            sources(['Minor seventh interval.pdf', 'Major seventh interval.pdf']),
          ],
          mcq(
            'How many semitones does a Minor 7th span according to the text?',
            ['9', '10', '11', '12'],
            1,
            'The step text explicitly states that a Minor 7th spans 10 semitones.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'Bb4', semitones: 10 },
            { assert: 'interval', from: 'C4', to: 'B4', semitones: 11 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-1-6',
      'Melodic vs. Harmonic Execution and the Ear Journal',
      [
        step(
          'Melodic vs. Harmonic Intervals',
          [
            prose(
              '<p>Every interval can be played two ways. A <strong>Melodic Interval</strong> is played one note after another in linear time — the focus is on linear contour, singing trajectory, horizontal distance. A <strong>Harmonic Interval</strong> is played simultaneously, as a vertical sonority — the focus is on dynamic balance, consonant/dissonant blend, and a clean unison drop.</p>',
            ),
            table(
              ['Melodic Interval', 'Harmonic Interval'],
              [
                [
                  'Notes played one after another, in linear time.',
                  'Notes played simultaneously, as a vertical sonority.',
                ],
                [
                  'Focus: linear contour, singing trajectory, horizontal distance.',
                  'Focus: dynamic balance, consonant/dissonant blend, clean unison drop.',
                ],
              ],
            ),
            sources(['Intervals in Music Theory.pdf']),
          ],
          mcq(
            'According to the text, what is the focus when playing a Harmonic Interval?',
            [
              'linear contour, singing trajectory, horizontal distance',
              'dynamic balance, consonant/dissonant blend, and a clean unison drop',
              'notes played one after another in linear time',
              'pitch distance measured in semitones',
            ],
            1,
            'The step text explicitly states that a Harmonic Interval is played simultaneously as a vertical sonority with focus on dynamic balance, consonant/dissonant blend, and a clean unison drop.',
          ),
        ),
        step(
          'Protocol 9.1-A: The Chromatic Interval Ladder',
          [
            prose(
              '<p>Place the right hand on Middle C. Play C, then ascend chromatically to each successive pitch, naming the interval and semitone count aloud: C–C (P1, 0) → C–D♭ (m2, 1) → C–D (M2, 2) → C–E♭ (m3, 3) → C–E (M3, 4) → C–F (P4, 5) → C–F♯ (Tritone, 6) → C–G (P5, 7) → C–A♭ (m6, 8) → C–A (M6, 9) → C–B♭ (m7, 10) → C–B (M7, 11) → C–C (P8, 12). Repeat the ladder ascending from G.</p>',
            ),
            intervalDemo(
              'TT',
              'C4',
              { caption: 'Tritone — C to F♯, 6 semitones, the ladder’s exact midpoint.' },
            ),
            table(
              ['Gate Item', 'What to Verify'],
              [
                [
                  'Quality Taxonomy',
                  'Can explain which intervals are classified as “Perfect” (1, 4, 5, 8) and which are “Major/Minor” (2, 3, 6, 7).',
                ],
                [
                  'Semitone Distance Accuracy',
                  'Can immediately state the semitone count for a Major 3rd (4), Perfect 5th (7), Minor 7th (10), and Perfect 4th (5).',
                ],
                [
                  'Song Hook Audiation',
                  'Can hum the opening interval of *When the Saints* (M3) and *Star Wars* (P5) from memory.',
                ],
              ],
            ),
            sources(['Intervals in Music Theory.pdf']),
          ],
          mcq(
            'According to the exercise, what is the name, quality, and semitone count for the interval from C to F♯?',
            ['P4, 5', 'Tritone, 6', 'm6, 8', 'M3, 4'],
            1,
            'The step text explicitly lists C–F♯ (Tritone, 6) in the chromatic ladder that the student must play and name aloud.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'F#4', semitones: 6 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m9-1-ex-a',
      type: 'Interval ladder drill',
      title: 'Protocol 9.1-A — Chromatic Interval Ladder from C',
      prompt: 'Place RH on Middle C. Play C, then ascend to each successive chromatic pitch, naming the interval and semitone count aloud: C–C (P1, 0) through C–C (P8, 12). Repeat ascending from G.',
    },
  ],
  checkpoints: ['Self-check the outcomes above. No auto-grader for posture or tone.'],
  outcomes: [
    'Define an interval as the pitch distance measured in semitones (half steps) and diatonic scale degrees.',
    'Identify and construct all standard intervals from Unison to Octave: P1, m2, M2, m3, M3, P4, Tritone (d5/A4), P5, m6, M6, m7, M7, P8.',
    'Distinguish between Melodic Intervals (sequential) and Harmonic Intervals (simultaneous).',
    'Construct and execute all intervals above any white-key root (C, G, D, A, E, F, B).',
    'Auralize and identify intervals using universal pedagogical song-hook references (*Song-Hook Journal*).',
  ],
  sources: ['Intervals in Music Theory.pdf', 'Musical terms for piano.pdf'],
  practiceFocus: ['Interval journal: hear, then play, unison through seventh.'],
  id: 'piano-m9-1',
  code: '9.1',
  title: 'Intervals: The Distances Music Is Made Of',
});
