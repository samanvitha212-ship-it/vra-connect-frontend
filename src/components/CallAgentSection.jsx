import { useState, useEffect } from 'react'
import { Mic, MicOff, PhoneCall, AlertCircle } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useSpeak } from '../hooks/useSpeak.js'
import {
  extractEmergencyType,
  extractLocation,
  extractAge,
  detectConsciousness,
  shouldEscalate,
} from '../utils/callExtraction.js'

const API_BASE = 'http://localhost:5000/api'

export default function CallAgentSection() {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()
  const { speak } = useSpeak()

  const [emergencyType, setEmergencyType] = useState(null)
  const [location, setLocation] = useState(null)
  const [age, setAge] = useState(null)
  const [consciousness, setConsciousness] = useState(null)
  const [dispatched, setDispatched] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [createdCaseId, setCreatedCaseId] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')

  // Re-run extraction every time new transcript text comes in.
  useEffect(() => {
    if (!transcript) return

    if (shouldEscalate(transcript) && !escalated) {
      setEscalated(true)
      speak('Connecting you to a human operator now.')
      return
    }

    const type = extractEmergencyType(transcript)
    const loc = extractLocation(transcript)
    const ageFound = extractAge(transcript)
    const conscious = detectConsciousness(transcript)

    if (type && !emergencyType) setEmergencyType(type)
    if (loc && !location) setLocation(loc)
    if (ageFound && !age) setAge(ageFound)
    if (conscious && !consciousness) setConsciousness(conscious)
  }, [transcript])

  // Once both critical fields are known and we haven't dispatched yet, fire dispatch immediately.
  useEffect(() => {
    if (emergencyType && location && !dispatched) {
      dispatchCase()
    }
  }, [emergencyType, location])

  function dispatchCase() {
    setDispatched(true)
    const caseId = `VRA-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
    setCreatedCaseId(caseId)

    speak(`Understood. Ambulance dispatched to ${location}. Stay on the line, help is on the way.`)
    setStatusMsg('Ambulance dispatched — case created')

    fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId,
        chiefComplaint: emergencyType,
        pickupLocation: { address: location, lat: 12.9716, lng: 77.5946 },
        dispatchTime: new Date().toISOString(),
      }),
    }).catch(() => setStatusMsg('Ambulance dispatched (case save failed — check backend)'))
  }

  function handleStart() {
    resetTranscript()
    setEmergencyType(null)
    setLocation(null)
    setAge(null)
    setConsciousness(null)
    setDispatched(false)
    setEscalated(false)
    setCreatedCaseId(null)
    setStatusMsg('')
    startListening()
  }

  if (!isSupported) {
    return (
      <div style={{
        background: 'var(--tier-urgent-dim)', border: '1px solid var(--tier-urgent)',
        borderRadius: 'var(--radius-sm)', padding: '14px 18px', color: 'var(--tier-urgent)', fontSize: '0.85rem',
      }}>
        Voice recognition isn't supported in this browser. Try Chrome on desktop.
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
      border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
      padding: '20px', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <PhoneCall size={15} /> Live call simulation
        </div>
        <button
          onClick={isListening ? stopListening : handleStart}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
            borderRadius: 999, border: 'none', fontWeight: 600, fontSize: '0.85rem',
            background: isListening ? 'var(--tier-critical)' : 'var(--accent-telecom)', color: '#fff',
          }}
        >
          {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          {isListening ? 'Stop Call' : 'Start Call'}
        </button>
      </div>

      {isListening && (
        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--tier-critical)', marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tier-critical)', animation: 'pulse-dot 1.2s infinite' }} />
          LISTENING — speak your emergency
        </div>
      )}

      {escalated && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--tier-urgent-dim)',
          border: '1px solid var(--tier-urgent)', borderRadius: 'var(--radius-sm)', padding: '10px 14px',
          fontSize: '0.82rem', color: 'var(--tier-urgent)', marginBottom: 14,
        }}>
          <AlertCircle size={15} /> Escalated to human operator (keyword trigger detected)
        </div>
      )}

      {transcript && (
        <div style={{
          background: 'var(--bg-deep)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
          padding: '12px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5,
        }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>
            Live transcript
          </div>
          "{transcript}"
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <ExtractedField label="Emergency Type" value={emergencyType} critical />
        <ExtractedField label="Location" value={location} critical />
        <ExtractedField label="Age" value={age} />
        <ExtractedField label="Consciousness" value={consciousness} />
      </div>

      {statusMsg && (
        <div style={{
          marginTop: 16, background: 'var(--tier-stable-dim)', border: '1px solid var(--tier-stable)',
          borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.85rem', color: 'var(--tier-stable)',
        }}>
          {statusMsg} {createdCaseId && `(${createdCaseId})`}
        </div>
      )}
    </div>
  )
}

function ExtractedField({ label, value, critical }) {
  const filled = !!value
  return (
    <div style={{
      background: 'var(--bg-panel)', border: `1px solid ${filled ? 'var(--tier-stable)' : 'var(--line)'}`,
      borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    }}>
      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 4 }}>
        {label} {critical && !filled && <span style={{ color: 'var(--tier-urgent)' }}>· required</span>}
      </div>
      <div style={{ fontSize: '0.85rem', color: filled ? 'var(--text-primary)' : 'var(--text-faint)' }}>
        {value || 'Listening...'}
      </div>
    </div>
  )
}