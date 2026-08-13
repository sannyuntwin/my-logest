import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const LANGUAGE_STORAGE_KEY = 'logistics-language'

const TRANSLATIONS = {
  en: {
    meta: { htmlLang: 'en', pageTitle: 'Logistics Tracking' },
    languageLabel: 'Language',
    languages: { en: 'English', th: 'Thai', my: 'Myanmar' },
    languageShort: { en: 'EN', th: 'TH', my: 'MM' },
    hero: {
      eyebrow: 'Logistics control center',
      title: 'Track shipments, surface bottlenecks, and keep the line moving.',
      body: 'A polished frontend for the logistics exam project. Search by tracking number, inspect the latest routing updates, and review current shipments at a glance.',
    },
    search: {
      label: 'Tracking number',
      placeholder: 'Example: ABC123456',
      button: 'Track',
      searching: 'Searching...',
      hint: 'Backend endpoint:',
      missingTracking: 'Please enter a tracking number.',
    },
    metrics: {
      apiStatus: 'API status',
      apiNote: 'FastAPI + Postgres backend',
      apiValue: 'Live',
      trackedProviders: 'Tracked providers',
      trackedProvidersValue: '3',
      trackedProvidersNote: 'Kerry, Flash, J&T',
      shipmentFocus: 'Shipment focus',
      shipmentFocusValue: 'Tracking',
      shipmentFocusNote: 'Search, history, and SLA visibility',
    },
    tracking: {
      sectionKicker: 'Tracking result',
      sectionTitle: 'Shipment details',
      trackingNumber: 'Tracking number',
      provider: 'Provider',
      origin: 'Origin',
      destination: 'Destination',
      zone: 'Zone',
      weight: 'Weight',
      currentLocation: 'Current location',
      estimatedDelivery: 'Estimated delivery',
      history: 'Status history',
      events: 'events',
      noHistory: 'No status history yet.',
      empty: 'Search a tracking number to see the shipment timeline and provider details.',
      noLocation: 'No location noted',
      weightUnit: 'kg',
    },
    recent: {
      kicker: 'Operations snapshot',
      title: 'Recent shipments',
      loading: 'Loading recent shipments...',
      empty: 'No shipments returned yet.',
      unknownProvider: 'Unknown provider',
      fromTo: 'to',
    },
    errors: {
      loadRecent: 'Unable to load recent shipments',
      trackingLookup: 'Tracking lookup failed',
      generic: 'Something went wrong',
      notFound: 'Tracking number not found',
      invalidTracking: 'Invalid tracking number format',
      invalidDate: 'Invalid date format. Use YYYY-MM-DD',
      invalidStatus: 'Invalid status. Allowed values: pending, pickup, in_transit, delivered, failed',
    },
    status: {
      pending: 'Pending',
      pickup: 'Pickup',
      in_transit: 'In transit',
      delivered: 'Delivered',
      failed: 'Failed',
    },
  },
  th: {
    meta: { htmlLang: 'th', pageTitle: 'ระบบติดตามพัสดุ' },
    languageLabel: 'ภาษา',
    languages: { en: 'อังกฤษ', th: 'ไทย', my: 'พม่า' },
    languageShort: { en: 'EN', th: 'TH', my: 'MM' },
    hero: {
      eyebrow: 'ศูนย์ควบคุมโลจิสติกส์',
      title: 'ติดตามพัสดุ ค้นหาจุดติดขัด และเดินงานให้ไหลลื่น',
      body: 'หน้าเว็บสำหรับโจทย์สอบโลจิสติกส์ ใช้ค้นหาด้วยเลขติดตาม ดูเส้นทางล่าสุด และตรวจสอบสถานะพัสดุแบบรวดเร็ว',
    },
    search: {
      label: 'หมายเลขติดตามพัสดุ',
      placeholder: 'ตัวอย่าง: ABC123456',
      button: 'ค้นหา',
      searching: 'กำลังค้นหา...',
      hint: 'API ฝั่งหลังบ้าน:',
      missingTracking: 'กรุณากรอกหมายเลขติดตามพัสดุ',
    },
    metrics: {
      apiStatus: 'สถานะ API',
      apiNote: 'แบ็กเอนด์ FastAPI + Postgres',
      apiValue: 'ใช้งานอยู่',
      trackedProviders: 'ผู้ให้บริการที่รองรับ',
      trackedProvidersValue: '3',
      trackedProvidersNote: 'Kerry, Flash, J&T',
      shipmentFocus: 'โฟกัสของระบบ',
      shipmentFocusValue: 'การติดตาม',
      shipmentFocusNote: 'ค้นหา ประวัติ และ SLA',
    },
    tracking: {
      sectionKicker: 'ผลการติดตาม',
      sectionTitle: 'รายละเอียดพัสดุ',
      trackingNumber: 'หมายเลขติดตาม',
      provider: 'ผู้ให้บริการ',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      zone: 'โซน',
      weight: 'น้ำหนัก',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      estimatedDelivery: 'กำหนดส่งโดยประมาณ',
      history: 'ประวัติสถานะ',
      events: 'รายการ',
      noHistory: 'ยังไม่มีประวัติสถานะ',
      empty: 'ค้นหาหมายเลขติดตามเพื่อดูไทม์ไลน์และข้อมูลผู้ให้บริการ',
      noLocation: 'ไม่ได้ระบุสถานที่',
      weightUnit: 'กก.',
    },
    recent: {
      kicker: 'ภาพรวมการปฏิบัติงาน',
      title: 'พัสดุล่าสุด',
      loading: 'กำลังโหลดพัสดุล่าสุด...',
      empty: 'ยังไม่มีรายการพัสดุ',
      unknownProvider: 'ไม่ทราบผู้ให้บริการ',
      fromTo: 'ถึง',
    },
    errors: {
      loadRecent: 'ไม่สามารถโหลดพัสดุล่าสุดได้',
      trackingLookup: 'การค้นหาพัสดุไม่สำเร็จ',
      generic: 'เกิดข้อผิดพลาดบางอย่าง',
      notFound: 'ไม่พบหมายเลขติดตามพัสดุ',
      invalidTracking: 'รูปแบบหมายเลขติดตามพัสดุไม่ถูกต้อง',
      invalidDate: 'รูปแบบวันที่ไม่ถูกต้อง ใช้ YYYY-MM-DD',
      invalidStatus: 'สถานะไม่ถูกต้อง ค่าที่ใช้ได้: pending, pickup, in_transit, delivered, failed',
    },
    status: {
      pending: 'รอดำเนินการ',
      pickup: 'รับพัสดุแล้ว',
      in_transit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      failed: 'จัดส่งไม่สำเร็จ',
    },
  },
  my: {
    meta: { htmlLang: 'my', pageTitle: 'ပို့ဆောင်ရေး ခြေရာခံစနစ်' },
    languageLabel: 'ဘာသာစကား',
    languages: { en: 'အင်္ဂလိပ်', th: 'ထိုင်း', my: 'မြန်မာ' },
    languageShort: { en: 'EN', th: 'TH', my: 'MM' },
    hero: {
      eyebrow: 'လော့ဂျစ်တစ်စင်တာ',
      title: 'ပစ္စည်းပို့ဆောင်မှုကို ခြေရာခံပါ၊ အခက်အခဲနေရာများကို ရှာပါ၊ လုပ်ငန်းစဉ်ကို လျင်မြန်စွာဆက်လက်ထိန်းသိမ်းပါ',
      body: 'လော့ဂျစ်တစ်စာမေးပွဲအတွက် ပြုလုပ်ထားသော frontend ဖြစ်ပြီး tracking number ဖြင့်ရှာဖွေခြင်း၊ နောက်ဆုံးလမ်းကြောင်းများကြည့်ရှုခြင်းနှင့် လက်ရှိပစ္စည်းများကို မြင်ကွင်းတစ်ခုတည်းတွင် ကြည့်နိုင်သည်',
    },
    search: {
      label: 'Tracking နံပါတ်',
      placeholder: 'ဥပမာ: ABC123456',
      button: 'ရှာမည်',
      searching: 'ရှာဖွေနေသည်...',
      hint: 'Backend endpoint:',
      missingTracking: 'Tracking နံပါတ်ကို ထည့်ပါ။',
    },
    metrics: {
      apiStatus: 'API အခြေအနေ',
      apiNote: 'FastAPI + Postgres backend',
      apiValue: 'အသက်ဝင်',
      trackedProviders: 'ပံ့ပိုးသူများ',
      trackedProvidersValue: '3',
      trackedProvidersNote: 'Kerry, Flash, J&T',
      shipmentFocus: 'စနစ်အမျိုးအစား',
      shipmentFocusValue: 'Tracking',
      shipmentFocusNote: 'ရှာဖွေမှု၊ history နှင့် SLA မြင်ကွင်း',
    },
    tracking: {
      sectionKicker: 'ခြေရာခံရလဒ်',
      sectionTitle: 'ပစ္စည်းအသေးစိတ်',
      trackingNumber: 'Tracking နံပါတ်',
      provider: 'ပံ့ပိုးသူ',
      origin: 'မူလနေရာ',
      destination: 'ပို့မည့်နေရာ',
      zone: 'ဇုန်',
      weight: 'အလေးချိန်',
      currentLocation: 'လက်ရှိတည်နေရာ',
      estimatedDelivery: 'ခန့်မှန်းပို့ချိန်',
      history: 'အခြေအနေမှတ်တမ်း',
      events: 'ကြိမ်',
      noHistory: 'အခြေအနေမှတ်တမ်း မရှိသေးပါ',
      empty: 'tracking number တစ်ခုရှာပြီး timeline နှင့် provider detail ကိုကြည့်ပါ',
      noLocation: 'တည်နေရာ မဖော်ပြထားပါ',
      weightUnit: 'kg',
    },
    recent: {
      kicker: 'လုပ်ငန်းအခြေအနေ',
      title: 'နောက်ဆုံးပို့ဆောင်မှုများ',
      loading: 'နောက်ဆုံးပို့ဆောင်မှုများကို ဖွင့်နေသည်...',
      empty: 'ပစ္စည်းစာရင်း မရှိသေးပါ',
      unknownProvider: 'ပံ့ပိုးသူ မသိရှိ',
      fromTo: 'သို့',
    },
    errors: {
      loadRecent: 'နောက်ဆုံးပို့ဆောင်မှုများကို မဖွင့်နိုင်ပါ',
      trackingLookup: 'Tracking ရှာဖွေမှု မအောင်မြင်ပါ',
      generic: 'အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်',
      notFound: 'Tracking နံပါတ် မတွေ့ပါ',
      invalidTracking: 'Tracking နံပါတ် ပုံစံ မမှန်ပါ',
      invalidDate: 'နေ့စွဲပုံစံ မမှန်ပါ။ YYYY-MM-DD ကိုသုံးပါ',
      invalidStatus: 'Status မမှန်ပါ။ အသုံးပြုနိုင်သော တန်ဖိုးများ: pending, pickup, in_transit, delivered, failed',
    },
    status: {
      pending: 'စောင့်ဆိုင်းနေသည်',
      pickup: 'ပစ္စည်းလက်ခံပြီး',
      in_transit: 'ပို့ဆောင်နေသည်',
      delivered: 'ပို့ဆောင်ပြီး',
      failed: 'ပို့ဆောင်မအောင်မြင်',
    },
  },
}

