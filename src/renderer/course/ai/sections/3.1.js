/**
 * Section 3.1 — Slice to New MIDI Track
 * Module 3 — Slice and Convert
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-03-Slice-And-Convert/
 *     Lesson-3.1.1-Slice-To-New-MIDI-Track.md
 *
 * The lesson file's signal-flow ASCII box (audio clip -> transient/warp
 * detection -> slice dialog -> new MIDI track + Drum Rack) is promoted to a
 * diagram({layout:'chain'}) — a genuine left-to-right pipeline, unlike the
 * hub-and-spoke tool matrix in 1.1.js. Per this section's mustNotCover
 * guardrail, the diagram and prose describe WHAT slicing does (segments the
 * buffer into time slices, one per pad) without explaining HOW transient
 * detection is computed, and the prose is explicit that Slice is not a stem
 * separator — it never removes or isolates instruments from a mix.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §13.1-13.1.2
 * slicing-dialog and 128-chain material the lesson file itself attributes to
 * the Manual.
 */
import {
  module_, lesson, step, prose, list, table, callout, diagram, sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m3-1',
  code: '3.1',
  title: 'Slice to New MIDI Track',
  outcomes: ['Slice a region into a Drum Rack of Simplers and resequence it.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Slice an owned drum loop; resequence four hits'],
  checkpoints: ['Learner can open the dialog and explain when to crop first'],
  lessons: [
    lesson(
      'ai-tools-music-l3-1-1',
      'Slice to New MIDI Track',
      [
        step(
          'Slicing is not the same job as Convert',
          [
            prose(
              `Slice to New MIDI Track does not extract musical pitches, and it does not separate a
          mix into stems — it is not a stem separator at all. It segments the raw audio buffer into
          discrete time slices, places each slice into its own <strong>Simpler</strong> instance
          across the pads of a <strong>Drum Rack</strong>, and writes a chromatic ascending MIDI
          clip (C1, C#1, D1...) that triggers each slice back in its original order. Converting to
          MIDI (Harmony, Melody, Drums — covered in Sections 3.2 and 3.3) is a different job: it
          analyzes the audio's pitch and onset content and generates new MIDI note data instead of
          replaying chopped-up audio.`,
            ),
            diagram(
              [
                { id: 'clip', label: 'Audio clip (WAV)' },
                { id: 'detect', label: 'Slice points', sub: 'transients or warp markers' },
                { id: 'dialog', label: 'Slice dialog', sub: 'division, preset, preserve warped timing' },
                { id: 'track', label: 'New MIDI track', sub: 'ascending chromatic clip' },
                { id: 'rack', label: 'Drum Rack', sub: 'one Simpler per pad, one slice per Simpler' },
              ],
              [
                { from: 'clip', to: 'detect' },
                { from: 'detect', to: 'dialog' },
                { from: 'dialog', to: 'track' },
                { from: 'dialog', to: 'rack' },
              ],
              { layout: 'chain', caption: 'Slice to New MIDI Track: one audio clip becomes one Drum Rack of Simplers and a chromatic MIDI clip that replays it.' },
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What does the Slice to New MIDI Track function actually produce from an audio clip?',
            [
              'A stem-separated mix with isolated instruments',
              'New MIDI note data based on analyzed pitches and onsets',
              'A Drum Rack containing one Simpler per slice and a chromatic ascending MIDI clip',
              'Extracted musical pitches turned into a playable melody',
            ],
            2,
            'The step text explicitly states that Slice to New MIDI Track segments the audio into discrete time slices, places each into its own Simpler on a Drum Rack, and writes a chromatic ascending MIDI clip (C1, C#1, D1...) that triggers each slice in order.',
          ),
        ),
        step(
          'Crop before slicing, and set the dialog',
          [
            list(
              [
                'A Drum Rack cannot exceed 128 chains. Before slicing a long file, select the exact loop region in Clip or Arrangement View and crop the selection first (<code>Ctrl+Shift+J</code> Windows / <code>Cmd+Shift+J</code> macOS) so the slice count stays inside that limit.',
                'Right-click the audio clip (or use the <code>Create</code> menu) and choose <strong>Slice to New MIDI Track</strong>.',
              ],
            ),
            table(
              ['Dialog control', 'Options', 'Effect'],
              [
                ['Create one slice per', 'Transient / Warp Marker / 1/4, 1/8, 1/16, 1/32', 'Transient follows detected attacks (recommended for percussion); Warp Marker follows only manually placed markers; the metric options slice at a strict grid regardless of onsets'],
                ['Slicing Preset', 'Built-in 0-Velocity / Built-in Default / Custom Preset', 'Chooses the Simpler velocity response, or loads a saved custom Drum Rack preset'],
                ['Preserve warped timing', 'Enabled / Disabled', 'Enabled keeps the original clip’s warp markers and playback-rate changes; disabled triggers the raw sample with no warp compensation'],
              ],
              'The three controls in the Slice to New MIDI Track dialog.',
            ),
            callout(
              'warning',
              'The 128-chain limit is a hard boundary',
              `A Drum Rack cannot hold more than 128 chains. Slicing a long, uncropped file at a fine
           division can exceed that limit outright — crop to the exact loop region first, every
           time.`,
            ),
          ],
          mcq(
            'What is the maximum number of chains a Drum Rack can hold according to the slicing instructions?',
            ['64', '96', '128', '256'],
            2,
            'The step text explicitly states that a Drum Rack cannot exceed 128 chains and that the 128-chain limit is a hard boundary.',
          ),
        ),
        step(
          'Resequence the slices into a new groove',
          [
            list(
              [
                'Clicking OK creates a new MIDI track named <code>[AudioClipName] Sliced</code>, containing the chromatic MIDI clip and the pre-populated Drum Rack. Press Spacebar — the clip reproduces the original loop.',
                'Open the MIDI Editor (<code>Shift+Tab</code>) to resequence: move note blocks horizontally to change the rhythm, or duplicate/delete notes for stutter edits and ghost notes.',
                'In the Drum Rack, drag one pad onto another to swap sample positions, or multi-select related chains and group them (<code>Ctrl+G</code> / <code>Cmd+G</code>) into a sub-rack for shared buss processing.',
              ],
            ),
            prose(
              `Lab: slice an owned, uncompressed drum loop using Transient mode, then resequence at
          least four hits — for example, swap the 2nd and 4th snare hits and double the hi-hat
          trigger frequency on beat 3 — to produce a new groove from the same source material.`,
            ),
          ],
          multi(
            'According to the step text, which actions can you perform in the MIDI Editor after slicing?',
            [
              'Move note blocks horizontally to change the rhythm',
              'Duplicate or delete notes for stutter edits and ghost notes',
              'Swap sample positions by dragging pads in the Drum Rack',
              'Multi-select chains and group them with Ctrl+G / Cmd+G',
            ],
            [0, 1],
            'The step text explicitly states that in the MIDI Editor you can move note blocks horizontally to change the rhythm, or duplicate/delete notes for stutter edits and ghost notes.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'What Slice to New MIDI Track actually does, the 128-chain limit, and how to resequence the result into a new groove.',
      },
    ),
  ],
});
