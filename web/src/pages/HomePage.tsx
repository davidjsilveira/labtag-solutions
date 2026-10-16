import { Printer, SealCheck, Stack } from '@phosphor-icons/react'
import { RotatingAudience } from '@/components/RotatingAudience'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { TemperatureSlider } from '@/components/TemperatureSlider'
import { LABTAG_CONTACT_URL, LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

const heroQualifiers = [
  { label: 'Free Samples', Icon: Stack },
  { label: 'Custom Printing', Icon: Printer },
  { label: 'Satisfaction Guarantee', Icon: SealCheck },
] as const

export function HomePage() {
  return (
    <div className="home lander">
      <section className="lander-hero">
        <div className="lander-hero-media">
          <img
            src={resolveImageSrc('/media/lander-hero.jpg').primary}
            alt="Lab workstation with label printer, barcode scanner, sample vials, and a gloved hand at the keyboard"
            width={2880}
            height={1196}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="lander-hero-copy">
          <h1>
            Labels & Identification Solutions for <RotatingAudience />
          </h1>
          <p className="lede">
            Identify, track, and store every sample with labels built for the temperatures,
            chemicals, and workflows your research demands.
          </p>
          <div className="lander-hero-actions">
            <a className="btn btn-primary" href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">
              Chat with an expert
            </a>
            <a className="btn btn-secondary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
              Get Free Samples
            </a>
          </div>
          <ul className="lander-hero-qualifiers" aria-label="Why LabTAG">
            {heroQualifiers.map(({ label, Icon }) => (
              <li key={label}>
                <Icon size={18} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lander-all" aria-label="All solution pages">
        <SolutionCarousel heading="Browse all solutions" />
      </section>

      <section className="lander-temps" aria-label="Pick by storage temperature">
        <h2>Not sure where to start? Pick a temperature.</h2>
        <p className="lander-section-lede">
          Drag to your storage temperature — we will point you at the matching guide.
        </p>
        <TemperatureSlider />
      </section>

      <aside className="lander-cta block-cta">
        <h2>Test a label in your own freezer first</h2>
        <p>
          Request free label samples for your application, or jump into the shop when you already
          know the class you need. Shipping samples is free to contiguous US, Canada, and the EU
          (business addresses).
        </p>
        <div className="lander-hero-actions">
          <a className="btn btn-on-accent" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
          <a className="btn btn-on-accent-ghost" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Go to the shop
          </a>
        </div>
      </aside>
    </div>
  )
}
