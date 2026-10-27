import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Buildings,
  CaretRight,
  EnvelopeSimple,
  Handshake,
  Package,
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

const PORTAL_ID = '4079112'
const FORM_ID = 'e6c2ba17-d4d2-4840-b8ce-49fdae54cad6'
const FORM_TARGET = 'hs-form-contact'
const ORDERS_EMAIL = 'orders@ga-international.com'
const PHONE_TOLL_FREE = { label: '1 800 518 0364', href: 'tel:+18005180364' }
const PHONE_INTL = { label: '+1 450 973 9420', href: 'tel:+14509739420' }

type FaqItem = { question: string; answer: string }

type FaqCategory = {
  id: string
  title: string
  Icon: typeof Package
  items: FaqItem[]
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
          'Yes. We send free samples of labels and tapes to verified business addresses. Markers, ribbons, and hardware are not included. Shipping is free to the contiguous United States, Canada, and EU countries.',
      },
      {
        question: 'Why do you need a business address for samples?',
        answer:
          'Samples are for labs evaluating a protocol. A verified business address keeps kits going to working benches, not residences.',
      },
      {
        question: 'How do I request a kit?',
        answer:
          'Use Request a free sample. Tell us the temperature, container, and printer so we send the matching material, not a generic pack.',
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
          'The cryogenic range starts at −196°C. Other lines cover freezer, fridge, ambient, and autoclave. Tell us the protocol and we will point you to the matching material.',
      },
      {
        question: 'Why not buy cheaper generic cryo labels?',
        answer:
          'A generic SKU is built for a datasheet, not your solvent list or freeze thaw cycle. We specify the material for the protocol you run, then send samples so you can prove it on the bench.',
      },
      {
        question: 'Who specifies the material?',
        answer:
          'M.Sc. and Ph.D. support walks temperature, container, chemicals, and printer with you. You leave with a match, not a catalog dump.',
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
      },
      {
        question: 'Can you print from our file?',
        answer:
          'Yes. Serialized data, logos, and 1D and 2D barcodes can be printed so the lab does not run the printer. Request custom labels and attach the file.',
      },
      {
        question: 'Do I get a price before I commit?',
        answer:
          'Custom work is quoted with a quantity, date, and price from the same plant that runs stock SKUs.',
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
        answer:
          'Yes. Download templates from the LabTAG resources library, then confirm the die with a sample before a production run.',
      },
      {
        question: 'Where are the how to videos?',
        answer:
          'Application and printer videos sit in the LabTAG video library. Use them with a sample kit so the first print is on the material you will stock.',
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
          'Day and evening crews run fulfillment so standard stock can leave quickly. Custom work is quoted with a date before you commit.',
      },
      {
        question: 'Where do I send a purchase order?',
        answer: `Send purchase orders to ${ORDERS_EMAIL}. Include the SKU, quantity, and ship to address.`,
      },
      {
        question: 'Can I get a quote first?',
        answer:
          'Yes. Request a quote for stock or custom work. We reply with pricing before you send the purchase order.',
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
        answer:
          'If the labels are not a match we take them back and help you specify the next material. The goal is a protocol that holds, not a one time shipment.',
      },
    ],
  },
  {
    id: 'reseller',
    title: 'Becoming a reseller',
    Icon: Handshake,
    items: [
      {
        question: 'Can I distribute LabTAG in my region?',
        answer:
          'Yes. Apply on Become a reseller. The distributor success team covers pricing, training, and marketing material.',
      },
      {
        question: 'What support do distributors get?',
        answer:
          'Competitive pricing, in depth training, marketing material, and on time delivery from a dedicated team.',
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
        answer:
          'Call 1 800 518 0364 in North America, or +1 450 973 9420 internationally. You can also send a message with the form on this page.',
      },
    ],
  },
]

const HELPFUL_LINKS = [
  { label: 'Request a free sample', to: SAMPLE_PATH },
  { label: 'Request a quote', to: QUOTE_PATH },
  { label: 'Custom labels', to: CUSTOM_LABELS_PATH },
  { label: 'Become a reseller', to: RESELLER_PATH },
  { label: 'Label templates', href: LABTAG_TEMPLATES_URL },
  { label: 'Videos', href: LABTAG_VIDEOS_URL },
  { label: 'Shop', href: LABTAG_SHOP_URL },
  { label: 'FAQ', href: LABTAG_FAQ_URL },
]

