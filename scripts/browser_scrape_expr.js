(() => {
  const NAV = /Labels-\d|Tapes-\d|Tags\.png|Printers|Accessories|logo|sprite|icon|favicon|flag-|payment|badge|woocommerce|cart|iso-|certified/i;
  const abs = (u) => { try { return new URL(u, location.href).href; } catch { return null; } };
  const baseKey = (u) => u
    .replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp|gif))/i, '')
    .replace(/-scaled(?=\.)/i, '')
    .replace(/^https:\/\/www\.labtag\.com/i, 'https://cdn.labtag.com');
  const byBase = new Map();
  const og = document.querySelector('meta[property="og:image"]');
  if (og?.content) {
    const src = abs(og.content);
    if (src) byBase.set(baseKey(src), { src, alt: document.title.replace(/ - LabTAG$/, ''), role: 'hero', w: 0, h: 0, score: 1e12 });
  }
  for (const img of document.images) {
    let src = abs(img.currentSrc || img.src || img.getAttribute('data-src') || '');
    if (!src || !/wp-content\/uploads/i.test(src)) continue;
    if (NAV.test(src)) continue;
    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    if ((w && w < 120) || (h && h < 120)) continue;
    const key = baseKey(src);
    const score = w * h + src.length;
    const prev = byBase.get(key);
    if (!prev || score > prev.score) {
      byBase.set(key, {
        src: src.replace(/^https:\/\/www\.labtag\.com/i, 'https://cdn.labtag.com'),
        alt: (img.alt || prev?.alt || '').trim(),
        role: prev?.role === 'hero' ? 'hero' : 'content',
        w, h, score,
      });
    }
  }
  const cleaned = [...byBase.values()].map(({ score, ...rest }) => rest);
  const store = JSON.parse(localStorage.getItem('labtagImageScrape') || '{}');
  store[location.pathname] = cleaned;
  localStorage.setItem('labtagImageScrape', JSON.stringify(store));
  return { path: location.pathname, count: cleaned.length, totalPages: Object.keys(store).length };
})()
