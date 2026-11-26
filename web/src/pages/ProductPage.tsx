import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BookOpen, CaretDown, ChatCircle, FileText, Files, Flask, Headset, Play, Printer, Ruler, ShoppingCart, Snowflake, Star, X } from '@phosphor-icons/react'
import { MdPager } from '@/components/MdPager'
import { findLabelClass } from '@/content/labelFinder'
import { RESOURCES_PATH, SAMPLE_PATH, SHOP_PATH, TEMPLATES_PATH, productPath } from '@/content/labtagLinks'
import { LITERATURE_ITEMS } from '@/content/literature'
import { COLOR_SWATCH, SHOP_MOCK_SKUS, findShopSku, rollPriceFromUnit } from '@/content/classMocks'
import { recommendedRibbons } from '@/content/ribbons'
import { sizeOf } from '@/content/classDims'

const CLASS_IMAGE = '/media/label-finder/class-placeholder.webp'
const DATA_SHEET =
  'https://cdn.labtag.com/wp-content/uploads/Product+Data+Sheet+-+NitroTAG_++JTTA+Label+Material_2025-12-17.pdf'

const guideHref = (id: string) => LITERATURE_ITEMS.find((item) => item.id === id)?.href ?? '#'

/** shortcut: resources relevant to the JTTA cryo PDP; filter per class when other PDPs exist */
const RESOURCES = [
  { title: 'Templates', caption: 'Label templates & designs', href: TEMPLATES_PATH, Icon: Files },
  { title: 'Case Study', caption: 'Customer case studies', href: `${RESOURCES_PATH}?type=case-studies`, Icon: BookOpen },
  { title: 'Label Size Guide', caption: 'PDF · Vials & tubes', href: guideHref('label-size-guide-for-vials-tubes'), Icon: Ruler },
  { title: 'Cryogenic Label Guide', caption: 'Read the guide', href: guideHref('the-cryogenic-label-guide'), Icon: Snowflake },
  { title: 'Print & Scan', caption: 'Label printing solutions', href: '/solutions/label-printing-solutions', Icon: Printer },
  { title: 'Product Data Sheet', caption: 'NitroTAG® JTTA · PDF', href: DATA_SHEET, Icon: FileText },
]

const COLOR_SKU: Record<string, string> = {
  White: 'WH',
  Yellow: 'YE',
  Green: 'GA',
  Blue: 'BL',
  Red: 'RE',
  Pink: 'PI',
}

const PACKS = [
  { qty: 1000, label: '1″ Core / 1000 Labels' },
  { qty: 3000, label: '3″ Core / 3000 Labels' },
] as const

/** live JTTA-29 FAQ from labtag.com — wording kept verbatim, links to the live targets */
const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: 'Do I need a ribbon to print on these labels?',
    a: (
      <>
        Yes, NitroTAG® labels are thermal-transfer printable and require a ribbon to be printed. To achieve the proper printout, NitroTAG labels require a{' '}
        <a href="https://www.labtag.com/shop/category/printing-solution/smudge-and-alcohol-proof-ribbons-rr-class/" target="_blank" rel="noreferrer">
          RR-class
        </a>{' '}
        ribbon of the same width or larger.
      </>
    ),
  },
  {
    q: 'Can I apply these labels to already frozen vials?',
    a: (
      <>
        No, NitroTAG labels are best applied at room temperature. For labeling already frozen vials and tubes, we recommend{' '}
        <a href="https://www.labtag.com/shop/brand-name/cryostuck/" target="_blank" rel="noreferrer">
          CryoSTUCK® labels
        </a>
        , a line of cryogenic labels especially designed for that purpose.
      </>
    ),
  },
  {
    q: 'How do I determine the right size for my tubes/vials?',
    a: (
      <>
        Please consult our handy{' '}
        <a href="https://knowledge.labtag.com/knowledge/label-size-table" target="_blank" rel="noreferrer">
          sizing guide
        </a>{' '}
        where you will find recommendations for the most common vial/tube sizes.
      </>
    ),
  },
  {
    q: 'Can I use these labels in my DYMO printer?',
    a: (
      <>
        No, NitroTAG labels are meant to be printed using a thermal-transfer printer with a ribbon. Find our selection of thermal-transfer printers{' '}
        <a href="https://www.labtag.com/shop/category/printing-solution/printers/?printing_method=thermal-transfer" target="_blank" rel="noreferrer">
          here
        </a>
        . You can also consult our{' '}
        <a href="https://info.labtag.com/en-us/label-printer-buying-guide" target="_blank" rel="noreferrer">
          printer buying guide
        </a>{' '}
        or{' '}
        <a href="https://www.labtag.com/contact-us/" target="_blank" rel="noreferrer">
          contact our technical support team
        </a>{' '}
        who will be glad to help you find the right one.
      </>
    ),
  },
  {
    q: 'How do I print NitroTAG labels from a template?',
    a: (
      <>
        Barcoding or label design{' '}
        <a href="https://www.labtag.com/shop/category/printing-solution/software/" target="_blank" rel="noreferrer">
          software
        </a>{' '}
        can be used to create templates that conform to the size of your label. You can then insert design elements within the template, for easy printing.
      </>
    ),
  },
  {
    q: 'Can I have these labels preprinted by you with my desired information?',
    a: (
      <>
        Yes, we can provide our NitroTAG cryo labels preprinted with full-color graphics and logos, as well as variable or serialized information from a database. Learn more about our{' '}
        <a href="https://www.labtag.com/custom-labels/" target="_blank" rel="noreferrer">
          custom printing
        </a>{' '}
        options.
      </>
    ),
  },
  {
    q: 'Can NitroTAG labels be removed?',
    a: (
      <>
        No, NitroTAG labels are coated with a permanent adhesive, that is not made for easy removal. For removable cryogenic solutions see{' '}
        <a href="https://www.labtag.com/shop/category/cryogenic-labels/?adhesive=removable" target="_blank" rel="noreferrer">
          here
        </a>
        .
      </>
    ),
  },
]

