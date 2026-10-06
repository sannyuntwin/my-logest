export type Vehicle = {
  id: string;
  plateNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  branchId: string;
  driverId: string;
  status: "Active" | "Inactive" | "Maintenance";
  mileage: number;
};

export const vehicles: Vehicle[] = [
  {
    id: "VH-001",
    plateNumber: "1กข-1234",
    vehicleType: "6-Wheel Truck",
    brand: "Isuzu",
    model: "NPR",
    branchId: "BR-001",
    driverId: "EMP-001",
    status: "Active",
    mileage: 125430,
  },
  {
    id: "VH-002",
    plateNumber: "2กค-5678",
    vehicleType: "4-Wheel Truck",
    brand: "Toyota",
    model: "Hilux",
    branchId: "BR-001",
    driverId: "EMP-002",
    status: "Active",
    mileage: 98320,
  },
  {
    id: "VH-003",
    plateNumber: "3กง-9012",
    vehicleType: "10-Wheel Truck",
    brand: "Hino",
    model: "500",
    branchId: "BR-002",
    driverId: "EMP-003",
    status: "Maintenance",
    mileage: 187650,
  },
  {
    id: "VH-004",
    plateNumber: "4กจ-3456",
    vehicleType: "6-Wheel Truck",
    brand: "Isuzu",
    model: "FVM",
    branchId: "BR-003",
    driverId: "EMP-004",
    status: "Active",
    mileage: 143210,
  },
];