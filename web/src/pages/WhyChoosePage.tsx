import { Link } from 'react-router-dom'
import { LABTAG_CONTACT_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

type Reason = {
  title: string
  body: string
  icon: string
  iconFallback: string
  href?: string
}

const REASONS: Reason[] = [
  {
    title: 'Dedication to Quality',
    body: 'Rigorously tested high-grade materials and high-quality products.',
    icon: '/media/about/why/diamond-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/diamond-icon.svg',
  },
  {
    title: 'Business Continuity',
    body: 'Ability to continue operating and delivering critical functions and services during and after disruptive events.',
    icon: '/media/about/why/Business-Continuity-Logo.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/Business-Continuity-Logo.svg',
  },
  {
    title: 'Scientific Label Experts',
    body: 'Deep understanding of industry-specific identification requirements.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
  {
    title: 'Over 2 Decades of Business',
    body: 'Continuously scaling and improving our products and services to better serve our customers.',
    icon: '/media/about/why/20years-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/20years-icon.svg',
  },
  {
    title: 'Product Innovation',
    body: 'In-house R&D team continuously innovates and creates unique, exclusive products.',
    icon: '/media/about/why/light-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/light-icon.svg',
  },
  {
    title: 'Tailor-Made Solutions',
    body: 'Helping you realize your multifaceted projects with custom labels with creative solutions.',
    icon: '/media/about/why/tailor-made-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/tailor-made-icon.svg',
  },
  {
    title: 'Worldwide Distribution',
    body: 'Strategically located warehouses facilitate product deliveries across the globe.',
    icon: '/media/about/why/world-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/world-icon.svg',
  },
  {
    title: 'Fast Order Fulfillment',
    body: 'Daytime and evening crews ensure short lead times so you can meet your project deadlines.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
  {
    title: 'Satisfaction Guarantee',
    body: 'Easy returns and exchanges if total satisfaction is not met.',
    icon: '/media/about/why/satisfaction-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/satisfaction-icon.svg',
  },
  {
    title: 'Free Samples',
    body: 'Generous, free sample service allows you to try products before purchasing.',
    icon: '/media/about/why/samples-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/samples-icon.svg',
    href: SAMPLE_PATH,
  },
]

const ISO_SEAL = resolveImageSrc('/media/about/iso-certified-lockup.svg')

const CERTS = [
  {
    mark: 'ISO',
    number: '9001:2015',
    kind: 'Certified',
    body: 'We are committed to providing reliable products and services that meet customer and regulatory requirements through our ISO 9001:2015 certified quality management system.',
  },
  {
    mark: 'ISO',
    number: '22301:2012',
    kind: 'Compliant',
    body: 'Our ISO 22301:2012 business continuity management system allows us to prepare for and reduce the likelihood of unexpected disruptions so we can continue to serve our clients.',
  },
]

function ReasonCard({ reason }: { reason: Reason }) {
  const resolved = resolveImageSrc(reason.icon, reason.iconFallback)
  const inner = (
    <>
      <span className="why-reason-icon">
        <img src={resolved.primary} alt="" width={72} height={72} />
      </span>
      <h2>{reason.title}</h2>
      <p>{reason.body}</p>
    </>
  )

  if (reason.href) {
    return (
      <Link to={reason.href} className="why-reason is-featured">
        {inner}
      </Link>
    )
  }

  return <article className="why-reason">{inner}</article>
}

export function WhyChoosePage() {
  return (
    <article className="why-page">
      <header className="page-hero">
        <div className="page-hero-copy">
          <p className="crumb">
            <Link to="/">Solutions</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/about">About</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Why Choose LabTAG</span>
          </p>
          <h1>Why Choose LabTAG</h1>
          <div className="page-hero-description">
            <p>
              LabTAG, a global leader in lab identification and ISO-certified, offers high-quality
              labeling solutions to ensure accurate, efficient sample tracking. Try free samples to
              confirm compatibility with your application. Our expert support and R&amp;D
              teams—staffed by M.Sc. and Ph.D. scientists—are ready to help you choose the right
              labels, printers, software, and scanners for your lab.
            </p>
          </div>
          <div className="page-hero-actions">
            <Link className="btn btn-primary" to={SAMPLE_PATH}>
              Request a free sample
            </Link>
            <a
              className="btn btn-secondary"
              href={LABTAG_CONTACT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Chat with an expert
            </a>
          </div>
        </div>
      </header>

      <section className="why-grid" aria-label="Reasons to choose LabTAG">
        {REASONS.map((reason) => (
          <ReasonCard key={reason.title} reason={reason} />
        ))}
      </section>

      <section className="about-iso" aria-label="Quality certifications">
        <div className="about-iso-body">
          <div className="about-iso-brand">
            <img
              className="about-iso-seal"
              src={ISO_SEAL.primary}
              alt="ISO certified"
              width={247}
              height={53}
            />
          </div>
          <div className="about-iso-certs">
            {CERTS.map((cert) => (
              <article key={cert.number}>
                <h2>
                  <span className="about-iso-mark">{cert.mark}</span>
                  <span className="about-iso-num">{cert.number}</span>
                </h2>
                <p className="about-iso-kind">{cert.kind}</p>
                <p>{cert.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
