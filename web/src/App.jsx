import { useEffect, useMemo, useState } from 'react'
import i18n, { getCopy, getInitialLanguage, LANGUAGE_STORAGE_KEY } from './i18n'
import AppSideRail from './components/SideRail'
import AppTopBar from './components/TopBar'
import DashboardPage from './pages/DashboardPage'
import AppShipmentsPage from './pages/ShipmentsPage'
import logoImage from './img/image.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const STATUS_TONES = {
  pending: 'status--pending',
  pickup: 'status--pickup',
  in_transit: 'status--transit',
  delivered: 'status--delivered',
  failed: 'status--failed',
}

const ROUTE_POINTS = {
  bangkok: { x: 24, y: 76, label: 'Bangkok', aliases: ['bangkok', 'bkk'] },
  chonburi: { x: 30, y: 81, label: 'Chonburi', aliases: ['chonburi', 'chon buri'] },
  phuket: { x: 20, y: 90, label: 'Phuket', aliases: ['phuket'] },
  surat_thani: { x: 28, y: 86, label: 'Surat Thani', aliases: ['surat thani'] },
  khon_kaen: { x: 61, y: 54, label: 'Khon Kaen', aliases: ['khon kaen', 'khonkaen'] },
  lampang: { x: 48, y: 42, label: 'Lampang', aliases: ['lampang'] },
  chiang_mai: { x: 58, y: 28, label: 'Chiang Mai', aliases: ['chiang mai', 'chiangmai'] },
  chiang_rai: { x: 67, y: 18, label: 'Chiang Rai', aliases: ['chiang rai', 'chiangrai'] },
  udon_thani: { x: 71, y: 46, label: 'Udon Thani', aliases: ['udon thani', 'udonthani'] },
}

const ROUTE_STATUS_PROGRESS = {
  pending: 0.18,
  pickup: 0.34,
  in_transit: 0.67,
  delivered: 1,
  failed: 0.52,
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start, end, progress) {
  return start + (end - start) * progress
}