const STATUS_TONES = {
  pending: 'status--pending',
  pickup: 'status--pickup',
  in_transit: 'status--transit',
  delivered: 'status--delivered',
  failed: 'status--failed',
}

const ERROR_KEY_TO_DETAIL = {
  notFound: 'Tracking number not found',
  invalidTracking: 'Invalid tracking number format',
  invalidDate: 'Invalid date format. Use YYYY-MM-DD',
  invalidStatusPrefix: 'Invalid status.',
  loadRecent: 'Unable to load recent shipments',
  trackingLookup: 'Tracking lookup failed',
}

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && TRANSLATIONS[stored]) {
    return stored
  }

  const browserLanguage = window.navigator.language?.slice(0, 2)
  return TRANSLATIONS[browserLanguage] ? browserLanguage : 'en'
}

function getCopy(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.en
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

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const copy = getCopy(language)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [recentShipments, setRecentShipments] = useState([])
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [errorState, setErrorState] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

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

  async function handleSubmit(event) {
    event.preventDefault()
    const value = trackingNumber.trim()

    if (!value) {
      setErrorState({ type: 'key', key: 'missingTracking' })
      return
    }

    try {
      setErrorState(null)
      setLoadingTracking(true)
      const response = await fetch(`${API_BASE_URL}/api/tracking/${encodeURIComponent(value)}`)
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

  return (
    <div className="page-shell">
      <div className="glow glow--left" />
      <div className="glow glow--right" />

      <main className="app-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="hero-text">{copy.hero.body}</p>
          </div>

          <div className="hero-actions">
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
          </div>

          <form className="search-panel" onSubmit={handleSubmit}>
            <label htmlFor="trackingNumber">{copy.search.label}</label>
            <div className="search-row">
              <input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder={copy.search.placeholder}
                autoComplete="off"
              />
              <button type="submit" disabled={loadingTracking}>
                {loadingTracking ? copy.search.searching : copy.search.button}
              </button>
            </div>
            <p className="search-hint">
              {copy.search.hint} <code>{API_BASE_URL}/api/tracking/:tracking_number</code>
            </p>
            {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}
          </form>
        </section>

        <section className="metrics-grid">
          <article className="metric-card">
            <span className="metric-label">{copy.metrics.apiStatus}</span>
            <strong className="metric-value">{copy.metrics.apiValue}</strong>
            <span className="metric-note">{copy.metrics.apiNote}</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">{copy.metrics.trackedProviders}</span>
            <strong className="metric-value">{copy.metrics.trackedProvidersValue}</strong>
            <span className="metric-note">{copy.metrics.trackedProvidersNote}</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">{copy.metrics.shipmentFocus}</span>
            <strong className="metric-value">{copy.metrics.shipmentFocusValue}</strong>
            <span className="metric-note">{copy.metrics.shipmentFocusNote}</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">{copy.tracking.sectionKicker}</p>
                <h2>{copy.tracking.sectionTitle}</h2>
              </div>
              {trackingData ? <ShipmentStatusBadge status={trackingData.current_status} copy={copy} /> : null}
            </div>

            {trackingData ? (
              <div className="shipment-card">
                <div className="shipment-topline">
                  <div>
                    <span className="field-label">{copy.tracking.trackingNumber}</span>
                    <strong>{trackingData.tracking_number}</strong>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.provider}</span>
                    <strong>{trackingData.provider?.name || '—'}</strong>
                  </div>
                </div>

                <div className="detail-grid">
                  <div>
                    <span className="field-label">{copy.tracking.origin}</span>
                    <p>{trackingData.origin || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.destination}</span>
                    <p>{trackingData.destination || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.zone}</span>
                    <p>{trackingData.destination_zone || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.weight}</span>
                    <p>
                      {formatWeight(trackingData.weight_kg, locale)} {copy.tracking.weightUnit}
                    </p>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.currentLocation}</span>
                    <p>{trackingData.current_location || '—'}</p>
                  </div>
                  <div>
                    <span className="field-label">{copy.tracking.estimatedDelivery}</span>
                    <p>{trackingData.estimated_delivery || '—'}</p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-header">
                    <h3>{copy.tracking.history}</h3>
                    <span>
                      {trackingData.status_history?.length || 0} {copy.tracking.events}
                    </span>
                  </div>
                  {activeMilestones.length ? (
                    <ul>
                      {activeMilestones.map((item, index) => (
                        <li key={`${item.status}-${item.timestamp}-${index}`}>
                          <span className="timeline-dot" />
                          <div>
                            <strong>{copy.status[item.status] || item.status}</strong>
                            <p>{item.location || copy.tracking.noLocation}</p>
                            <small>
                              {formatDateTime(item.timestamp, locale)}
                              {item.provider?.name ? ` · ${item.provider.name}` : ''}
                            </small>
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
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">{copy.recent.kicker}</p>
                <h2>{copy.recent.title}</h2>
              </div>
            </div>

            {loadingRecent ? (
              <div className="empty-state">{copy.recent.loading}</div>
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
                      <ShipmentStatusBadge status={shipment.current_status} copy={copy} />
                    </div>
                    <p>
                      {shipment.origin || '—'} {copy.recent.fromTo} {shipment.destination || '—'}
                    </p>
                    <div className="shipment-list-meta">
                      <span>{shipment.provider?.name || copy.recent.unknownProvider}</span>
                      <span>
                        {formatWeight(shipment.weight_kg, locale)} {copy.tracking.weightUnit}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">{copy.recent.empty}</div>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
