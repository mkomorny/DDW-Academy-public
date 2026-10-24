/**
 * Section 15.1 — The Three Pedals: Physics, Mechanics, and Hardware Jack (CC64)
 * Module 15 — The Pedal
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_15_The_Pedal/
 * Section_15.1_The_Three_Pedals_Physics_And_Hardware.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - §2's three citations match the scaffold's sources exactly. Per-lesson
 *   citation assigned by which source each §2 line actually attributes:
 *   "Difference between a digital piano and a keyboard.pdf" for hardware/
 *   CC64 content, "A perfect guide to learning piano.pdf" for acoustic
 *   resonance and foot ergonomics.
 * - No pitch-spelling claims anywhere in this section (pure mechanics/
 *   hardware/ergonomics), so no `asserts` — matches the shape of prior
 *   "pure execution" steps like 13.3.2.
 * - 15.1.4 closes with §4's two Methodological Traps as a
 *   `callout('warning', …)`, the section's own established pattern.
 * - §6's 4-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, list, sources, mcq, multi } from '../../schema.js';

export default module_({
  id: 'piano-m15-1',
  code: '15.1',
  title: 'The Three Pedals: Physics, Mechanics, and Hardware Jack (CC64)',
  outcomes: [
    'Explain the acoustic action mechanics of the Damper Pedal: lifting all felts simultaneously to enable Sympathetic String Resonance.',
    'Distinguish the function of the Una Corda / Soft Pedal on a Grand Piano (lateral action shift striking fewer strings) vs. an Upright Piano (rail movement reducing hammer travel distance).',
    'Explain the selective memory function of the Sostenuto (Middle) Pedal on a Grand Piano.',
    `Configure electronic sustain hardware: connecting to a 1/4'' TS/TRS jack, switching polarity to fix backwards sustain, and monitoring MIDI CC64 (0–127) in Ableton Live 12.`,
    'Establish ergonomic foot posture: right heel firmly glued to the floor, ball of foot resting on the pedal tip as a lever.',
  ],
  sources: [
    'Difference between a digital piano and a keyboard.pdf',
    'A perfect guide to learning piano.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Name the three pedals; plug in CC64 if that is the instrument.'],
  lessons: [
    lesson(
      'piano-l15-1-1',
      'Acoustic Action Physics: The Damper Engine',
      [
        step(
          'The Damper Pedal and Sympathetic Resonance',
          [
            prose(
              '<p>Inside an acoustic grand or upright piano, every string has a resting felt damper pad that silences vibration the moment a key is released.</p>',
            ),
            list(
              [
                'Individual Key Action: depressing Middle C lifts only the Middle C damper; releasing the key drops the felt back onto the string.',
                'The Damper Pedal (right pedal): depressing it raises a long master rail that lifts every single felt damper off all 230+ strings simultaneously.',
                'Sympathetic Resonance: with dampers lifted, striking a single note (such as low C) causes all acoustically harmonizing overtone strings (G, C, E) to vibrate in sympathetic resonance, creating a vast, oceanic acoustic bloom.',
              ],
              true,
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'What does the damper pedal do inside an acoustic piano?',
            [
              'Lifts only the damper for the key being played',
              'Lifts every felt damper off all strings at once',
              'Drops felt pads onto the strings to create resonance',
              'Moves the hammers closer to the strings',
            ],
            1,
            'The step text states that depressing the Damper Pedal (right pedal) raises a long master rail that lifts every single felt damper off all 230+ strings simultaneously.',
          ),
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l15-1-2',
      'The Soft Pedal (Una Corda) and Sostenuto Pedal',
      [
        step(
          'Grand vs. Upright: Soft Pedal and Sostenuto',
          [
            prose(
              '<p>The left and middle pedals do not behave identically on every instrument — their mechanism depends on whether the piano is a grand or an upright.</p>',
            ),
            table(
              ['Pedal', 'On a Grand Piano', 'On an Upright Piano'],
              [
                [
                  'Soft Pedal (left / Una Corda)',
                  'Shifts the entire keyboard action laterally so hammers strike only one or two strings ("una corda" = "one string") instead of three, producing a velvety, muted whisper.',
                  'Moves the hammer rail closer to the strings (half-blow), reducing velocity without changing string alignment.',
                ],
                [
                  'Sostenuto Pedal (middle)',
                  'Holds dampers up ONLY for the specific notes held down at the exact instant the pedal is pressed, leaving all other notes detached — a low bass drone can ring while both hands play crisp staccato figures above.',
                  'Often acts as a "practice / mute rail" that drops a sheet of felt between hammers and strings for quiet late-night practice.',
                ],
              ],
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          multi(
            'According to the table, which statements accurately describe the middle (sostenuto) pedal on each type of piano?',
            [
              'On a grand it holds dampers up only for notes already held when the pedal is pressed',
              'On an upright it usually drops a felt mute rail for quiet practice',
              'On a grand it sustains every note regardless of when it is pressed',
              "On an upright it functions identically to the grand's selective memory",
              'On a grand it allows a low bass drone while hands play staccato above',
            ],
            [0, 1, 4],
            'The step text states that on a grand the sostenuto holds dampers up ONLY for notes held at the instant the pedal is pressed (allowing a bass drone with staccato above), while on an upright it often acts as a practice/mute rail dropping felt between hammers and strings.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l15-1-3',
      'Digital Studio Hardware & MIDI CC64',
      [
        step(
          'The Digital Sustain Hardware & CC64 Matrix',
          [
            prose(
              '<p>In the modern DAW/controller studio (such as a Novation Launchkey MK4 connected to Ableton Live 12), the acoustic damper pedal is replaced by a foot switch and a MIDI data stream.</p>',
            ),
            table(
              ['Component', 'Function'],
              [
                ['1/4" sustain jack', 'Connects a momentary foot pedal via a standard 1/4-inch TS/TRS cable into the "SUSTAIN" input on the rear panel of the controller.'],
                ['Polarity calibration', 'If sound sustains when the foot is OFF the pedal and cuts off when PRESSED, the hardware polarity is inverted — flip the physical polarity switch on the bottom of the pedal, or invert pedal settings in the controller’s settings menu.'],
                ['MIDI CC64, value 0–63', 'Pedal UP — dampers engaged, silence.'],
                ['MIDI CC64, value 64–127', 'Pedal DOWN — dampers lifted, full sustain.'],
              ],
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'According to the step text, what does a MIDI CC64 value in the range 0–63 indicate?',
            [
              'Pedal DOWN — dampers lifted, full sustain',
              'Pedal UP — dampers engaged, silence',
              'Polarity is inverted and must be flipped',
              'The foot switch is not connected to the 1/4" sustain jack',
            ],
            1,
            'The step text explicitly states: MIDI CC64, value 0–63 | Pedal UP — dampers engaged, silence.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l15-1-4',
      'Biomechanical Foot Ergonomics',
      [
        step(
          'Anchored Heel, Ankle-Flexion Lever',
          [
            prose(
              '<p>Poor pedaling posture causes severe shin splints and loud, stomping clatter.</p>',
            ),
            list(
              [
                'The Anchor: the right heel must remain firmly glued to the floor directly in front of the sustain pedal — the heel never lifts into the air.',
                'The Lever: the ball of the right foot rests lightly on the pedal tip; pedaling is executed through ankle flexion, identical to pressing a car accelerator.',
              ],
              false,
            ),
            callout(
              'warning',
              'Pedaling traps',
              '<p><strong>Lifting the entire foot/heel off the floor to stomp on the pedal</strong> — the right heel must remain anchored to the floor at all times. <strong>Inverted polarity causing continuous unwanted sustain</strong> — flip the physical polarity switch on the underside of the foot pedal.</p>',
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the step text, what must the right heel do while pedaling?',
            [
              'Lift slightly with each press',
              'Remain firmly glued to the floor directly in front of the sustain pedal',
              'Rest on the pedal tip',
              'Move side to side',
            ],
            1,
            'The step text states that the right heel must remain firmly glued to the floor directly in front of the sustain pedal and that the heel never lifts into the air.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m15-1-ex-a',
      type: 'Hardware drill',
      title: 'Protocol 15.1-A — Foot Leverage & Polarity Check',
      prompt: 'Connect the sustain pedal to the controller’s 1/4" sustain jack. Arm an acoustic grand piano track in the DAW. Plant the right heel on the floor and press the pedal tip down with the ball of the foot. Verify that pressing down sustains notes and releasing the key silences notes.',
    },
  ],
  checkpoints: [
    'Acoustic Physics: can explain why lifting dampers causes sympathetic overtone resonance across all strings.',
    'Three Pedal Taxonomy: can state the specific acoustic function of Damper, Una Corda, and Sostenuto pedals.',
    'CC64 Literacy: knows that MIDI CC64 controls sustain pedal data in digital DAWs.',
    'Foot Leverage: demonstrates zero heel lift during pedal depression.',
  ],
});
