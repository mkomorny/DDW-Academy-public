/**
 * Section 10.2 — The Three Minor Scale Forms: Natural, Harmonic, and Melodic
 * Module 10 — The Scale System
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_10_The_Scale_System/
 * Section_10.2_Three_Minor_Forms_Natural_Harmonic_Melodic.md), read in full
 * before authoring. Second section of Module 10 — authored together with
 * 9.2, 9.3, and 10.1 under Miranda's explicit one-time chaining override
 * ("do the next 4 steps in one pass"), the sixth such documented exception.
 * This section alone does NOT complete Module 10 (10.3 and 10.4 remain), so
 * Level 10 stays unwired after this batch.
 *
 * Conversion notes:
 * - First live use of `scaleExplorer('harmonic-minor-scales', ...)` and
 *   `scaleExplorer('melodic-minor-scales', ...)`. Confirmed both ids and
 *   their step formulas against src/data/scales.json before authoring:
 *   harmonic-minor-scales' degrees/steps produce the raised-7th augmented
 *   2nd the source describes, and melodic-minor-scales' steps (raised 6
 *   and 7, both directions) match the source's own ASCENDING pattern —
 *   melodic-minor-scales has an EMPTY `roots` map in the data file (no
 *   mined per-key spelling/fingering), confirmed via reading
 *   `realiseScale()` in theory.js: it falls back to `spellFromDegrees()`
 *   when `scale.roots[pc]` is missing, so the block still renders correctly
 *   from the degree formula alone rather than erroring or going blank.
 * - The Descending form (reverting to natural minor) has no separate scale
 *   id in the mined library — there's no "melodic minor descending" entry
 *   distinct from natural minor itself — so it stays prose-only, matching
 *   this course's rule to fall back to prose when no block fits a specific
 *   directional claim.
 * - The Augmented 2nd (harmonic minor's raised-7th interval, F to G♯, 3
 *   semitones) gets a real `interval` assert — it's the section's single
 *   most load-bearing numeric claim, repeated across three of the five
 *   lessons in the source's own prose.
 * - Lesson 10.2.4's cadence comparison (v-i vs V-i) stays a `table()` +
 *   prose rather than a `progression()` block: CHORD_TYPES/progression data
 *   wasn't confirmed to cover this comparison's exact voicing, and the
 *   source's own ASCII box is already a clean literal table, not diagrammatic
 *   art needing conversion.
 * - Check-drafting provenance: all 6 step checks were drafted via the xAI
 *   client, 6 of 6 verified on the first entailment attempt (part of a
 *   26/26 first-attempt run across all four sections in this chained batch).
 *   All passed manual review unchanged (mcq, text kinds).
 */
