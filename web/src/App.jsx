import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const statusLabels = {
  pending: 'Pending',
  pickup: 'Pickup',
  in_transit: 'In transit',
  delivered: 'Delivered',
  failed: 'Failed',
}

const statusTone = {
  pending: 'status--pending',
  pickup: 'status--pickup',
  in_transit: 'status--transit',
  delivered: 'status--delivered',
  failed: 'status--failed',
}

function formatWeight(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function ShipmentStatusBadge({ status }) {
  const tone = statusTone[status] || 'status--pending'
  return <span className={`status-badge ${tone}`}>{statusLabels[status] || status}</span>
}

function App() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [recentShipments, setRecentShipments] = useState([])
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecentShipments() {
      try {
        setLoadingRecent(true)
        const response = await fetch(`${API_BASE_URL}/api/shipments?per_page=6&page=1`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load recent shipments')
        }

        const payload = await response.json()
        setRecentShipments(payload.data || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoadingRecent(false)
      }
    }

    loadRecentShipments()
    return () => controller.abort()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const value = trackingNumber.trim()

    if (!value) {
      setError('Please enter a tracking number.')
      return
    }

    try {
      setError('')
      setLoadingTracking(true)
      const response = await fetch(`${API_BASE_URL}/api/tracking/${encodeURIComponent(value)}`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.detail || 'Tracking lookup failed')
      }

      setTrackingData(payload)
    } catch (err) {
      setTrackingData(null)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoadingTracking(false)
    }
  }

  const activeMilestones = useMemo(() => {
    if (!trackingData?.status_history?.length) {
      return []
    }

    return [...trackingData.status_history].slice(-4).reverse()
  }, [trackingData])

  return (
    <div className="page-shell">
      <div className="glow glow--left" />
      <div className="glow glow--right" />

      <main className="app-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Logistics control center</p>
            <h1>Track shipments, surface bottlenecks, and keep the line moving.</h1>
            <p className="hero-text">
              A polished frontend for the logistics exam project. Search by tracking number,
              inspect the latest routing updates, and review current shipments at a glance.
            </p>
          </div>

          <form className="search-panel" onSubmit={handleSubmit}>
            <label htmlFor="trackingNumber">Tracking number</label>
            <div className="search-row">
              <input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="Example: ABC123456"
                autoComplete="off"
              />
              <button type="submit" disabled={loadingTracking}>
                {loadingTracking ? 'Searching...' : 'Track'}
              </button>
            </div>
            <p className="search-hint">
              Backend endpoint: <code>{API_BASE_URL}/api/tracking/:tracking_number</code>
            </p>
            {error ? <p className="error-banner">{error}</p> : null}
          </form>
        </section>

        <section className="metrics-grid">
          <article className="metric-card">
            <span className="metric-label">API status</span>
            <strong className="metric-value">Live</strong>
            <span className="metric-note">FastAPI + Postgres backend</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Tracked providers</span>
            <strong className="metric-value">3</strong>
            <span className="metric-note">Kerry, Flash, J&T</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Shipment focus</span>
            <strong className="metric-value">Tracking</strong>
            <span className="metric-note">Search, history, and SLA visibility</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Tracking result</p>
                <h2>Shipment details</h2>
              </div>
              {trackingData ? <ShipmentStatusBadge status={trackingData.current_status} /> : null}
            </div>

            {trackingData ? (
              <div className="shipment-card">
                <div className="shipment-topline">
                  <div>
                    <span className="field-label">Tracking number</span>
                    <strong>{trackingData.tracking_number}</strong>
                  </div>
                  <div>
                    <span className="field-label">Provider</span>
                    <strong>{trackingData.provider?.name || '—'}</strong>
                  </div>
                </div>

                <div className="detail-grid">
                  <div>
                    <span className="field-label">Origin</span>
                    <p>{trackingData.origin || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">Destination</span>
                    <p>{trackingData.destination || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">Zone</span>
                    <p>{trackingData.destination_zone || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">Weight</span>
                    <p>{trackingData.weight_kg ?? '—'} kg</p>
                  </div>
                  <div>
                    <span className="field-label">Current location</span>
                    <p>{trackingData.current_location || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">Estimated delivery</span>
                    <p>{trackingData.estimated_delivery || '—'}</p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-header">
                    <h3>Status history</h3>
                    <span>{trackingData.status_history?.length || 0} events</span>
                  </div>
                  {activeMilestones.length ? (
                    <ul>
                      {activeMilestones.map((item, index) => (
                        <li key={`${item.status}-${item.timestamp}-${index}`}>
                          <span className="timeline-dot" />
                          <div>
                            <strong>
                              {statusLabels[item.status] || item.status}
                            </strong>
                            <p>{item.location || 'No location noted'}</p>
                            <small>
                              {formatDateTime(item.timestamp)}
                              {item.provider?.name ? ` · ${item.provider.name}` : ''}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">No status history yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                Search a tracking number to see the shipment timeline and provider details.
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Operations snapshot</p>
                <h2>Recent shipments</h2>
              </div>
            </div>

            {loadingRecent ? (
              <div className="empty-state">Loading recent shipments...</div>
            ) : recentShipments.length ? (
              <div className="shipment-list">
                {recentShipments.map((shipment) => (
                  <button
                    key={shipment.id}
                    type="button"
                    className="shipment-list-item"
                    onClick={() => setTrackingNumber(shipment.tracking_number)}
                  >
                    <div className="shipment-list-top">
                      <strong>{shipment.tracking_number}</strong>
                      <ShipmentStatusBadge status={shipment.current_status} />
                    </div>
                    <p>
                      {shipment.origin || '—'} to {shipment.destination || '—'}
                    </p>
                    <div className="shipment-list-meta">
                      <span>{shipment.provider?.name || 'Unknown provider'}</span>
                      <span>{formatWeight(shipment.weight_kg)} kg</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">No shipments returned yet.</div>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
