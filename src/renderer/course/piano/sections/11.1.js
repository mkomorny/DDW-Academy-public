/**
 * Section 11.1 — Triads: Major, Minor, Diminished, and Augmented
 * Module 11 — Chords and Harmony
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_11_Chords_And_Harmony/
 * Section_11.1_Triads_Major_Minor_Diminished_Augmented.md), read in full
 * before authoring. First section of Module 11 — authored together with
 * 10.3, 10.4, and 11.2 under Miranda's explicit chaining instruction. This
 * section alone does NOT complete Module 11 (11.2-11.4 remain), so Level
 * 11 stays unwired after this batch.
 *
 * Conversion notes:
 * - `chordExplorer('C', 'maj'/'min'/'dim'/'aug')` covers all four
 *   qualities this section teaches — 'maj'/'min' were already confirmed
 *   real in Section 5.3/6.1; 'dim' and 'aug' are new to this course but
 *   confirmed present in CHORD_TYPES (lib/theory.js:174-178) with the
 *   exact semitone stacks the source states (dim: 0,3,6; aug: 0,4,8)
 *   before authoring. The block's own built-in "Invert" button (used
 *   starting 11.2) isn't the point here — this section stays root
 *   position throughout, matching the source's own scope.
 * - `interval` asserts ground each quality's stacking claim directly:
 *   Major (C→E 4 ST, C→G 7 ST), Minor (C→E♭ 3 ST), Diminished (C→G♭ 6 ST,
 *   the diminished 5th/tritone), Augmented (C→G♯ 8 ST, the augmented
 *   5th) — matching the section's own "semitone stacking matrix" numbers
 *   exactly.
 * - The 12-triad catalog (11.1.3) stays a `table()` rather than 12
 *   separate chordExplorer blocks — same "don't multiply interactive
 *   blocks past what teaches the point" judgment 10.2's cadence table
 *   used — with two representative `pcSet` asserts (D Major, B♭ Minor)
 *   rather than asserting all 24 spellings.
 * - Fingering-only claims (11.1.4's "one hand shape" rule) have no
 *   theory-oracle equivalent and stay prose-only, same treatment as every
 *   prior fingering-rule lesson in this course.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, chordExplorer, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l11-1-1',
      'Anatomy of a Triad: Root, Third, and Fifth',
      [
        step(
          'Root, Third, and Fifth',
          [
            prose(
              '<p>A chord is any simultaneous combination of notes; a Triad is specifically a 3-note chord built on stacked thirds. The Root is the foundational pitch that names the chord. The Third is located a 3rd above the root and determines whether the chord is Major or Minor. The Fifth is located a 5th above the root and determines whether the chord is stable (Perfect 5th), contracted (Diminished 5th), or expanded (Augmented 5th).</p>',
            ),
            chordExplorer('C', 'maj', { caption: 'A C Major triad — Root C, Third E, Fifth G.' }),
            sources(['Piano chords every beginner should know.pdf', 'Triads and Chords.pdf']),
          ],
          mcq(
            'According to the step text, what determines whether a triad is Major or Minor?',
            ['The Root', 'The Third', 'The Fifth', 'The number of notes'],
            1,
            'The step text states that the Third is located a 3rd above the root and determines whether the chord is Major or Minor.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l11-1-2',
      'The Four Triad Qualities',
      [
        step(
          'Major and Minor: Which Third Comes First',
          [
            prose(
              '<p>A Major triad stacks a Major 3rd (4 semitones) then a minor 3rd (3 semitones): Root + M3 + m3 ⇒ Perfect 5th (7 ST) outer interval. Example: C-E-G, bright and resonant. A Minor triad reverses the stacking order — a minor 3rd (3 ST) then a Major 3rd (4 ST): Root + m3 + M3 ⇒ Perfect 5th (7 ST) outer interval, still a Perfect 5th, but a darker, more introspective sound. Example: C-E♭-G.</p>',
            ),
            table(
              ['Quality', 'Symbol', 'Interval formula', 'Example'],
              [
                ['Major', 'C / CM', 'M3 (4 ST) + m3 (3 ST)', 'C — E — G'],
                ['Minor', 'Cm / C-', 'm3 (3 ST) + M3 (4 ST)', 'C — E♭ — G'],
              ],
            ),
            sources(['Complete Guide to Triads.pdf']),
          ],
          mcq(
            'According to the step text, what is the interval stacking order that produces a Minor triad?',
            ['Root + Major 3rd (4 ST) + minor 3rd (3 ST)', 'Root + minor 3rd (3 ST) + Major 3rd (4 ST)', 'Root + Major 3rd (4 ST) + Major 3rd (4 ST)', 'Root + minor 3rd (3 ST) + minor 3rd (3 ST)'],
            1,
            'The step text explicitly states that a Minor triad reverses the Major order by stacking a minor 3rd (3 ST) then a Major 3rd (4 ST): Root + m3 + M3.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'E4', semitones: 4 },
            { assert: 'interval', from: 'C4', to: 'Eb4', semitones: 3 },
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
          ],
        ),
        step(
          'Diminished and Augmented: Both Thirds Match',
          [
            prose(
              '<p>A Diminished triad stacks two minor 3rds: Root + m3 (3 ST) + m3 (3 ST) ⇒ a Diminished 5th, also called a tritone (6 ST) — tense and unstable. Example: C-E♭-G♭. An Augmented triad stacks two Major 3rds: Root + M3 (4 ST) + M3 (4 ST) ⇒ an Augmented 5th (8 ST) — restless and dreamlike, floating. Example: C-E-G♯.</p>',
            ),
            chordExplorer('C', 'dim', { caption: 'C Diminished — C, E♭, G♭. Tense, contracted.' }),
            chordExplorer('C', 'aug', { caption: 'C Augmented — C, E, G♯. Restless, floating.' }),
            sources(['Complete Guide to Triads.pdf', 'Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'According to the step text, what interval results from stacking two minor 3rds in a triad?',
            ['Perfect 5th (7 ST)', 'Diminished 5th / tritone (6 ST)', 'Augmented 5th (8 ST)', 'Major 3rd (4 ST)'],
            1,
            'The step text states that a Diminished triad stacks two minor 3rds resulting in a Diminished 5th, also called a tritone (6 ST).',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'Gb4', semitones: 6 },
            { assert: 'interval', from: 'C4', to: 'G#4', semitones: 8 },
          ],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l11-1-3',
      'The 12 Major and 12 Minor Triads Catalog',
      [
        step(
          'Spelling Every Major and Minor Triad',
          [
            prose('The full catalog of Major and Minor triads across all 12 roots:'),
            table(
              ['Root', 'Major triad (1-3-5)', 'Minor triad (1-♭3-5)'],
              [
                ['C', 'C — E — G', 'C — E♭ — G'],
                ['G', 'G — B — D', 'G — B♭ — D'],
                ['D', 'D — F♯ — A', 'D — F — A'],
                ['A', 'A — C♯ — E', 'A — C — E'],
                ['E', 'E — G♯ — B', 'E — G — B'],
                ['B', 'B — D♯ — F♯', 'B — D — F♯'],
                ['F', 'F — A — C', 'F — A♭ — C'],
                ['B♭', 'B♭ — D — F', 'B♭ — D♭ — F'],
                ['E♭', 'E♭ — G — B♭', 'E♭ — G♭ — B♭'],
                ['A♭', 'A♭ — C — E♭', 'A♭ — C♭ (B) — E♭'],
                ['D♭', 'D♭ — F — A♭', 'D♭ — F♭ (E) — A♭'],
                ['F♯/G♭', 'F♯ — A♯ — C♯', 'F♯ — A — C♯'],
              ],
            ),
            sources(['All Major and Minor Triads.pdf']),
          ],
          mcq(
            'According to the catalog, what are the notes of the A♭ minor triad?',
            ['A♭ — C — E♭', 'A♭ — C♭ (B) — E♭', 'A♭ — C♯ — E♭', 'A♭ — B — E♭'],
            1,
            'The step text\'s catalog explicitly lists the A♭ minor triad (1-♭3-5) as A♭ — C♭ (B) — E♭.',
          ),
          [
            { assert: 'pcSet', root: 'D', semitones: [0, 4, 7], notes: ['D', 'F#', 'A'] },
            { assert: 'pcSet', root: 'Bb', semitones: [0, 3, 7], notes: ['Bb', 'Db', 'F'] },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l11-1-4',
      'Physical Execution: The Formed Hand Shape',
      [
        step(
          'One Hand Shape, Struck Together',
          [
            prose(
              '<p>When playing a root-position triad, RH uses fingers 1 (Thumb) — 3 (Middle) — 5 (Pinky); LH uses fingers 5 — 3 — 1. The "One Hand Shape" rule: do not poke at the three keys individually. Lock the arch of the hand into a single rigid dome and drop arm weight into all three keys simultaneously so they strike at the exact same millisecond. Striking the keys unevenly ("flamming" the triad) is corrected the same way — drop arm mass as a unified shape so all three notes strike in unison.</p>',
            ),
            sources(['Triads and Chords.pdf']),
          ],
          mcq(
            'When playing a root-position triad, which fingers does the right hand use?',
            ['1-2-3', '1-3-5', '2-4-5', '3-4-5'],
            1,
            'The step text states that when playing a root-position triad, RH uses fingers 1 (Thumb) — 3 (Middle) — 5 (Pinky).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m11-1-ex-a',
      type: '4-quality mutation drill',
      title: 'Protocol 11.1-A — 4-Quality Mutation Drill',
      prompt: 'Place RH on C Major Triad (C-E-G). Flatten 3rd → C Minor (C-E♭-G). Flatten 5th → C Diminished (C-E♭-G♭). Return to Major, raise 5th → C Augmented (C-E-G♯). Repeat on roots G, D, A, E, F.',
    },
  ],
  checkpoints: [
    'Triad formulas: can state the third combinations for Major (M+m), Minor (m+M), Diminished (m+m), and Augmented (M+M).',
    '24-triad fluency: can form and play any requested Major or Minor triad on the keybed within 3 seconds.',
    'Aural recognition: can distinguish a Diminished triad (tense tritone) from an Augmented triad (restless whole-tone sound) by ear.',
  ],
  outcomes: [
    'Define a Triad as a three-note chord consisting of a Root, a 3rd above the root, and a 5th above the root.',
    'Construct and identify a Major Triad: Root + M3 (4 ST) + m3 (3 ST) ⇒ Perfect 5th (7 ST).',
    'Construct and identify a Minor Triad: Root + m3 (3 ST) + M3 (4 ST) ⇒ Perfect 5th (7 ST).',
    'Construct and identify a Diminished Triad: Root + m3 (3 ST) + m3 (3 ST) ⇒ Diminished 5th / Tritone (6 ST).',
    'Construct and identify an Augmented Triad: Root + M3 (4 ST) + M3 (4 ST) ⇒ Augmented 5th (8 ST).',
    'Perform all 12 Major and all 12 Minor triads in Root Position with standard fingering (RH: 1-3-5; LH: 5-3-1).',
  ],
  sources: [
    'Piano chords every beginner should know.pdf',
    'Triads and Chords.pdf',
    'Complete Guide to Triads.pdf',
    'All Major and Minor Triads.pdf',
  ],
  practiceFocus: ['Four qualities from white-key roots.'],
  id: 'piano-m11-1',
  code: '11.1',
  title: 'Triads: Major, Minor, Diminished, and Augmented',
});
