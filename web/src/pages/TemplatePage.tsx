import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, DownloadSimple, FileArrowDown } from '@phosphor-icons/react'
import { TEMPLATE_SR1 } from '@/content/templateSr1'
import { UNIT_EVENT, readUnit, type UnitId } from '@/content/preferences'
import { resolveImageSrc } from '@/content/resolveImage'

export function TemplatePage() {
  const template = TEMPLATE_SR1
  const [unit, setUnit] = useState<UnitId>(() => readUnit())
  const [activeGallery, setActiveGallery] = useState<(typeof template.gallery)[number]['id']>(
    template.gallery[0]?.id ?? 'diagram',
  )
  const [openFaq, setOpenFaq] = useState<string | null>(template.faqs[0]?.id ?? null)
  const image = resolveImageSrc(template.image.primary, template.image.fallback)
  const size = unit === 'imperial' ? template.sizeImperial : template.sizeMetric
  const activeTone =
    template.gallery.find((item) => item.id === activeGallery)?.tone ?? 'diagram'

  useEffect(() => {
    const onUnit = (event: Event) => {
      const next = (event as CustomEvent<UnitId>).detail
      if (next === 'metric' || next === 'imperial') setUnit(next)
    }
    window.addEventListener(UNIT_EVENT, onUnit)
    return () => window.removeEventListener(UNIT_EVENT, onUnit)
  }, [])

  return (
    <article className="template-page">
      <nav className="template-breadcrumb" aria-label="Breadcrumb">
        <ol>
          {template.breadcrumbs.map((crumb, index) => {
            const last = index === template.breadcrumbs.length - 1
            const to = 'to' in crumb ? crumb.to : undefined
            const href = 'href' in crumb ? crumb.href : undefined
            return (
              <li key={crumb.label}>
                {last ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : to ? (
                  <Link to={to}>{crumb.label}</Link>
                ) : href ? (
                  <a href={href} target="_blank" rel="noreferrer">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <header className="template-hero">
        <h1>#{template.id}</h1>
        <p className="template-hero-name">{template.name}</p>
        <p className="template-hero-size">{size}</p>
      </header>

      <section className="template-showcase" aria-label="Template preview">
        <div className={['template-media-card', `is-${activeTone}`].filter(Boolean).join(' ')}>
          {template.badge ? <span className="template-badge">{template.badge}</span> : null}
          <figure className="template-media-figure">
            <img
              src={image.primary}
              alt={template.image.alt}
              width={800}
              height={800}
              onError={(event) => {
                if (image.fallback) event.currentTarget.src = image.fallback
              }}
            />
          </figure>
        </div>

        <aside className="template-buy-card" aria-label="Template download">
          <header className="template-download-head">
            <p className="template-download-title">Download #{template.id}</p>
            <p>
              {template.shape} · {size} · {template.format}
            </p>
          </header>

          <div className="template-download-panel">
            <span className="template-download-mark" aria-hidden>
              <FileArrowDown size={36} weight="duotone" />
            </span>
            <div className="template-download-copy">
              <p className="template-download-kicker">Download the template</p>
              <p>Use it in BarTender, cablabel S3, ZebraDesigner, or similar label software.</p>
            </div>
            <a
              className="btn template-download"
              href={template.downloadHref}
              target="_blank"
              rel="noreferrer"
            >
              <DownloadSimple size={20} weight="bold" aria-hidden />
              Download template
            </a>
          </div>

          <dl className="template-specs">
            {template.specs.map((row) => {
              const value =
                'valueMetric' in row
                  ? unit === 'imperial'
                    ? row.valueImperial
                    : row.valueMetric
                  : row.value
              return (
                <div key={row.label} className="template-spec-row">
                  <dt>{row.label}</dt>
                  <dd>{value}</dd>
                </div>
              )
            })}
          </dl>
        </aside>

        <div className="template-thumbs" role="listbox" aria-label="Template views">
          {template.gallery.map((item) => {
            const selected = item.id === activeGallery
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={[
                  'template-thumb',
                  `is-${item.tone}`,
                  selected ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveGallery(item.id)}
              >
                <span className="sr-only">{item.label}</span>
                {item.tone === 'diagram' ? (
                  <img src={image.primary} alt="" />
                ) : item.tone === 'more' ? (
                  <span className="template-thumb-more">+{item.moreCount ?? 0}</span>
                ) : (
                  <span className="template-thumb-swatch" aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="template-section" id="compatible-labels">
        <header className="template-section-head">
          <h2>Compatible labels</h2>
          <p>Label SKUs that share this template size, with temperature range and print method.</p>
        </header>

        <div className="template-table-wrap">
          <table className="template-compatible">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">SKU</th>
                <th scope="col">Material</th>
                <th scope="col">Colors</th>
                <th scope="col">Printing method</th>
                <th scope="col">Min temp.</th>
                <th scope="col">Max temp.</th>
                <th scope="col">Features</th>
                <th scope="col">Resistances</th>
              </tr>
            </thead>
            <tbody>
              {template.compatibleLabels.map((label) => (
                <tr key={label.sku}>
                  <td data-label="Product">{label.product}</td>
                  <td data-label="SKU">
                    <a href={label.href} target="_blank" rel="noreferrer">
                      {label.sku}
                    </a>
                  </td>
                  <td data-label="Material">{label.material}</td>
                  <td data-label="Colors">{label.colors}</td>
                  <td data-label="Printing method">{label.printingMethod}</td>
                  <td data-label="Min temp.">{label.minTemp}</td>
                  <td data-label="Max temp.">{label.maxTemp}</td>
                  <td data-label="Features">{label.features}</td>
                  <td data-label="Resistances">{label.resistances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="template-section" id="faq">
        <header className="template-section-head">
          <h2>Frequently asked questions</h2>
          <p>Quick answers for printing and matching this template to a label stock.</p>
        </header>

        <div className="template-faq-list">
          {template.faqs.map((item) => {
            const open = openFaq === item.id
            return (
              <details
                key={item.id}
                className="faq-item"
                open={open}
                onToggle={(event) => {
                  // Ignore close events fired when React clears `open` on the
                  // previously expanded row after switching to another item.
                  if (event.currentTarget.open) {
                    setOpenFaq(item.id)
                  } else if (openFaq === item.id) {
                    setOpenFaq(null)
                  }
                }}
              >
                <summary>
                  <span className="faq-item-question">{item.question}</span>
                  <CaretDown
                    className="template-faq-caret"
                    size={16}
                    weight="bold"
                    aria-hidden
                  />
                </summary>
                <div className="faq-item-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            )
          })}
        </div>
      </section>

      <aside className="template-cta block-cta">
        <div className="block-cta-copy">
          <h2>{template.cta.title}</h2>
          <p>{template.cta.body}</p>
        </div>
        <div className="block-cta-actions">
          <Link className="btn btn-on-accent" to={template.cta.primary.href}>
            {template.cta.primary.label}
          </Link>
          <Link className="btn btn-on-accent-ghost" to={template.cta.secondary.href}>
            {template.cta.secondary.label}
          </Link>
        </div>
      </aside>
    </article>
  )
}
