/**
 * games.js — timed, scored versions of the core skills.
 *
 * Games differ from drills in one way that matters: they are timed and scored
 * competitively against your own high score. Same knowledge, different
 * pressure — which is what moves a skill from "I can work it out" to "I know it".
 */

import { escapeHtml, el, go } from '../app.js';
import { store } from '../lib/store.js';
import { midiHub } from '../lib/midi.js';
import { instrument, REFERENCE_INSTRUMENT } from '../lib/audio.js';
import { Keyboard, connectKeyboard } from '../components/keyboard.js';
import { Staff } from '../components/staff.js';
import {
  INTERVALS, CHORD_TYPES, MAJOR_KEYS, SHARP_NAMES, chordMidi, chordPcs,
  randomOf, shuffle, samePcSet, pcOf, realiseScale, findScale, scaleToMidi,
} from '../lib/theory.js';

const GAMES = [
  { id: 'note-race',   title: 'Note Race',        desc: 'Sixty seconds. Play as many named notes as you can.', icon: '⚡' },
  { id: 'staff-crawl', title: 'Staff Crawler',    desc: 'Read notes off the staff and play them. Sight-reading under pressure.', icon: '▤' },
  { id: 'ear-interval',title: 'Interval Ears',    desc: 'Hear an interval, name it. The core ear-training skill.', icon: '◉' },
  { id: 'chord-id',    title: 'Chord Quality ID', desc: 'Hear a chord, identify its quality by ear.', icon: '◆' },
  { id: 'key-blitz',   title: 'Key Signature Blitz', desc: 'Name key signatures and relative minors against the clock.', icon: '♯' },
  { id: 'mode-match',  title: 'Mode Matcher',     desc: 'Hear a mode, name it. Level 6 ear training.', icon: '◈' },
  { id: 'rhythm-back', title: 'Rhythm Clap-Back', desc: 'Hear a rhythm, tap it back. Any key or MIDI note works.', icon: '♪' },
];

