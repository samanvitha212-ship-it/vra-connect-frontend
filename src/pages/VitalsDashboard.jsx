import { useState } from 'react'
import { useVitalsSimulator } from '../hooks/useVitalsSimulator.js'
import VitalCard from '../components/VitalCard.jsx'
import PlethCard from '../components/PlethCard.jsx'
import StatCard from '../components/StatCard.jsx'
import TierBadge from '../components/TierBadge.jsx'
import ConnectionStatus from '../components/ConnectionStatus.jsx'
import TransmissionLink from '../components/TransmissionLink.jsx'
import { activeCase } from '../data/mockData.js'
import { Wifi, Radio } from 'lucide-react'

const PRESET_OPTIONS = ['DRIFT', 'STABLE', 'URGENT', 'CRITICAL']

export default function VitalsDashboard() {
  const [preset, setPreset] = useState('DRIFT')
  const [connMode, setConnMode] = useState('live') // 'live' | 'sms'
  const { vitals, news2Points, tier } = useVitalsSimulator(preset, 3000)

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginBottom: 4 }}>
            {activeCase.caseId}
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>In-Ambulance Vitals Feed</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ConnectionStatus mode={connMode} />
          <TierBadge tier={tier} points={news2Points} size="lg" />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <TransmissionLink mode={connMode} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <VitalCard label="Heart Rate" value={vitals.hr} unit="bpm" accent="var(--tier-critical)" />
        <PlethCard label="SpO₂" value={vitals.spo2} unit="%" accent="var(--accent-telecom)" />
        <StatCard
          label="Systolic BP"
          value={vitals.systolic}
          unit="mmHg"
          accent="var(--tier-urgent)"
          subtext="Cuff reading · every 60s"
        />
        <StatCard
          label="Temperature"
          value={vitals.tempC}
          unit="°C"
          accent="var(--tier-stable)"
          subtext="Probe reading · every 30s"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Simulate scenario (Phase 1 preset injector)
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PRESET_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${preset === p ? 'var(--accent-telecom)' : 'var(--line)'}`,
                  background: preset === p ? 'var(--bg-panel-raised)' : 'transparent',
                  color: preset === p ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                }}
              >
                {p === 'DRIFT' ? 'Drift → Critical' : p}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Simulate connectivity (telecom fallback demo)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setConnMode('live')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${connMode === 'live' ? 'var(--accent-telecom)' : 'var(--line)'}`,
                background: connMode === 'live' ? 'var(--bg-panel-raised)' : 'transparent',
                color: connMode === 'live' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              <Wifi size={14} /> WiFi / BLE
            </button>
            <button
              onClick={() => setConnMode('sms')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${connMode === 'sms' ? 'var(--tier-urgent)' : 'var(--line)'}`,
                background: connMode === 'sms' ? 'var(--bg-panel-raised)' : 'transparent',
                color: connMode === 'sms' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              <Radio size={14} /> SMS Fallback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}