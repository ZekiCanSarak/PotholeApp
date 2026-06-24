# PotholePal — UK Road Hazard Tracker

A map-based web app for reporting, tracking, and verifying potholes across the UK. Built with React and OpenStreetMap so anyone can pinpoint a pothole, upload a photo, and help keep roads safe for drivers and cyclists.

---

## Features

### Live Pothole Map
An interactive UK map showing every reported pothole as a coloured pin. Colours reflect severity at a glance — yellow for low, orange for medium, red for dangerous, and green once fixed. Dangerous potholes render slightly larger so they stand out in dense areas.

### Report a Pothole
Click the red **Report Pothole** button to open the report panel. You can:
- Place the marker by clicking directly on the map, or use GPS to auto-detect your location
- Upload a photo (automatically compressed before saving)
- Set severity (low / medium / dangerous)
- Select road type (main road, side road, cycle lane, car park)
- Add a description and any vehicle damage caused

### Verification System
Other users can hit **Confirm** on any pothole they've seen themselves. Once a report reaches 3 confirmations it is automatically promoted to **Verified**. This filters out inaccurate or duplicate reports over time.

### Status Tracking
Every pothole moves through a clear lifecycle:

| Status | Meaning |
|---|---|
| New | Just reported, unconfirmed |
| Verified | 3+ users confirmed it |
| Reported to Council | Flagged to the local authority |
| In Progress | Council repair scheduled or underway |
| Fixed | Repaired — can be reopened if it reappears |
| Reopened | Was fixed but the issue has returned |

### Gamification
Helping the community earns you points and unlocks badges:

| Action | Points |
|---|---|
| Report a pothole | +10 |
| Confirm another report | +5 |
| Your report gets verified | +20 bonus |
| Mark a pothole as fixed | +30 |

**Badges you can earn:**
- 🚧 First Report
- 🔍 Pothole Hunter Level 5
- 🛡️ Road Guardian (10 reports)
- 🚴 Cyclist Protector (report on a cycle lane)
- ✅ Top Confirmer (5 confirmations)
- 🔧 The Fixer

Click your points total in the top-right to open your profile and see your badge collection.

### Search & Filters
- Search by postcode or town name to fly the map to that location (powered by the OpenStreetMap Nominatim API, UK-restricted)
- Filter the map by severity or status using the left sidebar
- Collapse the sidebar to give the map more room

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and run

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

---

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 |
| Build tool | Vite |
| Map | React Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Geocoding | Nominatim (OpenStreetMap) |
| Storage | Browser localStorage (no backend required) |

---

## Project Structure

```
src/
  components/
    Header.jsx          — logo and user points chip
    Sidebar.jsx         — search, filters, stats, legend
    PotholeMap.jsx      — Leaflet map with custom severity markers
    PotholePopup.jsx    — in-map popup with confirm/fix/reopen actions
    ReportPanel.jsx     — slide-in form for new reports
    UserProfileModal.jsx — points breakdown and badge collection
    Toast.jsx           — animated notification
  data/
    samplePotholes.js   — 12 seeded reports across UK cities
  utils/
    gamification.js     — points constants and badge logic
    imageUtils.js       — canvas-based photo compression
    storage.js          — localStorage read/write helpers
  App.jsx               — top-level state and layout
```

---

## Data & Privacy

All data is stored in your browser's `localStorage` — nothing is sent to a server. Clearing your browser data will reset the app to the 12 sample potholes.

---

## Future Ideas

- Backend API + shared database so reports are visible to all users
- FixMyStreet integration to forward verified reports to the relevant council automatically
- Push notifications when a pothole you reported changes status
- Heatmap view for areas with high pothole density
- Mobile app (React Native with the same core logic)
