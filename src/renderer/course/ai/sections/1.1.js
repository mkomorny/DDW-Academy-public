/**
 * Section 1.1 — Launch and identify
 * Module 1 — Open the toolbox
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-01-Open-The-Toolbox/
 *     Lesson-1.1.1-Toolbox-Launch-And-Edition-Verification.md
 *
 * The lesson file's hub-and-spoke ASCII tool-matrix diagram is promoted to a
 * diagram({layout:'stack'}) — its five branches (separators / generative /
 * DSP / LLMs) all hang off one central host node, not a left-to-right chain,
 * so 'stack' is the closer fit of the two auto-layouts available.
 *
 * `sources` is empty: this lesson's claims are about the CURRENT edition/plan
 * state of Moises Desktop, SpleeterGUI, Ozone, Audiolens, and Suno — none of
 * those product names are in tools/reference/known-sources.json (the corpus
 * has no ingested manual for them), so no sources() calls are made rather
 * than citing a title the validator's whitelist doesn't actually contain.
 *
 * Checks for both lessons in this section were AI-drafted (tools/author/
 * draft-step-checks.mjs), grounded only in each step's own prose plus this
 * module's outcomes, and entailment-verified before being accepted.
 */
import {
  module_, lesson, step, prose, list, callout, diagram, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m1-1',
  code: '1.1',
  title: 'Launch and identify',
  outcomes: [
    'Open Live, Moises Desktop, Ozone (inside a Set), Audiolens, a browser at suno.com, and (Windows) SpleeterGUI. Copy the version or plan each one shows.',
  ],
  sources: [],
  practiceFocus: ['One page titled `STUDIO-SHEET.md` inside a new Live Project'],
  checkpoints: ['Another person could read the sheet and know which Module 7 path this machine takes'],
  lessons: [
    lesson(
      'ai-tools-music-l1-1-1',
      'Toolbox Launch and Edition Verification',
      [
        step(
          'One producer, six tools',
          [
            prose(
              `Modern AI-assisted music production is not one program — it is an interconnected
          ecosystem. A producer finishes work in <strong>Ableton Live 12</strong>; every other tool
          in this course prepares a file that Live then plays, edits, converts, or masters. A file
          that leaves a tool and never enters Live is incomplete coursework.`,
            ),
            diagram(
              [
                { id: 'host', label: 'Ableton Live 12', sub: 'central DAW host' },
                { id: 'sep', label: 'Source separators', sub: 'Moises Desktop · SpleeterGUI · Live 12.3 Suite' },
                { id: 'gen', label: 'Generative audio', sub: 'Suno' },
                { id: 'dsp', label: 'Assistive DSP', sub: 'Ozone 12 · Audiolens' },
                { id: 'llm', label: 'Text assistants', sub: 'Claude · Grok · Gemini' },
              ],
              [
                { from: 'host', to: 'sep', label: 'export WAV in, import WAV out' },
                { from: 'host', to: 'gen', label: 'download, import' },
                { from: 'host', to: 'dsp', label: 'plug-in on the master channel' },
                { from: 'host', to: 'llm', label: 'plans, prompts, checklists' },
              ],
              { layout: 'stack', caption: 'The AI production tool matrix — Live is the one program every other tool feeds back into.' },
            ),
          ],
          mcq(
            'According to the step text, what is the role of Ableton Live 12 in the AI production tool matrix?',
            [
              'It is one optional tool among many equal programs',
              'It is the central DAW host that every other tool feeds back into',
              'It is used only for generative audio like Suno',
              'It is exclusively for text assistants and prompts',
            ],
            1,
            'The step text explicitly states that Live is the central DAW host and the one program every other tool feeds back into.',
          ),
        ),
        step(
          'Verify Live: version, edition, and the four commands',
          [
            list(
              [
                '<strong>Version and edition</strong> — Windows: Help → About Live. macOS: Live → About Live. Write the exact version string and whether the banner reads Standard or Suite.',
                '<strong>MIDI Tools</strong> — create a blank MIDI clip, open Clip View, confirm the Transform and Generate tabs are present on the left margin.',
                '<strong>Audio commands</strong> — drag in a WAV, check the Create menu (or right-click the clip) for Slice to New MIDI Track, Convert Harmony to New MIDI Track, Convert Melody to New MIDI Track, and Convert Drums to New MIDI Track.',
                '<strong>Stem check</strong> — look for Separate Stems to New Audio Tracks. Present means this build is Live 12.3 Suite; absent means Standard, and every later stem-split lab runs through Moises Desktop or SpleeterGUI instead.',
              ],
            ),
            callout(
              'tip',
              'Do not assume — inspect the running binary',
              `Feature availability depends on the exact build and license tier installed on this machine
           right now, not on what any other course or tutorial assumed. Confirm each item by
           actually opening the menu, not from memory.`,
            ),
          ],
          multi(
            'According to the step text, which of the following indicate that the installed build is Live 12.3 Suite?',
            [
              'The banner in About Live reads Standard',
              'The banner in About Live reads Suite',
              'The Transform and Generate tabs are present in Clip View',
              'The Separate Stems to New Audio Tracks command is present',
              'The Convert Harmony to New MIDI Track command is absent',
            ],
            [1, 2, 3],
            'The step text states that Separate Stems to New Audio Tracks and the Transform/Generate tabs being present, along with the banner reading Suite, mean this build is Live 12.3 Suite while their absence means Standard.',
          ),
        ),
        step(
          'Verify the source separators, Ozone, and Audiolens',
          [
            list(
              [
                '<strong>Moises Desktop</strong> — launch, sign in, open Settings / Account Profile, record the plan: Free, Premium, or Pro. Free allows 2-track and 4-track separation with compressed export; Premium/Pro unlock extra instrument classes and 24-bit lossless WAV.',
                '<strong>SpleeterGUI (Windows only)</strong> — launch, confirm the 2 / 4 / 5 stems dropdown, set an output folder. On macOS, SpleeterGUI is not used at all — Moises Desktop is the separator for every equivalent lab.',
                '<strong>Ozone 12</strong> — insert the mothership plug-in (not a single module) on the master channel, click Master Assistant in the header. Elements locks the view to Assistant macro controls only; Standard/Advanced can toggle Assistant View and Module View.',
                '<strong>Audiolens</strong> — launch the standalone app, confirm the input audio driver is actively reading system audio. Do not capture a target yet.',
              ],
            ),
          ],
          mcq(
            'What does the Free plan in Moises Desktop allow?',
            [
              '2-track and 4-track separation with compressed export',
              'Extra instrument classes and 24-bit lossless WAV',
              'Only 5-stem separation',
              'Master Assistant macro controls',
            ],
            0,
            'The step text states that Free allows 2-track and 4-track separation with compressed export while Premium/Pro unlock extra instrument classes and 24-bit lossless WAV.',
          ),
        ),
        step(
          'Verify Suno and a text assistant, then build the studio sheet',
          [
            list(
              [
                '<strong>Suno</strong> — open suno.com/create in a browser, sign in, open the account profile, record the plan tier: Basic (Free), Pro, or Premier. Basic downloads are MP3 only; Pro/Premier permit lossless WAV and multitrack/stem export.',
                '<strong>Text assistant</strong> — open Claude, Grok, or Gemini and send one deterministic test line, confirming a plain reply with no assumptions about capability.',
              ],
            ),
            prose(
              `Finish by creating <code>STUDIO-SHEET.md</code> inside a new Live Project and filling it
          with exactly what was verified above: OS, Live version and edition tier, stem-separation
          availability, Moises plan and export format, SpleeterGUI availability, Ozone edition and
          interface mode, Audiolens status, Suno plan and download capability, and the text
          assistant in use. Nothing on the sheet is guessed — every line is copied from a running
          application.`,
            ),
            callout(
              'warning',
              'No feature, price, or bit-depth is assumed',
              `A tool tier or export format written from memory instead of from the actual running
           account is exactly the kind of drift this course's grounding rule forbids — re-check
           the account UI, don't reuse an old note.`,
            ),
          ],
          mcq(
            'According to the instructions, what download format is available to a Basic (Free) Suno plan?',
            [
              'Lossless WAV',
              'MP3 only',
              'Multitrack stems',
              'WAV and stems',
            ],
            1,
            'The step text states that Basic downloads are MP3 only while Pro/Premier permit lossless WAV and multitrack/stem export.',
          ),
        ),
      ],
      {
        minutes: 12,
        intro: 'Launch every required tool on this machine, verify its edition or plan, and record it on a studio sheet.',
      },
    ),
  ],
});
