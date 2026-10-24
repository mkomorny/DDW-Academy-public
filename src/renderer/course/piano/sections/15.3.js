/**
 * Section 15.3 — Pedal Traps, Half-Pedaling, and Expressive Repertoire Applications
 * Module 15 — The Pedal
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_15_The_Pedal/
 * Section_15.3_Pedal_Traps_Half_Pedaling_Repertoire.md), read in full
 * before authoring.
 *
 * Conversion notes:
 * - §2's three citations match the scaffold's sources exactly.
 * - §3's "Four Deadly Pedal Traps" matrix (Crutch, Mud, Stomp, Floating
 *   Heel) is the section's own Learning Outcome 1 but has no dedicated
 *   lesson id in the syllabus roster (only 15.3.1–15.3.3 exist) — folded in
 *   as a first step of Lesson 15.3.1, ahead of the Half-Pedaling/Fluttering
 *   content that lesson's own title names, since nothing else in the
 *   3-lesson roster covers it.
 * - 15.3.2's Chopin excerpt states the Measure 1 LH chord as E3-G3-B3 — a
 *   plain E Minor triad — so it gets a `chordExplorer('E','min')` +
 *   `pcSet` assert confirming that spelling, the same "repertoire excerpt"
 *   pattern first used in 13.3.1.
 * - 15.3.3 closes with §4's two Methodological Traps as a
 *   `callout('warning', …)`, matching every other section this batch.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`.
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, chordExplorer, sources, mcq, multi, text } from '../../schema.js';

export default module_({
  id: 'piano-m15-3',
  code: '15.3',
  title: 'Pedal Traps, Half-Pedaling, and Expressive Repertoire Applications',
  outcomes: [
    'Identify, diagnose, and eradicate the Four Deadly Pedal Traps (Pedal as a Legato Crutch, Harmonic Mud-Washing, Foot Stomping Mechanical Noise, and Floating Heel Fatigue).',
    'Explain the acoustic mechanics of Half-Pedaling: grazing dampers against strings to clear high-frequency treble overtones while preserving deep low bass resonance.',
    `Apply rhythmic pedaling to Chopin's Prelude in E Minor, Op. 28 No. 4 (pedal clearing on every pulsing eighth-note harmonic shift).`,
    'Apply atmospheric impressionist pedaling to contemporary minimalist washes (Debussy / Ludovico Einaudi style).',
    'Conduct a self-directed audio recording audit to evaluate pedal cleanliness.',
  ],
  sources: [
    'A perfect guide to learning piano.pdf',
    'Piano Skill Levels Explained.pdf',
    'Tips on how to practice piano.pdf',
  ],
  practiceFocus: ['One known piece with pedal last; listen for blur on a recording.'],
  lessons: [
    lesson(
      'piano-l15-3-1',
      'Advanced Acoustic Mechanics: Half-Pedaling and Fluttering',
      [
        step(
          'The Four Deadly Pedal Traps',
          [
            prose(
              '<p>Before refining pedal technique further, the pianist must diagnose four traps that corrupt a performance.</p>',
            ),
            table(
              ['Trap', 'Problem', 'Solution'],
              [
                ['The Crutch Trap', 'Playing choppy, disconnected fingers while holding down the pedal.', 'Rehearse the piece 100% DRY (no pedal) until finger legato is perfect.'],
                ['The Mud Trap', 'Failing to clear the pedal when the harmony changes.', 'Execute strict syncopated "up-down" clearing on every chord change.'],
                ['The Stomp Trap', 'Lifting the foot off the pedal and slamming down, causing loud thumps.', 'Keep the foot in permanent physical contact with the pedal surface.'],
                ['The Floating Heel Trap', 'Lifting the heel off the floor, causing severe leg strain and fatigue.', 'Glue the right heel firmly to the floor; pedal using ankle flexion only.'],
              ],
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          multi(
            'Which of the following are correctly matched pairs of a pedal trap, its problem, and its solution according to the text?',
            [
              'The Crutch Trap: choppy disconnected fingers while pedaling – rehearse 100% dry until finger legato is perfect',
              'The Mud Trap: lifting the heel off the floor – glue the right heel to the floor',
              'The Stomp Trap: lifting foot and slamming it down causing thumps – keep foot in permanent contact with pedal',
              'The Floating Heel Trap: failing to clear pedal on harmony changes – execute strict syncopated up-down clearing',
            ],
            [0, 2],
            'The step text explicitly pairs The Crutch Trap with choppy disconnected fingers and the dry-rehearsal solution, and The Stomp Trap with lifting/slamming the foot and the permanent-contact solution.',
          ),
        ),
        step(
          'Half-Pedaling and Flutter-Pedaling',
          [
            prose(
              '<p>On acoustic grand pianos and high-end digital controllers with continuous CC64 optical sensors, two advanced pedaling techniques go beyond the simple down/up choreography.</p>',
            ),
            table(
              ['Technique', 'Mechanism', 'Effect'],
              [
                ['Half-Pedaling', 'The pedal is depressed halfway down (CC64 ≈ 64–80) instead of fully to the floor; the felt dampers lightly skim the strings.', 'Long low-frequency bass strings continue ringing while short, high-frequency treble strings are instantly damped.'],
                ['Flutter-Pedaling', 'Rapid, shallow vertical vibrations of the foot, used in Impressionist literature (Debussy, Ravel).', 'Creates an ethereal harmonic shimmer without allowing bass notes to build up into a muddy roar.'],
              ],
            ),
            sources(['A perfect guide to learning piano.pdf']),
          ],
          multi(
            'Which two advanced pedaling techniques are described for acoustic grand pianos and high-end digital controllers with continuous CC64 optical sensors?',
            [
              'Half-Pedaling and Flutter-Pedaling',
              'Sostenuto and Una Corda',
              'Rhythmic and Syncopated',
              'Half-Pedaling and Full-Pedaling',
            ],
            [0],
            'The step text explicitly states that two advanced pedaling techniques (Half-Pedaling and Flutter-Pedaling) go beyond simple down/up choreography on those instruments.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l15-3-2',
      'Romantic Repertoire Study: Chopin Prelude in E Minor, Op. 28 No. 4',
      [
        step(
          'The Chopin E Minor Prelude Excerpt (M1–M2)',
          [
            prose(
              '<p>In Romantic literature, harmony changes with extreme chromatic subtlety. This excerpt is in E Minor, 2/2 (cut time), marked espressivo (p).</p>',
            ),
            table(
              ['Measure', 'RH melody', 'LH chords', 'Pedaling'],
              [
                ['1 — Tonic Embedment', 'B4 (dotted half), then C5–B4 (eighths)', 'E3–G3–B3 pulsing eighth notes', 'Down-Up-Down pedal on Beat 1.'],
                ['2 — Chromatic Slip', 'B4 (dotted half), then C5–B4 (eighths)', 'E3–F♯3–A3 → D♯3–F♯3–A3', 'Change pedal on every 2nd beat as inner voices descend.'],
              ],
            ),
            chordExplorer('E', 'min', { caption: 'Measure 1\'s LH chord, E3–G3–B3, is an E Minor triad.' }),
            callout(
              'key',
              'The Pedaling Rule for Chopin',
              '<p>Never hold the pedal across a chromatic inner-voice shift. If a single note in the LH chord steps down by a half step, the pedal must clear instantly.</p>',
            ),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          text(
            'According to the Pedaling Rule for Chopin, what must the pedal do if a single note in the LH chord steps down by a half step?',
            ['clear instantly', 'clear', 'instantly clear'],
            'The step text explicitly states the Pedaling Rule for Chopin: Never hold the pedal across a chromatic inner-voice shift, and if a single note in the LH chord steps down by a half step, the pedal must clear instantly.',
          ),
          [{ assert: 'pcSet', root: 'E', semitones: [0, 3, 7], notes: ['E', 'G', 'B'] }],
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l15-3-3',
      'Contemporary Minimalist Pedaling (Einaudi / Atmospheric Style)',
      [
        step(
          'Atmospheric Pedaling and the Golden Acoustic Law',
          [
            prose(
              '<p>In contemporary ambient and film piano music, the sustain pedal is used to create an expansive, resonant soundstage. The Golden Acoustic Law governs this style: clear the pedal immediately whenever the Bass Root changes, but allow simple diatonic scalar runs within the same harmony to ring inside the pedal wash.</p>',
            ),
            callout(
              'warning',
              'Pedaling traps',
              '<p><strong>Holding the pedal through moving scalar passages in Classical music</strong> — clear the pedal immediately on scale runs to keep notes articulate. <strong>Letting the foot come off the pedal surface</strong> — the foot never leaves the pedal surface, to maintain total acoustic silence between depressions.</p>',
            ),
            sources(['Tips on how to practice piano.pdf']),
          ],
          mcq(
            'According to the Golden Acoustic Law for contemporary ambient and film piano music, what must you do whenever the Bass Root changes?',
            [
              'Hold the pedal down to create resonance',
              'Allow scalar runs to ring inside the pedal wash',
              'Clear the pedal immediately',
              'Keep the foot off the pedal surface',
            ],
            2,
            'The step text explicitly states the Golden Acoustic Law: clear the pedal immediately whenever the Bass Root changes.',
          ),
        ),
      ],
      { minutes: 8 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m15-3-ex-a',
      type: 'Diagnostic audit',
      title: 'Protocol 15.3-A — The "Dry vs. Wet" Diagnostic Audit',
      prompt: 'Play a 16-bar Romantic or Pop study completely DRY (zero pedal), ensuring the fingers execute pure physical legato and arm weight transfer. Add syncopated sustain pedaling (WET) and observe how the pedal enhances acoustic resonance without substituting for lazy finger technique. Record both takes and listen critically for harmonic bleeding.',
    },
  ],
  checkpoints: [
    'Trap Audit: verified zero heel lifting, zero stomping noise, and zero un-cleared harmonic mud during playing.',
    'Chopin Harmonic Clearing: demonstrates pedal clearing on every chromatic chord alteration in the E Minor Prelude excerpt.',
    'Acoustic Cleanliness: recording audit proves zero harmonic blur between distinct chord changes.',
  ],
});
