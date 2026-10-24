/**
 * Section 4.1 — Open, Auto Apply, Apply, scale
 * Module 4 — MIDI Tools
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-04-MIDI-Tools/
 *     Lesson-4.1.1-MIDI-Tools-Architecture-And-Preview-Workflow.md
 *
 * The lesson file's Transform-panel-vs-Generate-panel ASCII box is a
 * side-by-side comparison, not a signal-flow pipeline, so it is promoted to
 * a table() rather than a diagram() — the closer fit for two parallel
 * columns of properties. Per this section's mustNotCover guardrail, the
 * prose never calls these tools neural or AI (they are described as
 * algorithmic operations on the MIDI note array), and never explains how
 * scale-degree math is computed — only that enabling Scale changes what unit
 * pitch parameters use.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §11.0-11.1.1
 * material the lesson file itself attributes to the Manual.
 */
import {
  module_, lesson, step, prose, list, table, callout, sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m4-1',
  code: '4.1',
  title: 'Open, Auto Apply, Apply, scale',
  outcomes: ['Preview a tool without destroying wanted notes.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Disable Auto Apply; preview a Transform; Apply once; Undo'],
  checkpoints: ['Learner can restore original notes after a mistaken Generate'],
  lessons: [
    lesson(
      'ai-tools-music-l4-1-1',
      'MIDI Tools Architecture and Preview Workflow',
      [
        step(
          'Transform edits what exists, Generate writes what is missing',
          [
            prose(
              `Live 12's MIDI Tools are algorithmic operations that run directly on the note array
          inside a clip's buffer — not a neural or AI feature, and this course does not study how
          the algorithms compute their result, only how to operate the two panels that hold them.
          <strong>Transform</strong> and <strong>Generate</strong> live in Clip View, opened from
          two tab icons in the left sidebar: two intersecting arrows for Transform, a star/sparkle
          for Generate.`,
            ),
            table(
              ['', 'Transform', 'Generate'],
              [
                ['Acts on', 'Existing selected notes', 'New notes in empty time or the loop brace'],
                ['Needs a selection?', 'Yes — or it uses the loop brace / time selection', 'No — writes into the time selection or clip loop'],
                ['Overlap behavior', 'Edits the notes it is given', 'Overwrites/replaces any existing note it overlaps'],
                ['Example tools', 'Arpeggiate, Chop, Connect, Time Warp, Velocity Shaper', 'Rhythm, Seed, Shape, Stacks, Euclidean'],
              ],
              'How Transform and Generate differ before any specific tool is opened.',
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the step text, how does the Transform panel differ from the Generate panel in what it acts on?',
            [
              'Existing selected notes',
              'New notes in empty time or the loop brace',
              'The entire clip regardless of selection',
              'Only notes created by the algorithms',
            ],
            0,
            'The step text explicitly states in the comparison table that Transform acts on Existing selected notes while Generate acts on New notes in empty time or the loop brace.',
          ),
        ),
        step(
          'Auto Apply: preview before committing',
          [
            list(
              [
                '<strong>Auto Apply on (default)</strong> — any knob or slider change writes to the clip immediately.',
                '<strong>Auto Apply off</strong> — toggle the indicator off; Live restores the clip\'s original notes so parameters can be configured freely without altering anything yet.',
                '<strong>Commit the change</strong> — click <strong>Apply</strong>, or press <code>Ctrl+Enter</code> (Windows) / <code>Cmd+Enter</code> (macOS).',
                '<strong>Undo the note edit, or reset the tool</strong> — Edit → Undo/Redo (<code>Ctrl+Z</code> / <code>Cmd+Z</code>) reverts the notes Apply just wrote; the small circular Reset icon in the tool panel\'s top right reverts the tool\'s own knob values instead, and does not touch the clip.',
              ],
            ),
            callout(
              'tip',
              'Auto Apply off is the safe default for auditioning',
              `Turning Auto Apply off before touching any parameter means nothing in the clip changes
           until Apply is pressed on purpose — the fastest way to try several settings without
           committing any of them.`,
            ),
          ],
          multi(
            'Which actions are possible when Auto Apply is turned off?',
            [
              'Knob changes write to the clip immediately',
              "Live restores the clip's original notes",
              'Commit changes by clicking Apply or pressing Ctrl+Enter / Cmd+Enter',
              'Undo the note edit with Ctrl+Z / Cmd+Z',
              "Reset the tool's knob values with the circular icon",
            ],
            [1, 2, 3, 4],
            'When Auto Apply is off, Live restores original notes, changes are committed only by clicking Apply or Ctrl+Enter/Cmd+Enter, edits can be undone with Ctrl+Z/Cmd+Z, and the Reset icon reverts knob values, as stated in the step text.',
          ),
        ),
        step(
          'Clip Scale changes the unit, native tools vs bundled Max tools',
          [
            prose(
              `When <strong>Scale</strong> is enabled on a MIDI clip (for example C Natural Minor), every
          pitch parameter inside Transform and Generate switches from raw chromatic semitones to
          scale degrees — this course does not cover how that conversion is computed, only that
          turning Scale on is what makes generated or transformed pitches land inside the chosen
          mode instead of anywhere in the chromatic scale. Arpeggiate, Connect, Chop, Rhythm, Seed,
          and Stacks are native tools built into the core engine; Velocity Shaper and Euclidean are
          bundled Max for Live tools that ship with both Live 12 Standard and Suite — either way,
          they open from the same Transform/Generate selector.`,
            ),
            list(
              [
                'Create a blank MIDI clip (<code>Ctrl+Shift+M</code> / <code>Cmd+Shift+M</code>), open Clip View (<code>Shift+Tab</code>).',
                'Draw four sustained quarter notes on C3. Open Transform → Chop, turn Auto Apply off, set Chop to 8 Parts — the notes on screen stay unchanged.',
                'Press Apply — the notes chop into 8th-note segments. Undo to restore them, or click Reset to return the Chop knobs to default.',
              ],
            ),
          ],
          mcq(
            'What happens to the notes on screen immediately after you set Chop to 8 Parts with Auto Apply turned off?',
            [
              'They are immediately chopped into 8th-note segments',
              'The notes on screen stay unchanged',
              'The notes are replaced with scale degrees',
              'The clip is automatically saved',
            ],
            1,
            'The step text explicitly states that after turning Auto Apply off and setting Chop to 8 Parts, the notes on screen stay unchanged.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'How Transform and Generate differ, how Auto Apply previews changes safely, and what Clip Scale does to pitch parameters.',
      },
    ),
  ],
});
