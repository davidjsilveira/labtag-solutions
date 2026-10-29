import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardText,
  EnvelopeSimple,
  MapPin,
  Package,
  Phone,
  Scissors,
} from '@phosphor-icons/react'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import {
  CUSTOM_LABELS_PATH,
  LABTAG_CONTACT_URL,
  LABTAG_FAQ_URL,
  LABTAG_SHOP_URL,
  LABTAG_TEMPLATES_URL,
  LABTAG_VIDEOS_URL,
  QUOTE_PATH,
  RESELLER_PATH,
  SAMPLE_PATH,
} from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const PORTAL_ID = '4079112'
const FORM_ID = 'e6c2ba17-d4d2-4840-b8ce-49fdae54cad6'
const FORM_TARGET = 'hs-form-contact'
const ORDERS_EMAIL = 'orders@ga-international.com'
const PHONE_TOLL_FREE = { label: '1 800 518 0364', href: 'tel:+18005180364' }
const PHONE_INTL = { label: '+1 450 973 9420', href: 'tel:+14509739420' }

const FORM_LINKS = [
  { title: 'Send a message', to: '#contact-request', Icon: EnvelopeSimple, current: true },
  { title: 'Custom labels', to: CUSTOM_LABELS_PATH, Icon: Scissors },
  { title: 'Request a free sample', to: SAMPLE_PATH, Icon: Package },
  { title: 'Request a quote', to: QUOTE_PATH, Icon: ClipboardText },
]

const HELPFUL_LINKS = [
  { label: 'Label templates', href: LABTAG_TEMPLATES_URL },
  { label: 'Application videos', href: LABTAG_VIDEOS_URL },
  { label: 'Shop', href: LABTAG_SHOP_URL },
  { label: 'LabTAG FAQ', href: LABTAG_FAQ_URL },
]

const OFFICES = [
  {
    region: 'USA',
    name: 'LabTAG Inc.',
    address: '42 Gateway Drive, Suite 400, Plattsburgh, NY 12901',
    phone: PHONE_TOLL_FREE,
  },
  {
    region: 'Canada',
    name: 'GA International Inc.',
    address: '4455 Rue Louis-B.-Mayer, Laval, QC H7P 6B5',
    phone: PHONE_TOLL_FREE,
  },
  {
    region: 'Europe',
    name: 'GA International Inc.',
    address: 'Runweg 28, 5258 BN Berlicum, Netherlands',
    phone: { label: '+31 73 737 0185', href: 'tel:+31737370185' },
  },
  {
    region: 'UK',
    name: 'TAG Scientific Ltd.',
    address: 'Preston Park House, South Road, Brighton BN1 6SB',
    phone: { label: '+44 20 3769 5683', href: 'tel:+442037695683' },
  },
]

const RESOURCE_CARDS = [
  {
    to: SAMPLE_PATH,
    title: 'Free samples',
    body: 'Test adhesion and print in your own freezer before you buy a case.',
    cta: 'Request a sample kit',
    image: resolveImageSrc(
      '/media/samples/Sample-Kit4.png',
      'https://cdn.labtag.com/wp-content/uploads/Sample-Kit4.png',
    ),
  },
  {
    to: QUOTE_PATH,
    title: 'Request a quote',
    body: 'Get a quantity, date, and price for stock or custom work before you send a purchase order.',
    cta: 'Get a quote',
    image: resolveImageSrc(
      '/media/cryogenic-clinical-requisition-forms/clinical-custom-labels.jpg',
      'https://cdn.labtag.com/wp-content/uploads/clinical-custom-labels.jpg',
    ),
  },
  {
    to: CUSTOM_LABELS_PATH,
    title: 'Custom labels',
    body: 'Die cut to spec, printed from your file, and quoted before you commit.',
    cta: 'Start a custom request',
    image: resolveImageSrc(
      '/media/custom-laboratory-labels/Die-Cut-Labels.jpg',
      'https://cdn.labtag.com/wp-content/uploads/2019/12/Die-Cut-Labels.jpg',
    ),
  },
  {
    to: RESELLER_PATH,
    title: 'Become a reseller',
    body: 'Join the distributor network for pricing, training, and marketing support.',
    cta: 'Apply to resell',
    image: resolveImageSrc(
      '/media/reseller/BecomeResellerImg.svg',
      'https://cdn.labtag.com/wp-content/uploads/BecomeResellerImg.svg',
    ),
    illustration: true,
  },
]

