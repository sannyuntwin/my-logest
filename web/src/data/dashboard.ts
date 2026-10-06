import { generateTrips } from "./generateTrips";
import { workOrders } from "./workOrders";
import { vehicles } from "./vehicles";
import { fuelTransactions } from "./fuel";
import { invoices } from "./invoices";
import { payments } from "./payments";
import { auditLogs } from "./auditLogs";

import {
  getTotalCost,
  getProfit,
} from "./tripUtils";

const trips = generateTrips(500);

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export function getDashboardSummary() {
  const completedTrips = trips.filter(
    (trip) => trip.status === "Completed"
  );

  const activeTrips = trips.filter(
    (trip) =>
      trip.status === "In Progress" ||
      trip.status === "Planned"
  );

  const totalRevenue = trips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const totalCost = trips.reduce(
    (sum, trip) =>
      sum + getTotalCost(trip),
    0
  );

  const totalProfit = trips.reduce(
    (sum, trip) =>
      sum + getProfit(trip),
    0
  );

  const profitMargin =
    totalRevenue > 0
      ? (totalProfit / totalRevenue) * 100
      : 0;

  const unassignedWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.vehicleId === null ||
        workOrder.driverId === null
    );

  const activeVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Active"
    );

  const maintenanceVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Maintenance"
    );

  const fuelCost =
    fuelTransactions.reduce(
      (sum, transaction) =>
        sum + transaction.totalCost,
      0
    );

  const outstandingInvoices =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          invoice.totalAmount -
            invoice.paidAmount,
          0
        ),
      0
    );

  const completedPayments =
    payments
      .filter(
        (payment) =>
          payment.status === "Completed"
      )
      .reduce(
        (sum, payment) =>
          sum + payment.amount,
        0
      );

  return {
    totalTrips: trips.length,

    completedTrips:
      completedTrips.length,

    activeTrips:
      activeTrips.length,

    totalRevenue,

    totalCost,

    totalProfit,

    profitMargin,

    totalWorkOrders:
      workOrders.length,

    unassignedWorkOrders:
      unassignedWorkOrders.length,

    activeVehicles:
      activeVehicles.length,

    maintenanceVehicles:
      maintenanceVehicles.length,

    fuelCost,

    outstandingInvoices,

    completedPayments,
  };
}

/*
|--------------------------------------------------------------------------
| Trip Status Summary
|--------------------------------------------------------------------------
*/

export function getTripStatusSummary() {
  const statusCounts: Record<
    string,
    number
  > = {};

  trips.forEach((trip) => {
    statusCounts[trip.status] =
      (statusCounts[trip.status] ?? 0) + 1;
  });

  return Object.entries(
    statusCounts
  ).map(([status, count]) => ({
    status,
    count,
  }));
}

/*
|--------------------------------------------------------------------------
| Work Order Status Summary
|--------------------------------------------------------------------------
*/

export function getWorkOrderStatusSummary() {
  const statusCounts: Record<
    string,
    number
  > = {};

  workOrders.forEach((workOrder) => {
    statusCounts[workOrder.status] =
      (statusCounts[workOrder.status] ?? 0) +
      1;
  });

  return Object.entries(
    statusCounts
  ).map(([status, count]) => ({
    status,
    count,
  }));
}

/*
|--------------------------------------------------------------------------
| Unassigned Work Orders
|--------------------------------------------------------------------------
*/

export function getUnassignedWorkOrders() {
  return workOrders.filter(
    (workOrder) =>
      workOrder.vehicleId === null ||
      workOrder.driverId === null
  );
}


/*
|--------------------------------------------------------------------------
| Fleet Overview
|--------------------------------------------------------------------------
*/

export function getFleetSummary() {
  const activeVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status === "Active"
  );

  const maintenanceVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Maintenance"
    );

  const inactiveVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Inactive"
    );

  const totalFuelCost =
    fuelTransactions.reduce(
      (sum, transaction) =>
        sum + transaction.totalCost,
      0
    );

  const totalFuelLiters =
    fuelTransactions.reduce(
      (sum, transaction) =>
        sum + transaction.liters,
      0
    );

  return {
    totalVehicles: vehicles.length,

    activeVehicles:
      activeVehicles.length,

    maintenanceVehicles:
      maintenanceVehicles.length,

    inactiveVehicles:
      inactiveVehicles.length,

    totalFuelCost,

    totalFuelLiters,
  };
}

/*
|--------------------------------------------------------------------------
| Finance Overview
|--------------------------------------------------------------------------
*/

export function getFinanceSummary() {
  const totalRevenue = trips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const totalTripCost = trips.reduce(
    (sum, trip) => sum + getTotalCost(trip),
    0
  );

  const outstandingInvoices = invoices.reduce(
    (sum, invoice) =>
      sum +
      Math.max(
        invoice.totalAmount - invoice.paidAmount,
        0
      ),
    0
  );

  const totalInvoiced = invoices.reduce(
    (sum, invoice) =>
      sum + invoice.totalAmount,
    0
  );

  const totalPayments = payments
    .filter(
      (payment) =>
        payment.status === "Completed"
    )
    .reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const pendingPayments = payments
    .filter(
      (payment) =>
        payment.status === "Pending"
    )
    .reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const paidInvoiceCount =
    invoices.filter(
      (invoice) =>
        invoice.status === "Paid"
    ).length;

  const overdueInvoiceCount =
    invoices.filter(
      (invoice) =>
        invoice.status === "Overdue"
    ).length;

  return {
    totalRevenue,
    totalTripCost,
    totalInvoiced,
    outstandingInvoices,
    totalPayments,
    pendingPayments,
    paidInvoiceCount,
    overdueInvoiceCount,
  };
}


/*
|--------------------------------------------------------------------------
| Recent Activity
|--------------------------------------------------------------------------
*/

export function getRecentActivity(limit = 8) {
  return [...auditLogs]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
}