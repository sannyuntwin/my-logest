export type MaintenanceStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type MaintenanceType =
  | "Preventive"
  | "Repair"
  | "Inspection"
  | "Tire"
  | "Other";

export type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  completedDate: string | null;
  mileage: number;
  cost: number;
  serviceProvider: string;
  status: MaintenanceStatus;
};

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "MNT-001",
    vehicleId: "VH-001",
    type: "Preventive",
    description: "Engine oil and filter replacement",
    scheduledDate: "2026-04-15",
    completedDate: "2026-04-15",
    mileage: 120000,
    cost: 4500,
    serviceProvider: "Isuzu Service Center",
    status: "Completed",
  },
  {
    id: "MNT-002",
    vehicleId: "VH-002",
    type: "Inspection",
    description: "General vehicle inspection",
    scheduledDate: "2026-05-10",
    completedDate: "2026-05-10",
    mileage: 95000,
    cost: 1800,
    serviceProvider: "Toyota Service Center",
    status: "Completed",
  },
  {
    id: "MNT-003",
    vehicleId: "VH-003",
    type: "Repair",
    description: "Brake system repair",
    scheduledDate: "2026-06-05",
    completedDate: null,
    mileage: 187650,
    cost: 12500,
    serviceProvider: "Hino Service Center",
    status: "In Progress",
  },
  {
    id: "MNT-004",
    vehicleId: "VH-004",
    type: "Tire",
    description: "Replace rear tires",
    scheduledDate: "2026-07-20",
    completedDate: null,
    mileage: 143210,
    cost: 22000,
    serviceProvider: "Tire Pro",
    status: "Scheduled",
  },
  {
    id: "MNT-005",
    vehicleId: "VH-001",
    type: "Inspection",
    description: "Annual vehicle inspection",
    scheduledDate: "2026-08-12",
    completedDate: "2026-08-12",
    mileage: 124800,
    cost: 1200,
    serviceProvider: "Transport Inspection Center",
    status: "Completed",
  },
];
