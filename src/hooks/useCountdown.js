import { useEffect, useState } from 'react'

// Counts down from an initial number of seconds. Returns { minutes, seconds, isArriving }.
export function useCountdown(initialSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return {
    minutes,
    seconds,
    isArriving: secondsLeft <= 60,
    display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
  }
}