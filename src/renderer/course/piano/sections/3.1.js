/**
 * Section 3.1 — Pulse Before Counting
 * Module 3 — First Music
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_03_First_Music/
 * Section_3.1_Pulse_Before_Counting.md), read in full before authoring.
 *
 * Conversion notes:
 * - This section is entirely non-pitch content (beat, rhythm, tempo, feel) —
 *   no scale/chord/interval/key-signature claim appears anywhere in it, so
 *   no lesson here carries an `asserts` array. That's a real property of the
 *   source material, not an oversight: the theory oracle only has assert
 *   kinds for pcSet/interval/keySignature, none of which describe a tempo or
 *   a rhythmic feel classification.
 * - The three ASCII boxes throughout §3 (Beat vs Rhythm, the Dual-Student
 *   Drumming Remedy, Echo Clapping patterns, the Note-Typing error box, the
 *   feel-classification table) are promoted to real table()/callout()
 *   blocks rather than left as preformatted text.
 * - Two places get a genuinely playable demo instead of just a described
 *   pattern, since the app already has a working rhythm() block with a real
 *   renderer (src/renderer/views/blocks.js's renderers.rhythm) that plays a
 *   click pattern at a given BPM: the even-pulse Echo Clapping Pattern 1
 *   (lesson 3.1.4) and a Straight-vs-Swing pair (lesson 3.1.6) built as
 *   parallel 8-eighth-note patterns — straight as 8×0.5-beat notes, swing as
 *   4 long/short pairs (0.66/0.34 beats) summing to the same 4 beats, so a
 *   learner can trigger both back to back and hear the difference directly
 *   rather than only reading about it. Echo Clapping Patterns 2 and 3 involve
 *   a beat of silence the block has no way to represent (it only sequences
 *   played notes, not rests), so those stay as a table.
 * - Per the plan's mapping rule, §5's two Structured Practice Protocols
 *   become the module's exercises[] (each given an explicit id, not
 *   duplicated into lesson steps), §4's Methodological Traps become a
 *   callout() in the closing step of lesson 3.1.5 (the lesson they apply to
 *   most directly — stopping the pulse to fix a note, rushing/dragging, and
 *   forcing counting before feeling are all "note-typing" symptoms), and
 *   §6's Self-Assessment checklist replaces the scaffold's generic
 *   checkpoints[] below.
 * - Check-drafting provenance: all 12 step checks were drafted via the xAI
 *   client (tools/author/draft-step-checks.mjs) grounded in each step's own
 *   text plus this module's outcomes, then entailment-verified — 12 of 12
 *   passed on the first attempt.
 */