/** shortcut: live JTTA-29 description + spec values until per-SKU catalog data exists */
const JTTA29_DESCRIPTION = {
  heading: 'NitroTAG® – Cryo Barcode Labels for Liquid Nitrogen Storage',
  bullets: [
    'Resistant to long-term cryogenic storage in freezers and liquid nitrogen (-196°C/-321°F)',
    'Perfect for cryovials, tubes, cryo-boxes, freezer-boxes, and many other cryo-containers',
    'Resistant to spraying and swabbing with alcohol and surface sanitizing wipes',
    'Require no cure time before liquid nitrogen immersion. Will also adhere to wet surfaces.',
    'Ideal for serialized data and barcodes, thanks to high-quality thermal-transfer printing',
    'Available in a large range of sizes, colors, and configurations.',
  ],
  paragraphs: [
    'NitroTAG® labels are available in a range of sizes and configurations, perfect for identifying small-diameter cryo vials, microtubes and tube tops, cardboard or polypropylene cryo/freezer boxes, cell culture plates, and plastic bags.',
    'These thermal-transfer cryogenic labels have a strong permanent adhesive that will remain firmly and permanently attached in ultra-low temperatures. They are designed for long-term cryo-preservation under cryogenic laboratory conditions, including in liquid and vapor phase liquid nitrogen (-196°C/-321°F), freezers (-80°C/-112°F), and dry ice transportation.',
    'NitroTAG labels require zero cure time and can be immersed in liquid nitrogen immediately after application without the need for additional tape or lamination. Additionally, these labels are waterproof, weatherproof, and durable. NitroTAG labels will adhere to wet surfaces, resist multiple freeze-thaw cycles, and can withstand elevated temperatures up to +110°C.',
    'They are also resistant to spraying with ethanol, isopropanol, and other alcohols, bleach, and detergents (testing recommended), as well as routine wiping and rubbing with surface sanitizing wipes such as Sani-Wipe™, Eco-Wipe™, and Eco-Wipe™ Duo.',
    'NitroTAG labels can be printed with all major brands of thermal-transfer printers. They are available in a range of colors and sizes and can be printed with alphanumeric text, as well as 1D and 2D barcodes.',
  ],
}

const JTTA29_SPECS: [string, string][] = [
  ['Labels/Roll', '1000 (1″ core), 3000 (3″ core)'],
  ['Perforated', 'Yes'],
  ['Temperature Range', '-196°C to +110°C (-320.8°F to 230°F)'],
  ['Adhesive', 'Permanent'],
  ['Printing Methods', 'Thermal Transfer'],
  ['Resistances', 'Alcohol Wiping, Cryogenic (-196°C), Deep-Freeze (-80°C)'],
  ['Recommended Ink Ribbon', 'RR-Class'],
  ['Class', 'JTTA'],
  ['Brand', 'NitroTAG®'],
]