function normalizeLocation(value) {
  return value
    ?.toLowerCase()
    .replace(/hub|center|centre|depot|warehouse|terminal|regional/g, ' ')
    .replace(/[^a-z0-9ก-๙\u0E00-\u0E7F\u1000-\u109F]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findRoutePoint(value) {
  const normalized = normalizeLocation(value)
  if (!normalized) {
    return null
  }

  return (
    Object.entries(ROUTE_POINTS).find(([, point]) =>
      point.aliases.some((alias) => normalized.includes(alias)),
    )?.[1] || null
  )
}

function projectRoutePoint(point) {
  return {
    x: clamp(point.x, 8, 92),
    y: clamp(point.y, 10, 92),
  }
}

function buildRouteMapState(shipment) {
  if (!shipment) {
    return null
  }

  const origin = findRoutePoint(shipment.origin)
  const destination = findRoutePoint(shipment.destination)
  const current = findRoutePoint(shipment.current_location)
  const progress = ROUTE_STATUS_PROGRESS[shipment.current_status] ?? 0.5

  const originProjected = origin ? projectRoutePoint(origin) : null
  const destinationProjected = destination ? projectRoutePoint(destination) : null
  const currentProjected = current
    ? projectRoutePoint(current)
    : originProjected && destinationProjected
      ? {
          x: clamp(lerp(originProjected.x, destinationProjected.x, progress), 8, 92),
          y: clamp(lerp(originProjected.y, destinationProjected.y, progress), 10, 92),
        }
      : null

  const markers = []

  if (originProjected) {
    markers.push({
      kind: 'origin',
      label: shipment.origin || origin.label,
      x: originProjected.x,
      y: originProjected.y,
    })
  }

  if (currentProjected) {
    markers.push({
      kind: 'current',
      label: shipment.current_location || shipment.current_status,
      x: currentProjected.x,
      y: currentProjected.y,
    })
  }

  if (destinationProjected) {
    markers.push({
      kind: 'destination',
      label: shipment.destination || destination.label,
      x: destinationProjected.x,
      y: destinationProjected.y,
    })
  }

  if (markers.length < 2) {
    return null
  }

  const pathPoints = []
  if (originProjected) pathPoints.push(originProjected)
  if (currentProjected) pathPoints.push(currentProjected)
  if (destinationProjected) pathPoints.push(destinationProjected)

  return {
    progress,
    markers,
    pathPoints,
  }
}

const ERROR_KEY_TO_DETAIL = {
  notFound: 'Tracking number not found',
  invalidTracking: 'Invalid tracking number format',
  invalidDate: 'Invalid date format. Expected YYYY-MM-DD',
  invalidStatusPrefix: 'Invalid status.',
  loadRecent: 'Unable to load recent shipments',
  trackingLookup: 'Tracking lookup failed',
}


function formatWeight(value, locale) {
  if (value == null) return '—'
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function formatDateTime(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatDateOnly(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date)
}

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${values[key] ?? ''}`)
}

function translateError(detail, copy) {
  if (!detail) {
    return copy.errors.generic
  }

  if (detail === ERROR_KEY_TO_DETAIL.notFound) return copy.errors.notFound
  if (detail === ERROR_KEY_TO_DETAIL.invalidTracking) return copy.errors.invalidTracking
  if (detail === ERROR_KEY_TO_DETAIL.invalidDate) return copy.errors.invalidDate
  if (detail.startsWith(ERROR_KEY_TO_DETAIL.invalidStatusPrefix)) return copy.errors.invalidStatus
  if (detail === ERROR_KEY_TO_DETAIL.loadRecent) return copy.errors.loadRecent
  if (detail === ERROR_KEY_TO_DETAIL.trackingLookup) return copy.errors.trackingLookup
  if (detail === copy.errors.loadRecent || detail === copy.errors.trackingLookup) return detail

  return detail
}

function ShipmentStatusBadge({ status, copy }) {
  const tone = STATUS_TONES[status] || 'status--pending'
  return <span className={`status-badge ${tone}`}>{copy.status[status] || status}</span>
}

const SHIPMENT_STATUS_FILTERS = ['', 'pending', 'pickup', 'in_transit', 'delivered', 'failed']
const SHIPMENT_PAGE_SIZE_OPTIONS = [10, 20, 50]

function buildPaginationItems(page, totalPages) {
  if (totalPages <= 1) {
    return [1]
  }

  const items = new Set([1, totalPages, page - 1, page, page + 1])
  return Array.from(items)
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= totalPages)
    .sort((a, b) => a - b)
    .reduce((acc, value, index, array) => {
      acc.push(value)

      const next = array[index + 1]
      if (next && next - value > 1) {
        acc.push('...')
      }

      return acc
    }, [])
}

function RouteMap({
  shipment,
  copy,
  kicker = copy.map.kicker,
  title = copy.map.title,
  subtitle = copy.map.subtitle,
  emptyLabel = copy.map.unavailable,
}) {
  const mapState = buildRouteMapState(shipment)
  const statusLabel = shipment ? copy.status[shipment.current_status] || shipment.current_status : ''
  const statusTone = shipment ? STATUS_TONES[shipment.current_status] || 'status--pending' : 'status--pending'

  return (
    <section className="route-map">
      <div className="route-map__header">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h3>{title}</h3>
          <p className="route-map__subtitle">{subtitle}</p>
        </div>
        {shipment ? <span className={`status-badge ${statusTone}`}>{statusLabel}</span> : null}
      </div>

      {mapState ? (
        <>
          <div className="route-map__viewport">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="route-map__svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7ea1ff" />
                  <stop offset="100%" stopColor="#8dd9ff" />
                </linearGradient>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7fa9ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8affe5" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              <rect x="0" y="0" width="100" height="100" rx="8" className="route-map__bg" />

              <g className="route-map__grid">
                {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((value) => (
                  <line key={`v-${value}`} x1={value} y1="0" x2={value} y2="100" />
                ))}
                {[16.66, 33.33, 50, 66.66, 83.33].map((value) => (
                  <line key={`h-${value}`} x1="0" y1={value} x2="100" y2={value} />
                ))}
              </g>

              <path
                d="M18 20 C 36 18, 44 28, 52 35 S 67 49, 74 58 S 82 77, 92 86"
                className="route-map__trail route-map__trail--ghost"
                fill="none"
              />

              <path
                d={`M ${mapState.pathPoints.map((point) => `${point.x} ${point.y}`).join(' L ')}`}
                className="route-map__trail"
                fill="none"
              />

              {mapState.markers.map((marker) => (
                <circle
                  key={`circle-${marker.kind}`}
                  cx={marker.x}
                  cy={marker.y}
                  r={marker.kind === 'current' ? 3.2 : 2.6}
                  className={`route-map__node route-map__node--${marker.kind}`}
                />
              ))}
            </svg>

            {mapState.markers.map((marker) => (
              <div
                key={`${marker.kind}-${marker.label}`}
                className={`route-map__pin route-map__pin--${marker.kind}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <span className="route-map__pin-dot" />
                <strong>{copy.map[marker.kind]}</strong>
                <small>{marker.label}</small>
              </div>
            ))}
          </div>

          <div className="route-map__legend">
            {mapState.markers.map((marker) => (
              <div key={`legend-${marker.kind}-${marker.label}`} className="route-map__legend-item">
                <span className={`route-map__legend-dot route-map__legend-dot--${marker.kind}`} />
                <div>
                  <strong>{copy.map[marker.kind]}</strong>
                  <p>{marker.label}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">{emptyLabel}</div>
      )}
    </section>
  )
}

