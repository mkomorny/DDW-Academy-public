#!/usr/bin/env node
/**
 * run.mjs — the authoring pipeline orchestrator: spec -> retrieve -> draft
 * (AI, closed-book over numbered passages) -> verify (source whitelist,
 * theory oracle, numeric/entity extraction, entailment) -> emit JS.
 *
 * This produces REVIEWABLE OUTPUT, not finished course content. Nothing
 * here ever writes into src/renderer/course/ directly — the emitted file
 * lands in tools/author/out/js/ for a human to read (ideally via
 * review.mjs), then manually move into the real course tree and wire into
 * course/piano/index.js or course/drums/index.js. That manual step is
 * deliberate: curriculum placement is a human decision, not something this
 * script should ever do silently.
 *
 * Run: node tools/author/run.mjs tools/author/spec/<id>.json [--force]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { retrieveForSpec, formatPassagesForPrompt } from './lib/retrieve.mjs';
import { completeJson } from './lib/ai-client.mjs';
import { checkAssertions } from './lib/verify-theory.mjs';
import { verifyNumeric } from './lib/verify-numeric.mjs';
import { verifyEntailment } from './lib/verify-entail.mjs';
import { emitLesson } from './lib/emit.mjs';
import { withDriftMarker, checkDrift } from './lib/drift.mjs';
import { resolveDepth } from '../../src/renderer/course/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_URL = '../schema.js';
const KNOWN_SOURCES_PATH = path.join(__dirname, '..', 'reference', 'known-sources.json');

const FACTORY_NAMES = [
  'level', 'module_', 'lesson', 'step', 'prose', 'heading', 'callout', 'list', 'table',
  'keyboard', 'staff', 'scaleExplorer', 'chordExplorer', 'circleOfFifths', 'intervalDemo',
  'rhythm', 'tryIt', 'progression', 'sources', 'depth', 'drumGrid', 'padMap', 'arrangement', 'diagram',
  'mcq', 'multi', 'text', 'play', 'ear', 'order', 'eitherMode',
];

const DRAFT_SYSTEM = `You are authoring one lesson for a music education app, in a strict JSON
data format. You are CLOSED-BOOK: every factual claim must come from the numbered reference
passages you are given. Do not use outside knowledge for anything checkable (numbers, names,
technical claims) — if the passages don't support something the lesson needs, emit a gap marker
instead of inventing it. This is the single most important rule: an invented BPM number or a
made-up fact is a worse outcome than an honest gap.

Return a single JSON object shaped exactly like this (a "lesson"):
{
  "id": "<the exact lessonId from the spec>",
  "title": "<lesson title>",
  "minutes": <integer>,
  "blocks": [ <3-7 step objects> ]
}

Each step object:
{
  "type": "step",
  "title": "<short imperative or noun phrase>",
  "blocks": [ <2-5 content blocks: see below> ],
  "check": <one question object, see below>,
  "asserts": [ <optional array of machine-checkable claims, see below> ]
}

Content block types you may use (JSON shape, matching the app's schema.js factories):
  { "type": "prose", "html": "<p-worthy text, may include <strong>/<em>/<br> tags>" }
  { "type": "callout", "variant": "tip"|"warning"|"key"|"history", "title": "...", "html": "..." }
  { "type": "list", "items": ["...", "..."], "ordered": false }
  { "type": "table", "headers": [...], "rows": [[...],[...]], "caption": "..." }
  { "type": "gap", "note": "<what couldn't be written because the passages don't support it>" }

For roughly 40% of steps — the ones with real explanatory weight — wrap the explanatory content
in a depth block instead of plain prose/callout blocks, so the lesson has Plain/Standard/Technical
registers:
  { "type": "depth", "plain": [<1-2 blocks, simpler, an analogy if it helps>],
    "standard": [<1-3 blocks, the default reading>],
    "technical": [<1-3 blocks, one level deeper: more precise, an extra mechanism or example>] }
IMPORTANT: plain/standard/technical must NEVER disagree on facts — only on how much detail and
how technical the language is. If standard says a scale has 7 notes, technical cannot say 6.

Question objects for "check" (exactly one of these kinds):
  { "kind": "mcq", "question": "...", "options": ["...","...","...","..."], "answer": <index>, "explain": "..." }
  { "kind": "multi", "question": "...", "options": [...], "answer": [<ascending indices>], "explain": "..." }
  { "kind": "order", "question": "...", "items": [...], "answer": [<items in correct order>], "explain": "..." }
  { "kind": "text", "question": "...", "accept": ["...", "..."], "explain": "..." }
Do not use "play" or "ear" question kinds — those need a special reader-mode pairing this
pipeline doesn't build yet.

Assertion objects for "asserts" (only include a claim you can express this way — add one whenever
a step states a scale/chord spelling, an interval size, or a key signature; these are machine-
checked against real theory logic, so get them RIGHT):
  { "assert": "pcSet", "root": "D", "semitones": [0,2,3,5,7,9,10], "notes": ["D","E","F","G","A","B","C"] }
  { "assert": "interval", "from": "C4", "to": "G4", "semitones": 7 }
  { "assert": "keySignature", "key": "D", "sharps": 2 }

At least one step must include a { "type": "sources", "files": ["<exact SOURCE TITLE from the
passages you actually used>"] } block citing the real source titles of the passages you drew on —
copy each SOURCE TITLE EXACTLY as given after "SOURCE TITLE:", never invent, abbreviate, or use
any other form of the name.`;

function buildDraftPrompt(spec, passages) {
  return [
    `LESSON SPEC`,
    `lessonId: ${spec.lessonId}`,
    `title: ${spec.title}`,
    `target word count: ~${spec.targetWords || 600}`,
    `step count: ~${spec.stepCount || 5}`,
    spec.mustCover?.length ? `must cover: ${spec.mustCover.join('; ')}` : '',
    spec.mustNotCover?.length ? `must NOT cover (has its own lesson): ${spec.mustNotCover.join('; ')}` : '',
    '',
    `REFERENCE PASSAGES (numbered, closed-book — use ONLY these for facts)`,
    formatPassagesForPrompt(passages),
  ].filter(Boolean).join('\n');
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** All prose/callout text in a step's blocks, standard register, plain text. */
function stepText(step) {
  const blocks = resolveDepth(step.blocks || [], 'standard');
  return blocks
    .filter((b) => b.type === 'prose' || b.type === 'callout')
    .map((b) => stripHtml(b.html))
    .join(' ');
}

