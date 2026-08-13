import { useEffect, useState } from 'react'
import ShipmentStatusBadge from '../components/ShipmentStatusBadge'
import {
  SHIPMENT_PAGE_SIZE_OPTIONS,
  SHIPMENT_STATUS_FILTERS,
  buildPaginationItems,
  formatDateOnly,
  formatDateTime,
  formatWeight,
  interpolate,
} from '../lib/logistics'

export default function ShipmentsPage({
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
}) {
  const [modalShipment, setModalShipment] = useState(null)

  const totalPages = Math.max(1, Math.ceil((shipmentsState.total || 0) / shipmentsState.per_page))
  const pageItems = buildPaginationItems(shipmentsState.page, totalPages)
  const from = shipmentsState.total ? (shipmentsState.page - 1) * shipmentsState.per_page + 1 : 0
  const to = shipmentsState.total
    ? Math.min(shipmentsState.page * shipmentsState.per_page, shipmentsState.total)
    : 0
  const selectedStatusLabel = filters.status ? copy.status[filters.status] || filters.status : copy.shipments.statusAll

  useEffect(() => {
    if (!modalShipment) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalShipment(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalShipment])

  const openShipmentModal = (shipment) => {
    setModalShipment(shipment)
  }

  const closeShipmentModal = () => {
    setModalShipment(null)
  }

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
                      <button type="button" className="shipments-table__id" onClick={() => openShipmentModal(shipment)}>
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
                        onClick={() => openShipmentModal(shipment)}
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

      {modalShipment ? (
        <div className="shipment-modal" role="presentation" onClick={closeShipmentModal}>
          <div
            className="shipment-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shipment-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-heading panel-heading--compact shipment-modal__heading">
              <div>
                <p className="panel-kicker">{copy.shipments.modalKicker}</p>
                <h2 id="shipment-modal-title">{copy.shipments.modalTitle}</h2>
              </div>
              <button type="button" className="shipment-modal__close" onClick={closeShipmentModal}>
                {copy.shipments.close}
              </button>
            </div>

            <div className="shipment-card shipment-card--compact shipment-modal__card">
              <div className="shipment-modal__topline">
                <ShipmentStatusBadge status={modalShipment.current_status} copy={copy} />
                <span className="shipment-modal__tracking">{modalShipment.tracking_number}</span>
              </div>

              <div className="detail-grid detail-grid--single">
                <div>
                  <span className="field-label">{copy.tracking.provider}</span>
                  <p>{modalShipment.provider?.name || '—'}</p>
                </div>
                <div>
                  <span className="field-label">{copy.tracking.origin}</span>
                  <p>{modalShipment.origin || '—'}</p>
                </div>
                <div>
                  <span className="field-label">{copy.tracking.destination}</span>
                  <p>{modalShipment.destination || '—'}</p>
                </div>
                <div>
                  <span className="field-label">{copy.tracking.currentLocation}</span>
                  <p>{modalShipment.current_location || '—'}</p>
                </div>
                <div>
                  <span className="field-label">{copy.tracking.weight}</span>
                  <p>
                    {formatWeight(modalShipment.weight_kg, locale)} {copy.tracking.weightUnit}
                  </p>
                </div>
                <div>
                  <span className="field-label">{copy.shipments.columns.eta}</span>
                  <p>{formatDateOnly(modalShipment.estimated_delivery, locale)}</p>
                </div>
                <div>
                  <span className="field-label">{copy.dashboard.lastUpdated}</span>
                  <p>{formatDateTime(modalShipment.created_at, locale)}</p>
                </div>
                <div>
                  <span className="field-label">{copy.tracking.trackingNumber}</span>
                  <p>{modalShipment.tracking_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
