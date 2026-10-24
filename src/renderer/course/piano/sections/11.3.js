/**
 * Section 11.3 — Four-Note Chords: The Seventh Chord Family and Shell Voicings
 * Module 11 — Chords and Harmony
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_11_Chords_And_Harmony/
 * Section_11.3_Four_Note_Chords_The_Seventh_Family.md), read in full before
 * authoring. Third section of Module 11 — authored together with 11.4, 12.1,
 * and 12.2 under Miranda's second explicit chaining instruction ("do the
 * next 4 steps in one pass," the eighth such documented exception). This
 * section alone does NOT complete Module 11 (11.4 remains), so Level 11
 * stays unwired after this batch.
 *
 * Conversion notes:
 * - First live use of `chordExplorer(root, 'maj7'/'min7'/'dom7'/'min7b5'/
 *   'dim7')` — all five seventh-chord type ids confirmed present in
 *   CHORD_TYPES (lib/theory.js:181-185) before authoring, matching the
 *   source's own five-archetype intro banner even though Lesson 11.3.2's
 *   own title says "Four Standard Sevenths" (its source table lists four;
 *   the fifth, Fully Diminished, is introduced in the intro banner and the
 *   Protocol 11.3-A mutation drill, so it's folded into 11.3.2's second step
 *   rather than invented — the source does state it, just not in that one
 *   table).
 * - 11.3.1's tritone claim (G7's 3rd-to-7th interval, B→F) gets a real
 *   `interval` assert (6 semitones) alongside a `pcSet` assert for G7 itself.
 * - 11.3.2's four/five chord qualities each get a `pcSet` assert built
 *   directly from CHORD_TYPES' own interval arrays: dom7 [0,4,7,10], maj7
 *   [0,4,7,11], min7 [0,3,7,10], min7b5 [0,3,6,10], dim7 [0,3,6,9] — the
 *   fully-diminished spelling (C-E♭-G♭-B♭♭) uses a double-flat note name,
 *   confirmed parseable by `parseNote()`'s repeated-accidental regex before
 *   use (interval asserts only accept a single accidental character, but
 *   pcSet's `notes` array has no such limit).
 * - 11.3.4's shell-voicing ii⁷-V⁷-Imaj⁷ progression uses `progression()`
 *   for the first time in this course — its own chord-symbol parser
 *   (renderers.progression, views/blocks.js:672-680) already maps 'm7',
 *   '7', and 'maj7' suffixes to min7/dom7/maj7, confirmed before use. It
 *   plays root-position triads/tetrads, not the source's own shell (3+7)
 *   voicing — that physical voicing stays in the accompanying table, same
 *   "block for the harmony, table for the exact hand shape" split 10.2 used
 *   for its cadence comparison.
 * - 11.3.3's fingering chart has no theory-oracle equivalent and stays
 *   prose + table only, same treatment as every prior fingering-only lesson.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, chordExplorer, progression, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l11-3-1',
      'Why Four Notes? Tension, Color, and Voice Movement',
      [
        step(
          'The Tritone Engine',
          [
            prose(
              '<p>A 3-note triad provides basic harmonic identity, but adding a 7th interval introduces active internal dissonance — a "gravitational harmonic pull." In a dominant seventh chord such as G7 (G-B-D-F), the interval between the 3rd (B) and the 7th (F) is an unstable Tritone (6 semitones). The B (leading tone) pulls up by half step to C, while the F pulls down by half step to E, resolving with strong satisfaction into the Tonic (C Major).</p>',
            ),
            chordExplorer('G', 'dom7', { caption: 'G7 — the tritone between B (3rd) and F (7th) is the chord’s active tension engine.' }),
            table(
              ['Note', 'Role in G7', 'Resolves to'],
              [
                ['B', '3rd (leading tone)', 'up a half step to C'],
                ['F', '7th', 'down a half step to E'],
              ],
            ),
            sources(['Piano chords every beginner should know.pdf', 'Different Chord Types and How to Make Them']),
          ],
          mcq(
            'In the G7 chord, what is the specific interval between the 3rd (B) and the 7th (F) that creates unstable dissonance?',
            ['A perfect fifth', 'A tritone', 'A major third', 'A minor seventh'],
            1,
            'The step text states that in G7 the interval between the 3rd (B) and the 7th (F) is an unstable Tritone (6 semitones).',
          ),
          [
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7, 10], notes: ['G', 'B', 'D', 'F'] },
            { assert: 'interval', from: 'B3', to: 'F4', semitones: 6 },
          ],
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l11-3-2',
      'The Four Standard Sevenths Catalog',
      [
        step(
          'Dominant 7th vs. Major 7th',
          [
            prose(
              '<p>A Dominant 7th (symbol 7, formula 1-3-5-♭7) is built from a Major Triad plus a minor 7th — C7 = C-E-G-B♭, sounding bluesy, energetic, and strongly resolving. A Major 7th (symbol maj7, formula 1-3-5-7) is built from a Major Triad plus a major 7th — Cmaj7 = C-E-G-B, sounding warm, dreamy, and lush. The two are easy to confuse: a Dominant 7th always uses a flat 7 (B♭), while a Major 7th uses the natural leading tone (B♮).</p>',
            ),
            chordExplorer('C', 'dom7', { caption: 'C7 — Major Triad + minor 7th.' }),
            chordExplorer('C', 'maj7', { caption: 'Cmaj7 — Major Triad + major 7th.' }),
            sources(['Piano chords every beginner should know.pdf', 'Different Chord Types and How to Make Them']),
          ],
          mcq(
            'According to the step, what is the formula and example given for a Dominant 7th chord?',
            ['1-3-5-7, Cmaj7 = C-E-G-B', '1-3-5-♭7, C7 = C-E-G-B♭', '1-3-5-7, C7 = C-E-G-B', '1-3-5-♭7, Cmaj7 = C-E-G-B'],
            1,
            'The step text explicitly states that a Dominant 7th has formula 1-3-5-♭7 and example C7 = C-E-G-B♭.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7, 10], notes: ['C', 'E', 'G', 'Bb'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7, 11], notes: ['C', 'E', 'G', 'B'] },
          ],
        ),
        step(
          'Minor 7th, Half-Diminished, and Fully Diminished',
          [
            prose(
              '<p>A Minor 7th (symbol m7, formula 1-♭3-5-♭7) is a Minor Triad plus a minor 7th — Cm7 = C-E♭-G-B♭, sounding smooth, mellow, and neo-soul/modal. A Half-Diminished 7th (symbol m7♭5 or ø7, formula 1-♭3-♭5-♭7) is a Diminished Triad plus a minor 7th — Cø7 = C-E♭-G♭-B♭, sounding dark and melancholic — this is the minor ii⁷ chord. A Fully Diminished 7th (symbol °7, formula 1-♭3-♭5-♭♭7) is a Diminished Triad plus a diminished 7th — C°7 = C-E♭-G♭-B♭♭, the most tense and unstable of the five archetypes.</p>',
            ),
            chordExplorer('C', 'min7', { caption: 'Cm7 — Minor Triad + minor 7th.' }),
            chordExplorer('C', 'min7b5', { caption: 'Cø7 (Cm7♭5) — Diminished Triad + minor 7th.' }),
            chordExplorer('C', 'dim7', { caption: 'C°7 — Diminished Triad + diminished 7th.' }),
            table(
              ['Chord type', 'Symbol', 'Construction formula', 'Example', 'Aural sensation'],
              [
                ['Dominant 7', '7', '1-3-5-♭7', 'C-E-G-B♭', 'Bluesy, energetic, strongly resolving'],
                ['Major 7', 'maj7', '1-3-5-7', 'C-E-G-B', 'Warm, dreamy, lush, jazz/lo-fi ballad'],
                ['Minor 7', 'm7', '1-♭3-5-♭7', 'C-E♭-G-B♭', 'Smooth, mellow, neo-soul/modal'],
                ['Half-Diminished', 'm7♭5 / ø7', '1-♭3-♭5-♭7', 'C-E♭-G♭-B♭', 'Dark, melancholic, minor ii⁷ chord'],
                ['Fully Diminished', '°7', '1-♭3-♭5-♭♭7', 'C-E♭-G♭-B♭♭', 'Most tense and unstable of the five'],
              ],
            ),
            sources(['How to play jazz chords on piano.pdf', 'Different Chord Types and How to Make Them']),
          ],
          multi(
            'Which two statements about half-diminished and fully diminished 7th chords are directly supported by the text?',
            [
              'A half-diminished 7th uses the formula 1-♭3-♭5-♭7 and sounds dark and melancholic',
              'A fully diminished 7th uses the formula 1-♭3-♭5-♭7 and is the most tense and unstable',
              'A half-diminished 7th is also called the minor ii⁷ chord',
              'A fully diminished 7th adds a diminished 7th to a diminished triad',
            ],
            [0, 2],
            'The step text explicitly states that a Half-Diminished 7th (formula 1-♭3-♭5-♭7) sounds dark and melancholic and is the minor ii⁷ chord, while a Fully Diminished 7th uses 1-♭3-♭5-♭♭7.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 7, 10], notes: ['C', 'Eb', 'G', 'Bb'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 6, 10], notes: ['C', 'Eb', 'Gb', 'Bb'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 6, 9], notes: ['C', 'Eb', 'Gb', 'Bbb'] },
          ],
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l11-3-3',
      'Four-Note Chord Fingering',
      [
        step(
          'Right Hand and Left Hand Fingering for Close-Position Sevenths',
          [
            prose(
              '<p>When playing all 4 notes of a close-position seventh chord: the Right Hand uses Finger 1 on the Root, Finger 2 on the 3rd, Finger 3 or 4 on the 5th, and Finger 5 on the 7th. The Left Hand uses Finger 5 on the Root, Finger 4 or 3 on the 3rd, Finger 2 on the 5th, and Finger 1 on the 7th.</p>',
            ),
            table(
              ['Hand', 'Root', '3rd', '5th', '7th'],
              [
                ['RH', '1', '2', '3 or 4', '5'],
                ['LH', '5', '4 or 3', '2', '1'],
              ],
            ),
            sources(['How to play jazz chords on piano.pdf']),
          ],
          mcq(
            'According to the step text, which finger does the left hand use on the 7th of a close-position seventh chord?',
            ['Finger 5', 'Finger 2', 'Finger 1', 'Finger 4 or 3'],
            2,
            'The step text states that the Left Hand uses Finger 1 on the 7th (as shown in the provided table).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l11-3-4',
      'Shell Voicings (3 + 7): Professional Texture Economy',
      [
        step(
          'Guide Tones: Stripping the Chord to 3rd and 7th',
          [
            prose(
              '<p>Playing dense 4-note chords in the lower register causes muddy acoustic dissonance. Professional pianists strip the chord down to its Guide Tones — the 3rd and the 7th. The 3rd tells the ear whether the chord is major or minor; the 7th defines its functional quality (dominant, major, or minor). The 5th is harmonically neutral and can be completely omitted. In a shell voicing, the Left Hand plays the low root in the bass while the Right Hand plays only the 3rd and 7th in the middle register.</p>',
            ),
            progression(['Dm7', 'G7', 'Cmaj7'], { numerals: ['ii⁷', 'V⁷', 'Imaj⁷'], caption: 'The shell-voicing ii⁷–V⁷–Imaj⁷ progression in C Major.' }),
            table(
              ['Chord', 'LH bass', 'RH shell (3rd + 7th)', 'Fingers'],
              [
                ['Dm7', 'D (low root)', 'F (3rd) + C (7th)', 'Fingers 1 + 5'],
                ['G7', 'G (low root)', 'F (7th) + B (3rd)', 'Finger 1 stays on F; Finger 5 steps to B'],
                ['Cmaj7', 'C (low root)', 'E (3rd) + B (7th)', 'Both step down by half step'],
              ],
            ),
            sources(['Different Chord Types and How to Make Them', 'How to play jazz chords on piano.pdf']),
          ],
          mcq(
            'According to the lesson, why do professional pianists use guide tones (3rd and 7th) instead of dense 4-note chords in the lower register?',
            ['To add more harmonic tension', 'Because playing dense 4-note chords in the lower register causes muddy acoustic dissonance', 'To make the chords easier to reach with the left hand', 'To allow the 5th to be included in the voicing'],
            1,
            'The step text explicitly states that playing dense 4-note chords in the lower register causes muddy acoustic dissonance, which is why professionals strip the chord down to its Guide Tones — the 3rd and the 7th.',
          ),
          [
            { assert: 'pcSet', root: 'D', semitones: [0, 3, 7, 10], notes: ['D', 'F', 'A', 'C'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7, 10], notes: ['G', 'B', 'D', 'F'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7, 11], notes: ['C', 'E', 'G', 'B'] },
          ],
        ),
      ],
      { minutes: 9 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m11-3-ex-a',
      type: 'Seventh chord quality mutation',
      title: 'Protocol 11.3-A — Seventh Chord Quality Mutation on C and G',
      prompt: 'Play Cmaj7 (C-E-G-B). Flatten the 7th to C7 (C-E-G-B♭). Flatten the 3rd to Cm7 (C-E♭-G-B♭). Flatten the 5th to Cø7/Cm7♭5 (C-E♭-G♭-B♭). Flatten the 7th again to C°7 (C-E♭-G♭-A). Repeat the entire mutation from root G.',
    },
  ],
  checkpoints: [
    'Formula recitation: can state the construction of Major 7th (1-3-5-7), Dominant 7th (1-3-5-♭7), and Minor 7th (1-♭3-5-♭7).',
    'Tritone location: can locate the active tritone in G7 (B-F) and explain its resolution to C-E.',
    'Shell voicing execution: can play the two-hand ii⁷ → V⁷ → Imaj⁷ shell progression in C Major.',
  ],
  outcomes: [
    'Explain how adding a 7th interval introduces active harmonic tension, color, and directional momentum.',
    'Construct and perform the Dominant 7th Chord (dom⁷ / 7): Major Triad + Minor 7th (e.g., G⁷ = G–B–D–F).',
    'Construct and perform the Major 7th Chord (Maj⁷): Major Triad + Major 7th (e.g., Cmaj⁷ = C–E–G–B).',
    'Construct and perform the Minor 7th Chord (m⁷): Minor Triad + Minor 7th (e.g., Am⁷ = A–C–E–G).',
    'Construct and distinguish Half-Diminished (m⁷♭⁵) vs. Fully Diminished (dim⁷) chords.',
    'Execute Shell Voicings (3 + 7) in the Left Hand, delegating root notes to the bass.',
  ],
  sources: [
    'Piano chords every beginner should know.pdf',
    'Different Chord Types and How to Make Them',
    'How to play jazz chords on piano.pdf',
  ],
  practiceFocus: ['Sevenths and 3+7 shells in C and G.'],
  id: 'piano-m11-3',
  code: '11.3',
  title: 'Four-Note Chords: The Seventh Chord Family and Shell Voicings',
});
