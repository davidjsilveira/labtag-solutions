import { solutionPages } from '@/content/loadPages'

const STOP = new Set(['for', 'the', 'and', 'that', 'with', 'from', 'are', 'you'])

function pageText(page: (typeof solutionPages)[number]) {
  return `${page.title} ${page.slug.replace(/-/g, ' ')} ${page.excerpt} ${page.description.join(' ')}`.toLowerCase()
}

export function findCatalogMatch(query: string) {
  const q = query.toLowerCase()
  const slugQuery = q.replace(/\s+/g, '-')
  const tokens = q.split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !STOP.has(token))

  const ranked = solutionPages
    .map((page) => {
      const hay = pageText(page)
      const hits = tokens.filter((token) => hay.includes(token)).length
      return { page, hits }
    })
    .sort((a, b) => b.hits - a.hits)

  return (
    solutionPages.find((page) => page.title.toLowerCase() === q || page.slug === slugQuery) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().startsWith(q) || page.slug.startsWith(slugQuery),
    ) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().includes(q) || page.slug.includes(slugQuery),
    ) ??
    (ranked[0] && ranked[0].hits >= Math.min(2, tokens.length) ? ranked[0].page : undefined)
  )
}
