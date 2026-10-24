/**
 * validate-course.mjs — structural integrity of the course content.
 *
 * The course is 4,000+ lines of hand-authored data, and the failure mode that
 * matters is a question that renders perfectly but is impossible to answer
 * correctly: an `answer` index pointing past the end of `options`, an `order`
 * question whose answer is not a permutation of its items, or duplicate labels
 * in an `order` question (which makes the correct sequence ambiguous — a real
 * bug this catches). None of that is visible from looking at the screen.
 *
 * Run:  node tools/validate-course.mjs
 *
 * Single-module mode:  node tools/validate-course.mjs --module <path/to/sections/1.1.js>
 * Checks one module_() file in isolation — the same checkBlock/checkQuestion/
 * checkAssertions functions below, just walked over one file's lessons
 * instead of every track's ALL_LESSONS. Exists because the Piano rebuild's
 * authoring loop (see HANDOFF.md) hand-authors one section at a time, and a
 * level is deliberately not wired into TRACKS until every module in it has
 * real lessons — so newly-authored content has no other way to reach the
 * "no lessons" check the full walk enforces, right up until the moment the
 * whole level is done. Skips whatever only makes sense course-wide: the
 * level/track walk, cross-module duplicate-id checks, and the source index.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ALL_LEVELS, ALL_MODULES, ALL_LESSONS, ALL_QUIZZES, ALL_EXERCISES,
  COURSE_STATS, flatBlocks, lessonSteps, sourceIndex, resolveDepth } from '../src/renderer/course/index.js';
import { VOICES, KITS } from '../src/renderer/lib/drums-manifest.js';
import { checkAssertions as checkAssertionsShared } from './author/lib/verify-theory.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const moduleArgIdx = process.argv.indexOf('--module');
const moduleArg = moduleArgIdx !== -1 ? process.argv[moduleArgIdx + 1] : null;
if (moduleArgIdx !== -1 && !moduleArg) {
  console.error('--module needs a path, e.g. --module src/renderer/course/piano/sections/1.1.js');
  process.exit(1);
}

const problems = [];
const warn = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const soft = (where, msg) => warn.push(`${where}: ${msg}`);

const NOTE_RE = /^[A-Ga-g](#|b|##|bb)?(-?\d+)?$/;
const COLOR_TOKENS = new Set(['accent', 'accent2', 'accent3', 'muted', 'ok', 'bad']);

/* --------------------------------------------------- source whitelist --- */

let KNOWN_SOURCES = null;
try {
  KNOWN_SOURCES = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'reference', 'known-sources.json'), 'utf8')));
} catch {
  console.warn('tools/reference/known-sources.json not found — run tools/reference/build-source-manifest.mjs first. Skipping the source whitelist gate.');
}

/* --------------------------------------------------------- questions ----- */

/**
 * `requireReaderPair` is true only at the top level (quiz questions, step
 * checks): a bare `play`/`ear` question found there is unanswerable in
 * Reader Mode and must be wrapped in `eitherMode()`. It is turned off while
 * recursing into an `either`'s own branches, since those are validated by
 * the `either` handling itself (and a `reader` branch is a plain written
 * question — it must not itself need pairing).
 */
