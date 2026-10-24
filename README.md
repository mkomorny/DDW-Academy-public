# DDW Academy

> **Snapshot V.0.12** — 18 Aug 2026 — remaining-courses-build at `master` `c20302a`.
> Based on [DDW-Academy-V.0.11](https://github.com/mkomorny/DDW-Academy-V.0.11) (created 18 Aug 2026 15:44 UTC; prior numbered upload [V.0.10](https://github.com/mkomorny/DDW-Academy-V.0.10) created 18 Aug 2026 05:37 UTC).
> Change log: [`App Changes Tracker.html`](./App%20Changes%20Tracker.html) (same directory).

An interactive Windows desktop academy covering piano technique, music theory, and AI tools
for music production — built from the 178-document Research library in the parent folder
and Miranda's rewritten course packs.

> **Your PDFs were never modified.** They were opened read-only for text extraction. Everything
> this project generated lives inside `PianoCourseApp/`.

---

## Running it

| What | Where |
|------|-------|
| **Installer** | `dist/DDW Academy Setup 1.2.0.exe` — installs with a Start Menu and desktop shortcut |
| **Portable** | `dist/DDW Academy 1.2.0.exe` — single file, no installation |
| **Unpacked** | `dist/win-unpacked/DDW Academy.exe` |

From source:

```bash
npm start
```

Rebuild the installers:

```bash
npm run dist
```

---

## What's in this snapshot

| | |
|---|---|
| Tracks shipping | Piano Playing for Beginners; AI Tools for Music Production |
| Tracks registered, still Coming Soon | 12 — Drums, Ableton Live 12, Launchkey MK4, Sound Design, Music Production, DJ'ing, Max for Live, Ableton Note, Bass Station II, Komplete Kontrol, Spatial Audio, Audio DSP |
| Combined curriculum | 29 levels · 85 modules · 286 lessons · 520 section checks |
| Piano | 16 levels · 51 modules · 252 lessons · 11 gates (A–K) |
| AI Tools | 13 required levels · 34 modules · 34 lessons · 11 gates (A–K). Module 7 (Live Suite Stem Separation) is BONUS/PARKED and not wired |
| Practice / Games / Themes / Scales | 17 drills · 7 games · 148 themes · 63 mined scales |

Six question types are supported: multiple choice, multiple-select, free text, ordering,
**play-it-on-the-keyboard** (graded via MIDI), and **listening** (ear training). Every question
that needs a keyboard or ear is paired with a written equivalent for Reader Mode (see below).

### Sections

- **Learn** — the curriculum. Every lesson is delivered a short section at a time — one idea,
  then a check on it — rather than as one long scroll, so the drill comes immediately after the
  idea it tests. Sections mix prose with live interactive blocks: playable keyboards, staff
  notation, scale explorers, chord builders, the circle of fifths, rhythm players, chord
  progressions, and inline MIDI challenges.
- **Practice** — 17 MIDI-graded drills in six categories, each with unbounded difficulty
  (see [Practice tiers](#practice-tiers) below):
  - *Fundamentals* — note finder, interval builder
  - *Scales & Modes* — scale runner (with source fingerings), mode runner
  - *Chords* — triad builder, inversion drill, seventh chords, extended & altered, chord speller,
    arpeggio runner
  - *Harmony & Progressions* — diatonic harmony, progression trainer, cadence trainer,
    circle of fifths
  - *Jazz & Blues* — 12-bar blues trainer, ii–V–I trainer
  - *Tools* — metronome & tempo lab
- **Games** — 7 timed, scored games: Note Race, Staff Crawler, Interval Ears, Chord Quality ID,
  Key Signature Blitz, Mode Matcher, Rhythm Clap-Back.
- **Reference** — permanent charts: the full scale library, chord chart, key signatures, intervals
  with reference songs, terms/dynamics/tempo/form, and a source index mapping every PDF to the
  modules that use it.

**Navigation is never locked.** You can jump to any level, module or lesson at any time.
Checkpoints record readiness; they do not gate access.

---

## Practice tiers

Every drill starts at tier 1 and climbs **indefinitely**. There is no maximum tier.

- **Advancing** — 10 correct answers at your current tier, with at least 80% accuracy, unlocks
  the next one and moves you there.
- **Choosing where to start** — the *Start at* selector on every drill lists every tier you have
  ever unlocked. Pick any of them. Dropping back to tier 1 for a warm-up never costs you the
  higher tiers.
- **Going backwards** — only the drill's own *Reset progress* button does that. Nothing else
  lowers an unlocked tier.

Early tiers walk a content ladder (more roots, more chord qualities, more keys). Once that is
exhausted the numeric knobs take over and grow without bound — chain length, number of scales
run back to back, choruses of blues, laps of the circle of fifths, and a per-question clock that
shrinks asymptotically towards 1.2 seconds.

Two knobs are deliberately capped, because the hardware is: octave span stops at five (the drill
keyboard spans MIDI 36–96) and interval compounding stops at four octaves. Past those points the
drills keep getting harder by chaining more runs rather than asking for notes that do not exist.

---

## Color themes

148 themes ship with the app. The **Theme** and **⤨** buttons in the sidebar open the picker and
jump to a random theme respectively.

The picker supports live preview on hover (moving away reverts), text search, and filtering by
group — Default, Light, Neon & Synthwave, High Contrast, Bold & Signal, Muted & Editorial, Color.
Your choice is saved with the rest of your progress.

Themes change **color only, never layout**. Each one sets just nine variables — `--bg`, `--bg2`,
`--bg3`, `--accent`, `--accent2`, `--accent3`, `--text`, `--text2`, `--text3` — and everything the
app paints with is derived from those via `color-mix()`. A theme has no vocabulary for spacing,
radii or borders, so it structurally cannot alter the design. The default theme, `conservatory`,
is the app's original palette and corresponds to the absence of a `data-theme` attribute.

---

## Instruments

The dock keyboard's **Sound** picker plays anything you do — lessons, the
Listen buttons, practice, games, reference — through 20 sampled instruments
across six groups: Keyboards, Guitars & Plucked, Strings, Woodwind, Brass,
and Tuned Percussion. Grand Piano (Salamander) is the default.

Two things always stay on the piano regardless of what's selected, on
purpose: **ear-training questions** (so graded listening is judged on a
consistent timbre) and **rhythm clicks** (metronome and clap-back drills,
where a sharp percussive attack is the point).

Switching instruments is instant if it's already been used this session;
otherwise the dock shows *loading…* for a moment while it decodes, and keys
keep sounding on the piano in the meantime rather than going silent. Notes
outside an instrument's natural range (a xylophone only spans a few octaves)
are folded to the nearest octave that exists rather than staying dead —
those keys dim slightly on the dock to show what's happening.

Instrument samples are vendored from the
[tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
project (CC BY 3.0, same license as the bundled piano) via
`tools/fetch_instruments.mjs`, thinned to the note spacing the sampler
actually needs. Full attribution is in `src/renderer/samples/CREDITS.md`.
Per-instrument loudness was measured against the piano with
`tools/calibrate-gains.mjs` rather than guessed — see that script for the
method.

## Input

Three input methods, all accepted everywhere:

1. **MIDI keyboard** — plug in any USB MIDI device; it is detected automatically, no restart.
2. **On-screen keyboard** — the dock at the bottom of the window, playable with the mouse
   (drag across keys to glissando).
3. **Computer keyboard** — the `Z` row is a lower octave, the `Q` row the one above:
   `Z S X D C V G B H N J M` / `Q 2 W 3 E R 5 T 6 Y 7 U`

Sound comes from a built-in additive synthesizer, so everything works with no hardware attached.

---

## Interactive / Reader Mode

Every check in the course can be answered two ways, chosen in **Settings → How you want to
work**, or from the small toggle in the rail above each lesson section:

- **Interactive** (default) — play the answer on a keyboard, or identify it by ear. This is the
  app's core premise: MIDI in, graded in real time.
- **Reader** — every question becomes a written one (multiple choice, ordering, or typed text),
  and the `tryIt` challenges embedded in lesson prose spell out their expected notes as text
  instead of waiting for input that will never arrive. Useful away from an instrument — on a
  laptop, on a train.

Switching mid-lesson re-renders the current section in place; nothing is lost. The course
validator (`tools/validate-course.mjs`) enforces that every keyboard- or ear-graded question has
a written counterpart, so a Reader-Mode learner can never hit an unanswerable check.

---

## Layout

```
PianoCourseApp/
├── src/
│   ├── main/            Electron main process + preload bridge
│   ├── data/
│   │   ├── scales.json  63 scales mined from the PDF corpus
│   │   └── themes.json  148 color themes (picker manifest)
│   └── renderer/
│       ├── themes.css   one :root[data-theme=…] block per theme
│       ├── samples/     piano/ (Salamander) + 19 vendored instrument banks, CREDITS.md
│       ├── lib/         theory.js · midi.js · audio.js · instruments.js · store.js · themes.js
│       ├── components/  keyboard.js (SVG piano) · staff.js (SVG notation)
│       ├── course/      schema.js + level0-7.js  ← all course content
│       └── views/       home · learn · practice · games · reference · settings
├── content/
│   ├── extracted/       plain-text of all 178 PDFs (read-only extraction)
│   └── corpus-index.json
├── tools/               extraction, mining and test scripts
└── dist/                built installers
```

### Regenerating the data

```bash
python tools/extract_pdfs.py    # read-only: PDFs -> content/extracted/*.txt
python tools/mine_scales.py     # extracted text -> src/data/scales.json
python tools/build_themes.py    # theme txt files -> themes.css + themes.json
node tools/fetch_instruments.mjs   # vendors sample banks -> src/renderer/samples/, instrument-roots.generated.js
node tools/calibrate-gains.mjs     # measures new/changed banks -> loudness numbers for instruments.js
```

`extract_pdfs.py` opens each PDF with a read-only handle and writes only into
`content/extracted/`. It never touches the source directory.

`fetch_instruments.mjs` is idempotent (safe to re-run; skips files already present) and never
touches `samples/piano/`. See its header comment for `--refresh`/`--force`/`--prune`/`--max-gap`.
A calibration run doesn't change anything by itself — its printed `gain` values are hand-copied
into `instruments.js`'s `META` table, the same split as roots-generated-vs-hand-tuned everywhere
else in this file.

---

## Tests

```bash
node tools/test-theory.mjs        # 193 assertions on the theory engine
node tools/validate-course.mjs    # structural integrity of all course content
node tools/test-instruments.mjs   # instrument manifest: roots, ranges, gain safety, disk cross-check
```

`test-theory.mjs` covers scale spelling in all keys, diatonic harmony, chord identification,
inversions, key signature integrity, and validates every mined scale (steps sum to 12, realizes
in all 12 keys).

`validate-course.mjs` checks every question shape (answer indices in range, `order` answers a
permutation of their items, `multi` answers ascending, no duplicate `order` labels), that every
`play`/`ear` question is wrapped with a written Reader-Mode counterpart, that the source index is
non-empty, and — during authoring — that no section's check verbatim-duplicates its own module
quiz.

For an end-to-end check against the packaged app, launch it with
`--remote-debugging-port=9333` and run:

```bash
node tools/smoke-electron.mjs
```

This runs 12 checks: the preload bridge, that Node is not leaked into the renderer, IPC progress
persistence, the Web MIDI permission grant, the audio engine, that every route renders, that all
148 themes load and the choice survives a write to disk, and that drill tiers advance, retain
their unlock when you pick a lower tier, and clear on reset.

---

## Notes on the source material

Two data issues in the source PDFs were found and handled rather than propagated:

1. **`Harmonic Major Scales.pdf`** prints `Semitones: 2-2-1-2-1-2-1`, which sums to **11**.
   Its own `Formula:` and `Intervals:` rows both give `2-2-1-2-1-3-1` (= 12). The corrected
   figure is used, and the correction is recorded in `tools/scales-curated.json`.
2. **`Melodic Minor Scales.pdf`** writes `Semitones :` with a space before the colon, so a
   strict parser silently drops it. The miner's regex tolerates this.

The miner refuses any scale whose steps do not sum to 12, so a bad row fails loudly rather
than quietly teaching a broken scale.

Ten PDFs define more than one scale on a single page. The miner will not guess which formula
belongs to which heading, so those are curated by hand in `tools/scales-curated.json`, each
read directly off the named PDF.

The two theme source files had one disagreement: `electric-cyanblack.text3` reads `#B0B0B0` in
one and `#B0B` in the other — a value cut off mid-write. `#B0B` is *valid* three-digit CSS that
expands to magenta, so a naive parser would silently turn a grey into magenta. `build_themes.py`
prefers the longer hex on conflict, and only expands three-digit values after merging.

---

## Progress

Saved to `%APPDATA%\DDW Academy\progress.json` — outside the app directory, so
reinstalling or rebuilding never erases it. Writes are atomic (temp file + rename), so a crash
mid-save cannot corrupt existing history. Settings → *Show the progress file* opens its location.

The app was renamed from "Keyboard Conservatory"; on first launch after upgrading, it copies any
progress found in the old `%APPDATA%\Keyboard Conservatory\progress.json` into the new profile
folder (see `migrateLegacyProgress` in `src/main/main.js`). The legacy file is left in place, not moved.

The file holds lessons viewed and completed, quiz and drill scores, game high scores, checkpoints,
practice time and streak, your unlocked and selected tier for every drill, and your chosen theme.
Loading merges over the current defaults, so a progress file written by an older version never
loses keys a newer one expects.
