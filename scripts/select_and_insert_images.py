#!/usr/bin/env python3
"""Select relevant images per solution page and insert Markdown image refs."""

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "pages"
ASSETS = ROOT / "web" / "public" / "assets"
WORK = ROOT / "scripts" / "image-work"
PAGE_IMAGES = WORK / "page_images.json"
SELECTED = WORK / "selected_images.json"

SKIP_RE = re.compile(
    r"(logo|sprite|icon|favicon|flag-|payment|badge|woocommerce|cart|"
    r"labels-\d|tapes-\d|tags\.png|printers-?\d|accessories|"
    r"check-circle|duotone|\.svg$|sample-kit|iso-|certified|"
    r"facebook|twitter|linkedin|youtube|instagram)",
    re.I,
)

SLUG_FROM_PATH = {
    "/solutions/animal-healthcare/": "animal-healthcare",
    "/solutions/autoclave-labels/": "autoclave-labels",
    "/solutions/automated-labels/": "automated-labels",
    "/solutions/biobanking-labels/": "biobanking-labels",
    "/solutions/cannabis-labels/": "cannabis-labels",
    "/solutions/chemical-container-labeling/": "chemical-container-labeling",
    "/solutions/chemical-container-labeling-2/": "chemical-container-labeling",
    "/solutions/clinical-data-printing-2/": "clinical-data-printing-2",
    "/solutions/clinical-trial-labels/": "clinical-trial-labels",
    "/solutions/covid-19-laboratory-labels/": "covid-19-laboratory-labels",
    "/solutions/cryogenic-clinical-requisition-forms/": "cryogenic-clinical-requisition-forms",
    "/solutions/cryogenic-labels/": "cryogenic-labels",
    "/solutions/cryostuck/": "cryostuck",
    "/solutions/custom-laboratory-labels/": "custom-laboratory-labels",
    "/solutions/deep-freeze/": "deep-freeze",
    "/solutions/dymo-compatible-laboratory-labels/": "dymo-compatible-laboratory-labels",
    "/solutions/dymo-labelwriter-550/": "dymo-labelwriter-550",
    "/solutions/dymo-labelwriter-550-2/": "dymo-labelwriter-550",
    "/solutions/ga-international-cody-3-printer/": "ga-international-cody-3-printer",
    "/solutions/gatorcut/": "gatorcut",
    "/solutions/histology-labels/": "histology-labels",
    "/solutions/industrial-labels/": "industrial-labels",
    "/solutions/ivf-labeling-solutions/": "ivf-labeling-solutions",
    "/solutions/lab-tapes/": "lab-tapes",
    "/solutions/label-printing-solutions/": "label-printing-solutions",
    "/solutions/label-software/": "label-software",
    "/solutions/labels-for-hard-to-stick-surfaces/": "labels-for-hard-to-stick-surfaces",
    "/solutions/laboratory-labels/": "laboratory-labels",
    "/solutions/microscope-slide-over-labeling/": "microscope-slide-over-labeling",
    "/solutions/pcr-labels-and-tags/": "pcr-labels-and-tags",
    "/solutions/pre-labeled-labware/": "pre-labeled-labware",
    "/solutions/resitag-2/": "resitag-2",
    "/solutions/rfid-labels-tags/": "rfid-labels-tags",
    "/solutions/snappeel-labels/": "snappeel-labels",
    "/solutions/snappeel-2/": "snappeel-labels",
    "/solutions/vaccine-labels/": "vaccine-labels",
    "/solutions/xylene-chemical-resistant-labels/": "xylene-chemical-resistant-labels",
}


def filename_for(url: str) -> str:
    name = unquote(Path(urlparse(url).path).name)
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name)
    return name


def canonicalize(url: str) -> str:
    url = url.replace("https://www.labtag.com", "https://cdn.labtag.com")
    url = re.sub(r"-\d+x\d+(?=\.(?:jpe?g|png|webp|gif))", "", url, flags=re.I)
    url = re.sub(r"-scaled(?=\.)", "", url, flags=re.I)
    return url


def usable(img: dict) -> bool:
    src = img.get("src") or ""
    if not src or SKIP_RE.search(src):
        return False
    if src.lower().endswith(".svg"):
        return False
    return True


