/**
 * Section 14.3 — Lead Sheet Arrangement Lab: The Complete Multi-Chorus Performance
 * Module 14 — Lead Sheets and Playing by Ear (completes the module — Gate J)
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_14_Lead_Sheets_And_Playing_
 * By_Ear/Section_14.3_Lead_Sheet_Arrangement_Lab.md), read in full before
 * authoring.
 *
 * Conversion notes:
 * - §2's citations (deduped — "Piano Chords for Beginners.pdf" is cited
 *   twice in the source) match the scaffold's four sources exactly.
 * - 14.3.1's Intro harmonic cycle (I → vi → IV → V7 in G Major) is realized
 *   with `progression(['G','Em','C','D7'], {numerals:['I','vi','IV','V7']})`
 *   — the block's chord-symbol parser (`renderers.progression` in
 *   blocks.js) maps 'Em'→min and 'D7'→dom7 directly, so no new chord types
 *   are needed. A `pcSet` assert confirms the G Major (I) triad.
 * - 14.3.2 (Model 3 chorus voicing) restates 14.1.3's technique applied to
 *   this specific piece's pitches — no new spelling claim, so no `asserts`.
 * - 14.3.3 is this module's own Gate J lesson: one step folding in the
 *   3-step recording protocol, the 4-item Gate J Assessment Audit table, and
 *   a closing `callout('warning', …)` from §4's two traps — same combined
 *   shape as 12.4.4's own Gate-lesson treatment.
 * - §6's Gate J Assessment Audit (4 items) replaces the scaffold's generic
 *   `checkpoints[]` — this is Module 14's own gate (the syllabus's Gate J),
 *   so completing this section also adds a new GATES entry when Level 14 is
 *   wired.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, callout, progression, sources, mcq, multi } from '../../schema.js';

export default module_({
  id: 'piano-m14-3',
  code: '14.3',
  title: 'Lead Sheet Arrangement Lab: The Complete Multi-Chorus Performance',
  outcomes: [
    'Arrange and perform a complete 32-bar concert piece directly from a single-line lead sheet.',
    'Structure and execute a dynamic 4-phase arrangement architecture: Intro → Verse (Pulsing / Broken) → Climax Chorus (Harmonized RH Model 3 Voicing) → Outro Sweep.',
    'Integrate voice-led inverted chords in the Left Hand while projecting a singing, lyrical melody in the Right Hand.',
    'Execute seamless textural and dynamic transitions (p → mf → f → pp) across chorus boundaries.',
    'Capture an unedited, continuous video or audio performance take.',
    'Complete and execute the Gate J Assessment Rubric.',
  ],
  sources: [
    'Piano Chords for Beginners.pdf',
    'How to Choose The Correct Piano Chord.pdf',
    'Piano Skill Levels Explained.pdf',
    'Tips on how to practice piano.pdf',
  ],
  practiceFocus: ['One multi-chorus lead-sheet take (Gate J).'],
  lessons: [
    lesson(
      'piano-l14-3-1',
      'The Arrangement Blueprint',
      [
        step(
          'Four Phases, One Continuous Take',
          [
            prose(
              '<p>A lead sheet is a canvas. This arrangement (Amazing Grace, G Major) moves through four phases: the Intro previews the harmonic cycle (I → vi → IV → V7) using rolled chords for a contemplative atmosphere; the Verse uses light, broken 5ths (G-D-B) in the Left Hand to give the melody room to breathe; the Chorus shifts into Model 3 Voicing — the Right Hand plays 3-note chords with the melody on top, supported by powerful low bass octaves in the Left Hand; the Outro concludes with an expansive Cross-Hand Arpeggio that dissolves into the sustain pedal.</p>',
            ),
            table(
              ['Phase', 'Measures', 'Texture'],
              [
                ['Intro', 'M1–M4', 'Rolled chords previewing the harmonic cycle (I → vi → IV → V7) for a contemplative atmosphere.'],
                ['Verse', 'M5–M16', 'Light, broken 5ths (G-D-B) in the Left Hand give the melody room to breathe.'],
                ['Chorus', 'M17–M24', 'Model 3 voicing — Right Hand 3-note chords with melody on top, over powerful low bass octaves.'],
                ['Outro', 'M25–M28', 'An expansive Cross-Hand Arpeggio that dissolves into the sustain pedal.'],
              ],
            ),
            progression(
              ['G', 'Em', 'C', 'D7'],
              { numerals: ['I', 'vi', 'IV', 'V7'], caption: 'The Intro previews this I → vi → IV → V7 harmonic cycle before the Verse begins.' },
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'What texture does the Verse phase use in the left hand according to the lead sheet arrangement?',
            ['Rolled chords', 'Light, broken 5ths (G-D-B)', '3-note chords with melody on top', 'Cross-Hand Arpeggio'],
            1,
            'The step text states that the Verse uses light, broken 5ths (G-D-B) in the Left Hand to give the melody room to breathe.',
          ),
          [{ assert: 'pcSet', root: 'G', semitones: [0, 4, 7], notes: ['G', 'B', 'D'] }],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l14-3-2',
      'Technical Execution of Model 3 in the Chorus',
      [
        step(
          'Soprano, Infill, Anchor',
          [
            list(
              [
                'Soprano voicing: RH Finger 5 plays the melody note (D5, E5, G5). Lean your hand weight toward the outside (ulnar side) of the hand so the pinky strikes with firm, resonant f volume.',
                'Inner harmony infill: RH Fingers 1, 2, and 3 drop into the lower chord tones with relaxed, cushioned weight (mp).',
                'Bass octave anchor: LH strikes low octaves (5+1) with deep, grounded arm weight on Beat 1 of every measure.',
              ],
              true,
            ),
            sources(['How to Choose The Correct Piano Chord.pdf']),
          ],
          mcq(
            'How should the right hand execute the soprano voicing in this step?',
            [
              'Use fingers 1-2-3 with firm weight on the melody',
              'Lean hand weight toward the pinky for firm f volume on melody notes D5, E5, G5',
              'Play with relaxed cushioned weight at mp dynamic',
              'Use left hand for the melody with deep arm weight',
            ],
            1,
            'The step text states that RH Finger 5 plays the melody note (D5, E5, G5) and to lean hand weight toward the outside (ulnar side) of the hand so the pinky strikes with firm, resonant f volume.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l14-3-3',
      'Capturing the Continuous Performance Take',
      [
        step(
          'The Gate J Assessment Audit',
          [
            list(
              [
                'Ensure the camera or DAW recording track is active.',
                'Settle into the bench; audiate the 3/4 waltz tempo (72 BPM) before striking Beat 1.',
                'Perform the complete 28-measure arrangement from start to finish without stopping.',
              ],
              true,
            ),
            table(
              ['Gate J criterion', 'What it verifies'],
              [
                ['Complete lead sheet concert arrangement', 'An unedited, continuous performance of a full lead sheet arrangement (Amazing Grace or equivalent).'],
                ['Multi-chorus textural contrast', 'The performance clearly incorporates a 4-bar atmospheric Intro, a Verse with broken accompaniment (Model 1/2), a Climax Chorus with harmonized melody chords (Model 3), and a grand Outro arpeggio sweep.'],
                ['Top-voice melody projection', 'RH melody notes remain clearly audible and singing above all underlying chord tones and bass notes.'],
                ['Metric authority and pedal cleanliness', 'A steady 3/4 tempo pulse is maintained throughout; sustain pedal changes are clean and free of harmonic blurring.'],
              ],
            ),
            callout(
              'warning',
              'Arrangement traps',
              '<p><strong>Playing all sections at the same volume and textural density</strong> — dynamic contrast is mandatory: the Verse must be quiet (mp); the Chorus must be full and resonant (f). <strong>Burying the melody beneath heavy inner chord infill notes</strong> — the top melody note in RH Finger 5 must always be dynamically louder.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          multi(
            'According to the step text, which of these are required to satisfy the Gate J criterion?',
            [
              'An unedited, continuous performance of the full lead sheet arrangement',
              'Clearly incorporating a 4-bar atmospheric Intro, Verse with broken accompaniment, Climax Chorus with harmonized melody chords, and grand Outro arpeggio sweep',
              'RH melody notes clearly audible and singing above chord tones and bass notes',
              'Steady 3/4 tempo at exactly 80 BPM',
            ],
            [0, 1, 2],
            'The step text directly states that the Gate J criterion verifies an unedited continuous full lead sheet performance, the specific 4-phase textural contrast (Intro/Verse/Climax/Outro), and top-voice melody projection, all of which must be present.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m14-3-ex-a',
      type: 'Performance drill',
      title: 'Protocol 14.3-A — Lead Sheet Arrangement Rehearsal',
      prompt: 'Section isolation: rehearse the Intro (M1–4) × 3 takes. Verse practice: rehearse the Verse (M5–16) with steady broken 5ths × 3 takes. Chorus voicing: rehearse the Chorus (M17–24) with Model 3 pinky voicing × 3 takes. Full dress rehearsal: run the complete 28-bar piece continuously into the recording device.',
    },
  ],
  checkpoints: [
    'Complete lead sheet concert arrangement: have recorded an unedited, continuous performance of a full lead sheet arrangement (Amazing Grace or equivalent).',
    'Multi-chorus textural contrast: performance clearly incorporates a 4-bar atmospheric Intro, a Verse with broken accompaniment (Model 1/2), a Climax Chorus with harmonized melody chords (Model 3), and a grand Outro arpeggio sweep.',
    'Top-voice melody projection: RH melody notes remain clearly audible and singing above all underlying chord tones and bass notes.',
    'Metric authority and pedal cleanliness: steady 3/4 tempo pulse maintained throughout; sustain pedal changes are clean and free of harmonic blurring.',
  ],
});
