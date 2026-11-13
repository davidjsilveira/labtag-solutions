import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { SiteBreadcrumb } from '@/components/SiteBreadcrumb'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { ScrollToTop } from '@/ScrollToTop'
import { ScrollToTopButton } from '@/ScrollToTopButton'
import { canonicalSolutionPath } from '@/content/liveCatalog'
import { getPage } from '@/content/loadPages'
import {
  ABOUT_PATH,
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  HELP_PATH,
  TAGI_PATH,
  QUOTE_PATH,
  RESELLER_PATH,
  SAMPLE_PATH,
  TEMPLATES_PATH,
  WHY_CHOOSE_PATH,
} from '@/content/labtagLinks'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { HelpPage } from '@/pages/HelpPage'
import { TagiPage } from '@/pages/TagiPage'
import { CustomLabelsPage } from '@/pages/CustomLabelsPage'
import { HomePage } from '@/pages/HomePage'
import { QuotePage } from '@/pages/QuotePage'
import { ResellerPage } from '@/pages/ResellerPage'
import { RequestFormPage } from '@/pages/RequestFormPage'
import { SamplesPage } from '@/pages/SamplesPage'
import { WhyChoosePage } from '@/pages/WhyChoosePage'
import { SolutionPage } from '@/pages/SolutionPage'
import { TemplatePage } from '@/pages/TemplatePage'
import { TemplatesIndexPage } from '@/pages/TemplatesIndexPage'
import { TEMPLATE_SR28_PATH } from '@/content/templateSr28'

const LEGACY_CATEGORY_IDS = new Set(['use-cases', 'features', 'services'])

/** Old `/solutions/:category/:slug` URLs redirect to `/solutions/:slug`. */
function LegacyCategorySolutionRedirect() {
  const { slug = '' } = useParams()
  const canonical = canonicalSolutionPath(slug)
  if (canonical) return <Navigate to={canonical} replace />
  if (getPage(slug)) return <Navigate to={`/solutions/${slug}`} replace />
  return <Navigate to="/" replace />
}

/** `/solutions/:slug` — solution pages, or redirect away from old category indexes. */
function SolutionsSlugRoute() {
  const { slug = '' } = useParams()

  if (LEGACY_CATEGORY_IDS.has(slug)) {
    return <Navigate to="/" replace />
  }

  const canonical = canonicalSolutionPath(slug)
  if (canonical && canonical !== `/solutions/${slug}`) {
    return <Navigate to={canonical} replace />
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
      <span className="site-header-pin" aria-hidden="true" />
      <header className="site-header">
        <SiteNav />
        <SiteBreadcrumb />
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
          <Route path={HELP_PATH} element={<HelpPage />} />
          <Route path={TAGI_PATH} element={<TagiPage />} />
          <Route path={TEMPLATES_PATH} element={<TemplatesIndexPage />} />
          <Route path="/templates/sr-1" element={<Navigate to={TEMPLATE_SR28_PATH} replace />} />
          <Route path="/templates/:templateSlug" element={<TemplatePage />} />
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
