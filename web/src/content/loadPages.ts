import { LEGACY_REPLACED_BY } from './legacyMap'
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

function parseEntries(
  modules: Record<string, string>,
  legacy: boolean,
): SolutionPage[] {
  return Object.entries(modules)
    .map(([path, markdown]) => {
      const page = parseMarkdown(slugFromPath(path), markdown)
      return {
        ...page,
        legacy,
        replacedBy: legacy ? LEGACY_REPLACED_BY[page.slug] : undefined,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

export const solutionPages: SolutionPage[] = parseEntries(catalogModules, false)
export const legacyPages: SolutionPage[] = parseEntries(legacyModules, true)

const catalogBySlug = Object.fromEntries(solutionPages.map((page) => [page.slug, page]))
const legacyBySlug = Object.fromEntries(legacyPages.map((page) => [page.slug, page]))

for (const slug of Object.keys(catalogBySlug)) {
  if (legacyBySlug[slug]) {
    throw new Error(`Catalog slug collides with a legacy archive URL: ${slug}`)
  }
}

export const pagesBySlug = {
  ...legacyBySlug,
  ...catalogBySlug,
} as Record<string, SolutionPage>

export function getPage(slug: string): SolutionPage | undefined {
  return catalogBySlug[slug] ?? legacyBySlug[slug]
}