const TAB_LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'resources', label: 'Resources' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'related', label: 'Related products' },
] as const

const REVIEWS_ALL_URL = 'https://www.labtag.com/shop/product/reviews/22178'
const REVIEWS_PER_PAGE = 3

/** shortcut: live JTTA-29 reviews (live wording, incl. typos) until catalog review data exists */
const REVIEWS = [
  { rating: 5, date: '2026-07-29', body: 'Fantastic product', name: 'Kelly M.', location: 'United States' },
  { rating: 5, date: '2024-03-06', body: 'nice product', name: 'Leonidas A.', location: 'Attica, Greece' },
  { rating: 5, date: '2023-06-23', body: "It's just what we needed", name: 'Anonymous', location: '' },
  { rating: 5, date: '2021-10-02', body: 'Excelente product very good quality', name: 'HECTOR ZAMORES', location: 'Mexico City, Mexico' },
  { rating: 5, date: '2021-09-09', body: 'Great product. Use it with our zebra printer.', name: 'Anonymous', location: 'New York, United States' },
  { rating: 5, date: '2021-02-04', body: 'Can we get discount if we order more?', name: 'Ying Su', location: 'California, United States' },
  { rating: 5, date: '2020-10-15', body: 'Adheres perfectly after 25 freeze-thaw cycles on dry ice!', name: 'Anonymous', location: 'California, United States' },
  { rating: 5, date: '2020-10-14', body: 'Having testing pretty much every cryogenic label in the business, these are the best. Once on they are well and truly on, even stick to frozen samples.', name: 'Sue K.', location: 'England, United Kingdom' },
  { rating: 5, date: '2020-06-03', body: 'Quality is excellent!', name: 'Steven Ho', location: 'Singapore' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="sku-stars" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} weight="fill" className={n <= rating ? undefined : 'is-empty'} aria-hidden="true" />
      ))}
    </span>
  )
}

const JTTA29_IMAGES = [
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29C1-1WH.png',
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29C3-3WH1.png',
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29-use1.jpg',
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29-use2-1.jpg',
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29-use3.jpg',
  'https://cdn.labtag.com/wp-content/uploads/JTTA-29C1-illu.jpg',
]

