/**
 * piano/index.js — assembles the Piano Playing for Beginners levels and their
 * assessment gates. One track's worth of content; course/index.js combines
 * this with every other track into the TRACKS array.
 *
 * The hand-authored "Foundations of Piano" course (8 levels / 48 lessons,
 * ids `l0-1-1`…) was retired 2026-08-16 to make way for a full rebuild from
 * Miranda's rewritten textbook at
 * `Desktop\DDW ACADEMY - COURSE MATERIAL OVERHAUL\Piano for Beginners`
 * (16 modules / 51 sections / 252 lessons, syllabus approved 2026-08-16).
 * See HANDOFF.md for the batch-by-batch rebuild status.
 *
 * The full scaffold already exists on disk — `level01.js`…`level16.js` in
 * this folder, `sections/1.1.js`…`16.3.js` — generated from the syllabus by
 * `tools/convert/scaffold-piano.mjs` (id/code/title/outcomes/sources/
 * practiceFocus/checkpoints, all real; most modules still `lessons: []`).
 * DELIBERATELY NOT IMPORTED HERE UNTIL AUTHORED: every module in
 * `tools/validate-course.mjs`'s walk must have at least one real lesson, so
 * wiring a level in before its modules are actually authored would fail
 * validation immediately. A level gets added to LEVELS/GATES below only once
 * every one of its modules has real hand-authored lessons — see HANDOFF.md's
 * authoring-loop status for which level that is right now.
 *
 * Level 1 (Sections 1.1–1.3) was the first to reach that bar, 2026-08-17.
 * Gate A's afterLevel/requires below come from Section 1.3's own Gate A
 * Assessment Audit — the same 5 items now in that section's checkpoints[].
 *
 * Level 2 (Sections 2.1–2.3) reached the same bar, 2026-08-17. Gate B's
 * afterLevel/requires below come from Section 2.3's own Gate B Assessment
 * Audit — the same 5 items now in that section's checkpoints[].
 *
 * Level 3 (Sections 3.1–3.3) reached the same bar, 2026-08-17. Gate C's
 * afterLevel/requires below come from Section 3.3's own Gate C Assessment
 * Audit — the same 4 items now in that section's checkpoints[].
 *
 * Level 4 (Sections 4.1–4.3) reached the same bar, 2026-08-17. Module 4 has
 * no gate of its own in the syllabus's Assessment Summary (the next gate,
 * Gate D, belongs to Module 5 — Section 5.3), so wiring Level 4 in adds no
 * new entry to GATES below.
 *
 * Level 5 (Sections 5.1–5.3) reached the same bar, 2026-08-17. Gate D's
 * afterLevel/requires below come from Section 5.3's own Gate D Assessment
 * Audit — the same 4 items now in that section's checkpoints[].
 *
 * Level 6 (Sections 6.1–6.3) reached the same bar, 2026-08-17. Gate E's
 * afterLevel/requires below come from Section 6.3's own Gate E Assessment
 * Audit — the same 4 items now in that section's checkpoints[].
 *
 * Level 7 (Sections 7.1–7.3) reached the same bar, 2026-08-17. Module 7 has
 * no gate of its own in the syllabus's Assessment Summary (the next gate,
 * Gate F, belongs to Module 8 — Section 8.3), so wiring Level 7 in adds no
 * new entry to GATES below — the same shape as Module 4's wiring.
 *
 * Level 8 (Sections 8.1–8.3) reached the same bar, 2026-08-17. Gate F's
 * afterLevel/requires below come from Section 8.3's own Gate F Assessment
 * Audit — the same 4 items now in that section's checkpoints[].
 *
 * Level 9 (Sections 9.1–9.3) reached the same bar, 2026-08-17 — authored as
 * part of a 4-section chained batch (9.2, 9.3, 10.1, 10.2) under Miranda's
 * explicit one-time override. Gate G's afterLevel/requires below come from
 * Section 9.3's own Gate G Assessment Audit — the same 5 items now in that
 * section's checkpoints[].
 *
 * Level 10 (Sections 10.1–10.4) reached the same bar, 2026-08-17 — 10.3 and
 * 10.4 authored as part of a second 4-section chained batch (10.3, 10.4,
 * 11.1, 11.2) under Miranda's explicit chaining instruction. Gate H's
 * afterLevel/requires below come from Section 10.4's own Gate H Assessment
 * Audit — the same 5 items now in that section's checkpoints[].
 *
 * Level 11 (Sections 11.1–11.4) reached the same bar, 2026-08-17 — 11.3 and
 * 11.4 authored as part of a third 4-section chained batch (11.3, 11.4,
 * 12.1, 12.2) under Miranda's second explicit chaining instruction. Module
 * 11 has no gate of its own in the syllabus's Assessment Summary (the next
 * gate, Gate I, belongs to Module 12 — Section 12.4), so wiring Level 11 in
 * adds no new entry to GATES below — the same shape as Modules 4 and 7.
 *
 * Level 12 (Sections 12.1–12.4) reached the same bar, 2026-08-18 — 12.3 and
 * 12.4 authored as part of a fourth 4-section chained batch (12.3, 12.4,
 * 13.1, 13.2) under Miranda's third explicit chaining instruction. Gate I's
 * afterLevel/requires below come from Section 12.4's own Gate I Assessment
 * Audit — the same 5 items now in that section's checkpoints[].
 *
 * Level 13 (Sections 13.1–13.3) reached the same bar, 2026-08-18 — 13.3
 * authored as part of a fifth 4-section chained batch (13.3, 14.1, 14.2,
 * 14.3) under Miranda's fourth explicit chaining instruction. Module 13 has
 * no gate of its own in the syllabus's Assessment Summary (the next gate,
 * Gate J, belongs to Module 14 — Section 14.3), so wiring Level 13 in adds
 * no new entry to GATES below — the same shape as Modules 4, 7, and 11.
 *
 * Level 14 (Sections 14.1–14.3) reached the same bar in that same batch.
 * Gate J's afterLevel/requires below come from Section 14.3's own Gate J
 * Assessment Audit — the same 4 items now in that section's checkpoints[].
 *
 * Level 15 (Sections 15.1–15.3, The Pedal) reached the same bar, 2026-08-18.
 * Module 15 has no gate of its own in the syllabus's Assessment Summary (the
 * next gate, Gate K, belongs to Module 16 — the course's last module), so
 * wiring Level 15 in adds no new entry to GATES below — the same shape as
 * Modules 4, 7, 11, and 13.
 *
 * Level 16 (Sections 16.1–16.3, Modes, Studio, and Capstone) reached the
 * same bar, 2026-08-18 — the course's last module, completing all 51
 * sections / 16 modules. Gate K's afterLevel/requires below come from
 * Section 16.3.2's own "Gate K: The Master Graduation Certificate Audit"
 * (§4 of the source file) — the same 4 items now in that section's
 * checkpoints[]. Section 16.1's modal content uses real `scaleExplorer()`
 * panels for all of the mined library's church-mode scale ids (`ionian-
 * scales` through `locrian-scales`), each backed by a `pcSet` assert.
 * Section 16.2's one uncited primary source (a bare `Ableton Live 12
 * Standard Manual` folder path, no filename) was resolved by matching
 * against tools/reference/known-sources.json's own corpus title, "Ableton
 * Live 12 Standard User Manual" — see that section file's own header note.
 */
