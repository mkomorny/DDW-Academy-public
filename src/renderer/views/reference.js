/**
 * reference.js — the permanent charts. The syllabus asks that key signature,
 * dynamics, chord and scale charts stay available as reference sheets; this is
 * their home.
 */

import { escapeHtml, el } from '../app.js';
import { store } from '../lib/store.js';
import { midiHub } from '../lib/midi.js';
import { instrument } from '../lib/audio.js';
import { Keyboard, connectKeyboard } from '../components/keyboard.js';
import {
  MAJOR_KEYS, INTERVALS, CHORD_TYPES, SHARP_ORDER, FLAT_ORDER, CIRCLE_OF_FIFTHS,
  realiseScale, scaleToMidi, chordMidi, pcOf, keyByName, diatonicChords,
} from '../lib/theory.js';
import { sourceIndex, COURSE_STATS } from '../course/index.js';

const TABS = [
  ['scales', 'Scale Library'],
  ['chords', 'Chord Chart'],
  ['keys', 'Key Signatures'],
  ['intervals', 'Intervals'],
  ['terms', 'Terms & Dynamics'],
  ['sources', 'Source Index'],
];

export default function renderReference(host, route, app) {
  host.append(el(`<div class="page-head">
    <div class="eyebrow">Reference</div>
    <h1>Charts &amp; Library</h1>
    <p class="lede">Permanent reference sheets. The scale library holds
      ${app.scales.length} scales mined directly from the source PDFs.</p>
  </div>`));

  const tabs = el(`<div class="row mb">${TABS.map(([id, label], i) =>
    `<button class="btn ${i === 0 ? 'primary' : ''}" data-tab="${id}">${label}</button>`).join('')}</div>`);
  host.append(tabs);

  const body = el('<div></div>');
  host.append(body);

  let teardown = null;
  const show = (id) => {
    if (teardown) { teardown(); teardown = null; }
    body.innerHTML = '';
    tabs.querySelectorAll('[data-tab]').forEach((b) =>
      b.classList.toggle('primary', b.dataset.tab === id));
    teardown = ({ scales: scaleTab, chords: chordTab, keys: keyTab,
      intervals: intervalTab, terms: termsTab, sources: sourcesTab }[id])(body, app);
  };
  tabs.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => show(b.dataset.tab); });
  show('scales');

  return () => { if (teardown) teardown(); };
}

/* ---------------------------------------------------------------- scales -- */

