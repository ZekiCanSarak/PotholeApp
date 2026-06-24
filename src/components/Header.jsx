import { MapPin, User, Award } from 'lucide-react'

export default function Header({ user, onProfileClick }) {
  return (
    <header className="header">
      <div className="header-logo">
        <MapPin size={22} strokeWidth={2.5} />
        <h1>PotholePal</h1>
        <span className="header-tagline">UK Road Hazard Tracker</span>
      </div>
      <button className="header-profile-btn" onClick={onProfileClick}>
        <Award size={16} />
        <span className="header-points">{user.points} pts</span>
        <div className="header-avatar">
          <User size={16} />
        </div>
      </button>
    </header>
  )
}
