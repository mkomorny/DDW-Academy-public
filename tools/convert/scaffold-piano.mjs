#!/usr/bin/env node
/**
 * scaffold-piano.mjs — one-time generator that turns Miranda's approved
 * Piano syllabus (the course MAP — outcomes, sources, practice, checkpoints,
 * lesson id/title rosters) into the app's scaffold files: 16 level*.js +
 * 51 sections/*.js, each a real module_()/level() object with EMPTY
 * `lessons: []`. It never touches lesson BODY content — the syllabus states
 * ids/titles/outcomes, not prose, and the section markdown files (the
 * textbook bodies) are hand-converted lesson-by-lesson in the authoring
 * loop (see HANDOFF.md), not by this script.
 *
 * Bespoke to Piano's syllabus format on purpose: every course pack in the
 * Desktop overhaul uses a different structure (6 schemes across 11 packs —
 * see the implementation plan), so a generic multi-course scaffold
 * generator isn't a meaningful target. Each course gets its own version of
 * this script at its own turn.
 *
 * Run: node tools/convert/scaffold-piano.mjs [--write]
 *   (no flag)  dry run — prints a summary and any parse/citation problems,
 *              writes nothing. Use this to check the syllabus still parses
 *              cleanly before generating anything.
 *   --write    generates piano/level01.js … level16.js and
 *              piano/sections/*.js. Does NOT touch piano/index.js — wiring
 *              a level into LEVELS/GATES only happens once every module in
 *              that level has real authored lessons (see validate-course's
 *              "every module needs lessons" rule); doing it earlier would
 *              fail the very first `node tools/validate-course.mjs` run
 *              after this script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCitation } from './resolve-citation.mjs';
import { delatexPlain } from './delatex.mjs';
import { emitModule } from '../author/lib/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SYLLABUS_PATH = path.join(
  'C:', 'Users', '<you>', 'Desktop', 'DDW ACADEMY - COURSE MATERIAL OVERHAUL',
  'Piano for Beginners', 'Piano Playing for Beginners - Course Syllabus.md',
);
const PIANO_DIR = path.join(ROOT, 'src', 'renderer', 'course', 'piano');
const SECTIONS_DIR = path.join(PIANO_DIR, 'sections');

const WRITE = process.argv.includes('--write');

/* ------------------------------------------------------------- parsing -- */

const src = fs.readFileSync(SYLLABUS_PATH, 'utf8');

// Bound to the 16 real Modules only — Bonus A/B/C use a different heading
// ("# Bonus X —") and field shape (no Job:, A.1/A.2 ids not N.M.L, no
// Practice/Checkpoint on B/C) and are out of scope for this pass.
const firstModuleIdx = src.indexOf('# Module 1 —');
const firstBonusIdx = src.indexOf('# Bonus A —');
if (firstModuleIdx === -1 || firstBonusIdx === -1) {
  throw new Error('scaffold-piano: could not find the Module 1 / Bonus A boundary markers — syllabus format may have changed.');
}
const modulesText = src.slice(firstModuleIdx, firstBonusIdx);

const moduleRe = /^# Module (\d+) — (.+?)\s*$/gm;
const moduleMatches = [...modulesText.matchAll(moduleRe)];

// Hard problems mean the PARSER is broken (a section with no outcomes, no
// lesson rows, etc.) and must block --write. Citation gaps are informational
// — a folder-only or unresolved citation is a known content-authoring issue
// to flag for whoever authors that section later (see the plan's "errors
// found" table, issue 3a), not a reason to refuse writing the scaffold.
const problems = [];
const citationGaps = [];
const modules = [];

