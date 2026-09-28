import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Building2, ArrowRight } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

export default function AuthForm({ role, mode }) {
  const navigate = useNavigate()
  const isAmbulance = role === 'ambulance'
  const isLogin = mode === 'login'
  const Icon = isAmbulance ? Activity : Building2

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    ambulanceId: '',
    vehicleNumber: '',
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhoneNumber: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm(function (f) {
      const next = Object.assign({}, f)
      next[field] = value
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = isLogin ? '/auth/login' : '/auth/register'
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : Object.assign({ role: role }, form)

    fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data }
        })
      })
      .then(function (result) {
        if (!result.ok) {
          setError(result.data.error || 'Something went wrong')
          setLoading(false)
          return
        }
        localStorage.setItem('vra_token', result.data.token)
        localStorage.setItem('vra_role', result.data.user.role)
        navigate(isAmbulance ? '/ambulance/dashboard' : '/hospital/dashboard')
      })
      .catch(function () {
        setError('Could not reach the server. Is the backend running?')
        setLoading(false)
      })
  }

  function switchMode() {
    navigate(isLogin ? '/register/' + role : '/login/' + role)
  }

  function goHome() {
    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 420,
          background: 'linear-gradient(180deg, var(--bg-panel-raised) 0%, var(--bg-panel) 100%)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: 'var(--accent-telecom-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <Icon size={22} color="var(--accent-telecom)" />
        </div>

        <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{isLogin ? 'Sign In' : 'Register'}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
          {isAmbulance ? 'Ambulance Team' : 'Hospital Team'} access
        </p>

        {error ? (
          <div style={{
            background: 'var(--tier-critical-dim)', border: '1px solid var(--tier-critical)',
            color: 'var(--tier-critical)', borderRadius: 'var(--radius-sm)', padding: '10px 14px',
            fontSize: '0.82rem', marginBottom: 16,
          }}>
            {error}
          </div>
        ) : null}

        {!isLogin && isAmbulance ? (
          <div>
            <Field label="Full Name" value={form.fullName} onChange={function (v) { updateField('fullName', v) }} placeholder="Ramesh Kumar" />
            <Field label="Phone Number" type="tel" value={form.phoneNumber} onChange={function (v) { updateField('phoneNumber', v) }} placeholder="+91 98765 43210" />
            <Field label="Ambulance ID" value={form.ambulanceId} onChange={function (v) { updateField('ambulanceId', v) }} placeholder="AMB-KA-0417" />
            <Field label="Vehicle Number" value={form.vehicleNumber} onChange={function (v) { updateField('vehicleNumber', v) }} placeholder="KA-05-AB-1234" />
          </div>
        ) : null}

        {!isLogin && !isAmbulance ? (
          <div>
            <Field label="Hospital Name" value={form.hospitalName} onChange={function (v) { updateField('hospitalName', v) }} placeholder="St. Xavier General Hospital" />
            <Field label="Hospital Address" value={form.hospitalAddress} onChange={function (v) { updateField('hospitalAddress', v) }} placeholder="MG Road, Bengaluru" />
            <Field label="Hospital Phone Number" type="tel" value={form.hospitalPhoneNumber} onChange={function (v) { updateField('hospitalPhoneNumber', v) }} placeholder="+91 80 4567 8900" />
          </div>
        ) : null}

        <Field label="Email" type="email" value={form.email} onChange={function (v) { updateField('email', v) }} placeholder="you@example.com" />
        <Field label="Password" type="password" value={form.password} onChange={function (v) { updateField('password', v) }} placeholder="dummy" />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', marginTop: 10, padding: '11px 0', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--accent-telecom)', color: '#fff', fontWeight: 600,
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: loading ? 0.7 : 1, cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          {loading ? null : <ArrowRight size={15} />}
        </button>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isLogin ? 'No account yet? ' : 'Already registered? '}
          <span onClick={switchMode} style={{ color: 'var(--accent-telecom)', fontWeight: 600, cursor: 'pointer' }}>
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </div>

        <div onClick={goHome} style={{ marginTop: 14, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)', cursor: 'pointer' }}>
          Back to home
        </div>
      </form>
    </div>
  )
}

function Field(props) {
  const label = props.label
  const placeholder = props.placeholder
  const value = props.value
  const onChange = props.onChange
  const inputType = props.type ? props.type : 'text'

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6,
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {label}
      </label>
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={function (e) { onChange(e.target.value) }}
        required
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--line)', background: 'var(--bg-deep)', color: 'var(--text-primary)',
          fontSize: '0.9rem', outline: 'none',
        }}
      />
    </div>
  )
}