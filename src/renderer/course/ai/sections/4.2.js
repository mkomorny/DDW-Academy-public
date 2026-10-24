/**
 * Section 4.2 — Transform: Arpeggiate, Chop, Connect, Time Warp
 * Module 4 — MIDI Tools
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-04-MIDI-Tools/
 *     Lesson-4.2.1-Transform-Tools-Arpeggiate-Chop-Connect-Time-Warp.md
 *
 * The lesson file's parameter-matrix ASCII box is promoted to a table() —
 * four tools' parameter lists side by side, not a signal-flow pipeline.
 * Strum and Glissando are named only as pointer-only tools (matching the
 * lesson file's own "pointer only, do not exhaust" framing), never given
 * full parameter treatment. Per this section's mustNotCover guardrail, MPE
 * itself is never explained — Strum/Glissando are mentioned by name only,
 * deferring full coverage to the sister Live course as the syllabus states.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §11.2
 * material the lesson file itself attributes to the Manual.
 */
import {
  module_, lesson, step, prose, list, table, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m4-2',
  code: '4.2',
  title: 'Transform: Arpeggiate, Chop, Connect, Time Warp',
  outcomes: ['Produce three variants of one written phrase.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['One phrase → three transformed clips'],
  checkpoints: ['Learner knows which of these need a note selection'],
  lessons: [
    lesson(
      'ai-tools-music-l4-2-1',
      'Transform Tools: Arpeggiate, Chop, Connect, and Time Warp',
      [
        step(
          'Four tools, four parameter sets',
          [
            table(
              ['Tool', 'Key parameters', 'What it does'],
              [
                ['Arpeggiate', 'Style, Distance, Steps, Rate, Gate', 'Breaks a chord selection into a sequenced pattern (Up, Down, Up/Down, Converge, Diverge, Random)'],
                ['Chop', 'Parts (2-64), Gaps, Pattern', 'Subdivides existing notes into slices with optional rest spacing and metric-pulse variation'],
                ['Connect', 'Spread, Density, Rate, Tie', 'Fills gaps between anchor notes with a new linking phrase'],
                ['Time Warp', '1-3 Breakpoints, Quantize, Preserve Time Range', 'Bends the internal timing of a note selection with a speed curve while the phrase\'s start/end stay fixed'],
              ],
              'The four required Transform tools and what each one changes.',
            ),
            prose(
              `All four require a note selection in the MIDI Editor — Transform affects only the notes
          given to it, or everything inside the active loop brace or time selection if nothing is
          explicitly selected. Strum and Glissando are two more Transform tools this course points
          at but does not cover in full: that depth belongs to the sister Live course on
          performance-expression tools.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the step text, what does the Connect tool do?',
            [
              'Breaks a chord selection into a sequenced pattern',
              'Subdivides existing notes into slices with optional rest spacing',
              'Fills gaps between anchor notes with a new linking phrase',
              'Bends the internal timing of a note selection with a speed curve',
            ],
            2,
            'The step text explicitly states that the Connect tool fills gaps between anchor notes with a new linking phrase.',
          ),
        ),
        step(
          'Worked lab: one phrase, three variants',
          [
            list(
              [
                'Write a static 4-chord progression (for example Am7 - Fmaj7 - Cmaj7 - G7) on Operator, then duplicate the clip twice: three identical starting clips.',
                '<strong>Variant 1 — Arpeggiate:</strong> select all notes, open Arpeggiate, set Style to Converge, Rate to 1/16, Gate to 75%, Steps to 2, Distance to +1 Octave, then Apply.',
                '<strong>Variant 2 — Chop then Velocity Shaper:</strong> select all notes, open Chop, set Parts to 16 and Gaps to 20% with a syncopated Pattern, Apply — then open Velocity Shaper and draw a descending curve to taper velocity toward the end of each bar, Apply.',
                '<strong>Variant 3 — Connect then Time Warp:</strong> delete every note except the first chord of bar 1 and the last chord of bar 4, select what remains, open Connect (Rate 1/16, Density 80%, Spread 4 steps), Apply — then select all notes and open Time Warp, drag the center breakpoint upward for an accelerando across bars 2-3, Apply.',
              ],
            ),
          ],
          mcq(
            'What settings are used in the Arpeggiate variant for the 4-chord progression?',
            [
              'Style Converge, Rate 1/16, Gate 75%, Steps 2, Distance +1 Octave',
              'Parts 16, Gaps 20% syncopated, then descending velocity curve',
              'Delete all but first and last chords then Connect and Time Warp',
              'Duplicate the clip twice to create three identical starting clips',
            ],
            0,
            'The step text explicitly lists these exact Arpeggiate settings (Style to Converge, Rate to 1/16, Gate to 75%, Steps to 2, Distance to +1 Octave) for Variant 1 after selecting all notes.',
          ),
        ),
        step(
          'Name and log the result',
          [
            prose(
              `Lab: write an original 4-bar motif, run the three transformation workflows above on
          three duplicate clips, and rename each in Session View — for example <code>V1_Arp</code>,
          <code>V2_Chop_Shaped</code>, <code>V3_Connect_Warped</code> — then write the exact
          parameter values used for each into the project log. Connect is the tool that specifically
          bridges empty space between two anchor notes with a new phrase; Time Warp is the only one
          of the four that changes timing rather than pitch or note count.`,
            ),
          ],
          mcq(
            'Which tool specifically bridges empty space between two anchor notes with a new phrase?',
            ['V1_Arp', 'Connect', 'Time Warp', 'Chop'],
            1,
            'The step text states that Connect is the tool that specifically bridges empty space between two anchor notes with a new phrase.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Arpeggiate, Chop, Connect, and Time Warp — what each transforms and a worked lab producing three distinct variants from one phrase.',
      },
    ),
  ],
});
