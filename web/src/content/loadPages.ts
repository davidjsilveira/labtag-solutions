import { LIVE_FILE_SLUG, LIVE_SOLUTION_SLUGS } from './liveCatalog'
import { parseMarkdown } from './parseMarkdown'
import type { SolutionPage } from './types'

const catalogModules = import.meta.glob('@pages/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const legacyModules = import.meta.glob('@pages/legacy/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/, '')
}

function parseAll(modules: Record<string, string>): Record<string, SolutionPage> {
  const bySlug: Record<string, SolutionPage> = {}
  for (const [path, markdown] of Object.entries(modules)) {
    const page = parseMarkdown(slugFromPath(path), markdown)
    bySlug[page.slug] = page
  }
  return bySlug
}

const pagesByFileSlug = {
  ...parseAll(catalogModules),
  ...parseAll(legacyModules),
}

export const solutionPages: SolutionPage[] = LIVE_SOLUTION_SLUGS.map((slug) => {
  const fileSlug = LIVE_FILE_SLUG[slug] ?? slug
  const page = pagesByFileSlug[fileSlug]
  if (!page) throw new Error(`Missing live solution article: ${slug}`)
  return { ...page, slug }
})

const bySlug = Object.fromEntries(solutionPages.map((page) => [page.slug, page]))

export function getPage(slug: string): SolutionPage | undefined {
  return bySlug[slug]
}
