import { Link, NavLink } from 'react-router-dom'
import {
  ABOUT_PATH,
  CUSTOM_LABELS_PATH,
  LABTAG_BLOG_URL,
  LABTAG_CONTACT_URL,
  LABTAG_COOKIE_URL,
  LABTAG_FAQ_URL,
  LABTAG_FACEBOOK_URL,
  LABTAG_GA_URL,
  LABTAG_LINKEDIN_URL,
  LABTAG_PRIVACY_URL,
  LABTAG_SHOP_URL,
  LABTAG_TEMPLATES_URL,
  LABTAG_TERMS_SALE_URL,
  LABTAG_TERMS_URL,
  LABTAG_VIDEOS_URL,
  LABTAG_X_URL,
  LABTAG_YOUTUBE_URL,
  QUOTE_PATH,
  SAMPLE_PATH,
  WHY_CHOOSE_PATH,
} from '@/content/labtagLinks'

type FooterLink = {
  label: string
  to?: string
  href?: string
}

type FooterColumn = {
  heading?: string
  links: FooterLink[]
}

type FooterGroup = {
  title: string
  columns: FooterColumn[]
}

const LABEL_SOLUTIONS: FooterGroup = {
  title: 'Label solutions',
  columns: [
    {
      heading: 'By product',
      links: [
        { label: 'Cryogenic', to: '/solutions/cryogenic' },
        { label: 'Deep freeze', to: '/solutions/deep-freeze-labels' },
        { label: 'CryoSTUCK', to: '/solutions/cryostuck-labels' },
        { label: 'Laboratory', to: '/solutions/laboratory' },
        { label: 'PCR', to: '/solutions/pcr' },
        { label: 'Autoclave', to: '/solutions/autoclave' },
        { label: 'Vaccines', to: '/solutions/vaccines' },
        { label: 'Custom', to: '/solutions/custom-labels' },
      ],
    },
    {
      heading: 'By feature',
      links: [
        { label: 'SnapPEEL', to: '/solutions/snappeel' },
        { label: 'RFID', to: '/solutions/rfid' },
        { label: 'Hard to stick', to: '/solutions/hard-to-stick' },
        { label: 'Lab tapes', to: '/solutions/laboratory-tapes' },
        { label: 'ResiTAG', to: '/solutions/resin-labels' },
        { label: 'DYMO', to: '/solutions/dymo-labels' },
      ],
    },
    {
      heading: 'By surface',
      links: [
        { label: 'Frozen vials', to: '/solutions/cryostuck-labels' },
        { label: 'Tubes and vials', to: '/solutions/cryogenic' },
        { label: 'PCR tubes', to: '/solutions/pcr' },
        { label: 'Slides and blocks', to: '/solutions/histology' },
        { label: 'Resin embedding', to: '/solutions/resin-labels' },
        { label: 'Chemical containers', to: '/solutions/chemical-containers' },
      ],
    },
  ],
}

const PRINT_AND_APPLY: FooterGroup = {
  title: 'Print and apply',
  columns: [
    {
      heading: 'Printers',
      links: [
        { label: 'Label printing', to: '/solutions/label-printing' },
        { label: 'DYMO labels', to: '/solutions/dymo-labels' },
      ],
    },
    {
      heading: 'Automation',
      links: [
        { label: 'Pre labeled labware', to: '/solutions/automated-labware' },
        { label: 'Label software', to: '/solutions/label-software' },
      ],
    },
  ],
}

const APPLICATIONS: FooterGroup = {
  title: 'Applications',
  columns: [
    {
      links: [
        { label: 'Biobanking', to: '/solutions/biobanking' },
        { label: 'IVF', to: '/solutions/ivf' },
        { label: 'Clinical trials', to: '/solutions/clinical-trials' },
        { label: 'Histology', to: '/solutions/histology' },
        { label: 'PCR', to: '/solutions/pcr' },
        { label: 'Vaccines', to: '/solutions/vaccines' },
        { label: 'Animal healthcare', to: '/solutions/animal-health' },
        { label: 'Industrial', to: '/solutions/industrial' },
        { label: 'Cannabis', to: '/solutions/cannabis' },
      ],
    },
  ],
}

