/**
 * stepper.js — delivers a lesson a little at a time.
 *
 * Why this exists: the course content was originally one long scroll per
 * lesson, with the only exercise at the end of the whole module. That is a lot
 * of reading before anything is drilled in, and it made the material hard to
 * follow. A lesson is now a short sequence of STEPS — one idea each, followed
 * by a check on that idea.
 *
 * Two rules shape the design:
 *
 *  1. Nothing locks. The check is an invitation. `Next` is always live, and a
 *     wrong answer never blocks the road — it just shows the explanation. This
 *     matches the course rule that progress is a record, never a gate.
 *
 *  2. Only the current step is mounted. Steps contain live keyboards, staves
 *     and MIDI listeners; mounting all of them at once is what made the old
 *     long-scroll lessons heavy. Each step's blocks are torn down on leaving,
 *     so exactly one set of MIDI subscriptions is ever active.
 *
 * Lessons that have not been rewritten as steps yet still work: autoSteps()
 * segments a flat block list into sections on natural boundaries, so every
 * lesson gets short-section delivery even before its checks are authored.
 */

import { escapeHtml, el } from '../app.js';
import { store } from '../lib/store.js';
import { renderBlocks } from './blocks.js';
import { renderQuestion, resolveQuestion } from './question.js';
import { renderAiExplain } from './ai-explain.js';
import { resolveDepth } from '../course/index.js';

/** Block types that carry an idea's payload rather than framing it. */
const HEAVY = new Set(['keyboard', 'staff', 'scale', 'chord', 'circle', 'interval',
  'rhythm', 'progression', 'try', 'table', 'drums', 'pads', 'arrangement', 'diagram']);

/**
 * Segment a flat block list into steps for lessons not yet authored as steps.
 *
 * Rules, in order of precedence:
 *   - a `heading` always starts a new step and names it;
 *   - `sources` is framing, and always stays with the final step;
 *   - otherwise close the step once it holds a heavy block AND some prose, or
 *     once it reaches four blocks, so no section is a wall of text.
 */
export function autoSteps(blocks) {
  const steps = [];
  let cur = null;
  const open = (title) => { cur = { type: 'step', title, blocks: [], check: null }; steps.push(cur); };

  for (const b of blocks) {
    if (b.type === 'heading') { open(b.text); continue; }
    if (!cur) open(null);

    cur.blocks.push(b);

    const heavy = cur.blocks.filter((x) => HEAVY.has(x.type)).length;
    const prose = cur.blocks.filter((x) => x.type === 'prose' || x.type === 'callout').length;
    if (b.type !== 'sources' && ((heavy >= 1 && prose >= 1 && cur.blocks.length >= 3) || cur.blocks.length >= 4)) {
      cur = null;
    }
  }

  // Fold a trailing orphan (often just `sources`) back into the previous step.
  if (steps.length > 1) {
    const last = steps[steps.length - 1];
    const onlyFraming = last.blocks.every((b) => b.type === 'sources');
    if (onlyFraming || last.blocks.length === 1) {
      steps[steps.length - 2].blocks.push(...last.blocks);
      steps.pop();
    }
  }
  return steps;
}

/** True when the lesson has been authored as explicit steps. */
export const hasSteps = (lesson) => lesson.blocks.some((b) => b.type === 'step');

/**
 * The steps of a lesson, authored or derived, with any `depth` wrapper
 * blocks resolved to one register's plain block list.
 *
 * `register` defaults to the learner's saved preference. Passing it
 * explicitly is only needed for something that must compare across
 * registers (nothing currently does) — the normal call is `stepsOf(lesson)`.
 * Step COUNT and step CHECKS never vary by register (that invariant is the
 * whole reason `depth` is restricted to living inside a step, see
 * schema.js's depth() doc comment) — only the teaching blocks inside a step
 * do, so resolving here rather than per-render is just where it's cheapest.
 */
export function stepsOf(lesson, register = store.get('depth') || 'standard') {
  if (!hasSteps(lesson)) return autoSteps(lesson.blocks);
  // An authored lesson may still open with un-stepped framing blocks; those
  // belong to the first step rather than being silently dropped.
  const steps = [];
  let lead = [];
  for (const b of lesson.blocks) {
    if (b.type === 'step') {
      steps.push({ ...b, blocks: resolveDepth([...lead, ...b.blocks], register) });
      lead = [];
    } else {
      lead.push(b);
    }
  }
  // Trailing un-stepped blocks (usually a `sources` footer) join the last step
  // rather than being silently dropped.
  if (lead.length && steps.length) steps[steps.length - 1].blocks.push(...lead);
  return steps;
}

/**
 * Mount the stepper.
 *   host    element to render into
 *   lesson  the lesson object
 *   ctx     app context passed through to blocks
 *   onDone  called when the learner finishes the last step
 * Returns a teardown.
 */
