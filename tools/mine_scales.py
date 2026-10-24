"""
Mine scale definitions out of the extracted corpus into src/data/scales.json.

The pianoscales.org PDFs share a rigid template:

    <Title>
    <prose description>
    C
    Notes: C, D, E, ...        [optionally: Fingering (LH): ... Fingering (RH): ...]
    ...
    Intervals: 1, 2, b3, ...
    Semitones: 2 - 1 - 2 - ...
    Formula: Whole, Half, Whole, ...

The `Semitones:` line is the authoritative machine-readable form: it yields the
scale's interval vector, which is what the app computes with. Note-name lines
give us the correct *spelling* per root, which formulas alone can't recover
(C# major vs Db major are the same keys, different names).

Usage:  python tools/mine_scales.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
EXTRACTED = BASE / "content" / "extracted"
OUT = BASE / "src" / "data" / "scales.json"

# Note the `\s*:` — at least one source PDF (Melodic Minor Scales.pdf) writes
# "Semitones :" with a space before the colon. A stricter pattern silently
# drops that scale from the library.
SEMI_RE = re.compile(r"Semitones\s*:\s*([0-9]+(?:\s*-\s*[0-9]+)+)")
INTERVALS_RE = re.compile(r"Intervals\s*:\s*([^\n]*?)(?:\s*Semitones\s*:|$)", re.M)
FORMULA_RE = re.compile(r"Formula\s*:\s*([A-Za-z, ]+)")
ALT_RE = re.compile(r"Alternate names?:\s*([^\n]+)")
TITLE_RE = re.compile(r"^Piano\s+(.+?)\s*$", re.M)
URL_RE = re.compile(r"pianoscales\.org/([a-z0-9\-]+)\.html")

# "C" / "C# / Db" / "D# /Eb" heading followed by a Notes: line
ROOT_BLOCK_RE = re.compile(
    r"^([A-G](?:#|b)?(?:\s*/\s*[A-G](?:#|b)?)?)\s*(?:Major|Minor)?\s*\n"
    r"Notes:\s*([^\n]+(?:\n(?!\s*[A-G][#b]?\s*$)[^\n]*)?)",
    re.M,
)
FING_LH_RE = re.compile(r"Fingering \(LH\):\s*([0-9,\s]+?)(?:\s*Fingering|\s*$)", re.S)
FING_RH_RE = re.compile(r"Fingering \(RH\):\s*([0-9,\s]+?)(?:\s*$|\n[A-G])", re.S)

NOTE_TOKEN = re.compile(r"^[A-G](?:#{1,2}|b{1,2})?$")

# Files whose text is engraved-notation only (no usable data).
SKIP = {"lydian-scales-note-names", "aeolian-scales-note-names",
        "mixolydian-scales-note-names", "locrian-scales-note-names",
        "minor-scales-note-names"}


def pitch_class(name: str) -> int | None:
    base = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    if not name or name[0] not in base:
        return None
    pc = base[name[0]]
    for ch in name[1:]:
        if ch == "#":
            pc += 1
        elif ch == "b":
            pc -= 1
        else:
            return None
    return pc % 12


def parse_notes_line(raw: str) -> list[str]:
    """Pull clean note tokens out of a 'Notes:' line, dropping fingering text."""
    raw = re.split(r"Fingering", raw)[0]
    raw = re.sub(r"\([^)]*\)", " ", raw)          # drop parenthetical respellings
    out = []
    for tok in re.split(r"[,\s]+", raw.strip()):
        tok = tok.strip()
        if NOTE_TOKEN.match(tok):
            out.append(tok)
    return out


def title_from(text: str, slug: str) -> str:
    m = TITLE_RE.search(text)
    if m:
        t = m.group(1).strip()
        t = re.sub(r"\s*\(.*?\)\s*$", "", t)      # trim trailing parenthetical
        return t
    return slug.replace("-", " ").title()


def main() -> int:
    scales = []
    skipped = []

    for txt in sorted(EXTRACTED.glob("*.txt")):
        slug = txt.stem
        if slug in SKIP:
            continue
        text = txt.read_text(encoding="utf-8")
        semis = SEMI_RE.findall(text)
        if not semis:
            continue

        # Only mine files with exactly one formula; multi-scale files are
        # curated by hand in scales-extra.json to avoid mis-pairing a formula
        # with the wrong heading.
        if len(set(s.replace(" ", "") for s in semis)) != 1:
            skipped.append({"slug": slug, "formulaCount": len(set(semis))})
            continue

        steps = [int(x) for x in re.split(r"\s*-\s*", semis[0].strip())]
        if sum(steps) != 12:
            skipped.append({"slug": slug, "reason": f"steps sum to {sum(steps)}"})
            continue

        iv = INTERVALS_RE.search(text)
        fm = FORMULA_RE.search(text)
        alt = ALT_RE.search(text)
        url = URL_RE.search(text)

        # Description: first substantial prose paragraph after the URL line.
        body = text.split("\n")
        desc_lines = []
        for line in body[1:]:
            s = line.strip()
            if not s or s.startswith("pianoscales.org") or s.startswith("Alternate"):
                continue
            if s.startswith("Notes:") or re.match(r"^[A-G][#b]?(\s*/.*)?$", s):
                break
            desc_lines.append(s)
            if len(" ".join(desc_lines)) > 420:
                break
        description = " ".join(desc_lines).strip()

        # Per-root spellings + fingerings
        roots = {}
        for m in ROOT_BLOCK_RE.finditer(text):
            head, notes_raw = m.group(1), m.group(2)
            notes = parse_notes_line(notes_raw)
            if len(notes) < 5:
                continue
            key = head.split("/")[0].strip()
            pc = pitch_class(key)
            if pc is None:
                continue
            entry = {"display": head.strip(), "notes": notes}
            lh = FING_LH_RE.search(notes_raw)
            rh = FING_RH_RE.search(notes_raw)
            if lh:
                entry["lh"] = [int(x) for x in re.findall(r"\d", lh.group(1))]
            if rh:
                entry["rh"] = [int(x) for x in re.findall(r"\d", rh.group(1))]
            roots[str(pc)] = entry

        scales.append(
            {
                "id": slug,
                "name": title_from(text, slug),
                "aliases": [a.strip() for a in re.split(r"[•,]", alt.group(1))] if alt else [],
                "slugUrl": url.group(1) if url else None,
                "steps": steps,
                "degrees": [d.strip() for d in iv.group(1).split(",")] if iv else [],
                "formulaWords": [w.strip() for w in fm.group(1).split(",")] if fm else [],
                "noteCount": len(steps),
                "description": description,
                "roots": roots,
                "source": slug,
            }
        )

    # Merge hand-curated entries for multi-scale PDFs. Curated wins on id clash.
    curated_path = Path(__file__).resolve().parent / "scales-curated.json"
    curated = json.loads(curated_path.read_text(encoding="utf-8"))["scales"]
    have = {s["id"] for s in scales}
    added = 0
    for c in curated:
        c.setdefault("roots", {})
        c.setdefault("formulaWords", [])
        c.setdefault("slugUrl", None)
        c["noteCount"] = len(c["steps"])
        c["curated"] = True
        if c["id"] in have:
            scales[:] = [s for s in scales if s["id"] != c["id"]]
        scales.append(c)
        added += 1

    # Validate every formula before it can reach the app.
    bad = [s["id"] for s in scales if sum(s["steps"]) != 12]
    if bad:
        raise SystemExit(f"ABORT: scales whose steps do not sum to 12: {bad}")

    scales.sort(key=lambda s: s["name"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"scales": scales}, indent=1), encoding="utf-8")

    print(f"curated: {added} scales merged from scales-curated.json")
    print(f"mined  : {len(scales)} scales -> {OUT}")
    print(f"skipped: {len(skipped)} multi-formula/invalid files")
    for s in skipped:
        print("   -", s)
    withroots = sum(1 for s in scales if s["roots"])
    withfing = sum(1 for s in scales if any("rh" in r for r in s["roots"].values()))
    print(f"with per-root spellings: {withroots}")
    print(f"with fingerings        : {withfing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
