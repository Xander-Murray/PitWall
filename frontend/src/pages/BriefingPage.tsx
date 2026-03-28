import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AnalyzeResponse, RepairItem, VehicleContext } from '../lib/api'

type Urgency = 'pit_now' | 'next_lap' | 'monitor' | 'unclear'
type Risk = 'low' | 'medium' | 'high'

const URGENCY_LABELS: Record<Urgency, string> = {
  pit_now: 'PIT NOW',
  next_lap: 'NEXT LAP',
  monitor: 'MONITOR',
  unclear: 'UNCLEAR',
}

const URGENCY_CLASSES: Record<Urgency, { text: string; border: string; bg: string }> = {
  pit_now:   { text: 'urgency-pit-now',   border: 'urgency-border-pit-now',   bg: 'urgency-bg-pit-now' },
  next_lap:  { text: 'urgency-next-lap',  border: 'urgency-border-next-lap',  bg: 'urgency-bg-next-lap' },
  monitor:   { text: 'urgency-monitor',   border: 'urgency-border-monitor',   bg: 'urgency-bg-monitor' },
  unclear:   { text: 'urgency-unclear',   border: 'urgency-border-unclear',   bg: 'urgency-bg-unclear' },
}

const RISK_LABEL: Record<Risk, string> = {
  low: 'LOW RISK',
  medium: 'MEDIUM RISK',
  high: 'HIGH RISK',
}

const RISK_CLASSES: Record<Risk, string> = {
  low: 'text-[#00D2BE] border-[#00D2BE]/40 bg-[#00D2BE]/10',
  medium: 'text-[#FFF200] border-[#FFF200]/40 bg-[#FFF200]/10',
  high: 'text-[#FF1801] border-[#FF1801]/40 bg-[#FF1801]/10',
}