import { module_, lesson, step, prose, table, callout, list, rhythm, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l3-1-1',
      'Beat vs. Rhythm: The Essential Distinction',
      [
        step(
          'The Three-Tier Temporal Hierarchy',
          [
            prose(
              '<p>Every piece of music runs on three layered concepts of time, and a fundamental point of confusion for beginners is conflating two of them: the <em>beat</em> and the <em>rhythm</em>. Keeping the three tiers straight from the start prevents that confusion.</p>',
            ),
            table(
              ['Tier', 'What it is'],
              [
                [
                  'Tempo',
                  'The overall velocity/speed of the beat (e.g. Moderato ≈108 BPM, Adagio ≈60 BPM).',
                ],
                [
                  'Beat / Pulse',
                  'The invariant, recurring heartbeat — constant, steady, continuous foundation.',
                ],
                [
                  'Rhythm',
                  'The surface pattern of sounds and silences — varying durations: long, short, pauses.',
                ],
              ],
              'Tempo sets the speed of the Beat; the Rhythm is the pattern layered on top of it.',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, what is the Beat (or Pulse)?',
            [
              'The overall speed of the music such as Moderato or Adagio',
              'The varying pattern of long and short sounds and silences',
              'The invariant recurring heartbeat that is constant and steady',
              'The surface layer that sits on top of the tempo',
            ],
            2,
            'The step text explicitly defines Beat/Pulse as "The invariant, recurring heartbeat — constant, steady, continuous foundation."',
          ),
        ),
        step(
          'Beat vs. Rhythm, Defined',
          [
            prose(
              '<p>The beat is the underlying, unvarying, recurring pulse that continues steadily throughout a piece of music. It is the invisible grid to which a listener taps their foot — strictly periodic, and it does not change when the notes change.</p><p>The rhythm is the specific pattern in time of sound and silence. Notes can be longer than the beat, shorter than the beat, or coincide with the beat. While the beat is constant, the rhythm is dynamic and varied.</p><p>Tempo is the speed or frequency of the beat, measured in Beats Per Minute (BPM).</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, what is the beat?',
            [
              'The specific pattern in time of sound and silence',
              'The speed or frequency of the beat measured in BPM',
              'The underlying, unvarying, recurring pulse that continues steadily throughout a piece',
              'Notes that can be longer, shorter, or coincide with a pulse',
            ],
            2,
            'The step text explicitly defines the beat as "the underlying, unvarying, recurring pulse that continues steadily throughout a piece of music."',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-1-2',
      'The Somatic Pulse: Body Drumming and Walking',
      [
        step(
          'The Human Heartbeat and Locomotion',
          [
            prose(
              '<p>Internalizing the beat requires somatic (body-centered) engagement before transferring to the keybed. Human physiology is intrinsically rhythmic: walking at an unvarying pace establishes an invariant 1–2–1–2 pulse.</p>',
            ),
            rhythm(
              [1, 1, 1, 1],
              {
                title: 'Steady Walking Pulse',
                bpm: 60,
                caption: 'Four steady beats — one step per beat, unvarying.',
              },
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the step, what must happen before internalizing the beat can transfer to the keybed?',
            [
              'Synchronize gross motor movement to an external beat',
              'Establish an invariant 1-2-1-2 pulse while walking',
              'Somatic (body-centered) engagement',
              'Diagnose the note typing anti-pattern',
            ],
            2,
            'The step text explicitly states that internalizing the beat requires somatic (body-centered) engagement before transferring to the keybed.',
          ),
        ),
        step(
          'The Walking Calibration Drill',
          [
            list(
              [
                'Walk across the room at a moderate, steady pace (1 step = 1 beat).',
                'While continuing to walk the steady beat with your feet, clap a different rhythm with your hands — for example, clapping twice as fast, or clapping once every two steps.',
                'Notice how your feet maintain the unchanging "grid" while your hands create the "music."',
              ],
              true,
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'In the walking and clapping exercise, what do your feet provide while your hands create the music?',
            ['The music', 'The unchanging grid', 'A changing tempo', 'Syncopated rhythm'],
            1,
            'The step text states that your feet maintain the unchanging "grid" while your hands create the "music."',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-1-3',
      'Externalizing the Beat: Drumming Along with Melody',
      [
        step(
          'Step One — Drum the Beat While Melody Plays',
          [
            prose(
              '<p>When a student loses connection to the underlying pulse while learning a piece, the brain is suffering from cognitive overload. The remedy has two steps, and the first is to separate feeling the pulse from playing anything at all.</p><p>A backing track, teacher, or metronome plays the melody. The student drums a steady beat on their knees, a table, or a drum — feeling the pulse physically while hearing the melody, with no pitches to find yet.</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'What is the first step in the remedy when a student loses connection to the underlying pulse?',
            [
              'Play the melody on the piano while clapping the beat',
              'Drum a steady beat while hearing the melody with no pitches to find',
              'Separate the rhythm from the melody and practice each alone',
              'Use written notation to mark the pulse before playing',
            ],
            1,
            'The step text states that the first remedy step is to separate feeling the pulse from playing anything at all by having a backing track, teacher or metronome play the melody while the student drums a steady beat, feeling the pulse physically with no pitches to find yet.',
          ),
        ),
        step(
          'Step Two — Play the Melody Over the External Beat',
          [
            prose(
              '<p>Once the pulse is felt physically, the metronome or external pulse maintains the beat audibly, and the student plays the melody — locking their note attacks directly to or around the external pulse rather than to their own uncertain internal sense of time.</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the step, what does the student do once the pulse is felt physically?',
            [
              'Continue relying on their own internal sense of time',
              'Play the melody while locking note attacks to the external pulse',
              'Focus only on the rhythm pattern without the metronome',
              'Ignore the audible beat and play freely',
            ],
            1,
            'The step text states that the student plays the melody — locking their note attacks directly to or around the external pulse rather than to their own uncertain internal sense of time.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l3-1-4',
      'Echo Clapping: Auditory-Motor Mapping',
      [
        step(
          'The Protocol Rule',
          [
            prose(
              '<p>Before reading written notation, rhythmic patterns must be mastered by ear. In echo clapping, a caller claps a short pattern and the student reproduces it exactly on the next bar.</p>',
            ),
            rhythm(
              [1, 1, 1, 1],
              {
                title: 'Echo Pattern 1 — Even Pulses',
                bpm: 80,
                caption: 'Four even claps. Listen once, then clap it back.',
              },
            ),
            callout(
              'key',
              'Never count aloud during echo clapping',
              '<p>Listen to the phrase as a single unified gesture, internalize the rhythm, and reproduce it instantly on the subsequent bar — counting aloud defeats the purpose of training the ear directly.</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'In echo clapping, when should the student reproduce the clapped pattern?',
            [
              'Immediately after the caller finishes, on the next bar',
              'While the caller is still clapping',
              'Only after counting the beats aloud',
              'After writing the pattern down first',
            ],
            0,
            'The step text states that in echo clapping a caller claps a short pattern and the student reproduces it exactly on the next bar.',
          ),
        ),
        step(
          'Uneven Patterns',
          [
            prose(
              '<p>Once even patterns are reliable, the calls introduce uneven groupings of claps and a beat of silence.</p>',
            ),
            table(
              ['Pattern', 'Call'],
              [
                [
                  'Pattern 2 — Short-Short-Long',
                  'Clap-Clap, Clap-Clap, Clap, Rest (one beat of silence).',
                ],
                ['Pattern 3 — Mixed Durations', 'Clap, Clap-Clap, Clap, Rest (one beat of silence).'],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the step, what does the call for Pattern 2 (Short-Short-Long) sound like?',
            [
              'Clap, Clap-Clap, Clap, Rest',
              'Clap-Clap, Clap-Clap, Clap, Rest',
              'Clap-Clap, Clap, Clap-Clap, Rest',
              'Clap, Rest, Clap-Clap, Clap',
            ],
            1,
            'The step text explicitly lists the call for Pattern 2 — Short-Short-Long as Clap-Clap, Clap-Clap, Clap, Rest (one beat of silence).',
          ),
        ),
      ],
    ),
    lesson(
      'piano-l3-1-5',
      'The Beginner "Note-Typing" Anti-Pattern',
      [
        step(
          'The Note-Typing Error, and How to Diagnose It',
          [
            prose(
              '<p>When typing on a computer keyboard, timing is completely irrelevant — only the linear sequence of characters matters. When beginning piano students focus exclusively on finding the correct key coordinate, they "type" the notes with random, erratic pauses while searching for the next key.</p><p>The diagnosis: if the music stops every time the hand searches for a new finger or pitch, the performance has collapsed into "typing."</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            `What is the diagnosis when a beginner pianist's music stops every time the hand searches for a new finger or pitch?`,
            [
              'The performance is in swing feel',
              'The performance has collapsed into "typing."',
              'The tempo is too slow',
              'The rhythm is syncopated',
            ],
            1,
            'The step text explicitly states that if the music stops every time the hand searches for a new finger or pitch, the performance has collapsed into "typing."',
          ),
        ),
        step(
          'The Remedy, and the Traps That Cause It',
          [
            list(
              [
                'Reduce the tempo by 50% until the next key can be anticipated in advance.',
                'Practice singing the rhythm on neutral syllables ("Ta, Ti-Ti") before touching the keybed.',
                'Never sacrifice the pulse to fix a wrong pitch — keep the time moving.',
              ],
              true,
            ),
            callout(
              'warning',
              'Three anti-patterns that cause note-typing',
              '<p>Stopping the pulse to fix a missed note during performance — instead, keep the beat steady and miss the note in time rather than stop the clock. Rushing fast passages while dragging through slow, difficult ones — instead, practice with a metronome at a slow tempo to stabilize subdivisions. Forcing mathematical fraction math before feeling the pulse — instead, feel and chant the rhythm verbally before writing numeric counts.</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          multi(
            'According to the text, which of these are recommended ways to avoid note-typing?',
            [
              'Reduce the tempo by 50% until the next key can be anticipated in advance',
              'Practice singing the rhythm on neutral syllables before touching the keybed',
              'Stop the pulse to fix a missed note during performance',
              'Never sacrifice the pulse to fix a wrong pitch — keep the time moving',
              'Force mathematical fraction math before feeling the pulse',
            ],
            [0, 1, 3],
            'The step text explicitly lists reducing tempo by 50% until anticipation, singing rhythm on neutral syllables first, and never sacrificing the pulse to fix pitch as the positive practices, while the other two are named as anti-patterns.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l3-1-6',
      'Rhythmic Feel Classifications: Straight, Swing, Syncopation',
      [
        step(
          'Straight Feel',
          [
            prose(
              `<p>In a straight feel, subdivisions of the beat are mathematically equal in duration. In 4/4 time, two eighth notes divide the beat precisely 50%/50% ("1-and, 2-and"). Mozart's <em>Variations on "Ah vous dirai-je, Maman"</em> is a model example.</p>`,
            ),
            rhythm(
              [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
              {
                title: 'Straight Eighths — Equal Duration',
                bpm: 100,
                caption: 'Each eighth note takes exactly the same amount of time as the last.',
              },
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'In a straight feel, how do two eighth notes divide the beat in 4/4 time?',
            ['60%/40%', '70%/30%', '50%/50%', '40%/60%'],
            2,
            'The step text states that in a straight feel, subdivisions of the beat are mathematically equal, so two eighth notes divide the beat precisely 50%/50% ("1-and, 2-and").',
          ),
        ),
        step(
          'Swing and Syncopation',
          [
            prose(
              '<p>In a swing feel, the first subdivision of each pair is held noticeably longer than the second (roughly a 66%/33% split, a triplet feel), chanted as "DU-bah DU-bah DU-bah DU-bah" — the model is jazz, blues, and traditional swing.</p>',
            ),
            rhythm(
              [0.66, 0.34, 0.66, 0.34, 0.66, 0.34, 0.66, 0.34],
              {
                title: 'Swing Eighths — Long-Short "DU-bah" Feel',
                bpm: 100,
                caption: 'The first eighth in each pair is held about twice as long as the second.',
              },
            ),
            prose(
              '<p>In a syncopated feel, rhythmic accents and dynamic attacks fall on the off-beat (between the main pulses) rather than on the downbeat. The model is funk, Latin, ragtime, and modern pop.</p>',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, what is the model or style associated with a swing feel?',
            [
              'funk, Latin, ragtime, and modern pop',
              'jazz, blues, and traditional swing',
              'a 66%/33% split',
              'between the main pulses',
            ],
            1,
            'The step text explicitly states that the model for a swing feel (with its DU-bah chant and 66%/33% split) is jazz, blues, and traditional swing.',
          ),
        ),
      ],
    ),
  ],
  exercises: [
    {
      id: 'piano-m3-1-ex-a',
      type: 'Rhythm drill',
      title: 'Protocol 3.1-A — Metronome Knee-Drumming Synchronization',
      prompt: 'Set a metronome to 60 BPM. Pat both knees on each click — 1, 2, 3, 4 — and maintain steady alignment for 30 seconds. Increase tempo to 80 BPM, then 100 BPM, then 120 BPM. Then decrease tempo to 45 BPM: slow tempos are the hardest test of internal subdivision.',
    },
    {
      id: 'piano-m3-1-ex-b',
      type: 'Rhythm drill',
      title: 'Protocol 3.1-B — Straight vs. Swing Verbalization Drill',
      prompt: 'At 72 BPM, chant straight eighth notes on a single syllable: "Ta-Ta-Ta-Ta-Ta-Ta-Ta-Ta" (strictly equal). Then switch to swing rhythm without altering the tempo: "DU-bah DU-bah DU-bah DU-bah" (long-short lilt).',
    },
  ],
  checkpoints: [
    'Beat vs. Rhythm articulation: you can explain in your own words the difference between an unchanging beat and a variable rhythm.',
    'Steady gross motor pulse: you can walk or tap a steady beat at 60 BPM for 60 seconds without rushing or dragging.',
    'Echo clapping accuracy: you can hear a four-beat rhythm pattern and accurately clap it back on the subsequent bar.',
    'Note-typing awareness: you recognize that searching for keys with erratic pauses is a failure of tempo, and know to slow down to maintain continuity.',
  ],
  outcomes: [
    'Distinguish between the underlying steady Beat (Pulse), the surface Rhythm (Pattern in Time), and the Tempo (Speed).',
    'Synchronize gross motor movement (walking, clapping, table drumming) to an external steady beat across varying tempos.',
    'Execute rhythm imitation protocols (echo clapping) directly by ear without relying on written symbols.',
    'Diagnose and eradicate the "note typing" anti-pattern (pressing correct pitches sequentially while disregarding temporal duration).',
    'Identify three primary temporal feel classifications: Straight, Swing (DU-bah chant), and Syncopated.',
  ],
  sources: [
    'Building Rhythm Skills in the Beginning Musician.pdf',
    'How To Read Rhythms in Music.pdf',
    'Rhythm Words Guide.pdf',
    'The Hoffman Method of Learning Piano.pdf',
  ],
  practiceFocus: ['Walk a pulse, then clap a pattern over it.'],
  id: 'piano-m3-1',
  code: '3.1',
  title: 'Pulse Before Counting',
});
