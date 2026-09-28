import { useEffect, useRef, useState } from 'react'
import { computeNews2 } from '../utils/triage.js'
import { socket } from '../socket.js'

function drift(value, min, max, step) {
  const delta = (Math.random() - 0.5) * step
  const next = value + delta
  return Math.min(max, Math.max(min, next))
}

const PRESETS = {
  STABLE: { hr: 78, spo2: 98, systolic: 118, tempC: 36.8 },
  URGENT: { hr: 108, spo2: 93, systolic: 98, tempC: 38.3 },
  CRITICAL: { hr: 132, spo2: 89, systolic: 82, tempC: 35.6 },
}

const LIVE_TICK_MS = 3000
const SOS_BATCH_MS = 18000

export function useVitalsSimulator(preset, intervalMs, caseId, role, connMode) {
  const activePreset = preset || 'DRIFT'
  const activeCaseId = caseId || 'VRA-2026-0417'
  const activeRole = role || 'ambulance'
  const activeConnMode = connMode || 'live'

  const base = activePreset === 'DRIFT' ? PRESETS.STABLE : PRESETS[activePreset]
  const [vitals, setVitals] = useState(base)
  const [history, setHistory] = useState([base])
  const [lastTransmissionMode, setLastTransmissionMode] = useState('live')
  const tickRef = useRef(0)
  const prevPresetRef = useRef(activePreset)

  useEffect(() => {
    socket.emit('joinCase', activeCaseId)
  }, [activeCaseId])

  useEffect(() => {
    if (activeRole !== 'ambulance') return
    if (prevPresetRef.current === activePreset) return
    prevPresetRef.current = activePreset

    if (activePreset === 'DRIFT') {
      tickRef.current = 0
      setVitals(PRESETS.STABLE)
      setHistory((h) => [...h.slice(-19), PRESETS.STABLE])
    } else {
      const target = PRESETS[activePreset]
      const snapped = {
        hr: drift(target.hr, target.hr - 3, target.hr + 3, 2),
        spo2: drift(target.spo2, target.spo2 - 1, target.spo2 + 1, 0.6),
        systolic: drift(target.systolic, target.systolic - 3, target.systolic + 3, 2),
        tempC: drift(target.tempC, target.tempC - 0.2, target.tempC + 0.2, 0.1),
      }
      setVitals(snapped)
      setHistory((h) => [...h.slice(-19), snapped])
    }
  }, [activePreset, activeRole])

  useEffect(() => {
    if (activeRole !== 'hospital') return

    function onUpdate(payload) {
      if (payload.caseId !== activeCaseId) return
      const next = {
        hr: payload.hr,
        spo2: payload.spo2,
        systolic: payload.systolicBP,
        tempC: payload.tempC,
      }
      setVitals(next)
      setHistory((h) => [...h.slice(-19), next])
      setLastTransmissionMode(payload.transmissionMode || 'live')
    }

    socket.on('vitalsUpdate', onUpdate)
    return () => socket.off('vitalsUpdate', onUpdate)
  }, [activeRole, activeCaseId])

  useEffect(() => {
    if (activeRole !== 'ambulance') return

    const sendIntervalMs = activeConnMode === 'sos' ? SOS_BATCH_MS : LIVE_TICK_MS
    let ticksSinceLastSend = 0
    const sendEveryNTicks = Math.max(1, Math.round(sendIntervalMs / LIVE_TICK_MS))

    const id = setInterval(() => {
      tickRef.current += 1
      ticksSinceLastSend += 1

      setVitals((prev) => {
        let target = activePreset === 'DRIFT' ? PRESETS.CRITICAL : PRESETS[activePreset]
        const driftFactor = activePreset === 'DRIFT' ? Math.min(tickRef.current / 20, 1) : 0.15

        const next = {
          hr: drift(prev.hr + (target.hr - prev.hr) * 0.02 * driftFactor, 40, 160, 3),
          spo2: drift(prev.spo2 + (target.spo2 - prev.spo2) * 0.02 * driftFactor, 80, 100, 0.6),
          systolic: drift(prev.systolic + (target.systolic - prev.systolic) * 0.02 * driftFactor, 70, 180, 2.5),
          tempC: drift(prev.tempC + (target.tempC - prev.tempC) * 0.02 * driftFactor, 34.5, 40, 0.15),
        }

        const rounded = {
          hr: Math.round(next.hr),
          spo2: Math.round(next.spo2),
          systolic: Math.round(next.systolic),
          tempC: Math.round(next.tempC * 10) / 10,
        }
        const { tier } = computeNews2(rounded)

        if (activeConnMode === 'live') {
          setHistory((h) => [...h.slice(-19), next])
          socket.emit('vitalsUpdate', {
            caseId: activeCaseId,
            hr: rounded.hr,
            spo2: rounded.spo2,
            systolicBP: rounded.systolic,
            tempC: rounded.tempC,
            tier,
            transmissionMode: 'live',
          })
        } else {
          if (ticksSinceLastSend >= sendEveryNTicks) {
            ticksSinceLastSend = 0
            setHistory((h) => [...h.slice(-19), next])
            socket.emit('vitalsUpdate', {
              caseId: activeCaseId,
              hr: rounded.hr,
              spo2: rounded.spo2,
              systolicBP: rounded.systolic,
              tempC: rounded.tempC,
              tier,
              transmissionMode: 'sms_store_forward',
            })
          }
        }

        return next
      })
    }, LIVE_TICK_MS)

    return () => clearInterval(id)
  }, [activePreset, activeCaseId, activeRole, activeConnMode])

  const rounded = {
    hr: Math.round(vitals.hr),
    spo2: Math.round(vitals.spo2),
    systolic: Math.round(vitals.systolic),
    tempC: Math.round(vitals.tempC * 10) / 10,
  }

  const { points, tier } = computeNews2(rounded)

  return {
    vitals: rounded,
    history,
    news2Points: points,
    tier,
    isBuffering: activeConnMode === 'sos' && activeRole === 'ambulance',
    lastTransmissionMode,
  }
}