function checkQuestion(where, q, { requireReaderPair = true } = {}) {
  if (!q.kind) return fail(where, 'question has no kind');

  if (q.kind === 'either') {
    if (!q.interactive) { fail(where, 'either question missing interactive branch'); return; }
    if (!q.reader) { fail(where, 'either question missing reader branch'); return; }
    if (q.reader.kind === 'play' || q.reader.kind === 'ear') {
      fail(where, `reader branch is itself "${q.reader.kind}" — unanswerable without a keyboard/ear`);
    }
    checkQuestion(`${where} (interactive)`, q.interactive, { requireReaderPair: false });
    checkQuestion(`${where} (reader)`, q.reader, { requireReaderPair: false });
    return;
  }

  if (requireReaderPair && (q.kind === 'play' || q.kind === 'ear')) {
    fail(where, `"${q.kind}" question must be wrapped in eitherMode() with a written reader counterpart`);
  }

  if (!q.question || typeof q.question !== 'string') fail(where, 'missing question text');

  switch (q.kind) {
    case 'mcq':
    case 'ear': {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        fail(where, `${q.kind} needs at least 2 options`);
      } else {
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
          fail(where, `answer index ${q.answer} out of range for ${q.options.length} options`);
        }
        if (new Set(q.options).size !== q.options.length) {
          fail(where, 'duplicate options — more than one could be "the" answer');
        }
      }
      if (q.kind === 'ear' && (!Array.isArray(q.notes) || !q.notes.length)) {
        fail(where, 'ear question has no notes to play');
      }
      break;
    }

    case 'multi': {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        fail(where, 'multi needs at least 2 options');
        break;
      }
      if (!Array.isArray(q.answer) || !q.answer.length) {
        fail(where, 'multi answer must be a non-empty array of indices');
        break;
      }
      for (const i of q.answer) {
        if (!Number.isInteger(i) || i < 0 || i >= q.options.length) {
          fail(where, `answer index ${i} out of range for ${q.options.length} options`);
        }
      }
      if (new Set(q.answer).size !== q.answer.length) fail(where, 'duplicate indices in answer');
      const sorted = [...q.answer].sort((a, b) => a - b);
      if (sorted.join() !== q.answer.join()) {
        // The grader compares element-by-element against the learner's sorted
        // selection, so an unsorted answer key can never be matched.
        fail(where, `answer ${JSON.stringify(q.answer)} is not ascending — the grader sorts the learner's picks, so this is unanswerable`);
      }
      if (q.answer.length === q.options.length) {
        soft(where, 'every option is correct — fine, but check that is intended');
      }
      break;
    }

    case 'order': {
      if (!Array.isArray(q.items) || q.items.length < 2) { fail(where, 'order needs at least 2 items'); break; }
      if (!Array.isArray(q.answer)) { fail(where, 'order needs an answer array'); break; }
      if (new Set(q.items).size !== q.items.length) {
        fail(where, 'duplicate labels in items — the correct order becomes ambiguous');
      }
      if (q.items.length !== q.answer.length) {
        fail(where, `items (${q.items.length}) and answer (${q.answer.length}) differ in length`);
      }
      const a = [...q.items].sort();
      const b = [...q.answer].sort();
      if (a.join(' ') !== b.join(' ')) {
        fail(where, `answer is not a permutation of items — items=${JSON.stringify(q.items)} answer=${JSON.stringify(q.answer)}`);
      }
      break;
    }

    case 'text': {
      if (!Array.isArray(q.accept) || !q.accept.length) fail(where, 'text needs a non-empty accept array');
      else {
        const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        if (q.accept.some((s) => !norm(s))) {
          fail(where, 'an accepted answer normalises to the empty string, which would match a blank input');
        }
      }
      break;
    }

    case 'play': {
      if (!Array.isArray(q.expect) || !q.expect.length) { fail(where, 'play needs a non-empty expect array'); break; }
      for (const x of q.expect) {
        if (typeof x === 'number') {
          if (!Number.isInteger(x) || x < 0 || x > 127) fail(where, `expect value ${x} is not a MIDI note or pitch class`);
        } else if (!NOTE_RE.test(String(x))) {
          fail(where, `expect value "${x}" is not a parseable note name`);
        }
      }
      if (q.mode && !['chord', 'sequence', 'any'].includes(q.mode)) {
        fail(where, `unknown play mode "${q.mode}"`);
      }
      // A named-octave expectation graded by pitch class silently ignores the
      // octave, which makes the prompt misleading.
      const named = q.expect.some((x) => typeof x === 'string' && /\d/.test(x));
      if (named && q.byPitchClass !== false) {
        soft(where, 'expect uses explicit octaves but byPitchClass is not false — the octave will not be enforced');
      }
      break;
    }

    default:
      fail(where, `unknown question kind "${q.kind}"`);
  }
}

