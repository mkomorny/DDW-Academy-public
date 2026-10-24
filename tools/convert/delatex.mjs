/**
 * delatex.mjs — strips LaTeX math markup out of Miranda's course prose and
 * replaces it with the plain Unicode/HTML the app can actually render.
 *
 * Why this exists: the app has ZERO runtime dependencies (see package.json —
 * no math renderer, no MathJax/KaTeX) and blocks render `html` strings
 * directly (schema.js's `prose(html)`), so a literal `$C\sharp$` would ship
 * to a learner exactly as typed. The new course packs use LaTeX pervasively
 * as typographic decoration around music symbols — 55 of 56 Piano files,
 * ~1,700 inline spans + dozens of display blocks — almost none of it is
 * real mathematics (`$C$`, `$B\flat$`, `$C_3$`, `$\to$`, `$\text{V}$`).
 *
 * Scope discipline: every transform below operates ONLY on text captured
 * between `$...$` or `$$...$$` delimiters. Nothing outside those delimiters
 * is ever touched — that's what keeps this safe to run over real markdown
 * prose, which uses bare `_underscore_` for italics and `**star**` for bold
 * constantly. A global regex over the whole file would corrupt both.
 *
 * Pipeline per math span (order matters — see comments):
 *   1. Iteratively unwrap \text{}/\mathrm{}/\mathit{} to fixpoint. This must
 *      run FIRST because everything below assumes brace-free arguments.
 *   2. Resolve the braced commands that consume their own single-level
 *      arguments: \unicode{xNNNN}, \frac{a}{b}/\tfrac{a}{b}, \hat{X},
 *      \xrightarrow{X}.
 *   3. Flat symbol-table substitution (\sharp, \flat, \to, \circ, …).
 *      Deliberately BEFORE sup/sub — a bare superscripted command like
 *      `^\circ` must already be `^°` before sup/sub decides what one
 *      character to lift, or the caret is left orphaned in the output.
 *   4. Superscript/subscript shorthand (`^{x}`/`_{x}` and bare `^x`/`_x`)
 *      to real `<sup>`/`<sub>`. Deliberately BEFORE the \mathbf pass — a
 *      bolded run routinely contains its own superscript
 *      (`\mathbf{ii^7 \to I^{maj7}}`), and \mathbf{}'s own regex can't see
 *      past that nested `{maj7}` brace pair until sup/sub has flattened it.
 *   5. \mathbf{X} -> <strong>X</strong>. Last of the brace-consuming passes,
 *      for the reason above.
 *   6. Whitespace cleanup.
 *
 * Idempotent by construction: once a span's `$`/`$$` delimiters are consumed
 * by the outer replace, nothing downstream re-introduces them, so a second
 * pass over already-converted text is a no-op.
 *
 * Two entry points, not one — this matters:
 *   delatex(text)      HTML mode. For `prose()`/`callout()` `html` strings,
 *                       which the renderer inserts as raw innerHTML
 *                       (blocks.js: `<p>${b.html}</p>`) — <sup>/<sub>/
 *                       <strong> render as real markup.
 *   delatexPlain(text)  Plain-text mode. For anything that goes through
 *                       `escapeHtml()` before display — module_()'s
 *                       `outcomes[]`/`practiceFocus[]`/`checkpoints[]` and
 *                       lesson titles (learn.js: `escapeHtml(o)` etc). If
 *                       HTML-mode output landed here, a viewer would see
 *                       the literal text "<sup>7</sup>" on screen — escaped
 *                       tags, not real superscript. Plain mode uses Unicode
 *                       superscript/subscript characters instead and never
 *                       emits a tag.
 */

/** Iteratively unwrap \text{}, \mathrm{}, \mathit{} — these never contain
 *  literal music symbols in this corpus, only prose, so unwrapping just
 *  removes the wrapper. Runs to a fixpoint so nesting resolves regardless
 *  of depth. */
function unwrapTextLike(s) {
  let prev;
  do {
    prev = s;
    s = s.replace(/\\(?:text|mathrm|mathit)\{([^{}]*)\}/g, '$1');
  } while (s !== prev);
  return s;
}

