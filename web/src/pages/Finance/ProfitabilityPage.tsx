import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { generateTrips } from "../../data/generateTrips";
import { customers } from "../../data/customers";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { getProfit, getTotalCost } from "../../data/tripUtils";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function profitClass(value: number) {
  if (value > 0) {
    return "profit-positive";
  }

  if (value < 0) {
    return "profit-negative";
  }

  return "profit-neutral";
}

export default function ProfitabilityPage() {
  const trips = useMemo(
    () => generateTrips(500),
    []
  );

  const [search, setSearch] = useState("");

  const [vehicleFilter, setVehicleFilter] =
    useState("All");

  const [driverFilter, setDriverFilter] =
    useState("All");

  const [customerFilter, setCustomerFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const completedTrips = trips.filter(
    (trip) => trip.status === "Completed"
  );

  const totalRevenue = completedTrips.reduce(
    (sum, trip) =>
      sum + trip.revenue,
    0
  );

  const totalCost = completedTrips.reduce(
    (sum, trip) =>
      sum + getTotalCost(trip),
    0
  );

  const totalProfit =
    totalRevenue - totalCost;

  const profitMargin =
    totalRevenue > 0
      ? (totalProfit / totalRevenue) *
        100
      : 0;

  const filteredTrips = completedTrips.filter(
    (trip) => {
      const vehicle = vehicles.find(
        (item) =>
          item.id === trip.vehicleId
      );

      const driver = employees.find(
        (item) =>
          item.id === trip.driverId
      );

      const customer = customers.find(
        (item) =>
          item.id === trip.customerId
      );

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        trip.tripNumber
          .toLowerCase()
          .includes(searchText) ||
        trip.origin
          .toLowerCase()
          .includes(searchText) ||
        trip.destination
          .toLowerCase()
          .includes(searchText) ||
        (vehicle?.plateNumber
          .toLowerCase()
          .includes(searchText) ??
          false) ||
        (driver?.name
          .toLowerCase()
          .includes(searchText) ??
          false) ||
        (customer?.name
          .toLowerCase()
          .includes(searchText) ??
          false);

      const matchesVehicle =
        vehicleFilter === "All" ||
        trip.vehicleId ===
          vehicleFilter;

      const matchesDriver =
        driverFilter === "All" ||
        trip.driverId ===
          driverFilter;

      const matchesCustomer =
        customerFilter === "All" ||
        trip.customerId ===
          customerFilter;

      const matchesStatus =
        statusFilter === "All" ||
        trip.status === statusFilter;

      return (
        matchesSearch &&
        matchesVehicle &&
        matchesDriver &&
        matchesCustomer &&
        matchesStatus
      );
    }
  );

  const averageProfit =
    completedTrips.length > 0
      ? totalProfit /
        completedTrips.length
      : 0;

  const profitableTrips =
    completedTrips.filter(
      (trip) => getProfit(trip) > 0
    ).length;

  const lossMakingTrips =
    completedTrips.filter(
      (trip) => getProfit(trip) < 0
    ).length;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Profitability</h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Analyze revenue, operating costs,
            and profit by transportation trip.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Completed Trips</p>

          <h2>
            {completedTrips.length}
          </h2>
        </div>

        <div className="card">
          <p>Revenue</p>

          <h2>
            {formatCurrency(totalRevenue)}
          </h2>
        </div>

        <div className="card">
          <p>Total Cost</p>

          <h2>
            {formatCurrency(totalCost)}
          </h2>
        </div>

        <div className="card">
          <p>Total Profit</p>

          <h2
            className={profitClass(
              totalProfit
            )}
          >
            {formatCurrency(totalProfit)}
          </h2>
        </div>

        <div className="card">
          <p>Profit Margin</p>

          <h2>
            {profitMargin.toFixed(1)}%
          </h2>
        </div>
      </div>

      {/* Profit Summary */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Profitability Summary
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          <div>
            <p>Average Profit / Trip</p>

            <h2
              className={profitClass(
                averageProfit
              )}
            >
              {formatCurrency(
                averageProfit
              )}
            </h2>
          </div>

          <div>
            <p>Profitable Trips</p>

            <h2>
              {profitableTrips}
            </h2>
          </div>

          <div>
            <p>Loss-Making Trips</p>

            <h2>
              {lossMakingTrips}
            </h2>
          </div>

          <div>
            <p>Cost Ratio</p>

            <h2>
              {totalRevenue > 0
                ? (
                    (totalCost /
                      totalRevenue) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </h2>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label>Search</label>

            <input
              type="text"
              placeholder="Search trip, customer, vehicle..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing:
                  "border-box",
              }}
            />
          </div>

          <div>
            <label>Vehicle</label>

            <select
              value={vehicleFilter}
              onChange={(event) =>
                setVehicleFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Vehicles
              </option>

              {vehicles.map(
                (vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.plateNumber}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label>Driver</label>

            <select
              value={driverFilter}
              onChange={(event) =>
                setDriverFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Drivers
              </option>

              {employees
                .filter(
                  (employee) =>
                    employee.role ===
                    "Driver"
                )
                .map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Customer</label>

            <select
              value={customerFilter}
              onChange={(event) =>
                setCustomerFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Customers
              </option>

              {customers.map(
                (customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Profitability Table */}
      <div className="card">
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <h2>
            Trip Profitability
          </h2>

          <p>
            {filteredTrips.length} completed
            trips
          </p>
        </div>

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
                <th>Trip</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Distance</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrips.map(
                (trip) => {
                  const vehicle =
                    vehicles.find(
                      (item) =>
                        item.id ===
                        trip.vehicleId
                    );

                  const driver =
                    employees.find(
                      (item) =>
                        item.id ===
                        trip.driverId
                    );

                  const customer =
                    customers.find(
                      (item) =>
                        item.id ===
                        trip.customerId
                    );

                  const cost =
                    getTotalCost(trip);

                  const profit =
                    getProfit(trip);

                  const margin =
                    trip.revenue > 0
                      ? (profit /
                          trip.revenue) *
                        100
                      : 0;

                  return (
                    <tr
                      key={trip.id}
                    >
                      <td>
                        <strong>
                          {
                            trip.tripNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {trip.date}
                      </td>

                      <td>
                        {customer?.name ??
                          "-"}
                      </td>

                      <td>
                        {vehicle ? (
                          <Link
                            to={`/fleet/vehicles/${vehicle.id}`}
                          >
                            {
                              vehicle.plateNumber
                            }
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {driver ? (
                          <Link
                            to={`/drivers/${driver.id}`}
                          >
                            {driver.name}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {trip.distanceKm.toLocaleString()}{" "}
                        km
                      </td>

                      <td>
                        {formatCurrency(
                          trip.revenue
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          cost
                        )}
                      </td>

                      <td>
                        <strong
                          className={profitClass(
                            profit
                          )}
                        >
                          {formatCurrency(
                            profit
                          )}
                        </strong>
                      </td>

                      <td>
                        <strong
                          className={profitClass(
                            profit
                          )}
                        >
                          {margin.toFixed(1)}%
                        </strong>
                      </td>

                      <td>
                        <Link
                          to={`/operations/trips/${trip.id}`}
                        >
                          <button>
                            View Trip
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {filteredTrips.length ===
          0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#6b7280",
            }}
          >
            No completed trips found.
          </div>
        )}
      </div>
    </div>
  );
}
