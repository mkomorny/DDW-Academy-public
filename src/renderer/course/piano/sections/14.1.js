/**
 * Section 14.1 — Reading a Lead Sheet: Melody, Chord Symbols, and Arrangement Models
 * Module 14 — Lead Sheets and Playing by Ear
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_14_Lead_Sheets_And_Playing_
 * By_Ear/Section_14.1_Lead_Sheet_Reading_And_Arrangement_Models.md), read in
 * full before authoring.
 *
 * Conversion notes:
 * - §2's citations (deduped — "Piano Chords for Beginners.pdf" is cited
 *   twice in the source) match the scaffold's four sources exactly.
 * - 14.1.1 folds in the chord-symbol shorthand table from the section's own
 *   Learning Outcome 2 (Major/Minor/7th/Maj7/Slash/Sus4) — real textbook
 *   content, not invented, since the outcome text is part of the source
 *   file. The Major and Minor spellings get `pcSet` asserts.
 * - 14.1.3 (Model 3 voicing) states an exact RH finger/pitch layout in C
 *   Major (E5-C5-G4, a C Major triad spread across fingers 5/3/1), so it
 *   gets a `pcSet` assert too.
 * - 14.1.4's Intro/Verse/Chorus/Outro table is a natural sequence (same
 *   shape as 13.2.4's scan-routine table). §4's two Methodological Traps
 *   close that same step as a `callout('warning', …)`.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, chordExplorer, sources, mcq } from '../../schema.js';

export default module_({
  id: 'piano-m14-1',
  code: '14.1',
  title: 'Reading a Lead Sheet: Melody, Chord Symbols, and Arrangement Models',
  outcomes: [
    'Define a Lead Sheet and explain its structural role in modern commercial music.',
    'Decode standard commercial chord symbols: Major (C), Minor (Cm), 7th (C⁷), Maj7 (Cmaj⁷), Slash Chords (C/E), and Suspended Chords (Csus⁴).',
    'Execute Arrangement Model 1: Left Hand plays single bass roots while Right Hand plays melody alone.',
    'Execute Arrangement Model 2: Left Hand plays split bass/chords or pulsing accompaniment while Right Hand plays melody.',
    'Execute Arrangement Model 3 (Professional Pianistic Voicing): Left Hand plays low bass roots/octaves while Right Hand plays melody with the top pinky and tucks harmonizing chord tones underneath in fingers 1, 2, and 3.',
    'Construct a professional 4-part song arrangement roadmap (Intro → Verse → Chorus → Outro).',
  ],
  sources: [
    'Piano Chords for Beginners.pdf',
    'How to Choose The Correct Piano Chord.pdf',
    'Create Melody and Harmony.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Eight bars of melody + chord symbols in C, G, or F.'],
  lessons: [
    lesson(
      'piano-l14-1-1',
      'What a Lead Sheet Is',
      [
        step(
          'What Is Given, What Is Left to the Pianist',
          [
            prose(
              '<p>A Lead Sheet is an intentional architectural blueprint — not a fully notated classical score. What is given: the exact melody (notes and rhythm), the lyrics if vocal, and chord symbols (C, G, Am, F) indicating the harmonic changes. What is left to the pianist: the specific accompaniment rhythm, keyboard register, chord inversions, dynamic styling, and textural density.</p>',
            ),
            table(
              ['Element', 'Given by the lead sheet?'],
              [
                ['Melody (notes and rhythm)', 'Given'],
                ['Lyrics (if vocal)', 'Given'],
                ['Chord symbols (harmonic changes)', 'Given'],
                ['Accompaniment rhythm and texture', 'Left to the pianist'],
                ['Chord inversions and register', 'Left to the pianist'],
                ['Dynamic styling', 'Left to the pianist'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the lead sheet description, what is left to the pianist rather than given in the sheet?',
            [
              'The exact melody notes and rhythm',
              'The lyrics if the piece is vocal',
              'The chord symbols showing harmonic changes',
              'The specific accompaniment rhythm and texture',
            ],
            3,
            'The step text states that accompaniment rhythm and texture (along with inversions, register, and dynamic styling) are left to the pianist while melody, lyrics, and chord symbols are given.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l14-1-2',
      'The Three Primary Lead Sheet Arrangement Models',
      [
        step(
          'Decoding Standard Chord Symbols',
          [
            prose(
              '<p>Before applying an arrangement model, the pianist must first decode the chord symbols printed above the melody.</p>',
            ),
            table(
              ['Symbol', 'Chord type', 'Spelling'],
              [
                ['C', 'Major', 'C — E — G'],
                ['Cm', 'Minor', 'C — E♭ — G'],
                ['C/E', 'Slash chord — C major with E in the bass', 'E — G — C'],
                ['Csus4', 'Suspended 4th — the 3rd replaced by the 4th', 'C — F — G'],
              ],
            ),
            chordExplorer('C', 'maj', { caption: 'The plain symbol "C" means this major triad.' }),
            chordExplorer('C', 'min', { caption: 'The symbol "Cm" flattens the 3rd of the same triad.' }),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'According to the table, what notes spell a Csus4 chord?',
            ['C — E — G', 'C — E♭ — G', 'C — F — G', 'E — G — C'],
            2,
            'The table explicitly lists Csus4 as Suspended 4th with spelling C — F — G.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 7], notes: ['C', 'E♭', 'G'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l14-1-3',
      'Model 3 Deep Dive: Tucking Chord Tones Under the Melody',
      [
        step(
          'The Voicing Rule',
          [
            prose(
              '<p>In Model 3 (Professional Pianistic Voicing), the Right Hand alone plays both the melody and its supporting harmony: Finger 5 (pinky) plays the melody note, while Fingers 1 and 3 tuck chord tones underneath, in the same hand. The Left Hand plays a low bass octave on Beat 1.</p>',
            ),
            table(
              ['RH finger', 'Note (C Major example)', 'Role', 'Dynamic'],
              [
                ['5 (pinky)', 'E5', 'Melody note', 'f — voiced loudest'],
                ['3 (middle)', 'C5', 'Chord tone infill', 'mp — quiet fill'],
                ['1 (thumb)', 'G4', 'Chord tone infill', 'mp — quiet fill'],
              ],
            ),
            callout(
              'key',
              'The Voicing Rule',
              '<p>The ear always tracks the highest pitch as the melody. The pinky (Finger 5) must strike with firm arm weight (f) while fingers 1 and 3 drop lightly (mp) to fill out the harmony without burying the song.</p>',
            ),
            sources(['Create Melody and Harmony.pdf']),
          ],
          mcq(
            'In Model 3 Professional Pianistic Voicing, which finger of the right hand plays the melody note and must be voiced the loudest?',
            ['Finger 1 (thumb)', 'Finger 3 (middle)', 'Finger 5 (pinky)', 'Finger 2 (index)'],
            2,
            'The step text states that Finger 5 (pinky) plays the melody note and must strike with firm arm weight (f) while fingers 1 and 3 drop lightly (mp).',
          ),
          [{ assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['E', 'C', 'G'] }],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l14-1-4',
      'Structuring a Complete Song Arrangement',
      [
        step(
          'The Four-Part Arrangement Roadmap',
          [
            prose(
              '<p>A professional pianist does not repeat the exact same pattern for three minutes — a complete arrangement moves through four architectural sections, each with its own texture and dynamic goal.</p>',
            ),
            table(
              ['Section', 'Arrangement texture', 'Dynamic / emotional goal'],
              [
                ['Intro', '2–4 bars of progression', 'Establish tempo, key, and mood pad.'],
                ['Verse', 'Model 1 or light Model 2', 'Transparent, quiet (p/mp), focused.'],
                ['Chorus', 'Model 3 + arpeggios', 'Full, resonant, explosive (f).'],
                ['Outro', 'Ballad arpeggio sweep', 'Decrescendo (p → pp), final ring.'],
              ],
            ),
            callout(
              'warning',
              'Lead sheet traps',
              '<p><strong>Playing low root-position chords in the Left Hand</strong> — causes muddy distortion; keep low LH to single roots or octaves and harmonize chords in the mid/high RH instead. <strong>Drowning out the RH melody with heavy inner chord notes</strong> — Finger 5 on the melody must always be voiced dynamically louder than the thumb.</p>',
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the step text, what is the dynamic/emotional goal of the Chorus section in a professional piano arrangement?',
            [
              'Transparent, quiet (p/mp), focused',
              'Full, resonant, explosive (f)',
              'Decrescendo (p → pp), final ring',
              'Establish tempo, key, and mood pad',
            ],
            1,
            'The step text states that the Chorus has the arrangement texture of Model 3 + arpeggios with the dynamic/emotional goal of full, resonant, explosive (f).',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m14-1-ex-a',
      type: 'Arrangement drill',
      title: 'Protocol 14.1-A — Model 1 → Model 2 → Model 3 Progression',
      prompt: "Take the Amazing Grace lead sheet melody in G Major (G, C, D, Em). Run 1: play with Model 1 (LH single bass roots). Run 2: play with Model 2 (LH pulsing broken 5ths). Run 3: play with Model 3 (RH harmonizing chord tones under the melody).",
    },
  ],
  checkpoints: [
    'Lead Sheet Notation: can explain the difference between a fully engraved classical score and a lead sheet.',
    'Model 1–3 Execution: can demonstrate Model 1, Model 2, and Model 3 on a single 4-bar phrase.',
    'Pinky Voicing: demonstrates audible dynamic projection of the top melody note over inner infill chord tones in Model 3.',
  ],
});
