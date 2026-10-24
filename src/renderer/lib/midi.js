/**
 * midi.js — Web MIDI input, normalised into a small event bus.
 *
 * The rest of the app never touches raw MIDI bytes. It subscribes to
 * 'noteon' / 'noteoff' / 'sustain' and receives plain objects. That means every
 * drill works identically whether notes arrive from a hardware keyboard, the
 * on-screen keyboard, or the computer QWERTY row.
 */

const NOTE_OFF = 0x80;
const NOTE_ON = 0x90;
const CONTROL_CHANGE = 0xb0;
const SUSTAIN_CC = 64;

class Emitter {
  constructor() { this._h = new Map(); }
  on(evt, fn) {
    if (!this._h.has(evt)) this._h.set(evt, new Set());
    this._h.get(evt).add(fn);
    return () => this.off(evt, fn);
  }
  off(evt, fn) { this._h.get(evt)?.delete(fn); }
  emit(evt, payload) {
    for (const fn of this._h.get(evt) || []) {
      try { fn(payload); } catch (err) { console.error(`handler for "${evt}" threw:`, err); }
    }
  }
}

export class MidiHub extends Emitter {
  constructor() {
    super();
    this.access = null;
    this.inputs = [];
    this.activeInputId = 'all';
    this.status = 'idle';           // idle | requesting | ready | denied | unsupported
    this.error = null;
    /** MIDI note number -> velocity, for every key currently held down. */
    this.held = new Map();
    this.sustain = false;
  }

  get supported() { return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator; }

  async connect() {
    if (!this.supported) {
      this.status = 'unsupported';
      this.emit('status', this.snapshot());
      return false;
    }
    this.status = 'requesting';
    this.emit('status', this.snapshot());

    try {
      // sysex:false — the course never needs it, and asking for it makes the
      // permission grant stricter than necessary.
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.access.onstatechange = () => this._refresh();
      this._refresh();
      this.status = 'ready';
      this.error = null;
    } catch (err) {
      this.status = 'denied';
      this.error = String(err && err.message ? err.message : err);
    }
    this.emit('status', this.snapshot());
    return this.status === 'ready';
  }

  _refresh() {
    if (!this.access) return;
    this.inputs = [...this.access.inputs.values()];
    for (const input of this.inputs) {
      // Reassigning onmidimessage is idempotent — no listener pile-up when a
      // device is unplugged and replugged.
      input.onmidimessage = (e) => this._onMessage(e, input);
    }
    this.emit('devices', this.inputs.map((i) => ({
      id: i.id, name: i.name, manufacturer: i.manufacturer, state: i.state,
    })));
    this.emit('status', this.snapshot());
  }

  _onMessage(e, input) {
    if (this.activeInputId !== 'all' && input.id !== this.activeInputId) return;

    const [statusByte, data1, data2] = e.data;
    const command = statusByte & 0xf0;
    const channel = statusByte & 0x0f;

    if (command === NOTE_ON && data2 > 0) {
      this.noteOn(data1, data2, { source: 'midi', device: input.name, channel });
    } else if (command === NOTE_OFF || (command === NOTE_ON && data2 === 0)) {
      // Running status: many keyboards send note-on with velocity 0 for release.
      this.noteOff(data1, { source: 'midi', device: input.name, channel });
    } else if (command === CONTROL_CHANGE && data1 === SUSTAIN_CC) {
      this.sustain = data2 >= 64;
      this.emit('sustain', { down: this.sustain });
    }
  }

  /** Public entry point — also used by the on-screen and QWERTY keyboards. */
  noteOn(midi, velocity = 100, meta = {}) {
    this.held.set(midi, velocity);
    this.emit('noteon', { midi, velocity, held: [...this.held.keys()], ...meta });
  }

  noteOff(midi, meta = {}) {
    if (!this.held.has(midi)) return;
    this.held.delete(midi);
    this.emit('noteoff', { midi, held: [...this.held.keys()], ...meta });
  }

  /** Release everything — used when a drill resets or a view is torn down. */
  panic() {
    for (const midi of [...this.held.keys()]) this.noteOff(midi, { source: 'panic' });
    this.held.clear();
    this.sustain = false;
  }

  selectInput(id) {
    this.activeInputId = id;
    this.emit('status', this.snapshot());
  }

  snapshot() {
    return {
      status: this.status,
      error: this.error,
      supported: this.supported,
      activeInputId: this.activeInputId,
      devices: this.inputs.map((i) => ({ id: i.id, name: i.name, state: i.state })),
    };
  }
}

/* ------------------------------------------------- QWERTY fallback keyboard */

/**
 * Two rows of the computer keyboard mapped like a piano, so the whole course
 * is playable on a laptop with no hardware attached.
 *   Z S X D C V G B H N J M  -> lower octave (C3 up)
 *   Q 2 W 3 E R 5 T 6 Y 7 U  -> upper octave (C4 up)
 */
const QWERTY_MAP = {
  KeyZ: 0, KeyS: 1, KeyX: 2, KeyD: 3, KeyC: 4, KeyV: 5, KeyG: 6,
  KeyB: 7, KeyH: 8, KeyN: 9, KeyJ: 10, KeyM: 11, Comma: 12,
  KeyQ: 12, Digit2: 13, KeyW: 14, Digit3: 15, KeyE: 16, KeyR: 17,
  Digit5: 18, KeyT: 19, Digit6: 20, KeyY: 21, Digit7: 22, KeyU: 23, KeyI: 24,
};

export function attachQwerty(hub, getBaseOctave = () => 3) {
  const down = new Set();

  const onDown = (e) => {
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
    // Never swallow typing in a text field.
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

    const offset = QWERTY_MAP[e.code];
    if (offset === undefined) return;
    const midi = (getBaseOctave() + 1) * 12 + offset;
    if (down.has(e.code)) return;
    down.add(e.code);
    e.preventDefault();
    hub.noteOn(midi, 90, { source: 'qwerty' });
  };

  const onUp = (e) => {
    const offset = QWERTY_MAP[e.code];
    if (offset === undefined || !down.has(e.code)) return;
    down.delete(e.code);
    hub.noteOff((getBaseOctave() + 1) * 12 + offset, { source: 'qwerty' });
  };

  // If the window loses focus mid-keypress the keyup never arrives, which
  // would leave a note stuck on forever.
  const onBlur = () => { down.clear(); hub.panic(); };

  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  window.addEventListener('blur', onBlur);

  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
    window.removeEventListener('blur', onBlur);
  };
}

export const midiHub = new MidiHub();
