/**
 * audio.js — sampled multi-instrument engine + metronome.
 *
 * Plays back one or more sample "banks" (Grand Piano plus ~19 orchestral/
 * guitar/keyboard banks from tonejs-instruments — see instruments.js for the
 * manifest and CREDITS.md for licensing). Every bank shares the same
 * pitch-shift-between-recorded-roots approach: find the nearest sampled
 * root, resample via playbackRate, refuse (or, since folding, fold) stretches
 * too big to sound natural.
 *
 * Grand Piano uses Salamander Grand Piano V3 (Yamaha C5) OGG samples by
 * Alexander Holm (CC-BY-3.0), multi-velocity, every minor third.
 */

import {
  instrumentById, instrumentGroups, fileFor,
  DEFAULT_INSTRUMENT, REFERENCE_INSTRUMENT,
} from './instruments.js';
import { DrumKit } from './drums.js';

export { instrumentGroups, DEFAULT_INSTRUMENT, REFERENCE_INSTRUMENT };

/** Pick soft / medium / loud layer from MIDI velocity 0–127 (Salamander piano only). */
function pickLayer(def, velocity) {
  if (!def.layers) return null;
  const v = Math.max(1, Math.min(127, velocity | 0));
  if (v < 48) return def.layers[0];
  if (v < 92) return def.layers[1];
  return def.layers[2];
}

/**
 * Within a layer, scale amplitude slightly so dynamics aren't stair-stepped.
 * Layered (Salamander) samples already encode strike tone; this only trims
 * level a little. Single-layer banks (everything else) have no recorded
 * dynamics at all, so velocity has to do the full job there instead — the
 * 'curve' branch is a plain velocity -> gain curve, not a small trim.
 */
function dynamicsGain(def, velocity, layer) {
  const v = Math.max(1, Math.min(127, velocity | 0));
  if (def.velocity === 'layers') {
    if (layer === def.layers[0]) return 0.7 + (v / 48) * 0.3;             // ~0.70–1.00
    if (layer === def.layers[1]) return 0.85 + ((v - 48) / 44) * 0.2;     // ~0.85–1.05
    return 0.95 + ((v - 92) / 35) * 0.2;                                   // ~0.95–1.15
  }
  return 0.25 + 0.75 * Math.pow(v / 127, 1.4);
}

function nearestRoot(def, midi) {
  let best = def.roots[0];
  let bestDist = Math.abs(midi - best.midi);
  for (let i = 1; i < def.roots.length; i++) {
    const d = Math.abs(midi - def.roots[i].midi);
    if (d < bestDist) { best = def.roots[i]; bestDist = d; }
  }
  return best;
}

/**
 * Fold a MIDI note into an instrument's playable range by whole octaves,
 * preserving pitch class — a low C on the dock keyboard still sounds a C on
 * the xylophone, just three octaves up, rather than doing nothing. This
 * only ever runs inside playback: every grading path in the app reads MIDI
 * held-note state, never the audio layer, so folding can't affect an
 * answer check — please don't move it upstream of that.
 */
function mapToRange(midi, def) {
  if (!def.fold) return midi;
  let m = midi;
  while (m < def.range.lo) m += 12;
  while (m > def.range.hi) m -= 12;
  return m;
}

// Salamander WAVs/OGGs are recorded with lots of headroom so peaks never
// clip in a DAW. Played raw in a browser they sound whisper-quiet. This
// fixed make-up (before the safety limiter) is what makes one note fill
// the room without turning the samples into grainy digital hash. It is
// GLOBAL, not per-instrument — the per-instrument trim lives on `bankGain`
// (see ensure()) and is calibrated relative to this.
const SAMPLE_MAKEUP = 12.0;

function sampleUrl(folder, filename) {
  // '#' in D#/F# filenames must be percent-encoded for fetch/file URLs.
  return new URL(
    `../samples/${folder}/${filename.replace(/#/g, '%23')}`,
    import.meta.url,
  ).href;
}

