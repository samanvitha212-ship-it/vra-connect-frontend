import { Navigate } from 'react-router-dom'

// Wraps a dashboard route. If there's no token, redirect to the correct login page.
// If there IS a token but it's for the wrong role, also redirect (e.g. hospital user
// trying to load the ambulance dashboard by typing the URL directly).
export default function ProtectedRoute({ requiredRole, children }) {
  const token = localStorage.getItem('vra_token')
  const role = localStorage.getItem('vra_role')

  if (!token) {
    return <Navigate to={`/login/${requiredRole}`} replace />
  }

  if (role !== requiredRole) {
    return <Navigate to={`/login/${requiredRole}`} replace />
  }

  return children
}