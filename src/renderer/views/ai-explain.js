/**
 * ai-explain.js — the depth escape hatch: "Explain differently" / "Go
 * deeper", live AI beyond the three baked registers (see schema.js's
 * depth() and stepper.js).
 *
 * Two rules that exist to protect the provenance guarantee the whole
 * corpus/validator pipeline was built for:
 *   1. Grounded — the prompt includes the step's own rendered text plus any
 *      matching src/data/snippets.json excerpts, and the model is instructed
 *      not to introduce claims those don't support.
 *   2. Ephemeral and visibly labeled — the output is never written into
 *      course content, and is always shown under "AI explanation — not part
 *      of the course" so it can never be mistaken for authored material.
 * All network access goes through window.ai.complete() (see
 * src/main/ai-providers.js) — this file never calls fetch() itself, which is
 * what keeps index.html's CSP (`connect-src 'self'`) untouched.
 */

import { escapeHtml, el } from '../app.js';
import { snippetsFor } from '../lib/snippets.js';

const PROMPTS = {
  simpler: {
    label: 'Explain differently',
    task: 'fast',
    system: 'You are a friendly music tutor. Re-explain the given section in simpler terms than it '
      + 'currently uses, ideally with a plain-language analogy. Stay strictly grounded in the provided '
      + 'section content and reference excerpts — do not introduce facts, numbers, or claims they do not '
      + 'support. If you are not confident something is supported, leave it out rather than guess. Keep '
      + 'it under 120 words, plain text, no markdown headers.',
  },
  deeper: {
    label: 'Go deeper',
    task: 'deep',
    system: 'You are an expert music theory and production tutor. Go one level deeper than the given '
      + 'section: add the underlying mechanism, a more precise technical detail, or one extra worked '
      + 'example. Stay strictly grounded in the provided section content and reference excerpts — do not '
      + 'introduce facts, numbers, or claims they do not support. If you are not confident something is '
      + 'supported, leave it out rather than guess. Keep it under 150 words, plain text, no markdown headers.',
  },
};

/**
 * @param {HTMLElement} host
 * @param {{ stepTitle: string, stepText: string, sources: string[], lessonTitle: string }} ctx
 * @returns {{ node: HTMLElement, teardown: () => void }}
 */
export function renderAiExplain(host, ctx) {
  let cancelled = false;
  let busy = false;

  const wrap = el(`<div class="ai-explain">
    <div class="row ai-explain-buttons" style="gap:8px">
      <button class="btn sm ghost ai-explain-btn" data-mode="simpler">${escapeHtml(PROMPTS.simpler.label)}</button>
      <button class="btn sm ghost ai-explain-btn" data-mode="deeper">${escapeHtml(PROMPTS.deeper.label)}</button>
    </div>
    <div class="ai-explain-out"></div>
  </div>`);
  host.append(wrap);

  function paint(html) {
    if (cancelled) return;
    wrap.querySelector('.ai-explain-out').innerHTML = html;
  }

  const cardShell = (bodyHtml) => `<div class="ai-explain-card">
    <div class="ai-explain-label">AI explanation — not part of the course</div>
    ${bodyHtml}
  </div>`;

  wrap.querySelectorAll('.ai-explain-btn').forEach((btn) => {
    btn.onclick = async () => {
      if (busy) return;
      const mode = btn.dataset.mode;
      const spec = PROMPTS[mode];

      const status = await window.ai?.status();
      if (cancelled) return;
      if (!status?.configured) {
        paint(cardShell('<p class="small muted">No AI provider configured yet — add an API key in Settings to use this.</p>'));
        return;
      }

      busy = true;
      paint(cardShell('<p class="small muted">Thinking…</p>'));

      const snippets = await snippetsFor(ctx.sources);
      if (cancelled) { busy = false; return; }

      const grounding = [
        `Lesson: ${ctx.lessonTitle}`,
        `Section: ${ctx.stepTitle}`,
        `Section content:\n${ctx.stepText}`,
        snippets.length ? `Reference excerpts from the course's own sources:\n${snippets.map((s) => `- ${s.text}`).join('\n')}` : '',
      ].filter(Boolean).join('\n\n');

      const res = await window.ai.complete({
        system: spec.system,
        messages: [{ role: 'user', content: grounding }],
        task: spec.task,
        maxTokens: 300,
      });

      busy = false;
      if (cancelled) return;

      if (res.ok) {
        paint(cardShell(
          `<p>${escapeHtml(res.text)}</p>`
          + `<div class="small muted mt ai-explain-meta">${escapeHtml(res.provider)} · ${escapeHtml(res.model)}</div>`,
        ));
      } else {
        paint(cardShell(`<p class="small muted">Couldn't get a response: ${escapeHtml(res.error)}</p>`));
      }
    };
  });

  return { node: wrap, teardown: () => { cancelled = true; } };
}
