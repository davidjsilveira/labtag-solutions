export type PagerItem = number | '…'

/** Truncated pagination pattern: first and last always shown, current ±1, '…' across the gaps. */
export function pagerItems(page: number, pageCount: number): PagerItem[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  const items: PagerItem[] = [1]
  if (start > 2) items.push('…')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < pageCount - 1) items.push('…')
  items.push(pageCount)
  return items
}
