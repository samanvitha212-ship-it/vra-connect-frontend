function scoreHeartRate(hr) {
  if (hr <= 40 || hr >= 131) return 3
  if (hr <= 50 || hr >= 111) return 2
  if (hr <= 55 || hr >= 91) return 1
  return 0
}

function scoreSpO2(spo2) {
  if (spo2 <= 91) return 3
  if (spo2 <= 93) return 2
  if (spo2 <= 95) return 1
  return 0
}

function scoreSystolicBP(sbp) {
  if (sbp <= 90 || sbp >= 220) return 3
  if (sbp <= 100) return 2
  if (sbp <= 110) return 1
  return 0
}

function scoreTemp(tempC) {
  if (tempC <= 35.0) return 3
  if (tempC >= 39.1) return 2
  if (tempC <= 36.0 || tempC >= 38.1) return 1
  return 0
}

export function computeNews2({ hr, spo2, systolic, tempC }) {
  const points =
    scoreHeartRate(hr) + scoreSpO2(spo2) + scoreSystolicBP(systolic) + scoreTemp(tempC)

  let tier = 'STABLE'
  if (points >= 7) tier = 'CRITICAL'
  else if (points >= 5) tier = 'URGENT'

  return { points, tier }
}