const ACTIVITY_BASELINES = {
  '24h': [18, 32, 46, 28, 53, 41, 24, 35],
  '7d': [22, 29, 37, 26, 44, 39, 31, 42],
  '30d': [16, 24, 31, 21, 38, 33, 27, 36],
}

const ACTIVITY_LABELS = {
  '24h': ['00', '03', '06', '09', '12', '15', '18', '21'],
  '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''],
  '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
}

function clampBar(value) {
  return Math.max(12, Math.min(96, value))
}

function buildFleetSummary(shipments) {
  const total = shipments.length
  const active = shipments.filter((shipment) => shipment.current_status === 'in_transit').length
  const pending = shipments.filter((shipment) => ['pending', 'pickup'].includes(shipment.current_status)).length
  const delayed = shipments.filter((shipment) => shipment.current_status === 'failed').length

  return { total, active, pending, delayed }
}

function buildActivitySeries(shipments, range) {
  const summary = buildFleetSummary(shipments)
  const base = ACTIVITY_BASELINES[range] || ACTIVITY_BASELINES['24h']
  const boost = summary.total * 2 + summary.active * 4 + summary.pending * 1.5 + summary.delayed * 5

  return base.map((value, index) => ({
    label: ACTIVITY_LABELS[range]?.[index] || '',
    value: clampBar(Math.round(value + boost * (0.38 + (index % 3) * 0.08))),
  }))
}

function describeShipmentEvent(shipment, copy) {
  const statusLabel = copy.status[shipment.current_status] || shipment.current_status
  const location = shipment.current_location || shipment.destination || shipment.origin || copy.tracking.noLocation

  if (shipment.current_status === 'delivered') {
    return `${statusLabel} · ${shipment.destination || location}`
  }

  if (shipment.current_status === 'failed') {
    return `${statusLabel} · ${location}`
  }

  if (shipment.current_status === 'pickup') {
    return `${statusLabel} · ${shipment.origin || location}`
  }

  return `${statusLabel} · ${location}`
}

function MetricCard({ label, value, note, tone = 'neutral' }) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <span className="metric-note">{note}</span>
    </article>
  )
}

