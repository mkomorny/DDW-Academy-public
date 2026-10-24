/**
 * views/practice/index.js — MIDI-graded drills, organized by category, with
 * unbounded progressive difficulty.
 *
 * Difficulty model
 * ----------------
 * Every drill exposes `params(tier)` — a pure function from tier number to
 * generation parameters. Tiers start at 1 and never cap: the early tiers walk
 * through categorical difficulty (more roots, more qualities, more keys), and
 * once that ladder is exhausted the numeric knobs take over (chain length,
 * octave span, exact-register grading), which grow without bound.
 *
 * Advancement: 10 correct answers at the current tier with ≥80% accuracy
 * unlocks the next tier and moves you there. Unlocked tiers stay unlocked —
 * the tier selector lets you start from any of them. Only the per-drill
 * "Reset progress" button (or Settings → full reset) goes backwards.
 *
 * Module map (split from a single 1480-line practice.js — pure refactor,
 * no behavior changes):
 *   tier-helpers.js          shared pure functions/constants
 *   drill-runner.js          runDrill(), runChoiceDrill(), tierHeader()
 *   metronome-lab.js         the untiered metronome & tempo lab tool
 *   generators/fundamentals.js  note-finder, interval-build
 *   generators/scales.js        scale-runner, mode-runner
 *   generators/chords.js        triad/inversion/seventh/extended/spelling/arpeggio
 *   generators/harmony.js       diatonic, progression, cadence, circle-of-fifths
 *   generators/jazz.js          blues, jazz-voicing
 */

import { escapeHtml, el, go } from '../../app.js';
import { store } from '../../lib/store.js';
import { runDrill, runChoiceDrill } from './drill-runner.js';
import { metronomeLab } from './metronome-lab.js';
import { fundamentalsGenerators } from './generators/fundamentals.js';
import { scalesGenerators } from './generators/scales.js';
import { chordsGenerators } from './generators/chords.js';
import { harmonyGenerators } from './generators/harmony.js';
import { jazzGenerators } from './generators/jazz.js';

/* ═══════════════════════════════════════════════════════════ categories ══ */

const CATEGORIES = [
  { id: 'fundamentals', title: 'Fundamentals', icon: '◈',
    desc: 'The keyboard map and the intervals everything else is built from.' },
  { id: 'scales', title: 'Scales & Modes', icon: '♒',
    desc: 'Majors, minors, modes and the full 63-scale library, with source fingerings.' },
  { id: 'chords', title: 'Chords', icon: '◆',
    desc: 'Triads through altered voicings: build, invert, spell and chain them.' },
  { id: 'harmony', title: 'Harmony & Progressions', icon: '♯',
    desc: 'Diatonic chords, cadences, progressions and the circle of fifths.' },
  { id: 'jazz-blues', title: 'Jazz & Blues', icon: '♪',
    desc: 'The 12-bar form and ii–V–I vocabulary.' },
  { id: 'tools', title: 'Tools', icon: '⚙',
    desc: 'The metronome and tempo lab.' },
];

const DRILLS = [
  /* ----------------------------------------------------------- fundamentals */
  { id: 'note-finder', cat: 'fundamentals', title: 'Note Finder',
    desc: 'Find named notes — later tiers demand exact octaves and note chains.', level: 1 },
  { id: 'interval-build', cat: 'fundamentals', title: 'Interval Builder',
    desc: 'Build intervals above and below a root, growing into compound intervals.', level: 3 },

  /* ----------------------------------------------------------------- scales */
  { id: 'scale-runner', cat: 'scales', title: 'Scale Runner',
    desc: 'Majors first, then minors, blues and beyond — more octaves as you climb.', level: 3 },
  { id: 'mode-runner', cat: 'scales', title: 'Mode Runner',
    desc: 'The seven modes, then the variant families, then the whole library.', level: 6 },

  /* ----------------------------------------------------------------- chords */
  { id: 'triad-drill', cat: 'chords', title: 'Triad Builder',
    desc: 'Major and minor first; diminished, augmented and sus follow.', level: 5 },
  { id: 'inversion-drill', cat: 'chords', title: 'Inversion Drill',
    desc: 'Play chords in a demanded inversion, graded by exact register.', level: 5 },
  { id: 'seventh-drill', cat: 'chords', title: 'Seventh Chords',
    desc: 'maj7, dominant, m7, half-diminished, dim7 and minor-major.', level: 5 },
  { id: 'extended-drill', cat: 'chords', title: 'Extended & Altered',
    desc: 'Ninths, thirteenths and the altered dominant family.', level: 7 },
  { id: 'chord-spelling', cat: 'chords', title: 'Chord Speller',
    desc: 'Name the notes inside a chord before your time runs out.', level: 5 },
  { id: 'arpeggio', cat: 'chords', title: 'Arpeggio Runner',
    desc: 'Broken chords in every quality, expanding to multiple octaves.', level: 5 },

  /* ---------------------------------------------------------------- harmony */
  { id: 'diatonic', cat: 'harmony', title: 'Diatonic Harmony',
    desc: 'The chord on any degree of any key — sevenths and minor keys later.', level: 5 },
  { id: 'progression', cat: 'harmony', title: 'Progression Trainer',
    desc: 'Single chords from progressions, then whole progressions in sequence.', level: 5 },
  { id: 'cadence-drill', cat: 'harmony', title: 'Cadence Trainer',
    desc: 'I–V–I, ii–V–I and minor cadences played as full sequences.', level: 5 },
  { id: 'circle-drill', cat: 'harmony', title: 'Circle of Fifths',
    desc: 'Signatures, relative minors and the order of sharps and flats.', level: 4 },

  /* ------------------------------------------------------------- jazz-blues */
  { id: 'blues', cat: 'jazz-blues', title: '12-Bar Blues Trainer',
    desc: 'Shell voicings bar by bar, building to the full form in sequence.', level: 6 },
  { id: 'jazz-voicing', cat: 'jazz-blues', title: 'ii–V–I Trainer',
    desc: 'Guide tones around the circle, then full voiced progressions.', level: 7 },

  /* ------------------------------------------------------------------ tools */
  { id: 'metronome', cat: 'tools', title: 'Metronome & Tempo Lab',
    desc: 'Audio-clock metronome with tempo-ladder guidance.', level: 2, untiered: true },
];

