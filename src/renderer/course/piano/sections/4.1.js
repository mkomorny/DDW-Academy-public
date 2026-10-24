/**
 * Section 4.1 — Staff, Clefs, and the Grand Staff
 * Module 4 — The Page
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_04_The_Page/
 * Section_4.1_Staff_Clefs_The_Grand_Staff.md), read in full before authoring.
 *
 * Conversion notes:
 * - This section's ASCII art is staff notation, not keybed diagrams, so it
 *   promotes to real `staff()` blocks — the course's first use of that
 *   renderer (Staff is a real SVG engraver at components/staff.js, confirmed
 *   working before authoring, matching the same "confirm the renderer is
 *   real" diligence 3.1 applied to rhythm()). `clef: 'grand'` draws both
 *   staves and the brace in one block, so lesson 4.1.4 (the brace) and
 *   4.1.5/4.1.6 (Middle C and the three guide notes, both of which live in
 *   the gap between staves) all use it directly instead of prose describing
 *   a diagram the learner can't see.
 * - Lesson 4.1.5's second step needs to show the SAME physical key (Middle
 *   C) notated two different ways — as a ledger line below the Treble staff
 *   and as a ledger line above the Bass staff. A single grand-staff block
 *   can't do this (its routing sends every C4 to the treble side), so that
 *   step uses two separate single-clef `staff()` blocks side by side, one
 *   `clef:'treble'` and one `clef:'bass'`, each with the identical note.
 * - No `asserts` anywhere in this file: the theory oracle
 *   (tools/author/lib/verify-theory.mjs) supports exactly three assert
 *   kinds — pcSet, interval, keySignature — and every claim in this section
 *   is single-note identification (which line is which guide note), not a
 *   scale spelling, an interval size, or a key signature. That's a property
 *   of this section's content, not an oversight (interval claims begin in
 *   4.2, once notes start moving relative to each other).
 * - Per the plan's mapping rule, §5's one Structured Practice Protocol
 *   becomes the module's one exercises[] entry, §6's checklist replaces the
 *   scaffold's generic checkpoints[], and §4's three Methodological Traps
 *   become a closing callout() in lesson 4.1.6 (the lesson that introduces
 *   guide-note reading as the corrective to all three traps, since two of
 *   the three are literally about skipping guide-note anchoring).
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified (mcq, multi,
 *   and text kinds).
 */