export function ContactPage() {
  const rootRef = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'Contact Us | Talk with a labeling specialist'
    return () => {
      document.title = previous
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    const targetSelector = `#${FORM_TARGET}`
    let cancelled = false

    loadHubSpotFormsScript()
      .then(() => {
        if (cancelled || !mounted.current || !window.hbspt?.forms?.create) return
        const target = document.querySelector(targetSelector)
        if (target) target.innerHTML = ''
        createHubSpotForm({
          portalId: PORTAL_ID,
          formId: FORM_ID,
          target: targetSelector,
        })
      })
      .catch(() => {
        /* Fallback link remains in the form card. */
      })

    return () => {
      cancelled = true
      mounted.current = false
    }
  }, [])

  return (
    <article className="support-page" ref={rootRef}>
      <header className="support-hero" data-motion-hero>
        <div className="support-hero-copy">
          <h1 data-motion="hero" style={motionIndex(0)}>
            Talk with a
            <br />
            labeling specialist
          </h1>
          <p data-motion="hero" style={motionIndex(1)}>
            Scientists on our team help you match a material, request a sample kit, or check an order.
          </p>
          <p className="support-hero-proof" data-motion="hero" style={motionIndex(2)}>
            Sample kits process within 24 hours.
          </p>
        </div>
        <nav className="support-topics" aria-label="Contact forms" data-motion="hero" style={motionIndex(3)}>
          {FORM_LINKS.map((item) =>
            item.to.startsWith('#') ? (
              <a
                key={item.title}
                href={item.to}
                className={item.current ? 'is-current' : undefined}
              >
                <item.Icon size={18} weight="duotone" aria-hidden="true" />
                {item.title}
              </a>
            ) : (
              <Link key={item.title} to={item.to}>
                <item.Icon size={18} weight="duotone" aria-hidden="true" />
                {item.title}
              </Link>
            ),
          )}
        </nav>
      </header>

      <div className="support-body">
        <section
          id="contact-request"
          className="support-write quote-page"
          aria-labelledby="support-write-heading"
          data-motion-section
        >
          <h2 id="support-write-heading">Send a message</h2>
          <p>
            Share the temperature, container, chemicals, and printer. A specialist will reply with a
            match or a next step.
          </p>
          <aside className="samples-form" aria-label="Contact form">
            <div id={FORM_TARGET} className="request-form-embed" />
            <p className="request-form-fallback">
              Form not loading?{' '}
              <a href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">
                Open the contact form on LabTAG.com
              </a>
              .
            </p>
          </aside>
        </section>

        <aside className="support-aside" data-motion-section>
          <div className="support-card">
            <p className="support-call">Talk with a specialist</p>
            <a className="support-action" href={PHONE_TOLL_FREE.href}>
              <Phone size={18} weight="duotone" aria-hidden="true" />
              {PHONE_TOLL_FREE.label}
            </a>
            <p className="support-call-sub">
              Outside North America{' '}
              <a href={PHONE_INTL.href}>{PHONE_INTL.label}</a>
            </p>
            <p className="support-po">
              Purchase orders:{' '}
              <a href={`mailto:${ORDERS_EMAIL}`}>{ORDERS_EMAIL}</a>
            </p>
          </div>

          <div className="support-links support-offices-wrap" role="region" aria-label="Offices">
            <ul className="support-offices">
              {OFFICES.map((office) => (
                <li key={office.region}>
                  <strong>
                    <MapPin size={16} weight="duotone" aria-hidden="true" />
                    {office.region}
                  </strong>
                  <span>{office.name}</span>
                  <span>{office.address}</span>
                  <a href={office.phone.href}>
                    <Phone size={16} weight="duotone" aria-hidden="true" />
                    {office.phone.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="support-links" aria-label="Quick links">
            <ul>
              {HELPFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <section className="support-resources" aria-labelledby="support-resources-heading" data-motion-section>
        <h2 id="support-resources-heading">More ways to get started</h2>
        <ul>
          {RESOURCE_CARDS.map((card, index) => (
            <li key={card.to} data-motion="card" style={motionIndex(index)}>
              <Link
                to={card.to}
                className={card.illustration ? 'support-resource is-illustration' : 'support-resource'}
              >
                <img src={card.image.primary} alt="" />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <span>
                    {card.cta} <ArrowRight size={14} weight="bold" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
