/**
 * staff.js — SVG music notation.
 *
 * Scope is deliberately limited to what the course actually teaches: single
 * notes and chords on treble/bass/grand staff, key signatures, accidentals,
 * ledger lines, and basic note values. It is not a full engraving engine.
 *
 * Vertical positioning uses "diatonic steps", not semitones. On a staff, E and
 * E-flat occupy the SAME line — the flat is a separate glyph. So position is a
 * function of letter+octave only, and the accidental is drawn beside it.
 */

import { parseNote, LETTERS } from '../lib/theory.js';

const STEP = 5;              // vertical distance between a line and the next space
const LINE_GAP = STEP * 2;
const STAFF_H = LINE_GAP * 4;

// Clefs as SVG paths so rendering never depends on a music font being present.
const CLEF_PATHS = {
  treble: 'M 12.4 -2.6 c -1.9 1.6 -3.1 3.9 -3.1 6.5 0 3.2 2.1 5.9 5.1 7.1 l 0.6 3.4 c 0.1 0.7 0.2 1.4 0.2 2 0 3.1 -2.2 5.3 -5.1 5.3 -2.4 0 -4.4 -1.5 -4.4 -3.5 0 -0.4 0.1 -0.8 0.2 -1.1 0.4 0.3 0.9 0.5 1.5 0.5 1.5 0 2.7 -1.2 2.7 -2.7 0 -1.5 -1.2 -2.7 -2.8 -2.7 -1.9 0 -3.4 1.6 -3.4 3.8 0 3.2 2.8 5.7 6.4 5.7 4 0 6.8 -3 6.8 -7.1 0 -0.8 -0.1 -1.6 -0.2 -2.4 l -0.5 -3 c 0.4 0.1 0.9 0.1 1.3 0.1 4 0 7 -3 7 -7 0 -3.6 -2.5 -6.4 -6 -6.9 l -0.9 -5.3 c -0.1 -0.8 -0.2 -1.6 -0.2 -2.3 0 -2.9 1 -5.1 2.3 -6.6 1.4 1.7 2.3 3.9 2.3 6.1 0 2.9 -1.4 5.4 -3.6 7.3 z m 1.9 11.1 l -1.4 -8.2 c -1.7 1 -2.8 2.8 -2.8 4.9 0 1.6 0.8 2.8 2 3.5 z m 2.1 -8.5 l 1.4 8.3 c 2.2 -0.6 3.7 -2.5 3.7 -4.8 0 -2 -1.5 -3.6 -3.6 -3.7 z M 15.2 -9.4 c -1.7 1.9 -2.7 4.4 -2.7 6.9 0 0.7 0.1 1.5 0.2 2.2 l 0.4 2.2 c 2.6 -1.8 4.4 -4.2 4.4 -7 0 -1.7 -0.8 -3.2 -2.3 -4.3 z',
  bass: 'M 3 -8 c 4.6 0 8.4 2.6 8.4 7.4 0 6.4 -6.2 11.2 -11.6 14.1 -0.4 0.2 -0.8 -0.4 -0.4 -0.7 4.2 -2.8 8.2 -6.6 8.2 -11.9 0 -3.6 -1.8 -6.1 -4.6 -6.1 -2.1 0 -3.7 1.4 -3.7 3.2 0 1.7 1.3 2.9 2.9 2.9 1.5 0 2.7 -1.2 2.7 -2.6 0 -0.3 0 -0.5 -0.1 -0.8 0.6 0.5 1 1.3 1 2.3 0 2.1 -1.8 3.8 -4.2 3.8 -2.7 0 -4.8 -2.1 -4.8 -5 0 -3.7 3 -6.6 6.2 -6.6 z M 14.6 -4.6 a 1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0 -3 z M 14.6 1.4 a 1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0 -3 z',
};

const ACCIDENTALS = { 1: '♯', '-1': '♭', 2: '𝄪', '-2': '𝄫', 0: '' };

/** Diatonic index: how many letter-steps a note sits above C0. */
function diatonicIndex(letter, octave) {
  return octave * 7 + LETTERS.indexOf(letter);
}