import { module_, lesson, step, prose, table, callout, staff, sources, mcq, multi, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l4-1-1',
      'The Five-Line Staff and Ledger Lines',
      [
        step(
          'Lines, Spaces, and Bottom-Up Numbering',
          [
            prose(
              '<p>The <strong>Staff (or Stave)</strong> is the foundational grid upon which pitch and time are inscribed. A staff consists of 5 horizontal lines and 4 enclosed spaces. Lines and spaces are always numbered from the bottom up — Line 1 is the lowest line, Line 5 is the highest line. Each line and each space represents a distinct white-key pitch class, and pitch increases as you move upward on the staff.</p>',
            ),
            sources(
              [
                'How to read piano notes and sheet music.pdf',
                'How to read piano notes for beginners.pdf',
              ],
            ),
          ],
          mcq(
            'How many lines and spaces does a musical staff consist of?',
            [
              '5 lines and 3 spaces',
              '5 lines and 4 spaces',
              '4 lines and 5 spaces',
              '6 lines and 4 spaces',
            ],
            1,
            'The step text states that a staff consists of 5 horizontal lines and 4 enclosed spaces.',
          ),
        ),
        step(
          'Ledger Lines Extend the Staff',
          [
            prose(
              '<p>When a pitch exceeds the 5-line boundary — higher or lower — short horizontal tick marks called <strong>ledger lines</strong> are drawn to extend the staff indefinitely. Middle C, the guide note you’ll meet in lesson 4.1.5, is the most important ledger-line note in the entire course.</p>',
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'q', label: 'Middle C' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'What are short horizontal tick marks called that extend the staff when a pitch is higher or lower than the 5-line boundary?',
            ['Guide notes', 'Ledger lines', 'Clefs', 'Grand staff lines'],
            1,
            'The step text explicitly states that short horizontal tick marks called ledger lines are drawn to extend the staff indefinitely when a pitch exceeds the 5-line boundary.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-1-2',
      'The Treble Clef (The G Clef)',
      [
        step(
          'Historical Origin',
          [
            prose(
              '<p>The Treble Clef indicates the higher frequency register, typically assigned to the Right Hand. The symbol evolved from an ornate cursive letter G, and its inner spiral explicitly loops around Line 2 of the staff.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'What does the inner spiral of the Treble Clef do?',
            [
              'Loops around Line 2 of the staff',
              'Loops around Line 4 of the staff',
              'Loops around the space above the staff',
              'Loops around Middle C',
            ],
            0,
            'The step text states that the inner spiral of the Treble Clef explicitly loops around Line 2 of the staff.',
          ),
        ),
        step(
          'Structural Meaning: Treble G',
          [
            prose(
              '<p>Line 2 is defined as <strong>Treble G (G₄)</strong> — the G directly above Middle C. All other lines and spaces of the treble staff are calculated relative to this one anchor.</p>',
            ),
            staff(
              {
                items: [
                  { notes: ['G4'], duration: 'q', label: 'Treble G' },
                ],
              },
            ),
            sources(
              [
                'How to read piano notes for beginners.pdf',
                'How to Read Music Essential Tips for Beginners.pdf',
              ],
            ),
          ],
          text(
            'What is the exact pitch name and scientific pitch notation given in the text for the anchor note of the treble staff?',
            ['treble g (g₄)', 'g₄', 'treble g', 'g4'],
            'The step text explicitly states that Line 2 is defined as Treble G (G₄) — the G directly above Middle C, serving as the anchor for all other lines and spaces.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-1-3',
      'The Bass Clef (The F Clef)',
      [
        step(
          'Historical Origin',
          [
            prose(
              '<p>The Bass Clef indicates the lower frequency register, typically assigned to the Left Hand. The symbol evolved from a stylized letter F, and its two dots explicitly flank and surround Line 4 of the staff.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'What does the Bass Clef symbol indicate according to the text?',
            [
              'The higher frequency register for the right hand',
              'The lower frequency register typically assigned to the left hand',
              'The middle register for both hands',
              'The position of Middle C only',
            ],
            1,
            'The step text explicitly states that the Bass Clef indicates the lower frequency register, typically assigned to the Left Hand.',
          ),
        ),
        step(
          'Structural Meaning: Bass F',
          [
            prose(
              '<p>Line 4 is defined as <strong>Bass F (F₃)</strong> — the F directly below Middle C. All other lines and spaces of the bass staff are calculated relative to this one anchor.</p>',
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['F3'], duration: 'q', label: 'Bass F' },
                ],
              },
            ),
            sources(
              [
                'How to read piano notes for beginners.pdf',
                'How to Read Music Essential Tips for Beginners.pdf',
              ],
            ),
          ],
          text(
            'What is the scientific pitch notation for the anchor note on line 4 of the bass staff?',
            ['f3', 'f₃'],
            'The step text explicitly states that Line 4 is defined as Bass F (F₃).',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-1-4',
      'The Grand Staff and the Brace',
      [
        step(
          'The Brace Unites Two Staves',
          [
            prose(
              '<p>In piano notation, two staves are joined together to form the <strong>Grand Staff</strong>. A vertical bracket, or brace, on the far left side connects the Treble staff and the Bass staff into a single, unified visual system.</p>',
            ),
            staff({ clef: 'grand', items: [] }),
            sources(
              [
                'How to read piano notes and sheet music.pdf',
                'Learning  Playing Piano Notes for Beginners.pdf',
              ],
            ),
          ],
          mcq(
            'What joins the Treble staff and the Bass staff together in piano notation?',
            [
              'A horizontal line at the top',
              'A vertical bracket or brace on the far left',
              'Ledger lines between them',
              'A pair of clefs only',
            ],
            1,
            'The step text states that two staves are joined to form the Grand Staff by a vertical bracket, or brace, on the far left side that connects the Treble staff and the Bass staff.',
          ),
        ),
        step(
          'Barlines Cross Both Staves',
          [
            prose(
              '<p>Barlines extend vertically across both staves at once, indicating that the music written on both staves occurs simultaneously in real time — the Right Hand and Left Hand parts are two views of the same moment, not two separate pieces of music.</p>',
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'What do barlines that extend vertically across both staves indicate?',
            [
              'The right-hand and left-hand parts are completely separate pieces of music',
              'That the music on both staves occurs simultaneously in real time',
              'That the hands should play one after the other',
              'That a new musical section is beginning',
            ],
            1,
            'The step text states that barlines extend vertically across both staves at once, indicating that the music written on both staves occurs simultaneously in real time — the Right Hand and Left Hand parts are two views of the same moment, not two separate pieces of music.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l4-1-5',
      'Middle C as the Meeting Point',
      [
        step(
          'One Missing Line Apart',
          [
            prose(
              '<p>A critical insight in piano literacy is that the Treble and Bass staves are not separated by a vast void — they are separated by exactly one missing line. Middle C sits directly in that gap, on its own small ledger line, connecting the bottom of the Treble staff to the top of the Bass staff.</p>',
            ),
            staff(
              {
                clef: 'grand',
                items: [
                  { notes: ['C4'], duration: 'q', label: 'Middle C' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'According to the text, how are the Treble and Bass staves separated?',
            [
              'By a vast void',
              'By exactly one missing line',
              'By two ledger lines',
              'By the Grand Staff brace',
            ],
            1,
            'The step text states that the Treble and Bass staves are not separated by a vast void — they are separated by exactly one missing line.',
          ),
        ),
        step(
          'Same Physical Key, Different Hand',
          [
            prose(
              '<p>When Middle C is written with a ledger line below the Treble staff, it is typically played by the Right Hand. When Middle C is written with a ledger line above the Bass staff, it is typically played by the Left Hand. It is the identical physical key on the piano in both cases — only the hand assigned to play it changes.</p>',
            ),
            staff(
              {
                items: [
                  { notes: ['C4'], duration: 'q', label: 'Middle C (RH)' },
                ],
              },
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['C4'], duration: 'q', label: 'Middle C (LH)' },
                ],
              },
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'When Middle C appears with a ledger line below the Treble staff, which hand is it typically played by?',
            ['Left Hand', 'Right Hand', 'Either hand', 'Neither hand'],
            1,
            'The step text states that when Middle C is written with a ledger line below the Treble staff, it is typically played by the Right Hand.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l4-1-6',
      'The Three Primary Guide Notes',
      [
        step(
          'Why Guide Notes Beat Mnemonics',
          [
            prose(
              '<p>Professional pianists do not spell out every note using mnemonics like "Every Good Boy Does Fine." They navigate using the Three Primary Guide Notes instead.</p>',
            ),
            prose(
              '<p><strong>Why mnemonics are a secondary backup:</strong> mnemonics ("FACE", "All Cows Eat Grass", "Good Boys Do Fine Always") require a slow 3-step translation — count lines, recite the rhyme, find the key. Guide-note reading enables instant direct recognition instead: see the guide note, recognize the distance to the next note as a step or a skip, move the finger.</p>',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          multi(
            'According to the text, why are mnemonics considered a secondary backup for professional pianists?',
            [
              'They require counting lines on the staff',
              'They involve reciting a rhyme',
              'They need a slow 3-step translation process',
              'They prevent instant direct recognition',
              'They do not use the Three Primary Guide Notes',
            ],
            [0, 1, 2],
            'The step text states that mnemonics require a slow 3-step translation — count lines, recite the rhyme, find the key — while guide-note reading enables instant direct recognition instead.',
          ),
        ),
        step(
          'The Three Guide Notes on the Grand Staff',
          [
            table(
              ['Guide Note', 'Staff Coordinate', 'Physical Key Coordinate'],
              [
                [
                  'Treble G (G₄)',
                  'Line 2 of Treble Staff (enclosed by the G-clef loop)',
                  'First G above Middle C — RH Finger 5 in C House',
                ],
                [
                  'Middle C (C₄/C₃)',
                  'Ledger line between Treble and Bass staves',
                  'Physical center of the keyboard — RH Finger 1 in C House',
                ],
                [
                  'Bass F (F₃)',
                  'Line 4 of Bass Staff (between the two F dots)',
                  'First F below Middle C — LH Finger 2 in Low C House',
                ],
              ],
            ),
            staff(
              {
                clef: 'grand',
                items: [
                  { notes: ['G4'], duration: 'q', label: 'Treble G' },
                  { notes: ['C4'], duration: 'q', label: 'Middle C' },
                  { notes: ['F3'], duration: 'q', label: 'Bass F' },
                ],
              },
            ),
            callout(
              'warning',
              'Three common reading traps',
              '<p>Counting lines from the bottom for every single note on the page — the corrective law is to anchor immediately to the nearest guide note (Treble G, Middle C, or Bass F). Believing Treble Middle C and Bass Middle C are different piano keys — they are the exact same physical key (MIDI note 60); only the hand assigned to play it changes. Looking down at your hands constantly while decoding the staff — keep your eyes locked on the page and feel key intervals by hand topography instead.</p>',
            ),
            sources(
              [
                'How to read piano notes and sheet music.pdf',
                'The Hoffman Method of Learning Piano.pdf',
              ],
            ),
          ],
          multi(
            'Which of the following are presented as the three primary guide notes for reading music on the grand staff?',
            [
              'Treble G (G₄)',
              'Middle C (C₄/C₃)',
              'Bass F (F₃)',
              'Ledger line between the staves',
              'RH Finger 5 in C House',
            ],
            [0, 1, 2],
            'The step text explicitly lists Treble G (G₄), Middle C (C₄/C₃), and Bass F (F₃) in the table and in the corrective law for anchoring to the nearest guide note.',
          ),
        ),
      ],
    ),
  ],
  exercises: [
    {
      id: 'piano-m4-1-ex-a',
      type: 'Reading drill',
      title: 'Protocol 4.1-A — Three Guide Note Flash Drill',
      prompt: 'Open a blank sheet of grand staff notation. Locate and point to Treble G (Line 2 Treble), then play it on the keybed in under 1 second. Do the same for Middle C (the ledger line) and Bass F (Line 4 Bass). Repeat 10 times in randomized order until instantaneous.',
    },
  ],
  checkpoints: [
    'Staff Anatomy: can explain that the staff has 5 lines and 4 spaces numbered from the bottom up.',
    'Clef Recognition: can state why the Treble Clef is the G Clef (loops Line 2) and the Bass Clef is the F Clef (dots surround Line 4).',
    'Middle C Gap: can explain that Middle C lives on a ledger line between the two staves.',
    'Three Guide Notes Instant: can identify Treble G, Middle C, and Bass F on a score and touch their physical keys in under 2 seconds.',
  ],
  outcomes: [
    'Identify the 5-line, 4-space structure of the musical staff and explain the function of ledger lines.',
    'Explain the historical and graphic origins of the Treble Clef (G Clef) and Bass Clef (F Clef).',
    'Understand the Grand Staff and the vertical brace uniting both staves at Middle C.',
    'Identify and locate the Three Primary Guide Notes: Treble G (G₄), Middle C (C₄/C₃), and Bass F (F₃) instantly on the staff and keybed.',
    'Contrast landmark reading with traditional letter mnemonics (e.g., "FACE", "Every Good Boy Does Fine"), understanding why mnemonics are a secondary backup.',
  ],
  sources: [
    'How to read piano notes and sheet music.pdf',
    'How to read piano notes for beginners.pdf',
    'How to Read Music Essential Tips for Beginners.pdf',
    'Learning  Playing Piano Notes for Beginners.pdf',
    'The Hoffman Method of Learning Piano.pdf',
  ],
  practiceFocus: ['Point to Treble G, Middle C, Bass F on a blank grand staff.'],
  id: 'piano-m4-1',
  code: '4.1',
  title: 'Staff, Clefs, and the Grand Staff',
});
