/**
 * Section 2.3 — Black Keys, Enharmonics, Half Steps, and Whole Steps
 * Module 2 — The Keyboard (final section — closes Module 2, unlocks Gate B)
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_02_The_Keyboard/Section_2.3_Black_Keys_Enharmonics_Half_Whole_Steps.md
 *
 * Continues 2.1/2.2's "promote ASCII art to the block it actually is" rule:
 * table() for the section's several literal comparison boxes (accidental
 * mechanics, enharmonic name pairs, half/whole-step pair lists, the closing
 * anti-pattern list), keyboard() wherever the source is pointing at specific
 * keybed positions (a sharp/flat move, the five black keys, the E-F/B-C
 * exception, a whole-step skip).
 *
 * `asserts` usage: this section is theory-dense (semitone counts are its
 * entire subject), so it carries the course's heaviest use yet of the
 * `interval` assertion type — one or two per lesson from 2.3.1 onward,
 * checked against lib/theory.js's MIDI arithmetic. Note names use ASCII
 * `#`/`b` (e.g. 'C#4', 'Bb4'), matching tools/author/lib/verify-theory.mjs's
 * `[A-Ga-g][#b]?(-?\d+)` parser — the ♯/♭ Unicode glyphs are for prose only.
 *
 * Per the section's own mustNotCover guardrail, no step declares one octave
 * numbering system correct over another, and no step prints a full MIDI
 * note-number table — only the section's own small, specific comparisons.
 *
 * LaTeX conversions used throughout (per tools/convert/delatex.mjs's table):
 * bare $X$ math wrappers dropped, \sharp/\flat/\natural -> ♯/♭/♮, \text{--}
 * -> en dash, \to -> "→".
 *
 * Section 5's two Structured Practice Protocols become this module's two
 * exercises[] entries. Section 6's five-item Gate B Assessment Audit
 * replaces the scaffold's generic placeholder checkpoint.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 12 of 12 passed (one after a second attempt).
 */
