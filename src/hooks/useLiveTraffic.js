import { useEffect, useState } from 'react'

// Simulates the "many phones feeding live speed data" concept behind real
// traffic apps — traffic level drifts on its own over time instead of being
// manually set, so the map reacts the way a real navigation app would.
const LEVELS = ['clear', 'moderate', 'heavy']

export function useLiveTraffic(autoMode) {
  const [level, setLevel] = useState('clear')
  const [manualLevel, setManualLevel] = useState(null)

  useEffect(() => {
    if (!autoMode) return

    const id = setInterval(() => {
      setLevel((prev) => {
        const idx = LEVELS.indexOf(prev)
        // Random walk: mostly stays or moves one step, occasionally jumps -
        // mimics how real traffic gradually builds and clears rather than
        // teleporting between states.
        const roll = Math.random()
        let nextIdx = idx
        if (roll < 0.35) nextIdx = Math.min(2, idx + 1)
        else if (roll < 0.6) nextIdx = Math.max(0, idx - 1)
        return LEVELS[nextIdx]
      })
    }, 8000)

    return () => clearInterval(id)
  }, [autoMode])

  const activeLevel = autoMode ? level : manualLevel || 'clear'

  return { level: activeLevel, setManualLevel, isAuto: autoMode }
}