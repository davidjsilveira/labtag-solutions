import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  CaretDown,
  ClipboardText,
  EnvelopeSimple,
  Package,
  Scissors,
} from '@phosphor-icons/react'
import {
  ABOUT_PATH,
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  QUOTE_PATH,
  SAMPLE_PATH,
} from '@/content/labtagLinks'

const CONTACT_GROUPS = [
  {
    id: 'talk',
    label: 'Talk with us',
    items: [{ to: CONTACT_PATH, title: 'Send a message', Icon: EnvelopeSimple }],
  },
  {
    id: 'request',
    label: 'Request',
    items: [
      { to: CUSTOM_LABELS_PATH, title: 'Custom labels', Icon: Scissors },
      { to: SAMPLE_PATH, title: 'Request a free sample', Icon: Package },
      { to: QUOTE_PATH, title: 'Request a quote', Icon: ClipboardText },
    ],
  },
]

const CONTACT_ITEMS = CONTACT_GROUPS.flatMap((group) => group.items)
const CONTACT_PATHS = new Set(CONTACT_ITEMS.map((item) => item.to))

const PRIMARY_LINKS = [
  { label: 'Products' },
  { label: 'Solutions' },
  { label: 'Resources' },
  { label: 'About', to: ABOUT_PATH },
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
            {CONTACT_GROUPS.map((group) => (
              <div
                key={group.id}
                className={`site-nav-contact-group site-nav-contact-group--${group.id}`}
                role="group"
                aria-label={group.label}
              >
                <p className="site-nav-contact-heading">{group.label}</p>
                {group.items.map((item) => {
                  const index = CONTACT_ITEMS.indexOf(item)
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      role="menuitem"
                      className="site-nav-contact-item"
                      style={{ '--i': String(index) } as CSSProperties}
                    >
                      <span className="site-nav-contact-icon" aria-hidden>
                        <item.Icon size={20} weight="duotone" />
                      </span>
                      <span className="site-nav-contact-copy">{item.title}</span>
                    </NavLink>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
