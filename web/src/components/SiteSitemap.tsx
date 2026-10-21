import { Link } from 'react-router-dom'
import { pagesForBrowseAll } from '@/content/categories'

/** Compact site map used in the footer. */
export function SiteSitemap() {
  const pages = pagesForBrowseAll()

  return (
    <nav className="site-sitemap" aria-label="Sitemap">
      <div className="site-sitemap-col">
        <Link to="/" className="site-sitemap-heading">
          Home
        </Link>
        <Link to="/#new-articles" className="site-sitemap-heading">
          New articles
        </Link>
        <Link to="/#archive" className="site-sitemap-heading">
          Archive
        </Link>
      </div>
      <div className="site-sitemap-col site-sitemap-pages">
        <p className="site-sitemap-heading">Solutions</p>
        <ul>
          {pages.map((page) => (
            <li key={page.slug}>
              <Link to={`/solutions/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
