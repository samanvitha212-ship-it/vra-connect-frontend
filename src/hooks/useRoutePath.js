import { useEffect, useState } from 'react'

// Requests the primary route PLUS alternate routes from OSRM's free public server.
export function useRoutePath(pickup, hospital) {
  const [primaryPath, setPrimaryPath] = useState(null)
  const [alternatePath, setAlternatePath] = useState(null)
  const [primaryDurationMin, setPrimaryDurationMin] = useState(null)
  const [alternateDurationMin, setAlternateDurationMin] = useState(null)
  const [distanceKm, setDistanceKm] = useState(null)

  useEffect(() => {
    if (!pickup || !hospital) return

    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${hospital.lng},${hospital.lat}?overview=full&geometries=geojson&alternatives=true`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.routes || data.routes.length === 0) return

        const sorted = [...data.routes].sort((a, b) => a.duration - b.duration)
        const primary = sorted[0]
        const alternate = sorted[1] || sorted[0]

        setPrimaryPath(primary.geometry.coordinates.map(([lng, lat]) => [lat, lng]))
        setAlternatePath(alternate.geometry.coordinates.map(([lng, lat]) => [lat, lng]))
        setPrimaryDurationMin(Math.round(primary.duration / 60))
        setAlternateDurationMin(Math.round(alternate.duration / 60))
        setDistanceKm(Math.round((primary.distance / 1000) * 10) / 10)
      })
      .catch(() => {})
  }, [pickup?.lat, pickup?.lng, hospital?.lat, hospital?.lng])

  return { primaryPath, alternatePath, primaryDurationMin, alternateDurationMin, distanceKm }
}