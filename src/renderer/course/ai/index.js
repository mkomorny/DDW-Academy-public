/**
 * ai/index.js — assembles the AI Tools for Music Production levels and their
 * assessment gates. One track's worth of content; course/index.js combines
 * this with every other track into the TRACKS array.
 *
 * Rebuilt from Miranda's syllabus + per-lesson textbook files at
 * `Desktop\DDW ACADEMY - COURSE MATERIAL OVERHAUL\AI Tools for Music
 * Production Course\` (draft v3 — 13 required modules / 34 sections / 34
 * lessons / Gates A-K; Module 7, Live Suite Stem Separation, is explicitly
 * BONUS/PARKED per the syllabus and is not part of this progression).
 *
 * The full scaffold exists on disk — level01.js...level13.js in this folder,
 * sections/1.1.js...14.3.js — generated from the syllabus by
 * tools/convert/scaffold-ai.mjs (id/code/title/outcomes/practiceFocus/
 * checkpoints real; `sources`/`lessons` empty until hand-authored). A level
 * is only imported below once every module in it has real hand-authored
 * lessons, same rule as every other track (see tools/validate-course.mjs).
 *
 * Level 1 (Sections 1.1-1.2) was the first to reach that bar, 2026-08-18.
 * Module 1 has no gate of its own (orientation only — the syllabus's first
 * gate, Gate A, belongs to Module 2), so wiring Level 1 in adds no entry to
 * GATES below.
 *
 * Level 2 (Sections 2.1-2.2) reached the same bar the same day. Gate A's
 * requires text below comes from the syllabus's own "### Gate A — Studio
 * path" self-assess line.
 *
 * Level 3 (Sections 3.1-3.3) reached the same bar the same day. Gate B's
 * requires text below comes from the syllabus's own "### Gate B — Conversion
 * path" self-assess line, and from Lesson 3.3.1's own closing checkpoint
 * list.
 *
 * Level 4 (Sections 4.1-4.4) reached the same bar the same day. Gate C's
 * requires text below comes from the syllabus's own "### Gate C — MIDI
 * Tools" self-assess line.
 *
 * Level 5 (Sections 5.1-5.3) reached the same bar the same day. Moises
 * Desktop is not an Ableton product, so none of these three sections carry
 * a sources() block — its documentation has no entry in tools/reference/
 * known-sources.json, same treatment as Module 1's orientation sections.
 * Gate D's requires text below comes from the syllabus's own "### Gate D —
 * Moises path" self-assess line, and from Lesson 5.3.1's own closing
 * checkpoint list.
 *
 * Level 6 (Sections 6.1-6.2) reached the same bar the same day. Neither
 * spleetergui.com nor the Deezer Spleeter GitHub repo is an Ableton
 * source, so Section 6.1 carries no sources() block; Section 6.2 cites
 * 'Ableton Live 12 Manual' for the one row of its decision matrix and the
 * one downstream-routing claim that concern Live 12.3 Suite's own native
 * Separate Stems feature. Gate E's requires text below comes from the
 * syllabus's own "### Gate E — Local 2/4/5 Path" self-assess line.
 *
 * Level 7 (Live Suite Stem Separation) is intentionally never scaffolded —
 * BONUS/PARKED per the syllabus — so numbering jumps straight from Level 6
 * to Level 8 below; afterLevel matches level.number, not array position
 * (see learn.js's own lookup), so Gate F below correctly reads afterLevel: 8.
 *
 * Level 8 (Sections 8.1-8.3, Use stems and MIDI in Live) reached the
 * hand-authored bar 2026-08-18. All three sections cite real Ableton Live
 * 12 Reference Manual chapters (Ch. 9/§13.5 warping, Ch. 18/23/24 hybrid
 * replacement, Ch. 5/20 bouncing and archiving) — no citation gap this
 * module, unlike Modules 1/5/6. Gate F's requires text below combines the
 * syllabus's own module summary with Lesson 8.3.1's own closing "Gate F —
 * Stems in Live Self-Assessment Checkpoint" list.
 *
 * Level 9 (Sections 9.1-9.2, Claude, Grok, Gemini) reached the hand-authored
 * bar 2026-08-18. Section 9.1 cites 'Prompting best practices', 'Structured
 * outputs', and 'Reduce hallucinations' — all three whitelisted and matching
 * the lesson file's own cited local paths exactly, minus extension. Section
 * 9.2 carries no sources() block: it cites Suno's own Help documentation and
 * a generic "Claude / Grok Prompting Guides" reference, neither of which
 * resolves against known-sources.json — same treatment as Moises/SpleeterGUI
 * content in Modules 5 and 6, since no official Suno docs exist locally.
 * Gate G's requires text below combines the syllabus's own module summary
 * with Lesson 9.2.1's own closing "Gate G — Text Assistant Self-Assessment
 * Checkpoint" list.
 *
 * Level 10 (Sections 10.1-10.3, Suno) reached the hand-authored bar
 * 2026-08-18. No section carries a sources() block: Suno's own Help
 * Documentation and Terms of Service do not resolve against
 * known-sources.json, same treatment as Section 9.2. Gate H's requires text
 * below comes from Lesson 10.3.1's own closing "Gate H — Suno into Live
 * Self-Assessment Checkpoint" list.
 *
 * Level 11 (Sections 11.1-11.3, Ozone Master Assistant) reached the same bar
 * the same day. All three sections cite 'Ozone 12 user guide' — whitelisted,
 * matching the lesson files' own "iZotope Ozone 12 User Guide" citations
 * (the first iZotope citation to resolve in this course). Module 11 has no
 * gate of its own in the syllabus's own numbering — Gate H closes Module 10
 * and Gate I opens after Module 12 — so wiring Level 11 in adds no entry to
 * GATES below.
 *
 * Level 12 (Sections 12.1-12.2, Audiolens) reached the same bar the same
 * day. Section 12.1 carries no sources() block (the iZotope Audiolens
 * Official User Manual is not whitelisted, only the Ozone 12 User Guide is);
 * Section 12.2 cites 'Ozone 12 user guide'. Gate I's requires text below
 * comes from Lesson 12.2.1's own closing "Gate I — Assistive Master
 * Self-Assessment Checkpoint" list.
 *
 * Level 13 (Sections 13.1-13.2, Usage log and current Terms) reached the
 * same bar the same day. Neither section carries a sources() block: the
 * course syllabus itself, ISO/IEC 19790, vendor Terms of Service, and the
 * U.S. Copyright Office Policy Statement none resolve against
 * known-sources.json. Gate J's requires text below comes from Lesson
 * 13.2.1's own closing "Gate J — Usage Log & Terms Self-Assessment
 * Checkpoint" list.
 *
 * Level 14 (Sections 14.1-14.3, Combined jobs) reached the same bar the same
 * day — completing all 13 required modules of this course (Module 7 stays
 * BONUS/PARKED per the syllabus). Sections 14.1 and 14.2 cite 'Ableton Live
 * 12 Manual'; Section 14.3 cites both 'Ozone 12 user guide' and 'Ableton
 * Live 12 Manual' — all whitelisted, matching each lesson file's own cited
 * manual chapters. Gate K's requires text below comes from Lesson 14.3.1's
 * own closing "Gate K — Multi-Tool Integration Self-Assessment Checkpoint"
 * list.
 */