const OFFICES = [
  {
    region: 'USA',
    name: 'LabTAG Inc.',
    address: '42 Gateway Drive, Suite 400, Plattsburgh, NY 12901',
  },
  {
    region: 'Canada',
    name: 'GA International Inc.',
    address: '4455 Rue Louis-B.-Mayer, Laval, QC H7P 6B5',
  },
  {
    region: 'Europe',
    name: 'GA International Inc.',
    address: 'Runweg 28, 5258 BN Berlicum, Netherlands',
  },
  {
    region: 'UK',
    name: 'TAG Scientific Ltd.',
    address: 'Preston Park House, South Road, Brighton BN1 6SB',
  },
]

const RESOURCE_CARDS = [
  {
    to: SAMPLE_PATH,
    title: 'Free samples',
    body: 'Confirm adhesion and print in your own freezer before you buy a case.',
    cta: 'Request samples',
    image: resolveImageSrc(
      '/media/samples/Sample-Kit4.png',
      'https://cdn.labtag.com/wp-content/uploads/Sample-Kit4.png',
    ),
  },
  {
    to: QUOTE_PATH,
    title: 'Request a quote',
    body: 'Get a quantity, date, and price for stock or custom work before you send a purchase order.',
    cta: 'Request a quote',
    image: resolveImageSrc(
      '/media/cryogenic-clinical-requisition-forms/clinical-custom-labels.jpg',
      'https://cdn.labtag.com/wp-content/uploads/clinical-custom-labels.jpg',
    ),
  },
  {
    to: CUSTOM_LABELS_PATH,
    title: 'Custom labels',
    body: 'Die cut to spec, printed from your file, and quoted before you commit.',
    cta: 'Request custom labels',
    image: resolveImageSrc(
      '/media/custom-laboratory-labels/Die-Cut-Labels.jpg',
      'https://cdn.labtag.com/wp-content/uploads/2019/12/Die-Cut-Labels.jpg',
    ),
  },
  {
    to: RESELLER_PATH,
    title: 'Become a reseller',
    body: 'Join the distributor network. Pricing, training, and on time delivery from a dedicated team.',
    cta: 'Become a reseller',
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
  const [openId, setOpenId] = useState<string | null>(FAQ_CATEGORIES[0]?.id ?? null)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'Contact Us | How can we help you?'
    return () => {
      document.title = previous
    }
  }, [])

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
          How can we help you?
        </h1>
        <p data-motion="hero" style={motionIndex(1)}>
          Browse FAQs or send a message below.
        </p>
      </header>

      <div className="support-body">
        <section
          id="contact-request"
          className="support-write quote-page"
          aria-labelledby="support-write-heading"
          data-motion-section
        >
          <h2 id="support-write-heading">Send a message</h2>
          <p>Tell us the protocol, container, and what you need. An expert will follow up.</p>
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
          <h2 id="support-faq-heading">FAQs</h2>
          <ul className="support-cat-list">
            {FAQ_CATEGORIES.map((category) => (
              <li key={category.id}>
                <details
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
            <p className="support-call">
              Call support:{' '}
              <a href={PHONE_TOLL_FREE.href}>{PHONE_TOLL_FREE.label}</a>
            </p>
            <p className="support-call-sub">
              International: <a href={PHONE_INTL.href}>{PHONE_INTL.label}</a>
            </p>
            <a className="support-action" href="#contact-request">
              <EnvelopeSimple size={18} weight="duotone" aria-hidden="true" />
              Email us
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
                </li>
              ))}
            </ul>
          </div>

          <nav className="support-links" aria-label="Helpful links">
            <h2>Helpful links</h2>
            <ul>
              {HELPFUL_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to}>{link.label}</Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <section className="support-resources" aria-labelledby="support-resources-heading" data-motion-section>
        <h2 id="support-resources-heading">Other resources</h2>
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
