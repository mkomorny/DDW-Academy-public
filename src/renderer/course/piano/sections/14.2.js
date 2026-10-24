/**
 * Section 14.2 — Playing by Ear II: Bassline Extraction, Functional Harmony, and Audiation
 * Module 14 — Lead Sheets and Playing by Ear
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_14_Lead_Sheets_And_Playing_
 * By_Ear/Section_14.2_Playing_By_Ear_II_Bassline_Extraction_Audiation.md),
 * read in full before authoring.
 *
 * Conversion notes:
 * - §2's citations match the scaffold's four sources exactly.
 * - 14.2.4's "flatten the 3rd" elimination step is a spellable theory claim
 *   (major triad → parallel minor triad by flattening the 3rd one semitone),
 *   so it gets a `chordExplorer('C','maj'/'min')` pair plus `pcSet` asserts —
 *   the same major/minor confirmation pattern 14.1.2 already used.
 * - 14.2.1–14.2.3 are qualitative ear-training/audiation methodology with no
 *   spellable pitch claim, so they carry no `asserts`.
 * - 14.2.3's three-step audiation protocol and 14.2.4's four-step elimination
 *   protocol are both natural sequences, presented as ordered tables.
 * - §4's two Methodological Traps close 14.2.4 (the last lesson) as a
 *   `callout('warning', …)`.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, chordExplorer, sources, mcq, text } from '../../schema.js';

export default module_({
  id: 'piano-m14-2',
  code: '14.2',
  title: 'Playing by Ear II: Bassline Extraction, Functional Harmony, and Audiation',
  outcomes: [
    'Apply the Aural Decoding Hierarchy: extracting the lowest bass frequency first before attempting to find the melody.',
    'Isolate and play the single-note bassline of a recorded song.',
    'Classify heard chord changes into the four core diatonic functions: Tonic Home (I), Subdominant Departure (IV), Dominant Tension (V), and Submediant Melancholy (vi).',
    'Transcribe melodies by translating heard pitches into moveable Scale Degree Solfège Numbers (1 through 7) rather than trial-and-error key hunting.',
    'Eliminate random keyboard guessing through structured interval comparison.',
  ],
  sources: [
    'How to Choose The Correct Piano Chord.pdf',
    'Create Melody and Harmony.pdf',
    'What is Harmony in Music.pdf',
    'Piano Skill Levels Explained.pdf',
  ],
  practiceFocus: ['Copy a four-note melody and name the bass function.'],
  lessons: [
    lesson(
      'piano-l14-2-1',
      'Why Beginners Fail at Playing by Ear (The Melody Trap)',
      [
        step(
          'Harmony Lives in the Basement',
          [
            prose(
              '<p>Untrained beginners immediately try to find the melody by poking at random treble keys with one finger. When they find a note, they have no idea what chord belongs underneath it, resulting in harmonic gridlock.</p>',
            ),
            callout(
              'key',
              'The Conservatory Law',
              '<p>Harmony lives in the basement. If you find the bass note on Beat 1, you automatically know 80% of the chord identity.</p>',
            ),
            sources(['How to Choose The Correct Piano Chord.pdf']),
          ],
          mcq(
            'According to the Conservatory Law, what should you find first on Beat 1?',
            ['The melody note in the treble', 'The bass note', 'The full chord', 'A random treble key'],
            1,
            'The step text states the Conservatory Law: Harmony lives in the basement. If you find the bass note on Beat 1, you automatically know 80% of the chord identity.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l14-2-2',
      'The Four Primary Aural Chord Archetypes',
      [
        step(
          'Four Functions, Four Characters',
          [
            prose(
              '<p>Beyond identifying the bass note, a trained ear classifies each heard chord into one of four core diatonic functions, each with its own aural psychological character.</p>',
            ),
            table(
              ['Chord', 'Harmonic function', 'Aural psychological character'],
              [
                ['I (Major)', 'Tonic Home', 'Complete physical rest, stability, closure — the "ground floor" of the song.'],
                ['V (Major)', 'Dominant', 'High kinetic tension, unresolved question, desperately wants to resolve back to I.'],
                ['IV (Major)', 'Subdominant', 'Open, soaring, exploratory departure away from home.'],
                ['vi (Minor)', 'Submediant (Relative Minor)', 'Introspective, emotional, melancholic — the dark shadow of the Tonic.'],
              ],
            ),
            sources(['What is Harmony in Music.pdf']),
          ],
          mcq(
            'According to the table, which chord has the aural psychological character of "high kinetic tension, unresolved question, desperately wants to resolve back to I"?',
            ['I (Major)', 'V (Major)', 'IV (Major)', 'vi (Minor)'],
            1,
            'The step text table explicitly lists V (Major) under Dominant with the exact description "High kinetic tension, unresolved question, desperately wants to resolve back to I."',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l14-2-3',
      'Melodic Audiation Using Scale Degrees',
      [
        step(
          'The Three-Step Audiation Protocol',
          [
            prose(
              '<p>Audiation is the ability to hear and understand music in your mind without sound physically being present.</p>',
            ),
            table(
              ['Step', 'Action'],
              [
                ['1. Establish the Tonic', 'Sing Do (Scale Degree 1) to fix the key center.'],
                ['2. Compare pitch distance', 'When a melody note sounds, compare it to Do: the stable 3rd (Mi)? the bright, triumphant 5th (So)? the piercing leading tone pulling up to Do (Ti)?'],
                ['3. Convert to the keyboard', 'Convert the solfège syllable directly into the corresponding piano key without guessing.'],
              ],
            ),
            sources(['Create Melody and Harmony.pdf']),
          ],
          text(
            'What is the definition of audiation according to the step?',
            [
              'the ability to hear and understand music in your mind without sound physically being present',
              'hear and understand music in your mind without sound physically being present',
              'ability to hear and understand music in your mind without sound physically being present',
            ],
            'The step text explicitly opens with the definition: "Audiation is the ability to hear and understand music in your mind without sound physically being present."',
          ),
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l14-2-4',
      'The Elimination Protocol (No Guessing Allowed)',
      [
        step(
          'Four Steps to Identify an Unknown Chord',
          [
            prose(
              '<p>If you are unsure of a heard chord, follow a structured elimination protocol rather than guessing randomly. Flattening the 3rd of a major triad by one semitone converts it to the parallel minor triad on the same root.</p>',
            ),
            table(
              ['Step', 'Action'],
              [
                ['1', 'Hum the lowest bass note. Find that single note on the piano keyboard in the bass register.'],
                ['2', 'Play the Major Triad on that root. Does it match the recording?'],
                ['3', 'If it sounds too bright or dissonant, flatten the 3rd to play the Minor Triad.'],
                ['4', 'If neither matches, check if the bass note is an inversion or slash chord (1st inversion, 3rd in the bass).'],
              ],
            ),
            chordExplorer('C', 'maj', { caption: 'Step 2: test the Major Triad on the heard bass root first.' }),
            chordExplorer('C', 'min', { caption: 'Step 3: flatten the 3rd by one semitone to test the Minor Triad on the same root.' }),
            callout(
              'warning',
              'Ear-training traps',
              '<p><strong>Randomly poking at multiple keys</strong> hoping to hit the right note — stop playing; sing the pitch aloud first, then locate it on the keys. <strong>Trying to transcribe the melody before finding the underlying chords</strong> — transcribe the LH bassline first; the chords narrow down the melody notes.</p>',
            ),
            sources(['How to Choose The Correct Piano Chord.pdf']),
          ],
          mcq(
            'According to the elimination protocol, what should you do if the major triad on the bass note sounds too bright or dissonant?',
            [
              'Hum the lowest bass note again',
              'Flatten the 3rd to play the minor triad',
              'Check for an inversion or slash chord',
              'Play the melody instead',
            ],
            1,
            'The step text explicitly states in step 3: "If it sounds too bright or dissonant, flatten the 3rd to play the Minor Triad."',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'C', semitones: [0, 3, 7], notes: ['C', 'E♭', 'G'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m14-2-ex-a',
      type: 'Ear-training drill',
      title: 'Protocol 14.2-A — Bassline Extraction from Unknown Audio',
      prompt: 'Play a 10-second audio clip of an unfamiliar pop or folk song. Hum the lowest bass note of each measure. Locate those 4 bass notes on the piano in the Left Hand. Test Major vs. Minor triads above each root to reconstruct the full progression.',
    },
  ],
  checkpoints: [
    'Aural Hierarchy: can state the 3 tiers of ear transcription (Bass → Harmony → Melody).',
    'Chord Function Identification: can listen to a 4-chord progression and identify when the music moves to I, IV, V, or vi.',
    'Audiation Transcription: can transcribe an unfamiliar 4-measure diatonic melody by ear within 3 listenings using scale degree numbers.',
  ],
});
