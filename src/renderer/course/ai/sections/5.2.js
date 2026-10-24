/**
 * Section 5.2 — Listen, BPM/key, export WAV, import
 * Module 5 — Moises Desktop
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-05-Moises-Desktop/
 *     Lesson-5.2.1-Moises-BPM-Key-Detection-And-WAV-Export.md
 *
 * Per this section's mustNotCover guardrail, Moises's Audio Mix export
 * (a processed, pitch/speed-baked bounce) is described only as an export
 * mode with a specific use — it is never framed as the course's mastering
 * or finishing step; the course master remains a Live-side concern.
 *
 * Same as 5.1, Moises documentation is outside tools/reference/known-
 * sources.json, so this section carries no sources() block for the
 * Moises-specific material. The Ableton Live import/consolidation steps
 * are standard Live workflow (Collect All and Save, track import) already
 * covered by whitelisted citations elsewhere in this course, so they are
 * not re-cited here to avoid an unsupported claim of Manual section
 * coverage for Moises-specific UI.
 */
import {
  module_, lesson, step, prose, list, table, callout, mcq, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m5-2',
  code: '5.2',
  title: 'Listen, BPM/key, export WAV, import',
  outcomes: ['Export the stems this lab needs and play them in Live.'],
  sources: [],
  practiceFocus: ['Export drums, bass, and vocals; they play in Live'],
  checkpoints: ['Learner states where the export folder is on this OS'],
  lessons: [
    lesson(
      'ai-tools-music-l5-2-1',
      'Listen, BPM/key, export WAV, import',
      [
        step(
          'Reading the detected BPM and key, and the two export modes',
          [
            prose(
              `Double-clicking a completed separation opens the Moises player, whose header shows the
          algorithmically detected tempo (for example 120.0 BPM) and key signature (for example C#
          Minor) — worth recording, but not infallible, so listen and confirm rather than trusting
          it blindly. Each stem channel (Vocals, Drums, Bass, Other) can be soloed and muted
          individually to audition isolation quality before exporting anything.`,
            ),
            table(
              ['Export mode', 'What it renders', 'Pitch/speed shifts applied?'],
              [
                ['Separate Tracks', 'Individual stem files, one per channel', 'No — always delivered at original tempo and pitch, even if the player\'s Pitch Shifter or Speed Slider has been moved'],
                ['Audio Mix', 'The summed stereo mix as currently configured', 'Yes — bakes in whatever pitch/speed changes are active in the player'],
              ],
              'Separate Tracks and Audio Mix answer different questions — which one to use depends on whether the shifted pitch/speed matters for this export.',
            ),
            callout(
              'warning',
              'Separate Tracks export never carries player pitch/speed changes',
              `If the Pitch Shifter or Speed Slider has been moved inside the Moises player, selecting
           <strong>Separate Tracks</strong> will not apply that change to the individual stem
           files — they always export at original tempo and pitch. To capture a pitch- or
           tempo-modified stem, solo that channel and use <strong>Audio Mix → Export Mix</strong>
           instead.`,
            ),
          ],
          mcq(
            'What does the Separate Tracks export mode always deliver regardless of any changes made with the Pitch Shifter or Speed Slider?',
            [
              'Individual stem files at the modified tempo and pitch',
              'Individual stem files at the original tempo and pitch',
              'A summed stereo mix with the applied changes',
              'A single file containing all channels mixed together',
            ],
            1,
            "The step text states that Separate Tracks renders individual stem files with no pitch/speed shifts applied and always delivered at original tempo and pitch even if the player's Pitch Shifter or Speed Slider has been moved.",
          ),
        ),
        step(
          'Exporting stems and importing them into Live 12',
          [
            list(
              [
                'Click <strong>Export</strong> in the upper right of the Moises player.',
                'Under Format, choose <strong>WAV</strong> on a Premium/Pro plan, or <strong>MP3 (320 kbps)</strong> / <strong>M4A</strong> on the Free tier.',
                'Under Separate Tracks, select the stems needed for this session, or click <strong>Export All</strong>.',
                'Set the export destination directly to <code>[Current Live Project]/Samples/Imported/Moises/</code>, then click <strong>Save / Download</strong>.',
                'In Live, open the Browser to that same <code>Samples/Imported/Moises/</code> folder inside the Current Project, multi-select the stem files, and drag them into Arrangement View at Bar 1, Beat 1 — holding <code>Ctrl</code> (Windows) or <code>Cmd</code> (macOS) while dragging drops them onto separate, stacked tracks.',
                'Rename the tracks explicitly (<code>Moises_Vocals</code>, <code>Moises_Drums</code>, <code>Moises_Bass</code>, <code>Moises_Other</code>), set the Live Set tempo to the Moises-detected BPM, then run <strong>File → Collect All and Save</strong>.',
              ],
            ),
          ],
          order(
            'In what order do you perform these actions to correctly import Moises stems into Ableton Live?',
            [
              'Set export destination to [Current Live Project]/Samples/Imported/Moises/ then click Save/Download',
              'Open the Browser to Samples/Imported/Moises/, multi-select stems and drag into Arrangement View at Bar 1 Beat 1 (holding Ctrl/Cmd for separate tracks)',
              'Rename the tracks explicitly (Moises_Vocals, Moises_Drums, Moises_Bass, Moises_Other), set tempo to the Moises-detected BPM, then run File → Collect All and Save',
              'Click Export in the upper right of the Moises player and choose the appropriate format (WAV on Premium/Pro, MP3/M4A on Free)',
            ],
            [
              'Click Export in the upper right of the Moises player and choose the appropriate format (WAV on Premium/Pro, MP3/M4A on Free)',
              'Set export destination to [Current Live Project]/Samples/Imported/Moises/ then click Save/Download',
              'Open the Browser to Samples/Imported/Moises/, multi-select stems and drag into Arrangement View at Bar 1 Beat 1 (holding Ctrl/Cmd for separate tracks)',
              'Rename the tracks explicitly (Moises_Vocals, Moises_Drums, Moises_Bass, Moises_Other), set tempo to the Moises-detected BPM, then run File → Collect All and Save',
            ],
            'The step text lists the actions in exactly this sequence: first click Export and choose format, then set destination and save, then import via the Browser into Arrangement View, and finally rename tracks, set tempo, and Collect All and Save.',
          ),
        ),
        step(
          'Lab: stem isolation and re-integration',
          [
            list(
              [
                'Import an authorized 4-track stem set exported from Moises into Live 12 and align all four stems at Bar 1.',
                'Group the four stem tracks (<code>Ctrl+G</code> / <code>Cmd+G</code>) into a single Group Track named <code>Moises_Stem_Buss</code>.',
                'Place the original unseparated mix on an adjacent track, invert its phase with a Utility device, and play both the Stem Buss and the inverted original together to hear separation artifacts as spectral residue.',
              ],
            ),
            prose(
              `Self-assessment: the multi-stem export landed in <code>Samples/Imported/Moises/</code>;
          the reason Separate Tracks export does not bake in player pitch/speed changes is clear;
          and the stems are aligned at Bar 1 and consolidated with Collect All and Save.`,
            ),
          ],
          mcq(
            'What is the first action described after importing the 4-track stem set into Live 12?',
            [
              'Align all four stems at Bar 1',
              'Group the four stem tracks into a Group Track',
              'Place the original unseparated mix on an adjacent track',
              'Invert the phase of the original mix',
            ],
            0,
            'The step text explicitly begins with "Import an authorized 4-track stem set exported from Moises into Live 12 and align all four stems at Bar 1."',
          ),
        ),
      ],
      {
        minutes: 12,
        intro: 'Reading Moises\'s detected BPM/key, choosing the right export mode, and bringing stems cleanly into a Live 12 Set.',
      },
    ),
  ],
});
