import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Radio, Activity, Building2, ArrowRight, Phone, BrainCircuit,
  Clock, MapPin, AlertTriangle, Wifi,
} from 'lucide-react'

const STATS = [
  { value: 30, suffix: ' min', label: 'Average ambulance response time in India' },
  { value: 7, suffix: '%', label: 'Head injury cases reaching hospital in the golden hour' },
  { value: 134, suffix: ' min', label: 'Avg. response across dispatch, travel, and handoff' },
  { value: 80, suffix: '%', label: 'Trauma patients who miss the golden hour entirely' },
]

const SUBSYSTEMS = [
  { icon: Phone, title: 'Voice AI Call Agent', desc: 'Extracts emergency type and location in seconds to trigger instant dispatch.' },
  { icon: Activity, title: 'In-Ambulance Vitals', desc: 'Heart rate, SpO2, blood pressure and temperature streamed live during transport.' },
  { icon: BrainCircuit, title: 'AI Triage Engine', desc: 'NEWS2-inspired scoring classifies every case as Stable, Urgent, or Critical in real time.' },
  { icon: MapPin, title: 'Hospital Matching', desc: 'Weighs distance, specialty, and bed availability to route to the right hospital.' },
  { icon: Building2, title: 'Live Hospital Dashboard', desc: 'Vitals, tier, and ETA reach the hospital before the ambulance does.' },
]

