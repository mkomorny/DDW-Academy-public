/**
 * Section 15.2 — Syncopated (Legato) Pedaling: The Down-Up-Down Choreography
 * Module 15 — The Pedal
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_15_The_Pedal/
 * Section_15.2_Syncopated_Legato_Pedaling_Choreography.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - §2's three citations match the scaffold's sources exactly.
 * - 15.2.4's étude states exact chord fingerings for C Major (1-3-5) and A
 *   Minor (1-3-5) — both plain triads get `chordExplorer`/`pcSet` asserts.
 *   G/B and F are NOT run through `chordExplorer`/`progression`: the block's
 *   chord-suffix parser (confirmed by reading `blocks.js` in the prior
 *   batch) has no slash-chord/inversion concept and would silently fall back
 *   to a bare major triad for "G/B", misrepresenting the stated bass note —
 *   so this étude is taught as a table, not a `progression()` call.
 * - 15.2.4 closes with §4's two Methodological Traps as a
 *   `callout('warning', …)`, matching the section's own established pattern.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, list, chordExplorer, sources, mcq, order, multi } from '../../schema.js';

export default module_({
  id: 'piano-m15-2',
  code: '15.2',
  title: 'Syncopated (Legato) Pedaling: The Down-Up-Down Choreography',
  outcomes: [
    'Explain why direct pedaling causes harmonic blurring or choppy performance.',
    'Execute the precise 3-step Syncopated Pedaling Algorithm across chord changes: Strike New Chord → Lift Foot UP (Clear) → Press Foot DOWN (Catch).',
    'Decode both traditional pedaling notation (Ped. 𝄮) and modern bracketed engraving lines (⌞_______________⌟).',
    'Perform the 4-measure harmonic progression (C → G/B → Am → F) with 100% seamless legato connection and zero harmonic bleed.',
  ],
  sources: [
    'A perfect guide to learning piano.pdf',
    'Piano Skill Levels Explained.pdf',
    'Musical terms for piano.pdf',
  ],
  practiceFocus: ['Change sustain on the new chord on a four-bar progression.'],
  lessons: [
    lesson(
      'piano-l15-2-1',
      'Why "Direct Pedaling" Fails',
      [
        step(
          'The Two Direct-Pedaling Failure Modes',
          [
            prose(
              '<p>When a student presses the pedal down at the exact millisecond their fingers hit a new chord, one of two failures results.</p>',
            ),
            table(
              ['Failure mode', 'What happens'],
              [
                ['Pedal lifts too early', 'An ugly, dry gap of silence occurs before the new chord strikes.'],
                ['Pedal stays down during the strike', 'The vibrating notes of the old chord (e.g. C Major) bleed into the new chord (e.g. G Major), creating acoustic dissonance and mud.'],
              ],
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          mcq(
            'According to the text, what happens in the failure mode where the pedal stays down during the strike of a new chord?',
            [
              'An ugly, dry gap of silence occurs before the new chord strikes',
              'The vibrating notes of the old chord bleed into the new chord, creating acoustic dissonance and mud',
              'The new chord fails to sound at all',
              'The pedal mechanism becomes stuck',
            ],
            1,
            'The step text states that when the pedal stays down during the strike, the vibrating notes of the old chord bleed into the new chord, creating acoustic dissonance and mud.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l15-2-2',
      'The 3-Step Syncopated Pedaling Algorithm',
      [
        step(
          'Strike → Lift → Press',
          [
            prose(
              '<p>To achieve a seamless, continuous acoustic connection where chords melt into one another without bleeding, the foot moves in three precise steps AFTER the fingers land — never before or simultaneously.</p><p>Pre-condition: the pianist is holding Chord 1 with their fingers, and the foot is DOWN on the pedal holding the sound.</p>',
            ),
            list(
              [
                'Step 1 (Fingers Strike): on Beat 1 of the new measure, the fingers strike Chord 2.',
                'Step 2 (Foot Lifts Up — the Clear): at the exact microsecond the fingers touch down on Chord 2, the foot lifts up to drop the dampers and silence the old Chord 1.',
                'Step 3 (Foot Presses Down — the Catch): while the fingers are still holding Chord 2 down in the keybed, the foot presses down again to catch the new chord before the fingers release.',
              ],
              true,
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          order(
            'What is the exact 3-step sequence the foot follows AFTER the fingers have landed on Chord 2 in syncopated pedaling?',
            [
              'Foot lifts up to clear the old chord',
              'Fingers strike Chord 2',
              'Foot presses down to catch the new chord',
            ],
            [
              'Fingers strike Chord 2',
              'Foot lifts up to clear the old chord',
              'Foot presses down to catch the new chord',
            ],
            'The step text explicitly lists the three steps in this order: Step 1 Fingers Strike Chord 2 on Beat 1, Step 2 Foot Lifts Up at the exact microsecond the fingers touch down, Step 3 Foot Presses Down while still holding Chord 2.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l15-2-3',
      'Reading Pedal Notation on the Score',
      [
        step(
          'Traditional vs. Modern Bracketed Notation',
          [
            prose(
              '<p>Pedaling instructions appear on the score in one of two systems.</p>',
            ),
            table(
              ['Notation system', 'Symbol', 'Meaning'],
              [
                ['Traditional (19th-century classical)', 'Ped.', 'Press sustain pedal DOWN.'],
                ['Traditional (19th-century classical)', '𝄮 (star)', 'Lift sustain pedal UP completely.'],
                ['Modern bracketed (conservatory contemporary)', 'Horizontal line beneath the staff', 'Press down at the start of the line, lift up at the end.'],
                ['Modern bracketed (conservatory contemporary)', 'A quick up-down notch mid-line', 'A syncopated pedal change without releasing the overall line.'],
              ],
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'According to the step text, in the modern bracketed system, what does a quick up-down notch in the middle of the horizontal line mean?',
            [
              'Press the sustain pedal down',
              'Lift the sustain pedal up completely',
              'A syncopated pedal change without releasing the overall line',
              'Press down at the start of the line and lift at the end',
            ],
            2,
            'The step text states that in the modern bracketed system, a quick up-down notch mid-line means a syncopated pedal change without releasing the overall line.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l15-2-4',
      'The 4-Bar Slow Chord Change Pedaling Étude',
      [
        step(
          'The 4-Measure Progression Choreography',
          [
            prose(
              '<p>This laboratory applies the Syncopated Pedaling Algorithm across a slow, four-measure harmonic progression: C Major → G/B → A Minor → F.</p>',
            ),
            table(
              ['Measure', 'Chord', 'Fingers', 'Foot'],
              [
                ['1', 'C Major', 'Strike C Major (1-3-5).', 'Press pedal DOWN on "1-AND".'],
                ['2', 'G/B', 'Strike G/B (1-2-5) on Beat 1.', 'Lift UP on "1" → press DOWN on "AND".'],
                ['3', 'A Minor', 'Strike Am (1-3-5) on Beat 1.', 'Lift UP on "1" → press DOWN on "AND".'],
                ['4', 'F', 'Strike F (1-2-5) on Beat 1.', 'Lift UP on "1" → press DOWN on "AND".'],
              ],
            ),
            chordExplorer('C', 'maj', { caption: 'Measure 1: the C Major triad struck with fingers 1-3-5.' }),
            chordExplorer('A', 'min', { caption: 'Measure 3: the A Minor triad struck with fingers 1-3-5.' }),
            callout(
              'warning',
              'Pedaling traps',
              '<p><strong>Lifting the foot before the new chord is struck</strong> — causes a silence gap; the foot must not lift until the new fingers physically land on the keys. <strong>Forgetting to lift the pedal on chord changes</strong> — causes a mud wash; every new harmony requires a quick "up-down" pedal clear on the downbeat.</p>',
            ),
            sources(['Piano Skill Levels Explained.pdf', 'A perfect guide to learning piano.pdf']),
          ],
          multi(
            'According to the laboratory description, what are the two pedaling traps that must be avoided when applying the Syncopated Pedaling Algorithm?',
            [
              'Lifting the foot before the new chord is struck',
              'Forgetting to lift the pedal on chord changes',
              'Striking the chord after the downbeat',
              'Pressing the pedal down too early',
            ],
            [0, 1],
            'The step text explicitly lists these two traps: lifting before the new chord causes a silence gap, and forgetting to lift on changes causes a mud wash.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'A', semitones: [0, 3, 7], notes: ['A', 'C', 'E'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m15-2-ex-a',
      type: 'Coordination drill',
      title: 'Protocol 15.2-A — The "Strike-Up-Down" Vocalized Drill',
      prompt: 'Set the metronome to 50 BPM. At each measure boundary, chant aloud: on Click 1 say "HANDS!" (fingers strike new chord, foot snaps UP); on Click 1-AND say "FOOT!" (foot presses DOWN); on Clicks 2, 3, 4 say "HOLD!" (sustain rings). Repeat across 8 chord changes until the physical coordination is automatic.',
    },
  ],
  checkpoints: [
    'Algorithm Recitation: can state the 3 steps of syncopated pedaling from memory.',
    'Aural Audit: can play 4 chord changes with zero audible gaps of silence and zero harmonic bleed between chords.',
    'Notation Literacy: can interpret both traditional Ped./star and modern bracketed line symbols.',
  ],
});
