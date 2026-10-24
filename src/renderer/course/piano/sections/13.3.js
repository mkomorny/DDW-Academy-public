/**
 * Section 13.3 — Repertoire Reading: Clementi and Bach Literature Études
 * Module 13 — Reading II and Sight-Reading Craft (completes the module)
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_13_Reading_II_And_
 * Sight_Reading_Craft/Section_13.3_Repertoire_Reading_Clementi_Bach_Etudes.md),
 * read in full before authoring.
 *
 * Conversion notes:
 * - §2's citations match the scaffold's three sources exactly — no expansion
 *   needed this section.
 * - 13.3.1's Alberti-motor claim (Clementi LH: C-G-E-G) is a broken C Major
 *   triad, so it gets a `chordExplorer('C','maj')` pitch-confirmation panel
 *   plus a `pcSet` assert — same "block for harmony, table for hand shape"
 *   split as 12.3, now applied to a repertoire excerpt rather than a drill.
 * - 13.3.3's Half Cadence suspends on the G Major dominant triad, so it gets
 *   its own `chordExplorer('G','maj')` panel and `pcSet` assert.
 * - 13.3.2 (the drop-and-lift phrasing technique) is pure execution
 *   instruction, no spellable theory claim, so it carries no `asserts` — same
 *   reasoning as 13.2's technique-only steps.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`, matching the treatment 12.3's own §6 list received.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, chordExplorer, sources, mcq } from '../../schema.js';

export default module_({
  id: 'piano-m13-3',
  code: '13.3',
  title: 'Repertoire Reading: Clementi and Bach Literature Études',
  outcomes: [
    "Decode and perform the complete 8-measure primary theme of Clementi's Sonatina in C Major, Op. 36 No. 1 (Spiritoso).",
    "Decode and perform the complete 8-measure opening theme of Petzold's Minuet in G Major, BWV Anh. 114 (3/4 Triple Meter).",
    'Coordinate classical multi-voice textures: rapid scalar/arpeggiated RH motifs over steady LH Alberti and broken-chord accompaniments.',
    'Execute two-note slur "drop and lift" phrasing and crisp staccatos with authentic period precision.',
    'Identify and realize structural cadences (Half Cadence on V vs. Authentic Cadence on I).',
  ],
  sources: ['Piano Skill Levels Explained.pdf', 'Musical terms for piano.pdf', 'Form in Music.pdf'],
  practiceFocus: ['One public-domain étude texture, two-note phrasing, cadence marked.'],
  lessons: [
    lesson(
      'piano-l13-3-1',
      'Reading Classical Polyphonic Textures',
      [
        step(
          'Two Equal Voices: The Left Hand as Active Partner',
          [
            prose(
              '<p>In classical literature, the Left Hand is not a passive chord pad — it is an active, equal musical partner. In Clementi\'s Sonatina, the LH provides a steady, rhythmic Alberti motor that must stay dynamically quiet (p) while the RH executes bold, joyful fanfares (f) and sparkling descending scalar cascades. In the Bach/Petzold Minuet, both hands engage in a contrapuntal dance — in Measure 2 the LH walks downward (B → A → G) in quarter notes while the RH executes repeated crisp dance steps.</p>',
            ),
            table(
              ['Piece', 'LH role', 'RH role'],
              [
                ['Clementi Sonatina (C Major)', 'Steady Alberti motor (C-G-E-G), kept quiet at p', 'Bold fanfares and descending scalar runs at f'],
                ['Bach/Petzold Minuet (G Major)', 'Contrapuntal walking bass, e.g. B → A → G in Measure 2', 'Repeated crisp dance-step quarter notes'],
              ],
            ),
            prose(
              "<p>The Alberti motor's four broken notes are drawn from a single triad — C, E, and G — played one at a time rather than blocked together.</p>",
            ),
            chordExplorer('C', 'maj', { caption: 'The Clementi Alberti bass (C-G-E-G) draws its notes from this triad, broken rather than blocked.' }),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            "In the Clementi Sonatina, what is the dynamic marking for the left hand's steady Alberti motor while the right hand plays at f?",
            ['f', 'mf', 'p', 'mp'],
            2,
            'The step text states that the LH must stay dynamically quiet (p) while the RH executes bold, joyful fanfares (f).',
          ),
          [{ assert: 'pcSet', root: 'C', semitones: [0, 4, 7], notes: ['C', 'E', 'G'] }],
        ),
      ],
      { minutes: 8 },
    ),
    lesson(
      'piano-l13-3-2',
      'Two-Note Classical Phrasing (Drop and Lift)',
      [
        step(
          'The Drop-and-Lift Sigh Figure',
          [
            prose(
              '<p>Classical music is filled with short, expressive two-note slurs — the "appoggiatura" or "sigh" figure.</p>',
            ),
            callout(
              'key',
              'Drop and Lift',
              '<p>Drop arm weight into the first note of the slur — lean slightly, with dynamic emphasis — then gently roll the wrist upward to release the second note on the fly: light, unaccented, and staccato in its release.</p>',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'According to the step, how should the second note of a two-note slur be played?',
            [
              'With dynamic emphasis and a slight lean',
              'Light, unaccented, and staccato in its release',
              'By dropping arm weight into it',
              'With a gentle wrist roll downward',
            ],
            1,
            'The step text states to drop arm weight into the first note then gently roll the wrist upward to release the second note on the fly: light, unaccented, and staccato in its release.',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l13-3-3',
      'Structural Cadence Realization',
      [
        step(
          'Half Cadence vs. Authentic Cadence',
          [
            prose(
              '<p>Clementi\'s Sonatina theme ends its first phrase (Measure 4) with a Half Cadence: the phrase is left suspended on the Dominant, G Major, creating an unfinished musical "question." A concluding Authentic Cadence instead resolves decisively from Dominant to Tonic (V → I), providing the definitive musical "answer."</p>',
            ),
            table(
              ['Cadence type', 'Harmonic motion', 'Effect'],
              [
                ['Half Cadence', 'Ends on V (Dominant)', 'Suspended, unfinished — a musical "question"'],
                ['Authentic Cadence', 'V → I (Dominant to Tonic)', 'Resolved, decisive — a musical "answer"'],
              ],
            ),
            chordExplorer('G', 'maj', { caption: "The Half Cadence in Clementi's theme (Measure 4) suspends on this G Major dominant triad." }),
            sources(['Form in Music.pdf']),
          ],
          mcq(
            'According to the text, what is the harmonic motion and musical effect of an Authentic Cadence?',
            [
              'Ends on V (Dominant), suspended and unfinished — a musical "question"',
              'V → I (Dominant to Tonic), resolved and decisive — a musical "answer"',
              'Ends on I (Tonic), creating an unfinished musical "question"',
              'V → IV, providing a suspended musical "answer"',
            ],
            1,
            'The step text states that an Authentic Cadence resolves decisively from Dominant to Tonic (V → I), providing the definitive musical "answer," as shown in the table.',
          ),
          [{ assert: 'pcSet', root: 'G', semitones: [0, 4, 7], notes: ['G', 'B', 'D'] }],
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m13-3-ex-a',
      type: 'Repertoire drill',
      title: 'Protocol 13.3-A — Classical Literature 3-Stage Rehearsal',
      prompt: 'Stage 1 (Score Audit): scan the key signature (F♯ in the Minuet, none in Clementi), time signature, and cadences. Stage 2 (HS Scalework): play RH scale runs and LH Alberti figures separately at 72 BPM. Stage 3 (HT Synthesis): combine hands at 45 BPM, ensuring exact vertical alignment on downbeats.',
    },
  ],
  checkpoints: [
    'Clementi Theme Fluency: can perform the 8-measure primary theme of Clementi Op. 36 No. 1 HT at steady tempo.',
    'Bach/Petzold Minuet Fluency: can perform the 8-measure opening theme of the Minuet in G with correct 3/4 waltz weight and accurate F♯ accidental execution.',
    'Cadence Identification: can point to the score and identify the Half Cadence and Authentic Cadence measures.',
  ],
});
