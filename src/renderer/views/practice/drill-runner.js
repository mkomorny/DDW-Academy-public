/**
 * drill-runner.js — the two drill run loops (MIDI-graded and choice/button),
 * plus the shared tier header. Extracted intact from the original
 * views/practice.js; no behavior changes.
 */
import { escapeHtml, el, go } from '../../app.js';
import { store } from '../../lib/store.js';
import { midiHub } from '../../lib/midi.js';
import { instrument } from '../../lib/audio.js';
import { Keyboard, connectKeyboard } from '../../components/keyboard.js';
import { samePcSet, randomOf } from '../../lib/theory.js';
import { WINS_NEEDED, timeBudgetMs } from './tier-helpers.js';

/* ------------------------------------------------------------ tier header  */

export function tierHeader(meta, gen, onTierChange) {
  const t = store.tier(meta.id);
  const wrap = el(`<div class="panel" style="padding:12px 18px">
    <div class="row spread">
      <div>
        <strong>Tier <span class="tier-num">${t.selected}</span></strong>
        <span class="muted small tier-desc" style="margin-left:8px"></span>
      </div>
      <div class="row">
        <label class="mini-label">Start at
          <select class="sel tier-sel"></select>
        </label>
        <button class="btn sm tier-reset" title="Erase this drill's tiers and scores">Reset progress</button>
      </div>
    </div>
    <div class="row mt" style="gap:12px;align-items:center">
      <div class="progress" style="flex:1;margin-top:0"><i class="tier-bar" style="width:0%"></i></div>
      <span class="small muted tier-count nowrap">0 / ${WINS_NEEDED}</span>
    </div>
  </div>`);

  const paint = () => {
    const tt = store.tier(meta.id);
    wrap.querySelector('.tier-num').textContent = tt.selected;
    wrap.querySelector('.tier-desc').textContent = gen.describe ? gen.describe(tt.selected) : '';
    const sel = wrap.querySelector('.tier-sel');
    sel.innerHTML = Array.from({ length: tt.unlocked }, (_, i) =>
      `<option value="${i + 1}" ${i + 1 === tt.selected ? 'selected' : ''}>Tier ${i + 1}</option>`).join('');
    const acc = tt.totalAtTier ? ` · ${Math.round((tt.winsAtTier / tt.totalAtTier) * 100)}%` : '';
    wrap.querySelector('.tier-count').textContent = `${tt.winsAtTier} / ${WINS_NEEDED}${acc}`;
    wrap.querySelector('.tier-bar').style.width = `${Math.min(100, (tt.winsAtTier / WINS_NEEDED) * 100)}%`;
  };

  wrap.querySelector('.tier-sel').onchange = (e) => {
    store.selectTier(meta.id, Number(e.target.value));
    paint();
    onTierChange();
  };

  wrap.querySelector('.tier-reset').onclick = () => {
    if (wrap.dataset.confirm === '1') {
      store.resetTiers(meta.id);
      delete wrap.dataset.confirm;
      wrap.querySelector('.tier-reset').textContent = 'Reset progress';
      paint();
      onTierChange();
    } else {
      wrap.dataset.confirm = '1';
      wrap.querySelector('.tier-reset').textContent = 'Click again to confirm';
      setTimeout(() => {
        delete wrap.dataset.confirm;
        const b = wrap.querySelector('.tier-reset');
        if (b) b.textContent = 'Reset progress';
      }, 3000);
    }
  };

  paint();
  return { wrap, paint };
}

/* -------------------------------------------------------- play-drill loop  */

