import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CaretDown, ChatCircle, DownloadSimple } from '@phosphor-icons/react'
import { TEMPLATE_PAGES, type TemplateSlug } from '@/content/templates'
import { UNIT_EVENT, readUnit, type UnitId } from '@/content/preferences'
import { resolveImageSrc } from '@/content/resolveImage'

function isTemplateSlug(slug: string): slug is TemplateSlug {
  return slug in TEMPLATE_PAGES
}

export function TemplatePage() {
  const { templateSlug = '' } = useParams()
  if (!isTemplateSlug(templateSlug)) return <Navigate to="/" replace />
  return <TemplateArticle slug={templateSlug} />
}

function TemplateArticle({ slug }: { slug: TemplateSlug }) {
  const template = TEMPLATE_PAGES[slug]
  const [unit, setUnit] = useState<UnitId>(() => readUnit())
  const [openFaq, setOpenFaq] = useState<string | null>(template.faqs[0]?.id ?? null)
  const image = resolveImageSrc(template.image.primary, template.image.fallback)
  const size = unit === 'imperial' ? template.sizeImperial : template.sizeMetric
  const formatLabel = template.category === 'A4' ? `${template.category} Sheet` : template.category

  useEffect(() => {
    const onUnit = (event: Event) => {
      const next = (event as CustomEvent<UnitId>).detail
      if (next === 'metric' || next === 'imperial') setUnit(next)
    }
    window.addEventListener(UNIT_EVENT, onUnit)
    return () => window.removeEventListener(UNIT_EVENT, onUnit)
  }, [])

  useEffect(() => {
    setOpenFaq(template.faqs[0]?.id ?? null)
  }, [template])

  return (
    <article className="template-page">
      <header className="template-hero">
        <h1>
          <span className="template-hero-title">
            {formatLabel} Template - {size} {template.shape}{' '}
            <span className="template-hero-id">#{template.id}</span>
          </span>
        </h1>
      </header>

      <section className="template-showcase" aria-label="Template preview">
        <div className="template-media-card is-diagram">
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

        <aside className="template-buy-card" aria-label="Template file">
          <div className="template-download-panel">
            <div className="template-download-copy">
              <h2 className="template-download-title">#{template.id}</h2>
              <p>{template.file.note}</p>
            </div>
            {template.file.kind === 'download' ? (
              <a
                className={
                  'logos' in template.file
                    ? 'btn template-download template-download-file'
                    : 'btn template-download'
                }
                href={template.file.href}
                target="_blank"
                rel="noreferrer"
              >
                {'logos' in template.file ? (
                  <>
                    <span className="template-download-logos">
                      {template.file.logos.map((logo) => (
                        <span key={logo.src} className="template-download-brand">
                          <img src={logo.src} alt="" width={40} height={40} />
                          <span>{logo.alt}</span>
                        </span>
                      ))}
                    </span>
                    <span className="template-download-action">
                      <DownloadSimple size={20} weight="bold" aria-hidden />
                      {template.file.label}
                    </span>
                  </>
                ) : (
                  <>
                    <DownloadSimple size={20} weight="bold" aria-hidden />
                    {template.file.label}
                  </>
                )}
              </a>
            ) : (
              <Link className="btn template-download" to={template.file.href}>
                <ChatCircle size={20} weight="bold" aria-hidden />
                {template.file.label}
              </Link>
            )}
            <a className="template-compatible-btn" href="#compatible-labels">
              Compatible labels
              <ArrowRight size={16} weight="bold" aria-hidden />
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
                  if (event.currentTarget.open) {
                    setOpenFaq(item.id)
                  } else if (openFaq === item.id) {
                    setOpenFaq(null)
                  }
                }}
              >
                <summary>
                  <span className="faq-item-question">{item.question}</span>
                  <CaretDown className="template-faq-caret" size={16} weight="bold" aria-hidden />
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
