export type FuelType =
  | "Diesel"
  | "Gasoline"
  | "EV Charging";

export type FuelTransaction = {
  id: string;
  vehicleId: string;
  date: string;
  fuelType: FuelType;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  mileage: number;
  fuelStation: string;
};

export const fuelTransactions: FuelTransaction[] = [
  {
    id: "FUEL-001",
    vehicleId: "VH-001",
    date: "2026-04-03",
    fuelType: "Diesel",
    liters: 120,
    pricePerLiter: 31.5,
    totalCost: 3780,
    mileage: 121100,
    fuelStation: "PTT Bang Na",
  },
  {
    id: "FUEL-002",
    vehicleId: "VH-002",
    date: "2026-04-05",
    fuelType: "Diesel",
    liters: 90,
    pricePerLiter: 31.5,
    totalCost: 2835,
    mileage: 95400,
    fuelStation: "PTT Rangsit",
  },
  {
    id: "FUEL-003",
    vehicleId: "VH-003",
    date: "2026-04-08",
    fuelType: "Diesel",
    liters: 180,
    pricePerLiter: 31.5,
    totalCost: 5670,
    mileage: 185200,
    fuelStation: "Shell Rama 2",
  },
  {
    id: "FUEL-004",
    vehicleId: "VH-004",
    date: "2026-04-12",
    fuelType: "Diesel",
    liters: 130,
    pricePerLiter: 31.5,
    totalCost: 4095,
    mileage: 141800,
    fuelStation: "Bangchak Lad Krabang",
  },
  {
    id: "FUEL-005",
    vehicleId: "VH-001",
    date: "2026-05-02",
    fuelType: "Diesel",
    liters: 110,
    pricePerLiter: 32,
    totalCost: 3520,
    mileage: 122500,
    fuelStation: "PTT Bang Na",
  },
  {
    id: "FUEL-006",
    vehicleId: "VH-002",
    date: "2026-05-07",
    fuelType: "Diesel",
    liters: 85,
    pricePerLiter: 32,
    totalCost: 2720,
    mileage: 96800,
    fuelStation: "PTT Rangsit",
  },
  {
    id: "FUEL-007",
    vehicleId: "VH-003",
    date: "2026-05-11",
    fuelType: "Diesel",
    liters: 170,
    pricePerLiter: 32,
    totalCost: 5440,
    mileage: 186100,
    fuelStation: "Shell Rama 2",
  },
  {
    id: "FUEL-008",
    vehicleId: "VH-004",
    date: "2026-05-15",
    fuelType: "Diesel",
    liters: 125,
    pricePerLiter: 32,
    totalCost: 4000,
    mileage: 142900,
    fuelStation: "Bangchak Lad Krabang",
  },
];
