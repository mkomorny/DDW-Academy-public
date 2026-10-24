/**
 * Section 2.1 — Make the Project ready
 * Module 2 — Live folders and WAV interchange
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-02-Live-Folders-And-WAV-Interchange/
 *     Lesson-2.1.1-Project-Directory-Structure-And-File-Hygiene.md
 *
 * The lesson file's directory-tree ASCII diagram is promoted to table() —
 * diagram()'s chain/stack/grid layouts are for signal-flow/concept graphs,
 * not filesystem hierarchies, so a Folder/Purpose table is the closer fit.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted in
 * tools/reference/known-sources.json) for the Collect All and Save / Stems
 * folder claims, which the lesson file itself attributes to Live's Manual
 * ch. 5 and §22.2.
 */
import {
  module_, lesson, step, prose, list, table, callout, sources, mcq, order, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m2-1',
  code: '2.1',
  title: 'Make the Project ready',
  outcomes: [
    'Create a Set, create import folders, Collect All and Save after bringing files in.',
  ],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Blank Set + the three import folders, paths written for this OS'],
  checkpoints: ['Learner can point at the Current Project folder on disk'],
  lessons: [
    lesson(
      'ai-tools-music-l2-1-1',
      'Project Directory Structure and File Hygiene',
      [
        step(
          'Sample orphan drift, and the fix',
          [
            prose(
              `A common failure mode in AI-assisted production is "sample orphan drift" — a stem
          downloaded from a browser or exported to a desktop folder gets referenced by an absolute
          path, then goes missing the moment the file is moved, cleaned up, or the project is
          copied to another machine. Every project fixes this the same way: one centralized folder
          topology, every external file copied inside it.`,
            ),
            table(
              ['Folder', 'Holds'],
              [
                ['<code>[Project Name].als</code>', 'The primary Live Set'],
                ['<code>USAGE-LOG.md</code>', 'Production provenance and tool log'],
                ['<code>Samples/Imported/Moises/</code>', 'Moises Desktop stems (.wav)'],
                ['<code>Samples/Imported/Spleeter/</code>', 'SpleeterGUI local splits (.wav)'],
                ['<code>Samples/Imported/Suno/</code>', 'Suno full mix and stems (.wav/.mp3)'],
                ['<code>Samples/Imported/Other/</code>', 'Audiolens references, text logs'],
                ['<code>Samples/Processed/Stems/</code>', 'Live 12.3 native stem-separation cache — Live-managed only'],
                ['<code>Samples/Recorded/</code>', 'Native audio recordings and resamples'],
              ],
              'The project folder topology every AI-tool production project follows.',
            ),
            callout(
              'warning',
              'Never touch Processed/Stems by hand',
              `Ableton Live 12.3 manages this folder internally. Manually moving, renaming, or
           deleting files inside it breaks clip references within the Set.`,
            ),
          ],
          mcq(
            'What is the recommended way to avoid sample orphan drift in AI-assisted productions?',
            [
              'Use absolute paths to reference downloaded stems',
              'Keep every external file outside the project folder',
              'Use one centralized folder topology and copy every external file inside it',
              'Manually edit files in Processed/Stems/',
            ],
            2,
            'The step text states that every project fixes sample orphan drift the same way: one centralized folder topology, every external file copied inside it.',
          ),
        ),
        step(
          'Build the import folder matrix',
          [
            list(
              [
                'File → Save Live Set As (Ctrl+Shift+S / Cmd+Shift+S). Name the Set using the project taxonomy — Live creates the enclosing <code>[Project Name] Project/</code> folder automatically.',
                'In the file manager, open the new Project folder and create <code>Samples/Imported/</code>.',
                'Inside <code>Imported/</code>, create four subfolders: <code>Moises/</code>, <code>Spleeter/</code>, <code>Suno/</code>, <code>Other/</code>.',
              ],
            ),
          ],
          order(
            'What is the correct sequence of actions to set up a new Ableton Live project folder structure as described?',
            [
              'Create Samples/Imported/ inside the new Project folder',
              'File → Save Live Set As (Ctrl+Shift+S / Cmd+Shift+S) and name the Set using the project taxonomy',
              'Inside Imported/, create four subfolders: Moises/, Spleeter/, Suno/, Other/',
            ],
            [
              'File → Save Live Set As (Ctrl+Shift+S / Cmd+Shift+S) and name the Set using the project taxonomy',
              'Create Samples/Imported/ inside the new Project folder',
              'Inside Imported/, create four subfolders: Moises/, Spleeter/, Suno/, Other/',
            ],
            'The step text explicitly lists the actions in this order: first save the Live Set As using the project taxonomy (which creates the enclosing Project folder), then open the new Project folder to create Samples/Imported/, then inside Imported/ create the four subfolders.',
          ),
        ),
        step(
          'One file-naming pattern, no exceptions',
          [
            prose(
              `Before copying any audio into these folders, rename it to
          <code>YYYY-MM-DD_[SourceIdentifier]_[ToolName]_[Role].[ext]</code> — for example
          <code>2026-08-14_OriginalDrumTake_moises_drums.wav</code> or
          <code>2026-08-14_SynthThemeGen01_suno_mix.wav</code>. The date, source, tool, and role
          are what let a later listener — including the learner's own future self — reconstruct
          exactly where a file came from without opening it.`,
            ),
          ],
          text(
            'What is the exact filename format to use before copying audio into the folders?',
            [
              'yyyy-mm-dd_[sourceidentifier]_[toolname]_[role].[ext]',
              'yyyy-mm-dd_sourceidentifier_toolname_role.ext',
              'yyyy-mm-dd_[source]_[tool]_[role].ext',
            ],
            'The step text explicitly states to rename audio to YYYY-MM-DD_[SourceIdentifier]_[ToolName]_[Role].[ext] so a later listener can reconstruct its origin.',
          ),
        ),
        step(
          'Collect All and Save, every time',
          [
            list(
              [
                'Drag an external audio file from <code>Samples/Imported/…</code> onto an Audio Track.',
                'File → Collect All and Save.',
                'In the dialog: Files from Elsewhere → Yes. Files from other Projects → Yes. Files from User Library → Yes (if custom presets were loaded). Files from Factory Packs → No, unless sharing the project without installed packs.',
                'Click OK — Live copies every referenced audio binary into the project container, making the Set fully self-contained.',
              ],
            ),
            sources(['Ableton Live 12 Manual']),
            prose(
              `Finish the lab: create a fresh Project, build the four import subfolders, add a blank
          <code>USAGE-LOG.md</code> at the project root, save, and confirm the folder hierarchy on
          disk matches the topology above.`,
            ),
          ],
          mcq(
            'What should you choose for "Files from Factory Packs" in the Collect All and Save dialog when making a project self-contained?',
            [
              'Yes',
              'No, unless sharing the project without installed packs',
              'Yes (if custom presets were loaded)',
              'Only if they are from the User Library',
            ],
            1,
            'The step text explicitly states: Files from Factory Packs → No, unless sharing the project without installed packs.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Build the one folder topology every AI-tool lab in this course reuses, and the habit that keeps it self-contained.',
      },
    ),
  ],
});
