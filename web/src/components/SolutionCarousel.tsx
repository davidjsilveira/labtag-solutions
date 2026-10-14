import { useEffect, useRef, useState } from 'react'
import { SolutionCard } from '@/components/SolutionCard'
import {
  getCategoryForSlug,
  pagesInCategory,
  solutionCategories,
  type SolutionCategoryId,
} from '@/content/categories'
import { solutionPages } from '@/content/loadPages'
import type { SolutionPage } from '@/content/types'

type FilterId = 'all' | SolutionCategoryId

type Props = {
  /** When set, lock to one category and hide filter chips. */
  categoryId?: SolutionCategoryId
  heading?: string
  lede?: string
}

function pagesForFilter(filter: FilterId): SolutionPage[] {
  if (filter === 'all') return solutionPages
  return pagesInCategory(filter)
}

function categoryPathFor(page: SolutionPage, locked?: SolutionCategoryId): string | undefined {
  if (locked) return locked
  return getCategoryForSlug(page.slug)?.id
}

export function SolutionCarousel({ categoryId, heading, lede }: Props) {
  const [filter, setFilter] = useState<FilterId>(categoryId ?? 'all')
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const trackRef = useRef<HTMLUListElement>(null)

  const pages = pagesForFilter(categoryId ?? filter)
  const showFilters = !categoryId

  function updateArrows() {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const resetScroll = () => {
      el.scrollLeft = 0
      updateArrows()
    }

    resetScroll()
    const frame = window.requestAnimationFrame(resetScroll)

    const onScroll = () => updateArrows()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      window.cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateArrows)
    }
  }, [filter, categoryId, pages.length])

  function scrollByPage(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.75, 240)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="solution-carousel-block">
      {(heading || showFilters) && (
        <header className="lander-all-head">
          {heading ? <h2>{heading}</h2> : null}
          {lede ? <p className="lander-section-lede">{lede}</p> : null}
          {showFilters ? (
            <div className="category-jump" role="tablist" aria-label="Filter solutions">
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                className={filter === 'all' ? 'is-active' : undefined}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              {solutionCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === category.id}
                  className={filter === category.id ? 'is-active' : undefined}
                  onClick={() => setFilter(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>
      )}

      <div className="solution-carousel-shell">
        <div className="carousel-arrows" role="group" aria-label="Carousel controls">
          <button
            type="button"
            className="carousel-arrow carousel-arrow-prev"
            aria-label="Previous solutions"
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-next"
            aria-label="Next solutions"
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m9 5 7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <ul
          ref={trackRef}
          className="solution-carousel"
          aria-label={
            categoryId
              ? `${solutionCategories.find((c) => c.id === categoryId)?.label ?? ''} solutions`
              : filter === 'all'
                ? 'All solutions'
                : `${solutionCategories.find((c) => c.id === filter)?.label ?? ''} solutions`
          }
        >
          {pages.map((page) => (
            <li key={page.slug}>
              <SolutionCard page={page} categoryPath={categoryPathFor(page, categoryId)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
