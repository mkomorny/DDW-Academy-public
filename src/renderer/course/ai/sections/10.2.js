/**
 * Section 10.2 — Download and import
 * Module 10 — Suno
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-10-Suno/
 *     Lesson-10.2.1-Suno-Stem-And-Full-Mix-Export-Hygiene.md
 *
 * No sources() block: the lesson cites Suno's own Help Center articles,
 * which do not resolve against known-sources.json (same treatment as 10.1).
 * The lesson also cites the Ableton Live 12 Reference Manual for the warp/
 * import steps, but those steps are general Live mechanics already covered
 * with a real citation in Module 2/8 — this section does not repeat it.
 */
import {
  module_, lesson, step, prose, table, list, callout, mcq, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m10-2',
  code: '10.2',
  title: 'Download and import',
  outcomes: ['Get the file onto disk and into the Project.'],
  sources: [],
  practiceFocus: ['One download in the Project folder, playing in Live'],
  checkpoints: ['File path matches the usage log'],
  lessons: [
    lesson(
      'ai-tools-music-l10-2-1',
      'Download and import',
      [
        step(
          'Format gates by account tier',
          [
            table(
              ['Tier', 'Audio format', 'Stems'],
              [
                ['Pro / Premier', 'WAV (lossless)', 'Multitrack Stems (WAV ZIP), when supported on Studio tiers'],
                ['Basic / Free', 'MP3 (192kbps lossy)', 'Not available'],
              ],
              'Suno download format is gated by the active subscription tier, not by a menu choice.',
            ),
            prose(
              `In the Suno web client's Library, click the triple-dot menu <strong>(...)</strong> next to a
          song, hover <strong>Download</strong>, and the format offered — WAV or MP3 — follows directly
          from your account tier. Batch downloads (Ctrl+click on Windows, Cmd+click on macOS, then
          Download All) produce a compiled .zip of whichever format your tier grants.`,
            ),
          ],
          mcq(
            'What determines whether Suno offers a WAV or MP3 download?',
            [
              'The Download menu choice',
              'Your active subscription tier',
              "The song's genre",
              'Whether you use batch download',
            ],
            1,
            'The step text states that Suno download format is gated by the active subscription tier, not by a menu choice, and that the format offered follows directly from your account tier.',
          ),
        ),
        step(
          'Save into the project folder and ingest in Live',
          [
            list(
              [
                'Save the downloaded file into [Current Project]/Samples/Imported/Suno/.',
                'If a stem ZIP was downloaded, extract all component stems into the same folder.',
                'In Live, drag the audio file into an empty Audio Track at Bar 1, Beat 1.',
                'In Clip View, enable Warp and set Warp Mode to Complex Pro.',
                'Align the first strong kick transient with Bar 1.1.1, and match the Live Set Master Tempo to the generative track.',
                'Execute File → Collect All and Save.',
              ],
            ),
            callout(
              'warning',
              'A raw download is a seed, not a finished work',
              'A raw Suno download imported into Live is <strong>not</strong> a finished musical work. It represents a starting creative seed requiring human arrangement, synthesis replacement, and mixing.',
            ),
            prose('Everything after this point in the course treats that consolidated, warped file as raw material — never as a deliverable on its own.'),
          ],
          order(
            'What is the correct sequence of steps for importing a raw Suno download into Ableton Live?',
            [
              'Enable Warp in Clip View and set mode to Complex Pro',
              'Drag the audio file into an empty Audio Track at Bar 1, Beat 1',
              'Save the downloaded file into [Current Project]/Samples/Imported/Suno/',
              'Align the first strong kick transient with Bar 1.1.1 and match the Master Tempo',
              'Execute File → Collect All and Save',
            ],
            [
              'Save the downloaded file into [Current Project]/Samples/Imported/Suno/',
              'Drag the audio file into an empty Audio Track at Bar 1, Beat 1',
              'Enable Warp in Clip View and set mode to Complex Pro',
              'Align the first strong kick transient with Bar 1.1.1 and match the Master Tempo',
              'Execute File → Collect All and Save',
            ],
            'The step text lists these actions in exactly this order after mentioning extraction if needed.',
          ),
        ),
      ],
      {
        minutes: 7,
        intro: 'Download a Suno generation in the format your tier grants, store it correctly, and warp it into Live.',
      },
    ),
  ],
});
