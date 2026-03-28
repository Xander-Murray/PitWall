const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface VehicleContext {
  year?: number
  make?: string
  model?: string
  mileage?: number
}

export interface RepairItem {
  name: string
  urgency: 'pit_now' | 'next_lap' | 'monitor' | 'unclear'
  reason: string
  verify_flag: boolean
  questions_to_ask: string[]
  confidence: 'low' | 'medium' | 'high'
}

export interface AnalyzeResponse {
  summary: string
  overall_risk: 'low' | 'medium' | 'high'
  race_status: 'pit_now' | 'next_lap' | 'monitor' | 'unclear'
  repair_items: RepairItem[]
  questions_for_the_garage: string[]
  what_to_say_next: string
  confidence_notes: string[]
}

export interface DemoScenario {
  id: string
  title: string
  description: string
  quote_text: string
}

export async function analyzeText(
  quoteText: string,
  vehicle?: VehicleContext
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_URL}/api/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quote_text: quoteText, vehicle: vehicle || null }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Analysis failed')
  }
  return res.json()
}

export async function getDemoScenarios(): Promise<DemoScenario[]> {
  const res = await fetch(`${API_URL}/api/demo-scenarios`)
  if (!res.ok) throw new Error('Failed to load demo scenarios')
  return res.json()
}

export async function getStats(): Promise<{ count: number }> {
  const res = await fetch(`${API_URL}/api/stats`)
  if (!res.ok) return { count: 0 }
  return res.json()
}
