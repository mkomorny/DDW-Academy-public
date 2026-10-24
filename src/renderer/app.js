/**
 * app.js — application shell: routing, the persistent keyboard dock, MIDI
 * wiring, and view dispatch.
 *
 * Routing is hash-free and state-based (there is no URL bar in Electron).
 * A route is { name, ...params }; render() swaps the view and each view
 * returns a teardown function so listeners never leak between screens.
 */

import { store } from './lib/store.js';
import { midiHub, attachQwerty } from './lib/midi.js';
import { instrument, drums, instrumentGroups, DEFAULT_INSTRUMENT } from './lib/audio.js';
import { Keyboard, connectKeyboard } from './components/keyboard.js';
import { loadScales } from './lib/theory.js';
import { TRACKS, DEFAULT_TRACK_ID, trackById, moduleById, lessonById } from './course/index.js';

import renderHome from './views/home.js';
import renderLearn from './views/learn.js';
import renderPractice from './views/practice/index.js';
import renderGames from './views/games.js';
import renderReference from './views/reference.js';
import renderSettings from './views/settings.js';
import renderPicker from './views/picker.js';

export const app = {
  route: { name: 'home' },
  scales: [],
  dockKeyboard: null,
  _teardown: null,
};

const viewEl = () => document.getElementById('view');

/* ------------------------------------------------------------- routing -- */

export function go(name, params = {}) {
  app.route = { name, ...params };
  render();
  document.getElementById('main').scrollTop = 0;
  viewEl().focus({ preventScroll: true });
}

const ROUTES = {
  picker: renderPicker,
  home: renderHome,
  learn: renderLearn,
  lesson: renderLearn,
  module: renderLearn,
  quiz: renderLearn,
  practice: renderPractice,
  drill: renderPractice,
  games: renderGames,
  game: renderGames,
  reference: renderReference,
  settings: renderSettings,
};

function render() {
  // Every view returns a teardown; call the previous one before replacing DOM
  // so its MIDI subscriptions and timers are released.
  if (typeof app._teardown === 'function') {
    try { app._teardown(); } catch (err) { console.error('teardown failed:', err); }
  }
  app._teardown = null;
  midiHub.panic();

  const fn = ROUTES[app.route.name] || renderHome;
  const el = viewEl();
  el.innerHTML = '';
  try {
    app._teardown = fn(el, app.route, app) || null;
  } catch (err) {
    console.error('view render failed:', err);
    el.innerHTML = `<div class="page-head"><h1>Something went wrong</h1></div>
      <div class="callout warning"><div class="ct">Error</div>
      <p>${escapeHtml(String(err && err.message ? err.message : err))}</p></div>
      <button class="btn" onclick="location.reload()">Reload</button>`;
  }

  syncNav();
  renderSidebarTree();
}

function syncNav() {
  const top = { lesson: 'learn', module: 'learn', quiz: 'learn', drill: 'practice', game: 'games' }[app.route.name] || app.route.name;
  for (const b of document.querySelectorAll('.navbtn')) {
    b.classList.toggle('active', b.dataset.route === top);
    // Settings must always be reachable (same permanence as Return Home —
    // see Recovery Plan 0R task 0R.8), so it's exempt from the picker's
    // in-course-nav collapse alongside the picker button itself.
    if (b.dataset.route !== 'picker' && b.dataset.route !== 'settings') {
      b.style.display = app.route.name === 'picker' ? 'none' : 'flex';
    }
  }
  const sep = document.querySelector('.nav-separator');
  if (sep) sep.style.display = 'block';

  const bt = document.querySelector('.brand-text small');
  if (bt) {
    if (app.route.name === 'picker') {
      bt.textContent = 'Course Picker';
    } else {
      const activeTrackId = store.get('activeTrack') || DEFAULT_TRACK_ID;
      const track = trackById(activeTrackId);
      bt.textContent = track ? track.title : 'Course Picker';
    }
  }
}

/* ------------------------------------------------------- sidebar tree --- */

