import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  AnalyzeResponse, RepairItem, VehicleContext,
  getSharedBriefing, getCommunityStats, submitOutcomes,
  CommunityStats, OutcomeItem,
} from '../lib/api'

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

type OutcomeState = { approved: boolean | null; price: string }

export default function BriefingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()

  const locationState = location.state as { result: AnalyzeResponse; quoteText?: string; vehicle?: VehicleContext } | null

  const [result, setResult] = useState<AnalyzeResponse | null>(locationState?.result ?? null)
  const [vehicle, setVehicle] = useState<VehicleContext | undefined>(locationState?.vehicle)
  const [loading, setLoading] = useState(!!id && !locationState?.result)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const isSharedView = !!id

  // Community stats state
  const [communityStats, setCommunityStats] = useState<CommunityStats>({})

  // Outcome reporting state — initialised after result is known
  const [outcomeItems, setOutcomeItems] = useState<Record<string, OutcomeState>>({})
  const [outcomesSubmitted, setOutcomesSubmitted] = useState(false)
  const [outcomesLoading, setOutcomesLoading] = useState(false)

  useEffect(() => {
    if (id && !locationState?.result) {
      setLoading(true)
      getSharedBriefing(id)
        .then(data => {
          setResult(data.result)
          setVehicle(data.vehicle_context ?? undefined)
        })
        .catch(err => setFetchError(err instanceof Error ? err.message : 'Failed to load briefing.'))
        .finally(() => setLoading(false))
    }
  }, [id])

  // Fetch community stats once result is available
  useEffect(() => {
    if (!result) return
    const names = result.repair_items.map(i => i.name.toLowerCase().trim())
    getCommunityStats(names).then(setCommunityStats).catch(() => {})
    // Init outcome items
    setOutcomeItems(
      Object.fromEntries(result.repair_items.map(i => [i.name, { approved: null, price: '' }]))
    )
  }, [result])

  // Loading state for shared briefing fetch
  if (loading) {
    return (
      <div className="min-h-screen carbon-bg flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3 animate-pulse">Loading Briefing</div>
          <div className="font-mono text-silver/40 text-xs">Retrieving analysis from pit wall...</div>
        </div>
      </div>
    )
  }

  // Error state for failed shared briefing fetch
  if (fetchError) {
    return (
      <div className="min-h-screen carbon-bg flex items-center justify-center px-6">
        <div className="border border-pit-now/40 rounded-lg p-8 max-w-md text-center">
          <div className="font-mono text-xs text-pit-now tracking-widest uppercase mb-3">Briefing Not Found</div>
          <p className="text-text-secondary text-sm mb-6">{fetchError}</p>
          <button onClick={() => navigate('/pit-check')} className="px-5 py-2 bg-accent text-[#0d0d0d] font-sans font-bold text-sm tracking-wider uppercase rounded">
            Run a New Check
          </button>
        </div>
      </div>
    )
  }

  if (!result) {
    navigate('/pit-check', { replace: true })
    return null
  }

  const vehicleLabel = [vehicle?.year, vehicle?.make, vehicle?.model]
    .filter(Boolean).join(' ') || null

  const evidencedCount = result.repair_items.filter(i => i.urgency === 'pit_now' || i.urgency === 'next_lap').length
  const unclearCount = result.repair_items.filter(i => i.urgency === 'unclear').length
  const verifyCount = result.repair_items.filter(i => i.verify_flag).length

  const canSubmitOutcomes = Object.values(outcomeItems).some(v => v.approved !== null)

  const handleSubmitOutcomes = async () => {
    setOutcomesLoading(true)
    const items: OutcomeItem[] = Object.entries(outcomeItems)
      .filter(([, v]) => v.approved !== null)
      .map(([name, v]) => ({
        repair_name: name,
        approved: v.approved!,
        actual_price_paid: v.approved && v.price ? parseFloat(v.price) : undefined,
      }))
    await submitOutcomes(result.briefing_id, vehicle, items).catch(() => {})
    setOutcomesSubmitted(true)
    setOutcomesLoading(false)
  }

  return (
    <div className="min-h-screen carbon-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-silver/10 bg-[#0d0d0d]/95 backdrop-blur">
        <div>
          <button onClick={() => navigate('/')} className="font-mono text-accent text-sm font-bold tracking-widest hover:opacity-80 transition-opacity">PITWALL</button>
          {vehicleLabel && (
            <span className="ml-3 font-mono text-xs text-silver/50">{vehicleLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {result.briefing_id && <ShareButton briefingId={result.briefing_id} />}
          <button
            onClick={() => navigate('/pit-check')}
            className="font-mono text-xs text-silver/50 hover:text-silver transition-colors tracking-wider uppercase border border-silver/15 hover:border-silver/40 rounded px-3 py-1.5"
          >
            New Check
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="fade-in-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-silver/50 tracking-widest uppercase mb-1">
              {isSharedView ? 'Shared Analysis' : 'Pit-Wall Briefing'}
            </div>
            <h1 className="font-sans font-bold text-2xl text-text-primary">Race Engineer Analysis</h1>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className={`inline-flex items-center gap-2 border rounded px-4 py-2 font-mono text-sm font-bold tracking-widest ${RISK_CLASSES[result.overall_risk]}`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              {RISK_LABEL[result.overall_risk]}
              <span className="text-xs opacity-70 ml-1">/ {URGENCY_LABELS[result.race_status]}</span>
            </div>
            {result.repair_items.length > 0 && (
              <div className="font-mono text-xs text-silver/45 tracking-wide">
                {evidencedCount > 0 && <span>{evidencedCount} evidenced</span>}
                {evidencedCount > 0 && unclearCount > 0 && <span> · </span>}
                {unclearCount > 0 && <span>{unclearCount} unclear</span>}
                {verifyCount > 0 && <span> · {verifyCount} verify flag{verifyCount > 1 ? 's' : ''}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Team Radio Summary */}
        <section className="fade-in-2 border border-silver/10 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-[#141414] border-b border-silver/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase">Team Radio Summary</span>
          </div>
          <div className="px-5 py-4 bg-[#141414]">
            <p className="text-text-primary font-sans text-sm leading-relaxed">{result.summary}</p>
          </div>
        </section>

        {/* Repair Items Grid */}
        <section className="fade-in-3">
          <div className="font-mono text-xs text-silver/50 tracking-widest uppercase mb-3">
            Repair Items -- {result.repair_items.length} identified
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.repair_items.map((item, i) => (
              <RepairItemCard
                key={i}
                item={item}
                index={i}
                communityStats={communityStats}
              />
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
          <section className="fade-in-5 border border-silver/10 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-[#141414] border-b border-silver/10">
              <span className="font-mono text-xs text-silver/50 tracking-widest uppercase">Confidence Notes</span>
            </div>
            <div className="px-5 py-4 bg-[#141414] space-y-2">
              {result.confidence_notes.map((note, i) => (
                <p key={i} className="text-text-secondary font-sans text-xs leading-relaxed flex gap-2">
                  <span className="text-silver/25 font-mono shrink-0">--</span>
                  {note}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* How did it go? — outcome reporting */}
        {result.briefing_id && result.repair_items.length > 0 && (
          <section className="fade-in-5 border border-silver/10 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-[#141414] border-b border-silver/10">
              <span className="font-mono text-xs text-silver/50 tracking-widest uppercase">How Did It Go?</span>
              {!outcomesSubmitted && (
                <p className="text-text-secondary font-sans text-xs mt-1">
                  Help the next driver — report what you actually paid.
                </p>
              )}
            </div>
            <div className="px-5 py-4 bg-[#141414]">
              {outcomesSubmitted ? (
                <p className="font-mono text-xs text-silver/45 tracking-wide">
                  Thanks for reporting. Your data helps the next driver.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.repair_items.map((item) => {
                    const state = outcomeItems[item.name] ?? { approved: null, price: '' }
                    return (
                      <div key={item.name} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-sans text-sm text-text-primary flex-1 min-w-0 truncate">{item.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setOutcomeItems(prev => ({ ...prev, [item.name]: { ...state, approved: true } }))}
                            className={`font-mono text-xs px-3 py-1 rounded border transition-all ${
                              state.approved === true
                                ? 'border-[#00D2BE] text-[#00D2BE] bg-[#00D2BE]/10'
                                : 'border-silver/15 text-silver/40 hover:border-silver/40 hover:text-silver/70'
                            }`}
                          >
                            APPROVED
                          </button>
                          <button
                            onClick={() => setOutcomeItems(prev => ({ ...prev, [item.name]: { approved: false, price: '' } }))}
                            className={`font-mono text-xs px-3 py-1 rounded border transition-all ${
                              state.approved === false
                                ? 'border-[#FF1801] text-[#FF1801] bg-[#FF1801]/10'
                                : 'border-silver/15 text-silver/40 hover:border-silver/40 hover:text-silver/70'
                            }`}
                          >
                            DECLINED
                          </button>
                          {state.approved === true && (
                            <input
                              type="number"
                              placeholder="$ paid"
                              value={state.price}
                              onChange={e => setOutcomeItems(prev => ({ ...prev, [item.name]: { ...state, price: e.target.value } }))}
                              className="w-24 bg-[#0d0d0d] border border-silver/15 rounded px-2 py-1 text-text-primary font-mono text-xs placeholder:text-silver/25 focus:outline-none focus:border-accent transition-colors"
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <div className="pt-2">
                    <button
                      onClick={handleSubmitOutcomes}
                      disabled={!canSubmitOutcomes || outcomesLoading}
                      className="px-5 py-2 bg-accent text-[#0d0d0d] font-sans font-bold text-xs tracking-wider uppercase rounded hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all teal-glow"
                    >
                      {outcomesLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Action bar */}
        <div className="fade-in-5 flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          <button
            onClick={() => navigate('/pit-check')}
            className="flex-1 py-3 border border-silver/15 text-silver/70 font-sans font-bold text-sm tracking-wider uppercase rounded hover:border-silver/40 hover:text-silver transition-all"
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

// -- ShareButton --------------------------------------------------------------

function ShareButton({ briefingId }: { briefingId: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/briefing/${briefingId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleShare}
      className="font-mono text-xs text-silver/50 hover:text-silver transition-colors tracking-wider uppercase border border-silver/15 hover:border-silver/40 rounded px-3 py-1.5"
    >
      {copied ? 'COPIED!' : 'SHARE'}
    </button>
  )
}

// -- RepairItemCard -----------------------------------------------------------

function RepairItemCard({
  item,
  index,
  communityStats,
}: {
  item: RepairItem
  index: number
  communityStats: CommunityStats
}) {
  const uc = URGENCY_CLASSES[item.urgency]
  const stagger = `fade-in-${Math.min(index + 1, 5)}`

  const stats = communityStats[item.name.toLowerCase().trim()]
  const communityLine = stats && stats.total >= 3
    ? `${stats.approved} of ${stats.total} drivers approved this${stats.avg_paid ? ` · avg paid $${stats.avg_paid}` : ''}`
    : null

  return (
    <div className={`${stagger} border border-silver/10 rounded-lg overflow-hidden flex`}>
      {/* Left urgency bar */}
      <div className="w-1 shrink-0" style={{ backgroundColor:
        item.urgency === 'pit_now' ? '#FF1801' :
        item.urgency === 'next_lap' ? '#FFF200' :
        item.urgency === 'monitor' ? '#00D2BE' : '#6B7280'
      }} />
      <div className="flex-1 p-4 bg-[#141414]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-sans font-semibold text-text-primary text-sm leading-tight">{item.name}</span>
          <span className={`font-mono text-xs font-bold tracking-widest shrink-0 px-2 py-0.5 rounded border ${uc.text} ${uc.border} ${uc.bg}`}>
            {URGENCY_LABELS[item.urgency]}
          </span>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{item.reason}</p>
        {item.price_range && (
          <p className="font-mono text-xs text-silver/50 mb-2">{item.price_range}</p>
        )}
        {communityLine && (
          <p className="font-mono text-xs text-silver/45 mb-2">{communityLine}</p>
        )}
        <div className="flex items-center gap-3">
          {item.verify_flag && (
            <span className="font-mono text-xs text-[#FFF200] border border-[#FFF200]/30 bg-[#FFF200]/10 px-2 py-0.5 rounded">
              VERIFY
            </span>
          )}
          <span className={`font-mono text-xs ${
            item.confidence === 'high' ? 'text-silver/70' :
            item.confidence === 'medium' ? 'text-silver/45' : 'text-silver/25'
          }`}>
            {item.confidence.toUpperCase()} CONFIDENCE
          </span>
          <div className="ml-auto w-8 h-1 rounded" style={{ backgroundColor:
            item.urgency === 'pit_now' ? '#FF1801' :
            item.urgency === 'next_lap' ? '#FFF200' :
            item.urgency === 'monitor' ? '#00D2BE' : '#6B7280',
            opacity: 0.4
          }} />
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
    <div className="border border-silver/10 rounded-lg overflow-hidden flex flex-col">
      <div className="px-5 py-3 bg-[#141414] border-b border-silver/10 flex items-center justify-between">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">Questions for the Garage</span>
        <button
          onClick={handleCopy}
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="px-5 py-4 bg-[#141414] flex-1 space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="flex gap-3">
            <span className="font-mono text-xs text-silver/55 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
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
    <div className="border border-silver/10 rounded-lg overflow-hidden flex flex-col">
      <div className="px-5 py-3 bg-[#141414] border-b border-silver/10 flex items-center justify-between">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">What to Say Next</span>
        <button
          onClick={handleCopy}
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="px-5 py-4 bg-[#141414] flex-1">
        <p className="font-mono text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{script}</p>
      </div>
    </div>
  )
}
