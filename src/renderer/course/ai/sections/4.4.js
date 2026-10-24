/**
 * Section 4.4 — Stacks and Euclidean
 * Module 4 — MIDI Tools
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-04-MIDI-Tools/
 *     Lesson-4.4.1-Advanced-Generators-Stacks-And-Euclidean.md
 *
 * Per this section's mustNotCover guardrail, the Stacks chord engine's
 * Tonnetz basis is named but not reproduced as a custom JSON schema — no
 * Ableton KB article on that schema is attached to this lesson, so the
 * prose stays at the operating-procedure level the syllabus itself asks for
 * (pick a chord, set its inversion/duration, add the next chord).
 *
 * This is the last section in Module 4, which closes with the syllabus's
 * own Gate C — MIDI Tools checkpoint; Level 4 and Gate C are wired into
 * ai/index.js in this same batch now that all four sections are authored.
 *
 * `sources` cites 'Ableton Live 12 Manual' (whitelisted) for the §11.3.4-
 * 11.3.5 material the lesson file itself attributes to the Manual.
 */
import {
  module_, lesson, step, prose, list, table, sources, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m4-4',
  code: '4.4',
  title: 'Stacks and Euclidean',
  outcomes: ['Write a progression with Stacks; write a multi-voice rhythm with Euclidean.'],
  sources: ['Ableton Live 12 Manual'],
  practiceFocus: ['8-bar Stacks into Operator; Euclidean hats vs kick'],
  checkpoints: ['Learner opens Euclidean from the Generate chooser'],
  lessons: [
    lesson(
      'ai-tools-music-l4-4-1',
      'Stacks and Euclidean',
      [
        step(
          'A chord engine and a polyrhythm engine',
          [
            table(
              ['Tool', 'Key parameters', 'What it does'],
              [
                ['Stacks', 'Chord selector (Tonnetz-based), Inversion, Spread, Duration, Strum, Offset', 'Builds a chord-by-chord progression; with Scale on, the chord palette is constrained to diatonic chords in that mode'],
                ['Euclidean', 'Up to 4 voices, Steps (N), Pulses (K), Division, Rotation/Shift', 'Distributes K pulses evenly across N steps per voice (the Bjorklund algorithm), producing polyrhythmic percussion when voices use different N/K ratios'],
              ],
              'The two required advanced generators and what each writes.',
            ),
            prose(
              `Stacks is operated from its chord timeline — pick a chord, set its inversion and
          duration, click Add Chord, repeat. Euclidean is operated per voice — each of its four
          voices gets its own Steps/Pulses/Division/Shift, and each voice can be routed to a
          different Drum Rack pad.`,
            ),
            sources(['Ableton Live 12 Manual']),
          ],
          mcq(
            'What does the Stacks generator build when the Scale option is turned on?',
            [
              'Any chromatic chords',
              'Diatonic chords constrained to the current mode',
              'Random arpeggios',
              'Only root-position triads',
            ],
            1,
            'The step text states that with Scale on, the chord palette in Stacks is constrained to diatonic chords in that mode.',
          ),
        ),
        step(
          'Worked lab: one Stacks progression',
          [
            list(
              [
                'Load Operator on an empty MIDI track (an electric piano or pad preset), create an 8-bar clip, enable Scale set to F Minor.',
                'Open Generate → Stacks. Add four chords in the timeline: Fmin7 (root, 2 bars), Dbmaj7 (1st inversion, 2 bars), Bbmin7 (2nd inversion, 2 bars), Cmin7 (root, 2 bars).',
                'Set Spread to +1 and Strum to 15ms to add a natural, non-simultaneous keyboard feel, then Apply.',
              ],
            ),
          ],
          mcq(
            'In the step for creating a chord progression with Stacks, what is the exact sequence and inversion specified for the four chords?',
            [
              'Fmin7 root (2 bars), Dbmaj7 1st inv (2 bars), Bbmin7 2nd inv (2 bars), Cmin7 root (2 bars)',
              'Fmin7 1st inv (2 bars), Dbmaj7 root (2 bars), Bbmin7 root (2 bars), Cmin7 2nd inv (2 bars)',
              'Fmin7 root (4 bars), Dbmaj7 root (4 bars)',
              'Cmin7 root (2 bars), Bbmin7 2nd inv (2 bars), Dbmaj7 1st inv (2 bars), Fmin7 root (2 bars)',
            ],
            0,
            'The step text explicitly lists the four chords with their inversions and lengths as Fmin7 (root, 2 bars), Dbmaj7 (1st inversion, 2 bars), Bbmin7 (2nd inversion, 2 bars), Cmin7 (root, 2 bars).',
          ),
        ),
        step(
          'Worked lab: one Euclidean four-voice rhythm',
          [
            list(
              [
                'Insert a new MIDI track with a Drum Rack, create an empty 4-bar clip, open Generate → Euclidean.',
                'Voice 1 (Kick, C1): Steps 16, Pulses 4, Division 1/16 — an even 4-on-the-floor pulse.',
                'Voice 2 (Snare, D1): Steps 16, Pulses 2, Shift +4 steps — places snares on beats 2 and 4.',
                'Voice 3 (Hi-Hat, F#1): Steps 16, Pulses 7, Division 1/16 — an uneven, syncopated pattern.',
                'Voice 4 (Percussion, G#1): Steps 12, Pulses 5 — a different step length than the other three voices, phasing against the 16-step grid over the 4 bars.',
              ],
            ),
            prose(
              `Click Apply. Lab: build an 8-bar Stacks progression in a scale of choice, an accompanying
          4-voice Euclidean groove, replace the Stacks channel's Operator patch with a custom
          polyphonic preset, and hand-adjust velocities in the MIDI Editor to finish it.
          <strong>Gate C — MIDI Tools:</strong> a transformed phrase, a Rhythm drum clip, and a
          Stacks progression, with Auto Apply behavior demonstrated, closes this module.`,
            ),
          ],
          mcq(
            'What are the Steps, Pulses, and Division settings used for the Kick (Voice 1) in the Euclidean groove example?',
            [
              'Steps 16, Pulses 4, Division 1/16',
              'Steps 16, Pulses 2, Shift +4 steps',
              'Steps 16, Pulses 7, Division 1/16',
              'Steps 12, Pulses 5',
            ],
            0,
            'The step text states: Voice 1 (Kick, C1): Steps 16, Pulses 4, Division 1/16 — an even 4-on-the-floor pulse.',
          ),
        ),
      ],
      {
        minutes: 10,
        intro: 'Building a chord progression with Stacks and a four-voice polyrhythm with Euclidean.',
      },
    ),
  ],
});
