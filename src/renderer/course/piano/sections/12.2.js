/**
 * Section 12.2 — Broken Chords: Alberti Bass and Rocking Accompaniments
 * Module 12 — Accompaniment Patterns
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_12_Accompaniment_Patterns/
 * Section_12.2_Broken_Chords_Alberti_Bass_Rocking.md), read in full before
 * authoring. Second section of Module 12 — authored together with 11.3,
 * 11.4, and 12.1 under Miranda's second explicit chaining instruction. This
 * section alone does NOT complete Module 12 (12.3-12.4 remain), so Level 12
 * stays unwired after this batch.
 *
 * Conversion notes:
 * - 12.2.2's Alberti-bass cycle (Low → High → Middle → High, fingers
 *   5-1-3-1) arpeggiates the same C major triad already asserted
 *   repeatedly across Module 11 — its `pcSet` assert reuses that same
 *   C-E-G spelling in this new rhythmic-figuration context. The G7/B
 *   voice-led shift reuses G7's own pcSet, already asserted in 11.3.1.
 * - `rhythm([0.5,0.5,0.5,0.5])` represents the Alberti cycle's four
 *   even eighth notes purely as a rhythmic pulse — same "generic
 *   durational pulse, not pitch content" role `rhythm()` played in 12.1.
 * - 12.2.4's Root-5th/Root-6th rocking pattern gets two real `interval`
 *   asserts (C→G = 7 semitones, a Perfect 5th; C→A = 9 semitones, a
 *   Major 6th) — the section's only new numeric interval claims.
 * - 12.2.5's Mozart K. 545 excerpt is a two-measure repertoire snippet with
 *   no new theory claim beyond the Alberti/G7 spellings already asserted in
 *   12.2.2, so it stays prose + table only, matching how prior repertoire-
 *   snippet lessons (e.g., Hot Cross Buns, Ode to Joy) were treated.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, rhythm, callout, sources, mcq, order } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l12-2-1',
      'Why Break a Chord? Classical Acoustic Flow',
      [
        step(
          'Continuous Flow Without Harmonic Density Clutter',
          [
            prose(
              '<p>If a composer writes a long 4-measure harmony, playing a single blocked whole note creates dead acoustic decay after Beat 2. Conversely, repeating full blocked chords can sound clunky and aggressive. Broken chords provide a continuous, shimmering, flowing bed of harmony that supports a singing melody without competing with it.</p>',
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'According to the step, what problem does playing a single blocked whole note create in a 4-measure harmony?',
            ['It creates a clunky and aggressive sound', 'It creates dead acoustic decay after Beat 2', 'It competes with the singing melody', 'It lacks continuous rhythmic momentum'],
            1,
            'The step text explicitly states that playing a single blocked whole note creates dead acoustic decay after Beat 2.',
          ),
        ),
      ],
      { minutes: 5 },
    ),
    lesson(
      'piano-l12-2-2',
      'The Alberti Bass Mechanics (5 → 1 → 3 → 1)',
      [
        step(
          'The Classical Cycle: Low → High → Middle → High',
          [
            prose(
              '<p>Named after 18th-century Italian composer Domenico Alberti, this is the most famous accompaniment pattern in Classical literature (Haydn, Mozart, Clementi, Beethoven). The cycle in C Major: Bottom Note (C, Finger 5) → Top Note (G, Finger 1) → Middle Note (E, Finger 3) → Top Note (G, Finger 1). The voice-led chord shift (to G7/B): Finger 5 steps to B, Finger 1 stays on G (or steps to F), Finger 3 plays D — pattern B(5) → G(1) → D(3) → G(1).</p>',
            ),
            table(
              ['Beat', '1', '&', '2', '&'],
              [
                ['Pitch', 'C', 'G', 'E', 'G'],
                ['Order', 'LOW', 'HIGH', 'MIDDLE', 'HIGH'],
                ['LH Digit', '5', '1', '3', '1'],
              ],
            ),
            rhythm([0.5, 0.5, 0.5, 0.5], { title: 'The Alberti Cycle', bpm: 60, caption: 'Four even eighth notes per measure: Low-High-Middle-High.' }),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          order(
            'What is the correct order of the classic Alberti Bass pattern in the left hand?',
            ['Bottom note (LOW)', 'Top note, first hit (HIGH)', 'Middle note (MIDDLE)', 'Top note, second hit (HIGH)'],
            ['Bottom note (LOW)', 'Top note, first hit (HIGH)', 'Middle note (MIDDLE)', 'Top note, second hit (HIGH)'],
            'The step text explicitly states the cycle as Bottom Note (LOW) → Top Note (HIGH) → Middle Note (MIDDLE) → Top Note (HIGH) and the table confirms Order | LOW | HIGH | MIDDLE | HIGH.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7, 10], notes: ['G', 'B', 'D', 'F'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l12-2-3',
      'The Forearm Rotary Solution (Defeating the Pinky Trap)',
      [
        step(
          'Rotating the Forearm Instead of Stabbing Fingers',
          [
            prose(
              '<p>Beginners commonly play the Alberti bass by stabbing downward with individual fingers, causing the pinky (Finger 5) and thumb (Finger 1) to bang aggressively on every eighth note. The biomechanical law: do not lift and stab fingers 5, 3, and 1 independently — keep the hand dome quiet and rotate the entire forearm from the elbow (like turning a doorknob back and forth). Dynamic leveling: the Alberti bass must sound like a quiet, even murmur (pp or mp) underneath the Right Hand melody; the thumb must touch the keytop with featherweight gentleness.</p>',
            ),
            callout('warning', 'The Pinky/Thumb Stabbing Trap', 'Do not lift and stab fingers 5, 3, and 1 independently. Rotate the entire forearm from the elbow — like turning a doorknob back and forth — keeping the hand dome quiet.'),
            sources(['5 effective warm-up exercises.pdf', 'Piano hand exercises.pdf']),
          ],
          mcq(
            "How should beginners avoid the common 'pinky/thumb stabbing' trap when playing Alberti bass?",
            ['Lift and stab fingers 5, 3, and 1 independently for precision', 'Keep the hand dome quiet and rotate the entire forearm from the elbow like turning a doorknob', 'Stab downward aggressively with individual fingers on every eighth note', 'Play with heavy pinky and thumb to emphasize the bass notes'],
            1,
            'The step text explicitly states to avoid lifting and stabbing fingers 5, 3, and 1 independently and instead keep the hand dome quiet while rotating the entire forearm from the elbow like turning a doorknob back and forth.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l12-2-4',
      'The Two-Note Rocking Pattern (Root-5th / Root-6th)',
      [
        step(
          'Alternating a Perfect 5th and a Major 6th',
          [
            prose(
              '<p>The two-note rocking pattern is the driving motor of blues, classic rock (Chuck Berry, The Beatles), and boogie-woogie. In C Major: the LH plays the C+G 5th dyad twice, then expands the thumb to play the C+A 6th dyad twice. The groove creates an energetic, rocking harmonic swing that drives pop and rock rhythms.</p>',
            ),
            table(
              ['Beat', '1', '&', '2', '&'],
              [
                ['Pitches', 'C + G', 'C + G', 'C + A', 'C + A'],
                ['Interval', '5th', '5th', '6th', '6th'],
                ['LH Digits', '5 + 1', '5 + 1', '5 + 1', '5 + 1'],
              ],
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'In the two-note rocking pattern in C Major, which interval is played on beats 2 and &?',
            ['5th', '6th', '3rd', '4th'],
            1,
            'The step text shows the interval as 6th for the C+A dyad played on beats 2 and &.',
          ),
          [
            { assert: 'interval', from: 'C4', to: 'G4', semitones: 7 },
            { assert: 'interval', from: 'C4', to: 'A4', semitones: 9 },
          ],
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l12-2-5',
      'Repertoire Snippet: Mozart Sonata in C Major, K. 545 Motif',
      [
        step(
          'A Singing RH Melody Over a Quiet LH Alberti Bass',
          [
            prose(
              '<p>Measure 1 (C Major): RH melody is C (half note), then E (quarter), G (quarter); LH Alberti runs C(5)-G(1)-E(3)-G(1), repeated for the second half of the measure. Measure 2 (G7/C resolution): RH melody is B (dotted half note), resolving into a trill; LH Alberti shifts to B(5)-G(1)-D(3)-G(1), then returns to C(5)-G(1)-E(3)-G(1).</p>',
            ),
            table(
              ['Measure', 'RH melody', 'LH Alberti'],
              [
                ['1 (C Major)', 'C (half) — E (quarter) — G (quarter)', 'C(5) G(1) E(3) G(1) — C(5) G(1) E(3) G(1)'],
                ['2 (G7 → C)', 'B (dotted half, then trill)', 'B(5) G(1) D(3) G(1) — C(5) G(1) E(3) G(1)'],
              ],
            ),
            sources(['Piano Chords for Beginners.pdf', 'Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'In measure 2 of the C Major snippet, what is the Left Hand Alberti pattern for the G7 portion before resolving back to C?',
            ['C(5)-G(1)-E(3)-G(1)', 'B(5)-G(1)-D(3)-G(1)', 'C(5)-G(1)-D(3)-G(1)', 'B(5)-D(3)-G(1)-D(3)'],
            1,
            'The step text explicitly states that in measure 2 the LH Alberti shifts to B(5)-G(1)-D(3)-G(1) for the G7 portion before returning to the C pattern.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m12-2-ex-a',
      type: 'Alberti voice-leading loop',
      title: 'Protocol 12.2-A — Alberti Voice-Leading Loop',
      prompt: 'Set metronome to 60 BPM. In LH, execute continuous 8th-note Alberti bass: 2 measures of C Major (C(5)→G(1)→E(3)→G(1)), 2 measures of G Major (B(5)→G(1)→D(3)→G(1)), 2 measures of F Major (C(5)→A(1)→F(3)→A(1)), 2 measures of C Major (C(5)→G(1)→E(3)→G(1)). Ensure perfectly even volume and supple forearm rotation.',
    },
  ],
  checkpoints: [
    'Pattern recitation: can state the Alberti formula (Low → High → Middle → High) and fingers (5-1-3-1).',
    'Forearm rotation: demonstrates visible forearm rotary motion rather than rigid finger poking during Alberti figures.',
    'Two-note rock: can execute the Root-5th to Root-6th rocking figure in C and G.',
    'Two-hand coordination: can play the K. 545 theme snippet with quiet LH Alberti accompaniment beneath a lyrical RH melody.',
  ],
  outcomes: [
    'Explain the acoustic function of broken chords: maintaining continuous rhythmic momentum without harmonic density clutter.',
    'Execute the classic Alberti Bass pattern in Left Hand: Lowest → Highest → Middle → Highest (Fingers 5 → 1 → 3 → 1).',
    'Eliminate the "Heavy Pinky / Heavy Thumb" trap by utilizing Forearm Rotation rather than isolated finger stabbing.',
    'Execute the classic Two-Note Rocking Accompaniment (alternating Root-5th and Root-6th in classic rock/pop and boogie-woogie).',
    'Perform an integrated two-hand classical étude snippet utilizing Alberti Bass in LH beneath a singing legato RH melody.',
  ],
  sources: [
    'Piano Chords for Beginners.pdf',
    '5 effective warm-up exercises.pdf',
    'Piano hand exercises.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Slow Alberti in C; one rocking pattern.'],
  id: 'piano-m12-2',
  code: '12.2',
  title: 'Broken Chords: Alberti Bass and Rocking Accompaniments',
});
