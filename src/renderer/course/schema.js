/**
 * schema.js — the vocabulary course content is written in.
 *
 * Lessons are DATA, not markup. Each lesson is a list of typed blocks that the
 * renderer knows how to draw. The payoff: an interactive keyboard, a staff
 * example, or a MIDI challenge can be dropped into the middle of a paragraph of
 * prose by adding one object, and every lesson automatically gets consistent
 * styling, progress tracking, and MIDI wiring for free.
 */

/* ---------------------------------------------------------------- blocks -- */

export const prose = (html) => ({ type: 'prose', html });

export const heading = (text, level = 3) => ({ type: 'heading', text, level });

/** variant: tip | warning | key | source | history | ear */
export const callout = (variant, title, html) => ({ type: 'callout', variant, title, html });

export const list = (items, ordered = false) => ({ type: 'list', items, ordered });

export const table = (headers, rows, caption = null) => ({ type: 'table', headers, rows, caption });

/**
 * An interactive keyboard.
 *   highlight  array of note names ('C4') or pitch-class integers
 *   byPitchClass  highlight every octave of those classes
 *   playable   learner can click keys and hear them
 *   play       optional { notes:[...], gap } "listen" button
 */
export const keyboard = (opts = {}) => ({
  type: 'keyboard',
  low: 48, high: 84, playable: true, byPitchClass: false,
  ...opts,
});

/** Staff notation. items: [{ notes:['C4'], duration:'q', label }] */
export const staff = (opts = {}) => ({ type: 'staff', clef: 'treble', ...opts });

/** A full scale explorer bound to a mined scale id, in a chosen key. */
export const scaleExplorer = (scaleId, root = 'C', opts = {}) =>
  ({ type: 'scale', scaleId, root, ...opts });

/** Chord display: builds, shows, plays and lets the learner try it. */
export const chordExplorer = (root, typeId, opts = {}) =>
  ({ type: 'chord', root, typeId, ...opts });

export const circleOfFifths = (opts = {}) => ({ type: 'circle', ...opts });

/** Interval demonstrator with ear-training playback. */
export const intervalDemo = (intervalId, root = 'C4', opts = {}) =>
  ({ type: 'interval', intervalId, root, ...opts });

/** A rhythm pattern the learner can hear and clap back. `pattern` in beats. */
export const rhythm = (pattern, opts = {}) => ({ type: 'rhythm', pattern, ...opts });

/**
 * An inline MIDI challenge inside a lesson. The learner must play `expect`
 * (pitch classes or exact MIDI) before the block turns green.
 *   mode: 'chord' (all at once) | 'sequence' (in order) | 'any'
 */
export const tryIt = (prompt, expect, opts = {}) =>
  ({ type: 'try', prompt, expect, mode: 'sequence', byPitchClass: true, ...opts });

/** A progression the learner can hear and play along with. */
export const progression = (chords, opts = {}) => ({ type: 'progression', chords, ...opts });

/** Cite the source PDFs a lesson draws on. Renders as a provenance footer. */
export const sources = (files) => ({ type: 'sources', files });

/**
 * Marks a place where the source library is genuinely silent on a claim the
 * lesson would otherwise need to make — the authoring grounding rule (see
 * every course syllabus's "Grounding rule") is: if a needed fact isn't in
 * the cited sources, emit this instead of inventing the fact. Renders as a
 * visibly-flagged note, never styled as ordinary content, so a gap can't be
 * mistaken for a taught claim by a learner or missed by a reviewer skimming
 * for `gap(` before a course ships.
 *
 *   note   what's missing and why, e.g. "Library has no stated BPM range
 *          for this technique — needs a source or Miranda's own figure."
 */
export const gap = (note) => ({ type: 'gap', note });