/** One instrument's decoded samples, loaded lazily and independently of the others. */
class SampleBank {
  constructor(def) {
    this.def = def;
    this.buffers = new Map();    // "rootName|layer" -> AudioBuffer ('_' layer key for single-layer banks)
    this.ready = false;
    this.failed = false;
    this.lastUsed = 0;
    this._loadPromise = null;
  }

  load(ctx) {
    if (this._loadPromise) return this._loadPromise;
    const def = this.def;
    this._loadPromise = (async () => {
      const layers = def.layers || [null];
      const jobs = [];
      for (const root of def.roots) {
        for (const layer of layers) {
          const id = `${root.name}|${layer ?? '_'}`;
          const file = fileFor(def, root.name, layer);
          jobs.push(
            fetch(sampleUrl(def.folder, file))
              .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status} for ${file}`);
                return r.arrayBuffer();
              })
              .then((ab) => ctx.decodeAudioData(ab.slice(0)))
              .then((buf) => { this.buffers.set(id, buf); })
              .catch((err) => console.warn(`missing ${def.id} sample`, file, err)),
          );
        }
      }
      await Promise.all(jobs);
      this.ready = this.buffers.size > 0;
      if (!this.ready) this.failed = true;
      return this.ready;
    })();
    return this._loadPromise;
  }

  bufferFor(rootName, layer) {
    let buf = this.buffers.get(`${rootName}|${layer ?? '_'}`);
    if (!buf && this.def.layers) {
      // Fall back across layers if one file failed to decode.
      for (const L of this.def.layers) {
        buf = this.buffers.get(`${rootName}|${L}`);
        if (buf) break;
      }
    }
    return buf;
  }

  /** Drop decoded audio so it can be garbage-collected. Safe even mid-use;
   *  callers are responsible for not evicting a bank with live voices. */
  free() {
    this.buffers.clear();
    this.ready = false;
    this._loadPromise = null;
  }
}

const MAX_RESIDENT_BANKS = 3;      // piano + current + one previous, so A/B-ing never re-decodes
const PENDING_MAX_AGE_MS = 1500;   // don't ghost-replay a key press this long after it happened

export class Instrument {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.voices = new Map();        // midi -> active voice
    this.enabled = true;
    this.banks = new Map();         // instrument id -> SampleBank
    this.currentId = DEFAULT_INSTRUMENT;
    this._switchToken = 0;
    this._pending = new Map();      // midi -> { velocity, bankId, at }
    this._listeners = new Set();
    this._failed = false;
  }

  /** Notified after a successful setInstrument() (id passed as the argument). */
  onChange(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
  _emit() { for (const fn of this._listeners) { try { fn(this.currentId); } catch (e) { console.error(e); } } }



  /** Lazily create the AudioContext — browsers require a user gesture first. */
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();

      // Master bus (fixed gain now that user volume is removed).
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;

      // Fixed make-up for quiet multi-sample libraries.
      this.drive = this.ctx.createGain();
      this.drive.gain.value = SAMPLE_MAKEUP;

      // Safety brick-wall only — catches big chords after make-up so the
      // DAC never hard-clips (hard clip = grainy). Single notes stay punchy.
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -1.5;
      this.limiter.knee.value = 3;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.001;
      this.limiter.release.value = 0.12;

      this.output = this.ctx.createGain();
      this.output.gain.value = 0.98;

      // Per-instrument trim, calibrated relative to the piano (see
      // instruments.js). Sits BELOW master and ABOVE drive/limiter, so the
      // metronome — which taps `master` directly in _click() — is
      // completely unaffected by whichever instrument is selected.
      this.bankGain = this.ctx.createGain();
      this.bankGain.gain.value = instrumentById(this.currentId).gain;

      this.bankGain.connect(this.master);
      this.master.connect(this.drive);
      this.drive.connect(this.limiter);
      this.limiter.connect(this.output);
      this.output.connect(this.ctx.destination);

      // Kick off sample decode as soon as audio is allowed: the active
      // instrument, and — if different — the piano, since it's the pinned
      // fallback for a bank that's still loading and the forced instrument
      // for ear-training/rhythm.
      this.load(this.currentId).catch((err) => {
        console.error(`${this.currentId} sample load failed:`, err);
        this._failed = true;
      });
      if (this.currentId !== DEFAULT_INSTRUMENT) this.load(DEFAULT_INSTRUMENT).catch(() => {});
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  /**
   * Set the starting instrument before the AudioContext exists — e.g.
   * restoring a saved preference at boot, before the first user gesture.
   * Does not load anything; ensure()/load() pick it up naturally once
   * called. Calling this after ensure() has already run would desync
   * bankGain from currentId, so it's a no-op then — use setInstrument().
   */
  presetInstrument(id) {
    if (this.ctx) {
      console.warn('presetInstrument() called after ensure() — use setInstrument() instead');
      return;
    }
    this.currentId = instrumentById(id).id;
  }

  bank(id) {
    let b = this.banks.get(id);
    if (!b) { b = new SampleBank(instrumentById(id)); this.banks.set(id, b); }
    return b;
  }

  /**
   * Decode one instrument's samples. Safe to call multiple times per bank;
   * returns the same promise. Call from app startup after the first user
   * gesture if you want zero lag on the first key.
   */
  load(id = this.currentId) {
    this.ensure();
    return this.bank(id).load(this.ctx);
  }

  /** Alias used by the app shell — loads the piano and the current pick. */
  warmup() {
    return Promise.all([this.load(DEFAULT_INSTRUMENT), this.load(this.currentId)]);
  }

  get ready() { return this.bank(this.currentId).ready; }

  currentInstrument() { return this.currentId; }

  /** { lo, hi, fold } for an instrument (current, by default). */
  playableRange(id = this.currentId) {
    const def = instrumentById(id);
    return { lo: def.range.lo, hi: def.range.hi, fold: def.fold };
  }

  /**
   * Switch the active instrument. Resolves true once the bank is playable,
   * false if it failed to load (in which case the previous instrument stays
   * active). Keys pressed while this is in flight keep sounding on the
   * piano — see noteOn()'s "not ready yet" branch — so the keyboard never
   * goes silent mid-switch.
   */
  async setInstrument(id) {
    const def = instrumentById(id);
    const targetId = def.id;
    if (targetId === this.currentId) return true;

    this.allOff();
    const token = ++this._switchToken;
    const prevId = this.currentId;
    this.ensure();
    const bank = this.bank(targetId);
    bank.lastUsed = Date.now();

    let ok;
    try {
      ok = await bank.load(this.ctx);
    } catch (err) {
      console.error(`instrument "${targetId}" failed to load:`, err);
      ok = false;
    }

    // A later switch started (and possibly already resolved) while this one
    // was in flight — don't let a slow, stale load stomp on where the user
    // already navigated to.
    if (token !== this._switchToken) return this.currentId === targetId;

    if (!ok) { this.currentId = prevId; return false; }

    this.currentId = targetId;
    const now = this.ctx.currentTime;
    this.bankGain.gain.setTargetAtTime(def.gain, now, 0.01);
    this._evict();
    this._emit();
    return true;
  }

  /** LRU eviction of decoded (not just referenced) banks past MAX_RESIDENT_BANKS. */
  _evict() {
    const residentIds = [...this.banks.entries()].filter(([, b]) => b.ready).map(([id]) => id);
    let over = residentIds.length - MAX_RESIDENT_BANKS;
    if (over <= 0) return;

    const evictable = residentIds
      .filter((id) => id !== this.currentId && id !== DEFAULT_INSTRUMENT && !this._hasLiveVoices(id))
      .sort((a, b) => this.banks.get(a).lastUsed - this.banks.get(b).lastUsed);

    for (const id of evictable) {
      if (over <= 0) break;
      this.banks.get(id).free();
      this.banks.delete(id);
      over--;
    }
  }

  _hasLiveVoices(bankId) {
    for (const v of this.voices.values()) if (v.bankId === bankId) return true;
    return false;
  }

  /** Replay keys held while `bankId` was still decoding. Drops stale/released ones. */
  _flushPending(bankId) {
    const now = Date.now();
    const toPlay = [];
    for (const [midi, p] of [...this._pending.entries()]) {
      if (p.bankId !== bankId) continue;
      this._pending.delete(midi);
      if (now - p.at <= PENDING_MAX_AGE_MS) toPlay.push([midi, p.velocity]);
    }
    for (const [midi, velocity] of toPlay) this.noteOn(midi, velocity, { bank: bankId });
  }



  /** `opts.bank` overrides the selected instrument for this one note — used
   *  by ear-training and rhythm clicks, which always force REFERENCE_INSTRUMENT. */
  noteOn(midi, velocity = 100, { bank: bankOverride } = {}) {
    if (!this.enabled) return;
    this.ensure();
    if (this.voices.has(midi)) this.noteOff(midi, true);

    const bankId = bankOverride || this.currentId;
    const def = instrumentById(bankId);
    const bankObj = this.bank(bankId);
    bankObj.lastUsed = Date.now();

    if (!bankObj.ready) {
      // Not decoded yet — remember the key so it replays once the bank is
      // ready, and in the meantime sound the (pinned, usually-resident)
      // piano immediately so the keyboard doesn't just go quiet.
      this._pending.set(midi, { velocity, bankId, at: Date.now() });
      this.load(bankId).then(() => this._flushPending(bankId));
      if (bankId !== DEFAULT_INSTRUMENT) {
        const piano = this.bank(DEFAULT_INSTRUMENT);
        if (piano.ready) this._trigger(piano, instrumentById(DEFAULT_INSTRUMENT), DEFAULT_INSTRUMENT, midi, velocity);
      }
      return;
    }
    this._pending.delete(midi);
    this._trigger(bankObj, def, bankId, midi, velocity);
  }

  _trigger(bankObj, def, bankId, midi, velocity) {
    const ctx = this.ctx;
    const targetMidi = mapToRange(midi, def);
    const root = nearestRoot(def, targetMidi);
    const layer = pickLayer(def, velocity);
    const buf = bankObj.bufferFor(root.name, layer);
    if (!buf) return;

    const now = ctx.currentTime;
    const rate = Math.pow(2, (targetMidi - root.midi) / 12);
    if (rate < 0.35 || rate > 2.85) {
      // Should be unreachable once an instrument declares fold/range
      // correctly — surfacing this loudly beats the old behaviour (silently
      // dropping the note), which hid manifest mistakes completely.
      console.warn(`${bankId}: note ${midi} needs stretch rate ${rate.toFixed(2)}× — clamping`);
    }
    const clampedRate = Math.max(0.35, Math.min(2.85, rate));

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = clampedRate;

    const g = ctx.createGain();
    const peak = dynamicsGain(def, velocity, layer);
    // Tiny attack fade kills any sample start click without dulling the hammer.
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.004);

    // Light stereo placement across the keyboard (grand-mic image), scaled
    // per instrument (bass instruments stay closer to center).
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.max(-0.45, Math.min(0.45, (midi - 60) / 55)) * (def.pan ?? 1);

    src.connect(g);
    g.connect(pan);
    pan.connect(this.bankGain);
    src.start(now);

    // Natural sample end if the key is held past the recording.
    const naturalEnd = buf.duration / clampedRate;
    const stopTimer = setTimeout(() => {
      if (this.voices.get(midi)?.src === src) this.voices.delete(midi);
      try { src.disconnect(); g.disconnect(); pan.disconnect(); } catch { /* gone */ }
    }, (naturalEnd + 0.05) * 1000);

    this.voices.set(midi, { src, g, pan, started: now, stopTimer, bankId, def });
  }

  noteOff(midi, immediate = false) {
    this._pending.delete(midi);
    const voice = this.voices.get(midi);
    if (!voice) return;
    this.voices.delete(midi);
    if (voice.stopTimer) clearTimeout(voice.stopTimer);

    const now = this.ctx.currentTime;
    // Each voice remembers the instrument it was struck on, so a mid-hold
    // instrument switch doesn't change how an already-sounding note releases.
    const rel = voice.def.release || { held: 0.42, immediate: 0.02 };
    const release = immediate ? rel.immediate : rel.held;

    try {
      voice.g.gain.cancelScheduledValues(now);
      const cur = Math.max(voice.g.gain.value, 0.0001);
      voice.g.gain.setValueAtTime(cur, now);
      voice.g.gain.exponentialRampToValueAtTime(0.0001, now + release);
      voice.src.stop(now + release + 0.03);
    } catch { /* already stopped */ }

    setTimeout(() => {
      try {
        voice.src.disconnect();
        voice.g.disconnect();
        voice.pan.disconnect();
      } catch { /* already gone */ }
    }, (release + 0.08) * 1000);
  }

  allOff() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi, true);
  }

  /** Play a chord or scale note-list. `gap` of 0 = block chord.
   *  `bank` overrides the selected instrument, as in noteOn(). */
  play(midiNotes, { gap = 0, duration = 0.6, velocity = 95, bank } = {}) {
    const bankId = bank || this.currentId;
    this.ensure();
    this.load(bankId).then(() => {
      midiNotes.forEach((m, i) => {
        const delay = i * gap * 1000;
        setTimeout(() => {
          this.noteOn(m, velocity, { bank: bankId });
          setTimeout(() => this.noteOff(m), duration * 1000);
        }, delay);
      });
    });
    return (midiNotes.length - 1) * gap + duration;
  }
}

/* ------------------------------------------------------------- metronome  */

/**
 * Metronome scheduled against the audio clock, not setInterval.
 *
 * setInterval drifts badly — it is subject to timer throttling and main-thread
 * jank, which is fatal for a rhythm tool. Instead a coarse timer looks ahead
 * and schedules precise clicks on the AudioContext timeline.
 *
 * Deliberately instrument-independent: _click() taps `inst.master` directly,
 * upstream of the per-instrument bankGain trim, so the click's level and
 * tone never change no matter what the user has selected to play with.
 */
export class Metronome {
  constructor(instrument) {
    this.inst = instrument;
    this.bpm = 90;
    this.beatsPerBar = 4;
    this.running = false;
    this.beat = 0;
    this._timer = null;
    this._nextTime = 0;
    this.onBeat = null;
    this.lookahead = 0.12;
    this.tick = 25;
  }

  start() {
    if (this.running) return;
    const ctx = this.inst.ensure();
    this.running = true;
    this.beat = 0;
    this._nextTime = ctx.currentTime + 0.06;
    this._timer = setInterval(() => this._schedule(), this.tick);
  }

  stop() {
    this.running = false;
    clearInterval(this._timer);
    this._timer = null;
  }

  setTempo(bpm) { this.bpm = Math.max(30, Math.min(280, bpm)); }

  _schedule() {
    const ctx = this.inst.ctx;
    if (!ctx) return;
    const spb = 60 / this.bpm;

    while (this._nextTime < ctx.currentTime + this.lookahead) {
      const isDownbeat = this.beat % this.beatsPerBar === 0;
      this._click(this._nextTime, isDownbeat);

      if (this.onBeat) {
        const when = this._nextTime;
        const beatIndex = this.beat;
        const ms = Math.max(0, (when - ctx.currentTime) * 1000);
        setTimeout(() => this.onBeat({
          beat: beatIndex,
          bar: Math.floor(beatIndex / this.beatsPerBar),
          isDownbeat,
        }), ms);
      }

      this._nextTime += spb;
      this.beat++;
    }
  }

  _click(time, accent) {
    const ctx = this.inst.ctx;
    if (!ctx || !this.inst.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = accent ? 1400 : 950;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(accent ? 0.35 : 0.2, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
    osc.connect(g);
    g.connect(this.inst.master);
    osc.start(time);
    osc.stop(time + 0.05);
  }
}

export const instrument = new Instrument();
export const metronome = new Metronome(instrument);
export const drums = new DrumKit(instrument);
