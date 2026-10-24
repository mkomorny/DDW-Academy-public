/**
 * learn.js — the curriculum: level browser, module pages, lessons, quizzes.
 *
 * Navigation is deliberately unrestricted. Nothing here checks whether an
 * earlier module is complete before letting the learner in — checkpoints
 * report readiness, they do not gate access.
 */

import { escapeHtml, el, go } from '../app.js';
import { store } from '../lib/store.js';
import { renderStepper, stepsOf } from './stepper.js';
import { renderQuestion, resolveQuestion } from './question.js';
import {
  TRACKS, DEFAULT_TRACK_ID, trackById, moduleById, levelById, lessonById, adjacentLessons, COURSE_STATS,
} from '../course/index.js';

/** Which track a route/view should render, in priority order: an explicit
 * route.trackId, the last track the learner picked, then the default. */
function resolveTrack(route) {
  return trackById(route.trackId || store.get('activeTrack') || DEFAULT_TRACK_ID);
}

export default function renderLearn(host, route, app) {
  if (route.name === 'lesson') return lessonView(host, route, app);
  if (route.name === 'module') return moduleView(host, route, app);
  if (route.name === 'quiz') return quizView(host, route, app);
  return route.levelId ? levelView(host, route) : overview(host, route);
}

/* ------------------------------------------------------------- overview -- */

function overview(host, route) {
  const track = resolveTrack(route);

  if (TRACKS.length > 1) {
    host.append(el(`<div class="page-head">
      <div class="eyebrow">Curriculum</div>
      <h1>Learn</h1>
      <p class="lede">Choose a track. Progress and depth settings are tracked separately for each.</p>
    </div>`));
    const trackGrid = el('<div class="grid c2 mb"></div>');
    for (const t of TRACKS) {
      const card = el(`<div class="card click">
        <h3>${escapeHtml(t.title)}</h3>
        <p class="small muted">${t.levels.length} levels</p>
      </div>`);
      card.onclick = () => { store.set('activeTrack', t.id); go('learn', { trackId: t.id }); };
      trackGrid.append(card);
    }
    host.append(trackGrid);
  }

  host.append(el(`<div class="page-head">
    <div class="eyebrow">${escapeHtml(track.title)}</div>
    <h1>${TRACKS.length > 1 ? escapeHtml(track.title) : 'Learn'}</h1>
    <p class="lede">${track.levels.length} levels, ${COURSE_STATS.modules} modules, from absolute beginner to advanced
      harmony and improvisation. Work in order, or jump anywhere you like — nothing is locked.</p>
  </div>`));

  const grid = el('<div class="grid c2"></div>');
  for (const lv of track.levels) {
    const pct = Math.round(store.levelProgress(lv) * 100);
    const gate = track.gates.find((g) => g.afterLevel === lv.number);
    const card = el(`<div class="card click">
      <div class="row spread" style="align-items:flex-start">
        <div>
          <div class="eyebrow">Level ${lv.number} · ${escapeHtml(lv.skillBand)}</div>
          <h3>${escapeHtml(lv.title)}</h3>
        </div>
        ${gate ? `<span class="badge gate">Gate ${gate.id}</span>` : ''}
      </div>
      <p>${escapeHtml(lv.summary)}</p>
      <div class="row mt small muted">
        <span>${lv.modules.length} modules</span>${lv.duration ? `<span>·</span><span>${escapeHtml(lv.duration)}</span>` : ''}
        <span style="margin-left:auto">${pct}%</span>
      </div>
      <div class="progress"><i style="width:${pct}%"></i></div>
    </div>`);
    card.onclick = () => go('learn', { levelId: lv.id });
    grid.append(card);
  }
  host.append(grid);
  return null;
}

/* ---------------------------------------------------------------- level -- */