/* ------------------------------------------------------------ blocks ----- */

const KNOWN_BLOCKS = new Set(['prose', 'heading', 'callout', 'list', 'table', 'keyboard',
  'staff', 'scale', 'chord', 'circle', 'interval', 'rhythm', 'try', 'progression', 'sources', 'step',
  'drums', 'pads', 'arrangement', 'diagram', 'depth', 'gap']);

/** `insideStep`: depth may only ever appear inside a step's own blocks (see
 * schema.js's depth() doc comment for why — recordStepCheck() is keyed by
 * step index, so a register-dependent step count would corrupt progress).
 * `insideDepth`: a depth branch must not itself contain a nested depth. */
function checkBlock(where, b, { insideStep = false, insideDepth = false } = {}) {
  if (!b || !b.type) return fail(where, 'block with no type');
  if (!KNOWN_BLOCKS.has(b.type)) fail(where, `unknown block type "${b.type}"`);

  if (b.type === 'table') {
    if (!Array.isArray(b.headers) || !Array.isArray(b.rows)) return fail(where, 'table needs headers and rows');
    b.rows.forEach((r, i) => {
      if (r.length !== b.headers.length) {
        fail(where, `table row ${i} has ${r.length} cells but there are ${b.headers.length} headers`);
      }
    });
  }

  if (b.type === 'sources') {
    if (!Array.isArray(b.files) || !b.files.length) {
      fail(where, 'sources block with no files');
    } else if (KNOWN_SOURCES) {
      for (const f of b.files) {
        if (!KNOWN_SOURCES.has(f)) {
          fail(where, `sources() cites "${f}" — not found in either corpus (tools/reference/known-sources.json). Typo, or a file that needs tools/reference/build-source-manifest.mjs rerun?`);
        }
      }
    }
  }

  if (b.type === 'list' && (!Array.isArray(b.items) || !b.items.length)) {
    fail(where, 'list block with no items');
  }

  if (b.type === 'gap' && (typeof b.note !== 'string' || !b.note.trim())) {
    fail(where, 'gap block needs a non-empty note explaining what is missing and why');
  }

  if (b.type === 'drums') checkDrumGrid(where, b);
  if (b.type === 'pads') checkPadMap(where, b);
  if (b.type === 'arrangement') checkArrangement(where, b);
  if (b.type === 'diagram') checkDiagram(where, b);

  if (b.type === 'depth') {
    if (insideDepth) fail(where, 'depth blocks must not nest');
    if (!insideStep) fail(where, 'depth block found outside a step — depth may only live inside a step\'s own blocks');
    if (!Array.isArray(b.standard) || !b.standard.length) fail(where, 'depth block needs a non-empty standard branch');
    if ('plain' in b && (!Array.isArray(b.plain) || !b.plain.length)) fail(where, 'depth.plain, if present, must be non-empty');
    if ('technical' in b && (!Array.isArray(b.technical) || !b.technical.length)) fail(where, 'depth.technical, if present, must be non-empty');
    for (const branch of ['plain', 'standard', 'technical']) {
      for (const inner of b[branch] || []) {
        if (inner.type === 'step') fail(where, `depth.${branch} must not contain a step`);
        checkBlock(`${where} (${branch})`, inner, { insideStep, insideDepth: true });
      }
    }
    if (Array.isArray(b.technical) && Array.isArray(b.standard) && b.technical.length < b.standard.length) {
      soft(where, 'technical branch is shorter than standard — likely an authoring slip, technical is meant to go deeper');
    }
  }
}

function checkColorToken(where, color, field = 'color') {
  if (color !== undefined && !COLOR_TOKENS.has(color)) {
    fail(where, `${field} "${color}" is not a semantic token (${[...COLOR_TOKENS].join('|')}) — never use a literal hex color here, themes recolor via CSS classes`);
  }
}

