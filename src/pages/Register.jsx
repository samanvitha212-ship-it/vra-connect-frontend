import { useParams } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'

export default function Register() {
  const { role } = useParams()
  return <AuthForm role={role} mode="register" />
}