function levelView(host, route) {
  const lv = levelById(route.levelId);
  if (!lv) return overview(host, route);
  const track = trackById(lv.trackId);

  host.append(el(`<div class="crumbs"><button data-b="learn">Learn</button> ›
    ${TRACKS.length > 1 ? `${escapeHtml(track.title)} › ` : ''}Level ${lv.number}</div>`));
  host.querySelector('[data-b="learn"]').onclick = () => go('learn', { trackId: track.id });

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Level ${lv.number} · ${escapeHtml(lv.skillBand)}${lv.duration ? ` · ${escapeHtml(lv.duration)}` : ''}</div>
    <h1>${escapeHtml(lv.title)}</h1>
    <p class="lede">${escapeHtml(lv.summary)}</p>
  </div>`));

  for (const m of lv.modules) {
    const pct = Math.round(store.moduleProgress(m) * 100);
    const card = el(`<div class="card click mb">
      <div class="row spread" style="align-items:flex-start">
        <div style="flex:1">
          <div class="eyebrow">Module ${m.code}</div>
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.blurb || '')}</p>
        </div>
        ${pct === 100 ? '<span class="badge done">Complete</span>' : ''}
      </div>
      <div class="row mt small muted">
        <span>${m.lessons.length} lessons</span><span>·</span>
        <span>${m.quiz ? m.quiz.questions.length : 0} quiz questions</span><span>·</span>
        <span>${(m.exercises || []).length} exercises</span>
        <span style="margin-left:auto">${pct}%</span>
      </div>
      <div class="progress"><i style="width:${pct}%"></i></div>
    </div>`);
    card.onclick = () => go('module', { moduleId: m.id });
    host.append(card);
  }

  const gate = track.gates.find((g) => g.afterLevel === lv.number);
  if (gate) {
    host.append(el(`<div class="callout"><div class="ct">Assessment ${gate.title}</div>
      <p>${escapeHtml(gate.requires)}</p></div>`));
  }
  return null;
}

/* --------------------------------------------------------------- module -- */

function moduleView(host, route) {
  const m = moduleById(route.moduleId);
  if (!m) return overview(host, route);
  const lv = levelById(m.levelId);

  host.append(el(`<div class="crumbs">
    <button data-b="learn">Learn</button> › <button data-b="lv">Level ${lv.number}</button> › Module ${m.code}</div>`));
  host.querySelector('[data-b="learn"]').onclick = () => go('learn', { trackId: m.trackId });
  host.querySelector('[data-b="lv"]').onclick = () => go('learn', { levelId: lv.id });

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Module ${m.code}</div>
    <h1>${escapeHtml(m.title)}</h1>
    <p class="lede">${escapeHtml(m.blurb || '')}</p>
  </div>`));

  if (m.outcomes?.length) {
    host.append(el(`<h2>Learning outcomes</h2><ul class="l">${
      m.outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>`));
  }

  host.append(el('<h2>Lessons</h2>'));
  for (const [i, lsn] of m.lessons.entries()) {
    const done = store.isLessonComplete(lsn.id);
    const card = el(`<div class="card click mb">
      <div class="row spread">
        <div><h3 style="margin:0">${i + 1}. ${escapeHtml(lsn.title)}</h3>
          ${lsn.blurb || lsn.intro ? `<p style="margin:6px 0 0">${escapeHtml(lsn.blurb || lsn.intro)}</p>` : ''}
          <p class="small muted" style="margin-top:4px">${lsn.minutes} min</p></div>
        ${done ? '<span class="badge done">✓ Done</span>' : ''}
      </div>
    </div>`);
    card.onclick = () => go('lesson', { lessonId: lsn.id });
    host.append(card);
  }

  if (m.quiz) {
    const best = store.quizBest(m.quiz.id);
    const card = el(`<div class="card click mb" style="border-color:var(--brass-dim)">
      <div class="row spread">
        <div><h3 style="margin:0">◈ ${escapeHtml(m.quiz.title)}</h3>
          <p class="small muted" style="margin-top:4px">${m.quiz.questions.length} questions${
            m.quiz.subtitle ? ' · ' + escapeHtml(m.quiz.subtitle) : ''}</p></div>
        ${best !== null ? `<span class="badge ${best >= 80 ? 'done' : ''}">Best ${best}%</span>` : ''}
      </div>
    </div>`);
    card.onclick = () => go('quiz', { moduleId: m.id });
    host.append(card);
  }

  if (m.exercises?.length) {
    host.append(el('<h2>Exercises</h2>'));
    for (const ex of m.exercises) {
      host.append(el(`<div class="card mb">
        <div class="row"><span class="tag">${escapeHtml(ex.type)}</span>
          <strong>${escapeHtml(ex.title)}</strong></div>
        <p class="mt">${escapeHtml(ex.prompt)}</p>
      </div>`));
    }
  }

  if (m.practiceFocus?.length) {
    host.append(el(`<div class="callout tip"><div class="ct">Practice focus</div>
      <p>${m.practiceFocus.map(escapeHtml).join('<br>')}</p></div>`));
  }

  if (m.checkpoints?.length) {
    host.append(el('<h2>Checkpoints</h2>'));
    const saved = store.checkpointsFor(m.id);
    const box = el('<div class="card"></div>');
    m.checkpoints.forEach((c, i) => {
      const row = el(`<label class="chk"><input type="checkbox" ${saved[i] ? 'checked' : ''}>
        <span>${escapeHtml(c)}</span></label>`);
      row.querySelector('input').onchange = (e) => store.toggleCheckpoint(m.id, i, e.target.checked);
      box.append(row);
    });
    host.append(box);
    host.append(el(`<p class="small muted mt">Checkpoints are for your own tracking. They never
      block access to later modules.</p>`));
  }

  if (m.sources?.length) {
    host.append(el(`<div class="sources-block"><div class="sl">Source material for this module</div>
      <ul>${m.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>`));
  }
  return null;
}

