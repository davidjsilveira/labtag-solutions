import { Link } from 'react-router-dom'
import { TEMPLATES_PATH } from '@/content/labtagLinks'
import { TEMPLATE_PAGES } from '@/content/templates'
import { resolveImageSrc } from '@/content/resolveImage'

const templates = Object.values(TEMPLATE_PAGES)

function titleFor(template: (typeof templates)[number]) {
  const format = template.category === 'A4' ? `${template.category} Sheet` : template.category
  return `${format} Template - ${template.sizeMetric} ${template.shape}`
}

export function TemplatesIndexPage() {
  return (
    <article className="template-index">
      <header className="template-index-head">
        <h1>Label templates</h1>
        <p>Open a template to download the file or request one for your printer.</p>
      </header>

      <ul className="template-index-list">
        {templates.map((template) => {
          const image = resolveImageSrc(template.image.primary, template.image.fallback)
          return (
            <li key={template.slug}>
              <Link className="template-index-card" to={`${TEMPLATES_PATH}/${template.slug}`}>
                <img src={image.primary} alt="" width={800} height={800} />
                <span className="template-index-copy">
                  <span className="template-index-id">#{template.id}</span>
                  <span className="template-index-title">{titleFor(template)}</span>
                  <span className="template-index-action">{template.file.label}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
