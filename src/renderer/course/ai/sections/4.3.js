/**
 * Section 4.3 — Generate: Rhythm, Seed, Shape
 * Module 4 — MIDI Tools
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-04-MIDI-Tools/
 *     Lesson-4.3.1-Generate-Tools-Rhythm-Seed-Shape.md
 *
 * The lesson file's generator-capability ASCII box is promoted to a
 * table() — three tools' parameter lists side by side. Per this section's
 * mustNotCover guardrail, Seed is described exactly as the lesson file
 * frames it — "a constrained pseudo-random generator" with bounding boxes
 * for pitch/duration/velocity — and is never called a melody model or any
 * AI/ML term.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §11.3.1-
 * 11.3.3 material the lesson file itself attributes to the Manual.
 */
import {
  module_, lesson, step, prose, list, table, callout, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m4-3',
  code: '4.3',
  title: 'Generate: Rhythm, Seed, Shape',
  outcomes: ['Build a drum pattern and a pitched line from empty (or selected) time.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['8-bar Rhythm across three pads; one Shape line in a named scale'],
  checkpoints: ['Learner can start Rhythm from the Generate chooser without help'],
  lessons: [
    lesson(
      'ai-tools-music-l4-3-1',
      'Generate Tools: Rhythm, Seed, and Shape',
      [
        step(
          'Three generators, three different jobs',
          [
            table(
              ['Tool', 'Key parameters', 'What it does'],
              [
                ['Rhythm', 'Steps (1-16), Density, Split, Shift, Velocity/Accent', 'Writes a percussive pattern onto a single pitch lane or Drum Rack pad'],
                ['Seed', 'Pitch/Velocity/Duration ranges, Voices (1-8), Density', 'A constrained pseudo-random generator: fills a bounding box of pitch, duration, and velocity ranges with notes'],
                ['Shape', 'Curve preset or drawn shape, Rate, Tie, Density, Jitter', 'Converts a geometric contour (sine, ramp, triangle, custom) into a pitched melodic line'],
              ],
              'The three required Generate tools and what each one writes.',
            ),
            prose(
              `Seed is a constrained pseudo-random generator, not a melody model — it fills the pitch,
          duration, and velocity ranges given to it with notes, it does not learn or predict a
          melody. All three need either an empty clip or a clear time selection so Generate does
          not overwrite notes the learner wants to keep.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What does the Seed tool actually do according to the description?',
            [
              'Predicts and generates a realistic melody',
              'Fills a bounding box of pitch, duration, and velocity ranges with notes',
              'Converts a geometric contour into a pitched melodic line',
              'Writes a percussive pattern onto a single pitch lane or Drum Rack pad',
            ],
            1,
            'The step text explicitly states that Seed is a constrained pseudo-random generator that fills a bounding box of pitch, duration, and velocity ranges with notes.',
          ),
        ),
        step(
          'Rhythm on a Drum Rack, one pad at a time',
          [
            list(
              [
                'Insert a Drum Rack on an empty MIDI track, create an empty 2-bar clip (<code>Ctrl+Shift+M</code> / <code>Cmd+Shift+M</code>), open Generate → Rhythm.',
                '<strong>Kick:</strong> hold <code>Alt</code> (Win) / <code>Option</code> (Mac) and click the Kick lane (C1) to target it — this generates onto that pad only, without overwriting the other lanes. Set Steps 16, Density 4 hits, adjust Pattern for beats 1 and 3, Apply.',
                '<strong>Snare:</strong> Alt/Option-click the Snare lane (D1). Set Steps 16, Density 2 hits, use Shift to move the hits to beats 2 and 4, Apply.',
                '<strong>Hi-Hat:</strong> Alt/Option-click the Closed Hat lane (F#1). Set Density 12 hits, Split step 8 to 3 for a triplet roll, raise Accent, Apply.',
              ],
            ),
            callout(
              'key',
              'Alt/Option-click is what keeps pads independent',
              `Without holding Alt (Windows) or Option (macOS) while clicking a Drum Rack lane, Rhythm
           generates across the whole kit instead of one targeted pad — every earlier pad's pattern
           would be overwritten.`,
            ),
          ],
          mcq(
            'What happens if you do NOT hold Alt (Win) / Option (Mac) while clicking a Drum Rack lane before generating a Rhythm pattern?',
            [
              'The pattern is generated only on the targeted pad',
              'The pattern is generated across the whole kit and overwrites earlier pads',
              'The pattern is generated only on the hi-hat pad',
              'Steps and Density settings are ignored',
            ],
            1,
            "The step text states that without holding Alt/Option while clicking a Drum Rack lane, Rhythm generates across the whole kit instead of one targeted pad — every earlier pad's pattern would be overwritten.",
          ),
        ),
        step(
          'Seed and Shape with Scale turned on',
          [
            list(
              [
                'On a second MIDI track with Operator, create a 4-bar clip and enable Scale (for example G Minor).',
                'Open Generate → Shape, pick a curve preset (for example Sawtooth Down), set Rate 1/8, Density 90%, Jitter 10%, Apply — the resulting bass contour lands strictly on the enabled scale\'s degrees.',
                'Highlight bars 3-4 of the same clip, open Generate → Seed, set Voices 3, Pitch Range G3-D5, Duration Range 1/8-1/2, Apply — Seed populates that region with a chordal cluster while leaving the Shape-generated bass notes in bars 1-2 untouched.',
              ],
            ),
            prose(
              `Lab: build an 8-bar rhythm section — a multi-pad Rhythm pattern using targeted pad
          generation, an 8-bar Shape bassline with Scale on, and a Seed accent across the last two
          bars — then manually adjust velocities and delete at least three notes to finish it by
          hand.`,
            ),
          ],
          mcq(
            'What happens to the bass notes in bars 1-2 when you apply Generate → Seed to bars 3-4 of the clip?',
            [
              'They are replaced with chordal clusters',
              'They are left untouched',
              'They are transposed up an octave',
              'They are deleted',
            ],
            1,
            'The step text states that Seed populates that region with a chordal cluster while leaving the Shape-generated bass notes in bars 1-2 untouched.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Targeted Rhythm generation on Drum Rack pads, and Seed/Shape with Clip Scale turned on to keep generated pitches inside the mode.',
      },
    ),
  ],
});
