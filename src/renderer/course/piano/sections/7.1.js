/**
 * Section 7.1 — Note Values, Rests, Dots, Ties, and Rhythm Words
 * Module 7 — Time
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_07_Time/
 * Section_7.1_Values_Rests_Dots_Ties_Words.md).
 *
 * First reuse of the rhythm() block since Section 3.1 (blocks.js's
 * renderers.rhythm, confirmed real there) — `pattern` is an array of
 * beat-duration numbers (4=whole, 3=dotted half, 2=half, 1.5=dotted
 * quarter, 1=quarter, 0.5=eighth, 0.25=sixteenth), which maps exactly onto
 * this section's own proportional-tree teaching, so lessons 7.1.1, 7.1.2,
 * and 7.1.4 each get a real playable rhythm() demo instead of a static
 * table alone. The renderer's own NAMES map (blocks.js:330) only labels
 * 4/3/2/1.5/1/0.5/0.25 — confirmed before using 0.25 for the sixteenth-note
 * pattern in 7.1.2, since anything outside that map falls back to printing
 * the raw number.
 *
 * No asserts this section — every claim here is a rhythmic/durational fact
 * (note-value proportions, rest symbols, dot arithmetic, tie-vs-slur
 * mechanics), and the theory oracle's three assert kinds (pcSet, interval,
 * keySignature) only check pitch and key-signature claims, not durations —
 * same zero-assert category as 3.1's rhythm-only content.
 *
 * Check-drafting provenance: 12/12 questions passed shape + entailment on
 * the first attempt.
 */