def score(img: dict) -> int:
    w = img.get("w") or 0
    h = img.get("h") or 0
    s = w * h
    if img.get("role") == "hero":
        s += 5_000_000
    src = img.get("src", "").lower()
    if any(k in src for k in ("step", "use", "product", "vial", "label", "printer", "kit")):
        s += 50_000
    return s


def select_for_slug(images: list[dict], limit: int = 6) -> list[dict]:
    ranked = sorted((i for i in images if usable(i)), key=score, reverse=True)
    chosen: list[dict] = []
    seen_keys: set[str] = set()
    seen_files: set[str] = set()
    for img in ranked:
        src = canonicalize(img["src"]).replace("https://www.labtag.com", "https://cdn.labtag.com")
        key = src
        file = filename_for(src)
        if key in seen_keys or file in seen_files:
            continue
        seen_keys.add(key)
        seen_files.add(file)
        chosen.append(
            {
                "src": src,
                "alt": (img.get("alt") or "").strip(),
                "role": img.get("role") or "content",
                "file": file,
            }
        )
        if len(chosen) >= limit:
            break
    heroes = [i for i in chosen if i["role"] == "hero"]
    rest = [i for i in chosen if i["role"] != "hero"]
    return (heroes[:1] + rest)[:limit]


def asset_md(slug: str, file: str, alt: str, src: str) -> str:
    safe_alt = alt.replace("]", "\\]") or file
    local = f"/assets/{slug}/{file}"
    # Local file first; CDN URL kept as title for onError fallback in the viewer.
    return f'![{safe_alt}]({local} "{src}")'


def strip_existing_images(text: str) -> str:
    text = re.sub(r"\n!\[.*?\]\([^\)]+\)\n?", "\n", text)
    text = re.sub(r"\n## Product images\n+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def insert_images(md_text: str, images: list[dict], slug: str) -> str:
    md_text = strip_existing_images(md_text)
    if not images:
        return md_text

    lines = md_text.splitlines()
    i = 0
    while i < len(lines) and not lines[i].startswith("# "):
        i += 1
    i += 1
    while i < len(lines) and not lines[i].strip():
        i += 1
    if i < len(lines) and lines[i].startswith("Source"):
        i += 1
        while i < len(lines) and (
            lines[i].startswith("- ") or lines[i].startswith("[") or not lines[i].strip()
        ):
            i += 1
        while i < len(lines) and not lines[i].strip():
            i += 1

    hero = images[0]
    hero_md = asset_md(slug, hero["file"], hero["alt"] or slug, hero["src"])
    body = lines[:i] + ["", hero_md, ""] + lines[i:]

    extras = images[1:]
    if extras:
        gallery = ["", "## Product images", ""]
        for img in extras:
            gallery.append(asset_md(slug, img["file"], img["alt"] or img["file"], img["src"]))
            gallery.append("")
        text = "\n".join(body)
        m = re.search(r"\n## (Need Expert|Frequently Asked|Get in Touch|Make Your Project)", text)
        if m:
            pos = m.start()
            text = text[:pos] + "\n" + "\n".join(gallery) + text[pos:]
        else:
            text = text.rstrip() + "\n" + "\n".join(gallery)
        return text.rstrip() + "\n"
    return "\n".join(body).rstrip() + "\n"


def main() -> None:
    raw = json.loads(PAGE_IMAGES.read_text(encoding="utf-8"))
    by_slug: dict[str, list[dict]] = {}
    for path, images in raw.items():
        slug = SLUG_FROM_PATH.get(path)
        if not slug:
            continue
        by_slug.setdefault(slug, []).extend(images)

    selected: dict[str, list[dict]] = {}
    for slug, images in sorted(by_slug.items()):
        picks = select_for_slug(images)
        selected[slug] = picks
        ASSETS.joinpath(slug).mkdir(parents=True, exist_ok=True)
        md_path = PAGES / f"{slug}.md"
        if md_path.exists():
            md_path.write_text(insert_images(md_path.read_text(encoding="utf-8"), picks, slug), encoding="utf-8")

    SELECTED.write_text(json.dumps(selected, indent=2), encoding="utf-8")
    total = sum(len(v) for v in selected.values())
    print(f"Selected {total} images across {len(selected)} pages -> {SELECTED}")


if __name__ == "__main__":
    main()
