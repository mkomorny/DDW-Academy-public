"""
Read-only extraction of the Research PDF library into plain text.

SAFETY CONTRACT
---------------
This script opens every PDF with a read-only handle ('rb') and NEVER writes,
moves, renames, or deletes anything inside the source directory. All output is
written into PianoCourseApp/content/extracted/.

Usage:  python tools/extract_pdfs.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

SRC_DIR = Path(__file__).resolve().parents[2]          # ...\Research
OUT_DIR = Path(__file__).resolve().parents[1] / "content" / "extracted"
INDEX_PATH = Path(__file__).resolve().parents[1] / "content" / "corpus-index.json"

# Boilerplate that appears on nearly every page of these web-print PDFs.
NOISE_PATTERNS = [
    re.compile(r"^\s*\d+\s*/\s*\d+\s*$"),                 # "3 / 12" page markers
    re.compile(r"https?://\S+\s*$"),                       # trailing source URLs
    re.compile(r"^\s*Print Friendly\s*$", re.I),
    re.compile(r"^\s*Skip to content\s*$", re.I),
    re.compile(r"^\s*(Share|Tweet|Pin it|Facebook|Twitter|Pinterest)\s*$", re.I),
    re.compile(r"^\s*Leave a (Reply|Comment)\s*$", re.I),
    re.compile(r"^\s*Your email address will not be published", re.I),
]


def clean(text: str) -> str:
    """Strip web-print boilerplate and normalise whitespace, preserving paragraphs."""
    lines = []
    for raw in text.splitlines():
        line = raw.replace("\xa0", " ").rstrip()
        if any(p.search(line) for p in NOISE_PATTERNS):
            continue
        lines.append(line)

    out = "\n".join(lines)
    out = re.sub(r"\n{3,}", "\n\n", out)      # collapse runs of blank lines
    out = re.sub(r"[ \t]{2,}", " ", out)
    return out.strip()


def slugify(name: str) -> str:
    s = name.lower().replace(".pdf", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-{2,}", "-", s).strip("-")


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(p for p in SRC_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"No PDFs found in {SRC_DIR}", file=sys.stderr)
        return 1

    index = []
    failures = []

    for i, pdf in enumerate(pdfs, 1):
        slug = slugify(pdf.name)
        try:
            # 'rb' — read-only. pypdf never writes back to this handle.
            with pdf.open("rb") as fh:
                reader = PdfReader(fh)
                pages = [(pg.extract_text() or "") for pg in reader.pages]
                n_pages = len(reader.pages)
            text = clean("\n".join(pages))
        except Exception as exc:                    # noqa: BLE001 - report and continue
            failures.append({"file": pdf.name, "error": f"{type(exc).__name__}: {exc}"})
            print(f"[{i:3}/{len(pdfs)}] FAIL {pdf.name}: {exc}")
            continue

        (OUT_DIR / f"{slug}.txt").write_text(text, encoding="utf-8")
        words = len(text.split())
        index.append(
            {
                "source": pdf.name,
                "slug": slug,
                "pages": n_pages,
                "words": words,
                "chars": len(text),
                # Flags a PDF whose text layer is thin => mostly scanned images.
                "textLayerThin": words < 40 * max(n_pages, 1) // 10,
            }
        )
        print(f"[{i:3}/{len(pdfs)}] ok   {pdf.name}  ({n_pages}p, {words}w)")

    INDEX_PATH.write_text(
        json.dumps({"documents": index, "failures": failures}, indent=2),
        encoding="utf-8",
    )

    total_words = sum(d["words"] for d in index)
    thin = [d["source"] for d in index if d["textLayerThin"]]
    print("\n=== SUMMARY ===")
    print(f"extracted : {len(index)} / {len(pdfs)}")
    print(f"words     : {total_words:,}")
    print(f"thin text : {len(thin)}  (likely image-only pages)")
    for t in thin:
        print(f"    - {t}")
    if failures:
        print(f"failures  : {len(failures)}")
        for f in failures:
            print(f"    - {f['file']}: {f['error']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
