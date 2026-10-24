/**
 * Section 1.1 — Your Instrument, This Studio, The Road
 * Module 1 — The Player
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_01_The_Player/Section_1.1_Your_Instrument_This_Studio_The_Road.md
 *
 * ASCII diagrams promoted to real interactive blocks: the register-comparison
 * bracket art -> table() + a live keyboard() anchored to this studio's actual
 * Launchkey MK4 61 range (Lesson 1.1.4); the studio signal-flow box ->
 * diagram({layout:'chain'}) (Lesson 1.1.6). The "Integrated Pianist Model"
 * interdependency box (Lesson 1.1.1) is carried as prose instead of a
 * diagram() — its links are a 4-way loop, not a chain/stack/tree, and the
 * renderer's link-drawing math only handles those three shapes cleanly.
 * Section 4's Methodological Traps table is folded into the lesson whose
 * content it corrects, as callout('warning', …) blocks, per the plan's
 * "traps -> a warning callout in the closing step" rule. Section 5's
 * Protocol 1.1-A becomes this module's one exercises[] entry, below.
 *
 * Every step's `check` was drafted by the AI client (tools/author/
 * draft-step-checks.mjs), grounded ONLY in that step's own prose plus this
 * module's outcomes, and entailment-verified against that same prose before
 * being accepted — 18 of 19 passed on the first attempt, 0 needed a retry,
 * 0 were rejected. The one eitherMode() step (Lesson 1.1.4) had its reader
 * branch drafted the same way, grounded in that step's own table + keyboard
 * caption; its interactive play() branch is a MIDI instruction, not a
 * grounded content claim, so it is hand-authored as usual. Per the plan,
 * prose itself is never model-written — only the graded checks are.
 */
import {
  module_, lesson, step, prose, list, table, callout, keyboard, diagram,
  sources, mcq, multi, order, text, play, eitherMode,
} from '../../schema.js';

