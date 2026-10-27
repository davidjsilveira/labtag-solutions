import { useEffect, useRef } from 'react'
import { Info } from '@phosphor-icons/react'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { LABTAG_SAMPLE_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const PORTAL_ID = '4079112'
const FORM_ID = '456aec1a-7937-43bc-b1ff-942a21cf0675'
const FORM_TARGET = 'hs-form-samples'

const PROMISES = [
  {
    title: '24 hours',
    body: 'We will process your request within 24 hours.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
  {
    title: 'Free samples',
    body: 'Samples and shipping are free for most regions worldwide.',
    icon: '/media/about/why/samples-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/samples-icon.svg',
  },
  {
    title: 'Expert support',
    body: 'Get support from our world-class lab labeling experts.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
]

const KIT = resolveImageSrc(
  '/media/samples/Sample-Kit4.png',
  'https://cdn.labtag.com/wp-content/uploads/Sample-Kit4.png',
)

export function SamplesPage() {
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
    <article className="samples-page" ref={rootRef}>
      <div className="samples-layout">
        <header className="samples-hero" data-motion-hero>
          <h1 data-motion="hero" style={motionIndex(0)}>
            Request Free Label Samples
          </h1>
          <p className="samples-lede" data-motion="hero" style={motionIndex(1)}>
            Let’s make sure you get the right labels and tapes for your application. Your
            satisfaction is guaranteed even before you make a purchase.
          </p>
          <p className="samples-note" data-motion="hero" style={motionIndex(2)}>
            <span className="samples-note-icon" aria-hidden="true">
              <Info size={18} weight="regular" />
            </span>
            We can only send free samples of labels and tapes. We do not offer free samples of
            markers, ribbons, and hardware. Samples will only be sent to verified business addresses.
            Shipping is free only for the contiguous United States and Canada, and for countries in
            the European Union. We reserve the right to limit quantities of samples within reason.
          </p>
          <ul className="samples-promises">
            {PROMISES.map((promise, index) => {
              const icon = resolveImageSrc(promise.icon, promise.iconFallback)
              return (
                <li key={promise.title} style={motionIndex(index + 3)}>
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

        <aside id="sample-request" className="samples-form" aria-label="Sample request form">
          <div id={FORM_TARGET} className="request-form-embed" />
          <p className="request-form-fallback">
            Form not loading?{' '}
            <a href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
              Open the sample request on LabTAG.com
            </a>
            .
          </p>
        </aside>

        <section className="samples-proof" data-motion-section>
          <figure className="samples-kit" data-motion="photo" style={motionIndex(0)}>
            <img src={KIT.primary} alt="LabTAG free sample kit of laboratory labels" />
          </figure>
          <figure className="block-quote samples-quote">
            <blockquote>
              <p>
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                Great labels and great customer service! The sales team was terrific to work with. I
                did a lot of research, requested some free samples, and took my time deciding which
                labels were right for me but everyone was very patient and helpful. I really
                appreciated the free samples so I could test before buying. These labels stay on,
                even at −80°C. Very happy and will keep ordering more every year.
              </p>
            </blockquote>
            <figcaption>Verified LabTAG customer</figcaption>
          </figure>
        </section>
      </div>
    </article>
  )
}
