/**
 * Section 16.1 — The Seven Church Modes: Ionian to Locrian
 * Module 16 — Modes, Studio, and Capstone
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_16_Modes_Studio_Capstone/
 * Section_16.1_The_Seven_Church_Modes_Ionian_To_Locrian.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - §2's citations match the scaffold's sources exactly.
 * - §3's "White-Key Rotation Matrix" (7 modes × white-key range / formula /
 *   defining color) converts to a real `table()`.
 * - The mined scale library (src/data/scales.json) turns out to carry a real
 *   entry for every one of the seven church modes (`ionian-scales` through
 *   `locrian-scales`), so unlike a plain textbook conversion this section
 *   gets genuine `scaleExplorer()` panels — not just tables — for the modes
 *   it singles out for emphasis (Lydian/Locrian as the spectrum's two
 *   extremes in 16.1.1, Dorian/Phrygian for their color notes in 16.1.2,
 *   Lydian again in C for the drone lab in 16.1.3), each backed by a `pcSet`
 *   assert confirming the exact spelling scaleExplorer will render.
 * - §4's two Methodological Traps fold into a closing `callout('warning', …)`
 *   in Lesson 16.1.3, matching every other section this course.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`. §5's Protocol 16.1-A becomes the module's one exercise.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, list, callout, scaleExplorer, sources, mcq, order } from '../../schema.js';

export default module_({
  id: 'piano-m16-1',
  code: '16.1',
  title: 'The Seven Church Modes: Ionian to Locrian',
  outcomes: [
    'Define a Mode as a rotation of the diatonic 7-note collection establishing a new tonic root.',
    'Construct and perform all 7 modes on the natural white keys (C → C, D → D, E → E, F → F, G → G, A → A, B → B).',
    'Classify the 7 modes along the Bright-to-Dark Spectrum: Lydian (Brightest) → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian (Darkest).',
    'Identify the single Characteristic Color Note that defines each mode against parallel Major or Minor scales.',
    'Improvise a modal melody in D Dorian, F Lydian, or G Mixolydian over a sustained Left-Hand drone.',
  ],
  sources: [
    'Understand all 7 modes in music theory.pdf',
    'Ionian Scales.pdf',
    'Dorian scales.pdf',
    'Phrygian Scales.pdf',
    'Lydian Scales.pdf',
    'Mixolydian Scales.pdf',
    'Aeolian Scales.pdf',
    'Locrian Scales.pdf',
    'How to improvise on piano.pdf',
  ],
  practiceFocus: ['Seven white-key modes; one drone improvisation.'],
  lessons: [
    lesson(
      'piano-l16-1-1',
      'The Bright-to-Dark Tonal Spectrum',
      [
        step(
          'What a Mode Is, and the Seven-Mode Rotation',
          [
            prose(
              '<p>A <strong>Mode</strong> is not an exotic, foreign scale — it is the same diatonic 7-note collection rotated to start from a different degree, establishing a new tonic root. The seven church modes always occur in this invariant order: <strong>Ionian → Dorian → Phrygian → Lydian → Mixolydian → Aeolian → Locrian</strong>. Because the underlying seven pitch classes never change, every white-key mode can be played using only the white keys of the piano, starting from a different letter name.</p>',
            ),
            table(
              ['Mode', 'White-Key Rotation', 'Formula', 'Defining Color'],
              [
                ['Lydian', 'F to F (F-G-A-B-C-D-E)', '1–2–3–♯4–5–6–7', 'Raised 4th (♯4)'],
                ['Ionian', 'C to C (C-D-E-F-G-A-B)', '1–2–3–4–5–6–7', 'Pure Major Scale'],
                ['Mixolydian', 'G to G (G-A-B-C-D-E-F)', '1–2–3–4–5–6–♭7', 'Lowered 7th (♭7)'],
                ['Dorian', 'D to D (D-E-F-G-A-B-C)', '1–2–♭3–4–5–6–♭7', 'Natural 6th (♮6)'],
                ['Aeolian', 'A to A (A-B-C-D-E-F-G)', '1–2–♭3–4–5–♭6–♭7', 'Natural Minor'],
                ['Phrygian', 'E to E (E-F-G-A-B-C-D)', '1–♭2–♭3–4–5–♭6–♭7', 'Lowered 2nd (♭2)'],
                ['Locrian', 'B to B (B-C-D-E-F-G-A)', '1–♭2–♭3–4–♭5–♭6–♭7', 'Lowered 5th (♭5)'],
              ],
            ),
            sources(['Understand all 7 modes in music theory.pdf']),
          ],
          order(
            'What is the invariant order of the seven church modes as stated in the step text?',
            ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
            ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
            'The step text explicitly states that the seven church modes always occur in this invariant order: Ionian → Dorian → Phrygian → Lydian → Mixolydian → Aeolian → Locrian.',
          ),
        ),
        step(
          'Bright-to-Dark: Major, Minor, and Diminished Modes',
          [
            prose(
              '<p>The seven modes form a continuous spectrum of harmonic brightness, governed by the number of sharps versus flats each carries against the Major scale: <strong>Lydian (Brightest) → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian (Darkest)</strong>.</p>',
            ),
            list([
              'Major Modes (contain a Major 3rd): Lydian, Ionian, Mixolydian.',
              'Minor Modes (contain a Minor 3rd): Dorian, Aeolian, Phrygian.',
              'Diminished Mode (contains a Diminished 5th): Locrian.',
            ]),
            scaleExplorer('lydian-scales', 'F', { caption: 'F Lydian — the brightest mode: a Major scale with a raised 4th (B♮ against an F tonic).' }),
            scaleExplorer('locrian-scales', 'B', { caption: 'B Locrian — the darkest mode: a diminished-feeling scale with a lowered 5th (F♮ against a B tonic).' }),
            sources(['Understand all 7 modes in music theory.pdf', 'Lydian Scales.pdf', 'Locrian Scales.pdf']),
          ],
          mcq(
            'According to the spectrum of harmonic brightness, which mode is positioned between Ionian and Dorian?',
            ['Lydian', 'Mixolydian', 'Aeolian', 'Phrygian'],
            1,
            'The step text states the continuous spectrum as Lydian (Brightest) → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian (Darkest).',
          ),
          [
            { assert: 'pcSet', root: 'F', semitones: [0, 2, 4, 6, 7, 9, 11], notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E'] },
            { assert: 'pcSet', root: 'B', semitones: [0, 1, 3, 5, 6, 8, 10], notes: ['B', 'C', 'D', 'E', 'F', 'G', 'A'] },
          ],
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l16-1-2',
      'The Characteristic Color Notes',
      [
        step(
          'Color Notes: Lydian, Mixolydian, Dorian',
          [
            prose(
              '<p>Every mode is defined against its parallel Major or Minor scale by exactly one <strong>Characteristic Color Note</strong> — the single altered degree that gives the mode its distinct mood.</p>',
            ),
            table(
              ['Mode', 'Character / Mood', 'The One Defining Note'],
              [
                ['Lydian', 'Dreamy, sci-fi, floating, wonder', 'Raised 4th (♯4): F → B♮ in C Lydian'],
                ['Mixolydian', 'Bluesy, classic rock, upbeat folk', 'Flat 7th (♭7): B♭ in C Mixolydian'],
                ['Dorian', 'Mellow, hopeful minor, medieval', 'Natural 6th (♮6): B♮ in D Dorian'],
              ],
            ),
            scaleExplorer('dorian-scales', 'D', { caption: 'D Dorian — the natural 6th (B♮) is the one note that separates it from D Natural Minor.' }),
            sources(['Understand all 7 modes in music theory.pdf', 'Dorian scales.pdf']),
          ],
          mcq(
            'According to the table, what is the characteristic color note that defines Lydian mode against its parallel major scale?',
            ['Flat 7th (♭7)', 'Natural 6th (♮6)', 'Raised 4th (♯4)', 'Lowered 2nd (♭2)'],
            2,
            'The step text states that Lydian is defined by the Raised 4th (♯4): F → B♮ in C Lydian.',
          ),
          [{ assert: 'pcSet', root: 'D', semitones: [0, 2, 3, 5, 7, 9, 10], notes: ['D', 'E', 'F', 'G', 'A', 'B', 'C'] }],
        ),
        step(
          'Color Notes: Phrygian and Locrian',
          [
            prose(
              '<p>The two darkest modes are each defined by a single lowered degree against their parallel minor scale.</p>',
            ),
            table(
              ['Mode', 'Character / Mood', 'The One Defining Note'],
              [
                ['Phrygian', 'Dark, exotic, flamenco, Spanish', 'Flat 2nd (♭2): F♮ in E Phrygian'],
                ['Locrian', 'Unstable, ominous, dissonant tension', 'Flat 5th (♭5): F♮ in B Locrian'],
              ],
            ),
            scaleExplorer('phrygian-scales', 'E', { caption: 'E Phrygian — the flat 2nd (F♮) is the color note that makes it sound dark and Spanish.' }),
            sources(['Understand all 7 modes in music theory.pdf', 'Phrygian Scales.pdf', 'Locrian Scales.pdf']),
          ],
          mcq(
            'According to the table, what is the single defining note for Locrian mode?',
            ['Flat 2nd (♭2)', 'Flat 5th (♭5)', 'Flat 3rd (♭3)', 'Flat 7th (♭7)'],
            1,
            'The table explicitly states that Locrian is defined by the Flat 5th (♭5): F♮ in B Locrian, as one of the two darkest modes defined by a single lowered degree against their parallel minor scale.',
          ),
          [{ assert: 'pcSet', root: 'E', semitones: [0, 1, 3, 5, 7, 8, 10], notes: ['E', 'F', 'G', 'A', 'B', 'C', 'D'] }],
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l16-1-3',
      'Modal Improvisation Over a Drone',
      [
        step(
          'Drone Improvisation: Dorian and Lydian Labs',
          [
            prose(
              '<p>To truly internalize a mode\'s acoustic color, you must hear it against a static tonal center — a drone — rather than just naming its formula.</p>',
            ),
            list([
              'Dorian Lab (D Dorian): LH holds a low D octave or D–A open 5th drone. RH freely improvises melodies using the white keys D-E-F-G-A-B-C-D, emphasizing the B♮ (Natural 6th).',
              'Lydian Lab (F Lydian / C Lydian): LH holds a low C bass drone. RH plays C-D-E-F♯-G-A-B-C, emphasizing the F♯ (Sharp 4th) against the C bass.',
            ]),
            scaleExplorer('lydian-scales', 'C', { caption: 'C Lydian — the sharp 4th (F♯) is what rings out against the sustained C bass drone.' }),
            callout(
              'warning',
              'Modal traps',
              '<p><strong>Thinking D Dorian is "just C Major"</strong> — D Dorian is a minor-flavored mode with D as tonic; it sounds completely different because D, not C, is Home. <strong>Resolving to C in D Dorian</strong> — resolving to C breaks the mode; D must remain Home throughout the improvisation.</p>',
            ),
            sources(['How to improvise on piano.pdf']),
          ],
          mcq(
            "According to the text, what must you use to truly internalize a mode's acoustic color?",
            ['Naming its formula', 'Hearing it against a static tonal center — a drone', 'Playing it in all 12 keys', 'Resolving to the relative major tonic'],
            1,
            "The step text explicitly states that to truly internalize a mode's acoustic color, you must hear it against a static tonal center — a drone — rather than just naming its formula.",
          ),
          [{ assert: 'pcSet', root: 'C', semitones: [0, 2, 4, 6, 7, 9, 11], notes: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'] }],
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m16-1-ex-a',
      type: 'Technical drill',
      title: 'Protocol 16.1-A — 7-Mode White Key Tour',
      prompt: 'Set metronome to 72 BPM. Play each white-key mode up and down 1 octave hands separately, naming the mode and characteristic color note: C→C (Ionian – Major), D→D (Dorian – Natural 6th), E→E (Phrygian – Flat 2nd), F→F (Lydian – Sharp 4th), G→G (Mixolydian – Flat 7th), A→A (Aeolian – Natural Minor), B→B (Locrian – Flat 5th).',
    },
  ],
  checkpoints: [
    'Mode Ordering: can recite all 7 modes in order from Ionian to Locrian and in order of brightness (Lydian to Locrian).',
    'Color Notes: can state the characteristic note for Lydian (♯4), Mixolydian (♭7), Dorian (♮6), and Phrygian (♭2).',
    'Modal Vamp: can improvise an 8-measure melodic statement in D Dorian over a static D bass drone.',
  ],
});
