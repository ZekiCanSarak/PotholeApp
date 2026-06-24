import { ThumbsUp, Wrench, RotateCcw, Calendar, MapPin, AlertTriangle, Car } from 'lucide-react'

const SEVERITY_COLOR = { low: '#f59e0b', medium: '#f97316', dangerous: '#ef4444' }
const STATUS_COLOR = {
  new: '#64748b',
  verified: '#2563eb',
  'reported-to-council': '#7c3aed',
  'in-progress': '#d97706',
  fixed: '#16a34a',
  reopened: '#dc2626',
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtStatus(s) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function PotholePopup({ pothole, userId, onConfirm, onMarkFixed, onReopen }) {
  const alreadyConfirmed = pothole.confirmedBy.includes(userId)
  const isMyReport = pothole.reportedBy === userId
  const canConfirm = !alreadyConfirmed && !isMyReport && pothole.status !== 'fixed'
  const isFixed = pothole.status === 'fixed'

  return (
    <div className="popup-inner">
      {pothole.photo && (
        <img src={pothole.photo} alt="Pothole photo" className="popup-photo" />
      )}

      <div className="popup-badges">
        <span className="badge" style={{ background: SEVERITY_COLOR[pothole.severity] }}>
          {pothole.severity.toUpperCase()}
        </span>
        <span className="badge" style={{ background: STATUS_COLOR[pothole.status] }}>
          {fmtStatus(pothole.status)}
        </span>
      </div>

      <p className="popup-desc">{pothole.description}</p>

      <div className="popup-meta">
        <span><MapPin size={11} /> {pothole.address}</span>
        <span><Calendar size={11} /> {fmtDate(pothole.dateReported)}</span>
        <span><AlertTriangle size={11} /> {pothole.roadType?.replace(/-/g, ' ')}</span>
        {pothole.vehicleDamage && (
          <span><Car size={11} /> {pothole.vehicleDamage}</span>
        )}
      </div>

      <div className="popup-confirms">
        <ThumbsUp size={13} />
        <span>
          {pothole.confirmations} confirmation{pothole.confirmations !== 1 ? 's' : ''}
        </span>
        {pothole.confirmations >= 3 && (
          <span className="verified-chip">Verified</span>
        )}
      </div>

      <div className="popup-actions">
        {canConfirm && (
          <button className="btn btn--primary btn--sm" onClick={() => onConfirm(pothole.id)}>
            <ThumbsUp size={13} /> Confirm +5 pts
          </button>
        )}
        {alreadyConfirmed && !isFixed && (
          <span className="already-confirmed">You confirmed this</span>
        )}
        {!isFixed && (
          <button className="btn btn--success btn--sm" onClick={() => onMarkFixed(pothole.id)}>
            <Wrench size={13} /> Mark Fixed +30 pts
          </button>
        )}
        {isFixed && (
          <>
            <div className="fixed-banner">Road has been repaired!</div>
            <button className="btn btn--warn btn--sm" onClick={() => onReopen(pothole.id)}>
              <RotateCcw size={13} /> Reopen
            </button>
          </>
        )}
      </div>
    </div>
  )
}
