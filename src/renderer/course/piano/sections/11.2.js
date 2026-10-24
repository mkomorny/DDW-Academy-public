/**
 * Section 11.2 — Triad Inversions and Smooth Voice Leading
 * Module 11 — Chords and Harmony
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_11_Chords_And_Harmony/
 * Section_11.2_Triad_Inversions_Voice_Leading.md), read in full before
 * authoring. Second section of Module 11 — authored together with 10.3,
 * 10.4, and 11.1 under Miranda's explicit chaining instruction. This
 * section alone does NOT complete Module 11 (11.3-11.4 remain), so Level
 * 11 stays unwired after this batch.
 *
 * Conversion notes:
 * - `chordExplorer('C', 'maj')`'s built-in "Invert" button (renderers.chord,
 *   views/blocks.js:210-244 — cycles inversion and labels the notes line
 *   "(root position)" / "(inversion N)") is exactly this section's own
 *   teaching device, confirmed before authoring: 11.2.1 leans on it
 *   directly rather than describing inversions in prose alone.
 * - 11.2.2's figured-bass interval claims (3rd/6th above an inverted
 *   bass) get real `interval` asserts: 1st inversion bass E → G is a
 *   minor 3rd (3 ST), E → C (octave up) is a minor 6th (8 ST, the "6"
 *   figured-bass digit); 2nd inversion bass G → C is a Perfect 4th (5
 *   ST, the "4" digit), G → E (octave up) is a Major 6th (9 ST, the "6"
 *   digit) — all four computed directly from C-E-G's own pitch classes,
 *   matching the source's own interval-above-bass table exactly.
 * - 11.2.4's IV chord (F Major, the voice-leading cycle's first move away
 *   from tonic) gets a `pcSet` assert (F-A-C) — the one new chord
 *   spelling this lesson's prose introduces beyond the tonic and dominant
 *   triads already asserted in 11.1.
 * - Fingering-only claims (11.2.3's RH/LH inversion fingering chart) have
 *   no theory-oracle equivalent and stay prose + table only, same
 *   treatment as every prior fingering-rule lesson in this course.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, chordExplorer, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l11-2-1',
      'Moving the Basement: What an Inversion Is',
      [
        step(
          'The Root Names the Chord — the Bass Note Names the Position',
          [
            prose(
              '<p>The identity of a chord is determined by its root, not by which note happens to be at the bottom. As long as a chord contains the notes C, E, and G, it is always a C Major chord. When C is lowest, that is Root Position. When E is lowest, that is First Inversion. When G is lowest, that is Second Inversion.</p>',
            ),
            chordExplorer('C', 'maj', { caption: 'Click "Invert" to cycle Root Position → First Inversion → Second Inversion — same three notes, different bass.' }),
            sources(['Piano chords every beginner should know.pdf', 'Triads and Chords.pdf']),
          ],
          mcq(
            'According to the text, what determines the identity of a chord?',
            ['The note at the bottom', 'The root', 'The order of the notes', 'The number of inversions it has'],
            1,
            'The step text states that the identity of a chord is determined by its root, not by which note happens to be at the bottom.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
          ],
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l11-2-2',
      'Figured Bass Interval Analysis (⁵₃, ⁶₃, ⁶₄)',
      [
        step(
          'Naming Inversions by the Intervals Above the Bass',
          [
            prose(
              '<p>Classical notation names inversions by measuring the musical intervals formed above the lowest bass note. Root Position (bass = Root C): a 3rd (E) and a 5th (G) above the bass — figured ⁵₃, or a plain chord symbol. First Inversion (bass = Third E): a 3rd (G) and a 6th (C) above the bass — figured ⁶₃ (or C/E, or I⁶). Second Inversion (bass = Fifth G): a 4th (C) and a 6th (E) above the bass — figured ⁶₄ (or C/G, or I⁶₄).</p>',
            ),
            table(
              ['Inversion name', 'Lowest note', 'Intervals above bass', 'Short symbol'],
              [
                ['Root Position', 'Root (C)', '3rd (E) + 5th (G)', '⁵₃ (or plain chord)'],
                ['1st Inversion', 'Third (E)', '3rd (G) + 6th (C)', '⁶₃ (or C/E, I⁶)'],
                ['2nd Inversion', 'Fifth (G)', '4th (C) + 6th (E)', '⁶₄ (or C/G, I⁶₄)'],
              ],
            ),
            sources(['Triads and Chords.pdf']),
          ],
          mcq(
            'According to the step text, what is the figured bass symbol for a second inversion chord?',
            ['⁵₃', '⁶₃', '⁶₄', 'I⁶'],
            2,
            'The step text states that second inversion (bass = fifth G) has a 4th and a 6th above the bass and is figured ⁶₄ (or C/G, or I⁶₄).',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'G4', semitones: 3 },
            { assert: 'interval', from: 'E4', to: 'C5', semitones: 8 },
            { assert: 'interval', from: 'G4', to: 'C5', semitones: 5 },
            { assert: 'interval', from: 'G4', to: 'E5', semitones: 9 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l11-2-3',
      'Inversion Fingering Matrix',
      [
        step(
          'Finger 2 Bridges the 4th in Both Hands',
          [
            prose(
              '<p>Because the spatial interval gap shifts within inversions (a 4th occurs between two of the notes), fingers must adjust. RH: Root Position (C-E-G) uses 1-3-5; 1st Inversion (E-G-C) uses 1-2-5, with Finger 2 bridging the 4th; 2nd Inversion (G-C-E) uses 1-3-5 (or 1-2-5). LH: Root Position (C-E-G) uses 5-3-1; 1st Inversion (E-G-C) uses 5-3-1; 2nd Inversion (G-C-E) uses 5-2-1, with Finger 2 bridging the 4th. Using 1-3-5 on the RH 1st inversion causes severe hand strain — the corrective law is to use fingers 1-2-5 instead.</p>',
            ),
            table(
              ['Hand', 'Position', 'Notes', 'Fingering'],
              [
                ['RH', 'Root', 'C-E-G', '1-3-5'],
                ['RH', '1st Inversion', 'E-G-C', '1-2-5 (Finger 2 bridges 4th)'],
                ['RH', '2nd Inversion', 'G-C-E', '1-3-5 (or 1-2-5)'],
                ['LH', 'Root', 'C-E-G', '5-3-1'],
                ['LH', '1st Inversion', 'E-G-C', '5-3-1'],
                ['LH', '2nd Inversion', 'G-C-E', '5-2-1 (Finger 2 bridges 4th)'],
              ],
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'What fingering should the right hand use for the 1st inversion of the C major chord (E-G-C)?',
            ['1-3-5', '1-2-5', '1-3-4', '5-3-1'],
            1,
            'The step text explicitly states that RH 1st Inversion (E-G-C) uses 1-2-5, with Finger 2 bridging the 4th, and warns that using 1-3-5 causes severe hand strain.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l11-2-4',
      'Voice Leading: The Law of the Common Tone',
      [
        step(
          'Holding the Common Tone Through I – IV – I – V – I',
          [
            prose(
              '<p>Jumping the entire hand up and down the keyboard in root position creates awkward, disconnected music. Smooth Voice Leading connects chords by moving individual fingers the shortest possible physical distance. In C Major: Tonic (I, root position) is C-E-G. Moving to Subdominant (IV, as F/C, 2nd inversion): keep the common tone C stationary in Finger 1; step E up to F and G up to A, giving C-F-A. Return to Tonic (I) — C-E-G. Moving to Dominant (V, as G/B, 1st inversion): keep the common tone G stationary in Finger 5; step C down to B and E down to D, giving B-D-G. Resolve to Tonic (I) — C-E-G.</p>',
            ),
            table(
              ['Step', 'Chord', 'RH notes', 'What moves'],
              [
                ['1', 'I (root position)', 'C - E - G', '—'],
                ['2', 'IV (2nd inv., F/C)', 'C - F - A', 'C held; E→F, G→A step up'],
                ['3', 'I (root position)', 'C - E - G', '—'],
                ['4', 'V (1st inv., G/B)', 'B - D - G', 'G held; C→B, E→D step down'],
                ['5', 'I (root position)', 'C - E - G', '—'],
              ],
            ),
            sources(['Piano chords every beginner should know.pdf', 'Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the step text, what is the right-hand note order when moving from I to IV using smooth voice leading in C Major?',
            ['C-E-G to F-A-C', 'C-F-A with C held', 'C-E-G to C-E-G', 'B-D-G with G held'],
            1,
            'The step text explicitly states that moving to Subdominant (IV, as F/C, 2nd inversion) keeps the common tone C stationary in Finger 1 while stepping E up to F and G up to A, giving C-F-A.',
          ),
          [
            { assert: 'pcSet', root: 'F', semitones: [0, 4, 7], notes: ['F', 'A', 'C'] },
          ],
        ),
      ],
      { minutes: 9 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m11-2-ex-a',
      type: 'Inversion ladder drill',
      title: 'Protocol 11.2-A — Inversion Ladder Drill',
      prompt: 'Set metronome to 60 BPM. Play C Major Root (C-E-G, 1-3-5) → 1st Inversion (E-G-C, 1-2-5) → 2nd Inversion (G-C-E, 1-3-5) → Octave Root (C-E-G). Descend back to original root. Repeat with LH.',
    },
  ],
  checkpoints: [
    'Inversion identification: can immediately identify the bass note and inversion type for C/E (1st inv) and G/D (2nd inv).',
    'RH/LH inversion fingerings: can execute the 1-2-5 (RH 1st) and 5-2-1 (LH 2nd) fingerings automatically.',
    'Voice-led progression: can perform I → IV → I → V → I in C Major without moving the hand laterally more than 1 key.',
  ],
  outcomes: [
    'Define an inversion as a re-ordering of chord tones where a note other than the root occupies the bass position.',
    'Construct and identify Root Position (⁵₃), First Inversion (⁶₃ or 6), and Second Inversion (⁶₄).',
    'Apply standard conservatory inversion fingerings for both Right Hand and Left Hand.',
    'Voice-lead functional chord progressions (I → IV → I → V → I) by holding common tones and moving other voices by step.',
    'Distinguish between an inversion and a general slash chord (C/E).',
  ],
  sources: [
    'Piano chords every beginner should know.pdf',
    'Piano Chords for Beginners.pdf',
    'Triads and Chords.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Inversion cycle with common-tone voice leading.'],
  id: 'piano-m11-2',
  code: '11.2',
  title: 'Triad Inversions and Smooth Voice Leading',
});
