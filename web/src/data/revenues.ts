export type RevenueStatus =
  | "Pending"
  | "Invoiced"
  | "Paid"
  | "Cancelled";

export type Revenue = {
  id: string;
  revenueNumber: string;

  customerId: string;
  tripId: string | null;
  orderId: string | null;
  invoiceId: string | null;

  date: string;

  description: string;

  amount: number;
  taxAmount: number;
  totalAmount: number;

  status: RevenueStatus;
};

export const revenues: Revenue[] = [
  {
    id: "REV-001",
    revenueNumber: "REV-2026-0001",

    customerId: "CUS-001",
    tripId: "TRIP-0001",
    orderId: "ORD-001",
    invoiceId: "INV-001",

    date: "2026-04-03",

    description: "Transportation service - Bangkok delivery",

    amount: 12500,
    taxAmount: 875,
    totalAmount: 13375,

    status: "Paid",
  },

  {
    id: "REV-002",
    revenueNumber: "REV-2026-0002",

    customerId: "CUS-002",
    tripId: "TRIP-0002",
    orderId: "ORD-002",
    invoiceId: "INV-002",

    date: "2026-04-06",

    description: "Transportation service - Rangsit delivery",

    amount: 16800,
    taxAmount: 1176,
    totalAmount: 17976,

    status: "Paid",
  },

  {
    id: "REV-003",
    revenueNumber: "REV-2026-0003",

    customerId: "CUS-003",
    tripId: "TRIP-0003",
    orderId: "ORD-003",
    invoiceId: "INV-003",

    date: "2026-05-12",

    description: "Transportation service - Samut Prakan delivery",

    amount: 14500,
    taxAmount: 1015,
    totalAmount: 15515,

    status: "Invoiced",
  },

  {
    id: "REV-004",
    revenueNumber: "REV-2026-0004",

    customerId: "CUS-004",
    tripId: null,
    orderId: "ORD-004",
    invoiceId: "INV-004",

    date: "2026-06-03",

    description: "Transportation service - Chonburi delivery",

    amount: 22000,
    taxAmount: 1540,
    totalAmount: 23540,

    status: "Invoiced",
  },

  {
    id: "REV-005",
    revenueNumber: "REV-2026-0005",

    customerId: "CUS-005",
    tripId: null,
    orderId: "ORD-005",
    invoiceId: "INV-005",

    date: "2026-06-18",

    description: "Transportation service - Lat Krabang delivery",

    amount: 9800,
    taxAmount: 686,
    totalAmount: 10486,

    status: "Pending",
  },

  {
    id: "REV-006",
    revenueNumber: "REV-2026-0006",

    customerId: "CUS-001",
    tripId: null,
    orderId: "ORD-006",
    invoiceId: "INV-006",

    date: "2026-07-05",

    description: "Transportation service - Ayutthaya delivery",

    amount: 18750,
    taxAmount: 1312.5,
    totalAmount: 20062.5,

    status: "Invoiced",
  },

  {
    id: "REV-007",
    revenueNumber: "REV-2026-0007",

    customerId: "CUS-006",
    tripId: null,
    orderId: "ORD-007",
    invoiceId: "INV-007",

    date: "2026-07-10",

    description: "Cancelled transportation service",

    amount: 7500,
    taxAmount: 525,
    totalAmount: 8025,

    status: "Cancelled",
  },

  {
    id: "REV-008",
    revenueNumber: "REV-2026-0008",

    customerId: "CUS-002",
    tripId: "TRIP-0008",
    orderId: "ORD-008",
    invoiceId: "INV-008",

    date: "2026-08-05",

    description: "Transportation service - Bangkok delivery",

    amount: 15200,
    taxAmount: 1064,
    totalAmount: 16264,

    status: "Invoiced",
  },
];
