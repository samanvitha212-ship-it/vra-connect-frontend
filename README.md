# VRA Connect — Frontend

Real-time hierarchical triage, hospital-matching, and adaptive-routing framework for connected ambulance dispatch. This is the React client for VRA Connect.

## Tech Stack
- React (Vite)
- Socket.io-client (real-time vitals/status updates)
- Leaflet (live map rendering and routing)
- Browser-native Speech-to-Text / Text-to-Speech APIs (voice call-intake)

## Features
- **Ambulance Dashboard** — live vitals, current severity tier, matched hospital, route/ETA
- **Hospital Dashboard** — incoming case details, live vitals feed, readiness status
- **Patient / Vitals Dashboard** — real-time vitals monitoring view
- **Dispatcher View** — voice-based call-intake agent for emergency call handling
- **Case Generator** — internal tool to generate randomized test cases
- **Reroute Simulator** — internal tool to test the adaptive reroute engine
- **Login / Register** — role-based authentication (ambulance / hospital)

## Getting Started

```bash
npm install
npm run dev
```

App runs by default at `http://localhost:5173`.

## Environment
Make sure the backend server (see [vra-connect-backend](https://github.com/samanvitha212-ship-it/vra-connect-backend)) is running, and update the API/socket base URL in `src/socket.js` if needed.

## Project Structure
```
src/
  components/   → reusable UI components
  hooks/        → custom React hooks (vitals simulator, live traffic, speech, etc.)
  pages/        → route-level pages (dashboards, login, register, etc.)
  utils/        → triage logic, call-extraction helpers
  data/         → mock/generated case data
```