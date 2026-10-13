/**
 * Prefer local /media paths (served from web/public/media).
 * CDN URLs are kept as a fallback — many are hotlink-protected (403).
 */
export function resolveImageSrc(src: string, fallbackSrc?: string): { primary: string; fallback?: string } {
  const http = [src, fallbackSrc].find((v) => !!v && /^https?:\/\//i.test(v))
  const local = [src, fallbackSrc].find((v) => !!v && v.startsWith('/media/'))

  if (local) {
    return { primary: local, fallback: http }
  }
  return { primary: src, fallback: fallbackSrc }
}
