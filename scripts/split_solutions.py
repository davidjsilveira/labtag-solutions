#!/usr/bin/env python3
"""Split the LabTAG solutions scrape into one cleaned Markdown page per solution."""

from __future__ import annotations

import html
import re
import unicodedata
from pathlib import Path

SOURCE = Path("/Users/davidsilveira/Downloads/labtag_solutions_content.md")
ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "pages"
README = ROOT / "README.md"

CTA_LINES = {
    unicodedata.normalize("NFKC", s).lower()
    for s in {
        "view products",
        "shop products",
        "shop now",
        "shop labels",
        "shop printing kits",
        "shop snappeel labels",
        "get the guide",
        "order free samples now",
        "get free samples",
        "request free samples",
        "watch video",
        "learn more",
        "get in touch",
        "get started",
        "browse labels",
        "view all labels",
        "view galileo",
        "order free sample kit",
        "download data sheet",
        "download spec sheet",
        "download scinomix weighing module spec sheet",
        "download vxq spec sheet",
        "download vxi spec sheet",
        "download the air displacement pipettor spec sheet",
        "industrial rfid labels",
        "free samples",
        "get free dymo® labelwriter™ 550 printer",
        "get a free dymo® labelwriter™ 550 printer",
    }
}

DROP_SUBSTRINGS = (
    "we are committed to providing reliable products and services",
    "our iso 22301:2012 business continuity management system",
    "iso 9001:2015 certified quality management system",
    "would you like to test our laboratory labels",
    "tell us a little bit about yourself",
    "tell us about your project and one of our experts",
    "tell us about your project and let our expert team",
    "disruptions so that we may continue to serve our clients",
)

HEADING_HINTS = (
    "labels for",
    "labels by",
    "resistant labels",
    "recommended labels",
    "recommended",
    "automation solutions",
    "automation devices",
    "why use",
    "the technology",
    "the process",
    "the benefits",
    "the products",
    "the challenge",
    "the labtag solution",
    "frequently asked questions",
    "what’s included",
    "what's included",
    "need expert",
    "custom label",
    "boost productivity",
    "printers, scanners",
    "autoclave-resistant label guide",
    "chemical-resistant label guide",
    "cryogenic labels by",
    "xylene & chemical",
    "make your project",
    "unmatched expertise",
    "state of the art",
    "empowering your",
    "our most popular",
    "print solutions",
    "hti automated",
    "scinomix fully",
    "bulk tube feeder",
    "aq aliquoting",
    "mp2+",
)

SUBHEAD_EXACT = {
    "overview",
    "specifications",
    "features",
    "benefits",
    "inkjet",
    "writable",
    "automation",
    "permanent",
    "pcr",
    "label formats",
    "printing method",
    "material selection",
    "resistance",
    "application surface",
    "data format",
    "compact",
    "user-friendly",
    "3-minute setup",
    "durable",
    "high-quality",
    "cost-efficient",
    "speed",
    "user-friendly",
    "durability",
    "quality",
    "design",
}

OPTION_GROUPS = {
    "label formats",
    "printing method",
    "printing method​",
    "material selection",
    "resistance",
    "application surface",
    "data format",
}

CONTINUE_ENDS = {
    "and",
    "or",
    "the",
    "of",
    "to",
    "with",
    "for",
    "from",
    "by",
    "a",
    "an",
    "as",
    "in",
    "on",
    "at",
    "including",
    "labtag",
    "labtag®",
}


def decode(text: str) -> str:
    text = html.unescape(text)
    text = text.replace("\u00a0", " ").replace("\u200b", "").replace("\ufeff", "")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def norm_key(text: str) -> str:
    return unicodedata.normalize("NFKC", decode(text)).lower()


def slug_from_url(url: str, title: str) -> str:
    path = url.rstrip("/").split("/")[-1]
    slug = re.sub(r"[^a-z0-9-]+", "-", path.lower()).strip("-")
    if not slug:
        slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug


