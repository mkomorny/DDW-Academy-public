/**
 * Section 6.1 — The Method: Separate, Then Together, Then Musical
 * Module 6 — Two Hands
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_06_Two_Hands/
 * Section_6.1_The_Method_Separate_Together_Musical.md), read in full before
 * authoring. Authored together with 5.1, 5.2, and 5.3 in one chained
 * sitting per Miranda's explicit one-time request — see 5.1.js's header for
 * the full one-off-chaining note. This section alone does NOT complete
 * Module 6 (Sections 6.2 and 6.3 are still scaffold-only), so Level 6 is
 * NOT wired this batch — per the plan's wiring rule, a level is wired only
 * once every module in it has real lessons.
 *
 * Conversion notes:
 * - No `asserts` anywhere in this file: every claim in this section is
 *   procedural/technique-only (practice sequencing, touch quality,
 *   rhythmic counting, error isolation), not a scale/chord spelling, an
 *   interval size, or a key signature — the same category of zero-assert
 *   content as 3.1 and 4.1's headers already document, for the same
 *   reason.
 * - Lesson 6.1.3's blocked-LH-chord content reuses `chordExplorer('C',
 *   'maj')` as a direct visual tie back to Section 5.3's Tonic chord,
 *   rather than re-describing the chord in prose alone.
 * - Fixed a callout-budget advisory on lesson 6.1.1 (1/4 = 25%, over the
 *   20% budget) the same way 4.1.6 and 4.2.5 did — added one more prose
 *   sentence rather than removing the callout, since the callout is the
 *   section's own stated "Conservatory Law" and genuinely warrants being
 *   set apart.
 * - Check-drafting provenance: all 10 step checks were drafted via the xAI
 *   client, all verified on the first entailment attempt (mcq only — no
 *   multi/order/text kind fit this section's content as well as single-
 *   answer recall did).
 */
