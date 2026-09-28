import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Send, ArrowLeft } from 'lucide-react'
import { generateRandomCase } from '../data/caseGenerator.js'

const API_BASE = 'http://localhost:5000/api'

export default function CaseGenerator() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(generateRandomCase())
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  function regenerate() {
    setDraft(generateRandomCase())
    setStatus('')
  }

  function createCase() {
    setSaving(true)
    setStatus('')

    const { _meta, ...payload } = draft

    fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (!result.ok) {
          setStatus('error:' + (result.data.error || 'Failed to create case'))
        } else {
          setStatus('success:' + result.data.caseId)
        }
        setSaving(false)
      })
      .catch(() => {
        setStatus('error:Could not reach the server')
        setSaving(false)
      })
  }

  const severityColor =
    draft._meta.severity === 'high'
      ? 'var(--tier-critical)'
      : draft._meta.severity === 'medium'
      ? 'var(--tier-urgent)'
      : 'var(--tier-stable)'

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: '0.82rem', marginBottom: 20, cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to home
        </div>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-telecom)', letterSpacing: '0.08em', marginBottom: 8 }}>
          INTERNAL TOOL
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Case Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>
          Generates a realistic emergency case with patient info, complaint, and pickup location, then saves it to the database.
        </p>

        <div style={{
          background: 'linear-gradient(180deg, var(--bg-panel-raised), var(--bg-panel))',
          border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-card)', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>{draft.caseId}</span>
            <span className="mono" style={{
              fontSize: '0.72rem', color: severityColor, border: `1px solid ${severityColor}`,
              borderRadius: 999, padding: '3px 10px', textTransform: 'uppercase',
            }}>
              {draft._meta.severity} severity
            </span>
          </div>

          <FieldRow label="Age / Sex" value={`${draft.patientAge} · ${draft.patientSex}`} />
          <FieldRow label="Chief Complaint" value={draft.chiefComplaint} />
          <FieldRow label="Inferred Specialty" value={draft._meta.specialty} />
          <FieldRow label="Pickup Location" value={draft.pickupLocation.address} />
          <FieldRow label="Paramedic Notes" value={draft.paramedicNotes} />
        </div>

        {status && (
          <div style={{
            background: status.startsWith('success') ? 'var(--tier-stable-dim)' : 'var(--tier-critical-dim)',
            border: `1px solid ${status.startsWith('success') ? 'var(--tier-stable)' : 'var(--tier-critical)'}`,
            color: status.startsWith('success') ? 'var(--tier-stable)' : 'var(--tier-critical)',
            borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16,
          }}>
            {status.startsWith('success')
              ? `Case ${status.split(':')[1]} created successfully.`
              : status.split(':')[1]}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={regenerate} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)',
            background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.88rem',
          }}>
            <RefreshCw size={15} /> Regenerate
          </button>
          <button onClick={createCase} disabled={saving} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px 0', borderRadius: 'var(--radius-sm)', border: 'none',
            background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600, fontSize: '0.88rem',
            opacity: saving ? 0.7 : 1, cursor: saving ? 'default' : 'pointer',
          }}>
            <Send size={15} /> {saving ? 'Saving...' : 'Create Case'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', textAlign: 'right' }}>{value}</span>
    </div>
  )
}