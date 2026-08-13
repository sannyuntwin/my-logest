import MetricCard from '../components/dashboard/MetricCard'
import ActivityChart from '../components/dashboard/ActivityChart'
import TransitFeed from '../components/dashboard/TransitFeed'
import RouteMap from '../components/dashboard/RouteMap'
import ShipmentStatusBadge from '../components/ShipmentStatusBadge'
import { formatDateTime } from '../lib/logistics'

export default function DashboardPage({
  copy,
  locale,
  errorMessage,
  fleetSummary,
  activitySeries,
  timeRange,
  onChangeTimeRange,
  recentShipments,
  onSelectShipment,
  selectedShipment,
  activeMilestones,
}) {
  return (
    <>
      <section className="overview-card">
        <div>
          <p className="eyebrow">{copy.dashboard.brandSub}</p>
          <h1>{copy.dashboard.overviewTitle}</h1>
          <p className="overview-card__subtitle">{copy.dashboard.overviewSubtitle}</p>
        </div>
        <div className="overview-card__meta">
          <span>{copy.dashboard.lastUpdated}</span>
          <strong>{copy.dashboard.lastUpdatedValue}</strong>
        </div>
      </section>

      {errorMessage ? <div className="dashboard-alert">{errorMessage}</div> : null}

      <section className="metrics-grid metrics-grid--overview">
        <MetricCard
          label={copy.dashboard.totalShipments}
          value={fleetSummary.total}
          note={copy.dashboard.totalShipmentsNote}
          tone="blue"
        />
        <MetricCard
          label={copy.dashboard.activeInTransit}
          value={fleetSummary.active}
          note={copy.dashboard.activeInTransitNote}
          tone="teal"
        />
        <MetricCard
          label={copy.dashboard.pendingDelivery}
          value={fleetSummary.pending}
          note={copy.dashboard.pendingDeliveryNote}
          tone="amber"
        />
        <MetricCard
          label={copy.dashboard.delayed}
          value={fleetSummary.delayed}
          note={copy.dashboard.delayedNote}
          tone="rose"
        />
      </section>

      <section className="main-grid">
        <ActivityChart
          series={activitySeries}
          copy={copy}
          range={timeRange}
          onChangeRange={onChangeTimeRange}
        />
        <TransitFeed
          shipments={recentShipments}
          copy={copy}
          locale={locale}
          onSelectShipment={onSelectShipment}
        />
      </section>

      <section className="bottom-grid">
        <article className="dashboard-panel dashboard-panel--map">
          <RouteMap
            shipment={selectedShipment}
            copy={copy}
            kicker={copy.dashboard.globalFleetDistribution}
            title={copy.dashboard.globalFleetDistribution}
            subtitle={copy.dashboard.routeHint}
            emptyLabel={copy.map.unavailable}
          />
        </article>

        <article className="dashboard-panel dashboard-panel--detail">
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
                  <p>{selectedShipment.weight_kg || '—'} {copy.tracking.weightUnit}</p>
                </div>
              </div>

              <div className="timeline timeline--compact">
                <div className="timeline-header">
                  <h3>{copy.tracking.history}</h3>
                  <span>
                    {selectedShipment.status_history?.length || 0} {copy.tracking.events}
                  </span>
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
                  <p className="empty-state">{copy.tracking.noHistory}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">{copy.tracking.empty}</div>
          )}

          {activeMilestones?.length ? (
            <div className="timeline timeline--compact">
              <div className="timeline-header">
                <h3>{copy.tracking.history}</h3>
                <span>{activeMilestones.length} {copy.tracking.events}</span>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </>
  )
}
