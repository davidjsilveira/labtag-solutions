import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CaretDown,
  ChatCircle,
  ClipboardText,
  List,
  MagnifyingGlass,
  MagnifyingGlassPlus,
  Minus,
  Package,
  Phone,
  Scissors,
  ShoppingCart,
  Sparkle,
  SquaresFour,
  User,
} from '@phosphor-icons/react'
import { resolveImageSrc } from '@/content/resolveImage'
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
  LABTAG_PRIVACY_URL,
  LABTAG_PROMOS_URL,
  LABTAG_SHOP_URL,
  LABTAG_TAPES_URL,
  LABTAG_TAGS_URL,
  LABTAG_TEMPLATES_HUB_URL,
  LABTAG_TERMS_URL,
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
  { id: 'metric', label: 'Millimeters' },
  { id: 'imperial', label: 'Inches' },
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
  { label: 'Cart', href: LABTAG_CART_URL, Icon: ShoppingCart },
] as const

const ASK_PROMPTS = [
  'Labels for liquid nitrogen',
  'Labels that stick to frozen vials',
  'DYMO labels for the bench',
] as const

const ASK_BANNER = resolveImageSrc('/media/cryogenic-labels/DTU-7-use4-wp.jpg')

type AskMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  to?: string
  href?: string
  linkLabel?: string
}

const ASK_STOP = new Set(['for', 'the', 'and', 'that', 'with', 'from', 'are', 'you'])

function pageText(page: (typeof solutionPages)[number]) {
  return `${page.title} ${page.slug.replace(/-/g, ' ')} ${page.excerpt} ${page.description.join(' ')}`.toLowerCase()
}

function findCatalogMatch(query: string) {
  const q = query.toLowerCase()
  const slugQuery = q.replace(/\s+/g, '-')
  const tokens = q
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !ASK_STOP.has(token))

  const ranked = solutionPages
    .map((page) => {
      const hay = pageText(page)
      const hits = tokens.filter((token) => hay.includes(token)).length
      return { page, hits }
    })
    .sort((a, b) => b.hits - a.hits)

  return (
    solutionPages.find((page) => page.title.toLowerCase() === q || page.slug === slugQuery) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().startsWith(q) || page.slug.startsWith(slugQuery),
    ) ??
    solutionPages.find(
      (page) => page.title.toLowerCase().includes(q) || page.slug.includes(slugQuery),
    ) ??
    (ranked[0] && ranked[0].hits >= Math.min(2, tokens.length) ? ranked[0].page : undefined)
  )
}

