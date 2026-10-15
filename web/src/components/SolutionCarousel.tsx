import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SolutionCard } from '@/components/SolutionCard'
import {
  browseFilters,
  pagesForBrowseFilter,
  type BrowseFilter,
  type BrowseFilterId,
} from '@/content/categories'

type Props = {
  heading?: string
  lede?: string
}

export function SolutionCarousel({ heading, lede }: Props) {
  const [filter, setFilter] = useState<BrowseFilterId>('all')
  const [visibleFilters, setVisibleFilters] = useState<BrowseFilter[]>(browseFilters)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const filterTrackRef = useRef<HTMLDivElement>(null)
  const filterMeasureRef = useRef<HTMLDivElement>(null)

  const pages = pagesForBrowseFilter(filter)
  const activeLabel = browseFilters.find((item) => item.id === filter)?.label ?? 'All'

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

  /** Show only the theme chips that fit on one row — no horizontal scroll. */
  useLayoutEffect(() => {
    const track = filterTrackRef.current
    const measure = filterMeasureRef.current
    if (!track || !measure) return

    const fit = () => {
      const maxWidth = track.clientWidth
      if (maxWidth <= 0) return

      const styles = getComputedStyle(measure)
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
      const buttons = [...measure.querySelectorAll<HTMLButtonElement>('button')]
      let used = 0
      let count = 0

      for (const button of buttons) {
        const width = button.getBoundingClientRect().width
        const next = used + (count > 0 ? gap : 0) + width
        if (next > maxWidth + 0.5) break
        used = next
        count += 1
      }

      const nextVisible = browseFilters.slice(0, Math.max(1, count))
      setVisibleFilters((prev) => {
        if (
          prev.length === nextVisible.length &&
          prev.every((item, index) => item.id === nextVisible[index]?.id)
        ) {
          return prev
        }
        return nextVisible
      })
    }

    fit()
    const frame = window.requestAnimationFrame(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(track)
    window.addEventListener('resize', fit)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  useEffect(() => {
    if (visibleFilters.some((item) => item.id === filter)) return
    setFilter('all')
  }, [filter, visibleFilters])

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
  }, [filter, pages.length])

  function scrollByPage(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.75, 240)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="solution-carousel-block" ref={blockRef}>
      <header className="lander-all-head">
        {heading ? <h2>{heading}</h2> : null}
        {lede ? <p className="lander-section-lede">{lede}</p> : null}
        <div
          ref={filterMeasureRef}
          className="category-jump category-jump-measure"
          aria-hidden="true"
        >
          {browseFilters.map((item) => (
            <button key={item.id} type="button" tabIndex={-1}>
              {item.label}
            </button>
          ))}
        </div>
        <div
          ref={filterTrackRef}
          className="category-jump"
          role="tablist"
          aria-label="Filter solutions"
        >
          {visibleFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? 'is-active' : undefined}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="solution-carousel-shell">
        {pages.length >= 4 ? (
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
        ) : null}

        <ul
          ref={trackRef}
          className="solution-carousel"
          aria-label={filter === 'all' ? 'All solutions' : `${activeLabel} solutions`}
        >
          {pages.map((page) => (
            <li key={page.slug}>
              <SolutionCard page={page} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
