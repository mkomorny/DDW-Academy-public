/**
 * Section 12.1 — Blocked Chords, Pulsing Quarters, and Off-Beat Accompaniment
 * Module 12 — Accompaniment Patterns
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_12_Accompaniment_Patterns/
 * Section_12.1_Blocked_Chords_Pulsing_Quarters_Offbeats.md), read in full
 * before authoring. First section of Module 12 — authored together with
 * 11.3, 11.4, and 12.2 under Miranda's second explicit chaining instruction.
 * This section alone does NOT complete Module 12 (12.3-12.4 remain), so
 * Level 12 stays unwired after this batch.
 *
 * Conversion notes:
 * - This section is about rhythmic texture and dynamic balance, not new
 *   pitch/interval/key claims — the four blocked-chord textures reuse the
 *   C major triad (already asserted repeatedly across Module 11) as their
 *   example harmony, so no new `asserts` are introduced here; every claim
 *   is procedural/dynamic (hold duration, articulation, dynamic marking),
 *   matching the treatment prior fingering/technique-only lessons received.
 * - `rhythm()` is reused for its generic durational-pulse role (as in the
 *   drums course) rather than for pitch content — 12.1.1's sustained
 *   whole-chord anchor is `rhythm([4])`, 12.1.2's driving pulse is
 *   `rhythm([1,1,1,1])`. The block plays a single fixed reference pitch per
 *   hit, which is the correct teaching tool here since the lesson's own
 *   point is the felt rhythmic pulse, not the harmony (already taught).
 * - 12.1.4's off-beat "skank" pattern needs rests on the downbeats, which
 *   `rhythm()`'s duration-only pattern array can't express (no rest value
 *   in its NAMES map) — stays a literal `table()` reproducing the source's
 *   own "1 & 2 & 3 & 4 &" grid instead, same "block where it fits, table
 *   where the source is already a clean grid" rule used throughout.
 * - Check-drafting provenance: all step checks were drafted via the xAI
 *   client and entailment-verified before being spliced in — see the
 *   batch's HANDOFF/LOG entry for the pass/fail tally.
 */
import { module_, lesson, step, prose, table, rhythm, callout, sources, mcq } from '../../schema.js';

