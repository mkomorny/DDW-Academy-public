/**
 * Section 9.3 — Keys on the Page: Key Signatures (0–2 Accidentals)
 * Module 9 — Intervals and First Keys
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_09_Intervals_And_First_Keys/
 * Section_9.3_Keys_On_The_Page_Signatures_0_to_2.md), read in full before
 * authoring. Third and final section of Module 9 — authored together with
 * 9.2, 10.1, and 10.2 under Miranda's explicit one-time chaining override
 * ("do the next 4 steps in one pass"), the sixth such documented exception.
 * Completing this section completes Module 9, so Level 9 and Gate G are
 * wired into piano/index.js in the same batch.
 *
 * Conversion notes:
 * - First live use of the theory oracle's `keySignature` assert kind.
 *   Confirmed its shape against verify-theory.mjs before authoring: it takes
 *   { assert: 'keySignature', key, sharps }, looks the key up in theory.js's
 *   MAJOR_KEYS by name, and checks the stored `sharps` count — negative for
 *   flat keys (Bb = -2), matching the source's own 0-2 accidental catalog.
 * - Lesson 9.3.4's Relative Minor Rule ("down 3 half steps") gets a real
 *   `interval` assert (A3 to C4, 3 semitones) rather than a keySignature
 *   assert, since the claim itself is an interval distance, not a signature.
 * - The Gate G Assessment Audit closes Lesson 9.3.5 as its own step, exactly
 *   matching the Gate D/E/F precedent (Sections 5.3/6.3/8.3): a `table()` of
 *   the audit's own items plus a `multi()` check, with the same 5 items
 *   promoted into this module's checkpoints[] below and into GATES's new
 *   Gate G entry in piano/index.js.
 * - Check-drafting provenance: all 7 step checks were drafted via the xAI
 *   client, 7 of 7 verified on the first entailment attempt (part of a
 *   26/26 first-attempt run across all four sections in this chained batch).
 *   All passed manual review unchanged (mcq, multi kinds).
 */
