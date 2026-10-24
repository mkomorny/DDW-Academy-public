/**
 * drums.js — a synthesized drum engine, sibling to Instrument rather than a
 * modification of it.
 *
 * Why synthesis instead of samples: Instrument is built end-to-end around
 * pitched sample banks — root-note interpolation, playbackRate stretching,
 * LRU bank eviction — none of which applies to unpitched percussion. And for
 * 808/909/EDM kits, synthesis isn't a compromise: a 909 kick genuinely *is* a
 * pitch-swept sine plus a short noise click; a 909 hat genuinely *is* six
 * square oscillators through a highpass. Synthesizing them means a lesson
 * can expose the parameters as live controls ("drag the decay, hear the 808
 * become a 909"), teaching sound design as a side effect of teaching drum
 * programming — and it costs 0 bytes and needs no licensing.
 *
 * Graph placement: percBus connects to instrument.master, NOT bankGain — the
 * same reasoning as Metronome._click() in audio.js, which taps `inst.master`
 * directly so the click's level never changes with the selected melodic
 * instrument. Drums follow the dock volume slider; the instrument picker
 * doesn't touch them.
 */

import { VOICES, KITS, DEFAULT_KIT, kitById, voiceParams, chokeGroupOf } from './drums-manifest.js';

export { VOICES, KITS, DEFAULT_KIT };

export class DrumKit {
  constructor(instrument) {
    this.instrument = instrument;
    this.ctx = null;
    this.percBus = null;
    this.currentKit = DEFAULT_KIT;
    this._noiseBuffer = null;
    this._voices = new Set();      // active { gains[], allNodes[], _timer } entries, for stopAll()
    this._chokeActive = new Map(); // group -> { voice, gain }
  }

  /** Lazily create percBus on the shared AudioContext. Safe to call every trigger. */
  ensure() {
    const ctx = this.instrument.ensure();
    this.ctx = ctx;
    if (!this.percBus) {
      this.percBus = ctx.createGain();
      this.percBus.gain.value = 1.4;
      this.percBus.connect(this.instrument.master);
    }
    return ctx;
  }

  setKit(id) {
    this.currentKit = KITS[id] ? id : DEFAULT_KIT;
  }

  get kit() { return kitById(this.currentKit); }

  /** One shared cached noise AudioBuffer per context — never allocate noise per hit. */
  _noiseSource() {
    const ctx = this.ctx;
    if (!this._noiseBuffer) {
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this._noiseBuffer = buf;
    }
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuffer;
    src.loop = true; // one-shots always stop() well before 2s; looping just avoids an edge click
    return src;
  }

  _velocityGain(v) {
    const vv = Math.max(1, Math.min(127, v || 100));
    return 0.25 + 0.75 * Math.pow(vv / 127, 1.3);
  }

  /** Register a triggered voice so stopAll() can find and silence it, and
   *  schedule its own node cleanup once it's naturally finished ringing. */
  _registerVoice(gains, allNodes, endTime) {
    const entry = { gains, allNodes, _timer: null };
    this._voices.add(entry);
    const ctx = this.ctx;
    const ms = Math.max(0, (endTime - ctx.currentTime) * 1000) + 80;
    entry._timer = setTimeout(() => {
      this._voices.delete(entry);
      for (const n of allNodes) { try { n.disconnect(); } catch { /* already gone */ } }
    }, ms);
    return entry;
  }