function scaleTab(host, app) {
  const search = el(`<input class="txt" type="text" placeholder="Search ${app.scales.length} scales by name or alias…" style="width:100%">`);
  host.append(el('<div class="mb"></div>').appendChild(search).parentElement);

  const rootSel = el(`<div class="row mb"><span class="small muted">Key</span>
    <select class="sel">${['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
      .map((r) => `<option>${r}</option>`).join('')}</select></div>`);
  host.append(rootSel);

  const detail = el(`<div class="panel hidden">
    <div class="panel-head"><div class="panel-title dt"></div>
      <button class="btn sm listen">▶ Listen</button></div>
    <div class="notes-line dn"></div>
    <div class="formula-line df"></div>
    <p class="small muted dd" style="margin-top:10px"></p>
    <div class="kb-frame mt"><div class="kb-host"></div></div>
    <div class="small muted mt ds"></div>
  </div>`);
  host.append(detail);

  const kb = new Keyboard(detail.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);

  const list = el('<div class="grid c3"></div>');
  host.append(list);

  let current = null;
  const rootOf = () => rootSel.querySelector('select').value;

  const paintDetail = () => {
    if (!current) return;
    const r = realiseScale(current, rootOf());
    detail.classList.remove('hidden');
    detail.querySelector('.dt').textContent = `${rootOf()} ${current.name}`;
    detail.querySelector('.dn').textContent = r.names.join('  ');
    detail.querySelector('.df').textContent =
      `${current.degrees.length ? current.degrees.join(' · ') + '   —   ' : ''}steps ${current.steps.join('-')}   —   ${current.noteCount} notes`;
    detail.querySelector('.dd').textContent = current.description || '';
    detail.querySelector('.ds').textContent =
      `Source: ${current.sourcePdf || current.source + '.pdf'}${current.curated ? ' (curated)' : ''}`
      + (current.aliases?.length ? `   ·   Also known as: ${current.aliases.join(', ')}` : '')
      + (current.erratum ? `   ·   Note: source erratum corrected` : '');
    kb.highlight('target', r.pcs, { byPitchClass: true });
    kb.highlight('root', [r.root.pc], { byPitchClass: true });
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  detail.querySelector('.listen').onclick = () => {
    if (!current) return;
    const r = realiseScale(current, rootOf());
    instrument.play(scaleToMidi(r.root.pc, current.steps, 4, 1), { gap: 0.25, duration: 0.4 });
  };
  rootSel.querySelector('select').onchange = paintDetail;

  const paintList = (filter = '') => {
    const f = filter.toLowerCase().trim();
    const items = app.scales.filter((s) =>
      !f || s.name.toLowerCase().includes(f) || (s.aliases || []).some((a) => a.toLowerCase().includes(f)));
    list.innerHTML = '';
    for (const s of items) {
      const c = el(`<div class="card click">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${s.noteCount} notes · ${s.steps.join('-')}</p>
      </div>`);
      c.onclick = () => { current = s; paintDetail(); };
      list.append(c);
    }
    if (!items.length) list.append(el('<p class="muted">No scales match that search.</p>'));
  };
  search.oninput = () => paintList(search.value);
  paintList();

  return off;
}

/* ---------------------------------------------------------------- chords -- */

function chordTab(host) {
  host.append(el('<h2>The Ultimate Chord Chart</h2>'));
  host.append(el(`<p class="muted">Every chord type the course uses, with intervals from the
    root. Click any row to hear it in C.</p>`));

  const kbWrap = el('<div class="kb-frame mb"><div class="kb-host"></div></div>');
  host.append(kbWrap);
  const kb = new Keyboard(kbWrap.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);

  const families = [...new Set(CHORD_TYPES.map((c) => c.family))];
  for (const fam of families) {
    host.append(el(`<h3 style="text-transform:capitalize">${fam}</h3>`));
    const t = el(`<table class="t"><thead><tr><th>Chord</th><th>Symbol</th><th>Intervals</th><th>Notes in C</th></tr></thead><tbody></tbody></table>`);
    for (const c of CHORD_TYPES.filter((x) => x.family === fam)) {
      const notes = chordMidi(0, c.id, 4);
      const names = notes.map((n) => ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][n % 12]);
      const row = el(`<tr style="cursor:pointer"><td><strong>${escapeHtml(c.name)}</strong></td>
        <td>C${escapeHtml(c.symbol)}</td><td class="small">${c.intervals.join(' · ')}</td>
        <td>${names.join(' ')}</td></tr>`);
      row.onclick = () => { kb.highlight('target', notes); instrument.play(notes, { gap: 0, duration: 1.5 }); };
      t.querySelector('tbody').append(row);
    }
    host.append(t);
  }

  host.append(el('<h2>Diatonic Harmony</h2>'));
  const dt = el(`<table class="t"><thead><tr><th>Key</th><th>I</th><th>ii</th><th>iii</th><th>IV</th><th>V</th><th>vi</th><th>vii°</th></tr></thead><tbody></tbody></table>`);
  for (const k of ['C','G','D','A','E','F','Bb','Eb']) {
    const chords = diatonicChords(pcOf(k), [2,2,1,2,2,2,1]);
    dt.querySelector('tbody').append(el(`<tr><td><strong>${k}</strong></td>${
      chords.map((c) => `<td>${['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'][c.rootPc]}${c.symbol}</td>`).join('')}</tr>`));
  }
  host.append(dt);
  return off;
}

/* ------------------------------------------------------------------ keys -- */

