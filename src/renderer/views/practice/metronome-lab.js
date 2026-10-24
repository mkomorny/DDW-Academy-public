/**
 * metronome-lab.js — the untiered metronome & tempo lab tool. Extracted
 * intact from the original views/practice.js; no behavior changes.
 */
import { el } from '../../app.js';
import { store } from '../../lib/store.js';
import { metronome } from '../../lib/audio.js';

export function metronomeLab(host) {
  const ui = el(`<div>
    <div class="page-head"><div class="eyebrow">Practice</div><h1>Metronome &amp; Tempo Lab</h1>
      <p class="lede">Scheduled against the audio clock rather than a timer, so the beat stays
        accurate even while the app is busy.</p></div>
    <div class="panel center">
      <div class="drill-prompt bpm-label">90</div>
      <div class="drill-sub">BPM — <span class="term"></span></div>
      <input type="range" class="mt" id="bpm" min="30" max="240" value="90" style="width:100%;accent-color:var(--brass)">
      <div class="row mt" style="justify-content:center">
        <button class="btn sm" data-d="-10">−10</button>
        <button class="btn sm" data-d="-4">−4</button>
        <button class="btn primary go">▶ Start</button>
        <button class="btn sm" data-d="4">+4</button>
        <button class="btn sm" data-d="10">+10</button>
      </div>
      <div class="row mt" style="justify-content:center">
        <span class="small muted">Beats per bar</span>
        <select class="sel meter"><option>2</option><option>3</option><option selected>4</option><option>6</option></select>
      </div>
      <div class="seq-track mt beats"></div>
    </div>
    <div class="callout tip"><div class="ct">The tempo ladder</div>
      <p>Set a tempo where you play the passage perfectly. Play it cleanly three times in a row,
      then press <strong>+4</strong>. The moment you make an error, drop <strong>−8</strong> and
      rebuild. This is the whole method for building speed without building mistakes.</p></div>
  </div>`);
  host.append(ui);
  const q = (s) => ui.querySelector(s);

  const TERMS = [[40, 'Largo'], [60, 'Larghetto'], [66, 'Adagio'], [76, 'Andante'], [108, 'Moderato'],
    [120, 'Allegro'], [156, 'Vivace'], [168, 'Presto'], [400, 'Prestissimo']];
  const termFor = (b) => (TERMS.find(([t]) => b <= t) || TERMS[TERMS.length - 1])[1];

  const paintBeats = () => {
    const n = Number(q('.meter').value);
    metronome.beatsPerBar = n;
    q('.beats').innerHTML = Array.from({ length: n }, (_, i) =>
      `<div class="seq-note" data-b="${i}">${i + 1}</div>`).join('');
  };

  const setBpm = (v) => {
    const b = Math.max(30, Math.min(240, v));
    q('#bpm').value = b;
    q('.bpm-label').textContent = b;
    q('.term').textContent = termFor(b);
    metronome.setTempo(b);
    store.set('metronomeBpm', b);
  };

  q('#bpm').oninput = (e) => setBpm(Number(e.target.value));
  ui.querySelectorAll('[data-d]').forEach((b) => {
    b.onclick = () => setBpm(Number(q('#bpm').value) + Number(b.dataset.d));
  });
  q('.meter').onchange = paintBeats;

  q('.go').onclick = () => {
    if (metronome.running) {
      metronome.stop();
      q('.go').textContent = '▶ Start';
      q('.go').classList.add('primary');
      ui.querySelectorAll('.beats .seq-note').forEach((c) => c.classList.remove('now'));
    } else {
      metronome.start();
      q('.go').textContent = '■ Stop';
      q('.go').classList.remove('primary');
    }
  };

  metronome.onBeat = ({ beat }) => {
    const cells = ui.querySelectorAll('.beats .seq-note');
    if (!cells.length) return;
    cells.forEach((c) => c.classList.remove('now'));
    cells[beat % cells.length]?.classList.add('now');
  };

  paintBeats();
  setBpm(store.get('metronomeBpm') || 90);

  return () => { metronome.stop(); metronome.onBeat = null; };
}
