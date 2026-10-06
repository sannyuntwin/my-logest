export type WorkOrderStatus =
  | "Draft"
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type WorkOrderPriority =
  | "Low"
  | "Normal"
  | "High"
  | "Urgent";

export type WorkOrder = {
  id: string;
  workOrderNumber: string;

  customerOrderId: string;
  customerId: string;

  requestedDate: string;

  pickupLocation: string;
  deliveryLocation: string;

  cargoDescription: string;
  weightKg: number;

  priority: WorkOrderPriority;
  status: WorkOrderStatus;

  vehicleId: string | null;
  driverId: string | null;
  tripId: string | null;

  assignedDate: string | null;

  notes: string;
};

export const workOrders: WorkOrder[] = [
  {
    id: "WO-001",
    workOrderNumber: "WO-2026-0001",

    customerOrderId: "ORD-001",
    customerId: "CUS-001",

    requestedDate: "2026-04-03",

    pickupLocation: "ABC Manufacturing - Bang Na",
    deliveryLocation: "Central Distribution Center - Bangkok",

    cargoDescription: "Electronic components",
    weightKg: 4200,

    priority: "High",
    status: "Completed",

    vehicleId: "VH-001",
    driverId: "EMP-001",
    tripId: "TRIP-0001",

    assignedDate: "2026-04-02",

    notes: "Delivery before 16:00",
  },

  {
    id: "WO-002",
    workOrderNumber: "WO-2026-0002",

    customerOrderId: "ORD-002",
    customerId: "CUS-002",

    requestedDate: "2026-04-06",

    pickupLocation: "Thai Retail Warehouse - Rangsit",
    deliveryLocation: "Retail Store - Bangkok",

    cargoDescription: "Consumer products",
    weightKg: 6800,

    priority: "Normal",
    status: "Completed",

    vehicleId: "VH-002",
    driverId: "EMP-002",
    tripId: "TRIP-0002",

    assignedDate: "2026-04-05",

    notes: "",
  },

  {
    id: "WO-003",
    workOrderNumber: "WO-2026-0003",

    customerOrderId: "ORD-003",
    customerId: "CUS-003",

    requestedDate: "2026-05-12",

    pickupLocation: "Siam Food Factory - Samut Prakan",
    deliveryLocation: "Food Distribution Center - Bangkok",

    cargoDescription: "Food products",
    weightKg: 7200,

    priority: "Urgent",
    status: "In Progress",

    vehicleId: "VH-004",
    driverId: "EMP-004",
    tripId: "TRIP-0003",

    assignedDate: "2026-05-11",

    notes: "Temperature-sensitive cargo",
  },

  {
    id: "WO-004",
    workOrderNumber: "WO-2026-0004",

    customerOrderId: "ORD-004",
    customerId: "CUS-004",

    requestedDate: "2026-06-03",

    pickupLocation: "Eastern Electronics - Chonburi",
    deliveryLocation: "Bangkok Electronics Hub",

    cargoDescription: "Electronic equipment",
    weightKg: 3500,

    priority: "High",
    status: "Assigned",

    vehicleId: "VH-004",
    driverId: "EMP-004",
    tripId: null,

    assignedDate: "2026-06-02",

    notes: "Handle with care",
  },

  {
    id: "WO-005",
    workOrderNumber: "WO-2026-0005",

    customerOrderId: "ORD-005",
    customerId: "CUS-005",

    requestedDate: "2026-06-18",

    pickupLocation: "Construction Supply - Lat Krabang",
    deliveryLocation: "Construction Site - Bangkok",

    cargoDescription: "Construction materials",
    weightKg: 9500,

    priority: "Normal",
    status: "Pending",

    vehicleId: null,
    driverId: null,
    tripId: null,

    assignedDate: null,

    notes: "Customer requested morning delivery",
  },

  {
    id: "WO-006",
    workOrderNumber: "WO-2026-0006",

    customerOrderId: "ORD-006",
    customerId: "CUS-001",

    requestedDate: "2026-07-05",

    pickupLocation: "ABC Manufacturing - Bang Na",
    deliveryLocation: "Industrial Park - Ayutthaya",

    cargoDescription: "Machine parts",
    weightKg: 5800,

    priority: "High",
    status: "Pending",

    vehicleId: null,
    driverId: null,
    tripId: null,

    assignedDate: null,

    notes: "",
  },

  {
    id: "WO-007",
    workOrderNumber: "WO-2026-0007",

    customerOrderId: "ORD-007",
    customerId: "CUS-006",

    requestedDate: "2026-07-14",

    pickupLocation: "Metro Home Products - Nonthaburi",
    deliveryLocation: "Home Product Warehouse - Bangkok",

    cargoDescription: "Furniture",
    weightKg: 6100,

    priority: "Low",
    status: "Cancelled",

    vehicleId: null,
    driverId: null,
    tripId: null,

    assignedDate: null,

    notes: "Customer cancelled order",
  },

  {
    id: "WO-008",
    workOrderNumber: "WO-2026-0008",

    customerOrderId: "ORD-008",
    customerId: "CUS-002",

    requestedDate: "2026-08-04",

    pickupLocation: "Thai Retail Warehouse - Rangsit",
    deliveryLocation: "Retail Distribution Center - Bangkok",

    cargoDescription: "Retail products",
    weightKg: 8400,

    priority: "Normal",
    status: "Completed",

    vehicleId: "VH-002",
    driverId: "EMP-002",
    tripId: "TRIP-0008",

    assignedDate: "2026-08-03",

    notes: "",
  },
];

