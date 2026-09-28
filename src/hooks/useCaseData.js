import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:5000/api'

export function useCaseData(caseId) {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!caseId) return

    setLoading(true)
    setError('')

    fetch(`${API_BASE}/cases/${caseId}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (!result.ok) {
          setError(result.data.error || 'Case not found')
        } else {
          setCaseData(result.data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Could not reach the server')
        setLoading(false)
      })
  }, [caseId])

  return { caseData, loading, error }
}