export type VehicleTypeStatus = "Active" | "Inactive";

export type VehicleType = {
  id: string;
  name: string;
  description: string;
  capacityTons: number;
  status: VehicleTypeStatus;
};

export const vehicleTypes: VehicleType[] = [
  {
    id: "VT-001",
    name: "4-Wheel Truck",
    description: "Light-duty transportation truck",
    capacityTons: 2,
    status: "Active",
  },
  {
    id: "VT-002",
    name: "6-Wheel Truck",
    description: "Medium-duty transportation truck",
    capacityTons: 5,
    status: "Active",
  },
  {
    id: "VT-003",
    name: "10-Wheel Truck",
    description: "Heavy-duty transportation truck",
    capacityTons: 10,
    status: "Active",
  },
  {
    id: "VT-004",
    name: "Trailer",
    description: "Large cargo trailer",
    capacityTons: 20,
    status: "Active",
  },
  {
    id: "VT-005",
    name: "Pickup",
    description: "Small transportation vehicle",
    capacityTons: 1,
    status: "Active",
  },
];
