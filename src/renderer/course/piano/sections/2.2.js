/**
 * Section 2.2 — Middle C, Octaves, and the Octave Numbering Conflict
 * Module 2 — The Keyboard
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_02_The_Keyboard/Section_2.2_Middle_C_Octaves_Numbering_Conflict.md
 *
 * Continues 2.1's keyboard()-block-heavy style wherever the source is
 * literally pointing at a keybed position (2.2.1's spatial-center method,
 * 2.2.2's octave span, 2.2.5's Launchkey range) and switches to table() for
 * the comparison content that is inherently tabular in the source (the
 * left/right directionality grid, the SPN/MIDI/MIDI-alternate numbering
 * conflict, the Launchkey hardware/acoustic/MIDI mapping, the closing
 * anti-pattern list) — matching the "promote ASCII art to the block it
 * actually is" rule rather than defaulting to one block type throughout.
 *
 * Per the section's own mustNotCover guardrail, no step declares C3 or C4
 * to be THE one true Middle C: both numbering systems are presented side by
 * side as equally valid, tied together by the one invariant fact the source
 * itself uses to resolve the conflict — MIDI Note 60, ≈261.63 Hz, is the
 * same physical key regardless of which number a screen prints for it. The
 * tables here are the section's own small, specific comparisons (3–4 rows
 * each), never a full C-1..G9 MIDI note-number table.
 *
 * LaTeX conversions used throughout (per tools/convert/delatex.mjs's table):
 * bare $X$ math wrappers dropped, subscripts folded into plain digits
 * (C_4 -> C4), \text{--} -> en dash, \times -> "×", \approx -> "≈".
 *
 * Section 5's two Structured Practice Protocols become this module's two
 * exercises[] entries (each with an explicit id, per the piano-m1-2 fix).
 * Section 6's four-item self-assessment checklist replaces the scaffold's
 * generic placeholder checkpoint.
 *
 * New `asserts` usage: Lesson 2.2.2's 2:1 frequency-ratio claim and
 * Lesson 2.2.6's "two presses of Octave Up = +24 semitones" claim are both
 * backed by `interval` assertions (from/to/semitones), checked against
 * lib/theory.js's MIDI arithmetic — Section 2.1 only used `pcSet`, so this
 * is the course's first use of the `interval` assertion type.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 12 of 12 passed on the first attempt.
 */
