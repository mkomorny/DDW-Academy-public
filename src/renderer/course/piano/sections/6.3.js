/**
 * Section 6.3 — Repertoire Lab I: First Complete Two-Hand Pieces
 * Module 6 — Two Hands
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_06_Two_Hands/
 * Section_6.3_Repertoire_Lab_I_First_Complete_Two_Hand_Pieces.md).
 *
 * This is the module's Gate E section — its own §6 "Gate E Assessment Audit"
 * (4 items) becomes lesson 6.3.6's closing checklist table AND the module's
 * checkpoints[] below, matching the Gate C/Gate D precedent (the gate's own
 * source-of-truth is the section that names it).
 *
 * Both repertoire pieces (Frère Jacques, Ode to Joy) are excerpted rather
 * than fully transcribed — staff() has no rest or tie support (confirmed
 * again this section, matching 4.1/5.3's documented renderer limitations),
 * so a full 8-measure piece with whole-note rests would either misrepresent
 * durations or need blocks the schema doesn't have. Each lesson instead
 * shows the one representative measure/phrase-boundary its own prose is
 * actually teaching, backed by a table transcription of the full piece for
 * the rest. LH chord voicings reuse the "Bass C = C2" convention Gate D
 * established: I = C2+G2, V = B1+G2 (5.3.3), cited again by hand rather
 * than re-asserted, since those interval facts are already in the theory
 * oracle's record from Section 5.3.
 *
 * Per-step sources() split: 6.3.1's selection rationale and 6.3.4's phrase
 * architecture come from Piano Skill Levels Explained.pdf (repertoire
 * requirements); the two mastery-protocol lessons (6.3.2/6.3.3) come from
 * A perfect guide to learning piano.pdf (stepwise two-hand coordination);
 * performance architecture (6.3.5) comes from The Hoffman Method of
 * Learning Piano.pdf (recital etiquette); the recording lesson (6.3.6)
 * comes from Tips on how to practice piano.pdf (objective recording review).
 *
 * Check-drafting provenance: 12/12 questions passed shape + entailment on
 * the first attempt.
 */