import { module_, lesson, step, prose, table, callout, rhythm, sources, mcq, multi, order, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l7-1-1',
      'Beat Invariance vs. Fractional Note Values',
      [
        step(
          'The Pulse Never Changes — the Notes Divide It',
          [
            prose(
              'While the underlying tempo pulse stays completely steady, like the ticks of a clock, note values represent exact mathematical fractions of that pulse: a Whole note (4 beats) equals 2 Half notes (2 beats each), which equals 4 Quarter notes (1 beat each), which equals 8 Eighth notes (1/2 beat each), which equals 16 Sixteenth notes (1/4 beat each).',
            ),
            rhythm(
              [4],
              {
                title: 'Whole Note — 4 Beats',
                bpm: 80,
                caption: 'One note, four beats, no subdivision.',
              },
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the text, how many sixteenth notes equal one whole note?',
            ['4', '8', '12', '16'],
            3,
            'The step text states that one whole note equals 16 sixteenth notes as part of the successive mathematical fractions of the steady tempo pulse.',
          ),
        ),
        step(
          'Each Tier Halves the One Above It',
          [
            prose(
              'Every tier of the rhythm tree divides the tier above it exactly in half — that 1:2 ratio is the entire proportional system. Whole → Half → Quarter → Eighth → Sixteenth, each step exactly twice as fast as the last.',
            ),
            rhythm(
              [1, 1, 1, 1],
              {
                title: 'Quarter Notes — 4 Beats Split Four Ways',
                bpm: 80,
                caption: 'The same 4 beats as the whole note above, now split into four equal pulses.',
              },
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the rhythm tree, how does each tier relate to the one above it?',
            [
              'It divides it by four',
              'It divides it exactly in half',
              'It adds half its value',
              'It doubles its speed without a fixed ratio',
            ],
            1,
            'The step text states that every tier of the rhythm tree divides the tier above it exactly in half — that 1:2 ratio is the entire proportional system.',
          ),
        ),
      ],
      {
        intro: 'The pulse stays steady; note values are just fractions of it, each tier exactly half the one before.',
      },
    ),
    lesson(
      'piano-l7-1-2',
      'Notehead Morphology and Flag Mechanics',
      [
        step(
          'Reading the Notehead Itself',
          [
            prose('Each note value has its own graphic shape, independent of pitch.'),
            table(
              ['Note Value', 'British Term', 'Graphic Elements', 'Count in 4/4'],
              [
                ['Whole Note', 'Semibreve', 'Hollow oval head, no stem', '"1-2-3-4" (hold 4 beats)'],
                ['Half Note', 'Minim', 'Hollow oval head, with stem', '"1-2" (hold 2 beats)'],
                ['Quarter Note', 'Crotchet', 'Solid oval head, with stem', '"1" (1 beat per click)'],
                [
                  'Eighth Note',
                  'Quaver',
                  'Solid head, stem, single flag/beam',
                  '"1-&" (2 notes per beat)',
                ],
                [
                  'Sixteenth Note',
                  'Semiquaver',
                  'Solid head, stem, double flag/beam',
                  '"1-e-&-a" (4 notes per beat)',
                ],
              ],
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the table, what is the graphic shape and count for a quarter note?',
            [
              'Hollow oval head with stem, counted "1-2"',
              'Solid oval head with stem, counted "1"',
              'Solid head with stem and single flag, counted "1-&"',
              'Hollow oval head no stem, counted "1-2-3-4"',
            ],
            1,
            'The step text table explicitly lists the quarter note (crotchet) as having a solid oval head with stem and the count "1" (1 beat per click).',
          ),
        ),
        step(
          'Beaming Consecutive Notes',
          [
            prose(
              'Consecutive eighth and sixteenth notes are joined with horizontal beams across beat boundaries to make the meter easier to read at a glance.',
            ),
            rhythm(
              [0.25, 0.25, 0.25, 0.25],
              {
                title: 'Four Sixteenth Notes — Beamed Together',
                bpm: 70,
                caption: 'Four sixteenths fill exactly one quarter-note beat: "1-e-&-a".',
              },
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          text(
            'How are consecutive eighth and sixteenth notes joined to make the meter easier to read?',
            ['beams', 'horizontal beams', 'with horizontal beams'],
            'The step text explicitly states that consecutive eighth and sixteenth notes are joined with horizontal beams across beat boundaries to make the meter easier to read at a glance.',
          ),
        ),
      ],
      {
        intro: 'How each note value looks on the page, from the hollow whole note to the double-flagged sixteenth.',
      },
    ),
    lesson(
      'piano-l7-1-3',
      'The Rests: Precision Silence',
      [
        step(
          'Every Note Value Has a Matching Rest',
          [
            prose(
              'A rest is precision silence — it holds a duration exactly like a note does, just with the key released instead of held.',
            ),
            table(
              ['Rest Type', 'Graphic Symbol', 'Execution Rule'],
              [
                [
                  'Whole Rest',
                  'Rectangular block, hanging below Line 4',
                  'Release key completely; silence for 4 full beats.',
                ],
                [
                  'Half Rest',
                  'Rectangular block, sitting on Line 3',
                  'Release key completely; silence for 2 full beats.',
                ],
                ['Quarter Rest', 'Squiggly vertical bolt', 'Silence for 1 beat.'],
                ['Eighth Rest', 'Stem with single dot/hook', 'Silence for 1/2 beat.'],
                ['Sixteenth Rest', 'Stem with double dot/hook', 'Silence for 1/4 beat.'],
              ],
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the table, how many full beats of silence does a half rest require?',
            ['4', '2', '1', '1/2'],
            1,
            'The step text states in the table that a half rest requires releasing the key completely for silence of 2 full beats.',
          ),
        ),
        step(
          'Silence Is Not "Nothing"',
          [
            prose(
              'A rest is counted with the exact same metric discipline as a note — the pulse does not pause just because no key is being pressed. Releasing the key completely and holding the silence for its full written value is as much a technical skill as playing the notes.',
            ),
            sources(['Building Rhythm Skills in the Beginning Musician.pdf']),
          ],
          mcq(
            'According to the text, how should a rest be counted compared to a note?',
            [
              'The pulse pauses until the next note',
              'With the exact same metric discipline as a note',
              'Only until the key is released',
              'With half the discipline required for notes',
            ],
            1,
            'The step text states that a rest is counted with the exact same metric discipline as a note and that the pulse does not pause just because no key is being pressed.',
          ),
        ),
      ],
      {
        intro: 'Rests hold duration exactly like notes do — with the key released instead of held.',
      },
    ),
    lesson(
      'piano-l7-1-4',
      'The Augmentation Dot (+50%)',
      [
        step(
          'The Dot Adds Half the Note’s Value',
          [
            prose(
              'The Augmentation Dot, placed directly to the right of a notehead, increases its duration by exactly half of its original value: Dotted Value = Base Value + (Base Value ÷ 2).',
            ),
            table(
              ['Dotted note', 'Base', 'Dot adds', 'Total'],
              [
                ['Dotted Half Note', '2 beats', 'half of 2 = 1 beat', '3 beats (fills a 3/4 measure)'],
                [
                  'Dotted Quarter Note',
                  '1 beat',
                  'half of 1 = 1/2 beat',
                  '1.5 beats (usually followed by a single eighth)',
                ],
                ['Dotted Whole Note', '4 beats', 'half of 4 = 2 beats', '6 beats'],
              ],
            ),
            sources(['Simple Meter Rhythm Chart.pdf']),
          ],
          mcq(
            'According to the step text, what is the total duration of a dotted half note?',
            ['2 beats', '3 beats', '4 beats', '1.5 beats'],
            1,
            'The step text states in its table that a dotted half note has a base of 2 beats, the dot adds 1 beat, for a total of 3 beats.',
          ),
        ),
        step(
          'Hearing the Dotted Half',
          [
            prose(
              'A dotted half note is the most common dotted value a beginner meets first — it fills an entire measure of 3/4 time exactly, with nothing left over.',
            ),
            rhythm(
              [3],
              {
                title: 'Dotted Half Note — 3 Beats',
                bpm: 80,
                caption: '2 beats (half note) + 1 beat (the dot) = 3 beats total.',
              },
            ),
            sources(['Simple Meter Rhythm Chart.pdf']),
          ],
          mcq(
            'According to the step text, what does a dotted half note exactly fill in 3/4 time?',
            [
              'An entire measure with nothing left over',
              'Two beats only',
              'One and a half beats',
              'A full measure plus an extra beat',
            ],
            0,
            'The step text states that a dotted half note fills an entire measure of 3/4 time exactly, with nothing left over.',
          ),
        ),
      ],
      { intro: 'A dot adds exactly half the note’s own value — never a flat extra beat.' },
    ),
    lesson(
      'piano-l7-1-5',
      'Ties vs. Slurs: Temporal Addition vs. Articulation',
      [
        step(
          'The Tie: Two Identical Pitches, One Sustained Duration',
          [
            prose(
              'Beginners frequently confuse ties and slurs because they are drawn with identical curved lines. A <b>Tie</b> connects two <i>identical</i> pitches — for example Middle C tied to Middle C. Mechanically, you strike only the first note and hold continuously through the duration of both notes without restriking. Its primary purpose is letting a note sustain across a barline.',
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'What is the primary purpose of a tie according to the text?',
            [
              'To connect notes of different pitches',
              'To let a note sustain across a barline',
              'To command smooth legato playing',
              'To shorten the duration of a note',
            ],
            1,
            `The step text states that a tie's primary purpose is letting a note sustain across a barline.`,
          ),
        ),
        step(
          'The Slur: Two or More Different Pitches, Smooth Legato',
          [
            prose(
              'A <b>Slur</b> connects two or more <i>differing</i> pitches — for example C to D to E. Mechanically, you play every enclosed note in smooth, connected legato, transferring arm weight from key to key without any silence between them.',
            ),
            table(
              ['', 'Tie', 'Slur'],
              [
                ['Connects', 'Two identical pitches', 'Two or more different pitches'],
                ['Action', 'Strike once, hold through both notes', 'Play all notes in smooth legato'],
                ['Purpose', 'Sustain duration across a barline', 'Command phrase articulation'],
              ],
            ),
            callout(
              'warning',
              'Never Restrike a Tied Note',
              'A tie unites pitches into one sustained duration — never strike the second tied note. Disconnecting notes under a slur is the opposite error: a slur commands unbroken legato, so do not lift between notes.',
            ),
            sources(['How To Read Rhythms in Music.pdf']),
          ],
          mcq(
            'According to the step, what is the mechanical action for notes connected by a slur?',
            [
              'Strike the first note only and hold through the rest',
              'Play every enclosed note in smooth connected legato, transferring arm weight without silence',
              'Strike each note separately with a slight gap',
              'Hold the last note only while ignoring the others',
            ],
            1,
            'The step text states that for a slur you play every enclosed note in smooth, connected legato, transferring arm weight from key to key without any silence between them.',
          ),
        ),
      ],
      {
        intro: 'Same curved line, two very different meanings — one is about duration, the other about touch.',
      },
    ),
    lesson(
      'piano-l7-1-6',
      'The Syllabic Rhythm Words System (Rhythm Words Guide)',
      [
        step(
          'Vocalizing Rhythm Before Playing It',
          [
            prose(
              'Vocalizing syllables synchronizes cognitive parsing with motor execution — saying a rhythm out loud before playing it makes the subdivision physically automatic.',
            ),
            table(
              ['Note Pattern', 'Numeric Count', 'Kodály Rhythm Word'],
              [
                ['Quarter Note', '"1"', 'Ta'],
                ['Two Eighth Notes', '"1-&"', 'Ti-Ti'],
                ['Four 16th Notes', '"1-e-&-a"', 'Ti-Ri-Ti-Ri (or Ta-Ka-Di-Mi)'],
                ['Half Note', '"1-2"', 'Too-oo'],
                ['Dotted Half Note', '"1-2-3"', 'Too-oo-oo'],
                ['Whole Note', '"1-2-3-4"', 'Toe-oe-oe-oe'],
              ],
            ),
            sources(['Rhythm Words Guide.pdf']),
          ],
          multi(
            'Which note values and their corresponding vocalizations are shown in the Rhythm Words Guide?',
            [
              'Quarter Note - Ta',
              'Two Eighth Notes - Ti-Ti',
              'Dotted Half Note - Too-oo-oo',
              'Whole Note - Toe-oe-oe-oe',
              'Half Note - Ti-Ri-Ti-Ri',
            ],
            [0, 1, 2, 3],
            `The step text's table explicitly pairs Quarter Note with Ta, Two Eighth Notes with Ti-Ti, Dotted Half Note with Too-oo-oo, and Whole Note with Toe-oe-oe-oe (Half Note is paired with Too-oo).`,
          ),
        ),
        step(
          'Metronomic Rhythm Clapping and Verbalization',
          [
            prose(
              'Protocol 7.1-A drills the whole system at once. Set the metronome to 60 BPM and clap-and-chant a 4-measure mixed rhythm study: M1 is Quarter (Ta), Quarter (Ta), Two Eighths (Ti-Ti), Quarter (Ta). M2 is a Dotted Half (Too-oo-oo) plus a Quarter Rest (silent). M3 is Four 16ths (Ti-Ri-Ti-Ri), Two Eighths (Ti-Ti), Half Note (Too-oo). M4 is a Whole Note (Toe-oe-oe-oe).',
            ),
            rhythm(
              [1, 1, 0.5, 0.5, 1],
              {
                title: 'Measure 1 of the Mixed Rhythm Study',
                bpm: 60,
                caption: 'Ta, Ta, Ti-Ti, Ta — quarter, quarter, two eighths, quarter.',
              },
            ),
            sources(['Rhythm Words Guide.pdf']),
          ],
          mcq(
            'What is the rhythm word sequence for the third measure (M3) in Protocol 7.1-A?',
            [
              'Ti-Ri-Ti-Ri, Ti-Ti, Too-oo',
              'Ti-Ti, Ti-Ri-Ti-Ri, Too-oo',
              'Too-oo-oo, silent',
              'Ta, Ta, Ti-Ti, Ta',
            ],
            0,
            'The step text explicitly states that M3 is Four 16ths (Ti-Ri-Ti-Ri), Two Eighths (Ti-Ti), Half Note (Too-oo).',
          ),
        ),
      ],
      { intro: 'The Kodály syllable system — say the rhythm, then play it.' },
    ),
  ],
  exercises: [
    {
      id: 'piano-m7-1-ex-a',
      type: 'Rhythm clapping drill',
      title: 'Protocol 7.1-A — Metronomic Rhythm Clapping & Verbalization',
      prompt: 'Set metronome to 60 BPM. Clap and chant the 4-measure mixed rhythm study: M1 Quarter (Ta), Quarter (Ta), Two Eighths (Ti-Ti), Quarter (Ta). M2 Dotted Half (Too-oo-oo), Quarter Rest (silent). M3 Four 16ths (Ti-Ri-Ti-Ri), Two Eighths (Ti-Ti), Half Note (Too-oo). M4 Whole Note (Toe-oe-oe-oe).',
    },
  ],
  checkpoints: [
    'Subdivision Tree: can draw the complete rhythm tree from Whole Note down to 16th Notes from memory.',
    'Dot Arithmetic: can calculate the exact beat duration of a dotted half note (3 beats) and dotted quarter note (1.5 beats).',
    'Tie vs. Slur Identification: can point to a score and instantly distinguish a rhythmic tie from an articulation slur.',
    'Rhythm Word Fluency: can clap and chant Ta, Ti-Ti, and Ti-Ri-Ti-Ri at 60 BPM with zero hesitations.',
  ],
  outcomes: [
    'Calculate the mathematical proportions of the Western rhythm tree: Whole (4), Half (2), Quarter (1), Eighth (1/2), and Sixteenth (1/4).',
    'Execute all corresponding rest symbols with strict metric discipline.',
    `Apply the mathematical rule of the Augmentation Dot: a dot extends a note's duration by exactly 50% (1/2) of its original value.`,
    'Distinguish visually and mechanically between a Tie (uniting identical pitches into a single sustained duration) and a Slur (commanding smooth legato connection across differing pitches).',
    'Vocalize rhythmic patterns using the standardized Rhythm Words Guide syllabic system (Ta, Ti-Ti, Ti-Ri-Ti-Ri / Takadimi).',
  ],
  sources: [
    'How To Read Rhythms in Music.pdf',
    'Building Rhythm Skills in the Beginning Musician.pdf',
    'Simple Meter Rhythm Chart.pdf',
    'Rhythm Words Guide.pdf',
  ],
  practiceFocus: [
    'Clap and say rhythm words for whole through eighth, plus one dotted and one tied example.',
  ],
  id: 'piano-m7-1',
  code: '7.1',
  title: 'Note Values, Rests, Dots, Ties, and Rhythm Words',
});
