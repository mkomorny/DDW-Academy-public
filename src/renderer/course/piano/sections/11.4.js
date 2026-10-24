/**
 * Section 11.4 — The Roman Numeral Harmonic Family and Universal Progressions
 * Module 11 — Chords and Harmony
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_11_Chords_And_Harmony/
 * Section_11.4_The_Roman_Numeral_Harmonic_Family.md), read in full before
 * authoring. Fourth and final section of Module 11 — authored together with
 * 11.3, 12.1, and 12.2 under Miranda's second explicit chaining instruction.
 * Completing this section finishes Module 11 (11.1-11.4 all authored) —
 * Level 11 is wired into `piano/index.js`'s `LEVELS` as part of this batch.
 * Module 11 has no gate of its own in the syllabus's Assessment Summary (the
 * next gate, Gate I, belongs to Module 12 — Section 12.4), so wiring Level
 * 11 in adds no new entry to `GATES` — the same shape as Modules 4 and 7.
 *
 * Conversion notes:
 * - First live use of `progression()` — its chord-symbol parser
 *   (renderers.progression, views/blocks.js:672-680) maps bare letters to
 *   major, 'm' to minor, and '7' to dom7, all confirmed against the four
 *   progressions this section actually needs before use. `progression()`
 *   plays root-position chords; the source's own voice-led inversions
 *   (11.4.3's G/B, Am/C, F/C) stay in an accompanying table rather than
 *   being invented into the block, matching 10.2's "block for the harmony,
 *   table for the exact hand shape" split.
 * - 11.4.1 and 11.4.2 each get `pcSet` asserts for one representative chord
 *   per quality (major/minor/diminished) rather than all seven scale
 *   degrees, keeping the assert count proportionate to what's actually
 *   claimed in that step's own prose.
 * - 11.4.5's "roots move in descending fifths" claim (D→G→C) gets two
 *   `interval` asserts (G3→D4 and C3→G3, both 7 semitones) rather than a
 *   pcSet, since the claim is about root motion, not chord content.
 * - 11.4.6's 12-bar blues gets the full 12-chord `progression()` sequence
 *   plus `pcSet` asserts for its three underlying dominant-seventh
 *   qualities (C7, F7, G7) — F7 is new to this course; C7 and G7 reuse the
 *   same pitch classes already asserted in 11.3.1/11.3.2 in a new harmonic
 *   context.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, progression, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l11-4-1',
      'The Diatonic Stacking Principle',
      [
        step(
          'Stacking Thirds to Build the Diatonic Chord Family',
          [
            prose(
              '<p>A chord is diatonic when every one of its notes belongs strictly to the underlying key signature. By starting on each successive scale degree and stacking diatonic 3rds (1-3-5), the seven-chord Diatonic Chord Family is generated. The Invariant Major Pattern: in every Major key, chords I, IV, and V are always Major; chords ii, iii, and vi are always Minor; chord vii° is always Diminished.</p>',
            ),
            table(
              ['Step', '1', '2', '3', '4', '5', '6', '7'],
              [
                ['Note (C Major)', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
                ['Triad', 'C-E-G', 'D-F-A', 'E-G-B', 'F-A-C', 'G-B-D', 'A-C-E', 'B-D-F'],
                ['Numeral', 'I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
                ['Quality', 'Major', 'Minor', 'Minor', 'Major', 'Major', 'Minor', 'Diminished'],
              ],
            ),
            sources(['Easy Chord Theory - Diatonic Chords of Major Keys', 'Triads and Chords.pdf', 'Chords built from Major scales.pdf']),
          ],
          mcq(
            'According to the text, in every Major key, which three chords are always Major?',
            ['I, IV, and V', 'ii, iii, and vi', 'I, iii, and V', 'IV, V, and vii°'],
            0,
            'The step text explicitly states in the Invariant Major Pattern that in every Major key, chords I, IV, and V are always Major.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'D', semitones: [0, 3, 7], notes: ['D', 'F', 'A'] },
            { assert: 'pcSet', root: 'B', semitones: [0, 3, 6], notes: ['B', 'D', 'F'] },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l11-4-2',
      'Diatonic Chords in Harmonic Minor',
      [
        step(
          'The Raised 7th Creates a Major V Chord',
          [
            prose(
              '<p>In Minor keys, applying the raised 7th leading tone creates the standard functional minor chord family. In A Minor: i is A-C-E (Minor), ii° is B-D-F (Diminished), III is C-E-G (Major, or III+ augmented if the raised 7th is used), iv is D-F-A (Minor), V is E-G♯-B (Major, via the raised 7th), VI is F-A-C (Major), and vii° is G♯-B-D (Diminished). The raised leading tone (G♯) is what turns the V chord Major instead of Minor — that raised-7th pull is what gives the V chord its strong resolution back to i.</p>',
            ),
            table(
              ['Step', 'Roman Numeral', 'Triad in A Minor', 'Quality'],
              [
                ['1', 'i', 'A - C - E', 'Minor'],
                ['2', 'ii°', 'B - D - F', 'Diminished'],
                ['3', 'III (or III+)', 'C - E - G (or G♯)', 'Major (or Augmented)'],
                ['4', 'iv', 'D - F - A', 'Minor'],
                ['5', 'V', 'E - G♯ - B', 'Major (via raised 7)'],
                ['6', 'VI', 'F - A - C', 'Major'],
                ['7', 'vii°', 'G♯ - B - D', 'Diminished'],
              ],
            ),
            sources(['Easy Chord Theory - Diatonic Chords of Major Keys']),
          ],
          mcq(
            'In A minor, what makes the V chord major instead of minor?',
            ['Using the raised 7th leading tone', 'Lowering the 3rd of the chord', 'Adding an extra note to make it a seventh chord', 'Using the natural minor scale without alterations'],
            0,
            'The step text states that the raised leading tone (G♯) is what turns the V chord Major instead of Minor.',
          ),
          [
            { assert: 'pcSet', root: 'A', semitones: [0, 3, 7], notes: ['A', 'C', 'E'] },
            { assert: 'pcSet', root: 'E', semitones: [0, 4, 7], notes: ['E', 'G#', 'B'] },
            { assert: 'pcSet', root: 'G#', semitones: [0, 3, 6], notes: ['G#', 'B', 'D'] },
          ],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l11-4-3',
      'Universal Progression 1: I → V → vi → IV ("The Four Chords")',
      [
        step(
          'The Most Famous Chord Loop in Modern Music',
          [
            prose(
              '<p>The I-V-vi-IV progression is the most famous chord loop in modern music — heard in <em>Let It Be</em>, <em>Don\'t Stop Believin\'</em>, and <em>Someone Like You</em>. Voice-led in C Major: I (Tonic, root position) is C-E-G; V (Dominant, 1st inversion G/B) is B-D-G; vi (Submediant, 1st inversion Am/C) is C-E-A; IV (Subdominant, 2nd inversion F/C) is C-F-A. The Left Hand plays the bass roots C → G → A → F under each chord.</p>',
            ),
            progression(['C', 'G', 'Am', 'F'], { numerals: ['I', 'V', 'vi', 'IV'], caption: 'The I–V–vi–IV loop in C Major, root position.' }),
            table(
              ['Numeral', 'Chord', 'LH bass', 'RH voicing (voice-led)'],
              [
                ['I (Tonic)', 'C Major', 'C', 'C - E - G (root position)'],
                ['V (Dominant)', 'G Major', 'G', 'B - D - G (1st inversion, G/B)'],
                ['vi (Submediant)', 'A Minor', 'A', 'C - E - A (1st inversion, Am/C)'],
                ['IV (Subdominant)', 'F Major', 'F', 'C - F - A (2nd inversion, F/C)'],
              ],
            ),
            sources(['Piano chord progression guide for beginners.pdf', 'Piano chords every beginner should know.pdf']),
          ],
          mcq(
            'In the voice-led I-V-vi-IV progression in C Major, what is the right-hand voicing for the V (Dominant) chord?',
            ['C-E-G', 'B-D-G', 'C-E-A', 'C-F-A'],
            1,
            'The step text states that the RH voicing for V (Dominant) is B-D-G (1st inversion, G/B).',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7], notes: ['G', 'B', 'D'] },
            { assert: 'pcSet', root: 'A', semitones: [0, 3, 7], notes: ['A', 'C', 'E'] },
            { assert: 'pcSet', root: 'F', semitones: [0, 4, 7], notes: ['F', 'A', 'C'] },
          ],
        ),
      ],
      { minutes: 9 },
    ),
    lesson(
      'piano-l11-4-4',
      'Universal Progression 2: I → vi → IV → V ("Doo-Wop")',
      [
        step(
          'The Classic 1950s Rock and Soul Progression',
          [
            prose(
              '<p>The Doo-Wop progression (<em>Stand By Me</em>, <em>Earth Angel</em>) is the classic 1950s rock/soul chord loop. In C Major: C → Am → F → G. Harmonic motion: the Tonic (C) expands to its warm relative minor (Am), drops to the Subdominant (F), and charges up the Dominant (G) to cycle back to C.</p>',
            ),
            progression(['C', 'Am', 'F', 'G'], { numerals: ['I', 'vi', 'IV', 'V'], caption: 'The Doo-Wop progression: Stand By Me, Earth Angel.' }),
            sources(['Piano chord progression guide for beginners.pdf']),
          ],
          mcq(
            'In the Doo-Wop progression in C Major, which chord follows the warm relative minor?',
            ['C (Tonic)', 'F (Subdominant)', 'G (Dominant)', 'Am'],
            1,
            'The step text states the Doo-Wop progression in C Major is C → Am → F → G, so after the relative minor (Am) it drops to the Subdominant (F).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l11-4-5',
      'Universal Progression 3: ii → V → I (The Foundation of Jazz & Classical)',
      [
        step(
          'The Circle Pull: Roots Moving in Descending Fifths',
          [
            prose(
              '<p>The ii-V-I progression is the foundation of jazz and classical cadences. In C Major: Dm7 → G7 → Cmaj7. The Circle Pull: the roots move in descending fifths (D → G → C) — this is the most harmonically decisive cadence in Western tonal music.</p>',
            ),
            progression(['Dm7', 'G7', 'Cmaj7'], { numerals: ['ii⁷', 'V⁷', 'Imaj⁷'], caption: 'The ii⁷–V⁷–Imaj⁷ cadence — roots descend by fifths.' }),
            sources(['Piano chord progression guide for beginners.pdf']),
          ],
          mcq(
            'In the ii-V-I progression shown for C Major, what are the three chords in order?',
            ['Cmaj7 → G7 → Dm7', 'Dm7 → G7 → Cmaj7', 'G7 → Cmaj7 → Dm7', 'Cmaj7 → Dm7 → G7'],
            1,
            'The step text explicitly states the ii-V-I progression in C Major as Dm7 → G7 → Cmaj7.',
          ),
          [
            { assert: 'interval', from: 'G3', to: 'D4', semitones: 7 },
            { assert: 'interval', from: 'C3', to: 'G3', semitones: 7 },
          ],
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l11-4-6',
      'The 12-Bar Blues Architecture',
      [
        step(
          'The Three Phrases of the 12-Bar Form',
          [
            prose(
              '<p>The 12-bar blues is an invariant 12-measure cyclical form built entirely on dominant seventh chords on I, IV, and V. Phrase 1 (Tonic Establishment, measures 1-4): C7, C7 (or F7), C7, C7. Phrase 2 (Subdominant Deviation → Tonic Return, measures 5-8): F7, F7, C7, C7. Phrase 3 (The Cadence & Turnaround, measures 9-12): G7, F7, C7, G7. The final measure (M12, the Turnaround) strikes the Dominant (V7 = G7), firing harmonic tension to restart the 12-measure loop.</p>',
            ),
            table(
              ['Phrase', 'Measures', 'Chords'],
              [
                ['1 — Tonic Establishment', '1-4', 'C7 | C7 (or F7) | C7 | C7'],
                ['2 — Subdominant Deviation → Tonic Return', '5-8', 'F7 | F7 | C7 | C7'],
                ['3 — The Cadence & Turnaround', '9-12', 'G7 | F7 | C7 | G7 (Turn)'],
              ],
            ),
            progression(
              ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'],
              { caption: 'The standard 12-bar blues matrix in C — measures 1 through 12.' },
            ),
            sources(['12-bar blues.pdf']),
          ],
          mcq(
            'According to the step text, what is the function of the final G7 chord in measure 12 of the 12-bar blues?',
            ['It resolves to the subdominant', 'It establishes the tonic', 'It fires harmonic tension to restart the 12-measure loop', 'It provides the subdominant deviation'],
            2,
            'The step text states that the final measure (M12, the Turnaround) strikes the Dominant (V7 = G7), firing harmonic tension to restart the 12-measure loop.',
          ),
          [
            { assert: 'pcSet', root: 'C', semitones: [0, 4, 7, 10], notes: ['C', 'E', 'G', 'Bb'] },
            { assert: 'pcSet', root: 'F', semitones: [0, 4, 7, 10], notes: ['F', 'A', 'C', 'Eb'] },
            { assert: 'pcSet', root: 'G', semitones: [0, 4, 7, 10], notes: ['G', 'B', 'D', 'F'] },
          ],
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m11-4-ex-a',
      type: 'Voice-led pop progression loop',
      title: 'Protocol 11.4-A — Voice-Led Pop Progression Loop',
      prompt: 'Set metronome to 76 BPM in 4/4 time. In LH, play steady bass roots on Beat 1 of each measure: C → G → A → F. In RH, play voice-led blocked chords on Beats 1 and 3: Bar 1 C Major (C-E-G), Bar 2 G Major (B-D-G), Bar 3 A Minor (C-E-A), Bar 4 F Major (C-F-A). Loop ×4 cycles without rhythmic hitch.',
    },
  ],
  checkpoints: [
    'Major diatonic scale: can recite the roman numeral and quality for all 7 major scale degrees (I, ii, iii, IV, V, vi, vii°) instantly.',
    'Minor diatonic scale: knows why the V chord in minor is Major and why ii° is diminished.',
    'Pop progressions: can play both the "Four Chords" (I-V-vi-IV) and Doo-Wop (I-vi-IV-V) with voice-led RH shapes.',
    '12-bar blues memory: can map out the 12 measures of a blues in C (C7, F7, G7) from memory.',
  ],
  outcomes: [
    'Explain Roman numeral casing conventions: Uppercase = Major, Lowercase = Minor, Degree Symbol (°) = Diminished, Plus (⁺) = Augmented.',
    'Construct the 7 diatonic triads of any Major Scale: I - ii - iii - IV - V - vi - vii°.',
    'Construct the 7 diatonic triads of a Harmonic Minor Scale: i - ii° - III - iv - V - VI - vii°.',
    'Perform the universal pop progression I → V → vi → IV in C Major and G Major using voice-led chord shapes.',
    'Perform the classic Doo-Wop progression I → vi → IV → V.',
    'Perform the classical/jazz cadence ii → V → I.',
    'Execute the formal 12-measure harmonic form of the 12-Bar Blues in C Major.',
  ],
  sources: [
    'Easy Chord Theory - Diatonic Chords of Major Keys',
    'Triads and Chords.pdf',
    'Piano chord progression guide for beginners.pdf',
    '12-bar blues.pdf',
    'Chords built from Major scales.pdf',
  ],
  practiceFocus: ['I–V–vi–IV and a 12-bar blues map in C.'],
  id: 'piano-m11-4',
  code: '11.4',
  title: 'The Roman Numeral Harmonic Family and Universal Progressions',
});