import {
  module_, lesson, step, prose, table, callout, keyboard,
  sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'piano-m2-2',
  code: '2.2',
  title: 'Middle C, Octaves, and the Octave Numbering Conflict',
  outcomes: [
    'Locate Middle C instantaneously on 88-key, 76-key, and 61-key keyboards by spatial proximity and brand lettering landmarks.',
    'Define the musical octave acoustically (a 2:1 frequency ratio) and geographically (the spatial distance spanning 8 diatonic white-key letter steps / 12 chromatic semitones).',
    'Connect physical keyboard directionality with pitch frequency (Right = Higher Pitch / Ascending; Left = Lower Pitch / Descending).',
    'Explain the technological origin of the C₃ vs. C₄ Middle C conflict across DAWs, MIDI hardware, and acoustic traditions.',
    'Operate the octave shift controls on the Novation Launchkey MK4 61 (Default display range C₁–C₆, Middle C as C₃, and dual-button octave reset).',
  ],
  sources: [
    'How to read piano notes and sheet music.pdf',
    'A perfect guide to learning piano.pdf',
    'Piano tones and the keyboard.pdf',
    `Playing the Launchkey 61's keyboard`,
    'Learn to read and understand your keyboard.pdf',
  ],
  practiceFocus: ['Eyes-closed Middle C; Launchkey octave reset both buttons.'],
  checkpoints: [
    'Instant Middle C identification: you can locate Middle C on your instrument in under 2 seconds.',
    'Octave frequency definition: you can explain that an octave is an exact 2:1 acoustic frequency ratio spanning 12 semitones.',
    'Conflict literacy: you can articulate in one sentence why your screen says C3 while a theory book says C4, without altering any pitch settings.',
    'Hardware octave reset: on your Launchkey, you can shift octaves up/down and execute the simultaneous dual-button reset to return to default.',
  ],
  exercises: [
    {
      id: 'piano-m2-2-ex-a',
      type: 'Tactile drill',
      title: 'Protocol 2.2-A — Eyes-Closed Middle C Acquisition',
      prompt: 'Stand up and step away from the keyboard. Approach the bench, sit with proper posture, and close your eyes. Reach forward with your right index finger and feel for the central two-black-key cluster. Slide your finger to the white key on its left. Open your eyes and verify: did you land directly on Middle C? Repeat 5 times until tactile spatial acquisition is 100% accurate.',
    },
    {
      id: 'piano-m2-2-ex-b',
      type: 'Keyboard drill',
      title: 'Protocol 2.2-B — Octave Chain Leap Drill',
      prompt: 'Place right-hand finger 1 on Middle C. Play Middle C (1 count), then leap rightward to the next higher C with finger 5 (1 count). Continue leaping rightward, C to C, until you reach the highest C on your instrument (C6 on the Launchkey, C7–C8 on a full piano). Reverse direction, stepping downward octave by octave back to the lowest bass C.',
    },
  ],
  lessons: [
    lesson(
      'piano-l2-2-1',
      'Middle C Is a Physical Coordinate',
      [
        step(
          'Finding Middle C by feel',
          [
            prose(
              `Middle C is not merely an abstract theoretical term — it is a physical geographic
          landmark on the instrument. Sit in standard playing position at the center of the
          keyboard and look directly forward at the manufacturer's logo or the central keybed
          seam. Locate the group of two black keys closest to the exact center of the instrument.
          The white key immediately to the left of those two central black keys is Middle C.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C4'],
                showLabels: 'none',
                caption: 'Middle C — the white key just left of the two-black-key cluster nearest the center of the instrument.',
              },
            ),
          ],
          mcq(
            'According to the step text, which key is Middle C?',
            [
              'The white key immediately to the right of the two black keys nearest the center',
              'The white key immediately to the left of the two black keys nearest the center',
              'The black key in the exact center of the keyboard',
              `The white key directly under the manufacturer's logo`,
            ],
            1,
            'The step text explicitly states that the white key immediately to the left of the two central black keys is Middle C.',
          ),
        ),
        step(
          `Middle C's position changes with keyboard size`,
          [
            prose(
              `The same physical note is counted differently depending on how much keybed sits to
          its left. On a full-size 88-key acoustic or digital piano (A0 to C8), Middle C is the
          fourth C from the left edge of the instrument. On a 61-key controller such as the
          Novation Launchkey MK4 61 (C2 to C7 acoustic range, C1 to C6 on the Launchkey's own
          readout), Middle C is only the third C from the left edge.`,
            ),
            table(
              ['Keyboard', 'Middle C position from the left edge'],
              [
                ['88-key piano (A0–C8)', '4th C from the left edge'],
                ['61-key controller (Launchkey MK4 61)', '3rd C from the left edge'],
              ],
            ),
            sources(['How to read piano notes and sheet music.pdf', 'A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'On a 61-key controller such as the Novation Launchkey MK4 61, Middle C is the',
            [
              'third C from the left edge',
              'fourth C from the left edge',
              'second C from the left edge',
              'fifth C from the left edge',
            ],
            0,
            'The step text explicitly states that on a 61-key controller such as the Novation Launchkey MK4 61, Middle C is only the third C from the left edge.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'Middle C as a spatial landmark you can find by feel, on any size keyboard.',
      },
    ),
    lesson(
      'piano-l2-2-2',
      'The Octave: Acoustic Ratio and Keyboard Geography',
      [
        step(
          'The 2:1 frequency law',
          [
            prose(
              `An octave (from the Latin octava, "eighth") is the fundamental unit of perceptual
          pitch equivalence in music. Two pitches separated by an octave have a fundamental
          frequency ratio of exactly 2:1. Middle C vibrates at approximately 261.63 Hz, so the C
          one octave above it vibrates at 523.25 Hz (261.63 × 2), and the C one octave below it
          vibrates at 130.81 Hz (261.63 / 2).`,
            ),
            table(
              ['Note', 'Approximate frequency'],
              [
                ['C3 (one octave below Middle C)', '≈130.81 Hz'],
                ['Middle C', '≈261.63 Hz'],
                ['C5 (one octave above Middle C)', '≈523.25 Hz'],
              ],
            ),
            sources(['Piano tones and the keyboard.pdf']),
          ],
          mcq(
            'What is the exact frequency ratio that defines two pitches as being one octave apart?',
            ['1:1', '2:1', '3:2', '4:1'],
            1,
            'The step text states that two pitches separated by an octave have a fundamental frequency ratio of exactly 2:1.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'C5', semitones: 12 },
          ],
        ),
        step(
          'The octave, measured on the keybed',
          [
            prose(
              `Geometrically, an octave spans 8 white-key letter names — C, D, E, F, G, A, B, C —
          or 12 chromatic semitones once every white and black key in between is counted. Two
          pitches an octave apart always share the same letter name and sound like "the same
          note," differing only in register — how high or low that shared identity sits.`,
            ),
            keyboard(
              {
                low: 60,
                high: 72,
                highlight: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
                showLabels: 'c',
                caption: 'One full octave: 8 white-key letter names, C to C — 12 semitones total.',
              },
            ),
          ],
          mcq(
            'According to the text, how many white-key letter names does a geometric octave span?',
            ['5', '7', '8', '12'],
            2,
            'The step text states that geometrically an octave spans 8 white-key letter names — C, D, E, F, G, A, B, C.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'What an octave actually is — as a frequency ratio and as a span on the keybed.',
      },
    ),
    lesson(
      'piano-l2-2-3',
      'Directionality: Frequency, Register, and Anatomy',
      [
        step(
          'Left is low, right is high',
          [
            prose(
              `The keyboard has a fixed directional polarity that ties physical hand movement to
          pitch. Moving left decreases frequency into a darker, deeper, bass-register sound;
          moving right increases frequency into a brighter, lighter, treble-register sound.`,
            ),
            table(
              ['Direction', 'Pitch frequency', 'Timbre', 'Register', 'Hand', 'Staff notation'],
              [
                [
                  'Left (descending)',
                  'Decreases',
                  'Darker, deeper',
                  'Bass',
                  'Primarily left hand',
                  'Moves downward',
                ],
                [
                  'Right (ascending)',
                  'Increases',
                  'Brighter, lighter',
                  'Treble',
                  'Primarily right hand',
                  'Moves upward',
                ],
              ],
            ),
          ],
          mcq(
            `According to the keyboard's fixed directional polarity, what happens to pitch frequency when you move your hand to the left?`,
            [
              'It increases into a brighter sound',
              'It decreases into a darker, deeper sound',
              'It stays the same regardless of direction',
              'It alternates between bass and treble registers',
            ],
            1,
            'The step text states that moving left decreases frequency into a darker, deeper, bass-register sound.',
          ),
        ),
        step(
          'Anchoring the direction physically',
          [
            prose(
              `This polarity is worth over-learning early: it is the same mapping the staff itself
          uses, so a passage that climbs on the page is a passage your hand moves rightward for,
          and a passage that falls on the page moves your hand leftward.`,
            ),
            callout(
              'tip',
              'Let the staff tell your hand which way to move',
              `When you see notes climbing up the staff, your hand should already be drifting
           right before you consciously think "higher." When notes fall on the staff, drift left.
           Treat the two as one movement, not a read-then-translate step.`,
            ),
            sources(['Learn to read and understand your keyboard.pdf']),
          ],
          mcq(
            'According to the text, when notes are climbing up the staff, what should your hand do before you consciously think "higher"?',
            ['Drift left', 'Drift right', 'Stay in place', 'Move down'],
            1,
            'The step text states that when you see notes climbing up the staff, your hand should already be drifting right before you consciously think "higher."',
          ),
        ),
      ],
      {
        minutes: 5,
        intro: 'Why right always means higher and left always means lower — and how to feel it, not just know it.',
      },
    ),
    lesson(
      'piano-l2-2-4',
      'The Industry Octave Numbering Conflict (C₃ vs. C₄)',
      [
        step(
          'Same note, two names',
          [
            prose(
              `Beginners are frequently confused when a physical controller screen or DAW software
          labels Middle C as C3, while sheet-music theory texts label the same key C4. This is not
          a mistake on either side — it is an industry-wide naming conflict between three
          co-existing numbering conventions.`,
            ),
            table(
              ['System', 'What it calls Middle C (~261.63 Hz)'],
              [
                [
                  'Scientific Pitch Notation (conservatory textbooks)',
                  'C4 — treats C0 ≈16.35 Hz as the lowest octave; the 88-key piano starts at A0, making Middle C the 4th C',
                ],
                [
                  'MIDI Standard (Novation, Ableton Live 12 default)',
                  'C3 — treats MIDI Note 0 as C-1, so MIDI Note 60 is labeled C3',
                ],
                [
                  'MIDI Alternate (Roland, Korg)',
                  'C4 — treats MIDI Note 0 as C-2, so MIDI Note 60 is labeled C4',
                ],
              ],
            ),
            sources(['Piano tones and the keyboard.pdf', `Playing the Launchkey 61's keyboard`]),
          ],
          mcq(
            'According to the table, what does Scientific Pitch Notation label Middle C as?',
            ['C3', 'C4', 'C2', 'C5'],
            1,
            'The table explicitly states that Scientific Pitch Notation (conservatory textbooks) labels Middle C as C4.',
          ),
        ),
        step(
          'Resolving the conflict without touching the octave shift',
          [
            prose(
              `"Middle C" always describes the same physical keybed coordinate — MIDI Note 60,
          approximately 261.63 Hz — no matter which label a given screen happens to print for it.`,
            ),
            callout(
              'key',
              'Pedagogical resolution of the conflict',
              `If your Novation Launchkey MK4 screen reads C3, that reading is 100% correct in the
           MIDI domain — it is describing the identical key a theory book calls C4. Never attempt
           to "fix" the octave shift to force the screen to say C4; doing so moves you a full
           octave away from the correct physical key.`,
            ),
          ],
          mcq(
            'According to the step text, if your Novation Launchkey MK4 screen labels Middle C as C3, what should you do?',
            [
              'Attempt to change the screen label to C4',
              'Never attempt to fix the octave shift',
              'Use the octave shift controls to move up one octave',
              'Ignore the screen and only use theory book labels',
            ],
            1,
            'The step text explicitly states: Never attempt to "fix" the octave shift to force the screen to say C4; doing so moves you a full octave away from the correct physical key.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: `Why your screen and your theory book disagree about Middle C's number — and why neither is wrong.`,
      },
    ),
    lesson(
      'piano-l2-2-5',
      'The Novation Launchkey MK4 61 Default Range',
      [
        step(
          'Five octaves, three numbering systems',
          [
            prose(
              `The physical keybed of the Launchkey MK4 61 spans five complete octaves. At
          power-up, the lowest physical key is C1 (MIDI Note 36), the central C is C3 — Middle C,
          MIDI Note 60 — and the highest physical key is C6 (MIDI Note 96).`,
            ),
            table(
              ['Position', 'Hardware display', 'Acoustic equivalent', 'MIDI note number'],
              [
                ['Lowest physical key', 'C1', 'C2', '36'],
                ['Middle C (center)', 'C3', 'C4', '60'],
                ['Highest physical key', 'C6', 'C7', '96'],
              ],
            ),
            sources([`Playing the Launchkey 61's keyboard`]),
          ],
          mcq(
            'According to the Launchkey MK4 61 step text, what is the MIDI note number and acoustic piano equivalent of its central physical key?',
            [
              'MIDI 36, acoustic C2',
              'MIDI 60, acoustic C4',
              'MIDI 96, acoustic C7',
              'MIDI 60, acoustic C3',
            ],
            1,
            'The step text states that the central C is C3 — Middle C, MIDI Note 60 — and the table confirms Middle C (center) as MIDI note 60 with acoustic equivalent C4.',
          ),
        ),
        step(
          'Seeing the range on the keybed',
          [
            prose(
              `Laid out on a keyboard, the Launchkey's default range looks like this — five octaves
          wide, with Middle C sitting at its center third.`,
            ),
            keyboard(
              {
                low: 36,
                high: 96,
                highlight: ['C3'],
                showLabels: 'c',
                caption: `The Launchkey MK4 61's default range — C1 to C6 on the hardware display, Middle C marked at C3.`,
              },
            ),
          ],
          mcq(
            'According to the step text, what is the default octave range and Middle C label shown on the Launchkey MK4 61 hardware display?',
            [
              'C0 to C5 with Middle C as C2',
              'C1 to C6 with Middle C as C3',
              'C2 to C7 with Middle C as C4',
              'C3 to C8 with Middle C as C5',
            ],
            1,
            `The step text states: "The Launchkey MK4 61's default range — C1 to C6 on the hardware display, Middle C marked at C3."`,
          ),
        ),
      ],
      {
        minutes: 6,
        intro: `Mapping the Launchkey's five-octave default range, hardware label to MIDI note number.`,
      },
    ),
    lesson(
      'piano-l2-2-6',
      'Octave +/- Shifting and the Emergency Reset',
      [
        step(
          'Octave Up and Octave Down',
          [
            prose(
              `The Launchkey MK4 features dedicated Octave Up (+) and Octave Down (-) buttons
          located above the pitch and mod wheels. Each press of Octave Up transposes the entire
          physical keybed up by one octave (+12 semitones); pressing it twice transposes +24
          semitones, and the maximum range is +3 octaves. Octave Down works the same way in
          reverse: -12 semitones per press, down to a maximum of -3 octaves.`,
            ),
          ],
          mcq(
            'How many semitones does each press of the Octave Up button on the Launchkey MK4 transpose the keybed?',
            ['+12 semitones', '+24 semitones', '+3 octaves', '+1 semitone'],
            0,
            'The step text states that each press of Octave Up transposes the entire physical keybed up by one octave (+12 semitones).',
          ),
          [
            { assert: 'interval', from: 'C1', to: 'C3', semitones: 24 },
          ],
        ),
        step(
          'The emergency reset, and what not to do with it',
          [
            prose(
              `Pressing both the Octave Up and Octave Down buttons simultaneously instantly resets
          the keyboard to its factory default range — C1 to C6, with Middle C at C3.`,
            ),
            table(
              ['Anti-pattern', 'Corrective principle'],
              [
                [
                  'Shifting octaves to force the screen to read C4',
                  'Leave the Launchkey at default — C3 on screen IS physical Middle C, MIDI Note 60',
                ],
                [
                  'Losing keyboard center / playing in the wrong register',
                  'Orient using the central brand logo or the dual-button octave reset',
                ],
                [
                  'Inverted directional thinking (confusing physical left/right)',
                  'Always reinforce: right is up/high, left is down/low',
                ],
              ],
            ),
            callout(
              'warning',
              'When in doubt, reset',
              `If you ever lose track of which octave you have shifted into, press both Octave
           buttons simultaneously. This is the fastest way back to a known, correct state — faster
           than counting shifts in your head.`,
            ),
            sources([`Playing the Launchkey 61's keyboard`]),
          ],
          mcq(
            'What happens when you press both the Octave Up and Octave Down buttons at the same time on the Launchkey?',
            [
              'It shifts up one octave',
              'It shifts down one octave',
              'It instantly resets to the factory default range C1–C6 with Middle C at C3',
              'It turns the keyboard off',
            ],
            2,
            'The step text explicitly states that pressing both Octave Up and Octave Down buttons simultaneously instantly resets the keyboard to its factory default range — C1 to C6, with Middle C at C3.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: `Shifting the Launchkey's range with the Octave buttons, and the one reset that always gets you home.`,
      },
    ),
  ],
});
