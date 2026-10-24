/**
 * Section 3.2 — Finger Numbers and the C Five-Finger House
 * Module 3 — First Music
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_03_First_Music/
 * Section_3.2_Finger_Numbers_And_The_C_Five_Finger_House.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - Keyboard positions get real keyboard() blocks, not ASCII art, matching
 *   the course's established rule for anything drawn as a keybed diagram.
 *   Middle C is C4 throughout (MIDI 60), the app's internal convention
 *   established since level02.js's header note on the C3/C4 naming
 *   conflict — "Bass C, two octaves below Middle C" from the source
 *   therefore renders as C2 (MIDI 36).
 * - Both five-finger hand positions taught here (RH C Position, and each of
 *   the two LH setups) are literal pentascales, and "What is a Pentascale.pdf"
 *   is one of this section's own cited sources — so each gets a `pcSet`
 *   assert (root + semitones -> notes), the same assertion pattern 2.1 used
 *   for the C major scale. RH C Position and LH Setup A share the identical
 *   assertion since they're the same five pitch classes; LH Setup B (Middle
 *   C Shared/Mirrored Position, F–G–A–B–C) gets its own.
 * - Per the plan's mapping rule, §5's two Structured Practice Protocols
 *   become the module's exercises[] (explicit ids, not duplicated into
 *   lesson steps), §4's Methodological Traps become a callout() in the
 *   closing step of lesson 3.2.6 (the lesson governing hand shape, which is
 *   what all three traps are actually about), and §6's Self-Assessment
 *   checklist replaces the scaffold's generic checkpoints[] below.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified — 12 of 12
 *   passed on the first attempt (mcq, text, and order kinds).
 */
