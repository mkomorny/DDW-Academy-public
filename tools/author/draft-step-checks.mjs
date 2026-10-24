/**
 * draft-step-checks.mjs — draft every step's `check` question via the AI
 * client, grounded strictly in that step's own hand-written prose plus the
 * module's Learning Outcomes, per the plan's rule: prose is hand-converted,
 * never model-written, but the graded check on each step is the AI's one
 * narrow job. Existing checks are only ever REPLACED by ones that pass both
 * a structural shape check (mirroring validate-course.mjs's checkQuestion)
 * and an entailment check (does the drafted question only assert things the
 * step's own prose actually says) — a step that fails both after a retry
 * keeps its previous check and is flagged in the report, never silently
 * left checkless and never silently given an invented fact.
 *
 * Run:  node tools/author/draft-step-checks.mjs <path/to/sections/N.N.js>
 * Writes <path>.drafted.json — a { lessonId: { stepIndex: question } } map
 * for a human to review and splice in (this script never edits course
 * source directly, matching the "authoring script builds data, emit.mjs is
 * the only thing that prints source" split emit.mjs's own header documents).
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { completeJson } from './lib/ai-client.mjs';
import { verifyEntailment } from './lib/verify-entail.mjs';

const NOTE_RE = /^[A-Ga-g](#|b|##|bb)?(-?\d+)?$/;

function stripHtml(html) {
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Plain-text grounding for one step: every block's visible text, in order. */
function stepText(step) {
  const parts = [];
  for (const b of step.blocks) {
    if (b.type === 'prose') parts.push(stripHtml(b.html));
    else if (b.type === 'callout') parts.push(`${b.title}: ${stripHtml(b.html)}`);
    else if (b.type === 'list') parts.push(b.items.map(stripHtml).join('; '));
    else if (b.type === 'table') {
      parts.push(b.caption || '');
      parts.push(b.headers.join(' | '));
      for (const row of b.rows) parts.push(row.join(' | '));
    } else if (b.type === 'diagram') {
      parts.push(b.caption || '');
      parts.push(b.nodes.map((n) => n.label + (n.sub ? ` (${n.sub})` : '')).join(' -> '));
      parts.push(b.links.filter((l) => l.label).map((l) => l.label).join('; '));
    } else if (b.type === 'keyboard') {
      parts.push(b.caption || '');
    }
  }
  return parts.filter(Boolean).join('\n');
}

const SYSTEM = `You are drafting ONE graded check question for a piano course step, for a
beginner learner. You will be given the step's own teaching text (and nothing else) plus the
section's stated learning outcomes for context. Your question must test understanding of a
claim that is ACTUALLY STATED in the step text — never a fact from general knowledge that
happens to be true but isn't in the text, and never a fact from the outcomes list that the step
text itself doesn't cover.

Pick exactly one kind: "mcq" (single correct answer among 4 options), "multi" (2+ correct
answers among 4-5 options), "order" (put 3-5 items in the correct sequence), or "text" (short
exact-answer recall, 1-3 words).

Return JSON matching exactly one of these shapes:
  {"kind":"mcq","question":"...","options":["...","...","...","..."],"answer":0,"explain":"..."}
  {"kind":"multi","question":"...","options":["...","...","...","..."],"answer":[0,2],"explain":"..."}
  {"kind":"order","question":"...","items":["...","...","..."],"answer":["... in correct order ..."],"explain":"..."}
  {"kind":"text","question":"...","accept":["...","..."],"explain":"..."}

Rules: "explain" is one sentence, states WHY the answer is correct, referencing the step text.
For "mcq"/"multi", "answer" is the index (or indices) into "options", not the text. For "order",
"items" and "answer" must contain exactly the same strings, "answer" in the correct sequence.
For "text", "accept" lists every reasonable phrasing of the correct short answer, lowercase.
Never write a question whose correct answer isn't explicitly supported by the step text.`;

async function draftOne(text, outcomes, priorIssues) {
  const feedback = priorIssues
    ? `\n\nA previous draft had these problems, fix them: ${priorIssues.join('; ')}`
    : '';
  const res = await completeJson({
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `STEP TEXT:\n${text}\n\nSECTION LEARNING OUTCOMES (context only, do not test anything not also in the step text above):\n${outcomes.map((o) => `- ${o}`).join('\n')}${feedback}`,
    }],
    task: 'fast',
    maxTokens: 700,
  });
  return res;
}