function renderSidebarTree() {
  const host = document.getElementById('sidebar-extra');
  const inLearn = ['learn', 'lesson', 'module', 'quiz'].includes(app.route.name);
  if (!inLearn) { host.innerHTML = ''; return; }

  const activeModule = app.route.moduleId
    || (app.route.lessonId ? (lessonById(app.route.lessonId) || {}).moduleId : null);
  const activeModuleRec = activeModule ? moduleById(activeModule) : null;
  const activeLevel = activeModuleRec ? activeModuleRec.levelId : app.route.levelId;

  // The active track follows whatever's actually open (a lesson/module's own
  // trackId), falling back to the last track the learner picked, falling
  // back to the default. This keeps the sidebar honest if a link ever lands
  // on a lesson from a track other than the currently "selected" one.
  const activeTrackId = activeModuleRec?.trackId
    || app.route.trackId
    || store.get('activeTrack')
    || DEFAULT_TRACK_ID;
  const track = trackById(activeTrackId);

  const switcher = TRACKS.length > 1
    ? `<div class="side-track-switch">${TRACKS.map((t) => `
        <button class="side-track-btn ${t.id === track.id ? 'active' : ''}" data-track="${t.id}">${escapeHtml(t.title)}</button>
      `).join('')}</div>`
    : '';

  host.innerHTML = `<div class="side-section"><div class="side-title">Curriculum</div>${switcher}${
    track.levels.map((lv) => {
      const open = lv.id === activeLevel;
      const pct = Math.round(store.levelProgress(lv) * 100);
      return `<div class="side-level ${open ? 'open' : ''}" data-level="${lv.id}">
        <button class="side-level-btn ${open ? 'active' : ''}" data-level="${lv.id}">
          <span class="side-num">${lv.number}</span>
          <span style="flex:1">${escapeHtml(lv.title)}</span>
          <span class="small muted">${pct}%</span>
        </button>
        <div class="side-mods">${lv.modules.map((m) => `
          <button class="side-mod ${m.id === activeModule ? 'active' : ''}" data-module="${m.id}">
            <span class="mcode">${m.code}</span>${escapeHtml(m.title)}
          </button>`).join('')}
        </div>
      </div>`;
    }).join('')}</div>`;

  host.querySelectorAll('.side-level-btn').forEach((b) => {
    b.onclick = () => {
      const wrap = b.closest('.side-level');
      // Toggle if already open, otherwise navigate to the level.
      if (wrap.classList.contains('open') && app.route.levelId === b.dataset.level) {
        wrap.classList.toggle('open');
      } else {
        go('learn', { levelId: b.dataset.level });
      }
    };
  });
  host.querySelectorAll('.side-mod').forEach((b) => {
    b.onclick = () => go('module', { moduleId: b.dataset.module });
  });
  host.querySelectorAll('.side-track-btn').forEach((b) => {
    b.onclick = () => {
      store.set('activeTrack', b.dataset.track);
      go('learn', { trackId: b.dataset.track });
    };
  });
}

/* ---------------------------------------------------------------- dock -- */

