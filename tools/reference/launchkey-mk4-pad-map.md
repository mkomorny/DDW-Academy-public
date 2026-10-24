# Launchkey MK4 61 — pad-to-note map, derivation notes

The authoritative data lives in [`launchkey-mk4-pad-map.json`](launchkey-mk4-pad-map.json).
This file explains where it came from and how confident to be in each part.

## Why this needed extracting at all

Novation's *Launchkey Programming Reference Guide for Developers* prints the pad
note/LED-index tables as **rasterized images**, not text — pages 11 (DAW pad
mode) and 12 (Drum pad mode). Every text-extraction pass over this PDF in the
corpus (`pdftotext`, the NotebookLM scrape, and a first plain `pypdf.extract_text()`
pass) drops them silently. The prose around the tables survives; the tables
themselves do not.

Pulled out with `pypdf`'s `PageObject.images` (page 11 → `p11_I1.png`, page 12 →
`p12_I1.png` + `p12_I2.png`), copied here as `launchkey-drum-mode-grid-source.png`
and `launchkey-daw-mode-grid-source.png` for anyone who wants to re-derive this by eye.

## What's certain vs. inferred

**Certain — read directly off the image, cross-checked hex against decimal**
(each grid is printed twice in the PDF, once per encoding, and the two encodings
agree, e.g. `28h = 40`, `2Fh = 47`):

- Drum mode uses MIDI notes **36–51** on **channel 10**, note-on status byte
  `0x9A`, and — per the PDF's own sentence immediately above the table — those
  same numbers **are also the LED colouring indices**. Not two separate tables
  merged; one table, stated to serve both purposes.
- DAW mode uses notes **96–103** and **112–119** on **channel 1**, status byte `0x90`.
- The encoder CC block (page 12, second image) is CC **21–28** on channel 16.

**Inferred, but from independent corroborating text, not guessed:**

- *Which physical row is "top" vs "bottom".* The image itself doesn't label
  physical position — it's just two rows of boxes. Orientation was resolved
  using two independent facts stated elsewhere in the corpus: (1) Novation's
  own docs say notes increase "left to right, bottom to top", and (2) note 36
  (=C1) is stated to be the bottom-left pad. Applying that rule consistently to
  both the Drum and DAW grids gives the `row0_bottom` / `row1_top` split in the JSON.

- **The most important derived fact in this file:** the 16 Drum-mode pads are
  **not** one contiguous chromatic run. They split into two 2×4 blocks — pads
  1–4 (left) and pads 5–8 (right) — and *within each block* the notes go
  bottom-row-then-top-row before advancing to the next block:

  ```
  physical top row:     40  41  42  43  |  48  49  50  51
  physical bottom row:  36  37  38  39  |  44  45  46  47
                         └── left half ──┘  └── right half ─┘
  ```

  This isn't written down as prose anywhere in the 5,000+ file corpus — it
  falls straight out of the numbers once you plot them on the physical grid.
  It also explains *why* it's built this way: split this exact way, the 16
  pads map cleanly onto a **4×4 Ableton Drum Rack** (bottom-left quadrant →
  Rack row 1, top-left → row 2, bottom-right → row 3, top-right → row 4).
  That's the layout the drum course should teach against, since it's what a
  learner will actually see light up in Live.

## What still needs a hardware check

- The rack-row-to-quadrant correspondence assumes Ableton's Drum Rack draws
  its own row 1 at the bottom of its 4×4 view. That's a Live UI convention,
  not something this PDF can confirm — worth a 30-second check against a real
  Drum Rack before this becomes a taught "fact" in a lesson. The note-number
  ↔ physical-quadrant mapping itself doesn't depend on that and is solid.
- DAW-mode row orientation (96–103 vs 112–119) rests on the same inferred rule
  as Drum mode but has no independent C1-style anchor to confirm it. Low
  stakes either way — DAW mode isn't used by the drum curriculum.