function checkDrumGrid(where, b) {
  if (!Array.isArray(b.lanes) || !b.lanes.length) return fail(where, 'drumGrid needs at least one lane');
  const steps = b.steps;
  if (!Number.isInteger(steps) || steps < 4 || steps > 64) fail(where, `drumGrid.steps ${steps} out of range [4,64]`);
  if (steps % (b.subdivision || 4) !== 0) fail(where, `drumGrid.steps ${steps} not divisible by subdivision ${b.subdivision}`);
  if (b.bpm != null && (b.bpm < 40 || b.bpm > 300)) fail(where, `drumGrid.bpm ${b.bpm} out of range [40,300]`);
  if (b.swing != null && (b.swing < 0 || b.swing > 0.75)) fail(where, `drumGrid.swing ${b.swing} out of range [0,0.75]`);
  if (b.kit && !KITS[b.kit]) fail(where, `drumGrid.kit "${b.kit}" is not a known kit (${Object.keys(KITS).join('|')})`);
  if (b.editable && !b.id) soft(where, 'editable drumGrid has no id — learner edits have nothing stable to persist against in store.blockState');

  for (const lane of b.lanes) {
    if (!VOICES.includes(lane.voice)) fail(where, `drumGrid lane voice "${lane.voice}" is not a known voice (${VOICES.join(', ')})`);
    if (!Array.isArray(lane.steps) || lane.steps.length !== steps) {
      fail(where, `drumGrid lane "${lane.voice}" has ${lane.steps?.length} steps, block declares ${steps}`);
    } else {
      const bad = lane.steps.some((v) => !Number.isInteger(v) || v < 0 || v > 127);
      if (bad) fail(where, `drumGrid lane "${lane.voice}" has a step velocity outside 0-127`);
      if (lane.steps.every((v) => !v)) soft(where, `drumGrid lane "${lane.voice}" is entirely silent — intentional?`);
    }
  }
}

function checkPadMap(where, b) {
  const rows = b.rows || 2, cols = b.cols || 8;
  if (!Array.isArray(b.pads) || b.pads.length !== rows * cols) {
    fail(where, `padMap has ${b.pads?.length} pads, expected rows*cols = ${rows}*${cols} = ${rows * cols}`);
    return;
  }
  b.pads.forEach((pad, i) => {
    const W = `${where} pad ${i}`;
    if (!pad.label) fail(W, 'pad has no label');
    if (pad.voice && !VOICES.includes(pad.voice)) fail(W, `pad voice "${pad.voice}" is not a known voice`);
    if (pad.note != null && (!Number.isInteger(pad.note) || pad.note < 0 || pad.note > 127)) fail(W, `pad note ${pad.note} is not a MIDI note 0-127`);
    checkColorToken(W, pad.color);
    if (b.playable && !pad.voice && pad.note == null) soft(W, 'playable pad has neither voice nor note — clicking it does nothing');
  });
}

function checkArrangement(where, b) {
  if (!Array.isArray(b.sections) || !b.sections.length) return fail(where, 'arrangement needs at least one section');
  let sum = 0;
  b.sections.forEach((s, i) => {
    if (!s.name) fail(`${where} section ${i}`, 'section has no name');
    if (!Number.isInteger(s.bars) || s.bars < 1) fail(`${where} section ${i}`, `section.bars ${s.bars} must be a positive integer`);
    else sum += s.bars;
    checkColorToken(`${where} section ${i}`, s.color);
  });
  if (sum !== b.bars) fail(where, `sections sum to ${sum} bars but arrangement.bars is ${b.bars}`);

  for (const tr of b.tracks || []) {
    if (!tr.name) fail(where, 'track has no name');
    let lastEnd = -1;
    for (const span of tr.spans || []) {
      const [a, c] = span;
      if (!(a >= 0 && c <= b.bars && a < c)) {
        fail(where, `track "${tr.name}" span [${a},${c}] must satisfy 0 <= start < end <= ${b.bars}`);
      } else if (a < lastEnd) {
        fail(where, `track "${tr.name}" spans overlap or are out of order (span starting at ${a} before the previous one ends at ${lastEnd})`);
      }
      lastEnd = c;
    }
  }
}

