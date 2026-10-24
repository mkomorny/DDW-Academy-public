/**
 * themes.js — theme state, persistence, and the picker overlay.
 *
 * Mechanism (from the Color Themes Instructions): every theme is a block of
 * CSS variables scoped to `:root[data-theme="…"]` in themes.css. Switching
 * theme is one attribute write on <html>; the derived layer in styles.css
 * recomputes and the whole app recolors without touching any component.
 *
 * The default theme is the app's original palette and corresponds to the
 * ABSENCE of the data-theme attribute.
 */

import { store } from './store.js';
import { escapeHtml, el } from '../app.js';

const DEFAULT_ID = 'conservatory';

let _themes = null;          // manifest from src/data/themes.json
let _overlay = null;

export async function loadThemes() {
  if (_themes) return _themes;
  const res = await fetch('../data/themes.json');
  _themes = (await res.json()).themes;
  return _themes;
}

export function currentTheme() {
  return store.get('colorTheme') || DEFAULT_ID;
}

export function applyTheme(id, { persist = true } = {}) {
  if (!id || id === DEFAULT_ID) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
  if (persist) store.set('colorTheme', id);
}

export function shuffleTheme() {
  if (!_themes) return;
  const cur = currentTheme();
  const pool = _themes.filter((t) => t.id !== cur);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  applyTheme(pick.id);
  return pick;
}

/* ------------------------------------------------------------- picker UI -- */

export function toggleThemePicker() {
  if (_overlay) { closePicker(); return; }
  openPicker();
}

function closePicker() {
  _overlay?.remove();
  _overlay = null;
  document.removeEventListener('keydown', onEsc);
}

function onEsc(e) {
  if (e.key === 'Escape') closePicker();
}

function swatchHtml(t) {
  return `<span class="th-swatch" style="background:${t.bg}">
    <i style="background:${t.accent}"></i><i style="background:${t.accent2}"></i><i style="background:${t.accent3}"></i>
  </span>`;
}

function openPicker() {
  const themes = _themes || [];
  const groups = [...new Set(themes.map((t) => t.group))];

  _overlay = el(`<div class="theme-overlay" role="dialog" aria-label="Choose a color theme">
    <div class="theme-sheet">
      <div class="panel-head">
        <div class="panel-title">Color theme <span class="muted small th-count">(${themes.length})</span></div>
        <div class="row">
          <input class="txt th-search" type="text" placeholder="Search themes…">
          <button class="btn sm th-shuffle" title="Random theme">⤨ Shuffle</button>
          <button class="btn sm th-close">✕</button>
        </div>
      </div>
      <div class="row th-groups">
        <button class="btn sm primary" data-group="">All</button>
        ${groups.map((g) => `<button class="btn sm" data-group="${escapeHtml(g)}">${escapeHtml(g)}</button>`).join('')}
      </div>
      <div class="theme-grid"></div>
    </div>
  </div>`);

  const grid = _overlay.querySelector('.theme-grid');
  const search = _overlay.querySelector('.th-search');
  let activeGroup = '';

  const paint = () => {
    const f = search.value.toLowerCase().trim();
    const cur = currentTheme();
    const items = themes.filter((t) =>
      (!activeGroup || t.group === activeGroup) &&
      (!f || t.name.toLowerCase().includes(f) || t.id.includes(f)));

    grid.innerHTML = '';
    for (const t of items) {
      const b = el(`<button class="theme-item ${t.id === cur ? 'active' : ''}" data-id="${t.id}">
        ${swatchHtml(t)}<span class="th-name">${escapeHtml(t.name)}</span>
      </button>`);
      // Live preview on hover; commit on click.
      b.onmouseenter = () => applyTheme(t.id, { persist: false });
      b.onmouseleave = () => applyTheme(currentTheme(), { persist: false });
      b.onclick = () => {
        applyTheme(t.id);
        grid.querySelectorAll('.theme-item').forEach((x) => x.classList.toggle('active', x.dataset.id === t.id));
      };
      grid.append(b);
    }
    if (!items.length) grid.append(el('<p class="muted small" style="padding:8px">No themes match.</p>'));
  };

  search.oninput = paint;
  _overlay.querySelector('.th-close').onclick = closePicker;
  _overlay.querySelector('.th-shuffle').onclick = () => { shuffleTheme(); paint(); };
  _overlay.querySelectorAll('.th-groups [data-group]').forEach((b) => {
    b.onclick = () => {
      activeGroup = b.dataset.group;
      _overlay.querySelectorAll('.th-groups .btn').forEach((x) => x.classList.toggle('primary', x === b));
      paint();
    };
  });
  _overlay.addEventListener('pointerdown', (e) => { if (e.target === _overlay) closePicker(); });
  document.addEventListener('keydown', onEsc);

  document.body.append(_overlay);
  paint();
  search.focus();
}

/** Called once at boot: restore the saved theme and wire the menu buttons. */
export async function initThemes() {
  await loadThemes();
  applyTheme(currentTheme(), { persist: false });

  document.getElementById('themePickBtn')?.addEventListener('click', toggleThemePicker);
  document.getElementById('themeShuffleBtn')?.addEventListener('click', () => shuffleTheme());
}
