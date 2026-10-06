import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import KpiCard from "./KpiCard";
import FilterBar from "./FilterBar";
import RevenueProfitChart from "./RevenueProfitChart";
import TripStatusChart from "./TripStatusChart";
import DistanceChart from "./DistanceChart";

import { generateTrips } from "../data/generateTrips";
import { getMonthlySummary } from "../data/analytics";
import {
  getTotalCost,
  getProfit,
} from "../data/tripUtils";

import {
  getDashboardSummary,
  getTripStatusSummary,
  getWorkOrderStatusSummary,
  getUnassignedWorkOrders,
  getFleetSummary,
  getFinanceSummary,
  getRecentActivity,
} from "../data/dashboard";

const allTrips = generateTrips(500);

export default function Dashboard() {
  const [branch, setBranch] =
    useState("all");

  const [vehicle, setVehicle] =
    useState("all");

  const [driver, setDriver] =
    useState("all");

  const [customer, setCustomer] =
    useState("all");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  /*
   * --------------------------------------------------
   * FILTER TRIPS
   * --------------------------------------------------
   */

  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      const matchesBranch =
        branch === "all" ||
        trip.branchId === branch;

      const matchesVehicle =
        vehicle === "all" ||
        trip.vehicleId === vehicle;

      const matchesDriver =
        driver === "all" ||
        trip.driverId === driver;

      const matchesCustomer =
        customer === "all" ||
        trip.customerId === customer;

      const matchesStartDate =
        !startDate ||
        trip.date >= startDate;

      const matchesEndDate =
        !endDate ||
        trip.date <= endDate;

      return (
        matchesBranch &&
        matchesVehicle &&
        matchesDriver &&
        matchesCustomer &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    branch,
    vehicle,
    driver,
    customer,
    startDate,
    endDate,
  ]);

  /*
   * --------------------------------------------------
   * FILTERED KPI DATA
   * --------------------------------------------------
   */

  const filteredRevenue =
    filteredTrips.reduce(
      (sum, trip) =>
        sum + trip.revenue,
      0
    );

  const filteredCost =
    filteredTrips.reduce(
      (sum, trip) =>
        sum + getTotalCost(trip),
      0
    );

  const filteredProfit =
    filteredTrips.reduce(
      (sum, trip) =>
        sum + getProfit(trip),
      0
    );

  const filteredProfitMargin =
    filteredRevenue > 0
      ? (filteredProfit /
          filteredRevenue) *
        100
      : 0;

  const completedTrips =
    filteredTrips.filter(
      (trip) =>
        trip.status ===
        "Completed"
    ).length;

  const activeTrips =
    filteredTrips.filter(
      (trip) =>
        trip.status ===
          "In Progress" ||
        trip.status === "Planned"
    ).length;

  const monthlySummary = getMonthlySummary(filteredTrips);
  const filteredTripStatusSummary = Object.entries(
    filteredTrips.reduce<Record<string, number>>(
      (counts, trip) => {
        counts[trip.status] = (counts[trip.status] ?? 0) + 1;
        return counts;
      },
      {}
    )
  ).map(([status, count]) => ({ status, count }));

  /*
   * --------------------------------------------------
   * GLOBAL DASHBOARD DATA
   * --------------------------------------------------
   */

  const summary =
    getDashboardSummary();

  const tripStatusSummary =
    getTripStatusSummary();

  const workOrderStatusSummary =
    getWorkOrderStatusSummary();

  const unassignedWorkOrders =
    getUnassignedWorkOrders();

  const fleetSummary =
    getFleetSummary();

  const financeSummary =
    getFinanceSummary();

  const recentActivity =
    getRecentActivity(8);

  /*
   * --------------------------------------------------
   * FILTER OPTIONS
   * --------------------------------------------------
   */

  /*
   * --------------------------------------------------
   * RESET FILTERS
   * --------------------------------------------------
   */

  const resetFilters = () => {
    setBranch("all");
    setVehicle("all");
    setDriver("all");
    setCustomer("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            marginBottom: 6,
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
          }}
        >
          Transportation management
          overview
        </p>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <FilterBar
        selectedBranch={branch}
        selectedVehicle={vehicle}
        selectedDriver={driver}
        selectedCustomer={customer}
        dateFrom={startDate}
        dateTo={endDate}
        setSelectedBranch={setBranch}
        setSelectedVehicle={setVehicle}
        setSelectedDriver={setDriver}
        setSelectedCustomer={setCustomer}
        setDateFrom={setStartDate}
        setDateTo={setEndDate}
        resetFilters={resetFilters}
      />

      {/* =================================================
          EXECUTIVE KPI ROW
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(6, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Total Trips"
          value={
            filteredTrips.length
          }
        />

        <KpiCard
          title="Active Trips"
          value={activeTrips}
        />

        <KpiCard
          title="Completed Trips"
          value={completedTrips}
        />

        <KpiCard
          title="Revenue"
          value={`฿${filteredRevenue.toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />

        <KpiCard
          title="Total Cost"
          value={`฿${filteredCost.toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />

        <KpiCard
          title="Profit"
          value={`฿${filteredProfit.toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />
      </div>

      {/* =================================================
          PROFIT MARGIN
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          marginTop: -12,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            color:
              filteredProfit >= 0
                ? "#166534"
                : "#b91c1c",
            fontWeight: 600,
          }}
        >
          Profit Margin:{" "}
          {filteredProfitMargin.toFixed(
            1
          )}
          %
        </span>
      </div>

      {/* =================================================
          OPERATIONS KPI ROW
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Work Orders"
          value={
            summary.totalWorkOrders
          }
        />

        <KpiCard
          title="Unassigned Jobs"
          value={
            summary.unassignedWorkOrders
          }
        />

        <KpiCard
          title="Active Vehicles"
          value={
            summary.activeVehicles
          }
        />

        <KpiCard
          title="Maintenance Vehicles"
          value={
            summary.maintenanceVehicles
          }
        />

        <KpiCard
          title="Outstanding Invoices"
          value={`฿${summary.outstandingInvoices.toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 0,
            }
          )}`}
        />
      </div>

      {/* =================================================
          OPERATIONS OVERVIEW
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Trip Status */}

        <div className="card">
          <h2>Trip Status</h2>

          <p
            style={{
              color: "#6b7280",
              marginTop: 6,
              marginBottom: 20,
            }}
          >
            Current distribution of
            trips.
          </p>

          {tripStatusSummary.map(
            (item) => (
              <div
                key={item.status}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 14,
                }}
              >
                <span
                  className={`status ${item.status
                    .toLowerCase()
                    .replace(
                      " ",
                      "-"
                    )}`}
                >
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>
            )
          )}
        </div>

        {/* Work Order Status */}

        <div className="card">
          <h2>
            Work Order Status
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginTop: 6,
              marginBottom: 20,
            }}
          >
            Current workload across
            the operation.
          </p>

          {workOrderStatusSummary.map(
            (item) => (
              <div
                key={item.status}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 14,
                }}
              >
                <span
                  className={`status ${item.status
                    .toLowerCase()
                    .replace(
                      " ",
                      "-"
                    )}`}
                >
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>
            )
          )}
        </div>
      </div>

      {/* =================================================
          DISPATCH ATTENTION
      ================================================= */}

      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2>
              Dispatch Attention
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: 6,
              }}
            >
              Work orders requiring
              vehicle or driver
              assignment.
            </p>
          </div>

          <Link to="/operations/dispatch">
            Open Dispatch Board →
          </Link>
        </div>

        {unassignedWorkOrders.length ===
        0 ? (
          <div
            style={{
              padding: 20,
              background:
                "#f0fdf4",
              borderRadius: 8,
              color: "#166534",
            }}
          >
            All work orders are
            assigned.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>
                    Work Order
                  </th>
                  <th>
                    Customer
                  </th>
                  <th>
                    Pickup
                  </th>
                  <th>
                    Delivery
                  </th>
                  <th>
                    Priority
                  </th>
                  <th>
                    Assignment
                  </th>
                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {unassignedWorkOrders.map(
                  (workOrder) => (
                    <tr
                      key={
                        workOrder.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            workOrder.workOrderNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          workOrder.customerId
                        }
                      </td>

                      <td>
                        {
                          workOrder.pickupLocation
                        }
                      </td>

                      <td>
                        {
                          workOrder.deliveryLocation
                        }
                      </td>

                      <td>
                        <span
                          className={`priority ${workOrder.priority.toLowerCase()}`}
                        >
                          {
                            workOrder.priority
                          }
                        </span>
                      </td>

                      <td>
                        {workOrder.vehicleId
                          ? "Vehicle assigned"
                          : "Vehicle missing"}

                        <br />

                        {workOrder.driverId
                          ? "Driver assigned"
                          : "Driver missing"}
                      </td>

                      <td>
                        <Link
                          to={`/operations/dispatch/${workOrder.id}/assign`}
                        >
                          Assign
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>


{/* =================================================
    FLEET OVERVIEW
================================================= */}

      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2>Fleet Overview</h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: 6,
              }}
            >
              Current vehicle availability and
              fuel usage.
            </p>
          </div>

          <Link to="/fleet/vehicles">
            Manage Fleet →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {/* Total Vehicles */}
          <div
            style={{
              padding: 20,
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Total Vehicles
            </p>

            <h2>
              {fleetSummary.totalVehicles}
            </h2>
          </div>

          {/* Active Vehicles */}
          <div
            style={{
              padding: 20,
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Active Vehicles
            </p>

            <h2>
              {fleetSummary.activeVehicles}
            </h2>
          </div>

          {/* Maintenance */}
          <div
            style={{
              padding: 20,
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Maintenance
            </p>

            <h2>
              {fleetSummary.maintenanceVehicles}
            </h2>
          </div>

          {/* Fuel */}
          <div
            style={{
              padding: 20,
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Fuel Cost
            </p>

            <h2>
              ฿
              {fleetSummary.totalFuelCost.toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </h2>

            <small
              style={{
                color: "#6b7280",
              }}
            >
              {fleetSummary.totalFuelLiters.toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 0,
                }
              )}{" "}
              liters
            </small>
          </div>
        </div>
      </div>

{/* =================================================
    FINANCE OVERVIEW
================================================= */}

<div
  className="card"
  style={{
    marginBottom: 24,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    }}
  >
    <div>
      <h2>Finance Overview</h2>

      <p
        style={{
          color: "#6b7280",
          marginTop: 6,
        }}
      >
        Revenue, costs, invoices and
        payment activity.
      </p>
    </div>

    <Link to="/finance/revenue">
      Open Finance →
    </Link>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
      gap: 16,
    }}
  >
    {/* Revenue */}

    <div
      style={{
        padding: 20,
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        Revenue
      </p>

      <h2>
        ฿
        {financeSummary.totalRevenue.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}
      </h2>
    </div>

    {/* Costs */}

    <div
      style={{
        padding: 20,
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        Trip Costs
      </p>

      <h2>
        ฿
        {financeSummary.totalTripCost.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}
      </h2>
    </div>

    {/* Outstanding */}

    <div
      style={{
        padding: 20,
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        Outstanding Invoices
      </p>

      <h2>
        ฿
        {financeSummary.outstandingInvoices.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}
      </h2>

      <small
        style={{
          color: "#6b7280",
        }}
      >
        {financeSummary.overdueInvoiceCount} overdue
      </small>
    </div>

    {/* Payments */}

    <div
      style={{
        padding: 20,
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        Payments Received
      </p>

      <h2>
        ฿
        {financeSummary.totalPayments.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}
      </h2>

      <small
        style={{
          color: "#6b7280",
        }}
      >
        ฿
        {financeSummary.pendingPayments.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}{" "}
        pending
      </small>
    </div>
  </div>

  {/* Finance Details */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
      gap: 16,
      marginTop: 16,
    }}
  >
    <div
      style={{
        padding: 16,
        background: "#f9fafb",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          color: "#6b7280",
        }}
      >
        Total Invoiced
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
        }}
      >
        ฿
        {financeSummary.totalInvoiced.toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 0,
          }
        )}
      </strong>
    </div>

    <div
      style={{
        padding: 16,
        background: "#f9fafb",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          color: "#6b7280",
        }}
      >
        Paid Invoices
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
        }}
      >
        {financeSummary.paidInvoiceCount}
      </strong>
    </div>

    <div
      style={{
        padding: 16,
        background: "#f9fafb",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          color: "#6b7280",
        }}
      >
        Overdue Invoices
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          color:
            financeSummary.overdueInvoiceCount >
            0
              ? "#b91c1c"
              : "#166534",
        }}
      >
        {financeSummary.overdueInvoiceCount}
      </strong>
    </div>
  </div>
</div>

      {/* =================================================
          FINANCIAL / TRIP CHARTS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <h2>
            Revenue & Profit
          </h2>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <RevenueProfitChart
              data={monthlySummary}
            />
          </div>
        </div>

        <div className="card">
          <h2>
            Trip Status Overview
          </h2>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <TripStatusChart
              data={filteredTripStatusSummary}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          DISTANCE
      ================================================= */}

      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <h2>
          Distance by Month
        </h2>

        <div
          style={{
            marginTop: 20,
          }}
        >
          <DistanceChart
            data={monthlySummary}
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2>Recent Activity</h2>
            <p style={{ color: "#6b7280", marginTop: 6 }}>
              Latest activity across the TMS.
            </p>
          </div>
          <Link to="/administration/audit-logs">
            View Audit Logs →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 120px 140px 1fr",
                gap: 16,
                alignItems: "center",
                padding: 14,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                {new Date(activity.timestamp).toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
              <div><strong>{activity.userId}</strong></div>
              <div>
                <span className="status">{activity.action}</span>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{activity.entity}</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>
                  {activity.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          DASHBOARD DATA NOTE
      ================================================= */}

      <div
        style={{
          padding: 16,
          background: "#eff6ff",
          border:
            "1px solid #bfdbfe",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <strong>
          Dashboard Data
        </strong>

        <p
          style={{
            margin:
              "6px 0 0",
            color: "#374151",
            fontSize: 14,
          }}
        >
          This dashboard currently
          uses the TMS demo data
          stored in the frontend.
          Once FastAPI and PostgreSQL
          are connected, these
          calculations will come from
          the backend.
        </p>
      </div>
    </div>
  );
}
