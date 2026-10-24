/**
 * Section 14.3 — Job: assistive master of a human mix
 * Module 14 — Combined jobs
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-14-Combined-Jobs/
 *     Lesson-14.3.1-Workflow-C-Assistive-Mastering-Of-Original-Mix.md
 *
 * `sources` cites 'Ozone 12 user guide' and 'Ableton Live 12 Manual' — both
 * whitelisted, matching the lesson file's own citations of the Ozone 12
 * User Guide (Ch. 2, 4) and the Ableton Live 12 Reference Manual (Ch. 20).
 * The iZotope Audiolens Manual is also cited but does not resolve, same
 * treatment as Module 12.
 *
 * Closes Module 14 — and the whole AI Tools course — with Gate K's own
 * self-assessment checklist text.
 */
import {
  module_, lesson, step, prose, diagram, table, sources, mcq, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m14-3',
  code: '14.3',
  title: 'Job: assistive master of a human mix',
  outcomes: ['Run the complete Ozone-and-Audiolens assistive mastering pipeline on a 100% human or hybrid mix, and archive a pre/post pair.'],
  sources: ['Ozone 12 user guide', 'Ableton Live 12 Manual'],
  practiceFocus: ['Pre/post WAV pair in the Project'],
  checkpoints: ['Both bounces archived'],
  lessons: [
    lesson(
      'ai-tools-music-l14-3-1',
      'Job: assistive master of a human mix',
      [
        step(
          'Workflow C end to end',
          [
            diagram(
              [
                { id: 'premaster', label: 'Export pre-master' },
                { id: 'target', label: 'Capture or select target' },
                { id: 'pass', label: 'Ozone Custom pass' },
                { id: 'refine', label: 'Gain Match A/B refine' },
                { id: 'final', label: 'Export post-master' },
              ],
              [
                { from: 'premaster', to: 'target' },
                { from: 'target', to: 'pass' },
                { from: 'pass', to: 'refine' },
                { from: 'refine', to: 'final' },
              ],
              { layout: 'chain', caption: 'Workflow C: assistive mastering from an unmastered human or hybrid mix.' },
            ),
            prose(
              `Workflow C runs the complete Module 11/12 pipeline against a finished mix — human-composed,
          human-arranged, or the hybrid output of Workflows A or B. Master peaks must sit between
          -6 dBFS and -3 dBFS with zero clipping before the pre-master export, and the finished master
          must reach competitive commercial loudness without clipping at a 0.0 dBFS or -0.1 dBFS true
          peak ceiling.`,
            ),
            sources(['Ozone 12 user guide', 'Ableton Live 12 Manual']),
          ],
          mcq(
            'What must the peaks of the pre-master sit between before exporting in Workflow C?',
            ['-3 dBFS and 0 dBFS', '-6 dBFS and -3 dBFS', '-10 dBFS and -6 dBFS', '0 dBFS and +3 dBFS'],
            1,
            'The step text explicitly states that master peaks must sit between -6 dBFS and -3 dBFS with zero clipping before the pre-master export.',
          ),
        ),
        step(
          'The five-step execution procedure',
          [
            table(
              ['Step', 'Action'],
              [
                ['1. Pre-master export', 'Select the entire song; export Bounces/…_PreMaster_24bit.wav'],
                ['2. Mastering insertion', 'Insert Ozone 12 on the Master Track; open Master Assistant → Custom'],
                ['3. Analysis pass', 'Select the target curve (genre or custom Audiolens); loop the loudest chorus ≥8s; set Intensity to Balanced'],
                ['4. Critical human refinement', 'Gain Match on; toggle Global Bypass; adjust Vocal Balance or Clarity; audition the full track'],
                ['5. Master render', 'Turn Gain Match OFF; export Bounces/…_FinalMaster_24bit.wav'],
              ],
              'The five-step Workflow C execution procedure.',
            ),
            prose(
              `This is the same Gain Match discipline from Module 11.3, applied here as the final gate before
          any human or hybrid mix leaves the studio as a commercial master.`,
            ),
          ],
          order(
            'What is the correct five-step execution order for Workflow C in Ozone 12 mastering?',
            [
              'Pre-master export',
              'Mastering insertion',
              'Analysis pass',
              'Critical human refinement',
              'Master render',
            ],
            [
              'Pre-master export',
              'Mastering insertion',
              'Analysis pass',
              'Critical human refinement',
              'Master render',
            ],
            'The step text presents a numbered table that explicitly sequences the five actions as 1. Pre-master export, 2. Mastering insertion, 3. Analysis pass, 4. Critical human refinement, and 5. Master render.',
          ),
        ),
        step(
          'Lab: pre/post archive — Gate K, and the AI Tools course complete',
          [
            table(
              ['Gate K requirement', 'Evidence'],
              [
                ['Workflow A, B, and C all executed successfully', 'Rebuilt rhythm section, generative arrangement, and assistive master all present'],
                ['At least two major musical components human-composed or synthesized', 'Verified across the combined project'],
                ['Paired pre-master and post-master 24-bit linear PCM files generated', 'Both WAVs archived in the project'],
                ['USAGE-LOG.md fully completed for all three workflows', 'Verified against files on disk'],
              ],
              'Gate K — Multi-Tool Integration Self-Assessment Checkpoint.',
            ),
            prose(
              `Execute the full mastering workflow on your hybrid production piece. Verify that both
          <code>PreMaster.wav</code> and <code>FinalMaster.wav</code> reside in your project directory,
          and that the final master achieves competitive commercial loudness without clipping. Gate K
          closes not just Module 14, but the entire AI Tools for Music Production course: every
          workflow from source separation through generative composition to assistive mastering, run
          once, end to end, on one project.`,
            ),
          ],
          mcq(
            'What specific evidence is required for the Gate K requirement that "Workflow A, B, and C all executed successfully"?',
            [
              'Rebuilt rhythm section, generative arrangement, and assistive master all present',
              'Verified across the combined project',
              'Both WAVs archived in the project',
              'USAGE-LOG.md fully completed for all three workflows',
            ],
            0,
            'The step text directly lists "Rebuilt rhythm section, generative arrangement, and assistive master all present" as the evidence for the requirement that Workflow A, B, and C all executed successfully.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Run the complete assistive mastering pipeline on a human or hybrid mix and archive a documented pre/post master pair — the course\'s final gate.',
      },
    ),
  ],
});
