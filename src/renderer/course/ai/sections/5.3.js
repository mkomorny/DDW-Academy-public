/**
 * Section 5.3 — Moises Stems plug-in in Live (optional)
 * Module 5 — Moises Desktop
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-05-Moises-Desktop/
 *     Lesson-5.3.1-Moises-Stems-DAW-Integration.md
 *
 * Per this section's mustNotCover guardrail, the plug-in is described
 * exactly as the lesson file frames it — an authorized VST3/AU plug-in
 * that interfaces with Moises's cloud service — never as a Live-native
 * device. The file-export workflow from Section 5.2 is stated as the
 * required path; the plug-in is explicitly optional, gated on whether the
 * account plan and installed software include it.
 *
 * This is the last section in Module 5, which closes with the syllabus's
 * own Gate D — Moises path checkpoint; Level 5 and Gate D are wired into
 * ai/index.js in this same batch now that all three sections are authored.
 *
 * Same as 5.1/5.2, Moises documentation is outside tools/reference/known-
 * sources.json, so this section carries no sources() block.
 */
import {
  module_, lesson, step, prose, list, diagram, callout, mcq, order, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m5-3',
  code: '5.3',
  title: 'Moises Stems plug-in in Live (optional)',
  outcomes: [
    'If the Desktop installer provided the Stems plug-in and the plan includes it, insert it using official Help. Otherwise skip.',
  ],
  sources: [],
  practiceFocus: ['Insert per Help, or log "not installed / not on plan"'],
  checkpoints: ['Module 5 can be finished with file export alone'],
  lessons: [
    lesson(
      'ai-tools-music-l5-3-1',
      'Moises Stems plug-in in Live (optional)',
      [
        step(
          'Two pathways: file export, or an in-DAW plug-in',
          [
            prose(
              `Section 5.2's file-export workflow is the required core path for every learner. Moises
          also offers a second, optional pathway: the <strong>Moises Stems</strong> VST3/AU
          plug-in, an authorized plug-in that is inserted directly on a Live audio track and talks
          to the same cloud separation service, letting stems be dragged straight out of the
          plug-in window into Arrangement View. It is not a Live-native device — it ships from
          Moises and only appears if the Desktop installer included it and the active plan covers
          it.`,
            ),
            diagram(
              [
                { id: 'track', label: 'Live audio track' },
                { id: 'plugin', label: 'Insert Moises Stems' },
                { id: 'login', label: 'Sign in, load audio' },
                { id: 'cloud', label: 'Cloud separation' },
                { id: 'drag', label: 'Drag stems to tracks' },
              ],
              [
                { from: 'track', to: 'plugin' },
                { from: 'plugin', to: 'login' },
                { from: 'login', to: 'cloud' },
                { from: 'cloud', to: 'drag' },
              ],
              { layout: 'chain', caption: 'The optional in-DAW plug-in pathway, when it is installed and on-plan.' },
            ),
            callout(
              'tip',
              'No plug-in? The file-export path already satisfies Gate D',
              `If the plug-in is not installed or not included on the active subscription tier, the
           Section 5.2 file-export workflow alone meets every requirement for Gate D — the plug-in
           is a convenience, not a second required deliverable.`,
            ),
          ],
          mcq(
            'What is required to complete Gate D in Section 5.2?',
            [
              'The Moises Stems VST3/AU plug-in',
              'The file-export workflow',
              'Both the plug-in and the file-export workflow',
              'Signing in to the plug-in',
            ],
            1,
            'The step text states that the Section 5.2 file-export workflow is the required core path for every learner and that if the plug-in is not installed or on-plan, the file-export workflow alone meets every requirement for Gate D.',
          ),
        ),
        step(
          'Inserting and operating the plug-in, if it is available',
          [
            list(
              [
                'Confirm the Live Set tempo matches the source track before starting.',
                'In Live\'s Browser, navigate to <strong>Plug-ins → VST3</strong> (or <strong>Audio Units</strong> on macOS) → <strong>Moises → Moises Stems</strong>, and drag it onto an empty audio track.',
                'Sign in to the Moises account inside the plug-in window, then drag the authorized <code>.wav</code> file onto its upload zone.',
                'Choose a separation profile (for example 4-Track, or Lead/Backing Vocals) and wait for processing to finish.',
                'Click and drag individual stem tiles from the plug-in interface directly onto empty audio track lanes in Arrangement View — Live creates new clips containing the separated stems automatically.',
                'Run <strong>File → Collect All and Save</strong> to make sure the newly cached stem audio is captured into the project.',
              ],
            ),
          ],
          order(
            'What is the correct order of steps to import and use separated stems from the Moises plug-in into Ableton Live?',
            [
              'Sign in to the Moises account inside the plug-in window, then drag the authorized .wav file onto its upload zone.',
              'Click and drag individual stem tiles from the plug-in interface directly onto empty audio track lanes in Arrangement View',
              'Choose a separation profile (for example 4-Track, or Lead/Backing Vocals) and wait for processing to finish.',
              "In Live's Browser, navigate to Plug-ins → VST3 (or Audio Units on macOS) → Moises → Moises Stems , and drag it onto an empty audio track.",
            ],
            [
              "In Live's Browser, navigate to Plug-ins → VST3 (or Audio Units on macOS) → Moises → Moises Stems , and drag it onto an empty audio track.",
              'Sign in to the Moises account inside the plug-in window, then drag the authorized .wav file onto its upload zone.',
              'Choose a separation profile (for example 4-Track, or Lead/Backing Vocals) and wait for processing to finish.',
              'Click and drag individual stem tiles from the plug-in interface directly onto empty audio track lanes in Arrangement View',
            ],
            'The step text explicitly lists these actions in this sequence: insert the plug-in, sign in and upload the file, choose a profile and process, then drag stems onto tracks.',
          ),
        ),
        step(
          'Lab: comparative workflow audit, and Gate D',
          [
            list(
              [
                'Complete a 4-stem separation using the standalone Desktop export method from Section 5.2.',
                'If the plug-in is available, complete the same separation again using the in-DAW Moises Stems plug-in.',
                'Compare processing time and track-organization effort between the two, and log which one is preferred (or that the plug-in was unavailable) in <code>USAGE-LOG.md</code>.',
              ],
            ),
            prose(
              `<strong>Gate D — Moises path</strong> closes this module: at least three discrete stem
          files (or the 2-track pair on the Free tier) from an authorized source are loaded into
          the Live Set and reside in <code>Samples/Imported/Moises/</code>, fully compiled via
          Collect All and Save; the active plan tier and export format are logged in
          <code>STUDIO-SHEET.md</code> and <code>USAGE-LOG.md</code>; and it is clear why a
          Separate Tracks export in Moises Desktop always delivers original-tempo, original-pitch
          stems — that export mode ignores whatever Pitch Shifter or Speed Slider change is active
          in the player, unlike Audio Mix export, which bakes those changes in.`,
            ),
          ],
          text(
            'What does a Separate Tracks export in Moises Desktop ignore when producing stems?',
            [
              'pitch shifter and speed slider changes',
              'pitch shifter or speed slider change',
              'pitch shifter',
              'speed slider',
              'player changes',
            ],
            'The step text states that a Separate Tracks export in Moises Desktop always delivers original-tempo, original-pitch stems because that export mode ignores whatever Pitch Shifter or Speed Slider change is active in the player.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'The optional Moises Stems plug-in pathway, and closing out Gate D with either export method.',
      },
    ),
  ],
});
