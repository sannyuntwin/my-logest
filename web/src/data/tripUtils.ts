import type { Trip } from "./trips";

export function getTotalCost(trip: Trip): number {
  return trip.fuelCost + trip.tollCost + trip.otherCost;
}

export function getProfit(trip: Trip): number {
  return trip.revenue - getTotalCost(trip);
}