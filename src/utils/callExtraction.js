// Rule-based extraction: matches your "honest, explainable" triage/matching
// philosophy — transparent keyword/pattern matching, not a black-box LLM call.

const EMERGENCY_KEYWORDS = [
  { keywords: ['chest pain', 'heart', 'cardiac', "can't breathe", 'breathless'], type: 'Chest pain / breathing difficulty' },
  { keywords: ['accident', 'crash', 'hit by', 'collision'], type: 'Road traffic accident' },
  { keywords: ['fall', 'fell', 'collapsed', 'collapse'], type: 'Fall / collapse' },
  { keywords: ['bleeding', 'blood', 'cut', 'wound'], type: 'Bleeding / laceration' },
  { keywords: ['unconscious', 'not responding', 'not waking'], type: 'Unconscious / unresponsive' },
  { keywords: ['fever', 'burning up'], type: 'High fever' },
  { keywords: ['allergic', 'swelling', 'reaction'], type: 'Allergic reaction' },
]

export function extractEmergencyType(text) {
  const lower = text.toLowerCase()
  for (const entry of EMERGENCY_KEYWORDS) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.type
    }
  }
  return null
}

// Looks for a location pattern: "near <place>", "at <place>", or a capitalized
// multi-word phrase (rough heuristic, deliberately simple and transparent).
export function extractLocation(text) {
  const nearMatch = text.match(/(?:near|at|on)\s+([A-Za-z0-9\s,]+?)(?:\.|,|$)/i)
  if (nearMatch && nearMatch[1].trim().length > 3) {
    return nearMatch[1].trim()
  }
  return null
}

export function extractAge(text) {
  const ageMatch = text.match(/\b(\d{1,3})\s*(?:years?|yrs?)?\s*old\b/i) || text.match(/\bage\s+(\d{1,3})\b/i)
  if (ageMatch) return parseInt(ageMatch[1], 10)
  return null
}

export function detectConsciousness(text) {
  const lower = text.toLowerCase()
  if (lower.includes('not responding') || lower.includes('unconscious') || lower.includes('unresponsive')) {
    return 'unresponsive'
  }
  if (lower.includes('conscious') || lower.includes('responding') || lower.includes('awake')) {
    return 'conscious'
  }
  return null
}

// Escalation trigger: keyword-based human-override path, matching the deck's
// stated design ("agent assists, never replaces judgement").
export function shouldEscalate(text) {
  const lower = text.toLowerCase()
  return lower.includes('operator') || lower.includes('human') || lower.includes('speak to someone')
}