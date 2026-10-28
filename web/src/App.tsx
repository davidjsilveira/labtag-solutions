import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { ScrollToTop } from '@/ScrollToTop'
import { ScrollToTopButton } from '@/ScrollToTopButton'
import { getPage } from '@/content/loadPages'
import {
  ABOUT_PATH,
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  QUOTE_PATH,
  RESELLER_PATH,
  SAMPLE_PATH,
  WHY_CHOOSE_PATH,
} from '@/content/labtagLinks'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { CustomLabelsPage } from '@/pages/CustomLabelsPage'
import { HomePage } from '@/pages/HomePage'
import { QuotePage } from '@/pages/QuotePage'
import { ResellerPage } from '@/pages/ResellerPage'
import { RequestFormPage } from '@/pages/RequestFormPage'
import { SamplesPage } from '@/pages/SamplesPage'
import { WhyChoosePage } from '@/pages/WhyChoosePage'
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
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <ScrollToTop />
      <ScrollToTopButton />
      <header className="site-header">
        <SiteNav />
      </header>
      <main id="content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={ABOUT_PATH} element={<AboutPage />} />
          <Route path={WHY_CHOOSE_PATH} element={<WhyChoosePage />} />
          <Route path={SAMPLE_PATH} element={<SamplesPage />} />
          <Route path="/samples/vertical" element={<Navigate to={SAMPLE_PATH} replace />} />
          <Route path={QUOTE_PATH} element={<QuotePage />} />
          <Route path={CUSTOM_LABELS_PATH} element={<CustomLabelsPage />} />
          <Route path={RESELLER_PATH} element={<ResellerPage />} />
          <Route path={CONTACT_PATH} element={<ContactPage />} />
          <Route path="/solutions/:slug" element={<SolutionsSlugRoute />} />
          <Route
            path="/solutions/:categoryId/:slug"
            element={<LegacyCategorySolutionRedirect />}
          />
          <Route path="/request/:formSlug" element={<RequestFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
