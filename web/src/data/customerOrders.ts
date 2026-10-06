export type CustomerOrderStatus =
  | "Draft"
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Delivered"
  | "Cancelled";

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  customerId: string;

  orderDate: string;
  requestedDate: string;

  pickupLocation: string;
  deliveryLocation: string;

  cargoDescription: string;
  quantity: number;
  weightKg: number;

  status: CustomerOrderStatus;

  revenue: number;

  notes: string;

  tripId: string | null;
};

export const customerOrders: CustomerOrder[] = [
  {
    id: "ORD-001",
    orderNumber: "SO-2026-0001",
    customerId: "CUS-001",
    orderDate: "2026-04-02",
    requestedDate: "2026-04-03",
    pickupLocation: "ABC Manufacturing - Bang Na",
    deliveryLocation: "Central Distribution Center - Bangkok",
    cargoDescription: "Electronic components",
    quantity: 12,
    weightKg: 4200,
    status: "Delivered",
    revenue: 18500,
    notes: "Delivery before 16:00",
    tripId: "TRIP-0001",
  },
  {
    id: "ORD-002",
    orderNumber: "SO-2026-0002",
    customerId: "CUS-002",
    orderDate: "2026-04-05",
    requestedDate: "2026-04-06",
    pickupLocation: "Thai Retail Warehouse - Rangsit",
    deliveryLocation: "Retail Store - Bangkok",
    cargoDescription: "Consumer products",
    quantity: 25,
    weightKg: 6800,
    status: "Delivered",
    revenue: 22000,
    notes: "",
    tripId: "TRIP-0002",
  },
  {
    id: "ORD-003",
    orderNumber: "SO-2026-0003",
    customerId: "CUS-003",
    orderDate: "2026-05-10",
    requestedDate: "2026-05-12",
    pickupLocation: "Siam Food Factory - Samut Prakan",
    deliveryLocation: "Food Distribution Center - Bangkok",
    cargoDescription: "Food products",
    quantity: 18,
    weightKg: 7200,
    status: "In Progress",
    revenue: 24500,
    notes: "Temperature-sensitive cargo",
    tripId: "TRIP-0003",
  },
  {
    id: "ORD-004",
    orderNumber: "SO-2026-0004",
    customerId: "CUS-004",
    orderDate: "2026-06-01",
    requestedDate: "2026-06-03",
    pickupLocation: "Eastern Electronics - Chonburi",
    deliveryLocation: "Bangkok Electronics Hub",
    cargoDescription: "Electronic equipment",
    quantity: 8,
    weightKg: 3500,
    status: "Confirmed",
    revenue: 19500,
    notes: "Handle with care",
    tripId: null,
  },
  {
    id: "ORD-005",
    orderNumber: "SO-2026-0005",
    customerId: "CUS-005",
    orderDate: "2026-06-15",
    requestedDate: "2026-06-18",
    pickupLocation: "Construction Supply - Lat Krabang",
    deliveryLocation: "Construction Site - Bangkok",
    cargoDescription: "Construction materials",
    quantity: 30,
    weightKg: 9500,
    status: "Pending",
    revenue: 28000,
    notes: "Customer requested morning delivery",
    tripId: null,
  },
  {
    id: "ORD-006",
    orderNumber: "SO-2026-0006",
    customerId: "CUS-001",
    orderDate: "2026-07-03",
    requestedDate: "2026-07-05",
    pickupLocation: "ABC Manufacturing - Bang Na",
    deliveryLocation: "Industrial Park - Ayutthaya",
    cargoDescription: "Machine parts",
    quantity: 15,
    weightKg: 5800,
    status: "Confirmed",
    revenue: 26000,
    notes: "",
    tripId: null,
  },
  {
    id: "ORD-007",
    orderNumber: "SO-2026-0007",
    customerId: "CUS-006",
    orderDate: "2026-07-12",
    requestedDate: "2026-07-14",
    pickupLocation: "Metro Home Products - Nonthaburi",
    deliveryLocation: "Home Product Warehouse - Bangkok",
    cargoDescription: "Furniture",
    quantity: 20,
    weightKg: 6100,
    status: "Cancelled",
    revenue: 21000,
    notes: "Customer cancelled order",
    tripId: null,
  },
  {
    id: "ORD-008",
    orderNumber: "SO-2026-0008",
    customerId: "CUS-002",
    orderDate: "2026-08-01",
    requestedDate: "2026-08-04",
    pickupLocation: "Thai Retail Warehouse - Rangsit",
    deliveryLocation: "Retail Distribution Center - Bangkok",
    cargoDescription: "Retail products",
    quantity: 35,
    weightKg: 8400,
    status: "Delivered",
    revenue: 31000,
    notes: "",
    tripId: "TRIP-0008",
  },
];
