import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/ScrollToTop'
import { solutionPages } from '@/content/loadPages'
import { HomePage } from '@/pages/HomePage'
import { SolutionPage } from '@/pages/SolutionPage'

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <header className="site-header">
        <Link className="logo" to="/">
          LabTAG <span>Solutions</span>
        </Link>
        <p className="site-header-meta">{solutionPages.length} pages</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>LabTAG Solutions · labeling systems for the lab</p>
      </footer>
    </div>
  )
}
