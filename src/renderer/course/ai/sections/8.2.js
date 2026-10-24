/**
 * Section 8.2 — Replace a part
 * Module 8 — Use stems and MIDI in Live
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-08-Stems-And-MIDI-In-Live/
 *     Lesson-8.2.1-Stem-Part-Replacement-And-Synthesis.md
 *
 * Per this section's mustNotCover guardrail, this stays a hybrid-replacement
 * procedure lesson, not general remix pedagogy (that lives in the sister
 * Production course) — content is limited to muting/replacing stems with
 * Operator and Drum Rack, and remedying vocal bleed.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for Ch. 18
 * (Mixing), Ch. 23 (Working with Instruments and Effects), and Ch. 24
 * (Drum Racks), matching the lesson file's own citation.
 */
import {
  module_, lesson, step, prose, table, diagram, list, sources, mcq, multi, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m8-2',
  code: '8.2',
  title: 'Replace a part',
  outcomes: ['Keep some stems; replace at least one part with a Live instrument or a performance.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['16 bars. New drums or new bass under owned stems'],
  checkpoints: ['The new part is performed or programmed by the learner'],
  lessons: [
    lesson(
      'ai-tools-music-l8-2-1',
      'Replace a part',
      [
        step(
          'Hybrid part replacement: keep some stems, replace others',
          [
            prose(
              `Separated stems work best as a scaffold, not a finished product. Replacing lower-fidelity
          stems — a drum or bass stem showing neural phase artifacts — with a pristine native
          synthesizer, sampler, or live performance elevates the final mix quality, while stems that
          already sound clean (a lead vocal, a textural pad) stay as retained audio.`,
            ),
            diagram(
              [
                { id: 'vox', label: 'Vocals stem', row: 0, col: 0 },
                { id: 'voxout', label: 'Retained — direct mix bus', row: 0, col: 1 },
                { id: 'drum', label: 'Drums stem', row: 1, col: 0 },
                { id: 'drumout', label: 'Muted — new Drum Rack MIDI', row: 1, col: 1 },
                { id: 'bass', label: 'Bass stem', row: 2, col: 0 },
                { id: 'bassout', label: 'Muted — Operator synth MIDI', row: 2, col: 1 },
                { id: 'other', label: 'Others stem', row: 3, col: 0 },
                { id: 'otherout', label: 'Retained — textural bed, EQ', row: 3, col: 1 },
              ],
              [
                { from: 'vox', to: 'voxout' },
                { from: 'drum', to: 'drumout' },
                { from: 'bass', to: 'bassout' },
                { from: 'other', to: 'otherout' },
              ],
              { layout: 'grid', caption: 'A hybrid stem replacement topology: which stems stay as audio, which get replaced by native instruments.' },
            ),
            table(
              ['Stem showing artifacts', 'Listen for', 'Replacement'],
              [
                ['Bass', 'Low-end flanging or lack of sub-bass weight', 'Operator synth patch, MIDI-driven'],
                ['Drums', 'Blurred snare transients or loss of high-frequency cymbal clarity', 'High-fidelity Drum Rack, MIDI-driven'],
              ],
              'Symptoms that mark a stem as a replacement candidate rather than a keeper.',
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the hybrid stem replacement topology, what should you do with the drums stem?',
            [
              'Retain it and send directly to the mix bus',
              'Mute it and trigger a new Drum Rack with MIDI',
              'Replace it with a textural pad and EQ',
              'Keep it as a clean lead vocal stem',
            ],
            1,
            'The step text explicitly lists Drums stem -> Muted — new Drum Rack MIDI as part of the hybrid topology.',
          ),
        ),
        step(
          'Programming the replacement bass and drums',
          [
            list(
              [
                'Mute the identified audio tracks (press 0 on the track, or deactivate the track activator button).',
                'Insert a new MIDI track and load Operator. Drag in the converted MIDI clip from Section 8.1, or program a new bassline with MIDI Tools → Shape / Seed.',
                'In Operator: set Oscillator A to Sine or Saw D, set the Algorithm to Parallel, set Filter to Lowpass 24dB with a cutoff around 250 Hz, and adjust the pitch envelope or attack time to match the groove.',
                'Insert a second MIDI track loaded with a high-fidelity Drum Rack and copy the converted drum MIDI clip onto it.',
                'Load premium acoustic or electronic one-shot samples onto Kick (C1), Snare (D1), and Hats (F#1).',
                'Open the Groove Pool and assign an MPC or 16th-note swing template to the MIDI clip to add a human rhythmic pocket.',
              ],
            ),
            prose(
              `If the preserved Vocal stem contains bleed from the muted drum or bass tracks, remedy it in
          order of severity: automate the vocal track's volume down to −∞ dB during vocal pauses;
          insert EQ Eight on the vocal track with a High-Pass Filter at 100 Hz (48 dB/octave) to
          remove residual low-end spill; and, if bleed remains severe, re-upload the source file to
          Moises Desktop and select the specialized Lead Vocal vs. Backing Vocal Hi-Fi model.`,
            ),
          ],
          order(
            'In what order should you remedy vocal stem bleed from muted tracks, from first to last?',
            [
              'Automate vocal volume to −∞ dB during pauses',
              'Insert EQ Eight with High-Pass Filter at 100 Hz (48 dB/octave)',
              'Re-upload to Moises Desktop and select Lead Vocal vs. Backing Vocal Hi-Fi model',
            ],
            [
              'Automate vocal volume to −∞ dB during pauses',
              'Insert EQ Eight with High-Pass Filter at 100 Hz (48 dB/octave)',
              'Re-upload to Moises Desktop and select Lead Vocal vs. Backing Vocal Hi-Fi model',
            ],
            "The step text states to remedy bleed in order of severity: automate the vocal track's volume down to −∞ dB during vocal pauses; insert EQ Eight with a High-Pass Filter at 100 Hz (48 dB/octave); and, if bleed remains severe, re-upload the source file to Moises Desktop and select the specialized Lead Vocal vs. Backing Vocal Hi-Fi model.",
          ),
        ),
        step(
          'Lab: 16-bar hybrid reconstruction',
          [
            list(
              [
                'Take a 4-stem set from an authorized source.',
                'Retain the Vocal stem and the Others (melodic) stem.',
                'Completely replace the Drums and Bass stems with a newly programmed Drum Rack and an Operator synth patch.',
                'Balance the mix in Live’s Session Mixer.',
                'In USAGE-LOG.md, document which original stems were retained as audio and which parts were replaced with human-programmed MIDI and native synthesis.',
              ],
            ),
            prose(
              `Self-assessment: unwanted stem tracks were muted and replaced with native Live instruments
          (Operator and Drum Rack); vocal track pauses were cleaned using volume automation and
          high-pass filtering to remove background bleed; and the new rhythm section is audibly
          cleaner than the raw separated drum/bass stems.`,
            ),
          ],
          multi(
            'According to the instructions, which two stems from the 4-stem set must be retained as audio?',
            [
              'Vocal and Drums',
              'Vocal and Others (melodic)',
              'Drums and Bass',
              'Others (melodic) and Bass',
            ],
            [1],
            'The step text explicitly states to retain the Vocal stem and the Others (melodic) stem while replacing the Drums and Bass stems.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Replacing artifact-prone stems with native Live instruments while keeping the stems that already sound clean.',
      },
    ),
  ],
});
