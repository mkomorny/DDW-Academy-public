"""
Generate the theme stylesheet and picker manifest from the palette assignments.

Reads:   B:\\My Apps\\COLOR THEME ASSIGNMENTS.txt   (one theme per line)
Writes:  src/renderer/themes.css                    ([data-theme] blocks)
         src/data/themes.json                       (names + swatches for the picker)

Each source line looks like:
    synthwave: bg: #0c0a18, bg2: #150f29, bg3: #1a1334, accent: #ff2ec4, ...

Themes declare only the contract variables (bg/bg2/bg3, accent/accent2/accent3,
text/text2/text3). Every other colour the app uses is DERIVED from those in
styles.css, so a theme can never break the layout — it can only recolour it.

Usage:  python tools/build_themes.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
SOURCES = [
    Path(r"B:\My Apps\COLOR THEME ASSIGNMENTS.txt"),
    Path(r"B:\My Apps\Color Themes Instructions.txt"),
]
OUT_CSS = BASE / "src" / "renderer" / "themes.css"
OUT_JSON = BASE / "src" / "data" / "themes.json"

KEYS = ("bg", "bg2", "bg3", "accent", "accent2", "accent3", "text", "text2", "text3")
REQUIRED = ("bg", "bg2", "bg3", "accent", "accent2", "text", "text2", "text3")

LINE_RE = re.compile(r"^([a-z0-9][a-z0-9-]*)\s*:\s*(.+)$", re.I)
PAIR_RE = re.compile(r"\b(bg3|bg2|bg|accent3|accent2|accent|text3|text2|text)\s*:\s*(#[0-9a-fA-F]{3,8})")

# Human-friendly grouping for the picker, matched against the theme name.
GROUPS = [
    ("Light", lambda n, t: _luma(t["bg"]) > 0.55),
    ("Neon & Synthwave", lambda n, t: any(k in n for k in (
        "synthwave", "neon", "cyber", "vapor", "laser", "plasma", "outrun", "arcade",
        "glow", "tokyo", "rave", "blacklight", "grid", "terminal", "acid", "toxic",
        "radioactive", "hazard", "festival", "carnival-chaos", "rainbow-grid"))),
    ("High Contrast", lambda n, t: any(k in n for k in (
        "pure-black", "ink-on-paper", "safety", "stark", "maximum", "void-lime",
        "orange-hazard", "royal-blue-strike", "three-tone", "electric-cyan"))),
    ("Bold & Signal", lambda n, t: any(k in n for k in (
        "primary", "traffic", "sirens", "megaphone", "construction", "industrial",
        "concrete", "brick", "full-spectrum", "voltage", "signal", "stadium",
        "comic", "pop-art", "bauhaus", "fireworks", "liquid-mercury", "ultraviolet"))),
    ("Muted & Editorial", lambda n, t: any(k in n for k in (
        "slate", "charcoal", "graphite", "carbon", "moss", "espresso", "linen",
        "editorial", "workshop", "harvest", "botanical", "paper", "cream", "sand",
        "cloud", "coal", "steel", "obsidian", "ink-teal", "indigo-lime", "plum-gold",
        "maroon", "midnight-three", "cobalt", "forest-three", "spectrum", "sorbet",
        "confetti", "deep-current", "kaleidoscope"))),
]


def _luma(hex_color: str) -> float:
    """Perceptual lightness 0..1, used to decide light vs dark grouping."""
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in (r, g, b)]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def title_case(slug: str) -> str:
    small = {"and", "of", "on", "the", "in", "a"}
    words = slug.replace("-", " ").split()
    out = []
    for i, w in enumerate(words):
        if w.lower() in ("usa", "aaa"):
            out.append(w.upper())
        elif i and w.lower() in small:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)


def parse(text: str) -> dict[str, dict[str, str]]:
    found: dict[str, dict[str, str]] = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or ":" not in line:
            continue
        m = LINE_RE.match(line)
        if not m:
            continue
        name = m.group(1).lower()
        pairs = dict(PAIR_RE.findall(line))
        if not pairs:
            continue
        # Normalise 3-digit hex and reject truncated values like "#B0B".
        # Keep the raw length so the merge step can tell a real 3-digit hex
        # from a value truncated mid-write (see main()).
        clean = {}
        for k, v in pairs.items():
            v = v.strip().lower()
            if len(v) not in (4, 7):
                continue                          # malformed, drop it
            clean[k] = v
        if all(k in clean for k in REQUIRED):
            found[name] = clean
    return found


def group_for(name: str, theme: dict[str, str]) -> str:
    for label, test in GROUPS:
        try:
            if test(name, theme):
                return label
        except Exception:
            pass
    return "Colour"


def main() -> int:
    merged: dict[str, dict[str, str]] = {}
    repaired: list[str] = []

    for src in SOURCES:
        if not src.exists():
            print(f"note: {src} not found, skipping")
            continue
        got = parse(src.read_text(encoding="utf-8", errors="replace"))
        for name, theme in got.items():
            if name not in merged:
                merged[name] = dict(theme)
                continue
            for k, v in theme.items():
                have = merged[name].get(k)
                # On conflict prefer the LONGER hex. The two source files are
                # otherwise identical; the only disagreement is a value cut off
                # mid-write ("#b0b" vs "#b0b0b0"). Expanding "#b0b" as a 3-digit
                # hex would silently turn a grey into magenta.
                if have is None or len(v) > len(have):
                    merged[name][k] = v
                    if have is not None:
                        repaired.append(f"{name}.{k} {have}->{v}")

    if not merged:
        print("ERROR: no themes parsed")
        return 1

    # Expand any remaining genuine 3-digit hex values now that merging is done.
    for theme in merged.values():
        for k, v in list(theme.items()):
            if len(v) == 4:
                theme[k] = "#" + "".join(c * 2 for c in v[1:])

    # The app's original palette, kept as the default so the shipped look is
    # unchanged unless the user picks something else.
    default = {
        "bg": "#0f1117", "bg2": "#151823", "bg3": "#1c2030",
        "accent": "#c9a227", "accent2": "#4dd6c1", "accent3": "#e0a458",
        "text": "#e8e6e1", "text2": "#b3b0a9", "text3": "#7d7a75",
    }

    ordered = sorted(merged.items())

    # ---------------------------------------------------------------- CSS --
    css = [
        "/* GENERATED by tools/build_themes.py — do not edit by hand.",
        f" * {len(ordered)} themes. Each declares only the contract variables;",
        " * every other app colour is derived from these in styles.css.",
        " */",
        "",
    ]
    for name, t in ordered:
        decls = " ".join(
            f"--{k}: {t[k]};" for k in KEYS if k in t
        )
        # accent3 is optional in the source data; fall back to accent2.
        if "accent3" not in t:
            decls += f" --accent3: {t['accent2']};"
        css.append(f':root[data-theme="{name}"] {{ {decls} }}')
    OUT_CSS.write_text("\n".join(css) + "\n", encoding="utf-8")

    # --------------------------------------------------------------- JSON --
    manifest = [{
        "id": "conservatory",
        "name": "Conservatory (default)",
        "group": "Light" if _luma(default["bg"]) > 0.55 else "Colour",
        **default,
    }]
    manifest[0]["group"] = "Default"

    for name, t in ordered:
        entry = {"id": name, "name": title_case(name), "group": group_for(name, t)}
        entry.update({k: t.get(k, t["accent2"]) for k in KEYS})
        entry["light"] = _luma(t["bg"]) > 0.55
        manifest.append(entry)
    manifest[0]["light"] = False

    OUT_JSON.write_text(json.dumps({"themes": manifest}, indent=1), encoding="utf-8")

    # -------------------------------------------------------------- report --
    print(f"themes parsed : {len(ordered)} (+1 built-in default)")
    print(f"css           : {OUT_CSS}")
    print(f"json          : {OUT_JSON}")
    if repaired:
        print(f"repaired keys : {len(repaired)} -> {', '.join(repaired)}")

    from collections import Counter
    for group, n in Counter(m["group"] for m in manifest).most_common():
        print(f"  {group:<20} {n}")
    lights = sum(1 for m in manifest if m["light"])
    print(f"  (light themes: {lights}, dark: {len(manifest) - lights})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
