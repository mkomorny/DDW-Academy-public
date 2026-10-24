/**
 * Section 4.3 — First Reading Pieces (Both Clefs, Hands Separate)
 * Module 4 — The Page
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_04_The_Page/
 * Section_4.3_First_Reading_Pieces_Both_Clefs.md), read in full before
 * authoring.
 *
 * Conversion notes:
 * - This is the module's last section (5 lessons, not 6 — the syllabus
 *   roster only lists 4.3.1 through 4.3.5), and it's where staff-reading
 *   (4.1–4.2) and rhythm/pulse (Module 3's 3.1) finally combine: whole,
 *   half, and quarter noteheads get a real `staff()` transcription using
 *   the schema's actual duration codes ('w'/'h'/'q'/'e'), confirmed against
 *   the Staff renderer's own logic (components/staff.js: 'w' and 'h' render
 *   hollow, everything else solid; 'e' and 's' get a flag) rather than
 *   guessed.
 * - Lesson 4.3.4 (Hot Cross Buns, Treble/RH) reuses the exact E4-D4-C4
 *   interval asserts 3.3 established for the same piece (2-semitone steps
 *   each way) — same melody, same math, cited again by hand rather than
 *   re-derived. Lesson 4.3.5 (the Bass Clef étude, LH) is the RH C-position
 *   pentascale (C-D-E-F-G) transposed down two octaves into LH Low C
 *   Position, so it gets the same `pcSet` assert 3.2 used for that shape —
 *   pcSet carries no octave information, so the identical assert is
 *   correct regardless of register.
 * - The source's own Protocol 4.3-A prompt cites "Lesson 4.4.4" and
 *   "Lesson 4.4.5" when it means this section's own 4.3.4 and 4.3.5 — an
 *   apparent typo in the textbook file (there is no Module 4.4). Corrected
 *   silently to 4.3.4/4.3.5 in the exercises[] prompt below; flagging here
 *   rather than inventing a fact, per the grounding rule.
 * - Per the plan's mapping rule, §5's one Structured Practice Protocol
 *   becomes the module's one exercises[] entry, and §6's checklist replaces
 *   the scaffold's generic checkpoints[]. §4's three Methodological Traps
 *   are distributed to the lessons they're actually about: the half-note
 *   duration trap closes 4.3.2 (notehead duration), the rests trap closes
 *   4.3.3 (rests), and the hands-together-too-soon trap closes 4.3.5 (the
 *   LH-alone étude, the lesson hands-separate discipline is about).
 * - One AI-drafted check was hand-fixed before splicing (caught in review,
 *   not by any validator): lesson 4.3.5 step 1's `multi` question excluded
 *   a true, text-grounded option ("four quarter-note beats per measure" —
 *   the step's own text states "4/4 time") from its answer key. Added back
 *   in; see 4.2.js's header for the sibling fix caught in the same review
 *   pass.
 * - Check-drafting provenance: all 10 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified (mcq and
 *   multi kinds).
 */
