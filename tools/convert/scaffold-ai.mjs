#!/usr/bin/env node
/**
 * scaffold-ai.mjs — one-time generator that turns the AI Tools for Music
 * Production syllabus (course MAP — outcomes, mustCover/mustNotCover,
 * primary sources, practice, checkpoints, gate self-assess text, lesson
 * id/slug/title rows) into the app's scaffold files: level*.js + sections/
 * *.js, each a real module_()/level() object with EMPTY `lessons: []`. It
 * never touches lesson BODY content — the per-lesson textbook files under
 * `Desktop/.../AI Tools for Music Production Course/Module-NN-.../Lesson-
 * N.M.L-....md` are hand-converted lesson-by-lesson in the authoring loop
 * (see HANDOFF.md), not by this script.
 *
 * Bespoke to this syllabus's format on purpose — every course pack in the
 * Desktop overhaul uses a different structure (see [[course-material-import-
 * pipeline]]). Module 7 (Live Stem Separation, Suite 12.3) is explicitly
 * "BONUS / PARKED" per the syllabus header ("13 required modules (1-6,
 * 8-14)") and is deliberately NOT scaffolded here — this course's required
 * progression skips it entirely, matching the syllabus's own 36-lesson count.
 *
 * Run: node tools/convert/scaffold-ai.mjs [--write]
 *   (no flag)  dry run — prints a summary and any parse problems, writes
 *              nothing.
 *   --write    generates ai/level01.js...level13.js (module numbers 1-6,
 *              8-14) and ai/sections/*.js. Does NOT touch ai/index.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { delatexPlain } from './delatex.mjs';
import { emitModule } from '../author/lib/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SYLLABUS_PATH = path.join(
  'C:', 'Users', '<you>', 'Desktop', 'DDW ACADEMY - COURSE MATERIAL OVERHAUL',
  'AI Tools for Music Production Course', 'AI-Tools-for-Music-Production-Course-Syllabus.md',
);
const COURSE_DIR = path.join(ROOT, 'src', 'renderer', 'course', 'ai');
const SECTIONS_DIR = path.join(COURSE_DIR, 'sections');

const WRITE = process.argv.includes('--write');

/* ------------------------------------------------------------- parsing -- */

const src = fs.readFileSync(SYLLABUS_PATH, 'utf8');

const startIdx = src.indexOf('# Module 1 —');
const endIdx = src.indexOf('## 5. Assessment map');
if (startIdx === -1 || endIdx === -1) {
  throw new Error('scaffold-ai: could not find the Module 1 / Assessment-map boundary markers — syllabus format may have changed.');
}
const modulesText = src.slice(startIdx, endIdx);

// Tolerates Module 7's "# Module 7 (BONUS / PARKED) — Title" parenthetical.
const moduleRe = /^# Module (\d+)(?:\s*\([^)]*\))?\s*—\s*(.+?)\s*$/gm;
const moduleMatches = [...modulesText.matchAll(moduleRe)];

/** Extract a `**Label:** value` field, tolerating a wrapped multi-line value
 *  (stops at the next bold-label line, heading, or hr). */
function field(chunk, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*[A-Za-z]|\\n#{1,3} |\\n---|$)`);
  const m = chunk.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : null;
}

const problems = [];
const modules = [];

