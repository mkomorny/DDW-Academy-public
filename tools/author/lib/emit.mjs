/**
 * emit.mjs — deterministic emitter: takes the DATA a lesson/module/level
 * already is (the exact same object shape schema.js's factories produce) and
 * prints it back out as valid, house-style JS source calling those same
 * factories.
 *
 * Design decision (see plan Phase 4): generate a JSON-shaped intermediate,
 * never raw JS text directly from a model. This file is the "never raw JS
 * text" half — it is the ONLY thing that ever prints a template literal or a
 * factory call. An authoring script builds plain objects; this turns them
 * into source. That split is what makes a stray backtick or `${` in
 * AI-authored prose harmless instead of a syntax error that blanks the app.
 *
 * Correctness bar (see emit-roundtrip.mjs): SEMANTIC equivalence, not byte-
 * identical text. Re-importing emitted source must produce a deep-equal
 * object to the input — hand-picked line wraps, section-divider comments and
 * per-module variable names are a human-authoring concern (the review step),
 * not something a deterministic pretty-printer should try to guess.
 */

const IND = '  ';

/**
 * Prefix `pad` to each STRUCTURAL line of `str` — but never to a line that
 * falls inside a multi-line template literal, or the indentation would be
 * absorbed into the string's actual VALUE (template literals preserve
 * interior whitespace verbatim). Tracked with a simple backtick-toggle scan;
 * `\\` escapes the next char so an escaped backtick can't false-toggle it.
 *
 * Caught live: the naive "indent every line" version silently corrupted
 * every multi-line prose/callout string it touched — the roundtrip test's
 * very first run flagged it as 36 content mismatches before this fix.
 */
function indent(str, levels = 1) {
  const pad = IND.repeat(levels);
  let inTemplate = false;
  return str.split('\n').map((line) => {
    const out = inTemplate || !line ? line : pad + line;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '\\') { i++; continue; }
      if (line[i] === '`') inTemplate = !inTemplate;
    }
    return out;
  }).join('\n');
}

/* ------------------------------------------------------------- literals -- */

function escapeForTemplate(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/** A string literal in house style: template literal for multi-line content
 *  (prose/callout html is almost always this), a plain quoted literal
 *  otherwise. Always semantically safe regardless of content. */
function emitStr(s) {
  if (typeof s !== 'string') return JSON.stringify(s);
  if (/\n/.test(s)) return '`' + escapeForTemplate(s) + '`';
  if (!s.includes("'")) return `'${s.replace(/\\/g, '\\\\')}'`;
  if (!s.includes('`') && !s.includes('${')) return '`' + escapeForTemplate(s) + '`';
  return JSON.stringify(s);
}

function emitValue(v, level = 0) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return emitStr(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return emitArray(v, level);
  if (typeof v === 'object') {
    if (v.type && BLOCK_EMITTERS[v.type]) return BLOCK_EMITTERS[v.type](v);
    if (v.kind && QUESTION_EMITTERS[v.kind]) return QUESTION_EMITTERS[v.kind](v);
    // lesson/module have no type/kind marker at all (by schema.js design —
    // module_()'s quiz/exercise fields ARE meant to be plain object literals,
    // so this shape-sniffing must stay narrow or it'd wrongly wrap those too).
    // Caught in the first roundtrip run: without this, every lesson/module
    // printed as a raw object literal instead of a lesson()/module_() call —
    // semantically identical, but nothing like hand-authored house style.
    if (typeof v.id === 'string' && typeof v.title === 'string' && Array.isArray(v.blocks)) return emitLesson(v);
    if (Array.isArray(v.lessons)) return emitModule(v);
    return emitObject(v, level);
  }
  throw new Error(`emit.mjs: cannot emit value of type ${typeof v}`);
}

function emitArray(arr, level = 0) {
  if (!arr.length) return '[]';
  const items = arr.map((x) => emitValue(x, level + 1));
  const oneLine = `[${items.join(', ')}]`;
  const looksSimple = arr.every((x) => typeof x !== 'object' || x === null);
  if (looksSimple && oneLine.length <= 90) return oneLine;
  return `[\n${items.map((i) => indent(i + ',', 1)).join('\n')}\n]`;
}

function emitObject(obj, level = 0) {
  const keys = Object.keys(obj);
  if (!keys.length) return '{}';
  const lines = keys.map((k) => `${isValidIdent(k) ? k : emitStr(k)}: ${emitValue(obj[k], level + 1)}`);
  return `{ ${lines.join(', ')} }`.length <= 90 && !lines.some((l) => l.includes('\n'))
    ? `{ ${lines.join(', ')} }`
    : `{\n${lines.map((l) => indent(l + ',', 1)).join('\n')}\n}`;
}

function isValidIdent(k) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
}

/** Drop keys from `obj` whose value deep-equals the factory's own default —
 *  that's what keeps emitted opts objects to only the real overrides. */
