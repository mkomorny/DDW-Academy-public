/**
 * Section 11.3 — Listen, A/B, then edit
 * Module 11 — Ozone Master Assistant
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-11-Ozone-Master-Assistant/
 *     Lesson-11.3.1-Critical-A-B-Auditioning-And-Module-Finishing.md
 *
 * `sources` cites 'Ozone 12 user guide' — whitelisted, matching the lesson
 * file's own "iZotope Ozone 12 User Guide" citation.
 *
 * Closes Module 11; this course has no dedicated gate at afterLevel: 11 in
 * the syllabus's own numbering (Gate H closed Module 10, Gate I opens after
 * Module 12) — Module 11 hands its learner straight into Module 12's target
 * capture work.
 */
import {
  module_, lesson, step, prose, diagram, callout, sources, mcq, order, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m11-3',
  code: '11.3',
  title: 'Listen, A/B, then edit',
  outcomes: ['Judge Assistant with Gain Match on; then make one intentional decision.'],
  sources: ['Ozone 12 user guide'],
  practiceFocus: ['Two targets on the same mix; write which you kept and why'],
  checkpoints: ['Learner can turn Intensity down after a result that harms the mix'],
  lessons: [
    lesson(
      'ai-tools-music-l11-3-1',
      'Listen, A/B, then edit',
      [
        step(
          'Why level-matched listening is mandatory',
          [
            prose(
              `Human hearing perceives louder audio as inherently clearer, fuller, and superior in
          frequency response — the Fletcher-Munson equal-loudness bias. To objectively judge whether
          Master Assistant improved or degraded a mix, you must evaluate its processing with
          <strong>Gain Match</strong> engaged, which attenuates Ozone's output to match the unmastered
          input RMS so a Global Bypass toggle compares tone and dynamics, not volume.`,
            ),
            diagram(
              [
                { id: 'gainmatch', label: 'Engage Gain Match' },
                { id: 'bypass', label: 'Toggle Global Bypass' },
                { id: 'judge', label: 'Judge at equal volume' },
                { id: 'refine', label: 'Keep or refine settings' },
                { id: 'off', label: 'Disengage before export' },
              ],
              [
                { from: 'gainmatch', to: 'bypass' },
                { from: 'bypass', to: 'judge' },
                { from: 'judge', to: 'refine' },
                { from: 'refine', to: 'off' },
              ],
              { layout: 'chain', caption: 'The level-matched critical auditioning sequence.' },
            ),
            sources(['Ozone 12 user guide']),
          ],
          order(
            'What is the correct level-matched critical auditioning sequence for judging Ozone\'s Master Assistant?',
            [
              'Engage Gain Match',
              'Toggle Global Bypass',
              'Judge at equal volume',
              'Keep or refine settings',
              'Disengage before export',
            ],
            [
              'Engage Gain Match',
              'Toggle Global Bypass',
              'Judge at equal volume',
              'Keep or refine settings',
              'Disengage before export',
            ],
            'The step text explicitly lists this exact sequence as the level-matched critical auditioning sequence to evaluate processing at equal volume using Gain Match.',
          ),
        ),
        step(
          'The Gain Match bounce trap',
          [
            callout(
              'warning',
              'The Gain Match bounce trap',
              'Gain Match must be disabled prior to exporting your final master. If Gain Match remains active during export, your rendered master will be attenuated down to unmastered reference levels, defeating the Maximizer.',
            ),
            prose(
              `Refine the Assistant View macros first — raise Vocal Balance if the vocal is buried, dial
          back Clarity or Tonal Balance intensity if the top end is harsh, raise Stabilizer if the
          sub-bass is boomy. If running Standard or Advanced, you may also switch to Module View and make
          one intentional edit directly on a generated module, but never re-select a new Target Library
          preset after making manual Module View edits — doing so completely overwrites those edits.`,
            ),
          ],
          mcq(
            'What happens if Gain Match is left active during the export of your final master?',
            [
              'The master will be louder than the reference',
              'The rendered master will be attenuated to unmastered reference levels',
              'The Maximizer will be boosted automatically',
              'Nothing; Gain Match has no effect on export',
            ],
            1,
            'The step text states that if Gain Match remains active during export, the rendered master will be attenuated down to unmastered reference levels, defeating the Maximizer.',
          ),
        ),
        step(
          'Lab: two documented adjustments, then export',
          [
            prose(
              `Take your Module 10 hybrid track. Run Master Assistant and audition with Gain Match active.
          Make two documented adjustments (for example, reduce Clarity from 50% to 25%, boost Vocal
          Balance by +1.0 dB). Listen to the entire song from start to finish to confirm quiet intros
          do not trigger Maximizer pumping. Turn Gain Match OFF, then export two bounces:
          <code>Unmastered_Mix.wav</code> and <code>Ozone_Mastered.wav</code>, and document all
          parameters in <code>USAGE-LOG.md</code>.`,
            ),
          ],
          text(
            'What two files must you export after turning Gain Match OFF?',
            ['unmastered_mix.wav and ozone_mastered.wav', 'unmastered_mix.wav, ozone_mastered.wav'],
            'The step text explicitly instructs to export two bounces: Unmastered_Mix.wav and Ozone_Mastered.wav after turning Gain Match OFF.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'Audition Master Assistant processing with Gain Match, make an intentional macro or module decision, and export correctly.',
      },
    ),
  ],
});
