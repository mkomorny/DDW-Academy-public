/**
 * keyboard.js — the on-screen piano.
 *
 * Rendered as inline SVG so keys stay crisp at any size and each key is a real
 * DOM node we can address by MIDI number for highlighting.
 *
 * Layout note: black keys are NOT evenly spaced on a real piano. Each sits
 * offset from the boundary between its two white neighbors, and the offsets
 * differ between the C-D-E group and the F-G-A-B group. Using naive even
 * spacing is the single most common giveaway of a fake piano graphic.
 */

import { isBlackKey, fromMidi, SHARP_NAMES, FLAT_NAMES } from '../lib/theory.js';
import { instrument } from '../lib/audio.js';
import { instrumentById } from '../lib/instruments.js';

const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];

// Horizontal nudge for each black key, as a fraction of white-key width,
// measured from the boundary with the white key below it.
const BLACK_OFFSET = { 1: -0.09, 3: 0.09, 6: -0.11, 8: 0.0, 10: 0.11 };

export class Keyboard {
  /**
   * @param {HTMLElement} host
   * @param {object} opts
   *   lowMidi/highMidi  range to draw (defaults to a 3-octave view from C3)
   *   onNoteOn/onNoteOff  pointer interaction callbacks
   *   showLabels  'none' | 'c' | 'all'
   */
  constructor(host, opts = {}) {
    this.host = host;
    this.low = opts.lowMidi ?? 48;
    this.high = opts.highMidi ?? 84;
    this.onNoteOn = opts.onNoteOn || (() => {});
    this.onNoteOff = opts.onNoteOff || (() => {});
    this.showLabels = opts.showLabels || 'c';
    this.preferFlats = opts.preferFlats || false;
    this.keyEls = new Map();
    this._pointerDown = false;
    this._pointerNote = null;
    this.render();
  }

  setRange(low, high) {
    this.low = low; this.high = high;
    this.render();
  }

  render() {
    const whites = [];
    for (let m = this.low; m <= this.high; m++) if (!isBlackKey(m)) whites.push(m);

    const W = 100 / whites.length;          // white-key width, in viewBox units
    const H = 100;
    const bw = W * 0.62;                    // black-key width
    const bh = H * 0.62;

    const whiteIndex = new Map(whites.map((m, i) => [m, i]));

    // Range dimming for the active instrument: keys outside its sampled
    // range are still playable (folded an octave in) or, for a non-folding
    // bank, genuinely dead. Marked with a data-attribute rather than a CSS
    // class, deliberately — clearHighlights() below resets each key's whole
    // className for its highlight layers, and a data-attribute survives that.
    const range = instrument.playableRange();
    const activeName = instrumentById(instrument.currentInstrument()).name;
    const rangeInfo = (m) => {
      if (m >= range.lo && m <= range.hi) return { attr: '', title: '' };
      if (range.fold) {
        return {
          attr: ' data-range="folded"',
          title: `<title>Outside the ${activeName}&#8217;s range — sounds an octave in</title>`,
        };
      }
      return { attr: ' data-range="mute"', title: `<title>Outside the ${activeName}&#8217;s range</title>` };
    };

    let whiteSvg = '';
    let blackSvg = '';

    for (let m = this.low; m <= this.high; m++) {
      const pc = ((m % 12) + 12) % 12;
      const { attr, title } = rangeInfo(m);
      if (!isBlackKey(m)) {
        const x = whiteIndex.get(m) * W;
        whiteSvg += `<rect class="key key-white" data-midi="${m}"${attr} x="${x.toFixed(3)}" y="0" `
          + `width="${(W * 0.985).toFixed(3)}" height="${H}" rx="${(W * 0.10).toFixed(3)}">${title}</rect>`;

        if (this.showLabels === 'all' || (this.showLabels === 'c' && pc === 0)) {
          const info = fromMidi(m, this.preferFlats);
          const label = pc === 0 ? `C${info.octave}` : info.name;
          whiteSvg += `<text class="key-label" x="${(x + W / 2).toFixed(3)}" y="${H - 4}" `
            + `font-size="${(W * 0.38).toFixed(2)}">${label}</text>`;
        }
      } else {
        // Anchor to the white key immediately below, then nudge.
        const below = m - 1;
        const bi = whiteIndex.get(below);
        if (bi === undefined) continue;
        const x = (bi + 1) * W - bw / 2 + BLACK_OFFSET[pc] * W;
        blackSvg += `<rect class="key key-black" data-midi="${m}"${attr} x="${x.toFixed(3)}" y="0" `
          + `width="${bw.toFixed(3)}" height="${bh.toFixed(3)}" rx="${(bw * 0.14).toFixed(3)}">${title}</rect>`;
      }
    }

    this.host.innerHTML =
      `<svg class="keyboard-svg" viewBox="0 0 100 ${H}" preserveAspectRatio="none" role="group" aria-label="Piano keyboard">`
      + `<g class="whites">${whiteSvg}</g><g class="blacks">${blackSvg}</g></svg>`;

    this.svg = this.host.querySelector('svg');
    this.keyEls.clear();
    for (const el of this.svg.querySelectorAll('[data-midi]')) {
      this.keyEls.set(Number(el.dataset.midi), el);
    }
    this._bindPointer();
  }

