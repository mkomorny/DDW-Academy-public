/**
 * Section 8.3 — Dynamics, Tempo, Mood, and the Italian Notation Page
 * Module 8 — Touch and Expression
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_08_Touch_And_Expression/
 * Section_8.3_Dynamics_Tempo_Mood_Italian_Page.md).
 *
 * This is Module 8's Gate F section — its own §6 "Gate F Assessment
 * Audit" (4 items) becomes lesson 8.3.7's closing checklist table AND
 * the module's checkpoints[] below, matching the Gate D/Gate E precedent
 * (the gate's own source-of-truth is the section that names it).
 *
 * Zero asserts — dynamics, tempo, mood, and score-navigation vocabulary
 * are performance-practice facts, outside all three theory-oracle assert
 * kinds (pcSet/interval/keySignature).
 *
 * One hand-fixed check-drafting defect before splicing: piano-l8-3-5's
 * step 2 was drafted as a multi() with only ONE index in its answer
 * array — a mis-kinded single-answer multi, since its options are
 * already paired strings ("Cantabile and Maestoso", etc.), so selecting
 * the correct pair is a single-answer choice. Recast as mcq() with the
 * same options and the same correct index.
 *
 * Check-drafting provenance: 14/14 questions passed shape + entailment on
 * the first attempt; 1 of the 14 was then hand-recast for the defect
 * above before splicing.
 */