async function main() {
  const specArg = process.argv[2];
  const FORCE = process.argv.includes('--force');
  if (!specArg) {
    console.error('Usage: node tools/author/run.mjs tools/author/spec/<id>.json [--force]');
    process.exit(1);
  }
  const spec = JSON.parse(fs.readFileSync(specArg, 'utf8'));
  console.log(`Authoring "${spec.title}" (${spec.lessonId})\n`);

  console.log('Retrieving passages...');
  const passages = retrieveForSpec(spec.queries || [], { tracks: spec.tracks });
  console.log(`  ${passages.length} passages retrieved from the corpus.`);
  if (!passages.length) {
    console.error('No passages retrieved — check spec.queries / spec.tracks against the corpus index (tools/corpus/cli.mjs to test queries by hand).');
    process.exit(1);
  }

  console.log('Drafting via AI (closed-book over the retrieved passages)...');
  const draftRes = await completeJson({
    system: DRAFT_SYSTEM,
    messages: [{ role: 'user', content: buildDraftPrompt(spec, passages) }],
    task: 'deep',
    maxTokens: 8000,
  });
  if (!draftRes.ok) { console.error('Draft failed:', draftRes.error); process.exit(1); }
  const draft = draftRes.json;
  console.log(`  Drafted with ${draftRes.provider}/${draftRes.model}.`);

  if (!draft || typeof draft.id !== 'string' || typeof draft.title !== 'string' || !Array.isArray(draft.blocks)) {
    console.error('Draft is not a valid lesson shape (needs id/title/blocks). Aborting before emitting anything.');
    console.error(JSON.stringify(draft, null, 1).slice(0, 1000));
    process.exit(1);
  }

  console.log('\nVerifying...');
  const knownSources = new Set(fs.existsSync(KNOWN_SOURCES_PATH) ? JSON.parse(fs.readFileSync(KNOWN_SOURCES_PATH, 'utf8')) : []);
  const steps = draft.blocks.filter((b) => b.type === 'step');
  let gapCount = 0, sourceIssues = 0, theoryIssues = 0, numericIssues = 0, entailIssues = 0;
  const report = [];

  for (const s of steps) {
    const flatBlocks = resolveDepth(s.blocks || [], 'all');
    const gaps = flatBlocks.filter((b) => b.type === 'gap');
    gapCount += gaps.length;
    gaps.forEach((g) => report.push(`  [gap] "${s.title}": ${g.note}`));

    const cited = flatBlocks.filter((b) => b.type === 'sources').flatMap((b) => b.files);
    for (const f of cited) {
      if (!knownSources.has(f)) {
        sourceIssues++;
        report.push(`  [source] "${s.title}": cites "${f}" — not found in tools/reference/known-sources.json`);
      }
    }

    if (s.asserts) {
      const { ok, problems } = checkAssertions(s.asserts);
      if (!ok) { theoryIssues++; report.push(`  [theory] "${s.title}": ${problems[0]}`); }
      else { theoryIssues += problems.length; problems.forEach((p) => report.push(`  [theory] "${s.title}": ${p}`)); }
    }

    const text = stepText(s);
    if (text) {
      const nums = verifyNumeric(text, passages).filter((r) => !r.supported);
      numericIssues += nums.length;
      nums.forEach((n) => report.push(`  [numeric] "${s.title}": unsupported ${n.kind} claim "${n.claim}"`));

      const entail = await verifyEntailment(text, passages);
      if (entail.ok && entail.verdict !== 'supported') {
        const n = (entail.issues || []).length || 1;
        entailIssues += n;
        report.push(`  [entail:${entail.verdict}] "${s.title}": ${(entail.issues || []).join(' | ') || '(no detail)'}`);
      } else if (!entail.ok) {
        report.push(`  [entail:error] "${s.title}": ${entail.error}`);
      }
    }
  }

  if (report.length) { console.log(report.join('\n')); } else { console.log('  No issues raised by any verification pass.'); }
  console.log(`\nSummary: ${gapCount} gap(s), ${sourceIssues} source issue(s), ${theoryIssues} theory issue(s), ${numericIssues} numeric issue(s), ${entailIssues} entailment issue(s).`);

  const reportPath = path.join(__dirname, 'out', 'ir', `${spec.lessonId}.report.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    lessonId: spec.lessonId, generatedAt: new Date().toISOString(),
    counts: { gapCount, sourceIssues, theoryIssues, numericIssues, entailIssues },
    lines: report,
  }, null, 1));

  const irPath = path.join(__dirname, 'out', 'ir', `${spec.lessonId}.json`);
  fs.mkdirSync(path.dirname(irPath), { recursive: true });
  fs.writeFileSync(irPath, JSON.stringify(draft, null, 1));
  console.log(`\nWrote IR: ${irPath}`);

  // Saved alongside the IR so review.mjs can show cited passages without
  // re-running retrieval (and so a review reflects exactly what THIS run saw).
  const passagesPath = path.join(__dirname, 'out', 'ir', `${spec.lessonId}.passages.json`);
  fs.writeFileSync(passagesPath, JSON.stringify(passages, null, 1));

  const jsPath = path.join(__dirname, 'out', 'js', `${spec.lessonId}.js`);
  fs.mkdirSync(path.dirname(jsPath), { recursive: true });
  if (fs.existsSync(jsPath) && !FORCE) {
    const drift = checkDrift(fs.readFileSync(jsPath, 'utf8'));
    if (drift === 'edited') {
      console.error(`\nREFUSING to overwrite ${jsPath} — it has been hand-edited since it was generated.`);
      console.error('The IR was still written above. Re-run with --force to overwrite the JS anyway.');
      process.exit(1);
    }
  }
  const body = `import {\n  ${FACTORY_NAMES.join(', ')},\n} from '${SCHEMA_URL}';\n\nexport default ${emitLesson(draft)};\n`;
  fs.writeFileSync(jsPath, withDriftMarker(body));
  console.log(`Emitted JS: ${jsPath}`);

  const hasBlockingIssues = sourceIssues > 0 || theoryIssues > 0;
  console.log(hasBlockingIssues
    ? '\n✗ This draft has source or theory-oracle issues — fix before wiring into the real course.'
    : '\n✓ No blocking issues. Still needs human review (node tools/author/review.mjs) before it counts as done.');
  process.exit(hasBlockingIssues ? 1 : 0);
}

main();