import { module_, lesson, step, prose, table, scaleExplorer, sources, mcq, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l10-2-1',
      'Form 1: Natural Minor (The Pure Key Signature Form)',
      [
        step(
          'The Default Minor Form and Its Harmonic Problem',
          [
            prose(
              '<p>The Natural Minor Scale is the default minor scale derived directly from a minor key signature without any added accidentals: Formula W-H-W-W-H-W-W, Solfège Do-Re-Me-Fa-So-Le-Te-Do. In A Natural Minor, the 7th degree is G♮ (Subtonic), a full whole step below the tonic A. A chord built on the 5th degree is E minor (E-G-B). The resolution Em to Am sounds modal, weak, and lacks definitive finality.</p>',
            ),
            scaleExplorer('minor-scales', 'A', { showFingering: true, caption: 'A Natural Minor — the pure key-signature form, no added accidentals.' }),
            sources(['The Ultimate Guide to All Minor Scales Piano Edition.pdf']),
          ],
          mcq(
            'In the Natural Minor Scale, what is the name given to the 7th scale degree when it is a whole step below the tonic?',
            ['Leading Tone', 'Subtonic', 'Dominant', 'Supertonic'],
            1,
            'The step text states that in A Natural Minor the 7th degree is G♮ (Subtonic), a full whole step below the tonic A.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-2-2',
      'Form 2: Harmonic Minor (The Raised 7th and the Augmented 2nd)',
      [
        step(
          'Raising the 7th for a True Leading Tone',
          [
            prose(
              '<p>To create an authentic, powerful classical cadence, composers raised the 7th scale degree by one half step: G♮ becomes G♯ (Leading Tone). Formula: W-H-W-W-H-[Aug 2nd]-H. Between Degree 6 (F) and Degree 7 (G♯), the interval spans 3 half steps (1.5 whole steps) — the Augmented 2nd, creating the characteristic “exotic/Middle-Eastern” dramatic tension. The payoff: the Dominant chord built on E is now E Major (E-G♯-B), providing the essential leading-tone pull to resolve decisively to Am.</p>',
            ),
            scaleExplorer('harmonic-minor-scales', 'A', { showFingering: true, caption: 'A Harmonic Minor — raised 7th (G♯), Augmented 2nd between F and G♯.' }),
            sources(['Harmonic Minor Scales.pdf']),
          ],
          mcq(
            'What does the text state that composers do to the 7th scale degree to create an authentic, powerful classical cadence?',
            ['Leave it as G♮', 'Raise it by one half step to G♯', 'Lower it by one half step to F♯', 'Raise both 6 and 7'],
            1,
            'The step text explicitly states that composers raised the 7th scale degree by one half step: G♮ becomes G♯ (Leading Tone).',
          ),
          [
            { assert: 'interval', from: 'F4', to: 'G#4', semitones: 3 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-2-3',
      'Form 3: Classical Melodic Minor (The Vocal Smoothing)',
      [
        step(
          'Ascending: Raising Both the 6th and 7th',
          [
            prose(
              '<p>While Harmonic Minor solved the harmonic problem, singers found the 3-semitone leap (F to G♯) difficult to sing smoothly. Melodic Minor provides the vocal solution: ascending, raise BOTH the 6th (F to F♯) and 7th (G to G♯) by one half step. Pitch sequence: A-B-C-D-E-F♯-G♯-A. Step formula: W-H-W-W-W-W-H. Solfège: Do-Re-Me-Fa-So-LA-TI-Do. This produces a smooth stepwise ascent — a whole step between the 6th and 7th degrees rather than harmonic minor’s augmented 2nd.</p>',
            ),
            scaleExplorer('melodic-minor-scales', 'A', { caption: 'A Melodic Minor, ascending form — 6th and 7th both raised, smooth stepwise motion.' }),
            sources(['The Ultimate Guide to All Minor Scales Piano Edition.pdf']),
          ],
          text(
            'What is the step formula for the ascending melodic minor scale?',
            ['w-h-w-w-w-w-h', 'whole-half-whole-whole-whole-whole-half'],
            'The step text explicitly states the melodic minor step formula as W-H-W-W-W-W-H.',
          ),
          [
            { assert: 'interval', from: 'F#4', to: 'G#4', semitones: 2 },
          ],
        ),
        step(
          'Descending: Reverting to Natural Minor',
          [
            prose(
              '<p>When descending, the leading tone is no longer pulling upward to the tonic, so both the 7th (G♯ to G♮) and 6th (F♯ to F♮) lower back to the key signature: A-G♮-F♮-E-D-C-B-A, Solfège Do-TE-LE-So-Fa-Me-Re-Do. In jazz and contemporary theory, the melodic minor scale is often played with the 6th and 7th raised both ascending and descending (the “Jazz Minor”); classical conservatory training enforces this traditional dual-direction form instead. Forgetting to lower degrees 6 and 7 when descending is a common anti-pattern — in classical melodic minor, descending must revert to natural minor notes.</p>',
            ),
            sources(['The Ultimate Guide to All Minor Scales Piano Edition.pdf']),
          ],
          mcq(
            'When descending in the classical melodic minor scale, what must happen to the 6th and 7th degrees?',
            ['They stay raised', 'They are both lowered back to the key signature', 'Only the 7th is lowered', 'They are raised further'],
            1,
            'The step text states that when descending, both the 7th (G♯ to G♮) and 6th (F♯ to F♮) lower back to the key signature, reverting to natural minor notes.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-2-4',
      'Cadence Comparison: v → i vs. V → i',
      [
        step(
          'Modal vs. Authentic Harmonic Cadence',
          [
            prose('<p>Comparing the two forms’ harmony in A minor:</p>'),
            table(
              ['Form', 'LH Harmony', 'Chord', 'Acoustic Result'],
              [
                ['Natural Minor (v - i)', 'E-G-B -> A-C-E', 'E minor (v)', 'Modal, passive, ancient, lacks directional pull.'],
                ['Harmonic Minor (V - i)', 'E-G♯-B -> A-C-E', 'E Major (V)', 'Powerful, tense leading-tone resolution — G♯ snaps up to A.'],
              ],
            ),
            sources(['Harmonic Minor Scales.pdf']),
          ],
          mcq(
            'According to the comparison table, what acoustic result is associated with the Harmonic Minor form\'s V - i cadence in A minor?',
            [
              'Modal, passive, ancient, lacks directional pull',
              'Powerful, tense leading-tone resolution — G♯ snaps up to A',
              'Augmented 2nd interval between 6 and 7',
              'Restoring 6 and 7 descending',
            ],
            1,
            'The table explicitly states that the Harmonic Minor (V - i) with E Major (V) chord produces a "Powerful, tense leading-tone resolution — G♯ snaps up to A."',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l10-2-5',
      'Five Primary Minor Keys in All Three Forms',
      [
        step(
          'A, E, D, B, and G Minor in All Three Forms',
          [
            prose('<p>The five primary minor keys, spelled in all three forms:</p>'),
            table(
              ['Root', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor (ascending)'],
              [
                ['A Minor', 'A-B-C-D-E-F-G-A', 'A-B-C-D-E-F-G♯-A', 'A-B-C-D-E-F♯-G♯-A'],
                ['E Minor', 'E-F♯-G-A-B-C-D-E', 'E-F♯-G-A-B-C-D♯-E', 'E-F♯-G-A-B-C♯-D♯-E'],
                ['D Minor', 'D-E-F-G-A-B♭-C-D', 'D-E-F-G-A-B♭-C♯-D', 'D-E-F-G-A-B♮-C♯-D'],
                ['B Minor', 'B-C♯-D-E-F♯-G-A-B', 'B-C♯-D-E-F♯-G-A♯-B', 'B-C♯-D-E-F♯-G♯-A♯-B'],
                ['G Minor', 'G-A-B♭-C-D-E♭-F-G', 'G-A-B♭-C-D-E♭-F♯-G', 'G-A-B♭-C-D-E♮-F♯-G'],
              ],
            ),
            sources(['Minor Scales Fingering Guide.pdf', 'Music Theory Worksheet 20 Natural Minor Scale']),
          ],
          mcq(
            'According to the table, what is the 7th scale degree in the harmonic minor form of E Minor?',
            ['D', 'D♯', 'C', 'C♯'],
            1,
            'The step text shows E-F♯-G-A-B-C-D♯-E for the harmonic minor of E Minor, making D♯ the raised 7th scale degree.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m10-2-ex-a',
      type: '3-form mutation drill',
      title: 'Protocol 10.2-A — 3-Form Minor Mutation Drill',
      prompt: 'Place RH on A (1-2-3-1-2-3-4-5). Play A Natural Minor up and down at 60 BPM. Play A Harmonic Minor up and down (raise finger 4 to G♯); hear the augmented 2nd. Play A Melodic Minor (F♯-G♯ ascending; G♮-F♮ descending). Repeat with E, D, B, G Minor.',
    },
  ],
  checkpoints: ['Self-check the outcomes above. No auto-grader for posture or tone.'],
  outcomes: [
    'Construct and perform the Natural Minor Scale (W-H-W-W-H-W-W / Do-Re-Me-Fa-So-Le-Te-Do).',
    'Construct and perform the Harmonic Minor Scale by raising the 7th scale degree by one half step (Te → Ti), creating an Augmented 2nd interval between 6 and 7.',
    'Construct and perform the Classical Melodic Minor Scale (raising 6 and 7 ascending: Le → La, Te → Ti; restoring them to natural minor descending: Te, Le).',
    'Explain how each minor form directly solves the harmonic or melodic limitation of the preceding form.',
    'Perform A, E, D, B, and G Minor in all three forms hands separately.',
    'Execute the harmonic cadence comparison: v → i (Modal/Weak) vs. V → i (Authentic Harmonic Cadence).',
  ],
  sources: [
    'The Ultimate Guide to All Minor Scales Piano Edition.pdf',
    'Harmonic Minor Scales.pdf',
    'Minor Scales Fingering Guide.pdf',
    'Music Theory Worksheet 20 Natural Minor Scale',
  ],
  practiceFocus: ['Natural → harmonic → melodic on one key per day.'],
  id: 'piano-m10-2',
  code: '10.2',
  title: 'The Three Minor Scale Forms: Natural, Harmonic, and Melodic',
});
