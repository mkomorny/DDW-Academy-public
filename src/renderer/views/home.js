/**
 * home.js — dashboard: where you are, what to do next, and overall progress.
 */

import { escapeHtml, el, go, fmtTime } from '../app.js';
import { store } from '../lib/store.js';
import {
  TRACKS, DEFAULT_TRACK_ID, trackById, ALL_LESSONS, COURSE_STATS, moduleById, sourceIndex,
} from '../course/index.js';

export default function renderHome(host, route, app) {
  const track = trackById(store.get('activeTrack') || DEFAULT_TRACK_ID);
  // "Continue" scopes to the active track only — a piano learner's next-up
  // card should never be a drums lesson just because it comes first overall.
  const trackLessons = ALL_LESSONS.filter((l) => l.trackId === track.id);
  const done = trackLessons.filter((l) => store.isLessonComplete(l.id)).length;
  const pct = trackLessons.length ? Math.round((done / trackLessons.length) * 100) : 0;

  // "Next up" = the first lesson in this track's order that is not yet complete.
  const next = trackLessons.find((l) => !store.isLessonComplete(l.id)) || trackLessons[0];
  const nextMod = next ? moduleById(next.moduleId) : null;

  // Document count is scoped to this track's own modules — tracks with no
  // content imported yet (levels: []) have no sources, so the count clause
  // is dropped rather than shown as "0 documents".
  const trackDocs = sourceIndex(track.id).length;
  const lede = trackDocs > 0
    ? `From absolute beginner to advanced, built from your research library of ${trackDocs} document${trackDocs === 1 ? '' : 's'}.`
    : 'From absolute beginner to advanced, built from your research library.';

  host.append(el(`<div class="page-head">
    <div class="eyebrow">DDW Academy${TRACKS.length > 1 ? ` · ${escapeHtml(track.title)}` : ''}</div>
    <h1>${TRACKS.length > 1 ? escapeHtml(track.title) : 'Complete Piano &amp; Music Theory'}</h1>
    <p class="lede">${lede}</p>
  </div>`));

  /* Continue card */
  if (next) {
    const cont = el(`<div class="card click mb" style="border-color:var(--brass-dim)">
      <div class="eyebrow">${done ? 'Continue where you left off' : 'Start here'}</div>
      <h3 style="font-size:19px">${escapeHtml(next.title)}</h3>
      ${next.blurb || next.intro ? `<p>${escapeHtml(next.blurb || next.intro)}</p>` : ''}
      <p>Module ${nextMod.code} — ${escapeHtml(nextMod.title)} · ${next.minutes} min</p>
      <div class="row mt"><span class="btn primary">${done ? 'Continue →' : 'Begin the course →'}</span></div>
    </div>`);
    cont.onclick = () => go('lesson', { lessonId: next.id });
    host.append(cont);
  }

  /* Stats */
  host.append(el(`<div class="grid c4 mb">
    <div class="card stat"><div class="n">${pct}%</div><div class="l">Course complete</div></div>
    <div class="card stat"><div class="n">${done}/${trackLessons.length}</div><div class="l">Lessons</div></div>
    <div class="card stat"><div class="n">${fmtTime(store.data.practice.totalMs)}</div><div class="l">Practice time</div></div>
    <div class="card stat"><div class="n">${store.data.practice.streak || 0}</div><div class="l">Day streak</div></div>
  </div>`));

  /* Level progress */
  host.append(el('<h2>Your progress</h2>'));
  const grid = el('<div class="grid c2"></div>');
  for (const lv of track.levels) {
    const p = Math.round(store.levelProgress(lv) * 100);
    const card = el(`<div class="card click">
      <div class="row spread">
        <div><div class="eyebrow">Level ${lv.number}</div>
          <strong>${escapeHtml(lv.title)}</strong></div>
        <span class="${p === 100 ? 'badge done' : 'small muted'}">${p === 100 ? 'Complete' : p + '%'}</span>
      </div>
      <div class="progress"><i style="width:${p}%"></i></div>
    </div>`);
    card.onclick = () => go('learn', { levelId: lv.id });
    grid.append(card);
  }
  host.append(grid);

  /* Quick links */
  host.append(el('<h2>Jump in</h2>'));
  const quick = el('<div class="grid c3"></div>');
  const links = [
    ['practice', '◎ Practice drills', 'MIDI-graded scales, chords, intervals and progressions.'],
    ['games', '◇ Games', 'Timed ear training, sight-reading and key signature blitz.'],
    ['reference', '☰ Reference', `${app.scales.length} scales, chord charts, key signatures and terms.`],
  ];
  for (const [route2, title, desc] of links) {
    const c = el(`<div class="card click"><h3>${title}</h3><p>${escapeHtml(desc)}</p></div>`);
    c.onclick = () => go(route2);
    quick.append(c);
  }
  host.append(quick);

  /* Course scale */
  host.append(el(`<h2>What is in the course</h2>
    <div class="grid c4">
      <div class="card stat"><div class="n">${COURSE_STATS.levels}</div><div class="l">Levels</div></div>
      <div class="card stat"><div class="n">${COURSE_STATS.modules}</div><div class="l">Modules</div></div>
      <div class="card stat"><div class="n">${COURSE_STATS.questions}</div><div class="l">Quiz questions</div></div>
      <div class="card stat"><div class="n">${COURSE_STATS.exercises}</div><div class="l">Exercises</div></div>
    </div>`));

  host.append(el(`<div class="callout tip" style="margin-top:26px"><div class="ct">Connect a keyboard</div>
    <p>Plug in any USB MIDI keyboard and it will be detected automatically — the status appears at
    the bottom of the sidebar. No keyboard? The dock at the bottom of the window is fully playable
    with the mouse, and your computer's <kbd>Z</kbd> and <kbd>Q</kbd> rows are mapped like a piano.
    Every drill, quiz and game accepts all three.</p></div>`));

  return null;
}
