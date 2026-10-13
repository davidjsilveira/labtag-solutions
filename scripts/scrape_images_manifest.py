#!/usr/bin/env python3
"""Build a URL list for image scraping from local markdown pages."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "pages"

rows = []
for path in sorted(PAGES.glob("*.md")):
    text = path.read_text(encoding="utf-8")
    urls = re.findall(r"https://www\.labtag\.com/solutions/[a-z0-9-]+/?", text)
    seen: list[str] = []
    for url in urls:
        if url not in seen:
            seen.append(url.rstrip("/") + "/")
    if not seen:
        continue
    rows.append({"slug": path.stem, "urls": seen})

out = ROOT / "scripts" / "solution_urls.json"
out.write_text(json.dumps(rows, indent=2), encoding="utf-8")
print(f"Wrote {len(rows)} entries to {out}")
