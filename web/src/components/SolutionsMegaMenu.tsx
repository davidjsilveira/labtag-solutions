import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Crosshair,
  Package,
  Sparkle,
  SquaresFour,
  X,
} from '@phosphor-icons/react'
import {
  SOLUTIONS_MEGA_CATEGORIES,
  SOLUTIONS_MEGA_FOOTER,
  SOLUTIONS_MEGA_PROMO,
  type SolutionsMegaCategory,
} from '@/content/solutionsMegaMenu'

type SolutionsMegaMenuProps = {
  open: boolean
  onClose: () => void
}

function FooterIcon({ name }: { name: (typeof SOLUTIONS_MEGA_FOOTER)[number]['icon'] }) {
  if (name === 'finder') return <Crosshair size={18} weight="bold" aria-hidden />
  if (name === 'sparkle') return <Sparkle size={18} weight="fill" aria-hidden />
  if (name === 'sample') return <Package size={18} weight="bold" aria-hidden />
  return <SquaresFour size={18} weight="bold" aria-hidden />
}

function isInternalPath(href: string) {
  return href.startsWith('/')
}

export function SolutionsMegaMenu({ open, onClose }: SolutionsMegaMenuProps) {
  const [activeId, setActiveId] = useState<SolutionsMegaCategory['id']>('labels')
  const tablistId = useId()
  const tabSwitchTimerRef = useRef<number | null>(null)
  const active =
    SOLUTIONS_MEGA_CATEGORIES.find((item) => item.id === activeId) ?? SOLUTIONS_MEGA_CATEGORIES[0]

  const clearTabSwitchTimer = () => {
    if (tabSwitchTimerRef.current == null) return
    window.clearTimeout(tabSwitchTimerRef.current)
    tabSwitchTimerRef.current = null
  }

  const selectCategory = (id: SolutionsMegaCategory['id'], immediate = false) => {
    clearTabSwitchTimer()
    if (immediate || id === activeId) {
      setActiveId(id)
      return
    }
    tabSwitchTimerRef.current = window.setTimeout(() => {
      tabSwitchTimerRef.current = null
      setActiveId(id)
    }, 90)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => () => clearTabSwitchTimer(), [])

  if (!active) return null

  return (
    <div
      id="site-nav-solutions-menu"
      className={['shop-mega', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="Solutions"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div className="shop-mega-tabs">
        <div className="shop-mega-tabs-inner" role="tablist" aria-label="Solution categories" id={tablistId}>
          {SOLUTIONS_MEGA_CATEGORIES.map((category) => {
            const selected = category.id === active.id
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`solutions-mega-tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`solutions-mega-panel-${category.id}`}
                tabIndex={selected ? 0 : -1}
                className={['shop-mega-tab', selected ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={() => selectCategory(category.id, true)}
                onMouseEnter={() => selectCategory(category.id)}
                onFocus={() => selectCategory(category.id, true)}
              >
                {category.label}
              </button>
            )
          })}
        </div>
        <button type="button" className="shop-mega-close" aria-label="Close solutions menu" onClick={onClose}>
          <X size={18} weight="bold" aria-hidden />
        </button>
      </div>

      <div
        key={active.id}
        id={`solutions-mega-panel-${active.id}`}
        className="shop-mega-body"
        role="tabpanel"
        aria-labelledby={`solutions-mega-tab-${active.id}`}
      >
        <div className="shop-mega-main">
          <header className="shop-mega-heading">
            <div>
              <p className="shop-mega-kicker">Solutions</p>
              <h2>{active.label}</h2>
            </div>
            <Link className="shop-mega-shop-all" to={active.href} onClick={onClose}>
              View all
              <ArrowRight size={14} weight="bold" aria-hidden />
            </Link>
          </header>

          <div
            className="shop-mega-columns"
            style={{ '--shop-mega-cols': String(active.columns.length) } as CSSProperties}
          >
            {active.columns.map((column) => (
              <div key={column.heading} className="shop-mega-column">
                <h3>{column.heading}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {isInternalPath(link.href) ? (
                        <Link to={link.href} onClick={onClose}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Link className="shop-mega-promo" to={SOLUTIONS_MEGA_PROMO.href} onClick={onClose}>
          <img className="shop-mega-promo-image" src={active.image} alt="" />
          <span className="sr-only">{active.imageAlt}. </span>
          <span className="shop-mega-promo-copy">
            <span className="shop-mega-promo-kicker">{SOLUTIONS_MEGA_PROMO.kicker}</span>
            <span className="shop-mega-promo-title">{SOLUTIONS_MEGA_PROMO.title}</span>
            <span className="shop-mega-promo-cta">
              {SOLUTIONS_MEGA_PROMO.cta}
              <ArrowRight size={14} weight="bold" aria-hidden />
            </span>
          </span>
        </Link>
      </div>

      <div className="shop-mega-footer">
        {SOLUTIONS_MEGA_FOOTER.map((item) =>
          isInternalPath(item.href) ? (
            <Link key={item.label} className="shop-mega-pill" to={item.href} onClick={onClose}>
              <FooterIcon name={item.icon} />
              {item.label}
            </Link>
          ) : (
            <a
              key={item.label}
              className="shop-mega-pill"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <FooterIcon name={item.icon} />
              {item.label}
            </a>
          ),
        )}
      </div>
    </div>
  )
}
