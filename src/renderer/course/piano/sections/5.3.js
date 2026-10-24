/**
 * Section 5.3 — Two-Note Chords and I / V Harmonic Accompaniment
 * Module 5 — Five-Finger Fluency
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_05_Five_Finger_Fluency/
 * Section_5.3_Two_Note_Chords_And_I_V_Harmony.md), read in full before
 * authoring. Authored together with 5.1, 5.2, and 6.1 in one chained
 * sitting per Miranda's explicit one-time request — see 5.1.js's header for
 * the full one-off-chaining note. Completing this section completes Module
 * 5, so this batch also wires Level 5 into LEVELS — see index.js's header
 * for that wiring's own notes, including the new Gate D entry.
 *
 * Conversion notes:
 * - LH bass-register notes use the course's established "Bass C = C2"
 *   convention (the same one Gate C's own checkpoint — "a sustained Bass C
 *   drone" — relies on), so the I chord is C2+G2 and the V chord (Bass C's
 *   Finger 5 shifted down a half step) is B1+G2. Both are asserted as
 *   'interval' claims (C2→G2 = 7 semitones, a Perfect 5th; B1→G2 = 8
 *   semitones, a minor 6th) since a two-note dyad's spelling is exactly an
 *   interval claim, not a pcSet one.
 * - First course use of `intervalDemo()`, alongside 5.1/5.2's first use of
 *   chordExplorer() — both confirmed real (views/blocks.js
 *   `renderers.interval`) before authoring. 5.3.1 pairs it directly with
 *   the text's own named intervals (Harmonic Third 1+3, Harmonic Fifth
 *   1+5).
 * - The Repertoire Lab (5.3.4) reuses the RH melody E4-D4-C4 and its
 *   interval asserts from 3.3/4.3's Hot Cross Buns transcriptions — the
 *   melody itself is unchanged from those sections; what's new here is the
 *   LH I/V harmony, shown as a separate bass-clef staff() of the two chord
 *   shapes rather than re-striking them on every beat (the renderer has no
 *   tied-note support, the same known simplification already documented in
 *   4.1's header for beam-grouping).
 * - Check-drafting provenance: all 10 step checks were drafted via the xAI
 *   client, 9 of 10 verified on the first entailment attempt, one (5.3.4
 *   step 2) on the second. All passed manual review unchanged (mcq, text
 *   kinds).
 */
