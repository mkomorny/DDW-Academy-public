/**
 * blocks.js — renders a lesson's typed blocks into live DOM.
 *
 * Each renderer returns { node, teardown? }. The teardown list is collected by
 * the caller so that MIDI subscriptions inside interactive blocks are released
 * when the learner navigates away.
 */

import { escapeHtml, el } from '../app.js';
import { store } from '../lib/store.js';
import { midiHub } from '../lib/midi.js';
import { instrument, metronome, drums, REFERENCE_INSTRUMENT } from '../lib/audio.js';
import { KITS, DEFAULT_KIT, VOICES } from '../lib/drums-manifest.js';
import { Keyboard, connectKeyboard } from '../components/keyboard.js';
import { Staff } from '../components/staff.js';
import {
  realiseScale, findScale, toMidi, chordMidi, chordType,
  INTERVALS, CIRCLE_OF_FIFTHS, keyByName, MAJOR_KEYS, samePcSet, pcOf, scaleToMidi,
  SHARP_NAMES, FLAT_NAMES,
} from '../lib/theory.js';

const CALLOUT_LABEL = {
  tip: 'Tip', warning: 'Watch out', key: 'Key idea',
  source: 'From the source', history: 'Context', ear: 'Listen',
};

/** Turn a mixed list of note names / pitch classes into MIDI numbers. */
function toMidiList(items, octave = 4) {
  return (items || []).map((x) => {
    if (typeof x === 'number') return x < 12 ? (octave + 1) * 12 + x : x;
    const m = /^([A-Ga-g][#b]*)(-?\d+)$/.exec(String(x));
    if (m) return toMidi(m[1], parseInt(m[2], 10));
    const pc = pcOf(x);
    return pc === undefined ? null : (octave + 1) * 12 + pc;
  }).filter((n) => n !== null);
}

/** Spell out a tryIt block's expected notes as text, for Reader Mode. */
function expectedNotesText(b) {
  const names = store.get('preferFlats') ? FLAT_NAMES : SHARP_NAMES;
  const items = b.expect || [];
  const joiner = b.mode === 'sequence' ? ' → ' : ' · ';
  if (b.byPitchClass !== false) {
    return items.map((x) => {
      if (typeof x === 'number') return names[((x % 12) + 12) % 12];
      const pc = pcOf(x);
      return pc === undefined ? String(x) : names[pc];
    }).join(joiner);
  }
  // Exact register matters — show the octave too.
  return toMidiList(items).map((m) => `${names[m % 12]}${Math.floor(m / 12) - 1}`).join(joiner);
}

/* --------------------------------------------------------------- static -- */

const renderers = {
  prose: (b) => ({ node: el(`<p>${b.html}</p>`) }),

  heading: (b) => ({ node: el(`<h${b.level}>${escapeHtml(b.text)}</h${b.level}>`) }),

  callout: (b) => ({
    node: el(`<div class="callout ${b.variant}">
      <div class="ct">${escapeHtml(b.title || CALLOUT_LABEL[b.variant] || '')}</div>
      <p>${b.html}</p></div>`),
  }),

  list: (b) => ({
    node: el(`<${b.ordered ? 'ol' : 'ul'} class="l">${
      b.items.map((i) => `<li>${i}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`),
  }),

  table: (b) => ({
    node: el(`<table class="t">
      ${b.caption ? `<caption>${escapeHtml(b.caption)}</caption>` : ''}
      <thead><tr>${b.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`),
  }),

  sources: (b) => ({
    node: el(`<div class="sources-block">
      <div class="sl">Source material</div>
      <ul>${b.files.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul></div>`),
  }),

  /* A flagged content gap — the source library was silent on something the
     lesson would otherwise need to claim, and the author declined to invent
     it. Deliberately styled to be unmistakable, never mistaken for taught
     content: a dashed border, the --bad token, and an explicit "Content
     gap" label rather than any wording that could read as part of the
     lesson. See schema.js's gap() doc comment for the authoring rule this
     block exists to satisfy. */
  gap: (b) => ({
    node: el(`<div class="gap-block">
      <div class="gl">⚠ Content gap — not in the source library</div>
      <p>${escapeHtml(b.note)}</p></div>`),
  }),

  /* Defensive only — stepper.js's stepsOf() always resolves `depth` wrapper
     blocks to a plain block list via course/index.js's resolveDepth() before
     renderBlocks ever sees a step's blocks. If one slips through unresolved
     anyway (e.g. a future direct renderBlocks() call that skips stepsOf),
     fall back to the standard branch rather than silently dropping the
     section — see resolveDepth()'s doc comment for why 'standard' is safe
     to assume present. */
  depth: (b, ctx) => {
    const wrap = el('<div class="depth-fallback"></div>');
    const teardown = renderBlocks(wrap, b.standard || [], ctx);
    return { node: wrap, teardown };
  },
};

/* ---------------------------------------------------------- interactive -- */

renderers.keyboard = (b) => {
  const wrap = el(`<div class="kb-wrap">
    <div class="kb-frame"><div class="kb-host"></div></div>
    ${b.play ? '<div class="row mt"><button class="btn sm listen">▶ Listen</button></div>' : ''}
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const kb = new Keyboard(wrap.querySelector('.kb-host'), {
    lowMidi: b.low, highMidi: b.high,
    showLabels: b.showLabels || 'none',
    preferFlats: store.get('preferFlats'),
  });

  if (b.highlight) {
    kb.highlight('target', toMidiList(b.highlight), { byPitchClass: b.byPitchClass });
  }

  const off = b.playable ? connectKeyboard(kb, midiHub, instrument) : null;

  const listen = wrap.querySelector('.listen');
  if (listen) {
    listen.onclick = () => instrument.play(b.play.notes, { gap: b.play.gap ?? 0.3, duration: b.play.duration ?? 0.55 });
  }
  return { node: wrap, teardown: off };
};

renderers.staff = (b) => {
  const wrap = el('<div class="staff-wrap"><div class="staff-host"></div></div>');
  new Staff(wrap.querySelector('.staff-host'), {
    clef: b.clef, keySignature: b.keySignature, showLabels: b.showLabels,
  }).setNotes(b.items || []);
  return { node: wrap };
};

renderers.scale = (b, ctx) => {
  const scale = findScale(ctx.scales, b.scaleId);
  if (!scale) {
    return { node: el(`<div class="callout warning"><div class="ct">Missing</div>
      <p>Scale "${escapeHtml(b.scaleId)}" was not found in the mined library.</p></div>`) };
  }

  const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let root = b.root || 'C';

  const wrap = el(`<div class="panel">
    <div class="panel-head">
      <div class="panel-title">${escapeHtml(scale.name)}</div>
      <div class="row">
        <select class="sel root-sel">${ROOTS.map((r) =>
          `<option ${r === root ? 'selected' : ''}>${r}</option>`).join('')}</select>
        <button class="btn sm listen">▶ Listen</button>
      </div>
    </div>
    <div class="notes-line"></div>
    <div class="formula-line"></div>
    <div class="kb-frame mt"><div class="kb-host"></div></div>
    <div class="small muted mt fing"></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const kb = new Keyboard(wrap.querySelector('.kb-host'), {
    lowMidi: 48, highMidi: 84, showLabels: 'c', preferFlats: store.get('preferFlats'),
  });
  const off = connectKeyboard(kb, midiHub, instrument);

  const paint = () => {
    const r = realiseScale(scale, root);
    if (!r) return;
    wrap.querySelector('.notes-line').textContent = r.names.join('  ');
    wrap.querySelector('.formula-line').textContent =
      `${scale.degrees.length ? scale.degrees.join(' · ') + '   —   ' : ''}steps ${scale.steps.join('-')}`;
    kb.highlight('target', r.pcs, { byPitchClass: true });
    kb.highlight('root', [r.root.pc], { byPitchClass: true });

    const fingEl = wrap.querySelector('.fing');
    if (b.showFingering && r.fingering.rh) {
      const notes = scaleToMidi(r.root.pc, scale.steps, 4, 1);
      kb.showFingering(notes, r.fingering.rh, 'rh');
      fingEl.textContent = `RH fingering: ${r.fingering.rh.join(' ')}`
        + (r.fingering.lh ? `   ·   LH: ${r.fingering.lh.join(' ')}` : '');
    } else {
      kb.clearFingering();
      fingEl.textContent = r.fromSourcePdf ? 'Spelling taken from the source PDF for this key.' : '';
    }
  };

  wrap.querySelector('.root-sel').onchange = (e) => { root = e.target.value; paint(); };
  wrap.querySelector('.listen').onclick = () => {
    const r = realiseScale(scale, root);
    instrument.play(scaleToMidi(r.root.pc, scale.steps, 4, 1), { gap: 0.26, duration: 0.4 });
  };
  paint();
  return { node: wrap, teardown: off };
};

renderers.chord = (b) => {
  const t = chordType(b.typeId);
  const rootPc = pcOf(b.root);
  if (!t || rootPc === undefined) return { node: el('<div></div>') };

  let inversion = 0;
  const wrap = el(`<div class="panel">
    <div class="panel-head">
      <div class="panel-title">${escapeHtml(b.root)}${t.symbol} — ${escapeHtml(t.name)}</div>
      <div class="row">
        <button class="btn sm inv">Invert</button>
        <button class="btn sm listen">▶ Listen</button>
      </div>
    </div>
    <div class="notes-line"></div>
    <div class="kb-frame mt"><div class="kb-host"></div></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const kb = new Keyboard(wrap.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);

  const paint = () => {
    const notes = chordMidi(rootPc, b.typeId, 4, inversion);
    kb.highlight('target', notes);
    const names = store.get('preferFlats') ? FLAT_NAMES : SHARP_NAMES;
    wrap.querySelector('.notes-line').textContent =
      notes.map((n) => names[n % 12]).join('  ')
      + (inversion ? `   (inversion ${inversion})` : '   (root position)');
  };
  wrap.querySelector('.inv').onclick = () => { inversion = (inversion + 1) % t.intervals.length; paint(); };
  wrap.querySelector('.listen').onclick = () => instrument.play(chordMidi(rootPc, b.typeId, 4, inversion), { gap: 0, duration: 1.4 });
  paint();
  return { node: wrap, teardown: off };
};

renderers.interval = (b) => {
  const iv = INTERVALS.find((i) => i.id === b.intervalId);
  const rootMidi = toMidiList([b.root])[0] ?? 60;
  if (!iv) return { node: el('<div></div>') };

  const wrap = el(`<div class="panel">
    <div class="panel-head">
      <div class="panel-title">${escapeHtml(iv.name)} <span class="tag">${iv.semitones} semitones</span></div>
      <div class="row">
        <button class="btn sm mel">▶ Melodic</button>
        <button class="btn sm har">▶ Harmonic</button>
      </div>
    </div>
    <div class="kb-frame"><div class="kb-host"></div></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const kb = new Keyboard(wrap.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);
  kb.highlight('target', [rootMidi, rootMidi + iv.semitones]);

  wrap.querySelector('.mel').onclick = () => instrument.play([rootMidi, rootMidi + iv.semitones], { gap: 0.55, duration: 0.7 });
  wrap.querySelector('.har').onclick = () => instrument.play([rootMidi, rootMidi + iv.semitones], { gap: 0, duration: 1.5 });
  return { node: wrap, teardown: off };
};

renderers.circle = () => {
  let active = 'C';
  const wrap = el(`<div class="panel">
    <div class="circle-wrap"><div class="c5-host"></div></div>
    <div class="center small muted c5-info"></div>
  </div>`);

  const draw = () => {
    const R = 168, r1 = 128, r2 = 88, cx = 175, cy = 175;
    let segs = '';
    CIRCLE_OF_FIFTHS.forEach((name, i) => {
      const a0 = (i * 30 - 105) * Math.PI / 180;
      const a1 = ((i + 1) * 30 - 105) * Math.PI / 180;
      const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      segs += `<path class="c5-seg ${name === active ? 'active' : ''}" data-key="${name}"
        d="M ${p(R, a0)} A ${R} ${R} 0 0 1 ${p(R, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z"/>`;
      const mid = (a0 + a1) / 2;
      const k = keyByName(name) || {};
      segs += `<text class="c5-label" x="${(cx + 148 * Math.cos(mid)).toFixed(1)}" y="${(cy + 148 * Math.sin(mid) + 5).toFixed(1)}">${name}</text>`;
      segs += `<text class="c5-acc" x="${(cx + 121 * Math.cos(mid)).toFixed(1)}" y="${(cy + 121 * Math.sin(mid) + 3).toFixed(1)}">${
        k.sharps > 0 ? `${k.sharps}♯` : k.sharps < 0 ? `${-k.sharps}♭` : '—'}</text>`;
      segs += `<text class="c5-minor" x="${(cx + 105 * Math.cos(mid)).toFixed(1)}" y="${(cy + 105 * Math.sin(mid) + 4).toFixed(1)}">${
        (k.relMinor || '') + 'm'}</text>`;
    });
    wrap.querySelector('.c5-host').innerHTML =
      `<svg class="circle-svg" viewBox="0 0 350 350"><circle class="c5-center" cx="${cx}" cy="${cy}" r="${r2}" fill="none"/>${segs}
       <text x="${cx}" y="${cy - 4}" class="c5-label" style="font-size:15px">Circle</text>
       <text x="${cx}" y="${cy + 14}" class="c5-minor">of fifths</text></svg>`;

    wrap.querySelectorAll('.c5-seg').forEach((s) => {
      s.onclick = () => {
        active = s.dataset.key;
        const k = keyByName(active);
        wrap.querySelector('.c5-info').textContent =
          `${active} major — ${k.accidentals.length ? k.accidentals.join(' ') : 'no accidentals'} · relative minor: ${k.relMinor} minor`;
        const pc = pcOf(active);
        instrument.play(scaleToMidi(pc, [2,2,1,2,2,2,1], 4, 1), { gap: 0.2, duration: 0.35 });
        draw();
      };
    });
  };
  draw();
  return { node: wrap };
};

renderers.rhythm = (b) => {
  const wrap = el(`<div class="panel">
    <div class="panel-head">
      <div class="panel-title">${escapeHtml(b.title || 'Rhythm')}</div>
      <div class="row">
        <label class="mini-label">${b.bpm || 80} BPM</label>
        <button class="btn sm play">▶ Play</button>
      </div>
    </div>
    <div class="seq-track"></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const NAMES = { 4: 'whole', 3: 'dotted half', 2: 'half', 1.5: 'dotted ♩', 1: '♩', 0.5: '♪', 0.25: '♬' };
  wrap.querySelector('.seq-track').innerHTML =
    b.pattern.map((v) => `<div class="seq-note">${NAMES[v] || v}</div>`).join('');

  let timers = [];
  wrap.querySelector('.play').onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const spb = 60 / (b.bpm || 80);
    const cells = wrap.querySelectorAll('.seq-note');
    let t = 0;
    b.pattern.forEach((v, i) => {
      timers.push(setTimeout(() => {
        cells.forEach((c) => c.classList.remove('now'));
        cells[i].classList.add('now');
        instrument.noteOn(72, 100, { bank: REFERENCE_INSTRUMENT });
        setTimeout(() => instrument.noteOff(72), Math.min(v * spb * 900, 500));
      }, t * 1000));
      t += v * spb;
    });
    timers.push(setTimeout(() => cells.forEach((c) => c.classList.remove('now')), t * 1000 + 300));
  };
  return { node: wrap, teardown: () => timers.forEach(clearTimeout) };
};

/* ---------------------------------------------------------- drum blocks -- */
/* Shared rule for every block below: no literal colors. Every fill/stroke is
   a CSS class resolving to var(--…) — exactly how the circle-of-fifths'
   .c5-seg already works (see styles.css) — so every theme recolors these for
   free. `color` fields in block data are semantic tokens (accent/accent2/
   accent3/muted/ok/bad), never hex; a bad token just falls back to the
   default class since CSS silently ignores an unmatched selector. */

const noteName = (midi) => `${SHARP_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

renderers.drums = (b) => {
  const lanes = b.lanes.map((l) => ({ ...l, steps: [...l.steps] })); // working copy — editable grids mutate this, never the authored block
  const originalSteps = b.lanes.map((l) => [...l.steps]);
  const steps = b.steps;
  const subdivision = b.subdivision || 4;
  const editable = !!b.editable;
  let bpm = b.bpm || 120;
  let kitId = KITS[b.kit] ? b.kit : DEFAULT_KIT;
  const CELL_W = 24, CELL_H = 20, GAP = 2;
  const gridW = steps * (CELL_W + GAP) - GAP;
  const gridH = lanes.length * (CELL_H + GAP) - GAP;

  const wrap = el(`<div class="panel drum-grid-panel ${editable ? 'dg-editable' : ''}">
    <div class="panel-head">
      <div class="panel-title">Drum pattern</div>
      <div class="row" style="gap:8px">
        <label class="mini-label">${bpm} BPM</label>
        <select class="sel dg-kit">${Object.entries(KITS).map(([id, k]) =>
          `<option value="${id}" ${id === kitId ? 'selected' : ''}>${escapeHtml(k.name)}</option>`).join('')}</select>
        <button class="btn sm dg-play">▶ Play</button>
        ${editable ? '<button class="btn sm dg-reset">Reset</button>' : ''}
      </div>
    </div>
    <div class="dg-body">
      <div class="dg-gutter">${lanes.map((l) => `<div class="dg-lane-label">${escapeHtml(l.label || l.voice)}</div>`).join('')}</div>
      <div class="dg-grid-host"></div>
    </div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const host = wrap.querySelector('.dg-grid-host');
  const stepDur = () => 60 / bpm / subdivision;

  function draw() {
    let cells = '';
    lanes.forEach((lane, li) => {
      for (let s = 0; s < steps; s++) {
        const vel = lane.steps[s] || 0;
        const on = vel > 0;
        const x = s * (CELL_W + GAP), y = li * (CELL_H + GAP);
        cells += `<rect class="dg-cell${on ? ' on' : ''}${s % subdivision === 0 ? ' beat' : ''}"
          data-lane="${li}" data-step="${s}" x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" rx="3"
          ${on ? `style="fill-opacity:${(0.32 + 0.68 * (vel / 127)).toFixed(2)}"` : ''}/>`;
      }
    });
    host.innerHTML = `<svg class="dg-svg" viewBox="0 0 ${gridW} ${gridH}" preserveAspectRatio="none"
        style="height:${lanes.length * (CELL_H + GAP) - GAP}px">
      ${cells}<rect class="dg-playhead" x="0" y="-2" width="${CELL_W}" height="${gridH + 4}" rx="3"/>
    </svg>`;
    if (editable) {
      host.querySelectorAll('.dg-cell').forEach((cell) => {
        cell.onclick = (e) => {
          const li = +cell.dataset.lane, s = +cell.dataset.step;
          const cur = lanes[li].steps[s] || 0;
          if (e.shiftKey && cur > 0) {
            lanes[li].steps[s] = cur < 60 ? 90 : cur < 100 ? 120 : 0;
          } else {
            lanes[li].steps[s] = cur > 0 ? 0 : 90;
          }
          draw();
        };
      });
    }
  }
  draw();

  let playing = false, timer = null, nextTime = 0, idx = 0, playheadTimers = [];

  function scheduleStep(i, when) {
    for (const lane of lanes) {
      const vel = lane.steps[i] || 0;
      if (vel > 0) drums.trigger(lane.voice, { when, velocity: vel, kit: kitId });
    }
    const ms = Math.max(0, (when - drums.ctx.currentTime) * 1000);
    playheadTimers.push(setTimeout(() => {
      const ph = host.querySelector('.dg-playhead');
      if (ph) ph.setAttribute('x', i * (CELL_W + GAP));
    }, ms));
  }

  function tick() {
    const ctx = drums.ctx;
    while (nextTime < ctx.currentTime + 0.12) {
      scheduleStep(idx, nextTime);
      const dur = stepDur();
      const swing = (b.swing || 0) * dur * 0.5;
      nextTime += (idx % 2 === 0) ? dur + swing : dur - swing;
      idx++;
      if (idx >= steps) {
        idx = 0;
        if (!b.loop) { stop(); break; }
      }
    }
  }

  function start() {
    if (playing) return;
    playing = true;
    wrap.querySelector('.dg-play').textContent = '■ Stop';
    drums.ensure();
    idx = 0;
    nextTime = drums.ctx.currentTime + 0.06;
    timer = setInterval(tick, 25);
  }
  function stop() {
    playing = false;
    const btn = wrap.querySelector('.dg-play');
    if (btn) btn.textContent = '▶ Play';
    clearInterval(timer); timer = null;
    playheadTimers.forEach(clearTimeout); playheadTimers = [];
    const ph = host.querySelector('.dg-playhead');
    if (ph) ph.setAttribute('x', 0);
  }

  wrap.querySelector('.dg-play').onclick = () => (playing ? stop() : start());
  wrap.querySelector('.dg-kit').onchange = (e) => { kitId = e.target.value; };
  wrap.querySelector('.dg-reset')?.addEventListener('click', () => {
    lanes.forEach((l, i) => { l.steps = [...originalSteps[i]]; });
    draw();
  });

  return { node: wrap, teardown: () => stop() };
};

renderers.pads = (b) => {
  const cols = b.cols || 8, rows = b.rows || 2;
  const CELL_W = 64, CELL_H = 50, GAP = 6;
  const w = cols * (CELL_W + GAP) - GAP, h = rows * (CELL_H + GAP) - GAP;

  const wrap = el(`<div class="panel pad-map-panel">
    <div class="pm-host"></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  let cells = '';
  b.pads.forEach((pad, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = c * (CELL_W + GAP), y = r * (CELL_H + GAP);
    const colorClass = pad.color ? ` c-${pad.color}` : '';
    cells += `<g class="pm-pad${b.playable ? ' clickable' : ''}" data-i="${i}">
      <rect class="pm-rect${colorClass}" x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" rx="8"/>
      <text class="pm-label" x="${x + CELL_W / 2}" y="${y + CELL_H / 2 - (b.showNotes && pad.note != null ? 5 : 0)}">${escapeHtml(pad.label || '')}</text>
      ${b.showNotes && pad.note != null ? `<text class="pm-note" x="${x + CELL_W / 2}" y="${y + CELL_H / 2 + 12}">${noteName(pad.note)}</text>` : ''}
    </g>`;
  });
  wrap.querySelector('.pm-host').innerHTML =
    `<svg class="pm-svg" viewBox="0 0 ${w} ${h}">${cells}</svg>`;

  function flash(g) {
    g.classList.add('lit');
    setTimeout(() => g.classList.remove('lit'), 160);
  }

  if (b.playable) {
    wrap.querySelectorAll('.pm-pad').forEach((g) => {
      g.onclick = () => {
        const pad = b.pads[+g.dataset.i];
        if (pad.voice) { drums.ensure(); drums.trigger(pad.voice, { velocity: 105 }); }
        else if (pad.note != null) { instrument.noteOn(pad.note, 100); setTimeout(() => instrument.noteOff(pad.note), 280); }
        flash(g);
      };
    });
  }

  let offMidi = null;
  if (b.midi) {
    const pads = wrap.querySelectorAll('.pm-pad');
    offMidi = midiHub.on('noteon', ({ midi }) => {
      pads.forEach((g, i) => { if (b.pads[i].note === midi) flash(g); });
    });
  }

  return { node: wrap, teardown: () => { if (offMidi) offMidi(); } };
};

renderers.arrangement = (b) => {
  const totalBars = b.bars;
  const PX_PER_BAR = 14, SECTION_H = 30, RULER_H = 16, TRACK_H = 22, ROW_GAP = 4;
  const gridW = totalBars * PX_PER_BAR;
  const tracksTop = SECTION_H + RULER_H;
  const gridH = tracksTop + b.tracks.length * (TRACK_H + ROW_GAP);

  let svg = '';
  let x = 0;
  b.sections.forEach((s, i) => {
    const sw = s.bars * PX_PER_BAR;
    const colorClass = s.color ? ` c-${s.color}` : ` c-alt${i % 2}`;
    svg += `<rect class="arr-section${colorClass}" x="${x}" y="0" width="${sw}" height="${SECTION_H}" rx="4"/>
      <text class="arr-section-label" x="${x + sw / 2}" y="${SECTION_H / 2 + 4}">${escapeHtml(s.name)}</text>`;
    x += sw;
  });
  for (let bar = 0; bar <= totalBars; bar += b.barLabelEvery || 8) {
    const tx = bar * PX_PER_BAR;
    svg += `<line class="arr-tick" x1="${tx}" y1="${SECTION_H}" x2="${tx}" y2="${SECTION_H + RULER_H}"/>
      <text class="arr-tick-label" x="${tx + 2}" y="${SECTION_H + RULER_H - 2}">${bar}</text>`;
  }
  b.tracks.forEach((tr, ti) => {
    const ty = tracksTop + ti * (TRACK_H + ROW_GAP);
    svg += `<rect class="arr-track-bg" x="0" y="${ty}" width="${gridW}" height="${TRACK_H}" rx="3"/>`;
    (tr.spans || []).forEach(([a, c]) => {
      svg += `<rect class="arr-span" x="${a * PX_PER_BAR}" y="${ty}" width="${(c - a) * PX_PER_BAR}" height="${TRACK_H}" rx="3"/>`;
    });
  });

  const wrap = el(`<div class="panel arrangement-panel">
    <div class="arr-body">
      <div class="arr-gutter">
        <div class="arr-spacer" style="height:${SECTION_H + RULER_H}px"></div>
        ${b.tracks.map((tr) => `<div class="arr-track-label" style="height:${TRACK_H}px;margin-bottom:${ROW_GAP}px">${escapeHtml(tr.name)}</div>`).join('')}
      </div>
      <div class="arr-host"></div>
    </div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);
  wrap.querySelector('.arr-host').innerHTML =
    `<svg class="arr-svg" viewBox="0 0 ${gridW} ${gridH}" preserveAspectRatio="none" style="height:${gridH}px">${svg}</svg>`;
  return { node: wrap };
};

let diagramInstanceCounter = 0;

function layoutDiagramNodes(nodes, layout) {
  const NODE_H = 46, COL_GAP = 46, ROW_GAP = 60;
  const nodeWidth = (label) => 40 + Math.max(8, Math.min(22, (label || '').length)) * 7;

  const cellOf = layout === 'grid'
    ? (n, i) => ({ row: n.row || 0, col: n.col || 0 })
    : layout === 'stack'
      ? (n, i) => ({ row: i, col: 0 })
      : (n, i) => ({ row: 0, col: i }); // 'chain' default

  const cells = nodes.map(cellOf);
  const colWidth = new Map();
  cells.forEach((cell, i) => {
    const w = nodeWidth(nodes[i].label);
    colWidth.set(cell.col, Math.max(colWidth.get(cell.col) || 0, w));
  });
  const maxCol = Math.max(0, ...cells.map((c) => c.col));
  const maxRow = Math.max(0, ...cells.map((c) => c.row));
  const colX = new Map();
  let acc = 0;
  for (let c = 0; c <= maxCol; c++) { colX.set(c, acc); acc += (colWidth.get(c) || 120) + COL_GAP; }

  const pos = new Map();
  nodes.forEach((n, i) => {
    const cell = cells[i];
    const w = nodeWidth(n.label);
    pos.set(n.id, { x: colX.get(cell.col), y: cell.row * (NODE_H + ROW_GAP), w, h: NODE_H });
  });
  return { pos, totalW: Math.max(1, acc - COL_GAP), totalH: (maxRow + 1) * (NODE_H + ROW_GAP) - ROW_GAP };
}

function diagramLabelTspans(label, cx) {
  const text = label || '';
  if (text.length <= 14) return `<tspan x="${cx}" dy="0">${escapeHtml(text)}</tspan>`;
  let splitAt = text.lastIndexOf(' ', Math.floor(text.length / 2));
  if (splitAt < 0) splitAt = text.indexOf(' ', Math.floor(text.length / 2));
  if (splitAt < 0) splitAt = Math.floor(text.length / 2);
  return `<tspan x="${cx}" dy="-6">${escapeHtml(text.slice(0, splitAt).trim())}</tspan>` +
    `<tspan x="${cx}" dy="12">${escapeHtml(text.slice(splitAt).trim())}</tspan>`;
}

renderers.diagram = (b) => {
  const layout = b.layout || 'chain';
  const { pos, totalW, totalH } = layoutDiagramNodes(b.nodes, layout);
  const markerId = `dg-arrow-${++diagramInstanceCounter}`;

  let svg = `<defs><marker id="${markerId}" viewBox="0 0 10 10" refX="9" refY="5"
    markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 Z" class="diagram-arrowhead"/></marker></defs>`;

  for (const link of b.links) {
    const a = pos.get(link.from), c = pos.get(link.to);
    if (!a || !c) { console.warn('diagram: link references unknown node', link); continue; }
    let x1, y1, x2, y2;
    if (layout === 'stack') { x1 = a.x + a.w / 2; y1 = a.y + a.h; x2 = c.x + c.w / 2; y2 = c.y; }
    else { x1 = a.x + a.w; y1 = a.y + a.h / 2; x2 = c.x; y2 = c.y + c.h / 2; }
    svg += `<line class="diagram-link${link.style === 'dashed' ? ' dashed' : ''}"
      x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${markerId})"/>`;
    if (link.label) {
      svg += `<text class="diagram-link-label" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 4}">${escapeHtml(link.label)}</text>`;
    }
  }

  for (const n of b.nodes) {
    const p = pos.get(n.id);
    const colorClass = n.color ? ` c-${n.color}` : '';
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    if (n.shape === 'circle') {
      svg += `<circle class="diagram-node${colorClass}" cx="${cx}" cy="${cy}" r="${Math.max(p.w, p.h) / 2}"/>`;
    } else {
      svg += `<rect class="diagram-node${colorClass}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"
        rx="${n.shape === 'round' ? p.h / 2 : 6}"/>`;
    }
    const labelY = n.sub ? cy - 4 : cy + 4;
    svg += `<text class="diagram-node-label" x="${cx}" y="${labelY}" text-anchor="middle">${diagramLabelTspans(n.label, cx)}</text>`;
    if (n.sub) svg += `<text class="diagram-node-sub" x="${cx}" y="${cy + 13}" text-anchor="middle">${escapeHtml(n.sub)}</text>`;
  }

  const wrap = el(`<div class="panel diagram-panel">
    <div class="diagram-host"></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);
  wrap.querySelector('.diagram-host').innerHTML =
    `<svg class="diagram-svg" viewBox="0 0 ${totalW} ${totalH}">${svg}</svg>`;
  return { node: wrap };
};

renderers.progression = (b) => {
  const parse = (sym) => {
    const m = /^([A-G][#b]?)(.*)$/.exec(sym);
    if (!m) return null;
    const map = { '': 'maj', m: 'min', min: 'min', maj7: 'maj7', m7: 'min7', '7': 'dom7',
      m7b5: 'min7b5', dim: 'dim', '7b9': 'dom7b9', 'ø7': 'min7b5', 'm7♭5': 'min7b5' };
    if (!(m[2] in map)) console.warn(`renderers.progression: unmapped chord suffix "${m[2]}" in "${sym}" — falling back to major`);
    return { pc: pcOf(m[1]), type: map[m[2]] ?? 'maj', label: sym };
  };
  const chords = b.chords.map(parse).filter(Boolean);

  const wrap = el(`<div class="panel">
    <div class="panel-head">
      <div class="panel-title">${b.chords.join('  →  ')}</div>
      <button class="btn sm play">▶ Listen</button>
    </div>
    <div class="seq-track">${chords.map((c, i) =>
      `<div class="seq-note" data-i="${i}">${escapeHtml(c.label)}${
        b.numerals && b.numerals[i] ? `<br><span class="muted" style="font-size:11px">${b.numerals[i]}</span>` : ''}</div>`).join('')}</div>
    <div class="kb-frame mt"><div class="kb-host"></div></div>
    ${b.caption ? `<div class="kb-caption">${escapeHtml(b.caption)}</div>` : ''}
  </div>`);

  const kb = new Keyboard(wrap.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);
  let timers = [];

  wrap.querySelector('.play').onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const cells = wrap.querySelectorAll('.seq-note');
    const dur = b.arpeggiate ? 1.5 : 1.2;
    chords.forEach((c, i) => {
      timers.push(setTimeout(() => {
        cells.forEach((x) => x.classList.remove('now'));
        cells[i].classList.add('now');
        const notes = chordMidi(c.pc, c.type, 3 + (c.pc > 6 ? 0 : 1));
        kb.highlight('target', notes);
        instrument.play(notes, { gap: b.arpeggiate ? 0.22 : 0, duration: dur * 0.85 });
      }, i * dur * 1000));
    });
    timers.push(setTimeout(() => {
      wrap.querySelectorAll('.seq-note').forEach((x) => x.classList.remove('now'));
      kb.highlight('target', []);
    }, chords.length * dur * 1000));
  };
  return { node: wrap, teardown: () => { timers.forEach(clearTimeout); off(); } };
};

renderers.try = (b) => {
  if (store.get('lessonMode') === 'reader') {
    const answer = b.mode === 'free' ? `At least ${b.minNotes || 3} notes of your choosing`
      : b.mode === 'interval' ? `Two notes ${b.expectSemitones} semitones apart`
      : expectedNotesText(b);
    const wrap = el(`<div class="try-block reader-only">
      <div class="try-prompt">${b.prompt}</div>
      <div class="try-status">Reader Mode — the notes: ${escapeHtml(answer)}</div>
      ${b.hint ? `<div class="small muted mt">Hint: ${escapeHtml(b.hint)}</div>` : ''}
    </div>`);
    return { node: wrap };
  }

  const wrap = el(`<div class="try-block">
    <div class="try-prompt">${b.prompt}</div>
    <div class="try-status">Play it on your MIDI keyboard, the dock keyboard, or your computer keys.</div>
    ${b.hint ? `<div class="small muted mt">Hint: ${escapeHtml(b.hint)}</div>` : ''}
  </div>`);
  const status = wrap.querySelector('.try-status');

  const solved = () => {
    wrap.classList.add('solved');
    status.textContent = '✓ Correct';
    status.classList.add('good');
  };

  let offs = [];

  if (b.mode === 'free') {
    let count = 0;
    offs.push(midiHub.on('noteon', () => {
      if (++count >= (b.minNotes || 3)) solved();
    }));

  } else if (b.mode === 'interval') {
    // Grade the DISTANCE between two consecutive notes, not the notes themselves.
    let last = null;
    offs.push(midiHub.on('noteon', ({ midi }) => {
      if (last !== null && Math.abs(midi - last) === b.expectSemitones) solved();
      last = midi;
    }));

  } else if (b.mode === 'chord') {
    const want = toMidiList(b.expect);
    offs.push(midiHub.on('noteon', ({ held }) => {
      if (held.length < want.length) return;
      const ok = b.byPitchClass ? samePcSet(held, want)
        : held.length === want.length && want.every((n) => held.includes(n));
      if (ok) solved();
    }));

  } else { // sequence
    const want = toMidiList(b.expect);
    let i = 0;
    offs.push(midiHub.on('noteon', ({ midi }) => {
      const match = b.byPitchClass ? (midi % 12) === (want[i] % 12) : midi === want[i];
      if (match) {
        if (++i >= want.length) solved();
        else status.textContent = `${i} of ${want.length} — keep going`;
      } else {
        i = 0;
        status.textContent = 'Not quite — start again from the first note.';
      }
    }));
  }

  return { node: wrap, teardown: () => offs.forEach((f) => f()) };
};

/* ------------------------------------------------------------------ API -- */

export function renderBlocks(host, blocks, ctx) {
  const teardowns = [];
  for (const b of blocks) {
    const fn = renderers[b.type];
    if (!fn) { console.warn('unknown block type:', b.type); continue; }
    try {
      const { node, teardown } = fn(b, ctx);
      if (node) host.append(node);
      if (teardown) teardowns.push(teardown);
    } catch (err) {
      console.error(`block "${b.type}" failed:`, err);
      host.append(el(`<div class="callout warning"><div class="ct">Block error</div>
        <p>${escapeHtml(b.type)}: ${escapeHtml(String(err.message || err))}</p></div>`));
    }
  }
  return () => teardowns.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
}
