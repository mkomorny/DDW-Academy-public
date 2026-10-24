/**
 * Section 3.2 — Convert Harmony and Convert Melody
 * Module 3 — Slice and Convert
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-03-Slice-And-Convert/
 *     Lesson-3.2.1-Convert-Harmony-And-Convert-Melody.md
 *
 * The lesson file's conversion-architecture ASCII box is promoted to a
 * diagram({layout:'chain'}) tracking source audio through transient analysis
 * to whichever command applies. Per this section's mustNotCover guardrail,
 * the prose states WHAT each command targets (monophonic vs polyphonic
 * audio) without explaining how the pitch-tracking algorithm itself works,
 * and never claims perfect transcription — the lab step explicitly has the
 * learner compare and clean up the two commands' different, imperfect
 * outputs by ear.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §13.2/13.3/
 * 13.5 material the lesson file itself attributes to the Manual.
 */
import {
  module_, lesson, step, prose, list, table, callout, diagram, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m3-2',
  code: '3.2',
  title: 'Convert Harmony and Convert Melody',
  outcomes: [
    'Extract polyphonic vs monophonic pitch to a new MIDI track and swap the preview instrument for Operator.',
  ],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: [
    'Convert a self-recorded monophonic line both ways; replace the instrument with Operator',
  ],
  checkpoints: ['Learner names the two commands and the transient-marker step'],
  lessons: [
    lesson(
      'ai-tools-music-l3-2-1',
      'Convert Harmony and Convert Melody',
      [
        step(
          'One command for a single line, another for chords',
          [
            prose(
              `Convert Melody and Convert Harmony both analyze an audio recording and generate real
          MIDI note events, but they target different source material. <strong>Convert Melody</strong>
          is for monophonic audio — a solo vocal take, a monophonic bassline, solo brass or
          woodwinds, whistling — and assigns one MIDI note per detected pitch interval, preloading
          an Instrument Rack with a synthesized lead/piano tone. <strong>Convert Harmony</strong> is
          for polyphonic audio — acoustic or electric rhythm guitar, piano chords, string ensembles,
          polyphonic synth pads — and generates multiple simultaneous notes per chord, preloading an
          Instrument Rack with a multi-sampled acoustic grand piano.`,
            ),
            diagram(
              [
                { id: 'clip', label: 'Audio recording / stem' },
                { id: 'transient', label: 'Transient analysis', sub: 'note onset and duration' },
                { id: 'melody', label: 'Convert Melody', sub: 'monophonic source' },
                { id: 'harmony', label: 'Convert Harmony', sub: 'polyphonic source' },
              ],
              [
                { from: 'clip', to: 'transient' },
                { from: 'transient', to: 'melody' },
                { from: 'transient', to: 'harmony' },
              ],
              { layout: 'chain', caption: 'Both commands start from the same transient analysis; which one to run depends on whether the source is one voice or many.' },
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What type of source material is Convert Melody designed for?',
            [
              'Polyphonic audio such as piano chords or string ensembles',
              'Monophonic audio such as a solo vocal take or whistling',
              'Any audio recording regardless of voices',
              'Transient analysis results only',
            ],
            1,
            'The step text states that Convert Melody is for monophonic audio — a solo vocal take, a monophonic bassline, solo brass or woodwinds, whistling.',
          ),
        ),
        step(
          'Clean the transient markers before converting',
          [
            list(
              [
                'Double-click the source audio clip to open Clip View, then zoom into the waveform.',
                'Review the transient markers along the top of the sample display: double-click to add a marker over a missed attack, drag a marker to align it precisely with a transient spike, and delete (<code>Delete</code> key) any marker sitting over a reverberant decay.',
              ],
            ),
            callout(
              'key',
              'Transient markers set the rhythm of the output',
              `Transient markers directly determine the start points and durations of the MIDI notes
           Convert Melody and Convert Harmony generate. A marker left on a decay tail, or missing
           from a real attack, becomes a wrong note in the output — clean the markers before
           converting, not after.`,
            ),
          ],
          mcq(
            'What should you do to transient markers that sit over a reverberant decay before converting?',
            ['Leave them alone', 'Drag them to a transient spike', 'Delete them', 'Double-click to add more'],
            2,
            'The step text explicitly states to delete (Delete key) any marker sitting over a reverberant decay because a marker left on a decay tail becomes a wrong note in the output.',
          ),
        ),
        step(
          'Convert, then replace the preview instrument with Operator',
          [
            list(
              [
                'Right-click the audio clip and choose either <strong>Convert Melody to New MIDI Track</strong> or <strong>Convert Harmony to New MIDI Track</strong>. Live inserts a new MIDI track below the source; the original audio track is not deleted or muted.',
                'The preloaded piano/synth rack is for auditioning only. Open the Browser (<code>Ctrl+Alt+B</code> / <code>Cmd+Option+B</code>), open Instruments → Operator, and drag Operator onto the title bar of the preloaded Instrument Rack to replace it.',
                'Open the MIDI Editor (<code>Shift+Tab</code>) and clean up any accidental octave jumps, ghost notes, or extraneous chord extensions caused by source bleed.',
              ],
            ),
            prose(
              `Lab: convert the same monophonic take using both Convert Melody and Convert Harmony,
          then compare the two MIDI clips by ear — Convert Melody should output a clean single-note
          line, while Convert Harmony will often interpret overtones as extra intervals or chord
          clusters. Neither command produces a perfect transcription; replacing the preview
          instrument with Operator and manually cleaning the MIDI is expected, not optional.`,
            ),
          ],
          mcq(
            'What happens immediately after you choose Convert Melody to New MIDI Track or Convert Harmony to New MIDI Track?',
            [
              'The original audio track is muted',
              'A new MIDI track is inserted below the source audio track',
              'The preloaded piano/synth rack is automatically replaced',
              'The MIDI Editor opens automatically',
            ],
            1,
            'The step text states that Live inserts a new MIDI track below the source; the original audio track is not deleted or muted.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'When to use Convert Melody vs Convert Harmony, why clean transient markers matter first, and replacing the preview instrument with Operator.',
      },
    ),
  ],
});
