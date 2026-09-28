import { useNavigate } from 'react-router-dom'
import { Radio, LogOut } from 'lucide-react'

export default function NavBar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('vra_token')
    localStorage.removeItem('vra_role')
    navigate('/')
  }

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: 'var(--bg-panel)', borderRight: '1px solid var(--line)',
      minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-telecom-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={16} color="var(--accent-telecom)" />
          </div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700 }}>VRA Connect</h1>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          borderRadius: 'var(--radius-sm)', border: '1px solid var(--tier-critical)', background: 'transparent',
          color: 'var(--tier-critical)', fontSize: '0.88rem', fontWeight: 600,
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}