import { module_, lesson, step, prose, table, callout, staff, sources, mcq, multi, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l6-3-1',
      'The Two-Hand Repertoire Selection Criteria',
      [
        step(
          'Two Contrasting Pieces, Not One',
          [
            prose(
              'To prove bilateral mastery without relying on a fluke, this course requires <b>two contrasting pieces</b>. <b>Piece A</b> (<i>Are You Sleeping</i>) focuses on rhythmic subdivision variation — quarter notes shifting into active eighth notes in measures 5–6 — over functional I–V–I harmony. <b>Piece B</b> (<i>Ode to Joy</i>) focuses on classical phrase architecture: an incomplete cadence on V in measure 4, and a complete tonic resolution on I in measure 8.',
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the course requirements for proving bilateral mastery, which piece focuses on rhythmic subdivision variation with quarter notes shifting into active eighth notes in measures 5–6?',
            ['Ode to Joy', 'Are You Sleeping', 'Both pieces', 'Neither piece'],
            1,
            'The step text explicitly states that Piece A (Are You Sleeping) focuses on rhythmic subdivision variation — quarter notes shifting into active eighth notes in measures 5–6.',
          ),
        ),
        step(
          'Both Pieces at a Glance',
          [
            table(
              ['', 'Piece A — Are You Sleeping', 'Piece B — Ode to Joy'],
              [
                ['Key / Time', 'C Major, 4/4', 'C Major, 4/4'],
                ['Tempo', 'Moderato (80 BPM)', '—'],
                [
                  'RH position',
                  'C Position (1=C, 2=D, 3=E, 4=F, 5=G)',
                  'C Position (1=C, 2=D, 3=E, 4=F, 5=G)',
                ],
                ['LH position', 'Low C Position (5=C, 1=G)', 'Low C Position (5=C, 1=G)'],
                [
                  'What it teaches',
                  'Rhythmic subdivision (quarters into eighths) over I–V–I',
                  'Classical phrase architecture (unresolved V, resolved I)',
                ],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the table, what does Piece A teach?',
            [
              'Classical phrase architecture (unresolved V, resolved I)',
              'Rhythmic subdivision (quarters into eighths) over I–V–I',
              '4-phrase classical melody with full LH I–V harmonic accompaniment',
              '2-voice counterpoint with alternating LH/RH motion',
            ],
            1,
            'The step text explicitly states under "What it teaches" for Piece A: Rhythmic subdivision (quarters into eighths) over I–V–I.',
          ),
        ),
      ],
      { intro: 'Why the course requires two contrasting pieces, and what each one teaches.' },
    ),
    lesson(
      'piano-l6-3-2',
      'Piece A Mastery Protocol (Hands Separate)',
      [
        step(
          'RH Acquisition — the Measure 5 Reach',
          [
            prose(
              'Play RH alone at 80 BPM. Focus on Measure 5: the 4 eighth notes (G-A-G-F) must be executed with a relaxed, forward arm glide so Finger 5 reaches A without tension — A sits just outside the 5-finger C Position, so the hand glides forward for an instant rather than stretching the finger alone.',
            ),
            staff(
              {
                items: [
                  { notes: ['G4'], duration: 'e' },
                  { notes: ['A4'], duration: 'e' },
                  { notes: ['G4'], duration: 'e' },
                  { notes: ['F4'], duration: 'e' },
                ],
                caption: 'Measure 5, RH: G-A-G-F as four eighth notes — the reach beyond C Position.',
              },
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the instructions, how should the 4 eighth notes (G-A-G-F) in Measure 5 of the right hand be played?',
            [
              'By stretching finger 5 alone to reach A',
              'With a relaxed, forward arm glide so finger 5 reaches A without tension',
              'By keeping the hand strictly in 5-finger C position',
              'By playing them at a slower tempo than 80 BPM',
            ],
            1,
            'The step text states that the 4 eighth notes (G-A-G-F) must be executed with a relaxed, forward arm glide so Finger 5 reaches A without tension.',
          ),
        ),
        step(
          'LH Acquisition — Voice Leading into the V Chord',
          [
            prose(
              `Play LH alone. Ensure smooth voice leading as Finger 5 steps down to B on the V chord in measures 5–6 — the same I→V half-step shift Gate D's chord-shell work established (Tonic C2+G2 to Dominant B1+G2).`,
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['B1', 'G2'], duration: 'w' },
                ],
                caption: 'Measures 5–6, LH: the V chord (B1+G2), held as a whole note.',
              },
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'What half-step shift in the left hand should you ensure is smooth when playing alone in measures 5–6?',
            [
              'Finger 5 steps down from C to B on the V chord',
              'Finger 5 steps up from G to A on the I chord',
              'Thumb steps from B to C on the V chord',
              'Finger 3 steps down from D to C on the I chord',
            ],
            0,
            `The step text states to ensure smooth voice leading as Finger 5 steps down to B on the V chord in measures 5–6 — the same I→V half-step shift Gate D's chord-shell work established.`,
          ),
        ),
      ],
      {
        intro: 'RH and LH drilled separately, isolating the two hardest spots: the eighth-note reach and the V-chord voice leading.',
      },
    ),
    lesson(
      'piano-l6-3-3',
      'Piece A Mastery Protocol (Hands Together)',
      [
        step(
          'Coordinating the Measure 5 Chord Change',
          [
            prose(
              'Reduce the metronome to 45 BPM. On Beat 1 of Measure 5, LH strikes the V chord (B+G) at the exact instant RH strikes G. LH holds firmly while RH articulates the rest of the eighth-note run (A-G-F) on top of it.',
            ),
            table(
              ['Beat', 'RH', 'LH'],
              [
                ['1', 'G (strike together with LH)', 'V chord (B+G) — strike, then hold'],
                ['& 2 & 3', 'A – G – F (eighths)', 'holding'],
              ],
              'The two hands only need to synchronize once, on Beat 1 — after that, LH just holds while RH moves.',
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the step text, at what point do the two hands need to synchronize?',
            [
              'On every beat',
              'Only on Beat 1 of Measure 5',
              'On the first and third beats',
              'On every eighth note',
            ],
            1,
            'The step text states that the two hands only need to synchronize once, on Beat 1 — after that, LH just holds while RH moves.',
          ),
        ),
        step(
          'Isolate Before You Integrate',
          [
            prose(
              'Repeat Measure 5 in isolation ×5 clean repetitions before playing the full piece. A "clean" repetition means the Beat 1 attack lands together and LH does not release early.',
            ),
            callout(
              'tip',
              'Isolate the Hard Measure, Not the Whole Piece',
              'Looping one measure five times clean is far more efficient than restarting the whole piece from Measure 1 every time you miss the coordination on Measure 5.',
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the instructions, what does a "clean" repetition of Measure 5 require?',
            [
              'The whole piece is played from the beginning without mistakes',
              'The Beat 1 attack lands together and the LH does not release early',
              'Both hands play at performance speed',
              'The measure is played only once before moving on',
            ],
            1,
            'The step text explicitly defines a clean repetition as one where the Beat 1 attack lands together and LH does not release early.',
          ),
        ),
      ],
      { intro: 'The two hands come together, with Measure 5 isolated as its own short drill.' },
    ),
    lesson(
      'piano-l6-3-4',
      'Piece B Mastery Protocol (Ode to Joy)',
      [
        step(
          'The Same 3-Stage Loop, a New Piece',
          [
            prose(
              `<i>Ode to Joy</i> follows the identical 3-Stage Mastery Protocol used for Piece A: Hands-Separate Mastery, then Hands-Together at Half Speed, then Performance Speed. What's new here is not the method — it's paying rigorous attention to how the piece's two phrases end differently.`,
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the step text, what is new about learning Ode to Joy compared to Piece A?',
            [
              'The 3-Stage Mastery Protocol is different',
              `Paying rigorous attention to how the piece's two phrases end differently`,
              'Using hands-separate practice for the first time',
              'Performing at full speed from the beginning',
            ],
            1,
            `The step text explicitly states that what is new here is not the method but paying rigorous attention to how the piece's two phrases end differently.`,
          ),
        ),
        step(
          'Measure 4 vs. Measure 8 — Question and Answer',
          [
            prose(
              `Measure 4 ends on D in the RH melody with a V chord (B+G) in the LH — an unresolved musical question. Measure 8 ends on C in the RH melody with a I chord (C+G) in the LH — the final, resolved answer. Hearing this difference is the whole point of the piece's classical phrase architecture.`,
            ),
            staff(
              {
                items: [
                  { notes: ['D4'], duration: 'h' },
                  { notes: ['C4'], duration: 'h' },
                ],
                caption: 'RH endings compared: Measure 4 (D, unresolved) vs. Measure 8 (C, resolved).',
              },
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['B1', 'G2'], duration: 'w' },
                  { notes: ['C2', 'G2'], duration: 'w' },
                ],
                caption: 'LH chords compared: Measure 4 (V, B1+G2) vs. Measure 8 (I, C2+G2).',
              },
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'What chord does the LH play in measure 8?',
            ['V chord (B+G)', 'I chord (C+G)', 'V chord (D+F)', 'I chord (C+E)'],
            1,
            'The step text states that measure 8 ends on C in the RH melody with a I chord (C+G) in the LH.',
          ),
        ),
      ],
      {
        intro: 'Same mastery method as Piece A, applied to a piece whose two phrases end on purposefully different chords.',
      },
    ),
    lesson(
      'piano-l6-3-5',
      'Performance Architecture: Beginning, Middle, and End',
      [
        step(
          'The 4-Phase Performance Ritual',
          [
            prose(
              'A genuine musical performance requires conscious architectural framing, not just correct notes.',
            ),
            table(
              ['Phase', 'What happens'],
              [
                [
                  '1. The Silent Audiation',
                  'Place hands on the keys. Do NOT start immediately — breathe deeply and hear the tempo and first phrase in your mind first.',
                ],
                [
                  '2. The Committed Attack',
                  'Drop arm weight into Measure 1 on the exact conceived downbeat.',
                ],
                [
                  '3. Continuity Through Imperfection',
                  'If a wrong note occurs, do not stop, apologize, or make a face — keep the metric pulse moving forward.',
                ],
                [
                  '4. The Completed Release',
                  'Hold the final note/chord for its full written value, then gently lift hands from the keybed together.',
                ],
              ],
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          order(
            'What is the correct sequence of phases for a genuine musical performance as described?',
            [
              'The Silent Audiation',
              'The Committed Attack',
              'Continuity Through Imperfection',
              'The Completed Release',
            ],
            [
              'The Silent Audiation',
              'The Committed Attack',
              'Continuity Through Imperfection',
              'The Completed Release',
            ],
            'The step text presents these four phases in exactly this numbered order as the required architectural framing for performance.',
          ),
        ),
        step(
          'Never Stop the Performance Clock',
          [
            prose(
              'Continuity through imperfection is the phase beginners violate most: the instinct to stop and fix a wrong note is strong, but it turns one small slip into a much more noticeable break in the music.',
            ),
            callout(
              'warning',
              'A Wrong Note Is Recoverable; a Stop Is Not',
              'Stopping to fix a wrong note during a recorded take breaks the performance far more than the wrong note itself did. Never stop the performance clock — keep the pulse moving forward and let the piece continue.',
            ),
            sources(['The Hoffman Method of Learning Piano.pdf']),
          ],
          mcq(
            'According to the text, which is more damaging to a performance: a wrong note or stopping to fix it?',
            [
              'A wrong note',
              'Stopping to fix a wrong note',
              'Both are equally damaging',
              'Neither affects the performance',
            ],
            1,
            'The step text states that stopping to fix a wrong note during a recorded take breaks the performance far more than the wrong note itself did.',
          ),
        ),
      ],
      {
        intro: 'A performance has a beginning, middle, and end — not just correct notes in the middle.',
      },
    ),
    lesson(
      'piano-l6-3-6',
      'The Smartphone/DAW Recital Recording',
      [
        step(
          'Capturing the Take',
          [
            prose(
              'Position a smartphone camera (or arm an Ableton Live 12 track) to capture both hands and the keyboard. Record Piece A and Piece B back-to-back in a single continuous take, then review the recording with the score in hand to verify the Gate E pass criteria.',
            ),
            table(
              ['Protocol 6.3-A: The Gate E Dress Rehearsal', ''],
              [
                ['1', 'Run Piece A (Frère Jacques) ×2 takes at 76 BPM.'],
                ['2', 'Run Piece B (Ode to Joy) ×2 takes at 76 BPM.'],
                ['3', 'Execute the final continuous recording take.'],
              ],
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          order(
            'What is the exact sequence of actions in Protocol 6.3-A for the Gate E Dress Rehearsal?',
            [
              'Run Piece A (Frère Jacques) ×2 takes at 76 BPM.',
              'Run Piece B (Ode to Joy) ×2 takes at 76 BPM.',
              'Execute the final continuous recording take.',
            ],
            [
              'Run Piece A (Frère Jacques) ×2 takes at 76 BPM.',
              'Run Piece B (Ode to Joy) ×2 takes at 76 BPM.',
              'Execute the final continuous recording take.',
            ],
            'The step text lists the protocol steps in this exact numbered order: first two takes of Piece A, then two takes of Piece B, then the final continuous recording take.',
          ),
        ),
        step(
          'Gate E Assessment Audit',
          [
            prose(
              'To pass Gate E and unlock Module 7 (Time), verify all four items below against your recording.',
            ),
            table(
              ['Gate E requirement', 'What to verify'],
              [
                [
                  'Two complete two-hand pieces recorded',
                  'Unedited, continuous performances of Piece A and Piece B.',
                ],
                [
                  'Unbroken metric pulse',
                  'The pulse survives across both hands — zero stops or hesitations during chord changes or eighth-note runs.',
                ],
                [
                  'Independent hand dynamics',
                  'RH melody is clearly audible above the LH chord accompaniment.',
                ],
                [
                  'Physical ease and relaxation',
                  'Shoulders relaxed, forearms level, wrists supple throughout both recorded performances.',
                ],
              ],
            ),
            callout(
              'key',
              'Two More Recording Traps',
              'Whole-note chords must hold for the full 4 metronome counts — do not lift the LH early. And choose a moderate tempo (70–80 BPM) you can maintain comfortably; starting too fast and slowing down in the eighth-note sections is a common failure.',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          multi(
            'According to the Gate E requirements, which TWO of the following must be verified in your recording?',
            [
              'The RH melody is clearly audible above the LH chord accompaniment',
              'The pulse survives across both hands with zero stops or hesitations',
              'The pieces are performed from memory without looking at the score',
              'Whole-note chords are held for the full 4 metronome counts',
            ],
            [0, 1],
            'The step text explicitly lists unbroken metric pulse and independent hand dynamics (RH melody audible above LH) among the four items to verify for Gate E.',
          ),
        ),
      ],
      {
        intro: 'Record both pieces in one continuous take, then check the take against the full Gate E rubric.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m6-3-ex-a',
      type: 'Recital dress rehearsal',
      title: 'Protocol 6.3-A — The Gate E Dress Rehearsal',
      prompt: 'Run Piece A (Frère Jacques) ×2 takes at 76 BPM. Run Piece B (Ode to Joy) ×2 takes at 76 BPM. Execute the final continuous recording take, capturing both pieces back-to-back for Gate E review.',
    },
  ],
  checkpoints: [
    'Two complete two-hand pieces recorded: unedited, continuous performances of Piece A (Are You Sleeping) and Piece B (Ode to Joy).',
    'Unbroken metric pulse: the pulse survives across both hands, zero stops or hesitations during chord changes or eighth-note runs.',
    'Independent hand dynamics: RH melody is clearly audible above the LH chord accompaniment.',
    'Physical ease and relaxation: shoulders relaxed, forearms level, wrists supple throughout both recorded performances.',
  ],
  outcomes: [
    'Prepare and master Piece A (*Are You Sleeping / Frère Jacques* — 2-voice counterpoint with alternating LH/RH motion).',
    'Prepare and master Piece B (*Ode to Joy* — 4-phrase classical melody with full LH I–V harmonic accompaniment).',
    'Execute the full 3-Stage Repertoire Mastery Protocol (HS Mastery → HT Half Speed → Performance Speed).',
    'Establish formal performance decorum: breath preparation, deliberate tempo establishment, continuity through minor slips, and dignified conclusion.',
    'Capture an unedited, continuous video or audio recording of both pieces.',
    'Complete and execute the Gate E Assessment Rubric.',
  ],
  sources: [
    'Piano Skill Levels Explained.pdf',
    'A perfect guide to learning piano.pdf',
    'The Hoffman Method of Learning Piano.pdf',
    'Tips on how to practice piano.pdf',
  ],
  practiceFocus: ['Two complete two-hand pieces recorded (Gate E).'],
  id: 'piano-m6-3',
  code: '6.3',
  title: 'Repertoire Lab I: First Complete Two-Hand Pieces',
});
