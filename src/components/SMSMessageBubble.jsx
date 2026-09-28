import { MessageSquare, Clock } from 'lucide-react'

export default function SMSMessageBubble({ vitals, tier, receivedAt }) {
  const time = receivedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      background: 'var(--bg-panel)', border: '1px solid var(--tier-urgent)',
      borderRadius: 'var(--radius-md)', padding: '16px 18px', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--tier-urgent)' }}>
        <MessageSquare size={15} />
        <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em' }}>
          INCOMING SMS — AMBULANCE UNIT
        </span>
      </div>

      <div style={{
        background: 'var(--bg-panel-raised)', borderRadius: '14px 14px 14px 2px',
        padding: '12px 16px', maxWidth: '85%', marginBottom: 8,
      }}>
        <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          VITALS UPDATE — Tier: {tier}
          <br />
          HR {vitals.hr} · SpO2 {vitals.spo2}% · BP {vitals.systolic} · Temp {vitals.tempC}C
        </div>
      </div>

      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: 'var(--text-faint)' }}>
        <Clock size={11} /> Received {time} via SMS store-and-forward
      </div>
    </div>
  )
}