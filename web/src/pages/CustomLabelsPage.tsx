import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { LABTAG_QUOTE_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const PORTAL_ID = '4079112'
const FORM_ID = '9ec7d4fc-e354-4605-90c5-596e23f5a2f5'
const FORM_TARGET = 'hs-form-custom-labels'

const PROMISES = [
  {
    title: 'Die cut to spec',
    body: 'Shape, size, and material from stock, or a new cut when the vial is not in the set.',
    icon: '/media/about/why/tailor-made-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/tailor-made-icon.svg',
  },
  {
    title: 'Printed from your file',
    body: 'Serialized data, logos, and 1D and 2D barcodes printed so the lab does not run the printer.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
  {
    title: 'Quoted before you commit',
    body: 'You get a quantity, date, and price from the same plant that runs stock SKUs.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
]

const PHOTO = resolveImageSrc(
  '/media/custom-laboratory-labels/Die-Cut-Labels.jpg',
  'https://cdn.labtag.com/wp-content/uploads/2019/12/Die-Cut-Labels.jpg',
)

export function CustomLabelsPage() {
  const rootRef = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  usePageMotion(rootRef)

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
    <article className="samples-page quote-page custom-request-page" ref={rootRef}>
      <div className="samples-layout">
        <header className="samples-hero" data-motion-hero>
          <h1 data-motion="hero" style={motionIndex(0)}>
            Request Custom Labels
          </h1>
          <p className="samples-lede" data-motion="hero" style={motionIndex(1)}>
            Tell us the container, data file, and protocol. Scientists specify the construct so the
            identification holds, then you get a quantity, date, and price.
          </p>
          <ul className="samples-promises">
            {PROMISES.map((promise, index) => {
              const icon = resolveImageSrc(promise.icon, promise.iconFallback)
              return (
                <li key={promise.title} style={motionIndex(index + 2)}>
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

        <aside id="custom-label-request" className="samples-form" aria-label="Custom label request form">
          <div id={FORM_TARGET} className="request-form-embed" />
          <p className="request-form-fallback">
            Form not loading?{' '}
            <a href={LABTAG_QUOTE_URL} target="_blank" rel="noreferrer">
              Open the quote request on LabTAG.com
            </a>
            .
          </p>
        </aside>

        <section className="samples-proof" data-motion-section>
          <figure className="samples-kit is-photo" data-motion="photo" style={motionIndex(0)}>
            <img src={PHOTO.primary} alt="Die cut laboratory labels on a converting line" />
          </figure>
        </section>

        <p className="samples-note">
          Custom work is quoted from the same line as stock. Prefer to test a material first?{' '}
          <Link to={SAMPLE_PATH}>Request a free sample</Link>
          . See formats, printing, and surfaces on the{' '}
          <Link to="/solutions/custom-labels">Custom Laboratory Labels</Link> guide.
        </p>
      </div>
    </article>
  )
}