import { module_, lesson, step, prose, table, list, callout, chordExplorer, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l6-1-1',
      'Why Premature Hands-Together Practice Fails',
      [
        step(
          'Cognitive Saturation',
          [
            prose(
              '<p>When an untrained student attempts to play a new piece with both hands simultaneously from the very first reading, the brain experiences neurological cognitive saturation: reading the RH part, reading the LH part, assigning RH finger numbers, assigning LH finger numbers, and maintaining the pulse, all at once, adds up to total breakdown. The consequence: the student stumbles, pauses erratically, misses fingerings, and embeds permanent tension.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'What is the consequence of an untrained student attempting to play a new piece hands-together from the first reading?',
            [
              'The student learns the piece faster',
              'The student stumbles, pauses erratically, misses fingerings, and embeds permanent tension',
              'The student develops perfect pulse maintenance',
              'The brain easily handles all tasks at once',
            ],
            1,
            'The step text explicitly states that attempting both hands simultaneously from the first reading leads to neurological cognitive saturation, with the consequence that the student stumbles, pauses erratically, misses fingerings, and embeds permanent tension.',
          ),
        ),
        step(
          'The Conservatory Law',
          [
            prose(
              '<p>Skipping straight to hands-together practice is the single most common cause of stalled progress in beginner two-hand repertoire — the fix is procedural, not talent-related.</p>',
            ),
            callout(
              'key',
              'Never combine hands before each hand is secure alone',
              '<p>Never combine hands until each hand can play its respective part independently with zero hesitation while the student counts aloud.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the step, what is the single most common cause of stalled progress in beginner two-hand repertoire?',
            [
              'Lack of talent',
              'Skipping straight to hands-together practice',
              'Not counting aloud',
              'Playing too fast',
            ],
            1,
            'The step text explicitly states that "Skipping straight to hands-together practice is the single most common cause of stalled progress in beginner two-hand repertoire."',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l6-1-2',
      'The 3-Stage Practice Loop',
      [
        step(
          'RH Secure, Then LH Secure',
          [
            prose(
              '<p>The systematic 3-Stage Practice Loop starts with each hand mastered completely alone. Step 1 — RH Secure: play RH alone 3 consecutive times with zero mistakes at 72 BPM. Step 2 — LH Secure: play LH alone 3 consecutive times with zero mistakes at 72 BPM.</p>',
            ),
            table(
              ['Stage', 'What Happens'],
              [
                [
                  '1 — Hands Separate (HS)',
                  'RH plays melody with zero technical hesitation at target tempo; LH plays accompaniment with automaticity and correct fingering.',
                ],
                [
                  '2 — Hands Together (HT), Hyper-Slow',
                  'Reduce tempo by 50%. Focus 100% on vertical alignment — which notes strike together.',
                ],
                [
                  '3 — Musical Integration',
                  'Bring the piece to performance tempo; balance melody over accompaniment.',
                ],
              ],
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the 3-Stage Practice Loop, what must be achieved in the first two steps before moving to hands together?',
            [
              'Play each hand 3 times correctly at 72 BPM with zero mistakes',
              'Play each hand at half tempo with perfect alignment',
              'Play the full piece at performance tempo with musical balance',
              'Count subdivisions aloud while playing both hands together',
            ],
            0,
            'The step text states that the systematic 3-Stage Practice Loop starts with each hand mastered completely alone, specifically Step 1 — RH Secure: play RH alone 3 consecutive times with zero mistakes at 72 BPM and Step 2 — LH Secure: play LH alone 3 consecutive times with zero mistakes at 72 BPM.',
          ),
        ),
        step(
          'HT at Half Speed',
          [
            prose(
              '<p>Step 3 — HT at Half Speed: set the metronome to 40 BPM. Analyze every vertical intersection — on Beat 1, do both hands play together? On Beat 2, does the RH move while the LH holds? Increment the tempo by 4 BPM only after achieving 3 perfect takes.</p>',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          mcq(
            'According to the step, what must you achieve before increasing the metronome speed?',
            ['3 perfect takes', '5 perfect takes', '1 perfect take', '10 perfect takes'],
            0,
            'The step text explicitly states to increment the tempo by 4 BPM only after achieving 3 perfect takes.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l6-1-3',
      'Textural Independence: Legato RH vs. Blocked LH',
      [
        step(
          'Smooth Legato RH, Blocked LH',
          [
            prose(
              '<p>True independence requires hands to execute different physical touch qualities simultaneously. RH plays a smooth, connected 5-finger legato (C–D–E–F–G), with tone weight transferred finger to finger. LH strikes a blocked C triad on Beat 1, releases cleanly on Beat 2, strikes again on Beat 3, and releases on Beat 4 — a crisp downstroke and clean vertical release.</p>',
            ),
            chordExplorer(
              'C',
              'maj',
              {
                caption: 'The blocked LH chord in this exercise — C Major, struck and released cleanly.',
              },
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'What does the left hand do on beats 2 and 4 in this exercise?',
            [
              'Strikes the blocked C triad',
              'Releases cleanly',
              'Plays a smooth legato',
              'Transfers tone weight',
            ],
            1,
            'The step text states that the LH strikes a blocked C triad on Beat 1, releases cleanly on Beat 2, strikes again on Beat 3, and releases on Beat 4.',
          ),
        ),
        step(
          'The Biomechanical Check',
          [
            callout(
              'warning',
              'The RH line must not stumble',
              '<p>The crisp release of the LH must NOT cause the RH legato line to disconnect or stumble.</p>',
            ),
            sources(['Piano hand exercises.pdf']),
          ],
          mcq(
            'According to the step text, what must the crisp release of the LH NOT cause in the RH line?',
            ['A stumble or disconnection', 'A change in dynamics', 'Faster tempo', 'Louder volume'],
            0,
            'The step text explicitly states that the crisp release of the LH must NOT cause the RH legato line to disconnect or stumble.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l6-1-4',
      'The Rhythmic Grid: Counting Aloud Through Asymmetry',
      [
        step(
          'The Together/Alone Mental Model',
          [
            prose(
              '<p>When coordinating two hands, counting aloud provides the external structural grid that holds both motor patterns together. Categorize every rhythmic event into one of three states: TOGETHER — both hands strike at the exact same instant. RIGHT ALONE — the right hand moves while the left hand holds or rests. LEFT ALONE — the left hand moves while the right hand holds or rests.</p>',
            ),
            sources(['How to read piano notes for beginners.pdf']),
          ],
          mcq(
            'According to the step, what does counting aloud provide when coordinating two hands?',
            [
              'A way to play faster than 50% tempo',
              'The external structural grid that holds both motor patterns together',
              'A method to avoid using the 3-Stage Practice Loop',
              'A substitute for isolating micro-segments',
            ],
            1,
            'The step text states that when coordinating two hands, counting aloud provides the external structural grid that holds both motor patterns together.',
          ),
        ),
        step(
          'The Vertical Alignment Grid',
          [
            table(
              ['Beat', 'Count Aloud', 'RH Melody', 'LH Harmony', 'Alignment'],
              [
                ['1', '"ONE"', 'E (Quarter)', 'C (Eighth)', 'TOGETHER'],
                ['&', '', '', 'G (Eighth)', 'LH ALONE'],
                ['2', '"TWO"', 'D (Quarter)', 'C (Eighth)', 'TOGETHER'],
                ['&', '', '', 'G (Eighth)', 'LH ALONE'],
              ],
              'Vertical Alignment Grid, 4/4 time.',
            ),
            sources(['5 effective warm-up exercises.pdf']),
          ],
          mcq(
            'According to the Vertical Alignment Grid, on beat 1 what does the LH play at the same time as the RH E quarter note?',
            ['C eighth', 'G eighth', 'Nothing', 'Both C and G'],
            0,
            'The grid explicitly shows beat 1 with C (Eighth) under LH Harmony aligned with the RH E (Quarter) under TOGETHER.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l6-1-5',
      'Micro-Segment Isolation Protocol',
      [
        step(
          'Stop and Isolate',
          [
            prose(
              '<p>When a specific measure breaks down during hands-together practice, the systematic response is:</p>',
            ),
            list(
              [
                'Stop immediately — do not finish the piece and do not restart from Measure 1.',
                'Isolate the micro-segment — identify the exact 1-measure or 2-beat boundary where the collision occurs.',
              ],
              true,
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'When a specific measure breaks down during hands-together practice, what is the first step of the systematic response?',
            [
              'Restart the entire piece from Measure 1',
              'Stop immediately and do not finish the piece',
              'Slow down and keep playing through the error',
              'Count subdivisions aloud while continuing',
            ],
            1,
            'The step text explicitly states: Stop immediately — do not finish the piece and do not restart from Measure 1.',
          ),
        ),
        step(
          'Repeat, Re-Integrate, and the Gate Checklist',
          [
            list(
              [
                'Execute 5 perfect repetitions — play that isolated micro-segment at 40 BPM 5 consecutive times without error.',
                'Re-integrate — play the preceding measure, through the micro-segment, into the subsequent measure.',
              ],
              true,
            ),
            callout(
              'warning',
              'Three more common two-hand practice traps',
              '<p>Practicing hands together at full speed before each hand is secure separately — always reduce tempo to half-speed the first time hands combine. Playing hands slightly out of sync ("flamming" the downbeat) — both hands must strike vertical unisons at the exact identical millisecond. Resetting to the beginning of the song whenever a mistake occurs — isolate the specific 1-bar error instead; never re-practice what is already easy.</p>',
            ),
            table(
              ['Self-Assessment Item', 'What to Verify'],
              [
                [
                  '3-Stage Protocol Articulation',
                  'Can explain why practicing hands separately first is mandatory for motor encoding.',
                ],
                [
                  'Together/Alone Categorization',
                  'Can look at a 4-bar grand staff score and label every note attack as "Together", "Right Alone", or "Left Alone".',
                ],
                [
                  'Textural Contrast',
                  'Can play a smooth legato RH line while LH executes detached blocked chords without stumbling.',
                ],
                [
                  'Micro-Isolation Discipline',
                  'Demonstrates the habit of stopping immediately on an error to loop a single measure at half speed.',
                ],
              ],
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the step text, what must you do the first time the hands combine?',
            [
              'Play at full speed',
              'Reduce tempo to half-speed',
              'Play hands slightly out of sync',
              'Reset to the beginning on any mistake',
            ],
            1,
            'The step text states that you must always reduce tempo to half-speed the first time hands combine to avoid the trap of practicing hands together at full speed before each hand is secure separately.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m6-1-ex-a',
      type: 'Coordination drill',
      title: 'Protocol 6.1-A — The 3-Stage HS/HT Consolidation Loop',
      prompt: 'Select a 4-measure two-hand study. Stage 1: play RH alone at 72 BPM x3 clean takes. Stage 2: play LH alone at 72 BPM x3 clean takes. Stage 3: combine HT at 45 BPM, counting aloud "Together, Right, Together, Left."',
    },
  ],
  checkpoints: [
    '3-Stage Protocol Articulation: Can explain why practicing hands separately first is mandatory for motor encoding.',
    'Together/Alone Categorization: Can look at a 4-bar grand staff score and label every note attack as "Together", "Right Alone", or "Left Alone".',
    'Textural Contrast: Can play a smooth legato RH line while LH executes detached blocked chords without stumbling.',
    'Micro-Isolation Discipline: Demonstrates the habit of stopping immediately on an error to loop a single measure at half speed.',
  ],
  outcomes: [
    'Explain why premature hands-together practice causes cognitive overload and encodes motor errors.',
    'Execute the rigorous 3-Stage Practice Loop: RH Secure → LH Secure → HT at 50% Tempo.',
    'Perform basic textural independence: executing smooth *legato* in the Right Hand while the Left Hand plays detached *staccato* or *blocked chords*.',
    'Count subdivisions aloud continuously while both hands execute asymmetrical rhythmic patterns.',
    'Isolate single-measure and single-beat micro-segments when coordination breaks down.',
  ],
  sources: [
    'Tips on how to practice piano.pdf',
    'How to read piano notes for beginners.pdf',
    '5 effective warm-up exercises.pdf',
    'Piano hand exercises.pdf',
  ],
  practiceFocus: ['One phrase HS then HT at half speed.'],
  id: 'piano-m6-1',
  code: '6.1',
  title: 'The Method: Separate, Then Together, Then Musical',
});
