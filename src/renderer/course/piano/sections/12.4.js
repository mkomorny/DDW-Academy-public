/**
 * Section 12.4 — Repertoire Lab II: Multi-Pattern Accompaniment Performance
 * Module 12 — Accompaniment Patterns (completes the module — Gate I)
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_12_Accompaniment_Patterns/
 * Section_12.4_Repertoire_Lab_II_Multi_Pattern_Performance.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - §2's citations name "Piano chords every beginner should know.pdf" in
 *   addition to the scaffold's four — the module `sources[]` below is
 *   expanded to all five, confirmed present in known-sources.json.
 * - 12.4.2 reuses `progression(['C','G','Am','F'], {numerals:['I','V','vi','IV']})`
 *   — the exact same Verse progression 11.4.3 first used for the "Four
 *   Chords" pattern — since this section's own Verse (§3's repertoire score
 *   box, measures 1-4) is that identical I-V-vi-IV loop, now voice-led
 *   through first/second-inversion RH shapes carried in the accompanying
 *   table. `pcSet` asserts reuse the same four triads 12.3.2 already
 *   verified this batch (order-independent, so the inverted spellings in the
 *   table don't change the assertion).
 * - 12.4.3's transition-bar protocol and 12.4.4's recording steps are
 *   procedural, not spellable theory claims, so neither step carries
 *   `asserts`.
 * - §4's three Methodological Traps become a closing `callout('warning', …)`
 *   on 12.4.4. §6's Gate I Assessment Audit (5 items) replaces the scaffold's
 *   generic `checkpoints[]` — this is Module 12's own gate (the syllabus's
 *   Gate I), so completing this section also adds a new GATES entry when
 *   Level 12 is wired.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, callout, progression, sources, mcq, multi } from '../../schema.js';

export default module_({
  id: 'piano-m12-4',
  code: '12.4',
  title: 'Repertoire Lab II: Multi-Pattern Accompaniment Performance',
  outcomes: [
    'Combine two distinct accompaniment textures (Sustained Blocked Chords → Flowing Broken Alberti Figures) within a single 16-to-32 bar piece.',
    'Execute smooth Voice-Led Chord Inversions throughout all harmonic transitions.',
    'Master the Transition Bar: shifting accompaniment motor patterns seamlessly on Beat 1 of the new section without temporal hesitation.',
    'Maintain steady rhythm-section authority (metronomic pulse and groove stability) while adjusting dynamic layers (mp → f).',
    'Execute an unedited audio/video recording of the complete multi-pattern performance.',
    'Complete and execute the Gate I Assessment Rubric.',
  ],
  sources: [
    'Piano chord progression guide for beginners.pdf',
    'Piano chords every beginner should know.pdf',
    'Piano Chords for Beginners.pdf',
    'Piano Skill Levels Explained.pdf',
    'Tips on how to practice piano.pdf',
  ],
  practiceFocus: ['One multi-texture arrangement recorded (Gate I).'],
  lessons: [
    lesson(
      'piano-l12-4-1',
      'Textural Contrast: Why Verses and Choruses Differ',
      [
        step(
          'Verse vs. Chorus Energy Profiles',
          [
            prose(
              '<p>In commercial songwriting and classical sonata structures, sections must have distinct energy profiles.</p>',
            ),
            table(
              ['Section', 'Character', 'Texture'],
              [
                ['The Verse', 'Storytelling / intimacy', 'Pulsing or sustained blocked chords at mp allow lyrics or simple melodies to be understood clearly.'],
                ['The Chorus', 'Climax / energy', 'Broken chords or rolling arpeggios at f fill the acoustic spectrum with rich, shimmering movement.'],
              ],
            ),
            sources(['Piano chord progression guide for beginners.pdf']),
          ],
          mcq(
            'According to the table, what texture and dynamic level characterize the Chorus section?',
            [
              'Pulsing or sustained blocked chords at mp',
              'Broken chords or rolling arpeggios at f',
              'Storytelling intimacy with simple melodies',
              'Smooth voice-led chord inversions at mf',
            ],
            1,
            'The step text states that the Chorus has the character of Climax / energy with Broken chords or rolling arpeggios at f filling the acoustic spectrum with rich, shimmering movement.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l12-4-2',
      'Voice Leading Across Textures',
      [
        step(
          'Smooth Common-Tone Motion',
          [
            prose(
              '<p>Notice that throughout both the Verse and Chorus, the Right Hand chords never leap across octaves — every voice moves by a single step or stays on a common tone, preserving acoustic smoothness across the entire performance.</p>',
            ),
            progression(
              ['C', 'G', 'Am', 'F'],
              { numerals: ['I', 'V', 'vi', 'IV'], caption: 'C Major → G Major → A Minor → F Major — every voice moves by step or common tone.' },
            ),
            table(
              ['Measure', 'Chord', 'RH voicing (voice-led)'],
              [
                ['1', 'C Major', 'C — E — G (root position)'],
                ['2', 'G Major', 'B — D — G (1st inversion)'],
                ['3', 'A Minor', 'C — E — A (1st inversion)'],
                ['4', 'F Major', 'C — F — A (2nd inversion)'],
              ],
            ),
            sources(['Piano chords every beginner should know.pdf', 'Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'According to the step text, what property do the Right Hand chords maintain throughout the Verse and Chorus?',
            [
              'They leap across octaves for dramatic effect',
              'They never leap across octaves and every voice moves by a single step or stays on a common tone',
              'They always stay in root position',
              'They change inversion on every beat',
            ],
            1,
            'The step text explicitly states that the Right Hand chords never leap across octaves — every voice moves by a single step or stays on a common tone, preserving acoustic smoothness.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7], notes: ['B', 'D', 'G'] },
            { assert: 'pcSet', root: 'A', semitones: [0, 3, 7], notes: ['C', 'E', 'A'] },
            { assert: 'pcSet', root: 'F', semitones: [0, 4, 7], notes: ['C', 'F', 'A'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l12-4-3',
      'The Anatomy of the Transition Bar (Measure 8)',
      [
        step(
          'The Seamless Transition Bar Protocol',
          [
            prose(
              '<p>The #1 point of failure in multi-pattern piano playing is the seam between sections. Measure 8 ends the Blocked Verse; Measure 9 begins the Broken Chorus.</p>',
            ),
            table(
              ['Step', 'Action'],
              [
                ['1. Isolate measures 8 and 9', 'Measure 8 ends the Blocked Verse; Measure 9 begins the Broken Chorus.'],
                ['2. Mental pre-hearing (audiation)', 'On Beat 4 of Measure 8, mentally switch your motor program from "Vertical Blocked Downstroke" to "Rotary Alberti Murmur."'],
                ['3. Zero gap on the downbeat', 'Beat 1 of Measure 9 must strike with absolute metronomic precision. Do not slow down or hesitate to "find" the Alberti shape.'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'What must you do on Beat 4 of Measure 8 when transitioning from the Blocked Verse to the Broken Chorus?',
            [
              'Slow down to find the Alberti shape',
              'Mentally switch your motor program from Vertical Blocked Downstroke to Rotary Alberti Murmur',
              'Play the chord inversion louder',
              'Pause briefly before Measure 9',
            ],
            1,
            'The step text explicitly states in the Mental pre-hearing action: On Beat 4 of Measure 8, mentally switch your motor program from "Vertical Blocked Downstroke" to "Rotary Alberti Murmur."',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l12-4-4',
      'Recording and Evaluating the Performance Take',
      [
        step(
          'The Gate I Assessment Audit',
          [
            list(
              [
                'Set up a continuous recording device.',
                'Perform the entire 16-measure piece from start to finish.',
                'Review the recording against the Gate I evaluation criteria below.',
              ],
              true,
            ),
            table(
              ['Gate I criterion', 'What it verifies'],
              [
                ['Two distinct accompaniment styles performed', 'A complete continuous performance featuring both Blocked/Pulsing Chords and Broken/Alberti Accompaniments in one piece.'],
                ['Voice-led harmonic progressions', 'All chord transitions (C → G → Am → F) utilize smooth, inverted voice leading with zero erratic hand jumping.'],
                ['Unbroken transition continuity', 'The metric pulse remains steady and unbroken across the transition bar between Verse and Chorus.'],
                ['Cross-hand cadence execution', 'Concludes with a clean, pedaled 3-octave Cross-Hand Arpeggio flourish.'],
                ['Audible dynamic balancing', 'Accompaniment volume remains properly subordinate beneath melodic leads.'],
              ],
            ),
            callout(
              'warning',
              'Repertoire traps',
              '<p><strong>Hesitating or taking a breath</strong> between Verse and Chorus — practice the 2-bar transition loop until the motor shift is automatic. <strong>Letting broken chords in the Chorus overpower the melody</strong> — rotate the forearm quietly and keep the accompaniment below the singing RH. <strong>Muddy sustain pedal</strong> across chord changes in the Coda — change the pedal on the exact downbeat of every new harmony.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          multi(
            'According to the Gate I criteria, which two performance elements must be verified in the recording?',
            [
              'Two distinct accompaniment styles performed',
              'Unbroken transition continuity',
              'Repertoire traps avoided',
              'Voice-led harmonic progressions',
            ],
            [0, 3],
            'The step text explicitly lists "Two distinct accompaniment styles performed" and "Voice-led harmonic progressions" among the Gate I criteria that the recording must be reviewed against.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m12-4-ex-a',
      type: 'Performance drill',
      title: 'Protocol 12.4-A — The Transition Seam Drill',
      prompt: 'Set the metronome to 76 BPM. Play Measures 7 and 8 (Pulsing Quarters) into Measures 9 and 10 (Alberti Bass). Loop Measures 7–10 five consecutive times until the shift is completely seamless.',
    },
  ],
  checkpoints: [
    'Two distinct accompaniment styles performed: a complete continuous performance featuring both Blocked/Pulsing Chords and Broken/Alberti Accompaniments in one piece.',
    'Voice-led harmonic progressions: all chord transitions (C → G → Am → F) utilize smooth, inverted voice leading with zero erratic hand jumping.',
    'Unbroken transition continuity: the metric pulse remains steady and unbroken across the transition bar between Verse and Chorus.',
    'Cross-hand cadence execution: concludes with a clean, pedaled 3-octave Cross-Hand Arpeggio flourish.',
    'Audible dynamic balancing: accompaniment volume remains properly subordinate beneath melodic leads.',
  ],
});
