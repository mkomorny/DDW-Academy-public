/**
 * Section 10.4 — The Chromatic Scale and a Lifetime Practice Rotation
 * Module 10 — The Scale System
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_10_The_Scale_System/
 * Section_10.4_Chromatic_Scale_And_Lifetime_Practice_Rotation.md), read in
 * full before authoring. Fourth and final section of Module 10 — authored
 * together with 10.3, 11.1, and 11.2 under Miranda's explicit chaining
 * instruction. Completing this section completes Module 10, so Level 10
 * and Gate H are wired into piano/index.js in the same batch.
 *
 * Conversion notes:
 * - First live use of `scaleExplorer('chromatic-scales', ...)`. Confirmed
 *   the id and its 12-half-step formula against src/data/scales.json
 *   before authoring — like `melodic-minor-scales` (batch 15), it has an
 *   EMPTY `roots` map (no mined per-key spelling), so it renders via
 *   theory.js's `spellFromDegrees()` fallback rather than a mined
 *   fingering table; this section's prose never claims a specific mined
 *   fingering pattern for that reason, only the 1-2-3 rule the source
 *   itself states in prose form.
 * - 10.4.3's "D and G♯ are the exact physical axes of symmetry" claim gets
 *   a real `interval` assert (D4→G♯4, 6 semitones — a tritone, i.e.
 *   exactly half an octave, which is what makes two points symmetrical
 *   axes on a repeating 12-tone keyboard).
 * - The Gate H Assessment Audit closes Lesson 10.4.4 as its own step,
 *   matching the Gate D/E/F/G precedent (Sections 5.3/6.3/8.3/9.3): a
 *   `table()` of the audit's own items plus a `multi()` check, with the
 *   same 5 items promoted into this module's checkpoints[] below and into
 *   GATES's new Gate H entry in piano/index.js.
 * - Fingering-only claims (which finger plays which key class) have no
 *   theory-oracle equivalent (posture/mechanics, not a pitch fact) and
 *   stay prose + table only, same treatment as every prior fingering-rule
 *   lesson in this course (e.g. 5.1, 6.2).
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, scaleExplorer, sources, mcq, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l10-4-1',
      'Twelve Pitches in a Row: No Gaps, No Formula',
      [
        step(
          'The Chromatic Scale Defined',
          [
            prose(
              '<p>The Chromatic Scale contains all twelve semitones of the equal-tempered octave — derived from the Greek <em>chromos</em> (color). It is an uninterrupted sequence of half steps (H-H-H-H-H-H-H-H-H-H-H-H), with no formula of whole and half steps to memorize since every step is a half step. Ascending, the solfège syllables use sharp alterations: Do-Di-Re-Ri-Mi-Fa-Fi-So-Si-La-Li-Ti-Do. Descending, they use flat alterations: Do-Ti-Te-La-Le-So-Se-Fa-Mi-Me-Re-Ra-Do.</p>',
            ),
            scaleExplorer('chromatic-scales', 'C', { caption: 'The Chromatic Scale from C — all 12 pitches, every step a half step.' }),
            sources(['Chromatic Scales.pdf']),
          ],
          mcq(
            'What is the pattern of steps in the chromatic scale?',
            ['W-H-W-H-W-H-W-H-W-H-W-H', 'H-H-H-H-H-H-H-H-H-H-H-H', 'W-W-H-W-W-W-H-W-W-H-W-H', 'H-W-H-W-H-W-H-W-H-W-H-W'],
            1,
            'The step text states that the chromatic scale is an uninterrupted sequence of half steps (H-H-H-H-H-H-H-H-H-H-H-H) with no formula of whole and half steps to memorize since every step is a half step.',
          ),
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l10-4-2',
      'The Universal 3-Finger Chromatic Rule',
      [
        step(
          'Digits 1, 2, and 3 — the Default Pair and the Natural-Semitone Exception',
          [
            prose(
              '<p>Unlike diatonic scales that require all 5 digits, the chromatic scale is executed almost entirely with only three fingers. The default pair: Digit 1 (Thumb) plays every isolated white key; Digit 3 (Middle) plays every black key. The exception is the natural semitone: where two white keys are directly adjacent with no black key between them (E-F and B-C), Finger 2 must be deployed instead — ascending RH, thumb on E is followed by Finger 2 on F, and thumb on B is followed by Finger 2 on C.</p>',
            ),
            table(
              ['Pitch', 'Key type', 'RH digit'],
              [
                ['C', 'white', '1'],
                ['C♯', 'black', '3'],
                ['D', 'white', '1'],
                ['D♯', 'black', '3'],
                ['E', 'white', '1'],
                ['F', 'white (natural semitone)', '2'],
                ['F♯', 'black', '3'],
                ['G', 'white', '1'],
                ['G♯', 'black', '3'],
                ['A', 'white', '1'],
                ['A♯', 'black', '3'],
                ['B', 'white (natural semitone)', '2'],
              ],
              'Finger 2 bridges the two places with no black key between adjacent white keys: E–F and B–C.',
            ),
            sources(['Chromatic Scale Piano Fingering.pdf']),
          ],
          mcq(
            'According to the chromatic scale fingering rule, which finger plays the white key F in the right hand ascending?',
            ['Digit 1 (thumb)', 'Digit 2', 'Digit 3 (middle)', 'Digit 4'],
            1,
            'The step text states that for the natural semitone E-F, thumb on E is followed by Finger 2 on F.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-4-3',
      'Contrary Motion Chromaticism: The Symmetrical Gate',
      [
        step(
          'Both Hands Mirror Each Other from D',
          [
            prose(
              '<p>Neurologically, the easiest way to coordinate both hands on a chromatic scale is Contrary Motion. Starting with both thumbs resting on middle D: the RH ascends right (1:D → 3:D♯ → 1:E → 2:F → 3:F♯ → 1:G → 3:G♯...) while the LH descends left (1:D → 3:C♯ → 1:C → 2:B → 3:A♯ → 1:A → 3:G♯...). Because D and G♯ are the exact physical axes of symmetry on the piano keyboard, both hands execute identical digit pairs simultaneously.</p>',
            ),
            scaleExplorer('chromatic-scales', 'D', { caption: 'The Chromatic Scale from D — the RH ascending half of the contrary-motion drill.' }),
            sources(['Piano scales exercises.pdf']),
          ],
          mcq(
            'According to the step text, why is starting with both thumbs on middle D neurologically easiest for coordinating both hands on a chromatic scale?',
            ['Because D is the center of the keyboard', 'Because D and G♯ are the exact physical axes of symmetry on the piano keyboard', 'Because the thumbs are the strongest fingers', 'Because the chromatic scale has 12 notes'],
            1,
            'The step text states that D and G♯ are the exact physical axes of symmetry on the piano keyboard, so both hands execute identical digit pairs simultaneously.',
          ),
          [
            { assert: 'interval', from: 'D4', to: 'G#4', semitones: 6 },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l10-4-4',
      'The Lifetime Scale Practice Rotation System, and Gate H',
      [
        step(
          'A Weekly Rotational Circuit, Not a Chaotic Single Session',
          [
            prose(
              '<p>A serious pianist does not practice all 24 major and minor scales in a single chaotic session. Instead, a structured weekly rotational circuit spreads the work across the week in 10-12 minutes daily.</p>',
            ),
            table(
              ['Day', 'Focus routine'],
              [
                ['Mon', 'Major Scale A (HS 2 octaves, HT 1 octave, patterns 1-3)'],
                ['Tue', 'Relative Minor A in all 3 forms (Natural, Harmonic, Melodic)'],
                ['Wed', 'Major Scale B (flat/sharp contrasting key from the circle)'],
                ['Thu', 'Relative Minor B in all 3 forms'],
                ['Fri', 'Chromatic Scale (HS, HT Contrary, HT Similar) at 80 BPM'],
                ['Sat', 'Full 4-key review (arpeggios & cadences preview)'],
              ],
            ),
            sources(['Practice scales and arpeggios.pdf', 'How to Learn and Memorize Scales.pdf']),
          ],
          order(
            'In the structured weekly scale rotation, what is the correct sequence of focus routines from Monday through Friday?',
            [
              'Major Scale B (flat/sharp contrasting key from the circle)',
              'Relative Minor A in all 3 forms (Natural, Harmonic, Melodic)',
              'Chromatic Scale (HS, HT Contrary, HT Similar) at 80 BPM',
              'Major Scale A (HS 2 octaves, HT 1 octave, patterns 1-3)',
              'Relative Minor B in all 3 forms',
            ],
            [
              'Major Scale A (HS 2 octaves, HT 1 octave, patterns 1-3)',
              'Relative Minor A in all 3 forms (Natural, Harmonic, Melodic)',
              'Major Scale B (flat/sharp contrasting key from the circle)',
              'Relative Minor B in all 3 forms',
              'Chromatic Scale (HS, HT Contrary, HT Similar) at 80 BPM',
            ],
            'The step text presents the weekly rotational circuit in a Day | Focus routine table that explicitly lists Major Scale A on Mon, Relative Minor A on Tue, Major Scale B on Wed, Relative Minor B on Thu, and Chromatic Scale on Fri.',
          ),
        ),
        step(
          'Gate H Assessment Audit',
          [
            prose('To pass Gate H and unlock Module 11 (Chords and Harmony), verify all five items below.'),
            table(
              ['Gate H requirement', 'What to verify'],
              [
                ['Circle of Fifths drawn', 'Can draw the complete 12-key Circle of Fifths with major and relative minor keys from memory in under 3 minutes.'],
                ['Two major scales, contrasting families', 'Can perform two major scales from different fingering families (e.g., G Major and B♭ Major) 1 octave HS at steady 72 BPM.'],
                ['One minor scale, all three forms', 'Can perform one minor scale (e.g., D Minor) in Natural, Harmonic, and Classical Melodic forms with 100% correct pitch alteration.'],
                ['Chromatic scale 1-octave mastery', 'Can perform the 1-octave Chromatic scale HS and HT (Contrary Motion) using standard 1-3 / 1-2 fingering with zero pauses.'],
                ['Unbroken metric tempo', 'All scale assessments executed without stopping, resetting, or rushing.'],
              ],
            ),
            sources(['Chromatic Scales.pdf', 'Practice scales and arpeggios.pdf']),
          ],
          mcq(
            'According to the Gate H requirements, what must be true for the chromatic scale assessment?',
            ['Perform 2 octaves HS only at 72 BPM', 'Perform 1-octave HS and HT (Contrary Motion) with zero pauses using 1-3/1-2 fingering', 'Perform HT in similar motion with both hands on black keys', 'Perform the chromatic scale in all three minor forms'],
            1,
            'The step text states that the chromatic scale requirement is to perform the 1-octave Chromatic scale HS and HT (Contrary Motion) using standard 1-3 / 1-2 fingering with zero pauses.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m10-4-ex-a',
      type: 'Chromatic contrary & similar drill',
      title: 'Protocol 10.4-A — Chromatic Contrary & Similar Drill',
      prompt: 'Set metronome to 72 BPM. Place both thumbs on D4. Execute 1-octave contrary chromatic scale ×4 clean takes. Place RH on C4, LH on C3. Execute 1-octave similar motion chromatic scale hands separately, then hands together.',
    },
  ],
  checkpoints: [
    'Circle of Fifths drawn: can draw the complete 12-key Circle of Fifths with major and relative minor keys from memory in under 3 minutes.',
    'Two major scales, contrasting families: can perform two major scales from different fingering families (e.g., G Major and B♭ Major) 1 octave HS at steady 72 BPM.',
    'One minor scale, all three forms: can perform one minor scale (e.g., D Minor) in Natural, Harmonic, and Classical Melodic forms with 100% correct pitch alteration.',
    'Chromatic scale 1-octave mastery: can perform the 1-octave Chromatic scale HS and HT (Contrary Motion) using standard 1-3 / 1-2 fingering with zero pauses.',
    'Unbroken metric tempo: all scale assessments executed without stopping, resetting, or rushing.',
  ],
  outcomes: [
    'Define the Chromatic Scale as the complete sequence of all 12 musical pitches separated by uninterrupted half steps (1 semitone).',
    'Execute the standard Chromatic Fingering Rule: Digit 1 (Thumb) plays white keys; Digit 3 plays black keys; Digit 2 is used exclusively on the adjacent white keys (E–F and B–C).',
    'Perform the Contrary Motion Chromatic Scale (starting on D/D or G♯/G♯ symmetry points) hands together.',
    'Perform the Similar Motion Chromatic Scale 1-octave hands separately and together.',
    'Establish and adhere to the structured Lifetime Scale Practice Rotation (2 Majors, 2 Minors in 3 forms, 1 Chromatic per week).',
    'Complete and execute the Gate H Assessment Rubric.',
  ],
  sources: [
    'Chromatic Scales.pdf',
    'Chromatic Scale Piano Fingering.pdf',
    'Piano scales exercises.pdf',
    'Practice scales and arpeggios.pdf',
    'How to Learn and Memorize Scales.pdf',
  ],
  practiceFocus: ['Chromatic octave HS; write the rotation (Gate H).'],
  id: 'piano-m10-4',
  code: '10.4',
  title: 'The Chromatic Scale and a Lifetime Practice Rotation',
});
