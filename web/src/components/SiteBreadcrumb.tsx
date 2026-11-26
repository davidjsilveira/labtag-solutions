import { Link, useLocation } from 'react-router-dom'
import { CrumbChevron } from '@/components/CrumbChevron'
import { FINDER_PATH, RESOURCES_PATH, SHOP_PATH, TEMPLATES_PATH } from '@/content/labtagLinks'
import { findLabelClass } from '@/content/labelFinder'
import { SHOP_FAMILIES, childrenOf, findShopCategory } from '@/content/shopCatalog'
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

  if (pathname === RESOURCES_PATH) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Resources' },
    ]
  }

  if (pathname === TEMPLATES_PATH) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Templates' },
    ]
  }

  if (pathname === FINDER_PATH) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Label Finder' },
    ]
  }

  if (pathname === SHOP_PATH) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Shop' },
    ]
  }

  const shopProduct = pathname.match(/^\/shop\/([^/]+)\/([^/]+)$/)
  if (shopProduct) {
    const parentSlug = decodeURIComponent(shopProduct[1])
    const leafSlug = decodeURIComponent(shopProduct[2])
    const child = childrenOf(parentSlug).find((item) => item.slug === leafSlug)
    const parent = findShopCategory(parentSlug)
    if (child) {
      return [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: SHOP_PATH },
        { label: 'Labels', to: `${SHOP_PATH}/labels` },
        { label: parent?.title ?? 'Category', to: `${SHOP_PATH}/${parentSlug}` },
        { label: child.title },
      ]
    }
    return [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: SHOP_PATH },
      { label: 'Labels', to: `${SHOP_PATH}/labels` },
      { label: parent?.title ?? 'Category', to: `${SHOP_PATH}/${parentSlug}` },
      { label: leafSlug },
    ]
  }

  const shopCategory = pathname.match(/^\/shop\/([^/]+)$/)
  if (shopCategory) {
    const slug = decodeURIComponent(shopCategory[1])
    const cat = findShopCategory(slug)
    const family = SHOP_FAMILIES.some((item) => item.slug === slug)
    return [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: SHOP_PATH },
      ...(family ? [{ label: 'Labels', to: `${SHOP_PATH}/labels` }] : []),
      { label: cat?.title ?? 'Category' },
    ]
  }

  const labelClass = pathname.match(/^\/classes\/([^/]+)$/)
  if (labelClass) {
    const row = findLabelClass(decodeURIComponent(labelClass[1]))
    return [
      { label: 'Home', to: '/' },
      { label: 'Label Finder', to: FINDER_PATH },
      { label: row ? `${row.code} - ${row.headline}` : 'Class' },
    ]
  }

  const product = pathname.match(/^\/classes\/([^/]+)\/([^/]+)$/)
  if (product) {
    const row = findLabelClass(decodeURIComponent(product[1]))
    const model = decodeURIComponent(product[2])
    return [
      { label: 'Home', to: '/' },
      { label: 'Label Finder', to: FINDER_PATH },
      { label: row ? row.code : 'Class', to: row ? `/classes/${product[1]}` : FINDER_PATH },
      { label: model },
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
  const shopLeaf = pathname.match(/^\/shop\/([^/]+)\/([^/]+)$/)
  const productPage = Boolean(
    pathname.match(/^\/classes\/[^/]+\/[^/]+$/) ||
      (shopLeaf && !childrenOf(decodeURIComponent(shopLeaf[1])).some((item) => item.slug === decodeURIComponent(shopLeaf[2]))),
  )

  return (
    <nav className={`site-breadcrumb${productPage ? ' is-product' : ''}`} aria-label="Breadcrumb">
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
