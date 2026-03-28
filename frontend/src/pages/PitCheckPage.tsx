import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDemoScenarios, analyzeText, analyzeImage, DemoScenario, VehicleContext, AnalyzeResponse } from '../lib/api'

const TELEMETRY_MESSAGES = [
  '> PARSING GARAGE NOTES...',
  '> IDENTIFYING REPAIR ITEMS...',
  '> CLASSIFYING URGENCY LEVELS...',
  '> CHECKING SAFETY FLAGS...',
  '> PREPARING PIT-WALL BRIEFING...',
]

type Mode = 'select' | 'paste' | 'upload' | 'demo' | 'loading' | 'error'

export default function PitCheckPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>(() => searchParams.get('mode') === 'demo' ? 'demo' : 'select')
  const [quoteText, setQuoteText] = useState('')
  const [vehicle, setVehicle] = useState<VehicleContext>({})
  const [scenarios, setScenarios] = useState<DemoScenario[]>([])
  const [telemetryIndex, setTelemetryIndex] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getDemoScenarios().then(setScenarios).catch(() => {})
  }, [])

  // Cycle telemetry messages during loading
  useEffect(() => {
    if (mode !== 'loading') return
    const interval = setInterval(() => {
      setTelemetryIndex(i => (i + 1) % TELEMETRY_MESSAGES.length)
    }, 900)
    return () => clearInterval(interval)
  }, [mode])

  const runAnalysis = async (text: string, v?: VehicleContext) => {
    setMode('loading')
    setTelemetryIndex(0)
    try {
      const result: AnalyzeResponse = await analyzeText(text, v)
      navigate('/briefing', { state: { result, quoteText: text, vehicle: v } })
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
      setMode('error')
    }
  }

  const handlePasteSubmit = () => {
    if (quoteText.trim().length < 20) return
    runAnalysis(quoteText.trim(), Object.values(vehicle).some(Boolean) ? vehicle : undefined)
  }

  const handleImageSubmit = () => {
    if (!imageFile) return
    setMode('loading')
    setTelemetryIndex(0)
    analyzeImage(imageFile, Object.values(vehicle).some(Boolean) ? vehicle : undefined)
      .then((result: AnalyzeResponse) => navigate('/briefing', { state: { result, quoteText: '[Uploaded Image]', vehicle } }))
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : 'Image analysis failed. Please try again.')
        setMode('error')
      })
  }

  const handleDemoSelect = (scenario: DemoScenario) => {
    setQuoteText(scenario.quote_text)
    runAnalysis(scenario.quote_text)
  }

  // -- Mode: select ---------------------------------------------------
  if (mode === 'select') {
    return (
      <div className="min-h-screen carbon-bg flex flex-col">
        <PageHeader onBack={() => navigate('/')} onHome={() => navigate('/')} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-2xl">
            <div className="mb-8 text-center fade-in-1">
              <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Pit Check</div>
              <h2 className="font-sans font-bold text-2xl text-text-primary">How would you like to start?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ModeCard
                className="fade-in-2"
                label="Paste Quote"
                sublabel="Paste mechanic notes or estimate text"
                tag="TEXT INPUT"
                onClick={() => setMode('paste')}
              />
              <ModeCard
                className="fade-in-3"
                label="Upload Image"
                sublabel="Snap or upload a repair estimate photo"
                tag="IMAGE"
                onClick={() => setMode('upload')}
              />
              <ModeCard
                className="fade-in-4"
                label="Demo Scenario"
                sublabel="Try a realistic shop quote scenario"
                tag="DEMO"
                onClick={() => setMode('demo')}
              />
            </div>
          </div>
        </main>
      </div>
    )
  }

  // -- Mode: demo -----------------------------------------------------
  if (mode === 'demo') {
    return (
      <div className="min-h-screen carbon-bg flex flex-col">
        <PageHeader onBack={() => setMode('select')} onHome={() => navigate('/')} />
        <main className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">
          <div className="mb-8 fade-in-1">
            <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Demo Scenarios</div>
            <h2 className="font-sans font-bold text-2xl text-text-primary">Select a scenario</h2>
            <p className="text-text-secondary text-sm mt-2">Choose a realistic shop scenario to see PitWall in action.</p>
          </div>
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleDemoSelect(s)}
                className={`w-full text-left border border-[#2a2a2a] rounded-lg p-4 bg-[#141414] hover:border-accent hover:bg-[#1a1a1a] transition-all group fade-in-${Math.min(i + 2, 5)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-sans font-semibold text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">{s.title}</div>
                    <div className="text-text-secondary text-xs leading-relaxed">{s.description}</div>
                  </div>
                  <span className="font-mono text-xs text-accent shrink-0 mt-0.5">RUN &rarr;</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // -- Mode: paste ----------------------------------------------------
  if (mode === 'paste') {
    return (
      <div className="min-h-screen carbon-bg flex flex-col">
        <PageHeader onBack={() => setMode('select')} onHome={() => navigate('/')} />
        <main className="flex-1 px-6 py-12 max-w-2xl mx-auto w-full">
          <div className="mb-8 fade-in-1">
            <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Paste Quote</div>
            <h2 className="font-sans font-bold text-2xl text-text-primary">What did the mechanic say?</h2>
            <p className="text-text-secondary text-sm mt-2">Paste the estimate text, mechanic notes, or anything you were told.</p>
          </div>

          <div className="space-y-5 fade-in-2">
            <textarea
              value={quoteText}
              onChange={e => setQuoteText(e.target.value)}
              placeholder="Paste estimate or mechanic notes here..."
              rows={7}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 text-text-primary font-sans text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent resize-none transition-colors"
            />

            {/* Optional vehicle context */}
            <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-[#141414] border-b border-[#2a2a2a]">
                <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">Vehicle Context <span className="text-[#3a3a3a]">-- Optional</span></span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#141414]">
                {([
                  { key: 'year', placeholder: 'Year', type: 'number' },
                  { key: 'make', placeholder: 'Make', type: 'text' },
                  { key: 'model', placeholder: 'Model', type: 'text' },
                  { key: 'mileage', placeholder: 'Mileage', type: 'number' },
                ] as const).map(({ key, placeholder, type }) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={placeholder}
                    value={vehicle[key] ?? ''}
                    onChange={e => setVehicle(v => ({
                      ...v,
                      [key]: e.target.value ? (type === 'number' ? Number(e.target.value) : e.target.value) : undefined
                    }))}
                    className="bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-text-primary font-sans text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handlePasteSubmit}
              disabled={quoteText.trim().length < 20}
              className="w-full py-3 bg-accent text-[#0d0d0d] font-sans font-bold text-sm tracking-wider uppercase rounded hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all teal-glow"
            >
              Analyze Quote
            </button>
          </div>
        </main>
      </div>
    )
  }

  // -- Mode: upload ---------------------------------------------------
  if (mode === 'upload') {
    const formatBytes = (bytes: number) => bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

    return (
      <div className="min-h-screen carbon-bg flex flex-col">
        <PageHeader onBack={() => setMode('select')} onHome={() => navigate('/')} />
        <main className="flex-1 px-6 py-12 max-w-2xl mx-auto w-full">
          <div className="mb-8 fade-in-1">
            <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Upload Image</div>
            <h2 className="font-sans font-bold text-2xl text-text-primary">Got a photo of the quote?</h2>
            <p className="text-text-secondary text-sm mt-2">Upload a repair estimate, invoice, or mechanic printout.</p>
          </div>

          <div className="space-y-5 fade-in-2">
            {/* Drop zone */}
            <label
              className={`flex flex-col items-center justify-center w-full min-h-[200px] border-2 rounded-lg cursor-pointer transition-all ${
                isDragOver
                  ? 'border-accent bg-[#1a1a1a]'
                  : imageFile
                  ? 'border-accent bg-[#141414]'
                  : 'border-dashed border-[#2a2a2a] bg-[#141414] hover:border-accent/50 hover:bg-[#1a1a1a]'
              }`}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => {
                e.preventDefault()
                setIsDragOver(false)
                const f = e.dataTransfer.files[0]
                if (f) setImageFile(f)
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) setImageFile(e.target.files[0]) }}
              />
              {imageFile ? (
                <div className="text-center px-6">
                  {/* Checkmark icon */}
                  <svg className="w-8 h-8 text-accent mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-sans font-semibold text-text-primary text-sm truncate max-w-xs">{imageFile.name}</p>
                  <p className="font-mono text-xs text-text-secondary mt-1">{formatBytes(imageFile.size)}</p>
                  <p className="font-mono text-xs text-accent/60 mt-2">Click to change</p>
                </div>
              ) : (
                <div className="text-center px-6">
                  {/* Upload icon */}
                  <svg className="w-8 h-8 text-accent mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-sans text-text-primary text-sm font-medium">Drag & drop your image here</p>
                  <p className="font-sans text-text-secondary text-xs mt-1">or click to browse</p>
                  <p className="font-mono text-xs text-accent/50 mt-3 tracking-wider">JPEG · PNG · WEBP · MAX 10 MB</p>
                </div>
              )}
            </label>

            {/* Optional vehicle context — same as paste mode */}
            <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-[#141414] border-b border-[#2a2a2a]">
                <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">Vehicle Context <span className="text-[#3a3a3a]">-- Optional</span></span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#141414]">
                {([
                  { key: 'year', placeholder: 'Year', type: 'number' },
                  { key: 'make', placeholder: 'Make', type: 'text' },
                  { key: 'model', placeholder: 'Model', type: 'text' },
                  { key: 'mileage', placeholder: 'Mileage', type: 'number' },
                ] as const).map(({ key, placeholder, type }) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={placeholder}
                    value={vehicle[key] ?? ''}
                    onChange={e => setVehicle(v => ({
                      ...v,
                      [key]: e.target.value ? (type === 'number' ? Number(e.target.value) : e.target.value) : undefined
                    }))}
                    className="bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-text-primary font-sans text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleImageSubmit}
              disabled={!imageFile}
              className="w-full py-3 bg-accent text-[#0d0d0d] font-sans font-bold text-sm tracking-wider uppercase rounded hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all teal-glow"
            >
              Analyze Image
            </button>
          </div>
        </main>
      </div>
    )
  }

  // -- Mode: loading --------------------------------------------------
  if (mode === 'loading') {
    return (
      <div className="min-h-screen carbon-bg flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="px-6 py-3 bg-[#141414] border-b border-[#2a2a2a] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs text-accent tracking-widest uppercase">Pit Wall Active</span>
            </div>
            <div className="p-6 bg-[#141414] min-h-[160px] flex flex-col justify-center space-y-2">
              {TELEMETRY_MESSAGES.map((msg, i) => (
                <div
                  key={msg}
                  className={`font-mono text-sm transition-colors duration-300 ${
                    i < telemetryIndex ? 'text-[#3a3a3a]' :
                    i === telemetryIndex ? 'text-accent' : 'text-[#2a2a2a]'
                  }`}
                >
                  {msg}{i === telemetryIndex && <span className="cursor-blink">_</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -- Mode: error ----------------------------------------------------
  return (
    <div className="min-h-screen carbon-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md border border-[#FF1801]/30 rounded-lg p-6 bg-[#141414] text-center">
        <div className="font-mono text-xs text-[#FF1801] tracking-widest uppercase mb-3">Analysis Failed</div>
        <p className="text-text-secondary text-sm mb-6">{errorMsg}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setMode('select')} className="px-5 py-2 border border-[#2a2a2a] text-text-primary font-sans text-sm rounded hover:border-accent transition-all">
            Try Again
          </button>
          <button onClick={() => setMode('demo')} className="px-5 py-2 bg-accent text-[#0d0d0d] font-sans font-bold text-sm rounded hover:bg-accent/90 transition-all">
            Use Demo
          </button>
        </div>
      </div>
    </div>
  )
}

// -- Shared sub-components --------------------------------------------

function PageHeader({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
      <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
        <span className="font-mono text-xs">&#8592;</span>
        <span className="font-mono text-xs tracking-wider uppercase">Back</span>
      </button>
      <button onClick={onHome} className="font-mono text-accent text-sm font-bold tracking-widest hover:opacity-80 transition-opacity">PITWALL</button>
      <div className="w-16" />
    </nav>
  )
}

function ModeCard({ label, sublabel, tag, onClick, className }: {
  label: string
  sublabel: string
  tag: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`${className ?? ''} w-full text-left border border-[#2a2a2a] rounded-lg p-6 bg-[#141414] hover:border-accent hover:bg-[#1a1a1a] transition-all group`}
    >
      <div className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{tag}</div>
      <div className="font-sans font-bold text-text-primary text-lg mb-2 group-hover:text-accent transition-colors">{label}</div>
      <div className="text-text-secondary text-xs leading-relaxed">{sublabel}</div>
    </button>
  )
}
