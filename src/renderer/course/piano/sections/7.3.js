/**
 * Section 7.3 — Compound Meter (6/8), Straight, Swing, and Syncopation
 * Module 7 — Time
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_07_Time/
 * Section_7.3_Compound_Meter_Straight_Swing_Syncopation.md).
 *
 * Completes Module 7 (Time) — see index.js for the Level 7 wiring this
 * batch adds (no new gate: Module 7 has none of its own per the plan's
 * gate-mapping table, the next gate, Gate F, belongs to Module 8).
 *
 * Zero asserts, matching 7.1/7.2's precedent: compound-vs-simple meter,
 * straight/swing proportion, and syncopation are durational/stylistic
 * facts, outside all three theory-oracle assert kinds (pcSet/interval/
 * keySignature). First reuse of rhythm() with the 1.5 (dotted-quarter)
 * duration value since it was confirmed against the renderer's NAMES map
 * in Section 7.1 — used here for 7.3.1's two-macro-beat 6/8 diagram.
 *
 * One hand-fixed check-drafting defect before splicing: piano-l7-3-5's
 * step 2 was originally drafted as a multi() with all four options
 * (including a redundant "All of the above") marked correct, because the
 * step's source sentence lists every genre it names without excluding any
 * other by name. Rewritten with two genuine distractors not stated in
 * this step's own text (techno is named elsewhere, as Straight Rhythm's
 * home) so the check actually discriminates.
 *
 * Check-drafting provenance: 10/10 questions passed shape + entailment on
 * the first attempt; 1 of the 10 was then hand-rewritten for the defect
 * above before splicing.
 */