import level01 from './level01.js';
import level02 from './level02.js';
import level03 from './level03.js';
import level04 from './level04.js';
import level05 from './level05.js';
import level06 from './level06.js';
import level07 from './level07.js';
import level08 from './level08.js';
import level09 from './level09.js';
import level10 from './level10.js';
import level11 from './level11.js';
import level12 from './level12.js';
import level13 from './level13.js';
import level14 from './level14.js';
import level15 from './level15.js';
import level16 from './level16.js';

export const LEVELS = [level01, level02, level03, level04, level05, level06, level07, level08, level09, level10, level11, level12, level13, level14, level15, level16];

/** Assessment gates, from the syllabus' Assessment Summary — only gates whose
 *  level is fully authored appear here; the rest join as their level does. */
export const GATES = [
  {
    id: 'A',
    afterLevel: 1,
    title: 'Gate A',
    requires: 'Instrument verified; ergonomic seating; relaxed hand dome; written 20–30 min practice template; three practice days logged',
  },
  {
    id: 'B',
    afterLevel: 2,
    title: 'Gate B',
    requires: 'All white keys named on sight; Middle C located eyes-closed; both names given for any black key; E–F and B–C known as half steps from memory; a whole step built from any key without error',
  },
  {
    id: 'C',
    afterLevel: 3,
    title: 'Gate C',
    requires: 'Hot Cross Buns played from memory with correct RH fingering (3-2-1), no visual hesitations; the piece performed against a 60 BPM metronome without rushing or dragging; relaxed C House dome maintained with inactive fingers quiet; RH melody played while LH holds a sustained Bass C drone without releasing early',
  },
  {
    id: 'D',
    afterLevel: 5,
    title: 'Gate D',
    requires: 'C, G, D, A, E Major and Minor pentascales performed hands separately with 100% correct pitch and accidental execution; smooth transition between LH Tonic (C+G) and Dominant (B+G) chords with minimal physical displacement; Hot Cross Buns performed with RH melody and LH I-V chord changes at a steady, unbroken 60 BPM pulse; Treble G, Middle C, and Bass F named and located in under 2 seconds',
  },
  {
    id: 'E',
    afterLevel: 6,
    title: 'Gate E',
    requires: 'Two complete two-hand pieces recorded: unedited, continuous performances of Piece A (Are You Sleeping) and Piece B (Ode to Joy); unbroken metric pulse across both hands with zero stops or hesitations during chord changes or eighth-note runs; independent hand dynamics with RH melody clearly audible above the LH chord accompaniment; physical ease and relaxation with shoulders relaxed, forearms level, and wrists supple throughout both recorded performances',
  },
  {
    id: 'F',
    afterLevel: 8,
    title: 'Gate F',
    requires: 'Dynamic staircase mastery: audible contrast across all 6 dynamic levels (pp, p, mp, mf, f, ff) on a single key using controlled arm mass; expressive repertoire performance of a known two-hand piece (Ode to Joy or Frère Jacques) with planned dynamic shaping (p ↔ f) and clean articulation (legato vs. staccato); Italian score literacy — can define Andante, Allegro, Crescendo, Ritardando, Cantabile, D.C. al Fine, and Fine without consulting notes; established warm-up habit — executes the 5-minute warm-up protocol (Adele Marcus stretch, Hanon wrist-drop, Jazer Lee contrary pentascale) before every session',
  },
  {
    id: 'G',
    afterLevel: 9,
    title: 'Gate G',
    requires: 'Interval mastery: can construct and name all intervals (m2 through P8) from C and G with 100% accuracy; 1-octave scales (HS): can perform C Major and A Natural Minor full 1-octave scales hands separately with standard thumb-under fingering (1-2-3-1-2-3-4-5); key signature recognition (0-2 accidentals): can instantly name C, G, D, F, B♭ Major and their relative minors from printed key signatures; sharp and flat mnemonics: can recite "Father Charles Goes Down And Ends Battle" and its reverse from memory; scale vs. key articulation: can clearly explain the difference between a key and a scale',
  },
  {
    id: 'H',
    afterLevel: 10,
    title: 'Gate H',
    requires: 'Circle of Fifths drawn: can draw the complete 12-key Circle of Fifths with major and relative minor keys from memory in under 3 minutes; two major scales from contrasting families: can perform two major scales from different fingering families (e.g., G Major and B♭ Major) 1 octave HS at steady 72 BPM; one minor scale in all three forms: can perform one minor scale (e.g., D Minor) in Natural, Harmonic, and Classical Melodic forms with 100% correct pitch alteration; chromatic scale 1-octave mastery: can perform the 1-octave Chromatic scale HS and HT (Contrary Motion) using standard 1-3 / 1-2 fingering with zero pauses; unbroken metric tempo: all scale assessments executed without stopping, resetting, or rushing',
  },
  {
    id: 'I',
    afterLevel: 12,
    title: 'Gate I',
    requires: 'Two distinct accompaniment styles performed: a complete continuous performance featuring both Blocked/Pulsing Chords and Broken/Alberti Accompaniments in one piece; voice-led harmonic progressions: all chord transitions (C → G → Am → F) utilize smooth, inverted voice leading with zero erratic hand jumping; unbroken transition continuity: the metric pulse remains steady and unbroken across the transition bar between Verse and Chorus; cross-hand cadence execution: concludes with a clean, pedaled 3-octave Cross-Hand Arpeggio flourish; audible dynamic balancing: accompaniment volume remains properly subordinate beneath melodic leads',
  },
  {
    id: 'J',
    afterLevel: 14,
    title: 'Gate J',
    requires: 'Complete lead sheet concert arrangement: have recorded an unedited, continuous performance of a full lead sheet arrangement (Amazing Grace or equivalent); multi-chorus textural contrast: performance clearly incorporates a 4-bar atmospheric Intro, a Verse with broken accompaniment (Model 1/2), a Climax Chorus with harmonized melody chords (Model 3), and a grand Outro arpeggio sweep; top-voice melody projection: RH melody notes remain clearly audible and singing above all underlying chord tones and bass notes; metric authority and pedal cleanliness: steady 3/4 tempo pulse maintained throughout, sustain pedal changes clean and free of harmonic blurring',
  },
  {
    id: 'K',
    afterLevel: 16,
    title: 'Gate K',
    requires: 'Complete 3-piece recital recorded: an unedited, continuous concert performance containing one classical score-reading piece, one multi-pattern accompaniment étude, and one self-directed lead sheet or modal arrangement; theory and harmonic mastery: can construct any Major, Minor, Diminished, or Augmented triad, voice-lead diatonic Roman numeral progressions (I, ii, IV, V, vi), and diagram the 12-key Circle of Fifths and the 7 church modes; technical and biomechanical rigor: relaxed gravitational arm weight, loose-wrist trampoline rebounds, flawless thumb-under passes, and clean syncopated pedaling without mud; notation literacy: reads Grand Staff notation fluently from Low C2 to High C6 inclusive of ledger lines and 0–2 key signatures',
  },
];