function keyTab(host) {
  host.append(el('<h2>Key Signature Chart</h2>'));
  const t = el(`<table class="t">
    <caption>From Key Signature Chart.pdf and Circle of Fifths.pdf</caption>
    <thead><tr><th>Major</th><th>Accidentals</th><th>Which</th><th>Relative minor</th></tr></thead><tbody></tbody></table>`);
  for (const k of MAJOR_KEYS) {
    t.querySelector('tbody').append(el(`<tr>
      <td><strong>${k.name} major</strong></td>
      <td>${k.sharps === 0 ? '—' : k.sharps > 0 ? `${k.sharps} ♯` : `${-k.sharps} ♭`}</td>
      <td>${k.accidentals.join(' ') || '—'}</td>
      <td>${k.relMinor} minor</td></tr>`));
  }
  host.append(t);

  host.append(el(`<div class="callout key"><div class="ct">Order of accidentals</div>
    <p><strong>Sharps:</strong> ${SHARP_ORDER.join(' ')} — "Father Charles Goes Down And Ends Battle"<br>
    <strong>Flats:</strong> ${FLAT_ORDER.join(' ')} — the same list reversed (starts with BEAD)</p></div>`));

  host.append(el(`<div class="callout tip"><div class="ct">Naming a key from its signature</div>
    <p><strong>Sharp keys:</strong> take the last sharp and go up a half step.<br>
    <strong>Flat keys:</strong> the second-to-last flat is the key name. (F major, with one flat, must be memorized.)</p></div>`));

  host.append(el('<h2>Circle of Fifths Order</h2>'));
  host.append(el(`<p class="muted">Clockwise, adding one sharp at each step:
    <strong>${CIRCLE_OF_FIFTHS.join(' → ')}</strong> → back to C.</p>`));
  return null;
}

/* ------------------------------------------------------------- intervals -- */

function intervalTab(host) {
  host.append(el('<h2>Interval Reference</h2>'));
  const kbWrap = el('<div class="kb-frame mb"><div class="kb-host"></div></div>');
  host.append(kbWrap);
  const kb = new Keyboard(kbWrap.querySelector('.kb-host'), { lowMidi: 48, highMidi: 84, showLabels: 'c' });
  const off = connectKeyboard(kb, midiHub, instrument);

  const REF = {
    P1: 'The same note twice', m2: 'Jaws theme', M2: 'Happy Birthday (first two notes)',
    m3: 'Greensleeves', M3: 'When the Saints Go Marching In', P4: 'Here Comes the Bride',
    TT: 'The Simpsons theme', P5: 'Twinkle Twinkle · Star Wars', m6: 'The Entertainer',
    M6: 'My Bonnie Lies Over the Ocean', m7: 'Somewhere (West Side Story)',
    M7: 'Take On Me (chorus leap)', P8: 'Somewhere Over the Rainbow',
  };

  const t = el(`<table class="t"><thead><tr><th>Interval</th><th>Semitones</th><th>From C</th><th>Reference song</th><th></th></tr></thead><tbody></tbody></table>`);
  for (const iv of INTERVALS) {
    const notes = [60, 60 + iv.semitones];
    const row = el(`<tr><td><strong>${iv.name}</strong></td><td>${iv.semitones}</td>
      <td>C–${['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][(60 + iv.semitones) % 12]}</td>
      <td class="small">${escapeHtml(REF[iv.id] || '')}</td>
      <td><button class="btn sm">▶</button></td></tr>`);
    row.querySelector('button').onclick = () => {
      kb.highlight('target', notes);
      instrument.play(notes, { gap: 0.5, duration: 0.7 });
    };
    t.querySelector('tbody').append(row);
  }
  host.append(t);

  host.append(el(`<div class="callout key"><div class="ct">Inversions add to nine</div>
    <p>Flip an interval and the two numbers sum to 9 — a 3rd inverts to a 6th, a 4th to a 5th.
    Quality flips too: major becomes minor, minor becomes major, perfect stays perfect.</p></div>`));
  return off;
}

/* ----------------------------------------------------------------- terms -- */

