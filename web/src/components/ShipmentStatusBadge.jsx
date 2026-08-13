import { STATUS_TONES } from '../lib/logistics'

export default function ShipmentStatusBadge({ status, copy }) {
  const tone = STATUS_TONES[status] || 'status--pending'
  return <span className={`status-badge ${tone}`}>{copy.status[status] || status}</span>
}
