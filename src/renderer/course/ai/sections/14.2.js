/**
 * Section 14.2 — Job: generated seed, human arrangement
 * Module 14 — Combined jobs
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-14-Combined-Jobs/
 *     Lesson-14.2.1-Workflow-B-Prompt-Generated-Seed-To-Arrangement.md
 *
 * `sources` cites 'Ableton Live 12 Manual' — whitelisted, matching the
 * lesson file's own "Ableton Live 12 Reference Manual (Ch. 6, 11, 13, 18)"
 * citation. Suno Help Center & Terms is also cited but does not resolve,
 * same treatment as Module 10.
 */
import {
  module_, lesson, step, prose, diagram, table, sources, mcq, multi, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m14-2',
  code: '14.2',
  title: 'Job: generated seed, human arrangement',
  outcomes: ['Coordinate LLM prompt curation, Suno generation, and dual native-instrument replacement into one full arrangement.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Full song or a complete 16-bar section with intro/outro'],
  checkpoints: ['Description updated'],
  lessons: [
    lesson(
      'ai-tools-music-l14-2-1',
      'Job: generated seed, human arrangement',
      [
        step(
          'Workflow B end to end',
          [
            diagram(
              [
                { id: 'prompt', label: 'Curate prompt (Module 9)' },
                { id: 'gen', label: 'Suno generation (Module 10)' },
                { id: 'stems', label: 'Separate and ingest' },
                { id: 'replace', label: 'Replace 2 parts' },
                { id: 'arrange', label: 'Expand and mix' },
              ],
              [
                { from: 'prompt', to: 'gen' },
                { from: 'gen', to: 'stems' },
                { from: 'stems', to: 'replace' },
                { from: 'replace', to: 'arrange' },
              ],
              { layout: 'chain', caption: 'Workflow B chains Module 9\'s prompting, Module 10\'s generation, and Module 8\'s stem/MIDI tools.' },
            ),
            prose(
              `Workflow B is the job that chains everything from Modules 9, 10, and 8 in sequence: curate
          a Claude/Grok/Gemini prompt kit, generate in Suno's Custom Mode, deconstruct the seed into
          stems, and replace <strong>at least two</strong> major musical parts with native Live
          instruments — a higher bar than Module 10's single-part minimum.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What is the correct sequence of steps in Workflow B?',
            [
              'Curate prompt -> Suno generation -> Separate and ingest -> Replace 2 parts -> Expand and mix',
              'Suno generation -> Curate prompt -> Replace 2 parts -> Separate and ingest -> Expand and mix',
              'Replace 2 parts -> Curate prompt -> Suno generation -> Separate and ingest -> Expand and mix',
              'Expand and mix -> Separate and ingest -> Curate prompt -> Suno generation -> Replace 2 parts',
            ],
            0,
            'The step text explicitly lists the Workflow B sequence as: Curate prompt (Module 9) -> Suno generation (Module 10) -> Separate and ingest -> Replace 2 parts -> Expand and mix.',
          ),
        ),
        step(
          'The two mandatory replacements',
          [
            table(
              ['Part', 'Replacement procedure'],
              [
                ['Percussion', 'Mute the Suno drum stem; program an entirely new arrangement combining a 4-on-the-floor kick sequence in a Drum Rack with algorithmic hats via MIDI Tools → Rhythm'],
                ['Harmonic / Bass', 'Mute the Suno bass stem; run Convert Melody and route the extracted MIDI into Operator configured with a dual-oscillator FM bass patch'],
              ],
              'Workflow B\'s two mandatory dual-part replacements.',
            ),
            prose(
              `Arrange the piece across at least 64 bars (or a fully realized 32-bar section with distinct
          intro, drop, and outro transitions), adding volume, filter cutoff, and reverb send automation
          sweeps across the transition points. Record the prompt, download format, replaced parts, and
          an authorship statement in <code>USAGE-LOG.md</code>.`,
            ),
          ],
          multi(
            'Which two stems from the Suno generation must be muted as part of Workflow B\'s mandatory dual-part replacements?',
            [
              'Percussion and Harmonic/Bass',
              'Percussion and Melody',
              'Bass and Vocal',
              'Melody and Harmonic',
            ],
            [0],
            'The step text explicitly lists the two mandatory replacements as Percussion (mute the Suno drum stem) and Harmonic/Bass (mute the Suno bass stem).',
          ),
        ),
        step(
          'Lab: 64-bar hybrid composition',
          [
            prose(
              `Execute the full generative-seed-to-arrangement pipeline. Ensure at least two core musical
          instruments are 100% human-programmed or performed in Live. Save the Set and execute
          <strong>Collect All and Save</strong>.`,
            ),
          ],
          text(
            'What is the minimum number of core musical instruments that must be 100% human-programmed or performed in Live?',
            ['two', '2'],
            'The step text explicitly states to ensure at least two core musical instruments are 100% human-programmed or performed in Live.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Chain curated prompting, Suno generation, and dual native-instrument replacement into one full 64-bar arrangement.',
      },
    ),
  ],
});
