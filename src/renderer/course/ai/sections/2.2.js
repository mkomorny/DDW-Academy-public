/**
 * Section 2.2 — Formats this course uses
 * Module 2 — Live folders and WAV interchange
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-02-Live-Folders-And-WAV-Interchange/
 *     Lesson-2.2.1-Audio-Interchange-Formats-And-Sample-Rates.md
 *
 * The lesson file's PCM-vs-lossy fidelity-hierarchy ASCII box is folded into
 * prose plus the tool-by-tool format table (same information, no diagram()
 * call — the two tiers aren't a signal-flow graph, and the format matrix
 * table already carries the per-tool specifics the diagram was gesturing
 * at). The direct Manual quote is carried as a callout('source', …), the
 * closest built-in variant to a block quotation.
 *
 * `sources` cites 'Ableton Live 12 Manual' for the §13.5/ch.20 material —
 * the lesson file's own Moises/Suno/Spleeter citations stay uncited per the
 * whitelist gap noted in sections/1.1.js's header.
 */
import {
  module_, lesson, step, prose, list, table, callout, sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m2-2',
  code: '2.2',
  title: 'Formats this course uses',
  outcomes: [
    'Prefer WAV into Live. State each tool\'s documented export list.',
  ],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['Import one owned WAV and one MP3 into Live; note which you would Convert'],
  checkpoints: ['Learner states the format each required tool can give them on their plan'],
  lessons: [
    lesson(
      'ai-tools-music-l2-2-1',
      'Audio Interchange Formats and Sample Rates',
      [
        step(
          'Why the codec matters before it even reaches Convert',
          [
            prose(
              `Audio fidelity during interchange between a standalone AI tool and Live directly
          decides how accurate downstream processing is — stem separation, audio-to-MIDI
          conversion, mastering. Uncompressed PCM (WAV/AIFF, 24-bit, 44.1-48kHz) preserves
          transient phase and peaks exactly; lossy codecs (MP3/M4A, 128-320kbps) cut everything
          above roughly 16kHz and smear transients through their compression filterbank, which
          then confuses pitch and drum tracking downstream.`,
            ),
            callout(
              'source',
              'Ableton Live 12 Reference Manual, §13.5',
              `"For optimal results when converting audio to MIDI, use uncompressed, high-quality
           audio recordings (WAV or AIFF). Lossy formats like MP3 introduce pre-echo artifacts and
           smearing around transients, which can cause erratic pitch detection and spurious note
           triggering."`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'According to the step text, which audio format is recommended for interchange to ensure accurate stem separation, audio-to-MIDI conversion, and mastering?',
            [
              'MP3 at 320 kbps',
              'Uncompressed PCM (WAV/AIFF, 24-bit, 44.1-48 kHz)',
              'M4A at 256 kbps',
              'Any lossy codec above 16 kHz',
            ],
            1,
            'The step text explicitly states that Uncompressed PCM (WAV/AIFF, 24-bit, 44.1-48kHz) preserves transient phase and peaks exactly and cites the Live 12 manual recommending uncompressed high-quality WAV or AIFF for optimal audio-to-MIDI results.',
          ),
        ),
        step(
          'The format each tool actually promises',
          [
            table(
              ['Tool', 'Documented export formats', 'Plan/tier restriction', 'Preferred interchange'],
              [
                ['Ableton Live 12', 'WAV, AIFF, FLAC, MP3', 'All editions', 'WAV, 24-bit, 44.1 or 48kHz'],
                ['Moises Desktop', 'WAV, M4A, MP3', 'WAV needs Premium/Pro', 'WAV (320kbps MP3 only on Free)'],
                ['SpleeterGUI', 'WAV, 16-bit/44.1kHz linear PCM', 'Free, local', 'WAV (fixed native output)'],
                ['Suno', 'WAV, MP3', 'WAV needs Pro/Premier', 'WAV; import MP3 on Free and log the format'],
                ['Ozone 12', 'Real-time host processing / WAV bounce', 'Follows the DAW host', 'WAV, 24-bit or 32-bit float'],
              ],
              'What each tool in this course can actually export, by plan.',
            ),
          ],
          multi(
            'Which tools in this course document WAV as one of their export formats?',
            [
              'Ableton Live 12',
              'Moises Desktop',
              'SpleeterGUI',
              'Suno',
              'Ozone 12',
            ],
            [0, 1, 2, 3, 4],
            'The step text\'s table explicitly lists WAV in the "Documented export formats" column for every tool: Ableton Live 12, Moises Desktop, SpleeterGUI, Suno, and Ozone 12.',
          ),
        ),
        step(
          'Export from Live, then ingest cleanly',
          [
            list(
              [
                'Export: select the loop brace or a time range, open Export Audio/Video (Ctrl+Shift+R / Cmd+Shift+R), set Rendered Track to Master (or All Individual Tracks for stems), File Type WAV, Sample Rate matching the Set, Bit Depth 24-bit, Dither off for stems / Triangular or Pow-r 3 for a final 16-bit master.',
                'Ingest: locate the file from Moises, Spleeter, or Suno. If it is lossy (.mp3/.m4a), do not apply aggressive spectral gating or multi-pass resampling without documenting it. Drag it onto an empty Audio Track, open Clip View (Shift+Tab), verify the format and sample rate in the title bar, then Collect All and Save.',
              ],
            ),
            prose(
              `Lab: encode an MP3 copy of an owned WAV drum loop (or download a Suno MP3 generation),
          import both onto adjacent tracks, zoom into the kick's initial transient at maximum
          resolution, and note the pre-echo waveform variance the MP3 codec introduces.`,
            ),
          ],
          mcq(
            'According to the Export instructions, what should you set Rendered Track to when exporting stems?',
            [
              'Master',
              'All Individual Tracks',
              'Master (or All Individual Tracks for stems)',
              'Rendered Track is not mentioned',
            ],
            2,
            'The step text states to set Rendered Track to Master (or All Individual Tracks for stems).',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Why WAV is the interchange standard for this course, and exactly what format each required tool actually hands back.',
      },
    ),
  ],
});
