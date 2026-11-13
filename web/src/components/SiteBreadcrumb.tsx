import { Link, useLocation } from 'react-router-dom'
import { CrumbChevron } from '@/components/CrumbChevron'
import { TEMPLATES_PATH } from '@/content/labtagLinks'
import { getPage } from '@/content/loadPages'
import { TEMPLATE_PAGES } from '@/content/templates'

type Crumb = {
  label: string
  to?: string
}

function crumbsForPath(pathname: string): Crumb[] {
  const solution = pathname.match(/^\/solutions\/([^/]+)$/)
  if (solution) {
    const page = getPage(solution[1])
    if (!page) return []
    return [
      { label: 'Home', to: '/' },
      { label: page.title },
    ]
  }

  const request = pathname.match(/^\/request\/([^/]+)$/)
  if (request) {
    const page = getPage(request[1])
    return [
      { label: 'Home', to: '/' },
      ...(page ? [{ label: page.title, to: `/solutions/${page.slug}` }] : []),
      { label: 'Request' },
    ]
  }

  if (pathname === TEMPLATES_PATH) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Templates' },
    ]
  }

  const template = pathname.match(/^\/templates\/([^/]+)$/)
  if (template && template[1] in TEMPLATE_PAGES) {
    return TEMPLATE_PAGES[template[1] as keyof typeof TEMPLATE_PAGES].breadcrumbs.map((crumb) => ({
      label: crumb.label,
      to: 'to' in crumb ? crumb.to : undefined,
    }))
  }

  return []
}

/** Page trail sitting in a bar directly under the main navigation. */
export function SiteBreadcrumb() {
  const { pathname } = useLocation()
  const crumbs = crumbsForPath(pathname)
  if (crumbs.length < 2) return null

  return (
    <nav className="site-breadcrumb" aria-label="Breadcrumb">
      <ol className="site-breadcrumb-list">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li key={`${crumb.label}-${index}`}>
              {last || !crumb.to ? (
                <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
              ) : (
                <Link to={crumb.to}>{crumb.label}</Link>
              )}
              {last ? null : <CrumbChevron />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
