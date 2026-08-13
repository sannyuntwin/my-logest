export const STATUS_TONES = {
  pending: 'status--pending',
  pickup: 'status--pickup',
  in_transit: 'status--transit',
  delivered: 'status--delivered',
  failed: 'status--failed',
}

export const SHIPMENT_STATUS_FILTERS = ['', 'pending', 'pickup', 'in_transit', 'delivered', 'failed']
export const SHIPMENT_PAGE_SIZE_OPTIONS = [10, 20, 50]

const ROUTE_POINTS = {
  bangkok: { lat: 13.7563, lng: 100.5018, label: 'Bangkok', aliases: ['bangkok', 'bkk'] },
  chonburi: { lat: 13.3611, lng: 100.9847, label: 'Chonburi', aliases: ['chonburi', 'chon buri'] },
  phuket: { lat: 7.8804, lng: 98.3923, label: 'Phuket', aliases: ['phuket'] },
  surat_thani: { lat: 9.1401, lng: 99.3331, label: 'Surat Thani', aliases: ['surat thani'] },
  khon_kaen: { lat: 16.4322, lng: 102.8236, label: 'Khon Kaen', aliases: ['khon kaen', 'khonkaen'] },
  lampang: { lat: 18.2889, lng: 99.4908, label: 'Lampang', aliases: ['lampang'] },
  chiang_mai: { lat: 18.7883, lng: 98.9853, label: 'Chiang Mai', aliases: ['chiang mai', 'chiangmai'] },
  chiang_rai: { lat: 19.9105, lng: 99.8406, label: 'Chiang Rai', aliases: ['chiang rai', 'chiangrai'] },
  udon_thani: { lat: 17.4138, lng: 102.787, label: 'Udon Thani', aliases: ['udon thani', 'udonthani'] },
}

const ROUTE_STATUS_PROGRESS = {
  pending: 0.18,
  pickup: 0.34,
  in_transit: 0.67,
  delivered: 1,
  failed: 0.52,
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

export const ERROR_KEY_TO_DETAIL = {
  notFound: 'Tracking number not found',
  invalidTracking: 'Invalid tracking number format',
  invalidDate: 'Invalid date format. Expected YYYY-MM-DD',
  invalidStatusPrefix: 'Invalid status.',
  loadRecent: 'Unable to load recent shipments',
  trackingLookup: 'Tracking lookup failed',
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(start, end, progress) {
  return start + (end - start) * progress
}

export function normalizeLocation(value) {
  return value
    ?.toLowerCase()
    .replace(/hub|center|centre|depot|warehouse|terminal|regional/g, ' ')
    .replace(/[^a-z0-9ก-๙\u0E00-\u0E7F\u1000-\u109F]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function findRoutePoint(value) {
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

export function projectRoutePoint(point) {
  return {
    lat: clamp(point.lat, 6, 21),
    lng: clamp(point.lng, 97, 106),
  }
}

export function buildRouteMapState(shipment) {
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
          lat: clamp(lerp(originProjected.lat, destinationProjected.lat, progress), 6, 21),
          lng: clamp(lerp(originProjected.lng, destinationProjected.lng, progress), 97, 106),
        }
      : null

  const markers = []

  if (originProjected) {
    markers.push({
      kind: 'origin',
      label: shipment.origin || origin.label,
      lat: originProjected.lat,
      lng: originProjected.lng,
    })
  }

  if (currentProjected) {
    markers.push({
      kind: 'current',
      label: shipment.current_location || shipment.current_status,
      lat: currentProjected.lat,
      lng: currentProjected.lng,
    })
  }

  if (destinationProjected) {
    markers.push({
      kind: 'destination',
      label: shipment.destination || destination.label,
      lat: destinationProjected.lat,
      lng: destinationProjected.lng,
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

export function clampBar(value) {
  return Math.max(12, Math.min(96, value))
}

export function buildFleetSummary(shipments) {
  const total = shipments.length
  const active = shipments.filter((shipment) => shipment.current_status === 'in_transit').length
  const pending = shipments.filter((shipment) => ['pending', 'pickup'].includes(shipment.current_status)).length
  const delayed = shipments.filter((shipment) => shipment.current_status === 'failed').length

  return { total, active, pending, delayed }
}

export function buildActivitySeries(shipments, range) {
  const summary = buildFleetSummary(shipments)
  const base = ACTIVITY_BASELINES[range] || ACTIVITY_BASELINES['24h']
  const boost = summary.total * 2 + summary.active * 4 + summary.pending * 1.5 + summary.delayed * 5

  return base.map((value, index) => ({
    label: ACTIVITY_LABELS[range]?.[index] || '',
    value: clampBar(Math.round(value + boost * (0.38 + (index % 3) * 0.08))),
  }))
}

export function describeShipmentEvent(shipment, copy) {
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

export function formatWeight(value, locale) {
  if (value == null) return '—'
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(Number(value))
}

export function formatDateTime(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDateOnly(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date)
}

export function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${values[key] ?? ''}`)
}

export function buildPaginationItems(page, totalPages) {
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

export function translateError(detail, copy) {
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
