import { useEffect, useRef } from 'react'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { LABTAG_QUOTE_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

const PORTAL_ID = '4079112'
const FORM_ID = '9ec7d4fc-e354-4605-90c5-596e23f5a2f5'
const FORM_TARGET = 'hs-form-quote'

const PROMISES = [
  {
    title: 'Custom & stock',
    body: 'Price quotes for custom and in-stock labels, tapes, and related products.',
    icon: '/media/about/why/tailor-made-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/tailor-made-icon.svg',
  },
  {
    title: 'Fast reply',
    body: 'Fill the form and we will get back to you shortly with pricing.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
  {
    title: 'Expert support',
    body: 'Get support from our world-class lab labeling experts.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
]

const PHOTO = resolveImageSrc(
  '/media/cryogenic-clinical-requisition-forms/clinical-custom-labels.jpg',
  'https://cdn.labtag.com/wp-content/uploads/clinical-custom-labels.jpg',
)

export function QuotePage() {
  const mounted = useRef(true)

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
    <article className="samples-page quote-page">
      <div className="samples-layout">
        <div className="quote-stack">
          <header className="samples-hero">
            <h1>Request a Quote</h1>
            <p className="samples-lede">
              Fill this form and we will get back to you shortly with a price quote for custom and
              in-stock products.
            </p>
            <ul className="samples-promises">
              {PROMISES.map((promise) => {
                const icon = resolveImageSrc(promise.icon, promise.iconFallback)
                return (
                  <li key={promise.title}>
                    <span className="samples-promise-icon">
                      <img src={icon.primary} alt="" width={72} height={72} />
                    </span>
                    <strong>{promise.title}</strong>
                    <p>{promise.body}</p>
                  </li>
                )
              })}
            </ul>
          </header>

          <section className="samples-proof">
            <figure className="samples-kit is-photo">
              <img src={PHOTO.primary} alt="Custom LabTAG label on a laboratory vial" />
            </figure>
          </section>
        </div>

        <aside id="quote-request" className="samples-form" aria-label="Quote request form">
          <div id={FORM_TARGET} className="request-form-embed" />
          <p className="request-form-fallback">
            Form not loading?{' '}
            <a href={LABTAG_QUOTE_URL} target="_blank" rel="noreferrer">
              Open the quote request on LabTAG.com
            </a>
            .
          </p>
        </aside>
      </div>
    </article>
  )
}
