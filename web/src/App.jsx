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
    dashboard: {
      brand: 'Logistics OS',
      brandSub: 'Global Operations',
      navDashboard: 'Dashboard',
      navShipments: 'Shipments',
      navLiveMap: 'Live Map',
      navDetails: 'Details',
      navWarehouse: 'Warehouse',
      navSettings: 'Settings',
      searchPlaceholder: 'Search tracking ID...',
      quickDirect: 'Direct Track',
      quickFleet: 'Fleet',
      quickCarriers: 'Carriers',
      newShipment: 'New Shipment',
      createAlert: 'Create Alert',
      overviewTitle: 'Operations Overview',
      overviewSubtitle: 'Real-time metrics and global fleet status.',
      lastUpdated: 'Last updated',
      lastUpdatedValue: 'Just now',
      totalShipments: 'Total Shipments',
      totalShipmentsNote: 'All tracked movements',
      activeInTransit: 'Active in Transit',
      activeInTransitNote: 'Currently moving',
      pendingDelivery: 'Pending Delivery',
      pendingDeliveryNote: 'Awaiting pickup or dispatch',
      delayed: 'Delayed',
      delayedNote: 'Needs review',
      chartTitle: 'Live Fleet Activity',
      chartSubtitle: '24-hour movement intensity',
      recentEvents: 'Recent Transit Events',
      viewAllEvents: 'View All Events',
      globalFleetDistribution: 'Global Fleet Distribution',
      routeHint: 'Tap a shipment to inspect the route',
      period24h: '24H',
      period7d: '7D',
      period30d: '30D',
      review: 'Review',
      support: 'Support',
      notifications: 'Notifications',
      profile: 'Operations Manager',
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
    map: {
      kicker: 'Route map',
      title: 'Live shipment path',
      subtitle: 'Approximate route view based on known hubs and shipment status',
      origin: 'Origin',
      current: 'Current',
      destination: 'Destination',
      unavailable: 'Map data unavailable for this route.',
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
    dashboard: {
      brand: 'Logistics OS',
      brandSub: 'Global Operations',
      navDashboard: 'แดชบอร์ด',
      navShipments: 'พัสดุ',
      navLiveMap: 'แผนที่สด',
      navDetails: 'รายละเอียด',
      navWarehouse: 'คลังสินค้า',
      navSettings: 'ตั้งค่า',
      searchPlaceholder: 'ค้นหา tracking ID...',
      quickDirect: 'ค้นหาเร็ว',
      quickFleet: 'ฟลีต',
      quickCarriers: 'ผู้ให้บริการ',
      newShipment: 'สร้างพัสดุ',
      createAlert: 'สร้างแจ้งเตือน',
      overviewTitle: 'ภาพรวมการปฏิบัติงาน',
      overviewSubtitle: 'ตัวชี้วัดแบบเรียลไทม์และสถานะฟลีตทั่วโลก',
      lastUpdated: 'อัปเดตล่าสุด',
      lastUpdatedValue: 'เมื่อสักครู่',
      totalShipments: 'พัสดุทั้งหมด',
      totalShipmentsNote: 'การเคลื่อนไหวทั้งหมดที่ติดตาม',
      activeInTransit: 'กำลังขนส่ง',
      activeInTransitNote: 'กำลังเดินทางอยู่',
      pendingDelivery: 'รอจัดส่ง',
      pendingDeliveryNote: 'รอรับเข้าระบบหรือส่งต่อ',
      delayed: 'ล่าช้า',
      delayedNote: 'ต้องตรวจสอบ',
      chartTitle: 'กิจกรรมฟลีตสด',
      chartSubtitle: 'ความเข้มข้นของการเคลื่อนไหว 24 ชั่วโมง',
      recentEvents: 'เหตุการณ์ขนส่งล่าสุด',
      viewAllEvents: 'ดูเหตุการณ์ทั้งหมด',
      globalFleetDistribution: 'การกระจายฟลีตทั่วโลก',
      routeHint: 'แตะพัสดุเพื่อดูเส้นทาง',
      period24h: '24 ชม.',
      period7d: '7 วัน',
      period30d: '30 วัน',
      review: 'ตรวจสอบ',
      support: 'สนับสนุน',
      notifications: 'การแจ้งเตือน',
      profile: 'ผู้จัดการฝ่ายปฏิบัติการ',
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
    map: {
      kicker: 'แผนที่เส้นทาง',
      title: 'เส้นทางพัสดุแบบสด',
      subtitle: 'มุมมองเส้นทางโดยประมาณจากศูนย์กลางที่รู้จักและสถานะพัสดุ',
      origin: 'ต้นทาง',
      current: 'ปัจจุบัน',
      destination: 'ปลายทาง',
      unavailable: 'ไม่สามารถแสดงข้อมูลแผนที่สำหรับเส้นทางนี้ได้',
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
    dashboard: {
      brand: 'Logistics OS',
      brandSub: 'Global Operations',
      navDashboard: 'Dashboard',
      navShipments: 'Shipments',
      navLiveMap: 'Live Map',
      navDetails: 'Details',
      navWarehouse: 'Warehouse',
      navSettings: 'Settings',
      searchPlaceholder: 'Search tracking ID...',
      quickDirect: 'Direct Track',
      quickFleet: 'Fleet',
      quickCarriers: 'Carriers',
      newShipment: 'ပစ္စည်းအသစ်',
      createAlert: 'Create Alert',
      overviewTitle: 'Operations Overview',
      overviewSubtitle: 'Real-time metrics and global fleet status.',
      lastUpdated: 'Last updated',
      lastUpdatedValue: 'Just now',
      totalShipments: 'Total Shipments',
      totalShipmentsNote: 'All tracked movements',
      activeInTransit: 'Active in Transit',
      activeInTransitNote: 'Currently moving',
      pendingDelivery: 'Pending Delivery',
      pendingDeliveryNote: 'Awaiting pickup or dispatch',
      delayed: 'Delayed',
      delayedNote: 'Needs review',
      chartTitle: 'Live Fleet Activity',
      chartSubtitle: '24-hour movement intensity',
      recentEvents: 'Recent Transit Events',
      viewAllEvents: 'View All Events',
      globalFleetDistribution: 'Global Fleet Distribution',
      routeHint: 'Tap a shipment to inspect the route',
      period24h: '24H',
      period7d: '7D',
      period30d: '30D',
      review: 'Review',
      support: 'Support',
      notifications: 'Notifications',
      profile: 'Operations Manager',
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
    map: {
      kicker: 'လမ်းကြောင်းမြေပုံ',
      title: 'ပစ္စည်းပို့ဆောင်မှု လမ်းကြောင်း',
      subtitle: 'သိရှိထားသော hub များနှင့် status အပေါ်အခြေခံသည့် ခန့်မှန်းလမ်းကြောင်း',
      origin: 'မူလနေရာ',
      current: 'လက်ရှိ',
      destination: 'ပို့မည့်နေရာ',
      unavailable: 'ဤလမ်းကြောင်းအတွက် map data မရနိုင်ပါ',
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

function SideRail({ copy, onSelectNav }) {
  const navItems = [
    copy.dashboard.navDashboard,
    copy.dashboard.navShipments,
    copy.dashboard.navLiveMap,
    copy.dashboard.navDetails,
    copy.dashboard.navWarehouse,
    copy.dashboard.navSettings,
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">LO</div>
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
            key={item}
            type="button"
            className={`sidebar__nav-item ${index === 0 ? 'is-active' : ''}`}
            onClick={() => onSelectNav?.(item)}
          >
            <span className="sidebar__dot" />
            {item}
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
  const copy = getCopy(language)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [recentShipments, setRecentShipments] = useState([])
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [errorState, setErrorState] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')

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
  const selectedShipment = trackingData || recentShipments[0] || null
  const inspectShipment = async (trackingId) => {
    setTrackingNumber(trackingId)
    await loadShipment(trackingId)
  }

  return (
    <div className="os-shell">
      <SideRail copy={copy} onSelectNav={() => {}} />

      <div className="workspace">
        <TopBar
          copy={copy}
          trackingNumber={trackingNumber}
          onTrackingChange={setTrackingNumber}
          onSubmit={handleSubmit}
          loadingTracking={loadingTracking}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="dashboard">
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
              onChangeRange={setTimeRange}
            />
            <TransitFeed
              shipments={recentShipments}
              copy={copy}
              locale={locale}
              onSelectShipment={inspectShipment}
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
                {selectedShipment ? (
                  <ShipmentStatusBadge status={selectedShipment.current_status} copy={copy} />
                ) : null}
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
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
