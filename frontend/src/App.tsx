import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PitCheckPage from './pages/PitCheckPage'

function Briefing() {
  return <div className="min-h-screen carbon-bg flex items-center justify-center text-text-primary font-sans">Briefing Page</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pit-check" element={<PitCheckPage />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
