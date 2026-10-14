import { Link } from 'react-router-dom'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { getCategoryForSlug, solutionCategories } from '@/content/categories'
import { getPage } from '@/content/loadPages'
import { LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

type Industry = {
  id: string
  audience: string
  title: string
  body: string
  slug: string
  also?: { label: string; slug: string }[]
}

const industries: Industry[] = [
  {
    id: 'research',
    audience: 'Research & clinical labs',
    title: 'Labels that survive liquid nitrogen',
    body: 'Cryo vials, microtubes, plates, and boxes living in LN₂ or vapor phase need adhesives that do not flake, lift, or smear. Start with the full cryogenic lineup, then branch into the container that matches your rack.',
    slug: 'cryogenic-labels',
    also: [
      { label: 'Deep-freeze (−80°C)', slug: 'deep-freeze' },
      { label: 'Laboratory overview', slug: 'laboratory-labels' },
    ],
  },
  {
    id: 'biobank',
    audience: 'Biobanks & biorepositories',
    title: 'Specimen ID for decades of storage',
    body: 'Biobanks run on trust: a barcode that still scans after years in ultra-low freezers or LN₂. NitroTAG®, CryoSTUCK®, and LIMS-friendly formats keep biospecimens traceable through the whole lifecycle.',
    slug: 'biobanking-labels',
    also: [
      { label: 'RFID & tags', slug: 'rfid-labels-tags' },
      { label: 'CryoSTUCK®', slug: 'cryostuck' },
    ],
  },
  {
    id: 'ivf',
    audience: 'Fertility clinics & ART labs',
    title: 'IVF straws, dishes, and witnessing',
    body: 'Low-VOC cryo labels for straws, Cryotop®, and cultureware — built for Electronic Witnessing Systems and the care that fertility workflows demand.',
    slug: 'ivf-labeling-solutions',
    also: [{ label: 'Cryogenic requisition forms', slug: 'cryogenic-clinical-requisition-forms' }],
  },
  {
    id: 'vaccine',
    audience: 'Pharma, hospitals & vaccine programs',
    title: 'Cold-chain labels from fridge to −80°C',
    body: 'mRNA and other deep-freeze vaccines need constructs that hold through refrigerated, frozen, and ultra-low legs of the cold chain — including syringe flags and smart tracking options.',
    slug: 'vaccine-labels',
    also: [{ label: 'COVID-19 lab labels', slug: 'covid-19-laboratory-labels' }],
  },
  {
    id: 'pcr',
    audience: 'Molecular biology & diagnostic labs',
    title: 'PCR tubes, strips, and plates that stay named',
    body: 'Tiny vessels, busy cyclers, and freezer storage afterward. Dot labels, perforated strip labels, PlateTAG™, and adhesive-free PCR-TagTrax® keep runs identifiable from setup through cold storage.',
    slug: 'pcr-labels-and-tags',
  },
  {
    id: 'trials',
    audience: 'Clinical trial teams',
    title: 'Custom constructs for trial logistics',
    body: 'Sponsors and CROs need serialized, barcode-ready, and often cryogenic clinical labels — on time, in the right format, with room for graphics and RFID when the protocol asks for it.',
    slug: 'clinical-trial-labels',
    also: [{ label: 'Clinical data printing', slug: 'clinical-data-printing' }],
  },
  {
    id: 'university',
    audience: 'Universities & teaching labs',
    title: 'Shared freezers, shared accountability',
    body: 'Core facilities and teaching benches share cold storage with rotating students and PIs. Durable cryo and deep-freeze labels keep shared inventory honest without slowing the next person down.',
    slug: 'laboratory-labels',
    also: [
      { label: 'Cryogenic labels', slug: 'cryogenic-labels' },
      { label: 'Label software', slug: 'label-software' },
    ],
  },
  {
    id: 'frozen',
    audience: 'Anyone labeling already-frozen stock',
    title: 'Stick to frozen vials — no thaw required',
    body: 'Opened a box that was never supposed to warm up? CryoSTUCK® applies straight onto −80°C surfaces so you can re-ID without a thaw cycle.',
    slug: 'cryostuck',
    also: [{ label: 'Hard-to-stick surfaces', slug: 'labels-for-hard-to-stick-surfaces' }],
  },
]

const tempPicks = [
  {
    label: 'Liquid nitrogen (−196°C)',
    hint: 'Vials, boxes, metal canes',
    slug: 'cryogenic-labels',
  },
  {
    label: 'ULT freezers (−80°C)',
    hint: 'Microtubes, plates, blood bags',
    slug: 'deep-freeze',
  },
  {
    label: 'Already frozen',
    hint: 'Apply without thawing',
    slug: 'cryostuck',
  },
  {
    label: 'IVF straws',
    hint: 'Vitrification & ART',
    slug: 'ivf-labeling-solutions',
  },
]

function solutionPath(slug: string): string {
  const category = getCategoryForSlug(slug)
  return category ? `/solutions/${category.id}/${slug}` : `/solutions/${slug}`
}

function SolutionMedia({ slug, title }: { slug: string; title: string }) {
  const page = getPage(slug)
  const image = page?.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  if (!resolved) {
    return <div className="lander-media-fallback" aria-hidden="true" />
  }

  return (
    <img
      src={resolved.primary}
      alt={image?.alt || title}
      loading="lazy"
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

export function HomePage() {
  return (
    <div className="home lander">
      <section className="lander-hero">
        <div className="lander-hero-media">
          <img
            src={resolveImageSrc('/media/lander-hero.jpg').primary}
            alt="Scientist in a lab coat and blue gloves working with a vial at the bench"
            width={1024}
            height={461}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="lander-hero-copy">
          <p className="brand">LabTAG</p>
          <h1>Cryogenic labels for the labs that freeze work that matters</h1>
          <p className="lede">
            From university freezers to biobanks and fertility clinics — pick the industry or
            temperature that sounds like your bench, and we will send you to the right solution
            page.
          </p>
          <div className="lander-hero-actions">
            <a className="btn btn-primary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
              Request a free sample
            </a>
            <a className="btn btn-secondary" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
              Browse the shop
            </a>
          </div>
        </div>
      </section>

      <section className="lander-all" aria-label="All solution pages">
        <SolutionCarousel
          heading="Browse all solutions"
          lede="Filter by use cases, features, or services — then scroll the row, or use the arrows."
        />
      </section>

      <section className="lander-temps" aria-label="Pick by storage temperature">
        <h2>Not sure where to start? Pick a temperature.</h2>
        <p className="lander-section-lede">
          Same idea as asking the person next to you at the freezer bank — match the cold, then
          open the matching guide.
        </p>
        <ul className="temp-grid">
          {tempPicks.map((pick) => {
            const category = solutionCategories.find((item) => item.slugs.includes(pick.slug))
            const to = category
              ? `/solutions/${category.id}/${pick.slug}`
              : `/solutions/${pick.slug}`
            return (
              <li key={pick.slug}>
                <Link to={to} className="temp-card">
                  <strong>{pick.label}</strong>
                  <span>{pick.hint}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="lander-industries" aria-label="Industries and use cases">
        <header className="lander-industries-head">
          <h2>Find your industry</h2>
          <p>
            Each path opens a full solution page with containers, print methods, and product
            classes — written the way a lab tech would explain it on a walk-through.
          </p>
        </header>

        {industries.map((industry, index) => {
          const flip = index % 2 === 1
          return (
            <article
              key={industry.id}
              id={industry.id}
              className={`industry-split${flip ? ' industry-split-flip' : ''}`}
            >
              <div className="industry-copy">
                <p className="industry-audience">{industry.audience}</p>
                <h3>{industry.title}</h3>
                <p>{industry.body}</p>
                <div className="industry-actions">
                  <Link
                    className="btn btn-primary"
                    to={solutionPath(industry.slug)}
                  >
                    Open {getPage(industry.slug)?.title ?? 'solution'}
                  </Link>
                  {industry.also?.map((item) => (
                    <Link
                      key={item.slug}
                      className="btn btn-ghost"
                      to={solutionPath(item.slug)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to={solutionPath(industry.slug)}
                className="industry-media"
                aria-label={`View ${getPage(industry.slug)?.title ?? industry.title}`}
              >
                <SolutionMedia slug={industry.slug} title={industry.title} />
              </Link>
            </article>
          )
        })}
      </section>

      <section className="lander-related" aria-label="Related cryogenic paths">
        <h2>Also useful in cryo workflows</h2>
        <ul className="related-chips">
          {[
            'snappeel-labels',
            'rfid-labels-tags',
            'custom-laboratory-labels',
            'label-printing-solutions',
            'histology-labels',
            'autoclave-labels',
          ].map((slug) => {
            const page = getPage(slug)
            if (!page) return null
            return (
              <li key={slug}>
                <Link to={solutionPath(slug)}>{page.title}</Link>
              </li>
            )
          })}
        </ul>
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
