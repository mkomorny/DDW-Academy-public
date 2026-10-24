/**
 * Section 8.3 — Bounce without deleting sources
 * Module 8 — Use stems and MIDI in Live
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-08-Stems-And-MIDI-In-Live/
 *     Lesson-8.3.1-Non-Destructive-Bouncing-And-Stem-Archiving.md
 *
 * Per this section's mustNotCover guardrail, both bounce commands are kept
 * explicitly version-gated in the prose (Bounce to New Track needs Live
 * 12.2+, Bounce Group to New Track needs Live 12.3+) rather than assumed
 * present on every install.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for Ch. 20
 * (Bounce to Audio) and Ch. 5 (Managing Files and Sets), matching the
 * lesson file's own citation. This section also closes Module 8 with
 * Gate F's own self-assessment text.
 */
import {
  module_, lesson, step, prose, table, diagram, list, sources, callout, mcq, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m8-3',
  code: '8.3',
  title: 'Bounce without deleting sources',
  outcomes: ['Print a processed stem or group and keep the raw files.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Bounce a processed vocal stem; archive both'],
  checkpoints: ['Project contains both files'],
  lessons: [
    lesson(
      'ai-tools-music-l8-3-1',
      'Bounce without deleting sources',
      [
        step(
          'Non-destructive bouncing, version by version',
          [
            prose(
              `When finalizing a hybrid mix of AI stems and native Live instruments, rendering
          intermediate processing (EQ, compression, spatial effects) to a clean linear audio track
          improves playback stability and locks in the sound design — without deleting the source
          material behind it. <strong>Bounce to New Track</strong> requires Live 12.2 or later;
          <strong>Bounce Group to New Track</strong> requires Live 12.3 or later — check the
          installed version before relying on either command.`,
            ),
            diagram(
              [
                { id: 'track', label: 'Processed track' },
                { id: 'bounce', label: 'Bounce to New Track' },
                { id: 'orig', label: 'Original — deactivated' },
                { id: 'new', label: 'New bounced audio track' },
              ],
              [
                { from: 'track', to: 'bounce' },
                { from: 'bounce', to: 'orig' },
                { from: 'bounce', to: 'new' },
              ],
              { layout: 'chain', caption: 'Bouncing a track keeps the original device chain intact and deactivated, alongside a new rendered audio track.' },
            ),
            callout(
              'warning',
              'Never delete raw stems',
              `Do not use the destructive <strong>Flatten</strong> command without a safety backup of the
          MIDI and device chains. Bouncing to a <em>new</em> track keeps the option open to revisit
          synthesizer parameters or re-extract MIDI later if the arrangement changes.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What does the Bounce to New Track command do to the original track when finalizing a hybrid mix?',
            [
              'Deletes the original track and its device chain',
              'Deactivates the original track but keeps its device chain intact',
              'Flattens the original track into a destructive audio file',
              'Activates a new MIDI track while removing the audio',
            ],
            1,
            'The step text states that bouncing keeps the original device chain intact and deactivated, alongside a new rendered audio track.',
          ),
        ),
        step(
          'Bouncing tracks and groups, then verifying the archive',
          [
            list(
              [
                'Select the track header for the processed hybrid instrument or vocal stem.',
                'Right-click the track header and select Bounce to New Track. Live renders the track output — including active insert devices and volume automation — onto a new adjacent audio track named "[TrackName] [Bounced]".',
                'Select the original parent track and press 0 to deactivate it, freeing CPU while preserving the instrument patch.',
                'Multi-select the replacement drum tracks (Kick, Snare, Hats, Percussion) and press Ctrl+G (Win) / Cmd+G (Mac) to group them.',
                'Right-click the group header and select Bounce Group to New Track — Live renders the summed bus output onto a single stereo audio track.',
                'In the OS file browser, confirm the raw external stems are still in Samples/Imported/Moises/ or Samples/Imported/Spleeter/, and the newly bounced stems are in Samples/Processed/.',
                'In Ableton Live, run File → Collect All and Save, then update USAGE-LOG.md with the filenames of both the raw imports and the bounced renders.',
              ],
            ),
            table(
              ['Location', 'Contents'],
              [
                ['Samples/Imported/Moises/ or Samples/Imported/Spleeter/', 'Raw external AI-separated stems, untouched'],
                ['Samples/Processed/', 'Newly bounced, processed audio renders'],
              ],
              'Where each category of audio lives after archiving verification.',
            ),
          ],
          text(
            'Where are the newly bounced, processed audio renders stored after archiving?',
            ['samples/processed/', 'samples/processed'],
            'The step text\'s table explicitly states that Samples/Processed/ contains the newly bounced, processed audio renders.',
          ),
        ),
        step(
          'Lab, and Gate F — Stems in Live self-assessment',
          [
            list(
              [
                'Take the 16-bar hybrid production session from Section 8.2.',
                'Execute Bounce to New Track on the replacement Operator bass track and the processed vocal track.',
                'Execute Bounce Group to New Track on the Drum Rack group.',
                'Verify the project contains both the active bounced audio tracks and the deactivated source tracks.',
                'Save the Live Set.',
              ],
            ),
            prose(
              `<strong>Gate F — Stems in Live</strong> closes this module. To certify: at least one
          multi-stem project is fully configured and aligned in Live 12; the strict
          Warp → Transient Refine → Convert to MIDI sequence was executed; at least one stem part
          was replaced with a native Live instrument driven by extracted or human-composed MIDI; a
          non-destructive bounce was performed, preserving both raw stems and processed audio in the
          project container; and full source authorization and provenance is documented in
          USAGE-LOG.md.`,
            ),
          ],
          mcq(
            'What should you verify after performing the bounces in the 16-bar hybrid production session?',
            [
              'That only the new bounced audio tracks are present',
              'That the project contains both the active bounced audio tracks and the deactivated source tracks',
              'That all source tracks have been deleted',
              'That the bounced tracks are all grouped together',
            ],
            1,
            'The step text explicitly states to verify that the project contains both the active bounced audio tracks and the deactivated source tracks.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Rendering processed hybrid tracks non-destructively, verifying the archive structure, and Gate F.',
      },
    ),
  ],
});
