import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Route, AlertTriangle, CheckCircle2 } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'
const TIERS = ['STABLE', 'URGENT', 'CRITICAL']

export default function RerouteSimulator() {
  const navigate = useNavigate()

  const [currentEta, setCurrentEta] = useState(18)
  const [alternateEta, setAlternateEta] = useState(14)
  const [trafficDelay, setTrafficDelay] = useState(5)
  const [tier, setTier] = useState('URGENT')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function runSimulation() {
    setLoading(true)
    fetch(`${API_BASE}/reroute/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentEtaMinutes: currentEta,
        alternateEtaMinutes: alternateEta,
        trafficDelayMinutes: trafficDelay,
        tier,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: '0.82rem', marginBottom: 20, cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to home
        </div>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-telecom)', letterSpacing: '0.08em', marginBottom: 8 }}>
          INTERNAL TOOL
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Reroute Simulator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>
          Injects a mock traffic event and tests whether the AI routing logic decides to reroute.
        </p>

        <div style={{
          background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
          border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px',
          boxShadow: 'var(--shadow-card)', marginBottom: 20,
        }}>
          <SliderField label="Current Route ETA" value={currentEta} onChange={setCurrentEta} min={5} max={40} unit="min" />
          <SliderField label="Alternate Route ETA" value={alternateEta} onChange={setAlternateEta} min={3} max={40} unit="min" />
          <SliderField label="Traffic Delay Injected" value={trafficDelay} onChange={setTrafficDelay} min={0} max={25} unit="min" accent="var(--tier-urgent)" />

          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Patient Tier
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {TIERS.map((t) => (
                <button key={t} onClick={() => setTier(t)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${tier === t ? 'var(--accent-telecom)' : 'var(--line)'}`,
                  background: tier === t ? 'var(--bg-panel)' : 'transparent',
                  color: tier === t ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.8rem',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 0', borderRadius: 'var(--radius-sm)', border: 'none',
            background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600, fontSize: '0.92rem',
            marginBottom: 20, opacity: loading ? 0.7 : 1, cursor: loading ? 'default' : 'pointer',
          }}
        >
          <Route size={16} /> {loading ? 'Evaluating...' : 'Run Simulation'}
        </button>

        {result && (
          <div style={{
            background: result.shouldReroute ? 'var(--tier-urgent-dim)' : 'var(--tier-stable-dim)',
            border: `1px solid ${result.shouldReroute ? 'var(--tier-urgent)' : 'var(--tier-stable)'}`,
            borderRadius: 'var(--radius-md)', padding: '20px 22px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
              color: result.shouldReroute ? 'var(--tier-urgent)' : 'var(--tier-stable)',
            }}>
              {result.shouldReroute ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {result.shouldReroute ? 'REROUTE' : 'STAY ON ROUTE'}
              </span>
            </div>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {result.reason}
            </p>
            <div style={{ display: 'flex', gap: 24, fontSize: '0.8rem' }} className="mono">
              <span>Time saved: {result.timeSaved} min</span>
              <span>Threshold: {result.threshold} min</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SliderField({ label, value, onChange, min, max, unit, accent }) {
  const color = accent || 'var(--accent-telecom)'
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span className="mono" style={{ fontSize: '0.85rem', color, fontWeight: 600 }}>{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  )
}