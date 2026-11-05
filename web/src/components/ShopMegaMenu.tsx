import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Crosshair,
  Stack,
  Tag,
  X,
} from '@phosphor-icons/react'
import {
  SHOP_MEGA_CATEGORIES,
  SHOP_MEGA_FOOTER,
  SHOP_MEGA_PROMO,
  type ShopMegaCategory,
} from '@/content/shopMegaMenu'

type ShopMegaMenuProps = {
  open: boolean
  onClose: () => void
}

function FooterIcon({ name }: { name: (typeof SHOP_MEGA_FOOTER)[number]['icon'] }) {
  if (name === 'finder') return <Crosshair size={18} weight="bold" aria-hidden />
  if (name === 'template') return <Stack size={18} weight="bold" aria-hidden />
  return <Tag size={18} weight="bold" aria-hidden />
}

function isInternalPath(href: string) {
  return href.startsWith('/')
}

export function ShopMegaMenu({ open, onClose }: ShopMegaMenuProps) {
  const [activeId, setActiveId] = useState<ShopMegaCategory['id']>('labels')
  const tablistId = useId()
  const tabSwitchTimerRef = useRef<number | null>(null)
  const active = SHOP_MEGA_CATEGORIES.find((item) => item.id === activeId) ?? SHOP_MEGA_CATEGORIES[0]

  const clearTabSwitchTimer = () => {
    if (tabSwitchTimerRef.current == null) return
    window.clearTimeout(tabSwitchTimerRef.current)
    tabSwitchTimerRef.current = null
  }

  const selectCategory = (id: ShopMegaCategory['id'], immediate = false) => {
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
      id="site-nav-products-menu"
      className={['shop-mega', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="Shop"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div className="shop-mega-tabs">
        <div className="shop-mega-tabs-inner" role="tablist" aria-label="Product categories" id={tablistId}>
          {SHOP_MEGA_CATEGORIES.map((category) => {
            const selected = category.id === active.id
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`shop-mega-tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`shop-mega-panel-${category.id}`}
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
        <button type="button" className="shop-mega-close" aria-label="Close shop menu" onClick={onClose}>
          <X size={18} weight="bold" aria-hidden />
        </button>
      </div>

      <div
        key={active.id}
        id={`shop-mega-panel-${active.id}`}
        className="shop-mega-body"
        role="tabpanel"
        aria-labelledby={`shop-mega-tab-${active.id}`}
      >
        <div className="shop-mega-main">
          <header className="shop-mega-heading">
            <div>
              <p className="shop-mega-kicker">Products</p>
              <h2>{active.label}</h2>
            </div>
            <a className="shop-mega-shop-all" href={active.href} target="_blank" rel="noreferrer">
              Shop all
              <ArrowRight size={14} weight="bold" aria-hidden />
            </a>
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

        <a
          className="shop-mega-promo"
          href={SHOP_MEGA_PROMO.href}
          target="_blank"
          rel="noreferrer"
          style={{ backgroundImage: `url(${active.image})` }}
          aria-label={`${SHOP_MEGA_PROMO.cta}: ${active.imageAlt}`}
        >
          <span className="shop-mega-promo-copy">
            <span className="shop-mega-promo-kicker">{SHOP_MEGA_PROMO.kicker}</span>
            <span className="shop-mega-promo-title">{SHOP_MEGA_PROMO.title}</span>
            <span className="shop-mega-promo-cta">
              {SHOP_MEGA_PROMO.cta}
              <ArrowRight size={14} weight="bold" aria-hidden />
            </span>
          </span>
        </a>
      </div>

      <div className="shop-mega-footer">
        {SHOP_MEGA_FOOTER.map((item) =>
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
