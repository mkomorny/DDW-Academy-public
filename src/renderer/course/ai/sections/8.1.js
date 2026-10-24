/**
 * Section 8.1 — Warp, then Convert
 * Module 8 — Use stems and MIDI in Live
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-08-Stems-And-MIDI-In-Live/
 *     Lesson-8.1.1-Stem-Warping-And-Transient-Alignment.md
 *
 * Per this section's mustNotCover guardrail, only the three Warp Modes the
 * lesson file actually names (Beats, Tones, Complex Pro) are taught — no
 * full warp-mode encyclopedia (Repitch, Texture, etc. are never mentioned).
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for Ch. 9 (Audio
 * Clips, Tempo, and Warping) and §13.5 (Conversion Timing), matching the
 * lesson file's own citation exactly.
 */
import {
  module_, lesson, step, prose, table, diagram, list, sources, mcq, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m8-1',
  code: '8.1',
  title: 'Warp, then Convert',
  outcomes: ['Warp imported stems to the Set. Then Convert.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Melody + Drums from Moises or Spleeter stems'],
  checkpoints: ['Side-by-side: full-mix Convert vs stem Convert, two sentences'],
  lessons: [
    lesson(
      'ai-tools-music-l8-1-1',
      'Warp, then Convert',
      [
        step(
          'Why order matters: Warp before Convert',
          [
            prose(
              `Running <strong>Convert Melody</strong> or <strong>Convert Drums</strong> on an un-warped
          stem recorded at a fluctuating tempo produces asynchronous, off-grid MIDI events that need
          extensive manual editing to fix. The fix is a strict order of operations: warp the stem to
          the Set's tempo first, refine its transient markers second, and only then run a Convert
          command.`,
            ),
            diagram(
              [
                { id: 'raw', label: 'Raw separated stems' },
                { id: 'warp', label: 'Warp to Set tempo' },
                { id: 'refine', label: 'Refine transient markers' },
                { id: 'convert', label: 'Convert to MIDI' },
              ],
              [
                { from: 'raw', to: 'warp' },
                { from: 'warp', to: 'refine' },
                { from: 'refine', to: 'convert' },
              ],
              { layout: 'chain', caption: 'The mandatory Warp → Transient Refine → Convert order of operations.' },
            ),
            table(
              ['Stem type', 'Warp Mode', 'Why'],
              [
                ['Drums', 'Beats', 'Preserves crisp transient attacks without granular smearing; set Preserve to Transients'],
                ['Bass (monophonic)', 'Tones (or Complex Pro)', 'Optimized for clear monophonic pitch contours'],
                ['Vocals / Others (polyphonic)', 'Complex Pro', 'Preserves polyphonic formant relationships and spectral width'],
              ],
              'Warp Mode selection by stem frequency and transient character.',
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          order(
            "What is the mandatory order of operations when preparing an un-warped stem recorded at a fluctuating tempo before running a Convert command?",
            [
              'Refine transient markers',
              "Warp the stem to the Set's tempo",
              'Run a Convert command',
            ],
            [
              "Warp the stem to the Set's tempo",
              'Refine transient markers',
              'Run a Convert command',
            ],
            "The step text explicitly states the fix is a strict order: warp the stem to the Set's tempo first, refine its transient markers second, and only then run a Convert command.",
          ),
        ),
        step(
          'Aligning the downbeat and refining transient markers',
          [
            list(
              [
                'Import the four separated stems (Drums, Bass, Vocals, Others) into Arrangement View starting at Bar 1.',
                'Select the Drums clip: verify Warp is enabled, set Warp Mode to Beats, set Preserve to Transients, and select Forward Loop / No Loop marker mode.',
                'Select the Bass clip: set Warp Mode to Tones (or Complex Pro).',
                'Select the Vocals and Others clips: set Warp Mode to Complex Pro on both.',
                'Zoom into the Drums clip and inspect the transient markers along the top of the sample display: delete any markers sitting in the tail decay of open hi-hats.',
                'Right-click the Drums clip and select Convert Drums to New MIDI Track — because the audio was warped and transient-aligned first, the generated MIDI events snap precisely to the project metric grid.',
              ],
            ),
            prose(
              `For the Bass stem, right-click and select <strong>Convert Melody to New MIDI Track</strong>,
          then replace the preloaded synth rack with <strong>Operator</strong> in the new MIDI track.
          For the Others stem (guitars or keyboards), right-click and select
          <strong>Convert Harmony to New MIDI Track</strong>, then replace the preloaded piano rack
          with a rich synth pad in Operator.`,
            ),
          ],
          mcq(
            'After importing the four stems and before converting the Drums clip to MIDI, what three settings must be applied to the Drums clip?',
            [
              'Enable Warp, set to Beats mode, Preserve Transients, Forward Loop marker',
              'Enable Warp, set to Tones mode, Preserve Transients, No Loop marker',
              'Set Warp to Complex Pro, delete transients, then convert',
              'Enable Warp, set to Beats mode, then immediately convert without Preserve setting',
            ],
            0,
            'The step text explicitly states: Select the Drums clip: verify Warp is enabled, set Warp Mode to Beats, set Preserve to Transients, and select Forward Loop / No Loop marker mode.',
          ),
        ),
        step(
          'Lab: multi-stem reconstruction',
          [
            list(
              [
                'Import an authorized 4-stem separation set.',
                'Warp all four stems to the Set tempo, using the appropriate Warp Mode for each stem type.',
                'Refine each stem\'s transient markers, deleting spurious markers in decay tails.',
                'Convert the Drum stem to a Drum Rack, the Bass stem to Melody MIDI (Operator), and the Others stem to Harmony MIDI.',
                'Mute the original audio stems and play back the entire reconstructed MIDI arrangement.',
              ],
            ),
            prose(
              `Self-assessment: each stem was warped, then had its transient markers refined, and only
          then was it converted — the appropriate Warp Mode was configured for each stem type (Beats
          for drums, Complex Pro for vocals/polyphony); and the resulting MIDI clips are grid-aligned
          when compared against the muted original audio.`,
            ),
          ],
          order(
            'What is the correct sequence of actions when processing each imported stem?',
            [
              'Warp the stem to the Set tempo using the appropriate Warp Mode',
              "Refine the stem's transient markers (deleting spurious ones in decay tails)",
              'Convert the stem (Drums to Drum Rack, Bass to Melody MIDI, Others to Harmony MIDI)',
            ],
            [
              'Warp the stem to the Set tempo using the appropriate Warp Mode',
              "Refine the stem's transient markers (deleting spurious ones in decay tails)",
              'Convert the stem (Drums to Drum Rack, Bass to Melody MIDI, Others to Harmony MIDI)',
            ],
            'The step text and self-assessment both state that each stem was warped, then had its transient markers refined, and only then was it converted.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'The mandatory Warp-First, Convert-Second order of operations for turning separated stems into grid-aligned MIDI.',
      },
    ),
  ],
});
