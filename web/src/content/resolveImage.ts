/**
 * Prefer local /media paths (served from web/public/media).
 * CDN URLs are kept as a fallback — many are hotlink-protected (403).
 * Prefixes Vite BASE_URL so GitHub Pages project sites resolve assets correctly.
 */
function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}

export function resolveImageSrc(src: string, fallbackSrc?: string): { primary: string; fallback?: string } {
  const http = [src, fallbackSrc].find((v) => !!v && /^https?:\/\//i.test(v))
  const local = [src, fallbackSrc].find((v) => !!v && v.startsWith('/media/'))

  if (local) {
    return { primary: withBase(local), fallback: http }
  }
  return { primary: src, fallback: fallbackSrc }
}