const FLOW = [
  'Call received, Voice AI extracts type and location',
  'Ambulance dispatched immediately',
  'Live vitals stream from ambulance to cloud',
  'AI triage engine scores urgency in real time',
  'Best-match hospital identified and alerted',
  'Care team ready before the doors open',
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <header style={{
        padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid var(--line)', position: 'sticky', top: 0,
        background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(10px)', zIndex: 10,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--accent-telecom-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Radio size={18} color="var(--accent-telecom)" />
        </div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>VRA Connect</h1>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Drifting glow orbs */}
        <div style={{
          position: 'absolute', top: -100, left: '10%', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,157,255,0.18), transparent 70%)',
          animation: 'bg-drift 12s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 50, right: '5%', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,84,112,0.12), transparent 70%)',
          animation: 'bg-drift 15s ease-in-out infinite 2s', pointerEvents: 'none',
        }} />

        {/* Pulsing rings behind the hero icon */}
        <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 30px' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--accent-telecom)', animation: 'hero-ring-expand 2.4s ease-out infinite' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--accent-telecom)', animation: 'hero-ring-expand 2.4s ease-out infinite 0.8s' }} />
          <div style={{
            position: 'relative', width: 90, height: 90, borderRadius: '50%',
            background: 'var(--accent-telecom-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px -6px var(--accent-telecom)', animation: 'fade-up-in 0.7s ease both',
          }}>
            <Radio size={38} color="var(--accent-telecom)" />
          </div>
        </div>

        <div className="mono" style={{
          fontSize: '0.78rem', color: 'var(--accent-telecom)', letterSpacing: '0.14em',
          marginBottom: 18, animation: 'fade-up-in 0.7s ease 0.1s both',
        }}>
          VITAL AND RAPID ASSISTANCE
        </div>

        <h2 style={{
          fontSize: '3.2rem', maxWidth: 800, margin: '0 auto 22px', lineHeight: 1.1,
          background: 'linear-gradient(90deg, #fff, var(--accent-telecom), #fff)',
          backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text',
          color: 'transparent', animation: 'fade-up-in 0.7s ease 0.2s both, gradient-shift 6s ease-in-out infinite',
        }}>
          Every second counts.<br />We connect them.
        </h2>

        <p style={{
          maxWidth: 600, margin: '0 auto 44px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.65,
          animation: 'fade-up-in 0.7s ease 0.3s both',
        }}>
          A connected-ambulance platform that turns the ride itself into the first stage of triage,
          streaming live vitals and urgency data to the hospital before the doors even open.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fade-up-in 0.7s ease 0.4s both' }}>
          <RoleCard icon={Activity} title="Ambulance Team" desc="Access live vitals streaming and case dispatch"
            onLogin={() => navigate('/login/ambulance')} onRegister={() => navigate('/register/ambulance')} />
          <RoleCard icon={Building2} title="Hospital Team" desc="View incoming cases and prep for arrival"
            onLogin={() => navigate('/login/hospital')} onRegister={() => navigate('/register/hospital')} />
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '70px 24px', background: 'var(--bg-panel)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel icon={AlertTriangle} text="THE PROBLEM" color="var(--tier-critical)" />
          <h3 style={{ fontSize: '1.9rem', marginBottom: 14 }}>India's golden hour is slipping away</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.65, marginBottom: 40 }}>
            The WHO's 60-minute golden hour window for emergency intervention is routinely missed,
            not just because of traffic, but because no data reaches the hospital until the patient
            physically arrives.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {STATS.map((s, i) => (
              <StatCard key={s.label} stat={s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: '70px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel icon={Wifi} text="OUR SOLUTION" color="var(--accent-telecom)" />
          <h3 style={{ fontSize: '1.9rem', marginBottom: 14 }}>Five connected subsystems, one continuous data thread</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.65, marginBottom: 40 }}>
            VRA Connect doesn't just get a vehicle there faster, it adds intelligence at every step:
            triage before dispatch, live vitals in transit, and hospital readiness before arrival.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
            {SUBSYSTEMS.map((s, i) => (
              <SubsystemCard key={s.title} sub={s} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '70px 24px', background: 'var(--bg-panel)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <SectionLabel icon={Clock} text="HOW IT WORKS" color="var(--tier-stable)" />
          <h3 style={{ fontSize: '1.9rem', marginBottom: 36 }}>From call to handoff</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FLOW.map((step, i) => (
              <div key={step} style={{ display: 'flex', gap: 16, animation: `fade-up-in 0.5s ease ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="mono" style={{
                    width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--tier-stable)',
                    color: 'var(--tier-stable)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  {i < FLOW.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--line)', minHeight: 30 }} />}
                </div>
                <div style={{ paddingBottom: 26, paddingTop: 4 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Cutting even 15 minutes changes outcomes</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 30px', lineHeight: 1.6 }}>
          Built for Emerging Technologies Hackathon 2026. See it in action.
        </p>
        <button
          onClick={() => navigate('/login/hospital')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
            borderRadius: 999, border: 'none', background: 'var(--accent-telecom)', color: '#fff',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
            boxShadow: '0 0 36px -6px var(--accent-telecom)',
          }}
        >
          View Live Demo <ArrowRight size={16} />
        </button>
      </section>

      <footer style={{ padding: '18px 32px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)', borderTop: '1px solid var(--line)' }}>
        Built for Emerging Technologies Hackathon 2026, Team VRA Connect
      </footer>
    </div>
  )
}

function SectionLabel({ icon: Icon, text, color }) {
  return (
    <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color, letterSpacing: '0.1em', marginBottom: 16 }}>
      <Icon size={14} /> {text}
    </div>
  )
}

function useCountUp(target, active) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame
    const duration = 1200
    const start = performance.now()
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      setCount(Math.round(target * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target])
  return count
}

function StatCard({ stat, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const count = useCountUp(stat.value, visible)

  return (
    <div
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
        padding: '22px 20px', boxShadow: 'var(--shadow-card)',
        animation: visible ? `fade-up-in 0.6s ease ${delay}s both` : 'none',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(255,84,112,0.3)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
    >
      <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 600, color: 'var(--tier-critical)', marginBottom: 10 }}>
        {stat.label.includes('Average') || stat.label.includes('Avg') ? `${count}${stat.suffix}` : `${count}${stat.suffix}`}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{stat.label}</div>
    </div>
  )
}

function SubsystemCard({ sub, delay }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
        padding: '24px 20px', boxShadow: 'var(--shadow-card)',
        animation: `fade-up-in 0.6s ease ${delay}s both`,
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = 'var(--accent-telecom)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = 'var(--line)' }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, background: 'var(--accent-telecom-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <sub.icon size={20} color="var(--accent-telecom)" />
      </div>
      <h4 style={{ fontSize: '1rem', marginBottom: 8 }}>{sub.title}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{sub.desc}</p>
    </div>
  )
}

function RoleCard({ icon: Icon, title, desc, onLogin, onRegister }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
        padding: '28px 26px', width: 280, boxShadow: 'var(--shadow-card)', textAlign: 'left',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px -10px var(--accent-telecom)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-telecom-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={20} color="var(--accent-telecom)" />
      </div>
      <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onLogin} style={{ flex: 1, padding: '9px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Sign In <ArrowRight size={14} />
        </button>
        <button onClick={onRegister} style={{ flex: 1, padding: '9px 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
          Register
        </button>
      </div>
    </div>
  )
}