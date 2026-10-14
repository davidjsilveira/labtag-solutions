import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ScrollToTop } from '@/ScrollToTop'
import { ScrollToTopButton } from '@/ScrollToTopButton'
import { SiteSitemap } from '@/components/SiteSitemap'
import {
  getCategory,
  getCategoryForSlug,
  solutionCategories,
} from '@/content/categories'
import { getPage, solutionPages } from '@/content/loadPages'
import { CategoryPage } from '@/pages/CategoryPage'
import { HomePage } from '@/pages/HomePage'
import { SolutionPage } from '@/pages/SolutionPage'

/** `/solutions/:segment` is either a category index or a legacy flat solution URL. */
function SolutionsSegment() {
  const { segment = '' } = useParams()

  if (getCategory(segment)) {
    return <CategoryPage categoryId={segment} />
  }

  const category = getCategoryForSlug(segment)
  if (category && getPage(segment)) {
    return <Navigate to={`/solutions/${category.id}/${segment}`} replace />
  }

  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <ScrollToTopButton />
      <header className="site-header">
        <Link className="logo" to="/">
          LabTAG <span>Solutions</span>
        </Link>
        <nav className="site-nav" aria-label="Solution categories">
          {solutionCategories.map((category) => (
            <Link key={category.id} to={`/solutions/${category.id}`}>
              {category.label}
            </Link>
          ))}
        </nav>
        <p className="site-header-meta">{solutionPages.length} pages</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions/:categoryId/:slug" element={<SolutionPage />} />
          <Route path="/solutions/:segment" element={<SolutionsSegment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>LabTAG Solutions · labeling systems for the lab</p>
        <SiteSitemap />
      </footer>
    </div>
  )
}
