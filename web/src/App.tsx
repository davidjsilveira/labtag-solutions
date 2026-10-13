import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { SolutionPage } from '@/pages/SolutionPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="logo" to="/">
          LabTAG <span>Solutions</span>
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