export default function renderGames(host, route, app) {
  if (route.name === 'game') return gameView(host, route, app);

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Games</div>
    <h1>Interactive Games</h1>
    <p class="lede">Timed and scored. Same material as the drills, but the clock is what turns
      "I can work it out" into "I know it".</p>
  </div>`));

  const grid = el('<div class="grid c2"></div>');
  for (const g of GAMES) {
    const rec = store.data.games[g.id];
    const card = el(`<div class="card click">
      <div class="row spread" style="align-items:flex-start">
        <h3><span style="color:var(--brass);margin-right:7px">${g.icon}</span>${escapeHtml(g.title)}</h3>
        ${rec ? `<span class="badge done">High ${rec.highScore}</span>` : ''}
      </div>
      <p>${escapeHtml(g.desc)}</p>
      ${rec ? `<div class="small muted mt">${rec.plays} plays</div>` : '<div class="small muted mt">Not played yet</div>'}
    </div>`);
    card.onclick = () => go('game', { gameId: g.id });
    grid.append(card);
  }
  host.append(grid);
  return null;
}

/* ---------------------------------------------------------------- shell -- */

/**
 * Shared game shell: 60-second timer, score, and a per-game round callback.
 * `setup(api)` returns { nextRound, teardown }.
 */
function gameShell(host, meta, setup) {
  const DURATION = 60;
  const state = { score: 0, rounds: 0, hits: 0, left: DURATION, running: false };
  let timer = null;

  const ui = el(`<div>
    <div class="crumbs"><button data-b="g">Games</button> › ${escapeHtml(meta.title)}</div>
    <div class="page-head"><div class="eyebrow">Game</div><h1>${escapeHtml(meta.title)}</h1>
      <p class="lede">${escapeHtml(meta.desc)}</p></div>
    <div class="panel">
      <div class="panel-head">
        <div class="row">
          <div><span class="small muted">Score</span> <strong class="g-score" style="font-size:19px">0</strong></div>
          <div><span class="small muted">Time</span> <strong class="g-time" style="font-size:19px">${DURATION}</strong>s</div>
        </div>
        <button class="btn primary g-start">▶ Start</button>
      </div>
      <div class="game-body"></div>
    </div>
    <div class="g-result"></div>
  </div>`);
  host.append(ui);
  ui.querySelector('[data-b="g"]').onclick = () => go('games');

  const q = (s) => ui.querySelector(s);
  const api = {
    body: q('.game-body'),
    hit(points = 1) {
      if (!state.running) return;
      state.score += points; state.hits++; state.rounds++;
      q('.g-score').textContent = state.score;
    },
    miss() {
      if (!state.running) return;
      state.rounds++;
      state.score = Math.max(0, state.score - 1);
      q('.g-score').textContent = state.score;
    },
    get running() { return state.running; },
  };

  const { nextRound, teardown } = setup(api);

  function stop() {
    state.running = false;
    clearInterval(timer);
    q('.g-start').textContent = '▶ Play again';
    q('.g-start').disabled = false;
    api.body.classList.add('hidden');

    const rec = store.recordGame(meta.id, state.score);
    const acc = state.rounds ? Math.round((state.hits / state.rounds) * 100) : 0;
    q('.g-result').innerHTML = `<div class="card mt">
      <div class="score-ring">
        <div class="score-big">${state.score}</div>
        <div><strong>${state.hits} correct out of ${state.rounds}</strong>
          <p class="small muted" style="margin:4px 0 0">${acc}% accuracy · high score ${rec.highScore}</p></div>
      </div></div>`;
  }

  q('.g-start').onclick = () => {
    state.score = 0; state.rounds = 0; state.hits = 0; state.left = DURATION; state.running = true;
    q('.g-score').textContent = '0';
    q('.g-time').textContent = DURATION;
    q('.g-result').innerHTML = '';
    q('.g-start').disabled = true;
    api.body.classList.remove('hidden');
    instrument.ensure();
    nextRound();

    timer = setInterval(() => {
      state.left--;
      q('.g-time').textContent = state.left;
      if (state.left <= 0) stop();
    }, 1000);
  };

  return () => { clearInterval(timer); state.running = false; if (teardown) teardown(); };
}

/* ---------------------------------------------------------------- games -- */

function gameView(host, route, app) {
  const meta = GAMES.find((g) => g.id === route.gameId);
  if (!meta) return renderGames(host, { name: 'games' }, app);

  const builders = {

    'note-race': (api) => {
      let want = null;
      api.body.innerHTML = `<div class="drill-stage"><div class="drill-prompt np"></div>
        <div class="drill-sub">Play this note anywhere</div></div>
        <div class="kb-frame"><div class="kb-host"></div></div>`;
      const kb = new Keyboard(api.body.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
      const offKb = connectKeyboard(kb, midiHub, instrument);

      const nextRound = () => {
        want = Math.floor(Math.random() * 12);
        api.body.querySelector('.np').textContent = SHARP_NAMES[want];
      };
      const off = midiHub.on('noteon', ({ midi }) => {
        if (!api.running || want === null) return;
        if (midi % 12 === want) { api.hit(); nextRound(); } else api.miss();
      });
      return { nextRound, teardown: () => { off(); offKb(); } };
    },

    'staff-crawl': (api) => {
      let want = null;
      api.body.innerHTML = `<div class="staff-wrap"><div class="staff-host"></div></div>
        <div class="drill-sub center">Play the note shown</div>
        <div class="kb-frame mt"><div class="kb-host"></div></div>`;
      const staff = new Staff(api.body.querySelector('.staff-host'), { clef: 'grand' });
      const kb = new Keyboard(api.body.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
      const offKb = connectKeyboard(kb, midiHub, instrument);

      // Stay in the comfortable reading range for early levels: C3 to C6, naturals only.
      const POOL = [];
      for (let oct = 3; oct <= 5; oct++) {
        for (const L of ['C', 'D', 'E', 'F', 'G', 'A', 'B']) POOL.push({ name: L, oct });
      }
      const nextRound = () => {
        const p = randomOf(POOL);
        want = p;
        staff.setNotes([{ notes: [`${p.name}${p.oct}`], duration: 'q' }]);
      };
      const off = midiHub.on('noteon', ({ midi }) => {
        if (!api.running || !want) return;
        const target = (want.oct + 1) * 12 + pcOf(want.name);
        if (midi === target) { api.hit(2); nextRound(); } else api.miss();
      });
      return { nextRound, teardown: () => { off(); offKb(); } };
    },

    'ear-interval': (api) => {
      const POOL = INTERVALS.filter((i) => i.semitones > 0 && i.semitones <= 12);
      let answer = null, rootMidi = 60, timer = null;
      api.body.innerHTML = `<div class="drill-stage">
        <button class="btn replay">▶ Replay</button>
        <div class="drill-sub mt">Which interval was that?</div></div>
        <div class="row opts" style="justify-content:center;margin-top:12px"></div>`;

      const play = () => instrument.play([rootMidi, rootMidi + answer.semitones],
        { gap: 0.5, duration: 0.65, bank: REFERENCE_INSTRUMENT });
      api.body.querySelector('.replay').onclick = play;

      const nextRound = () => {
        clearTimeout(timer);
        answer = randomOf(POOL);
        rootMidi = 55 + Math.floor(Math.random() * 10);
        const wrong = shuffle(POOL.filter((i) => i.id !== answer.id)).slice(0, 3);
        const opts = shuffle([answer, ...wrong]);
        const host2 = api.body.querySelector('.opts');
        host2.innerHTML = '';
        for (const o of opts) {
          const b = el(`<button class="btn">${escapeHtml(o.name)}</button>`);
          b.onclick = () => {
            if (!api.running) return;
            if (o.id === answer.id) { api.hit(2); nextRound(); }
            else { api.miss(); b.style.borderColor = 'var(--bad)'; }
          };
          host2.append(b);
        }
        timer = setTimeout(play, 180);
      };
      return { nextRound, teardown: () => clearTimeout(timer) };
    },

    'chord-id': (api) => {
      const POOL = CHORD_TYPES.filter((c) => ['maj', 'min', 'dim', 'aug', 'maj7', 'min7', 'dom7'].includes(c.id));
      let answer = null, rootPc = 0, timer = null;
      api.body.innerHTML = `<div class="drill-stage"><button class="btn replay">▶ Replay</button>
        <div class="drill-sub mt">What quality was that chord?</div></div>
        <div class="row opts" style="justify-content:center;margin-top:12px"></div>`;

      const play = () => instrument.play(chordMidi(rootPc, answer.id, 4),
        { gap: 0, duration: 1.6, bank: REFERENCE_INSTRUMENT });
      api.body.querySelector('.replay').onclick = play;

      const nextRound = () => {
        clearTimeout(timer);
        answer = randomOf(POOL);
        rootPc = Math.floor(Math.random() * 12);
        const opts = shuffle([answer, ...shuffle(POOL.filter((c) => c.id !== answer.id)).slice(0, 3)]);
        const host2 = api.body.querySelector('.opts');
        host2.innerHTML = '';
        for (const o of opts) {
          const b = el(`<button class="btn">${escapeHtml(o.name)}</button>`);
          b.onclick = () => {
            if (!api.running) return;
            if (o.id === answer.id) { api.hit(2); nextRound(); }
            else { api.miss(); b.style.borderColor = 'var(--bad)'; }
          };
          host2.append(b);
        }
        timer = setTimeout(play, 180);
      };
      return { nextRound, teardown: () => clearTimeout(timer) };
    },

    'key-blitz': (api) => {
      let answer = null;
      api.body.innerHTML = `<div class="drill-stage"><div class="drill-prompt kb-q"></div>
        <div class="drill-sub kb-s"></div></div>
        <div class="row opts" style="justify-content:center;margin-top:12px"></div>`;

      const nextRound = () => {
        const key = randomOf(MAJOR_KEYS);
        const askRel = Math.random() < 0.5;
        api.body.querySelector('.kb-q').textContent = `${key.name} major`;
        api.body.querySelector('.kb-s').textContent = askRel ? 'Relative minor?' : 'How many accidentals?';

        let opts;
        if (askRel) {
          answer = key.relMinor + ' minor';
          opts = shuffle([answer, ...shuffle(MAJOR_KEYS.filter((k) => k.relMinor !== key.relMinor))
            .slice(0, 3).map((k) => k.relMinor + ' minor')]);
        } else {
          const n = key.sharps;
          answer = n === 0 ? 'None' : n > 0 ? `${n} sharp${n > 1 ? 's' : ''}` : `${-n} flat${-n > 1 ? 's' : ''}`;
          const pool = ['None', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps',
            '1 flat', '2 flats', '3 flats', '4 flats', '5 flats', '6 flats'];
          opts = shuffle([answer, ...shuffle(pool.filter((p) => p !== answer)).slice(0, 3)]);
        }

        const host2 = api.body.querySelector('.opts');
        host2.innerHTML = '';
        for (const o of opts) {
          const b = el(`<button class="btn">${escapeHtml(o)}</button>`);
          b.onclick = () => {
            if (!api.running) return;
            if (o === answer) { api.hit(2); nextRound(); }
            else { api.miss(); b.style.borderColor = 'var(--bad)'; }
          };
          host2.append(b);
        }
      };
      return { nextRound, teardown: null };
    },

    'mode-match': (api) => {
      const IDS = ['ionian-scales', 'dorian-scales', 'phrygian-scales', 'lydian-scales',
        'mixolydian-scales', 'aeolian-scales', 'locrian-scales'];
      const POOL = app.scales.filter((s) => IDS.includes(s.id));
      let answer = null, rootPc = 0, timer = null;

      api.body.innerHTML = `<div class="drill-stage"><button class="btn replay">▶ Replay</button>
        <div class="drill-sub mt">Which mode was that?</div></div>
        <div class="row opts" style="justify-content:center;margin-top:12px"></div>`;

      const play = () => instrument.play(scaleToMidi(rootPc, answer.steps, 4, 1),
        { gap: 0.24, duration: 0.36, bank: REFERENCE_INSTRUMENT });
      api.body.querySelector('.replay').onclick = play;

      const nextRound = () => {
        clearTimeout(timer);
        if (!POOL.length) return;
        answer = randomOf(POOL);
        rootPc = Math.floor(Math.random() * 12);
        const opts = shuffle([answer, ...shuffle(POOL.filter((s) => s.id !== answer.id)).slice(0, 3)]);
        const host2 = api.body.querySelector('.opts');
        host2.innerHTML = '';
        for (const o of opts) {
          const b = el(`<button class="btn">${escapeHtml(o.name.replace(/ Scales?$/i, ''))}</button>`);
          b.onclick = () => {
            if (!api.running) return;
            if (o.id === answer.id) { api.hit(3); nextRound(); }
            else { api.miss(); b.style.borderColor = 'var(--bad)'; }
          };
          host2.append(b);
        }
        timer = setTimeout(play, 200);
      };
      return { nextRound, teardown: () => clearTimeout(timer) };
    },

    'rhythm-back': (api) => {
      let pattern = [], taps = [], playing = false, startAt = 0;
      api.body.innerHTML = `<div class="drill-stage">
        <div class="drill-sub">Listen, then tap the rhythm back — any MIDI note, or press the spacebar.</div>
        <div class="seq-track rt"></div>
        <div class="drill-feedback rf"></div>
        <button class="btn replay mt">▶ Replay</button></div>`;

      const paint = () => {
        api.body.querySelector('.rt').innerHTML = pattern.map((v, i) =>
          `<div class="seq-note ${i < taps.length ? 'done' : ''}">${v === 1 ? '♩' : v === 0.5 ? '♪' : v === 2 ? '𝅗𝅥' : v}</div>`).join('');
      };

      const playPattern = () => {
        playing = true; taps = []; paint();
        let t = 0;
        for (const v of pattern) {
          setTimeout(() => instrument.play([72], { gap: 0, duration: 0.14, bank: REFERENCE_INSTRUMENT }), t * 1000);
          t += v * 0.6;
        }
        setTimeout(() => { playing = false; startAt = performance.now(); }, t * 1000 + 200);
      };
      api.body.querySelector('.replay').onclick = playPattern;

      const nextRound = () => {
        const n = 4;
        pattern = Array.from({ length: n }, () => randomOf([1, 1, 0.5, 0.5, 2]));
        taps = []; paint();
        api.body.querySelector('.rf').textContent = '';
        setTimeout(playPattern, 220);
      };

      const tap = () => {
        if (!api.running || playing) return;
        taps.push(performance.now() - startAt);
        paint();
        if (taps.length >= pattern.length) {
          // Grade the RATIOS between taps, not absolute times — the learner
          // should not be penalised for starting at a different tempo.
          const want = [];
          let acc = 0;
          for (const v of pattern) { want.push(acc); acc += v * 600; }
          const scale = taps[taps.length - 1] / (want[want.length - 1] || 1);
          const err = taps.reduce((s, t, i) => s + Math.abs(t - want[i] * (scale || 1)), 0) / taps.length;
          const ok = err < 170;
          api.body.querySelector('.rf').textContent = ok ? '✓ Good timing' : `✗ Off by ~${Math.round(err)}ms`;
          api.body.querySelector('.rf').className = 'drill-feedback rf ' + (ok ? 'good' : 'bad');
          if (ok) api.hit(3); else api.miss();
          setTimeout(nextRound, 900);
        }
      };

      const off = midiHub.on('noteon', tap);
      const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); tap(); } };
      window.addEventListener('keydown', onKey);
      return { nextRound, teardown: () => { off(); window.removeEventListener('keydown', onKey); } };
    },
  };

  const builder = builders[meta.id];
  if (!builder) { host.append(el('<p class="muted">This game is not available.</p>')); return null; }
  return gameShell(host, meta, builder);
}