export default module_({
  id: 'piano-m1-1',
  code: '1.1',
  title: 'Your Instrument, This Studio, The Road',
  outcomes: [
    'Articulate the precise technical distinctions among acoustic pianos, digital pianos, and MIDI/electronic keyboards across action mechanics, key count, and velocity response.',
    'Identify why velocity sensitivity is non-negotiable for dynamic control and technical transfer.',
    'Define the physical limitations and practical boundaries of 61-key, 76-key, and 88-key instruments.',
    `Name the three traditional piano pedals and contrast them with standard single-jack 1/4'' keyboard sustain inputs.`,
    `Operate within this studio's default environment (Novation Launchkey MK4 61 routing into Ableton Live 12 Standard or SINE / Orchestral Tools Parallel Orchestra), accounting for the lack of onboard sound generation.`,
    'Map long-term skill acquisition across standard pedagogical skill bands (Early Elementary through Advanced).',
    'Formulate a structured three-part objective (Repertoire, Literacy, Theory) for initial practice blocks.',
  ],
  sources: [
    'Difference between a digital piano and a keyboard.pdf',
    'A perfect guide to learning piano.pdf',
    'The Hoffman Method of Learning Piano.pdf',
    'Piano Skill Levels Explained.pdf',
    'Learning Piano with Launchkey',
    `Playing the Launchkey 61's keyboard`,
  ],
  practiceFocus: [
    'Sit at the real instrument daily. Write three goals (repertoire, literacy, theory).',
    'Run the hardware verification protocol below once, at the start, so you know your setup actually works before you need it to.',
  ],
  checkpoints: [
    'Hardware identification: you can say whether your instrument uses mechanical hammer action, semi-weighted springs, or unweighted keys.',
    'Velocity verification: pressing a key slowly produces a quiet dynamic, and pressing it quickly produces a loud one.',
    'Signal chain functional: your studio setup produces sound immediately on key strike, with no audible latency.',
    'Pedal identification: you can locate the sustain jack on your hardware and explain what CC64 damper data does.',
    'Written goals: you have written three specific targets — repertoire, literacy, and technical.',
  ],
  exercises: [
    {
      id: 'piano-m1-1-ex-a',
      type: 'Hardware check',
      title: 'Protocol 1.1-A — Studio Hardware Verification & Signal Test',
      prompt: `Connect the Launchkey MK4 61 to the host computer via USB-C. Launch Ableton Live 12 Standard, open Preferences -> Link/MIDI, and confirm the Launchkey's In/Out ports are recognized with Track and Remote active. Load a Grand Piano (or Electric Piano) instrument onto an armed MIDI track. Plug a standard 1/4" sustain pedal into the rear Sustain jack. Then strike the lowest key (labelled C1 on the Launchkey's own onboard display), Middle C (labelled C3 on that same display), and the highest key (labelled C6) — first softly, then firmly — and confirm you hear a clear, immediate volume difference at both ends of the keyboard.`,
    },
  ],
  lessons: [
    lesson(
      'piano-l1-1-1',
      'What "Learning Piano" Actually Is',
      [
        step(
          'Five domains, one skill',
          [
            prose(
              `Learning the piano is not one skill — it is five, running at the same time.
          Musicians who seem to "just play" have quietly integrated all five into one fluent
          motion; when a passage keeps falling apart, it is almost always because one of these
          five hasn't caught up with the others yet.`,
            ),
            list(
              [
                '<strong>Aural perception</strong> (the ear) — internalizing pitch relationships, harmonic tension, and rhythmic pulse before you ever touch a key.',
                '<strong>Tactile geography</strong> (the hand and keyboard) — a spatial sense of the 12 recurring pitch classes, built without staring at your hands.',
                '<strong>Biomechanical efficiency</strong> (the body) — using arm weight, loose joints, and forearm rotation to press keys without tensing up.',
                '<strong>Symbolic literacy</strong> (the page) — decoding standard notation directly into where your hands go and when.',
                '<strong>Structural comprehension</strong> (theory) — grouping notes into recognizable units: intervals, triads, scales, cadences.',
              ],
            ),
          ],
          multi(
            'According to the text, which of the following are among the five skills that must be integrated when learning piano?',
            [
              'Aural perception (the ear)',
              'Symbolic literacy (the page)',
              'Velocity sensitivity',
              'Biomechanical efficiency (the body)',
              'Structural comprehension (theory)',
            ],
            [0, 1, 3, 4],
            'The step text explicitly lists aural perception (the ear), tactile geography (the hand and keyboard), biomechanical efficiency (the body), symbolic literacy (the page), and structural comprehension (theory) as the five integrated skills.',
          ),
        ),
        step(
          'Why symbols come last, not first',
          [
            prose(
              `These five domains do not develop in just any order. Pedagogical failure happens
          specifically when symbolic literacy — reading notation — gets pushed ahead of aural
          perception and tactile geography. A student who can decode a page before they can find
          the notes by ear or by feel is decoding without understanding: slower, and far more
          fragile, than learning the sound and the shape first.`,
            ),
            prose(
              `The four domains besides theory also lean on each other constantly: what your ear
          expects shapes how you read a page, and what your hand already knows by feel constrains
          what your inner ear can imagine. That is exactly why this course trains them together,
          never in isolation, in one fixed sequence:`,
            ),
            diagram(
              [
                { id: 'hear', label: 'Hear / Feel' },
                { id: 'find', label: 'Find on Keys' },
                { id: 'name', label: 'Name It' },
                { id: 'read', label: 'Read It' },
                { id: 'shape', label: 'Shape It' },
              ],
              [
                { from: 'hear', to: 'find' },
                { from: 'find', to: 'name' },
                { from: 'name', to: 'read' },
                { from: 'read', to: 'shape' },
              ],
              { caption: 'The fixed learning sequence this course enforces for every new idea.' },
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          order(
            'What is the fixed learning sequence this course enforces for every new idea?',
            ['Read It', 'Hear / Feel', 'Name It', 'Shape It', 'Find on Keys'],
            ['Hear / Feel', 'Find on Keys', 'Name It', 'Read It', 'Shape It'],
            'The step text explicitly states the fixed learning sequence this course enforces for every new idea as: Hear / Feel -> Find on Keys -> Name It -> Read It -> Shape It.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'What "learning piano" actually means — five domains working together, and why sound and feel come before symbols.',
      },
    ),
    lesson(
      'piano-l1-1-2',
      'Acoustic, Digital Piano, Keyboard: Structural Taxonomy',
      [
        step(
          'Three instrument classes, one spec table',
          [
            prose(
              `"Acoustic piano," "digital piano," and "keyboard" are not interchangeable words for
          the same thing — they name three mechanically and acoustically distinct instrument
          classes.`,
            ),
            table(
              ['Spec', 'Acoustic piano', 'Digital piano', 'Electronic / MIDI keys'],
              [
                [
                  'Sound generation',
                  'Hammers striking tensioned steel strings',
                  'Multi-velocity digital samples or physical modeling',
                  'MIDI controller — silent, or an onboard ROM synth',
                ],
                [
                  'Keybed action',
                  'True mechanical escapement, weighted wooden keys',
                  'Graded hammer action simulating that counterweight',
                  'Semi-weighted or spring-loaded synth action',
                ],
                ['Standard keys', '88 (A0–C8)', '88 (A0–C8)', '61, 49, 76, or 88'],
                [
                  'Dynamic control',
                  'Infinite acoustic range from strike velocity',
                  'High — 127 MIDI levels, multi-layer samples',
                  'Medium to high, depending on the velocity curve',
                ],
                [
                  'Maintenance',
                  'Periodic tuning and humidity regulation',
                  'None — electronic longevity',
                  'None — depends on the host system',
                ],
              ],
              'Structural comparison across the three instrument classes.',
            ),
          ],
          mcq(
            'According to the comparison table, what is the sound generation method used by a digital piano?',
            [
              'Hammers striking tensioned steel strings',
              'Multi-velocity digital samples or physical modeling',
              'MIDI controller — silent, or an onboard ROM synth',
              'Graded hammer action simulating counterweight',
            ],
            1,
            'The table explicitly lists "Multi-velocity digital samples or physical modeling" under Sound generation for the Digital piano column.',
          ),
        ),
        step(
          'What "escapement" actually means',
          [
            prose(
              `An <strong>acoustic piano</strong> is a mechanical instrument: pressing a key throws a
          felt-covered hammer at the strings through a lever system called the action, while
          lifting a damper off the strings. Partway through the stroke the finger feels a distinct
          change in resistance — the <strong>escapement</strong>, or <strong>let-off</strong> — the moment the
          hammer is thrown free to travel the rest of the way on its own.`,
            ),
            prose(
              `A <strong>digital piano</strong> is built specifically to replicate that feel: full 88-key
          graded hammer actions (bass keys mechanically heavier than treble keys) with multi-sensor
          escapement simulation. An <strong>electronic keyboard or MIDI controller</strong> uses
          spring-loaded or semi-weighted keys instead — light, portable, built for synth
          performance or DAW control, with no mechanical levers or hammers at all.`,
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'What is the escapement (or let-off) that a pianist feels partway through pressing a key on an acoustic piano?',
            [
              'The moment the damper is lifted off the strings',
              'The moment the felt-covered hammer is thrown free to travel on its own',
              'The change in resistance when the key returns to rest',
              'The lever system that connects the key to the hammer',
            ],
            1,
            'The step text states that partway through the stroke the finger feels a distinct change in resistance — the escapement, or let-off — the moment the hammer is thrown free to travel the rest of the way on its own.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'The real differences between an acoustic piano, a digital piano, and an electronic keyboard.',
      },
    ),
    lesson(
      'piano-l1-1-3',
      'Action, Key Count, Velocity: The Mechanics That Govern Technique',
      [
        step(
          'Action: hammer weight vs. spring tension',
          [
            prose(
              `Of everything a keyboard could have, only three specifications actually shape your
          technique: action, velocity sensitivity, and key count. Brand, color, and built-in sounds
          do not.`,
            ),
            prose(
              `Hammer action — acoustic, or graded-hammer digital — relies on mass and inertia:
          your finger accelerates a real weight, and gravity returns it when you release. That is
          what builds finger independence, forearm balance, and a genuine feel for arm weight.
          Spring action relies on elastic tension instead — the deeper the key goes, the harder the
          spring pushes back. Played exclusively, unweighted spring keys can teach poking from the
          finger joints rather than dropping arm weight into the keybed.`,
            ),
            callout(
              'tip',
              'If you are training on the Launchkey MK4 61',
              `Its 61 keys are semi-weighted spring action, not hammer action. Consciously cultivate a
           relaxed arm-drop technique now — when you move to a weighted 88-key instrument later,
           the keys will feel noticeably heavier, and you will need real arm mass to control them.`,
            ),
          ],
          mcq(
            'According to the text, which three specifications of a keyboard actually shape your technique?',
            [
              'Brand, color, and built-in sounds',
              'Action, velocity sensitivity, and key count',
              'Hammer action, spring action, and gravity',
              'Mass, inertia, and elastic tension',
            ],
            1,
            'The step text explicitly states that of everything a keyboard could have, only three specifications actually shape your technique: action, velocity sensitivity, and key count.',
          ),
        ),
        step(
          'Velocity sensitivity is not optional',
          [
            prose(
              `Velocity sensitivity measures how fast a key travels between its upper and lower
          contacts — a speed, displacement over time — and converts that speed into a number from
          0 to 127.`,
            ),
            callout(
              'key',
              'Why this one is non-negotiable',
              `Without velocity response you cannot practice dynamics (soft to loud), balance one hand
           against the other, or shape a phrase. All three are physically impossible on an
           instrument that outputs the same volume no matter how you strike it.`,
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'What does velocity sensitivity actually measure according to the text?',
            [
              'The force with which a key is pressed',
              'How fast a key travels between its upper and lower contacts',
              'The total distance a key travels down',
              'The amount of pressure held after the key is down',
            ],
            1,
            'The step text states that velocity sensitivity measures how fast a key travels between its upper and lower contacts — a speed, displacement over time — and converts that speed into a number from 0 to 127.',
          ),
        ),
        step(
          'Key count sets your repertoire ceiling',
          [
            prose(
              `Key count does not shape technique the way action and velocity do — but it still sets
          a hard ceiling on how much of the standard literature you can reach before you are forced
          into octave shifts mid-piece. Standard piano literature assumes access to sufficient
          physical register; the fewer keys you have, the sooner that assumption breaks.`,
            ),
          ],
          text(
            'What does a smaller number of keys set on how much standard piano literature you can play?',
            ['a hard ceiling', 'hard ceiling', 'ceiling'],
            'The step text explicitly states that key count "still sets a hard ceiling on how much of the standard literature you can reach before you are forced into octave shifts mid-piece."',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'The three specs that actually shape your technique: action, velocity sensitivity, and key count.',
      },
    ),
    lesson(
      'piano-l1-1-4',
      'Keybed Dimensions and Register Limits',
      [
        step(
          'Three register sizes, one studio default',
          [
            table(
              ['Keys', 'Range', 'Covers'],
              [
                [
                  '88',
                  'A0 to C8 (full concert range)',
                  '100% of standard classical, jazz, and contemporary literature',
                ],
                [
                  '76',
                  'E1 to G7',
                  '~95% of standard literature; omits the most extreme bass/orchestral registers',
                ],
                [
                  '61 (this studio)',
                  'C2 to C7',
                  'Every beginner, early-elementary, and late-elementary two-hand piece',
                ],
              ],
              'Register comparison across the three common keybed sizes.',
            ),
            keyboard(
              {
                low: 36,
                high: 96,
                highlight: ['C4'],
                showLabels: 'c',
                caption: `This studio's actual Launchkey MK4 61 range — C2 to C7, five full octaves, with Middle C (C4) marked.`,
              },
            ),
          ],
          eitherMode(
            play(
              'Play Middle C (C4) — the note this course uses as its universal reference point.',
              ['C4'],
              { byPitchClass: false },
            ),
            mcq(
              'This studio uses a 61-key Launchkey MK4. What is the location of Middle C (C4) on this keyboard, and why is it considered the universal reference point?',
              [
                'It is the lowest note (C2)',
                'It is the highest note (C7)',
                'It is the marked center note in the C2–C7 range',
                'It is not present on this 61-key keyboard',
              ],
              2,
              `This studio's 61-key range is C2 to C7 with Middle C (C4) marked, establishing C4 as the universal reference point for the course.`,
            ),
          ),
        ),
        step(
          '61 keys is enough to start on',
          [
            prose(
              `All five-finger patterns, one- and two-octave scales, two-hand elementary
          repertoire, chord inversions, lead-sheet accompaniments, and modal studies fit entirely
          inside a 61-key range without ever needing to shift. Register constraints only start to
          bite in late-intermediate repertoire, which asks for simultaneous low-bass octave
          doubling together with high-treble runs — well beyond where this course begins.`,
            ),
            callout(
              'warning',
              'A myth worth retiring',
              `It is tempting to assume 61 keys are insufficient for learning piano. They are not — the
           physical range constraint only appears in late-intermediate literature, not in anything
           you will play in this course's early modules.`,
            ),
            prose(
              `If you do buy a dedicated home instrument later, an 88-key weighted digital piano is
          the one purchase that never needs replacing as your repertoire grows into late-
          intermediate and advanced territory.`,
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the text, when do register constraints first become an issue for piano playing?',
            [
              'In early elementary repertoire',
              `In this course's early modules`,
              'In late-intermediate repertoire',
              'When using any 61-key keyboard',
            ],
            2,
            'The step text states that register constraints only start to bite in late-intermediate repertoire, which asks for simultaneous low-bass octave doubling together with high-treble runs.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: `How much keyboard you actually need, and why this studio's 61 keys are enough to start.`,
      },
    ),
    lesson(
      'piano-l1-1-5',
      'Pedal Mechanics: Piano Triad vs. Keyboard Jack',
      [
        step(
          'The three-pedal system',
          [
            table(
              ['Pedal', 'Position', 'What it does'],
              [
                [
                  'Damper / Sustain',
                  'Right',
                  'Lifts every damper at once — struck notes ring on, and the rest of the strings vibrate in sympathy',
                ],
                [
                  'Una corda / Soft',
                  'Left',
                  'Shifts the whole action sideways so hammers strike fewer strings, changing tone and volume',
                ],
                [
                  'Sostenuto / Practice',
                  'Middle',
                  'Grand: sustains only notes already held down when engaged. Upright: often a felt "practice rail" muting the strings',
                ],
              ],
              'The traditional three-pedal system.',
            ),
          ],
          mcq(
            'According to the table, what does the middle pedal do on a grand piano?',
            [
              'Lifts every damper at once so struck notes ring on',
              'Shifts the whole action sideways so hammers strike fewer strings',
              'Sustains only notes already held down when engaged',
              'Mutes the strings with a felt practice rail',
            ],
            2,
            'The step text states in the table that on a grand the sostenuto/middle pedal "sustains only notes already held down when engaged."',
          ),
        ),
        step(
          'The damper pedal is the one that matters daily',
          [
            prose(
              `The damper (sustain) pedal is the primary expressive pedal. Depressing it lifts every
          damper off the strings at once, letting struck notes ring on until released, while every
          other open string vibrates sympathetically — the resonance that gives a pedaled passage
          its wash of sound.`,
            ),
            callout(
              'warning',
              'What the pedal is not',
              `A sustain pedal is an acoustic resonance modifier, not a substitute for real finger
           legato. It cannot mask choppy transitions between notes — it can only add resonance to
           notes you already connected cleanly with your fingers.`,
            ),
          ],
          mcq(
            'What does the damper (sustain) pedal do when depressed?',
            [
              'It substitutes for finger legato to mask choppy note transitions',
              'It lifts every damper off the strings at once, letting struck notes ring and causing sympathetic vibration',
              'It only affects the lowest bass strings',
              'It adds resonance without lifting any dampers',
            ],
            1,
            'The step text states that depressing the damper pedal lifts every damper off the strings at once, letting struck notes ring on until released, while every other open string vibrates sympathetically.',
          ),
        ),
        step(
          'One jack instead of three: CC64',
          [
            prose(
              `Most electronic keyboards and MIDI controllers replace all three mechanical pedals
          with a single 1/4" TS/TRS jack, wired by default to MIDI Continuous Controller 64 — the
          sustain controller. Pressing a standard sustain pedal sends a binary CC64 value: 127
          means on, 0 means off. Some pedals can send continuous values in between, for
          half-pedaling.`,
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'What MIDI Continuous Controller number is wired by default to the single 1/4" jack on most electronic keyboards and MIDI controllers?',
            ['0', '64', '100', '127'],
            1,
            'The step text states that the single 1/4" TS/TRS jack is wired by default to MIDI Continuous Controller 64 — the sustain controller.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'The traditional three-pedal system, and how a single 1/4" jack replaces it electronically.',
      },
    ),
    lesson(
      'piano-l1-1-6',
      'Studio Default: Novation Launchkey MK4 61 in Ableton Live 12',
      [
        step(
          'Signal flow: key press to sound',
          [
            prose(
              `This studio's default rig has one job: turn a physical key press into sound through
          software, since the Launchkey itself makes no sound of its own at all.`,
            ),
            diagram(
              [
                { id: 'lk', label: 'Launchkey MK4 61', sub: 'semi-weighted keybed' },
                { id: 'host', label: 'Ableton Live 12 / SINE', sub: 'host software' },
                { id: 'dac', label: 'Audio interface / DAC' },
                { id: 'mon', label: 'Studio monitors' },
              ],
              [
                { from: 'lk', to: 'host', label: 'USB-MIDI: note, velocity, CC64' },
                { from: 'host', to: 'dac', label: 'instrument audio' },
                { from: 'dac', to: 'mon', label: 'stereo line-level signal' },
              ],
              { caption: `This studio's default signal path.` },
            ),
          ],
          mcq(
            `What is the job of this studio's default rig?`,
            [
              'To generate sound directly from the Launchkey keyboard',
              'To turn a physical key press into sound through software',
              'To record audio directly from the studio monitors',
              'To provide onboard sound generation on the Launchkey MK4',
            ],
            1,
            `The step text explicitly states that this studio's default rig has one job: turn a physical key press into sound through software, since the Launchkey itself makes no sound of its own at all.`,
          ),
        ),
        step(
          'Zero onboard sound — two hosting paths',
          [
            callout(
              'key',
              'The one fact to internalize',
              `The Launchkey MK4 61 is a dedicated MIDI controller. Striking a key produces no internal
           audio of any kind — it only transmits digital control data (note on, velocity, note off)
           over USB to a software host.`,
            ),
            list(
              [
                '<strong>Path A — standard production:</strong> Ableton Live 12 Standard hosting a Grand Piano instrument rack or Electric Piano device, on an armed MIDI track.',
                '<strong>Path B — standalone utility:</strong> Orchestral Tools SINE Player hosting the bundled Parallel Orchestra piano library, with SINE’s MIDI input turned on.',
              ],
            ),
            callout(
              'warning',
              'A myth worth retiring',
              `Playing without sound feedback is not "acceptable finger drilling." Immediate acoustic
           feedback is exactly what lets you calibrate muscular effort against the volume it
           actually produces — without it, you are practicing blind.`,
            ),
          ],
          mcq(
            'What does striking a key on the Launchkey MK4 61 produce?',
            [
              'Internal piano sound',
              'Digital control data only',
              'Acoustic feedback',
              'Both audio and MIDI',
            ],
            1,
            'The step text states that the Launchkey MK4 61 is a dedicated MIDI controller that transmits digital control data (note on, velocity, note off) over USB and produces no internal audio of any kind.',
          ),
        ),
        step(
          `Keybed response, and what's out of scope here`,
          [
            prose(
              `The Launchkey MK4 61's 61 keys are semi-weighted, waterfall-style, with adjustable
          velocity curves. It also supports monophonic and polyphonic aftertouch — but that is
          governed in the sister Launchkey course; piano technique in this course focuses purely on
          velocity strike.`,
            ),
            sources(['Learning Piano with Launchkey', `Playing the Launchkey 61's keyboard`]),
          ],
          mcq(
            'What type of keys does the Launchkey MK4 61 have?',
            [
              'Fully weighted hammer action',
              'Semi-weighted waterfall-style',
              'Plastic synth-action with no weight',
              'Wooden ivory keys',
            ],
            1,
            `The step text states that the Launchkey MK4 61's 61 keys are semi-weighted, waterfall-style.`,
          ),
        ),
      ],
      {
        minutes: 9,
        intro: `This studio's actual rig: how a keypress on the Launchkey becomes sound in Ableton.`,
      },
    ),
    lesson(
      'piano-l1-1-7',
      'The Pedagogical Road: Hoffman Skill Bands Taxonomy',
      [
        step(
          'Four bands across sixteen modules',
          [
            prose(
              `To keep progress objective rather than a matter of feeling, this course maps its 16
          modules onto standard pedagogical bands shared with conservatory frameworks such as the
          Royal Conservatory of Music (RCM).`,
            ),
            table(
              ['Band', 'Modules', 'What it looks like'],
              [
                [
                  'Early Elementary',
                  '1–4',
                  'Instrument and body, keyboard geography, pulse, first songs, landmark reading (Treble G, Middle C, Bass F)',
                ],
                [
                  'Elementary',
                  '5–8',
                  'Pentascales, I/V in the hand, two-hand method and pieces, simple and compound meter, articulation and dynamics',
                ],
                [
                  'Late Elementary',
                  '9–12',
                  'Intervals, first keys, all 12 majors and 3 minor forms, triads, inversions, sevenths, progressions, accompaniment',
                ],
                [
                  'Early Intermediate',
                  '13–16',
                  `Ledger lines and sight-reading, lead sheets and ear, damper pedal, the seven church modes, this studio's keyboard, capstone recital (Gate K)`,
                ],
              ],
              'The Hoffman Academy skill-band framework mapped onto this course.',
            ),
          ],
          mcq(
            'According to the Hoffman Academy skill-band framework in this course, which modules correspond to the Late Elementary band?',
            ['Modules 1-4', 'Modules 5-8', 'Modules 9-12', 'Modules 13-16'],
            2,
            'The table in the step text explicitly lists Late Elementary as Modules 9-12.',
          ),
        ),
        step(
          'Beyond Module 16: the bonus tier',
          [
            prose(
              `Three bonus tracks (A–C) sit past the 16 required modules, covering intermediate
          material and beyond: jazz voicings (rootless, quartal, drop-2 forms) and altered or world
          scales, modal variants, and synthetic scales. These are elective, reference material —
          not required to complete the course.`,
            ),
            sources(['Piano Skill Levels Explained.pdf', 'The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'According to the step text, what is the status of the three bonus tracks (A–C)?',
            [
              'They are required to complete the course',
              'They cover only beginner material',
              'They are elective, reference material — not required to complete the course',
              'They replace the 16 required modules',
            ],
            2,
            'The step text explicitly states that the three bonus tracks are elective, reference material — not required to complete the course.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'Where this course sits on the standard skill-band map, from Early Elementary to Early Intermediate.',
      },
    ),
    lesson(
      'piano-l1-1-8',
      'Three-Point Objective Formulation',
      [
        step(
          'Three targets, not vague aspirations',
          [
            prose(
              `Before any physical drilling, this course asks for three concrete, non-aesthetic
          objectives — not "get better," but specific, checkable targets.`,
            ),
            table(
              ['Objective', 'Target'],
              [
                [
                  'Repertoire',
                  'Two complete hands-together folk/classical études, performed by Gate E without rhythmic breakdown or positional hesitation',
                ],
                [
                  'Literacy',
                  'Identify the guide notes — Treble G, Middle C, Bass F — on the grand staff and map them to keyboard position in under 2 seconds',
                ],
                [
                  'Technical',
                  'Execute 5-finger pentascales using pure gravitational arm weight and a supple wrist, without raising or stiffening inactive fingers',
                ],
              ],
            ),
          ],
          multi(
            'Which of the following are among the three concrete non-aesthetic objectives stated for this course before any physical drilling?',
            [
              'Perform two complete hands-together folk/classical études by Gate E without rhythmic breakdown or positional hesitation',
              'Identify the guide notes Treble G, Middle C, and Bass F on the grand staff and map them to the keyboard in under 2 seconds',
              'Execute 5-finger pentascales using pure gravitational arm weight and a supple wrist without raising or stiffening inactive fingers',
              `Name the three traditional piano pedals and contrast them with 1/4'' keyboard sustain inputs`,
            ],
            [0, 1, 2],
            'The step text explicitly lists these three checkable targets (Repertoire, Literacy, Technical) in the provided table as the concrete non-aesthetic objectives required before physical drilling.',
          ),
        ),
        step(
          'Write yours down now',
          [
            prose(
              `These three objectives are not abstract — write them down before you touch the keys
          again. A specific, written target is what turns "practice" from time spent into progress
          made.`,
            ),
            callout(
              'tip',
              'Do this before the next lesson',
              `Open a notebook or note-taking app and write one sentence for each: your repertoire goal,
           your literacy goal, and your technical goal. You will revisit these at this section's
           gate checkpoint.`,
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          text(
            'What must you do with your three objectives before touching the keys again?',
            [
              'write them down',
              'write them down in a notebook or note-taking app',
              'open a notebook or note-taking app and write one sentence for each',
            ],
            'The step text states that the three objectives are not abstract and instructs to write them down before touching the keys again, turning practice into progress.',
          ),
        ),
      ],
      {
        minutes: 6,
        intro: 'Turning vague ambition into three concrete, checkable practice objectives.',
      },
    ),
  ],
});
