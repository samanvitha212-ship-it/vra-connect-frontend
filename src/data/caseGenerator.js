export const COMPLAINTS = [
  { text: 'Chest pain, breathlessness', specialty: 'Cardiac', severity: 'high' },
  { text: 'Road traffic accident, suspected fracture', specialty: 'Trauma', severity: 'high' },
  { text: 'Severe allergic reaction, facial swelling', specialty: 'General', severity: 'high' },
  { text: 'Fall at home, hip pain', specialty: 'General', severity: 'medium' },
  { text: 'High fever, disorientation', specialty: 'General', severity: 'medium' },
  { text: 'Minor laceration, controlled bleeding', specialty: 'Trauma', severity: 'low' },
  { text: 'Difficulty breathing, asthma history', specialty: 'Cardiac', severity: 'high' },
  { text: 'Abdominal pain, vomiting', specialty: 'General', severity: 'medium' },
]

export const LOCATIONS = [
  { address: 'MG Road, Bengaluru', lat: 12.9716, lng: 77.5946 },
  { address: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { address: 'Whitefield, Bengaluru', lat: 12.9698, lng: 77.75 },
  { address: 'Jayanagar, Bengaluru', lat: 12.9308, lng: 77.5838 },
  { address: 'Indiranagar, Bengaluru', lat: 12.9719, lng: 77.6412 },
  { address: 'Electronic City, Bengaluru', lat: 12.8452, lng: 77.6602 },
]

export const PARAMEDIC_NOTE_TEMPLATES = {
  high: 'Patient conscious but distressed. Vitals unstable on initial assessment. Requesting priority routing.',
  medium: 'Patient conscious and responsive. Stable but requires monitoring en route.',
  low: 'Patient conscious, stable. Minor injury, routine transport.',
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateRandomCase() {
  const complaint = pickRandom(COMPLAINTS)
  const location = pickRandom(LOCATIONS)
  const age = Math.floor(Math.random() * 65) + 15
  const sex = pickRandom(['male', 'female'])

  const now = new Date()
  const caseId = `VRA-${now.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`

  return {
    caseId,
    patientAge: age,
    patientSex: sex,
    chiefComplaint: complaint.text,
    pickupLocation: location,
    paramedicNotes: PARAMEDIC_NOTE_TEMPLATES[complaint.severity],
    dispatchTime: now.toISOString(),
    _meta: { specialty: complaint.specialty, severity: complaint.severity },
  }
}