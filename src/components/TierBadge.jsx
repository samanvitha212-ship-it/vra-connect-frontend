const TIER_COLORS = {
  STABLE: 'var(--tier-stable)',
  URGENT: 'var(--tier-urgent)',
  CRITICAL: 'var(--tier-critical)',
}

const TIER_DIM = {
  STABLE: 'var(--tier-stable-dim)',
  URGENT: 'var(--tier-urgent-dim)',
  CRITICAL: 'var(--tier-critical-dim)',
}

export default function TierBadge({ tier, points, size = 'md' }) {
  const color = TIER_COLORS[tier] || 'var(--text-muted)'
  const dim = TIER_DIM[tier] || 'var(--bg-panel-raised)'

  const pad = size === 'lg' ? '10px 20px' : '4px 12px'
  const fontSize = size === 'lg' ? '1.1rem' : '0.75rem'

  return (
    <span
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: pad,
        borderRadius: 999,
        background: dim,
        color: color,
        border: `1px solid ${color}`,
        fontWeight: 600,
        fontSize,
        letterSpacing: '0.04em',
        boxShadow: `0 0 16px -4px ${color}`,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: 'pulse-dot 1.4s ease-in-out infinite',
        }}
      />
      {tier}
      {typeof points === 'number' && <span style={{ opacity: 0.7 }}>· {points} pts</span>}
    </span>
  )
}