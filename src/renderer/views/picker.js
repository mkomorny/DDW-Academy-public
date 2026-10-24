/**
 * picker.js — Top-level course selection grid.
 */

import { escapeHtml, el, go } from '../app.js';
import { store } from '../lib/store.js';
import { TRACKS, ALL_LESSONS } from '../course/index.js';

export default function renderPicker(host, route, app) {
  host.append(el(`<div class="page-head">
    <div class="eyebrow">DDW Academy</div>
    <h1>Select a Course</h1>
    <p class="lede">Choose a curriculum track to begin or continue your progress.</p>
  </div>`));

  const grid = el(`<div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px;"></div>`);

  for (const track of TRACKS) {
    const isReady = track.levels && track.levels.length > 0;
    const trackLessons = ALL_LESSONS.filter((l) => l.trackId === track.id);
    const done = trackLessons.filter((l) => store.isLessonComplete(l.id)).length;
    const pct = trackLessons.length ? Math.round((done / trackLessons.length) * 100) : 0;

    const cardHtml = `<div class="card interactive ${!isReady ? 'disabled' : ''}" style="${!isReady ? 'opacity: 0.6; cursor: not-allowed; pointer-events: none;' : ''}">
      <div class="card-head">
        <h3 style="margin: 0; font-size: 16px;">${escapeHtml(track.title)}</h3>
        ${!isReady ? '<span class="mini-note" style="margin-left:auto; background:var(--bg-3); padding:3px 6px; border-radius:4px; font-size: 10px; font-weight: bold;">Coming Soon</span>' : ''}
      </div>
      <div class="card-body" style="margin-top: 10px;">
        <p style="color: var(--ink-2); font-size: 13px; margin: 0 0 15px;">
          ${isReady ? `${trackLessons.length} lessons` : 'Syllabus under construction'}
        </p>
        ${isReady ? `
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="progress-track" style="flex: 1; height: 6px; background: var(--bg-4); border-radius: 3px; overflow: hidden;">
              <div class="progress-bar" style="width: ${pct}%; height: 100%; background: var(--brass);"></div>
            </div>
            <span style="font-size: 11px; color: var(--ink-3); font-variant-numeric: tabular-nums;">${pct}%</span>
          </div>
        ` : ''}
      </div>
    </div>`;

    const card = el(cardHtml);
    if (isReady) {
      card.addEventListener('click', () => {
        store.set('activeTrack', track.id);
        store.flush();
        go('home');
      });
    }

    grid.append(card);
  }

  host.append(grid);
}