const GENERATORS = {
  ...fundamentalsGenerators,
  ...scalesGenerators,
  ...chordsGenerators,
  ...harmonyGenerators,
  ...jazzGenerators,
};

/* ═══════════════════════════════════════════════════════ view dispatch ══ */

export default function renderPractice(host, route, app) {
  if (route.name === 'drill') return drillView(host, route, app);
  if (route.category) return categoryView(host, route, app);
  return overview(host);
}

function overview(host) {
  host.append(el(`<div class="page-head">
    <div class="eyebrow">Practice</div>
    <h1>Drills</h1>
    <p class="lede">Graded practice by category. Every drill starts simple and climbs
      indefinitely — ten clean answers at a tier unlocks the next, and unlocked tiers stay
      available as starting points until you reset a drill yourself.</p>
  </div>`));

  const grid = el('<div class="grid c2"></div>');
  for (const cat of CATEGORIES) {
    const drills = DRILLS.filter((d) => d.cat === cat.id);
    const tiers = drills.filter((d) => !d.untiered).map((d) => store.tier(d.id).unlocked);
    const top = tiers.length ? Math.max(...tiers) : 0;
    const card = el(`<div class="card click">
      <div class="row spread" style="align-items:flex-start">
        <h3><span style="color:var(--brass);margin-right:7px">${cat.icon}</span>${escapeHtml(cat.title)}</h3>
        ${top > 1 ? `<span class="badge done">Tier ${top}</span>` : ''}
      </div>
      <p>${escapeHtml(cat.desc)}</p>
      <div class="row mt small muted"><span>${drills.length} drill${drills.length > 1 ? 's' : ''}</span></div>
    </div>`);
    card.onclick = () => go('practice', { category: cat.id });
    grid.append(card);
  }
  host.append(grid);
  return null;
}

function categoryView(host, route) {
  const cat = CATEGORIES.find((c) => c.id === route.category);
  if (!cat) return overview(host);

  host.append(el(`<div class="crumbs"><button data-b="p">Practice</button> › ${escapeHtml(cat.title)}</div>`));
  host.querySelector('[data-b="p"]').onclick = () => go('practice');

  host.append(el(`<div class="page-head">
    <div class="eyebrow">Practice · ${escapeHtml(cat.title)}</div>
    <h1><span style="color:var(--brass)">${cat.icon}</span> ${escapeHtml(cat.title)}</h1>
    <p class="lede">${escapeHtml(cat.desc)}</p>
  </div>`));

  const grid = el('<div class="grid c2"></div>');
  for (const d of DRILLS.filter((x) => x.cat === cat.id)) {
    const rec = store.data.drills[d.id];
    const t = d.untiered ? null : store.tier(d.id);
    const card = el(`<div class="card click">
      <div class="row spread" style="align-items:flex-start">
        <h3>${escapeHtml(d.title)}</h3>
        <span class="row" style="gap:6px">
          ${t && t.unlocked > 1 ? `<span class="badge done">Tier ${t.unlocked}</span>` : ''}
          ${rec ? `<span class="badge">Best ${rec.best}%</span>` : ''}
        </span>
      </div>
      <p>${escapeHtml(d.desc)}</p>
      <div class="row mt small muted"><span class="tag">Level ${d.level}+</span>
        ${t ? `<span>practicing tier ${t.selected}</span>` : ''}
        ${rec ? `<span>· ${rec.attempts} sessions</span>` : ''}</div>
    </div>`);
    card.onclick = () => go('drill', { drillId: d.id });
    grid.append(card);
  }
  host.append(grid);
  return null;
}

/* ═══════════════════════════════════════════════════════════ drill view ══ */

function drillView(host, route, app) {
  const meta = DRILLS.find((d) => d.id === route.drillId);
  if (!meta) return overview(host);

  const cat = CATEGORIES.find((c) => c.id === meta.cat);
  host.append(el(`<div class="crumbs"><button data-b="p">Practice</button> ›
    <button data-b="c">${escapeHtml(cat.title)}</button> › ${escapeHtml(meta.title)}</div>`));
  host.querySelector('[data-b="p"]').onclick = () => go('practice');
  host.querySelector('[data-b="c"]').onclick = () => go('practice', { category: meta.cat });

  if (meta.id === 'metronome') return metronomeLab(host);

  const gen = GENERATORS[meta.id];
  if (!gen) { host.append(el('<p class="muted">This drill is not available.</p>')); return null; }
  if (gen.choice) return runChoiceDrill(host, meta, gen, app);
  return runDrill(host, meta, gen, app);
}
