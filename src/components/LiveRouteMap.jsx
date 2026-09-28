import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useRoutePath } from '../hooks/useRoutePath.js'

const API_BASE = 'http://localhost:5000/api'

function dotIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 0 8px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function bearingDeg(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(toRad(lat2))
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// Simple arrowhead marker, matching the clean single-line style.
function arrowIcon(color, angleDeg) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
      transform: rotate(${angleDeg}deg); color: ${color}; font-size: 18px; line-height: 1;
      filter: drop-shadow(0 0 4px ${color});
    ">&#9650;</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const TRAFFIC_COLORS = { clear: '#4c8dff', moderate: '#ffb84d', heavy: '#ff5470' }
const TRAFFIC_DELAY_MIN = { clear: 0, moderate: 8, heavy: 18 }

export default function LiveRouteMap({ pickup, hospital, hospitalName, trafficLevel, tier }) {
  const { primaryPath, alternatePath, primaryDurationMin, alternateDurationMin, distanceKm } =
    useRoutePath(pickup, hospital)

  const [rerouteResult, setRerouteResult] = useState(null)

  useEffect(() => {
    if (!primaryDurationMin || !alternateDurationMin) return
    const trafficDelayMinutes = TRAFFIC_DELAY_MIN[trafficLevel] || 0

    fetch(`${API_BASE}/reroute/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentEtaMinutes: primaryDurationMin,
        alternateEtaMinutes: alternateDurationMin,
        trafficDelayMinutes,
        tier: tier || 'STABLE',
      }),
    })
      .then((res) => res.json())
      .then((data) => setRerouteResult(data))
      .catch(() => {})
  }, [trafficLevel, tier, primaryDurationMin, alternateDurationMin])

  if (!pickup || !hospital) {
    return (
      <div style={{
        height: 300, borderRadius: 'var(--radius-md)', border: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-faint)', fontSize: '0.85rem', background: 'var(--bg-panel)',
      }}>
        Route data not available
      </div>
    )
  }

  const level = trafficLevel || 'clear'
  const routeColor = TRAFFIC_COLORS[level] || TRAFFIC_COLORS.clear
  const isRerouted = rerouteResult?.shouldReroute

  const pickupPos = [pickup.lat, pickup.lng]
  const hospitalPos = [hospital.lat, hospital.lng]
  const centerLat = (pickup.lat + hospital.lat) / 2
  const centerLng = (pickup.lng + hospital.lng) / 2

  const activePath = isRerouted && alternatePath ? alternatePath : primaryPath
  const linePositions = activePath && activePath.length > 0 ? activePath : [pickupPos, hospitalPos]
  const midPoint = linePositions[Math.floor(linePositions.length / 2)]
  const angle = bearingDeg(pickup.lat, pickup.lng, hospital.lat, hospital.lng)

  return (
    <div style={{
      borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-card)', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 500,
        background: 'rgba(10,15,28,0.9)', border: `1px solid ${routeColor}`,
        borderRadius: 999, padding: '4px 12px', fontSize: '0.72rem', color: routeColor,
        fontWeight: 600, textTransform: 'capitalize',
      }} className="mono">
        {level} traffic
      </div>

      {distanceKm && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 500,
          background: 'rgba(10,15,28,0.9)', border: '1px solid var(--line)',
          borderRadius: 999, padding: '4px 12px', fontSize: '0.72rem', color: 'var(--text-primary)',
        }} className="mono">
          {distanceKm} km · {isRerouted ? alternateDurationMin : primaryDurationMin} min
        </div>
      )}

      {isRerouted && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 500,
          background: 'rgba(52,199,123,0.15)', border: '1px solid var(--tier-stable)',
          borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '0.75rem', color: '#fff',
        }} className="mono">
          REROUTED — was {primaryDurationMin} min, now {alternateDurationMin} min (saved {rerouteResult.timeSaved} min)
        </div>
      )}

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: 300, width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        <Polyline
          positions={linePositions}
          pathOptions={{ color: routeColor, weight: 5, opacity: 0.95, lineCap: 'round' }}
        />

        <Marker position={pickupPos} icon={dotIcon('#ff5470')}>
          <Popup>Pickup: {pickup.address || 'Ambulance location'}</Popup>
        </Marker>
        {midPoint && <Marker position={midPoint} icon={arrowIcon(routeColor, angle)} />}
        <Marker position={hospitalPos} icon={dotIcon('#4c8dff')}>
          <Popup>{hospitalName || 'Matched Hospital'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}