import {
  module_, lesson, step, prose, table, callout, keyboard,
  sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'piano-m2-3',
  code: '2.3',
  title: 'Black Keys, Enharmonics, Half Steps, and Whole Steps',
  outcomes: [
    'Define the operational function of the sharp (♯), flat (♭), and natural (♮) accidental symbols.',
    'Identify all five black keys by their dual enharmonic names (C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, A♯/B♭).',
    'Identify standard white-key enharmonic pairs (B♯ = C, C♭ = B, E♯ = F, F♭ = E).',
    'Define and physically execute a half step (semitone) from any key on the keyboard, identifying the natural half-step pairs (E–F and B–C).',
    'Define and physically execute a whole step (whole tone) spanning two half steps with an intervening key.',
    'Complete and execute the Gate B Assessment Rubric.',
  ],
  sources: [
    'All About Enharmonic Equivalents.pdf',
    'Eharmonic Notes.pdf',
    'How to read piano notes for beginners.pdf',
    'How to label piano keys for beginners.pdf',
    'Piano tones and the keyboard.pdf',
  ],
  practiceFocus: ['Name one black key two ways; play half then whole steps (Gate B).'],
  checkpoints: [
    'White-key mastery: you can name any random white key across the entire keybed within 3 seconds.',
    'Middle C located: you can locate physical Middle C (C3 on Launchkey / C4 acoustic) with eyes closed.',
    'Enharmonic duality: you can point to any black key and state both its sharp and flat name (e.g., "F-sharp or G-flat").',
    'Natural half steps known: you can immediately state from memory that E–F and B–C are half steps.',
    'Whole step execution: you can construct a whole step from any white or black key without error.',
  ],
  exercises: [
    {
      id: 'piano-m2-3-ex-a',
      type: 'Keyboard drill',
      title: 'Protocol 2.3-A — Chromatic Half-Step Ladder',
      prompt: 'Start on Middle C with right-hand finger 1. Step upward in pure half steps, naming each pitch aloud: C → C♯ → D → D♯ → E → F → F♯ → G → G♯ → A → A♯ → B → C. Then descend in pure half steps, naming flats aloud: C → B → B♭ → A → A♭ → G → G♭ → F → E → E♭ → D → D♭ → C.',
    },
    {
      id: 'piano-m2-3-ex-b',
      type: 'Keyboard drill',
      title: 'Protocol 2.3-B — Whole-Step Skipping Calibration',
      prompt: 'Play Middle C, then jump one whole step up to D — feel the skipped black key. Play E, then jump one whole step up to F♯ — feel the skipped white key F. Play B, then jump one whole step up to C♯ — feel the skipped white key C.',
    },
  ],
  lessons: [
    lesson(
      'piano-l2-3-1',
      'Accidentals: Sharps Raise, Flats Lower',
      [
        step(
          'The sharp and flat symbols',
          [
            prose(
              `Accidentals are symbols placed before a note (or in a key signature) that modify its
          fundamental pitch by the distance of the nearest adjacent key. The sharp (♯) raises a
          pitch by one semitone: move to the immediately adjacent key to the right, whether that
          key is black or white. The flat (♭) lowers a pitch by one semitone: move to the
          immediately adjacent key to the left, whether that key is black or white.`,
            ),
            table(
              ['Symbol', 'Effect', 'Physical action', 'Examples'],
              [
                [
                  'Sharp (♯)',
                  'Raises pitch by 1 semitone',
                  'Move to the immediately adjacent key to the right, whether black or white',
                  'C → C♯ (moves to a black key); E → E♯ (moves to a white key, F)',
                ],
                [
                  'Flat (♭)',
                  'Lowers pitch by 1 semitone',
                  'Move to the immediately adjacent key to the left, whether black or white',
                  'D → D♭ (moves to a black key); F → F♭ (moves to a white key, E)',
                ],
              ],
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            `According to the text, what does a sharp symbol do to a note's pitch?`,
            [
              'Lowers it by one semitone to the adjacent key on the left',
              'Raises it by one semitone to the adjacent key on the right',
              'Moves it two keys to the right',
              'Changes it to the nearest black key only',
            ],
            1,
            'The step text states that the sharp (♯) raises a pitch by one semitone: move to the immediately adjacent key to the right, whether that key is black or white.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'C#4', semitones: 1 },
          ],
        ),
        step(
          'Sharps and flats can land on white keys too',
          [
            prose(
              `A sharp or flat is not always a move to a black key. Because the physical action is
          "move one key over," and two white-key pairs on the keyboard sit directly next to each
          other with no black key between them, moving a sharp or flat from those specific keys
          lands on a white key instead: E♯ is the same physical key as F, and F♭ is the same
          physical key as E.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C4', 'C#4', 'D4', 'Db4'],
                showLabels: 'c',
                caption: 'C to C♯ (one semitone right) and D to D♭ (one semitone left) — the sharp and flat move in both directions.',
              },
            ),
          ],
          mcq(
            'According to the text, which white keys are enharmonically equivalent to E♯ and F♭ respectively?',
            [
              'E♯ is F and F♭ is E',
              'E♯ is C and F♭ is B',
              'E♯ is B and F♭ is C',
              'E♯ is D and F♭ is G',
            ],
            0,
            'The step text explicitly states that E♯ is the same physical key as F, and F♭ is the same physical key as E.',
          ),
          [
            { assert: 'interval', from: 'D4', to: 'Db4', semitones: 1 },
          ],
        ),
      ],
      {
        minutes: 6,
        intro: 'What the sharp and flat symbols actually do, physically, on the keybed.',
      },
    ),
    lesson(
      'piano-l2-3-2',
      'The Natural Symbol (♮): Canceling Alterations',
      [
        step(
          'What the natural sign cancels',
          [
            prose(
              `The natural sign (♮) cancels any prior sharp or flat alteration, restoring the pitch
          to its unmodified white-key state. If a measure contains a C♯, placing a natural sign
          before a subsequent C within that same measure — written C♮ — commands the performer to
          play the white key C, not the black key.`,
            ),
          ],
          mcq(
            'What does the natural sign (♮) do to a note that was previously altered by a sharp or flat in the same measure?',
            [
              'It raises the pitch by one half step',
              'It lowers the pitch by one half step',
              'It cancels the prior alteration and restores the white-key pitch',
              'It has no effect on black keys',
            ],
            2,
            'The step text states that the natural sign cancels any prior sharp or flat alteration, restoring the pitch to its unmodified white-key state, as in the example of C♯ becoming C♮.',
          ),
        ),
        step(
          'The barline reset',
          [
            prose(
              `In traditional notation, accidentals apply only through the duration of the single
          measure in which they appear. Crossing a barline automatically resets all pitches to
          the prevailing key signature, unless the altered note is tied across the bar.`,
            ),
            callout(
              'key',
              'Accidentals last one measure, not the whole piece',
              `A sharp or flat you see early in a measure governs every repeat of that same note
           for the rest of that measure only. The next measure starts clean, back at what the key
           signature says — unless a tie carries the altered pitch across the barline.`,
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the text, how long does an accidental last?',
            [
              'For the entire piece',
              'Only until the end of the measure in which it appears',
              'For exactly two measures',
              'Until the next time the same accidental appears',
            ],
            1,
            'The step text states that accidentals apply only through the duration of the single measure in which they appear and that a sharp or flat early in a measure governs every repeat of that note for the rest of that measure only.',
          ),
        ),
      ],
      {
        minutes: 4,
        intro: 'How the natural sign cancels a sharp or flat, and how long an accidental actually lasts.',
      },
    ),
    lesson(
      'piano-l2-3-3',
      'Enharmonic Twins: One Physical Key, Multiple Names',
      [
        step(
          'The five black keys, two names each',
          [
            prose(
              `Enharmonics are notes, intervals, or chords that share identical acoustic frequency
          and physical key coordinates but carry different theoretical names and spellings — the
          musical equivalent of linguistic homophones like their, there, and they're. Every one of
          the keyboard's five black keys carries two equally correct names.`,
            ),
            table(
              ['Physical key', 'Primary name', 'Enharmonic equivalent'],
              [
                ['1st black key', 'C-sharp (C♯)', 'D-flat (D♭)'],
                ['2nd black key', 'D-sharp (D♯)', 'E-flat (E♭)'],
                ['3rd black key', 'F-sharp (F♯)', 'G-flat (G♭)'],
                ['4th black key', 'G-sharp (G♯)', 'A-flat (A♭)'],
                ['5th black key', 'A-sharp (A♯)', 'B-flat (B♭)'],
              ],
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'],
                showLabels: 'all',
                caption: 'The five black keys within one octave — each one carries two equally correct names.',
              },
            ),
            sources(['All About Enharmonic Equivalents.pdf']),
          ],
          multi(
            'Which of the following are enharmonic pairs for black keys according to the provided table?',
            ['C♯ and D♭', 'D♯ and E♭', 'F♯ and G♭', 'G♯ and A♭', 'A♯ and B♭'],
            [0, 1, 2, 3, 4],
            `The step text's table explicitly lists all five black-key enharmonic pairs: C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, and A♯/B♭, each sharing the same physical key.`,
          ),
        ),
        step(
          'White keys have enharmonic twins too',
          [
            prose(
              `Enharmonic duality is not limited to black keys. Four white keys also carry a
          standard second name: B♯ = C, C♭ = B, E♯ = F, and F♭ = E. Spelling matters because scale
          construction requires exactly one instance of each letter name, A through G. In the key
          of F♯ major, the seventh scale degree must be spelled E♯, not F, because the letter name
          F is already assigned to the tonic, F♯.`,
            ),
            table(
              ['White key', 'Primary name', 'Enharmonic equivalent'],
              [
                ['White key C', 'C-natural (C♮)', 'B-sharp (B♯)'],
                ['White key F', 'F-natural (F♮)', 'E-sharp (E♯)'],
                ['White key E', 'E-natural (E♮)', 'F-flat (F♭)'],
                ['White key B', 'B-natural (B♮)', 'C-flat (C♭)'],
              ],
            ),
            sources(['Eharmonic Notes.pdf']),
          ],
          multi(
            'Which white-key enharmonic pairs are stated as having dual names?',
            [
              'B♯ = C and C♭ = B',
              'E♯ = F and F♭ = E',
              'B♯ = C, C♭ = B, E♯ = F, and F♭ = E',
              'C♯ = D♭ and F♯ = G♭',
              'B-natural is the same as C-flat',
            ],
            [0, 1],
            'The step text explicitly lists the four white-key enharmonic pairs as B♯ = C, C♭ = B, E♯ = F, and F♭ = E, so the first two options together name all of them.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'Why one physical key can have two correct names, on both the black keys and four of the white ones.',
      },
    ),
    lesson(
      'piano-l2-3-4',
      'The Half Step (Semitone): The Smallest Atomic Distance',
      [
        step(
          'The smallest distance on the keyboard',
          [
            prose(
              `A half step (semitone) is the smallest interval in standard Western equal-tempered
          music: the distance between any key and the absolute nearest key directly adjacent to
          it, with zero intervening keys. Most half steps run from a white key to its neighboring
          black key.`,
            ),
            table(
              ['From', 'To', 'Direction'],
              [
                ['C', 'C♯', 'Right'],
                ['D', 'D♭', 'Left'],
                ['D', 'D♯', 'Right'],
                ['E', 'E♭', 'Left'],
                ['F', 'F♯', 'Right'],
                ['G', 'G♭', 'Left'],
                ['G', 'G♯', 'Right'],
                ['A', 'A♭', 'Left'],
                ['A', 'A♯', 'Right'],
                ['B', 'B♭', 'Left'],
              ],
            ),
            sources(['Piano tones and the keyboard.pdf']),
          ],
          multi(
            'According to the table, which pairs show a half step moving left from a white key to a black key?',
            ['C to C♯', 'D to D♭', 'E to E♭', 'G to G♭', 'A to A♯'],
            [1, 2, 3],
            'The table explicitly lists D to D♭ Left, E to E♭ Left, and G to G♭ Left as half-step examples, while C to C♯ and A to A♯ are listed as Right.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'C#4', semitones: 1 },
            { assert: 'interval', from: 'G4', to: 'Ab4', semitones: 1 },
          ],
        ),
        step(
          'The exception: E–F and B–C',
          [
            prose(
              `Two white-key pairs break the black-key pattern entirely: there are no black keys
          between E and F, or between B and C. E to F is a half step — they are physically
          adjacent, with no black key between them. B to C is a half step for the same reason.`,
            ),
            callout(
              'warning',
              'The most common half-step mistake',
              `It is tempting to assume every white-to-white move is a whole step, since a black
           key usually sits between adjacent white keys. E–F and B–C are the two exceptions: no
           black key separates them, so both pairs are half steps, not whole steps.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['E4', 'F4', 'B4', 'C5'],
                showLabels: 'c',
                caption: 'E–F and B–C: the two natural half steps with no black key between them.',
              },
            ),
          ],
          mcq(
            'According to the text, why are E–F and B–C half steps instead of whole steps?',
            [
              'They have a black key between them',
              'They are physically adjacent white keys with no black key between them',
              'They are both black keys',
              'They span two half steps with an intervening key',
            ],
            1,
            'The step text states that E to F and B to C are half steps because they are physically adjacent white keys with no black key between them, the two exceptions to the usual white-to-white pattern.',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'F4', semitones: 1 },
            { assert: 'interval', from: 'B4', to: 'C5', semitones: 1 },
          ],
        ),
      ],
      {
        minutes: 7,
        intro: 'The half step, and the one white-key exception every beginner trips on at least once.',
      },
    ),
    lesson(
      'piano-l2-3-5',
      'The Whole Step (Whole Tone): Two Half Steps Combined',
      [
        step(
          'Two half steps, one skipped key',
          [
            prose(
              `A whole step (whole tone) consists of two half steps combined: one whole step
          equals one half step plus one half step. Geometrically, a whole step is the distance
          between two keys with exactly one key — white or black — skipped between them. Most
          whole steps run white key to white key, skipping the black key between them.`,
            ),
            table(
              ['From', 'To', 'Skips'],
              [
                ['C', 'D', 'C♯/D♭'],
                ['D', 'E', 'D♯/E♭'],
                ['F', 'G', 'F♯/G♭'],
                ['G', 'A', 'G♯/A♭'],
                ['A', 'B', 'A♯/B♭'],
              ],
            ),
            sources(['Piano tones and the keyboard.pdf']),
          ],
          mcq(
            'According to the text, a whole step geometrically consists of the distance between two keys with how many keys skipped between them?',
            ['None', 'Exactly one', 'Exactly two', 'It varies'],
            1,
            'The step text states that a whole step is the distance between two keys with exactly one key — white or black — skipped between them.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'D4', semitones: 2 },
            { assert: 'interval', from: 'F4', to: 'G4', semitones: 2 },
          ],
        ),
        step(
          'Whole steps that skip a white key instead',
          [
            prose(
              `Not every whole step skips a black key. E to F♯ skips the white key F; B to C♯
          skips the white key C. The same pattern runs the other way, black key to white key: E♭
          to F skips the white key E, and B♭ to C skips the white key B.`,
            ),
            table(
              ['From', 'To', 'Skips'],
              [
                ['E', 'F♯', 'White key F'],
                ['B', 'C♯', 'White key C'],
                ['E♭', 'F', 'White key E'],
                ['B♭', 'C', 'White key B'],
              ],
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['E4', 'F#4'],
                showLabels: 'c',
                caption: 'E to F♯ — a whole step that skips a white key, not a black one.',
              },
            ),
          ],
          mcq(
            'According to the step, which pair forms a whole step that skips a white key instead of a black key?',
            ['E to F♯', 'C to D', 'F to G', 'A to B'],
            0,
            'The step text explicitly states that E to F♯ skips the white key F and is a whole step that skips a white key, not a black one.',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'F#4', semitones: 2 },
            { assert: 'interval', from: 'Bb4', to: 'C5', semitones: 2 },
          ],
        ),
      ],
      {
        minutes: 7,
        intro: 'Whole steps that skip a black key, and the less obvious ones that skip a white key instead.',
      },
    ),
    lesson(
      'piano-l2-3-6',
      'Scale Foundation Preview',
      [
        step(
          'Half and whole steps build every scale',
          [
            prose(
              `The half step (H) and whole step (W) are the foundational building blocks of all
          Western scalar architecture. Every scale covered later in this course is really just a
          specific sequence of half steps and whole steps applied starting from a chosen root
          note.`,
            ),
            table(
              ['Scale type', 'Formula', `Where you'll build it`],
              [
                ['Major pentascale', 'W - W - H - W', 'Module 5'],
                ['Major scale (1 octave)', 'W - W - H - W - W - W - H', 'Modules 9–10'],
                ['Natural minor scale', 'W - H - W - W - H - W - W', 'Module 10'],
              ],
            ),
            sources(['Eharmonic Notes.pdf']),
          ],
          mcq(
            'According to the table, what is the step formula for the natural minor scale?',
            [
              'W - W - H - W',
              'W - W - H - W - W - W - H',
              'W - H - W - W - H - W - W',
              'W - W - H - W - W - H - W',
            ],
            2,
            'The step text explicitly lists the Natural minor scale formula as W - H - W - W - H - W - W in the provided table.',
          ),
        ),
        step(
          'Common traps, corrected — and the Gate B checklist ahead',
          [
            prose(
              `Before moving on, three conceptual traps are worth naming explicitly, since each one
          quietly reverses a rule this section just established.`,
            ),
            table(
              ['Conceptual trap', 'Correct theoretical law'],
              [
                [
                  'All white-to-white steps are whole steps.',
                  'E–F and B–C are natural half steps because no key is skipped between them.',
                ],
                [
                  'Black keys are exclusively sharps.',
                  'Every black key has dual names; C♯ is identically D♭.',
                ],
                [
                  'White keys can never be sharp or flat.',
                  'E♯ = F, B♯ = C, F♭ = E, C♭ = B — white keys have enharmonic names too.',
                ],
              ],
            ),
            callout(
              'key',
              'Gate B is next',
              `This section closes Module 2. Before moving to Module 3, use the checkpoints below
           to confirm you can name any white key on sight, find Middle C with your eyes closed,
           give both names for any black key, recall the E–F and B–C exception from memory, and
           build a whole step from any starting key.`,
            ),
          ],
          multi(
            'Which of the following are presented as conceptual traps that reverse rules from the section?',
            [
              'All white-to-white steps are whole steps.',
              'Black keys are exclusively sharps.',
              'White keys can never be sharp or flat.',
              'E–F and B–C are natural half steps.',
            ],
            [0, 1, 2],
            'The step text explicitly lists these three statements in the left column of the Conceptual trap table as traps that quietly reverse a rule this section just established.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'How half and whole steps become scales, three traps to avoid, and what Gate B checks before Module 3.',
      },
    ),
  ],
});
