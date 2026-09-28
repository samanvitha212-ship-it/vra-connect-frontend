import { useState } from 'react'
import { useVitalsSimulator } from '../hooks/useVitalsSimulator.js'
import { useCaseData } from '../hooks/useCaseData.js'
import { useCasesList } from '../hooks/useCasesList.js'
import { useCountdown } from '../hooks/useCountdown.js'
import VitalCard from '../components/VitalCard.jsx'
import PlethCard from '../components/PlethCard.jsx'
import StatCard from '../components/StatCard.jsx'
import TierBadge from '../components/TierBadge.jsx'
import TransmissionLink from '../components/TransmissionLink.jsx'
import SMSMessageBubble from '../components/SMSMessageBubble.jsx'
import { readinessChecklist } from '../data/mockData.js'
import { Timer } from 'lucide-react'

export default function HospitalDashboard() {
  const { cases, loading: casesLoading } = useCasesList()
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  const activeCaseId = selectedCaseId || (cases.length > 0 ? cases[0].caseId : null)
  const { caseData, loading, error } = useCaseData(activeCaseId)
  const { vitals, news2Points, tier, lastTransmissionMode } = useVitalsSimulator(null, 3000, activeCaseId, 'hospital')
  const eta = useCountdown(15 * 60)

  if (casesLoading) {
    return <CenterMessage text="Loading cases..." />
  }

  if (cases.length === 0) {
    return <CenterMessage text="No cases yet. Generate one from the Case Generator tool." />
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1300, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Hospital Console</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        <div style={{
          background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
          padding: 14, display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'start',
        }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 6px' }}>
            Incoming Cases ({cases.length})
          </div>
          {cases.map((c) => (
            <button
              key={c.caseId}
              onClick={() => setSelectedCaseId(c.caseId)}
              style={{
                textAlign: 'left',
                background: c.caseId === activeCaseId ? 'var(--bg-panel-raised)' : 'transparent',
                border: `1px solid ${c.caseId === activeCaseId ? 'var(--accent-telecom)' : 'var(--line)'}`,
                borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-primary)',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span className="mono" style={{ fontSize: '0.76rem' }}>{c.caseId}</span>
                <TierBadge tier={c.currentTier} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.chiefComplaint}</div>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                {c.status}
              </div>
            </button>
          ))}
        </div>

        <div>
          {loading && <CenterMessage text="Loading case..." />}
          {error && <CenterMessage text={error} isError />}

          {caseData && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <div className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginBottom: 4 }}>
                    {caseData.caseId}
                  </div>
                  <h3 style={{ fontSize: '1.1rem' }}>Case Detail</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ETABadge eta={eta} />
                  <TierBadge tier={tier} points={news2Points} size="lg" />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <TransmissionLink mode={lastTransmissionMode === 'sms_store_forward' ? 'sms' : 'live'} label="RECEIVING" />
              </div>

              <SectionBlock title="Patient Info">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <InfoBlock label="Age / Sex" value={`${caseData.patientAge} · ${caseData.patientSex}`} />
                  <InfoBlock label="Chief Complaint" value={caseData.chiefComplaint} />
                  <InfoBlock label="Pickup Location" value={caseData.pickupLocation?.address || '—'} />
                  <InfoBlock label="Status" value={caseData.status} />
                </div>
                {caseData.paramedicNotes && (
                  <div style={{ marginTop: 12, background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Paramedic Notes
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>{caseData.paramedicNotes}</p>
                  </div>
                )}
              </SectionBlock>

              <SectionBlock title="Live Vitals">
                {lastTransmissionMode === 'sms_store_forward' ? (
                  <SMSMessageBubble vitals={vitals} tier={tier} />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <VitalCard label="Heart Rate" value={vitals.hr} unit="bpm" accent="var(--tier-critical)" />
                    <PlethCard label="SpO₂" value={vitals.spo2} unit="%" accent="var(--accent-telecom)" />
                    <StatCard label="Systolic BP" value={vitals.systolic} unit="mmHg" accent="var(--tier-urgent)" subtext="Cuff reading · every 60s" />
                    <StatCard label="Temperature" value={vitals.tempC} unit="°C" accent="var(--tier-stable)" subtext="Probe reading · every 30s" />
                  </div>
                )}
              </SectionBlock>

              <SectionBlock title="Readiness">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                      This Hospital
                    </div>
                    {caseData.matchedHospitalId ? (
                      <>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{caseData.matchedHospitalId.name}</div>
                        <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {caseData.matchedHospitalId.specialties?.join(', ')} · {caseData.matchedHospitalId.icuBeds} ICU beds
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>Not yet matched</div>
                    )}
                  </div>

                  <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Readiness Checklist
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {readinessChecklist.map((item) => (
                        <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                          <input type="checkbox" defaultChecked={item.done} readOnly />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionBlock>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CenterMessage({ text, isError }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isError ? 'var(--tier-critical)' : 'var(--text-muted)', fontSize: '0.95rem',
    }}>
      {text}
    </div>
  )
}

function ETABadge({ eta }) {
  const color = eta.isArriving ? 'var(--tier-urgent)' : 'var(--accent-telecom)'
  return (
    <div className="mono" style={{
      display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color,
      border: `1px solid ${color}`, borderRadius: 999, padding: '5px 14px', fontWeight: 600,
    }}>
      <Timer size={14} /> ETA {eta.display}
    </div>
  )
}

function SectionBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.92rem' }}>{value}</div>
    </div>
  )
}