import { module_, lesson, step, prose, table, callout, staff, chordExplorer, intervalDemo, sources, mcq, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l5-3-1',
      'Harmonic Intervals: Two Notes Sounding Together',
      [
        step(
          'Melodic vs. Harmonic Intervals',
          [
            prose(
              '<p>A chord is born the moment two or more distinct pitches are depressed simultaneously. A <strong>Melodic Interval</strong> is two notes played sequentially, one after another in time. A <strong>Harmonic Interval</strong> is two notes played simultaneously, in vertical unison.</p>',
            ),
            sources(['What is a Pentascale.pdf', 'Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'According to the text, when is a chord born?',
            [
              'When two or more distinct pitches are played sequentially',
              'When two or more distinct pitches are depressed simultaneously',
              'When a single pitch is held for a long time',
              'When notes are played in a melodic pattern',
            ],
            1,
            'The step text explicitly states that a chord is born the moment two or more distinct pitches are depressed simultaneously.',
          ),
        ),
        step(
          'The Balance Rule',
          [
            prose(
              '<p>To play a clean two-note harmonic interval, both fingers must strike the keybed with equal arm weight at the exact identical millisecond so neither pitch overpowers the other. The two standard two-note harmonic intervals in the hand are the Harmonic Third (1+3) and the Harmonic Fifth (1+5).</p>',
            ),
            intervalDemo('M3', 'C4', { caption: 'Harmonic Third — 1+3, C and E played together.' }),
            intervalDemo('P5', 'C4', { caption: 'Harmonic Fifth — 1+5, C and G played together.' }),
            sources(['Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'According to the text, what must both fingers do to play a clean two-note harmonic interval?',
            [
              'Strike the keybed with equal arm weight at the exact identical millisecond',
              'Use different amounts of finger pressure on each key',
              'Play one note slightly before the other',
              'Press the keys using only finger strength without arm weight',
            ],
            0,
            'The step text states that both fingers must strike the keybed with equal arm weight at the exact identical millisecond so neither pitch overpowers the other.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'E4', semitones: 4 },
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-3-2',
      'The Tonic (I) Chord in the Hand',
      [
        step(
          'The Tonic Triad',
          [
            prose(
              '<p>In any major key, the <strong>Tonic (I)</strong> is the foundational chord of rest, stability, and home. In C Major, the Tonic chord is built from scale degrees 1–3–5: C–E–G.</p>',
            ),
            chordExplorer('C', 'maj', { caption: 'The Tonic (I) chord in C Major — C, E, G.' }),
            sources(['What is a Pentascale.pdf', 'Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'In C Major, which notes build the Tonic (I) chord according to the text?',
            ['C–D–E', 'C–E–G', 'C–F–G', 'D–F–A'],
            1,
            'The step text explicitly states that in C Major the Tonic chord is built from scale degrees 1–3–5: C–E–G.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
          ],
        ),
        step(
          'The Two-Note Tonic Dyad',
          [
            prose(
              '<p>For beginners and small hands, the Tonic is played as a two-note dyad instead of the full triad: the open 5th (C+G, fingers 5+1 in the LH) or the 3rd (C+E, fingers 5+3).</p>',
            ),
            table(
              ['Dyad', 'Notes', 'LH Fingers'],
              [
                ['Open 5th', 'Bass C + Bass G', 'Finger 5 + Finger 1'],
                ['3rd', 'Bass C + E', 'Finger 5 + Finger 3'],
              ],
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['C2', 'G2'], duration: 'h', label: 'I (open 5th)' },
                ],
              },
            ),
            sources(['Piano chords every beginner should know.pdf', 'Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'For beginners and small hands, what is the recommended way to play the Tonic instead of the full triad?',
            [
              'C–E–G with fingers 1-3-5',
              'Open 5th (C+G) with LH fingers 5+1 or 3rd (C+E) with LH fingers 5+3',
              'B–G with fingers 5+1',
              'Full triad C–E–G with both hands',
            ],
            1,
            'The step text explicitly states that for beginners and small hands the Tonic is played as a two-note dyad: the open 5th (C+G, fingers 5+1 in the LH) or the 3rd (C+E, fingers 5+3).',
          ),
          [
            { assert: 'interval', from: 'C2', to: 'G2', semitones: 7 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-3-3',
      'The Dominant (V) Chord and Smooth Voice Leading',
      [
        step(
          'The Root Position Leap Error and the Voice-Leading Solution',
          [
            prose(
              '<p>Moving from C Major (C–E–G) to G Major (G–B–D) by jumping the entire hand 5 keys rightward is clunky and prone to errors. The voice-leading solution: keep LH Finger 1 anchored on G, and move LH Finger 5 down by a half step from C to B. Playing B+G (fingers 5+1) forms an authentic Dominant harmony — a "V7 shell" — with virtually zero hand jumping.</p>',
            ),
            table(
              ['Chord Function', 'LH Spelled Notes', 'LH Finger Numbers'],
              [
                ['I (Tonic Home)', 'Bass C + Bass G (or C + E + G)', 'Finger 5 + Finger 1 (or 5 + 3 + 1)'],
                [
                  'V (Dominant)',
                  'Low B + Bass G (or B + F + G)',
                  'Finger 5 (shifted) + Finger 1 (or 5 + 2 + 1)',
                ],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf', 'Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'According to the step text, what forms an authentic Dominant harmony known as a "V7 shell" with virtually zero hand jumping?',
            [
              'Jumping the entire hand 5 keys rightward from C–E–G',
              'Playing B+G using LH fingers 5+1',
              'Playing C+E+G using fingers 5+3+1',
              'Moving only the thumb while keeping finger 5 on C',
            ],
            1,
            'The step text states that keeping LH Finger 1 anchored on G and moving LH Finger 5 down a half step from C to B, then playing B+G (fingers 5+1), forms an authentic Dominant harmony — a "V7 shell" — with virtually zero hand jumping.',
          ),
        ),
        step(
          'The I – V Voice-Leading Shell on the Staff',
          [
            prose(
              '<p>Finger 1 never moves off G. Only finger 5 shifts, by a single half step, between Bass C (the I chord) and Low B (the V chord).</p>',
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['C2', 'G2'], duration: 'h', label: 'I' },
                  { notes: ['B1', 'G2'], duration: 'h', label: 'V' },
                ],
              },
            ),
            sources(['Piano chords every beginner should know.pdf']),
          ],
          text(
            'Which finger stays fixed on G while the other shifts a half step between the I and V chords?',
            ['finger 1', '1', 'thumb'],
            'The step text explicitly states that Finger 1 never moves off G while only finger 5 shifts.',
          ),
          [
            { assert: 'interval', from: 'C2', to: 'G2', semitones: 7 },
            { assert: 'interval', from: 'B1', to: 'G2', semitones: 8 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-3-4',
      'Repertoire Lab: Hot Cross Buns with I and V Harmony',
      [
        step(
          'Measures 1–2 — Tonic Stability',
          [
            prose(
              '<p>In measures 1 and 2, the RH melody plays E–D–C (with a rest), while the LH holds the C+G Tonic (I) dyad, fingers 5+1, unbroken beneath the whole phrase.</p>',
            ),
            table(
              ['Measure', 'RH Melody', 'LH Harmony'],
              [
                ['1', 'E (3) — D (2) — C (1) — [Rest]', 'C + G Dyad (I), held — Finger 5 + 1'],
                ['2', 'E (3) — D (2) — C (1) — [Rest]', 'C + G Dyad (I), held — Finger 5 + 1'],
              ],
            ),
            staff(
              {
                items: [
                  { notes: ['E4'], duration: 'q', label: 'E' },
                  { notes: ['D4'], duration: 'q', label: 'D' },
                  { notes: ['C4'], duration: 'h', label: 'C' },
                ],
              },
            ),
            sources(['Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'In measures 1 and 2 of Hot Cross Buns, what does the left hand play while the right hand plays the melody?',
            [
              'C + G Dyad (I), held with fingers 5+1',
              'C–E–G triad with fingers 1-3-5',
              'B–G Dominant dyad with fingers 2+5',
              'Alternating I and V chords on each beat',
            ],
            0,
            'The step text explicitly states that the LH holds the C+G Tonic (I) dyad, fingers 5+1, unbroken beneath the whole phrase in measures 1 and 2.',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'D4', semitones: 2 },
            { assert: 'interval', from: 'D4', to: 'C4', semitones: 2 },
          ],
        ),
        step(
          'Measures 3–4 — Dominant Tension and Resolution',
          [
            prose(
              '<p>In measure 3, the RH repeats C four times over a held I chord, then repeats D four times over the LH shifting to the V chord (B+G). Measure 4 returns to the opening RH melody (E–D–C, rest) over the LH Tonic (I) dyad, resolving the phrase.</p>',
            ),
            table(
              ['Measure', 'RH Melody', 'LH Harmony'],
              [
                ['3', 'C-C-C-C, then D-D-D-D', 'C + G (I), held — then B + G (V), held'],
                ['4', 'E (3) — D (2) — C (1) — [Rest]', 'C + G Dyad (I), held — Finger 5 + 1'],
              ],
            ),
            staff(
              {
                clef: 'bass',
                items: [
                  { notes: ['C2', 'G2'], duration: 'h', label: 'I' },
                  { notes: ['B1', 'G2'], duration: 'h', label: 'V' },
                ],
              },
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'In measure 3, what does the LH play while the RH repeats C four times?',
            ['C + G (I), held', 'B + G (V), held', 'C + G Dyad (I), held', 'E (3) — D (2) — C (1)'],
            0,
            'The step text states that in measure 3 the RH repeats C four times over a held I chord (C + G), then repeats D four times over the LH shifting to B + G (V).',
          ),
          [
            { assert: 'interval', from: 'C2', to: 'G2', semitones: 7 },
            { assert: 'interval', from: 'B1', to: 'G2', semitones: 8 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l5-3-5',
      'Aural Comparison: Major vs. Minor Triad Coloration',
      [
        step(
          'The Major Triad',
          [
            prose(
              '<p>Playing RH C–E–G simultaneously produces the Major Triad — Do-Mi-So. Listen for its bright, open resonance.</p>',
            ),
            chordExplorer('C', 'maj', { caption: 'C Major triad — bright, open resonance.' }),
            sources(['Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'What sound quality is produced when playing C–E–G simultaneously with the right hand?',
            [
              'A dark, closed resonance',
              'A bright, open resonance',
              'A tense, dissonant sound',
              'A muted, hollow tone',
            ],
            1,
            'The step text explicitly states that playing RH C–E–G simultaneously produces the Major Triad — Do-Mi-So and instructs the learner to listen for its bright, open resonance.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
          ],
        ),
        step(
          'The Minor Triad and the Gate D Checklist',
          [
            prose(
              '<p>Flattening finger 3 to E♭ and playing C–E♭–G simultaneously produces the Minor Triad — Do-Me-So. Listen for its dark, concentrated resonance. Train the ear to identify this single-semitone distinction instantly upon hearing it.</p>',
            ),
            chordExplorer('C', 'min', { caption: 'C Minor triad — dark, concentrated resonance.' }),
            callout(
              'warning',
              'Two more common two-note-chord traps',
              '<p>"Flamming" a two-note chord — one finger striking before the other — must be corrected: both keys strike the bottom of the keybed simultaneously. And LH harmony must never drown out the RH melody — drop less arm weight in the LH and keep the accompaniment dynamically softer.</p>',
            ),
            table(
              ['Gate D Item', 'What to Verify'],
              [
                [
                  'Pentascale Circuit Accuracy',
                  'Can perform C, G, D, A, E Major and Minor pentascales hands separately with 100% correct pitch and accidental execution.',
                ],
                [
                  'I and V Harmonic Realization',
                  'Can smoothly transition between LH Tonic (C+G) and Dominant (B+G) chords with minimal physical displacement.',
                ],
                [
                  'Harmonized Repertoire Performance',
                  'Can perform Hot Cross Buns with RH melody and LH I-V chord changes at a steady, unbroken pulse (60 BPM).',
                ],
                [
                  'Guide Note Literacy',
                  'Can name and locate Treble G, Middle C, and Bass F in under 2 seconds.',
                ],
              ],
            ),
            sources(['Piano chords every beginner should know.pdf', 'Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'What does flattening finger 3 to E♭ and playing C–E♭–G simultaneously produce?',
            ['A Major Triad', 'A Minor Triad — Do-Me-So', 'A Dominant chord', 'A Harmonic Fifth'],
            1,
            'The step text explicitly states that flattening finger 3 to E♭ and playing C–E♭–G simultaneously produces the Minor Triad — Do-Me-So.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 7], notes: ['C', 'Eb', 'G'] },
          ],
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m5-3-ex-a',
      type: 'Voice-leading drill',
      title: 'Protocol 5.3-A — LH I ↔ V Voice-Leading Drill',
      prompt: 'Set metronome to 60 BPM. Play LH I chord (C+G, fingers 5+1) for 4 beats. Smoothly shift LH finger 5 to B while holding finger 1 on G (V chord) for 4 beats. Return to I chord for 4 beats. Execute 5 clean cycles without rhythmic hesitation.',
    },
  ],
  checkpoints: ['Pentascale circuit; I–V on a tune; three guide notes instant.'],
  outcomes: [
    'Define a chord as two or more distinct pitches sounding simultaneously.',
    'Execute standard two-note harmonic intervals in the hand: Harmonic Thirds (1+3) and Harmonic Fifths (1+5).',
    'Identify and execute the Tonic (I) chord shape in C Major (C–E or C–E–G).',
    'Identify and execute the Dominant (V or V⁷) two-note chord shape in C Major (B–G or B–F–G) with minimal hand displacement.',
    'Harmonize *Hot Cross Buns* using active I and V chord changes in the Left Hand.',
    'Auralize and contrast Major vs. Minor triad coloration directly from the pentascale framework.',
    'Complete and execute the Gate D Assessment Rubric.',
  ],
  sources: [
    'What is a Pentascale.pdf',
    'Piano Skill Levels Explained.pdf',
    'Piano chords every beginner should know.pdf',
    'Piano Chords for Beginners.pdf',
  ],
  practiceFocus: ['*Hot Cross Buns* with I and V (Gate D).'],
  id: 'piano-m5-3',
  code: '5.3',
  title: 'Two-Note Chords and I / V Harmonic Accompaniment',
});