function termsTab(host) {
  host.append(el('<h2>Dynamics Chart</h2>'));
  host.append(el(`<table class="t"><caption>From Dynamics Chart.pdf</caption>
    <thead><tr><th>Mark</th><th>Italian</th><th>Meaning</th></tr></thead><tbody>
    ${[['pp','pianissimo','Very soft'],['p','piano','Soft'],['mp','mezzo-piano','Moderately soft'],
       ['mf','mezzo-forte','Moderately loud'],['f','forte','Loud'],['ff','fortissimo','Very loud'],
       ['cresc. / &lt;','crescendo','Gradually louder'],['dim. / &gt;','diminuendo','Gradually softer'],
       ['sfz','sforzando','Sudden strong accent']]
      .map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    </tbody></table>`));

  host.append(el('<h2>Tempo Reference</h2>'));
  host.append(el(`<table class="t"><caption>From Tempo Reference Sheet.pdf</caption>
    <thead><tr><th>Term</th><th>BPM</th><th>Meaning</th></tr></thead><tbody>
    ${[['Largo','40–60','Broad, very slow'],['Adagio','66–76','Slow, at ease'],
       ['Andante','76–108','Walking pace'],['Moderato','108–120','Moderate'],
       ['Allegro','120–156','Fast, cheerful'],['Vivace','156–176','Lively'],['Presto','168–200','Very fast']]
      .map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    </tbody></table>`));

  host.append(el('<h2>Articulation &amp; Common Terms</h2>'));
  host.append(el(`<table class="t"><caption>From Musical terms for piano.pdf</caption>
    <thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>
    ${[['Legato','Smoothly connected'],['Staccato','Short and detached (dot above the note)'],
       ['Tenuto','Hold the full value with slight emphasis'],['Accent (&gt;)','Emphasize this note'],
       ['Tie','Same pitch joined — play once, hold for the combined value'],
       ['Slur','Different pitches joined — play all, smoothly connected'],
       ['Ritardando','Gradually slowing down'],['Accelerando','Gradually speeding up'],
       ['A tempo','Return to the previous speed'],['Rubato','Expressive flexibility of tempo'],
       ['Fermata','Hold longer than written'],['Da capo','From the beginning'],
       ['Fine','The end'],['Ottava (8va)','Play an octave higher than written']]
      .map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td></tr>`).join('')}
    </tbody></table>`));

  host.append(el('<h2>Musical Form</h2>'));
  host.append(el(`<table class="t"><thead><tr><th>Form</th><th>Structure</th><th>Example</th></tr></thead><tbody>
    ${[['Binary','AB','Baroque dances'],['Ternary','ABA','Minuet and Trio'],
       ['Rounded binary','AB(A)','Classical sonatinas'],['Strophic','AAA…','Hymns, folk songs'],
       ['Rondo','ABACA','Classical finales'],['Song form','AABA','Jazz standards'],
       ['Verse-chorus','ABABCB','Most pop songs']]
      .map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    </tbody></table>`));

  host.append(el('<h2>Daily Practice Skeleton</h2>'));
  host.append(el(`<div class="card"><ul class="l">
    <li>Warm-up / hand exercises / relaxation check</li>
    <li>Scales or modes (keys of the day, fingering focus)</li>
    <li>Chords / arpeggios / progression</li>
    <li>Reading or repertoire</li>
    <li>Creative: improvise, embellish, or compose 4–8 bars</li>
    <li>Cool-down: one familiar phrase, slowly, with your best tone</li>
  </ul></div>`));
  return null;
}

/* --------------------------------------------------------------- sources -- */

function sourcesTab(host) {
  const idx = sourceIndex();
  host.append(el(`<h2>Source Index</h2>
    <p class="muted">Every PDF in your Research library that this course draws on, and the modules
    that use it. The scale library was mined programmatically from these documents; the lesson
    content was written from them. <strong>None of your PDFs were modified.</strong></p>`));

  host.append(el(`<div class="grid c4 mb">
    <div class="card stat"><div class="n">${idx.length}</div><div class="l">Sources cited</div></div>
    <div class="card stat"><div class="n">${COURSE_STATS.modules}</div><div class="l">Modules</div></div>
    <div class="card stat"><div class="n">${COURSE_STATS.lessons}</div><div class="l">Lessons</div></div>
    <div class="card stat"><div class="n">${COURSE_STATS.questions}</div><div class="l">Quiz questions</div></div>
  </div>`));

  const t = el(`<table class="t"><thead><tr><th>Source PDF</th><th>Used in modules</th></tr></thead><tbody>
    ${idx.map((r) => `<tr><td>${escapeHtml(r.file)}</td><td class="small">${r.modules.join(' · ')}</td></tr>`).join('')}
    </tbody></table>`);
  host.append(t);
  return null;
}