function nonDefaultOpts(obj, defaults, omitKeys) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (omitKeys.includes(k)) continue;
    if (k in defaults && deepEqual(v, defaults[k])) continue;
    out[k] = v;
  }
  return out;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && b && typeof a === 'object') {
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

/** args, then an optional trailing `{...opts}` object literal if non-empty. */
function call(fnName, args, optsObj) {
  const parts = args.map((a) => emitValue(a));
  if (optsObj && Object.keys(optsObj).length) parts.push(emitObject(optsObj));
  const oneLine = `${fnName}(${parts.join(', ')})`;
  if (!oneLine.includes('\n') && oneLine.length <= 100) return oneLine;
  return `${fnName}(\n${parts.map((p) => indent(p + ',', 1)).join('\n')}\n)`;
}

/* --------------------------------------------------------------- blocks -- */

const BLOCK_DEFAULTS = {
  heading: { level: 3 },
  list: { ordered: false },
  table: { caption: null },
  keyboard: { low: 48, high: 84, playable: true, byPitchClass: false },
  staff: { clef: 'treble' },
  try: { mode: 'sequence', byPitchClass: true },
  drums: { steps: 16, subdivision: 4, bpm: 120, kit: '909', swing: 0, playable: true, editable: false, loop: true, caption: null },
  pads: { rows: 2, cols: 8, playable: true, midi: false, showNotes: false, caption: null },
  arrangement: { barLabelEvery: 8, caption: null },
  diagram: { layout: 'chain', caption: null },
};

const BLOCK_EMITTERS = {
  prose: (b) => call('prose', [b.html]),
  heading: (b) => (b.level !== BLOCK_DEFAULTS.heading.level ? call('heading', [b.text, b.level]) : call('heading', [b.text])),
  callout: (b) => call('callout', [b.variant, b.title, b.html]),
  gap: (b) => call('gap', [b.note]),
  list: (b) => (b.ordered ? call('list', [b.items, true]) : call('list', [b.items])),
  table: (b) => call('table', b.caption != null ? [b.headers, b.rows, b.caption] : [b.headers, b.rows]),
  keyboard: (b) => call('keyboard', [], nonDefaultOpts(b, BLOCK_DEFAULTS.keyboard, ['type'])),
  staff: (b) => call('staff', [], nonDefaultOpts(b, BLOCK_DEFAULTS.staff, ['type'])),
  scale: (b) => call('scaleExplorer', [b.scaleId, b.root], nonDefaultOpts(b, {}, ['type', 'scaleId', 'root'])),
  chord: (b) => call('chordExplorer', [b.root, b.typeId], nonDefaultOpts(b, {}, ['type', 'root', 'typeId'])),
  circle: (b) => call('circleOfFifths', [], nonDefaultOpts(b, {}, ['type'])),
  interval: (b) => call('intervalDemo', [b.intervalId, b.root], nonDefaultOpts(b, {}, ['type', 'intervalId', 'root'])),
  rhythm: (b) => call('rhythm', [b.pattern], nonDefaultOpts(b, {}, ['type', 'pattern'])),
  try: (b) => call('tryIt', [b.prompt, b.expect], nonDefaultOpts(b, BLOCK_DEFAULTS.try, ['type', 'prompt', 'expect'])),
  progression: (b) => call('progression', [b.chords], nonDefaultOpts(b, {}, ['type', 'chords'])),
  sources: (b) => call('sources', [b.files]),
  depth: (b) => {
    const variants = {};
    if (b.plain) variants.plain = b.plain;
    variants.standard = b.standard;
    if (b.technical) variants.technical = b.technical;
    return call('depth', [variants]);
  },
  drums: (b) => call('drumGrid', [b.lanes], nonDefaultOpts(b, BLOCK_DEFAULTS.drums, ['type', 'lanes'])),
  pads: (b) => call('padMap', [b.pads], nonDefaultOpts(b, BLOCK_DEFAULTS.pads, ['type', 'pads'])),
  arrangement: (b) => call('arrangement', [b.sections, b.tracks],
    nonDefaultOpts(b, { ...BLOCK_DEFAULTS.arrangement, bars: b.sections.reduce((n, s) => n + (s.bars || 0), 0) },
      ['type', 'sections', 'tracks'])),
  diagram: (b) => call('diagram', [b.nodes, b.links], nonDefaultOpts(b, BLOCK_DEFAULTS.diagram, ['type', 'nodes', 'links'])),
  step: (b) => {
    const args = [b.title, b.blocks];
    if (b.check || b.asserts) args.push(b.check ?? null);
    if (b.asserts) args.push(b.asserts);
    return call('step', args);
  },
};

export function emitBlock(b) {
  const fn = BLOCK_EMITTERS[b.type];
  if (!fn) throw new Error(`emit.mjs: no emitter for block type "${b.type}"`);
  return fn(b);
}

/* ------------------------------------------------------------- questions -- */

const QUESTION_EMITTERS = {
  mcq: (q) => call('mcq', [q.question, q.options, q.answer, q.explain || '']),
  multi: (q) => call('multi', [q.question, q.options, q.answer, q.explain || '']),
  text: (q) => call('text', [q.question, q.accept, q.explain || '']),
  play: (q) => call('play', [q.question, q.expect], nonDefaultOpts(q, { mode: 'chord', byPitchClass: true }, ['kind', 'question', 'expect'])),
  ear: (q) => call('ear', [q.question, q.notes, q.options, q.answer], nonDefaultOpts(q, { gap: 0.45 }, ['kind', 'question', 'notes', 'options', 'answer'])),
  order: (q) => call('order', [q.question, q.items, q.answer, q.explain || '']),
  either: (q) => call('eitherMode', [q.interactive, q.reader]),
};

export function emitQuestion(q) {
  const fn = QUESTION_EMITTERS[q.kind];
  if (!fn) throw new Error(`emit.mjs: no emitter for question kind "${q.kind}"`);
  return fn(q);
}

/* --------------------------------------------------------------- lesson -- */

export function emitLesson(lsn) {
  const opts = nonDefaultOpts(lsn, { minutes: 10 }, ['id', 'title', 'blocks']);
  return call('lesson', [lsn.id, lsn.title, lsn.blocks], opts);
}

export function emitModule(mod) {
  // module_()'s defaults are all empty arrays purely so an author doesn't
  // have to write `lessons: []` etc — a real module always has meaningful
  // content in nearly every field, so unlike blocks there's little to gain
  // from selectively omitting matches; just emit the object as authored.
  return `module_(${emitObject(mod)})`;
}

export function emitLevel(lvl) {
  return `level(${emitObject(lvl)})`;
}
