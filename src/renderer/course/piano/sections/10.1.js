/**
 * Section 10.1 — All Twelve Major Scales (As Physical Playing)
 * Module 10 — The Scale System
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_10_The_Scale_System/
 * Section_10.1_All_Twelve_Major_Scales_As_Playing.md), read in full before
 * authoring. First section of Module 10 — authored together with 9.2, 9.3,
 * and 10.2 under Miranda's explicit one-time chaining override ("do the
 * next 4 steps in one pass"), the sixth such documented exception. This
 * section alone does NOT complete Module 10 (10.3 and 10.4 remain), so
 * Level 10 stays unwired after this batch.
 *
 * Conversion notes:
 * - Reuses `scaleExplorer('major-scales', ...)`, first introduced in 9.2 —
 *   its root selector already lets a learner check any of the twelve major
 *   scales without needing twelve separate blocks, so one panel (root
 *   defaulted to C, `showFingering: true`) covers the section's "one
 *   formula, twelve keys" claim; the source's own 12-row spelling table is
 *   converted to a real `table()` alongside it.
 * - `keySignature` asserts (introduced in 9.3) ground the accidental counts
 *   from the source's own 12-key table for the sharp-side keys named in
 *   this section's outcomes (G, D, A) and the two flat-side keys (F, B♭).
 * - The B Major / F Major "special LH/RH" exceptions and the Group 3
 *   black-key thumb rule are converted as prose + tables rather than new
 *   scaleExplorer calls, since the app's mined scale data doesn't carry a
 *   separate "which fingering variant" dimension — the source's own
 *   fingering-choice guidance (B♭ Major RH starting on 2, 3, or 4) is a
 *   personal-choice note, not a single checkable fact, so it stays prose.
 * - Check-drafting provenance: all 5 step checks were drafted via the xAI
 *   client, 5 of 5 verified on the first entailment attempt (part of a
 *   26/26 first-attempt run across all four sections in this chained batch).
 *   All passed manual review unchanged (mcq, multi kinds).
 */