import { module_, lesson, step, prose, table, callout, staff, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l4-3-1',
      'Bars, Barlines, and Time Signatures Preview',
      [
        step(
          'Measures and Barlines',
          [
            prose(
              '<p>Music is organized into temporal containers called Measures, or Bars. A Barline is a vertical line drawn through the staff that divides music into equal measures. A Double Barline — two vertical lines, one thin and one thick — indicates the end of a movement or piece.</p>',
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'What does a Double Barline indicate?',
            [
              'The end of a measure',
              'The division between equal measures',
              'The end of a movement or piece',
              'The start of a new beat grouping',
            ],
            2,
            'The step text states that a Double Barline — two vertical lines, one thin and one thick — indicates the end of a movement or piece.',
          ),
        ),
        step(
          'Reading a Time Signature',
          [
            prose(
              '<p>The Time Signature is located at the beginning of the piece, directly after the clef, and consists of two stacked numbers. The top number specifies how many beats are in each measure. The bottom number specifies which type of note receives one beat (4 = quarter note). 4/4 time — sometimes written as Common Time, "C" — means exactly 4 quarter-note beats per measure.</p>',
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'Where is the time signature located in a piece of music?',
            [
              'At the end of the piece',
              'Directly after the clef at the beginning',
              'Above the staff',
              'Between the barlines',
            ],
            1,
            'The step text states that the Time Signature is located at the beginning of the piece, directly after the clef.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-3-2',
      'Notehead Morphology: Whole, Half, Quarter',
      [
        step(
          'Three Notehead Shapes',
          [
            table(
              ['Note Name (US)', 'Note Name (UK)', 'Visual Anatomy', 'Duration in 4/4'],
              [
                [
                  'Whole Note',
                  'Semibreve',
                  'Open/hollow oval without a stem',
                  '4 beats (hold the full measure)',
                ],
                ['Half Note', 'Minim', 'Open/hollow oval with a stem', '2 beats (hold 2 beats)'],
                ['Quarter Note', 'Crotchet', 'Filled/solid oval with a stem', '1 beat (1 beat per click)'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'w', label: 'Whole' },
                  { notes: ['C4'], duration: 'h', label: 'Half' },
                  { notes: ['C4'], duration: 'q', label: 'Quarter' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf', 'How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the table, how many beats does a half note last in 4/4 time?',
            ['4 beats', '2 beats', '1 beat', '3 beats'],
            1,
            'The step text states that a Half Note (Minim) has an open/hollow oval with a stem and lasts 2 beats (hold 2 beats).',
          ),
        ),
        step(
          'Duration Discipline',
          [
            prose(
              '<p>A whole note sounds for four full beats; a half note for two; a quarter note for one. These durations are exact, not approximate — a note must ring for its full stated value before releasing.</p>',
            ),
            callout(
              'warning',
              'Releasing too early',
              '<p>Releasing a half note after only 1 beat is a common anti-pattern. A half note MUST sound for two full metronome clicks — count "1, 2" through it before releasing the key.</p>',
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the lesson, how many beats must a half note sound for before releasing?',
            ['1 beat', '2 beats', '3 beats', '4 beats'],
            1,
            'The step text states that a half note sounds for two beats and explicitly says a half note MUST sound for two full metronome clicks.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l4-3-3',
      'Rests: The Discipline of Played Silence',
      [
        step(
          'Played Silence, Not Absence of Attention',
          [
            prose(
              '<p>A rest is not an absence of attention — it is played silence. During a rest, the performer actively releases the key on the exact beat while maintaining the internal pulse, rather than simply stopping.</p>',
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'What is a rest according to the teaching?',
            [
              'An absence of attention',
              'Played silence',
              'Simply stopping',
              'A break from maintaining pulse',
            ],
            1,
            'The step text states that a rest is not an absence of attention — it is played silence.',
          ),
        ),
        step(
          'Whole Rest vs. Half Rest — the Visual Mnemonic',
          [
            prose(
              '<p>The Whole Rest (4 beats) hangs down from Line 4, like a heavy weight suspended below the line. The Half Rest (2 beats) sits up on Line 3, like a hat sitting on a shelf.</p>',
            ),
            callout(
              'warning',
              'Rests get the same count as sound',
              '<p>Ignoring rests and rushing to the next note is a common anti-pattern. Rests receive the identical strict count as sound — count aloud through every rest, the same way you count aloud through a held note.</p>',
            ),
            sources(['Simple Meter Rhythm Chart.pdf', 'How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'Where does the whole rest hang relative to the staff lines?',
            [
              'It sits on top of Line 3',
              'It hangs down from Line 4',
              'It sits between Lines 2 and 3',
              'It hangs below Line 1',
            ],
            1,
            'The step text states that the Whole Rest (4 beats) hangs down from Line 4, like a heavy weight suspended below the line.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-3-4',
      'Notation Score Study: Hot Cross Buns on the Grand Staff',
      [
        step(
          'Measures 1, 2, and 4: The Three-Note Phrase',
          [
            prose(
              '<p>Treble Clef, 4/4 time, RH C Position (1=C, 2=D, 3=E). Measures 1, 2, and 4 all share the identical pattern: E (quarter, finger 3), D (quarter, finger 2), Middle C (half note, held for beats 3–4, finger 1).</p>',
            ),
            table(
              ['Notehead', 'Finger', 'Count'],
              [
                ['E4 — Quarter', '3', '1'],
                ['D4 — Quarter', '2', '2'],
                ['C4 — Half', '1', '3 – 4'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['E4'], duration: 'q' },
                  { notes: ['D4'], duration: 'q' },
                  { notes: ['C4'], duration: 'h' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'According to the step text, what is the exact rhythmic pattern shared by measures 1, 2, and 4 in the right-hand part?',
            [
              'Quarter E (finger 3), quarter D (finger 2), half C (finger 1)',
              'Half C (finger 1), quarter E (finger 3), quarter D (finger 2)',
              'Quarter D (finger 2), half C (finger 1), quarter E (finger 3)',
              'Half E (finger 3), quarter D (finger 2), quarter C (finger 1)',
            ],
            0,
            'The step text states that measures 1, 2, and 4 share the identical pattern: E (quarter, finger 3), D (quarter, finger 2), Middle C (half note, held for beats 3–4, finger 1).',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'D4', semitones: 2 },
            { assert: 'interval', from: 'D4', to: 'C4', semitones: 2 },
          ],
        ),
        step(
          'Measure 3: Four Beamed Eighth Notes Per Half-Measure',
          [
            prose(
              '<p>Measure 3 breaks the pattern: four beamed eighth notes on Middle C (finger 1, 1, 1, 1), counted "1 & 2 &", followed by four beamed eighth notes on D (finger 2, 2, 2, 2), counted "3 & 4 &".</p>',
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'e' },
                  { notes: ['C4'], duration: 'e' },
                  { notes: ['C4'], duration: 'e' },
                  { notes: ['C4'], duration: 'e' },
                  { notes: ['D4'], duration: 'e' },
                  { notes: ['D4'], duration: 'e' },
                  { notes: ['D4'], duration: 'e' },
                  { notes: ['D4'], duration: 'e' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'In measure 3, what is the finger number used for all four eighth notes on D?',
            ['1', '2', '3', '4'],
            1,
            'The step text states that the four beamed eighth notes on D use finger 2, 2, 2, 2.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l4-3-5',
      'Left-Hand Score Study: Bass Clef Reading Étude',
      [
        step(
          'Measures 1–2: Ascent to the Bass Guide Note and Back',
          [
            prose(
              '<p>Bass Clef, 4/4 time, LH Low C Position (5=C, 4=D, 3=E, 2=F, 1=G). Measure 1 ascends stepwise from Bass C to the Bass Guide Note, F. Measure 2 peaks on G, repeated, then descends back to F, held for two beats.</p>',
            ),
            table(
              ['Measure', 'Notes', 'Fingering'],
              [
                ['1', 'C2 – D2 – E2 – F2', '5 – 4 – 3 – 2'],
                ['2', 'G2 – G2 – F2 (held 2 beats)', '1 – 1 – 2'],
              ],
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['C2'], duration: 'q' },
                  { notes: ['D2'], duration: 'q' },
                  { notes: ['E2'], duration: 'q' },
                  { notes: ['F2'], duration: 'q' },
                  { notes: ['G2'], duration: 'q' },
                  { notes: ['G2'], duration: 'q' },
                  { notes: ['F2'], duration: 'h' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          multi(
            'According to the given description of the left-hand étude, which statements are true about the notes and fingering in measures 1 and 2?',
            [
              'Measure 1 ascends stepwise from C2 to F2 using fingers 5-4-3-2',
              'Measure 2 contains two quarter notes on G2 followed by a half note on F2',
              'The highest note in the étude is G2 played with finger 1',
              'Measure 2 ends with F2 held for two beats using finger 2',
              'The time signature requires exactly four quarter-note beats in each measure',
            ],
            [0, 1, 2, 3, 4],
            'The step text directly states the Low C Position, the ascending stepwise notes and fingering for measure 1, the peak on repeated G2 then descent to F2 held for two beats in measure 2, the exact fingering 1-1-2, and 4/4 time (four quarter-note beats per measure).',
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
          'Measures 3–4: Stepwise Return and the Final Cadence',
          [
            prose(
              '<p>Measure 3 returns stepwise from E down to C, with C repeated. Measure 4 is a single whole note on Bass C, finger 5, held for all four beats — the final cadence.</p>',
            ),
            table(
              ['Measure', 'Notes', 'Fingering'],
              [
                ['3', 'E2 – D2 – C2 – C2', '3 – 4 – 5 – 5'],
                ['4', 'C2 (whole note, held 4 beats)', '5'],
              ],
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['E2'], duration: 'q' },
                  { notes: ['D2'], duration: 'q' },
                  { notes: ['C2'], duration: 'q' },
                  { notes: ['C2'], duration: 'q' },
                  { notes: ['C2'], duration: 'w' },
                ],
              },
            ),
            callout(
              'warning',
              'Master one hand before combining',
              '<p>Attempting hands-together reading on the first read is a common anti-pattern. Master the RH score alone, then the LH score alone, before combining them.</p>',
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'What does the step text say about the note in measure 4?',
            [
              'It is a half note on Bass C held for two beats',
              'It is a whole note on Bass C held for all four beats with finger 5',
              'It is two quarter notes on C with fingering 5-5',
              'It returns stepwise from E down to C',
            ],
            1,
            'The step text explicitly states that Measure 4 is a single whole note on Bass C, finger 5, held for all four beats — the final cadence.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m4-3-ex-a',
      type: 'Reading drill',
      title: 'Protocol 4.3-A — Hands-Separate Score Literacy Circuit',
      prompt: 'RH Score Drill: place RH in C Position, set the metronome to 60 BPM, and read and play Hot Cross Buns (lesson 4.3.4) from the notation, counting aloud "1, 2, 3-4". LH Score Drill: place LH in Low C Position and read and play the Bass Clef Étude (lesson 4.3.5) from the notation, verifying finger 5 plays Bass C and finger 2 plays the Bass Guide Note, F.',
    },
  ],
  checkpoints: [
    'Measure & Barline Anatomy: can explain why barlines divide music into equal beat groupings.',
    'Notehead Duration Accuracy: can identify whole (4 beats), half (2 beats), and quarter (1 beat) noteheads and hold them for their exact duration.',
    'RH Notation Performance: can read and play Hot Cross Buns from the score without stopping or guessing.',
    'LH Bass Clef Performance: can read and play the 4-measure Bass Clef étude using correct LH digits (5 to 1) at a steady 60 BPM pulse.',
  ],
  outcomes: [
    'Explain the architectural function of Measures (Bars), Barlines, and Double Barlines.',
    'Interpret the basic meaning of the Time Signature as the organizational grouping of beats (e.g., 4/4 = 4 quarter-note beats per measure).',
    'Visually distinguish and accurately execute the primary note values and their corresponding rests: Whole Note (4 beats), Half Note (2 beats), and Quarter Note (1 beat).',
    'Read and perform Hot Cross Buns directly from standard Grand Staff notation using RH C Position.',
    'Read and perform an independent Left-Hand melodic étude in the Bass Clef using Low C Position.',
  ],
  sources: [
    'How to read piano notes and sheet music.pdf',
    'How To Read Rhythms in Music.pdf',
    'Simple Meter Rhythm Chart.pdf',
    'Building Rhythm Skills in the Beginning Musician.pdf',
  ],
  practiceFocus: ['Play Hot Cross Buns from notation, then a bass-clef LH line, hands separate.'],
  id: 'piano-m4-3',
  code: '4.3',
  title: 'First Reading Pieces (Both Clefs, Hands Separate)',
});