  _fastStop(gainNode, when) {
    try {
      gainNode.gain.cancelScheduledValues(when);
      gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), when);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, when + 0.025);
    } catch { /* already stopped */ }
  }

  /**
   * Trigger one voice from the current (or overridden) kit.
   *   velocity  1-127, MIDI-style
   *   when      AudioContext time; 0/omitted = "now"
   *   kit       override the kit for just this hit
   */
  trigger(voice, { velocity = 100, when = 0, kit } = {}) {
    const ctx = this.ensure();
    const kitId = kit || this.currentKit;
    const params = voiceParams(kitId, voice);
    if (!params) { console.warn(`drums: unknown voice "${voice}" for kit "${kitId}"`); return; }
    const t = when || ctx.currentTime;
    const vg = this._velocityGain(velocity);

    const group = chokeGroupOf(voice);
    if (group) {
      const prev = this._chokeActive.get(group);
      if (prev && prev.voice !== voice) this._fastStop(prev.gain, t);
    }

    switch (params.type) {
      case 'kick': this._kick(t, params, vg); break;
      case 'snare': this._snare(t, params, vg); break;
      case 'clap': this._clap(t, params, vg); break;
      case 'hat': this._hat(t, params, vg, voice, group); break;
      case 'tom': this._tom(t, params, vg); break;
      case 'rim': this._rim(t, params, vg); break;
      case 'cowbell': this._cowbell(t, params, vg); break;
      default: console.warn(`drums: unknown synth type "${params.type}"`);
    }
  }

  _kick(t, p, vg) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, p.f1), t + p.pitchDecay);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.9 * vg, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.ampDecay);
    osc.connect(g); g.connect(this.percBus);
    osc.start(t); osc.stop(t + p.ampDecay + 0.05);
    const nodes = [osc, g];
    const gains = [g];

    if (p.clickLevel > 0) {
      const noise = this._noiseSource();
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = p.clickHz || 1800;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(p.clickLevel * vg, t);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);
      noise.connect(hp); hp.connect(cg); cg.connect(this.percBus);
      noise.start(t); noise.stop(t + 0.02);
      nodes.push(noise, hp, cg); gains.push(cg);
    }
    this._registerVoice(gains, nodes, t + p.ampDecay + 0.1);
  }

  _snare(t, p, vg) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(p.toneFreq, t);
    const og = ctx.createGain();
    og.gain.setValueAtTime((p.toneLevel ?? 0.45) * vg, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + p.toneDecay);
    osc.connect(og); og.connect(this.percBus);
    osc.start(t); osc.stop(t + p.toneDecay + 0.05);

    const noise = this._noiseSource();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = p.noiseFreq; bp.Q.value = p.noiseQ;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.7 * vg, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + p.noiseDecay);
    noise.connect(bp); bp.connect(ng); ng.connect(this.percBus);
    noise.start(t); noise.stop(t + p.noiseDecay + 0.05);

    this._registerVoice([og, ng], [osc, og, noise, bp, ng], t + Math.max(p.toneDecay, p.noiseDecay) + 0.1);
  }

  _clap(t, p, vg) {
    const ctx = this.ctx;
    const nodes = [];
    const gains = [];
    for (let i = 0; i < p.bursts; i++) {
      const bt = t + i * p.burstGapSec;
      const isLast = i === p.bursts - 1;
      const dur = isLast ? p.tailDecay : 0.015;
      const noise = this._noiseSource();
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = p.noiseFreq; bp.Q.value = p.noiseQ;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.6 * vg, bt);
      g.gain.exponentialRampToValueAtTime(0.0001, bt + dur);
      noise.connect(bp); bp.connect(g); g.connect(this.percBus);
      noise.start(bt); noise.stop(bt + dur + 0.02);
      nodes.push(noise, bp, g); gains.push(g);
    }
    this._registerVoice(gains, nodes, t + p.bursts * p.burstGapSec + p.tailDecay + 0.1);
  }

  _hat(t, p, vg, voice, group) {
    const ctx = this.ctx;
    const bus = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = p.hpFreq;
    const oscs = p.ratios.map((r) => {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = p.baseFreq * r;
      o.connect(hp);
      return o;
    });
    hp.connect(bus); bus.connect(this.percBus);
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.linearRampToValueAtTime(0.5 * vg, t + 0.002);
    bus.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    oscs.forEach((o) => { o.start(t); o.stop(t + p.decay + 0.05); });

    if (group) this._chokeActive.set(group, { voice, gain: bus });
    this._registerVoice([bus], [bus, hp, ...oscs], t + p.decay + 0.1);
  }

  _tom(t, p, vg) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, p.f1), t + p.decay * 0.8);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8 * vg, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    osc.connect(g); g.connect(this.percBus);
    osc.start(t); osc.stop(t + p.decay + 0.05);
    this._registerVoice([g], [osc, g], t + p.decay + 0.1);
  }

  _rim(t, p, vg) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = p.freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5 * vg, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    osc.connect(g); g.connect(this.percBus);
    osc.start(t); osc.stop(t + p.decay + 0.03);
    this._registerVoice([g], [osc, g], t + p.decay + 0.08);
  }

  _cowbell(t, p, vg) {
    const ctx = this.ctx;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = p.bpFreq; bp.Q.value = p.bpQ;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5 * vg, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
    const o1 = ctx.createOscillator(); o1.type = 'square'; o1.frequency.value = p.f1;
    const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = p.f2;
    o1.connect(bp); o2.connect(bp); bp.connect(g); g.connect(this.percBus);
    o1.start(t); o2.start(t);
    o1.stop(t + p.decay + 0.05); o2.stop(t + p.decay + 0.05);
    this._registerVoice([g], [o1, o2, bp, g], t + p.decay + 0.1);
  }

  /** Immediately silence every currently-ringing voice (Panic button). */
  stopAll() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const entry of this._voices) {
      for (const g of entry.gains) this._fastStop(g, now);
      clearTimeout(entry._timer);
      const nodes = entry.allNodes;
      setTimeout(() => { for (const n of nodes) { try { n.disconnect(); } catch { /* gone */ } } }, 100);
    }
    this._voices.clear();
    this._chokeActive.clear();
  }
}
