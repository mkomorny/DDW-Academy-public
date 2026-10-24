/**
 * Section 10.3 — The Circle of Fifths as an Active Practice Tool
 * Module 10 — The Scale System
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_10_The_Scale_System/
 * Section_10.3_Circle_Of_Fifths_As_A_Tool.md), read in full before
 * authoring. Third section of Module 10 — authored together with 10.4,
 * 11.1, and 11.2 under Miranda's explicit chaining instruction ("do the
 * next 4 steps in one pass"). This section alone does NOT complete Module
 * 10 (10.4 remains), so Level 10 stays unwired until this batch's other
 * section lands.
 *
 * Conversion notes:
 * - The source's full-page ASCII circle diagram (clock positions 12:00
 *   through 11:00, majors/minors/accidental counts) converts directly to
 *   the existing `circleOfFifths()` interactive block (schema.js:48,
 *   renderers.circle in views/blocks.js:272) rather than staying `<pre>`
 *   art — it is exactly the diagrammatic content that block already draws
 *   (clickable wedges, sharp/flat counts, relative minors), confirmed
 *   against `views/blocks.js` before authoring.
 * - `keySignature` asserts (introduced 9.3) ground both the clockwise
 *   sharp chain (G/D/A/E/B) and the counter-clockwise flat chain
 *   (F/Bb/Eb/Ab/Db) the source states explicitly in 10.3.1, and the three
 *   enharmonic pairs (C#/Db, F#/Gb, B/Cb) in 10.3.3 — all six confirmed
 *   against MAJOR_KEYS in lib/theory.js before authoring (sharps run
 *   0..7, flats -1..-7, matching the source's own 5/6/7-accidental
 *   overlap claims).
 * - 10.3.2's relative-minor claim ("6th scale degree, or 3 semitones below
 *   the root") reuses 9.3's own `interval` assert shape and direction
 *   (root down to relative minor = 3 semitones), applied to G→E this time
 *   rather than 9.3's C→A, so the two sections check different key pairs
 *   rather than duplicating the same assertion.
 * - 10.3.4's transposition claim ("C Major → G Major is one clockwise
 *   step") gets a real `interval` assert (C4→G4, 7 semitones, a Perfect
 *   5th) — the numeric fact underneath "one step around the circle."
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, circleOfFifths, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l10-3-1',
      'Clockwise Ascents (Fifths) vs. Counter-Clockwise (Fourths)',
      [
        step(
          'Two Directions, Two Accidental Chains',
          [
            prose(
              '<p>The Circle of Fifths is organized by acoustic interval relationships. Moving <strong>clockwise</strong> steps up by a Perfect 5th (7 semitones); each step adds exactly one sharp, following the order of sharps (F-C-G-D-A-E-B): C (0) → G (1♯) → D (2♯) → A (3♯) → E (4♯) → B (5♯). Moving <strong>counter-clockwise</strong> steps up by a Perfect 4th (or down by a 5th); each step adds exactly one flat, following the order of flats (B-E-A-D-G-C-F): C (0) → F (1♭) → B♭ (2♭) → E♭ (3♭) → A♭ (4♭) → D♭ (5♭).</p>',
            ),
            circleOfFifths({ caption: 'Click any wedge to hear that key and see its accidental count and relative minor.' }),
            sources(['Circle of Fifths.pdf', 'Key Signature Chart.pdf']),
          ],
          mcq(
            'According to the text, moving clockwise around the Circle of Fifths adds one sharp at each step and follows which order of sharps?',
            ['F-C-G-D-A-E-B', 'B-E-A-D-G-C-F', 'C-G-D-A-E-B-F', 'B-F-E-A-D-G-C'],
            0,
            'The step text explicitly states that moving clockwise adds one sharp following the order of sharps (F-C-G-D-A-E-B).',
          ),
          [
            { assert: 'keySignature', key: 'G', sharps: 1 },
            { assert: 'keySignature', key: 'D', sharps: 2 },
            { assert: 'keySignature', key: 'A', sharps: 3 },
            { assert: 'keySignature', key: 'E', sharps: 4 },
            { assert: 'keySignature', key: 'B', sharps: 5 },
            { assert: 'keySignature', key: 'F', sharps: -1 },
            { assert: 'keySignature', key: 'Bb', sharps: -2 },
            { assert: 'keySignature', key: 'Eb', sharps: -3 },
            { assert: 'keySignature', key: 'Ab', sharps: -4 },
            { assert: 'keySignature', key: 'Db', sharps: -5 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-3-2',
      'The Relative Minor Pairing System',
      [
        step(
          'Every Major Key Has an Inner Relative Minor',
          [
            prose(
              '<p>Every Major key on the outer perimeter shares its exact key signature with an inner Relative Minor. The relative minor is located on the 6th scale degree (Là) of the major scale, or exactly 3 semitones (a minor 3rd) below the major root: C Major (12:00) ⇒ A Minor. G Major (1:00) ⇒ E Minor. F Major (11:00) ⇒ D Minor. D Major (2:00) ⇒ B Minor.</p>',
            ),
            table(
              ['Clock position', 'Major key', 'Relative minor'],
              [
                ['12:00', 'C Major', 'A Minor'],
                ['1:00', 'G Major', 'E Minor'],
                ['11:00', 'F Major', 'D Minor'],
                ['2:00', 'D Major', 'B Minor'],
              ],
            ),
            sources(['Circle of Fifths.pdf', 'The difference between scales and keys.pdf']),
          ],
          mcq(
            'According to the Circle of Fifths diagram, which major key at the 1:00 position shares its key signature with E Minor as its relative minor?',
            ['C Major', 'G Major', 'F Major', 'D Major'],
            1,
            'The step text explicitly states G Major (1:00) ⇒ E Minor and lists it in the table.',
          ),
          [
            { assert: 'interval', from: 'E4', to: 'G4', semitones: 3 },
          ],
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l10-3-3',
      'Enharmonic Overlap Keys (The 5:00 to 7:00 Crossroads)',
      [
        step(
          'Three Enharmonic Key Pairs at the Base of the Circle',
          [
            prose(
              '<p>At the bottom of the circle, the sharp side and flat side intersect, producing three enharmonic key pairs — spelled differently but played on the exact same keys.</p>',
            ),
            table(
              ['Clock position', 'Flat spelling', 'Sharp spelling'],
              [
                ['7:00', 'D♭ Major (5 flats)', 'C♯ Major (7 sharps)'],
                ['6:00', 'G♭ Major (6 flats)', 'F♯ Major (6 sharps)'],
                ['5:00', 'C♭ Major (7 flats)', 'B Major (5 sharps)'],
              ],
              'Each row is acoustically identical — the two spellings are the same keys on the keybed.',
            ),
            sources(['Enharmonic Key Signature Guide.pdf', 'Key Signature Chart.pdf']),
          ],
          mcq(
            'According to the step text, which three pairs of keys are enharmonic at the bottom of the circle?',
            ['D♭/C♯, G♭/F♯, C♭/B', 'D♭/C♯, G♭/F♯, A♭/G♯', 'C♭/B, F♯/G♭, E♭/D♯', 'G♭/F♯, C♭/B, D♭/C♯'],
            0,
            'The step text explicitly lists the three enharmonic key pairs at the bottom of the circle as D♭ Major (5 flats)/C♯ Major (7 sharps), G♭ Major (6 flats)/F♯ Major (6 sharps), and C♭ Major (7 flats)/B Major (5 sharps).',
          ),
          [
            { assert: 'keySignature', key: 'Db', sharps: -5 },
            { assert: 'keySignature', key: 'C#', sharps: 7 },
            { assert: 'keySignature', key: 'Gb', sharps: -6 },
            { assert: 'keySignature', key: 'F#', sharps: 6 },
            { assert: 'keySignature', key: 'Cb', sharps: -7 },
            { assert: 'keySignature', key: 'B', sharps: 5 },
          ],
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l10-3-4',
      'Practical Transposition Around the Circle',
      [
        step(
          'Transposing a Melody One Step Around the Circle',
          [
            prose(
              '<p>The Circle of Fifths provides an instant blueprint for transposition. Original, in C Major (12:00, 0 accidentals), formula 3-2-1 gives pitches E-D-C. Transposed one step clockwise to G Major (1:00, 1 sharp F♯), the same formula 3-2-1 gives pitches B-A-G. Transposed one step counter-clockwise to F Major (11:00, 1 flat B♭), the same formula 3-2-1 gives pitches A-G-F.</p>',
            ),
            table(
              ['Direction', 'Target key', 'Formula 3-2-1'],
              [
                ['Original', 'C Major (0 accidentals)', 'E - D - C'],
                ['+1 clockwise', 'G Major (1♯)', 'B - A - G'],
                ['−1 counter-clockwise', 'F Major (1♭)', 'A - G - F'],
              ],
            ),
            sources(['Circle of Fifths.pdf', 'The difference between scales and keys.pdf']),
          ],
          mcq(
            'According to the step text, applying the 3-2-1 formula in G Major (one step clockwise from C) produces which three pitches?',
            ['E-D-C', 'B-A-G', 'A-G-F', 'F-E-D'],
            1,
            'The step text explicitly states that transposed one step clockwise to G Major the same formula 3-2-1 gives pitches B-A-G.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
          ],
        ),
      ],
      { minutes: 7 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m10-3-ex-a',
      type: 'Circle drawing from memory',
      title: 'Protocol 10.3-A — Circle Drawing from Memory',
      prompt: 'Draw a blank circle with 12 clock positions. Place C Major / A Minor at 12:00. Complete the clockwise sharp side (1:00 → 6:00): G → D → A → E → B → F♯. Complete the counter-clockwise flat side (11:00 → 7:00): F → B♭ → E♭ → A♭ → D♭. Add relative minors inside the ring.',
    },
  ],
  checkpoints: [
    'Memory diagram: can draw and label the entire 12-key Circle of Fifths from memory in under 3 minutes.',
    'Accidental counting: can immediately state the number of sharps/flats for any key on the circle (E Maj = 4♯; A♭ Maj = 4♭).',
    'Instant relative minor identification: can state the relative minor of D, B♭, A, E♭ in under 2 seconds.',
    'Practical transposition: can transpose a 5-finger melody from C to G and from C to F on the keybed.',
  ],
  outcomes: [
    'Reconstruct and diagram the complete Circle of Fifths from memory, placing all 12 Major keys on the outer ring and their corresponding Relative Minors on the inner ring.',
    'Calculate key signature additions: moving Clockwise (+1 Sharp: FCGDAEB) vs. moving Counter-Clockwise (+1 Flat: BEADGCF).',
    'Identify the three standard Enharmonic Key Pairs at the base of the circle (D♭ / C♯, G♭ / F♯, C♭ / B).',
    'Use the Circle of Fifths to systematically select the next logical scale in a daily practice rotation.',
    'Transpose a 5-finger melody one step around the circle (e.g., C Major → G Major or C Major → F Major).',
  ],
  sources: [
    'Circle of Fifths.pdf',
    'Key Signature Chart.pdf',
    'Enharmonic Key Signature Guide.pdf',
    'The difference between scales and keys.pdf',
  ],
  practiceFocus: ['Draw the circle; transpose one pentascale one step.'],
  id: 'piano-m10-3',
  code: '10.3',
  title: 'The Circle of Fifths as an Active Practice Tool',
});