/**
 * Reference points. On treble, B4 sits on the middle line. On bass, D3 does.
 * Everything else is measured in diatonic steps from there.
 */
const CLEF_REF = {
  treble: { letter: 'B', octave: 4 },
  bass: { letter: 'D', octave: 3 },
};

export class Staff {
  /**
   * @param {HTMLElement} host
   * @param {object} opts  clef: 'treble'|'bass'|'grand', width, keySignature
   */
  constructor(host, opts = {}) {
    this.host = host;
    this.clef = opts.clef || 'treble';
    this.keySignature = opts.keySignature || null;   // e.g. { sharps: 2 }
    this.showLabels = opts.showLabels || false;
    this.items = [];
    this.render();
  }

  setClef(c) { this.clef = c; this.render(); }
  setKeySignature(k) { this.keySignature = k; this.render(); }

  /** @param items array of { notes: ['C4','E4'], duration: 'q', label, state } */
  setNotes(items) { this.items = items || []; this.render(); }

  _yFor(noteName, octave, clef) {
    const n = parseNote(noteName);
    if (!n) return 0;
    const ref = CLEF_REF[clef];
    const steps = diatonicIndex(n.letter, octave) - diatonicIndex(ref.letter, ref.octave);
    // Middle line is y=0 in staff-local coordinates; higher pitch = smaller y.
    return -steps * STEP;
  }

  render() {
    const staves = this.clef === 'grand' ? ['treble', 'bass'] : [this.clef];
    const padTop = 46;
    const staffSpacing = 74;
    const height = padTop + (staves.length - 1) * staffSpacing + STAFF_H + 46;

    const keyAcc = this.keySignature ? Math.abs(this.keySignature.sharps || 0) : 0;
    const startX = 46 + keyAcc * 8 + 14;
    const spacing = 52;
    const width = Math.max(320, startX + Math.max(this.items.length, 3) * spacing + 30);

    let svg = `<svg class="staff-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Music staff">`;

    staves.forEach((clef, si) => {
      const top = padTop + si * staffSpacing;
      svg += `<g transform="translate(0 ${top + LINE_GAP * 2})">`;

      // Five lines
      for (let i = -2; i <= 2; i++) {
        svg += `<line class="staff-line" x1="8" y1="${i * LINE_GAP}" x2="${width - 12}" y2="${i * LINE_GAP}"/>`;
      }
      svg += `<line class="staff-bar" x1="8" y1="${-2 * LINE_GAP}" x2="8" y2="${2 * LINE_GAP}"/>`;
      svg += `<line class="staff-bar" x1="${width - 12}" y1="${-2 * LINE_GAP}" x2="${width - 12}" y2="${2 * LINE_GAP}"/>`;

      // Clef
      const scale = clef === 'treble' ? 1.0 : 1.15;
      const cy = clef === 'treble' ? 0 : -LINE_GAP;
      svg += `<path class="clef" d="${CLEF_PATHS[clef]}" transform="translate(16 ${cy}) scale(${scale})"/>`;

      svg += this._keySignatureSvg(clef);
      svg += this._notesSvg(clef, startX, spacing);
      svg += '</g>';
    });

    if (this.clef === 'grand') {
      const t = padTop + LINE_GAP * 2 - 2 * LINE_GAP;
      const b = padTop + staffSpacing + LINE_GAP * 2 + 2 * LINE_GAP;
      svg += `<line class="staff-brace" x1="8" y1="${t}" x2="8" y2="${b}"/>`;
    }

    svg += '</svg>';
    this.host.innerHTML = svg;
  }