  _bindPointer() {
    const noteAt = (evt) => {
      const el = document.elementFromPoint(evt.clientX, evt.clientY);
      return el && el.dataset && el.dataset.midi ? Number(el.dataset.midi) : null;
    };

    this.svg.addEventListener('pointerdown', (e) => {
      const m = noteAt(e);
      if (m === null) return;
      this._pointerDown = true;
      this._pointerNote = m;
      this.svg.setPointerCapture(e.pointerId);
      this.onNoteOn(m);
    });

    // Dragging across the keyboard glissandos, which is how a real one behaves.
    this.svg.addEventListener('pointermove', (e) => {
      if (!this._pointerDown) return;
      const m = noteAt(e);
      if (m === null || m === this._pointerNote) return;
      if (this._pointerNote !== null) this.onNoteOff(this._pointerNote);
      this._pointerNote = m;
      this.onNoteOn(m);
    });

    const release = () => {
      if (!this._pointerDown) return;
      this._pointerDown = false;
      if (this._pointerNote !== null) this.onNoteOff(this._pointerNote);
      this._pointerNote = null;
    };
    this.svg.addEventListener('pointerup', release);
    this.svg.addEventListener('pointercancel', release);
    this.svg.addEventListener('pointerleave', release);
  }

  /* ----------------------------------------------------------- highlighting */

  /** Mark a key as physically held down. */
  setHeld(midi, on) {
    this.keyEls.get(midi)?.classList.toggle('is-held', on);
  }

  /**
   * Apply a named highlight layer. Layers are independent, so a drill can show
   * the target scale ('target'), the note you're being asked for ('cue'), and
   * your mistakes ('wrong') at the same time without them clobbering each other.
   */
  highlight(layer, midiNotes, { byPitchClass = false } = {}) {
    const cls = `hl-${layer}`;
    for (const el of this.keyEls.values()) el.classList.remove(cls);
    if (!midiNotes || !midiNotes.length) return;

    if (byPitchClass) {
      const pcs = new Set(midiNotes.map((m) => ((m % 12) + 12) % 12));
      for (const [midi, el] of this.keyEls) {
        if (pcs.has(((midi % 12) + 12) % 12)) el.classList.add(cls);
      }
    } else {
      for (const m of midiNotes) this.keyEls.get(m)?.classList.add(cls);
    }
  }

  clearHighlights() {
    for (const el of this.keyEls.values()) {
      el.className.baseVal = el.classList.contains('key-black') ? 'key key-black' : 'key key-white';
    }
  }

  /** Small finger-number badges above the keys, for scale fingering display. */
  showFingering(midiNotes, fingers, hand = 'rh') {
    this.svg.querySelectorAll('.finger-badge').forEach((n) => n.remove());
    if (!fingers || !fingers.length) return;
    const ns = 'http://www.w3.org/2000/svg';

    midiNotes.forEach((m, i) => {
      const el = this.keyEls.get(m);
      const finger = fingers[i];
      if (!el || finger === undefined) return;

      const x = parseFloat(el.getAttribute('x')) + parseFloat(el.getAttribute('width')) / 2;
      const black = el.classList.contains('key-black');
      const y = black ? 20 : 78;

      const g = document.createElementNS(ns, 'g');
      g.setAttribute('class', `finger-badge finger-${hand}`);
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 3.1);
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y + 1.1);
      t.setAttribute('font-size', '3.4');
      t.textContent = finger;
      g.append(c, t);
      this.svg.append(g);
    });
  }

  clearFingering() {
    this.svg.querySelectorAll('.finger-badge').forEach((n) => n.remove());
  }
}

/** Wire a Keyboard to the MIDI hub and the synth in one call. */
export function connectKeyboard(kb, hub, instrument) {
  const offOn = hub.on('noteon', ({ midi, velocity }) => {
    kb.setHeld(midi, true);
    instrument.noteOn(midi, velocity);
  });
  const offOff = hub.on('noteoff', ({ midi }) => {
    kb.setHeld(midi, false);
    instrument.noteOff(midi);
  });
  kb.onNoteOn = (m) => hub.noteOn(m, 112, { source: 'screen' });
  kb.onNoteOff = (m) => hub.noteOff(m, { source: 'screen' });
  return () => { offOn(); offOff(); };
}
