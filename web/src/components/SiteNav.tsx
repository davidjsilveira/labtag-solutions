import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CaretDown,
  ChatCircle,
  Check,
  ClipboardText,
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
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'
import { solutionPages } from '@/content/loadPages'
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
  CUSTOM_LABELS_PATH,
  LABTAG_ACCESSORIES_URL,
  LABTAG_BLOG_URL,
  LABTAG_CART_URL,
  LABTAG_CREATE_ACCOUNT_URL,
  LABTAG_FAQ_URL,
  LABTAG_FINDER_URL,
  LABTAG_LABELS_URL,
  LABTAG_PRINT_URL,
  LABTAG_PRIVACY_URL,
  LABTAG_PROMOS_URL,
  LABTAG_RESOURCES_URL,
  LABTAG_SHOP_URL,
  LABTAG_SIGN_IN_URL,
  LABTAG_TAPES_URL,
  LABTAG_TAGS_URL,
  LABTAG_TEMPLATES_HUB_URL,
  LABTAG_TERMS_URL,
  LABTAG_VIDEOS_URL,
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

const PRODUCT_LINKS = [
  { label: 'Shop all', href: LABTAG_SHOP_URL },
  { label: 'Labels', href: LABTAG_LABELS_URL },
  { label: 'Tapes', href: LABTAG_TAPES_URL },
  { label: 'Tags', href: LABTAG_TAGS_URL },
  { label: 'Print & scan', href: LABTAG_PRINT_URL },
  { label: 'Accessories', href: LABTAG_ACCESSORIES_URL },
] as const

const SOLUTION_LINKS = [
  {
    label: 'All solutions',
    to: SOLUTIONS_PATH,
    current: (path: string) => path === SOLUTIONS_PATH,
  },
  { label: 'Cryogenic', to: '/solutions/cryogenic' },
  { label: 'Clinical trials', to: '/solutions/clinical-trials' },
  { label: 'Histology', to: '/solutions/histology' },
  { label: 'Lab tapes', to: '/solutions/laboratory-tapes' },
  { label: 'DYMO', to: '/solutions/dymo-labels' },
  { label: 'Printing', to: '/solutions/label-printing' },
  { label: 'Automation', to: '/solutions/automated-labware' },
] as const

