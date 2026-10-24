/**
 * Section 6.2 — Choose Moises vs Spleeter vs Live for the next job
 * Module 6 — SpleeterGUI
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-06-SpleeterGUI/
 *     Lesson-6.2.1-Separator-Selection-Matrix.md
 *
 * Per this section's mustNotCover guardrail, the decision matrix is
 * presented as a set of objective, system-constraint-driven rules — no
 * tool is ever called "the best separator"; each row states a specific
 * constraint (edition, OS, offline requirement, specific-instrument need)
 * and the tool that constraint actually points to.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the one row
 * of the decision matrix and the one downstream-routing claim that concern
 * Live 12.3 Suite's own native Separate Stems feature (§22.2, per the
 * lesson file's own citation) — the rest of the matrix concerns
 * Moises/Spleeter, which stay uncited for the same reason as Module 5/6.1.
 */
import {
  module_, lesson, step, prose, table, diagram, list, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m6-2',
  code: '6.2',
  title: 'Choose Moises vs Spleeter vs Live for the next job',
  outcomes: ['Pick a separator from the edition/OS you have, not from a brand ranking.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Four-row table for this studio: job, tool, why'],
  checkpoints: ['Learner picks a path for "Standard + this OS" without hesitation'],
  lessons: [
    lesson(
      'ai-tools-music-l6-2-1',
      'Choose Moises vs Spleeter vs Live for the next job',
      [
        step(
          'A decision matrix, not a ranking',
          [
            prose(
              `There is no universally "best" stem separator — the right tool is whichever one the
          learner's actual edition, operating system, and job constraints point to. Live 12
          Standard has no native stem separation at all; only Live 12.3 Suite adds an in-DAW
          <strong>Separate Stems</strong> command.`,
            ),
            table(
              ['Constraint / objective', 'Primary tool', 'Secondary fallback', 'Why'],
              [
                ['Live 12 Standard, Windows or macOS', 'Moises Desktop', 'SpleeterGUI (Windows only)', 'Standard has no native separation; Moises works on both platforms with extended instrument classes'],
                ['Offline / local, Windows, no cloud', 'SpleeterGUI', 'Live 12.3 Suite (if owned)', 'Fully offline, no account or subscription required, fast local processing'],
                ['Live 12.3 Suite installed', 'Live’s own Separate Stems', 'Moises Desktop', 'Non-destructive, instantaneous, preserves in-session automation and device chains'],
                ['A specific instrument (guitar, strings)', 'Moises Desktop (paid tier)', 'Spleeter 5-Stem (piano only)', 'Spleeter and Live 12.3 are locked to 4 or 5 fixed stems; only Moises offers multi-instrument models'],
                ['Fast drum replacement', 'Any 4-stem model', '2-track (Vocals/Accompaniment)', 'Isolating the drum stem removes spurious bass/vocal triggers during Convert Drums'],
              ],
              'An objective, constraint-driven decision matrix — read down to the row matching the current job, not up to a favorite brand.',
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the decision matrix, what is the primary tool recommended for a user who has Live 12.3 Suite installed?',
            [
              'Moises Desktop',
              'SpleeterGUI',
              "Live's own Separate Stems",
              'Spleeter 5-Stem',
            ],
            2,
            'The matrix explicitly lists "Live 12.3 Suite installed" with primary tool "Live\'s own Separate Stems" because it is non-destructive, instantaneous, and preserves in-session automation and device chains.',
          ),
        ),
        step(
          'Routing separated stems to the right Live feature',
          [
            diagram(
              [
                { id: 'drum', label: 'Drum stem', row: 0, col: 0 },
                { id: 'convertdrums', label: 'Convert Drums / Slice', row: 0, col: 1 },
                { id: 'bass', label: 'Bass stem', row: 1, col: 0 },
                { id: 'convertmelody', label: 'Convert Melody', row: 1, col: 1 },
                { id: 'vocal', label: 'Vocal stem', row: 2, col: 0 },
                { id: 'convertmelody2', label: 'Melody or direct tune', row: 2, col: 1 },
                { id: 'other', label: 'Other stem', row: 3, col: 0 },
                { id: 'convertharmony', label: 'Convert Harmony', row: 3, col: 1 },
              ],
              [
                { from: 'drum', to: 'convertdrums' },
                { from: 'bass', to: 'convertmelody' },
                { from: 'vocal', to: 'convertmelody2' },
                { from: 'other', to: 'convertharmony' },
              ],
              { layout: 'grid', caption: 'Which Live conversion tool each separated stem type routes to.' },
            ),
            prose(
              `The drum stem feeds either <strong>Convert Drums to New MIDI Track</strong> or, for a
          transient-only rebuild, <strong>Slice to New MIDI Track</strong>. The bass stem feeds
          <strong>Convert Melody</strong>, typically to be re-synthesized with Operator. The vocal
          stem also feeds Convert Melody for the lead line, or stays as direct audio for tuning.
          The <strong>Other</strong> stem — the catch-all bucket of guitars, synths, and FX — feeds
          <strong>Convert Harmony</strong> or gets resampled/granulated as raw texture.`,
            ),
          ],
          mcq(
            'According to the Live conversion routing, which stem type typically feeds Convert Melody to be re-synthesized with Operator?',
            [
              'Drum stem',
              'Bass stem',
              'Vocal stem',
              'Other stem',
            ],
            1,
            'The step text states that the bass stem feeds Convert Melody, typically to be re-synthesized with Operator.',
          ),
        ),
        step(
          'Lab: triage strategy, and Gate E',
          [
            list(
              [
                'Scenario 1 — Windows laptop, no internet, need to isolate a bassline: SpleeterGUI, 4 Stems, export to <code>Samples/Imported/Spleeter</code>, import <code>Bass.wav</code> to Live, run Convert Melody.',
                'Scenario 2 — macOS, Live 12 Standard, need lead vocal and acoustic guitar isolated: Moises Desktop, Hi-Fi Track Separation (Vocals/Acoustic Guitar/Other), export 24-bit WAVs to <code>Samples/Imported/Moises</code>.',
                'Scenario 3 — Live 12.3 Suite, need to quickly replace kick and snare on a 4-bar chorus: crop the time selection in Arrangement, run Separate Stems for Time Selection, then Convert Drums on the resulting drum stem.',
              ],
            ),
            prose(
              `Write a one-sentence technical directive for each scenario in the session notes.
          <strong>Gate E — Local 2/4/5 path</strong> closes this module: the stem components for
          2-stem, 4-stem, and 5-stem models can be recited from memory; a 4-stem separation (via
          SpleeterGUI or Moises) has been imported into Live; Deezer's license disclaimer is
          embedded in <code>USAGE-LOG.md</code>; and the right separator can be picked from host
          edition and OS without hesitation.`,
            ),
          ],
          mcq(
            'Which tool and settings are specified for isolating a bassline on a Windows laptop with no internet?',
            [
              'Moises Desktop with Hi-Fi Track Separation',
              'SpleeterGUI with 4 Stems',
              'Separate Stems for Time Selection',
              'Convert Melody on full track',
            ],
            1,
            'The step text explicitly states for Scenario 1 (Windows laptop, no internet, isolate bassline): SpleeterGUI, 4 Stems.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'An objective decision matrix for choosing a stem separator, downstream routing to Live’s conversion tools, and Gate E.',
      },
    ),
  ],
});
