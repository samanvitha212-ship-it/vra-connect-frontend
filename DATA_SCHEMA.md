# VRA Connect — Data Schema (Phase 0)

This document defines the shared data contracts every subsystem (vitals simulator, triage engine, matching engine, backend, dashboard, voice agent) must follow. Every team member should build against these exact field names and types — this prevents integration pain later.

Status: **Draft v1** — locked once the team reviews it. Change only with team agreement, since backend/frontend/AI all depend on it.

---

## 1. `VitalsPacket`

One reading, sent roughly every 5 seconds while a case is active (simulated for hackathon; real sensors later).

| Field | Type | Example | Notes |
|---|---|---|---|
| `caseId` | string | `"VRA-2026-0417"` | Links this packet to a `CaseRecord` |
| `timestamp` | ISO 8601 string | `"2026-08-09T14:35:00Z"` | UTC |
| `hr` | number (bpm) | `108` | Heart rate |
| `spo2` | number (%) | `93` | Oxygen saturation |
| `systolicBP` | number (mmHg) | `98` | Systolic blood pressure |
| `diastolicBP` | number (mmHg) | `64` | Optional for v1 scoring, useful to display |
| `tempC` | number (°C) | `38.3` | Body temperature |
| `source` | enum | `"simulated"` \| `"sensor"` \| `"manual"` | Marks data provenance — important for the "honest engineering" story |
| `transmissionMode` | enum | `"live"` \| `"sms_store_forward"` | Reflects the telecom fallback path |

**Derived, not stored on the packet itself** (computed by the triage engine when it consumes a packet):
- `news2Points` (number)
- `tier` (`"STABLE"` \| `"URGENT"` \| `"CRITICAL"`)

---

## 2. `CaseRecord`

One emergency case, from call to handoff.

| Field | Type | Example | Notes |
|---|---|---|---|
| `caseId` | string | `"VRA-2026-0417"` | Primary key |
| `status` | enum | `"dispatched"` \| `"en_route"` \| `"matched"` \| `"arrived"` \| `"closed"` | Case lifecycle state machine (Phase 4) |
| `patientAge` | number | `54` | |
| `patientSex` | enum | `"male"` \| `"female"` \| `"other"` \| `"unknown"` | |
| `chiefComplaint` | string | `"Chest pain, breathlessness"` | From voice agent's first 2 fields |
| `paramedicNotes` | string | free text | Enriched conversationally after dispatch |
| `pickupLocation` | object | `{ lat, lng, address }` | |
| `currentTier` | enum | `"STABLE"` \| `"URGENT"` \| `"CRITICAL"` | Latest computed tier |
| `latestVitals` | `VitalsPacket` | — | Most recent reading (denormalized for quick dashboard reads) |
| `matchedHospitalId` | string \| null | `"H1"` | Set once Phase 3 matching runs |
| `etaMinutes` | number \| null | `15` | |
| `dispatchTime` | ISO 8601 string | — | |
| `timeline` | array of `{ label, time, done }` | — | Drives the Patient dashboard's status view |

---

## 3. `Hospital`

One entry in the mock hospital registry.

| Field | Type | Example | Notes |
|---|---|---|---|
| `hospitalId` | string | `"H1"` | Primary key |
| `name` | string | `"St. Xavier General Hospital"` | |
| `location` | object | `{ lat, lng }` | For distance/routing calc |
| `specialties` | array of string | `["Cardiac", "Trauma"]` | Used in matching formula |
| `icuBeds` | number | `3` | Live-updating in a real system; static mock for now |
| `generalBeds` | number | `12` | |
| `matchScoreWeights` | — | not stored per-hospital | Weights (`w1`, `w2`, `w3`) live in the matching engine config, not on each hospital record |

---

## Open items for the team to confirm

- [ ] Exact reroute trigger condition for Phase 6 (AI routing) — not yet finalized, flagged in project summary
- [ ] Whether `diastolicBP` factors into NEWS2 scoring or is display-only (currently display-only in the v1 rule engine)
- [ ] Confirm field names above with whoever builds the backend (Samanvitha) before Phase 1 vitals simulator is wired to it

---

**Once this doc is agreed on, Phase 0 is done.** Next: Phase 1 — Simulated Vitals Generator, built to emit exactly the `VitalsPacket` shape defined above.
