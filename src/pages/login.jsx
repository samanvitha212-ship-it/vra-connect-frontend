import { useParams } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'

export default function Login() {
  const { role } = useParams()
  return <AuthForm role={role} mode="login" />
}