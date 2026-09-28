export default function PulseLine({ color = 'var(--vital-red)', height = 60 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline
        points="0,30 200,30 230,10 250,50 270,30 400,30 420,15 440,45 460,30 1000,30"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        style={{ animation: 'pulse-draw 2.4s ease-in-out infinite alternate' }}
      />
    </svg>
  )
}