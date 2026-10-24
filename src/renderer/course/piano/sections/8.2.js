/**
 * Section 8.2 — Articulation: Legato, Staccato, Slurs, Accents, and Tenuto
 * Module 8 — Touch and Expression
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_08_Touch_And_Expression/
 * Section_8.2_Articulation_Legato_Staccato_Accents.md).
 *
 * Zero asserts — articulation and touch technique are physical facts,
 * outside all three theory-oracle assert kinds (pcSet/interval/
 * keySignature).
 *
 * Check-drafting provenance: 10/10 questions passed shape + entailment on
 * the first attempt, with no defects found on manual review — the first
 * section this batch with a clean pass.
 */
import { module_, lesson, step, prose, table, callout, sources, mcq, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l8-2-1',
      'Legato: The Art of Weight Transfer',
      [
        step(
          'The Overlap Illusion',
          [
            prose(
              '<b>Legato</b> (Italian for "bound" or "tied together") is the foundational touch of piano playing. True finger legato requires transferring gravitational arm weight from one fingertip to the next, identical to walking: as Finger 2 descends into its keybed, Finger 1 releases its key at the exact microsecond of touchdown.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'What does the text state is required for true finger legato?',
            [
              'Using the sustain pedal to connect notes',
              'Transferring gravitational arm weight from one fingertip to the next',
              'Striking keys with a rigid wrist',
              'Playing each note with isolated finger strength',
            ],
            1,
            'The step text states that true finger legato requires transferring gravitational arm weight from one fingertip to the next, identical to walking.',
          ),
        ),
        step(
          'The Pedal Trap',
          [
            prose(
              'Beginners often play with disconnected, choppy fingers while stomping on the sustain pedal to fake a legato line. This creates a muddy, blurred acoustic wash.',
            ),
            callout(
              'warning',
              'Legato Must Live in the Fingers First',
              'The sustain pedal cannot substitute for true finger legato. Master finger legato first; add pedal only as acoustic resonance.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'According to the text, what should a beginner master before adding the sustain pedal?',
            [
              'Choppy finger playing',
              'Disconnected staccato notes',
              'True finger legato',
              'Acoustic resonance',
            ],
            2,
            'The step text states: "Master finger legato first; add pedal only as acoustic resonance."',
          ),
        ),
      ],
      {
        intro: 'Connected sound comes from finger-weight transfer, not from the sustain pedal.',
      },
    ),
    lesson(
      'piano-l8-2-2',
      'Staccato: The Elastic Rebound',
      [
        step(
          'Half the Written Value',
          [
            prose(
              '<b>Staccato</b> (Italian for "detached" or "separated") is indicated by a small dot placed directly above or below a notehead — not to be confused with an augmentation dot to the right. A staccato note sounds for approximately half of its written value, with the remaining time filled by silent air.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'What does a staccato marking indicate about note duration?',
            [
              'The note is held for its full written value',
              'The note sounds for approximately half of its written value',
              'The note is held longer than its written value',
              'The note is played with a heavy accent',
            ],
            1,
            'The step text states that a staccato note sounds for approximately half of its written value, with the remaining time filled by silent air.',
          ),
        ),
        step(
          'The Elastic Rebound Motion',
          [
            prose(
              'Staccato is executed not by stabbing downward, but by rebounding rapidly upward off the keytop, like touching a hot stove. The wrist acts as an elastic spring.',
            ),
            callout(
              'warning',
              'Crisp Silence, Not a Blur',
              'Blurring staccato notes together with poor finger release is a common anti-pattern. Staccato requires crisp silence between consecutive key strikes.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'How is staccato executed according to the instructions?',
            [
              'By stabbing downward into the keys',
              'By rebounding rapidly upward off the keytop',
              'By pressing and holding each key firmly',
              'By using the sustain pedal for separation',
            ],
            1,
            'The step text states that staccato is executed not by stabbing downward, but by rebounding rapidly upward off the keytop, like touching a hot stove.',
          ),
        ),
      ],
      { intro: 'Detached sound comes from an upward rebound, not a downward stab.' },
    ),
    lesson(
      'piano-l8-2-3',
      'Slur vs. Tie: The Definitive Comparison',
      [
        step(
          'Two Curved Lines, Two Different Meanings',
          [
            table(
              ['', 'Slur (Phrase Mark)', 'Tie (Rhythmic Addition)'],
              [
                ['Connects', 'Different pitches (e.g., C → D → E)', 'Identical pitches (e.g., C → C)'],
                [
                  'Instruction',
                  'Play connected legato; lift gently at the end of the line',
                  'Hold continuously for the sum of both note values; do NOT restrike',
                ],
              ],
            ),
            sources(['How to Read Music Essential Tips for Beginners.pdf']),
          ],
          mcq(
            'According to the table, what does a slur connect?',
            [
              'Identical pitches',
              'Different pitches',
              'The same note value twice',
              'Only notes with accents',
            ],
            1,
            'The step text states that a slur connects different pitches (e.g., C → D → E).',
          ),
        ),
        step(
          'The Two-Note Slur: Drop and Lift',
          [
            prose(
              'When two notes are enclosed in a short slur (e.g., E → D), drop arm weight into note 1 (accented), then float the wrist gently upward off note 2 (soft release).',
            ),
            sources(['How to Read Music Essential Tips for Beginners.pdf']),
          ],
          mcq(
            'According to the given instruction, when performing two notes under a short slur such as E → D, what should you do on the second note?',
            [
              'Drop arm weight into it with an accent',
              'Float the wrist gently upward for a soft release',
              'Hold it for extra duration like a tie',
              'Play it with a light elastic rebound',
            ],
            1,
            'The step text explicitly states to drop arm weight into note 1 (accented), then float the wrist gently upward off note 2 (soft release).',
          ),
        ),
      ],
      {
        intro: 'The same curved line means two structurally different things depending on whether the pitches match.',
      },
    ),
    lesson(
      'piano-l8-2-4',
      'Accents (>) and Tenuto (-)',
      [
        step(
          'The Accent (>)',
          [
            prose(
              'The accent demands sudden, sharp dynamic prominence. It is delivered by dropping a concentrated burst of forearm mass into the key; the wrist must absorb the shock to prevent harsh clatter.',
            ),
            callout(
              'warning',
              `Drop, Don't Slap`,
              'Slapping keys from above to make an accent causes harsh clatter. Accents come from arm mass dropped from the key surface, not an airborne slap.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'How is an accent produced according to the text?',
            [
              'By slapping the key from above with the fingers',
              'By dropping a concentrated burst of forearm mass into the key',
              'By using a rigid wrist strike',
              'By an airborne slap from above the key surface',
            ],
            1,
            'The step text states that the accent is delivered by dropping a concentrated burst of forearm mass into the key, with the wrist absorbing the shock, and explicitly contrasts this with slapping from above or an airborne slap.',
          ),
        ),
        step(
          'Tenuto (-)',
          [
            prose(
              'Tenuto — a horizontal line over the notehead — demands that the note be held for its absolute maximum duration with a warm, heavy, lingering touch.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          text(
            `What does the tenuto marking demand for the note's duration?`,
            ['absolute maximum', 'maximum', 'full duration', 'its absolute maximum duration'],
            'The step text states that tenuto demands the note be held for its absolute maximum duration.',
          ),
        ),
      ],
      {
        intro: 'Two markings that both add weight, but in opposite directions: a sudden burst versus a sustained lean.',
      },
    ),
    lesson(
      'piano-l8-2-5',
      'The "One Phrase, Three Articulations" Study',
      [
        step(
          'Take 1 vs. Take 2: All Legato vs. All Staccato',
          [
            prose(
              'The lab phrase is C(1)-D(2)-E(3)-F(4) | G(5)-F(4)-E(3)-D(2) | C(1) in C Major. In Take 1 (all legato), the connection is smooth and unbroken — hands glide like oil, with zero silence between notes. In Take 2 (all staccato), every note is a crisp, detached, spring-like rebound — a light, playful droplet.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'In the lab phrase for C Major, how is the connection described in Take 1 (all legato)?',
            [
              'Crisp and detached with spring-like rebounds',
              'Smooth and unbroken with hands gliding like oil',
              'Light and playful like droplets',
              'With accents using arm mass',
            ],
            1,
            'The step text states that in Take 1 (all legato), the connection is smooth and unbroken — hands glide like oil, with zero silence between notes.',
          ),
        ),
        step(
          'Take 3: Mixed Articulation',
          [
            prose(
              'Take 3 applies a different articulation to each part of the same phrase: Measure 1 is a legato slur (C-D-E-F); Measure 2 has staccato dots on G and F, tenuto on E, and an accent (>) on the final C.',
            ),
            table(
              ['Phrase location', 'Articulation'],
              [
                ['Measure 1 (C-D-E-F)', 'Legato slur'],
                ['G, F (start of Measure 2)', 'Staccato'],
                ['E (Measure 2)', 'Tenuto'],
                ['Final C', 'Accent'],
              ],
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'According to the table in the step text, what articulation is applied to the final C in Measure 2?',
            ['Staccato', 'Tenuto', 'Legato slur', 'Accent'],
            3,
            `The step text's table explicitly states that the Final C receives an Accent (>).`,
          ),
        ),
      ],
      {
        intro: 'The same four-bar phrase played three ways, ending with all four articulations mixed inside one take.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m8-2-ex-a',
      type: 'Articulation drill',
      title: 'Protocol 8.2-A — Articulation Transformation Drill',
      prompt: 'Set metronome to 72 BPM. Play the C Major Pentascale (C-D-E-F-G-F-E-D-C) three times consecutively: Run 1 pure legato, Run 2 pure staccato, Run 3 as two-note slurs ([C-D] → [E-F] → G).',
    },
  ],
  checkpoints: [
    'Legato Transfer: can demonstrate continuous finger-weight transfer without any audible gaps or pedal assistance.',
    'Staccato Rebound: can execute crisp, detached staccato notes using an elastic wrist rebound.',
    'Slur / Tie Clarity: can look at a score and identify which curved lines are slurs and which are ties.',
    'Dynamic Accent Control: can execute an accented note within a quiet passage without tensing the shoulder or locking the wrist.',
  ],
  outcomes: [
    'Produce true physical Legato through overlapping finger-weight transfer without relying on a sustain pedal.',
    'Execute Staccato utilizing a light, elastic rebound from the keybed.',
    'Distinguish notationally and mechanically between a Slur (legato phrase mark), a Tie (duration addition), and a Phrase Mark.',
    'Execute dynamic Accents (>) and sustained Tenuto (-) markings using arm mass rather than rigid wrist strikes.',
    'Perform the "One Phrase, Three Articulations" diagnostic study at a steady metronomic tempo.',
  ],
  sources: [
    'Musical terms for piano.pdf',
    'Piano Skill Levels Explained.pdf',
    'How to Read Music Essential Tips for Beginners.pdf',
    '25 Classical Music Terms Finally Explained in Plain English',
  ],
  practiceFocus: ['One phrase three articulations.'],
  id: 'piano-m8-2',
  code: '8.2',
  title: 'Articulation: Legato, Staccato, Slurs, Accents, and Tenuto',
});
