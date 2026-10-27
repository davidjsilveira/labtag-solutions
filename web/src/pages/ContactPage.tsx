import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Buildings,
  CaretRight,
  EnvelopeSimple,
  Handshake,
  Package,
  Phone,
  Printer,
  Scissors,
  SealCheck,
  Snowflake,
  Truck,
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
import { scrollToAnchor } from '@/scrollToAnchor'

const PORTAL_ID = '4079112'
const FORM_ID = 'e6c2ba17-d4d2-4840-b8ce-49fdae54cad6'
const FORM_TARGET = 'hs-form-contact'
const ORDERS_EMAIL = 'orders@ga-international.com'
const PHONE_TOLL_FREE = { label: '1 800 518 0364', href: 'tel:+18005180364' }
const PHONE_INTL = { label: '+1 450 973 9420', href: 'tel:+14509739420' }

type FaqCta = { label: string; to?: string; href?: string }

type FaqItem = { question: string; answer: string; cta?: FaqCta }

type FaqCategory = {
  id: string
  title: string
  Icon: typeof Package
  items: FaqItem[]
}

function FaqCtaLink({ cta }: { cta: FaqCta }) {
  if (cta.to) return <Link to={cta.to}>{cta.label}</Link>
  return (
    <a href={cta.href} {...(cta.href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {cta.label}
    </a>
  )
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'samples',
    title: 'Samples',
    Icon: Package,
    items: [
      {
        question: 'Can I get free samples?',
        answer:
          'Yes. We send free samples of labels and tapes to verified business addresses. Markers, ribbons, and hardware are not included. Shipping is free to the contiguous United States, Canada, and EU countries. Kits are processed within 24 hours.',
        cta: { label: 'Request a free sample', to: SAMPLE_PATH },
      },
      {
        question: 'Why do you need a business address?',
        answer:
          'Sample kits are for labs testing a protocol. A verified business address keeps them going to working benches, not residences.',
      },
      {
        question: 'How do I request a kit?',
        answer:
          'Include temperature, container, chemicals, and printer so we send the matching material, not a generic pack.',
        cta: { label: 'Request a free sample', to: SAMPLE_PATH },
      },
    ],
  },
  {
    id: 'cryogenic',
    title: 'Cryogenic and freezer',
    Icon: Snowflake,
    items: [
      {
        question: 'What temperatures can the labels survive?',
        answer:
          'Cryogenic constructions hold from −196°C. Other lines cover freezer, fridge, ambient, and autoclave. Tell us the protocol and we will point you to the matching material.',
      },
      {
        question: 'How do I choose a cryogenic label?',
        answer:
          'Share the lowest temperature, the container, the chemicals, and the printer. A specialist specifies the adhesive and topcoat for that protocol, then you can confirm it with a sample.',
      },
      {
        question: 'Can someone help me choose a material?',
        answer:
          'Yes. M.Sc. and Ph.D. support walks temperature, container, chemicals, and printer with you.',
        cta: { label: 'Send a message', href: '#contact-request' },
      },
    ],
  },
  {
    id: 'custom',
    title: 'Custom labels',
    Icon: Scissors,
    items: [
      {
        question: 'Do you make custom sizes and colors?',
        answer:
          'Yes. Stock SKUs cover common vials and plates. Custom shapes, colors, and preprinted data are quoted from the same manufacturing line.',
        cta: { label: 'Request custom labels', to: CUSTOM_LABELS_PATH },
      },
      {
        question: 'Can you print from our file?',
        answer:
          'Yes. Serialized data, logos, and 1D and 2D barcodes can be printed so the lab does not run the printer. Attach the file with your request.',
        cta: { label: 'Request custom labels', to: CUSTOM_LABELS_PATH },
      },
      {
        question: 'How does custom quoting work?',
        answer:
          'You send the size, quantity, and file. We reply with a quantity, ship date, and price from the same plant that runs stock SKUs.',
        cta: { label: 'Request custom labels', to: CUSTOM_LABELS_PATH },
      },
    ],
  },
  {
    id: 'printing',
    title: 'Printing and templates',
    Icon: Printer,
    items: [
      {
        question: 'Which printers do you support?',
        answer:
          'Thermal transfer, direct thermal, laser, and inkjet lines cover common lab printers, including DYMO. Match the ribbon and adhesive to the temperature, not only the printer name.',
      },
      {
        question: 'Do you offer label templates?',
        answer: 'Yes. Download a template, then confirm the die with a sample before a production run.',
        cta: { label: 'Open label templates', href: LABTAG_TEMPLATES_URL },
      },
      {
        question: 'Where are the application videos?',
        answer:
          'Watch application and printer videos with a sample kit so the first print is on the material you will stock.',
        cta: { label: 'Open application videos', href: LABTAG_VIDEOS_URL },
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Orders and shipping',
    Icon: Truck,
    items: [
      {
        question: 'How fast do orders ship?',
        answer:
          'Day and evening crews run fulfillment from warehouses in North America and Europe so standard stock can leave quickly. Custom work is quoted with a ship date before you commit.',
      },
      {
        question: 'Where do I send a purchase order?',
        answer: `Send purchase orders to ${ORDERS_EMAIL}. Include the SKU, quantity, and ship to address.`,
      },
      {
        question: 'Can I get a quote first?',
        answer: 'Yes. We reply with pricing for stock or custom work before you send the purchase order.',
        cta: { label: 'Request a quote', to: QUOTE_PATH },
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality and materials',
    Icon: SealCheck,
    items: [
      {
        question: 'Do you manufacture the labels or resell them?',
        answer:
          'GA International manufactures LabTAG labels. R&D, converting, and quality control sit in our own facilities.',
      },
      {
        question: 'Which ISO systems do you run?',
        answer:
          'ISO 9001:2015 for quality management and ISO 22301:2012 for business continuity, so supply is planned through disruption.',
      },
      {
        question: 'What does the satisfaction guarantee cover?',
        answer: 'If the labels are not a match we take them back and help you specify the next material.',
        cta: { label: 'Request a free sample', to: SAMPLE_PATH },
      },
    ],
  },
  {
    id: 'reseller',
    title: 'Resellers',
    Icon: Handshake,
    items: [
      {
        question: 'Can I distribute LabTAG in my region?',
        answer: 'Yes. A dedicated team covers pricing, training, and marketing material.',
        cta: { label: 'Become a reseller', to: RESELLER_PATH },
      },
      {
        question: 'What support do distributors get?',
        answer:
          'Pricing, product training, marketing material, and delivery from a dedicated distributor team.',
      },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    Icon: Buildings,
    items: [
      {
        question: 'Where are you located?',
        answer:
          'Offices in Plattsburgh, Laval, Berlicum, and Brighton, with warehouses placed to reach North American and European labs.',
      },
      {
        question: 'How do I reach a person?',
        answer: 'Call 1 800 518 0364 in North America, or +1 450 973 9420 internationally.',
        cta: { label: 'Send a message', href: '#contact-request' },
      },
    ],
  },
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

function topicIdFromHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id.startsWith('faq-')) return null
  const topic = id.slice(4)
  return FAQ_CATEGORIES.some((category) => category.id === topic) ? topic : null
}

export function ContactPage() {
  const rootRef = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  const { hash } = useLocation()
  const [openId, setOpenId] = useState<string | null>(
    () => topicIdFromHash(window.location.hash) ?? FAQ_CATEGORIES[0]?.id ?? null,
  )
  usePageMotion(rootRef)

  const openTopic = (topic: string, behavior: ScrollBehavior = 'smooth') => {
    flushSync(() => {
      setOpenId(topic)
    })
    scrollToAnchor(`faq-${topic}`, behavior)
  }

  useEffect(() => {
    const previous = document.title
    document.title = 'Contact Us | Talk with a labeling specialist'
    return () => {
      document.title = previous
    }
  }, [])

  useLayoutEffect(() => {
    const topic = topicIdFromHash(hash)
    if (!topic) return
    openTopic(topic, 'auto')
  }, [hash])

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_CATEGORIES.flatMap((category) =>
        category.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      ),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.contactFaq = 'true'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      script.remove()
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
        <h1 data-motion="hero" style={motionIndex(0)}>
          Talk with a labeling specialist
        </h1>
        <p data-motion="hero" style={motionIndex(1)}>
          Scientists on our team help you match a material, request a sample kit, or check an order.
        </p>
        <p className="support-hero-proof" data-motion="hero" style={motionIndex(2)}>
          Sample kits process within 24 hours.
        </p>
        <nav className="support-topics" aria-label="Popular topics" data-motion="hero" style={motionIndex(3)}>
          {FAQ_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#faq-${category.id}`}
              className={openId === category.id ? 'is-current' : undefined}
              onClick={(event) => {
                event.preventDefault()
                openTopic(category.id)
                window.history.replaceState(null, '', `#faq-${category.id}`)
              }}
            >
              <category.Icon size={18} weight="duotone" aria-hidden="true" />
              {category.title}
            </a>
          ))}
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

        <section className="support-faqs" aria-labelledby="support-faq-heading" data-motion-section>
          <h2 id="support-faq-heading">Common questions</h2>
          <ul className="support-cat-list">
            {FAQ_CATEGORIES.map((category) => (
              <li key={category.id}>
                <details
                  id={`faq-${category.id}`}
                  className="support-cat"
                  open={openId === category.id}
                  onToggle={(event) => {
                    if (event.currentTarget.open) {
                      setOpenId(category.id)
                      return
                    }
                    setOpenId((current) => (current === category.id ? null : current))
                  }}
                >
                  <summary>
                    <category.Icon size={22} weight="duotone" aria-hidden="true" />
                    <span>
                      {category.title} <em>({category.items.length})</em>
                    </span>
                    <CaretRight className="support-cat-caret" size={16} weight="bold" />
                  </summary>
                  <div className="faq-list">
                    {category.items.map((item) => (
                      <details key={item.question} className="faq-item">
                        <summary>
                          <span className="faq-item-question">{item.question}</span>
                        </summary>
                        <div className="faq-item-answer">
                          <p>{item.answer}</p>
                          {item.cta ? (
                            <p className="faq-item-cta">
                              <FaqCtaLink cta={item.cta} />
                            </p>
                          ) : null}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
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
            <a className="support-action" href="#contact-request">
              <EnvelopeSimple size={18} weight="duotone" aria-hidden="true" />
              Send a message
            </a>
            <p className="support-po">
              Purchase orders:{' '}
              <a href={`mailto:${ORDERS_EMAIL}`}>{ORDERS_EMAIL}</a>
            </p>
          </div>

          <div className="support-links">
            <h2>Offices</h2>
            <ul className="support-offices">
              {OFFICES.map((office) => (
                <li key={office.region}>
                  <strong>{office.region}</strong>
                  <span>{office.name}</span>
                  <span>{office.address}</span>
                  <a href={office.phone.href}>{office.phone.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="support-links" aria-label="Quick links">
            <h2>Quick links</h2>
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