import { module_, lesson, step, prose, table, callout, scaleExplorer, sources, mcq, multi } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l10-1-1',
      'One Formula, Twelve Keys',
      [
        step(
          'One Formula, Twelve Keys',
          [
            prose(
              '<p>Every major scale follows the exact identical interval sequence, W - W - H - W - W - W - H, regardless of which note it starts on. Applying that formula to all twelve chromatic starting notes produces every major scale’s exact spelling and accidental count.</p>',
            ),
            table(
              ['Scale', 'Spelled Pitches', 'Key Signature Accidentals'],
              [
                ['C Major', 'C — D — E — F — G — A — B — C', '0 Accidentals'],
                ['G Major', 'G — A — B — C — D — E — F♯ — G', '1 Sharp (F♯)'],
                ['D Major', 'D — E — F♯ — G — A — B — C♯ — D', '2 Sharps (F♯, C♯)'],
                ['A Major', 'A — B — C♯ — D — E — F♯ — G♯ — A', '3 Sharps (F♯, C♯, G♯)'],
                ['E Major', 'E — F♯ — G♯ — A — B — C♯ — D♯ — E', '4 Sharps (F♯, C♯, G♯, D♯)'],
                ['B Major', 'B — C♯ — D♯ — E — F♯ — G♯ — A♯ — B', '5 Sharps (F♯, C♯, G♯, D♯, A♯)'],
                ['F Major', 'F — G — A — B♭ — C — D — E — F', '1 Flat (B♭)'],
                ['B♭ Major', 'B♭ — C — D — E♭ — F — G — A — B♭', '2 Flats (B♭, E♭)'],
                ['E♭ Major', 'E♭ — F — G — A♭ — B♭ — C — D — E♭', '3 Flats (B♭, E♭, A♭)'],
                ['A♭ Major', 'A♭ — B♭ — C — D♭ — E♭ — F — G — A♭', '4 Flats (B♭, E♭, A♭, D♭)'],
                ['D♭ Major', 'D♭ — E♭ — F — G♭ — A♭ — B♭ — C — D♭', '5 Flats (B♭, E♭, A♭, D♭, G♭)'],
                ['G♭ / F♯ Major', 'G♭ — A♭ — B♭ — C♭ — D♭ — E♭ — F — G♭', '6 Flats / 6 Sharps'],
              ],
            ),
            scaleExplorer('major-scales', 'C', { showFingering: true, caption: 'Use the root selector to check the spelling and fingering of any of the twelve major scales.' }),
            sources(['Major Scales.pdf', 'The One Book of All Piano Scales.pdf']),
          ],
          mcq(
            'According to the step text, what is the exact interval sequence that every major scale follows regardless of starting note?',
            [
              'W - W - H - W - W - H - W',
              'W - W - H - W - W - W - H',
              'H - W - W - W - H - W - W',
              'W - H - W - W - W - H - W',
            ],
            1,
            'The step text explicitly states that every major scale follows the exact identical interval sequence, W - W - H - W - W - W - H.',
          ),
          [
            { assert: 'keySignature', key: 'G', sharps: 1 },
            { assert: 'keySignature', key: 'D', sharps: 2 },
            { assert: 'keySignature', key: 'A', sharps: 3 },
            { assert: 'keySignature', key: 'F', sharps: -1 },
            { assert: 'keySignature', key: 'Bb', sharps: -2 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-1-2',
      'The Sharp-Side Group (C, G, D, A, E, B)',
      [
        step(
          'Standard Fingering and the B Major Exception',
          [
            prose(
              '<p>C, G, D, A, and E Major all share the exact identical RH fingering (1-2-3-1-2-3-4-5) and LH fingering (5-4-3-2-1-3-2-1). B Major uses standard RH fingering (1-2-3-1-2-3-4-5), but LH starts on Finger 4 on B (4-3-2-1-4-3-2-1) so the thumb lands on the white key E instead of a black key.</p>',
            ),
            sources(['Major Scales.pdf', 'Major Scales Fingering Guide.pdf']),
          ],
          mcq(
            'According to the step, what is the left-hand fingering for B Major?',
            ['5-4-3-2-1-3-2-1', '4-3-2-1-4-3-2-1', '1-2-3-1-2-3-4-5', '5-4-3-2-1-4-3-2'],
            1,
            'The step text explicitly states that B Major uses LH fingering 4-3-2-1-4-3-2-1 so the thumb lands on the white key E instead of a black key.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l10-1-3',
      'The Flat-Side Group and Black-Key Thumb Rules',
      [
        step(
          'F Major’s RH Exception',
          [
            prose(
              '<p>In black-key scales, the thumb (Digit 1) must never strike a black key during scalar runs. In F Major, Finger 4 plays B♭, and the thumb tucks under to strike C instead — RH Fingering: 1-2-3-4-1-2-3-4 (or ending on 5) — rather than tucking on B♭ itself.</p>',
            ),
            callout(
              'warning',
              'The F Major thumb trap',
              '<p>Don’t place the thumb on B♭ in F Major’s RH. Use Finger 4 on B♭ and pass the thumb under to C. Thumbs play only on white keys in standard black-key scales.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'In the right hand of F Major, which finger plays B♭ and what does the thumb do next?',
            [
              'Thumb plays B♭',
              'Finger 3 plays B♭ then thumb on C',
              'Finger 4 plays B♭ then thumb under to C',
              'Finger 4 plays B♭ then thumb stays on B♭',
            ],
            2,
            'The step text states that in F Major Finger 4 plays B♭ and the thumb tucks under to strike C instead, and warns not to place the thumb on B♭.',
          ),
        ),
        step(
          'Black-Key Starting Scales: B♭ and D♭ Major',
          [
            prose(
              '<p>The conservatory guide permits starting RH B♭ Major on Finger 2, 3, or 4 — standard pedagogical recommendation is Finger 2 (2 on B♭ → 1 on C → 2 on D → 3 on E♭ → 1 on F → 2 on G → 3 on A → 4 on B♭). Insisting there is only one valid fingering for B♭ Major is a common anti-pattern; black-key starts allow personal choice. In D♭ Major, RH uses fingers 2, 3, 4 on the black keys and the thumb on F and C only; Finger 5 is omitted to prevent twisting the wrist outward.</p>',
            ),
            sources(['Fingerings.pdf']),
          ],
          mcq(
            'According to the conservatory guide, which finger is the standard pedagogical recommendation for starting the right-hand B♭ Major scale?',
            ['Finger 3', 'Finger 2', 'Finger 4', 'Finger 1'],
            1,
            'The step text states that the standard pedagogical recommendation is Finger 2 (2 on B♭ → 1 on C → etc.).',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-1-4',
      'Scale Practice Patterns 1–3',
      [
        step(
          'Three Technical Practice Variations',
          [
            prose('<p>Once a scale’s notes and fingering are secure, three practice patterns build technical control.</p>'),
            table(
              ['Pattern', 'Technical Focus', 'Execution Protocol'],
              [
                ['Pattern 1', 'Rhythmic Subdivisions & Speed Ladders', 'Play in quarter notes (1 click), eighth notes (2 per click), and triplets at a steady tempo.'],
                ['Pattern 2', 'Articulation Contrasts', 'Ascend in pure legato; descend in crisp staccato.'],
                ['Pattern 3', 'Dynamic Phrasing', 'Ascend with crescendo (p to f); descend with diminuendo (f to p).'],
              ],
            ),
            sources(['Exercises - Major scales pattern 1.pdf', 'Exercises - Major scales pattern 2.pdf', 'Exercises - Major scales pattern 3.pdf']),
          ],
          multi(
            'Which of the following correctly describe the three practice patterns for building technical control once a scale is secure?',
            [
              'Pattern 1 uses rhythmic subdivisions including quarter notes, eighth notes, and triplets at a steady tempo',
              'Pattern 2 plays ascending in staccato and descending in legato',
              'Pattern 3 ascends with a crescendo from p to f and descends with a diminuendo from f to p',
              'Pattern 1 focuses only on dynamic phrasing',
              'Pattern 2 uses pure legato ascending and crisp staccato descending',
            ],
            [0, 2, 4],
            'The step text states Pattern 1 as rhythmic subdivisions and speed ladders (quarter notes, eighth notes, triplets at steady tempo), Pattern 2 as articulation contrasts (ascend in pure legato, descend in crisp staccato), and Pattern 3 as dynamic phrasing (ascend crescendo p to f, descend diminuendo f to p).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m10-1-ex-a',
      type: 'Rotational scale circuit',
      title: 'Protocol 10.1-A — Two-Keys-Per-Week Rotational Circuit',
      prompt: 'Week 1: C Major and G Major (HS -> HT similar motion). Week 2: D Major and A Major (HS -> HT). Week 3: E Major and B Major (HS). Week 4: F Major and B♭ Major (HS). Week 5: E♭ Major and A♭ Major (HS). Week 6: D♭ Major and G♭ Major (HS).',
    },
  ],
  checkpoints: ['Self-check the outcomes above. No auto-grader for posture or tone.'],
  outcomes: [
    'Generate the exact note spellings and accidental structures for all 12 Major scales using the W-W-H-W-W-W-H formula.',
    'Group the 12 major scales into their three standard anatomical fingering families.',
    'Execute the sharp-side family (C, G, D, A, E, B) full 1-octave hands separately with standard fingering.',
    'Execute the flat-side family (F, B♭, E♭, A♭, D♭, G♭ / F♯) full 1-octave hands separately.',
    'Apply technical practice variations: Pattern 1 (Rhythmic & Metronome ladders), Pattern 2 (Articulation contrasts), and Pattern 3 (Dynamic crescendos/diminuendos).',
    'Execute white-key-heavy Major scales (C, G, D, A, E, F) Hands Together in Similar Motion.',
  ],
  sources: [
    'Major Scales.pdf',
    'Fingerings.pdf',
    'Exercises - Major scales pattern 1.pdf',
    'The One Book of All Piano Scales.pdf',
    'Practice scales and arpeggios.pdf',
  ],
  practiceFocus: ['Two majors a week, published fingering, patterns 1–3.'],
  id: 'piano-m10-1',
  code: '10.1',
  title: 'All Twelve Major Scales (As Physical Playing)',
});
