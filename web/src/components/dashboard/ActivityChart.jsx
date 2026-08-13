export default function ActivityChart({ series, copy, range, onChangeRange }) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading panel-heading--compact">
        <div>
          <p className="panel-kicker">{copy.dashboard.chartTitle}</p>
          <h2>{copy.dashboard.chartSubtitle}</h2>
        </div>
        <div className="range-switcher" role="group" aria-label={copy.dashboard.chartTitle}>
          {[
            ['24h', copy.dashboard.period24h],
            ['7d', copy.dashboard.period7d],
            ['30d', copy.dashboard.period30d],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`range-switcher__button ${range === key ? 'is-active' : ''}`}
              onClick={() => onChangeRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-panel">
        <div className="chart-axis chart-axis--top">
          <span>1k</span>
          <span>750</span>
          <span>500</span>
          <span>250</span>
          <span>0</span>
        </div>
        <div className="chart-bars" aria-label={copy.dashboard.chartTitle}>
          {series.map((bar) => (
            <div key={`${range}-${bar.label}`} className="chart-bar">
              <div className="chart-bar__track">
                <div className="chart-bar__fill" style={{ height: `${bar.value}%` }} />
              </div>
              <span>{bar.label}</span>
            </div>
          ))}
        </div>
        <div className="chart-axis chart-axis--bottom">
          {series.map((bar) => (
            <span key={`axis-${range}-${bar.label}`}>{bar.label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
