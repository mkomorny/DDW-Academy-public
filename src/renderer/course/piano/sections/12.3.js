/**
 * Section 12.3 — Arpeggios: Linear Harmonies, Cross-Hand Sweeps, and Ballad Flourishes
 * Module 12 — Accompaniment Patterns
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_12_Accompaniment_Patterns/
 * Section_12.3_Arpeggios_Cross_Hand_Sweeps.md), read in full before authoring.
 *
 * Conversion notes:
 * - §2's citations name five PDFs, not the scaffold's three — the module
 *   `sources[]` below is expanded to all five (Arpeggio Patterns 1.pdf,
 *   Arpeggio Progressions 1.pdf, Major arpeggios.pdf, Practice scales and
 *   arpeggios.pdf, Piano Skill Levels Explained.pdf), all confirmed present
 *   in tools/reference/known-sources.json before use, matching the
 *   citation-completeness fix made in 11.4.
 * - 12.3.2 reuses `chordExplorer(root, 'maj'/'min')` (the two triad type ids,
 *   confirmed in CHORD_TYPES, lib/theory.js:175-176) purely to confirm the
 *   arpeggio's pitch content — the exact fingering sequence and hand shape
 *   stays in the step's own table, the same "block for the harmony, table
 *   for the exact hand shape" split 11.3/11.4 established.
 * - 12.3.3's cross-hand choreography and 12.3.4's rolled-chord flourish are
 *   physical performance instructions, not spellable theory claims, so
 *   neither step carries `asserts` — same reasoning 12.1/12.2 applied to
 *   their own technique-only steps.
 * - §4's three Methodological Traps become a closing `callout('warning', …)`
 *   on 12.3.4, per the plan's mapping rule.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, callout, chordExplorer, sources, mcq, multi } from '../../schema.js';

export default module_({
  id: 'piano-m12-3',
  code: '12.3',
  title: 'Arpeggios: Linear Harmonies, Cross-Hand Sweeps, and Ballad Flourishes',
  outcomes: [
    'Define an arpeggio (from the Italian arpeggiare, "to play upon a harp") as a chord whose constituent pitches are played sequentially across registers.',
    'Execute 1-octave Root Position Arpeggios in C Major, G Major, F Major, and A Minor hands separately with standard fingering (RH: 1-2-3-5; LH: 5-4/3-2-1).',
    'Execute a 3-octave Cross-Hand Arpeggio (LH Root → RH Triad → LH Cross-Over to High Tonic) with seamless physical handover.',
    'Integrate preliminary Syncopated Sustain Pedaling during arpeggiated sweeps to create an acoustic wash without mud.',
    'Execute the quintessential Ballad Sweep (Rolled Ending Flourish) to conclude repertoire performances.',
  ],
  sources: [
    'Arpeggio Patterns 1.pdf',
    'Arpeggio Progressions 1.pdf',
    'Major arpeggios.pdf',
    'Practice scales and arpeggios.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['One-octave arpeggio HS; one cross-hand or rolled ending.'],
  lessons: [
    lesson(
      'piano-l12-3-1',
      'What an Arpeggio Is: A Triad with Air',
      [
        step(
          'Arpeggio vs. Blocked Chord vs. Alberti Bass',
          [
            prose(
              '<p>While a blocked chord strikes all three notes at once and an Alberti bass rocks within a single hand position, an <strong>Arpeggio</strong> sends the individual chord tones soaring across pitch space.</p>',
            ),
            list(
              [
                '<strong>The Italian Root:</strong> arpa (harp). Replicates the shimmering, rolled chord sweeps of classical harpists.',
                '<strong>The Spatial Gap:</strong> in an arpeggio, the hand must span wider gaps (a 3rd followed by a 4th) than in a stepwise scale.',
              ],
            ),
            sources(['Arpeggio Patterns 1.pdf']),
          ],
          mcq(
            'What does the term "arpeggio" literally replicate according to the text?',
            [
              'A blocked chord struck simultaneously',
              'A stepwise scale with narrow gaps',
              'The shimmering, rolled chord sweeps of classical harpists',
              'An Alberti bass rocking in one hand position',
            ],
            2,
            'The step text states that an Arpeggio replicates the shimmering, rolled chord sweeps of classical harpists, with its Italian root from "arpa" (harp).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l12-3-2',
      'Standard 1-Octave Arpeggio Fingering',
      [
        step(
          'The Four 1-Octave Arpeggios',
          [
            table(
              ['Arpeggio', 'Spelled Notes', 'RH Fingering', 'LH Fingering'],
              [
                ['C Major', 'C — E — G — C (Octave)', '1 — 2 — 3 — 5', '5 — 4 (or 3) — 2 — 1'],
                ['G Major', 'G — B — D — G (Octave)', '1 — 2 — 3 — 5', '5 — 3 — 2 — 1'],
                ['F Major', 'F — A — C — F (Octave)', '1 — 2 — 3 — 5', '5 — 3 — 2 — 1'],
                ['A Minor', 'A — C — E — A (Octave)', '1 — 2 — 3 — 5', '5 — 3 — 2 — 1'],
              ],
            ),
            prose(
              '<p><strong>Fingering Rule for Root Position:</strong> notice that RH uses Finger 3 on the 5th (G), leaving Finger 5 for the top octave tonic (C).</p>',
            ),
            sources(['Major arpeggios.pdf']),
          ],
          mcq(
            'According to the fingering rule for root position arpeggios, which finger does the right hand use on the fifth scale degree?',
            ['1', '2', '3', '5'],
            2,
            'The step text states that RH uses Finger 3 on the 5th (G), leaving Finger 5 for the top octave tonic (C).',
          ),
        ),
        step(
          'Confirming the Chord Tones',
          [
            prose(
              '<p>An arpeggio’s pitch content is identical to its underlying triad — only the order and octave differ. Each panel below confirms the exact three pitches an arpeggio in that key draws from.</p>',
            ),
            chordExplorer('C', 'maj', { caption: 'C Major arpeggio tones: C — E — G.' }),
            chordExplorer('G', 'maj', { caption: 'G Major arpeggio tones: G — B — D.' }),
            chordExplorer('F', 'maj', { caption: 'F Major arpeggio tones: F — A — C.' }),
            chordExplorer('A', 'min', { caption: 'A Minor arpeggio tones: A — C — E.' }),
            sources(['Practice scales and arpeggios.pdf']),
          ],
          mcq(
            'What is identical between an arpeggio and its underlying triad?',
            ['The order of the pitches', 'The pitch content', 'The octave placement', 'The number of registers'],
            1,
            'The step text states that an arpeggio’s pitch content is identical to its underlying triad — only the order and octave differ.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7], notes: ['G', 'B', 'D'] },
            { assert: 'pcSet', root: 'F', semitones: [0, 4, 7], notes: ['F', 'A', 'C'] },
            { assert: 'pcSet', root: 'A', semitones: [0, 3, 7], notes: ['A', 'C', 'E'] },
          ],
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l12-3-3',
      'Cross-Hand Arpeggios (The Grand Piano Sound)',
      [
        step(
          'The Cross-Hand Choreography',
          [
            prose(
              '<p>Cross-hand arpeggios allow beginners to produce a massive, conservatory-level acoustic sound without needing complex multi-octave thumb tucks.</p>',
            ),
            table(
              ['Step', 'Action'],
              [
                ['1. Depress sustain pedal', 'Press the sustain pedal down firmly with your right foot.'],
                ['2. LH bass root', 'LH Finger 5 (or 5+1 octave) plays Bass C2 on Beat 1.'],
                ['3. RH chord extension', 'As LH releases the key, RH plays Middle C3 (1) → E3 (2) → G3 (3) → C4 (5) in smooth, flowing succession.'],
                ['4. LH cross-over', 'While RH is playing, float your left arm over the top of your right arm and drop LH Finger 2 directly into High C5 or C6 on the downbeat.'],
                ['5. Floating release', 'Let the chord ring in the air for 4 seconds; gently lift the pedal.'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          multi(
            'According to the step text, which actions occur while the right hand is playing the chord extension?',
            [
              'Float left arm over right arm',
              'Play LH bass root on Beat 1',
              'Drop LH Finger 2 into High C5 or C6',
              'Depress the sustain pedal',
            ],
            [0, 2],
            'The step text states in action 4 that while RH is playing, you float your left arm over the top of your right arm and drop LH Finger 2 directly into High C5 or C6 on the downbeat.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l12-3-4',
      'The Ballad Sweep (Rolled Ending Flourish)',
      [
        step(
          'Rolling the Final Chord',
          [
            prose(
              '<p>To end a modern pop or classical ballad with professional elegance: roll the final chord rapidly from bottom to top (<strong>Arpeggiato / Rolled Chord</strong>, indicated by a vertical squiggly line). Play the notes in rapid succession from the lowest bass note up to the soprano melody note, catching the sound in the sustain pedal.</p>',
            ),
            callout(
              'warning',
              'Arpeggio traps',
              '<p><strong>Disconnecting notes</strong> and playing arpeggios like rigid staccato pokes — hand weight must glide smoothly across the keys in continuous flow. <strong>Crashing the cross-over hand</strong> down violently from a great height — float the cross-over arm with a graceful arc and land gently on the finger. <strong>Stomping and holding the pedal</strong> continuously across chord changes — the pedal catches sound at the bottom; clear it on new harmonies.</p>',
            ),
            sources(['Arpeggio Progressions 1.pdf']),
          ],
          mcq(
            'How should the final chord be played to end a modern pop or classical ballad with professional elegance?',
            [
              'As a block chord struck simultaneously',
              'As a rapid roll from the lowest bass note up to the soprano melody note',
              'As disconnected staccato notes',
              'As a series of rigid downward pokes',
            ],
            1,
            'The step text states to roll the final chord rapidly from bottom to top (Arpeggiato / Rolled Chord), playing the notes in rapid succession from the lowest bass note up to the soprano melody note.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m12-3-ex-a',
      type: 'Technique drill',
      title: 'Protocol 12.3-A — 4-Chord Cross-Hand Cascade',
      prompt: 'Depress the sustain pedal. Execute the 3-octave Cross-Hand Arpeggio in C Major (C → C-E-G-C → High C). Clear the pedal. Repeat in A Minor (A → A-C-E-A → High A). Clear the pedal. Repeat in F Major and G Major.',
    },
  ],
  checkpoints: [
    '1-Octave Arpeggio Fingering: can execute 1-octave C, G, F, and Am arpeggios HS using standard 1-2-3-5 / 5-3-2-1 fingering.',
    'Cross-Hand Execution: can perform a 3-octave cross-hand arpeggio without stopping or fumbling the high hand landing.',
    'Pedal Catch: demonstrates catching the cross-hand arpeggio in the sustain pedal and releasing cleanly with zero residual rumble.',
  ],
});
