import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../lib/api'

export default function LandingPage() {
  const navigate = useNavigate()
  const [pitCount, setPitCount] = useState<number | null>(null)

  useEffect(() => {
    getStats().then(s => setPitCount(s.count)).catch(() => setPitCount(null))
  }, [])

  return (
    <div className="min-h-screen carbon-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-accent text-xl font-bold tracking-widest">PITWALL</span>
          <span className="hidden sm:block text-text-secondary text-xs font-mono tracking-wider uppercase border-l border-[#2a2a2a] pl-3">Repair Decision Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          {pitCount !== null && (
            <span className="text-xs font-mono text-text-secondary border border-[#2a2a2a] rounded px-2 py-1">
              <span className="text-accent">{pitCount.toLocaleString()}</span> pit checks run
            </span>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Race status strip */}
        <div className="fade-in-1 flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs text-accent tracking-widest uppercase">Race Engineer Online</span>
        </div>

        {/* Main headline */}
        <h1 className="fade-in-2 font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight max-w-3xl mb-6">
          Repair advice under pressure?{' '}
          <span className="text-accent">Bring in your pit wall.</span>
        </h1>

        {/* Subtext */}
        <p className="fade-in-3 text-text-secondary text-lg max-w-xl mb-10 leading-relaxed">
          PitWall translates mechanic quotes into clear priorities — what needs fixing now, what can wait, and what to ask before you approve anything.
        </p>

        {/* CTAs */}
        <div className="fade-in-4 flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => navigate('/pit-check')}
            className="px-8 py-3 bg-accent text-[#0d0d0d] font-sans font-bold text-sm tracking-wider uppercase rounded hover:bg-accent/90 transition-all teal-glow"
          >
            Start a Pit Check
          </button>
          <button
            onClick={() => navigate('/pit-check?mode=demo')}
            className="px-8 py-3 border border-[#2a2a2a] text-text-primary font-sans font-bold text-sm tracking-wider uppercase rounded hover:border-accent hover:text-accent transition-all"
          >
            Try Demo Scenario
          </button>
        </div>

        {/* How it works strip */}
        <div className="fade-in-5 w-full max-w-3xl border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="px-6 py-3 border-b border-[#2a2a2a] bg-[#141414]">
            <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">How It Works</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2a2a2a]">
            {[
              { step: '01', label: 'Bring in your quote', desc: 'Paste mechanic notes or pick a demo scenario.' },
              { step: '02', label: 'Pit wall analyzes', desc: 'AI classifies urgency and flags items to verify.' },
              { step: '03', label: 'Drive away confident', desc: 'Get questions to ask and a script for what to say.' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="p-6 bg-[#141414]">
                <div className="font-mono text-accent text-xs tracking-widest mb-2">{step}</div>
                <div className="font-sans font-semibold text-text-primary text-sm mb-1">{label}</div>
                <div className="text-text-secondary text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#2a2a2a] flex items-center justify-between">
        <span className="font-mono text-xs text-text-secondary">PITWALL -- CodeQuantum 2026</span>
        <span className="font-mono text-xs text-[#3a3a3a]">F1-INSPIRED REPAIR COPILOT</span>
      </footer>
    </div>
  )
}
