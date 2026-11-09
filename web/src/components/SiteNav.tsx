import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  CaretDown,
  ChatCircle,
  Check,
  ClipboardText,
  MagnifyingGlass,
  MagnifyingGlassPlus,
  Package,
  Phone,
  Scissors,
  ShoppingCart,
  Sparkle,
  SquaresFour,
  User,
} from '@phosphor-icons/react'
import { ResourcesMegaMenu } from '@/components/ResourcesMegaMenu'
import { ShopMegaMenu } from '@/components/ShopMegaMenu'
import { SolutionsMegaMenu } from '@/components/SolutionsMegaMenu'
import { findCatalogMatch } from '@/content/catalogMatch'
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'
import {
  LANGUAGE_OPTIONS,
  UNIT_EVENT,
  UNIT_OPTIONS,
  readUnit,
  writeUnit,
  type UnitId,
} from '@/content/preferences'
import {
  CONTACT_PATH,
  HELP_PATH,
  TAGI_PATH,
  CUSTOM_LABELS_PATH,
  LABTAG_CART_URL,
  LABTAG_CREATE_ACCOUNT_URL,
  LABTAG_FINDER_URL,
  LABTAG_ORDERS_URL,
  LABTAG_PROMOS_URL,
  LABTAG_SHOP_URL,
  LABTAG_SIGN_IN_URL,
  LABTAG_TEMPLATES_HUB_URL,
  QUOTE_PATH,
  SAMPLE_PATH,
  SOLUTIONS_PATH,
  WHY_CHOOSE_PATH,
} from '@/content/labtagLinks'

const PHONE_TOLL_FREE = { label: '1 800 518 0364', href: 'tel:+18005180364' }

const CONTACT_ITEMS = [
  {
    to: CUSTOM_LABELS_PATH,
    title: 'Custom labels',
    lede: 'Die cut to spec from your file.',
    Icon: Scissors,
  },
  {
    to: SAMPLE_PATH,
    title: 'Request a free sample',
    lede: 'Test adhesion in your own freezer.',
    Icon: Package,
  },
  {
    to: QUOTE_PATH,
    title: 'Request a quote',
    lede: 'Quantity, date, and price before you order.',
    Icon: ClipboardText,
  },
]

const CONTACT_PATHS = new Set([CONTACT_PATH, ...CONTACT_ITEMS.map((item) => item.to)])

const UTILITY_LINKS = [
  { label: 'Templates', href: LABTAG_TEMPLATES_HUB_URL, Icon: SquaresFour },
  { label: 'Label Finder', href: LABTAG_FINDER_URL, Icon: MagnifyingGlassPlus },
  { label: 'Cart', href: LABTAG_CART_URL, Icon: ShoppingCart },
] as const

const ACCOUNT_BENEFITS = [
  'Manage orders',
  'Get free samples',
  'Create custom labels',
  'Accelerate your workflow',
] as const

