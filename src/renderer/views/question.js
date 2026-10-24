/**
 * question.js — one question, rendered and graded.
 *
 * Extracted so that the two places questions appear share a single
 * implementation: the end-of-module quiz (many questions, graded together on
 * submit) and the inline checks inside a lesson step (one question, graded the
 * moment it is answered). Before this existed the quiz owned the only copy of
 * the grading rules, which meant an inline check could silently disagree with
 * the quiz about what counts as a correct answer.
 *
 * renderQuestion(q, opts) -> {
 *   node,                DOM to insert
 *   answered(),          has the learner supplied anything yet
 *   grade(),             true|false, and paints the correct/wrong marks
 *   reveal(),            paints the explanation line
 *   teardown()
 * }
 */

import { escapeHtml, el } from '../app.js';
import { midiHub } from '../lib/midi.js';
import { instrument, REFERENCE_INSTRUMENT } from '../lib/audio.js';
import { samePcSet, pcOf, toMidi, shuffle } from '../lib/theory.js';

/** Resolve an `eitherMode()` pair down to the question for the active mode. */
export const resolveQuestion = (q, mode) =>
  (q && q.kind === 'either' ? (q[mode] || q.interactive) : q);

/** Note names ('C4', 'Eb') or pitch classes -> MIDI / pitch-class numbers. */
function toWanted(expect) {
  return (expect || []).map((x) => {
    if (typeof x === 'number') return x;
    const mm = /^([A-Ga-g][#b]*)(-?\d+)$/.exec(String(x));
    return mm ? toMidi(mm[1], parseInt(mm[2], 10)) : pcOf(x);
  });
}

export function renderQuestion(q, { onAnswer = null, autoGrade = false } = {}) {
  const body = el('<div class="q-body"></div>');
  const explain = el('<div class="q-explain"></div>');
  const wrap = el('<div></div>');
  wrap.append(body, explain);

  const teardowns = [];
  let answer = null;
  let graded = false;

  const changed = () => { if (onAnswer) onAnswer(answer); };

  if (q.kind === 'mcq' || q.kind === 'multi') {
    q.options.forEach((opt, oi) => {
      const o = el(`<div class="opt" data-i="${oi}"><span class="mark">${
        q.kind === 'multi' ? '☐' : '○'}</span><span>${escapeHtml(opt)}</span></div>`);
      o.onclick = () => {
        if (graded) return;
        if (q.kind === 'mcq') {
          body.querySelectorAll('.opt').forEach((x) => {
            x.classList.remove('sel'); x.querySelector('.mark').textContent = '○';
          });
          o.classList.add('sel'); o.querySelector('.mark').textContent = '●';
          answer = oi;
        } else {
          o.classList.toggle('sel');
          o.querySelector('.mark').textContent = o.classList.contains('sel') ? '☑' : '☐';
          answer = [...body.querySelectorAll('.opt.sel')].map((x) => Number(x.dataset.i)).sort((a, b) => a - b);
        }
        changed();
      };
      body.append(o);
    });

  } else if (q.kind === 'ear') {
    const btn = el('<button class="btn">▶ Play the example</button>');
    btn.onclick = () => instrument.play(q.notes, { gap: q.gap ?? 0.45, duration: 0.7, bank: REFERENCE_INSTRUMENT });
    body.append(btn);
    if (q.hint) body.append(el(`<p class="small muted mt">${escapeHtml(q.hint)}</p>`));
    const opts = el('<div class="mt"></div>');
    q.options.forEach((opt, oi) => {
      const o = el(`<div class="opt" data-i="${oi}"><span class="mark">○</span><span>${escapeHtml(opt)}</span></div>`);
      o.onclick = () => {
        if (graded) return;
        opts.querySelectorAll('.opt').forEach((x) => {
          x.classList.remove('sel'); x.querySelector('.mark').textContent = '○';
        });
        o.classList.add('sel'); o.querySelector('.mark').textContent = '●';
        answer = oi;
        changed();
      };
      opts.append(o);
    });
    body.append(opts);

  } else if (q.kind === 'order') {
    // Presented shuffled; the learner reorders by clicking a card then its target.
    answer = shuffle(q.items);
    const holder = el('<div class="order-list"></div>');
    let picked = null;
    const paint = () => {
      holder.innerHTML = '';
      answer.forEach((txt, i) => {
        const row = el(`<div class="order-item ${picked === i ? 'dragging' : ''}">
          <span class="handle">${i + 1}</span><span>${escapeHtml(txt)}</span></div>`);
        row.onclick = () => {
          if (graded) return;
          if (picked === null) picked = i;
          else {
            const [moved] = answer.splice(picked, 1);
            answer.splice(i, 0, moved);
            picked = null;
            changed();
          }
          paint();
        };
        holder.append(row);
      });
    };
    paint();
    body.append(holder);
    body.append(el('<p class="small muted mt">Click an item, then click where it should go.</p>'));

  } else if (q.kind === 'text') {
    const input = el('<input class="txt" type="text" placeholder="Type your answer">');
    input.oninput = () => { if (!graded) { answer = input.value; changed(); } };
    body.append(input);

  } else if (q.kind === 'play') {
    const want = toWanted(q.expect);
    const status = el('<div class="try-status">Play it on any keyboard — MIDI, on-screen or your computer keys.</div>');
    body.append(status);

    const capture = () => {
      answer = true;
      status.textContent = '✓ Captured';
      status.classList.add('good');
      changed();
    };

    if (q.mode === 'sequence') {
      let i = 0;
      teardowns.push(midiHub.on('noteon', ({ midi }) => {
        if (answer === true) return;
        const ok = q.byPitchClass ? (midi % 12) === (want[i] % 12) : midi === want[i];
        if (ok) {
          if (++i >= want.length) capture();
          else status.textContent = `${i} of ${want.length}…`;
        } else { i = 0; status.textContent = 'Start again from the first note.'; }
      }));
    } else {
      teardowns.push(midiHub.on('noteon', ({ held }) => {
        if (answer === true || held.length < want.length) return;
        const ok = q.byPitchClass ? samePcSet(held, want)
          : held.length === want.length && want.every((n) => held.includes(n));
        if (ok) capture();
      }));
    }
  }

  /** The single source of truth for whether an answer is right. */
  function isCorrect() {
    const a = answer;
    if (q.kind === 'mcq' || q.kind === 'ear') return a === q.answer;
    if (q.kind === 'multi') {
      return Array.isArray(a) && a.length === q.answer.length && a.every((v, i) => v === q.answer[i]);
    }
    if (q.kind === 'text') {
      const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      return q.accept.some((acc) => norm(acc) === norm(a));
    }
    if (q.kind === 'order') {
      return Array.isArray(a) && a.length === q.answer.length && a.every((v, i) => v === q.answer[i]);
    }
    if (q.kind === 'play') return a === true;
    return false;
  }

  function paintMarks() {
    const opts = body.querySelectorAll('.opt');
    if (q.kind === 'mcq' || q.kind === 'ear') {
      opts.forEach((o, oi) => {
        if (oi === q.answer) o.classList.add('correct');
        else if (oi === answer) o.classList.add('wrong');
      });
    } else if (q.kind === 'multi') {
      opts.forEach((o, oi) => {
        if (q.answer.includes(oi)) o.classList.add('correct');
        else if (Array.isArray(answer) && answer.includes(oi)) o.classList.add('wrong');
      });
    }
  }

  function reveal(ok) {
    const detail = q.explain
      || (q.kind === 'order' ? `Correct order: ${q.answer.join(' · ')}`
        : q.kind === 'text' ? `Accepted: ${q.accept[0]}` : '');
    explain.innerHTML = `<div class="explain"><strong>${ok ? '✓ Correct' : '✗ Not quite'}</strong>${
      detail ? ' — ' + escapeHtml(detail) : ''}</div>`;
  }

  return {
    node: wrap,
    answered: () => answer !== null && answer !== '' && !(Array.isArray(answer) && !answer.length),
    grade() {
      const ok = isCorrect();
      graded = true;
      paintMarks();
      reveal(ok);
      return ok;
    },
    reset() {
      graded = false;
      explain.innerHTML = '';
      body.querySelectorAll('.opt').forEach((o) => o.classList.remove('correct', 'wrong'));
      if (q.kind === 'play') {
        answer = null;
        const status = body.querySelector('.try-status');
        if (status) { status.textContent = 'Play it on any keyboard — MIDI, on-screen or your computer keys.'; status.classList.remove('good'); }
      }
    },
    teardown: () => teardowns.forEach((f) => { try { f(); } catch (e) { console.error(e); } }),
  };
}