/* --------------------------------------------------------------- lesson -- */

function lessonView(host, route, app) {
  const lsn = lessonById(route.lessonId);
  if (!lsn) return overview(host, route);
  const m = moduleById(lsn.moduleId);
  const lv = levelById(m.levelId);
  store.markLessonViewed(lsn.id);

  host.append(el(`<div class="crumbs">
    <button data-b="lv">Level ${lv.number}</button> › <button data-b="m">Module ${m.code}</button> › ${escapeHtml(lsn.title)}</div>`));
  host.querySelector('[data-b="lv"]').onclick = () => go('learn', { levelId: lv.id });
  host.querySelector('[data-b="m"]').onclick = () => go('module', { moduleId: m.id });

  const steps = stepsOf(lsn);
  const nChecks = steps.filter((s) => s.check).length;

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Module ${m.code} · ${lsn.minutes} min · ${steps.length} section${steps.length === 1 ? '' : 's'}${
      nChecks ? ` · ${nChecks} exercise${nChecks === 1 ? '' : 's'}` : ''}</div>
    <h1>${escapeHtml(lsn.title)}</h1>
    ${lsn.blurb || lsn.intro ? `<p class="lede">${escapeHtml(lsn.blurb || lsn.intro)}</p>` : ''}
  </div>`));

  const body = el('<div class="lesson-body"></div>');
  host.append(body);

  // Delivered one section at a time. The footer below only appears once the
  // learner reaches the end, so the lesson stays a short screen throughout.
  const footer = el('<div class="lesson-footer" style="display:none"></div>');

  const teardown = renderStepper(body, lsn, app, () => {
    footer.style.display = '';
    store.markLessonComplete(lsn.id);
    footer.querySelector('.markbtn').textContent = '✓ Marked complete';
    footer.querySelector('.markbtn').classList.remove('primary');
    footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  const done = store.isLessonComplete(lsn.id);
  footer.append(el(`<div class="callout key"><div class="ct">Lesson complete</div>
    <p>You worked through all ${steps.length} sections${
      nChecks ? ` and ${nChecks} exercise${nChecks === 1 ? '' : 's'}` : ''}.
      Use the dots above to revisit any section.</p></div>`));
  footer.append(el(`<div class="row mt">
    <button class="btn ${done ? '' : 'primary'} markbtn">${
      done ? '✓ Marked complete' : 'Mark this lesson complete'}</button>
  </div>`));
  footer.querySelector('.markbtn').onclick = (e) => {
    store.markLessonComplete(lsn.id);
    e.target.textContent = '✓ Marked complete';
    e.target.classList.remove('primary');
  };
  host.append(footer);

  const { prev, next } = adjacentLessons(lsn.id);
  const pager = el(`<div class="pager">
    ${prev ? `<button class="btn prev">← ${escapeHtml(prev.title)}</button>` : '<span></span>'}
    ${next ? `<button class="btn primary next">${escapeHtml(next.title)} →</button>`
      : (m.quiz ? '<button class="btn primary toquiz">Take the module quiz →</button>' : '<span></span>')}
  </div>`);
  pager.querySelector('.prev')?.addEventListener('click', () => go('lesson', { lessonId: prev.id }));
  pager.querySelector('.next')?.addEventListener('click', () => go('lesson', { lessonId: next.id }));
  pager.querySelector('.toquiz')?.addEventListener('click', () => go('quiz', { moduleId: m.id }));
  host.append(pager);

  return teardown;
}

/* ----------------------------------------------------------------- quiz -- */

function quizView(host, route) {
  const m = moduleById(route.moduleId);
  if (!m || !m.quiz) return overview(host, route);
  const quiz = m.quiz;
  const mode = store.get('lessonMode') || 'interactive';
  const resolved = quiz.questions.map((q) => resolveQuestion(q, mode));

  host.append(el(`<div class="crumbs"><button data-b="m">Module ${m.code}</button> › Quiz</div>`));
  host.querySelector('[data-b="m"]').onclick = () => go('module', { moduleId: m.id });

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Module ${m.code}</div>
    <h1>${escapeHtml(quiz.title)}</h1>
    <p class="lede">${quiz.questions.length} questions.${mode === 'reader' ? '' : `
      ${quiz.questions.some((q) => q.kind === 'play' || q.interactive?.kind === 'play') ? ' Some ask you to play on the keyboard.' : ''}
      ${quiz.questions.some((q) => q.kind === 'ear' || q.interactive?.kind === 'ear') ? ' Some are listening questions.' : ''}`}
      Answer everything, then submit for feedback.</p>
  </div>`));

  const controls = [];
  const list = el('<div></div>');
  host.append(list);

  resolved.forEach((q, qi) => {
    const card = el(`<div class="q-card">
      <div class="q-num">Question ${qi + 1} of ${quiz.questions.length}</div>
      <div class="q-text">${escapeHtml(q.question)}</div>
      <div class="q-slot"></div>
    </div>`);
    const ctrl = renderQuestion(q);
    controls.push(ctrl);
    card.querySelector('.q-slot').append(ctrl.node);
    list.append(card);
  });

  const footer = el(`<div class="mt"><button class="btn primary submit">Submit answers</button>
    <div class="result mt"></div></div>`);
  host.append(footer);

  footer.querySelector('.submit').onclick = () => {
    let score = 0;
    controls.forEach((ctrl) => { if (ctrl.grade()) score++; });

    const pct = Math.round((score / quiz.questions.length) * 100);
    store.recordQuiz(quiz.id, score, quiz.questions.length);
    footer.querySelector('.result').innerHTML = `<div class="card">
      <div class="score-ring">
        <div class="score-big">${pct}%</div>
        <div><strong>${score} of ${quiz.questions.length} correct</strong>
          <p class="small muted" style="margin:4px 0 0">${
            pct >= 90 ? 'Excellent — you have this solidly.'
            : pct >= 70 ? 'Good. Review the ones you missed and move on.'
            : 'Worth revisiting the lessons in this module before continuing.'}</p></div>
      </div></div>`;
    footer.querySelector('.result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return () => controls.forEach((c) => c.teardown());
}

/* The inline question renderer that used to live here now lives in
   question.js, so lesson step-checks and the module quiz cannot disagree
   about what counts as a correct answer. */
