/**
 * Section 7.2 — Simple Meters: 2/4, 3/4, and 4/4
 * Module 7 — Time
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_07_Time/
 * Section_7.2_Simple_Meters_2_4_3_4_4_4.md).
 *
 * Continues 7.1's use of rhythm() for the metric weight patterns — each
 * meter's STRONG/weak hierarchy is shown as a real playable click pattern
 * at a fixed beat count (2, 3, or 4 quarter notes) rather than only the
 * source's static ASCII bar. The renderer has no per-note accent/velocity
 * control (confirmed again this section — same limitation 3.1 already
 * documented for its echo-clap patterns), so the STRONG/weak distinction is
 * taught through prose and the table's own wording, not through the
 * playback itself.
 *
 * No asserts this section — metric/time-signature facts are outside all
 * three of the theory oracle's assert kinds (pcSet, interval, keySignature
 * only checks key signatures, not time signatures), matching 7.1's
 * zero-assert rationale.
 *
 * Two AI-drafted MCQs were hand-fixed before splicing (caught in manual
 * review, not by any validator): 7.2.2 step 1 and 7.2.4 step 1 each had a
 * distractor option that restated the exact same STRONG/weak/MEDIUM weight
 * sequence as the marked-correct answer, differing only by omitting the
 * source's decorative labels ("downbeat", "secondary accent", "up-step") —
 * the same non-discriminating-criterion defect class 5.2 first surfaced,
 * recurring here in a new shape (a redundant distractor, not a redundant
 * correct answer). Fixed by rewriting each offending distractor into a
 * genuinely different (wrong) weight assignment before splicing.
 *
 * Check-drafting provenance: 10/10 questions passed shape + entailment on
 * the first attempt (2 hand-fixed afterward, per above).
 */
