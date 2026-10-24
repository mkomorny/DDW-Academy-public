/**
 * Section 1.2 — Bench, Body, Hands, Relaxation
 * Module 1 — The Player
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_01_The_Player/Section_1.2_Bench_Body_Hands_Relaxation.md
 *
 * ASCII diagrams promoted to real interactive blocks: the "Torso & Shoulder
 * Relaxation Matrix" and "Contact Points" boxes -> table() (Lessons 1.2.2,
 * 1.2.3); the finger-numbering diagram -> table() (Lesson 1.2.4); the
 * "Arm Weight vs. Finger Poking" comparison box -> table() (Lesson 1.2.5);
 * the three-phase "Wrist Trampoline Mechanic" box -> diagram({layout:'chain'})
 * (Lesson 1.2.6), since it is a genuine sequential process the renderer's
 * chain math handles cleanly. The section's opening posture-geometry chain
 * (head -> shoulders -> elbow -> forearm -> wrist -> hand -> keybed) is
 * carried as prose across Lessons 1.2.1-1.2.2 rather than its own diagram()
 * — its content is fully covered, in more actionable form, by those two
 * lessons' own tables, so a third redundant diagram would just restate them.
 * Section 4's Methodological Traps table is folded into the lesson each trap
 * corrects, as callout('warning', …) blocks, per the plan's "traps -> a
 * warning callout in the closing step" rule. Section 5's two Protocols
 * (1.2-A, 1.2-B) become this module's exercises[] entries, below.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 14 of 14 passed on the first attempt, 0 needed a retry,
 * 0 were rejected. Per the plan, prose itself is never model-written — only
 * the graded checks are. This section has no play()/ear() content (no MIDI
 * cues in the source), so no eitherMode() steps were needed.
 */
import {
  module_, lesson, step, prose, list, table, callout, diagram, sources,
  mcq, multi, order, text,
} from '../../schema.js';