import level01 from './level01.js';
import level02 from './level02.js';
import level03 from './level03.js';
import level04 from './level04.js';
import level05 from './level05.js';
import level06 from './level06.js';
import level08 from './level08.js';
import level09 from './level09.js';
import level10 from './level10.js';
import level11 from './level11.js';
import level12 from './level12.js';
import level13 from './level13.js';
import level14 from './level14.js';

export const LEVELS = [
  level01, level02, level03, level04, level05, level06, level08, level09,
  level10, level11, level12, level13, level14,
];

/** Assessment gates, from the syllabus's own "### Gate X" headings — only
 *  gates whose level is fully authored appear here; the rest join as their
 *  level does. */
export const GATES = [
  {
    id: 'A',
    afterLevel: 2,
    title: 'Gate A — Studio path',
    requires: 'a Live Set exists; import folders are inside the Project; `STUDIO-SHEET.md` is filled; WAV is the stated interchange format when the plan allows.',
  },
  {
    id: 'B',
    afterLevel: 3,
    title: 'Gate B — Conversion path',
    requires: 'one Slice Rack, one Melody conversion, one Harmony conversion, and one Drums conversion, all from files the learner has a right to use, with preview instruments replaced and false triggers cleaned up by hand.',
  },
  {
    id: 'C',
    afterLevel: 4,
    title: 'Gate C — MIDI Tools',
    requires: 'one transformed phrase, one Rhythm drum clip, and one Stacks progression, with Auto Apply behavior demonstrated.',
  },
  {
    id: 'D',
    afterLevel: 5,
    title: 'Gate D — Moises path',
    requires: 'at least three discrete stem files (or the 2-track pair on the Free tier) from an authorized source, loaded into the Live Set and fully compiled via Collect All and Save, with the active plan tier and export format logged in STUDIO-SHEET.md and USAGE-LOG.md.',
  },
  {
    id: 'E',
    afterLevel: 6,
    title: 'Gate E — Local 2/4/5 path',
    requires: 'the stem components for 2-stem, 4-stem, and 5-stem models recited from memory; a 4-stem separation (via SpleeterGUI on Windows or Moises on macOS) imported into Live; Deezer\'s license disclaimer embedded in USAGE-LOG.md; and the appropriate stem separator selected without hesitation based on host edition and OS.',
  },
  {
    id: 'F',
    afterLevel: 8,
    title: 'Gate F — Stems in Live',
    requires: 'at least one multi-stem project fully configured and aligned in Live 12; the strict Warp → Transient Refine → Convert to MIDI sequence executed; at least one stem part replaced with a native Live instrument (Operator or Drum Rack) driven by extracted or human-composed MIDI; a non-destructive bounce performed, preserving raw stems and processed audio in the project container; and full source authorization and provenance documented in USAGE-LOG.md.',
  },
  {
    id: 'G',
    afterLevel: 9,
    title: 'Gate G — Text Assistant',
    requires: 'a Session Fact Sheet converted into an actionable Markdown mixing checklist, with at least three of its items verified directly in Ableton Live 12; and a curated Suno Custom Mode prompt kit (Style String, Exclude String, structured Lyrics) hand-edited from the assistant\'s draft, with zero artist names and 100% original lyrics, saved in the active Live Project folder.',
  },
  {
    id: 'H',
    afterLevel: 10,
    title: 'Gate H — Suno into Live',
    requires: 'at least one Suno audio file successfully imported and warped into an active Ableton Live 12 Set; the active subscription plan tier and downloaded file format (WAV or MP3) logged in USAGE-LOG.md; at least one major musical component replaced with human-programmed synthesis or live performance; and a compliant two-sentence Human Authorship Statement recorded in the project documentation.',
  },
  {
    id: 'I',
    afterLevel: 12,
    title: 'Gate I — Assistive Master',
    requires: 'a Master Assistant pass successfully executed and calibrated against a custom Audiolens or file-imported target profile; an A/B evaluation conducted with Gain Match enabled comparing the custom curve against a factory genre target; Gain Match disengaged prior to rendering the final 24-bit linear PCM master export; and target names, intensity settings, analysis timestamps, and final mastering decisions documented in USAGE-LOG.md.',
  },
  {
    id: 'J',
    afterLevel: 13,
    title: 'Gate J — Usage Log & Terms',
    requires: 'a complete USAGE-LOG.md container in the root of the active Live Project; every separation, generative, conversion, and mastering run fully documented with exact dates, settings, and file paths; all four mandatory contractual and statutory terms quotations embedded without paraphrasing; and all physical filenames and disk directories strictly matching the documented log entries.',
  },
  {
    id: 'K',
    afterLevel: 14,
    title: 'Gate K — Multi-Tool Integration',
    requires: 'Workflow A (Stem Deconstruction & Rhythm Rebuild), Workflow B (Generative Seed to Arrangement), and Workflow C (Assistive Mastering) all successfully executed; at least two major musical components verified as human-composed or synthesized using native Live instruments; paired pre-master and post-master 24-bit linear PCM audio files generated; and a fully completed USAGE-LOG.md with all three operational workflows documented and verified against files on disk.',
  },
];