export function runDrill(host, meta, gen, app) {
  const state = { score: 0, total: 0, streak: 0, best: 0, started: Date.now(),
    task: null, seqIndex: 0, chordIndex: 0, awaitRelease: false };
  let hearTimers = [];

  const ui = el(`<div>
    <div class="page-head"><div class="eyebrow">Drill</div><h1>${escapeHtml(meta.title)}</h1>
      <p class="lede">${escapeHtml(meta.desc)}</p></div>
    <div class="tier-slot"></div>
    <div class="panel">
      <div class="panel-head">
        <div class="row opts"></div>
        <div class="row"><button class="btn sm hear">▶ Hear it</button><button class="btn sm skip">Skip</button></div>
      </div>
      <div class="drill-stage">
        <div class="drill-prompt"></div>
        <div class="drill-sub"></div>
        <div class="seq-track"></div>
        <div class="drill-feedback"></div>
      </div>
      <div class="stat-row">
        <div><div class="v s-score">0</div><div class="k">Correct</div></div>
        <div><div class="v s-total">0</div><div class="k">Attempted</div></div>
        <div><div class="v s-streak">0</div><div class="k">Streak</div></div>
        <div><div class="v s-best">0</div><div class="k">Best streak</div></div>
      </div>
      <div class="kb-frame"><div class="kb-host"></div></div>
      <div class="small muted mt fing"></div>
    </div>
    <div class="row mt"><button class="btn end">End session &amp; save</button></div>
  </div>`);
  host.append(ui);

  const q = (s) => ui.querySelector(s);
  const tierUi = tierHeader(meta, gen, () => next());
  q('.tier-slot').append(tierUi.wrap);

  const kb = new Keyboard(q('.kb-host'), {
    lowMidi: 36, highMidi: 96, showLabels: store.get('keyLabels') || 'c',
    preferFlats: store.get('preferFlats'),
  });
  const offKb = connectKeyboard(kb, midiHub, instrument);

  const setStats = () => {
    q('.s-score').textContent = state.score;
    q('.s-total').textContent = state.total;
    q('.s-streak').textContent = state.streak;
    q('.s-best').textContent = state.best;
  };

  if (gen.options) gen.options(q('.opts'), () => next(), app);

  function paintSequence() {
    const t = state.task;
    const track = q('.seq-track');
    if (!t) { track.innerHTML = ''; return; }
    if (t.mode === 'sequence') {
      track.innerHTML = t.labels.map((lbl, i) =>
        `<div class="seq-note ${i < state.seqIndex ? 'done' : i === state.seqIndex ? 'now' : ''}">${escapeHtml(lbl)}</div>`).join('');
    } else if (t.mode === 'chordSeq') {
      track.innerHTML = t.chords.map((c, i) =>
        `<div class="seq-note ${i < state.chordIndex ? 'done' : i === state.chordIndex ? 'now' : ''}">${escapeHtml(c.label)}</div>`).join('');
    } else {
      track.innerHTML = '';
    }
  }

  function next() {
    hearTimers.forEach(clearTimeout); hearTimers = [];
    const tier = store.tier(meta.id).selected;
    state.task = gen.make(app, tier);
    state.seqIndex = 0;
    state.chordIndex = 0;
    state.awaitRelease = false;
    q('.drill-prompt').textContent = state.task.prompt;
    q('.drill-sub').textContent = state.task.sub || '';
    q('.drill-feedback').textContent = '';
    q('.drill-feedback').className = 'drill-feedback';
    kb.clearHighlights();
    kb.clearFingering();
    q('.fing').textContent = '';

    if (state.task.highlight) {
      kb.highlight('cue', state.task.highlight, { byPitchClass: state.task.highlightByPitchClass !== false });
    }
    if (state.task.fingering) {
      kb.showFingering(state.task.expect, state.task.fingering, 'rh');
      q('.fing').textContent = `RH fingering: ${state.task.fingering.join(' ')}`;
    }
    paintSequence();
  }

  function answered(ok) {
    const res = store.recordTierAnswer(meta.id, ok, { winsNeeded: WINS_NEEDED });
    tierUi.paint();
    if (res.advanced) {
      const fb = q('.drill-feedback');
      fb.textContent = `★ Tier ${res.tier.selected} unlocked`;
      fb.className = 'drill-feedback good';
      setTimeout(next, 1300);
      return true;
    }
    return false;
  }

  function correct() {
    state.score++; state.total++; state.streak++;
    state.best = Math.max(state.best, state.streak);
    setStats();
    if (answered(true)) return;
    const fb = q('.drill-feedback');
    fb.textContent = '✓ ' + randomOf(['Correct', 'Yes', 'Good', "That's it"]);
    fb.className = 'drill-feedback good';
    setTimeout(next, 750);
  }

  function wrong(msg) {
    state.total++; state.streak = 0; setStats();
    answered(false);
    const fb = q('.drill-feedback');
    fb.textContent = msg || '✗ Not quite — try again';
    fb.className = 'drill-feedback bad';
  }

  const offOn = midiHub.on('noteon', ({ midi, held }) => {
    const t = state.task;
    if (!t) return;

    if (t.mode === 'sequence') {
      const want = t.expect[state.seqIndex];
      const ok = t.byPitchClass ? (midi % 12) === (want % 12) : midi === want;
      if (ok) {
        if (++state.seqIndex >= t.expect.length) { paintSequence(); correct(); }
        else paintSequence();
      } else {
        state.seqIndex = 0; paintSequence();
        wrong('✗ Wrong note — start the sequence again');
      }

    } else if (t.mode === 'chordSeq') {
      if (state.awaitRelease) return;          // ignore until hands lift
      const chord = t.chords[state.chordIndex];
      if (!chord) return;
      if (held.length < chord.expect.length) return;
      const ok = chord.byPitchClass !== false
        ? samePcSet(held, chord.expect)
        : held.length === chord.expect.length && chord.expect.every((n) => held.includes(n));
      if (ok) {
        state.chordIndex++;
        state.awaitRelease = true;
        if (state.chordIndex >= t.chords.length) { paintSequence(); correct(); }
        else paintSequence();
      } else if (held.length >= chord.expect.length) {
        state.chordIndex = 0; state.awaitRelease = true;
        paintSequence();
        wrong('✗ Wrong chord — the sequence restarts');
      }

    } else { // single chord
      if (held.length < t.expect.length) return;
      const ok = t.byPitchClass ? samePcSet(held, t.expect)
        : held.length === t.expect.length && t.expect.every((n) => held.includes(n));
      if (ok) correct();
      else if (held.length >= t.expect.length) wrong();
    }
  });

  // chordSeq: a completed (or failed) chord only re-arms once every key is up,
  // so held notes from the previous chord can never leak into the next one.
  const offOff = midiHub.on('noteoff', ({ held }) => {
    if (state.awaitRelease && held.length === 0) state.awaitRelease = false;
  });

  q('.hear').onclick = () => {
    const t = state.task;
    if (!t) return;
    hearTimers.forEach(clearTimeout); hearTimers = [];
    if (t.mode === 'chordSeq') {
      t.chords.forEach((c, i) => hearTimers.push(setTimeout(() =>
        instrument.play(c.play || c.expect.map((p) => 60 + (p % 12)), { gap: 0, duration: 0.7 }), i * 800)));
    } else {
      instrument.play(t.play || t.expect, { gap: t.mode === 'sequence' ? 0.26 : 0, duration: 0.6 });
    }
  };
  q('.skip').onclick = () => { state.total++; state.streak = 0; setStats(); answered(false); next(); };
  q('.end').onclick = () => {
    store.recordDrill(meta.id, { score: state.score, total: state.total, elapsedMs: Date.now() - state.started });
    go('practice', { category: meta.cat });
  };

  next(); setStats();

  return () => {
    hearTimers.forEach(clearTimeout);
    offOn(); offOff(); offKb();
    if (state.total > 0) {
      store.recordDrill(meta.id, { score: state.score, total: state.total, elapsedMs: Date.now() - state.started });
    }
  };
}

