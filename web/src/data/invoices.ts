export type InvoiceStatus =
  | "Draft"
  | "Issued"
  | "Partially Paid"
  | "Paid"
  | "Overdue"
  | "Cancelled";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  tripId: string | null;
  orderId: string | null;

  invoiceDate: string;
  dueDate: string;

  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;

  paidAmount: number;

  status: InvoiceStatus;

  description: string;
  notes: string;
};

export const invoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-0001",
    customerId: "CUS-001",
    tripId: "TRIP-0001",
    orderId: "ORD-001",

    invoiceDate: "2026-04-04",
    dueDate: "2026-05-04",

    subtotal: 12500,
    taxRate: 7,
    taxAmount: 875,
    totalAmount: 13375,

    paidAmount: 13375,

    status: "Paid",

    description: "Transportation service - Trip TRIP-0001",
    notes: "Payment received.",
  },

  {
    id: "INV-002",
    invoiceNumber: "INV-2026-0002",
    customerId: "CUS-002",
    tripId: "TRIP-0002",
    orderId: "ORD-002",

    invoiceDate: "2026-04-07",
    dueDate: "2026-05-07",

    subtotal: 16800,
    taxRate: 7,
    taxAmount: 1176,
    totalAmount: 17976,

    paidAmount: 17976,

    status: "Paid",

    description: "Transportation service - Trip TRIP-0002",
    notes: "",
  },

  {
    id: "INV-003",
    invoiceNumber: "INV-2026-0003",
    customerId: "CUS-003",
    tripId: "TRIP-0003",
    orderId: "ORD-003",

    invoiceDate: "2026-05-13",
    dueDate: "2026-06-13",

    subtotal: 14500,
    taxRate: 7,
    taxAmount: 1015,
    totalAmount: 15515,

    paidAmount: 5000,

    status: "Partially Paid",

    description: "Transportation service - Trip TRIP-0003",
    notes: "Remaining balance pending.",
  },

  {
    id: "INV-004",
    invoiceNumber: "INV-2026-0004",
    customerId: "CUS-004",
    tripId: null,
    orderId: "ORD-004",

    invoiceDate: "2026-06-04",
    dueDate: "2026-07-04",

    subtotal: 22000,
    taxRate: 7,
    taxAmount: 1540,
    totalAmount: 23540,

    paidAmount: 0,

    status: "Issued",

    description: "Transportation service - SO-2026-0004",
    notes: "",
  },

  {
    id: "INV-005",
    invoiceNumber: "INV-2026-0005",
    customerId: "CUS-005",
    tripId: null,
    orderId: "ORD-005",

    invoiceDate: "2026-06-19",
    dueDate: "2026-07-19",

    subtotal: 9800,
    taxRate: 7,
    taxAmount: 686,
    totalAmount: 10486,

    paidAmount: 0,

    status: "Overdue",

    description: "Transportation service - SO-2026-0005",
    notes: "Customer payment overdue.",
  },

  {
    id: "INV-006",
    invoiceNumber: "INV-2026-0006",
    customerId: "CUS-001",
    tripId: null,
    orderId: "ORD-006",

    invoiceDate: "2026-07-06",
    dueDate: "2026-08-06",

    subtotal: 18750,
    taxRate: 7,
    taxAmount: 1312.5,
    totalAmount: 20062.5,

    paidAmount: 0,

    status: "Issued",

    description: "Transportation service - SO-2026-0006",
    notes: "",
  },

  {
    id: "INV-007",
    invoiceNumber: "INV-2026-0007",
    customerId: "CUS-006",
    tripId: null,
    orderId: "ORD-007",

    invoiceDate: "2026-07-10",
    dueDate: "2026-08-10",

    subtotal: 7500,
    taxRate: 7,
    taxAmount: 525,
    totalAmount: 8025,

    paidAmount: 0,

    status: "Cancelled",

    description: "Cancelled transportation service",
    notes: "Customer order cancelled.",
  },

  {
    id: "INV-008",
    invoiceNumber: "INV-2026-0008",
    customerId: "CUS-002",
    tripId: "TRIP-0008",
    orderId: "ORD-008",

    invoiceDate: "2026-08-05",
    dueDate: "2026-09-05",

    subtotal: 15200,
    taxRate: 7,
    taxAmount: 1064,
    totalAmount: 16264,

    paidAmount: 0,

    status: "Overdue",

    description: "Transportation service - Trip TRIP-0008",
    notes: "",
  },
];