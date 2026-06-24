import { useState } from 'react'
import { Search, Filter, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react'

const SEVERITIES = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'dangerous', label: 'Danger' },
]

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'verified', label: 'Verified' },
  { value: 'reported-to-council', label: 'Reported to Council' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'reopened', label: 'Reopened' },
]

export default function Sidebar({ filters, onFiltersChange, onSearch, potholes, user }) {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const stats = {
    total: potholes.length,
    dangerous: potholes.filter(p => p.severity === 'dangerous' && p.status !== 'fixed').length,
    fixed: potholes.filter(p => p.status === 'fixed').length,
    myReports: potholes.filter(p => p.reportedBy === user.id).length,
  }

  if (collapsed) {
    return (
      <div className="sidebar sidebar--collapsed">
        <button className="sidebar-toggle" onClick={() => setCollapsed(false)} title="Expand sidebar">
          <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-header-label">Filters &amp; Search</span>
        <button className="sidebar-toggle" onClick={() => setCollapsed(true)} title="Collapse sidebar">
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="sidebar-section">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Postcode or town..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch(query)}
          />
          <button className="search-go" onClick={() => onSearch(query)}>Go</button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Filter size={13} /> Filters
        </h3>
        <div className="filter-group">
          <span className="filter-label">Severity</span>
          <div className="filter-pill-row">
            {SEVERITIES.map(s => (
              <button
                key={s.value}
                className={`filter-pill filter-pill--${s.value} ${filters.severity === s.value ? 'active' : ''}`}
                onClick={() => onFiltersChange({ ...filters, severity: s.value })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Status</span>
          <select
            className="filter-select"
            value={filters.status}
            onChange={e => onFiltersChange({ ...filters, status: e.target.value })}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <BarChart2 size={13} /> Overview
        </h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-card--danger">
            <span className="stat-value">{stats.dangerous}</span>
            <span className="stat-label">Active Danger</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-value">{stats.fixed}</span>
            <span className="stat-label">Fixed</span>
          </div>
          <div className="stat-card stat-card--primary">
            <span className="stat-value">{stats.myReports}</span>
            <span className="stat-label">My Reports</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section sidebar-legend">
        <h3 className="sidebar-title">Legend</h3>
        <div className="legend-list">
          <div className="legend-item"><span className="legend-dot legend-dot--low" /> Low severity</div>
          <div className="legend-item"><span className="legend-dot legend-dot--medium" /> Medium severity</div>
          <div className="legend-item"><span className="legend-dot legend-dot--dangerous" /> Dangerous</div>
          <div className="legend-item"><span className="legend-dot legend-dot--fixed" /> Fixed</div>
        </div>
      </div>
    </aside>
  )
}