for (let i = 0; i < moduleMatches.length; i++) {
  const m = moduleMatches[i];
  const number = Number(m[1]);
  const title = delatexPlain(m[2].trim());
  const start = m.index + m[0].length;
  const end = i + 1 < moduleMatches.length ? moduleMatches[i + 1].index : modulesText.length;
  const chunk = modulesText.slice(start, end);

  // delatexPlain on every field pulled from the syllabus, even fields
  // confirmed LaTeX-free today (module/section titles, Skill band, Job) —
  // cheap, idempotent, and this script is meant to be re-run if Miranda
  // edits the syllabus later, at which point that guarantee might not hold.
  const skillBandRaw = (chunk.match(/^\*\*Skill band:\*\*\s*(.+?)\s*$/m) || [])[1] || null;
  const jobRaw = (chunk.match(/^\*\*Job:\*\*\s*(.+?)\s*$/m) || [])[1] || null;
  const skillBand = skillBandRaw ? delatexPlain(skillBandRaw) : null;
  const job = jobRaw ? delatexPlain(jobRaw) : null;
  if (!skillBand) problems.push(`Module ${number}: no "Skill band" line found`);
  if (!job) problems.push(`Module ${number}: no "Job" line found`);

  // ------------------------------------------------------------ sections
  const sectionRe = /^## Section (\d+\.\d+) — (.+?)\s*$/gm;
  const sectionMatches = [...chunk.matchAll(sectionRe)];
  const sections = [];

  for (let j = 0; j < sectionMatches.length; j++) {
    const sm = sectionMatches[j];
    const code = sm[1];
    const sTitle = delatexPlain(sm[2].trim());
    const sStart = sm.index + sm[0].length;
    const sEnd = j + 1 < sectionMatches.length ? sectionMatches[j + 1].index : chunk.length;
    const sChunk = chunk.slice(sStart, sEnd);

    const outcomesBlock = (sChunk.match(/\*\*Outcomes\*\*\s*\n((?:- .+\n?)+)/) || [])[1] || '';
    const outcomes = outcomesBlock.split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());

    const lessonRows = [...sChunk.matchAll(/^\|\s*(\d+\.\d+\.\d+)\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*$/gm)]
      .map((r) => ({ address: r[1], slug: r[2], title: delatexPlain(r[3].trim()) }));

    const mustCover = (sChunk.match(/^\*\*mustCover:\*\*\s*(.+?)\s*$/m) || [])[1] || null;
    const mustNotCover = (sChunk.match(/^\*\*mustNotCover:\*\*\s*(.+?)\s*$/m) || [])[1] || null;
    const primarySourcesLine = (sChunk.match(/^\*\*Primary sources:\*\*\s*(.+?)\s*$/m) || [])[1] || '';
    const practice = (sChunk.match(/^\*\*Practice:\*\*\s*(.+?)\s*$/m) || [])[1] || null;
    const checkpointMatch = sChunk.match(/^\*\*Checkpoint(?:\s*—\s*Gate\s*([A-Z]))?:\*\*\s*(.+?)\s*$/m);
    const gateLetter = checkpointMatch?.[1] || null;
    const checkpoint = checkpointMatch?.[2] || null;

    if (!outcomes.length) problems.push(`Section ${code}: no outcomes parsed`);
    if (!lessonRows.length) problems.push(`Section ${code}: no lesson rows parsed`);
    if (!practice) problems.push(`Section ${code}: no Practice line parsed`);
    if (!checkpoint) problems.push(`Section ${code}: no Checkpoint line parsed`);

    // Resolve each cited path to a whitelisted title. Folder-only citations
    // (no filename) are reported, never silently dropped — see the plan's
    // "errors found" table, issue 3a: Section 16.2 has 3 of these that need
    // a real filename from Miranda before that section is AUTHORED (not
    // before it's scaffolded — the module still gets whatever sources DID
    // resolve, and the gap is flagged here for the record).
    // Backtick-delimited match, not split('·') — a '·'-separated field can
    // carry its own trailing annotation OUTSIDE the backticks (Section
    // 16.2's `...\Ableton Live 12 Standard Manual\` (MIDI / recording
    // chapters)`), which a naive split leaves attached to the path.
    const rawPaths = [...primarySourcesLine.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const resolvedSources = [];
    const sectionGaps = [];
    for (const p of rawPaths) {
      const res = resolveCitation(p);
      if (res.ok) {
        if (!resolvedSources.includes(res.title)) resolvedSources.push(res.title);
      } else {
        const note = `citation "${p}" — ${res.reason}${res.basename ? ` ("${res.basename}")` : ''}`;
        citationGaps.push(`Section ${code}: ${note}`);
        sectionGaps.push(note);
      }
    }

    sections.push({
      code, title: sTitle,
      outcomes: outcomes.map(delatexPlain),
      lessonRows,
      mustCover, mustNotCover,
      sources: resolvedSources,
      practice: practice ? delatexPlain(practice) : null,
      checkpoint: checkpoint ? delatexPlain(checkpoint) : null,
      gateLetter,
      citationGaps: sectionGaps,
    });
  }

  modules.push({ number, title, skillBand, job, sections });
}

if (modules.length !== 16) problems.push(`Expected 16 modules, parsed ${modules.length}`);
const totalSections = modules.reduce((n, m) => n + m.sections.length, 0);
if (totalSections !== 51) problems.push(`Expected 51 sections, parsed ${totalSections}`);
const totalLessons = modules.reduce((n, m) => n + m.sections.reduce((k, s) => k + s.lessonRows.length, 0), 0);
if (totalLessons !== 252) problems.push(`Expected 252 lessons, parsed ${totalLessons}`);

