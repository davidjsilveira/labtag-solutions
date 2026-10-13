import { parseMarkdown } from './parseMarkdown'
import type { SolutionPage } from './types'

const modules = import.meta.glob('@pages/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/, '')
}

export const solutionPages: SolutionPage[] = Object.entries(modules)
  .map(([path, markdown]) => parseMarkdown(slugFromPath(path), markdown))
  .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))

export const pagesBySlug = Object.fromEntries(
  solutionPages.map((page) => [page.slug, page]),
) as Record<string, SolutionPage>

export function getPage(slug: string): SolutionPage | undefined {
  return pagesBySlug[slug]
}
