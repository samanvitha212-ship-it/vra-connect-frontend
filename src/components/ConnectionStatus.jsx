export default function ConnectionStatus({ mode = 'live' }) {
  const isLive = mode === 'live'
  const color = isLive ? 'var(--tier-stable)' : 'var(--tier-urgent)'
  const label = isLive ? 'LIVE — WiFi/BLE' : 'SMS FALLBACK'

  return (
    <div
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.72rem',
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: '3px 10px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
        }}
      />
      {label}
    </div>
  )
}