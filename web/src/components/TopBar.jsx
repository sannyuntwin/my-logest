export default function TopBar({ copy, trackingNumber, onTrackingChange, onSubmit, loadingTracking, language, setLanguage }) {
  return (
    <header className="topbar">
      <form className="topbar__search" onSubmit={onSubmit}>
        <input
          value={trackingNumber}
          onChange={(event) => onTrackingChange(event.target.value)}
          placeholder={copy.dashboard.searchPlaceholder}
          autoComplete="off"
        />
        <button type="submit" className="topbar__search-button" disabled={loadingTracking}>
          {loadingTracking ? copy.search.searching : copy.search.button}
        </button>
      </form>

      <div className="topbar__links">
        <button type="button" className="topbar__link is-active">{copy.dashboard.quickDirect}</button>
        <button type="button" className="topbar__link">{copy.dashboard.quickFleet}</button>
        <button type="button" className="topbar__link">{copy.dashboard.quickCarriers}</button>
      </div>

      <div className="topbar__actions">
        <div className="language-switcher language-switcher--compact" aria-label={copy.languageLabel}>
          <span>{copy.languageLabel}</span>
          <div className="language-switcher__group" role="group" aria-label={copy.languageLabel}>
            {Object.keys(copy.languages).map((code) => (
              <button
                key={code}
                type="button"
                className={`language-switcher__button ${language === code ? 'is-active' : ''}`}
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
                title={copy.languages[code]}
              >
                {copy.languageShort[code]}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="topbar__ghost">
          {copy.dashboard.notifications}
        </button>
        <button type="button" className="topbar__primary">
          {copy.dashboard.createAlert}
        </button>
      </div>
    </header>
  )
}
