/**
 * Section 1.3 — Practice as a Skill, Warm-Ups You Will Keep
 * Module 1 — The Player
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_01_The_Player/Section_1.3_Practice_As_A_Skill_Warmups.md
 *
 * The section's opening "4-Phase Beginner Practice Session" ASCII overview
 * (before Lesson 1.3.1) restates the same content as Lesson 1.3.3's own
 * detailed timing table, so it is folded once into Lesson 1.3.3 as a
 * diagram({layout:'chain'}) (the phase sequence) plus that lesson's table
 * (the minute-by-minute detail), rather than being duplicated as a third
 * standalone block. Section 5's "Digit Pattern Isolation" box becomes a
 * table() in Lesson 1.3.4. Section 5's "Five Published Warm-Ups" box becomes
 * a table() in Lesson 1.3.5, with the Hanon 1 wrist-safety warning split out
 * into its own callout in that lesson's second step, since it is a distinct
 * safety instruction rather than descriptive content. Section 4's four
 * Methodological Traps are distributed one per lesson, each folded into the
 * lesson whose subject it corrects: "practicing through mistakes at speed"
 * -> 1.3.2 (slow motor encoding), "practicing only what already sounds
 * good" -> 1.3.3 (the 4-phase architecture's Phase 2), "skipping the
 * warm-up" -> 1.3.4 (the away-from-piano drills), "practicing through pain"
 * -> 1.3.7 (building the daily schedule, which is also where Gate A's "no
 * physical pain" checkpoint lives). Section 5's single Structured Practice
 * Protocol (1.3-A) becomes this module's sole exercises[] entry. Section 6's
 * five-item Gate A Assessment Audit replaces the scaffold's one generic
 * checkpoint placeholder.
 *
 * LaTeX in the source (\text{}, \implies, \flat, \to) is hand-converted to
 * plain prose or the app's existing Unicode conventions (♭, →) rather than
 * shipped literally — matching tools/convert/delatex.mjs's own symbol table
 * even though this section was hand-converted, not run through that script.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 14 of 14 passed on the first attempt, 0 needed a retry,
 * 0 were rejected. Per the plan, prose itself is never model-written — only
 * the graded checks are. This section has no play()/ear() content (no MIDI
 * cues in the source), so no eitherMode() steps were needed. This is the
 * last section of Module 1 — Level 1 can now be wired into piano/index.js.
 */
import {
  module_, lesson, step, prose, list, table, callout, diagram, sources,
  mcq, multi, order, text,
} from '../../schema.js';

