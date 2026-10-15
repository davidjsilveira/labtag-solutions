import { useEffect, useRef, useState } from 'react'
import { SolutionCard } from '@/components/SolutionCard'
import {
  getCategoryForSlug,
  pagesForBrowseAll,
  pagesInCategory,
  solutionCategories,
  type SolutionCategoryId,
} from '@/content/categories'
import type { SolutionPage } from '@/content/types'

type FilterId = 'all' | SolutionCategoryId

type Props = {
  /** When set, lock to one category and hide filter chips. */
  categoryId?: SolutionCategoryId
  heading?: string
  lede?: string
}

function pagesForFilter(filter: FilterId): SolutionPage[] {
  if (filter === 'all') return pagesForBrowseAll()
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
  const blockRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)

  const pages = pagesForFilter(categoryId ?? filter)
  const showFilters = !categoryId

  function syncInset() {
    const block = blockRef.current
    if (!block) return
    const inset = Math.max(0, Math.round(block.getBoundingClientRect().left))
    block.style.setProperty('--carousel-page-gutter', `${inset}px`)
  }

  function updateArrows() {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const resetScroll = () => {
      syncInset()
      track.scrollLeft = 0
      updateArrows()
    }

    resetScroll()
    const frame = window.requestAnimationFrame(resetScroll)

    const onScroll = () => updateArrows()
    const onResize = () => {
      syncInset()
      updateArrows()
    }

    /** Horizontal wheel / trackpad — native overflow is hidden to kill scrollbars. */
    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      const max = track.scrollWidth - track.clientWidth
      if (max <= 0) return
      const next = Math.min(max, Math.max(0, track.scrollLeft + delta))
      if (next === track.scrollLeft) return
      event.preventDefault()
      track.scrollLeft = next
      updateArrows()
    }

    const DRAG_THRESHOLD_PX = 10
    let dragOriginX = 0
    let dragScrollLeft = 0
    let pointerActive = false
    let dragging = false
    let suppressClick = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pointerActive = true
      dragging = false
      suppressClick = false
      dragOriginX = event.clientX
      dragScrollLeft = track.scrollLeft
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerActive) return
      const dx = event.clientX - dragOriginX
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
        dragging = true
        suppressClick = true
        track.classList.add('is-dragging')
        track.setPointerCapture(event.pointerId)
      }
      track.scrollLeft = dragScrollLeft - dx
      updateArrows()
    }

    const endDrag = (event: PointerEvent) => {
      if (!pointerActive) return
      pointerActive = false
      dragging = false
      track.classList.remove('is-dragging')
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId)
      }
    }

    /** Ignore click-through after a drag so cards don’t navigate mid-swipe. */
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', endDrag)
    track.addEventListener('pointercancel', endDrag)
    track.addEventListener('click', onClickCapture, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', endDrag)
      track.removeEventListener('pointercancel', endDrag)
      track.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('resize', onResize)
    }
  }, [filter, categoryId, pages.length])

  function scrollByPage(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.75, 240)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="solution-carousel-block" ref={blockRef}>
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