import { module_, lesson, step, prose, table, callout, rhythm, sources, mcq, multi, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l7-2-1',
      'The Anatomy of the Metric Fraction',
      [
        step(
          'Two Stacked Numbers, Two Different Jobs',
          [
            prose(
              'A time signature consists of two numbers stacked vertically, and each one answers a different question. The <b>top number</b> (numerator) tells you the exact number of beats contained within every measure between barlines. The <b>bottom number</b> (denominator) tells you which note value represents a single beat: 4 = Quarter Note, 2 = Half Note, 8 = Eighth Note.',
            ),
            table(
              ['Position', 'Question it answers'],
              [
                ['Top number', 'HOW MANY beats per measure? (2, 3, 4…)'],
                ['Bottom number', 'WHICH NOTE gets one beat? (4 = quarter note)'],
              ],
            ),
            sources(['Simple Meter Rhythm Chart.pdf']),
          ],
          mcq(
            'What does the bottom number in a time signature tell you?',
            [
              'How many beats are in each measure',
              'Which note value gets one beat',
              'How many measures are in the piece',
              'The speed of the music',
            ],
            1,
            'The step text states that the bottom number (denominator) tells you which note value represents a single beat: 4 = Quarter Note, 2 = Half Note, 8 = Eighth Note.',
          ),
        ),
        step(
          'Reading 2/4, 3/4, and 4/4 at a Glance',
          [
            table(
              ['Meter', 'Beats per measure', 'Weight pattern'],
              [
                ['2/4 (Duple)', '2', 'STRONG — weak'],
                ['3/4 (Triple)', '3', 'STRONG — weak — weak'],
                ['4/4 (Quadruple)', '4', 'STRONG — weak — MEDIUM — weak'],
              ],
            ),
            sources(['Simple Meter Rhythm Chart.pdf']),
          ],
          mcq(
            'According to the table, what is the weight pattern for 3/4 (Triple) meter?',
            [
              'STRONG — weak',
              'STRONG — weak — weak',
              'STRONG — weak — MEDIUM — weak',
              'STRONG — MEDIUM — weak — weak',
            ],
            1,
            'The step text explicitly lists the weight pattern for 3/4 (Triple) as STRONG — weak — weak in the table.',
          ),
        ),
      ],
      {
        intro: 'The top number counts beats; the bottom number says which note is worth one beat.',
      },
    ),
    lesson(
      'piano-l7-2-2',
      '4/4 Time (Common Time C)',
      [
        step(
          'The Most Common Meter in Western Music',
          [
            prose(
              '4/4 is the most ubiquitous meter in Western music: 4 quarter-note beats per measure, often indicated by the letter C for "Common Time." Its metric weight hierarchy runs Beat 1 (downbeat, strong) → Beat 2 (weak) → Beat 3 (secondary accent, medium) → Beat 4 (weak).',
            ),
            rhythm(
              [1, 1, 1, 1],
              {
                title: '4/4 — STRONG weak MEDIUM weak',
                bpm: 80,
                caption: 'Four quarter-note beats, the longest single note (a whole note) fills the entire measure.',
              },
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, what is the metric weight hierarchy in 4/4 meter?',
            [
              'Beat 1 (weak) → Beat 2 (strong) → Beat 3 (medium) → Beat 4 (weak)',
              'Beat 1 (strong) → Beat 2 (medium) → Beat 3 (weak) → Beat 4 (weak)',
              'Beat 1 (downbeat, strong) → Beat 2 (weak) → Beat 3 (secondary accent, medium) → Beat 4 (weak)',
              'Beat 1 (strong) → Beat 3 (medium) → Beat 2 (weak) → Beat 4 (weak)',
            ],
            2,
            'The step text explicitly states the hierarchy as Beat 1 (downbeat, strong) → Beat 2 (weak) → Beat 3 (secondary accent, medium) → Beat 4 (weak).',
          ),
        ),
        step(
          'The Whole Note Fits Exactly',
          [
            prose(
              `Because 4/4 has 4 beats and a whole note lasts exactly 4 beats, a whole note fills an entire measure of 4/4 with nothing left over — this is the only simple meter where that's true.`,
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          text(
            'How many beats does a whole note last in 4/4 time?',
            ['4', 'four'],
            'The step text states that because 4/4 has 4 beats and a whole note lasts exactly 4 beats, it fills an entire measure of 4/4.',
          ),
        ),
      ],
      {
        intro: 'Four beats, letter C for Common Time, and the only simple meter a whole note fits exactly.',
      },
    ),
    lesson(
      'piano-l7-2-3',
      '3/4 Time: The Lilting Waltz Weight',
      [
        step(
          'The Archetypal Triple Meter',
          [
            prose(
              '3/4 is the archetypal Triple Meter: 3 quarter-note beats per measure, with a metric hierarchy of Beat 1 (heavy downbeat) → Beat 2 (light/lift) → Beat 3 (light/forward motion). Unlike the "square," symmetrical feel of 4/4, 3/4 has a circular, rolling momentum — the waltz feel.',
            ),
            rhythm(
              [1, 1, 1],
              {
                title: '3/4 — STRONG weak weak',
                bpm: 90,
                caption: 'Three quarter-note beats: a heavy downbeat followed by two light lifting beats.',
              },
            ),
            sources(['3-4 Time Signature.pdf']),
          ],
          mcq(
            'According to the text, what is the metric hierarchy in 3/4 triple meter?',
            [
              'Beat 1 (heavy) → Beat 2 (medium) → Beat 3 (weak)',
              'Beat 1 (heavy downbeat) → Beat 2 (light/lift) → Beat 3 (light/forward motion)',
              'Beat 1 (strong) → Beat 2 (weak) → Beat 3 (medium)',
              'Beat 1 (light) → Beat 2 (heavy) → Beat 3 (light)',
            ],
            1,
            'The step text explicitly states the hierarchy as Beat 1 (heavy downbeat) → Beat 2 (light/lift) → Beat 3 (light/forward motion).',
          ),
        ),
        step(
          'Whole Notes Are Mathematically Impossible',
          [
            prose(
              'A Dotted Half Note (3 beats) fills an entire measure of 3/4 exactly. A whole note (4 beats) cannot fit in a 3-beat measure at all — whole notes are mathematically impossible in 3/4 time.',
            ),
            callout(
              'key',
              'Capacity Limit',
              '3/4 time has only 3 beats per measure, so the longest note that can ever fit is a dotted half note (3 beats) — a whole note, at 4 beats, will never appear alone in a 3/4 measure.',
            ),
            sources(['3-4 Time Signature.pdf']),
          ],
          mcq(
            'What is the longest note that can fit in a single measure of 3/4 time?',
            ['A whole note', 'A dotted half note', 'A half note', 'A quarter note'],
            1,
            'The step text states that a dotted half note (3 beats) fills an entire measure of 3/4 exactly and is the longest note that can ever fit, while a whole note (4 beats) is mathematically impossible in 3/4 time.',
          ),
        ),
      ],
      {
        intro: 'Three beats, a heavy downbeat, and a rolling waltz momentum — with a hard 3-beat ceiling on any single note.',
      },
    ),
    lesson(
      'piano-l7-2-4',
      '2/4 Time: The Binary March Pulse',
      [
        step(
          'The Archetypal Simple Duple Meter',
          [
            prose(
              `2/4 is the archetypal Simple Duple Meter: 2 quarter-note beats per measure, with a metric hierarchy of Beat 1 (strong downbeat) → Beat 2 (weak up-step). It's the meter behind marches (Sousa), ragtime (Scott Joplin's <i>The Entertainer</i>), polkas, and ballets.`,
            ),
            rhythm(
              [1, 1],
              {
                title: '2/4 — STRONG weak',
                bpm: 100,
                caption: 'Two quarter-note beats: a strong downbeat, then a weak up-step — the walking/marching feel.',
              },
            ),
            sources(['2-4 Time Signature.pdf']),
          ],
          mcq(
            'What is the metric hierarchy in 2/4 Simple Duple Meter?',
            [
              'Beat 1 (weak) → Beat 2 (strong)',
              'Beat 1 (strong) → Beat 2 (medium) → Beat 3 (weak)',
              'Beat 1 (strong) → Beat 2 (weak) → Beat 3 (medium) → Beat 4 (weak)',
              'Beat 1 (strong downbeat) → Beat 2 (weak up-step)',
            ],
            3,
            'The step text explicitly states that 2/4 has a metric hierarchy of Beat 1 (strong downbeat) → Beat 2 (weak up-step).',
          ),
        ),
        step(
          'The Half Note Fits Exactly',
          [
            prose(
              'Because 2/4 has 2 beats and a half note lasts exactly 2 beats, a half note fills an entire measure of 2/4 with nothing left over — the shortest "fills the whole measure" note value of the three simple meters in this section.',
            ),
            sources(['2-4 Time Signature.pdf']),
          ],
          text(
            'What is the shortest note value that fills an entire measure in 2/4 time?',
            ['half note', 'half'],
            'The step text states that because 2/4 has 2 beats and a half note lasts exactly 2 beats, a half note fills an entire measure of 2/4 with nothing left over and is the shortest such note value.',
          ),
        ),
      ],
      {
        intro: 'Two beats, a strong-weak marching pulse, and a half note that fills the whole measure exactly.',
      },
    ),
    lesson(
      'piano-l7-2-5',
      'Distinguishing 2/4 vs. 4/4: Metric Cycle Length',
      [
        step(
          'Same Weak-Strong Feel, Different Cycle Length',
          [
            prose(
              '2/4 and 4/4 can feel deceptively similar at a glance — both start every measure with a strong downbeat. The real difference is cycle length: 2/4 is a short 2-beat cycle where every downbeat has maximum power (simulating walking or marching feet). 4/4 is a long 4-beat cycle where Beat 3 carries a secondary, softer accent than Beat 1.',
            ),
            table(
              ['2/4 Duple Meter', '4/4 Quadruple Meter'],
              [
                [
                  'Short 2-beat cycle: STRONG–weak | STRONG–weak',
                  'Long 4-beat cycle: STRONG–weak–Medium–weak',
                ],
                ['Every downbeat has maximum power', 'Beat 3 has a secondary, softer accent than Beat 1'],
              ],
            ),
            sources(['Simple Meter Rhythm Chart.pdf']),
          ],
          mcq(
            'According to the text, what is the key difference between 2/4 and 4/4 time signatures?',
            [
              'Both have the same cycle length but different downbeat strengths',
              '2/4 has a short 2-beat cycle with maximum power on every downbeat while 4/4 has a long 4-beat cycle with a secondary softer accent on beat 3',
              '4/4 starts with a weaker downbeat than 2/4',
              'They feel identical because both start every measure with a strong downbeat',
            ],
            1,
            'The step text explicitly states that the real difference is cycle length: 2/4 is a short 2-beat cycle where every downbeat has maximum power while 4/4 is a long 4-beat cycle where Beat 3 carries a secondary, softer accent than Beat 1.',
          ),
        ),
        step(
          'Mistakes to Avoid Across All Three Meters',
          [
            prose(
              'Two anti-patterns apply across 2/4, 3/4, and 4/4 alike: attempting to fit a whole note into 2/4 or 3/4 (mathematically illegal — use a half or dotted half instead), and playing every beat at identical volume, which erases the metric hierarchy that makes the meter audible in the first place.',
            ),
            callout(
              'warning',
              'Beat 1 Must Always Be Grounded',
              'Music requires metric hierarchy — Beat 1 must always be dynamically grounded relative to the weaker beats around it, or the meter becomes a mechanical flat line with no audible pulse.',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, what should you use instead of attempting to fit a whole note into 2/4 or 3/4 time?',
            [
              'A whole note tied to another note',
              'A half note or dotted half note',
              'Two half notes',
              'A quarter note tied over the barline',
            ],
            1,
            'The step text explicitly states that attempting to fit a whole note into 2/4 or 3/4 is mathematically illegal and instructs to use a half or dotted half instead.',
          ),
        ),
      ],
      {
        intro: `Both start strong, but 2/4's cycle is half as long as 4/4's — and every meter shares the same two failure modes.`,
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m7-2-ex-a',
      type: 'Metric conducting drill',
      title: 'Protocol 7.2-A — Metric Conducting and Tapping Circuit',
      prompt: '2/4 March at 80 BPM: tap foot on Beat 1 (firm), clap on Beat 2 (light) — "ONE-two, ONE-two." 3/4 Waltz: tap foot on Beat 1 (firm down), clap on Beats 2 and 3 (light up) — "ONE-two-three." 4/4 Common: tap foot on Beat 1 (heavy), tap left knee on Beat 2, clap on Beat 3 (medium), tap right knee on Beat 4 — "ONE-two-THREE-four."',
    },
  ],
  checkpoints: [
    'Fraction Literacy: can explain what the top and bottom numbers mean in 2/4, 3/4, and 4/4.',
    'Capacity Limits: knows that a whole note cannot exist in 3/4 or 2/4 time.',
    'Metric Weighting: can demonstrate the audible dynamic difference between a 3/4 waltz downbeat and its subsequent two beats.',
  ],
  outcomes: [
    'Decode the mathematical anatomy of any simple time signature fraction (Beats Per Measure/Note Value Receiving One Beat).',
    'Execute 4/4 Quadruple Meter (Common Time C) applying the STRONG–weak–medium–weak metric weight pattern.',
    'Execute 3/4 Triple Meter (Waltz Time) applying the asymmetrical STRONG–weak–weak lilting dance weight pattern.',
    'Execute 2/4 Duple Meter (March Time) applying the binary STRONG–weak walking weight pattern.',
    'Contrast 2/4 vs. 4/4 meter by analyzing the presence vs. absence of secondary metric sub-accents.',
  ],
  sources: [
    '2-4 Time Signature.pdf',
    '3-4 Time Signature.pdf',
    'Simple Meter Rhythm Chart.pdf',
    'Building Rhythm Skills in the Beginning Musician.pdf',
  ],
  practiceFocus: ['One phrase in 2/4, one in 3/4, one in 4/4.'],
  id: 'piano-m7-2',
  code: '7.2',
  title: 'Simple Meters: 2/4, 3/4, and 4/4',
});
