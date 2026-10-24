/**
 * Section 2.1 — Groups, Letters, and the Repeating Pattern
 * Module 2 — The Keyboard
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_02_The_Keyboard/Section_2.1_Groups_Letters_Repeating_Pattern.md
 *
 * This is the first section built almost entirely out of keyboard() blocks
 * rather than diagram()/table() — the source material IS keyboard geography,
 * so every ASCII key-layout diagram is promoted to a real interactive
 * keyboard(), highlighted to match what that ASCII art was pointing at:
 *   - the opening "repeating 12-pitch architecture" overview art is not
 *     duplicated as its own block — it previews exactly what Lessons 2.1.2,
 *     2.1.4 and 2.1.5 each render in more detail, so folding it into those
 *     three avoids showing the same picture four times.
 *   - the two black-key-cluster diagrams (Lesson 2.1.2) -> keyboard()
 *     highlighting each cluster's black keys.
 *   - the Anchor 1 / Anchor 2 diagrams (Lessons 2.1.4, 2.1.5) -> keyboard()
 *     highlighting the anchor white key plus its black-key landmark.
 *   - the complete octave topography table (Lesson 2.1.6) -> a real table()
 *     plus a keyboard() with showLabels:'all' as the "answer key" reveal.
 *   - the alphabet directionality table (Lesson 2.1.3) -> prose + list(),
 *     since the content itself is a short forward/backward sequence.
 *   - the labeling anti-pattern table (Section 4) -> folded into Lesson
 *     2.1.6's closing step as a table() + callout('warning', ...), per the
 *     plan's "traps -> a warning callout in the closing step" rule. This
 *     section only names one trap theme (mislabeling/over-labeling), so it
 *     gets one callout rather than being distributed like Section 1.3's four.
 *
 * Per the section's own mustNotCover guardrail, no step declares a specific
 * octave (e.g. "C4") to be THE one true Middle C — keyboard() blocks target
 * concrete octave-numbered notes only because the component requires real
 * MIDI coordinates to render, never as a pedagogical claim about which C is
 * canonical. Prose stays in relative, geometric terms ("the white key left
 * of two blacks"), matching the source.
 *
 * LaTeX conversions used throughout (per tools/convert/delatex.mjs's table):
 * \text{--} and \longrightarrow -> en dash / "->"; \sharp -> ♯; \flat -> ♭;
 * bare $X$ math wrappers dropped, plain text kept.
 *
 * Section 5's two Structured Practice Protocols become this module's two
 * exercises[] entries (each with an explicit id, per the piano-m1-2 fix).
 * Section 6's five-item self-assessment checklist replaces the scaffold's
 * generic placeholder checkpoint, matching Section 1.3's Gate-audit pattern.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 12 of 12 passed on the first attempt.
 */
import {
  module_, lesson, step, prose, list, table, callout, keyboard,
  sources, mcq, multi, text,
} from '../../schema.js';