export function ProductPage() {
  const { category = '', model = '' } = useParams()
  const listing = category || 'tube-vial-container-cryo-labels'
  const row = findLabelClass('JTTA')
  const sku = findShopSku(decodeURIComponent(model))
  const [color, setColor] = useState(sku?.colors[0] ?? '')
  const [packQty, setPackQty] = useState<(typeof PACKS)[number]['qty']>(1000)
  const [quantity, setQuantity] = useState(1)
  const [slide, setSlide] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [mediaTab, setMediaTab] = useState<'images' | 'videos'>('images')
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [reviewPage, setReviewPage] = useState(1)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const tabsRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [tabsStuck, setTabsStuck] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const tabs = tabsRef.current
      if (!tabs) return
      const rect = tabs.getBoundingClientRect()
      setTabsStuck(rect.top <= (parseFloat(getComputedStyle(tabs).top) || 0) + 1)
      // iterate the rendered tabs so dynamically added sections join the spy
      const ids = [...tabs.querySelectorAll('a')].map((a) => a.getAttribute('href')?.slice(1) ?? '')
      // at the page bottom the last section may never reach the line — still mark it current
      if (ids.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveTab(ids[ids.length - 1])
        return
      }
      // activate a section once its heading enters the reading zone under the bar,
      // not only when it nearly touches it (feels broken on the short last section)
      const line = rect.bottom + Math.min(120, Math.round(window.innerHeight * 0.15))
      let current = ''
      let currentTop = 0
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top == null || top > line) continue
        // latest section above the line wins; equal tops keep the first
        if (!current || top > currentTop + 2) {
          current = id
          currentTop = top
        }
      }
      if (current) setActiveTab(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  if (!row || !sku) return <Navigate to={`${SHOP_PATH}/${listing}`} replace />

  const size = sizeOf(sku.dimensions)
  const pack = PACKS.find((item) => item.qty === packQty) ?? PACKS[0]
  const variantSku = `${sku.model.replace(/-P\d+$/, '')}C${pack.qty === 3000 ? '3-3' : '1-1'}${COLOR_SKU[color] ?? 'WH'}`
  const roll = rollPriceFromUnit(sku.price, pack.qty)
  const [rollAmount, rollUnit] = roll.split('/')
  const [unitAmount, unitUnit] = sku.price.split('/')
  const avgRating = (REVIEWS.reduce((sum, item) => sum + item.rating, 0) / REVIEWS.length).toFixed(1)
  const reviewTitle = `${row.headline} - ${size && size !== 'N/A' ? size : sku.dimensions} #${sku.model}`
  const related = SHOP_MOCK_SKUS.filter((item) => item.model !== sku.model).slice(0, 6)
  const ribbons = recommendedRibbons(
    sku.width,
    row.printers.some((printer) => /thermal[- ]?transfer/i.test(printer)),
    /roll/i.test(row.formats),
  )
  const ribbonNote =
    ribbons.length && sku.width != null
      ? `Thermal-transfer roll labels need an RR-Class ribbon at least 0.5″ wider than the label — ${sku.width + 0.5}″ or wider for this ${sku.width}″ label.`
      : ''
  const tabLinks = ribbons.length ? [...TAB_LINKS, { id: 'ribbon', label: 'Recommended Ribbon' }] : TAB_LINKS
  const gallery = [sku.image ?? JTTA29_IMAGES[0], ...JTTA29_IMAGES.filter((src) => src !== sku.image)].slice(0, 6)
  const videoIndex = gallery.length
  const showingVideo = slide === videoIndex
  const preview = showingVideo ? gallery[2] ?? gallery[0] : gallery[slide] ?? CLASS_IMAGE
  const openLightbox = (tab: 'images' | 'videos', index = 0) => {
    setMediaTab(tab)
    if (tab === 'images') setSlide(index)
    setLightbox(true)
  }

  const specs: [string, string][] = [['Size', size && size !== 'N/A' ? size : '—'], ...JTTA29_SPECS]

  return (
    <article className="sku-page">
      <h1 className="sku-title">
        {row.headline} — {size !== 'N/A' ? size : sku.model} #{sku.model}
      </h1>

      <div className="sku-hero">
        <div className="sku-media">
          <figure className={`sku-gallery${showingVideo ? ' is-video' : ''}`}>
            <button type="button" className="sku-gallery-open" aria-label="Open media" onClick={() => openLightbox(showingVideo ? 'videos' : 'images', slide)}>
              <img src={preview} alt="" />
              {showingVideo ? (
                <span className="sku-video-place">
                  <Play weight="fill" aria-hidden="true" />
                  <em>Video</em>
                </span>
              ) : null}
            </button>
          </figure>
          <ol className="sku-thumbs">
            {gallery.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  className={slide === index ? 'is-active' : undefined}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={slide === index}
                  onClick={() => setSlide(index)}
                  onDoubleClick={() => openLightbox('images', index)}
                >
                  <img src={src} alt="" />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={`sku-thumb-video${showingVideo ? ' is-active' : ''}`}
                aria-label="Show video"
                aria-pressed={showingVideo}
                onClick={() => openLightbox('videos')}
              >
                <img src={gallery[2] ?? gallery[0]} alt="" />
                <Play weight="fill" aria-hidden="true" />
              </button>
            </li>
          </ol>
        </div>
        <div className="sku-buy">
          <p className="sku-id">#{variantSku}</p>
          {sku.colors.length ? (
            <div className="sku-colors">
              <span>Color: {color}</span>
              <ul>
                {sku.colors.map((name) => (
                  <li key={name} className="class-swatch-wrap" data-color={name}>
                    <button
                      type="button"
                      className={`class-swatch${color === name ? ' is-active' : ''}`}
                      style={{ background: COLOR_SWATCH[name] ?? '#d7d3de' }}
                      aria-label={name}
                      aria-pressed={color === name}
                      onClick={() => setColor(name)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <label className="sku-pack">
            <span>Core Size / Qty Per Roll</span>
            <select
              value={pack.qty}
              onChange={(event) => setPackQty(Number(event.target.value) as (typeof PACKS)[number]['qty'])}
            >
              {PACKS.map((item) => (
                <option key={item.qty} value={item.qty}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="sku-pack">
            <span>Quantity</span>
            <input
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          <p className="sku-price">
            <strong>{rollUnit ? `${rollAmount}/${rollUnit}` : roll}</strong>
            <span>{unitUnit ? `${unitAmount}/${unitUnit}` : sku.price}</span>
          </p>
          <button type="button" className="class-action is-primary">
            <ShoppingCart aria-hidden="true" />
            Add to cart
          </button>
          <Link className="class-action" to={SAMPLE_PATH}>
            Get a free sample
          </Link>
          <ul className="sku-trust">
            <li>
              <Headset weight="regular" aria-hidden="true" />
              <strong>Application support</strong>
              <span>Specialists help you spec the right label</span>
            </li>
            <li>
              <FileText weight="regular" aria-hidden="true" />
              <strong>Full documentation</strong>
              <span>Data sheets and sizing guides</span>
            </li>
            <li>
              <Flask weight="regular" aria-hidden="true" />
              <strong>Made for labs</strong>
              <span>Designed for laboratory workflows</span>
            </li>
          </ul>
        </div>
      </div>

      <nav ref={tabsRef} className={`sku-tabs${tabsStuck ? ' is-stuck' : ''}`} aria-label="Product sections">
        {tabLinks.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={activeTab === tab.id ? 'is-active' : undefined}
            aria-current={activeTab === tab.id ? 'true' : undefined}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      <div className="sku-two-col">
      <section className="sku-section" id="overview">
        <h2>Overview</h2>
        <h3 className="sku-overview-heading">{JTTA29_DESCRIPTION.heading}</h3>
        <ul className="sku-overview-list">
          {JTTA29_DESCRIPTION.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {JTTA29_DESCRIPTION.paragraphs.map((item) => (
          <p key={item.slice(0, 24)}>{item}</p>
        ))}
      </section>

      <section className="sku-section" id="specifications">
        <h2>Specifications</h2>
        <dl className="sku-specs">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      </div>

      <section className="sku-section" id="resources">
        <h2>Resources</h2>
        <ul className="sku-resources">
          {RESOURCES.map(({ title, caption, href, Icon }) => {
            const inner = (
              <>
                <Icon weight="duotone" aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  {caption}
                </span>
              </>
            )
            return (
              <li key={title}>
                {href.startsWith('http') ? (
                  <a className="sku-sheet" href={href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link className="sku-sheet" to={href}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="sku-section" id="reviews">
        <h2>User Reviews</h2>
        <div className="sku-reviews-average">
          <strong className="sku-reviews-score">{avgRating}</strong>
          <span className="sku-reviews-meta">
            <Stars rating={Math.round(Number(avgRating))} />
            <span>Average Rating · {REVIEWS.length} reviews</span>
          </span>
          <a className="sku-reviews-all" href={REVIEWS_ALL_URL} target="_blank" rel="noreferrer">
            View All Reviews
            <ChatCircle weight="fill" aria-hidden="true" />
          </a>
        </div>
        <ul className="sku-reviews-grid">
          {REVIEWS.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE).map((review) => (
            <li key={`${review.date}-${review.name}`} className="sku-review-card">
              <div className="sku-review-top">
                <span className="sku-review-score">
                  <Stars rating={review.rating} />
                  <strong>{review.rating}/5</strong>
                </span>
                <time dateTime={review.date}>{review.date}</time>
              </div>
              <h3>{reviewTitle}</h3>
              <p>{review.body}</p>
              <footer>
                <span className="sku-review-avatar" aria-hidden="true">
                  {review.name.charAt(0)}
                </span>
                <span className="sku-review-who">
                  <strong>{review.name}</strong>
                  {review.location ? <span>{review.location}</span> : null}
                </span>
              </footer>
            </li>
          ))}
        </ul>
        <div className="sku-reviews-pager">
          <MdPager
            page={reviewPage}
            pageSize={REVIEWS_PER_PAGE}
            total={REVIEWS.length}
            onPage={setReviewPage}
            onPageSize={() => {}}
          />
        </div>
      </section>

      <section className="sku-section" id="faq">
        <h2>FAQ</h2>
        <div className="sku-faq">
          {FAQS.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>
                <span>{item.q}</span>
                <CaretDown weight="bold" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="sku-section" id="related">
        <h2>Related products</h2>
        <ul className="shop-grid sku-related">
          {related.map((item) => {
            const itemSize = sizeOf(item.dimensions)
            const extra = item.colors.length > 6 ? item.colors.length - 6 : 0
            const pack = item.price.includes('/set') ? item.price : rollPriceFromUnit(item.price)
            const [amount, unit] = pack.split('/')
            return (
              <li key={item.model}>
                <Link className="shop-card" to={productPath(listing, item.model)}>
                  <figure className="shop-card-media">
                    <img src={item.image ?? CLASS_IMAGE} alt="" />
                    {item.badges?.length ? (
                      <ul className="shop-card-badges">
                        {item.badges.map((badge) => (
                          <li key={badge}>{badge}</li>
                        ))}
                      </ul>
                    ) : null}
                  </figure>
                  <p className="shop-card-sku">#{item.model}</p>
                  <h2>{row.headline}</h2>
                  <p className="shop-card-meta">
                    {itemSize !== 'N/A' ? itemSize : item.dimensions} · {item.shape}
                  </p>
                  <ul className="shop-card-colors">
                    {item.colors.length ? (
                      <>
                        {item.colors.slice(0, 6).map((name) => (
                          <li key={name} data-tooltip={name} style={{ background: COLOR_SWATCH[name] ?? '#fff' }} />
                        ))}
                        {extra ? <span>+{extra}</span> : null}
                      </>
                    ) : (
                      <li className="is-empty" />
                    )}
                  </ul>
                  <p className="shop-card-price">
                    <strong>
                      {amount}
                      {unit ? <em>/{unit}</em> : null}
                    </strong>
                    <span>{item.price}</span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {ribbons.length ? (
        <section className="sku-section" id="ribbon">
          <h2>Recommended Ribbon</h2>
          {ribbonNote ? <p className="sku-ribbon-note">{ribbonNote}</p> : null}
          <ul className="shop-grid sku-related">
            {ribbons.map((ribbon) => (
              <li key={ribbon.model}>
                <a className="shop-card" href={ribbon.url} target="_blank" rel="noreferrer">
                  <figure className="shop-card-media">
                    <img src={ribbon.image} alt="" />
                  </figure>
                  <p className="shop-card-sku">#{ribbon.model}</p>
                  <h2>{ribbon.name}</h2>
                  <p className="shop-card-meta">{ribbon.size}</p>
                  <p className="shop-card-price">
                    <strong>{ribbon.price}</strong>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lightbox ? (
        <div className="sku-lightbox" role="dialog" aria-modal="true" aria-label="Product media">
          <button type="button" className="sku-lightbox-backdrop" aria-label="Close media" onClick={() => setLightbox(false)} />
          <div className="sku-lightbox-panel">
            <div className="sku-lightbox-bar">
              <div className="sku-lightbox-tabs" role="tablist" aria-label="Media type">
                <button type="button" role="tab" aria-selected={mediaTab === 'images'} className={mediaTab === 'images' ? 'is-active' : undefined} onClick={() => setMediaTab('images')}>
                  Images
                </button>
                <button type="button" role="tab" aria-selected={mediaTab === 'videos'} className={mediaTab === 'videos' ? 'is-active' : undefined} onClick={() => setMediaTab('videos')}>
                  Videos
                </button>
              </div>
              <button type="button" className="sku-lightbox-close" aria-label="Close" onClick={() => setLightbox(false)}>
                <X weight="bold" aria-hidden="true" />
              </button>
            </div>
            {mediaTab === 'images' ? (
              <>
                <figure
                  className="sku-lightbox-stage is-zoom"
                  onMouseMove={(event) => {
                    const box = event.currentTarget.getBoundingClientRect()
                    setZoom({
                      x: ((event.clientX - box.left) / box.width) * 100,
                      y: ((event.clientY - box.top) / box.height) * 100,
                    })
                  }}
                  onMouseLeave={() => setZoom(null)}
                >
                  <img
                    src={gallery[Math.min(slide, gallery.length - 1)] ?? CLASS_IMAGE}
                    alt=""
                    style={
                      zoom
                        ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: 'scale(2.35)' }
                        : undefined
                    }
                  />
                </figure>
                <ol className="sku-thumbs sku-lightbox-thumbs">
                  {gallery.map((src, index) => (
                    <li key={src}>
                      <button
                        type="button"
                        className={slide === index ? 'is-active' : undefined}
                        aria-label={`Show image ${index + 1}`}
                        aria-pressed={slide === index}
                        onClick={() => setSlide(index)}
                      >
                        <img src={src} alt="" />
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <figure className="sku-lightbox-stage is-video">
                <img src={gallery[2] ?? gallery[0]} alt="" />
                <span className="sku-video-place">
                  <Play weight="fill" aria-hidden="true" />
                  <em>Video</em>
                </span>
              </figure>
            )}
          </div>
        </div>
      ) : null}
    </article>
  )
}
