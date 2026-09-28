import { useState } from 'react'
import { useVitalsSimulator } from '../hooks/useVitalsSimulator.js'
import { useCaseData } from '../hooks/useCaseData.js'
import { useLiveTraffic } from '../hooks/useLiveTraffic.js'
import VitalCard from '../components/VitalCard.jsx'
import PlethCard from '../components/PlethCard.jsx'
import StatCard from '../components/StatCard.jsx'
import TierBadge from '../components/TierBadge.jsx'
import ConnectionStatus from '../components/ConnectionStatus.jsx'
import TransmissionLink from '../components/TransmissionLink.jsx'
import HospitalMatchCard from '../components/HospitalMatchCard.jsx'
import RouteMap from '../components/RouteMap.jsx'
import LiveRouteMap from '../components/LiveRouteMap.jsx'
import { Wifi, Radio, Satellite } from 'lucide-react'

const PRESET_OPTIONS = ['DRIFT', 'STABLE', 'URGENT', 'CRITICAL']
const API_BASE = 'http://localhost:5000/api'
const DEMO_CASE_ID = 'VRA-2026-0417'

export default function AmbulanceDashboard() {
  const { caseData, loading, error } = useCaseData(DEMO_CASE_ID)

  const [preset, setPreset] = useState('DRIFT')
  const [connMode, setConnMode] = useState('live')
  const { vitals, news2Points, tier, isBuffering } = useVitalsSimulator(
    preset,
    3000,
    DEMO_CASE_ID,
    'ambulance',
    connMode
  )

  const [matches, setMatches] = useState(null)
  const [matchError, setMatchError] = useState('')
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [selectedHospitalId, setSelectedHospitalId] = useState(null)
  const [confirmedMatch, setConfirmedMatch] = useState(null)

  const [autoTraffic, setAutoTraffic] = useState(true)
  const { level: trafficLevel, setManualLevel } = useLiveTraffic(autoTraffic)

  function fetchMatches() {
    setLoadingMatches(true)
    setMatchError('')
    fetch(`${API_BASE}/match/${DEMO_CASE_ID}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (!result.ok) {
          setMatchError(result.data.error || 'Could not find matches')
        } else {
          setMatches(result.data.topMatches)
        }
        setLoadingMatches(false)
      })
      .catch(() => {
        setMatchError('Could not reach the server')
        setLoadingMatches(false)
      })
  }

  function confirmSelection() {
    if (!selectedHospitalId) return
    fetch(`${API_BASE}/match/${DEMO_CASE_ID}/select`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalId: selectedHospitalId }),
    })
      .then((res) => res.json())
      .then(() => {
        const match = matches.find((m) => m.hospital._id === selectedHospitalId)
        setConfirmedMatch(match)
      })
      .catch(() => setMatchError('Could not confirm selection'))
  }

  if (loading) {
    return <CenterMessage text="Loading case data..." />
  }

  if (error || !caseData) {
    return <CenterMessage text={error || 'No case data found'} isError />
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginBottom: 4 }}>
            {caseData.caseId}
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Ambulance Console</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ConnectionStatus mode={connMode === 'sos' ? 'sms' : 'live'} />
          <TierBadge tier={tier} points={news2Points} size="lg" />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <TransmissionLink
          mode={connMode === 'sos' ? 'sms' : 'live'}
          label={connMode === 'live' ? 'TRANSMITTING' : (isBuffering ? 'SMS FALLBACK · BUFFERING' : 'SMS FALLBACK')}
        />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
          <VitalCard label="Heart Rate" value={vitals.hr} unit="bpm" accent="var(--tier-critical)" />
          <PlethCard label="SpO₂" value={vitals.spo2} unit="%" accent="var(--accent-telecom)" />
          <StatCard label="Systolic BP" value={vitals.systolic} unit="mmHg" accent="var(--tier-urgent)" subtext="Cuff reading · every 60s" />
          <StatCard label="Temperature" value={vitals.tempC} unit="°C" accent="var(--tier-stable)" subtext="Probe reading · every 30s" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Simulate scenario
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRESET_OPTIONS.map((p) => (
                <button key={p} onClick={() => setPreset(p)} style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${preset === p ? 'var(--accent-telecom)' : 'var(--line)'}`,
                  background: preset === p ? 'var(--bg-panel)' : 'transparent',
                  color: preset === p ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.76rem',
                }}>
                  {p === 'DRIFT' ? 'Drift → Critical' : p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Connectivity
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setConnMode('live')} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 0', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${connMode === 'live' ? 'var(--accent-telecom)' : 'var(--line)'}`,
                background: connMode === 'live' ? 'var(--bg-panel)' : 'transparent',
                color: connMode === 'live' ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.78rem',
              }}>
                <Wifi size={13} /> WiFi/BLE
              </button>
              <button onClick={() => setConnMode('sos')} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 0', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${connMode === 'sos' ? 'var(--tier-urgent)' : 'var(--line)'}`,
                background: connMode === 'sos' ? 'var(--bg-panel)' : 'transparent',
                color: connMode === 'sos' ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.78rem',
              }}>
                <Radio size={13} /> SMS Fallback
              </button>
            </div>
            {connMode === 'sos' && (
              <div className="mono" style={{ marginTop: 8, fontSize: '0.7rem', color: 'var(--tier-urgent)' }}>
                Batching updates every ~18s instead of live streaming
              </div>
            )}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Hospital Match">
        {!matches && !confirmedMatch && (
          <button
            onClick={fetchMatches}
            disabled={loadingMatches}
            style={{
              padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600, fontSize: '0.85rem',
              cursor: loadingMatches ? 'default' : 'pointer', opacity: loadingMatches ? 0.7 : 1,
            }}
          >
            {loadingMatches ? 'Finding hospitals...' : 'Find Matching Hospitals'}
          </button>
        )}

        {matchError && (
          <div style={{
            background: 'var(--tier-critical-dim)', border: '1px solid var(--tier-critical)',
            color: 'var(--tier-critical)', borderRadius: 'var(--radius-sm)', padding: '10px 14px',
            fontSize: '0.82rem', marginTop: 12,
          }}>
            {matchError}
          </div>
        )}

        {matches && !confirmedMatch && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {matches.map((m) => (
                <HospitalMatchCard
                  key={m.hospital._id}
                  match={m}
                  selected={selectedHospitalId === m.hospital._id}
                  onSelect={() => setSelectedHospitalId(m.hospital._id)}
                />
              ))}
            </div>
            <button
              onClick={confirmSelection}
              disabled={!selectedHospitalId}
              style={{
                padding: '10px 24px', borderRadius: 'var(--radius-sm)', border: 'none',
                background: selectedHospitalId ? 'var(--accent-telecom)' : 'var(--line)',
                color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                cursor: selectedHospitalId ? 'pointer' : 'default',
              }}
            >
              Confirm Selection
            </button>
          </div>
        )}

        {confirmedMatch && (
          <>
            <RouteMap
              hospitalName={confirmedMatch.hospital.name}
              distanceKm={confirmedMatch.distanceKm}
              etaMinutes={Math.max(3, Math.round(confirmedMatch.distanceKm * 3))}
            />
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <button onClick={() => setAutoTraffic(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${autoTraffic ? 'var(--accent-telecom)' : 'var(--line)'}`,
                  background: autoTraffic ? 'var(--bg-panel-raised)' : 'transparent',
                  color: autoTraffic ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.78rem',
                }}>
                  <Satellite size={13} /> Live Traffic (auto)
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {['clear', 'moderate', 'heavy'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { setAutoTraffic(false); setManualLevel(lvl) }}
                      style={{
                        padding: '6px 12px', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize',
                        border: `1px solid ${!autoTraffic && trafficLevel === lvl ? 'var(--tier-urgent)' : 'var(--line)'}`,
                        background: !autoTraffic && trafficLevel === lvl ? 'var(--bg-panel-raised)' : 'transparent',
                        color: !autoTraffic && trafficLevel === lvl ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.76rem',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {autoTraffic && (
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 10 }}>
                  Simulating live crowdsourced traffic — updates every ~8s, same concept as real navigation apps
                </div>
              )}

              <LiveRouteMap
                pickup={caseData.pickupLocation}
                hospital={confirmedMatch.hospital.location}
                hospitalName={confirmedMatch.hospital.name}
                trafficLevel={trafficLevel}
                tier={tier}
              />
            </div>
          </>
        )}
      </SectionBlock>
    </div>
  )
}

function CenterMessage({ text, isError }) {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isError ? 'var(--tier-critical)' : 'var(--text-muted)', fontSize: '0.95rem',
    }}>
      {text}
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