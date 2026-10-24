/**
 * Section 16.2 — Modern Studio Workflow: The Launchkey MK4, MIDI CC, DAW Sequencing, and Sampler Engines
 * Module 16 — Modes, Studio, and Capstone
 *
 * Hand-converted from the textbook file (Desktop/DDW ACADEMY - COURSE
 * MATERIAL OVERHAUL/Piano for Beginners/Module_16_Modes_Studio_Capstone/
 * Section_16.2_Modern_Studio_Workflow_Launchkey_Ableton_MIDI.md), read in
 * full before authoring.
 *
 * CITATION GAP RESOLVED (see the scaffold's own header note and the plan's
 * "errors found" table, issue 3a): the source file's §2 cites the bare
 * folder `B:\Documents\TRAINING DOCS\User Manuals\Ableton\Ableton Live 12
 * Standard Manual\` (no filename) for USB-MIDI / clip record-Capture / MIDI
 * editing chapter content. Searched tools/reference/known-sources.json for
 * the closest resolvable title and found "Ableton Live 12 Standard User
 * Manual" — the same document under its actual corpus title — and added it
 * to this module's `sources[]`. Used only where the section's own content is
 * genuinely Ableton-Live-specific (16.2.3's quantization/humanization
 * workflow), not stretched to cover the Novation-hardware content that the
 * scaffold's other 4 sources already ground.
 *
 * Conversion notes:
 * - §3's CC table (CC64/CC1/CC11/PB) converts to a real `table()`.
 * - §3's Velocity Multisample Switching Matrix gives exact numeric velocity
 *   breakpoints (1–35, 36–70, 71–105, 106–127) attributed to "a sample
 *   library such as SINE Grand" — but the section's own §2 explicitly flags
 *   that Orchestral Tools SINE Player has no manual anywhere in the corpus
 *   and instructs treating velocity-layer claims as `{type:'gap'}` unless a
 *   library copy is added later. Followed that instruction literally:
 *   16.2.2's first step teaches the general velocity-multisample-switching
 *   CONCEPT (grounded in the digital-piano-vs-keyboard source) and uses a
 *   `gap()` block for the specific numeric breakpoints rather than stating
 *   them as a verified fact — the first `gap()` use in this course.
 * - §4's two Methodological Traps fold into a closing `callout('warning', …)`
 *   in Lesson 16.2.3, matching every other section this course.
 * - §6's 3-item Self-Assessment list replaces the scaffold's generic
 *   `checkpoints[]`. §5's Protocol 16.2-A becomes the module's one exercise.
 * - No `asserts` anywhere — CC value ranges, velocity curves, and
 *   quantization percentages are studio-workflow facts, not scale/chord/
 *   interval/key-signature claims the theory oracle can check (same shape
 *   as 15.1's pure-mechanics content).
 * - Check-drafting provenance: every step below ships with `check: null` as
 *   authored; checks are drafted afterward via
 *   tools/author/draft-step-checks.mjs grounded in each step's own text plus
 *   this module's outcomes, entailment-verified, then hand-spliced back in —
 *   prose is never model-written.
 */
import { module_, lesson, step, prose, table, callout, gap, sources, mcq } from '../../schema.js';

