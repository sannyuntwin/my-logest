import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { generateTrips } from "../../data/generateTrips";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { customers } from "../../data/customers";
import { getProfit, getTotalCost } from "../../data/tripUtils";

const trips = generateTrips(500);

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "status completed";
    case "In Progress":
      return "status in-progress";
    case "Planned":
      return "status planned";
    case "Cancelled":
      return "status cancelled";
    default:
      return "status pending";
  }
}

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const vehicle = vehicles.find(
        (item) => item.id === trip.vehicleId
      );

      const driver = employees.find(
        (item) => item.id === trip.driverId
      );

      const customer = customers.find(
        (item) => item.id === trip.customerId
      );

      const searchText = `
        ${trip.tripNumber}
        ${trip.origin}
        ${trip.destination}
        ${vehicle?.plateNumber ?? ""}
        ${driver?.name ?? ""}
        ${customer?.name ?? ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        trip.status === statusFilter;

      const matchesVehicle =
        vehicleFilter === "All" ||
        trip.vehicleId === vehicleFilter;

      const matchesDriver =
        driverFilter === "All" ||
        trip.driverId === driverFilter;

      const matchesDate =
        !dateFilter || trip.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVehicle &&
        matchesDriver &&
        matchesDate
      );
    });
  }, [
    search,
    statusFilter,
    vehicleFilter,
    driverFilter,
    dateFilter,
  ]);

  const totalRevenue = filteredTrips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const totalProfit = filteredTrips.reduce(
    (sum, trip) => sum + getProfit(trip),
    0
  );

  const completedTrips = filteredTrips.filter(
    (trip) => trip.status === "Completed"
  ).length;

  const inProgressTrips = filteredTrips.filter(
    (trip) => trip.status === "In Progress"
  ).length;

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Trips</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            Manage and monitor transportation trips.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Trip - demo only")
          }
        >
          + Create Trip
        </button>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Total Trips</p>
          <h2>{filteredTrips.length}</h2>
        </div>

        <div className="card">
          <p>Completed</p>
          <h2>{completedTrips}</h2>
        </div>

        <div className="card">
          <p>In Progress</p>
          <h2>{inProgressTrips}</h2>
        </div>

        <div className="card">
          <p>Revenue</p>
          <h2>
            ฿{totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <p>Profit</p>
          <h2>
            ฿{totalProfit.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search trip, vehicle, driver..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            minWidth: 280,
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={vehicleFilter}
          onChange={(event) =>
            setVehicleFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        >
          <option value="All">All Vehicles</option>

          {vehicles.map((vehicle) => (
            <option
              key={vehicle.id}
              value={vehicle.id}
            >
              {vehicle.plateNumber}
            </option>
          ))}
        </select>

        <select
          value={driverFilter}
          onChange={(event) =>
            setDriverFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        >
          <option value="All">All Drivers</option>

          {employees
            .filter(
              (employee) =>
                employee.role === "Driver"
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

        <input
          type="date"
          value={dateFilter}
          onChange={(event) =>
            setDateFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        />

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setVehicleFilter("All");
            setDriverFilter("All");
            setDateFilter("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Trip List</h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: 20,
          }}
        >
          {filteredTrips.length} trips displayed
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1200,
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <th style={{ padding: 12 }}>
                  Trip
                </th>

                <th style={{ padding: 12 }}>
                  Date
                </th>

                <th style={{ padding: 12 }}>
                  Customer
                </th>

                <th style={{ padding: 12 }}>
                  Route
                </th>

                <th style={{ padding: 12 }}>
                  Vehicle
                </th>

                <th style={{ padding: 12 }}>
                  Driver
                </th>

                <th style={{ padding: 12 }}>
                  Distance
                </th>

                <th style={{ padding: 12 }}>
                  Revenue
                </th>

                <th style={{ padding: 12 }}>
                  Cost
                </th>

                <th style={{ padding: 12 }}>
                  Status
                </th>

                <th style={{ padding: 12 }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTrips.map((trip) => {
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

                return (
                  <tr
                    key={trip.id}
                    style={{
                      borderBottom:
                        "1px solid #f1f5f9",
                    }}
                  >
                    <td style={{ padding: 12 }}>
                      <Link
                        to={`/operations/trips/${trip.id}`}
                      >
                        <strong>
                          {trip.tripNumber}
                        </strong>
                      </Link>
                    </td>

                    <td style={{ padding: 12 }}>
                      {trip.date}
                    </td>

                    <td style={{ padding: 12 }}>
                      {customer?.name ??
                        "Unknown"}
                    </td>

                    <td style={{ padding: 12 }}>
                      <div>
                        {trip.origin}
                      </div>

                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        → {trip.destination}
                      </div>
                    </td>

                    <td style={{ padding: 12 }}>
                      {vehicle?.plateNumber ??
                        "Unknown"}
                    </td>

                    <td style={{ padding: 12 }}>
                      {driver?.name ??
                        "Unknown"}
                    </td>

                    <td style={{ padding: 12 }}>
                      {trip.distanceKm} km
                    </td>

                    <td style={{ padding: 12 }}>
                      ฿
                      {trip.revenue.toLocaleString()}
                    </td>

                    <td style={{ padding: 12 }}>
                      ฿
                      {getTotalCost(
                        trip
                      ).toLocaleString()}
                    </td>

                    <td style={{ padding: 12 }}>
                      <span
                        className={statusClass(
                          trip.status
                        )}
                      >
                        {trip.status}
                      </span>
                    </td>

                    <td style={{ padding: 12 }}>
                      <Link
                        to={`/operations/trips/${trip.id}`}
                      >
                        <button>
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
