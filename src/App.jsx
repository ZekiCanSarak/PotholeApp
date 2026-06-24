import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import PotholeMap from './components/PotholeMap'
import ReportPanel from './components/ReportPanel'
import UserProfileModal from './components/UserProfileModal'
import Toast from './components/Toast'
import { loadPotholes, savePotholes, loadUser, saveUser } from './utils/storage'
import { POINTS, BADGES, checkNewBadges } from './utils/gamification'
import { samplePotholes } from './data/samplePotholes'
import './App.css'

function generateId() {
  return 'u-' + Math.random().toString(36).slice(2, 9)
}

const DEFAULT_USER = {
  id: generateId(),
  points: 0,
  badges: [],
  reportsCount: 0,
  confirmationsCount: 0,
  fixedCount: 0,
}

export default function App() {
  const [potholes, setPotholes] = useState(() => loadPotholes() ?? samplePotholes)
  const [user, setUser] = useState(() => loadUser() ?? DEFAULT_USER)
  const [showReport, setShowReport] = useState(false)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [reportLocation, setReportLocation] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [filters, setFilters] = useState({ severity: 'all', status: 'all' })
  const [mapCenter, setMapCenter] = useState([51.505, -0.09])
  const [mapZoom, setMapZoom] = useState(10)
  const [toast, setToast] = useState(null)

  useEffect(() => { savePotholes(potholes) }, [potholes])
  useEffect(() => { saveUser(user) }, [user])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const awardUser = useCallback((updatedUser, updatedPotholes, extraMsg) => {
    const newBadgeIds = checkNewBadges(updatedUser, updatedPotholes)
    if (newBadgeIds.length > 0) {
      updatedUser = { ...updatedUser, badges: [...updatedUser.badges, ...newBadgeIds] }
      const names = newBadgeIds
        .map(id => Object.values(BADGES).find(b => b.id === id)?.name)
        .filter(Boolean)
      showToast(`Badge earned: ${names.join(', ')}!`, 'badge')
    } else if (extraMsg) {
      showToast(extraMsg)
    }
    setUser(updatedUser)
  }, [showToast])

  const addPothole = useCallback((data) => {
    const newPothole = {
      id: 'p-' + Date.now(),
      ...data,
      status: 'new',
      confirmations: 0,
      confirmedBy: [],
      dateReported: new Date().toISOString(),
      reportedBy: user.id,
      fixedPhoto: null,
    }
    const updatedPotholes = [newPothole, ...potholes]
    setPotholes(updatedPotholes)

    const updatedUser = {
      ...user,
      points: user.points + POINTS.REPORT,
      reportsCount: user.reportsCount + 1,
    }
    awardUser(updatedUser, updatedPotholes, `Pothole reported! +${POINTS.REPORT} pts`)
    setShowReport(false)
    setReportLocation(null)
    setMapCenter([newPothole.lat, newPothole.lng])
    setMapZoom(16)
  }, [potholes, user, awardUser])

  const confirmPothole = useCallback((id) => {
    const p = potholes.find(ph => ph.id === id)
    if (!p || p.confirmedBy.includes(user.id) || p.reportedBy === user.id) return

    const newCount = p.confirmations + 1
    const justVerified = newCount === 3
    const updatedPotholes = potholes.map(ph =>
      ph.id !== id ? ph : {
        ...ph,
        confirmations: newCount,
        confirmedBy: [...ph.confirmedBy, user.id],
        status: justVerified ? 'verified' : ph.status,
      },
    )
    setPotholes(updatedPotholes)

    const pts = POINTS.CONFIRM + (justVerified ? POINTS.VERIFIED_BONUS : 0)
    const updatedUser = {
      ...user,
      points: user.points + pts,
      confirmationsCount: user.confirmationsCount + 1,
    }
    const msg = justVerified
      ? `Confirmed & verified! +${pts} pts`
      : `Pothole confirmed! +${POINTS.CONFIRM} pts`
    awardUser(updatedUser, updatedPotholes, msg)
  }, [potholes, user, awardUser])

  const markFixed = useCallback((id) => {
    const updatedPotholes = potholes.map(p =>
      p.id !== id ? p : { ...p, status: 'fixed' },
    )
    setPotholes(updatedPotholes)

    const updatedUser = {
      ...user,
      points: user.points + POINTS.FIXED_UPDATE,
      fixedCount: (user.fixedCount ?? 0) + 1,
    }
    awardUser(updatedUser, updatedPotholes, `Marked as fixed! +${POINTS.FIXED_UPDATE} pts`)
  }, [potholes, user, awardUser])

  const reopenPothole = useCallback((id) => {
    setPotholes(prev => prev.map(p =>
      p.id !== id ? p : { ...p, status: 'reopened' },
    ))
    showToast('Pothole marked as reopened')
  }, [showToast])

  const reportToCouncil = useCallback((id) => {
    setPotholes(prev => prev.map(p =>
      p.id !== id ? p : { ...p, status: 'reported-to-council' },
    ))
    showToast('Status updated — opening FixMyStreet...')
  }, [showToast])

  const handleMapClick = useCallback((latlng) => {
    if (pickingLocation) {
      setReportLocation({ lat: latlng.lat, lng: latlng.lng })
      setPickingLocation(false)
      setShowReport(true)
    }
  }, [pickingLocation])

  const handleGPSLocation = useCallback((lat, lng) => {
    setReportLocation({ lat, lng })
    setMapCenter([lat, lng])
    setMapZoom(16)
  }, [])

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=gb&limit=1`,
      )
      const data = await res.json()
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        setMapZoom(14)
      } else {
        showToast('Location not found in UK', 'error')
      }
    } catch {
      showToast('Search failed — check your connection', 'error')
    }
  }, [showToast])

  const filtered = potholes.filter(p => {
    if (filters.severity !== 'all' && p.severity !== filters.severity) return false
    if (filters.status !== 'all' && p.status !== filters.status) return false
    return true
  })

  return (
    <div className="app">
      <Header user={user} onProfileClick={() => setShowProfile(true)} />

      <div className="app-body">
        <Sidebar
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          potholes={potholes}
          user={user}
        />

        <div className="map-wrap">
          <PotholeMap
            potholes={filtered}
            center={mapCenter}
            zoom={mapZoom}
            pickingLocation={pickingLocation}
            reportLocation={reportLocation}
            onMapClick={handleMapClick}
            onConfirm={confirmPothole}
            onMarkFixed={markFixed}
            onReopen={reopenPothole}
            onReportToCouncil={reportToCouncil}
            userId={user.id}
          />

          {pickingLocation && (
            <div className="picking-banner">
              Click anywhere on the map to mark the pothole location
              <button
                className="cancel-pick"
                onClick={() => { setPickingLocation(false); setShowReport(true) }}
              >
                Cancel
              </button>
            </div>
          )}

          {!showReport && (
            <button
              className="fab-report"
              onClick={() => { setShowReport(true); setPickingLocation(false) }}
            >
              + Report Pothole
            </button>
          )}
        </div>

        {showReport && (
          <ReportPanel
            location={reportLocation}
            onClose={() => { setShowReport(false); setReportLocation(null) }}
            onSubmit={addPothole}
            onPickLocation={() => { setPickingLocation(true); setShowReport(false) }}
            onGPSLocation={handleGPSLocation}
          />
        )}
      </div>

      {showProfile && (
        <UserProfileModal
          user={user}
          potholes={potholes}
          onClose={() => setShowProfile(false)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
