// Real BP cuffs and thermometers give periodic readings, not a live continuous wave —
// so this card intentionally has no animated line, just the number and a subtle status dot.
export default function StatCard({ label, value, unit, accent, subtext }) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            animation: 'pulse-dot 2.4s ease-in-out infinite',
          }}
        />
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
      <div
        className="mono"
        style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 'auto' }}
      >
        {subtext || 'Periodic reading'}
      </div>
    </div>
  )
}