export default module_({
  id: 'piano-m1-3',
  code: '1.3',
  title: 'Practice as a Skill, Warm-Ups You Will Keep',
  outcomes: [
    'Apply the empirical law of deliberate practice: focused cognitive quality supersedes unguided mechanical duration.',
    'Implement hyper-slow practice protocols to encode exact neurological motor maps before increasing tempo.',
    'Structure daily sessions using the standard pedagogical 4-phase framework: Warm-Up → Technical/Difficult Acquisition → Repertoire/Musical Application → Deliberate Stop.',
    'Execute away-from-piano neuromuscular drills to isolate digit independence without acoustic fatigue.',
    'Survey the five published conservatory warm-up exercises, identifying which routines are immediate and which require deferred study (e.g., Hanon injury precautions).',
    'Implement weekly objective audio self-recording analysis to evaluate pulse stability, pitch fidelity, and physical ease.',
    'Complete and execute the Gate A Assessment Template.',
  ],
  sources: [
    'Tips on how to practice piano.pdf',
    '5 effective warm-up exercises.pdf',
    'Piano hand exercises.pdf',
    'A perfect guide to learning piano.pdf',
    'The Hoffman Method of Learning Piano.pdf',
  ],
  practiceFocus: ['Run the 4-phase session for three days and record one take (Gate A).'],
  checkpoints: [
    'Instrument verified: your instrument (Launchkey hosted in Live/SINE, or a digital/acoustic piano) is configured and ready with functional velocity response.',
    'Ergonomic seating verified: bench height set so forearms are level with key tops; sitting on the anterior half of the bench; feet flat on the floor; shoulders dropped.',
    'Relaxed hand dome verified: hand maintains the natural curved "lazy hand" architecture without collapsed joints or rigid inactive fingers.',
    'Written template complete: a 20–30 minute daily practice template is filled out with defined time, warm-up, and acquisition blocks.',
    'Three consecutive practice days logged: you have completed your structured session on three separate days without physical pain or discomfort.',
  ],
  exercises: [
    {
      id: 'piano-m1-3-ex-a',
      type: '3-day structured practice run',
      title: 'Protocol 1.3-A — The 3-Day Gate A Practice Run',
      prompt: 'Day 1: Execute Phase 1 (Warm-Up) and Phase 2 (Tabletop & Arm-Drops) according to your written schedule; verify seating height and relaxed hand curve. Day 2: Repeat the full 20-minute protocol; execute 10 slow arm-drops on Middle C with each hand; record 1 minute on a smartphone and listen for tone roundness. Day 3: Repeat the full 20-minute protocol; audit shoulder and wrist relaxation during Phase 3; complete the Gate A checklist.',
    },
  ],
  lessons: [
    lesson(
      'piano-l1-3-1',
      'The Laws of Practice: Quality Over Duration',
      [
        step(
          'Understand myelination and the autopilot fallacy',
          [
            prose(
              'Practice is the biological process of myelination — insulating neural pathways in the brain to make specific motor patterns rapid and automatic.',
            ),
            callout(
              'warning',
              'The Autopilot Fallacy',
              'Playing through a piece from beginning to end on "autopilot" while letting the mind wander reinforces random technical errors and muscular tension. Five minutes of hyper-focused, conscious practice yields greater neurological retention than 30 minutes of distracted repetition.',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the text, what does the autopilot fallacy describe?',
            [
              'Letting the mind wander during focused slow practice',
              'Playing through a piece from beginning to end on autopilot while the mind wanders',
              'Spending five minutes on hyper-focused conscious practice',
              'Insulating neural pathways to make motor patterns automatic',
            ],
            1,
            'The step text explicitly states that the Autopilot Fallacy is playing through a piece from beginning to end on autopilot while letting the mind wander, which reinforces random technical errors and muscular tension.',
          ),
        ),
        step(
          'Practice often, at a consistent time and place',
          [
            list(
              [
                'Daily 20- to 30-minute sessions are vastly superior to a single 2.5-hour weekend session.',
                'The brain requires sleep cycles to consolidate motor memory and synaptic reorganization.',
                'A dedicated time of day and a clutter-free practice space minimizes cognitive resistance and creates reliable physical conditioning.',
              ],
            ),
          ],
          mcq(
            'According to the text, why are daily 20- to 30-minute sessions better than one long weekend session?',
            [
              'They allow more total practice time',
              'They minimize cognitive resistance and create reliable physical conditioning',
              'They let the brain use sleep cycles to consolidate motor memory',
              'They follow the standard 4-phase framework',
            ],
            2,
            'The step text states that the brain requires sleep cycles to consolidate motor memory and synaptic reorganization, making daily short sessions superior to a single long one.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-2',
      'Slow Motor Encoding: The Neurobiology of Accuracy',
      [
        step(
          'Verify three parameters before every key depression',
          [
            prose(
              'The central nervous system cannot distinguish between practicing a correct movement and practicing a mistake: repetition of an error becomes permanent encoding of that error. The hyper-slow practice rule is to practice at a tempo slow enough that the brain can actively verify three parameters before key depression:',
            ),
            list(
              [
                'Exact pitch coordinate — which key?',
                'Correct digit assignment — which finger number?',
                'Relaxed physical state — are shoulders down and wrists supple?',
              ],
              true,
            ),
            callout(
              'warning',
              'Practicing through mistakes at speed',
              'Practicing through mistakes at full tempo, "hoping it works this time," only embeds the incorrect motor memory — slow down immediately the instant an error occurs.',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the hyper-slow practice rule, which three parameters must the brain actively verify before key depression?',
            [
              'Exact pitch coordinate, correct digit assignment, relaxed physical state',
              'Exact pitch coordinate, correct rhythm, relaxed physical state',
              'Correct digit assignment, correct rhythm, shoulders down',
              'Exact pitch coordinate, correct rhythm, wrists supple',
            ],
            0,
            'The step text states that the hyper-slow practice rule is to practice at a tempo slow enough that the brain can actively verify three parameters before key depression: Exact pitch coordinate — which key?; Correct digit assignment — which finger number?; Relaxed physical state — are shoulders down and wrists supple?',
          ),
        ),
        step(
          'Isolate errors instead of restarting',
          [
            list(
              [
                'When a mistake occurs, do not restart the entire piece from Measure 1.',
                'Isolate the exact 2-beat or 1-measure micro-segment containing the error.',
                'Execute that micro-segment correctly 5 consecutive times at half-tempo before re-integrating it into the broader phrase.',
              ],
              true,
            ),
          ],
          mcq(
            'When you make a mistake while practicing, what should you do according to the instructions?',
            [
              'Restart the entire piece from Measure 1',
              'Play through the mistake and keep going',
              'Isolate the exact 2-beat or 1-measure micro-segment containing the error',
              'Increase your tempo to get past the difficult part',
            ],
            2,
            'The step text explicitly states: do not restart the entire piece from Measure 1; instead isolate the exact 2-beat or 1-measure micro-segment containing the error.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-3',
      'The 4-Phase Beginner Session Architecture',
      [
        step(
          'See the 4-phase arc',
          [
            prose(
              'Beginner practice sessions should be constrained between 20 and 30 minutes to preserve cognitive clarity and prevent physical fatigue, structured across four sequential phases.',
            ),
            diagram(
              [
                { id: 'warmup', label: 'Phase 1: Warm-Up', sub: 'Physiological, 3–5 min' },
                {
                  id: 'acquisition',
                  label: 'Phase 2: Hard Acquisition',
                  sub: 'Highest cognitive load, 8–10 min',
                },
                {
                  id: 'integration',
                  label: 'Phase 3: Musical Integration',
                  sub: 'Phrase flow and expression, 7–10 min',
                },
                { id: 'stop', label: 'Phase 4: Review & Stop', sub: 'Journal, plan, cease, 2–3 min' },
              ],
              [
                { from: 'warmup', to: 'acquisition' },
                { from: 'acquisition', to: 'integration' },
                { from: 'integration', to: 'stop' },
              ],
              { caption: 'The 4-phase beginner practice session' },
            ),
            callout(
              'warning',
              'Only practicing what already sounds good',
              'Practicing exclusively what already sounds good and is already mastered starves technical growth — devote the first half of practice (Phase 2) to the hardest, unmastered bars.',
            ),
          ],
          order(
            'What is the correct order of the four phases in a beginner practice session?',
            [
              'Warm-Up (Physiological, 3–5 min)',
              'Hard Acquisition (Highest cognitive load, 8–10 min)',
              'Musical Integration (Phrase flow and expression, 7–10 min)',
              'Review & Stop (Journal, plan, cease, 2–3 min)',
            ],
            [
              'Warm-Up (Physiological, 3–5 min)',
              'Hard Acquisition (Highest cognitive load, 8–10 min)',
              'Musical Integration (Phrase flow and expression, 7–10 min)',
              'Review & Stop (Journal, plan, cease, 2–3 min)',
            ],
            'The step text explicitly lists the four sequential phases in this exact order: Phase 1 Warm-Up, Phase 2 Hard Acquisition, Phase 3 Musical Integration, then Phase 4 Review & Stop.',
          ),
        ),
        step(
          'Learn the phase-by-phase timing',
          [
            table(
              ['Time', 'Phase', 'Specific activity'],
              [
                [
                  '00:00–05:00',
                  'Phase 1: Warm-Up',
                  'Gentle physical stretches; tabletop taps; single-note arm-drops on keybed.',
                ],
                [
                  '05:00–15:00',
                  'Phase 2: Hard Acquisition',
                  'New material acquisition; hands-separate reading; isolated difficult transitions.',
                ],
                [
                  '15:00–25:00',
                  'Phase 3: Musical Integration',
                  'Connecting measures into phrases; applying dynamics; review of a familiar tune.',
                ],
                [
                  '25:00–30:00',
                  'Phase 4: Review & Stop',
                  'Log completed drills; write one specific goal for tomorrow; stop cleanly.',
                ],
              ],
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          order(
            'What is the correct sequence of the four phases in the standard pedagogical framework shown in the practice schedule?',
            [
              'Phase 1: Warm-Up',
              'Phase 2: Hard Acquisition',
              'Phase 3: Musical Integration',
              'Phase 4: Review & Stop',
            ],
            [
              'Phase 1: Warm-Up',
              'Phase 2: Hard Acquisition',
              'Phase 3: Musical Integration',
              'Phase 4: Review & Stop',
            ],
            'The step text presents the phases in this exact order with their time blocks and activities: Warm-Up (00:00–05:00), Hard Acquisition (05:00–15:00), Musical Integration (15:00–25:00), and Review & Stop (25:00–30:00).',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-4',
      'Tabletop and Away-from-Piano Neuromuscular Drills',
      [
        step(
          'Isolate digit patterns on a tabletop',
          [
            prose(
              'Neuromuscular coordination can be trained away from the instrument to develop intrinsic finger independence without acoustic distraction. Place both hands flat on a tabletop, then raise them into the curved dome shape resting on the five fingertip pads, and execute rhythmic taps at roughly 60 BPM:',
            ),
            table(
              ['Pattern', 'Digits', 'Tap sequence (4 taps per digit)'],
              [
                ['A', 'Thumb / Index', '1-1-1-1 → 2-2-2-2'],
                ['B', 'Middle / Ring', '3-3-3-3 → 4-4-4-4'],
                ['C', 'Pinky', '5-5-5-5'],
              ],
            ),
            callout(
              'warning',
              'Skipping the warm-up to save time',
              'Cold tendons are prone to strain — always spend the first few minutes on tabletop and arm-drop drills before touching a piece.',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          multi(
            'Which patterns are described for the tabletop neuromuscular coordination drill?',
            [
              'Pattern A for Thumb/Index as 1-1-1-1 then 2-2-2-2',
              'Pattern B for Middle/Ring as 3-3-3-3 then 4-4-4-4',
              'Pattern C for Pinky as 5-5-5-5',
              'Pattern D for alternating all five digits',
            ],
            [0, 1, 2],
            'The step text explicitly lists Pattern A (Thumb/Index: 1-1-1-1 → 2-2-2-2), Pattern B (Middle/Ring: 3-3-3-3 → 4-4-4-4), and Pattern C (Pinky: 5-5-5-5) for the rhythmic taps at roughly 60 BPM.',
          ),
        ),
        step(
          `Respect digit 4's anatomical limits`,
          [
            prose(
              'Digit 4 (the ring finger) shares an anatomical extensor tendon bridge (juncturae tendinum) with digits 3 and 5, giving it naturally limited independent vertical lift compared to the other fingers.',
            ),
            callout(
              'warning',
              'Never force digit 4 to lift high',
              'Forcing digit 4 to lift high causes immediate tendon strain — let it move naturally within its own limited range instead.',
            ),
          ],
          mcq(
            'Why should you avoid forcing digit 4 to lift high during piano practice?',
            [
              'It shares an anatomical extensor tendon bridge with digits 3 and 5',
              'It will improve your overall finger independence faster',
              'It helps build stronger muscles in the ring finger',
              'It allows you to play faster passages immediately',
            ],
            0,
            'The step text states that digit 4 shares an anatomical extensor tendon bridge (juncturae tendinum) with digits 3 and 5, giving it naturally limited independent vertical lift, and that forcing it to lift high causes immediate tendon strain.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-5',
      'The Five Published Warm-Up Exercises: Mechanics and Safety',
      [
        step(
          'Survey the five conservatory warm-ups',
          [
            prose(
              'The library documents five primary conservatory warm-ups (the Pianist Magazine series), each with its own mechanics and its own point of entry into the curriculum:',
            ),
            table(
              ['#', 'Warm-up', 'Curriculum status'],
              [
                [
                  '1',
                  'Adele Marcus Extension, Part 1 (RH): hold a C diminished 7th chord (C–E♭–G♭–A); lift each finger individually for a gentle stretch.',
                  'Introduced in Module 1; assigned in full in Module 8.',
                ],
                [
                  '2',
                  'Adele Marcus Extension, Part 2 (LH): spread the LH over a C major octave with thumb circular rotations and finger walks (small-hand adaptation: narrow the span to a Maj7, C–B, to avoid strain).',
                  'Introduced alongside Part 1.',
                ],
                [
                  '3',
                  'Hanon Exercise No. 1 (in D/C): a pattern skipping finger 1 to 3, stepping up through 5.',
                  'Assigned in Module 8.',
                ],
                [
                  '4',
                  'Hanon Exercise No. 2 (in F): a forearm rotation drill — place the free hand under the forearm to guide the rotary action.',
                  'Assigned in Module 8.',
                ],
                [
                  '5',
                  'Jazer Lee C-Major Coordination Patterns: 10 progressive hands-together coordination studies (Similar → Contrary → Syncopation).',
                  'Introduced in Module 6.',
                ],
              ],
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          multi(
            'Which of the five library warm-ups are assigned in full in Module 8?',
            [
              'Adele Marcus Extension, Part 1 (RH)',
              'Hanon Exercise No. 1 (in D/C)',
              'Hanon Exercise No. 2 (in F)',
              'Jazer Lee C-Major Coordination Patterns',
              'Adele Marcus Extension, Part 2 (LH)',
            ],
            [0, 1, 2],
            'The table in the step text explicitly lists Adele Marcus Extension Part 1, Hanon No. 1, and Hanon No. 2 as assigned in Module 8 while the other two warm-ups have different curriculum statuses.',
          ),
        ),
        step(
          'Respect the Hanon No. 1 safety warning',
          [
            callout(
              'warning',
              'Hanon No. 1 wrist safety',
              'Do not play Hanon Exercise No. 1 with a stiff, locked wrist — drop the wrist at the phrase apex and raise it again on the descent.',
            ),
          ],
          mcq(
            'According to the Hanon No. 1 wrist safety instruction, what should you do at the phrase apex?',
            [
              'Lock the wrist stiffly',
              'Keep the wrist completely still',
              'Drop the wrist',
              'Raise the wrist',
            ],
            2,
            'The step text states: drop the wrist at the phrase apex and raise it again on the descent.',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-6',
      'Self-Recording Analysis: The Objective Ear',
      [
        step(
          'Capture an unbiased recording',
          [
            prose(
              'The human brain cannot accurately evaluate its own performance while actively engaged in motor execution — recording yourself eliminates that subjective cognitive bias. Once per week, record a single unedited audio or video take of your current exercise or repertoire piece on a smartphone or DAW track.',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          text(
            'How often should you record yourself playing an exercise or piece?',
            ['once per week', 'once a week', 'weekly'],
            'The step text explicitly states to record a single unedited take once per week.',
          ),
        ),
        step(
          'Run the diagnostic audit',
          [
            prose('Listen back with the score in hand and audit four things:'),
            list(
              [
                'Pulse Stability — did the tempo rush during easy passages or drag during difficult finger transitions?',
                'Rhythm Fidelity — were note values held for their full duration?',
                'Dynamic Balance — was the melody audible above the accompaniment?',
                'Physical Ease (video) — were shoulders down and wrists supple?',
              ],
            ),
            prose(
              'Then identify exactly one mechanical or rhythmic flaw to target in the following week’s practice blocks.',
            ),
          ],
          multi(
            'According to the step text, which four specific things should you audit when listening back with the score?',
            [
              'Pulse Stability, Rhythm Fidelity, Dynamic Balance, Physical Ease',
              'Pulse Stability, Pitch Accuracy, Dynamic Contrast, Wrist Position',
              'Tempo Consistency, Note Duration, Melody Projection, Shoulder Tension',
              'Rhythm Fidelity, Dynamic Balance, Physical Ease, Finger Independence',
            ],
            [0],
            'The step text explicitly lists these four items to audit: Pulse Stability, Rhythm Fidelity, Dynamic Balance, and Physical Ease (video).',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l1-3-7',
      'Building Your Custom 20–30 Minute Practice Schedule',
      [
        step(
          'Draft your daily template',
          [
            prose(
              'Construct your daily operational template before attempting Module 2, allocating each of the four phases across your chosen total duration:',
            ),
            table(
              ['Phase', 'Duration', 'What to fill in'],
              [
                [
                  'Phase 1: Warm-Up',
                  '3–5 min',
                  'Tabletop finger lifts (digits 1–5): 1 minute; single-key gravitational arm-drops on Middle C: 2 minutes.',
                ],
                [
                  'Phase 2: Hard Technical Acquisition',
                  '8–10 min',
                  'Name your focus exercise; work hands-separate at 50% target tempo with micro-segment error isolation.',
                ],
                [
                  'Phase 3: Musical Integration & Repertoire',
                  '7–10 min',
                  'Name your focus piece; full phrase continuity, dynamic listening, breathing with the line.',
                ],
                [
                  'Phase 4: Objective Review',
                  '2–3 min',
                  `Complete the practice log; state one primary goal for tomorrow's session.`,
                ],
              ],
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the daily operational template, what activity is prescribed for the 2 minutes within the Warm-Up phase?',
            [
              'Tabletop finger lifts (digits 1–5)',
              'Single-key gravitational arm-drops on Middle C',
              'Naming your focus exercise',
              'Completing the practice log',
            ],
            1,
            `The step text explicitly lists under Phase 1: Warm-Up the activity 'single-key gravitational arm-drops on Middle C: 2 minutes' as part of the 3–5 min duration.`,
          ),
        ),
        step(
          'Stop the instant you feel pain',
          [
            callout(
              'warning',
              'Practicing until hands feel sore',
              'Practicing until hands feel sore ("no pain, no gain") is a fallacy at the piano — pain is a physical stop signal, so end the session immediately.',
            ),
          ],
          mcq(
            'According to the step, what should you do if your hands feel sore while practicing piano?',
            [
              `Continue until you feel pain to follow 'no pain, no gain'`,
              'End the session immediately',
              'Switch to a different exercise',
              'Increase the tempo to build endurance',
            ],
            1,
            'The step text states that practicing until hands feel sore is a fallacy and that pain is a physical stop signal, so end the session immediately.',
          ),
        ),
      ],
    ),
  ],
});
