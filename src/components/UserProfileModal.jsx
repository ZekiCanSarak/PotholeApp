import { X } from 'lucide-react'
import { BADGES, POINTS } from '../utils/gamification'

export default function UserProfileModal({ user, potholes, onClose }) {
  const myReports = potholes.filter(p => p.reportedBy === user.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__value">{user.points}</span>
            <span className="profile-stat__label">Points</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{user.reportsCount}</span>
            <span className="profile-stat__label">Reports</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{user.confirmationsCount}</span>
            <span className="profile-stat__label">Confirmations</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{user.fixedCount ?? 0}</span>
            <span className="profile-stat__label">Fixed</span>
          </div>
        </div>

        <div className="points-section">
          <h3>Earning Points</h3>
          <table className="points-table">
            <tbody>
              <tr><td>Report a pothole</td><td>+{POINTS.REPORT} pts</td></tr>
              <tr><td>Confirm another report</td><td>+{POINTS.CONFIRM} pts</td></tr>
              <tr><td>Your report gets verified</td><td>+{POINTS.VERIFIED_BONUS} pts</td></tr>
              <tr><td>Mark a pothole as fixed</td><td>+{POINTS.FIXED_UPDATE} pts</td></tr>
            </tbody>
          </table>
        </div>

        <div className="badges-section">
          <h3>Badges</h3>
          <div className="badges-grid">
            {Object.values(BADGES).map(badge => {
              const earned = user.badges.includes(badge.id)
              return (
                <div key={badge.id} className={`badge-card ${earned ? 'badge-card--earned' : 'badge-card--locked'}`}>
                  <span className="badge-emoji">{earned ? badge.emoji : '🔒'}</span>
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-desc">{badge.description}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
