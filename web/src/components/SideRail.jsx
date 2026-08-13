import logoImage from '../img/image.png'

export default function SideRail({ copy, activeView, onSelectNav }) {
  const navItems = [
    { key: 'dashboard', label: copy.dashboard.navDashboard },
    { key: 'shipments', label: copy.dashboard.navShipments },
    { key: 'live-map', label: copy.dashboard.navLiveMap },
    { key: 'details', label: copy.dashboard.navDetails },
    { key: 'warehouse', label: copy.dashboard.navWarehouse },
    { key: 'settings', label: copy.dashboard.navSettings },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <img className="sidebar__logo-image" src={logoImage} alt="JOSTech" />
        </div>
        <div>
          <strong>{copy.dashboard.brand}</strong>
          <p>{copy.dashboard.brandSub}</p>
        </div>
      </div>

      <button type="button" className="sidebar__cta">
        +
        <span>{copy.dashboard.newShipment}</span>
      </button>

      <nav className="sidebar__nav" aria-label={copy.dashboard.navDashboard}>
        {navItems.map((item, index) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar__nav-item ${activeView === item.key || (!activeView && index === 0) ? 'is-active' : ''}`}
            onClick={() => onSelectNav?.(item.key)}
          >
            <span className="sidebar__dot" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        {/* <div className="sidebar__status">
          <span className="sidebar__status-dot" />
          <div>
            <strong>{copy.dashboard.support}</strong>
            <p>{copy.dashboard.notifications}</p>
          </div>
        </div> */}
        <div className="sidebar__user">
          <div className="sidebar__avatar">OM</div>
          <div>
            <strong>{copy.dashboard.profile}</strong>
            <p>Online</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
