const ECG_UNIT =
  'M0,20 L10,20 L14,20 L17,8 L20,32 L23,2 L26,20 L30,20 L40,20 ' +
  'L50,20 L54,20 L57,8 L60,32 L63,2 L66,20 L70,20 L80,20'

function buildEcgPath(repeats = 6) {
  let d = ''
  for (let i = 0; i < repeats; i++) {
    const offsetX = i * 80
    const unit = ECG_UNIT.replace(/([ML])(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (m, cmd, x, _1, y) => {
      return `${cmd}${Number(x) + offsetX},${y}`
    })
    d += unit + ' '
  }
  return d.trim()
}

export default function VitalCard({ label, value, unit, accent }) {
  const glowId = `glow-${label.replace(/\s/g, '')}`
  const ecgPath = buildEcgPath(6)

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
          style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1,
            animation: 'value-tick 0.4s ease',
          }}
        >
          {value}
        </span>
        <span className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.9rem' }}>
          {unit}
        </span>
      </div>

      <div style={{ width: '100%', height: 44, overflow: 'hidden' }}>
        <svg
          viewBox="0 0 160 40"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '100%', animation: 'ecg-scroll 2.2s linear infinite' }}
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
            d={ecgPath}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            filter={`url(#${glowId})`}
          />
        </svg>
      </div>
    </div>
  )
}