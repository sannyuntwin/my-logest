import type { Trip, TripStatus } from "./trips";

const statuses: TripStatus[] = [
  "Completed",
  "Completed",
  "Completed",
  "Completed",
  "In Progress",
  "Planned",
  "Cancelled",
];

const vehicleAssignments = [
  {
    vehicleId: "VH-001",
    driverId: "EMP-001",
    branchId: "BR-001",
  },
  {
    vehicleId: "VH-002",
    driverId: "EMP-002",
    branchId: "BR-001",
  },
  {
    vehicleId: "VH-003",
    driverId: "EMP-003",
    branchId: "BR-002",
  },
  {
    vehicleId: "VH-004",
    driverId: "EMP-004",
    branchId: "BR-003",
  },
];

const customerIds = [
  "CUS-001",
  "CUS-002",
  "CUS-003",
  "CUS-004",
  "CUS-005",
];

const routes = [
  {
    origin: "Bangkok",
    destination: "Chonburi",
    minDistance: 120,
    maxDistance: 160,
  },
  {
    origin: "Bangkok",
    destination: "Ayutthaya",
    minDistance: 70,
    maxDistance: 100,
  },
  {
    origin: "Bangkok",
    destination: "Nakhon Pathom",
    minDistance: 50,
    maxDistance: 80,
  },
  {
    origin: "Bangkok",
    destination: "Samut Prakan",
    minDistance: 40,
    maxDistance: 70,
  },
  {
    origin: "Chonburi",
    destination: "Rayong",
    minDistance: 80,
    maxDistance: 110,
  },
  {
    origin: "Ayutthaya",
    destination: "Bangkok",
    minDistance: 70,
    maxDistance: 100,
  },
];

/**
 * Simple seeded random generator.
 * The same seed produces the same data.
 */
function createRandom(seed: number) {
  let value = seed;

  return function random() {
    value = (value * 9301 + 49297) % 233280;

    return value / 233280;
  };
}

function randomNumber(
  random: () => number,
  min: number,
  max: number
): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem<T>(
  random: () => number,
  items: T[]
): T {
  return items[Math.floor(random() * items.length)];
}

function randomDate(
  random: () => number,
  start: Date,
  end: Date
): Date {
  const timestamp =
    start.getTime() +
    random() * (end.getTime() - start.getTime());

  return new Date(timestamp);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function generateTrips(
  count: number = 500
): Trip[] {
  const random = createRandom(20261006);

  const trips: Trip[] = [];

  const startDate = new Date("2026-04-01");
  const endDate = new Date("2026-09-30");

  for (let i = 1; i <= count; i++) {
    const assignment = randomItem(
      random,
      vehicleAssignments
    );

    const route = randomItem(random, routes);

    const distanceKm = randomNumber(
      random,
      route.minDistance,
      route.maxDistance
    );

    const status = randomItem(random, statuses);

    const revenue = randomNumber(
      random,
      4000,
      15000
    );

    const fuelCost = Math.round(
      distanceKm * randomNumber(random, 10, 15)
    );

    const tollCost = randomNumber(
      random,
      50,
      500
    );

    const otherCost = randomNumber(
      random,
      50,
      400
    );

    trips.push({
      id: `TRIP-${String(i).padStart(4, "0")}`,

      tripNumber: `TR-2026-${String(i).padStart(4, "0")}`,

      date: formatDate(
        randomDate(random, startDate, endDate)
      ),

      branchId: assignment.branchId,

      vehicleId: assignment.vehicleId,

      driverId: assignment.driverId,

      customerId: randomItem(
        random,
        customerIds
      ),

      origin: route.origin,

      destination: route.destination,

      distanceKm,

      status,

      revenue,

      fuelCost,

      tollCost,

      otherCost,
    });
  }

  return trips;
}