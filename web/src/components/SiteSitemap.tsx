import { Link } from 'react-router-dom'
import { getPage } from '@/content/loadPages'
import { solutionCategories } from '@/content/categories'

/** Compact site map used in the footer. */
export function SiteSitemap() {
  return (
    <nav className="site-sitemap" aria-label="Sitemap">
      <div className="site-sitemap-col">
        <Link to="/" className="site-sitemap-heading">
          Home
        </Link>
      </div>
      {solutionCategories.map((category) => (
        <div key={category.id} className="site-sitemap-col">
          <Link to={`/solutions/${category.id}`} className="site-sitemap-heading">
            {category.label}
          </Link>
          <ul>
            {category.slugs.map((slug) => {
              const page = getPage(slug)
              if (!page) return null
              return (
                <li key={slug}>
                  <Link to={`/solutions/${category.id}/${slug}`}>{page.title}</Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
