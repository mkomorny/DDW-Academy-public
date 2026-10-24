/**
 * Section 5.1 — Install, sign in, upload
 * Module 5 — Moises Desktop
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-05-Moises-Desktop/
 *     Lesson-5.1.1-Moises-Desktop-Upload-And-Separation.md
 *
 * Per this section's mustNotCover guardrail, only the free-tier models the
 * lesson file actually states (2-Track, and standard 4-Track) are named —
 * no free-tier stem count beyond that is invented.
 *
 * Moises is not an Ableton product, so none of its documentation is in
 * tools/reference/known-sources.json (the whitelist Ableton Live 12 Manual
 * citations resolve against). This section carries no sources() block for
 * that reason, same as Module 1's orientation sections — the validator
 * treats a missing sources block as a soft warning, not a failure.
 */
import {
  module_, lesson, step, prose, list, table, callout, diagram, mcq, order, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m5-1',
  code: '5.1',
  title: 'Install, sign in, upload',
  outcomes: ['Process one owned file in Moises Desktop.'],
  sources: [],
  practiceFocus: ['One owned file processed to completion'],
  checkpoints: ['Learner can find the finished job in the Desktop library'],
  lessons: [
    lesson(
      'ai-tools-music-l5-1-1',
      'Install, sign in, upload',
      [
        step(
          'Neural separation and the account-tier matrix',
          [
            prose(
              `Moises Desktop separates a mixed audio file into independent stems using deep neural
          networks trained on multi-track datasets. Which models are available depends entirely on
          the active account tier — the free tier and paid tiers do not offer the same separation
          options.`,
            ),
            table(
              ['Tier', 'Available models', 'Export format'],
              [
                ['Free', '2-Track (Vocals / Instrumental) and standard 4-Track (Vocals, Drums, Bass, Other)', 'Lossy compressed audio only'],
                ['Premium / Pro', 'Everything in Free, plus extended instrument classes — Lead Guitar, Rhythm Guitar, Acoustic Guitar, Piano, Strings, Keyboards, Backing Vocals', 'Lossless uncompressed 24-bit PCM WAV'],
              ],
              'What each account tier unlocks. Do not assume a stem class exists beyond what the active tier lists.',
            ),
            diagram(
              [
                { id: 'file', label: 'Audio file' },
                { id: 'upload', label: '+ New upload' },
                { id: 'model', label: 'Select model' },
                { id: 'cloud', label: 'Cloud inference' },
                { id: 'library', label: 'Stem library' },
              ],
              [
                { from: 'file', to: 'upload' },
                { from: 'upload', to: 'model' },
                { from: 'model', to: 'cloud' },
                { from: 'cloud', to: 'library' },
              ],
              { layout: 'chain', caption: 'Moises Desktop separation pipeline, from file to finished stem library entry.' },
            ),
          ],
          mcq(
            'Which export format is available for stems separated using the free tier in Moises Desktop?',
            [
              'Lossless uncompressed 24-bit PCM WAV',
              'Lossy compressed audio only',
              'Both lossy and lossless formats',
              'High-bitrate MP3 only',
            ],
            1,
            'The step text states that the Free tier offers Lossy compressed audio only.',
          ),
        ),
        step(
          'Uploading and configuring a separation job',
          [
            list(
              [
                'Launch Moises Desktop and confirm the login profile is active.',
                'Before uploading, confirm the source file is authorized (an owned mix, a recorded multitrack, or a licensed production stem) and record the source name and license line in <code>USAGE-LOG.md</code>.',
                'Click <strong>+ New</strong>, select <strong>Track Separation</strong>, choose <strong>Upload from Disk</strong>, and pick the source <code>.wav</code> file.',
                'Click <strong>Next</strong>, then choose a model from the list the active tier actually shows — 2-Track for a vocal/instrumental split, standard 4-Track for vocals/drums/bass/other, or an extended instrument model if the tier includes one.',
                'Click <strong>Submit</strong>. Moises uploads the audio to its processing servers and queues the job.',
                'Wait for the progress indicator to finish — the completed track then appears in the Moises library with a waveform preview.',
              ],
            ),
            callout(
              'tip',
              'Log the source before uploading, not after',
              `Recording the source name and license authorization in <code>USAGE-LOG.md</code> before
           the file leaves the computer keeps the audit trail honest — it is easy to forget once a
           finished stem set is sitting in the library and the original context has moved on.`,
            ),
          ],
          order(
            'What is the correct sequence of actions to process an owned file using Track Separation in Moises Desktop?',
            [
              'Click + New, select Track Separation, choose Upload from Disk, and pick the .wav file',
              'Click Next, then choose a model from the list the active tier shows',
              'Click Submit',
              'Log the source name and license in USAGE-LOG.md before uploading',
              'Wait for the progress indicator to finish',
            ],
            [
              'Log the source name and license in USAGE-LOG.md before uploading',
              'Click + New, select Track Separation, choose Upload from Disk, and pick the .wav file',
              'Click Next, then choose a model from the list the active tier shows',
              'Click Submit',
              'Wait for the progress indicator to finish',
            ],
            'The step text explicitly lists logging the source before uploading, then the upload and model selection steps, Submit, and finally waiting for the progress indicator, matching the required order for processing an owned file.',
          ),
        ),
        step(
          'Lab: multi-track ingestion',
          [
            list(
              [
                'Select an authorized 4-bar or 8-bar excerpt containing drums, bass, and a melodic instrument.',
                'Run a 4-Track upload in Moises Desktop and watch the job move through Uploading → Processing → Complete.',
                'Open the finished project in the Moises player and confirm all four stem channels play back cleanly.',
              ],
            ),
            prose(
              `Self-assessment: the upload was started through <strong>+ New → Track Separation</strong>;
          model availability matched the active account tier without assuming an unsupported stem
          class; and the source authorization was written into <code>USAGE-LOG.md</code> before
          processing began.`,
            ),
          ],
          multi(
            'According to the step, which of these must be confirmed or done for a successful 4-Track upload in Moises Desktop?',
            [
              'The job moved through Uploading → Processing → Complete',
              'All four stem channels play back cleanly in the Moises player',
              'The upload was started via + New → Track Separation',
              'The source authorization was written into USAGE-LOG.md before processing began',
            ],
            [0, 1, 2, 3],
            'The step text explicitly lists running the upload and watching the job states, opening the project to confirm the four stems play cleanly, and the self-assessment criteria of starting via + New → Track Separation plus writing authorization into USAGE-LOG.md.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Uploading an authorized file to Moises Desktop and reading the account-tier separation matrix correctly.',
      },
    ),
  ],
});
