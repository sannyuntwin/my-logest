export type TripStatus =
  | "Planned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type Trip = {
  id: string;
  tripNumber: string;

  date: string;

  branchId: string;
  vehicleId: string;
  driverId: string;
  customerId: string;

  origin: string;
  destination: string;

  distanceKm: number;

  status: TripStatus;

  revenue: number;
  fuelCost: number;
  tollCost: number;
  otherCost: number;
};

export const trips: Trip[] = [
  {
    id: "TRIP-001",
    tripNumber: "TR-2026-0001",
    date: "2026-04-01",

    branchId: "BR-001",
    vehicleId: "VH-001",
    driverId: "EMP-001",
    customerId: "CUS-001",

    origin: "Bangkok",
    destination: "Chonburi",

    distanceKm: 145,

    status: "Completed",

    revenue: 8500,
    fuelCost: 2100,
    tollCost: 450,
    otherCost: 200,
  },

  {
    id: "TRIP-002",
    tripNumber: "TR-2026-0002",
    date: "2026-04-02",

    branchId: "BR-001",
    vehicleId: "VH-002",
    driverId: "EMP-002",
    customerId: "CUS-002",

    origin: "Bangkok",
    destination: "Ayutthaya",

    distanceKm: 85,

    status: "Completed",

    revenue: 5200,
    fuelCost: 1300,
    tollCost: 200,
    otherCost: 150,
  },

  {
    id: "TRIP-003",
    tripNumber: "TR-2026-0003",
    date: "2026-04-03",

    branchId: "BR-002",
    vehicleId: "VH-003",
    driverId: "EMP-003",
    customerId: "CUS-003",

    origin: "Chonburi",
    destination: "Rayong",

    distanceKm: 95,

    status: "Completed",

    revenue: 6500,
    fuelCost: 1800,
    tollCost: 150,
    otherCost: 250,
  },

  {
    id: "TRIP-004",
    tripNumber: "TR-2026-0004",
    date: "2026-04-05",

    branchId: "BR-003",
    vehicleId: "VH-004",
    driverId: "EMP-004",
    customerId: "CUS-004",

    origin: "Ayutthaya",
    destination: "Bangkok",

    distanceKm: 80,

    status: "Completed",

    revenue: 4800,
    fuelCost: 1200,
    tollCost: 180,
    otherCost: 100,
  },

  {
    id: "TRIP-005",
    tripNumber: "TR-2026-0005",
    date: "2026-04-07",

    branchId: "BR-001",
    vehicleId: "VH-001",
    driverId: "EMP-001",
    customerId: "CUS-005",

    origin: "Bangkok",
    destination: "Samut Prakan",

    distanceKm: 55,

    status: "In Progress",

    revenue: 3500,
    fuelCost: 900,
    tollCost: 100,
    otherCost: 50,
  },

  {
    id: "TRIP-006",
    tripNumber: "TR-2026-0006",
    date: "2026-04-08",

    branchId: "BR-001",
    vehicleId: "VH-002",
    driverId: "EMP-002",
    customerId: "CUS-001",

    origin: "Bangkok",
    destination: "Nakhon Pathom",

    distanceKm: 65,

    status: "Planned",

    revenue: 4200,
    fuelCost: 1000,
    tollCost: 120,
    otherCost: 100,
  },
];