/**
 * A section of explanatory content authored at up to three depth registers —
 * Plain / Standard / Technical — so a learner can ask for the same idea
 * explained more simply or in more depth without leaving the lesson.
 *
 *   plain      optional — a simpler pass, often with an analogy. Falls back
 *              to `standard` if omitted (not every section needs one).
 *   standard   required — the section as it would read with no depth control
 *              at all. This is what a lesson with no depth() blocks always is.
 *   technical  optional — the deeper pass: more precise vocabulary, the
 *              underlying mechanism, an extra worked example. Falls back to
 *              `standard` if omitted.
 *
 * Registers differ in DEPTH, never in the facts asserted — a claim checkable
 * by the theory oracle must appear identically in every branch that carries
 * it. That invariant is enforced by validate-course.mjs, not by this factory.
 *
 * Hard placement rule (also enforced by the validator): a `depth` block may
 * only appear inside a `step`'s `blocks`, and must never contain or nest a
 * `step`. Reason: store.recordStepCheck(lessonId, stepIndex, ok) is keyed by
 * step INDEX. A depth block that changed how many steps a lesson had would
 * silently corrupt every learner's saved progress on that lesson the moment
 * they picked a different register — this rule keeps step count register-
 * invariant so that can't happen.
 */
export const depth = (variants) => ({ type: 'depth', ...variants });

/**
 * A drum step sequencer — the workhorse of the drums course.
 *
 *   lanes  [{ voice, label, steps }] — voice must be one of lib/drums-manifest.js's
 *          VOICES; steps is an array of length `steps`, each entry 0 (silent)
 *          or 1-127 (velocity)
 *   kit    which lib/drums-manifest.js KIT supplies the sound — a lane
 *          declares WHICH voice, the kit decides HOW it sounds, so "play this
 *          pattern on 909 vs 808 vs EDM" is a one-line authoring change
 *
 * All colors in `lanes`/elsewhere are semantic tokens (accent/accent2/
 * accent3/muted/ok/bad), never hex — see blocks.js's renderer for why.
 */
export const drumGrid = (lanes, opts = {}) => ({
  type: 'drums', lanes,
  steps: 16, subdivision: 4, bpm: 120, kit: '909', swing: 0,
  playable: true, editable: false, loop: true,
  caption: null, ...opts,
});

/**
 * A controller's pad grid, row-major (left to right, bottom to top per the
 * hardware convention documented in tools/reference/launchkey-mk4-pad-map.json).
 *   pads   [{ label, voice?, color?, note?, hint? }], length === rows*cols
 *   midi   when true, lights the pad whose `note` matches incoming MIDI —
 *          teaches a layout against the learner's actual connected hardware
 */
export const padMap = (pads, opts = {}) => ({
  type: 'pads', pads, rows: 2, cols: 8,
  playable: true, midi: false, showNotes: false, caption: null, ...opts,
});

/**
 * A song arrangement timeline — sections across the top, tracks below,
 * everything on the same bar scale. Not playable in v1; teaches how drum
 * treatment (and everything else) changes intro -> build -> drop -> outro.
 *   sections  [{ name, bars, color? }] — bars sums to the timeline width
 *   tracks    [{ name, spans: [[startBar, endBar], ...] }] — half-open ranges
 */
export const arrangement = (sections, tracks, opts = {}) => ({
  type: 'arrangement', sections, tracks,
  bars: opts.bars ?? sections.reduce((n, s) => n + (s.bars || 0), 0),
  barLabelEvery: 8, caption: null, ...opts,
});

/**
 * A generic labeled signal-flow / concept diagram with auto-layout — never
 * hand-authored coordinates, which is what keeps this reviewable long-term.
 *   nodes   [{ id, label, sub?, shape?:'box'|'round'|'circle', color?, row?, col? }]
 *   links   [{ from, to, label?, style?:'solid'|'dashed' }]
 *   layout  'chain' (nodes flow left-to-right in array order, the common case
 *           for signal-flow diagrams) | 'stack' (top-to-bottom) | 'grid'
 *           (explicit row/col on every node)
 */
export const diagram = (nodes, links, opts = {}) => ({
  type: 'diagram', nodes, links, layout: 'chain', caption: null, ...opts,
});

/* ------------------------------------------------------------------ quiz -- */

