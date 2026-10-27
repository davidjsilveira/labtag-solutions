import { useEffect, useRef } from 'react'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { LABTAG_RESELLER_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const PORTAL_ID = '4079112'
const FORM_ID = 'bf8fe2dd-41b7-48df-89e4-f028dfc61ef5'
const FORM_TARGET = 'hs-form-reseller'

const PROMISES = [
  {
    title: 'Competitive pricing',
    body: 'Distributor pricing that helps you win labs without guessing the catalog.',
    icon: '/media/about/why/diamond-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/diamond-icon.svg',
  },
  {
    title: 'Training and marketing',
    body: 'In depth training and marketing material from the team that specifies the labels.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
  {
    title: 'On time delivery',
    body: 'On time delivery and prompt answers from a dedicated distributor success team.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
]

const ART = resolveImageSrc(
  '/media/reseller/BecomeResellerImg.svg',
  'https://cdn.labtag.com/wp-content/uploads/BecomeResellerImg.svg',
)

export function ResellerPage() {
  const rootRef = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'Become a Reseller | Join LabTAG distributors'
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
    <article className="samples-page quote-page" ref={rootRef}>
      <div className="samples-layout">
        <div className="quote-stack">
          <header className="samples-hero" data-motion-hero>
            <h1 data-motion="hero" style={motionIndex(0)}>
              Become a Reseller
            </h1>
            <p className="samples-lede" data-motion="hero" style={motionIndex(1)}>
              Join our global network of distributors. Our dedicated distributor success team is
              ready to support a fruitful relationship through competitive pricing, in depth
              training, marketing material, on time delivery, and prompt answers.
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

          <section className="samples-proof" data-motion-section>
            <figure className="samples-kit is-illustration" data-motion="photo" style={motionIndex(0)}>
              <img
                src={ART.primary}
                alt="Two people shake hands over a world map of LabTAG distributors"
              />
            </figure>
          </section>
        </div>

        <aside id="reseller-request" className="samples-form" aria-label="Reseller application form">
          <div id={FORM_TARGET} className="request-form-embed" />
          <p className="request-form-fallback">
            Form not loading?{' '}
            <a href={LABTAG_RESELLER_URL} target="_blank" rel="noreferrer">
              Open the reseller form on LabTAG.com
            </a>
            .
          </p>
        </aside>
      </div>
    </article>
  )
}
