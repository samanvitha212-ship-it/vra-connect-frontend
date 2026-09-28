import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Headset } from 'lucide-react'
import CallAgentSection from '../components/CallAgentSection.jsx'

export default function DispatcherView() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: '0.82rem', marginBottom: 20, cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to home
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'var(--accent-telecom-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Headset size={18} color="var(--accent-telecom)" />
          </div>
          <h1 style={{ fontSize: '1.5rem' }}>Dispatcher Console</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>
          Answers the emergency call, extracts the two critical fields, and triggers immediate dispatch — before the ambulance is even assigned.
        </p>

        <CallAgentSection />
      </div>
    </div>
  )
}