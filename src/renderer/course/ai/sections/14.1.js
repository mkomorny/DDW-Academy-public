/**
 * Section 14.1 — Job: rebuild drums or bass from an owned mix
 * Module 14 — Combined jobs
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-14-Combined-Jobs/
 *     Lesson-14.1.1-Workflow-A-Stem-Deconstruction-And-Rhythm-Rebuild.md
 *
 * `sources` cites 'Ableton Live 12 Manual' — whitelisted, matching the
 * lesson file's own "Ableton Live 12 Reference Manual (Ch. 9, 11, 13, 22)"
 * citation. Moises Desktop Knowledge Base is also cited but does not
 * resolve, same treatment as Module 5.
 */
import {
  module_, lesson, step, prose, diagram, table, list, sources, mcq, multi, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m14-1',
  code: '14.1',
  title: 'Job: rebuild drums or bass from an owned mix',
  outcomes: ['Coordinate separation, warp, and MIDI conversion into a fully human-programmed rhythm section.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['32 bars minimum'],
  checkpoints: ['New part is audible'],
  lessons: [
    lesson(
      'ai-tools-music-l14-1-1',
      'Job: rebuild drums or bass from an owned mix',
      [
        step(
          'Workflow A end to end',
          [
            diagram(
              [
                { id: 'source', label: 'Authorized multi-track WAV' },
                { id: 'sep', label: 'Source separation, 4 stems' },
                { id: 'warp', label: 'Warp and align in Live' },
                { id: 'convert', label: 'Convert drums to MIDI' },
                { id: 'mix', label: 'Hybrid mix and bounce' },
              ],
              [
                { from: 'source', to: 'sep' },
                { from: 'sep', to: 'warp' },
                { from: 'warp', to: 'convert' },
                { from: 'convert', to: 'mix' },
              ],
              { layout: 'chain', caption: 'Workflow A: rhythm reconstruction from an authorized multi-track source.' },
            ),
            prose(
              `This job coordinates tools you already know from Modules 5–8 into one pipeline: separate an
          authorized multi-track recording into stems, warp and align those stems to Live's master
          clock, convert the isolated drum stem to a new MIDI track, and replace it with a fully
          human-programmed rhythm section — never a straight audio bounce of the separated stem.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What is the final step in Workflow A after converting the drum stem to MIDI?',
            [
              'Bounce the separated audio stem directly',
              'Hybrid mix and bounce',
              'Warp the stems again',
              'Convert the entire mix to MIDI',
            ],
            1,
            'The step text explicitly lists the workflow as ending with "Hybrid mix and bounce" after converting drums to MIDI.',
          ),
        ),
        step(
          'Drum conversion and layered percussion',
          [
            table(
              ['Stem', 'Human replacement action'],
              [
                ['Drums.wav', 'Refine transient markers, Convert Drums to New MIDI Track, mute the original, load a custom Drum Rack'],
                ['Drums.wav (layer)', 'Insert a second MIDI track; use MIDI Tools → Euclidean for an organic 5-against-16 shaker/percussion pattern'],
                ['Bass.wav', 'Convert Melody to extract the root note progression, then play it back through Operator with a deep analog patch'],
              ],
              'The three concrete replacement actions Workflow A requires.',
            ),
            list(
              [
                'Run 4-stem separation and save outputs in Samples/Imported/Moises/.',
                'Drag the four stems into Live 12 Arrangement View at Bar 1.1.1; match master tempo.',
                'Refine transients on Drums.wav, then Convert Drums to New MIDI Track.',
                'Mute the original Drums.wav; load a custom Drum Rack; layer a Euclidean percussion track.',
                'Convert Melody on Bass.wav; play the extracted MIDI through Operator.',
                'Record every step in USAGE-LOG.md.',
              ],
            ),
          ],
          multi(
            'According to the workflow, which two concrete actions are performed specifically on the Drums.wav stem?',
            [
              'Refine transient markers',
              'Convert Drums to New MIDI Track',
              'Convert Melody to extract the root note progression',
              'Insert a second MIDI track and use Euclidean',
              'Mute the original and load a custom Drum Rack',
            ],
            [0, 1],
            'The step text\'s table explicitly lists for Drums.wav: "Refine transient markers, Convert Drums to New MIDI Track, mute the original, load a custom Drum Rack" making the first two the concrete replacement actions performed on that stem.',
          ),
        ),
        step(
          'Lab: 32-bar rhythm rebuild',
          [
            prose(
              `Complete the full 32-bar reconstruction workflow. Verify that the new drum and bass
          section is 100% human-programmed and synthesized — not a re-trigger of the separated audio.
          Save the Set and execute <strong>Collect All and Save</strong>.`,
            ),
          ],
          text(
            'What must the new drum and bass section be (not a re-trigger of the separated audio)?',
            ['100% human-programmed and synthesized', 'human-programmed and synthesized', '100% human-programmed'],
            'The step text explicitly states to verify that the new drum and bass section is 100% human-programmed and synthesized — not a re-trigger of the separated audio.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Separate, warp, convert, and rebuild the drum and bass parts of an authorized multi-track mix entirely by hand.',
      },
    ),
  ],
});