  _keySignatureSvg(clef) {
    if (!this.keySignature || !this.keySignature.sharps) return '';
    const n = this.keySignature.sharps;
    const sharp = n > 0;
    // Standard staff positions for accidentals, in diatonic steps from the
    // middle line, for the treble clef. Bass clef is one step lower.
    const SHARP_POS = [4, 1, 5, 2, -1, 3, 0];
    const FLAT_POS = [0, 3, -1, 2, -2, 1, -3];
    const pos = sharp ? SHARP_POS : FLAT_POS;
    const shift = clef === 'bass' ? -1 : 0;
    const glyph = sharp ? '♯' : '♭';

    let out = '';
    for (let i = 0; i < Math.abs(n); i++) {
      const y = -(pos[i] + shift) * STEP;
      out += `<text class="key-acc" x="${40 + i * 8}" y="${(y + 3.2).toFixed(2)}">${glyph}</text>`;
    }
    return out;
  }

  _notesSvg(clef, startX, spacing) {
    let out = '';

    this.items.forEach((item, idx) => {
      const x = startX + idx * spacing;
      const notes = (item.notes || []).filter((raw) => {
        // On a grand staff, route each note to the clef it belongs in.
        if (this.clef !== 'grand') return true;
        const oct = parseInt(String(raw).match(/(-?\d+)$/)?.[1] ?? '4', 10);
        return clef === 'treble' ? oct >= 4 : oct < 4;
      });
      if (!notes.length) return;

      const state = item.state ? ` note-${item.state}` : '';
      const ys = [];

      for (const raw of notes) {
        const m = /^([A-Ga-g][#b♯♭]*)(-?\d+)$/.exec(String(raw).trim());
        if (!m) continue;
        const [, name, octStr] = m;
        const octave = parseInt(octStr, 10);
        const y = this._yFor(name, octave, clef);
        ys.push(y);

        const parsed = parseNote(name);
        const acc = ACCIDENTALS[String(parsed.alter)] || '';
        if (acc) {
          out += `<text class="note-acc${state}" x="${x - 13}" y="${(y + 3.2).toFixed(2)}">${acc}</text>`;
        }

        // Ledger lines above and below the five-line staff.
        for (let ly = -3; ly >= Math.round(y / LINE_GAP) - 0.0001; ly--) {
          if (y <= ly * LINE_GAP + 0.01) {
            out += `<line class="ledger" x1="${x - 9}" y1="${ly * LINE_GAP}" x2="${x + 9}" y2="${ly * LINE_GAP}"/>`;
          }
        }
        for (let ly = 3; ly <= Math.round(y / LINE_GAP) + 0.0001; ly++) {
          if (y >= ly * LINE_GAP - 0.01) {
            out += `<line class="ledger" x1="${x - 9}" y1="${ly * LINE_GAP}" x2="${x + 9}" y2="${ly * LINE_GAP}"/>`;
          }
        }

        const hollow = ['w', 'h'].includes(item.duration);
        out += `<ellipse class="notehead${state}${hollow ? ' hollow' : ''}" `
          + `cx="${x}" cy="${y.toFixed(2)}" rx="6.2" ry="4.5" transform="rotate(-18 ${x} ${y.toFixed(2)})"/>`;

        if (this.showLabels || item.label) {
          out += `<text class="note-name" x="${x}" y="${(y - 12).toFixed(2)}">${item.label || name}</text>`;
        }
      }

      // One stem per chord, direction chosen by the note furthest from center.
      if (item.duration !== 'w' && ys.length) {
        const top = Math.min(...ys), bottom = Math.max(...ys);
        const up = (top + bottom) / 2 > 0;
        const sx = up ? x + 6 : x - 6;
        const y1 = up ? bottom : top;
        const y2 = up ? top - 26 : bottom + 26;
        out += `<line class="stem${state}" x1="${sx}" y1="${y1.toFixed(2)}" x2="${sx}" y2="${y2.toFixed(2)}"/>`;

        if (item.duration === 'e' || item.duration === 's') {
          out += `<path class="flag${state}" d="M ${sx} ${y2.toFixed(2)} q 9 5 7 15 q -1 -8 -7 -10 z"/>`;
          if (item.duration === 's') {
            out += `<path class="flag${state}" d="M ${sx} ${(y2 + 8).toFixed(2)} q 9 5 7 15 q -1 -8 -7 -10 z"/>`;
          }
        }
      }
    });

    return out;
  }
}
