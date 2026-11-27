import { CaretDown, CaretLeft, CaretRight, SkipBack, SkipForward } from '@phosphor-icons/react'
import { pagerItems } from '@/pagerPages'

const PAGE_SIZE_OPTIONS = [10, 25, 30, 50, 100]

type MdPagerProps = {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}

export function MdPager({ page, pageSize, total, onPage, onPageSize }: MdPagerProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1)
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const atStart = page <= 1
  const atEnd = page >= pageCount || total === 0
  return (
    <nav className="md-pager" aria-label="Pagination">
      <label className="md-pager-size">
        Rows per page
        <span>
          {pageSize}
          <CaretDown weight="bold" aria-hidden="true" />
          <select
            value={pageSize}
            aria-label="Rows per page"
            onChange={(event) => onPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </span>
      </label>
      <p className="md-pager-range">
        {start}–{end} of {total}
      </p>
      <div className="md-pager-buttons">
        <button type="button" className="md-pager-nav" aria-label="First page" disabled={atStart} onClick={() => onPage(1)}>
          <SkipBack weight="fill" aria-hidden="true" />
        </button>
        <button type="button" className="md-pager-nav" aria-label="Previous page" disabled={atStart} onClick={() => onPage(page - 1)}>
          <CaretLeft weight="bold" aria-hidden="true" />
        </button>
        {total > 0 ? (
          <span className="md-pager-pages">
            {pagerItems(page, pageCount).map((item, index) =>
              item === '…' ? (
                <span key={`gap-${index}`} className="md-pager-gap" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`md-pager-page${item === page ? ' is-current' : ''}`}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => onPage(item)}
                >
                  {item}
                </button>
              ),
            )}
          </span>
        ) : null}
        <button type="button" className="md-pager-nav" aria-label="Next page" disabled={atEnd} onClick={() => onPage(page + 1)}>
          <CaretRight weight="bold" aria-hidden="true" />
        </button>
        <button type="button" className="md-pager-nav" aria-label="Last page" disabled={atEnd} onClick={() => onPage(pageCount)}>
          <SkipForward weight="fill" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
