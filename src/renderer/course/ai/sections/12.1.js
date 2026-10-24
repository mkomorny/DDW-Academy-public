/**
 * Section 12.1 — Capture or add a file
 * Module 12 — Audiolens
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-12-Audiolens/
 *     Lesson-12.1.1-Audiolens-Reference-Capture-And-Profile-Management.md
 *
 * No sources() block: the lesson cites the iZotope Audiolens Official User
 * Manual, which is not in known-sources.json (only the Ozone 12 User Guide
 * is whitelisted for iZotope material) — same no-official-docs-locally
 * treatment as Module 10's Suno citations.
 */
import {
  module_, lesson, step, prose, diagram, callout, table, mcq, multi, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m12-1',
  code: '12.1',
  title: 'Capture or add a file',
  outcomes: ['A named custom target exists in Ozone.'],
  sources: [],
  practiceFocus: ['One named custom target in the Target Library'],
  checkpoints: ['Target is selectable in Assistant'],
  lessons: [
    lesson(
      'ai-tools-music-l12-1-1',
      'Capture or add a file',
      [
        step(
          'Two paths into the same Target Library',
          [
            prose(
              `<strong>Audiolens</strong> routes system audio through a virtual driver to analyze the
          short-term spectral profile, dynamic range, and tonal balance of reference audio playing from
          any media player or DAW. Whether a target reaches Ozone's Target Library through Audiolens or
          through direct file import, both paths converge on the same custom target profile, ready for
          Master Assistant to run against.`,
            ),
            diagram(
              [
                { id: 'ref', label: 'Reference playback' },
                { id: 'audiolens', label: 'Audiolens captures curve' },
                { id: 'fallback', label: 'Or: Ozone Add Target' },
                { id: 'target', label: 'Custom target ready' },
              ],
              [
                { from: 'ref', to: 'audiolens' },
                { from: 'ref', to: 'fallback' },
                { from: 'audiolens', to: 'target' },
                { from: 'fallback', to: 'target' },
              ],
              { layout: 'chain', caption: 'Audiolens capture and the Ozone file-import fallback both produce a custom target.' },
            ),
            callout(
              'warning',
              'Reference rights notice',
              'Capturing an acoustic frequency curve of a reference song for analysis on your production workstation does <strong>not</strong> grant a license to sample, copy, or distribute the reference artist\'s underlying audio or musical composition.',
            ),
          ],
          multi(
            'According to the text, which two methods produce a custom target in the Target Library?',
            [
              'Audiolens capture of system audio',
              'Direct file import in Ozone',
              'Master Assistant analysis',
              'Reference rights licensing',
            ],
            [0, 1],
            'The step text states that Audiolens capture and the Ozone file-import fallback both produce a custom target, and that both paths converge on the same custom target profile in the Target Library.',
          ),
        ),
        step(
          'Method A: real-time capture; Method B: direct file import',
          [
            table(
              ['Method', 'Procedure'],
              [
                ['A — Audiolens capture', 'Launch Audiolens, play the loudest section of an owned reference track, click Capture, allow 10–15 seconds of analysis, click End Capture, name and Save the target'],
                ['B — Ozone file import fallback', "If Audiolens isn't installed or version pairing fails: in Ozone's Target Library click + (Add Target), select Import Audio File, and browse to an authorized 24-bit .wav — Ozone analyzes the loudest 8 seconds and compiles a permanent custom target"],
              ],
              'Two ways to get a custom target profile into Ozone\'s Target Library.',
            ),
            prose(
              `Method B exists specifically so a learner without Audiolens installed, or hitting a version
          pairing failure, is never blocked from doing custom-target mastering — Ozone's own Add Target
          button reaches the same Target Library slot.`,
            ),
          ],
          mcq(
            'What is the fallback method to add a custom target to Ozone\'s Target Library if Audiolens is not installed?',
            [
              'Launch Audiolens and click Capture',
              'In Ozone click + (Add Target) then Import Audio File and browse to a 24-bit .wav',
              'Play the loudest section of a reference track for 10-15 seconds',
              'Name and Save the target after analysis',
            ],
            1,
            'The step text states that Method B (Ozone file import fallback) is used when Audiolens isn\'t installed or version pairing fails: click + (Add Target), select Import Audio File, and browse to an authorized 24-bit .wav.',
          ),
        ),
        step(
          'Lab: create and verify a named custom target',
          [
            prose(
              `Create a custom target profile from an authorized reference track using either Method A
          (Audiolens) or Method B (direct file import in Ozone). Name the target
          <code>Custom_Course_Reference_01</code> and verify it appears in the dropdown list of Ozone
          12's Target Library before moving on — a target that isn't selectable in Assistant isn't
          usable in the next section.`,
            ),
          ],
          text(
            'What exact name must you give to the custom target profile created from the reference track?',
            ['custom_course_reference_01', 'Custom_Course_Reference_01'],
            'The step text explicitly instructs to name the target Custom_Course_Reference_01 and verify it appears in the dropdown list of Ozone 12\'s Target Library.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Capture or import a custom reference target profile into Ozone\'s Target Library, via Audiolens or direct file import.',
      },
    ),
  ],
});
