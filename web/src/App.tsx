import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ScrollToTop } from '@/ScrollToTop'
import { ScrollToTopButton } from '@/ScrollToTopButton'
import { getPage } from '@/content/loadPages'
import { HomePage } from '@/pages/HomePage'
import { RequestFormPage } from '@/pages/RequestFormPage'
import { SolutionPage } from '@/pages/SolutionPage'

const LEGACY_CATEGORY_IDS = new Set(['use-cases', 'features', 'services'])

/** Old `/solutions/:category/:slug` URLs redirect to `/solutions/:slug`. */
function LegacyCategorySolutionRedirect() {
  const { slug = '' } = useParams()
  if (getPage(slug)) {
    return <Navigate to={`/solutions/${slug}`} replace />
  }
  return <Navigate to="/" replace />
}

/** `/solutions/:slug` — solution pages, or redirect away from old category indexes. */
function SolutionsSlugRoute() {
  const { slug = '' } = useParams()

  if (LEGACY_CATEGORY_IDS.has(slug)) {
    return <Navigate to="/" replace />
  }

  return <SolutionPage />
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
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions/:slug" element={<SolutionsSlugRoute />} />
          <Route
            path="/solutions/:categoryId/:slug"
            element={<LegacyCategorySolutionRedirect />}
          />
          <Route path="/request/:formSlug" element={<RequestFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
