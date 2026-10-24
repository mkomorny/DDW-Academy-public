/**
 * Section 12.2 — Run Assistant toward that target
 * Module 12 — Audiolens
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-12-Audiolens/
 *     Lesson-12.2.1-Matching-Target-Profiles-In-Ozone-Assistant.md
 *
 * `sources` cites 'Ozone 12 user guide' — whitelisted, matching the lesson
 * file's own "iZotope Ozone 12 User Guide (Ch. 4)" citation.
 *
 * Closes Module 12 with Gate I's own self-assessment checklist text.
 */
import {
  module_, lesson, step, prose, table, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m12-2',
  code: '12.2',
  title: 'Run Assistant toward that target',
  outcomes: ['Same mix, factory genre vs custom target, written choice.'],
  sources: ['Ozone 12 user guide'],
  practiceFocus: ['Written two-sentence choice'],
  checkpoints: ['The kept target is named in the usage log'],
  lessons: [
    lesson(
      'ai-tools-music-l12-2-1',
      'Run Assistant toward that target',
      [
        step(
          'What a custom target does not carry',
          [
            table(
              ['', 'Factory genre target', 'Custom Audiolens/file target'],
              [
                ['Source', 'Multi-track aggregate curve', 'Exact single-track curve'],
                ['Tonal Balance match', 'Yes', 'Yes'],
                ['Dynamic profile match', 'Yes', 'Yes'],
                ['Vocal Balance macro', 'Active', 'Disabled'],
                ['Master Rebalance module', 'Active', 'Disabled'],
              ],
              'Factory genre targets vs custom Audiolens/file targets, per the Ozone 12 User Guide.',
            ),
            prose(
              `Factory Genre Targets are built from thousands of analyzed commercial records and provide
          statistical targets across a broad genre category — including activating the Vocal Balance
          macro and the Master Rebalance algorithm. A custom Audiolens or file target matches the exact
          spectral envelope and dynamic density of one specific reference track, but critically, it
          carries no isolated vocal stem metadata — so Ozone does <strong>not</strong> configure a Vocal
          Balance target or add Master Rebalance when a custom profile is active.`,
            ),
            sources(['Ozone 12 user guide']),
          ],
          mcq(
            'According to the Ozone 12 User Guide table, which feature is active for a Factory genre target but disabled for a Custom Audiolens/file target?',
            [
              'Tonal Balance match',
              'Dynamic profile match',
              'Vocal Balance macro',
              'Source curve type',
            ],
            2,
            'The step text\'s comparison table explicitly shows the Vocal Balance macro as Active for Factory genre targets and Disabled for Custom Audiolens/file targets.',
          ),
        ),
        step(
          'Run the matching analysis and A/B against Module 11\'s factory pass',
          [
            prose(
              `Open Ozone on the Master Track, click Master Assistant → Custom, and select your custom
          profile (<code>Custom_Course_Reference_01</code>) in the Target Library. Loop the loudest
          section of your mix, run the analysis for at least 8 seconds, and set Intensity to Balanced.
          Then engage <strong>Gain Match</strong> and audition your mix against the Factory Genre Pass
          from Module 11: does the custom profile give superior low-end translation, or does it
          introduce harsh resonance or mid-range scoops? Select the superior sonic result, turn Gain
          Match OFF, and render the final master WAV.`,
            ),
          ],
          mcq(
            'After selecting your custom profile in Ozone\'s Master Assistant on the Master Track, what must you do immediately before engaging Gain Match?',
            [
              'Loop the loudest section and run the analysis',
              'Set Intensity to Balanced',
              'Audition against the Factory Genre Pass from Module 11',
              'Turn Gain Match OFF',
            ],
            1,
            'The step text states to select the custom profile, loop the loudest section and run the analysis for at least 8 seconds, and set Intensity to Balanced, then engage Gain Match.',
          ),
        ),
        step(
          'Lab: commit a master and satisfy Gate I',
          [
            prose(
              `Master your hybrid track using both a factory genre target and a custom reference target.
          In <code>USAGE-LOG.md</code>, write a 2-sentence rationale declaring which master you
          committed and why — for example: <em>"The custom reference profile was selected because it
          delivered a tighter 40Hz sub-bass response and smoother 4kHz presence than the generic
          Electronic factory curve."</em>`,
            ),
            table(
              ['Gate I requirement', 'Evidence'],
              [
                ['Master Assistant pass calibrated against a custom target', 'Analysis log entry naming Custom_Course_Reference_01 or equivalent'],
                ['A/B evaluation with Gain Match enabled', 'Comparison against the factory genre target from Module 11'],
                ['Gain Match disabled before final render', 'Confirmed before export'],
                ['Target names, intensity, timestamps, decisions documented', 'Entries in USAGE-LOG.md'],
              ],
              'Gate I — Assistive Master Self-Assessment Checkpoint.',
            ),
          ],
          mcq(
            'According to the Gate I requirement, what must be confirmed before exporting the final master?',
            [
              'A/B evaluation with Gain Match enabled',
              'Analysis log entry naming Custom_Course_Reference_01',
              'Gain Match disabled before final render',
              'Target names and timestamps documented in USAGE-LOG.md',
            ],
            2,
            'The step text\'s Gate I table explicitly lists "Gain Match disabled before final render | Confirmed before export" as a requirement.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'Run Master Assistant against a custom target, A/B it against a factory genre pass with Gain Match, and commit a documented master.',
      },
    ),
  ],
});
