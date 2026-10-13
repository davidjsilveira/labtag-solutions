#!/usr/bin/env python3
"""Select relevant images and insert them inline under matching Markdown sections."""

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "pages"
ASSETS = ROOT / "web" / "public" / "media"
WORK = ROOT / "scripts" / "image-work"
PAGE_IMAGES = WORK / "page_images.json"
SELECTED = WORK / "selected_images.json"
PLACEMENT = WORK / "image_placements.json"

SKIP_RE = re.compile(
    r"(logo|sprite|icon|favicon|flag-|payment|badge|woocommerce|cart|"
    r"labels-\d|tapes-\d|tags\.png|printers-?\d|accessories|"
    r"check-circle|duotone|\.svg$|sample-kit|iso-|certified|"
    r"facebook|twitter|linkedin|youtube|instagram)",
    re.I,
)

STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "labels",
    "label",
    "labtag",
    "use",
    "main",
    "image",
    "images",
    "tile",
    "thumb",
    "scaled",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "v1",
    "v2",
    "v3",
    "v4",
    "v5",
}

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

# Extra keyword aliases to improve section matching.
ALIASES = {
    "cryogenic": {"cryo", "liquid", "nitrogen", "straw", "frozen"},
    "autoclave": {"steriliz", "steri", "steam"},
    "chemical": {"xylene", "solvent", "xfla", "histolog"},
    "medication": {"pharmacy", "syringe", "vaccine", "dose"},
    "cage": {"chart", "cling", "aquarium", "terrarium"},
    "refrigerat": {"fridge", "cold", "istock"},
    "syringe": {"syra", "flag"},
    "rfid": {"smart", "ftt", "hologic", "track"},
    "printer": {"dymo", "cody", "zebra", "software", "connect"},
    "process": {"step", "peel", "snappeel"},
    "frozen": {"jtta", "cryo", "nitro"},
    "deep": {"freezer", "edft"},
    "histolog": {"slide", "paraf", "wax", "xylene"},
    "pcr": {"tube", "rack", "thermocycler"},
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


def tokens(text: str) -> set[str]:
    parts = re.split(r"[^a-z0-9]+", text.lower())
    out = {p for p in parts if len(p) >= 3 and p not in STOPWORDS}
    expanded = set(out)
    for token in list(out):
        for key, extras in ALIASES.items():
            if key in token or token in key:
                expanded |= extras
                expanded.add(key)
            if token in extras:
                expanded.add(key)
    return expanded


def select_for_slug(images: list[dict], limit: int = 10) -> list[dict]:
    ranked = sorted((i for i in images if usable(i)), key=score, reverse=True)
    chosen: list[dict] = []
    seen_keys: set[str] = set()
    seen_files: set[str] = set()
    for img in ranked:
        src = canonicalize(img["src"]).replace("https://www.labtag.com", "https://cdn.labtag.com")
        file = filename_for(src)
        if src in seen_keys or file in seen_files:
            continue
        # Prefer files that already exist locally when available.
        local = ASSETS / ""  # placeholder for typing
        seen_keys.add(src)
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


def prefer_local(slug: str, images: list[dict]) -> list[dict]:
    folder = ASSETS / slug
    if not folder.exists():
        return images
    local_files = {p.name for p in folder.iterdir() if p.is_file()}
    with_local = [i for i in images if i["file"] in local_files]
    without = [i for i in images if i["file"] not in local_files]
    # Keep all local images even beyond original selection if they look useful.
    extras = []
    for name in sorted(local_files):
        if any(i["file"] == name for i in with_local):
            continue
        if SKIP_RE.search(name):
            continue
        extras.append(
            {
                "src": f"https://cdn.labtag.com/wp-content/uploads/{name}",
                "alt": Path(name).stem.replace("-", " "),
                "role": "content",
                "file": name,
            }
        )
    merged = with_local + without + extras
    # Deduplicate by file
    seen: set[str] = set()
    out: list[dict] = []
    for img in merged:
        if img["file"] in seen:
            continue
        seen.add(img["file"])
        out.append(img)
    return out[:12]


def asset_md(slug: str, file: str, alt: str, src: str) -> str:
    safe_alt = (alt or file).replace("]", "\\]")
    local = f"/media/{slug}/{file}"
    # CDN first so images always render; local path kept as title for offline use.
    return f'![{safe_alt}]({src} "{local}")'


def strip_existing_images(text: str) -> str:
    text = re.sub(r"\n!\[.*?\]\([^\)]+\)\n?", "\n", text)
    text = re.sub(r"\n## Product images\n+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def find_sections(lines: list[str]) -> list[tuple[int, str]]:
    sections: list[tuple[int, str]] = []
    for idx, line in enumerate(lines):
        if line.startswith("## "):
            title = line[3:].strip()
            if re.match(r"(need expert|frequently asked|get in touch|make your project|product images)", title, re.I):
                continue
            sections.append((idx, title))
    return sections


def section_end(lines: list[str], start: int) -> int:
    i = start + 1
    while i < len(lines):
        if lines[i].startswith("## "):
            return i
        i += 1
    return len(lines)


def best_section(img: dict, sections: list[tuple[int, str]]) -> int | None:
    if not sections:
        return None
    hay = f"{img.get('alt', '')} {img.get('file', '')}"
    img_tokens = tokens(hay)
    step_match = re.search(r"step[_\s-]?(\d)", hay, re.I)
    if step_match:
        for idx, title in sections:
            if re.search(r"process|how to|steps?", title, re.I):
                return idx

    best_idx = None
    best_score = 0
    for idx, title in sections:
        title_tokens = tokens(title)
        overlap = img_tokens & title_tokens
        score = len(overlap) * 10
        # Strong filename contains heading words
        for t in title_tokens:
            if t in hay.lower():
                score += 8
        # Prefer distinctive product words
        for t in overlap:
            if len(t) >= 6:
                score += 4
        if score > best_score:
            best_score = score
            best_idx = idx
    if best_score >= 8:
        return best_idx
    return None


def insert_after_heading(lines: list[str], heading_idx: int, image_lines: list[str]) -> list[str]:
    """Insert image(s) immediately under the section heading."""
    insert_at = heading_idx + 1
    while insert_at < len(lines) and not lines[insert_at].strip():
        insert_at += 1
    return lines[:insert_at] + image_lines + [""] + lines[insert_at:]


def insert_step_images(lines: list[str], slug: str, images: list[dict]) -> tuple[list[str], list[dict]]:
    remaining = []
    used = set()
    for img in images:
        m = re.search(r"step[_\s-]?(\d)", f"{img['file']} {img.get('alt','')}", re.I)
        if not m:
            remaining.append(img)
            continue
        step_no = m.group(1)
        inserted = False
        for i, line in enumerate(lines):
            if re.match(rf"^{step_no}\.\s+", line):
                md = asset_md(slug, img["file"], img.get("alt") or f"Step {step_no}", img["src"])
                lines = lines[: i + 1] + ["", md] + lines[i + 1 :]
                used.add(img["file"])
                inserted = True
                break
        if not inserted:
            remaining.append(img)
    return lines, remaining


def insert_images(md_text: str, images: list[dict], slug: str) -> tuple[str, dict]:
    md_text = strip_existing_images(md_text)
    if not images:
        return md_text, {"hero": None, "sections": {}, "leftover": []}

    lines = md_text.splitlines()
    # Find start of body after title/sources
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
    body_start = i

    # Choose hero: role=hero or first image
    hero = next((img for img in images if img.get("role") == "hero"), images[0])
    content_images = [img for img in images if img["file"] != hero["file"]]

    hero_md = asset_md(slug, hero["file"], hero.get("alt") or slug, hero["src"])
    lines = lines[:body_start] + ["", hero_md, ""] + lines[body_start:]

    # Recompute sections after hero insertion
    lines, content_images = insert_step_images(lines, slug, content_images)

    sections = find_sections(lines)
    placement: dict[str, list[str]] = {}
    leftover: list[dict] = []

    # Match images to sections
    section_images: dict[int, list[dict]] = {idx: [] for idx, _ in sections}
    for img in content_images:
        match = best_section(img, sections)
        if match is None:
            leftover.append(img)
        else:
            section_images[match].append(img)

    # Round-robin leftovers into sections without images
    empty = [idx for idx, _ in sections if not section_images[idx]]
    ei = 0
    still: list[dict] = []
    for img in leftover:
        if empty:
            section_images[empty[ei % len(empty)]].append(img)
            ei += 1
        else:
            still.append(img)
    leftover = still

    # Insert from bottom to top so indices stay valid
    for heading_idx, title in sorted(sections, key=lambda x: x[0], reverse=True):
        imgs = section_images.get(heading_idx) or []
        if not imgs:
            continue
        image_lines = [
            asset_md(slug, img["file"], img.get("alt") or title, img["src"]) for img in imgs
        ]
        placement[title] = [img["file"] for img in imgs]
        lines = insert_after_heading(lines, heading_idx, image_lines)

    # Any remaining leftovers: append near end before CTA
    if leftover:
        gallery = [asset_md(slug, img["file"], img.get("alt") or img["file"], img["src"]) for img in leftover]
        text = "\n".join(lines)
        block = "\n\n" + "\n\n".join(gallery) + "\n"
        m = re.search(r"\n## (Need Expert|Frequently Asked|Get in Touch|Make Your Project)", text)
        if m:
            text = text[: m.start()] + block + text[m.start() :]
        else:
            text = text.rstrip() + block
        lines = text.splitlines()
        placement["(unmatched)"] = [img["file"] for img in leftover]

    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text).rstrip() + "\n"
    return text, {"hero": hero["file"], "sections": placement, "leftover": [i["file"] for i in leftover]}


def main() -> None:
    raw = json.loads(PAGE_IMAGES.read_text(encoding="utf-8"))
    by_slug: dict[str, list[dict]] = {}
    for path, images in raw.items():
        slug = SLUG_FROM_PATH.get(path)
        if not slug:
            continue
        by_slug.setdefault(slug, []).extend(images)

    selected: dict[str, list[dict]] = {}
    placements: dict[str, dict] = {}
    for slug, images in sorted(by_slug.items()):
        picks = prefer_local(slug, select_for_slug(images))
        selected[slug] = picks
        ASSETS.joinpath(slug).mkdir(parents=True, exist_ok=True)
        md_path = PAGES / f"{slug}.md"
        if md_path.exists():
            updated, place = insert_images(md_path.read_text(encoding="utf-8"), picks, slug)
            md_path.write_text(updated, encoding="utf-8")
            placements[slug] = place

    SELECTED.write_text(json.dumps(selected, indent=2), encoding="utf-8")
    PLACEMENT.write_text(json.dumps(placements, indent=2), encoding="utf-8")
    total = sum(len(v) for v in selected.values())
    print(f"Placed images inline across {len(selected)} pages ({total} selected) -> {PLACEMENT}")


if __name__ == "__main__":
    main()