export default function BriefingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { result: AnalyzeResponse; quoteText?: string; vehicle?: VehicleContext } | null

  if (!state?.result) {
    navigate('/pit-check', { replace: true })
    return null
  }

  const { result, vehicle } = state

  const vehicleLabel = [vehicle?.year, vehicle?.make, vehicle?.model]
    .filter(Boolean).join(' ') || null

  return (
    <div className="min-h-screen carbon-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#0d0d0d]/95 backdrop-blur">
        <div>
          <span className="font-mono text-accent text-sm font-bold tracking-widest">PITWALL</span>
          {vehicleLabel && (
            <span className="ml-3 font-mono text-xs text-text-secondary">{vehicleLabel}</span>
          )}
        </div>
        <button
          onClick={() => navigate('/pit-check')}
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors tracking-wider uppercase border border-[#2a2a2a] hover:border-accent rounded px-3 py-1.5"
        >
          New Check
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="fade-in-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-text-secondary tracking-widest uppercase mb-1">Pit-Wall Briefing</div>
            <h1 className="font-sans font-bold text-2xl text-text-primary">Race Engineer Analysis</h1>
          </div>
          {/* Overall risk badge */}
          <div className={`inline-flex items-center gap-2 border rounded px-4 py-2 font-mono text-sm font-bold tracking-widest ${RISK_CLASSES[result.overall_risk]}`}>
            <div className="w-2 h-2 rounded-full bg-current" />
            {RISK_LABEL[result.overall_risk]}
            <span className="text-xs opacity-70 ml-1">/ {URGENCY_LABELS[result.race_status]}</span>
          </div>
        </div>

        {/* Team Radio Summary */}
        <section className="fade-in-2 border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-[#141414] border-b border-[#2a2a2a] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase">Team Radio Summary</span>
          </div>
          <div className="px-5 py-4 bg-[#141414]">
            <p className="text-text-primary font-sans text-sm leading-relaxed">{result.summary}</p>
          </div>
        </section>

        {/* Repair Items Grid */}
        <section className="fade-in-3">
          <div className="font-mono text-xs text-text-secondary tracking-widest uppercase mb-3">
            Repair Items -- {result.repair_items.length} identified
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.repair_items.map((item, i) => (
              <RepairItemCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* Questions + Script row */}
        <div className="fade-in-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <QuestionsCard questions={result.questions_for_the_garage} />
          <ScriptCard script={result.what_to_say_next} />
        </div>

        {/* Confidence Notes */}
        {result.confidence_notes.length > 0 && (
          <section className="fade-in-5 border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-[#141414] border-b border-[#2a2a2a]">
              <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">Confidence Notes</span>
            </div>
            <div className="px-5 py-4 bg-[#141414] space-y-2">
              {result.confidence_notes.map((note, i) => (
                <p key={i} className="text-text-secondary font-sans text-xs leading-relaxed flex gap-2">
                  <span className="text-[#3a3a3a] font-mono shrink-0">--</span>
                  {note}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Action bar */}
        <div className="fade-in-5 flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          <button
            onClick={() => navigate('/pit-check')}
            className="flex-1 py-3 border border-[#2a2a2a] text-text-primary font-sans font-bold text-sm tracking-wider uppercase rounded hover:border-accent hover:text-accent transition-all"
          >
            Run Another Check
          </button>
          <button
            onClick={() => navigate('/pit-check?mode=demo')}
            className="flex-1 py-3 bg-accent text-[#0d0d0d] font-sans font-bold text-sm tracking-wider uppercase rounded hover:bg-accent/90 transition-all teal-glow"
          >
            Try Demo Scenario
          </button>
        </div>
      </main>
    </div>
  )
}

// -- RepairItemCard -----------------------------------------------------------

function RepairItemCard({ item, index }: { item: RepairItem; index: number }) {
  const uc = URGENCY_CLASSES[item.urgency]
  const stagger = `fade-in-${Math.min(index + 1, 5)}`

  return (
    <div className={`${stagger} border border-[#2a2a2a] rounded-lg overflow-hidden flex`}>
      {/* Left urgency bar */}
      <div className={`w-1 shrink-0 ${uc.border} border-l-2 border-y-0 border-r-0`} />
      <div className="flex-1 p-4 bg-[#141414]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-sans font-semibold text-text-primary text-sm leading-tight">{item.name}</span>
          <span className={`font-mono text-xs font-bold tracking-widest shrink-0 px-2 py-0.5 rounded border ${uc.text} ${uc.border} ${uc.bg}`}>
            {URGENCY_LABELS[item.urgency]}
          </span>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">{item.reason}</p>
        <div className="flex items-center gap-3">
          {item.verify_flag && (
            <span className="font-mono text-xs text-[#FFF200] border border-[#FFF200]/30 bg-[#FFF200]/10 px-2 py-0.5 rounded">
              VERIFY
            </span>
          )}
          <span className={`font-mono text-xs ${
            item.confidence === 'high' ? 'text-[#00D2BE]' :
            item.confidence === 'medium' ? 'text-[#9ca3af]' : 'text-[#6B7280]'
          }`}>
            {item.confidence.toUpperCase()} CONFIDENCE
          </span>
        </div>
      </div>
    </div>
  )
}

// -- QuestionsCard ------------------------------------------------------------

function QuestionsCard({ questions }: { questions: string[] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-[#141414] border-b border-[#2a2a2a] flex items-center justify-between">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">Questions for the Garage</span>
        <button
          onClick={handleCopy}
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="px-5 py-4 bg-[#141414] space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="flex gap-3">
            <span className="font-mono text-xs text-accent shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-text-primary font-sans text-sm leading-relaxed">{q}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// -- ScriptCard ---------------------------------------------------------------

function ScriptCard({ script }: { script: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-[#141414] border-b border-[#2a2a2a] flex items-center justify-between">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">What to Say Next</span>
        <button
          onClick={handleCopy}
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="px-5 py-4 bg-[#141414]">
        <p className="font-mono text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{script}</p>
      </div>
    </div>
  )
}