export default module_({
  id: 'piano-m16-2',
  code: '16.2',
  title: 'Modern Studio Workflow: The Launchkey MK4, MIDI CC, DAW Sequencing, and Sampler Engines',
  outcomes: [
    'Trace and configure the complete USB-MIDI signal flow from the Novation Launchkey MK4 into Ableton Live 12.',
    'Map and automate core MIDI Continuous Controllers: CC64 (Damper Sustain), CC1 (Modulation Wheel / Dynamics), and CC11 (Expression / Volume).',
    'Configure keyboard velocity response curves (Soft, Normal, Hard, Fixed) to match physical playing weight with virtual instrument multisample layers.',
    'Explain how multi-velocity sample engines (*SINE / Kontakt*) switch between distinct recorded acoustic dynamic layers (Pianissimo to Fortissimo).',
    'Apply non-destructive MIDI editing in Ableton Live 12: selective grid quantization (16th / 8th) vs. velocity humanization (groove templates and velocity randomization ± 5).',
  ],
  sources: [
    'Learning Piano with Launchkey',
    `Playing the Launchkey 61's keyboard`,
    'Launchkey 61 hardware overview',
    `Using the Launchkey's built-in features`,
    'Difference between a digital piano and a keyboard.pdf',
    'Ableton Live 12 Standard User Manual',
  ],
  practiceFocus: ['Sound from Live or SINE; default octave; one recorded MIDI take.'],
  lessons: [
    lesson(
      'piano-l16-2-1',
      'The MIDI Continuous Controller (CC) Standard',
      [
        step(
          'Continuous Controllers: CC64, CC1, CC11, and Pitch Bend',
          [
            prose(
              '<p>While note data conveys pitch and strike velocity, expressive performance nuances are transmitted via <strong>Continuous Controllers (CC)</strong> spanning values from 0 to 127.</p>',
            ),
            table(
              ['CC #', 'Controller Name', 'Musical Production Function'],
              [
                ['CC64', 'Sustain / Damper', '0–63 = Pedal Up; 64–127 = Pedal Down (lifts dampers).'],
                ['CC1', 'Modulation Wheel', 'Controls vibrato depth or dynamic crossfade across orchestral instruments.'],
                ['CC11', 'Expression', 'Sub-volume scaling for crescendo / diminuendo dynamic shaping inside MIDI clips.'],
                ['PB', 'Pitch Bend', 'High-resolution microtonal pitch glides.'],
              ],
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'According to the table, what does a CC64 value between 64 and 127 do?',
            ['Pedal Up', 'Pedal Down (lifts dampers)', 'Controls vibrato depth', 'Sub-volume scaling for crescendo'],
            1,
            'The step text states in the table that for CC64 Sustain / Damper, 64–127 = Pedal Down (lifts dampers).',
          ),
        ),
      ],
      { minutes: 10 },
    ),
    lesson(
      'piano-l16-2-2',
      'Velocity Curves & Multisample Layer Switching',
      [
        step(
          'How Multisample Libraries Switch Dynamic Layers',
          [
            prose(
              '<p>A sample library does not just make a single recording louder; it contains separate audio recordings captured at several distinct physical striking forces, and MIDI velocity chooses which recording plays — a mechanism called <strong>multisample layer switching</strong>, spanning from Pianissimo (soft, warm) up to Fortissimo (bright, brassy).</p>',
            ),
            gap(
              'The textbook illustrates this with a specific 4-layer MIDI-velocity breakpoint matrix for "a sample library such as SINE Grand" (Orchestral Tools SINE Player). No manual for that instrument exists anywhere in the corpus to verify those exact numeric ranges, so the specific breakpoints are not taught here as a verified fact — only the general concept that higher velocity values select brighter, louder recorded layers.',
            ),
            sources(['Difference between a digital piano and a keyboard.pdf']),
          ],
          mcq(
            'What does MIDI velocity do inside a sample library according to the text?',
            ['Makes a single recording louder', 'Chooses which of several recorded striking-force layers plays', 'Applies a volume envelope after the sound starts', 'Randomizes the brightness of every note'],
            1,
            'The step text explicitly states that MIDI velocity chooses which recording plays in the multisample layer switching mechanism that spans from Pianissimo to Fortissimo.',
          ),
        ),
        step(
          'Hardware Velocity Curve Calibration (Launchkey MK4)',
          [
            prose(
              '<p>The Launchkey MK4\'s velocity curve setting reshapes how physical playing weight maps onto the 0–127 MIDI velocity range sent to those multisample layers.</p>',
            ),
            table(
              ['Curve', 'Physical Effect', 'Best Use'],
              [
                ['Soft Curve', 'Requires less physical arm weight to trigger high velocities (f/ff).', 'Light, fast synthesizer lines.'],
                ['Normal / Linear Curve', 'Standard 1:1 response for balanced playing.', 'Balanced acoustic piano playing.'],
                ['Hard Curve', 'Requires substantial physical arm mass to reach 127.', 'Training classical arm weight and preventing accidental harsh clatter.'],
              ],
            ),
            sources(['Learning Piano with Launchkey', `Playing the Launchkey 61's keyboard`]),
          ],
          mcq(
            'According to the table, which velocity curve on the Launchkey MK4 requires less physical arm weight to trigger high velocities (f/ff)?',
            ['Normal / Linear Curve', 'Soft Curve', 'Hard Curve', 'Fixed Curve'],
            1,
            'The step text states that the Soft Curve "Requires less physical arm weight to trigger high velocities (f/ff)" and is best for light, fast synthesizer lines.',
          ),
        ),
      ],
      { minutes: 12 },
    ),
    lesson(
      'piano-l16-2-3',
      'Quantization vs. Expressive Humanization',
      [
        step(
          'The Professional Quantize/Humanize Balance',
          [
            prose(
              '<p>When sequencing piano tracks in Ableton Live 12, hard-quantizing every single note attack to a rigid 16th-note grid destroys human rubato and makes a concert grand sound like a cheap mechanical ringtone — this is the <strong>100% Quantize Error</strong>.</p>',
            ),
            table(
              ['Technique', 'Setting', 'Effect'],
              [
                ['Quantize Amount', '50%–70% (not 100%)', 'Gently tightens loose timing errors while preserving human micro-timing.'],
                ['Velocity Randomization', '± 3 to 5 values', 'Replicates natural micro-variations in finger weight.'],
              ],
            ),
            callout(
              'warning',
              'Studio traps',
              '<p><strong>Hard-quantizing 100% of note attacks in expressive piano pieces</strong> — piano music requires human micro-timing; use 50–70% strength or none at all. <strong>Drawing static velocity (100) for every chord in a MIDI clip</strong> — vary velocities so the correct acoustic multisample dynamic layers trigger.</p>',
            ),
            sources(['Ableton Live 12 Standard User Manual']),
          ],
          mcq(
            'What Quantize Amount range is recommended to tighten timing while preserving human micro-timing in piano tracks?',
            ['0%', '100%', '50%–70%', '±3 to 5'],
            2,
            'The step text explicitly states that a Quantize Amount of 50%–70% (not 100%) gently tightens loose timing errors while preserving human micro-timing.',
          ),
        ),
      ],
      { minutes: 10 },
    ),
  ],
  exercises: [
    {
      id: 'piano-m16-2-ex-a',
      type: 'Studio drill',
      title: 'Protocol 16.2-A — Studio MIDI Recording & Editing Loop',
      prompt: 'Arm a MIDI track in Ableton Live 12 with a hosted piano sound (Live or SINE). Record an 8-measure expressive progression with sustain pedal. Open the MIDI Clip Editor and inspect the CC64 pedal lane and note velocity bars. Apply 60% groove quantization and verify the performance retains expressive human rubato.',
    },
  ],
  checkpoints: [
    'Signal Chain Understanding: can explain how MIDI Note On, Velocity, and CC64 data route from the Launchkey MK4 into Ableton Live.',
    'Velocity Curve Selection: knows how to select Normal vs. Hard velocity curves for acoustic piano training.',
    'DAW Editing: demonstrates non-destructive MIDI editing and partial quantization without destroying musical feel.',
  ],
});
