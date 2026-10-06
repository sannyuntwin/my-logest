export type RouteStatus =
  | "Planned"
  | "Ready"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type RouteStopType = "Pickup" | "Delivery";

export type RouteStop = {
  id: string;
  sequence: number;
  type: RouteStopType;
  location: string;
  contactName: string;
  plannedArrival: string;
  actualArrival: string | null;
  status: "Pending" | "Arrived" | "Completed";
};

export type RoutePlan = {
  id: string;
  routeNumber: string;

  workOrderId: string;
  customerOrderId: string;
  customerId: string;

  date: string;

  origin: string;
  destination: string;

  distanceKm: number;
  estimatedDurationMinutes: number;

  status: RouteStatus;

  vehicleId: string | null;
  driverId: string | null;

  stops: RouteStop[];

  notes: string;
};

export const routePlans: RoutePlan[] = [
  {
    id: "ROUTE-001",
    routeNumber: "RT-2026-0001",

    workOrderId: "WO-001",
    customerOrderId: "ORD-001",
    customerId: "CUS-001",

    date: "2026-04-03",

    origin: "ABC Manufacturing - Bang Na",
    destination: "Central Distribution Center - Bangkok",

    distanceKm: 38,
    estimatedDurationMinutes: 75,

    status: "Completed",

    vehicleId: "VH-001",
    driverId: "EMP-001",

    stops: [
      {
        id: "STOP-001",
        sequence: 1,
        type: "Pickup",
        location: "ABC Manufacturing - Bang Na",
        contactName: "Somsak Chai",
        plannedArrival: "08:00",
        actualArrival: "07:55",
        status: "Completed",
      },
      {
        id: "STOP-002",
        sequence: 2,
        type: "Delivery",
        location: "Central Distribution Center - Bangkok",
        contactName: "Warehouse Team",
        plannedArrival: "09:15",
        actualArrival: "09:10",
        status: "Completed",
      },
    ],

    notes: "Standard delivery route.",
  },

  {
    id: "ROUTE-002",
    routeNumber: "RT-2026-0002",

    workOrderId: "WO-002",
    customerOrderId: "ORD-002",
    customerId: "CUS-002",

    date: "2026-04-06",

    origin: "Thai Retail Warehouse - Rangsit",
    destination: "Retail Store - Bangkok",

    distanceKm: 52,
    estimatedDurationMinutes: 95,

    status: "Completed",

    vehicleId: "VH-002",
    driverId: "EMP-002",

    stops: [
      {
        id: "STOP-003",
        sequence: 1,
        type: "Pickup",
        location: "Thai Retail Warehouse - Rangsit",
        contactName: "Nok Srisuk",
        plannedArrival: "07:30",
        actualArrival: "07:25",
        status: "Completed",
      },
      {
        id: "STOP-004",
        sequence: 2,
        type: "Delivery",
        location: "Retail Store - Bangkok",
        contactName: "Store Manager",
        plannedArrival: "09:05",
        actualArrival: "09:00",
        status: "Completed",
      },
    ],

    notes: "",
  },

  {
    id: "ROUTE-003",
    routeNumber: "RT-2026-0003",

    workOrderId: "WO-003",
    customerOrderId: "ORD-003",
    customerId: "CUS-003",

    date: "2026-05-12",

    origin: "Siam Food Factory - Samut Prakan",
    destination: "Food Distribution Center - Bangkok",

    distanceKm: 45,
    estimatedDurationMinutes: 85,

    status: "In Progress",

    vehicleId: "VH-004",
    driverId: "EMP-004",

    stops: [
      {
        id: "STOP-005",
        sequence: 1,
        type: "Pickup",
        location: "Siam Food Factory - Samut Prakan",
        contactName: "Prasert Wong",
        plannedArrival: "06:30",
        actualArrival: "06:25",
        status: "Completed",
      },
      {
        id: "STOP-006",
        sequence: 2,
        type: "Delivery",
        location: "Food Distribution Center - Bangkok",
        contactName: "Distribution Team",
        plannedArrival: "08:00",
        actualArrival: null,
        status: "Pending",
      },
    ],

    notes: "Priority delivery. Handle temperature-sensitive cargo.",
  },

  {
    id: "ROUTE-004",
    routeNumber: "RT-2026-0004",

    workOrderId: "WO-004",
    customerOrderId: "ORD-004",
    customerId: "CUS-004",

    date: "2026-06-03",

    origin: "Eastern Electronics - Chonburi",
    destination: "Bangkok Electronics Hub",

    distanceKm: 82,
    estimatedDurationMinutes: 120,

    status: "Ready",

    vehicleId: "VH-004",
    driverId: "EMP-004",

    stops: [
      {
        id: "STOP-007",
        sequence: 1,
        type: "Pickup",
        location: "Eastern Electronics - Chonburi",
        contactName: "Kanya Som",
        plannedArrival: "08:00",
        actualArrival: null,
        status: "Pending",
      },
      {
        id: "STOP-008",
        sequence: 2,
        type: "Delivery",
        location: "Bangkok Electronics Hub",
        contactName: "Receiving Department",
        plannedArrival: "10:00",
        actualArrival: null,
        status: "Pending",
      },
    ],

    notes: "Handle electronic equipment carefully.",
  },

  {
    id: "ROUTE-005",
    routeNumber: "RT-2026-0005",

    workOrderId: "WO-005",
    customerOrderId: "ORD-005",
    customerId: "CUS-005",

    date: "2026-06-18",

    origin: "Construction Supply - Lat Krabang",
    destination: "Construction Site - Bangkok",

    distanceKm: 34,
    estimatedDurationMinutes: 65,

    status: "Planned",

    vehicleId: null,
    driverId: null,

    stops: [
      {
        id: "STOP-009",
        sequence: 1,
        type: "Pickup",
        location: "Construction Supply - Lat Krabang",
        contactName: "Wirot Kan",
        plannedArrival: "08:00",
        actualArrival: null,
        status: "Pending",
      },
      {
        id: "STOP-010",
        sequence: 2,
        type: "Delivery",
        location: "Construction Site - Bangkok",
        contactName: "Site Manager",
        plannedArrival: "09:05",
        actualArrival: null,
        status: "Pending",
      },
    ],

    notes: "Morning delivery requested by customer.",
  },

  {
    id: "ROUTE-006",
    routeNumber: "RT-2026-0006",

    workOrderId: "WO-006",
    customerOrderId: "ORD-006",
    customerId: "CUS-001",

    date: "2026-07-05",

    origin: "ABC Manufacturing - Bang Na",
    destination: "Industrial Park - Ayutthaya",

    distanceKm: 125,
    estimatedDurationMinutes: 165,

    status: "Planned",

    vehicleId: null,
    driverId: null,

    stops: [
      {
        id: "STOP-011",
        sequence: 1,
        type: "Pickup",
        location: "ABC Manufacturing - Bang Na",
        contactName: "Somsak Chai",
        plannedArrival: "07:00",
        actualArrival: null,
        status: "Pending",
      },
      {
        id: "STOP-012",
        sequence: 2,
        type: "Delivery",
        location: "Industrial Park - Ayutthaya",
        contactName: "Receiving Team",
        plannedArrival: "09:45",
        actualArrival: null,
        status: "Pending",
      },
    ],

    notes: "Long-distance delivery.",
  },
];