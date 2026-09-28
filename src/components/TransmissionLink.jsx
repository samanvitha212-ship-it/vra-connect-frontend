import { Ambulance, Building2, Wifi, Radio } from 'lucide-react'

export default function TransmissionLink({ mode = 'live', label }) {
  const isLive = mode === 'live'
  const color = isLive ? 'var(--accent-telecom)' : 'var(--tier-urgent)'
  const speed = isLive ? '2.2s' : '4.5s'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 22px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <IconBadge icon={Ambulance} color={color} pulsing />

      <div style={{ flex: 1, position: 'relative', height: 20 }}>
        <svg width="100%" height="20" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id={`fade-${mode}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={`glow-${mode}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base track */}
          <line
            x1="0" y1="10" x2="100%" y2="10"
            stroke="var(--line)" strokeWidth="2"
            strokeDasharray={isLive ? '0' : '5 5'}
          />

          {/* Traveling glow trail behind the packet */}
          <rect x="0" y="6" width="60" height="8" fill={`url(#fade-${mode})`}>
            <animate attributeName="x" values="-60;100%" dur={speed} repeatCount="indefinite" />
          </rect>

          {/* The packet itself */}
          <circle cy="10" r="4.5" fill={color} filter={`url(#glow-${mode})`}>
            <animate attributeName="cx" values="0%;100%" dur={speed} repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <IconBadge icon={Building2} color={color} />

      <div
        className="mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.75rem',
          color,
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        {isLive ? <Wifi size={14} /> : <Radio size={14} />}
        {label || (isLive ? 'LIVE — WiFi/BLE' : 'SMS FALLBACK')}
      </div>
    </div>
  )
}

function IconBadge({ icon: Icon, color, pulsing }) {
  return (
    <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
      {pulsing && (
        <>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: 10,
            border: `1px solid ${color}`, animation: 'link-pulse-ring 2s ease-out infinite',
          }} />
          <span style={{
            position: 'absolute', inset: 0, borderRadius: 10,
            border: `1px solid ${color}`, animation: 'link-pulse-ring 2s ease-out 1s infinite',
          }} />
        </>
      )}
      <div style={{
        position: 'relative', width: 38, height: 38, borderRadius: 10,
        background: 'var(--bg-panel-raised)', border: `1px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
    </div>
  )
}