export default module_({
  id: 'piano-m1-2',
  code: '1.2',
  title: 'Bench, Body, Hands, Relaxation',
  outcomes: [
    'Position the piano bench at the anatomically correct height and distance, ensuring level forearms, dropped shoulders, and grounded feet.',
    'Establish the "natural curve" hand posture ("lazy hand" / dome structure) without collapsing phalangeal joints or stiffening inactive digits.',
    'Apply standard anatomical finger numbering (1 through 5) bilaterally, identifying thumbs as digit 1.',
    'Execute key depression utilizing pure gravitational arm weight rather than localized muscular forcing from the metacarpophalangeal (knuckle) joints.',
    'Operate the wrist joint as a dynamic shock absorber ("trampoline mechanism") that cushions downstrokes and rebounds fluidly.',
    'Conduct systematic biomechanical tension audits during practice to identify and eradicate muscular co-contraction.',
  ],
  sources: [
    'Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf',
    'A perfect guide to learning piano.pdf',
    'Fingerings.pdf',
    'Piano hand exercises.pdf',
    '5 effective warm-up exercises.pdf',
  ],
  practiceFocus: ['Tabletop curve + one-key arm-drop before any piece.'],
  checkpoints: [
    'Forearm alignment: when sitting at the keys, your forearms are horizontal and parallel to the floor.',
    'Shoulders silent: your shoulder girdle remains fully lowered and relaxed throughout all drills.',
    'Finger curve: all active digits maintain an unbroken, convex arch without collapsed distal joints.',
    'Thumb position: thumbs play on their lateral side corners, never flat across the key.',
    'Quiet inactive digits: when finger 1 or 2 depresses a key, fingers 3, 4, and 5 rest lightly on their keys without lifting into the air.',
    'Supple wrist: key strikes show visible shock-absorbing wrist flexion and elastic rebound.',
  ],
  exercises: [
    {
      id: 'piano-m1-2-ex-a',
      type: 'Away-from-piano drill',
      title: 'Protocol 1.2-A — Tabletop Calibration Drill',
      prompt: 'Sit at a sturdy table with proper spinal posture. Let the right arm drop limp to your side, then lift it by the forearm and place the fingertips on the tabletop in a curved dome, all five resting on the surface. Slowly lift finger 2 about 1 cm without moving fingers 1, 3, 4, or 5, then release it, letting it drop with gravity back onto the table. Repeat systematically for fingers 3, 4, 5, and 1, then repeat the whole sequence with the left hand.',
    },
    {
      id: 'piano-m1-2-ex-b',
      type: 'At-piano drill',
      title: 'Protocol 1.2-B — Single-Key Arm-Drop & Wrist-Rebound',
      prompt: `Place right-hand finger 3 on Middle C and lift the forearm about 5 cm above the keybed with a relaxed, dangling hand. Drop the arm weight into Middle C, catching the descent on finger 3's arched pad; let the wrist drop slightly below keybed level on impact, then rebound smoothly back to neutral. Execute 10 consecutive drops with right-hand finger 3, then 10 with left-hand finger 3 on Bass C.`,
    },
  ],
  lessons: [
    lesson(
      'piano-l1-2-1',
      'Seating Geometry: Height, Distance, Base of Support',
      [
        step(
          'Set bench placement, distance, and height',
          [
            prose(
              'Proper seated geometry establishes the physical levers necessary for dynamic control and physical endurance.',
            ),
            table(
              ['Aspect', 'Correct setup', 'Error signal'],
              [
                [
                  'Placement',
                  'Sit on the anterior (forward) half of the bench, weight resting on the ischial tuberosities ("sitting bones").',
                  'Sitting on the back half curves the lumbar spine and stops the torso leaning into the keys.',
                ],
                [
                  'Distance',
                  `Elbows hang slightly in front of the torso's mid-axillary line; elbow angle is roughly 90° to 105°.`,
                  'Elbows pinned behind the torso means the bench is too close; arms fully extended means it is too far.',
                ],
                [
                  'Height',
                  'The forearm is approximately horizontal (level with the floor) when the hands rest on the key tops.',
                  'Too high: body weight falls onto the fingers and joints collapse. Too low: wrists drop below keybed level.',
                ],
              ],
            ),
            callout(
              'warning',
              'Dropped low wrists',
              'A bench that sits too low lets the wrists hang below keybed level, compressing the tendons in the carpal tunnel against the flexor retinaculum — raise the bench until the forearm is parallel with the keybed.',
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the table, what does sitting on the back half of the bench cause?',
            [
              'Elbows pinned behind the torso',
              'The lumbar spine curves and stops the torso leaning into the keys',
              'The forearm drops below horizontal',
              'Wrists hang below keybed level',
            ],
            1,
            'The step text states in the table that sitting on the back half curves the lumbar spine and stops the torso leaning into the keys.',
          ),
        ),
        step(
          'Ground the feet',
          [
            list(
              [
                'Both feet rest flat on the floor, slightly apart, bearing structural weight.',
                'The right foot sits slightly forward, near the damper pedal, heel anchored to the floor.',
                `A young or petite student needs a firm footstool so dangling legs don't pull the pelvis out of alignment.`,
              ],
            ),
          ],
          mcq(
            'According to the instructions, how should the right foot be positioned relative to the damper pedal?',
            [
              'Directly under the bench',
              'Slightly forward near the damper pedal with heel on the floor',
              'Crossed over the left foot',
              'Lifted off the floor',
            ],
            1,
            'The step text states: "The right foot sits slightly forward, near the damper pedal, heel anchored to the floor."',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-2',
      'Upper Torso Mechanics: Shoulders, Elbows, and "Puppet Arms"',
      [
        step(
          'Keep the shoulder girdle and elbows free',
          [
            table(
              ['Region', 'Requirement'],
              [
                [
                  'Shoulder girdle',
                  'Stays depressed and retracted in a neutral, relaxed position. Trapezius muscles stay silent — raised or hunched shoulders signal cognitive overload or excess mechanical effort.',
                ],
                [
                  'Elbows',
                  'Stay free, flexible, and unpinned from the ribcage — floating outward slightly, like universal joints, so the hands can travel linearly along the keyboard without twisting the wrists.',
                ],
              ],
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the table, what does raised or hunched shoulders signal?',
            [
              'Excess mechanical effort or cognitive overload',
              'The elbows are pinned to the ribcage',
              'The trapezius muscles are active',
              'The hands are traveling linearly',
            ],
            0,
            'The step text explicitly states that raised or hunched shoulders signal cognitive overload or excess mechanical effort while the shoulder girdle should stay depressed and retracted with silent trapezius muscles.',
          ),
        ),
        step(
          'Feel the puppet-string release',
          [
            callout(
              'tip',
              'The puppet-string analogy',
              'Imagine strings holding the forearms suspended. When the strings are "cut," the arms drop with total limpness under gravity onto the thighs.',
            ),
          ],
          mcq(
            'According to the puppet-string analogy, what happens to the arms when the strings are "cut"?',
            [
              'The arms remain suspended in position',
              'The arms drop with total limpness under gravity onto the thighs',
              'The arms actively push down using finger muscles',
              'The arms bounce back up like a trampoline',
            ],
            1,
            'The step text states that when the strings are "cut," the arms drop with total limpness under gravity onto the thighs.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-3',
      'The Natural Hand Curve ("Lazy Hand" Architecture)',
      [
        step(
          'Find the natural curve',
          [
            prose(
              `The piano hand does not adopt an artificial or contorted shape; it keeps the hand's own natural resting curvature.`,
            ),
            list(
              [
                'Stand or sit upright and let the arm hang completely limp at your side.',
                'Observe the hand: the fingers are neither stiffly straightened nor clenched into a fist — they curl inward into a relaxed, semicircular arch.',
                'Without altering that shape, lift the forearm from the elbow and place the fingertip pads on the keyboard surface.',
              ],
              true,
            ),
            prose(
              'The loose-ball analogy: the hand keeps the gentle dome shape it forms when loosely holding a tennis ball or baseball.',
            ),
            callout(
              'warning',
              'Collapsing DIP joints',
              'If a fingertip "dents" backwards instead of holding its arch, re-establish the firm dome by practicing slow tabletop taps on the fleshy pad below the nail.',
            ),
            sources(
              [
                'Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf',
                'Piano hand exercises.pdf',
              ],
            ),
          ],
          mcq(
            'According to the instructions, what should you observe about the fingers when you let the arm hang completely limp at your side?',
            [
              'They are stiffly straightened',
              'They are clenched into a fist',
              'They curl inward into a relaxed, semicircular arch',
              'They form a completely flat line',
            ],
            2,
            'The step text states that when you stand or sit upright and let the arm hang completely limp, the fingers curl inward into a relaxed, semicircular arch.',
          ),
        ),
        step(
          'Place the contact points',
          [
            table(
              ['Digits', 'Contact point'],
              [
                [
                  '2, 3, 4, 5',
                  'Rest on the fleshy pads just below the fingernail tips; the distal interphalangeal (DIP) joint stays firm and uncollapsed, never "dented" or hyperextended.',
                ],
                [
                  '1 (thumb)',
                  'Rests on its outer side-edge corner, near the tip, angled toward the keybed — the thumb never plays flat on its full ventral surface.',
                ],
              ],
            ),
          ],
          mcq(
            'According to the step text, how does the thumb (digit 1) rest on the key?',
            [
              'On its fleshy pad just below the fingernail tip',
              'On its full ventral surface',
              'On its outer side-edge corner near the tip, angled toward the keybed',
              'With the distal interphalangeal joint collapsed',
            ],
            2,
            'The step text explicitly states that the thumb rests on its outer side-edge corner, near the tip, angled toward the keybed and never plays flat on its full ventral surface.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-4',
      'Universal Anatomical Finger Numbering (1–5)',
      [
        step(
          'Number the fingers 1 through 5',
          [
            prose('Piano notation uses one standardized numbering system across both hands:'),
            table(
              ['Number', 'Name'],
              [
                ['1', 'Thumb (Pollex)'],
                ['2', 'Index finger'],
                ['3', 'Middle finger'],
                ['4', 'Ring finger'],
                ['5', 'Little finger (pinky)'],
              ],
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'According to the piano notation numbering system shown, which finger is number 1?',
            ['Index finger', 'Thumb (Pollex)', 'Middle finger', 'Little finger (pinky)'],
            1,
            'The step text explicitly lists number 1 as Thumb (Pollex) in the standardized numbering system used across both hands.',
          ),
        ),
        step(
          'Apply the symmetry principle',
          [
            prose(
              `The numbering is symmetrical relative to the body's midline: thumbs are always 1 and little fingers are always 5, on either hand — a left-hand 3 and a right-hand 3 are both the middle finger.`,
            ),
            callout(
              'key',
              'Movement economy',
              'Good fingering keeps the hand in a stable, compact position, without unnecessary lateral jumps or overusing a single digit.',
            ),
          ],
          mcq(
            'According to the text, which fingers are numbered 1 and which are numbered 5?',
            [
              'Index fingers are 1, ring fingers are 5',
              'Thumbs are 1, little fingers are 5',
              'Middle fingers are 1, index fingers are 5',
              'Little fingers are 1, thumbs are 5',
            ],
            1,
            'The step text explicitly states that thumbs are always 1 and little fingers are always 5 on either hand.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-5',
      'Arm Weight Mechanics: Gravitational Key Depression',
      [
        step(
          'Drive keys with arm weight, not finger force',
          [
            prose(
              'Keys are not depressed through isolated, localized flexion of the individual finger muscles (the intrinsic flexor digitorum muscles). Key depression is driven by gravitational arm weight: Downforce = Mass of Forearm/Arm × Gravitational Acceleration (g).',
            ),
            table(
              ['Approach', 'What happens', 'Result'],
              [
                [
                  'Localized finger poking (incorrect)',
                  'The knuckle locks; individual finger muscles strain to push the key down.',
                  'Harsh, percussive timbre, flying inactive fingers, and rapid muscular exhaustion of the forearm flexors.',
                ],
                [
                  'Controlled arm weight (correct)',
                  'The forearm and hand drop freely into the keybed under gravity; the active finger is a stable, arched pillar transmitting arm mass, while inactive fingers stay completely passive, resting lightly on key tops.',
                  'Warm, resonant acoustic tone and zero localized fatigue.',
                ],
              ],
            ),
            sources(['Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf']),
          ],
          mcq(
            'According to the step text, what drives key depression in the correct approach?',
            [
              'Localized flexion of the intrinsic finger muscles',
              'Isolated muscular forcing from the knuckle joints',
              'Gravitational arm weight',
              'Strain from individual finger muscles',
            ],
            2,
            'The step text explicitly states that keys are not depressed through isolated, localized flexion of the individual finger muscles and that key depression is driven by gravitational arm weight.',
          ),
        ),
        step(
          'Keep inactive fingers passive',
          [
            callout(
              'warning',
              'Flying inactive digits',
              'Digits not currently playing must "sleep" on the key tops — release all muscular holding effort from the extensors, rather than letting them lift into the air.',
            ),
          ],
          text(
            'What must inactive digits do on the key tops according to the text?',
            ['sleep', 'sleep on the key tops'],
            'The step text explicitly states that digits not currently playing must "sleep" on the key tops.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-6',
      'The Wrist as Shock Absorber ("The Trampoline Principle")',
      [
        step(
          'Let the wrist absorb and rebound',
          [
            prose(
              'The wrist joint must never lock at a rigid, fixed angle — it works as a dynamic, shock-absorbing mechanism.',
            ),
            diagram(
              [
                {
                  id: 'prep',
                  label: 'Preparation',
                  sub: 'Wrist rests neutral, level with the forearm and hand',
                },
                {
                  id: 'impact',
                  label: 'Downstroke / Impact',
                  sub: 'Arm weight drops; wrist flexes gently below neutral, absorbing shock',
                },
                {
                  id: 'rebound',
                  label: 'Elastic Rebound',
                  sub: 'Wrist rebounds up through neutral, releasing tension for the next note',
                },
              ],
              [
                { from: 'prep', to: 'impact' },
                { from: 'impact', to: 'rebound' },
              ],
              { caption: 'The wrist-trampoline cycle' },
            ),
            callout(
              'warning',
              'Locked, rigid wrist',
              'Poking at keys with a stiff arm skips the shock-absorbing cycle — incorporate intentional downward wrist-drops on every long note.',
            ),
            sources(['Tips for Keeping Pianist Fingers Relaxed at the Keyboard.pdf']),
          ],
          mcq(
            'What is the correct sequence in the wrist-trampoline cycle?',
            [
              'Preparation (neutral) -> Elastic Rebound -> Downstroke/Impact',
              'Downstroke/Impact -> Preparation (neutral) -> Elastic Rebound',
              'Preparation (neutral) -> Downstroke/Impact (wrist flexes below neutral) -> Elastic Rebound (rebounds up through neutral)',
              'Elastic Rebound -> Preparation (neutral) -> Downstroke/Impact',
            ],
            2,
            'The step text explicitly lists the wrist-trampoline cycle as Preparation (Wrist rests neutral, level with the forearm and hand) -> Downstroke / Impact (Arm weight drops; wrist flexes gently below neutral, absorbing shock) -> Elastic Rebound (Wrist rebounds up through neutral, releasing tension for the next note).',
          ),
        ),
        step(
          'Test suppleness',
          [
            prose(
              'The suppleness criterion: the wrist should stay loose enough that if an instructor gently tapped under the forearm or wrist during play, the arm would bob effortlessly without resistance.',
            ),
          ],
          text(
            'According to the suppleness criterion, what should happen if an instructor gently taps under the forearm or wrist during play?',
            [
              'the arm would bob effortlessly without resistance',
              'arm bobs effortlessly without resistance',
              'arm would bob effortlessly',
              'bobs effortlessly without resistance',
            ],
            'The step text states that the wrist should stay loose enough that if an instructor gently tapped under the forearm or wrist during play, the arm would bob effortlessly without resistance.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-2-7',
      'Systematic Tension Audits: Stop, Shake Out, Reset',
      [
        step(
          'Recognize co-contraction and stop',
          [
            prose(
              'Tension is the primary impediment to technical fluency and physical health. It is caused by co-contraction — the simultaneous activation of opposing agonist and antagonist muscles.',
            ),
            list(
              [
                'Flying or curling inactive fingers (especially 4 and 5).',
                'Hunching the shoulders or holding the breath.',
                'Any sensation of tightness, burning, or aching in the forearm or wrist.',
              ],
            ),
            callout(
              'warning',
              'Immediate action',
              'Stop playing immediately. Never try to "push through" tension.',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          multi(
            'According to the text, which of the following are signs of tension while playing?',
            [
              'Flying or curling inactive fingers (especially 4 and 5)',
              'Hunching the shoulders or holding the breath',
              'Any sensation of tightness, burning, or aching in the forearm or wrist',
              'Positioning the bench at the correct height',
            ],
            [0, 1, 2],
            'The step text explicitly lists flying or curling inactive fingers (especially 4 and 5), hunching the shoulders or holding the breath, and any sensation of tightness, burning, or aching in the forearm or wrist as indicators of tension caused by co-contraction.',
          ),
        ),
        step(
          'Reset before continuing',
          [
            list(
              [
                'Drop both arms completely limp to your sides.',
                'Gently shake out the wrists and fingers for 10 seconds.',
                'Inhale deeply; consciously drop the shoulders.',
                'Re-place the hands on the keys with "lazy hand" curvature at half tempo.',
              ],
              true,
            ),
          ],
          order(
            'What is the correct sequence of actions to release tension before resuming play?',
            [
              'Re-place the hands on the keys with "lazy hand" curvature at half tempo.',
              'Gently shake out the wrists and fingers for 10 seconds.',
              'Inhale deeply; consciously drop the shoulders.',
              'Drop both arms completely limp to your sides.',
            ],
            [
              'Drop both arms completely limp to your sides.',
              'Gently shake out the wrists and fingers for 10 seconds.',
              'Inhale deeply; consciously drop the shoulders.',
              'Re-place the hands on the keys with "lazy hand" curvature at half tempo.',
            ],
            'The step text lists the actions in exactly this order: drop arms limp, shake wrists/fingers, inhale and drop shoulders, then replace hands with lazy hand curvature at half tempo.',
          ),
        ),
      ],
    ),
  ],
});