function checkDiagram(where, b) {
  if (!Array.isArray(b.nodes) || !b.nodes.length) return fail(where, 'diagram needs at least one node');
  const ids = new Set();
  for (const n of b.nodes) {
    if (!n.id) { fail(where, 'diagram node with no id'); continue; }
    if (ids.has(n.id)) fail(where, `duplicate diagram node id "${n.id}"`);
    ids.add(n.id);
    if (!n.label) fail(`${where} node ${n.id}`, 'node has no label');
    if (n.label && n.label.length > 28) soft(`${where} node ${n.id}`, `label "${n.label}" is ${n.label.length} chars — long labels can break the fixed-width auto-layout`);
    checkColorToken(`${where} node ${n.id}`, n.color);
    if (n.shape && !['box', 'round', 'circle'].includes(n.shape)) fail(`${where} node ${n.id}`, `unknown shape "${n.shape}"`);
  }
  if (b.layout && !['chain', 'stack', 'grid'].includes(b.layout)) fail(where, `unknown diagram layout "${b.layout}"`);
  if (b.layout === 'grid') {
    for (const n of b.nodes) {
      if (n.row == null || n.col == null) fail(where, `diagram node "${n.id}" needs row/col — layout is 'grid'`);
    }
  }
  for (const link of b.links || []) {
    if (link.from === link.to) fail(where, `diagram link is a self-link on "${link.from}"`);
    if (!ids.has(link.from)) fail(where, `diagram link references unknown node "${link.from}"`);
    if (!ids.has(link.to)) fail(where, `diagram link references unknown node "${link.to}"`);
    if (link.style && !['solid', 'dashed'].includes(link.style)) fail(where, `unknown diagram link style "${link.style}"`);
  }
}

/* ------------------------------------------------------- theory oracle --- */
/**
 * Machine-checks a step's `asserts` array against lib/theory.js — the
 * single biggest anti-hallucination gate available for free. A claim that
 * CAN be checked mechanically and isn't is a validator gap, not a neutral
 * choice; add an assertion type here before adding a new kind of claim to
 * course content.
 *
 * The actual checking logic lives in tools/author/lib/verify-theory.mjs,
 * shared with the authoring pipeline (which needs to check a draft's
 * assertions before the content is wired into the course at all) — one
 * implementation, so the two can never quietly disagree.
 */
function checkAssertions(where, asserts) {
  const { ok, problems } = checkAssertionsShared(asserts);
  if (!ok) { fail(where, problems[0] || 'asserts must be an array'); return; }
  for (const p of problems) fail(where, p);
}

/* ------------------------------------------------------------- walk ------ */

/** Module-level checks shared by the full-course walk and --module mode:
 *  lessons/title present, quiz shape + MCQ budget, exercise shape. `seenQuiz`/
 *  `seenExercise` are passed in so full-course mode can catch duplicates
 *  across the whole course while --module mode (a fresh Set per call) only
 *  catches duplicates within that one file — which is all a single module
 *  could ever collide with anyway. */
