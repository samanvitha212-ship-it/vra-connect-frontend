import { useVitalsSimulator } from '../hooks/useVitalsSimulator.js'
import TierBadge from '../components/TierBadge.jsx'
import { activeCase } from '../data/mockData.js'

export default function PatientDashboard() {
  const { vitals, news2Points, tier } = useVitalsSimulator('DRIFT', 3000)

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1000, margin: '0 auto' }}>
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
          <div
            className="mono"
            style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginBottom: 4 }}
          >
            {activeCase.caseId}
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Patient Case View</h2>
        </div>
        <TierBadge tier={tier} points={news2Points} size="lg" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <InfoBlock label="Age / Sex" value={`${activeCase.patientAge} · ${activeCase.patientSex}`} />
        <InfoBlock label="Chief Complaint" value={activeCase.chiefComplaint} />
        <InfoBlock label="Pickup Location" value={activeCase.pickupLocation} />
        <InfoBlock label="Dispatch Time" value={activeCase.dispatchTime} />
      </div>

      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          Paramedic Notes
        </div>
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {activeCase.paramedicNotes}
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          Current Vitals (live)
        </div>
        <div className="mono" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>HR {vitals.hr} bpm</span>
          <span>SpO₂ {vitals.spo2}%</span>
          <span>BP {vitals.systolic} mmHg</span>
          <span>Temp {vitals.tempC}°C</span>
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: 14,
          }}
        >
          Case Timeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {activeCase.timeline.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: step.done ? 'var(--tier-stable)' : 'var(--line)',
                    border: step.done ? 'none' : '1px solid var(--text-faint)',
                    marginTop: 4,
                  }}
                />
                {i < activeCase.timeline.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'var(--line)', minHeight: 28 }} />
                )}
              </div>
              <div style={{ paddingBottom: 18 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {step.label}
                </div>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                  {step.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '0.95rem' }}>{value}</div>
    </div>
  )
}