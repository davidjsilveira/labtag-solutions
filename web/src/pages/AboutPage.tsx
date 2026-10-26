import { Link } from 'react-router-dom'
import { SAMPLE_PATH, WHY_CHOOSE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

const TEAM = resolveImageSrc(
  '/media/about/Photo5.png',
  'https://cdn.labtag.com/wp-content/uploads/Photo5.png',
)
const AWARD = resolveImageSrc(
  '/media/about/EY-2019.jpg',
  'https://cdn.labtag.com/wp-content/uploads/EY_EntrepreneuroftheYear_2019_132-1536x1024.jpg',
)
const MAP = resolveImageSrc('/media/about/world-dots.svg')
const ISO_SEAL = resolveImageSrc(
  '/media/about/why/ISO-Symbol-Design-B.svg',
  'https://cdn.labtag.com/wp-content/uploads/ISO-Symbol-Design-B.svg',
)

const VALUES = [
  {
    title: 'Vision',
    body: 'A world where every lab sample is accurately identified, enabling science to advance without compromise.',
  },
  {
    title: 'Mission',
    body: 'To deliver reliable, high-performance labeling solutions that safeguard research integrity in any environment.',
  },
  {
    title: 'Team',
    body: 'A dedicated group of scientists, engineers, and support specialists working together to solve labeling challenges worldwide.',
  },
]

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

const STATS = [
  { value: '25+', label: 'Years of specialty labels' },
  { value: '9001', label: 'ISO quality certified' },
  { value: '22301', label: 'ISO continuity compliant' },
  { value: '4', label: 'Offices worldwide' },
]

/** Equirectangular project onto the dotted-map viewBox, with a tiny nudge so nearby offices stay distinct. */
function officePin(lat: number, lng: number, nudgeX = 0, nudgeY = 0) {
  return {
    x: Number((((lng + 180) / 360) * 100 + nudgeX).toFixed(2)),
    y: Number((((90 - lat) / 180) * 100 + nudgeY).toFixed(2)),
  }
}

const OFFICES = [
  {
    region: 'USA',
    name: 'LabTAG Inc.',
    address: '42 Gateway Drive, Suite 400, Plattsburgh, NY 12901, USA',
    ...officePin(44.699, -73.453, -1.3, 1.0),
  },
  {
    region: 'Canada',
    name: 'GA International Inc.',
    address: '4455 Rue Louis-B.-Mayer, Laval, QC H7P 6B5, Canada',
    ...officePin(45.57, -73.754, 1.3, -1.0),
  },
  {
    region: 'Netherlands',
    name: 'GA International Inc.',
    address: 'Runweg 28, 5258 BN Berlicum, Netherlands',
    ...officePin(51.68, 5.4, 1.0, -0.5),
  },
  {
    region: 'UK',
    name: 'TAG Scientific Ltd.',
    address: 'Preston Park House, South Road, Brighton BN1 6SB, UK',
    ...officePin(50.843, -0.138, -0.5, 0.7),
  },
]

export function AboutPage() {
  return (
    <article className="about-page">
      <header className="about-hero">
        <p className="crumb">
          <Link to="/">Solutions</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">About</span>
        </p>
        <div className="about-hero-top">
          <h1>About Us</h1>
          <div className="about-hero-intro">
            <p className="about-hero-lede">
              GA International has over 25 years of experience as a leading manufacturer of
              specialty labels, supplying laboratory identification solutions to biomedical
              research labs, biobanks, hospitals, and other healthcare institutions.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" to={WHY_CHOOSE_PATH}>
                Why Choose LabTAG
              </Link>
              <Link className="btn btn-secondary" to={SAMPLE_PATH}>
                Request a free sample
              </Link>
            </div>
          </div>
        </div>
        <figure className="about-hero-figure">
          <img src={TEAM.primary} alt="The LabTAG team at GA International headquarters" />
          <figcaption>The LabTAG team at GA International headquarters</figcaption>
        </figure>
        <ul className="about-stats">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </header>

      <section className="about-story">
        <p className="about-kicker">Manufacturer</p>
        <div className="about-story-copy">
          <p>
            Since its inception, GA International has become a worldwide leader in cryogenic and
            chemical-resistant labels, strongly dedicated to R&amp;D, product development, and
            manufacturing. Outstanding technical support and customer service are the hallmarks of
            GA International, ensuring that clients receive not only high-performance labeling
            solutions but also expert guidance every step of the way.
          </p>
        </div>
      </section>

      <section className="about-manifesto" aria-label="Vision, mission, and team">
        {VALUES.map((value, index) => (
          <article key={value.title} className="about-value">
            <span className="about-value-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{value.title}</h2>
            <p>{value.body}</p>
          </article>
        ))}
      </section>

      <section className="about-iso" aria-label="Quality certifications">
        <p className="about-kicker">Quality</p>
        <div className="about-iso-body">
          <img
            className="about-iso-seal"
            src={ISO_SEAL.primary}
            alt=""
            width={160}
            height={156}
          />
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

      <Link to={WHY_CHOOSE_PATH} className="about-why">
        <h2>Why Choose LabTAG</h2>
        <p>Find out why working with us is a winning strategy.</p>
      </Link>

      <section className="about-cinema" aria-label="Recognition and offices">
        <div className="about-award">
          <figure className="about-award-figure">
            <img
              src={AWARD.primary}
              alt="Dr. George Ambartsoumian receiving the EY Entrepreneur Of The Year 2019 Award"
            />
          </figure>
          <div className="about-award-copy">
            <p className="about-kicker is-accent">2019</p>
            <h2>EY Entrepreneur Of The Year®</h2>
            <p>
              Congratulations to our founder and CEO, Dr. George Ambartsoumian, for winning the EY
              Entrepreneur Of The Year® 2019 Award.
            </p>
          </div>
        </div>

        <div className="about-locations">
          <header className="about-locations-copy">
            <p className="about-kicker">Headquarters</p>
            <h2>Our offices around the world</h2>
            <p>
              To support our growing team and operations, we expanded into a larger,
              state-of-the-art facility with modern offices, advanced R&amp;D labs, and an upgraded
              production warehouse.
            </p>
          </header>
          <div className="about-locations-body">
            <figure className="about-map" aria-label="Map of LabTAG and GA International offices">
              <img src={MAP.primary} alt="" />
              <div className="about-pins" aria-hidden="true">
                {OFFICES.map((office) => (
                  <span
                    key={office.region}
                    className="about-pin"
                    data-office={office.region}
                    style={{ left: `${office.x}%`, top: `${office.y}%` }}
                  >
                    <svg className="about-pin-mark" viewBox="0 0 24 32">
                      <path
                        fill="currentColor"
                        d="M12 31s-9-11.4-9-19a9 9 0 1 1 18 0c0 7.6-9 19-9 19z"
                      />
                      <text
                        x="12"
                        y="13.2"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="7"
                        fontWeight="700"
                        fontFamily="var(--font-display), sans-serif"
                      >
                        GA
                      </text>
                    </svg>
                  </span>
                ))}
              </div>
            </figure>
            <ul className="about-office-list">
              {OFFICES.map((office) => (
                <li key={office.region}>
                  <div className="about-office" data-office={office.region}>
                    <strong>{office.region}</strong>
                    <span>{office.name}</span>
                    <span>{office.address}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <aside className="block-cta">
        <div className="block-cta-copy">
          <h2>Need a label for your lab?</h2>
          <p>See why labs choose LabTAG, or request free samples for your application.</p>
        </div>
        <div className="block-cta-actions">
          <Link className="btn btn-on-accent" to={WHY_CHOOSE_PATH}>
            Why Choose LabTAG
          </Link>
          <Link className="btn btn-on-accent-ghost" to={SAMPLE_PATH}>
            Request a free sample
          </Link>
        </div>
      </aside>
    </article>
  )
}
