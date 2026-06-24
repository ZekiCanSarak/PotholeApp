import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import PotholePopup from './PotholePopup'

function markerIcon(severity, status) {
  const colors = { low: '#f59e0b', medium: '#f97316', dangerous: '#ef4444' }
  const fill = status === 'fixed' ? '#22c55e' : (colors[severity] ?? '#94a3b8')
  const size = severity === 'dangerous' && status !== 'fixed' ? 28 : 24
  const half = size / 2
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${fill};
      border:3px solid rgba(255,255,255,0.95);
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -(half + 4)],
  })
}

function pickingIcon() {
  return L.divIcon({
    html: `<div style="
      width:32px;height:32px;
      background:rgba(37,99,235,0.6);
      border:3px solid #2563eb;
      border-radius:50%;
      box-shadow:0 0 0 6px rgba(37,99,235,0.18);
    "></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 })
  }, [center, zoom]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function MapClickHandler({ pickingLocation, onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    },
  })
  return null
}

export default function PotholeMap({
  potholes,
  center,
  zoom,
  pickingLocation,
  reportLocation,
  onMapClick,
  onConfirm,
  onMarkFixed,
  onReopen,
  userId,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={pickingLocation ? 'leaflet-picking' : ''}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} zoom={zoom} />
      <MapClickHandler pickingLocation={pickingLocation} onMapClick={onMapClick} />

      {potholes.map(p => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={markerIcon(p.severity, p.status)}>
          <Popup maxWidth={310} className="custom-popup">
            <PotholePopup
              pothole={p}
              userId={userId}
              onConfirm={onConfirm}
              onMarkFixed={onMarkFixed}
              onReopen={onReopen}
            />
          </Popup>
        </Marker>
      ))}

      {pickingLocation && reportLocation && (
        <Marker position={[reportLocation.lat, reportLocation.lng]} icon={pickingIcon()} />
      )}
    </MapContainer>
  )
}