export function SiteNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const sectionActive = CONTACT_PATHS.has(pathname)
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [primaryOpen, setPrimaryOpen] = useState<'products' | 'solutions' | 'resources' | null>(
    null,
  )
  const [primaryLocked, setPrimaryLocked] = useState(false)
  const [query, setQuery] = useState('')
  const [unit, setUnit] = useState<UnitId>('metric')
  const rootRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLElement>(null)
  const megaCloseTimerRef = useRef<number | null>(null)
  const megaOpen =
    primaryOpen === 'products' || primaryOpen === 'solutions' || primaryOpen === 'resources'

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current == null) return
    window.clearTimeout(megaCloseTimerRef.current)
    megaCloseTimerRef.current = null
  }

  const openPrimary = (next: 'products' | 'solutions' | 'resources') => {
    clearMegaCloseTimer()
    setPrimaryLocked(false)
    setPrimaryOpen(next)
  }

  const closePrimary = (lock = false) => {
    clearMegaCloseTimer()
    setPrimaryOpen(null)
    setPrimaryLocked(lock)
  }

  const togglePrimary = (next: 'products' | 'solutions' | 'resources') => {
    clearMegaCloseTimer()
    setPrimaryOpen((current) => {
      if (current === next) {
        setPrimaryLocked(true)
        return null
      }
      setPrimaryLocked(false)
      return next
    })
  }

  const openMegaMenu = (next: 'products' | 'solutions' | 'resources') => openPrimary(next)

  const scheduleMegaClose = (kind: 'products' | 'solutions' | 'resources') => {
    clearMegaCloseTimer()
    megaCloseTimerRef.current = window.setTimeout(() => {
      megaCloseTimerRef.current = null
      setPrimaryOpen((current) => (current === kind ? null : current))
      setPrimaryLocked(false)
    }, 320)
  }

  const closeMegaMenu = () => closePrimary(true)
  const solutionsCurrent = pathname === SOLUTIONS_PATH || pathname.startsWith('/solutions/')
  const resourcesCurrent = pathname === HELP_PATH || pathname === TAGI_PATH

  useEffect(() => {
    setUnit(readUnit())
    const onUnit = (event: Event) => {
      const next = (event as CustomEvent<UnitId>).detail
      if (UNIT_OPTIONS.some((item) => item.id === next)) setUnit(next)
    }
    window.addEventListener(UNIT_EVENT, onUnit)
    return () => window.removeEventListener(UNIT_EVENT, onUnit)
  }, [])

  useEffect(() => {
    setOpen(false)
    setAccountOpen(false)
    setPrimaryOpen(null)
    setPrimaryLocked(false)
    clearMegaCloseTimer()
  }, [pathname])

  useEffect(() => () => clearMegaCloseTimer(), [])

  useEffect(() => {
    if (!megaOpen) {
      document.documentElement.style.removeProperty('--shop-mega-backdrop-top')
      return
    }

    const syncBackdropTop = () => {
      const mega = document.querySelector('.shop-mega.is-open')
      if (!(mega instanceof HTMLElement)) return
      const bottom = Math.ceil(mega.getBoundingClientRect().bottom)
      document.documentElement.style.setProperty('--shop-mega-backdrop-top', `${bottom}px`)
    }

    const frame = window.requestAnimationFrame(syncBackdropTop)
    const mega = document.querySelector('.shop-mega.is-open')
    const observer =
      mega instanceof HTMLElement ? new ResizeObserver(syncBackdropTop) : null
    if (mega instanceof HTMLElement) observer?.observe(mega)
    window.addEventListener('resize', syncBackdropTop)
    window.addEventListener('scroll', syncBackdropTop, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', syncBackdropTop)
      window.removeEventListener('scroll', syncBackdropTop)
      document.documentElement.style.removeProperty('--shop-mega-backdrop-top')
    }
  }, [megaOpen, primaryOpen])

  useEffect(() => {
    const header = document.querySelector('.site-header')
    const pin = document.querySelector('.site-header-pin')
    if (!(header instanceof HTMLElement) || !pin) return

    const promo = header.querySelector('.site-promo')
    const setPromoH = () => {
      if (!(promo instanceof HTMLElement)) return
      const height = promo.getBoundingClientRect().height
      if (height > 0) header.style.setProperty('--promo-h', `${Math.round(height)}px`)
    }
    setPromoH()

    const observer = new IntersectionObserver(([entry]) => {
      const compact = !entry.isIntersecting
      header.classList.toggle('is-compact', compact)
      if (compact) {
        setAccountOpen(false)
        setPrimaryOpen(null)
      }
      window.requestAnimationFrame(() => syncAnchorScrollMargin())
    })
    observer.observe(pin)

    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY)
        if (y <= 8) {
          header.classList.remove('is-away')
        } else if (y > lastY + 2) {
          header.classList.add('is-away')
          setOpen(false)
          setAccountOpen(false)
          setPrimaryOpen(null)
        } else if (y < lastY - 2) {
          header.classList.remove('is-away')
        }
        lastY = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', setPromoH)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setPromoH)
    }
  }, [])

  useEffect(() => {
    if (!open && !accountOpen && !primaryOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      setAccountOpen(false)
      setPrimaryOpen(null)
      clearMegaCloseTimer()
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) setOpen(false)
      if (!accountRef.current?.contains(target)) setAccountOpen(false)
      if (!primaryRef.current?.contains(target)) {
        clearMegaCloseTimer()
        setPrimaryOpen(null)
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, accountOpen, primaryOpen])

  const goToQuery = (next: string) => {
    const q = next.trim()
    if (!q) return false

    const match = findCatalogMatch(q)
    if (match) {
      navigate(`/solutions/${match.slug}`)
      return true
    }

    const shop = new URL(LABTAG_SHOP_URL)
    shop.searchParams.set('s', q)
    window.open(shop.toString(), '_blank', 'noopener,noreferrer')
    return true
  }

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('q') ?? query).trim()
    if (!goToQuery(next)) return
    setQuery('')
  }

  const askTo = query.trim() ? `${TAGI_PATH}?q=${encodeURIComponent(query.trim())}` : TAGI_PATH

  return (
    <>
      <div className="site-promo">
        <div className="site-header-inner">
          <p className="site-promo-message">
            Free DYMO printer with 8+ rolls of select LWS2 labels{' '}
            <a href={LABTAG_PROMOS_URL} target="_blank" rel="noreferrer">
              See details
            </a>
          </p>
          <p className="site-promo-iso">
            <Link to={WHY_CHOOSE_PATH}>ISO 9001:2015 certified</Link>
            <span aria-hidden="true">·</span>
            <Link to={WHY_CHOOSE_PATH}>ISO 22301 compliant</Link>
          </p>
        </div>
      </div>

      <div className="site-nav">
        <div className="site-nav-utility">
          <div className="site-header-inner">
            <Link className="logo" to="/">
              LabTAG
            </Link>

            <div className="site-nav-find">
              <form className="site-nav-search" role="search" onSubmit={onSearch}>
                <MagnifyingGlass size={18} weight="bold" aria-hidden />
                <input
                  type="search"
                  name="q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="What are you looking for?"
                  aria-label="Search labels and protocols"
                  autoComplete="off"
                />
                <Link
                  className={['site-nav-ask-btn', pathname === TAGI_PATH ? 'is-current' : '']
                    .filter(Boolean)
                    .join(' ')}
                  to={askTo}
                  aria-current={pathname === TAGI_PATH ? 'page' : undefined}
                  onClick={() => setQuery('')}
                >
                  <Sparkle size={16} weight="fill" aria-hidden />
                  Ask Tagi
                </Link>
              </form>
            </div>

            <nav className="site-nav-primary" aria-label="Primary" ref={primaryRef}>
              <div
                className={[
                  'site-nav-primary-item',
                  'is-shop',
                  primaryOpen === 'products' ? 'is-open' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => {
                  if (primaryLocked) return
                  openMegaMenu('products')
                }}
                onMouseLeave={() => {
                  if (primaryLocked) {
                    setPrimaryLocked(false)
                    clearMegaCloseTimer()
                    return
                  }
                  scheduleMegaClose('products')
                }}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'products'}
                  aria-haspopup="dialog"
                  aria-controls="site-nav-products-menu"
                  onClick={() => togglePrimary('products')}
                  onFocus={() => {
                    if (!primaryLocked) openMegaMenu('products')
                  }}
                >
                  Shop
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel site-nav-shop-panel">
                  <ShopMegaMenu open={primaryOpen === 'products'} onClose={closeMegaMenu} />
                </div>
              </div>

              <div
                className={[
                  'site-nav-primary-item',
                  'is-shop',
                  primaryOpen === 'solutions' ? 'is-open' : '',
                  solutionsCurrent ? 'is-current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => {
                  if (primaryLocked) return
                  openMegaMenu('solutions')
                }}
                onMouseLeave={() => {
                  if (primaryLocked) {
                    setPrimaryLocked(false)
                    clearMegaCloseTimer()
                    return
                  }
                  scheduleMegaClose('solutions')
                }}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'solutions'}
                  aria-haspopup="dialog"
                  aria-controls="site-nav-solutions-menu"
                  onClick={() => togglePrimary('solutions')}
                  onFocus={() => {
                    if (!primaryLocked) openMegaMenu('solutions')
                  }}
                >
                  Solutions
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel site-nav-shop-panel">
                  <SolutionsMegaMenu open={primaryOpen === 'solutions'} onClose={closeMegaMenu} />
                </div>
              </div>

              <div
                className={[
                  'site-nav-primary-item',
                  'is-shop',
                  primaryOpen === 'resources' ? 'is-open' : '',
                  resourcesCurrent ? 'is-current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => {
                  if (primaryLocked) return
                  openMegaMenu('resources')
                }}
                onMouseLeave={() => {
                  if (primaryLocked) {
                    setPrimaryLocked(false)
                    clearMegaCloseTimer()
                    return
                  }
                  scheduleMegaClose('resources')
                }}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'resources'}
                  aria-haspopup="dialog"
                  aria-controls="site-nav-resources-menu"
                  onClick={() => togglePrimary('resources')}
                  onFocus={() => {
                    if (!primaryLocked) openMegaMenu('resources')
                  }}
                >
                  Resources
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel site-nav-shop-panel">
                  <ResourcesMegaMenu open={primaryOpen === 'resources'} onClose={closeMegaMenu} />
                </div>
              </div>
            </nav>

            <div className="site-nav-tools">
              <div
                ref={rootRef}
                className={['site-nav-contact', open ? 'is-open' : ''].filter(Boolean).join(' ')}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div
                  className={
                    ['site-nav-contact-trigger', sectionActive ? 'is-current' : '']
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  <NavLink to={CONTACT_PATH} end className="site-nav-contact-label">
                    <ChatCircle className="site-nav-contact-mobile-icon" size={20} weight="regular" aria-hidden />
                    <span className="site-nav-contact-label-text">Contact Us</span>
                  </NavLink>
                  <button
                    type="button"
                    className="site-nav-contact-caret-btn"
                    aria-expanded={open}
                    aria-haspopup="true"
                    aria-controls="site-nav-contact-menu"
                    aria-label="Contact options"
                    onClick={() => setOpen((value) => !value)}
                  >
                    <CaretDown className="site-nav-contact-caret" size={14} weight="bold" aria-hidden />
                  </button>
                </div>
                <div className="site-nav-contact-panel">
                  <div
                    id="site-nav-contact-menu"
                    className="site-nav-contact-card"
                    role="menu"
                    aria-label="Contact options"
                  >
                    {CONTACT_ITEMS.map((item, index) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        role="menuitem"
                        className="site-nav-contact-item"
                        style={{ '--i': String(index) } as CSSProperties}
                      >
                        <span className="site-nav-contact-icon" aria-hidden>
                          <item.Icon size={22} weight="duotone" />
                        </span>
                        <span className="site-nav-contact-copy">
                          <span className="site-nav-contact-title">{item.title}</span>
                          <span className="site-nav-contact-lede">{item.lede}</span>
                        </span>
                      </NavLink>
                    ))}
                    <div className="site-nav-contact-call">
                      <a
                        href={PHONE_TOLL_FREE.href}
                        role="menuitem"
                        className="site-nav-contact-item"
                        style={{ '--i': String(CONTACT_ITEMS.length) } as CSSProperties}
                      >
                        <span className="site-nav-contact-icon" aria-hidden>
                          <Phone size={22} weight="duotone" />
                        </span>
                        <span className="site-nav-contact-copy">
                          <span className="site-nav-contact-title">{PHONE_TOLL_FREE.label}</span>
                          <span className="site-nav-contact-lede">North America, toll free</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {UTILITY_LINKS.slice(0, 2).map((item) => (
                <a
                  key={item.label}
                  className="site-nav-tool"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <item.Icon size={20} weight="regular" aria-hidden />
                  <span>{item.label}</span>
                </a>
              ))}

              <div
                ref={accountRef}
                className={['site-nav-account', accountOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className="site-nav-tool site-nav-account-trigger"
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                  aria-controls="site-nav-account-menu"
                  onClick={() => setAccountOpen(true)}
                >
                  <User size={20} weight="regular" aria-hidden />
                  <span className="site-nav-account-name">
                    Account
                    <CaretDown className="site-nav-account-caret" size={10} weight="bold" aria-hidden />
                  </span>
                </button>
                <div className="site-nav-account-panel">
                  <div
                    id="site-nav-account-menu"
                    className="site-nav-account-card"
                    role="menu"
                    aria-label="Account"
                  >
                    <div className="site-nav-account-intro">
                      <p className="site-nav-account-title">Create your account</p>
                      <ul className="site-nav-account-benefits">
                        {ACCOUNT_BENEFITS.map((item) => (
                          <li key={item}>
                            <Check size={14} weight="bold" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="site-nav-account-actions">
                      <a
                        href={LABTAG_SIGN_IN_URL}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className="site-nav-account-btn is-primary"
                      >
                        Sign In
                      </a>
                      <a
                        href={LABTAG_CREATE_ACCOUNT_URL}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className="site-nav-account-btn is-secondary"
                      >
                        Create Account
                      </a>
                      <a
                        href={LABTAG_ORDERS_URL}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className="site-nav-account-btn is-secondary"
                      >
                        My orders
                      </a>
                    </div>
                    <div className="site-nav-account-group">
                      <p className="site-nav-account-heading">Language</p>
                      <div className="site-nav-account-choices" role="group" aria-label="Language">
                        {LANGUAGE_OPTIONS.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            role="menuitem"
                            className="site-nav-account-choice"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="site-nav-account-group">
                      <p className="site-nav-account-heading">Units of measurement</p>
                      <div
                        className="site-nav-account-choices"
                        role="group"
                        aria-label="Units of measurement"
                      >
                        {UNIT_OPTIONS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            role="menuitemradio"
                            className="site-nav-account-choice"
                            aria-checked={unit === item.id}
                            onClick={() => writeUnit(item.id)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {UTILITY_LINKS.slice(2).map((item) => (
                <a
                  key={item.label}
                  className="site-nav-tool"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <item.Icon size={20} weight="regular" aria-hidden />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <button
            type="button"
            className={['shop-mega-backdrop', megaOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
            aria-label={
              primaryOpen === 'resources'
                ? 'Close resources menu'
                : primaryOpen === 'solutions'
                  ? 'Close solutions menu'
                  : 'Close shop menu'
            }
            aria-hidden={!megaOpen}
            tabIndex={megaOpen ? 0 : -1}
            onClick={closeMegaMenu}
          />,
          document.body,
        )}
    </>
  )
}
