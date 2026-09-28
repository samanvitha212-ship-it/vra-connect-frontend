import { Ambulance, Building2 } from 'lucide-react'

// A simplified visual route indicator (not a real map/tiles) — shows the
// ambulance-to-hospital path with distance and ETA. A real map (Leaflet, etc.)
// can replace this later; the data contract (distanceKm, etaMinutes) stays the same.
export default function RouteMap({ hospitalName, distanceKm, etaMinutes }) {
  return (
    <div style={{
      background: 'var(--bg-panel)', border: '1px solid var(--line)',
      borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
        Route to {hospitalName}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconBadge icon={Ambulance} />

        <div style={{ flex: 1, position: 'relative', height: 4 }}>
          <svg width="100%" height="4" style={{ display: 'block', overflow: 'visible' }}>
            <line x1="0" y1="2" x2="100%" y2="2" stroke="var(--accent-telecom)" strokeWidth="2" strokeDasharray="6 5" />
            <circle cy="2" r="4" fill="var(--accent-telecom)">
              <animate attributeName="cx" values="0%;100%" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <IconBadge icon={Building2} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
        <Stat label="Distance" value={`${distanceKm} km`} />
        <Stat label="Est. Arrival" value={`${etaMinutes} min`} />
      </div>
    </div>
  )
}

function IconBadge({ icon: Icon }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, background: 'var(--bg-panel-raised)',
      border: '1px solid var(--accent-telecom)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={18} color="var(--accent-telecom)" />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 4 }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{value}</div>
    </div>
  )
}