import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, AlertTriangle, Wifi, Clock, ArrowRight } from 'lucide-react'

const STATS = [
  { value: '25-35 min', label: 'Average ambulance response time in India' },
  { value: '7%', label: 'Head injury cases reaching hospital in the golden hour' },
  { value: '134.5 min', label: 'Avg. response across dispatch, travel, and handoff (38,000+ call study)' },
  { value: '80%', label: 'Trauma patients who miss the golden hour entirely' },
]

const SUBSYSTEMS = [
  'Voice AI Call Agent, extracts type and location in seconds',
  'In-Ambulance Vitals, streamed live in transit',
  'AI Triage Engine, NEWS2-inspired urgency scoring',
  'Hospital Matching, distance, specialty, and bed availability',
  'Live Hospital Dashboard, ready before the doors open',
]

const FLOW = [
  'Call received, Voice AI extracts type and location',
  'Ambulance dispatched immediately',
  'Live vitals stream from ambulance to cloud',
  'AI scores urgency in real time',
  'Best-match hospital alerted and ready',
]

const SLIDES = [
  { kind: 'title' },
  { kind: 'problem' },
  { kind: 'solution' },
  { kind: 'flow' },
]

export default function Splash() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const isLast = active === SLIDES.length - 1

  function goNext() {
    if (isLast) {
      navigate('/home')
    } else {
      setActive(active + 1)
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative', perspective: 1400 }}>
      {SLIDES.map((s, i) => (
        <Slide3D key={i} kind={s.kind} isActive={i === active} />
      ))}

      <button
        onClick={() => navigate('/home')}
        style={{ position: 'absolute', top: 24, right: 28, zIndex: 20, background: 'transparent', border: '1px solid var(--line)', color: 'var(--text-faint)', fontSize: '0.75rem', padding: '6px 14px', borderRadius: 999 }}
      >
        Skip
      </button>

      <button
        onClick={goNext}
        style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 999, border: 'none', background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 0 30px -6px var(--accent-telecom)' }}
      >
        {isLast ? 'Enter Console' : 'Next'} <ArrowRight size={16} />
      </button>

      <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
        {SLIDES.map((_, i) => (
          <span
            key={i}
            onClick={() => setActive(i)}
            style={{ width: i === active ? 26 : 8, height: 8, borderRadius: 999, background: i === active ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.3s ease' }}
          />
        ))}
      </div>
    </div>
  )
}

function Slide3D(props) {
  const kind = props.kind
  const isActive = props.isActive

  return (
    <div
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24,
        opacity: isActive ? 1 : 0, zIndex: isActive ? 10 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: isActive ? 'rotateX(0deg) translateZ(0)' : 'rotateX(20deg) translateZ(-80px)',
          transition: 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)',
          width: '100%',
          maxWidth: 780,
        }}
      >
        {kind === 'title' && <TitleContent />}
        {kind === 'problem' && <ProblemContent />}
        {kind === 'solution' && <SolutionContent />}
        {kind === 'flow' && <FlowContent />}
      </div>
    </div>
  )
}

function TitleContent() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20, background: 'var(--accent-telecom-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px',
        boxShadow: '0 0 50px -8px var(--accent-telecom), 0 30px 40px -20px rgba(0,0,0,0.6)',
        transform: 'translateZ(60px)',
      }}>
        <Radio size={36} color="var(--accent-telecom)" />
      </div>
      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent-telecom)', letterSpacing: '0.14em', marginBottom: 14 }}>
        VITAL AND RAPID ASSISTANCE
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: '#fff', margin: '0 0 16px 0' }}>
        Every second counts.<br />We connect them.
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
        A connected-ambulance platform bridging patients, ambulances, and hospitals in real time.
      </p>
    </div>
  )
}

function ProblemContent() {
  return (
    <div style={{ textAlign: 'left' }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--tier-critical)', letterSpacing: '0.1em', marginBottom: 14, justifyContent: 'center' }}>
        <AlertTriangle size={14} /> THE PROBLEM
      </div>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 32, color: '#fff' }}>
        India's golden hour is slipping away
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {STATS.map((s, i) => (
          <div key={s.value} style={{
            background: 'var(--bg-panel-raised)', border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)', padding: '20px 18px',
            boxShadow: 'var(--shadow-card)',
            transform: `translateZ(${20 - i * 4}px)`,
          }}>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--tier-critical)', marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SolutionContent() {
  return (
    <div style={{ textAlign: 'left' }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--accent-telecom)', letterSpacing: '0.1em', marginBottom: 14, justifyContent: 'center' }}>
        <Wifi size={14} /> OUR SOLUTION
      </div>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 32, color: '#fff' }}>
        Five connected subsystems
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SUBSYSTEMS.map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--bg-panel-raised)', border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)', padding: '14px 18px',
            transform: `translateZ(${16 - i * 3}px)`,
          }}>
            <div className="mono" style={{ color: 'var(--accent-telecom)', fontWeight: 700, fontSize: '0.9rem' }}>{i + 1}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowContent() {
  return (
    <div style={{ textAlign: 'left' }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--tier-stable)', letterSpacing: '0.1em', marginBottom: 14, justifyContent: 'center' }}>
        <Clock size={14} /> HOW IT WORKS
      </div>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 32, color: '#fff' }}>
        From call to handoff
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FLOW.map((step, i) => (
          <div key={step} style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="mono" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--tier-stable)', color: 'var(--tier-stable)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', flexShrink: 0 }}>
                {i + 1}
              </div>
              {i < FLOW.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--line)', minHeight: 24 }} />}
            </div>
            <div style={{ paddingBottom: 20, paddingTop: 3, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  )
}