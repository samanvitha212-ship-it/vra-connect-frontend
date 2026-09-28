import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CaseGenerator from './pages/CaseGenerator.jsx'
import RerouteSimulator from './pages/RerouteSimulator.jsx'
import DispatcherView from './pages/DispatcherView.jsx'
import AmbulanceDashboard from './pages/AmbulanceDashboard.jsx'
import HospitalDashboard from './pages/HospitalDashboard.jsx'

const PUBLIC_PREFIXES = ['/', '/login', '/register', '/tools', '/dispatcher']

export default function App() {
  const location = useLocation()
  const isPublicPage = PUBLIC_PREFIXES.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  )

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/tools/case-generator" element={<CaseGenerator />} />
        <Route path="/tools/reroute-simulator" element={<RerouteSimulator />} />
        <Route path="/dispatcher" element={<DispatcherView />} />
      </Routes>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route
            path="/ambulance/dashboard"
            element={
              <ProtectedRoute requiredRole="ambulance">
                <AmbulanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/dashboard"
            element={
              <ProtectedRoute requiredRole="hospital">
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}