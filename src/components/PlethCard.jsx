// Plethysmograph shape: smooth rounded pulse wave (SpO2), not spiky like ECG.
const PLETH_UNIT = 'M0,24 C6,24 8,6 14,6 C20,6 20,30 28,30 C34,30 36,24 40,24'

function buildPlethPath(repeats = 4) {
  let d = ''
  for (let i = 0; i < repeats; i++) {
    const offsetX = i * 40
    const unit = PLETH_UNIT.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (m, x, _1, y) => {
      return `${Number(x) + offsetX},${y}`
    })
    d += (i === 0 ? unit : unit.replace('M', 'L')) + ' '
  }
  return d.trim()
}

export default function PlethCard({ label, value, unit, accent }) {
  const glowId = `glow-${label.replace(/\s/g, '')}`
  const path = buildPlethPath(8)

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--bg-panel-raised) 0%, var(--bg-panel) 100%)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 156,
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 4,
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <div
        style={{
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          key={value}
          className="mono"
          style={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1, animation: 'value-tick 0.4s ease' }}
        >
          {value}
        </span>
        <span className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.9rem' }}>
          {unit}
        </span>
      </div>

      <div style={{ width: '100%', height: 44, overflow: 'hidden' }}>
        <svg
          viewBox="0 0 80 36"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '100%', animation: 'ecg-scroll 2.6s linear infinite' }}
        >
          <defs>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={path}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.9"
            filter={`url(#${glowId})`}
          />
        </svg>
      </div>
    </div>
  )
}