def is_chrome(line: str, title: str) -> bool:
    stripped = re.sub(r"\s+", " ", line.strip())
    title_plain = re.sub(r"\s+", " ", title).strip()
    if stripped in {f"{title_plain} - LabTAG", f"/ {title_plain}", title_plain}:
        return True
    if stripped.endswith(" - LabTAG") and len(stripped) < 90:
        return True
    if stripped.startswith("/ ") and len(stripped) < 90:
        return True
    return False


def should_drop(line: str) -> bool:
    lower = norm_key(line)
    if lower in CTA_LINES:
        return True
    if lower.startswith(("by printing method", "by feature", "by adhesive", "by surface")):
        return True
    if lower in {"new!", "printer", "permanent", "laboratory labels"} and len(line.split()) <= 3:
        return True
    return any(marker in lower for marker in DROP_SUBSTRINGS)


def join_wrapped_lines(lines: list[str]) -> list[str]:
    joined: list[str] = []
    for line in lines:
        if not joined:
            joined.append(line)
            continue
        prev = joined[-1]
        last_word = re.sub(r"[^A-Za-z0-9®™]+$", "", prev.split()[-1]).lower() if prev.split() else ""
        nxt = line.lstrip()
        if prev.startswith("#") or prev.startswith("|"):
            joined.append(line)
            continue
        if nxt in {"®", "™", ".", ",", ";", ":"}:
            joined[-1] = f"{prev}{nxt}"
            continue
        if nxt.startswith(("®", "™")):
            joined[-1] = f"{prev}{nxt}"
            continue
        if last_word in CONTINUE_ENDS and not re.search(r"[.!?:]$", prev):
            joined[-1] = f"{prev} {line}"
            continue
        if (
            not re.search(r'[.!?:;"”)\]]$', prev)
            and nxt
            and nxt[0].islower()
        ):
            joined[-1] = f"{prev} {line}"
            continue
        joined.append(line)
    return joined


def looks_like_heading(line: str, next_line: str | None) -> bool:
    text = line.strip()
    if not text or text.startswith("#") or text.startswith("|") or text.startswith("- "):
        return False
    if len(text) > 90 or text.endswith((".", ":", ";", ",")):
        return False
    lower = norm_key(text)
    if lower in CTA_LINES or should_drop(text):
        return False
    if lower in SUBHEAD_EXACT or lower in OPTION_GROUPS:
        return True
    if any(hint in lower for hint in HEADING_HINTS):
        return True
    if text.endswith("?") and 3 <= len(text.split()) <= 12:
        return True
    if re.search(r"\b(labels|tags|tapes|printer|software|solutions)\b", lower) and 2 <= len(text.split()) <= 8:
        if next_line and len(next_line) > 50 and next_line[0].isupper():
            return True
    words = text.split()
    if 2 <= len(words) <= 6 and next_line:
        titled = all(w[:1].isupper() or w in {"&", "and", "for", "of"} for w in words)
        if titled and next_line.startswith(("We ", "Our ", "These ", "This ", "The ", "LabTAG", "It ", "In ")):
            return True
    return False


