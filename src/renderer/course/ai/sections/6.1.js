/**
 * Section 6.1 — Pick 2, 4, or 5, then run
 * Module 6 — SpleeterGUI
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-06-SpleeterGUI/
 *     Lesson-6.1.1-SpleeterGUI-Architecture-And-2-4-5-Separation.md
 *
 * Per this section's mustNotCover guardrail, no command-line or `pip
 * install` step is described — SpleeterGUI is a Windows GUI wrapper
 * around Spleeter, operated entirely by drag-and-drop — and the
 * TensorFlow/U-Net/GRU internals are named once for context, not taught
 * as something the learner needs to understand to use the tool.
 *
 * Neither spleetergui.com nor the Deezer Spleeter GitHub repo is in
 * tools/reference/known-sources.json (Ableton-only whitelist), so this
 * section carries no sources() block, same treatment as Module 5.
 */
import {
  module_, lesson, step, prose, list, table, callout, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m6-1',
  code: '6.1',
  title: 'Pick 2, 4, or 5, then run',
  outcomes: ['Produce WAV stems in the output folder.'],
  sources: [],
  practiceFocus: ['4-stem split of an owned file (or Moises equivalent on macOS)'],
  checkpoints: ['Four WAVs exist (Windows) or the Moises set plus a written 2/4/5 choice (macOS)'],
  lessons: [
    lesson(
      'ai-tools-music-l6-1-1',
      'Pick 2, 4, or 5, then run',
      [
        step(
          'Three pre-trained models, three different jobs',
          [
            prose(
              `SpleeterGUI is a Windows GUI wrapper around Deezer's open-source Spleeter, a neural
          source-separation model — no command line or package install is required to use it, only
          a drag-and-drop of the audio file. Spleeter ships three pre-trained models, and picking
          the right one is a job decision, not a quality decision — a bigger stem count is not
          automatically better.`,
            ),
            table(
              ['Model', 'Stems produced', 'When to use it'],
              [
                ['2 Stems', 'Vocals, Accompaniment (everything else summed)', 'Isolating an acapella or building a karaoke/backing track — fastest, fewest phase-cancellation artifacts'],
                ['4 Stems', 'Vocals, Drums, Bass, Other', 'The general-purpose choice for remixing, drum replacement, and bassline re-synthesis'],
                ['5 Stems', 'Vocals, Drums, Bass, Piano, Other', 'Only when an isolated acoustic or electric piano track is explicitly needed'],
              ],
              'Deezer\'s three pre-trained Spleeter models and the job each one fits.',
            ),
            callout(
              'key',
              'Deezer\'s disclaimer is required before processing, not after',
              `Before running any job, <code>USAGE-LOG.md</code> gets Deezer's mandatory copyright
           line pasted in: "Spleeter is provided for research and personal production. Usage on
           copyrighted material requires explicit authorization from the rights holders."`,
            ),
          ],
          mcq(
            'According to the SpleeterGUI step text, when should you choose the 5-stems model?',
            [
              'When you need the fastest separation with fewest phase-cancellation artifacts',
              'When an isolated acoustic or electric piano track is explicitly needed',
              'For general-purpose remixing, drum replacement, and bassline re-synthesis',
              'When building a karaoke or backing track',
            ],
            1,
            'The step text\'s table states that the 5 Stems model (Vocals, Drums, Bass, Piano, Other) should be used only when an isolated acoustic or electric piano track is explicitly needed.',
          ),
        ),
        step(
          'Running the separation, Windows or macOS',
          [
            list(
              [
                'In the Live Project, confirm <code>Samples/Imported/Spleeter/</code> exists, and paste Deezer\'s disclaimer into <code>USAGE-LOG.md</code>.',
                '<strong>Windows:</strong> launch SpleeterGUI, click <strong>Set Output Directory</strong> and point it at <code>Samples/Imported/Spleeter/</code>, choose 2/4/5 Stems from the Stems menu, then drag the authorized <code>.wav</code> file into the window — processing runs locally and a subfolder of separated WAVs appears when it finishes.',
                '<strong>macOS:</strong> SpleeterGUI is Windows-only, so Moises Desktop stands in — process the same file with the matching 2-track or 4-track profile, then log <code>"macOS Workstation: Executed via Moises Desktop (Mapped to Spleeter 4-Stem configuration)."</code> in <code>USAGE-LOG.md</code>.',
                'In Live, open the Browser to the output folder, drag the stems onto stacked Audio Tracks in Arrangement View, rename each track by stem (<code>Spleeter_Vocals</code>, <code>Spleeter_Drums</code>, <code>Spleeter_Bass</code>, <code>Spleeter_Other</code>), then run <strong>File → Collect All and Save</strong>.',
              ],
            ),
          ],
          mcq(
            "What must be done with Deezer's disclaimer in the Live Project?",
            [
              'Paste it into USAGE-LOG.md',
              'Add it to the project folder',
              'Ignore it after confirming the folder',
              'Upload it to the stems',
            ],
            0,
            "The step text explicitly states to confirm Samples/Imported/Spleeter/ exists, and paste Deezer's disclaimer into USAGE-LOG.md.",
          ),
        ),
        step(
          'Lab: 4-stem local separation',
          [
            list(
              [
                'Process an authorized original track or multi-track mix through SpleeterGUI (Windows) or Moises (macOS) using the 4-Stem profile.',
                'Import the resulting stems into Live 12, mute the original mix, and play all four stems together.',
                'Solo the <code>Other</code> track and listen for frequency bleed (cymbal spill, vocal reverb tails); record the observation in <code>USAGE-LOG.md</code>.',
              ],
            ),
            prose(
              `Self-assessment: the output directory was set before processing began; the model
          matched the actual instrumentation goal rather than defaulting to the biggest stem
          count; Deezer's disclaimer is quoted in <code>USAGE-LOG.md</code>; and the stems are
          imported and consolidated with Collect All and Save.`,
            ),
          ],
          mcq(
            'What must be done immediately after importing the stems into Live 12?',
            [
              'Solo the Other track and listen for frequency bleed',
              'Mute the original mix and play all four stems together',
              'Set the output directory before processing',
              "Quote Deezer's disclaimer in USAGE-LOG.md",
            ],
            1,
            'The step text states to import the resulting stems into Live 12, mute the original mix, and play all four stems together, then solo the Other track and listen for frequency bleed (cymbal spill, vocal reverb tails).',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Choosing the right Spleeter stem count for the job and running the split on Windows or its macOS equivalent.',
      },
    ),
  ],
});
