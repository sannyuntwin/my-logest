import { useEffect, useMemo, useRef } from 'react'
import { CircleMarker, MapContainer, Pane, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { buildRouteMapState, STATUS_TONES } from '../../lib/logistics'

function RouteBounds({ points }) {
  const map = useMap()
  const previousBoundsKey = useRef('')

  useEffect(() => {
    if (!points.length) {
      return
    }

    const boundsKey = JSON.stringify(points)
    if (previousBoundsKey.current === boundsKey) {
      return
    }

    previousBoundsKey.current = boundsKey

    const uniquePoints = Array.from(new Map(points.map((point) => [point.join(','), point])).values())

    if (uniquePoints.length === 1) {
      map.setView(uniquePoints[0], 8, { animate: true })
      return
    }

    map.fitBounds(points, {
      animate: true,
      padding: [32, 32],
      maxZoom: 8,
    })
  }, [map, points])

  return null
}

export default function RouteMap({
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

  const routePoints = useMemo(
    () => mapState?.pathPoints.map((point) => [point.lat, point.lng]) || [],
    [mapState],
  )

  const routePathPoints = useMemo(() => {
    if (routePoints.length < 2) {
      return routePoints
    }

    const curvedPoints = [routePoints[0]]

    for (let index = 0; index < routePoints.length - 1; index += 1) {
      const start = routePoints[index]
      const end = routePoints[index + 1]
      const latDelta = end[0] - start[0]
      const lngDelta = end[1] - start[1]
      const distance = Math.hypot(latDelta, lngDelta)

      if (!distance) {
        continue
      }

      const offset = Math.min(0.45, Math.max(0.12, distance * 0.2))
      const perpLat = (-lngDelta / distance) * offset
      const perpLng = (latDelta / distance) * offset
      const midpoint = [
        (start[0] + end[0]) / 2 + perpLat,
        (start[1] + end[1]) / 2 + perpLng,
      ]

      curvedPoints.push(midpoint, end)
    }

    return curvedPoints
  }, [routePoints])

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
            <MapContainer
              className="route-map__leaflet"
              center={[15.5, 100.5]}
              zoom={5}
              minZoom={4}
              maxZoom={8}
              scrollWheelZoom
              zoomControl={false}
              attributionControl
              worldCopyJump={false}
            >
              <RouteBounds points={routePoints} />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routePoints.length >= 2 ? (
                <Pane name="route" style={{ zIndex: 450 }}>
                  <Polyline
                    positions={routePathPoints}
                    pane="route"
                    interactive={false}
                    pathOptions={{
                      color: '#ffbf47',
                      weight: 10,
                      opacity: 0.2,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                  <Polyline
                    positions={routePathPoints}
                    pane="route"
                    interactive={false}
                    pathOptions={{
                      color: '#ffd166',
                      weight: 5,
                      opacity: 0.98,
                      dashArray: '10 12',
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </Pane>
              ) : null}

              {mapState.markers.map((marker) => (
                <CircleMarker
                  key={`${marker.kind}-${marker.label}`}
                  center={[marker.lat, marker.lng]}
                  radius={marker.kind === 'current' ? 10 : 8}
                  pathOptions={{
                    color:
                      marker.kind === 'origin'
                        ? '#ffe3b3'
                        : marker.kind === 'current'
                          ? '#e1fbff'
                          : '#d3ffe6',
                    weight: 2,
                    fillColor:
                      marker.kind === 'origin'
                        ? '#ffbc60'
                        : marker.kind === 'current'
                          ? '#87d7ff'
                          : '#62e0a0',
                    fillOpacity: 0.95,
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]} className="route-map__tooltip">
                    <span>{copy.map[marker.kind]}</span>
                    <strong>{marker.label}</strong>
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
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