function setupDock() {
  const host = document.getElementById('dockKeyboard');
  const dock = document.getElementById('dock');

  // Restore the saved instrument before the dock keyboard's first render
  // (which reads it for range-dimming) and before any AudioContext exists.
  instrument.presetInstrument(store.get('instrument') || DEFAULT_INSTRUMENT);

  app.dockKeyboard = new Keyboard(host, {
    lowMidi: 48, highMidi: 84,
    showLabels: store.get('keyLabels') || 'c',
    preferFlats: store.get('preferFlats'),
  });
  connectKeyboard(app.dockKeyboard, midiHub, instrument);

  document.getElementById('dockToggle').onclick = (e) => {
    dock.classList.toggle('collapsed');
    e.target.textContent = dock.classList.contains('collapsed') ? '▸ Keyboard' : '▾ Keyboard';
  };

  const octLabel = document.getElementById('octLabel');
  const setOct = (v) => {
    const o = Math.max(0, Math.min(7, v));
    store.set('baseOctave', o);
    octLabel.textContent = o;
  };
  octLabel.textContent = store.get('baseOctave') ?? 3;
  document.getElementById('octDown').onclick = () => setOct((store.get('baseOctave') ?? 3) - 1);
  document.getElementById('octUp').onclick = () => setOct((store.get('baseOctave') ?? 3) + 1);

  const labelSel = document.getElementById('labelMode');
  labelSel.value = store.get('keyLabels') || 'c';
  labelSel.onchange = () => {
    store.set('keyLabels', labelSel.value);
    app.dockKeyboard.showLabels = labelSel.value;
    app.dockKeyboard.render();
  };

  const instSel = document.getElementById('instrument');
  const instStatus = document.getElementById('instStatus');
  instSel.innerHTML = instrumentGroups().map((g) =>
    `<optgroup label="${escapeHtml(g.group)}">${g.items.map((inst) =>
      `<option value="${inst.id}">${escapeHtml(inst.name)}</option>`).join('')}</optgroup>`).join('');
  instSel.value = instrument.currentInstrument();

  const paintInstStatus = (text, cls) => {
    instStatus.textContent = text;
    instStatus.className = cls ? `mini-note ${cls}` : 'mini-note';
  };

  instSel.onchange = async () => {
    const id = instSel.value;
    paintInstStatus('loading…', 'loading');
    const ok = await instrument.setInstrument(id);
    if (ok) {
      store.set('instrument', id);
      paintInstStatus('');
    } else {
      instSel.value = instrument.currentInstrument();
      paintInstStatus("couldn't load", 'bad');
    }
  };

  // Fires on every successful switch, including ones triggered from the
  // Settings page's mirrored select — keeps the dock select, the dock
  // keyboard's range dimming, and Settings all in sync with each other.
  instrument.onChange(() => {
    instSel.value = instrument.currentInstrument();
    app.dockKeyboard.render();
    const settingsSel = document.getElementById('instrumentSettings');
    if (settingsSel) settingsSel.value = instrument.currentInstrument();
  });

  document.getElementById('panicBtn').onclick = () => {
    midiHub.panic();
    instrument.allOff();
    drums.stopAll();
  };

  attachQwerty(midiHub, () => store.get('baseOctave') ?? 3);
}

/* ---------------------------------------------------------------- MIDI -- */

function setupMidi() {
  const wrap = document.getElementById('midiStatus');
  const text = document.getElementById('midiText');

  const paint = (s) => {
    wrap.classList.remove('ready', 'error');
    if (s.status === 'ready' && s.devices.length) {
      wrap.classList.add('ready');
      const names = s.devices.map((d) => d.name).join(', ');
      text.textContent = s.devices.length === 1 ? names : `${s.devices.length} MIDI devices`;
      text.title = names;
    } else if (s.status === 'ready') {
      text.textContent = 'MIDI ready — no device';
    } else if (s.status === 'denied' || s.status === 'unsupported') {
      wrap.classList.add('error');
      text.textContent = 'MIDI unavailable';
      text.title = s.error || 'Web MIDI is not available';
    } else {
      text.textContent = 'MIDI: connecting…';
    }
  };

  midiHub.on('status', paint);
  midiHub.on('devices', () => paint(midiHub.snapshot()));
  paint(midiHub.snapshot());
  midiHub.connect();
}

/* ------------------------------------------------------------- helpers -- */

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function fmtTime(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/* ----------------------------------------------------------------- boot - */

async function boot() {
  await store.init();
  app.scales = await loadScales();

  const { initThemes } = await import('./lib/themes.js');
  await initThemes();

  setupDock();
  setupMidi();

  for (const b of document.querySelectorAll('.navbtn')) {
    b.onclick = () => go(b.dataset.route);
  }

  // First user gesture unlocks AudioContext and starts decoding samples for
  // the grand piano (Salamander, pinned — the forced fallback for ear
  // training/rhythm and for a bank that's still loading) and, if different,
  // whatever instrument was saved. Decoding is async; noteOn waits until ready.
  const unlock = () => {
    instrument.ensure();
    instrument.warmup();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  window.addEventListener('beforeunload', () => store.flush());

  go('picker');
}

boot().catch((err) => {
  console.error('boot failed:', err);
  document.getElementById('view').innerHTML =
    `<h1>Failed to start</h1><pre class="small">${escapeHtml(String(err.stack || err))}</pre>`;
});