function checkModuleContent(m, W, { seenQuiz, seenExercise }) {
  if (!m.lessons?.length) fail(W, 'no lessons');
  if (!m.title) fail(W, 'no title');

  if (m.quiz) {
    if (seenQuiz.has(m.quiz.id)) fail(W, `duplicate quiz id "${m.quiz.id}"`);
    seenQuiz.add(m.quiz.id);
    if (!m.quiz.questions?.length) fail(`${W} quiz`, 'no questions');
    m.quiz.questions.forEach((q, i) => checkQuestion(`${W} quiz Q${i + 1}`, q));

    const mcqCount = m.quiz.questions.filter((q) => q.kind === 'mcq').length;
    const ratio = m.quiz.questions.length ? mcqCount / m.quiz.questions.length : 0;
    if (ratio > 0.55) {
      soft(`${W} quiz`, `${mcqCount}/${m.quiz.questions.length} questions (${Math.round(ratio * 100)}%) are plain MCQ — budget is 55%, mix in more order/text/multi/eitherMode`);
    }
  }

  for (const e of m.exercises || []) {
    if (seenExercise.has(e.id)) fail(W, `duplicate exercise id "${e.id}"`);
    seenExercise.add(e.id);
    if (!e.title || !e.prompt) fail(`${W} exercise ${e.id}`, 'missing title or prompt');
  }
}

/** Per-lesson checks shared the same way — block/step/check/asserts shape,
 *  the callout budget, the "every step has a check" advisory. `seenLesson`
 *  is a fresh Set in --module mode for the same reason as above. */
function checkLessonsOf(lessons, { seenLesson }) {
  for (const l of lessons) {
    const W = `lesson ${l.id}`;
    if (seenLesson.has(l.id)) fail(W, 'duplicate lesson id');
    seenLesson.add(l.id);
    if (!l.title) fail(W, 'no title');
    if (!l.blocks?.length) fail(W, 'no blocks');

    const steps = lessonSteps(l);
    if (steps.length) {
      // Blocks NOT wrapped in a step still exist at the lesson's top level —
      // stepper.js's stepsOf() folds leading ones into the first step and
      // trailing ones into the last (its "lead"/trailing-orphan logic), so
      // they DO render, just never through the s.blocks loop below. Checking
      // them here is what actually enforces "depth must live inside a step":
      // a depth() block placed loose at lesson top level has no step to be
      // inside, so it must be caught here or it is never checked at all.
      l.blocks.filter((b) => b.type !== 'step').forEach((b) => checkBlock(W, b, { insideStep: false }));

      steps.forEach((s, i) => {
        const SW = `${W} step ${i + 1}`;
        if (!s.title) fail(SW, 'step has no title');
        if (!s.blocks?.length) fail(SW, 'step has no blocks');
        s.blocks.forEach((b) => checkBlock(SW, b, { insideStep: true }));
        if (s.blocks.some((b) => b.type === 'step')) fail(SW, 'steps must not nest');
        if (s.check) checkQuestion(`${SW} check`, s.check);
        if (s.asserts) checkAssertions(SW, s.asserts);
      });
      const withCheck = steps.filter((s) => s.check).length;
      if (withCheck < steps.length) {
        soft(W, `${steps.length - withCheck} of ${steps.length} sections have no exercise`);
      }

      // Callout budget, computed on the standard register (the one every
      // learner sees who never touches the depth control) — flatBlocks()'s
      // register 'all' concatenates every depth branch, which would inflate
      // this ratio for any lesson using depth() blocks.
      const standardBlocks = steps.flatMap((s) => resolveDepth(s.blocks, 'standard'));
      const calloutCount = standardBlocks.filter((b) => b.type === 'callout').length;
      const calloutRatio = standardBlocks.length ? calloutCount / standardBlocks.length : 0;
      if (calloutRatio > 0.2) {
        soft(W, `${calloutCount}/${standardBlocks.length} blocks (${Math.round(calloutRatio * 100)}%) are callouts — budget is 20%, prefer prose (callouts are for genuinely set-apart points, not the default teaching voice)`);
      }
    } else {
      soft(W, 'not authored as steps — delivered via automatic segmentation');
      l.blocks.forEach((b) => checkBlock(W, b));
    }

    const hasSources = flatBlocks(l).some((b) => b.type === 'sources');
    if (!hasSources) soft(W, 'no sources block');
  }
}

let idx = [];
let moduleStats = null;

