/**
 * verify-entail.mjs — AI-based entailment check. Fresh context, sees ONLY
 * the step's own text and its cited passages (never the rest of the
 * lesson, never the corpus at large) — asks whether the text is actually
 * supported by those passages. Scoped per STEP, not per block: matches the
 * step-level granularity of schema.js's `asserts` and keeps the call count
 * to one per step instead of one per block.
 */
import { completeJson } from './ai-client.mjs';

const SYSTEM = `You are a strict fact-checker for an educational course. You will be given a
passage of course text and a numbered list of reference excerpts. Your only job is to judge
whether the course text's claims are actually supported by the reference excerpts — not whether
the text is true in general, not whether it's well written. If a claim isn't addressed by the
excerpts at all, it counts as unsupported even if it's common knowledge.

Return JSON: { "verdict": "supported"|"partial"|"unsupported", "issues": [ "one short sentence
per unsupported or unclear claim, quoting the offending phrase" ] }. If verdict is "supported",
issues must be an empty array.`;

/**
 * @param {string} stepText
 * @param {{text:string, source:{title:string}}[]} passages
 * @returns {Promise<{ok:boolean, verdict?:string, issues?:string[], error?:string}>}
 */
export async function verifyEntailment(stepText, passages) {
  if (!passages.length) {
    return { ok: true, verdict: 'unsupported', issues: ['No passages were cited for this step at all.'] };
  }
  const refs = passages.map((p, i) => `[${i + 1}] (${p.source?.title || 'untitled'})\n${p.text}`).join('\n\n');
  const res = await completeJson({
    system: SYSTEM,
    messages: [{ role: 'user', content: `COURSE TEXT:\n${stepText}\n\nREFERENCE EXCERPTS:\n${refs}` }],
    task: 'fast',
    maxTokens: 500,
  });
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, verdict: res.json.verdict, issues: res.json.issues || [] };
}
