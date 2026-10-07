export const mockTrucks = [
  {
    id: "TRUCK-001",
    plateNumber: "1กข-1234",
    driver: "Aung Aung",
    status: "In Transit",
    location: "Bangkok",
    speed: 62,
    fuel: 78,
    shipmentId: "SHP-2026-001",
  },
  {
    id: "TRUCK-002",
    plateNumber: "2ขค-5678",
    driver: "Ko Min",
    status: "Loading",
    location: "Warehouse A",
    speed: 0,
    fuel: 91,
    shipmentId: "SHP-2026-002",
  },
  {
    id: "TRUCK-003",
    plateNumber: "3งจ-9012",
    driver: "Tun Tun",
    status: "In Transit",
    location: "Bangkok",
    speed: 55,
    fuel: 45,
    shipmentId: "SHP-2026-003",
  },
];

export const mockShipments = [
  {
    id: "SHP-2026-001",
    truckId: "TRUCK-001",
    customer: "ABC Company",
    origin: "Bangkok Warehouse",
    destination: "Ayutthaya",
    status: "In Transit",
    progress: 0,

    route: [
      [0, 0.15, 2],
      [2, 0.15, 2],
      [4, 0.15, 2],
      [6, 0.15, 2],
      [8, 0.15, 4],
    ] as [number, number, number][],
  },

  {
    id: "SHP-2026-002",
    truckId: "TRUCK-002",
    customer: "XYZ Company",
    origin: "Warehouse A",
    destination: "Bangkok",
    status: "In Transit",
    progress: 0,

    route: [
      [7, 0.15, 2],
      [7, 0.15, 0],
      [5, 0.15, 0],
      [3, 0.15, 0],
      [0, 0.15, 2],
    ] as [number, number, number][],
  },

  {
    id: "SHP-2026-003",
    truckId: "TRUCK-003",
    customer: "DEF Company",
    origin: "Bangkok",
    destination: "Ayutthaya",
    status: "In Transit",
    progress: 0,

    route: [
      [-7, 0.15, 2],
      [-7, 0.15, 0],
      [-5, 0.15, 0],
      [-3, 0.15, 2],
      [0, 0.15, 2],
    ] as [number, number, number][],
  },
];