const STACKED_GROUPS: FooterGroup[] = [
  {
    title: 'Services',
    columns: [
      {
        links: [
          { label: 'Custom labels', to: CUSTOM_LABELS_PATH },
          { label: 'Free samples', to: SAMPLE_PATH },
          { label: 'Request a quote', to: QUOTE_PATH },
          { label: 'Chat with an expert', href: LABTAG_CONTACT_URL },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    columns: [
      {
        links: [
          { label: 'Solutions', to: '/' },
          { label: 'Shop', href: LABTAG_SHOP_URL },
          { label: 'Videos', href: LABTAG_VIDEOS_URL },
          { label: 'Label templates', href: LABTAG_TEMPLATES_URL },
          { label: 'FAQ', href: LABTAG_FAQ_URL },
          { label: 'Blog', href: LABTAG_BLOG_URL },
        ],
      },
    ],
  },
  {
    title: 'Company',
    columns: [
      {
        links: [
          { label: 'About Us', to: ABOUT_PATH },
          { label: 'Why Choose LabTAG', to: WHY_CHOOSE_PATH },
          { label: 'Contact Us', href: LABTAG_CONTACT_URL },
          { label: 'GA International', href: LABTAG_GA_URL },
        ],
      },
    ],
  },
]

const LEGAL: FooterLink[] = [
  { label: 'Terms of sale', href: LABTAG_TERMS_SALE_URL },
  { label: 'Terms of use', href: LABTAG_TERMS_URL },
  { label: 'Privacy policy', href: LABTAG_PRIVACY_URL },
  { label: 'Cookie policy', href: LABTAG_COOKIE_URL },
]

const SOCIAL = [
  { label: 'Facebook', href: LABTAG_FACEBOOK_URL, icon: 'facebook' },
  { label: 'X', href: LABTAG_X_URL, icon: 'x' },
  { label: 'YouTube', href: LABTAG_YOUTUBE_URL, icon: 'youtube' },
  { label: 'LinkedIn', href: LABTAG_LINKEDIN_URL, icon: 'linkedin' },
] as const

function FooterItem({ label, to, href }: FooterLink) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    )
  }
  return <NavLink to={to ?? '/'}>{label}</NavLink>
}

function FooterGroupBlock({ group, className = '' }: { group: FooterGroup; className?: string }) {
  return (
    <nav className={`site-footer-group ${className}`.trim()} aria-label={group.title}>
      <p className="site-footer-group-title">{group.title}</p>
      <div className="site-footer-columns">
        {group.columns.map((column) => (
          <div key={column.heading ?? group.title} className="site-footer-col">
            {column.heading ? <h2>{column.heading}</h2> : null}
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <FooterItem {...link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}

function SocialIcon({ name }: { name: (typeof SOCIAL)[number]['icon'] }) {
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-1c0-.6.4-1 1-1Z"
        />
      </svg>
    )
  }
  if (name === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.6 4H20l-6.2 7.1L20.7 20h-5.2l-4-5.3L6.4 20H4l6.6-7.6L3.5 4h5.3l3.6 4.9L17.6 4Zm-1 14.4h1.4L7.5 5.5H6L16.6 18.4Z"
        />
      </svg>
    )
  }
  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M22 12.2s0-3.2-.4-4.6c-.2-.8-.8-1.4-1.6-1.6C18.6 5.6 12 5.6 12 5.6s-6.6 0-8 .4c-.8.2-1.4.8-1.6 1.6C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.8 1.4 1.6 1.6 1.4.4 8 .4 8 .4s6.6 0 8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.6.4-4.6ZM10 15.5V8.9l5.5 3.3L10 15.5Z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 9H4v11h2.5V9ZM5.2 4C4.3 4 3.6 4.7 3.6 5.6S4.3 7.2 5.2 7.2s1.6-.7 1.6-1.6S6.2 4 5.2 4ZM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1.1V20H11V9h2.5v1.5c.4-.7 1.5-1.8 3.5-1.8 2.5 0 4.4 1.6 4.4 5.2V20H20Z"
      />
    </svg>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="logo" to="/">
          LabTAG <span>Solutions</span>
        </Link>

        <div className="site-footer-mega">
          <FooterGroupBlock group={LABEL_SOLUTIONS} className="is-solutions" />
          <FooterGroupBlock group={PRINT_AND_APPLY} className="is-print" />
          <FooterGroupBlock group={APPLICATIONS} />
          <div className="site-footer-stack">
            {STACKED_GROUPS.map((group) => (
              <FooterGroupBlock key={group.title} group={group} />
            ))}
          </div>
          <nav className="site-footer-social" aria-label="Social">
            {SOCIAL.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                <span className="sr-only">{item.label}</span>
                <SocialIcon name={item.icon} />
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer-legal">
          <p>
            © {year}{' '}
            <a href={LABTAG_GA_URL} target="_blank" rel="noreferrer">
              GA International
            </a>
          </p>
          <ul>
            {LEGAL.map((link) => (
              <li key={link.label}>
                <FooterItem {...link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
