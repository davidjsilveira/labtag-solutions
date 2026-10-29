import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  CaretDown,
  ChatCircle,
  ClipboardText,
  List,
  MagnifyingGlass,
  MagnifyingGlassPlus,
  Package,
  Phone,
  Scissors,
  ShoppingCart,
  SquaresFour,
  User,
} from '@phosphor-icons/react'
import { solutionPages } from '@/content/loadPages'
import {
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  LABTAG_ACCESSORIES_URL,
  LABTAG_ACCOUNT_URL,
  LABTAG_CART_URL,
  LABTAG_EN_URL,
  LABTAG_FINDER_URL,
  LABTAG_FR_URL,
  LABTAG_LABELS_URL,
  LABTAG_PRINT_URL,
  LABTAG_PROMOS_URL,
  LABTAG_SHOP_URL,
  LABTAG_TAPES_URL,
  LABTAG_TAGS_URL,
  LABTAG_TEMPLATES_HUB_URL,
  QUOTE_PATH,
  SAMPLE_PATH,
  SOLUTIONS_PATH,
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

const LANGUAGE_OPTIONS = [
  { label: 'English', href: LABTAG_EN_URL },
  { label: 'Français', href: LABTAG_FR_URL },
] as const

const UNIT_OPTIONS = [
  { id: 'metric', label: 'Millimeters', detail: 'Metric (Millimeters)' },
  { id: 'imperial', label: 'Inches', detail: 'Imperial (Inches)' },
] as const

const DEPARTMENT_LINKS = [
  {
    label: 'Shop all',
    to: SOLUTIONS_PATH,
    icon: true,
    current: (path: string) => path === SOLUTIONS_PATH,
  },
  { label: 'Labels', href: LABTAG_LABELS_URL },
  { label: 'Tapes', href: LABTAG_TAPES_URL },
  { label: 'Tags', href: LABTAG_TAGS_URL },
  { label: 'Print & scan', href: LABTAG_PRINT_URL },
  { label: 'Accessories', href: LABTAG_ACCESSORIES_URL },
] as const

const UTILITY_LINKS = [
  { label: 'Templates', href: LABTAG_TEMPLATES_HUB_URL, Icon: SquaresFour },
  { label: 'Label Finder', href: LABTAG_FINDER_URL, Icon: MagnifyingGlassPlus },
  { label: 'Account', href: LABTAG_ACCOUNT_URL, Icon: User },
  { label: 'Card', href: LABTAG_CART_URL, Icon: ShoppingCart },
] as const

function findCatalogMatch(query: string) {
  const q = query.toLowerCase()
  const slugQuery = q.replace(/\s+/g, '-')

  return (
    solutionPages.find((page) => page.title.toLowerCase() === q || page.slug === slugQuery) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().startsWith(q) || page.slug.startsWith(slugQuery),
    ) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().includes(q) || page.slug.includes(slugQuery),
    )
  )
}

export function SiteNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const sectionActive = CONTACT_PATHS.has(pathname)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [promoOpen, setPromoOpen] = useState<'lang' | 'units' | null>(null)
  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]['label']>('Français')
  const [unit, setUnit] = useState<(typeof UNIT_OPTIONS)[number]['id']>('metric')
  const rootRef = useRef<HTMLDivElement>(null)
  const promoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setPromoOpen(null)
  }, [pathname])

  useEffect(() => {
    if (!open && !promoOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      setPromoOpen(null)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) setOpen(false)
      if (!promoRef.current?.contains(target)) setPromoOpen(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, promoOpen])

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('q') ?? query).trim()
    if (!next) return

    const match = findCatalogMatch(next)
    if (match) {
      navigate(`/solutions/${match.slug}`)
      setQuery('')
      return
    }

    const shop = new URL(LABTAG_SHOP_URL)
    shop.searchParams.set('s', next)
    window.open(shop.toString(), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="site-promo">
        <div className="site-header-inner">
          <a className="site-promo-phone" href={PHONE_TOLL_FREE.href}>
            Talk to a scientist: {PHONE_TOLL_FREE.label}
          </a>
          <p className="site-promo-message">
            Free DYMO printer with 8+ rolls of select LWS2 labels{' '}
            <a href={LABTAG_PROMOS_URL} target="_blank" rel="noreferrer">
              See details
            </a>
          </p>
          <div className="site-promo-links" ref={promoRef}>
            <div
              className={['site-promo-menu', promoOpen === 'lang' ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setPromoOpen('lang')}
              onMouseLeave={() => setPromoOpen((value) => (value === 'lang' ? null : value))}
            >
              <button
                type="button"
                className="site-promo-menu-trigger"
                aria-expanded={promoOpen === 'lang'}
                aria-haspopup="true"
                aria-controls="site-promo-lang-menu"
                onClick={() => setPromoOpen((value) => (value === 'lang' ? null : 'lang'))}
              >
                {language}
                <CaretDown size={10} weight="bold" aria-hidden />
              </button>
              <div
                id="site-promo-lang-menu"
                className="site-promo-menu-card"
                role="menu"
                aria-label="Language"
              >
                {LANGUAGE_OPTIONS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                    className="site-promo-menu-item"
                    aria-current={language === item.label ? 'true' : undefined}
                    onClick={() => setLanguage(item.label)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div
              className={['site-promo-menu', promoOpen === 'units' ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setPromoOpen('units')}
              onMouseLeave={() => setPromoOpen((value) => (value === 'units' ? null : value))}
            >
              <button
                type="button"
                className="site-promo-menu-trigger"
                aria-expanded={promoOpen === 'units'}
                aria-haspopup="true"
                aria-controls="site-promo-units-menu"
                onClick={() => setPromoOpen((value) => (value === 'units' ? null : 'units'))}
              >
                {UNIT_OPTIONS.find((item) => item.id === unit)?.label}
                <CaretDown size={10} weight="bold" aria-hidden />
              </button>
              <div
                id="site-promo-units-menu"
                className="site-promo-menu-card"
                role="menu"
                aria-label="Units of measurement"
              >
                <p className="site-promo-menu-heading">Units of measurement</p>
                {UNIT_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className="site-promo-menu-item"
                    aria-current={unit === item.id ? 'true' : undefined}
                    onClick={() => {
                      setUnit(item.id)
                      setPromoOpen(null)
                    }}
                  >
                    {item.detail}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-nav">
        <div className="site-nav-utility">
          <div className="site-header-inner">
            <Link className="logo" to="/">
              LabTAG
            </Link>

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
            </form>

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

              {UTILITY_LINKS.map((item) => (
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

        <div className="site-nav-departments">
          <div className="site-header-inner">
            <div className="site-nav-departments-list">
              {DEPARTMENT_LINKS.map((item) => {
                const className = [
                  'site-nav-department',
                  'icon' in item && item.icon ? 'is-shop-all' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                const icon =
                  'icon' in item && item.icon ? <List size={18} weight="bold" aria-hidden /> : null

                if ('href' in item) {
                  return (
                    <a
                      key={item.label}
                      className={className}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    className={className}
                    to={item.to}
                    aria-current={item.current(pathname) ? 'page' : undefined}
                  >
                    {icon}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
