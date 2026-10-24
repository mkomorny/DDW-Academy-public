/**
 * Section 13.1 — The Whole Staff: Ledger Lines and the Complete Keyboard Map
 * Module 13 — Reading II and Sight-Reading Craft
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_13_Reading_II_And_
 * Sight_Reading_Craft/Section_13.1_Ledger_Lines_Full_Grand_Staff_Map.md),
 * read in full before authoring.
 *
 * Conversion notes:
 * - The Five-C Landmark table promotes to a real `staff({ clef: 'grand' })`
 *   block carrying all five landmarks in one call. The renderer
 *   (components/staff.js) routes each note to whichever stave it belongs on
 *   by octave (>=4 → treble, <4 → bass) and draws its own ledger lines —
 *   confirmed against 4.1's precedent (Middle C4 on a grand staff renders as
 *   one ledger line below the treble side, matching this section's own "1
 *   ledger line BETWEEN the staves" description) before relying on it here
 *   for Low C2/Bass C3 (bass side) and Treble C5/High C6 (treble side).
 * - 13.1.3's ledger neighborhood around High C6 (F5-G5-A5-B5-C6-D6-E6) and
 *   13.1.4's Middle-C-gap notes (B3-C4-D4) are genuine interval claims
 *   (step vs. skip), so both steps carry `interval` asserts — the B3→C4 and
 *   B5→C6 pairs are the same half-step pattern the course has flagged since
 *   level02 (E-F/B-C), reused here rather than re-derived.
 * - §4's two Methodological Traps become a closing `callout('warning', …)`
 *   on 13.1.4, per the plan's mapping rule.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, staff, callout, sources, mcq } from '../../schema.js';

export default module_({
  id: 'piano-m13-1',
  code: '13.1',
  title: 'The Whole Staff: Ledger Lines and the Complete Keyboard Map',
  outcomes: [
    'Explain the acoustic and engraving purpose of Ledger Lines as temporary staff extensions.',
    'Identify the symmetrical Five-C Landmark Network: Low C₂ (2 ledger lines below Bass), Bass C₃ (Space 2 Bass), Middle C₄ (1 ledger line between), Treble C₅ (Space 3 Treble), and High C₆ (2 ledger lines above Treble).',
    'Read up to 3 ledger lines above the Treble Staff and below the Bass Staff using relative interval recognition (steps and skips).',
    'Decode inner ledger notes between staves (Middle C₄, D₄, B₃).',
    'Correlate every key from C₂ to C₆ on a 61-key and 88-key instrument with its exact notation coordinate.',
  ],
  sources: [
    'How to read piano notes for beginners.pdf',
    'How to read piano notes and sheet music.pdf',
    'Piano tones and the keyboard.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Read a short line that leaves the staff; find the five C landmarks.'],
  lessons: [
    lesson(
      'piano-l13-1-1',
      'Why Ledger Lines Exist',
      [
        step(
          'Extending a Five-Line Staff',
          [
            prose(
              '<p>A standard musical staff contains only five lines and four spaces — enough room to notate approximately 9 diatonic pitches. Because a piano spans over 7 octaves (88 keys), pitch notation requires a flexible extension system.</p>',
            ),
            table(
              ['Term', 'Definition'],
              [
                ['Ledger Lines', 'Short, horizontal parallel lines drawn above or below the staff to extend its pitch capacity temporarily without permanently cluttering the score.'],
                ['Engraving Rule', 'Ledger lines maintain the exact same vertical spacing as the five staff lines.'],
              ],
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the text, what is the purpose of ledger lines on a musical staff?',
            [
              'To permanently extend the staff for all pitches',
              "To temporarily extend the staff's pitch capacity without cluttering the score",
              'To replace the standard five lines and four spaces',
              'To notate only the 88 keys of the piano directly on the staff',
            ],
            1,
            'The step text states that ledger lines are short horizontal parallel lines drawn above or below the staff to extend its pitch capacity temporarily without permanently cluttering the score.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l13-1-2',
      'The Symmetrical Five-C Landmark Network',
      [
        step(
          'The Five Cs, Top to Bottom',
          [
            prose(
              '<p>Rather than counting upward line-by-line (E → G → B → D → F …), conservatory readers use octave landmark anchors.</p>',
            ),
            table(
              ['Landmark', 'Scientific Pitch', 'Visual Score Coordinate', 'Keyboard Position'],
              [
                ['High C', 'C₆', '2 ledger lines above Treble Staff', '2 octaves above Mid C'],
                ['Treble C', 'C₅', '3rd space of Treble Staff', '1 octave above Mid C'],
                ['Mid C', 'C₄', '1 ledger line between Treble and Bass staves', 'Center of keybed'],
                ['Bass C', 'C₃', '2nd space of Bass Staff', '1 octave below Mid C'],
                ['Low C', 'C₂', '2 ledger lines below Bass Staff', '2 octaves below Mid C'],
              ],
            ),
            staff(
              {
                clef: 'grand',
                items: [
                  { notes: ['C6'], duration: 'q', label: 'High C' },
                  { notes: ['C5'], duration: 'q', label: 'Treble C' },
                  { notes: ['C4'], duration: 'q', label: 'Mid C' },
                  { notes: ['C3'], duration: 'q', label: 'Bass C' },
                  { notes: ['C2'], duration: 'q', label: 'Low C' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'What is the visual score coordinate for Treble C according to the landmark table?',
            [
              '3rd space of Treble Staff',
              '1 ledger line between Treble and Bass staves',
              '2 ledger lines above Treble Staff',
              '2nd space of Bass Staff',
            ],
            0,
            'The step text\'s landmark table explicitly lists Treble C (C₅) as having the visual score coordinate of 3rd space of Treble Staff.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l13-1-3',
      'Reading Beyond the Staff by Step and Skip',
      [
        step(
          'The Treble Ledger Neighborhood Around High C6',
          [
            prose(
              '<p>Once High C₆ and Low C₂ are locked in memory, all surrounding ledger notes are read using relative interval logic.</p>',
            ),
            table(
              ['Position', 'Note'],
              [
                ['Top line of Treble Staff', 'F5'],
                ['Space above staff (hanging)', 'G5'],
                ['1st ledger line', 'A5 (line)'],
                ['Space above 1st ledger', 'B5 (space)'],
                ['2nd ledger line', 'C6 (High C — landmark!)'],
                ['Space above 2nd ledger', 'D6 (space)'],
                ['3rd ledger line', 'E6 (line)'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['F5'], duration: 'q' },
                  { notes: ['G5'], duration: 'q' },
                  { notes: ['A5'], duration: 'q' },
                  { notes: ['B5'], duration: 'q' },
                  { notes: ['C6'], duration: 'q', label: 'High C' },
                  { notes: ['D6'], duration: 'q' },
                  { notes: ['E6'], duration: 'q' },
                ],
              },
            ),
            sources(['How to read piano notes and sheet music.pdf']),
          ],
          mcq(
            'According to the table, what note is on the 2nd ledger line above the treble staff?',
            ['A5', 'B5', 'C6', 'D6'],
            2,
            'The step text explicitly lists "2nd ledger line | C6 (High C — landmark!)" in the table of surrounding ledger notes.',
          ),
          [
            { assert: 'interval', from: 'F5', to: 'G5', semitones: 2 },
            { assert: 'interval', from: 'B5', to: 'C6', semitones: 1 },
            { assert: 'interval', from: 'C6', to: 'D6', semitones: 2 },
          ],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l13-1-4',
      'Ledger Notes in the Middle C Gap',
      [
        step(
          'Notes Occurring Between the Staves',
          [
            table(
              ['Note', 'Position'],
              [
                ['Middle C4', 'One ledger line between staves.'],
                ['D4 (Treble space below)', 'Sits directly underneath the bottom line of the Treble staff (or rests on top of the Middle C ledger line).'],
                ['B3 (Bass space above)', 'Sits directly on top of the top line of the Bass staff (or hangs underneath the Middle C ledger line).'],
              ],
            ),
            staff(
              {
                clef: 'grand',
                items: [
                  { notes: ['B3'], duration: 'q' },
                  { notes: ['C4'], duration: 'q', label: 'Middle C' },
                  { notes: ['D4'], duration: 'q' },
                ],
              },
            ),
            callout(
              'warning',
              'Ledger-line traps',
              '<p><strong>Counting ledger lines one-by-one</strong> from the top line of the staff — anchor to High C (2 lines above) or Low C (2 lines below) instantly instead. <strong>Confusing High C (2 lines above)</strong> with High A (1 line above) — High C is 2 lines above Treble; High A is 1 line above Treble.</p>',
            ),
            sources(['Piano tones and the keyboard.pdf']),
          ],
          mcq(
            'According to the step text, what is the position of Middle C4?',
            [
              'One ledger line between staves',
              'Sits directly underneath the bottom line of the Treble staff',
              'Sits directly on top of the top line of the Bass staff',
              'Two ledger lines above the Treble staff',
            ],
            0,
            'The step text explicitly states in the table that Middle C4 is at one ledger line between staves.',
          ),
          [
            { assert: 'interval', from: 'B3', to: 'C4', semitones: 1 },
            { assert: 'interval', from: 'C4', to: 'D4', semitones: 2 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m13-1-ex-a',
      type: 'Reading drill',
      title: 'Protocol 13.1-A — Ledger Landmark Flash Drill',
      prompt: 'Flash ledger note flashcards in the extreme high and low registers. Name the note and strike the key instantly: 2 ledger lines above Treble = High C6. 1 ledger line above Treble = High A5. 2 ledger lines below Bass = Low C2. 1 ledger line below Bass = Low E2.',
    },
  ],
  checkpoints: [
    'Five-C Landmarks: can point to and name all 5 Cs on the Grand Staff in under 3 seconds.',
    'Ledger Step/Skip: can read a 4-bar melody written 2 ledger lines above the treble staff without counting from line 5.',
    'Keybed Registration: can play Low C₂, Middle C₄, and High C₆ on the piano with eyes closed.',
  ],
});
