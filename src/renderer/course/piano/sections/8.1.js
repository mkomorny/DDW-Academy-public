/**
 * Section 8.1 — Tone Production, Warm-Up Craft, and the Hanon Honesty Protocol
 * Module 8 — Touch and Expression
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_08_Touch_And_Expression/
 * Section_8.1_Tone_Warmup_Craft_Hanon_Honesty.md).
 *
 * Zero asserts — tone production and warm-up biomechanics are physical
 * technique facts, outside all three theory-oracle assert kinds (pcSet/
 * interval/keySignature).
 *
 * One hand-fixed check-drafting defect before splicing: piano-l8-1-3's
 * step 2 multi() question was drafted with the correct-answer set
 * wrongly excluding a true option — "reduce the chord span by using a
 * 6th instead of a full octave" is explicitly stated in the step's own
 * callout text ("use a Maj7th or 6th"), but the AI draft only credited
 * the three prose-stated actions and left this true, stated option
 * uncredited. Fixed by adding it to the answer set.
 *
 * Check-drafting provenance: 10/10 questions passed shape + entailment on
 * the first attempt; 1 of the 10 was then hand-corrected for the defect
 * above before splicing.
 */
import { module_, lesson, step, prose, table, callout, sources, mcq, multi, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l8-1-1',
      'Tone Is an Intentional Physical Choice',
      [
        step(
          'The Poke vs. the Weight Drop',
          [
            prose(
              'A piano key is not a simple binary switch — it responds to the kinetic mass and acceleration curve delivered by the player. <b>The Poke</b> is driven by small intrinsic finger muscles and produces a sudden, sharp, percussive click with minimal sustained resonance. <b>The Weight Drop</b> is driven by upper body and forearm mass through a supple wrist, and produces a deep, warm, sustained acoustic bloom.',
            ),
            table(
              ['Technique', 'Driven by', 'Result'],
              [
                [
                  'The Poke',
                  'Small intrinsic finger muscles',
                  'Sudden sharp percussive click, minimal sustained resonance',
                ],
                [
                  'The Weight Drop',
                  'Upper body and forearm mass through a supple wrist',
                  'Deep, warm, sustained acoustic bloom',
                ],
              ],
            ),
            sources(['Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf']),
          ],
          mcq(
            'According to the step text, what drives the Weight Drop technique and what sound does it produce?',
            [
              'Small intrinsic finger muscles producing a sudden sharp percussive click with minimal sustained resonance',
              'Upper body and forearm mass through a supple wrist producing a deep warm sustained acoustic bloom',
              'Small intrinsic finger muscles producing a deep warm sustained acoustic bloom',
              'Upper body and forearm mass through a supple wrist producing a sudden sharp percussive click with minimal sustained resonance',
            ],
            1,
            `The step text's table states that the Weight Drop is driven by upper body and forearm mass through a supple wrist and produces a deep, warm, sustained acoustic bloom.`,
          ),
        ),
        step(
          'Correct vs. Incorrect Mechanics',
          [
            prose(
              'In the incorrect Knuckle Stab, the finger pulls back and strikes the keybed violently like a hammer. In the correct Gravitational Arm Drop, the mass of the entire forearm drops smoothly, the arched finger acts as a firm bridge, and the wrist flexes downward to absorb the initial impact, then rebounds to neutral.',
            ),
            callout(
              'warning',
              'The Knuckle Stab',
              'A high-velocity harsh attack that compresses the carpal tunnel and produces a thin tone. Finger pulls back and strikes the keybed violently, like a hammer.',
            ),
            sources(['Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf']),
          ],
          mcq(
            'In the correct Gravitational Arm Drop, what does the wrist do after absorbing the initial impact?',
            [
              'Stays flexed downward',
              'Rebounds to neutral',
              'Pulls back like a hammer',
              'Compresses the carpal tunnel',
            ],
            1,
            'The step text states that in the correct Gravitational Arm Drop the wrist flexes downward to absorb the initial impact, then rebounds to neutral.',
          ),
        ),
      ],
      {
        intro: 'Tone is a physical choice with an acoustic consequence, not an accident of how hard you happen to press.',
      },
    ),
    lesson(
      'piano-l8-1-2',
      'The 5-Minute Mature Conservatory Warm-Up',
      [
        step(
          'The 3-Phase Warm-Up Timeline',
          [
            table(
              ['Time', 'Component', 'Specific exercise'],
              [
                [
                  '0:00–1:30',
                  'Somatic stretch & extension',
                  'Adele Marcus RH Dim7 finger lifts & LH thumb circles (adapted)',
                ],
                [
                  '1:30–3:30',
                  'Technical endurance & flow',
                  'Hanon No. 1 (D/C) or No. 2 (F) with continuous wrist drops',
                ],
                [
                  '3:30–5:00',
                  'Bilateral coordination',
                  'Jazer Lee contrary / syncopated C-Major coordination études',
                ],
              ],
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          order(
            'What is the correct chronological order of the three components in the 5-minute pre-repertoire warm-up sequence?',
            ['Somatic stretch & extension', 'Technical endurance & flow', 'Bilateral coordination'],
            ['Somatic stretch & extension', 'Technical endurance & flow', 'Bilateral coordination'],
            'The step text presents the warm-up in a timed table that explicitly sequences Somatic stretch & extension first (0:00–1:30), followed by Technical endurance & flow (1:30–3:30), then Bilateral coordination (3:30–5:00).',
          ),
        ),
        step(
          'Whose Method This Is',
          [
            prose(
              'This warm-up routine draws on the published work of <i>Pianist Magazine</i>, Adele Marcus, and Graham Fitch, and it directly addresses the historic pedagogical debate around Hanon Exercises No. 1 and No. 2 by enforcing forearm rotation and loose-wrist biomechanics to prevent overuse injury.',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          mcq(
            'What does the warm-up routine enforce to prevent overuse injury in Hanon Exercises No. 1 and No. 2?',
            [
              'Isolated finger strain',
              'Forearm rotation and loose-wrist biomechanics',
              'Localized knuckle force',
              'Gravitational arm weight only',
            ],
            1,
            'The step text states that the routine directly addresses the debate around Hanon Exercises No. 1 and No. 2 by enforcing forearm rotation and loose-wrist biomechanics to prevent overuse injury.',
          ),
        ),
      ],
      {
        intro: 'A structured 5-minute sequence that replaces random noodling before repertoire practice.',
      },
    ),
    lesson(
      'piano-l8-1-3',
      'Adele Marcus Chord Extension Exercises',
      [
        step(
          'RH Diminished 7th Digit Lifts',
          [
            prose(
              'Position the right hand with 1 on C, 2 on E♭, 3 on G♭, 4 on A, 5 on C. Hold all keys gently in the keybed. Slowly lift Finger 2 upward about 1 cm, feel the stretch through the knuckle and wrist for 3 seconds, then drop back. Repeat sequentially with Fingers 3, 4, 5, and 1. Advanced: lift non-adjacent pairs (e.g., Fingers 2 and 4 together).',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          order(
            'In what order should you perform the finger lifts in the basic version of this right-hand diminished 7th warm-up?',
            ['Finger 2', 'Finger 3', 'Finger 4', 'Finger 5', 'Finger 1'],
            ['Finger 2', 'Finger 3', 'Finger 4', 'Finger 5', 'Finger 1'],
            'The step text states to slowly lift Finger 2, then repeat sequentially with Fingers 3, 4, 5, and 1.',
          ),
        ),
        step(
          'LH Octave/Maj7 Thumb Work and Finger Walks',
          [
            prose(
              'Spread the left hand over a C Major octave: 5 on C, 4 on E, 3 on G, 2 on C. The small-hand adaptation moves Finger 2 to B (forming a Maj7th instead of the full octave) to prevent hyperextension. First, let the thumb dangle off the keybed edge and rotate it in slow circles. Then, keeping the other digits anchored, lift Finger 3 on G and play G♯–G–F♯–G; repeat with the remaining fingers.',
            ),
            callout(
              'warning',
              'Reduce the Stretch on Small Hands',
              'Forcing large octave stretches on small hands risks strain. Reduce the chord span by a whole tone (use a Maj7th or 6th) instead of a full octave.',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          multi(
            'According to the instructions for small hands in the left-hand C Major octave exercise, which adaptations or actions are recommended?',
            [
              'Move Finger 2 to B to form a Maj7th instead of a full octave',
              'Lift Finger 3 on G and play G♯–G–F♯–G while keeping other digits anchored',
              'Let the thumb dangle off the keybed edge and rotate it in slow circles',
              'Force a full octave stretch to build strength',
              'Reduce the chord span by using a 6th instead of a full octave',
            ],
            [0, 1, 2, 4],
            `The step text explicitly states spreading the left hand over a C Major octave with finger positions, the small-hand adaptation of moving Finger 2 to B for a Maj7th, dangling the thumb for circles, lifting Finger 3 (then remaining fingers) to play G♯–G–F♯–G, and the callout's instruction to reduce the chord span by a whole tone using a Maj7th or 6th.`,
          ),
        ),
      ],
      {
        intro: `Adele Marcus's two-part extension drill, with the small-hand adaptation built in rather than treated as optional.`,
      },
    ),
    lesson(
      'piano-l8-1-4',
      'Hanon Exercise No. 1: What It Trains and How It Injures',
      [
        step(
          'The Pattern and the Injury Mechanism',
          [
            prose(
              `Hanon's Exercise No. 1 (The Virtuoso Pianist) is celebrated for developing digit independence, but is notorious for causing tendonitis when practiced incorrectly. In C Major, the hands skip Finger 1 to 3 (C to E), then step up F-G-A-G-F-E; the next measure starts one step higher, on D. Playing this pattern with stiff, rigid wrists and aggressive finger-poking creates massive friction in the carpal tunnel.`,
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            `According to the text, what specific pattern does Hanon's Exercise No. 1 follow in C Major after the initial skip?`,
            [
              'Finger 1 to 3 (C to E), then step up F-G-A-G-F-E',
              'Skip from C to G then descend stepwise',
              'Play only white keys in a repeating C major scale',
              'Alternate between Finger 1 and 5 throughout',
            ],
            0,
            'The step text explicitly states that in C Major the hands skip Finger 1 to 3 (C to E), then step up F-G-A-G-F-E.',
          ),
        ),
        step(
          'The Mandatory Wrist-Drop Protocol',
          [
            prose(
              `Graham Fitch's protocol: on each ascending 8-note group, gradually lower the wrist as you reach the highest note (the phrase apex), dropping arm weight. On the descent, smoothly rebound the wrist upward.`,
            ),
            callout(
              'warning',
              'If Tension Appears, Stop Immediately',
              'Hanon No. 1 is a 2-minute warm-up, never a strength-lifting marathon. If tension appears at any point, stop immediately.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            `According to Graham Fitch's protocol for Hanon No. 1, what should you do on each ascending 8-note group?`,
            [
              'Keep the wrist level and use finger strength only',
              'Gradually lower the wrist as you reach the highest note and drop arm weight',
              'Raise the wrist higher on each note',
              'Play with a fixed low wrist position',
            ],
            1,
            'The step text states that on each ascending 8-note group, gradually lower the wrist as you reach the highest note (the phrase apex), dropping arm weight.',
          ),
        ),
      ],
      {
        intro: 'The most famous — and most injury-prone — beginner exercise, made safe by one mandatory wrist motion.',
      },
    ),
    lesson(
      'piano-l8-1-5',
      'Hanon Exercise No. 2: Forearm Rotary Mechanics',
      [
        step(
          'The Rotary Law',
          [
            prose(
              'Hanon No. 2 (in F or C) targets the 3rd, 4th, and 5th digits. Instead of forcing Fingers 4 and 5 to lift through pure tendon effort, rotate the entire forearm from the elbow — similar to turning a doorknob.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the text, how should you avoid forcing fingers 4 and 5 to lift in Hanon No. 2?',
            [
              'Lift them using pure tendon effort',
              'Rotate the entire forearm from the elbow',
              'Use isolated finger strain',
              'Keep the wrist rigid',
            ],
            1,
            'The step text states that instead of forcing Fingers 4 and 5 to lift through pure tendon effort, rotate the entire forearm from the elbow — similar to turning a doorknob.',
          ),
        ),
        step(
          'The Self-Check Drill',
          [
            prose(
              'Place your free hand lightly underneath your active forearm. Feel the forearm bone (radius/ulna) rotating smoothly from side to side to place weight directly behind each finger.',
            ),
            callout(
              'tip',
              'Wrists Stay Loose Like a Trampoline',
              'Locking the wrist during fast runs is a common anti-pattern. Wrists must remain loose and float, like a trampoline, at all times.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the instructions, what should you feel when placing your free hand underneath your active forearm?',
            [
              'The fingers moving independently',
              'The forearm bone rotating smoothly from side to side',
              'The wrist locking into place',
              'The trampoline-like bounce in the fingers',
            ],
            1,
            'The step text explicitly states to feel the forearm bone (radius/ulna) rotating smoothly from side to side to place weight directly behind each finger.',
          ),
        ),
      ],
      {
        intro: 'Trading isolated finger strain for a whole-forearm rotation, verified with a simple self-check.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m8-1-ex-a',
      type: 'Warm-up routine',
      title: 'Protocol 8.1-A — Safe 5-Minute Warm-Up Routine',
      prompt: 'Adele Marcus RH stretch (Dim7 finger lifts) ×1 minute. Adele Marcus LH stretch (thumb circles and finger walks) ×1 minute. Hanon No. 1 (D/C), 4 measures ascending and descending with wrist-drops, ×2 minutes. Jazer Lee contrary C pentascale at 80 BPM ×1 minute.',
    },
  ],
  checkpoints: [
    'Tone Contrast: can demonstrate the audible difference between a tense finger-poke and a relaxed arm-weight drop on Middle C.',
    'Marcus Extension Mastery: can execute the RH Dim7 digit lifts without pain or strain.',
    'Hanon Wrist Drop: can play Hanon No. 1 while visibly dropping and rebounding the wrist across phrase boundaries.',
    'Forearm Rotation: can execute Hanon No. 2 using forearm rotation rather than knuckle forcing.',
  ],
  outcomes: [
    'Produce two distinct timbral qualities on the identical key: Percussive Poking (Localized Knuckle Force) vs. Resonant Singing Tone (Gravitational Arm Weight & Supple Wrist).',
    'Structure and execute a mature 5-minute pre-repertoire warm-up sequence.',
    'Execute the Adele Marcus Chord Extension Warm-Ups (RH Diminished 7th digit lifts; LH Octave/Maj7 thumb circles and finger walks) with appropriate small-hand adaptations.',
    'Execute Hanon Exercise No. 1 (in D / C) applying the mandatory Wrist-Drop at Phrase Apex to release accumulated tension.',
    'Execute Hanon Exercise No. 2 (in F) utilizing Forearm Rotary Mechanics rather than isolated finger strain.',
  ],
  sources: [
    '5 effective warm-up exercises.pdf',
    'Piano hand exercises.pdf',
    'Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf',
    'Tips on how to practice piano.pdf',
  ],
  practiceFocus: ['The kept warm-up, including Hanon 1 only with the safety warning.'],
  id: 'piano-m8-1',
  code: '8.1',
  title: 'Tone Production, Warm-Up Craft, and the Hanon Honesty Protocol',
});