/* ---------------------------------------------------- choice-drill loop -- */
/* For drills answered with buttons rather than the keyboard. Difficulty
   scales through content AND a per-question time budget that shrinks
   asymptotically with tier — it approaches, but never reaches, 1.2s.       */

export function runChoiceDrill(host, meta, gen, app) {
  const state = { score: 0, total: 0, started: Date.now(), timer: null, deadline: 0, raf: null };

  const ui = el(`<div>
    <div class="page-head"><div class="eyebrow">Drill</div><h1>${escapeHtml(meta.title)}</h1>
      <p class="lede">${escapeHtml(meta.desc)}</p></div>
    <div class="tier-slot"></div>
    <div class="panel">
      <div class="drill-stage">
        <div class="drill-prompt"></div>
        <div class="drill-sub"></div>
        <div class="progress" style="max-width:340px;margin:14px auto 0"><i class="time-bar" style="width:100%"></i></div>
        <div class="row mt opts" style="justify-content:center"></div>
        <div class="drill-feedback"></div>
      </div>
      <div class="stat-row">
        <div><div class="v s-score">0</div><div class="k">Correct</div></div>
        <div><div class="v s-total">0</div><div class="k">Attempted</div></div>
      </div>
    </div>
    <div class="row mt"><button class="btn end">End session &amp; save</button></div>
  </div>`);
  host.append(ui);

  const q = (s) => ui.querySelector(s);
  const tierUi = tierHeader(meta, gen, () => next());
  q('.tier-slot').append(tierUi.wrap);

  const timeBudget = (tier) => timeBudgetMs(tier, gen.timedFromTier);

  function stopTimer() {
    cancelAnimationFrame(state.raf);
    clearTimeout(state.timer);
    state.timer = null;
  }

  function startTimer(ms, onExpire) {
    q('.time-bar').style.width = '100%';
    state.deadline = performance.now() + ms;
    const tick = () => {
      const left = Math.max(0, state.deadline - performance.now());
      q('.time-bar').style.width = `${(left / ms) * 100}%`;
      if (left > 0) state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    state.timer = setTimeout(onExpire, ms);
  }

  function next() {
    stopTimer();
    const tier = store.tier(meta.id).selected;
    const task = gen.make(app, tier);
    q('.drill-prompt').textContent = task.prompt;
    q('.drill-sub').textContent = task.sub || '';
    q('.drill-feedback').textContent = '';
    q('.drill-feedback').className = 'drill-feedback';

    const opts = q('.opts');
    opts.innerHTML = '';
    let done = false;

    const settle = (ok, msg) => {
      if (done) return;
      done = true;
      stopTimer();
      state.total++;
      if (ok) state.score++;
      q('.s-score').textContent = state.score;
      q('.s-total').textContent = state.total;
      const res = store.recordTierAnswer(meta.id, ok, { winsNeeded: WINS_NEEDED });
      tierUi.paint();
      const fb = q('.drill-feedback');
      fb.textContent = res.advanced ? `★ Tier ${res.tier.selected} unlocked` : (ok ? '✓ Correct' : msg);
      fb.className = 'drill-feedback ' + (ok ? 'good' : 'bad');
      setTimeout(next, ok ? 700 : 1500);
    };

    for (const o of task.options) {
      const b = el(`<button class="btn">${escapeHtml(o)}</button>`);
      b.onclick = () => settle(o === task.answer, `✗ It is ${task.answer}`);
      opts.append(b);
    }

    const budget = timeBudget(tier);
    q('.time-bar').parentElement.style.visibility = budget ? 'visible' : 'hidden';
    if (budget) startTimer(budget, () => settle(false, `⏱ Out of time — it was ${task.answer}`));
  }

  q('.end').onclick = () => {
    stopTimer();
    store.recordDrill(meta.id, { score: state.score, total: state.total, elapsedMs: Date.now() - state.started });
    go('practice', { category: meta.cat });
  };

  next();
  return () => {
    stopTimer();
    if (state.total > 0) {
      store.recordDrill(meta.id, { score: state.score, total: state.total, elapsedMs: Date.now() - state.started });
    }
  };
}