const RESOURCE_LINKS = [
  { label: 'All resources', href: LABTAG_RESOURCES_URL },
  { label: 'Label Finder', href: LABTAG_FINDER_URL },
  { label: 'Templates', href: LABTAG_TEMPLATES_HUB_URL },
  { label: 'Videos', href: LABTAG_VIDEOS_URL },
  { label: 'FAQ', href: LABTAG_FAQ_URL },
  { label: 'Blog', href: LABTAG_BLOG_URL },
] as const

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
  const [accountOpen, setAccountOpen] = useState(false)
  const [primaryOpen, setPrimaryOpen] = useState<'products' | 'solutions' | 'resources' | null>(
    null,
  )
  const [query, setQuery] = useState('')
  const [askOpen, setAskOpen] = useState(false)
  const [askQuery, setAskQuery] = useState('')
  const [askMessages, setAskMessages] = useState<AskMessage[]>([])
  const [unit, setUnit] = useState<UnitId>('metric')
  const rootRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLElement>(null)
  const askBtnRef = useRef<HTMLButtonElement>(null)
  const askInputRef = useRef<HTMLInputElement>(null)
  const askTitleId = useId()
  const solutionsCurrent = SOLUTION_LINKS.some((item) =>
    'current' in item ? item.current(pathname) : pathname === item.to,
  )

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
  }, [pathname])

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
    if (!askOpen) return
    askInputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [askOpen])

  useEffect(() => {
    if (!open && !accountOpen && !primaryOpen && !askOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      setAccountOpen(false)
      setPrimaryOpen(null)
      setAskOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) setOpen(false)
      if (!accountRef.current?.contains(target)) setAccountOpen(false)
      if (!primaryRef.current?.contains(target)) setPrimaryOpen(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, accountOpen, primaryOpen, askOpen])

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

  const openAsk = (seed = '') => {
    const next = seed.trim()
    if (!next && askOpen) {
      setAskOpen(false)
      return
    }
    setAskOpen(true)
    if (next) {
      askWith(next)
      setQuery('')
    }
  }

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('q') ?? query).trim()
    if (!goToQuery(next)) return
    setQuery('')
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
                <div className={['site-nav-ask', askOpen ? 'is-open' : ''].filter(Boolean).join(' ')}>
                  <button
                    ref={askBtnRef}
                    type="button"
                    className="site-nav-ask-btn"
                    aria-expanded={askOpen}
                    aria-haspopup="dialog"
                    aria-controls="site-nav-ask-panel"
                    onClick={() => openAsk(query)}
                  >
                    <Sparkle size={16} weight="fill" aria-hidden />
                    Ask Tagi
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
                            Ask Tagi
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
                            aria-label="Close Ask Tagi"
                            onClick={() => {
                              setAskOpen(false)
                              askBtnRef.current?.focus()
                            }}
                          >
                            <Minus size={18} weight="bold" aria-hidden />
                          </button>
                        </div>
                        <p className="site-nav-ask-legal">
                          By using Ask Tagi, you agree to the{' '}
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
                            aria-label="Ask Tagi"
                            autoComplete="off"
                          />
                          <button type="submit" aria-label="Send">
                            <ArrowRight size={16} weight="bold" aria-hidden />
                          </button>
                        </form>
                        <p className="site-nav-ask-note">
                          Ask Tagi can miss a match. Check the product page before you order.
                        </p>
                      </aside>
                    </div>,
                    document.body,
                  )}
                </div>
              </form>
            </div>

            <nav className="site-nav-primary" aria-label="Primary" ref={primaryRef}>
              <div
                className={['site-nav-primary-item', primaryOpen === 'products' ? 'is-open' : '']
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setPrimaryOpen('products')}
                onMouseLeave={() => setPrimaryOpen(null)}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'products'}
                  aria-haspopup="true"
                  aria-controls="site-nav-products-menu"
                  onClick={() => setPrimaryOpen('products')}
                >
                  Products
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel">
                  <div
                    id="site-nav-products-menu"
                    className="site-nav-primary-card"
                    role="menu"
                    aria-label="Products"
                  >
                    {PRODUCT_LINKS.map((item, index) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className="site-nav-primary-link"
                        style={{ '--i': String(index) } as CSSProperties}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={[
                  'site-nav-primary-item',
                  primaryOpen === 'solutions' ? 'is-open' : '',
                  solutionsCurrent ? 'is-current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setPrimaryOpen('solutions')}
                onMouseLeave={() => setPrimaryOpen(null)}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'solutions'}
                  aria-haspopup="true"
                  aria-controls="site-nav-solutions-menu"
                  onClick={() => setPrimaryOpen('solutions')}
                >
                  Solutions
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel">
                  <div
                    id="site-nav-solutions-menu"
                    className="site-nav-primary-card"
                    role="menu"
                    aria-label="Solutions"
                  >
                    {SOLUTION_LINKS.map((item, index) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        role="menuitem"
                        className="site-nav-primary-link"
                        style={{ '--i': String(index) } as CSSProperties}
                        aria-current={
                          ('current' in item ? item.current(pathname) : pathname === item.to)
                            ? 'page'
                            : undefined
                        }
                        onClick={() => setPrimaryOpen(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={['site-nav-primary-item', primaryOpen === 'resources' ? 'is-open' : '']
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setPrimaryOpen('resources')}
                onMouseLeave={() => setPrimaryOpen(null)}
              >
                <button
                  type="button"
                  className="site-nav-primary-trigger"
                  aria-expanded={primaryOpen === 'resources'}
                  aria-haspopup="true"
                  aria-controls="site-nav-resources-menu"
                  onClick={() => setPrimaryOpen('resources')}
                >
                  Resources
                  <CaretDown size={12} weight="bold" aria-hidden />
                </button>
                <div className="site-nav-primary-panel">
                  <div
                    id="site-nav-resources-menu"
                    className="site-nav-primary-card"
                    role="menu"
                    aria-label="Resources"
                  >
                    {RESOURCE_LINKS.map((item, index) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className="site-nav-primary-link"
                        style={{ '--i': String(index) } as CSSProperties}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
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
                  <span>Account</span>
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
    </>
  )
}