function shapeProblems(q) {
  const p = [];
  if (!q || !q.kind) return ['missing kind'];
  if (!q.question || typeof q.question !== 'string') p.push('missing question text');
  if (q.kind === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length < 2) p.push('mcq needs >=2 options');
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) p.push('mcq answer index out of range');
    else if (new Set(q.options).size !== q.options.length) p.push('mcq has duplicate options');
  } else if (q.kind === 'multi') {
    if (!Array.isArray(q.options) || q.options.length < 2) p.push('multi needs >=2 options');
    if (!Array.isArray(q.answer) || !q.answer.length) p.push('multi answer must be non-empty array');
    else if (q.answer.some((i) => !Number.isInteger(i) || i < 0 || i >= (q.options || []).length)) p.push('multi answer index out of range');
  } else if (q.kind === 'order') {
    if (!Array.isArray(q.items) || q.items.length < 2) p.push('order needs >=2 items');
    if (!Array.isArray(q.answer) || q.answer.length !== (q.items || []).length) p.push('order answer must be a permutation of items');
    else {
      const a = [...q.items].sort().join(' '), b = [...q.answer].sort().join(' ');
      if (a !== b) p.push('order answer is not a permutation of items');
    }
  } else if (q.kind === 'text') {
    if (!Array.isArray(q.accept) || !q.accept.length) p.push('text needs non-empty accept array');
  } else if (q.kind === 'play' || q.kind === 'ear') {
    p.push(`kind "${q.kind}" not offered to the drafter — needs eitherMode(), out of scope for auto-draft`);
  } else {
    p.push(`unknown kind "${q.kind}"`);
  }
  return p;
}

function questionAsText(q) {
  if (q.kind === 'mcq' || q.kind === 'multi') {
    const ans = Array.isArray(q.answer) ? q.answer.map((i) => q.options[i]).join(', ') : q.options[q.answer];
    return `${q.question} Answer: ${ans}. ${q.explain || ''}`;
  }
  if (q.kind === 'order') return `${q.question} Correct order: ${(q.answer || []).join(' -> ')}. ${q.explain || ''}`;
  if (q.kind === 'text') return `${q.question} Answer: ${(q.accept || []).join(' / ')}. ${q.explain || ''}`;
  return q.question || '';
}

async function draftAndVerify(text, outcomes, label) {
  let issues = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await draftOne(text, outcomes, issues);
    if (!res.ok) return { ok: false, error: res.error };
    const q = res.json;
    const problems = shapeProblems(q);
    if (problems.length) { issues = problems; continue; }
    const ent = await verifyEntailment(questionAsText(q), [{ text, source: { title: label } }]);
    if (!ent.ok) return { ok: false, error: ent.error };
    if (ent.verdict === 'supported') return { ok: true, question: q, attempt: attempt + 1 };
    issues = ent.issues?.length ? ent.issues : [`entailment verdict "${ent.verdict}"`];
  }
  return { ok: false, error: `failed shape/entailment after 2 attempts: ${issues?.join('; ')}` };
}

const [, , modulePathArg] = process.argv;
if (!modulePathArg) {
  console.error('Usage: node tools/author/draft-step-checks.mjs <path/to/sections/N.N.js>');
  process.exit(1);
}
const resolved = path.resolve(process.cwd(), modulePathArg);
const mod = (await import(pathToFileURL(resolved).href)).default;

const out = {};
let ok = 0, failed = 0;
for (const lsn of mod.lessons) {
  const steps = (lsn.blocks || []).filter((b) => b.type === 'step');
  out[lsn.id] = {};
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.check && step.check.kind === 'either') {
      console.log(`[skip] ${lsn.id} step ${i + 1} — eitherMode() check, draft the reader branch by hand`);
      continue;
    }
    const text = stepText(step);
    const label = `${mod.title} — ${lsn.title} — ${step.title}`;
    process.stdout.write(`[draft] ${lsn.id} step ${i + 1} (${step.title})... `);
    const result = await draftAndVerify(text, mod.outcomes || [], label);
    if (result.ok) {
      out[lsn.id][i] = result.question;
      ok++;
      console.log(`ok (attempt ${result.attempt}, kind ${result.question.kind})`);
    } else {
      failed++;
      console.log(`FAILED — ${result.error}`);
    }
  }
}

const outPath = resolved.replace(/\.js$/, '.drafted.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log(`\n${ok} drafted, ${failed} failed. Written to ${outPath}`);