if (moduleArg) {
  const resolved = path.resolve(process.cwd(), moduleArg);
  const mod = await import(pathToFileURL(resolved).href);
  const m = mod.default;
  if (!m || !Array.isArray(m.lessons)) {
    fail('--module', `${moduleArg} has no default export, or its default export has no lessons[] — expected a module_() call`);
  } else {
    const W = `module ${m.code || m.id}`;
    checkModuleContent(m, W, { seenQuiz: new Set(), seenExercise: new Set() });
    checkLessonsOf(m.lessons, { seenLesson: new Set() });
    moduleStats = { module: m.code || m.id, lessons: m.lessons.length,
      steps: m.lessons.reduce((n, l) => n + lessonSteps(l).length, 0),
      checks: m.lessons.reduce((n, l) => n + lessonSteps(l).filter((s) => s.check).length, 0) };
  }
} else {
  const seenLesson = new Set();
  const seenQuiz = new Set();
  const seenExercise = new Set();
  const seenLevel = new Set();
  const seenModule = new Set();

  /* Walks every track (ALL_LEVELS), not just piano's back-compat LEVELS shim —
   * a track that never got checked here would ship with completely
   * unvalidated level shape. Also catches cross-track id collisions here,
   * which matter because moduleById()/levelById() in course/index.js are
   * GLOBAL lookups with no trackId — a second track reusing 'level-1' would
   * silently shadow the first track's level with no error anywhere else. */
  for (const lv of ALL_LEVELS) {
    const W = `level ${lv.trackId}/${lv.number ?? '?'}`;
    if (!lv.id || typeof lv.number !== 'number') fail(W, `malformed level ${lv.title}`);
    if (!lv.modules?.length) fail(W, 'no modules');
    if (lv.id) {
      if (seenLevel.has(lv.id)) fail(W, `duplicate level id "${lv.id}" — moduleById()/levelById() are global lookups, a second track reusing this id would silently shadow the first`);
      seenLevel.add(lv.id);
    }
  }

  for (const m of ALL_MODULES) {
    const W = `module ${m.code}`;
    if (m.id) {
      if (seenModule.has(m.id)) fail(W, `duplicate module id "${m.id}" — moduleById() is a global lookup, a second track reusing this id would silently shadow the first`);
      seenModule.add(m.id);
    }
    checkModuleContent(m, W, { seenQuiz, seenExercise });
  }

  checkLessonsOf(ALL_LESSONS, { seenLesson });

  /* Source index must not be empty for a converted lesson — that regression is
     exactly what nesting `sources` inside steps caused. But only fail this
     when there IS content to have sources: right after a deliberate full
     course-material removal (2026-08-16 rebuild, see HANDOFF.md), every
     track's LEVELS is legitimately [] until its replacement is scaffolded —
     an empty course is not the same defect as a populated one with a broken
     source index, and treating it as one would make "validate exits 0" and
     "remove all content up front" mutually impossible to satisfy in the same
     commit. */
  idx = sourceIndex();
  if (!idx.length) {
    if (ALL_LESSONS.length) fail('sourceIndex', 'no sources found at all');
    else soft('sourceIndex', 'empty — no lessons exist yet in any track (expected mid-rebuild, see HANDOFF.md)');
  }
}

/* ----------------------------------------------------------- report ----- */

if (moduleArg) {
  console.log(`Module stats (${moduleArg}):`, moduleStats ? JSON.stringify(moduleStats, null, 1) : '(not checked — see problems below)');
} else {
  console.log('Course stats:', JSON.stringify(COURSE_STATS, null, 1));
  console.log(`source PDFs referenced: ${idx.length}`);
  console.log(`quiz questions: ${COURSE_STATS.questions}   section checks: ${COURSE_STATS.checks}`);
}

if (warn.length) {
  console.log(`\n${warn.length} advisory note(s):`);
  for (const w of warn.slice(0, 40)) console.log('  ~', w);
  if (warn.length > 40) console.log(`  … and ${warn.length - 40} more`);
}

if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error('  ✗', p);
  process.exit(1);
}
console.log('\n✓ course content valid');