/** \unicode{xNNNN} -> the actual character (e.g. the pedal mark 𝄮). */
function resolveUnicodeEscapes(s) {
  return s.replace(/\\unicode\{x([0-9A-Fa-f]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

/** \frac{a}{b} and \tfrac{a}{b} -> "a/b". Simple slash, not a real HTML
 *  fraction — every use in this corpus is a short numeric ratio
 *  (note values, downforce formulas), not worth a <sup>/<sub> stack. */
function resolveFractions(s) {
  return s.replace(/\\t?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
}

/** \hat{7} -> "7" with a combining circumflex (U+0302) — the standard
 *  scale-degree caret ("the leading tone is scale degree 7-hat"). */
function resolveHat(s) {
  return s.replace(/\\hat\{([^{}]*)\}/g, '$1̂');
}

/** \xrightarrow{+P5} -> "→ (+P5)"; bare \xrightarrow with no braces -> "→". */
function resolveXrightarrow(s) {
  return s.replace(/\\xrightarrow\{([^{}]*)\}/g, '→ ($1)').replace(/\\xrightarrow\b/g, '→');
}

/** \mathbf{X} -> <strong>X</strong> in HTML mode, or just X in plain mode
 *  (plain text has no bold). Must run LAST of the brace-consuming passes —
 *  after resolveSupSub too, not just the \text unwrap — because a bolded
 *  run commonly contains its own superscript, e.g.
 *  `\mathbf{\text{ii}^7 \to \text{I}^{\text{maj}7}}`. Once \text{} is
 *  unwrapped that's still `\mathbf{ii^7 \to I^{maj7}}` — the trailing
 *  `^{maj7}` is a brace pair \mathbf{}'s own non-nesting regex can't see
 *  past. Caught live: this exact line in Bonus_A left `\mathbf{ii^7…`
 *  unconverted until resolveSupSub was moved ahead of this function. */
function resolveMathbf(s, mode) {
  return s.replace(/\\mathbf\{([^{}]*)\}/g, mode === 'plain' ? '$1' : '<strong>$1</strong>');
}

/** Flat symbol-table substitution. Each entry is `\command` with a trailing
 *  word boundary, so `\to` cannot accidentally match inside `\rightarrow`
 *  (the character after "right" in "rightarrow" is "a", a word character,
 *  so \b fails there — confirmed, no ordering dependency between entries). */
const SYMBOLS = [
  [/\\longleftrightarrow\b/g, '↔'],
  [/\\leftrightarrow\b/g, '↔'],
  [/\\longrightarrow\b/g, '→'],
  [/\\rightarrow\b/g, '→'],
  [/\\Rightarrow\b/g, '⇒'],
  [/\\implies\b/g, '⇒'],
  [/\\to\b/g, '→'],
  [/\\sharp\b/g, '♯'],
  [/\\flat\b/g, '♭'],
  [/\\natural\b/g, '♮'],
  [/\\times\b/g, '×'],
  [/\\approx\b/g, '≈'],
  [/\\pm\b/g, '±'],
  // Degree sign and the diminished-chord symbol are typographically the
  // same glyph in music notation (C° = C diminished), so \circ maps to °
  // whether it appeared over an angle ($90^\circ$) or a chord ($C^\circ$).
  [/\\circ\b/g, '°'],
  [/\\quad\b/g, '  '],
  [/\\dots\b/g, '…'],
  [/\\gg\b/g, '≫'],
  [/\\ll\b/g, '≪'],
  [/\\Delta\b/g, 'Δ'],
  [/\\llcorner\b/g, '⌞'],
  [/\\lrcorner\b/g, '⌟'],
  [/\\left\b\s*/g, ''],
  [/\\right\b\s*/g, ''],
  [/\\cdot\b/g, '·'],
  [/\\infty\b/g, '∞'],
  [/\\neq\b/g, '≠'],
  [/\\le\b/g, '≤'],
  [/\\ge\b/g, '≥'],
  [/\\%/g, '%'],
  [/\\_/g, '_'],
];

function substituteSymbols(s) {
  for (const [re, replacement] of SYMBOLS) s = s.replace(re, replacement);
  return s;
}

/* Plain-text superscript/subscript character maps — Unicode's actual
 * "Superscripts and Subscripts" + phonetic-extension modifier-letter blocks,
 * not a font trick. Covers everything this corpus's braced/bare sup-sub
 * content actually uses (digits, +/-, and the handful of chord-quality
 * letters like "maj"/"dim"/"ø"). A character with no mapping is left as-is
 * rather than dropped — an unstyled digit is a smaller defect than a
 * silently vanished one. */
const SUP_MAP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
  '+': '⁺', '-': '⁻', a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ',
  v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ' };
// 'ø' (half-diminished) has no Unicode superscript form — left unmapped so
// toSup()'s ?? fallback keeps it at full size, e.g. "ø7" -> "ø⁷".
const SUB_MAP = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
  '+': '₊', '-': '₋' };

const toSup = (chars) => [...chars].map((c) => SUP_MAP[c] ?? c).join('');
const toSub = (chars) => [...chars].map((c) => SUB_MAP[c] ?? c).join('');

/** `^{x}`/`_{x}` and bare `^x`/`_x` (single token) -> real <sup>/<sub> in
 *  HTML mode, or the Unicode superscript/subscript equivalent in plain
 *  mode. Runs AFTER substituteSymbols (see convertSpan) so that a bare
 *  superscripted command like `^\circ` has already become `^°` by the time
 *  this looks at it — every SYMBOLS entry replaces with 0 or 1 characters,
 *  so the bare-token patterns below only ever need to grab exactly one
 *  character after the `^`/`_`, never a whitelist of allowed ones. Caught
 *  live: `$90^\circ$` (Section 1.2) and every diminished-chord `C^\circ`
 *  left a literal orphaned caret (`^°`) when substituteSymbols ran after
 *  this instead of before.
 *
 *  Also safe to run before resolveMathbf: by this point every command that
 *  legitimately wraps a multi-char argument in braces (\hat, \frac,
 *  \mathbf, \unicode) has already consumed its own braces, so any `{...}`
 *  still attached to a bare `^`/`_` here is a genuine LaTeX superscript/
 *  subscript, not a leftover command argument. */
function resolveSupSub(s, mode) {
  if (mode === 'plain') {
    return s
      .replace(/\^\{([^{}]+)\}/g, (_, c) => toSup(c))
      .replace(/_\{([^{}]+)\}/g, (_, c) => toSub(c))
      .replace(/\^(\S)/g, (_, c) => toSup(c))
      .replace(/_(\S)/g, (_, c) => toSub(c));
  }
  return s
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    .replace(/\^(\S)/g, '<sup>$1</sup>')
    .replace(/_(\S)/g, '<sub>$1</sub>');
}

/** `\text{--}` unwraps to a literal "--" in this corpus (Miranda's way of
 *  writing an en dash between note names, e.g. C--E--G). Convert those to
 *  a real en dash. Must run after unwrapTextLike, which is what produces
 *  the "--" in the first place. */
function enDashify(s) {
  return s.replace(/--/g, '–');
}

function collapseWhitespace(s) {
  return s.replace(/[ \t]{2,}/g, ' ').trim();
}

/** Strips markdown `**bold**` markers. Scoped to delatexPlain() only, and
 *  runs on the WHOLE string rather than inside a `$...$` span like the rest
 *  of this file's passes — the markdown lives in the surrounding prose, not
 *  inside math delimiters. Safe specifically because every delatexPlain()
 *  call site (outcomes[]/practiceFocus[]/checkpoints[]/titles) renders
 *  through escapeHtml(), never a markdown renderer, so "**Launchkey MK4**"
 *  would otherwise show the literal asterisks on screen — the same reason
 *  resolveMathbf() drops \mathbf{} bold instead of emitting <strong> in
 *  plain mode. delatex() (HTML mode, for prose()/callout() bodies) is left
 *  alone; those already receive literal HTML during hand-authoring. */
function stripMarkdownBold(s) {
  return s.replace(/\*\*(.+?)\*\*/g, '$1');
}

/** The full per-span pipeline, applied to the text between one pair of
 *  `$`/`$$` delimiters (delimiters themselves are stripped by the caller).
 *  `mode` is 'html' (default) or 'plain' — see the module header comment. */
function convertSpan(raw, mode) {
  let s = raw;
  s = unwrapTextLike(s);
  s = enDashify(s);
  s = resolveUnicodeEscapes(s);
  s = resolveFractions(s);
  s = resolveHat(s);
  s = resolveXrightarrow(s);
  // Symbols BEFORE sup/sub — see resolveSupSub's own comment for why
  // (a bare `^\circ` must become `^°` before sup/sub looks at it).
  s = substituteSymbols(s);
  // sup/sub BEFORE mathbf — see resolveMathbf's own comment for why.
  s = resolveSupSub(s, mode);
  s = resolveMathbf(s, mode);
  s = collapseWhitespace(s);
  return s;
}

function convert(text, mode) {
  // Display math first — a single-$ regex run first would misparse a
  // $$...$$ block as two empty $...$ spans back to back.
  let out = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, inner) => convertSpan(inner, mode));
  // Then inline math. Non-greedy, does not cross a newline, so a stray
  // unpaired '$' (e.g. a real currency amount, none exist in this corpus)
  // can't swallow the rest of the document.
  out = out.replace(/\$([^$\n]+?)\$/g, (_, inner) => convertSpan(inner, mode));
  return out;
}

/**
 * Convert every `$$...$$` and `$...$` span in `text` to plain Unicode/HTML,
 * stripping the delimiters. Everything outside a math span is returned
 * byte-for-byte unchanged. HTML mode — for `prose()`/`callout()` html
 * strings only. See the module header comment for when to use this vs
 * delatexPlain().
 *
 * Display ($$...$$) spans are NOT re-wrapped in any container — this
 * function only does character-level symbol conversion. Whether a given
 * formula becomes its own <p>, a callout, or stays inline is an authoring
 * decision made when composing the prose()/callout() call, not something
 * this mechanical pass should guess.
 */
export function delatex(text) {
  return convert(text, 'html');
}

/**
 * Same conversion, but for text that will be escaped before display —
 * `outcomes[]`, `practiceFocus[]`, `checkpoints[]`, lesson titles. Emits
 * Unicode superscript/subscript characters instead of <sup>/<sub> tags and
 * drops bold rather than emitting <strong>, since escapeHtml() would turn
 * either tag into visible literal text. See the module header comment.
 */
export function delatexPlain(text) {
  return stripMarkdownBold(convert(text, 'plain'));
}

/** True if `text` still contains any `$`-delimited span or a bare
 *  backslash-command outside one — i.e. delatex() has more to do, or
 *  something in the source doesn't match the patterns this module knows
 *  about and needs a human look rather than a silent pass-through. */
export function hasUnconvertedLatex(text) {
  return /\$/.test(text) || /\\[a-zA-Z]+\{/.test(text);
}