def format_numbered_steps(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        if re.fullmatch(r"[1-4]", lines[i]) and i + 2 < len(lines):
            num, action, desc = lines[i], lines[i + 1], lines[i + 2]
            if action and desc and not desc[0].isdigit() and len(action.split()) <= 3:
                out.append(f"{num}. **{action}** — {desc}")
                i += 3
                continue
        out.append(lines[i])
        i += 1
    return out


def format_option_groups(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        key = lines[i].lower().rstrip("\u200b")
        if key in OPTION_GROUPS:
            out.append(f"## {lines[i]}")
            i += 1
            items: list[str] = []
            while i < len(lines) and not looks_like_heading(lines[i], lines[i + 1] if i + 1 < len(lines) else None):
                if len(lines[i]) > 60:
                    break
                if should_drop(lines[i]):
                    i += 1
                    continue
                items.append(lines[i])
                i += 1
            out.extend(f"- {item}" for item in items)
            continue
        out.append(lines[i])
        i += 1
    return out


def format_sku_blocks(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        if re.match(r"^#[A-Z0-9-]+$", lines[i]):
            items: list[tuple[str, str, str, str]] = []
            j = i
            while j < len(lines) and re.match(r"^#[A-Z0-9-]+$", lines[j]):
                sku = lines[j]
                name = lines[j + 1] if j + 1 < len(lines) else ""
                size = lines[j + 2] if j + 2 < len(lines) else ""
                price = lines[j + 3] if j + 3 < len(lines) else ""
                per = ""
                consume = 4
                if j + 4 < len(lines) and lines[j + 4].startswith("("):
                    per = lines[j + 4]
                    consume = 5
                items.append((sku, name, size, f"{price} {per}".strip()))
                j += consume
                while j < len(lines) and lines[j] in {"Patent Pending", "Ⓓ Protected Design"}:
                    j += 1
            if len(items) >= 3:
                out.append("| SKU | Product | Size | Price |")
                out.append("| --- | --- | --- | --- |")
                for sku, name, size, price in items:
                    out.append(f"| `{sku}` | {name} | {size} | {price} |")
                i = j
                continue
        out.append(lines[i])
        i += 1
    return out


def drop_duplicate_runs(lines: list[str]) -> list[str]:
    n = len(lines)
    i = 0
    out: list[str] = []
    while i < n:
        max_len = min(12, (n - i) // 2)
        duplicated = False
        for length in range(max_len, 3, -1):
            block = lines[i : i + length]
            nxt = lines[i + length : i + 2 * length]
            if block and block == nxt:
                out.extend(block)
                i += 2 * length
                duplicated = True
                break
        if not duplicated:
            out.append(lines[i])
            i += 1
    return out


def bullets_after_colon(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        if lines[i].endswith(":") and i + 1 < len(lines):
            out.append(lines[i])
            i += 1
            cluster: list[str] = []
            while i < len(lines) and not lines[i].startswith("#") and len(lines[i]) < 140:
                if looks_like_heading(lines[i], lines[i + 1] if i + 1 < len(lines) else None):
                    break
                if len(lines[i]) > 80 and lines[i].endswith("."):
                    break
                cluster.append(lines[i])
                i += 1
            if len(cluster) >= 3:
                out.extend(f"- {item}" for item in cluster)
            else:
                out.extend(cluster)
            continue
        out.append(lines[i])
        i += 1
    return out


def promote_headings(lines: list[str]) -> list[str]:
    out: list[str] = []
    for i, line in enumerate(lines):
        nxt = lines[i + 1] if i + 1 < len(lines) else None
        if line.startswith(("#", "|", "- ")):
            out.append(line)
        elif looks_like_heading(line, nxt):
            out.append(f"## {line}")
        else:
            out.append(line)
    return out


def render(lines: list[str]) -> str:
    rendered: list[str] = []
    in_table = False
    for line in lines:
        is_table = line.startswith("| ")
        if is_table:
            if rendered and rendered[-1] != "" and not in_table:
                rendered.append("")
            rendered.append(line)
            in_table = True
            continue
        if in_table:
            rendered.append("")
            in_table = False
        if line.startswith("## "):
            if rendered and rendered[-1] != "":
                rendered.append("")
            rendered.append(line)
            rendered.append("")
        else:
            rendered.append(line)
            if not line.startswith("- "):
                rendered.append("")
    text = "\n".join(rendered).strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"LabTAG\s*®", "LabTAG®", text)
    text = re.sub(r" +\n", "\n", text)
    return text


def better_title(scraped_title: str, body_lines: list[str]) -> str:
    if re.fullmatch(r"[a-z0-9-]+", scraped_title):
        for line in body_lines[:8]:
            if 3 <= len(line) <= 80 and line[0].isupper() and not line.endswith("."):
                return line
    return scraped_title


def clean_body(title: str, raw: str) -> tuple[str, str]:
    raw = decode(raw)
    lines = [ln.strip() for ln in raw.splitlines()]
    lines = [ln for ln in lines if ln]
    lines = [ln for ln in lines if not is_chrome(ln, title)]
    lines = [ln for ln in lines if not should_drop(ln)]
    lines = join_wrapped_lines(lines)
    lines = drop_duplicate_runs(lines)
    deduped: list[str] = []
    for line in lines:
        if deduped and deduped[-1] == line:
            continue
        deduped.append(line)
    lines = deduped
    lines = format_sku_blocks(lines)
    lines = format_numbered_steps(lines)
    title = better_title(title, lines)
    if lines and lines[0] in {title, f"{title} - LabTAG"}:
        lines = lines[1:]
    lines = format_option_groups(lines)
    lines = bullets_after_colon(lines)
    lines = promote_headings(lines)
    if lines and lines[0] == f"## {title}":
        lines = lines[1:]
    return title, render(lines)


def parse_sections(source: str) -> list[dict[str, str]]:
    source = decode(source)
    parts = re.split(r"\n## ", source)
    pages = []
    for part in parts[1:]:
        heading, _, rest = part.partition("\n")
        title = decode(heading.strip())
        url_match = re.search(r"\*\*URL:\*\*\s*(\S+)", rest)
        url = url_match.group(1) if url_match else ""
        body = rest[url_match.end() :] if url_match else rest
        body = re.sub(r"^\s*---\s*$", "", body.strip(), flags=re.M).strip()
        slug = slug_from_url(url, title)
        pages.append({"title": title, "url": url, "slug": slug, "body": body})
    return pages


def md_cell(text: str) -> str:
    return text.replace("|", "\\|")


# Duplicate scrape URLs merged by hand; do not regenerate or delete these files.
MERGED_SLUGS = {
    "dymo-labelwriter-550",
    "snappeel-labels",
    "chemical-container-labeling",
}
SKIP_SLUGS = MERGED_SLUGS | {
    "dymo-labelwriter-550-2",
    "snappeel-2",
    "chemical-container-labeling-2",
}


def index_row_from_file(path: Path) -> tuple[str, str, str]:
    text = path.read_text(encoding="utf-8")
    title_match = re.search(r"^# (.+)$", text, re.M)
    title = title_match.group(1).strip() if title_match else path.stem
    urls = re.findall(r"https://www\.labtag\.com/solutions/[a-z0-9-]+/?", text)
    seen: list[str] = []
    for url in urls:
        if url not in seen:
            seen.append(url)
    if not seen:
        source = "—"
    elif len(seen) == 1:
        source = f"[labtag.com]({seen[0]})"
    else:
        source = ", ".join(f"[labtag.com]({url})" for url in seen)
    return title, path.stem, source


def write_pages(pages: list[dict[str, str]]) -> None:
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    for existing in PAGES_DIR.glob("*.md"):
        if existing.stem in MERGED_SLUGS:
            continue
        existing.unlink()

    seen_slugs: dict[str, int] = {}
    for page in pages:
        slug = page["slug"]
        if slug in seen_slugs:
            seen_slugs[slug] += 1
            slug = f"{slug}-{seen_slugs[slug]}"
        else:
            seen_slugs[slug] = 1
        page["slug"] = slug
        if slug in SKIP_SLUGS:
            continue
        title, body = clean_body(page["title"], page["body"])
        page["title"] = title
        content = f"# {title}\n\n"
        if page["url"]:
            content += f"Source: [{page['url']}]({page['url']})\n\n"
        content += body + "\n"
        (PAGES_DIR / f"{slug}.md").write_text(content, encoding="utf-8")

    index_rows = [index_row_from_file(path) for path in PAGES_DIR.glob("*.md")]
    index_rows.sort(key=lambda row: row[0].casefold())

    lines = [
        "# LabTAG Solutions",
        "",
        "Each LabTAG solutions page from the 2026-10-13 scrape is saved as its own Markdown file. Duplicate solution URLs were merged into a single page.",
        "",
        f"**{len(index_rows)} pages** · Original hub: [labtag.com/solutions](https://www.labtag.com/solutions/)",
        "",
        "| Solution | File | Source |",
        "| --- | --- | --- |",
    ]
    for title, slug, source in index_rows:
        lines.append(f"| {md_cell(title)} | [{slug}.md](pages/{slug}.md) | {source} |")
    lines.append("")
    README.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    pages = parse_sections(SOURCE.read_text(encoding="utf-8"))
    write_pages(pages)
    written = list(PAGES_DIR.glob("*.md"))
    print(f"Wrote {len(written)} pages to {PAGES_DIR}")


if __name__ == "__main__":
    main()
