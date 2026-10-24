/**
 * Section 10.3 — Finish it in Live
 * Module 10 — Suno
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-10-Suno/
 *     Lesson-10.3.1-Hybrid-Composition-Finishing-Suno-In-Live.md
 *
 * No sources() block: the lesson cites Suno's Terms of Service/IP
 * documentation and U.S. Copyright Office AI guidance, neither of which
 * resolves against known-sources.json.
 *
 * Closes Module 10 with Gate H's own self-assessment checklist text.
 */
import {
  module_, lesson, step, prose, diagram, list, table, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m10-3',
  code: '10.3',
  title: 'Finish it in Live',
  outcomes: ['Replace or rewrite enough that you can describe what you did.'],
  sources: [],
  practiceFocus: ['8 bars minimum of audible human change'],
  checkpoints: ['Live Set is no longer the raw download'],
  lessons: [
    lesson(
      'ai-tools-music-l10-3-1',
      'Finish it in Live',
      [
        step(
          'The generative seed doctrine',
          [
            prose(
              `Modern intellectual property standards and music production integrity demand that
          AI-generated audio serve as raw compositional material rather than an end-product. This
          section turns a raw Suno seed into a <strong>Hybrid Composition</strong>: at least one major
          musical element replaced with something human-programmed, sampled, or performed.`,
            ),
            diagram(
              [
                { id: 'seed', label: 'Raw Suno seed' },
                { id: 'split', label: 'Deconstruct into stems' },
                { id: 'replace', label: 'Replace with human part' },
                { id: 'mix', label: 'Restructure and mix' },
                { id: 'declare', label: 'Write provenance note' },
              ],
              [
                { from: 'seed', to: 'split' },
                { from: 'split', to: 'replace' },
                { from: 'replace', to: 'mix' },
                { from: 'mix', to: 'declare' },
              ],
              { layout: 'chain', caption: 'The hybrid finishing pipeline: deconstruct, replace, restructure, declare.' },
            ),
          ],
          mcq(
            'According to the hybrid finishing pipeline, what is the immediate step after deconstructing a raw Suno seed into stems and sections?',
            [
              'Replace an element with human authorship',
              'Restructure and mix',
              'Write the provenance statement',
              'Declare the hybrid composition',
            ],
            0,
            'The step text explicitly lists the pipeline as: deconstruct, replace, restructure, declare, and states "Raw Suno seed -> Deconstruct into stems + sections -> Replace an element with human authorship -> Restructure and mix -> Write the provenance statement".',
          ),
        ),
        step(
          'Slice the arrangement and replace an element',
          [
            list(
              [
                'Place the warped Suno audio into Arrangement View and identify distinct song sections.',
                'Split the clip at section boundaries (Ctrl+E on Windows, Cmd+E on macOS).',
                'Separate the seed into stems via Moises Desktop or Suno Multitrack.',
                'Mute the Suno drum stem; replace it with a Drum Rack, using Convert Drums or MIDI Tools → Rhythm.',
                'Mute the Suno bass stem; replace it with Operator, using Convert Melody to extract the root progression first.',
              ],
            ),
            table(
              ['Remaining generative stem', 'Human mixing move'],
              [
                ['Vocal / texture stem', 'High-pass at 120 Hz to clear muddy low-end clutter'],
                ['Vocal / texture stem', 'Notch harsh resonance peaks in the 2.5–4.5 kHz range'],
                ['Vocal / texture stem', 'Add Chorus-Ensemble or Hybrid Reverb for spatial depth'],
              ],
              'Mixing moves applied to whatever generative stem remains after replacement.',
            ),
          ],
          multi(
            'According to the table in the step text, which two mixing moves are applied to the remaining vocal or texture stem?',
            [
              'High-pass at 120 Hz to clear muddy low-end clutter',
              'Notch harsh resonance peaks in the 2.5–4.5 kHz range',
              'Mute the Suno drum stem',
              'Add Chorus-Ensemble or Hybrid Reverb for spatial depth',
              'Replace it with a Drum Rack',
            ],
            [0, 3],
            'The step text\'s table explicitly lists high-pass at 120 Hz, notch in the 2.5–4.5 kHz range, and add Chorus-Ensemble or Hybrid Reverb as the mixing moves for the vocal/texture stem.',
          ),
        ),
        step(
          'Lab: write the two-sentence provenance statement — Gate H',
          [
            prose(
              `In <code>USAGE-LOG.md</code>, write a two-sentence provenance declaration modeled on:
          <em>"Suno (Pro Tier) was utilized to generate a 32-bar melodic textural seed from custom
          prompt text. In Ableton Live 12, the author restructured the arrangement into a 64-bar
          composition, replaced all drum and bass parts with native Drum Rack and Operator synthesis,
          and performed final equalization and spatial mixing."</em>`,
            ),
            list(
              [
                'At least one Suno audio file is successfully imported and warped into an active Live 12 Set.',
                'Active subscription plan tier and downloaded file format (WAV or MP3) are logged in USAGE-LOG.md.',
                'At least one major musical component has been replaced with human-programmed synthesis or live performance.',
                'A compliant two-sentence Human Authorship Statement is recorded in the project documentation.',
              ],
            ),
          ],
          mcq(
            'What is the required length and structure of the provenance declaration to write in USAGE-LOG.md?',
            [
              'A single sentence about using Suno and Ableton',
              'A two-sentence declaration modeled on the given Suno-to-Ableton example',
              'A three-sentence statement describing only the mixing process',
              'Any length as long as it mentions an active subscription',
            ],
            1,
            'The step text explicitly instructs to write a two-sentence provenance declaration modeled on the provided example about Suno and Ableton Live 12.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'Deconstruct a raw Suno seed, replace at least one major element with human authorship, and record a compliant provenance statement.',
      },
    ),
  ],
});