import { module_, lesson, step, prose, table, callout, keyboard, sources, mcq, text, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l3-2-1',
      'The Role of Finger Numbers: Movement Economy',
      [
        step(
          'The Index-Only Trap',
          [
            prose(
              '<p>Finger numbers are not arbitrary decorative suggestions printed on sheet music — they are engineered motor choreography. Untrained beginners instinctively play melodies using only their index finger (Digit 2). This creates disjointed, jagged physical leaps, destroys legato phrasing, and caps playing velocity.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'According to the text, what problem does using only the index finger create when playing melodies?',
            [
              'It makes the music too loud',
              'It creates disjointed, jagged physical leaps and destroys legato',
              'It helps increase playing velocity',
              'It makes finger numbers decorative',
            ],
            1,
            'The step text states that untrained beginners instinctively play melodies using only their index finger (Digit 2), which creates disjointed, jagged physical leaps, destroys legato phrasing, and caps playing velocity.',
          ),
        ),
        step(
          'Movement Economy',
          [
            prose(
              '<p>Assigning one digit per consecutive key allows the hand to play five distinct pitches with zero lateral hand displacement. Every transition is smooth, connected, and physically effortless — this is the entire point of a five-finger position.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'According to the text, what allows the hand to play five distinct pitches with zero lateral hand displacement?',
            [
              'Keeping all unplayed fingers resting quietly on their keys',
              'Assigning one digit per consecutive key',
              'Verbalizing finger numbers while ascending and descending',
              'Placing the thumb only on white keys',
            ],
            1,
            'The step text explicitly states that assigning one digit per consecutive key allows the hand to play five distinct pitches with zero lateral hand displacement.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l3-2-2',
      'Right-Hand C Position Architecture',
      [
        step(
          'The C House, Digit by Digit',
          [
            prose(
              '<p>In the Right Hand (RH) C Position, the hand forms a relaxed dome resting over the five white keys starting at Middle C.</p>',
            ),
            table(
              ['Key', 'Pitch Class', 'Assigned RH Digit'],
              [
                ['1', 'C (Middle C)', 'Finger 1 (Thumb) — resting on outer side-tip'],
                ['2', 'D', 'Finger 2 (Index) — resting on fleshy pad'],
                ['3', 'E', 'Finger 3 (Middle) — apex of the hand dome'],
                ['4', 'F', 'Finger 4 (Ring) — naturally constrained'],
                ['5', 'G', 'Finger 5 (Pinky) — light, upright pillar'],
              ],
            ),
            keyboard(
              {
                low: 60,
                high: 67,
                highlight: ['C4', 'D4', 'E4', 'F4', 'G4'],
                showLabels: 'all',
                caption: 'RH C Position — Middle C through G, fingers 1 through 5.',
              },
            ),
            sources(['Fingerings.pdf', 'What is a Pentascale.pdf']),
          ],
          mcq(
            'In the Right Hand C Position, which finger rests on the apex of the hand dome?',
            ['Finger 1 (Thumb)', 'Finger 2 (Index)', 'Finger 3 (Middle)', 'Finger 5 (Pinky)'],
            2,
            'The step text states that Finger 3 (Middle) on E is at the apex of the hand dome.',
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
          'The Physical Check',
          [
            prose(
              '<p>The wrist is neutral and level; the knuckles form a gentle curve; all five fingertips make light physical contact with the keytops simultaneously — before any finger presses down.</p>',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          text(
            'Before any finger presses down, what must all five fingertips do with the keytops?',
            [
              'make light physical contact simultaneously',
              'make light physical contact',
              'light physical contact simultaneously',
              'light contact simultaneously',
            ],
            'The step text explicitly states that all five fingertips make light physical contact with the keytops simultaneously — before any finger presses down.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l3-2-3',
      'Left-Hand Setups: Low C Position vs. Middle C Shared Position',
      [
        step(
          'Setup A — Low C Position',
          [
            prose(
              '<p>Beginner methods use two distinct Left Hand (LH) starting configurations. In Low C Position, the LH pinky (5) sits on Bass C, two octaves below Middle C:</p>',
            ),
            table(
              ['Finger', '5', '4', '3', '2', '1'],
              [
                ['Pitch', 'C', 'D', 'E', 'F', 'G'],
              ],
            ),
            keyboard(
              {
                low: 36,
                high: 43,
                highlight: ['C2', 'D2', 'E2', 'F2', 'G2'],
                showLabels: 'all',
                caption: 'LH Low C Position — Bass C through G, fingers 5 through 1.',
              },
            ),
            prose(
              '<p>The advantage of Setup A: both hands play identical pitches (C–D–E–F–G) in parallel motion. This course establishes Setup A as its primary two-hand foundation, to enforce parallel melodic thinking.</p>',
            ),
            sources(['Fingerings.pdf', 'What is a Pentascale.pdf']),
          ],
          mcq(
            'In the LH Low C Position taught as Setup A, which finger plays G?',
            ['1', '2', '3', '4', '5'],
            0,
            'The step text shows the LH Low C Position table with finger 1 on pitch G.',
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
          'Setup B — Middle C Shared / Mirrored Position',
          [
            prose(
              '<p>The alternative, a preparatory-method setup, puts the LH thumb (1) on Middle C (or the B immediately below it):</p>',
            ),
            table(
              ['Finger', '5', '4', '3', '2', '1'],
              [
                ['Pitch', 'F', 'G', 'A', 'B', 'C'],
              ],
            ),
            keyboard(
              {
                low: 53,
                high: 60,
                highlight: ['F3', 'G3', 'A3', 'B3', 'C4'],
                showLabels: 'all',
                caption: 'LH Middle C Shared Position — F through Middle C, fingers 5 through 1.',
              },
            ),
            prose('<p>The advantage of Setup B: it keeps both hands clustered in the center of the keybed.</p>'),
            sources(['Fingerings.pdf', 'What is a Pentascale.pdf']),
          ],
          mcq(
            'In the preparatory-method setup for the left hand, which finger is placed on Middle C?',
            ['Finger 5', 'Finger 3', 'Finger 1', 'Finger 2'],
            2,
            'The step text states that the preparatory-method setup puts the LH thumb (1) on Middle C (or the B immediately below it).',
          ),
          [
            {
              assert: 'pcSet',
              root: 'F',
              semitones: [0, 2, 4, 6, 7],
              notes: ['F', 'G', 'A', 'B', 'C'],
            },
          ],
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l3-2-4',
      'Inactive Digit Control ("Sleeping Fingers")',
      [
        step(
          'The Tension Symptom',
          [
            prose(
              '<p>When depressing a single key in the five-finger house, the most difficult technical challenge is controlling the remaining four digits. When Finger 1 plays, Fingers 4 and 5 stiffen and fly upward into the air. When Finger 3 plays, Finger 2 curls inward into the palm.</p>',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the text, what happens to Fingers 4 and 5 when Finger 1 plays a key in the five-finger house?',
            [
              'They curl inward into the palm',
              'They stiffen and fly upward into the air',
              'They rest quietly on their keys',
              'They press down with the thumb',
            ],
            1,
            'The step text explicitly states that when Finger 1 plays, Fingers 4 and 5 stiffen and fly upward into the air.',
          ),
        ),
        step(
          'The Biomechanical Fix',
          [
            prose(
              '<p>Inactive digits must "sleep" on the keys — they remain in passive contact with the key surfaces without depressing them. Keep the metacarpophalangeal (knuckle) joints relaxed: key depression is a transfer of gravitational arm mass, not a violent individual finger strike.</p>',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the text, how should inactive digits be positioned on the keys?',
            [
              'They must be lifted high above the keys',
              'They must remain in passive contact without depressing the keys',
              'They must actively press down on the keys',
              'They must strike the keys individually with force',
            ],
            1,
            'The step text explicitly states that inactive digits must "sleep" on the keys — they remain in passive contact with the key surfaces without depressing them.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-2-5',
      'Up and Down the C House: Numbers and Letters',
      [
        step(
          'Ascending the C House',
          [
            prose('<p>Ascending in RH C Position, finger 1 through finger 5 plays C through G in sequence:</p>'),
            table(
              ['Finger', '1', '2', '3', '4', '5'],
              [
                ['Pitch', 'C', 'D', 'E', 'F', 'G'],
                ['Syllable', 'One', 'Two', 'Three', 'Four', 'Five'],
              ],
            ),
            keyboard(
              {
                low: 60,
                high: 67,
                highlight: ['C4', 'D4', 'E4', 'F4', 'G4'],
                showLabels: 'all',
                caption: 'Ascending: C–D–E–F–G, fingers 1–2–3–4–5.',
              },
            ),
            sources(['Learning  Playing Piano Notes for Beginners.pdf']),
          ],
          mcq(
            'According to the step, which finger plays G when ascending in Right Hand C Position?',
            ['Finger 3', 'Finger 4', 'Finger 5', 'Finger 1'],
            2,
            'The step text explicitly shows in its table and text that finger 5 plays G when ascending C–D–E–F–G with fingers 1–2–3–4–5.',
          ),
        ),
        step(
          'Descending the C House',
          [
            prose('<p>Descending, finger 5 through finger 1 plays G back down to C:</p>'),
            table(
              ['Finger', '5', '4', '3', '2', '1'],
              [
                ['Pitch', 'G', 'F', 'E', 'D', 'C'],
                ['Syllable', 'Five', 'Four', 'Three', 'Two', 'One'],
              ],
            ),
            callout(
              'tip',
              'Execution Protocol',
              '<p>Play at 60 BPM, one note per beat. Say the finger number aloud on Take 1; say the letter name aloud on Take 2.</p>',
            ),
            sources(['Learning  Playing Piano Notes for Beginners.pdf']),
          ],
          order(
            'What is the correct sequence of pitches when descending with the right hand from finger 5 to finger 1?',
            ['G', 'F', 'E', 'D', 'C'],
            ['G', 'F', 'E', 'D', 'C'],
            'The step text explicitly lists the descending pitches as G (finger 5), F (4), E (3), D (2), and C (1).',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-2-6',
      'The Thumb-on-Black-Key Ergonomic Rule',
      [
        step(
          'The Law of Levers',
          [
            prose(
              `<p>The thumb (Digit 1) is anatomically shorter than digits 2, 3, and 4, and is hinged directly to the wrist — this anatomy is why it needs its own ergonomic rule that the other four fingers don't.</p>`,
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'Why does the thumb need its own ergonomic rule that the other fingers do not?',
            [
              'It is used more often than the other fingers',
              'It is anatomically shorter than digits 2, 3, and 4 and is hinged directly to the wrist',
              'It is the only finger that plays black keys',
              'It rests on a different key in every five-finger position',
            ],
            1,
            `The step text states that the thumb (Digit 1) is anatomically shorter than digits 2, 3, and 4, and is hinged directly to the wrist — this anatomy is why it needs its own ergonomic rule that the other four fingers don't.`,
          ),
        ),
        step(
          'Why the Thumb Stays on White Keys',
          [
            prose(
              '<p>In five-finger positions, the thumb must never play a black key in standard white-key five-finger positions. Placing a thumb on a black key pushes the entire hand inward toward the fallboard, forcing the long fingers (2, 3, 4) into cramped, curled angles. Keeping the thumb on white keys allows the long fingers to naturally arch and reach both white and black keys without twisting the wrist.</p>',
            ),
            callout(
              'warning',
              'Three common hand-shape traps',
              '<p>Flying pinky — Finger 5 curling up when Finger 1 or 2 plays — is fixed by resting Finger 5 gently on its keytop and practicing tabletop digit taps. Flattening the hand — collapsing the knuckles into a flat palm — is fixed by re-establishing the "lazy hand" dome, keeping the knuckles as the highest point. Playing the thumb on its flat belly is fixed by playing the thumb exclusively on its side corner near the nail.</p>',
            ),
            sources(['Fingerings.pdf', 'Piano hand exercises.pdf']),
          ],
          mcq(
            'Why must the thumb never play a black key in standard white-key five-finger positions?',
            [
              'It makes the wrist twist unnaturally',
              'It pushes the hand inward, forcing fingers 2, 3, and 4 into cramped curled angles',
              'It prevents the hand from forming a lazy dome shape',
              'It causes the pinky to fly up when playing',
            ],
            1,
            'The step text states that placing a thumb on a black key pushes the entire hand inward toward the fallboard, forcing the long fingers (2, 3, 4) into cramped, curled angles.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m3-2-ex-a',
      type: 'Keyboard drill',
      title: 'Protocol 3.2-A — RH C-House Five-Finger Staircase',
      prompt: 'Place RH in C Position (1 on Middle C). Play 1–2–3–4–5–4–3–2–1 at a steady quarter-note pulse, 60 BPM. Verify: are unplayed fingers resting quietly on their keys?',
    },
    {
      id: 'piano-m3-2-ex-b',
      type: 'Keyboard drill',
      title: 'Protocol 3.2-B — LH Low C-House Staircase',
      prompt: 'Place LH in Low C Position (5 on Bass C, 1 on G). Play 5–4–3–2–1–2–3–4–5. Speak finger numbers aloud, ensuring digit 5 initiates the ascent.',
    },
  ],
  checkpoints: [
    'RH position verified: RH digits 1–5 rest naturally on C–D–E–F–G starting at Middle C.',
    'LH position verified: LH digits 5–1 rest on Bass C–D–E–F–G.',
    'Independent key depression: you can play each finger individually without adjacent fingers moving or lifting into the air.',
    'Vocal fluency: you can recite finger numbers and note letters aloud while playing at a steady 60 BPM pulse.',
  ],
  outcomes: [
    'Place the Right Hand in standard C Position (1 on C, 2 on D, 3 on E, 4 on F, 5 on G).',
    'Contrast and execute the two standard pedagogical Left Hand setups: Low C Position (5 on C₂, 4 on D, 3 on E, 2 on F, 1 on G) vs. Middle C Symmetrical Position (1 on C₃/C₄, 2 on B, 3 on A, 4 on G, 5 on F).',
    'Articulate individual digits sequentially while keeping all unplayed fingers resting quietly on their respective key tops ("sleeping fingers").',
    'Ascend and descend the five-note pattern fluently, verbalizing finger numbers, then pitch letter names.',
    'Apply the fundamental ergonomic rule regarding black keys: keep the thumb on white keys in standard five-finger positions.',
  ],
  sources: [
    'Fingerings.pdf',
    'What is a Pentascale.pdf',
    'Piano hand exercises.pdf',
    'Learning  Playing Piano Notes for Beginners.pdf',
  ],
  practiceFocus: ['RH and LH C-position, unused fingers quiet.'],
  id: 'piano-m3-2',
  code: '3.2',
  title: 'Finger Numbers and the C Five-Finger House',
});
