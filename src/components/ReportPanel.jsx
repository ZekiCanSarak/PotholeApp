import { useState, useEffect } from 'react'
import { X, MapPin, Navigation, Camera, AlertCircle } from 'lucide-react'
import { compressImage } from '../utils/imageUtils'

const SEVERITIES = ['low', 'medium', 'dangerous']
const ROAD_TYPES = ['main-road', 'side-road', 'cycle-lane', 'car-park']

export default function ReportPanel({ location, onClose, onSubmit, onPickLocation, onGPSLocation }) {
  const [form, setForm] = useState({
    description: '',
    severity: 'medium',
    roadType: 'main-road',
    vehicleDamage: '',
    photo: null,
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [location])

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const compressed = await compressImage(file)
      setForm(f => ({ ...f, photo: compressed }))
      setPhotoPreview(compressed)
    } catch {
      setError('Failed to process image')
    }
  }

  function handleGPS() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        onGPSLocation(pos.coords.latitude, pos.coords.longitude)
        setGpsLoading(false)
      },
      () => {
        setError('Could not get your location. Try picking on the map.')
        setGpsLoading(false)
      },
      { timeout: 8000 },
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!location) {
      setError('Please pick a location using GPS or by clicking the map.')
      return
    }
    if (!form.description.trim()) {
      setError('Please add a description.')
      return
    }

    let address = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`,
      )
      const data = await res.json()
      if (data.display_name) {
        address = data.display_name.split(',').slice(0, 3).join(',').trim()
      }
    } catch { /* use coordinate fallback */ }

    onSubmit({ lat: location.lat, lng: location.lng, address, ...form })
  }

  return (
    <div className="report-panel">
      <div className="panel-header">
        <h2>Report a Pothole</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        {/* Location */}
        <div className="form-group">
          <label className="form-label">Location *</label>
          <div className="location-row">
            <button type="button" className="btn btn--outline" onClick={handleGPS} disabled={gpsLoading}>
              <Navigation size={14} /> {gpsLoading ? 'Getting GPS…' : 'Use GPS'}
            </button>
            <button type="button" className="btn btn--outline" onClick={onPickLocation}>
              <MapPin size={14} /> Pick on Map
            </button>
          </div>
          {location ? (
            <div className="location-set">
              <MapPin size={13} />
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          ) : (
            <div className="location-hint">No location selected yet</div>
          )}
        </div>

        {/* Photo */}
        <div className="form-group">
          <label className="form-label">Photo (optional)</label>
          <label className="photo-upload">
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <Camera size={28} />
                <span>Tap to upload</span>
              </div>
            )}
          </label>
        </div>

        {/* Severity */}
        <div className="form-group">
          <label className="form-label">Severity *</label>
          <div className="severity-row">
            {SEVERITIES.map(s => (
              <button
                key={s}
                type="button"
                className={`severity-btn severity-btn--${s} ${form.severity === s ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, severity: s }))}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Road Type */}
        <div className="form-group">
          <label className="form-label">Road Type *</label>
          <select
            className="form-select"
            value={form.roadType}
            onChange={e => setForm(f => ({ ...f, roadType: e.target.value }))}
          >
            {ROAD_TYPES.map(t => (
              <option key={t} value={t}>
                {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the pothole — size, depth, nearby landmark..."
            rows={3}
          />
        </div>

        {/* Vehicle Damage */}
        <div className="form-group">
          <label className="form-label">Vehicle Damage (optional)</label>
          <input
            className="form-input"
            type="text"
            value={form.vehicleDamage}
            onChange={e => setForm(f => ({ ...f, vehicleDamage: e.target.value }))}
            placeholder="e.g. Damaged front tyre"
          />
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--full">
          Submit Report  +10 pts
        </button>
      </form>
    </div>
  )
}