console.log(`Parsed ${modules.length} modules, ${totalSections} sections, ${totalLessons} lessons.`);
if (problems.length) {
  console.log(`\n${problems.length} PARSE problem(s) — these block --write:`);
  for (const p of problems) console.log('  ✗', p);
} else {
  console.log('No parse problems.');
}
if (citationGaps.length) {
  console.log(`\n${citationGaps.length} citation gap(s) — informational, do NOT block --write, embedded in the affected section file(s) for whoever authors them:`);
  for (const g of citationGaps) console.log('  ~', g);
}

if (!WRITE) {
  console.log('\nDry run — no files written. Re-run with --write to generate the scaffold.');
  process.exit(problems.length ? 1 : 0);
}
if (problems.length) {
  console.error('\nRefusing to write with unresolved PARSE problems above — fix the syllabus or this parser first.');
  process.exit(1);
}

/* ------------------------------------------------------------ codegen --- */

// Scalar-string escaping for the LEVEL file's own top-level fields only
// (id/title/skillBand/summary — short, single-line, low-risk). The section
// files' actual data (outcomes/sources/practiceFocus/checkpoints, which
// carry real prose with embedded quotes) goes through emitModule() below
// instead, reusing the real house emitter rather than approximating its
// escaping cascade a second time.
const lit = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function sectionFileBody(mod, sec) {
  const data = {
    id: `piano-m${sec.code.replace('.', '-')}`,
    code: sec.code,
    title: sec.title,
    outcomes: sec.outcomes,
    sources: sec.sources,
    practiceFocus: [sec.practice],
    checkpoints: [sec.checkpoint],
    lessons: [],
  };
  const roster = sec.lessonRows.map((r) => ` *   ${r.address}  ${r.slug}  — ${r.title}`).join('\n');
  return `/**
 * Section ${sec.code} — ${sec.title}
 * Module ${mod.number} — ${mod.title}
 *
 * Scaffold only (generated by tools/convert/scaffold-piano.mjs from the
 * approved syllabus) — outcomes/sources/practiceFocus/checkpoints are real,
 * \`lessons\` is intentionally empty until this section is hand-authored
 * from its textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Piano for Beginners/
 *     Module_${String(mod.number).padStart(2, '0')}_.../Section_${sec.code}_....md
 *
 * Lesson roster to build (id — title), from the syllabus's own table —
 * fill \`lessons\` with one lesson() per row, same order, same ids:
${roster}
 *
 * mustCover (authoring guardrail, not app data): ${sec.mustCover || '(none stated)'}
 * mustNotCover (authoring guardrail, not app data): ${sec.mustNotCover || '(none stated)'}${
   sec.citationGaps.length
     ? `\n *\n * CITATION GAP — resolve before authoring this section (see the plan's\n * "errors found" table, issue 3a):\n${sec.citationGaps.map((g) => ` *   - ${g}`).join('\n')}`
     : ''
 }
 */
import { module_ } from '../../schema.js';

export default ${emitModule(data)};
`;
}

function levelFileBody(mod) {
  const varNames = mod.sections.map((s) => `s${s.code.replace('.', '_')}`);
  const imports = mod.sections.map((s, i) => `import ${varNames[i]} from './sections/${s.code}.js';`).join('\n');
  const num = String(mod.number).padStart(2, '0');
  return `/**
 * Module ${mod.number} — ${mod.title}
 * Scaffold only (generated by tools/convert/scaffold-piano.mjs) — see each
 * section file's own header for its lesson roster and authoring guardrails.
 */
${imports}
import { level } from '../schema.js';

export default level({
  id: ${lit(`piano-l${mod.number}`)},
  number: ${mod.number},
  title: ${lit(mod.title)},
  skillBand: ${lit(mod.skillBand)},
  summary: ${lit(mod.job)},
  modules: [${varNames.join(', ')}],
});
`;
}

fs.mkdirSync(SECTIONS_DIR, { recursive: true });
let written = 0;
for (const mod of modules) {
  for (const sec of mod.sections) {
    fs.writeFileSync(path.join(SECTIONS_DIR, `${sec.code}.js`), sectionFileBody(mod, sec), 'utf8');
    written++;
  }
  const num = String(mod.number).padStart(2, '0');
  fs.writeFileSync(path.join(PIANO_DIR, `level${num}.js`), levelFileBody(mod), 'utf8');
  written++;
}
console.log(`\nWrote ${written} file(s): ${totalSections} section scaffolds + ${modules.length} level files.`);
console.log('None of this is wired into piano/index.js yet — see that file\'s header comment.');