/** Multiple choice. `answer` is the index of the correct option. */
export const mcq = (question, options, answer, explain = '') =>
  ({ kind: 'mcq', question, options, answer, explain });

/** Multiple correct answers. `answer` is an array of indices. */
export const multi = (question, options, answer, explain = '') =>
  ({ kind: 'multi', question, options, answer, explain });

/** Type the answer. `accept` is an array of acceptable strings (case-insensitive). */
export const text = (question, accept, explain = '') =>
  ({ kind: 'text', question, accept, explain });

/**
 * Play it on the keyboard (MIDI or on-screen).
 *   expect  array of note names or pitch classes
 *   mode    'chord' | 'sequence'
 */
export const play = (question, expect, opts = {}) =>
  ({ kind: 'play', question, expect, mode: 'chord', byPitchClass: true, ...opts });

/** Listen, then identify. Plays `notes`, asks which option it was. */
export const ear = (question, notes, options, answer, opts = {}) =>
  ({ kind: 'ear', question, notes, options, answer, gap: 0.45, ...opts });

/** Put the options into the correct order. `answer` is the correct sequence. */
export const order = (question, items, answer, explain = '') =>
  ({ kind: 'order', question, items, answer, explain });

/**
 * A check with a mode-specific pair. Reader Mode cannot answer `play`/`ear`
 * questions, so any interactive check that needs a keyboard or ear must
 * supply a written equivalent testing the same understanding. The
 * `interactive` / `reader` keys deliberately match the stored mode values in
 * store.js settings.lessonMode, so resolving one is a lookup, not a branch —
 * see resolveQuestion() in views/question.js.
 */
export const eitherMode = (interactive, reader) =>
  ({ kind: 'either', interactive, reader });

/* ------------------------------------------------------------------ steps - */

/**
 * One short section of a lesson — a single idea, then a drill on that idea.
 *
 * A lesson written as steps is delivered one step at a time rather than as a
 * single long scroll: the learner reads a little, does the check, and only
 * then moves on. `check` is one question in the same vocabulary as the quiz
 * (mcq / text / play / ear / order / multi), graded the moment it is answered.
 *
 *   title    short imperative or noun phrase — becomes the step's heading
 *   blocks   the teaching blocks for this one idea (aim for 2–4)
 *   check    optional question drilling exactly what this step just taught
 *   asserts  optional array of machine-checkable theory claims this step
 *            makes — validated against lib/theory.js by validate-course.mjs's
 *            theory oracle, e.g.
 *              [{ assert: 'pcSet', root: 'D', semitones: [0,2,3,5,7,9,10],
 *                 notes: ['D','E','F','G','A','B','C'] }]
 *            A checkable claim with no assertion is a missed validation, not
 *            a neutral choice — add one whenever a step states a scale/chord
 *            spelling, an interval size, or a key signature.
 *
 *            Deliberately step-level, not per-depth-register: a step's
 *            asserts describe what the step teaches, and by living outside
 *            any `depth()` branch they're automatically identical across
 *            Plain/Standard/Technical — registers may differ in HOW a claim
 *            is explained, never in WHAT is claimed, and this placement
 *            makes that invariant structural rather than something that
 *            needs separate cross-branch checking.
 *
 * Steps never lock. `check` is an invitation, not a gate — the learner can
 * always move to the next step, matching the course's "progress is a record,
 * never a gate" rule.
 */
export const step = (title, blocks, check = null, asserts = null) =>
  ({ type: 'step', title, blocks, check, ...(asserts ? { asserts } : {}) });

/* -------------------------------------------------------------- structure - */

/* Learner-facing UI shows `title` plus a one-sentence description
 * (`opts.blurb` or piano's existing `opts.intro`) — never the lesson `id`. */
export const lesson = (id, title, blocks, opts = {}) =>
  ({ id, title, blocks, minutes: 10, ...opts });

export const module_ = (cfg) => ({
  lessons: [], exercises: [], checkpoints: [], outcomes: [], sources: [],
  practiceFocus: [], ...cfg,
});

export const level = (cfg) => ({ modules: [], duration: '', ...cfg });
