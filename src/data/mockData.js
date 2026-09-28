export const activeCase = {
  caseId: 'VRA-2026-0417',
  patientAge: 54,
  patientSex: 'Male',
  chiefComplaint: 'Chest pain, breathlessness',
  pickupLocation: 'MG Road, Bengaluru',
  dispatchTime: '14:32',
  paramedicNotes:
    'Conscious, responsive. Reports sudden onset chest pain ~20 min ago. History of hypertension.',
  timeline: [
    { label: 'Call received', time: '14:29', done: true },
    { label: 'Ambulance dispatched', time: '14:32', done: true },
    { label: 'Vitals streaming started', time: '14:35', done: true },
    { label: 'Hospital matched', time: '14:37', done: true },
    { label: 'En route', time: '14:38', done: true },
    { label: 'Arrival (ETA)', time: '14:53', done: false },
  ],
}

export const hospitals = [
  {
    id: 'H1',
    name: 'St. Xavier General Hospital',
    distanceKm: 4.2,
    specialty: 'Cardiac, Trauma',
    icuBeds: 3,
    matchScore: 0.91,
    eta: '15 min',
  },
  {
    id: 'H2',
    name: 'Sunrise Multispecialty',
    distanceKm: 6.8,
    specialty: 'Trauma, General',
    icuBeds: 1,
    matchScore: 0.74,
    eta: '22 min',
  },
  {
    id: 'H3',
    name: 'City Care Institute',
    distanceKm: 3.1,
    specialty: 'General',
    icuBeds: 0,
    matchScore: 0.52,
    eta: '11 min',
  },
]

export const incomingCases = [
  {
    caseId: 'VRA-2026-0417',
    tier: 'CRITICAL',
    eta: '15 min',
    summary: '54M, chest pain, suspected cardiac event',
  },
  {
    caseId: 'VRA-2026-0418',
    tier: 'URGENT',
    eta: '27 min',
    summary: '29F, road traffic accident, fractured limb',
  },
  {
    caseId: 'VRA-2026-0419',
    tier: 'STABLE',
    eta: '40 min',
    summary: '61M, fall at home, minor injuries',
  },
]

export const readinessChecklist = [
  { label: 'Cardiac specialist paged', done: true },
  { label: 'ICU bed reserved', done: true },
  { label: 'Crash cart staged', done: false },
  { label: 'Blood type on standby', done: false },
]