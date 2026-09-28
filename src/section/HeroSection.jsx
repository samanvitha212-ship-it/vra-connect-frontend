import FadeIn from '../components/FadeIn'
import PulseLine from '../components/PulseLine'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: '2rem 2.5rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', color: 'var(--ink-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>VRA CONNECT</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#problem">Problem</a>
          <a href="#solution">Solution</a>
          <a href="#how">How it works</a>
          <a href="#roadmap">Roadmap</a>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 900 }}>
        <FadeIn delay={0.1}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--monitor-green)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>
            EMERGENCY RESPONSE NETWORK
          </span>
        </FadeIn>
        <FadeIn delay={0.2}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.05, margin: '0.8rem 0' }}>
            Every second counts.<br />We connect them.
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-dim)', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.6 }}>
            VRA Connect links patients, ambulances, traffic signals and hospitals
            into one triage-and-dispatch network — built to fit inside medicine's golden hour.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--ink-dim)', textDecoration: 'line-through', fontSize: '1.5rem' }}>35 MIN</span>
            <ArrowRight size={20} color="var(--ink-dim)" />
            <span style={{ color: 'var(--monitor-green)', fontSize: '2rem', fontWeight: 600, animation: 'ticker-blink 2s infinite' }}>12 MIN</span>
            <span style={{ color: 'var(--ink-dim)', fontSize: '0.75rem' }}>TARGET AVG. RESPONSE</span>
          </div>
        </div>
        <PulseLine />
        <button style={{ background: 'var(--vital-red)', color: '#fff', border: 'none', padding: '0.9rem 2rem', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>
          See how it works
        </button>
      </FadeIn>
    </section>
  )
}