import ShipmentStatusBadge from '../ShipmentStatusBadge'
import { describeShipmentEvent, formatDateTime } from '../../lib/logistics'

export default function TransitFeed({ shipments, copy, locale, onSelectShipment }) {
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
