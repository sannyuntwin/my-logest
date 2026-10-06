export type CostCategory =
  | "Fuel"
  | "Toll"
  | "Maintenance"
  | "Driver"
  | "Vehicle"
  | "Other";

export type CostStatus =
  | "Pending"
  | "Approved"
  | "Paid"
  | "Cancelled";

export type Cost = {
  id: string;
  costNumber: string;

  category: CostCategory;

  vehicleId: string | null;
  driverId: string | null;
  tripId: string | null;

  date: string;

  description: string;

  amount: number;

  status: CostStatus;

  vendor: string;

  referenceNumber: string;

  notes: string;
};

export const costs: Cost[] = [
  {
    id: "COST-001",
    costNumber: "COST-2026-0001",

    category: "Fuel",

    vehicleId: "VH-001",
    driverId: "EMP-001",
    tripId: "TRIP-0001",

    date: "2026-04-03",

    description: "Diesel fuel for transportation trip",

    amount: 3780,

    status: "Paid",

    vendor: "PTT Bang Na",

    referenceNumber: "FUEL-001",

    notes: "Fuel transaction for Trip TRIP-0001.",
  },

  {
    id: "COST-002",
    costNumber: "COST-2026-0002",

    category: "Fuel",

    vehicleId: "VH-002",
    driverId: "EMP-002",
    tripId: "TRIP-0002",

    date: "2026-04-05",

    description: "Diesel fuel for transportation trip",

    amount: 2835,

    status: "Paid",

    vendor: "PTT Rangsit",

    referenceNumber: "FUEL-002",

    notes: "Fuel transaction for Trip TRIP-0002.",
  },

  {
    id: "COST-003",
    costNumber: "COST-2026-0003",

    category: "Fuel",

    vehicleId: "VH-003",
    driverId: "EMP-003",
    tripId: "TRIP-0003",

    date: "2026-04-08",

    description: "Diesel fuel for transportation trip",

    amount: 5670,

    status: "Paid",

    vendor: "Shell Rama 2",

    referenceNumber: "FUEL-003",

    notes: "",
  },

  {
    id: "COST-004",
    costNumber: "COST-2026-0004",

    category: "Fuel",

    vehicleId: "VH-004",
    driverId: "EMP-004",
    tripId: "TRIP-0004",

    date: "2026-04-12",

    description: "Diesel fuel for transportation trip",

    amount: 4095,

    status: "Paid",

    vendor: "Bangchak Lad Krabang",

    referenceNumber: "FUEL-004",

    notes: "",
  },

  {
    id: "COST-005",
    costNumber: "COST-2026-0005",

    category: "Maintenance",

    vehicleId: "VH-001",
    driverId: null,
    tripId: null,

    date: "2026-04-15",

    description: "Engine oil and filter replacement",

    amount: 4500,

    status: "Paid",

    vendor: "Isuzu Service Center",

    referenceNumber: "MNT-001",

    notes: "Preventive maintenance.",
  },

  {
    id: "COST-006",
    costNumber: "COST-2026-0006",

    category: "Maintenance",

    vehicleId: "VH-002",
    driverId: null,
    tripId: null,

    date: "2026-05-10",

    description: "General vehicle inspection",

    amount: 1800,

    status: "Paid",

    vendor: "Toyota Service Center",

    referenceNumber: "MNT-002",

    notes: "",
  },

  {
    id: "COST-007",
    costNumber: "COST-2026-0007",

    category: "Maintenance",

    vehicleId: "VH-003",
    driverId: null,
    tripId: null,

    date: "2026-06-05",

    description: "Brake system repair",

    amount: 12500,

    status: "Approved",

    vendor: "Hino Service Center",

    referenceNumber: "MNT-003",

    notes: "Repair currently in progress.",
  },

  {
    id: "COST-008",
    costNumber: "COST-2026-0008",

    category: "Maintenance",

    vehicleId: "VH-004",
    driverId: null,
    tripId: null,

    date: "2026-07-20",

    description: "Replace rear tires",

    amount: 22000,

    status: "Pending",

    vendor: "Tire Pro",

    referenceNumber: "MNT-004",

    notes: "Scheduled maintenance.",
  },

  {
    id: "COST-009",
    costNumber: "COST-2026-0009",

    category: "Toll",

    vehicleId: "VH-001",
    driverId: "EMP-001",
    tripId: "TRIP-0001",

    date: "2026-04-03",

    description: "Expressway toll",

    amount: 350,

    status: "Paid",

    vendor: "Expressway Authority",

    referenceNumber: "TOLL-001",

    notes: "",
  },

  {
    id: "COST-010",
    costNumber: "COST-2026-0010",

    category: "Driver",

    vehicleId: "VH-001",
    driverId: "EMP-001",
    tripId: "TRIP-0001",

    date: "2026-04-03",

    description: "Driver allowance",

    amount: 800,

    status: "Paid",

    vendor: "Internal",

    referenceNumber: "DRV-001",

    notes: "Trip allowance.",
  },

  {
    id: "COST-011",
    costNumber: "COST-2026-0011",

    category: "Toll",

    vehicleId: "VH-002",
    driverId: "EMP-002",
    tripId: "TRIP-0002",

    date: "2026-04-06",

    description: "Highway and expressway toll",

    amount: 520,

    status: "Paid",

    vendor: "Expressway Authority",

    referenceNumber: "TOLL-002",

    notes: "",
  },

  {
    id: "COST-012",
    costNumber: "COST-2026-0012",

    category: "Driver",

    vehicleId: "VH-002",
    driverId: "EMP-002",
    tripId: "TRIP-0002",

    date: "2026-04-06",

    description: "Driver allowance",

    amount: 900,

    status: "Paid",

    vendor: "Internal",

    referenceNumber: "DRV-002",

    notes: "Trip allowance.",
  },
];