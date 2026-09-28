import { NavLink } from 'react-router-dom'
import { Activity, User, Building2, Radio } from 'lucide-react'

const links = [
  { to: '/vitals', label: 'Vitals', icon: Activity },
  { to: '/patient', label: 'Patient', icon: User },
  { to: '/hospital', label: 'Hospital', icon: Building2 },
]

export default function NavBar() {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--line)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--accent-telecom-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio size={16} color="var(--accent-telecom)" />
          </div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700 }}>VRA Connect</h1>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginLeft: 38 }}>
          Ops Console
        </div>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '8px 12px',
          flex: 1,
        }}
      >
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg-panel-raised)' : 'transparent',
              borderLeft: isActive
                ? '3px solid var(--accent-telecom)'
                : '3px solid transparent',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)' }}>
        <div
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.72rem',
            color: 'var(--tier-stable)',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--tier-stable)',
            }}
          />
          WIFI LINK ACTIVE
        </div>
      </div>
    </aside>
  )
}