export function SiteNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const sectionActive = CONTACT_PATHS.has(pathname)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [askOpen, setAskOpen] = useState(false)
  const [askQuery, setAskQuery] = useState('')
  const [askMessages, setAskMessages] = useState<AskMessage[]>([])
  const [promoOpen, setPromoOpen] = useState<'lang' | 'units' | null>(null)
  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]['label']>('Français')
  const [unit, setUnit] = useState<(typeof UNIT_OPTIONS)[number]['id']>('metric')
  const rootRef = useRef<HTMLDivElement>(null)
  const promoRef = useRef<HTMLDivElement>(null)
  const promoCloseTimer = useRef<number>(0)
  const askBtnRef = useRef<HTMLButtonElement>(null)
  const askInputRef = useRef<HTMLInputElement>(null)
  const askTitleId = useId()

  const openPromo = (id: 'lang' | 'units') => {
    window.clearTimeout(promoCloseTimer.current)
    setPromoOpen(id)
  }

  const closePromo = (id: 'lang' | 'units') => {
    window.clearTimeout(promoCloseTimer.current)
    promoCloseTimer.current = window.setTimeout(() => {
      setPromoOpen((value) => (value === id ? null : value))
    }, 140)
  }

  useEffect(() => {
    setOpen(false)
    setPromoOpen(null)
    window.clearTimeout(promoCloseTimer.current)
  }, [pathname])

  useEffect(() => () => window.clearTimeout(promoCloseTimer.current), [])

  useEffect(() => {
    if (!askOpen) return
    askInputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [askOpen])

  useEffect(() => {
    if (!open && !promoOpen && !askOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      setAskOpen(false)
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
  }, [open, promoOpen, askOpen])

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
    const next = String(new FormData(event.currentTarget).get('q') ?? query)
    if (!goToQuery(next)) return
    setQuery('')
  }

  const askWith = (raw: string) => {
    const q = raw.trim()
    if (!q) return

    const match = findCatalogMatch(q)
    const shop = new URL(LABTAG_SHOP_URL)
    shop.searchParams.set('s', q)
    const reply: AskMessage = match
      ? {
          id: `a-${q}-${askMessages.length}`,
          role: 'assistant',
          text: `I would start with ${match.title}. Open the solution page to check temperature, container, and print method.`,
          to: `/solutions/${match.slug}`,
          linkLabel: match.title,
        }
      : {
          id: `a-${q}-${askMessages.length}`,
          role: 'assistant',
          text: 'I do not have a local match for that. Search the shop, or talk with a specialist.',
          href: shop.toString(),
          linkLabel: 'Search the shop',
        }

    setAskMessages((current) => [
      ...current,
      { id: `u-${q}-${current.length}`, role: 'user', text: q },
      reply,
    ])
    setAskQuery('')
  }

  const onAsk = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('ask') ?? askQuery)
    askWith(next)
  }

  const clearAsk = () => {
    setAskMessages([])
    setAskQuery('')
    askInputRef.current?.focus()
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
              className={['site-promo-menu', 'site-promo-menu-lang', promoOpen === 'lang' ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => openPromo('lang')}
              onMouseLeave={() => closePromo('lang')}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) closePromo('lang')
              }}
            >
              <button
                type="button"
                className="site-promo-menu-trigger"
                aria-expanded={promoOpen === 'lang'}
                aria-haspopup="true"
                aria-controls="site-promo-lang-menu"
                onClick={() => openPromo('lang')}
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
                {LANGUAGE_OPTIONS.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                    className="site-promo-menu-item"
                    style={{ '--i': String(index) } as CSSProperties}
                    aria-current={language === item.label ? 'true' : undefined}
                    onClick={() => setLanguage(item.label)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div
              className={['site-promo-menu', 'site-promo-menu-units', promoOpen === 'units' ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => openPromo('units')}
              onMouseLeave={() => closePromo('units')}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) closePromo('units')
              }}
            >
              <button
                type="button"
                className="site-promo-menu-trigger"
                aria-expanded={promoOpen === 'units'}
                aria-haspopup="true"
                aria-controls="site-promo-units-menu"
                onClick={() => openPromo('units')}
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
                {UNIT_OPTIONS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className="site-promo-menu-item"
                    style={{ '--i': String(index) } as CSSProperties}
                    aria-current={unit === item.id ? 'true' : undefined}
                    onClick={() => {
                      setUnit(item.id)
                      setPromoOpen(null)
                    }}
                  >
                    {item.label}
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
              </form>
              <div className={['site-nav-ask', askOpen ? 'is-open' : ''].filter(Boolean).join(' ')}>
                <button
                  ref={askBtnRef}
                  type="button"
                  className="site-nav-ask-btn"
                  aria-expanded={askOpen}
                  aria-haspopup="dialog"
                  aria-controls="site-nav-ask-panel"
                  onClick={() => setAskOpen((value) => !value)}
                >
                  <Sparkle size={16} weight="fill" aria-hidden />
                  Ask AI
                </button>
                {typeof document !== 'undefined' &&
                  createPortal(
                    <div
                      className={['site-nav-ask-layer', askOpen ? 'is-open' : '']
                        .filter(Boolean)
                        .join(' ')}
                      inert={!askOpen ? true : undefined}
                    >
                      <div
                        className="site-nav-ask-overlay"
                        onClick={() => setAskOpen(false)}
                      />
                      <aside
                        id="site-nav-ask-panel"
                        className="site-nav-ask-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={askTitleId}
                        aria-hidden={!askOpen}
                      >
                        <div className="site-nav-ask-top">
                          <h2 id={askTitleId} className="site-nav-ask-heading">
                            Ask LabTAG
                          </h2>
                          <button
                            type="button"
                            className="site-nav-ask-clear"
                            onClick={clearAsk}
                          >
                            Clear chat
                          </button>
                          <button
                            type="button"
                            className="site-nav-ask-close"
                            aria-label="Close Ask LabTAG"
                            onClick={() => {
                              setAskOpen(false)
                              askBtnRef.current?.focus()
                            }}
                          >
                            <Minus size={18} weight="bold" aria-hidden />
                          </button>
                        </div>
                        <p className="site-nav-ask-legal">
                          By using Ask LabTAG, you agree to the{' '}
                          <a href={LABTAG_PRIVACY_URL} target="_blank" rel="noreferrer">
                            privacy policy
                          </a>{' '}
                          and{' '}
                          <a href={LABTAG_TERMS_URL} target="_blank" rel="noreferrer">
                            terms of use
                          </a>
                          .
                        </p>
                        <div className="site-nav-ask-body">
                          {askMessages.length === 0 ? (
                            <>
                              <figure className="site-nav-ask-banner">
                                <img
                                  src={ASK_BANNER.primary}
                                  alt="A gloved hand applying a cryogenic label to a vial"
                                />
                                <figcaption>Describe the sample. We will find a label.</figcaption>
                              </figure>
                              <p className="site-nav-ask-lede">
                                Hi. I can help you pick a LabTAG label. Tell me the temperature,
                                container, or printer, or keep it short and I will point you to a
                                match.
                              </p>
                              <p className="site-nav-ask-lede">You can ask me things like:</p>
                              <div className="site-nav-ask-chips">
                                {ASK_PROMPTS.map((prompt) => (
                                  <button
                                    key={prompt}
                                    type="button"
                                    className="site-nav-ask-chip"
                                    onClick={() => askWith(prompt)}
                                  >
                                    <Sparkle size={14} weight="fill" aria-hidden />
                                    {prompt}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <ol className="site-nav-ask-thread">
                              {askMessages.map((item) => (
                                <li
                                  key={item.id}
                                  className={`site-nav-ask-msg is-${item.role}`}
                                >
                                  <p>{item.text}</p>
                                  {item.to ? (
                                    <Link to={item.to} onClick={() => setAskOpen(false)}>
                                      {item.linkLabel}
                                    </Link>
                                  ) : null}
                                  {item.href ? (
                                    <a href={item.href} target="_blank" rel="noreferrer">
                                      {item.linkLabel}
                                    </a>
                                  ) : null}
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                        <form className="site-nav-ask-form" onSubmit={onAsk}>
                          <Sparkle size={16} weight="fill" aria-hidden />
                          <input
                            ref={askInputRef}
                            type="text"
                            name="ask"
                            value={askQuery}
                            onChange={(event) => setAskQuery(event.target.value)}
                            placeholder="I am looking for"
                            aria-label="Ask LabTAG"
                            autoComplete="off"
                          />
                          <button type="submit" aria-label="Send">
                            <ArrowRight size={16} weight="bold" aria-hidden />
                          </button>
                        </form>
                        <p className="site-nav-ask-note">
                          Ask LabTAG can miss a match. Check the product page before you order.
                        </p>
                      </aside>
                    </div>,
                    document.body,
                  )}
              </div>
            </div>

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