import { module_, lesson, step, prose, table, callout, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l9-3-1',
      'The Key Signature as a "Standing Order"',
      [
        step(
          'A Standing Order, Not Note-by-Note Clutter',
          [
            prose(
              '<p>Placing a sharp or flat symbol in front of every single modified note in a piece would result in visual clutter. Instead, a key signature is placed at the beginning of every system, immediately following the clef, as a standing order: if an F♯ is written on the top line of the treble staff in the key signature, EVERY F played in that piece — regardless of octave — must be played as F♯, unless explicitly overridden by a natural sign.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the step text, where is a key signature placed and what does it do?',
            [
              'At the end of each line as a reminder for the next line',
              'At the beginning of every system immediately after the clef, as a standing order for all notes of that pitch',
              'Before every modified note to avoid visual clutter',
              'Only at the beginning of the first line of the piece',
            ],
            1,
            'The step text states that a key signature is placed at the beginning of every system, immediately following the clef, as a standing order for every note of that pitch (e.g. every F must be F♯).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l9-3-2',
      'The Order of Sharps and Flats',
      [
        step(
          'The Invariant Accidental Sequences',
          [
            prose(
              '<p>Sharps and flats are never added randomly; they appear in an invariant, standardized sequence across all Western music.</p>',
            ),
            table(
              ['Sequence', 'Order', 'Mnemonic'],
              [
                ['Order of Sharps', 'F♯ - C♯ - G♯ - D♯ - A♯ - E♯ - B♯', 'Father Charles Goes Down And Ends Battle'],
                ['Order of Flats', 'B♭ - E♭ - A♭ - D♭ - G♭ - C♭ - F♭', 'Battle Ends And Down Goes Charles’ Father'],
              ],
              'Flats is the exact reverse of Sharps.',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          multi(
            'Which of the following statements about the order of sharps and flats are true according to the lesson?',
            [
              'Sharps and flats appear in a standardized sequence across Western music',
              'The order of flats is the exact reverse of the order of sharps',
              'The order of sharps is C♯ - G♯ - D♯ - A♯ - E♯ - B♯ - F♯',
              'The mnemonic for flats is \'Battle Ends And Down Goes Charles’ Father\'',
            ],
            [0, 1, 3],
            'The step text states that sharps and flats appear in an invariant standardized sequence, that flats is the exact reverse of sharps, and gives the mnemonic for flats as Battle Ends And Down Goes Charles’ Father (with the matching sequence shown).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l9-3-3',
      'Primary Key Signatures Catalog (0–2 Accidentals)',
      [
        step(
          'The 0-2 Accidental Catalog',
          [
            prose(
              '<p>The full catalog of 0-2 accidental key signatures, their Major keys, and their Relative Minors:</p>',
            ),
            table(
              ['Key Signature', 'Major Key', 'Relative Minor Key', 'Specific Alterations'],
              [
                ['0 Accidentals', 'C Major', 'A Minor', 'None (all naturals)'],
                ['1 Sharp', 'G Major', 'E Minor', 'F♯'],
                ['2 Sharps', 'D Major', 'B Minor', 'F♯, C♯'],
                ['1 Flat', 'F Major', 'D Minor', 'B♭'],
                ['2 Flats', 'B♭ Major', 'G Minor', 'B♭, E♭'],
              ],
            ),
            sources(['The keys in music for piano.pdf', 'Key Signature Chart.pdf']),
          ],
          mcq(
            'According to the catalog, which Major key has exactly two sharps and what is its Relative Minor?',
            ['G Major with E Minor', 'D Major with B Minor', 'F Major with D Minor', 'B♭ Major with G Minor'],
            1,
            'The table explicitly lists 2 Sharps as D Major, B Minor with the Specific Alterations F♯, C♯.',
          ),
          [
            { assert: 'keySignature', key: 'C', sharps: 0 },
            { assert: 'keySignature', key: 'G', sharps: 1 },
            { assert: 'keySignature', key: 'D', sharps: 2 },
            { assert: 'keySignature', key: 'F', sharps: -1 },
            { assert: 'keySignature', key: 'Bb', sharps: -2 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-3-4',
      'Identifying Keys from Signatures: The Standard Rules',
      [
        step(
          'The Sharp Rule and the Flat Rule',
          [
            prose(
              '<p><strong>The Sharp Rule:</strong> the last sharp on the far right of the key signature is always the Leading Tone. Step up one half step to find the Major Key — example: 2 sharps (F♯, C♯); the last sharp is C♯, one half step above C♯ is D, so the key is D Major.</p><p><strong>The Flat Rule:</strong> the second-to-last flat on the key signature is the Tonic — example: 2 flats (B♭, E♭); the second-to-last flat is B♭, so the key is B♭ Major. Exception: 1 flat (B♭) must be memorized as F Major.</p>',
            ),
            callout(
              'warning',
              'The 1-flat trap',
              '<p>Don’t assume 1 flat is “B-flat Major” — 1 flat (B♭) is F Major; B♭ Major requires 2 flats. And always review the key signature before playing Measure 1: accidentals apply to all octaves and both clefs, including notes in the bass clef.</p>',
            ),
            sources(['The keys in music for piano.pdf', 'Enharmonic Key Signature Guide.pdf']),
          ],
          mcq(
            'According to the sharp rule, if the last sharp on the far right of a key signature is C♯, what is the Major key?',
            ['C Major', 'G Major', 'D Major', 'A Major'],
            2,
            'The step text states that the last sharp is always the Leading Tone, and stepping up one half step from C♯ gives D, so the key is D Major.',
          ),
          [
            { assert: 'keySignature', key: 'D', sharps: 2 },
            { assert: 'keySignature', key: 'Bb', sharps: -2 },
          ],
        ),
        step(
          'The Relative Minor Rule',
          [
            prose(
              '<p>To find the relative minor of any major key, move down three half steps (a Minor 3rd): C Major − 3 semitones = A Minor. G Major − 3 semitones = E Minor. F Major − 3 semitones = D Minor.</p>',
            ),
            sources(['The keys in music for piano.pdf']),
          ],
          mcq(
            'According to the step, how do you find the relative minor of a major key?',
            ['Move up three half steps', 'Move down three half steps', 'Move up a perfect fifth', 'Add three sharps to the key signature'],
            1,
            'The step text explicitly states to find the relative minor of any major key, move down three half steps (a Minor 3rd).',
          ),
          [
            { assert: 'interval', from: 'A3', to: 'C4', semitones: 3 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l9-3-5',
      'In-Measure Accidentals and Courtesy Accidentals, and Gate G',
      [
        step(
          'In-Measure and Courtesy Accidentals',
          [
            prose(
              '<p>An accidental placed directly before a note in a measure alters that pitch for the entire duration of that measure, then expires automatically at the barline. A Courtesy (Cautionary) Accidental is an accidental placed in parentheses in the subsequent measure to remind the performer that a temporary accidental from the previous measure has expired.</p>',
            ),
            sources(['Minor Key Signatures A']),
          ],
          mcq(
            'According to the text, what does a courtesy (cautionary) accidental do?',
            [
              'It alters the pitch for the entire measure',
              'It reminds the performer that a temporary accidental from the previous measure has expired',
              'It cancels the key signature for one note',
              'It extends the accidental into the next measure',
            ],
            1,
            'The step text states that a Courtesy (Cautionary) Accidental is an accidental placed in parentheses in the subsequent measure to remind the performer that a temporary accidental from the previous measure has expired.',
          ),
        ),
        step(
          'Gate G Assessment Audit',
          [
            prose('To pass Gate G and unlock Module 10 (The Scale System), verify all five items below.'),
            table(
              ['Gate G requirement', 'What to verify'],
              [
                ['Interval mastery', 'Can construct and name all intervals (m2 through P8) from C and G with 100% accuracy.'],
                ['1-octave scales (HS)', 'Can perform C Major and A Natural Minor full 1-octave scales hands separately with standard thumb-under fingering (1-2-3-1-2-3-4-5).'],
                ['Key signature recognition (0-2 accidentals)', 'Can instantly name C, G, D, F, B♭ Major and their relative minors from printed key signatures.'],
                ['Sharp and flat mnemonics', 'Can recite “Father Charles Goes Down And Ends Battle” and its reverse from memory.'],
                ['Scale vs. key articulation', 'Can clearly explain the difference between a key and a scale.'],
              ],
            ),
            sources(['How to read piano notes for beginners.pdf', 'The keys in music for piano.pdf']),
          ],
          multi(
            'Which of the following must you be able to do to pass Gate G according to the requirements listed?',
            [
              'Instantly name the keys C, G, D, F, B♭ Major and their relative minors from printed key signatures',
              'Perform 1-octave C Major and A Natural Minor scales hands together with thumb-over fingering',
              'Recite “Father Charles Goes Down And Ends Battle” and its reverse from memory',
              'Construct and name all intervals from m2 through P8 from C and G with 100% accuracy',
            ],
            [0, 2, 3],
            'The step text explicitly lists these three abilities (plus scale performance HS with thumb-under and explaining scale vs. key) as the five items that must be verified to pass Gate G and unlock Module 10.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m9-3-ex-a',
      type: 'Key signature flash drill',
      title: 'Protocol 9.3-A — Key Signature Flash Identification',
      prompt: 'Flash random key signatures (0 to 2 accidentals). State the Major Key and its Relative Minor within 2 seconds: 1 Sharp -> G Major / E Minor. 2 Flats -> B-flat Major / G Minor. 1 Flat -> F Major / D Minor. 2 Sharps -> D Major / B Minor.',
    },
  ],
  checkpoints: [
    'Interval mastery: can construct and name all intervals (m2 through P8) from C and G with 100% accuracy.',
    '1-octave scales (HS): can perform C Major and A Natural Minor full 1-octave scales hands separately with standard thumb-under fingering (1-2-3-1-2-3-4-5).',
    'Key signature recognition (0-2 accidentals): can instantly name C, G, D, F, B♭ Major and their relative minors from printed key signatures.',
    'Sharp and flat mnemonics: can recite "Father Charles Goes Down And Ends Battle" and its reverse from memory.',
    'Scale vs. key articulation: can clearly explain the difference between a key and a scale.',
  ],
  outcomes: [
    'Define a Key Signature as a standing global command establishing tonal center and accidental modifications.',
    'Recite the standard Order of Sharps (F♯ - C♯ - G♯ - D♯ - A♯ - E♯ - B♯) using the mnemonic "Father Charles Goes Down And Ends Battle".',
    'Recite the standard Order of Flats (B♭ - E♭ - A♭ - D♭ - G♭ - C♭ - F♭) using the reverse mnemonic "Battle Ends And Down Goes Charles\' Father".',
    'Identify and spell all 0–2 accidental Major keys (C, G, D, F, B♭) and their Relative Minors (Am, Em, Bm, Dm, Gm).',
    'Execute accidentals within a measure, including accidental expiration at barlines and Courtesy (Cautionary) Accidentals.',
    'Complete and execute the Gate G Assessment Rubric.',
  ],
  sources: [
    'How to read piano notes for beginners.pdf',
    'The keys in music for piano.pdf',
    'Enharmonic Key Signature Guide.pdf',
    'Minor Key Signatures A',
  ],
  practiceFocus: ['Name and play C, G, D, F, B♭ and their relative minors (Gate G).'],
  id: 'piano-m9-3',
  code: '9.3',
  title: 'Keys on the Page: Key Signatures (0–2 Accidentals)',
});