function ActivityChart({ series, copy, range, onChangeRange }) {
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

function TransitFeed({ shipments, copy, locale, onSelectShipment }) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading panel-heading--compact">
        <div>
          <p className="panel-kicker">{copy.dashboard.recentEvents}</p>
          <h2>{copy.dashboard.viewAllEvents}</h2>
        </div>
      </div>

      <div className="transit-feed">
        {shipments.length ? (
          shipments.slice(0, 4).map((shipment) => (
            <button
              key={shipment.id}
              type="button"
              className="transit-feed__item"
              onClick={() => onSelectShipment(shipment.tracking_number)}
            >
              <div className="transit-feed__topline">
                <strong>{shipment.tracking_number}</strong>
                <span className="transit-feed__time">{formatDateTime(shipment.created_at, locale)}</span>
              </div>
              <p>{describeShipmentEvent(shipment, copy)}</p>
              <div className="transit-feed__footer">
                <ShipmentStatusBadge status={shipment.current_status} copy={copy} />
                <span>{shipment.provider?.name || copy.recent.unknownProvider}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="empty-state">{copy.recent.empty}</div>
        )}
      </div>
    </section>
  )
}

function ShipmentsPage({
  copy,
  locale,
  shipmentsState,
  loadingShipments,
  shipmentsError,
  filters,
  onStatusChange,
  onDateChange,
  onPerPageChange,
  onPageChange,
  onResetFilters,
  onInspectShipment,
  selectedShipment,
}) {
  const totalPages = Math.max(1, Math.ceil((shipmentsState.total || 0) / shipmentsState.per_page))
  const pageItems = buildPaginationItems(shipmentsState.page, totalPages)
  const from = shipmentsState.total ? (shipmentsState.page - 1) * shipmentsState.per_page + 1 : 0
  const to = shipmentsState.total
    ? Math.min(shipmentsState.page * shipmentsState.per_page, shipmentsState.total)
    : 0
  const selectedStatusLabel = filters.status ? copy.status[filters.status] || filters.status : copy.shipments.statusAll

  return (
    <section className="shipments-layout">
      <article className="dashboard-panel shipments-panel">
        <div className="panel-heading panel-heading--compact shipments-panel__heading">
          <div>
            <p className="panel-kicker">{copy.shipments.eyebrow}</p>
            <h2>{copy.shipments.title}</h2>
            <p className="shipments-panel__subtitle">{copy.shipments.subtitle}</p>
          </div>
          <div className="shipments-summary">
            <strong>{selectedStatusLabel}</strong>
            <span>{interpolate(copy.shipments.rangeLabel, { from, to, total: shipmentsState.total || 0 })}</span>
          </div>
        </div>

        <div className="shipments-filters" aria-label={copy.shipments.filtersTitle}>
          <label className="shipments-filter">
            <span>{copy.shipments.statusLabel}</span>
            <select value={filters.status} onChange={(event) => onStatusChange(event.target.value)}>
              <option value="">{copy.shipments.statusAll}</option>
              {SHIPMENT_STATUS_FILTERS.filter(Boolean).map((status) => (
                <option key={status} value={status}>
                  {copy.status[status] || status}
                </option>
              ))}
            </select>
          </label>

          <label className="shipments-filter">
            <span>{copy.shipments.dateLabel}</span>
            <input
              type="date"
              value={filters.date}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </label>

          <label className="shipments-filter">
            <span>{copy.shipments.perPageLabel}</span>
            <select value={filters.perPage} onChange={(event) => onPerPageChange(Number(event.target.value))}>
              {SHIPMENT_PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="shipments-filter__reset" onClick={onResetFilters}>
            {copy.shipments.reset}
          </button>
        </div>

        {shipmentsError ? <div className="dashboard-alert">{shipmentsError}</div> : null}

        {loadingShipments ? (
          <div className="empty-state">{copy.shipments.loading}</div>
        ) : shipmentsState.data?.length ? (
          <div className="shipments-table-wrap">
            <table className="shipments-table">
              <thead>
                <tr>
                  <th>{copy.shipments.columns.shipmentId}</th>
                  <th>{copy.shipments.columns.origin}</th>
                  <th>{copy.shipments.columns.destination}</th>
                  <th>{copy.shipments.columns.carrier}</th>
                  <th>{copy.shipments.columns.status}</th>
                  <th>{copy.shipments.columns.eta}</th>
                  <th>{copy.shipments.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {shipmentsState.data.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <button type="button" className="shipments-table__id" onClick={() => onInspectShipment(shipment.tracking_number)}>
                        {shipment.tracking_number}
                      </button>
                    </td>
                    <td>{shipment.origin || '—'}</td>
                    <td>{shipment.destination || '—'}</td>
                    <td>{shipment.provider?.name || copy.recent.unknownProvider}</td>
                    <td>
                      <ShipmentStatusBadge status={shipment.current_status} copy={copy} />
                    </td>
                    <td>{formatDateOnly(shipment.estimated_delivery, locale)}</td>
                    <td>
                      <button
                        type="button"
                        className="shipments-table__action"
                        onClick={() => onInspectShipment(shipment.tracking_number)}
                      >
                        {copy.shipments.inspect}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">{copy.shipments.empty}</div>
        )}

        <div className="shipments-pagination" aria-label={copy.shipments.title}>
          <span className="shipments-pagination__summary">
            {interpolate(copy.shipments.rangeLabel, { from, to, total: shipmentsState.total || 0 })}
          </span>
          <div className="shipments-pagination__controls">
            <button
              type="button"
              className="shipments-pagination__button"
              onClick={() => onPageChange(Math.max(1, shipmentsState.page - 1))}
              disabled={shipmentsState.page <= 1}
            >
              Prev
            </button>

            {pageItems.map((item, index) =>
              item === '...' ? (
                <span key={`ellipsis-${index}`} className="shipments-pagination__ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`shipments-pagination__button ${item === shipmentsState.page ? 'is-active' : ''}`}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className="shipments-pagination__button"
              onClick={() => onPageChange(Math.min(totalPages, shipmentsState.page + 1))}
              disabled={shipmentsState.page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </article>

      <article className="dashboard-panel shipments-panel shipments-panel--detail">
        <div className="panel-heading panel-heading--compact">
          <div>
            <p className="panel-kicker">{copy.tracking.sectionKicker}</p>
            <h2>{copy.tracking.sectionTitle}</h2>
          </div>
          {selectedShipment ? <ShipmentStatusBadge status={selectedShipment.current_status} copy={copy} /> : null}
        </div>

        {selectedShipment ? (
          <div className="shipment-card shipment-card--compact">
            <div className="detail-grid detail-grid--single">
              <div>
                <span className="field-label">{copy.tracking.trackingNumber}</span>
                <p>{selectedShipment.tracking_number}</p>
              </div>
              <div>
                <span className="field-label">{copy.tracking.provider}</span>
                <p>{selectedShipment.provider?.name || '—'}</p>
              </div>
              <div>
                <span className="field-label">{copy.tracking.origin}</span>
                <p>{selectedShipment.origin || '—'}</p>
              </div>
              <div>
                <span className="field-label">{copy.tracking.destination}</span>
                <p>{selectedShipment.destination || '—'}</p>
              </div>
              <div>
                <span className="field-label">{copy.tracking.currentLocation}</span>
                <p>{selectedShipment.current_location || '—'}</p>
              </div>
              <div>
                <span className="field-label">{copy.tracking.weight}</span>
                <p>
                  {formatWeight(selectedShipment.weight_kg, locale)} {copy.tracking.weightUnit}
                </p>
              </div>
              <div>
                <span className="field-label">{copy.shipments.columns.eta}</span>
                <p>{formatDateOnly(selectedShipment.estimated_delivery, locale)}</p>
              </div>
              <div>
                <span className="field-label">{copy.dashboard.lastUpdated}</span>
                <p>{formatDateTime(selectedShipment.created_at, locale)}</p>
              </div>
            </div>

            <div className="timeline timeline--compact">
              <div className="timeline-header">
                <h3>{copy.tracking.history}</h3>
                <span>{selectedShipment.status_history?.length || 0} {copy.tracking.events}</span>
              </div>
              {selectedShipment.status_history?.length ? (
                <ul>
                  {selectedShipment.status_history.slice(-3).reverse().map((item, index) => (
                    <li key={`${item.status}-${item.timestamp}-${index}`}>
                      <span className="timeline-dot" />
                      <div>
                        <strong>{copy.status[item.status] || item.status}</strong>
                        <p>{item.location || copy.tracking.noLocation}</p>
                        <small>{formatDateTime(item.timestamp, locale)}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">{copy.shipments.selectShipment}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">{copy.shipments.selectShipment}</div>
        )}
      </article>
    </section>
  )
}

function SideRail({ copy, activeView, onSelectNav }) {
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
        <div className="sidebar__status">
          <span className="sidebar__status-dot" />
          <div>
            <strong>{copy.dashboard.support}</strong>
            <p>{copy.dashboard.notifications}</p>
          </div>
        </div>
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

function TopBar({ copy, trackingNumber, onTrackingChange, onSubmit, loadingTracking, language, setLanguage }) {
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

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const copy = useMemo(() => getCopy(language), [language])
  const [activeView, setActiveView] = useState('dashboard')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [recentShipments, setRecentShipments] = useState([])
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [errorState, setErrorState] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [shipmentsFilters, setShipmentsFilters] = useState({
    status: '',
    date: '',
    page: 1,
    perPage: 20,
  })
  const [shipmentsState, setShipmentsState] = useState({
    data: [],
    total: 0,
    page: 1,
    per_page: 20,
  })
  const [loadingShipments, setLoadingShipments] = useState(false)
  const [shipmentsError, setShipmentsError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    i18n.changeLanguage(language)
    document.documentElement.lang = copy.meta.htmlLang
    document.title = copy.meta.pageTitle

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Ignore storage failures and keep the selected language in memory.
    }
  }, [language, copy.meta.htmlLang, copy.meta.pageTitle])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecentShipments() {
      try {
        setLoadingRecent(true)
        const response = await fetch(`${API_BASE_URL}/api/shipments?per_page=6&page=1`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(ERROR_KEY_TO_DETAIL.loadRecent)
        }

        const payload = await response.json()
        setRecentShipments(payload.data || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setErrorState({ type: 'api', detail: err.message })
        }
      } finally {
        setLoadingRecent(false)
      }
    }

    loadRecentShipments()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (activeView !== 'shipments') {
      return undefined
    }

    const controller = new AbortController()

    async function loadShipmentsPage() {
      try {
        setLoadingShipments(true)
        setShipmentsError(null)

        const params = new URLSearchParams()
        params.set('page', String(shipmentsFilters.page))
        params.set('per_page', String(shipmentsFilters.perPage))

        if (shipmentsFilters.status) {
          params.set('status', shipmentsFilters.status)
        }

        if (shipmentsFilters.date) {
          params.set('date', shipmentsFilters.date)
        }

        const response = await fetch(`${API_BASE_URL}/api/shipments?${params.toString()}`, {
          signal: controller.signal,
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.detail || copy.errors.generic)
        }

        setShipmentsState({
          data: payload.data || [],
          total: payload.total || 0,
          page: payload.page || shipmentsFilters.page,
          per_page: payload.per_page || shipmentsFilters.perPage,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShipmentsError(translateError(err.message, copy))
          setShipmentsState({
            data: [],
            total: 0,
            page: shipmentsFilters.page,
            per_page: shipmentsFilters.perPage,
          })
        }
      } finally {
        setLoadingShipments(false)
      }
    }

    loadShipmentsPage()
    return () => controller.abort()
  }, [activeView, shipmentsFilters.page, shipmentsFilters.perPage, shipmentsFilters.status, shipmentsFilters.date, copy])

  async function loadShipment(trackingId) {
    try {
      setErrorState(null)
      setLoadingTracking(true)
      const response = await fetch(`${API_BASE_URL}/api/tracking/${encodeURIComponent(trackingId)}`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.detail || ERROR_KEY_TO_DETAIL.trackingLookup)
      }

      setTrackingData(payload)
    } catch (err) {
      setTrackingData(null)
      setErrorState({ type: 'api', detail: err.message || ERROR_KEY_TO_DETAIL.trackingLookup })
    } finally {
      setLoadingTracking(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const value = trackingNumber.trim()

    if (!value) {
      setErrorState({ type: 'key', key: 'missingTracking' })
      return
    }

    await loadShipment(value)
  }

  const errorMessage = useMemo(() => {
    if (!errorState) {
      return ''
    }

    if (errorState.type === 'key') {
      return copy.search[errorState.key] || copy.errors.generic
    }

    return translateError(errorState.detail, copy)
  }, [copy, errorState])

  const activeMilestones = useMemo(() => {
    if (!trackingData?.status_history?.length) {
      return []
    }

    return [...trackingData.status_history].slice(-4).reverse()
  }, [trackingData])

  const locale = copy.meta.htmlLang === 'my' ? 'my-MM' : copy.meta.htmlLang === 'th' ? 'th-TH' : 'en-US'
  const fleetSummary = useMemo(() => buildFleetSummary(recentShipments), [recentShipments])
  const activitySeries = useMemo(
    () => buildActivitySeries(recentShipments, timeRange),
    [recentShipments, timeRange],
  )
  const selectedShipment = trackingData || (activeView === 'shipments' ? shipmentsState.data[0] : recentShipments[0]) || null

  const inspectShipment = async (trackingId) => {
    setTrackingNumber(trackingId)
    await loadShipment(trackingId)
  }

  const handleViewChange = (view) => {
    setActiveView(view)
  }

  const handleShipmentsStatusChange = (status) => {
    setShipmentsFilters((current) => ({
      ...current,
      status,
      page: 1,
    }))
  }

  const handleShipmentsDateChange = (date) => {
    setShipmentsFilters((current) => ({
      ...current,
      date,
      page: 1,
    }))
  }

  const handleShipmentsPerPageChange = (perPage) => {
    setShipmentsFilters((current) => ({
      ...current,
      perPage,
      page: 1,
    }))
  }

  const handleShipmentsPageChange = (page) => {
    setShipmentsFilters((current) => ({
      ...current,
      page,
    }))
  }

  const handleResetShipmentsFilters = () => {
    setShipmentsFilters({
      status: '',
      date: '',
      page: 1,
      perPage: 20,
    })
  }

  return (
    <div className="os-shell">
      <AppSideRail copy={copy} activeView={activeView} onSelectNav={handleViewChange} />

      <div className="workspace">
        <AppTopBar
          copy={copy}
          trackingNumber={trackingNumber}
          onTrackingChange={setTrackingNumber}
          onSubmit={handleSubmit}
          loadingTracking={loadingTracking}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="dashboard">
          {activeView === 'shipments' ? (
            <AppShipmentsPage
              copy={copy}
              locale={locale}
              shipmentsState={shipmentsState}
              loadingShipments={loadingShipments}
              shipmentsError={shipmentsError}
              filters={shipmentsFilters}
              onStatusChange={handleShipmentsStatusChange}
              onDateChange={handleShipmentsDateChange}
              onPerPageChange={handleShipmentsPerPageChange}
              onPageChange={handleShipmentsPageChange}
              onResetFilters={handleResetShipmentsFilters}
              onInspectShipment={inspectShipment}
              selectedShipment={selectedShipment}
            />
          ) : (
            <DashboardPage
              copy={copy}
              locale={locale}
              errorMessage={errorMessage}
              fleetSummary={fleetSummary}
              activitySeries={activitySeries}
              timeRange={timeRange}
              onChangeTimeRange={setTimeRange}
              recentShipments={recentShipments}
              onSelectShipment={inspectShipment}
              selectedShipment={selectedShipment}
              activeMilestones={activeMilestones}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