for (let i = 0; i < moduleMatches.length; i++) {
  const m = moduleMatches[i];
  const number = Number(m[1]);
  const title = delatexPlain(m[2].trim());
  const isBonus = /BONUS|PARKED/i.test(m[0]);
  const start = m.index + m[0].length;
  const end = i + 1 < moduleMatches.length ? moduleMatches[i + 1].index : modulesText.length;
  const chunk = modulesText.slice(start, end);

  if (isBonus) continue; // Module 7 — not part of the required 13-module/36-lesson progression.

  const objective = field(chunk, 'Objective');
  if (!objective) problems.push(`Module ${number}: no "Objective" line found`);

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

    const lessonLine = sChunk.match(/^\*\*Lesson:\*\*\s*Lesson\s*(\d+\.\d+\.\d+)\s*·\s*slug\s*`([^`]+)`/m);
    const lessonRows = lessonLine ? [{ address: lessonLine[1], slug: lessonLine[2], title: sTitle }] : [];

    const outcomes = field(sChunk, 'Outcomes');
    const mustCover = field(sChunk, 'mustCover');
    const mustNotCover = field(sChunk, 'mustNotCover');
    const primarySources = field(sChunk, 'Primary sources');
    const practice = field(sChunk, 'Practice');
    const checkpoint = field(sChunk, 'Checkpoint');

    // Outcomes is informational-only: Module 14's "combined jobs" sections
    // (14.1-14.3) use a shorter template with no Outcomes line at all —
    // confirmed against the syllabus source, not a parse failure.
    if (!lessonRows.length) problems.push(`Section ${code}: no Lesson row parsed`);
    if (!practice) problems.push(`Section ${code}: no Practice line parsed`);
    if (!checkpoint) problems.push(`Section ${code}: no Checkpoint line parsed`);

    sections.push({
      code, title: sTitle,
      outcomes: outcomes ? [delatexPlain(outcomes)] : [],
      lessonRows,
      mustCover, mustNotCover,
      primarySources: primarySources ? delatexPlain(primarySources) : null,
      practice: practice ? delatexPlain(practice) : null,
      checkpoint: checkpoint ? delatexPlain(checkpoint) : null,
    });
  }

  // Gate heading, if this module ends in one: "### Gate X — Title" followed
  // eventually by a "Self-assess: ..." line (may not be the very next line).
  const gateMatch = chunk.match(/^### Gate ([A-Z]) — (.+?)\s*$/m);
  let gate = null;
  if (gateMatch) {
    const afterGate = chunk.slice(gateMatch.index + gateMatch[0].length);
    const selfAssess = afterGate.match(/Self-assess:\s*([\s\S]*?)(?=\n\n|\n#{1,3} |\n---|$)/);
    gate = {
      letter: gateMatch[1],
      title: delatexPlain(gateMatch[2].trim()),
      requires: selfAssess ? delatexPlain(selfAssess[1].replace(/\s+/g, ' ').trim()) : null,
    };
    if (!gate.requires) problems.push(`Module ${number}: Gate ${gate.letter} heading found but no "Self-assess:" text`);
  }

  modules.push({ number, title, objective, sections, gate });
}

const totalSections = modules.reduce((n, m) => n + m.sections.length, 0);
const totalLessons = modules.reduce((n, m) => n + m.sections.reduce((k, s) => k + s.lessonRows.length, 0), 0);
// 34, not the syllabus's headline "36 lessons" — that total includes Module
// 7's 2 sections (Bonus/Parked, deliberately excluded above).
if (modules.length !== 13) problems.push(`Expected 13 required modules, parsed ${modules.length}`);
if (totalSections !== 34) problems.push(`Expected 34 sections, parsed ${totalSections}`);
if (totalLessons !== 34) problems.push(`Expected 34 lessons, parsed ${totalLessons}`);

console.log(`Parsed ${modules.length} modules, ${totalSections} sections, ${totalLessons} lessons.`);
if (problems.length) {
  console.log(`\n${problems.length} PARSE problem(s) — these block --write:`);
  for (const p of problems) console.log('  ✗', p);
} else {
  console.log('No parse problems.');
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

const lit = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function sectionFileBody(mod, sec) {
  const data = {
    id: `ai-m${sec.code.replace('.', '-')}`,
    code: sec.code,
    title: sec.title,
    outcomes: sec.outcomes,
    sources: [], // filled by hand during authoring — the syllabus's "Primary
    // sources" field lists manual/product-page names, not resolvable
    // corpus-whitelist titles the way Piano's backtick file paths were.
    practiceFocus: sec.practice ? [sec.practice] : [],
    checkpoints: sec.checkpoint ? [sec.checkpoint] : [],
    lessons: [],
  };
  const roster = sec.lessonRows.map((r) => ` *   ${r.address}  ${r.slug}  — ${r.title}`).join('\n');
  return `/**
 * Section ${sec.code} — ${sec.title}
 * Module ${mod.number} — ${mod.title}
 *
 * Scaffold only (generated by tools/convert/scaffold-ai.mjs from the
 * syllabus) — outcomes/practiceFocus/checkpoints are real, \`sources\` and
 * \`lessons\` are intentionally empty until this section is hand-authored
 * from its textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-${String(mod.number).padStart(2, '0')}-.../Lesson-${sec.lessonRows[0]?.address || sec.code + '.1'}-....md
 *
 * Lesson roster to build (id — title):
${roster}
 *
 * mustCover (authoring guardrail, not app data): ${sec.mustCover || '(none stated)'}
 * mustNotCover (authoring guardrail, not app data): ${sec.mustNotCover || '(none stated)'}
 * Primary sources (syllabus text, not yet resolved to whitelist titles): ${sec.primarySources || '(none stated)'}
 */
import { module_ } from '../../schema.js';

export default ${emitModule(data)};
`;
}

function levelFileBody(mod) {
  const varNames = mod.sections.map((s) => `s${s.code.replace('.', '_')}`);
  const imports = mod.sections.map((s, i) => `import ${varNames[i]} from './sections/${s.code}.js';`).join('\n');
  return `/**
 * Module ${mod.number} — ${mod.title}
 * Scaffold only (generated by tools/convert/scaffold-ai.mjs) — see each
 * section file's own header for its lesson roster and authoring guardrails.${
   mod.gate ? `\n * Gate ${mod.gate.letter} — ${mod.gate.title}: ${mod.gate.requires}` : ''
 }
 */
${imports}
import { level } from '../schema.js';

export default level({
  id: ${lit(`ai-l${mod.number}`)},
  number: ${mod.number},
  title: ${lit(mod.title)},
  summary: ${lit(mod.objective || '')},
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
  fs.writeFileSync(path.join(COURSE_DIR, `level${num}.js`), levelFileBody(mod), 'utf8');
  written++;
}
console.log(`\nWrote ${written} file(s): ${totalSections} section scaffolds + ${modules.length} level files.`);
console.log('None of this is wired into ai/index.js yet.');
console.log('\nGates found:');
for (const mod of modules) {
  if (mod.gate) console.log(`  Module ${mod.number}: Gate ${mod.gate.letter} — ${mod.gate.title} — requires: ${mod.gate.requires}`);
}
