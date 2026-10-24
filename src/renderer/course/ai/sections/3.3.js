/**
 * Section 3.3 — Convert Drums
 * Module 3 — Slice and Convert
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-03-Slice-And-Convert/
 *     Lesson-3.3.1-Convert-Drums-To-New-MIDI-Track.md
 *
 * The lesson file's frequency-band-to-pad ASCII box is promoted to a
 * diagram({layout:'chain'}) tracking the isolated drum stem through the
 * three frequency bands to their mapped pads. Per this section's
 * mustNotCover guardrail, the prose never promises perfect kit
 * classification — it states the algorithm explicitly, then dedicates a full
 * step to auditing and hand-correcting ghost hits and misclassified notes,
 * matching the lesson file's own emphasis that cleanup is expected work, not
 * a fallback for a broken feature.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §13.4/13.5
 * material the lesson file itself attributes to the Manual.
 *
 * This is the last section in Module 3, which closes with the syllabus's own
 * Gate B — Conversion path checkpoint; Level 3 and Gate B are wired into
 * ai/index.js in this same batch now that all three sections are authored.
 */
import {
  module_, lesson, step, prose, list, callout, diagram, sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m3-3',
  code: '3.3',
  title: 'Convert Drums',
  outcomes: ['Extract unpitched rhythm onto the preloaded Drum Rack and clean the mis-hits.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Convert an owned isolated break; convert a full mix; write which was usable'],
  checkpoints: ['Learner states why a drum stem is the better input'],
  lessons: [
    lesson(
      'ai-tools-music-l3-3-1',
      'Convert Drums to New MIDI Track',
      [
        step(
          'Frequency bands, not pitch, drive the mapping',
          [
            prose(
              `Convert Drums to New MIDI Track does not track pitch at all — it analyzes frequency-band
          energy across detected transient spikes and maps each band to a General MIDI drum note.
          Low-frequency spectral mass under roughly 150Hz maps to Kick (C1 / note 36); mid-frequency
          energy and noise bursts between roughly 200Hz and 2.5kHz map to Snare (D1 / note 38); and
          high-frequency transient spikes above roughly 3kHz map to closed hi-hat or percussion
          (F#1 / note 42).`,
            ),
            diagram(
              [
                { id: 'stem', label: 'Isolated drum stem' },
                { id: 'bandpass', label: 'Bandpass filterbank' },
                { id: 'kick', label: 'Kick pad (C1)', sub: '<150 Hz' },
                { id: 'snare', label: 'Snare pad (D1)', sub: '200 Hz - 2.5 kHz noise' },
                { id: 'hat', label: 'Hi-hat pad (F#1)', sub: '>3 kHz' },
              ],
              [
                { from: 'stem', to: 'bandpass' },
                { from: 'bandpass', to: 'kick' },
                { from: 'bandpass', to: 'snare' },
                { from: 'bandpass', to: 'hat' },
              ],
              { layout: 'chain', caption: 'Convert Drums maps frequency bands, not pitch, onto a preloaded drum kit — kick, snare, and hi-hat pads.' },
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the step text, what does Convert Drums to New MIDI Track analyze to map to drum notes?',
            ['Pitch tracking', 'Frequency-band energy across transient spikes', 'Velocity curves', 'Sustained note durations'],
            1,
            'The step text states that Convert Drums to New MIDI Track analyzes frequency-band energy across detected transient spikes and maps each band to a General MIDI drum note.',
          ),
        ),
        step(
          'Isolated source in, isolated source out',
          [
            callout(
              'warning',
              'A full mix produces false triggers, not a usable groove',
              `Feeding a complete musical mix — bass, guitars, vocals, cymbals together — into Convert
           Drums causes low bass notes to trigger spurious kick hits and sibilant vocal consonants
           to trigger false hi-hat hits. Optimal conversion requires an isolated drum audio source,
           such as a drum stem pulled with Moises or SpleeterGUI.`,
            ),
            list(
              [
                'Import an isolated acoustic or electronic drum break (uncompressed WAV/AIFF).',
                'Open Clip View and zoom into the transient markers: confirm every kick, snare, and hat attack has an aligned marker, and delete markers sitting on reverberant tails or open cymbal washes.',
              ],
            ),
          ],
          mcq(
            'Why does feeding a full musical mix into Convert Drums produce a bad result?',
            [
              'It creates a usable groove with extra energy',
              'It causes low bass notes to trigger spurious kick hits and sibilant vocals to trigger false hi-hat hits',
              'It automatically aligns all transient markers correctly',
              'It works best with reverberant tails and open cymbal washes',
            ],
            1,
            'The step text explicitly states that a full mix produces false triggers because low bass notes trigger spurious kick hits and sibilant vocal consonants trigger false hi-hat hits, making it not a usable groove.',
          ),
        ),
        step(
          'Convert, then audit and clean by hand',
          [
            list(
              [
                'Right-click the audio clip and choose <strong>Convert Drums to New MIDI Track</strong> (or <code>Create</code> → <strong>Convert Drums to New MIDI Track</strong>). Live creates a new MIDI track named <code>[AudioClipName] Drums</code> with a default factory Drum Rack loaded on Kick, Snare, and Hi-Hat pads.',
                'Open the MIDI Editor (<code>Shift+Tab</code>) and audition the MIDI against the original audio. Identify and delete ghost hits — low-velocity hi-hat triggers or accidental kick doubles.',
                'Identify misclassified hits — for example a tom mistakenly landing on the snare pad (D1) — and drag those notes vertically to the correct pad.',
                'Swap individual drum samples by dragging one-shots from the Browser onto pads, or replace the whole Drum Rack with a custom preset.',
              ],
            ),
            prose(
              `This conversion is a starting point that always needs a pass of manual cleanup, not a
          finished groove on its own — Convert Drums does not promise perfect kit classification.
          Lab: run Convert Drums once on a full mix and once on an isolated drum stem of the same
          song, compare the false-trigger density between the two, then clean the isolated-stem
          result until it accurately mirrors the original performance.`,
            ),
          ],
          multi(
            'According to the step, which actions are part of cleaning up after running Convert Drums to New MIDI Track?',
            [
              'Delete ghost hits such as low-velocity hi-hat triggers',
              'Drag misclassified notes vertically to the correct pad',
              'Replace the whole Drum Rack with a custom preset',
              'Audition the MIDI against the original audio',
            ],
            [0, 1, 3],
            'The step text explicitly lists deleting ghost hits, identifying and dragging misclassified hits to the correct pad, and opening the MIDI Editor to audition the MIDI against the original audio as cleanup steps after conversion.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'How Convert Drums maps frequency bands to pads, why an isolated stem beats a full mix, and the hand-cleanup every conversion needs.',
      },
    ),
  ],
});
