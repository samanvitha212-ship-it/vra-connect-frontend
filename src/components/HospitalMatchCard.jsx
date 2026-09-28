import { Building2, MapPin, BedDouble } from 'lucide-react'

export default function HospitalMatchCard({ match, selected, onSelect }) {
  const h = match.hospital
  const isSelected = selected

  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected
          ? 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))'
          : 'var(--bg-panel)',
        border: `1px solid ${isSelected ? 'var(--accent-telecom)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 0 0 2px var(--accent-telecom-soft)' : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: 'var(--accent-telecom-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Building2 size={16} color="var(--accent-telecom)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{h.name}</div>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
              {h.specialties.join(', ')}
            </div>
          </div>
        </div>
        <div className="mono" style={{
          fontSize: '0.72rem', color: 'var(--tier-stable)', border: '1px solid var(--tier-stable)',
          borderRadius: 999, padding: '2px 10px',
        }}>
          match {Math.round(match.score * 100)}%
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin size={13} /> {match.distanceKm} km
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <BedDouble size={13} /> {h.icuBeds} ICU · {h.generalBeds} general
        </span>
      </div>
    </div>
  )
}