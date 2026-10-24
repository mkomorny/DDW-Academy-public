/**
 * Section 11.2 — Custom analysis pass
 * Module 11 — Ozone Master Assistant
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-11-Ozone-Master-Assistant/
 *     Lesson-11.2.1-Custom-Target-Analysis-And-Tonal-Calibration.md
 *
 * `sources` cites 'Ozone 12 user guide' — whitelisted, matching the lesson
 * file's own "iZotope Ozone 12 User Guide (Ch. 4)" citation.
 */
import {
  module_, lesson, step, prose, callout, table, sources, mcq, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m11-2',
  code: '11.2',
  title: 'Custom analysis pass',
  outcomes: ['Run a documented analysis on the loudest section.'],
  sources: ['Ozone 12 user guide'],
  practiceFocus: ['Custom, Balanced, 16–30 s on the chorus'],
  checkpoints: ['Learner can repeat the analysis pass'],
  lessons: [
    lesson(
      'ai-tools-music-l11-2-1',
      'Custom analysis pass',
      [
        step(
          'Configure the Custom analysis pass',
          [
            table(
              ['Setting', 'What to choose'],
              [
                ['Analysis mode', 'Custom tab, not Auto-Master / One-Click'],
                ['Target Library', 'A genre target matching your composition, e.g. Electronic - EDM/House, Hip-Hop/Rap, Pop, Rock'],
                ['Module checklist', 'Check Equalizer, Stabilizer, Clarity, Maximizer; uncheck Imager to preserve your own stereo width'],
              ],
              'Custom Master Assistant configuration before running the analysis pass.',
            ),
            prose(
              `Position the Ableton Live playback transport at the <strong>loudest section</strong> of your
          song — typically the chorus or main drop — and set an arrangement loop brace of at least 8 to
          16 bars, which must exceed 8 seconds of continuous playback (Custom analysis can analyze up to
          60 seconds). Click <strong>Start Analysis</strong> in Ozone, or hit play in Live, and let the
          loop run until Ozone indicates the analysis is complete.`,
            ),
            sources(['Ozone 12 user guide']),
          ],
          mcq(
            'What should you select for Analysis mode in the Custom Master Assistant?',
            ['Auto-Master', 'One-Click', 'Custom tab', 'Target Library'],
            2,
            'The step text states to choose Custom tab, not Auto-Master / One-Click for Analysis mode.',
          ),
        ),
        step(
          'The Intensity invariant',
          [
            table(
              ['Intensity level', 'Effect'],
              [
                ['Subtle', 'Gentle spectral adjustments (±1.5 dB corrective EQ)'],
                ['Transparent', 'Clean, minimal phase alteration'],
                ['Balanced (default)', 'Standard industry mastering curve adherence'],
                ['Bold', 'Aggressive transient enhancement and tonal reshaping'],
                ['Transformative', 'Maximum spectral rebalancing'],
              ],
              'The five Processing Intensity profiles, from Subtle to Transformative.',
            ),
            callout(
              'warning',
              'The Intensity invariant',
              'Adjusting the Intensity profile (Subtle → Transformative) scales the processing depth of Equalizer, Dynamic EQ, Stabilizer, Clarity, and Imager. <strong>Intensity does NOT adjust Master Loudness or Maximizer Threshold.</strong> Master loudness is controlled strictly via the independent Loudness slider.',
            ),
          ],
          mcq(
            'Which processing modules have their depth scaled when changing the Intensity profile from Subtle to Transformative?',
            [
              'Equalizer, Dynamic EQ, Stabilizer, Clarity, and Imager',
              'Master Loudness and Maximizer Threshold',
              'Loudness slider and Master Loudness',
              'All modules including Maximizer Threshold',
            ],
            0,
            'The step text states that adjusting the Intensity profile scales the processing depth of Equalizer, Dynamic EQ, Stabilizer, Clarity, and Imager.',
          ),
        ),
        step(
          'Lab: run a documented Custom analysis',
          [
            prose(
              `Run a Custom Master Assistant analysis on the chorus of your Module 10 hybrid track using
          the Electronic target at Balanced intensity. In <code>USAGE-LOG.md</code>, record the exact
          analysis timestamp and duration (e.g. Bars 25–41 / 32 seconds), the selected Genre Target, and
          the chosen Intensity setting.`,
            ),
          ],
          text(
            'What are the exact Genre Target and Intensity setting to use for the Custom Master Assistant analysis?',
            ['electronic', 'balanced', 'electronic at balanced', 'electronic, balanced'],
            'The step text explicitly instructs to use the Electronic target at Balanced intensity for the analysis on the chorus.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'Run a Custom Master Assistant analysis pass on the loudest section of a mix and understand what Intensity does and does not control.',
      },
    ),
  ],
});