export default module_({
  id: 'piano-m2-1',
  code: '2.1',
  title: 'Groups, Letters, and the Repeating Pattern',
  outcomes: [
    'Identify the repeating physical clusters of two and three black keys across any size keyboard.',
    'Recite and navigate the 7-letter musical alphabet (A–B–C–D–E–F–G) forward (ascending in pitch) and backward (descending in pitch).',
    'Locate any C immediately as the white key positioned directly to the left of any two-black-key cluster.',
    'Locate any F immediately as the white key positioned directly to the left of any three-black-key cluster.',
    'Identify and name all seven natural white keys (C, D, E, F, G, A, B) in any octave within 5 seconds without counting from the bottom of the instrument.',
    'Evaluate the temporary use of physical key labels and execute an unassisted weaning protocol.',
  ],
  sources: [
    'How to label piano keys for beginners.pdf',
    'Learn to read and understand your keyboard.pdf',
    'Piano tones and the keyboard.pdf',
    'Names of the tones in music.pdf',
    'Learning  Playing Piano Notes for Beginners.pdf',
    'Musical Notes Quiz.pdf',
  ],
  practiceFocus: [
    'Five-second random white-key hunt in two octaves.',
    'Backward alphabet recitation while playing descending single notes, high to low.',
  ],
  checkpoints: [
    'Black key grouping: eyes closed, you can distinguish a 2-black group from a 3-black group by feel alone.',
    'Instant C & F location: you can instantly strike all Cs and all Fs on your keyboard without counting up from A.',
    'White-key naming: pointing to any arbitrary white key, you can name its letter in under 3 seconds.',
    'Backward alphabet fluency: you can recite G–F–E–D–C–B–A without pausing.',
    'Label-free operation: your keybed is free of letter stickers, or you are actively executing the weaning protocol.',
  ],
  exercises: [
    {
      id: 'piano-m2-1-ex-a',
      type: 'Timed keyboard drill',
      title: 'Protocol 2.1-A — 5-Second Random White-Key Flash Hunt',
      prompt: 'Set a metronome or timer to 60 BPM. Call out a random letter — for example "G". Scan the keyboard using black-key topography (three-group, between the 1st and 2nd black key) and depress every G on the instrument, lowest to highest. Repeat with random letter prompts in this order: E, B, D, F, A, C. Goal: zero hesitation, under 2 seconds per target.',
    },
    {
      id: 'piano-m2-1-ex-b',
      type: 'Recitation + keyboard drill',
      title: 'Protocol 2.1-B — Backward Alphabet Recitation Drill',
      prompt: 'Recite the alphabet aloud while playing descending single notes from high C to low C: C, B, A, G, F, E, D, C. Execute once with right-hand finger 3, then once with left-hand finger 3.',
    },
  ],
  lessons: [
    lesson(
      'piano-l2-1-1',
      'The Repeating Pattern: 12 Pitches Across the Keybed',
      [
        step(
          'One instrument, twelve pitches',
          [
            prose(
              `A standard piano keyboard contains 88 keys — 52 white and 36 black. A standard
          studio controller, such as the Novation Launchkey MK4 61, contains 61 keys — 36 white and
          25 black.`,
            ),
            prose(
              `Despite that large number of physical keys, there are only 12 distinct pitch
          classes in Western equal temperament. These 12 pitches repeat cyclically across the
          entire length of the keybed, no matter how many physical keys the instrument has.`,
            ),
          ],
          mcq(
            'How many distinct pitch classes are there in Western equal temperament according to the text?',
            ['52', '61', '12', '88'],
            2,
            'The step text explicitly states that despite the large number of physical keys there are only 12 distinct pitch classes in Western equal temperament.',
          ),
        ),
        step(
          'Master one octave, master the instrument',
          [
            prose(
              `One octave breaks down as 7 white keys (the naturals) plus 5 black keys (the
          accidentals), for 12 pitches total. Because the physical arrangement repeats identically
          every 12 keys, mastering the geography of a single octave confers complete mastery over
          the entire instrument — there is no separate geography to learn for the next octave up
          or down.`,
            ),
            keyboard(
              {
                highlight: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
                showLabels: 'none',
                caption: 'One full octave — 7 white keys plus 5 black keys, 12 pitches. This exact pattern repeats across the whole keybed.',
              },
            ),
            sources(['How to label piano keys for beginners.pdf', 'Piano tones and the keyboard.pdf']),
          ],
          mcq(
            'According to the step text, how many pitches are there in one octave?',
            ['7', '5', '12', '17'],
            2,
            'The step text states that one octave breaks down as 7 white keys plus 5 black keys, for 12 pitches total.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'Why the whole keyboard is really just one 12-pitch pattern, repeated.',
      },
    ),
    lesson(
      'piano-l2-1-2',
      'The Black-Key Clusters: Two Blacks, Three Blacks',
      [
        step(
          'The two-black-key cluster',
          [
            prose(
              `The black keys are not spaced uniformly across the keyboard — they are arranged in
          alternating clusters of two black keys and three black keys.`,
            ),
            prose(
              `The two-black-key cluster consists of C♯/D♭ and D♯/E♭. It encloses three white keys:
          C, D, and E.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C#4', 'D#4'],
                showLabels: 'none',
                caption: 'The two-black-key cluster, enclosing the white keys C, D, and E.',
              },
            ),
          ],
          mcq(
            'What white keys are enclosed by a two-black-key cluster?',
            ['C, D, and E', 'D, E, and F', 'F, G, and A', 'G, A, and B'],
            0,
            'The step text states that the two-black-key cluster consists of C♯/D♭ and D♯/E♭ and encloses the white keys C, D, and E.',
          ),
        ),
        step(
          'The three-black-key cluster, and finding both by feel',
          [
            prose(
              `The three-black-key cluster consists of F♯/G♭, G♯/A♭, and A♯/B♭. It encloses four
          white keys: F, G, A, and B.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['F#4', 'G#4', 'A#4'],
                showLabels: 'none',
                caption: 'The three-black-key cluster, enclosing the white keys F, G, A, and B.',
              },
            ),
            callout(
              'tip',
              'Tactile blind recognition',
              `Without looking at the keys, slide your finger pads across the black keys. The hand
           easily distinguishes the gap between the 2-group and the 3-group by feel alone — this is
           the skill the "eyes closed" checkpoint at the end of this section tests.`,
            ),
            sources(['How to label piano keys for beginners.pdf']),
          ],
          mcq(
            'Which white keys are enclosed by the three-black-key cluster?',
            ['C, D, E, F', 'F, G, A, B', 'G, A, B, C', 'A, B, C, D'],
            1,
            'The step text states that the three-black-key cluster consists of F♯/G♭, G♯/A♭, and A♯/B♭ and encloses four white keys: F, G, A, and B.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'The two black-key landmarks that make every octave findable without counting.',
      },
    ),
    lesson(
      'piano-l2-1-3',
      'The 7-Letter Musical Alphabet (A–G)',
      [
        step(
          'Ascending: the alphabet moving forward',
          [
            prose(
              `Standard Western music uses only the first seven letters of the Latin alphabet:
          A, B, C, D, E, F, G — then the sequence repeats back to A.`,
            ),
            list(
              [
                'Ascending in pitch (moving right on the keyboard): the alphabet moves forward — A → B → C → D → E → F → G → A …',
                'Moving forward through the alphabet always means pitch frequency is increasing — a higher sound.',
              ],
            ),
            sources(['Names of the tones in music.pdf']),
          ],
          mcq(
            'According to the step text, what happens to pitch frequency when moving forward through the musical alphabet on the keyboard?',
            ['It decreases', 'It stays the same', 'It increases', 'It alternates up and down'],
            2,
            'The step text states that moving forward through the alphabet always means pitch frequency is increasing — a higher sound.',
          ),
        ),
        step(
          'Descending: the alphabet moving backward',
          [
            prose(
              `Descending in pitch (moving left on the keyboard) reverses the sequence: the
          alphabet moves backward — G → F → E → D → C → B → A → G …, and pitch frequency decreases
          into a lower, deeper sound.`,
            ),
            callout(
              'key',
              'A pedagogical requirement, not an option',
              `You must be able to recite the alphabet backward (G–F–E–D–C–B–A) as fluently as
           forward. Descending passages are just as common as ascending ones, and hesitating on the
           backward direction stalls you exactly as much as not knowing the forward direction would.`,
            ),
          ],
          text(
            'What is the exact backward sequence of the musical alphabet that you must be able to recite fluently?',
            ['g f e d c b a', 'g–f–e–d–c–b–a', 'gfe dcba', 'g-f-e-d-c-b-a'],
            'The step text explicitly states you must recite the alphabet backward (G–F–E–D–C–B–A) as fluently as forward.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'The 7-letter musical alphabet, and why you need it fluent in both directions.',
      },
    ),
    lesson(
      'piano-l2-1-4',
      'Anchor Point 1: C Lives Left of Two Blacks',
      [
        step(
          'The rule',
          [
            prose(
              `The primary reference point on the keyboard is the pitch C. Locate any group of two
          black keys. The white key immediately to the left of the first black key is always C —
          on any octave, on any size keyboard.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C4', 'C#4', 'D#4'],
                showLabels: 'none',
                caption: 'C is always the white key directly to the left of a two-black-key cluster.',
              },
            ),
            sources(['Learn to read and understand your keyboard.pdf', 'Piano tones and the keyboard.pdf']),
          ],
          mcq(
            'What is the primary reference point on the keyboard?',
            [
              'The white key to the right of a three-black-key cluster',
              'The white key immediately to the left of the first black key in any group of two black keys',
              'The middle white key on the keyboard',
              'The white key between the two black keys',
            ],
            1,
            'The step text states that the primary reference point on the keyboard is the pitch C, which is the white key immediately to the left of the first black key in any group of two black keys.',
          ),
        ),
        step(
          'The "dog house" mnemonic',
          [
            prose(
              `The two black keys form the "dog house": D lives inside the dog house, between the
          two black keys. C sits to the left of the front door, and E sits to the right.`,
            ),
          ],
          mcq(
            'According to the step, where does D live?',
            [
              'To the left of the two black keys',
              'Between the two black keys',
              'To the right of the two black keys',
              'Directly left of the three black keys',
            ],
            1,
            'The step text states that the two black keys form the "dog house" and that D lives inside the dog house, between the two black keys.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'Finding C instantly, anywhere on the keyboard, using the two-black-key cluster.',
      },
    ),
    lesson(
      'piano-l2-1-5',
      'Anchor Point 2: F Lives Left of Three Blacks',
      [
        step(
          'The rule',
          [
            prose(
              `The secondary reference point on the keyboard is the pitch F. Locate any group of
          three black keys. The white key immediately to the left of the first black key is always
          F.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['F4', 'F#4', 'G#4', 'A#4'],
                showLabels: 'none',
                caption: 'F is always the white key directly to the left of a three-black-key cluster.',
              },
            ),
            sources(['Learn to read and understand your keyboard.pdf']),
          ],
          mcq(
            'According to the step, what is the secondary reference point on the keyboard and where is it located relative to black keys?',
            [
              'C, immediately to the left of a two-black-key cluster',
              'F, immediately to the left of a three-black-key cluster',
              'G, immediately to the right of a three-black-key cluster',
              'A, immediately to the left of a two-black-key cluster',
            ],
            1,
            'The step text states that the secondary reference point is the pitch F and that it is the white key immediately to the left of the first black key in any group of three black keys.',
          ),
        ),
        step(
          'The complete white-key map from F',
          [
            table(
              ['Key', 'Position relative to the three-black-key cluster'],
              [
                ['F', 'Left of all three black keys'],
                ['G', 'Between the 1st and 2nd black keys'],
                ['A', 'Between the 2nd and 3rd black keys'],
                ['B', 'Right of all three black keys'],
              ],
            ),
          ],
          mcq(
            'According to the table, which white key is positioned between the 2nd and 3rd black keys of the three-black-key cluster?',
            ['F', 'G', 'A', 'B'],
            2,
            'The step text table explicitly states that A is between the 2nd and 3rd black keys.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'Finding F instantly, and reading the rest of the 3-black-key cluster from it.',
      },
    ),
    lesson(
      'piano-l2-1-6',
      'Complete Octave White-Key Topography',
      [
        step(
          'All seven naturals, without counting',
          [
            prose(
              `Combining Anchor 1 (C) and Anchor 2 (F), all seven natural white keys are instantly
          identifiable without ever counting sequentially from the bottom of the instrument.`,
            ),
            table(
              ['Key', 'Structural landmark formula'],
              [
                ['C', 'White key directly to the left of the 2-black-key cluster'],
                ['D', 'White key centered in the middle of the 2-black-key cluster'],
                ['E', 'White key directly to the right of the 2-black-key cluster'],
                ['F', 'White key directly to the left of the 3-black-key cluster'],
                ['G', 'White key between the 1st and 2nd black keys of the 3-cluster'],
                ['A', 'White key between the 2nd and 3rd black keys of the 3-cluster'],
                ['B', 'White key directly to the right of the 3-black-key cluster'],
              ],
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                showLabels: 'all',
                caption: 'Every natural white key in one octave, named — the answer key for the landmark formulas above.',
              },
            ),
            sources(['Learning  Playing Piano Notes for Beginners.pdf', 'Musical Notes Quiz.pdf']),
          ],
          multi(
            'According to the landmark formulas, which white keys are positioned directly to the left of a black-key cluster?',
            ['C and F', 'D and G', 'E and A', 'B and D'],
            [0],
            'The step text states that C is the white key directly to the left of the 2-black-key cluster and F is the white key directly to the left of the 3-black-key cluster.',
          ),
          [
            {
              assert: 'pcSet',
              root: 'C',
              semitones: [0, 2, 4, 5, 7, 9, 11],
              notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
          ],
        ),
        step(
          'Labels are training wheels, not a destination',
          [
            table(
              ['Anti-pattern', 'Professional standard'],
              [
                [
                  'Permanent stickers or dry-erase marker on keytops',
                  'Never apply permanent adhesive or dry-erase markers to keytops',
                ],
                [
                  'Labeling every key on the board',
                  'Labeling all 88 keys creates severe visual dependency — students read stickers instead of reading black-key topography',
                ],
              ],
            ),
            callout(
              'warning',
              'The weaning protocol',
              `If temporary aids are required at all, label ONLY C, E, and G in one central octave —
           never the whole keybed — then remove every label after 72 hours. The goal is landmark
           navigation by feel and pattern, not sticker-reading.`,
            ),
          ],
          multi(
            'According to the professional standards described, which practices should be avoided when labeling piano keys?',
            [
              'Applying permanent stickers or dry-erase markers to keytops',
              'Labeling every key on the board',
              'Labeling ONLY C, E, and G in one central octave for a short time',
              'Removing every label after 72 hours',
            ],
            [0, 1],
            'The step text explicitly lists permanent stickers or dry-erase marker on keytops and labeling every key on the board as anti-patterns to avoid, contrasting them with the professional standards and the limited temporary weaning protocol.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'Putting both anchors together to name any white key on sight — and weaning off labels for good.',
      },
    ),
  ],
});
