export type PaymentMethod =
  | "Bank Transfer"
  | "Cash"
  | "Credit Card"
  | "PromptPay"
  | "Cheque";

export type PaymentStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Cancelled";

export type Payment = {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;

  paymentDate: string;
  amount: number;

  paymentMethod: PaymentMethod;
  referenceNumber: string;

  status: PaymentStatus;
  notes: string;
};

export const payments: Payment[] = [
  {
    id: "PAY-001",
    paymentNumber: "PAY-2026-0001",
    invoiceId: "INV-001",
    customerId: "CUS-001",

    paymentDate: "2026-04-20",
    amount: 13375,

    paymentMethod: "Bank Transfer",
    referenceNumber: "TRF-ABC-001",

    status: "Completed",
    notes: "Full payment received.",
  },

  {
    id: "PAY-002",
    paymentNumber: "PAY-2026-0002",
    invoiceId: "INV-002",
    customerId: "CUS-002",

    paymentDate: "2026-04-25",
    amount: 17976,

    paymentMethod: "PromptPay",
    referenceNumber: "PP-THAI-002",

    status: "Completed",
    notes: "Full payment received.",
  },

  {
    id: "PAY-003",
    paymentNumber: "PAY-2026-0003",
    invoiceId: "INV-003",
    customerId: "CUS-003",

    paymentDate: "2026-05-30",
    amount: 5000,

    paymentMethod: "Bank Transfer",
    referenceNumber: "TRF-SIAM-003",

    status: "Completed",
    notes: "Partial payment.",
  },

  {
    id: "PAY-004",
    paymentNumber: "PAY-2026-0004",
    invoiceId: "INV-004",
    customerId: "CUS-004",

    paymentDate: "2026-06-20",
    amount: 10000,

    paymentMethod: "Bank Transfer",
    referenceNumber: "TRF-EAST-004",

    status: "Pending",
    notes: "Payment awaiting confirmation.",
  },

  {
    id: "PAY-005",
    paymentNumber: "PAY-2026-0005",
    invoiceId: "INV-006",
    customerId: "CUS-001",

    paymentDate: "2026-07-20",
    amount: 20062.5,

    paymentMethod: "Cheque",
    referenceNumber: "CHQ-001-006",

    status: "Pending",
    notes: "Cheque submitted by customer.",
  },

  {
    id: "PAY-006",
    paymentNumber: "PAY-2026-0006",
    invoiceId: "INV-008",
    customerId: "CUS-002",

    paymentDate: "2026-08-25",
    amount: 5000,

    paymentMethod: "Bank Transfer",
    referenceNumber: "TRF-THAI-008",

    status: "Failed",
    notes: "Bank transaction failed.",
  },
];
