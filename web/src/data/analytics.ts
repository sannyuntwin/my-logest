import type { Trip } from "./trips";
import { getProfit, getTotalCost } from "./tripUtils";

export type MonthlySummary = {
  month: string;
  trips: number;
  revenue: number;
  cost: number;
  profit: number;
  distance: number;
};

export function getMonthlySummary(
  trips: Trip[]
): MonthlySummary[] {
  const months = [
    "2026-04",
    "2026-05",
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
  ];

  return months.map((month) => {
    const monthTrips = trips.filter((trip) =>
      trip.date.startsWith(month)
    );

    return {
      month,

      trips: monthTrips.length,

      revenue: monthTrips.reduce(
        (sum, trip) => sum + trip.revenue,
        0
      ),

      cost: monthTrips.reduce(
        (sum, trip) => sum + getTotalCost(trip),
        0
      ),

      profit: monthTrips.reduce(
        (sum, trip) => sum + getProfit(trip),
        0
      ),

      distance: monthTrips.reduce(
        (sum, trip) => sum + trip.distanceKm,
        0
      ),
    };
  });
}