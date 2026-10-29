import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  CaretDown,
  ClipboardText,
  Package,
  Phone,
  Scissors,
} from '@phosphor-icons/react'
import {
  ABOUT_PATH,
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  QUOTE_PATH,
  SAMPLE_PATH,
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

const PRIMARY_LINKS = [
  { label: 'Products' },
  { label: 'Solutions' },
  { label: 'Resources' },
  { label: 'About us', to: ABOUT_PATH },
] as const

export function SiteNav() {
  const { pathname } = useLocation()
  const sectionActive = CONTACT_PATHS.has(pathname)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <nav className="site-nav" aria-label="Site">
      <Link className="logo" to="/">
        LabTAG
      </Link>
      <div className="site-nav-primary">
        {PRIMARY_LINKS.map((item) =>
          'to' in item ? (
            <NavLink key={item.label} to={item.to}>
              {item.label}
            </NavLink>
          ) : (
            <a
              key={item.label}
              href="#"
              onClick={(event) => {
                event.preventDefault()
              }}
            >
              {item.label}
            </a>
          ),
        )}
      </div>
      <div
        ref={rootRef}
        className={['site-nav-contact', open ? 'is-open' : ''].filter(Boolean).join(' ')}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div
          className={
            [
              'site-nav-contact-trigger',
              sectionActive ? 'is-current' : '',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <NavLink to={CONTACT_PATH} end className="site-nav-contact-label">
            Contact Us
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
    </nav>
  )
}
