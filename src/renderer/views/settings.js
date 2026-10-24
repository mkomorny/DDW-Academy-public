/**
 * settings.js — MIDI device selection, display preferences, progress management.
 */

import { escapeHtml, el, go } from '../app.js';
import { store } from '../lib/store.js';
import { midiHub } from '../lib/midi.js';
import { instrument, instrumentGroups, DEFAULT_INSTRUMENT } from '../lib/audio.js';
import { ALL_LESSONS } from '../course/index.js';

export default function renderSettings(host, route, app) {
  host.append(el(`<div class="page-head">
    <div class="eyebrow">Settings</div><h1>Settings</h1></div>`));

  /* ---------------------------------------------------------------- MIDI */
  host.append(el('<h2>MIDI</h2>'));
  const midiCard = el('<div class="card"><div class="midi-body"></div></div>');
  host.append(midiCard);

  const paintMidi = () => {
    const s = midiHub.snapshot();
    const body = midiCard.querySelector('.midi-body');
    body.innerHTML = '';

    if (!s.supported) {
      body.append(el(`<p class="muted">Web MIDI is not available in this build.</p>`));
      return;
    }
    if (s.status === 'denied') {
      body.append(el(`<p class="muted">MIDI access was refused: ${escapeHtml(s.error || 'unknown error')}</p>`));
    }

    if (!s.devices.length) {
      body.append(el(`<p class="muted">No MIDI devices detected. Plug a USB keyboard in — it should
        appear here within a second or two, no restart needed.</p>`));
    } else {
      body.append(el(`<p>Detected ${s.devices.length} device${s.devices.length > 1 ? 's' : ''}:</p>`));
      const sel = el(`<select class="sel"><option value="all">All devices</option>${
        s.devices.map((d) => `<option value="${d.id}" ${d.id === s.activeInputId ? 'selected' : ''}>${escapeHtml(d.name)}</option>`).join('')}</select>`);
      sel.onchange = () => { midiHub.selectInput(sel.value); store.set('midiDeviceId', sel.value); };
      body.append(el('<div class="row mt"><span class="small muted">Listen to</span></div>').appendChild(sel).parentElement);
    }

    const test = el('<div class="try-status mt">Press a key on your MIDI keyboard to test…</div>');
    body.append(test);
    if (paintMidi._off) { paintMidi._off(); paintMidi._off = null; }
    const off = midiHub.on('noteon', ({ midi, velocity, device }) => {
      test.textContent = `✓ Received note ${midi} (velocity ${velocity})${device ? ' from ' + device : ''}`;
      test.classList.add('good');
    });
    paintMidi._off = off;

    const rescan = el('<button class="btn sm mt">Rescan devices</button>');
    rescan.onclick = () => midiHub.connect().then(paintMidi);
    body.append(rescan);
  };
  const offStatus = midiHub.on('devices', paintMidi);
  paintMidi();

  /* ------------------------------------------------------------- display */
  host.append(el('<h2>Display &amp; sound</h2>'));
  const disp = el('<div class="card"></div>');

  const mode = store.get('lessonMode') || 'interactive';
  const modeRow = el(`<div class="mb">
    <div class="small muted">How you want to work</div>
    <div class="row mt" style="gap:8px">
      <button class="btn sm mode-int ${mode === 'interactive' ? 'primary' : ''}">Interactive</button>
      <button class="btn sm mode-read ${mode === 'reader' ? 'primary' : ''}">Reader</button>
    </div>
    <p class="small muted mt mode-desc"></p>
  </div>`);
  const modeDescs = {
    interactive: 'Answer by playing on a MIDI or on-screen keyboard, and by ear.',
    reader: 'Answer written questions only — no keyboard or audio needed.',
  };
  const paintMode = () => {
    const m = store.get('lessonMode') || 'interactive';
    modeRow.querySelector('.mode-int').classList.toggle('primary', m === 'interactive');
    modeRow.querySelector('.mode-read').classList.toggle('primary', m === 'reader');
    modeRow.querySelector('.mode-desc').textContent = modeDescs[m];
  };
  modeRow.querySelector('.mode-int').onclick = () => { store.set('lessonMode', 'interactive'); paintMode(); };
  modeRow.querySelector('.mode-read').onclick = () => { store.set('lessonMode', 'reader'); paintMode(); };
  paintMode();
  disp.append(modeRow);

  const flats = el(`<label class="chk"><input type="checkbox" ${store.get('preferFlats') ? 'checked' : ''}>
    <span>Prefer flat spellings (D♭ rather than C♯) where a choice exists</span></label>`);
  flats.querySelector('input').onchange = (e) => {
    store.set('preferFlats', e.target.checked);
    if (app.dockKeyboard) { app.dockKeyboard.preferFlats = e.target.checked; app.dockKeyboard.render(); }
  };
  disp.append(flats);

  const volRow = el(`<div class="row mt"><span class="small muted" style="width:110px">Volume</span>
    <input type="range" min="0" max="100" value="${Math.round((store.get('volume') ?? 1) * 100)}"
      style="flex:1;accent-color:var(--brass)"></div>`);
  volRow.querySelector('input').oninput = (e) => {
    const v = e.target.value / 100;
    instrument.setVolume(v); store.set('volume', v);
    const dockVol = document.getElementById('volume');
    if (dockVol) dockVol.value = e.target.value;
  };
  disp.append(volRow);

  const instRow = el(`<div class="row mt"><span class="small muted" style="width:110px">Sound</span></div>`);
  const instSelSettings = el(`<select class="sel" id="instrumentSettings">${
    instrumentGroups().map((g) => `<optgroup label="${escapeHtml(g.group)}">${
      g.items.map((inst) => `<option value="${inst.id}">${escapeHtml(inst.name)}</option>`).join('')
    }</optgroup>`).join('')}</select>`);
  instSelSettings.value = instrument.currentInstrument();
  const instNote = el('<span class="small muted mini-note" style="margin-left:8px"></span>');
  instSelSettings.onchange = async () => {
    const id = instSelSettings.value;
    instNote.textContent = 'loading…'; instNote.className = 'small muted mini-note loading';
    const ok = await instrument.setInstrument(id);
    if (ok) {
      store.set('instrument', id);
      instNote.textContent = ''; instNote.className = 'small muted mini-note';
      const dockSel = document.getElementById('instrument');
      if (dockSel) dockSel.value = id;
    } else {
      instSelSettings.value = instrument.currentInstrument();
      instNote.textContent = "couldn't load"; instNote.className = 'small muted mini-note bad';
    }
  };
  instRow.append(instSelSettings, instNote);
  disp.append(instRow);

  const testTone = el('<button class="btn sm mt">Play a test chord</button>');
  testTone.onclick = () => instrument.play([60, 64, 67, 72], { gap: 0, duration: 1.6 });
  disp.append(testTone);
  host.append(disp);

  /* ------------------------------------------------------------------ AI */
  host.append(el(`<h2>AI Assistant</h2>`));
  const aiCard = el(`<div class="card">
    <p class="small muted">Paste any API key from Anthropic, xAI or Google — the provider is
      detected automatically by actually calling that provider's own model list with your key,
      never guessed from the key's shape alone. Nothing here works unless it's been verified live.</p>
    <div class="ai-body"></div>
  </div>`);
  host.append(aiCard);
  const aiBody = aiCard.querySelector('.ai-body');

  async function paintAi() {
    aiBody.innerHTML = '<p class="small muted">Loading…</p>';
    const status = (await window.ai?.status()) || { configured: false };
    aiBody.innerHTML = '';

    if (!status.configured) {
      const row = el(`<div>
        <div class="row" style="gap:8px">
          <input type="password" class="txt ai-key-input" placeholder="Paste an API key…" style="flex:1">
          <button class="btn sm primary ai-connect">Connect</button>
        </div>
        <div class="small muted mt ai-status"></div>
      </div>`);
      row.querySelector('.ai-connect').onclick = async () => {
        const key = row.querySelector('.ai-key-input').value.trim();
        const statusEl = row.querySelector('.ai-status');
        // Every className write below keeps 'ai-status' in the string —
        // overwriting it wholesale (className = 'small muted mt bad') would
        // strip the very class this handler re-queries by on its next run,
        // so a second click after a failed first attempt would find null
        // and throw. Caught live by clicking Test twice in a row.
        if (!key) { statusEl.textContent = 'Paste a key first.'; statusEl.className = 'small muted mt ai-status bad'; return; }
        statusEl.textContent = 'Checking against every known provider…';
        statusEl.className = 'small muted mt ai-status loading';
        const res = await window.ai.setKey(key);
        if (res.ok) {
          statusEl.textContent = `✓ Detected ${res.label} — ${res.models.length} model${res.models.length === 1 ? '' : 's'} available`;
          statusEl.className = 'small muted mt ai-status good';
          setTimeout(paintAi, 700);
        } else {
          statusEl.innerHTML = `<pre class="small" style="white-space:pre-wrap;margin:0">${escapeHtml(res.error)}</pre>`;
          statusEl.className = 'small muted mt ai-status bad';
        }
      };
      aiBody.append(row);
      return;
    }

    const wrap = el(`<div>
      <div class="row spread">
        <div>
          <strong>${escapeHtml(status.label)}</strong>
          <span class="small muted" style="margin-left:8px">${escapeHtml(status.maskedKey)}</span>
        </div>
        <button class="btn sm ai-remove" style="border-color:var(--bad);color:var(--bad)">Remove key</button>
      </div>
      <div class="row mt" style="gap:8px;align-items:center">
        <span class="small muted" style="width:60px">Model</span>
        <select class="sel ai-model" style="flex:1">
          <option value="auto" ${status.model === 'auto' ? 'selected' : ''}>Auto (picks a fast or deep model per task)</option>
          ${status.models.map((m) => `<option value="${m.id}" ${m.id === status.model ? 'selected' : ''}>${escapeHtml(m.label)}</option>`).join('')}
        </select>
        <button class="btn sm ai-test">Test</button>
      </div>
      <div class="small muted mt ai-test-status"></div>
    </div>`);

    wrap.querySelector('.ai-model').onchange = async (e) => {
      await window.ai.setModel(e.target.value);
    };
    wrap.querySelector('.ai-test').onclick = async () => {
      const testEl = wrap.querySelector('.ai-test-status');
      const modelId = wrap.querySelector('.ai-model').value;
      testEl.textContent = 'Sending a test message…';
      // Keep 'ai-test-status' in every className write — see the matching
      // comment above on '.ai-status' for why overwriting it wholesale
      // breaks the SECOND click.
      testEl.className = 'small muted mt ai-test-status loading';
      const res = await window.ai.testModel(modelId);
      if (res.ok) {
        testEl.textContent = `✓ ${res.model} responded: "${res.text}"`;
        testEl.className = 'small muted mt ai-test-status good';
      } else {
        testEl.innerHTML = `✗ ${escapeHtml(res.model || modelId)} — <span>${escapeHtml(res.error)}</span>`;
        testEl.className = 'small muted mt ai-test-status bad';
      }
    };
    wrap.querySelector('.ai-remove').onclick = async () => {
      await window.ai.clear();
      paintAi();
    };

    aiBody.append(wrap);
  }
  paintAi();

  /* ------------------------------------------------------------ progress */
  host.append(el('<h2>Progress</h2>'));
  const doneCount = ALL_LESSONS.filter((l) => store.isLessonComplete(l.id)).length;
  const prog = el(`<div class="card">
    <p>${doneCount} of ${ALL_LESSONS.length} lessons complete ·
      ${Object.keys(store.data.quizzes).length} quizzes attempted ·
      ${Object.keys(store.data.drills).length} drills practiced ·
      ${Object.keys(store.data.games).length} games played</p>
    <p class="small muted">Progress is saved automatically to your Windows user data folder, not
      inside the app, so reinstalling or updating never erases it.</p>
    <div class="row mt">
      <button class="btn reveal">Show the progress file</button>
      <button class="btn reset" style="border-color:var(--bad);color:var(--bad)">Reset all progress</button>
    </div>
    <div class="confirm mt"></div>
  </div>`);
  prog.querySelector('.reveal').onclick = () => window.conservatory?.revealProgress();
  prog.querySelector('.reset').onclick = () => {
    const c = prog.querySelector('.confirm');
    c.innerHTML = '';
    c.append(el(`<div class="callout warning"><div class="ct">Are you sure?</div>
      <p>This permanently erases every lesson, quiz, drill and game record. It cannot be undone.</p></div>`));
    const yes = el('<button class="btn" style="background:var(--bad);border-color:var(--bad);color:#fff">Yes, erase everything</button>');
    const no = el('<button class="btn">Cancel</button>');
    yes.onclick = async () => { store.reset(); await store.flush(); go('home'); };
    no.onclick = () => { c.innerHTML = ''; };
    c.append(el('<div class="row"></div>')).lastElementChild.append(yes, no);
  };
  host.append(prog);

  /* ---------------------------------------------------------------- about */
  host.append(el('<h2>About</h2>'));
  const about = el(`<div class="card">
    <p><strong>DDW Academy</strong> — a complete interactive piano and music theory course.</p>
    <p class="small muted">Course content and the ${app.scales.length}-scale library were built from
      the 178 PDFs in your Research folder. The source PDFs were read only and never modified;
      all generated files live in the PianoCourseApp subfolder.</p>
    <p class="small muted">Piano sound: Salamander Grand Piano V3 (Yamaha C5) samples by
      Alexander Holm, licensed under <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>.
      The other ${instrumentGroups().reduce((n, g) => n + g.items.length, 0) - 1} instruments in the
      Sound picker are from the tonejs-instruments project, also
      <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a> —
      full per-instrument credits are in samples/CREDITS.md next to the app.</p>
    <p class="small muted app-info">Loading version information…</p>
  </div>`);
  host.append(about);
  window.conservatory?.appInfo().then((i) => {
    about.querySelector('.app-info').textContent =
      `Version ${i.version} · Electron ${i.electron} · Chromium ${i.chrome} · Data: ${i.dataPath}`;
  }).catch(() => {});

  return () => { offStatus(); if (paintMidi._off) paintMidi._off(); };
}