import { module_, lesson, step, prose, table, callout, rhythm, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l7-3-1',
      'Compound Meter: The Beat Divides in Three',
      [
        step(
          'Simple Meter vs. Compound Meter',
          [
            prose(
              'Meters are categorized by how their primary beat divides. In <b>Simple Meter</b> (bottom number 4), the beat is a standard quarter note, which naturally divides into <b>two</b> equal parts (2 eighth notes). In <b>Compound Meter</b> (bottom number 8), the primary pulse is a <b>dotted note</b> — a dotted quarter note — which naturally divides into <b>three</b> equal parts (3 eighth notes).',
            ),
            table(
              ['Meter type', 'Bottom number', 'Beat unit', 'Natural division'],
              [
                ['Simple', '4', 'Quarter note (♩)', '2 equal parts (2 eighth notes)'],
                ['Compound', '8', 'Dotted quarter note (♩.)', '3 equal parts (3 eighth notes)'],
              ],
            ),
            sources(['Compound Meter Guide.pdf']),
          ],
          mcq(
            'According to the step text, what is the natural division of the primary beat in Compound Meter?',
            [
              '2 equal parts (2 eighth notes)',
              '3 equal parts (3 eighth notes)',
              '4 equal parts (4 sixteenth notes)',
              '1 dotted half note',
            ],
            1,
            'The step text states that in Compound Meter (bottom number 8), the primary pulse is a dotted quarter note which naturally divides into three equal parts (3 eighth notes).',
          ),
        ),
        step(
          '6/8 as Two Big Pulses',
          [
            prose(
              '6/8 has 2 macro-beats per measure, each a dotted quarter note, and each macro-beat divides into three eighth notes. Counted aloud, the weight pattern is: <b>ONE</b> - two - three - <b>FOUR</b> - five - six.',
            ),
            rhythm([1.5, 1.5], { caption: '6/8: two dotted-quarter macro-beats per measure.' }),
            sources(['Compound Meter Guide.pdf']),
          ],
          mcq(
            'How many macro-beats are in each measure of 6/8 time?',
            ['Three', 'Two', 'Six', 'One'],
            1,
            'The step text explicitly states that 6/8 has 2 macro-beats per measure, each a dotted quarter note.',
          ),
        ),
      ],
      {
        intro: 'Why 6/8 is a different metric species from 3/4, not just a bigger version of it.',
      },
    ),
    lesson(
      'piano-l7-3-2',
      'The Great Ambiguity: 3/4 vs. 6/8',
      [
        step(
          'Same Six Eighth Notes, Different Feel',
          [
            prose(
              'Both 3/4 and 6/8 contain exactly six eighth notes per measure, yet they sound and feel completely different because of how those six notes group.',
            ),
            table(
              ['', '3/4 Time (Simple Triple)', '6/8 Time (Compound Duple)'],
              [
                ['Grouping', 'Three groups of two', 'Two groups of three'],
                ['Felt as', 'A 3-beat waltz: 1-2-3 | 1-2-3', 'A 2-beat rolling lilt: 1--2-- | 1--2--'],
                [
                  'Examples',
                  'Für Elise, Schubert Waltzes, Amazing Grace',
                  'Hallelujah (Cohen), Silent Night, Sea Shanties',
                ],
              ],
            ),
            sources(['3-4 Time Signature.pdf']),
          ],
          mcq(
            'According to the step text, how does 6/8 time group its six eighth notes per measure?',
            ['Three groups of two', 'Two groups of three', 'One group of six', 'Six groups of one'],
            1,
            `The step text's table explicitly states that 6/8 Time groups as "Two groups of three".`,
          ),
        ),
        step(
          'Counting the Ambiguity Correctly',
          [
            prose(
              'A common mistake is counting 6/8 as six slow, individual quarter-note beats. 6/8 is a <b>duple</b> meter felt in two big pulses, each subdivided into three.',
            ),
            callout(
              'warning',
              'Six Beats Is the Wrong Mental Model',
              '6/8 is a DUPLE meter felt in TWO big pulses: ONE-two-three, TWO-two-three — not six separate quarter-note beats.',
            ),
            sources(['3-4 Time Signature.pdf']),
          ],
          mcq(
            'How should 6/8 time actually be felt and counted according to the text?',
            [
              'Six slow individual quarter-note beats',
              'Three big pulses each subdivided into two',
              'Two big pulses each subdivided into three',
              'One big pulse subdivided into six eighth notes',
            ],
            2,
            'The step text states that 6/8 is a duple meter felt in two big pulses, each subdivided into three, and gives the model ONE-two-three, TWO-two-three.',
          ),
        ),
      ],
      {
        intro: '3/4 and 6/8 share a note count but not a feel — this is the single most confusable pair in beginner meter reading.',
      },
    ),
    lesson(
      'piano-l7-3-3',
      'Straight Rhythmic Subdivisions',
      [
        step(
          'Equal Division of the Beat',
          [
            prose(
              'In <b>Straight Rhythm</b>, every division of the beat receives an identical, mathematically equal slice of time. In 4/4, each eighth note is exactly 50% of the quarter-note beat.',
            ),
            rhythm(
              [0.5, 0.5, 0.5, 0.5],
              { caption: 'Four straight eighth notes — each exactly 50% of the beat.' },
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'In Straight Rhythm, what percentage of the quarter-note beat does each eighth note receive?',
            ['25%', '33%', '50%', '75%'],
            2,
            'The step text states that in 4/4, each eighth note is exactly 50% of the quarter-note beat.',
          ),
        ),
        step(
          `Straight Rhythm's Musical Home`,
          [
            prose(
              'Straight rhythm provides the grounded, driving pulse of classical sonatinas, modern pop, and techno.',
            ),
            table(
              ['Style area', 'What straight rhythm gives it'],
              [
                ['Classical', 'The grounded, driving pulse of sonatinas'],
                ['Modern pop', 'Even, precisely divided eighth-note grooves'],
                ['Techno', 'Mechanically exact, evenly quantized eighths'],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the table, what does straight rhythm provide to modern pop?',
            [
              'The grounded, driving pulse of sonatinas',
              'Even, precisely divided eighth-note grooves',
              'Mechanically exact, evenly quantized eighths',
              'A long-short lilt using DU-bah',
            ],
            1,
            `The step text's table explicitly states that straight rhythm gives modern pop "Even, precisely divided eighth-note grooves".`,
          ),
        ),
      ],
      {
        intro: 'The mathematically even baseline against which swing will be defined by contrast.',
      },
    ),
    lesson(
      'piano-l7-3-4',
      'Swing Rhythmic Subdivisions (DU-bah)',
      [
        step(
          'Asymmetrical Eighth Notes',
          [
            prose(
              'In <b>Swing Rhythm</b>, the two eighth notes sharing a beat are asymmetrical: the on-beat eighth note is held longer, and the off-beat eighth note is shorter.',
            ),
            table(
              ['Eighth note', 'Proportional allocation'],
              [
                ['On-beat', '≈66% of the beat (2 triplet parts)'],
                ['Off-beat', '≈33% of the beat (1 triplet part)'],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'In swing rhythm, what is the approximate proportional allocation of the on-beat eighth note?',
            [
              '50% of the beat',
              '≈66% of the beat (2 triplet parts)',
              '≈33% of the beat (1 triplet part)',
              '100% of the beat',
            ],
            1,
            'The step text states that in Swing Rhythm the on-beat eighth note is held longer with ≈66% of the beat (2 triplet parts).',
          ),
        ),
        step(
          'The DU-bah Chant',
          [
            prose('Swing is internalized by chanting aloud with the metronome: "DU-bah DU-bah DU-bah DU-bah."'),
            callout(
              'tip',
              'Swing Is a Feel, Not a Formula',
              'Swing is a rhythmic feel, not a rigid mathematical rule. It is internalized through listening and chanting, not decimal counting.',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'How is swing primarily internalized according to the text?',
            [
              'By counting in decimals',
              'By chanting "DU-bah DU-bah DU-bah DU-bah" with the metronome',
              'By using a rigid mathematical formula',
              'By listening only without chanting',
            ],
            1,
            'The step text states that swing is internalized by chanting aloud with the metronome: "DU-bah DU-bah DU-bah DU-bah."',
          ),
        ),
      ],
      {
        intro: 'The long-short lilt that separates a swung groove from a straight one, taught by ear rather than by fraction.',
      },
    ),
    lesson(
      'piano-l7-3-5',
      'Syncopation: Dynamic Off-Beat Emphasis',
      [
        step(
          'Accenting the Off-Beat',
          [
            prose(
              '<b>Syncopation</b> occurs when a rhythmic accent or dynamic attack is placed where the listener does NOT expect it — on an off-beat or unaccented subdivision, rather than on the downbeat.',
            ),
            table(
              ['Pattern', 'Beat 1', '&', 'Beat 2', '&', 'Beat 3', '&'],
              [
                ['Straight (accents on the beat)', '>', '', '>', '', '>', ''],
                ['Syncopated (accents on the "and")', '', '>', '', '>', '', '>'],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the step text, syncopation occurs when a rhythmic accent is placed where?',
            [
              'On the downbeat',
              'On an off-beat or unaccented subdivision',
              'Only on beat 1',
              'On every subdivision equally',
            ],
            1,
            'The step text states that syncopation occurs when a rhythmic accent or dynamic attack is placed where the listener does NOT expect it — on an off-beat or unaccented subdivision, rather than on the downbeat.',
          ),
        ),
        step(
          'Where Syncopation Comes From',
          [
            prose(
              'Syncopation has deep genre roots: Ragtime (Scott Joplin), Latin / Bossa Nova, Funk, Jazz, and contemporary pop all rely on off-beat accents as a core stylistic device.',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          multi(
            'Which TWO of the following are named in the step text as genre roots of syncopation?',
            ['Ragtime', 'Funk', 'Classical minuets', 'Techno'],
            [0, 1],
            `The step text explicitly names Ragtime (Scott Joplin) and Funk among syncopation's genre roots; classical minuets and techno are not mentioned in this step's text (techno appears elsewhere, as an example of Straight Rhythm).`,
          ),
        ),
      ],
      {
        intro: 'Deliberately placing weight where it is not expected, and where the technique actually comes from historically.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m7-3-ex-a',
      type: 'Metric switching drill',
      title: 'Protocol 7.3-A — 3/4 vs. 6/8 Metric Switching Drill',
      prompt: 'Set metronome to 60 BPM. Execute 3/4 (3 clicks per measure): clap on each click, saying "ONE-two-three, ONE-two-three." Execute 6/8 (2 clicks per measure): each click is now a dotted quarter note — subdivide each click into 3 equal triplets, saying "ONE-two-three, FOUR-five-six."',
    },
  ],
  checkpoints: [
    'Compound vs. Simple Definition: can explain why 3/4 divides in two while 6/8 divides in three.',
    'Swing Chant: can execute the DU-bah swing chant along with a 72 BPM metronome.',
    'Syncopated Attack: can clap a rhythm that accents the off-beat "and" while tapping a steady downbeat with the foot.',
  ],
  outcomes: [
    'Define Compound Meter as a time structure where the primary macro-beat divides into three equal subdivisions (dotted quarter-note beat unit).',
    'Distinguish aurally and structurally between 3/4 Time (3 beats of 2 eighths) and 6/8 Time (2 beats of 3 eighths).',
    'Execute Straight Eighth Notes (equal 50%/50% time allocation).',
    'Execute Swing Eighth Notes (long-short lilt using the DU-bah vocalization).',
    'Identify and execute Syncopated Accents falling on the unaccented up-beats or between-beat subdivisions.',
  ],
  sources: [
    'Compound Meter Guide.pdf',
    '3-4 Time Signature.pdf',
    'Building Rhythm Skills in the Beginning Musician.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Feel 6/8 vs 3/4; one straight and one swing eight-bar loop.'],
  id: 'piano-m7-3',
  code: '7.3',
  title: 'Compound Meter (6/8), Straight, Swing, and Syncopation',
});