export function renderStepper(host, lesson, ctx, onDone) {
  // `let`, not `const` — changing the depth register re-resolves each step's
  // depth() blocks to a different branch, so the block lists themselves are
  // rebuilt. `total` stays a plain const: step COUNT is register-invariant
  // by design (see stepsOf()'s doc comment), so it's safe to compute once.
  let steps = stepsOf(lesson);
  const total = steps.length;
  let idx = 0;
  let stepTeardown = null;
  let question = null;
  let aiTeardown = null;

  const ui = el(`<div class="stepper">
    <div class="step-rail">
      <div class="step-dots"></div>
      <div class="row step-mode" style="gap:6px">
        <button class="btn sm mode-int" title="Answer by playing or listening">Interactive</button>
        <button class="btn sm mode-read" title="Answer written questions only">Reader</button>
      </div>
      <div class="row step-depth" style="gap:6px" title="How much explanation each section shows">
        <button class="btn sm depth-plain">Plain</button>
        <button class="btn sm depth-standard">Standard</button>
        <button class="btn sm depth-technical">Technical</button>
      </div>
      <div class="step-count small muted"></div>
    </div>
    <div class="step-card">
      <div class="step-head" style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div class="step-eyebrow small"></div>
          <h2 class="step-title"></h2>
        </div>
        <div class="ai-difficulty-controls row" style="gap:8px; align-items:center;">
          <span class="small muted">AI Difficulty:</span>
          <select class="sel sm ai-diff-sel">
            <option value="original">Original</option>
            <option value="Layman">Layman</option>
            <option value="Beginner">Beginner</option>
            <option value="Novice">Novice</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Professional">Professional</option>
            <option value="Expert">Expert</option>
          </select>
          <button class="btn sm ai-diff-btn">Rewrite</button>
        </div>
      </div>
      <div class="step-body"></div>
      <div class="step-check"></div>
      <div class="step-ai"></div>
    </div>
    <div class="step-nav">
      <button class="btn step-back">← Back</button>
      <div class="step-nav-mid small muted"></div>
      <button class="btn primary step-next">Next →</button>
    </div>
  </div>`);
  host.append(ui);

  const q = (s) => ui.querySelector(s);
  const dots = q('.step-dots');

  const paintMode = () => {
    const m = store.get('lessonMode') || 'interactive';
    q('.mode-int').classList.toggle('primary', m === 'interactive');
    q('.mode-read').classList.toggle('primary', m === 'reader');
  };
  q('.mode-int').onclick = () => { store.set('lessonMode', 'interactive'); paintMode(); show(idx); };
  q('.mode-read').onclick = () => { store.set('lessonMode', 'reader'); paintMode(); show(idx); };
  paintMode();

  const setDepth = (v) => {
    store.set('depth', v);
    steps = stepsOf(lesson, v);
    paintDepth();
    show(idx);
  };
  const paintDepth = () => {
    const d = store.get('depth') || 'standard';
    q('.depth-plain').classList.toggle('primary', d === 'plain');
    q('.depth-standard').classList.toggle('primary', d === 'standard');
    q('.depth-technical').classList.toggle('primary', d === 'technical');
  };
  q('.depth-plain').onclick = () => setDepth('plain');
  q('.depth-standard').onclick = () => setDepth('standard');
  q('.depth-technical').onclick = () => setDepth('technical');
  paintDepth();

  const paintDots = () => {
    dots.innerHTML = '';
    steps.forEach((s, i) => {
      const d = el(`<button class="step-dot ${i === idx ? 'now' : i < idx ? 'done' : ''}"
        title="${escapeHtml(s.title || `Section ${i + 1}`)}"></button>`);
      d.onclick = () => show(i);
      dots.append(d);
    });
  };

  function teardownStep() {
    if (stepTeardown) { try { stepTeardown(); } catch (e) { console.error(e); } }
    stepTeardown = null;
    if (question) { try { question.teardown(); } catch (e) { console.error(e); } }
    question = null;
    if (aiTeardown) { try { aiTeardown(); } catch (e) { console.error(e); } }
    aiTeardown = null;
  }

  function show(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    const s = steps[idx];
    teardownStep();

    q('.step-eyebrow').textContent = `Section ${idx + 1} of ${total}`;
    const titleEl = q('.step-title');
    titleEl.textContent = s.title || '';
    titleEl.style.display = s.title ? '' : 'none';
    q('.step-count').textContent = `${idx + 1} / ${total}`;

    const body = q('.step-body');
    body.innerHTML = '';
    
    // Check for AI difficulty override
    const override = store.getDifficultyOverride(lesson.id, idx);
    const sel = q('.ai-diff-sel');
    if (override) {
      sel.value = override.level;
      
      const teardowns = [];
      const regex = /\[INTERACTIVE_BLOCK_(\d+)\]/g;
      let lastIdx = 0;
      let match;
      while ((match = regex.exec(override.html)) !== null) {
        const htmlPart = override.html.substring(lastIdx, match.index);
        if (htmlPart.trim()) {
          const wrapper = el('<div></div>');
          wrapper.innerHTML = htmlPart;
          body.append(wrapper);
        }
        const blockIndex = parseInt(match[1], 10);
        const block = s.blocks[blockIndex];
        if (block) {
          teardowns.push(renderBlocks(body, [block], ctx));
        }
        lastIdx = regex.lastIndex;
      }
      const lastHtml = override.html.substring(lastIdx);
      if (lastHtml.trim()) {
        const wrapper = el('<div></div>');
        wrapper.innerHTML = lastHtml;
        body.append(wrapper);
      }
      stepTeardown = () => teardowns.forEach((t) => t && t());
    } else {
      sel.value = 'original';
      stepTeardown = renderBlocks(body, s.blocks, ctx);
    }
    
    // Wire up rewrite button
    const rewriteBtn = q('.ai-diff-btn');
    rewriteBtn.onclick = async () => {
      const level = sel.value;
      if (level === 'original') {
        store.setDifficultyOverride(lesson.id, idx, null, null);
        show(idx);
        return;
      }
      rewriteBtn.textContent = 'Rewriting...';
      rewriteBtn.disabled = true;

      let contentToRewrite = '';
      s.blocks.forEach((b, i) => {
        if (b.type === 'prose' || b.type === 'callout') {
          contentToRewrite += (b.html || b.text) + '\\n\\n';
        } else {
          contentToRewrite += `[INTERACTIVE_BLOCK_${i}]\\n\\n`;
        }
      });

      const res = await window.ai.rewriteSection(contentToRewrite, level);
      rewriteBtn.textContent = 'Rewrite';
      rewriteBtn.disabled = false;

      if (res.ok) {
        store.setDifficultyOverride(lesson.id, idx, level, res.text);
        show(idx);
      } else {
        alert('AI rewrite failed: ' + res.error);
      }
    };

    // ---- the check ----------------------------------------------------
    const checkHost = q('.step-check');
    checkHost.innerHTML = '';
    if (s.check) {
      const mode = store.get('lessonMode') || 'interactive';
      const resolved = resolveQuestion(s.check, mode);
      const card = el(`<div class="check-card">
        <div class="check-label">Your turn</div>
        <div class="q-text">${escapeHtml(resolved.question)}</div>
        <div class="check-slot"></div>
        <div class="row mt check-actions">
          <button class="btn sm primary check-btn">Check my answer</button>
          <button class="btn sm ghost check-again" style="display:none">Try again</button>
        </div>
      </div>`);
      checkHost.append(card);

      question = renderQuestion(resolved, {
        onAnswer: () => card.querySelector('.check-btn').classList.add('primary'),
      });
      card.querySelector('.check-slot').append(question.node);

      const btn = card.querySelector('.check-btn');
      const again = card.querySelector('.check-again');
      btn.onclick = () => {
        if (!question.answered()) {
          card.querySelector('.check-label').textContent = 'Have a go first';
          return;
        }
        const ok = question.grade();
        card.classList.add(ok ? 'ok' : 'no');
        btn.style.display = 'none';
        again.style.display = ok ? 'none' : '';
        // A completed check is progress worth recording, but it is never a gate.
        store.recordStepCheck(lesson.id, idx, ok);
        paintNav();
      };
      again.onclick = () => {
        question.reset();
        card.classList.remove('ok', 'no');
        btn.style.display = '';
        again.style.display = 'none';
      };
    }

    // ---- AI depth escape hatch — live, beyond the baked registers -----
    const aiHost = q('.step-ai');
    aiHost.innerHTML = '';
    const stepSources = s.blocks.filter((b) => b.type === 'sources').flatMap((b) => b.files);
    const ai = renderAiExplain(aiHost, {
      stepTitle: s.title || '',
      stepText: body.innerText,
      sources: stepSources,
      lessonTitle: lesson.title,
    });
    aiTeardown = ai.teardown;

    paintDots();
    paintNav();
    ui.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function paintNav() {
    q('.step-back').disabled = idx === 0;
    const next = q('.step-next');
    const last = idx === total - 1;
    next.textContent = last ? 'Finish lesson ✓' : 'Next →';
    const rec = store.stepChecks(lesson.id);
    const doneChecks = steps.filter((s, i) => s.check && rec[i]?.ok).length;
    const totalChecks = steps.filter((s) => s.check).length;
    q('.step-nav-mid').textContent = totalChecks
      ? `${doneChecks} of ${totalChecks} checks passed` : '';
  }

  q('.step-back').onclick = () => show(idx - 1);
  q('.step-next').onclick = () => {
    if (idx === total - 1) { onDone?.(); return; }
    show(idx + 1);
  };

  show(0);
  return teardownStep;
}
