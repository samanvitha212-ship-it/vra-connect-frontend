import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:5000/api'

export function useCasesList() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/cases`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (result.ok) {
          setCases(result.data)
        } else {
          setError(result.data.error || 'Failed to load cases')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Could not reach the server')
        setLoading(false)
      })
  }, [])

  return { cases, loading, error }
}