import { module_, lesson, step, prose, table, callout, sources, mcq, multi, text } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l8-3-1',
      'The Dynamic Spectrum (pp to ff)',
      [
        step(
          'The 6-Tier Volume Staircase',
          [
            prose(
              'Dynamics indicate relative acoustic volume, spanning six standard tiers from Pianissimo up to Fortissimo.',
            ),
            table(
              ['Symbol', 'Italian term', 'Literal meaning', 'Biomechanical action'],
              [
                ['pp', 'Pianissimo', 'Very soft', 'Featherweight drop; minimum velocity'],
                ['p', 'Piano', 'Soft', 'Light arm support; quiet singing tone'],
                ['mp', 'Mezzo Piano', 'Moderately soft', 'Relaxed speaking tone'],
                ['mf', 'Mezzo Forte', 'Moderately loud', 'Firm, clear presence'],
                ['f', 'Forte', 'Loud', 'Deep arm weight drop; full acoustic bloom'],
                ['ff', 'Fortissimo', 'Very loud', 'Maximum controlled gravitational mass'],
              ],
            ),
            sources(['Dynamics in Music.pdf']),
          ],
          mcq(
            `According to the table, what is the biomechanical action for the dynamic marking 'f' (Forte)?`,
            [
              'Featherweight drop; minimum velocity',
              'Light arm support; quiet singing tone',
              'Deep arm weight drop; full acoustic bloom',
              'Maximum controlled gravitational mass',
            ],
            2,
            'The step text table explicitly lists for f | Forte | Loud | Deep arm weight drop; full acoustic bloom.',
          ),
        ),
        step(
          'Volume Is Velocity and Mass, Not a Switch',
          [
            prose(
              'On the piano, volume is controlled by the velocity and mass with which the hammer/key descends — the same underlying mechanism that separates a percussive poke from a resonant weight drop.',
            ),
            sources(['Dynamics in Music.pdf']),
          ],
          text(
            'What two factors control volume on the piano according to the text?',
            [
              'velocity and mass',
              'mass and velocity',
              'speed and weight',
              'velocity with which the hammer descends and its mass',
            ],
            'The step text explicitly states that volume is controlled by the velocity and mass with which the hammer/key descends.',
          ),
        ),
      ],
      {
        intro: 'Six named tiers of loudness, each tied to a specific physical action rather than an abstract number.',
      },
    ),
    lesson(
      'piano-l8-3-2',
      'Dynamic Transitions: Hairpins and Sforzando',
      [
        step(
          'Crescendo and Decrescendo',
          [
            table(
              ['Term', 'Symbol', 'Physical execution'],
              [
                ['Crescendo', '< or cresc.', 'Gradually add forearm mass on each successive key strike'],
                [
                  'Decrescendo / Diminuendo',
                  '> or decresc. / dim.',
                  'Gradually suspend arm mass, lightening key strikes',
                ],
              ],
            ),
            sources(['Dynamics in Music.pdf']),
          ],
          mcq(
            'According to the table, what is the physical execution for a crescendo?',
            [
              'Gradually suspend arm mass, lightening key strikes',
              'Gradually add forearm mass on each successive key strike',
              'Play at a constant loudness',
              'Suddenly increase volume on one note',
            ],
            1,
            'The step text states in the table that crescendo (< or cresc.) is executed by gradually adding forearm mass on each successive key strike.',
          ),
        ),
        step(
          'Sforzando: The Sudden Burst',
          [
            prose(
              'Sforzando (sfz or fz) is a sudden, sharp, explosive dynamic burst on a single note or chord, followed immediately by a return to the prevailing dynamic.',
            ),
            callout(
              'warning',
              'Build Evenly, Not All at Once',
              'Crescendoing too quickly — reaching maximum volume on note 2 — is a common anti-pattern. A true crescendo builds evenly across the entire length of the phrase.',
            ),
            sources(['Dynamics in Music.pdf']),
          ],
          mcq(
            'What immediately follows a sforzando (sfz or fz) dynamic burst according to the step text?',
            [
              'A gradual diminuendo',
              'A return to the prevailing dynamic',
              'A sustained fortissimo',
              'An accelerando',
            ],
            1,
            'The step text states that sforzando is a sudden, sharp, explosive dynamic burst on a single note or chord, followed immediately by a return to the prevailing dynamic.',
          ),
        ),
      ],
      { intro: 'Gradual dynamic change (hairpins) versus a single sudden burst (sforzando).' },
    ),
    lesson(
      'piano-l8-3-3',
      'Italian Tempo Terms: Approximate Bands, Not Rigid Laws',
      [
        step(
          'Character and Approximate Speed, Not a Rigid Law',
          [
            prose(
              'Tempo markings describe the character, pulse, and approximate velocity of a piece. Tempo numbers are approximate guidelines, never rigid mathematical laws.',
            ),
            table(
              ['Band', 'Term', 'Approximate reference'],
              [
                ['Slow', 'Grave', '~40–48 BPM, extremely slow and solemn'],
                ['Slow', 'Largo', '~50 BPM reference, broad and very slow'],
                ['Slow', 'Larghetto', '~56–66 BPM, slightly faster than Largo'],
                ['Slow', 'Adagio', '~66–76 BPM, slow, stately, with ease'],
                ['Slow', 'Lento', 'Slow'],
                ['Moderate', 'Andante', '~76–100 BPM, walking pace'],
                ['Moderate', 'Andantino', 'A light walking pace, often slightly faster than Andante'],
                ['Moderate', 'Moderato', '~100 BPM reference, moderate pace'],
                ['Moderate', 'Allegretto', '~108–120 BPM, moderately quick, lighter than Allegro'],
                ['Fast', 'Allegro', '~120–140 BPM, fast, lively, bright'],
                ['Fast', 'Vivace', '~140–160 BPM, very lively and fast'],
                ['Fast', 'Presto', '~150–180 BPM reference, extremely fast'],
                ['Fast', 'Prestissimo', '>180 BPM, as fast as physically executable'],
              ],
            ),
            sources(['Tempo in Music.pdf']),
          ],
          mcq(
            'According to the tempo markings table, what is the approximate BPM reference and character for Allegro?',
            [
              '~100 BPM, moderate pace',
              '~120–140 BPM, fast, lively, bright',
              '~140–160 BPM, very lively and fast',
              '~150–180 BPM, extremely fast',
            ],
            1,
            'The table explicitly lists Allegro under Fast as ~120–140 BPM, fast, lively, bright.',
          ),
        ),
        step(
          'Never Treat a Tempo Word as a Fixed Number',
          [
            callout(
              'warning',
              'Character First, BPM Second',
              'Treating Italian tempo markings as fixed metronome numbers is a common anti-pattern. Italian tempi describe character; BPMs are approximate baselines.',
            ),
            sources(['Tempo in Music.pdf']),
          ],
          mcq(
            'What does the text say Italian tempo markings primarily describe?',
            [
              'Fixed metronome numbers',
              'Musical character',
              'Exact BPM values',
              'Mechanical speed only',
            ],
            1,
            'The step text states that Italian tempi describe character and that treating them as fixed metronome numbers is a common anti-pattern.',
          ),
        ),
      ],
      {
        intro: 'A full spectrum of Italian tempo words, each anchored to an approximate BPM band rather than an exact number.',
      },
    ),
    lesson(
      'piano-l8-3-4',
      'Changing Time: Accelerando, Ritardando, A Tempo',
      [
        step(
          'Accelerando, Ritardando, and A Tempo',
          [
            table(
              ['Term', 'Meaning'],
              [
                ['Accelerando (accel.)', 'Gradually increase the speed of the pulse'],
                [
                  'Ritardando (rit.) / Rallentando (rall.)',
                  'Gradually decrease the speed of the pulse, often leading to a cadence or phrase ending',
                ],
                [
                  'A Tempo',
                  'Cancel the preceding tempo fluctuation and return immediately to the original base speed',
                ],
              ],
            ),
            sources(['Tempo in Music.pdf']),
          ],
          mcq(
            'What does the marking "A Tempo" instruct a performer to do?',
            [
              'Gradually increase the speed of the pulse',
              'Gradually decrease the speed of the pulse',
              'Cancel the preceding tempo fluctuation and return immediately to the original base speed',
              'Lead to a cadence or phrase ending',
            ],
            2,
            'The step text explicitly defines "A Tempo" as cancelling the preceding tempo fluctuation and returning immediately to the original base speed.',
          ),
        ),
        step(
          'Poco a Poco',
          [
            prose(
              'Poco a Poco means "little by little" — for example, crescendo poco a poco means to get louder very gradually.',
            ),
            sources(['Tempo in Music.pdf']),
          ],
          text(
            'What does "poco a poco" mean?',
            ['little by little', 'gradually'],
            'The step text explicitly states that Poco a Poco means "little by little".',
          ),
        ),
      ],
      {
        intro: 'The vocabulary for speeding up, slowing down, and returning to the original pulse.',
      },
    ),
    lesson(
      'piano-l8-3-5',
      'Italian Mood Descriptors',
      [
        step(
          'Five Core Mood Markings',
          [
            table(
              ['Mood marking', 'Expressive interpretation'],
              [
                [
                  'Cantabile',
                  '"In a singing style" — a rich, lyrical, connected legato melody with prominent dynamic voicing',
                ],
                ['Dolce', '"Sweetly, gently" — a delicate touch, soft dynamic, relaxed finger release'],
                [
                  'Maestoso',
                  '"Majestically, nobly" — a stately tempo, firm, grounded arm weight, clear articulation',
                ],
                ['Con Brio', '"With spirit and vigor" — crisp attacks, energetic drive'],
                ['Scherzando', '"Playfully, jokingly" — light staccato, springy bounces'],
              ],
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          multi(
            'Which of the following mood markings indicate a light, delicate, or playful approach according to the definitions provided?',
            ['Cantabile', 'Dolce', 'Maestoso', 'Scherzando', 'Con Brio'],
            [1, 3],
            'Dolce is defined as "Sweetly, gently" with a delicate touch and soft dynamic, while Scherzando is defined as "Playfully, jokingly" with light staccato and springy bounces; both are stated directly in the step text.',
          ),
        ),
        step(
          'Cantabile vs. Maestoso: Two Opposite Characters',
          [
            prose(
              'Cantabile calls for a rich, lyrical, connected singing line, while Maestoso calls for a stately, firm, grounded, clearly articulated character — two moods that ask for nearly opposite physical approaches to the same keys.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'Which pair of Italian mood markings is described as requiring nearly opposite physical approaches to the piano keys?',
            [
              'Cantabile and Dolce',
              'Cantabile and Maestoso',
              'Maestoso and Scherzando',
              'Dolce and Con Brio',
            ],
            1,
            'The step text explicitly states that Cantabile and Maestoso call for nearly opposite physical approaches to the same keys.',
          ),
        ),
      ],
      {
        intro: 'Italian mood words that shape touch and phrasing, beyond just tempo and dynamics.',
      },
    ),
    lesson(
      'piano-l8-3-6',
      'Score Navigation Marks: D.C., D.S., and Fine',
      [
        step(
          'Da Capo and Dal Segno',
          [
            table(
              ['Mark', 'Literal meaning', 'Command'],
              [
                [
                  'Da Capo (D.C.)',
                  'From the head (the beginning)',
                  'Return to Measure 1 and play until the word Fine',
                ],
                [
                  'Dal Segno (D.S.)',
                  'From the sign',
                  'Jump back to the measure marked with the Segno symbol and play until Fine or the Coda',
                ],
              ],
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'What does the marking "D.C." instruct a player to do?',
            [
              'Jump back to the measure marked with the Segno symbol',
              'Return to Measure 1 and play until the word Fine',
              'Play until Fine or the Coda',
              'Skip to the Coda section',
            ],
            1,
            'The step text states that Da Capo (D.C.) literally means "From the head (the beginning)" and its command is to "Return to Measure 1 and play until the word Fine."',
          ),
        ),
        step(
          'Fine: Where It Actually Ends',
          [
            prose('Fine marks the definitive concluding measure of the piece.'),
            callout(
              'warning',
              'Stop at Fine, Not the Final Barline',
              'Ignoring Fine and continuing to play to the final printed barline is a common anti-pattern. On a D.C. or D.S. repeat, stop immediately at the word Fine.',
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          mcq(
            'What should you do when you reach the word Fine during a D.C. or D.S. repeat?',
            [
              'Continue playing until the final printed barline',
              'Stop immediately at Fine',
              'Repeat the section again from the beginning',
              'Ignore Fine and look for another repeat sign',
            ],
            1,
            'The step text states that on a D.C. or D.S. repeat, you must stop immediately at the word Fine and that continuing to the final barline is a common anti-pattern.',
          ),
        ),
      ],
      {
        intro: 'Score roadmap symbols that prevent redundant engraving of repeated sections — and where the repeat actually has to stop.',
      },
    ),
    lesson(
      'piano-l8-3-7',
      'Laboratory: One Phrase, Six Expressive Variations',
      [
        step(
          'One Phrase, Six Ways',
          [
            prose(
              'Take the 4-measure C-Major phrase (C-D-E-F | G-F-E-D | C) and perform it six different ways, each combining a dynamic, tempo, articulation, and mood character.',
            ),
            table(
              ['Take', 'Dynamic', 'Tempo', 'Articulation', 'Mood character'],
              [
                ['1', 'p', 'Adagio', 'Legato', 'Dolce (sweet, quiet lullaby)'],
                ['2', 'f', 'Allegro', 'Staccato', 'Scherzando (bright, playful)'],
                ['3', 'mf', 'Moderato', 'Legato', 'Cantabile (lyrical song)'],
                ['4', 'pp', 'Grave', 'Tenuto', 'Solemn, mysterious'],
                ['5', 'ff', 'Maestoso', 'Accented', 'Grand, noble royal march'],
                ['6', 'Crescendo', 'Accel.', 'Mixed', 'Building dramatic climax'],
              ],
            ),
            sources(['25 Classical Music Terms Finally Explained in Plain English']),
          ],
          mcq(
            'According to the table, which combination uses ff, Maestoso, Accented, and describes a grand, noble royal march?',
            [
              '1: p, Adagio, Legato, Dolce',
              '4: pp, Grave, Tenuto, Solemn mysterious',
              '5: ff, Maestoso, Accented, Grand noble royal march',
              '6: Crescendo, Accel., Mixed, Building dramatic climax',
            ],
            2,
            `The step text's table explicitly lists row 5 as ff | Maestoso | Accented | Grand, noble royal march.`,
          ),
        ),
        step(
          'Gate F Assessment Audit',
          [
            prose('To pass Gate F and unlock Module 9 (Intervals & First Keys), verify all four items below.'),
            table(
              ['Gate F requirement', 'What to verify'],
              [
                [
                  'Dynamic staircase mastery',
                  'Audible contrast across all 6 dynamic levels (pp, p, mp, mf, f, ff) on a single key using controlled arm mass.',
                ],
                [
                  'Expressive repertoire performance',
                  'A known two-hand piece (Ode to Joy or Frère Jacques) performed with planned dynamic shaping (p ↔ f) and clean articulation (legato vs. staccato).',
                ],
                [
                  'Italian score literacy',
                  'Can define Andante, Allegro, Crescendo, Ritardando, Cantabile, D.C. al Fine, and Fine without consulting notes.',
                ],
                [
                  'Established warm-up habit',
                  'Executes the 5-minute warm-up protocol (Adele Marcus stretch, Hanon wrist-drop, Jazer Lee contrary pentascale) before every session.',
                ],
              ],
            ),
            sources(['Musical terms for piano.pdf']),
          ],
          multi(
            'Which of the following are required to pass Gate F according to the listed requirements?',
            [
              'Audible contrast across all 6 dynamic levels (pp, p, mp, mf, f, ff) on a single key using controlled arm mass',
              'A known two-hand piece performed with planned dynamic shaping (p ↔ f) and clean articulation (legato vs. staccato)',
              'The ability to define Andante, Allegro, Crescendo, Ritardando, Cantabile, D.C. al Fine, and Fine without consulting notes',
              'Executing the 5-minute warm-up protocol before every session',
              'Performing with rigid mechanical BPM',
            ],
            [0, 1, 2, 3],
            'The step text explicitly lists these four items in the Gate F requirement table as what must be verified to pass and unlock Module 9.',
          ),
        ),
      ],
      {
        intro: 'The same short phrase performed six expressive ways, closing with the full Gate F rubric.',
      },
    ),
  ],
  exercises: [
    {
      id: 'piano-m8-3-ex-a',
      type: 'Dynamic staircase drill',
      title: 'Protocol 8.3-A — Dynamic Staircase Scale Drill',
      prompt: 'Play the C Major Pentascale ascending from C to G. Start at pp on C and step up one dynamic level per note (C:pp → D:p → E:mp → F:mf → G:f). Descend with a gradual diminuendo (F:mf → E:mp → D:p → C:pp).',
    },
  ],
  checkpoints: [
    'Dynamic staircase mastery: audible contrast across all 6 dynamic levels (pp, p, mp, mf, f, ff) on a single key using controlled arm mass.',
    'Expressive repertoire performance: a known two-hand piece (Ode to Joy or Frère Jacques) performed with planned dynamic shaping (p ↔ f) and clean articulation.',
    'Italian score literacy: can define Andante, Allegro, Crescendo, Ritardando, Cantabile, D.C. al Fine, and Fine without consulting notes.',
    'Established warm-up habit: executes the 5-minute warm-up protocol before every session.',
  ],
  outcomes: [
    'Execute the 6-tier dynamic spectrum: pp → p → mp → mf → f → ff utilizing controlled gravitational arm mass.',
    'Execute gradual dynamic transitions: Crescendo (< / cresc.) and Decrescendo / Diminuendo (> / dim.).',
    'Interpret traditional Italian tempo markings as character and approximate speed bands (Largo ≈ 50, Moderato ≈ 100, Presto ≈ 150 BPM), rejecting rigid mechanical BPM dogmatism.',
    'Execute tempo fluctuations: Accelerando (accel.), Ritardando (rit.), and return with A Tempo.',
    'Interpret primary Italian mood markings (Cantabile, Dolce, Con Brio, Maestoso, Scherzando).',
    'Navigate structural score repeat roadmaps: Da Capo (D.C.), Dal Segno (D.S.), and Fine.',
    'Perform the integrated "One Phrase, Six Ways" laboratory and execute the Gate F Assessment Rubric.',
  ],
  sources: [
    'Musical terms for piano.pdf',
    'Dynamics in Music.pdf',
    'Tempo in Music.pdf',
    '25 Classical Music Terms Finally Explained in Plain English',
  ],
  practiceFocus: ['One known piece with a written dynamic + tempo plan (Gate F).'],
  id: 'piano-m8-3',
  code: '8.3',
  title: 'Dynamics, Tempo, Mood, and the Italian Notation Page',
});