export default module_({
  lessons: [
    lesson(
      'piano-l12-1-1',
      'Texture 1: The Sustained Anchor',
      [
        step(
          'Dropping Arm Weight for a Held Harmonic Pad',
          [
            prose(
              '<p>The most fundamental accompaniment role is providing an acoustic harmonic pad. Execution: drop arm weight into the full triad (or 5th dyad) on Beat 1 and hold it for the full duration. The Physical Rule: keep the fingers resting gently on the keytops for the entire duration (1-2-3-4). Do not pull away or release early.</p>',
            ),
            rhythm([4], { title: 'The Sustained Anchor', bpm: 76, caption: 'One whole-note chord, held through all 4 beats — do not release early.' }),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'What is the physical rule for executing the fundamental acoustic harmonic pad accompaniment?',
            ['Lift the hand completely after striking on beat 1', 'Keep the fingers resting gently on the keytops for the entire duration', 'Release the keys on beat 3 to create pulse', 'Play the triad only on beats 2 and 4'],
            1,
            'The step text states: keep the fingers resting gently on the keytops for the entire duration (1-2-3-4). Do not pull away or release early.',
          ),
        ),
      ],
      { minutes: 5 },
    ),
    lesson(
      'piano-l12-1-2',
      'Texture 2: Pulsing Quarters (The Pop Driving Engine)',
      [
        step(
          'The Wrist Trampoline',
          [
            prose(
              '<p>In pop and rock piano (The Beatles, Adele, Coldplay), pulsing quarter notes provide both harmonic content and tempo momentum. Execution: strike the chord firmly on every metronome click (1-2-3-4). The wrist must flex gently on each downstroke and rebound slightly upward — a "wrist trampoline."</p>',
            ),
            rhythm([1, 1, 1, 1], { title: 'Pulsing Quarters', bpm: 76, caption: 'Strike the chord firmly on every beat: 1-2-3-4.' }),
            callout('warning', 'Never Stiffen the Forearm', 'Never stiffen the forearm during repeated chords, or fatigue will occur within 30 seconds. Let the wrist flex on each downstroke and rebound slightly upward.'),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'What must the wrist do on each downstroke when playing pulsing quarter-note chords?',
            ['Remain completely still', 'Flex gently and rebound slightly upward', 'Stiffen the forearm', 'Lock in a fixed position'],
            1,
            'The step text states that the wrist must flex gently on each downstroke and rebound slightly upward — a "wrist trampoline."',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l12-1-3',
      'Texture 3: Split-Hand Bass / Chord ("Boom-Chick")',
      [
        step(
          'Splitting the Bass Root from the Harmonic Color',
          [
            prose(
              '<p>The Boom-Chick pattern splits the root bass function from the harmonic color. On Beat 1 ("Boom"), LH Finger 5 strikes the low root (e.g., low C). On Beats 2, 3, and 4 ("Chick"), LH Fingers 3 and 1 strike the upper harmony (e.g., E+G). Genre roots: folk, country, polka, stride piano, and classic pop ballads.</p>',
            ),
            table(
              ['Beat', 'LH element', 'Label'],
              [
                ['1', 'C (Bass, Finger 5)', 'BOOM'],
                ['2', 'E + G (Dyad, Fingers 3+1)', 'CHICK'],
                ['3', 'G (Bass, Finger 5)', 'BOOM'],
                ['4', 'E + G (Dyad, Fingers 3+1)', 'CHICK'],
              ],
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'In the Boom-Chick pattern, what does the left hand play on Beats 2, 3, and 4?',
            ['Low root with Finger 5', 'Upper harmony dyad with Fingers 3 and 1', 'Full chord with all fingers', 'Nothing'],
            1,
            'The step text states that on Beats 2, 3, and 4 ("Chick"), LH Fingers 3 and 1 strike the upper harmony (e.g., E+G).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
    lesson(
      'piano-l12-1-4',
      'Texture 4: The Off-Beat Syncopated Skank',
      [
        step(
          'Playing Exclusively on the "And" of the Beat',
          [
            prose(
              '<p>In reggae, ska, disco, and contemporary EDM/pop piano, the metronome clicks on the downbeats (1, 2, 3, 4) while the piano plays exclusively on the upbeat subdivisions ("and"): count "1 AND 2 AND 3 AND 4 AND." Articulation: chords must be played as crisp, dry staccato releases — drop arm weight instantly and bounce off the keybed like rubber.</p>',
            ),
            table(
              ['Count', '1', '&', '2', '&', '3', '&', '4', '&'],
              [
                ['LH chord', 'rest', 'C+E+G', 'rest', 'C+E+G', 'rest', 'C+E+G', 'rest', 'C+E+G'],
              ],
            ),
            sources(['Piano Chords for Beginners.pdf']),
          ],
          mcq(
            'According to the table in the step text, on which counts does the left hand play the C+E+G chord?',
            ['1 and 3', '2 and 4', 'every upbeat (&)', 'only on beat 1'],
            2,
            'The step text\'s table shows the LH chord on every upbeat: after 1, 2, 3, and 4.',
          ),
        ),
      ],
      { minutes: 7 },
    ),
    lesson(
      'piano-l12-1-5',
      'Dynamic Layering: Voicing the Melody Over Harmony',
      [
        step(
          'The RH Melody Must Sing Above the LH Chords',
          [
            prose(
              '<p>A common beginner flaw is playing LH chords at the same volume as RH melodies, creating an unintelligible din. The dynamic-balancing law: RH Melody (Soprano Lead) at f (Forte) must sound clearly louder than LH Accompaniment at mp (Mezzo Piano). Biomechanical technique: deliver roughly 70% of upper-body gravitational weight into the Right Hand while supporting the Left Hand lightly from the shoulder.</p>',
            ),
            callout('key', 'Dynamic Balance Law', 'RH Melody: f (Forte) ≫ LH Accompaniment: mp (Mezzo Piano). Deliver about 70% of upper-body gravitational weight into the Right Hand.'),
            sources(['Piano Skill Levels Explained.pdf']),
          ],
          mcq(
            'According to the dynamic-balancing law, how should the volume of the RH melody compare to the LH accompaniment?',
            ['RH at mp and LH at f', 'RH at f and LH at mp with RH clearly louder', 'Both hands at the same volume', 'RH at mf and LH at pp'],
            1,
            'The step text explicitly states the dynamic-balancing law: RH Melody (Soprano Lead) at f (Forte) must sound clearly louder than LH Accompaniment at mp (Mezzo Piano).',
          ),
        ),
      ],
      { minutes: 6 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m12-1-ex-a',
      type: '4-texture accompaniment circuit',
      title: 'Protocol 12.1-A — 4-Texture Accompaniment Circuit (I-V-vi-IV in C)',
      prompt: 'Set metronome to 76 BPM. Round 1 (Held Anchor): play whole-note chords (C → G → Am → F). Round 2 (Pulsing Quarters): play 4 quarter chords per measure. Round 3 (Boom-Chick): play Low Root on Beat 1, Dyad on Beats 2-3-4. Round 4 (Off-Beats): play crisp staccato chords on the "and" of every beat.',
    },
  ],
  checkpoints: [
    'Pulsing endurance: can play 16 bars of continuous quarter-note chords with a relaxed, flexible wrist without fatigue.',
    'Boom-Chick precision: can coordinate a low bass root on Beat 1 with upper dyads on Beats 2-4 with zero metric drag.',
    'Off-beat synchronization: can play steady syncopated up-beats against a metronome downbeat.',
    'Dynamic separation: demonstrates audible dynamic separation between a loud RH melody (f) and quiet LH chords (mp).',
  ],
  outcomes: [
    'Execute the Held Sustained Anchor: dropping whole-note or half-note chord mass on Beat 1.',
    'Execute Pulsing Quarter Chords: maintaining an unbroken four-beat drive (*Let It Be* / Elton John pop ballad style).',
    'Perform the Split-Hand Bass/Chord ("Boom-Chick") accompaniment: striking the bass root on Beat 1 and the upper dyad/triad on Beats 2, 3, and 4.',
    'Execute Off-Beat Syncopated Chords: placing chord stabs exclusively on the "and" of the beat (Reggae skank / Ska / Funk).',
    'Apply dynamic voice-balancing laws: keeping LH accompaniment at mp while RH melody sings at f.',
  ],
  sources: ['Piano Chords for Beginners.pdf', 'Piano Skill Levels Explained.pdf'],
  practiceFocus: ['One progression, two blocked textures, melody louder than LH.'],
  id: 'piano-m12-1',
  code: '12.1',
  title: 'Blocked Chords, Pulsing Quarters, and Off-Beat Accompaniment',
});
