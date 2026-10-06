import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";

import { employees } from "../../data/employees";
import { branches } from "../../data/branches";
import { vehicles } from "../../data/vehicles";
import { generateTrips } from "../../data/generateTrips";
import { getProfit } from "../../data/tripUtils";

function DriverDetailsPage() {
  const { driverId } = useParams();

  const driver = employees.find(
    (employee) =>
      employee.id === driverId && employee.role === "Driver"
  );

  const trips = useMemo(() => generateTrips(500), []);

  if (!driver) {
    return (
      <div className="card">
        <h2>Driver Not Found</h2>

        <p style={{ color: "#6b7280" }}>
          The driver you are looking for does not exist.
        </p>

        <Link
          to="/drivers"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Drivers
        </Link>
      </div>
    );
  }

  const branch = branches.find(
    (item) => item.id === driver.branchId
  );

  const assignedVehicle = vehicles.find(
    (vehicle) => vehicle.driverId === driver.id
  );

  const driverTrips = trips.filter(
    (trip) => trip.driverId === driver.id
  );

  const completedTrips = driverTrips.filter(
    (trip) => trip.status === "Completed"
  );

  const inProgressTrips = driverTrips.filter(
    (trip) => trip.status === "In Progress"
  );

  const cancelledTrips = driverTrips.filter(
    (trip) => trip.status === "Cancelled"
  );

  const totalRevenue = driverTrips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const totalCost = driverTrips.reduce(
    (sum, trip) =>
      sum +
      trip.fuelCost +
      trip.tollCost +
      trip.otherCost,
    0
  );

  const totalProfit = driverTrips.reduce(
    (sum, trip) => sum + getProfit(trip),
    0
  );

  const totalDistance = driverTrips.reduce(
    (sum, trip) => sum + trip.distanceKm,
    0
  );

  const completionRate =
    driverTrips.length > 0
      ? (completedTrips.length / driverTrips.length) * 100
      : 0;

  const formatCurrency = (value: number) =>
    `฿${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <Link
            to="/drivers"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Drivers
          </Link>

          <h1
            style={{
              margin: "10px 0 4px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {driver.name}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            {driver.employeeCode} · {driver.id}
          </p>
        </div>

        <button
          onClick={() =>
            alert("Driver editing will be connected later.")
          }
          style={{
            border: "1px solid #d1d5db",
            background: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Edit Driver
        </button>
      </div>

      {/* Profile + Assignment */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Profile */}
        <div className="card">
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "18px",
            }}
          >
            Driver Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              rowGap: "14px",
            }}
          >
            <span style={{ color: "#6b7280" }}>
              Employee Code
            </span>
            <strong>{driver.employeeCode}</strong>

            <span style={{ color: "#6b7280" }}>
              Name
            </span>
            <strong>{driver.name}</strong>

            <span style={{ color: "#6b7280" }}>
              Phone
            </span>
            <strong>{driver.phone}</strong>

            <span style={{ color: "#6b7280" }}>
              Role
            </span>
            <strong>{driver.role}</strong>

            <span style={{ color: "#6b7280" }}>
              Branch
            </span>
            <strong>
              {branch?.name ?? "Unknown Branch"}
            </strong>

            <span style={{ color: "#6b7280" }}>
              Status
            </span>

            <span>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background:
                    driver.status === "Active"
                      ? "#dcfce7"
                      : "#f3f4f6",
                  color:
                    driver.status === "Active"
                      ? "#166534"
                      : "#6b7280",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {driver.status}
              </span>
            </span>
          </div>
        </div>

        {/* Vehicle Assignment */}
        <div className="card">
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "18px",
            }}
          >
            Assigned Vehicle
          </h2>

          {assignedVehicle ? (
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {assignedVehicle.plateNumber}
              </div>

              <div
                style={{
                  color: "#6b7280",
                  marginBottom: "20px",
                }}
              >
                {assignedVehicle.brand}{" "}
                {assignedVehicle.model}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  rowGap: "12px",
                }}
              >
                <span style={{ color: "#6b7280" }}>
                  Vehicle Type
                </span>
                <strong>
                  {assignedVehicle.vehicleType}
                </strong>

                <span style={{ color: "#6b7280" }}>
                  Mileage
                </span>
                <strong>
                  {assignedVehicle.mileage.toLocaleString()} km
                </strong>

                <span style={{ color: "#6b7280" }}>
                  Status
                </span>
                <strong>
                  {assignedVehicle.status}
                </strong>
              </div>

              <Link
                to={`/fleet/vehicles/${assignedVehicle.id}`}
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View Vehicle →
              </Link>
            </div>
          ) : (
            <div
              style={{
                padding: "30px 0",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              No vehicle currently assigned.
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <p>Total Trips</p>
          <h2>{driverTrips.length}</h2>
        </div>

        <div className="card">
          <p>Completed</p>
          <h2>{completedTrips.length}</h2>
        </div>

        <div className="card">
          <p>Distance</p>
          <h2>
            {totalDistance.toLocaleString()} km
          </h2>
        </div>

        <div className="card">
          <p>Revenue</p>
          <h2>{formatCurrency(totalRevenue)}</h2>
        </div>

        <div className="card">
          <p>Profit</p>
          <h2>{formatCurrency(totalProfit)}</h2>
        </div>
      </div>

      {/* Performance */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "18px",
          }}
        >
          Driver Performance
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          <div>
            <p>Completion Rate</p>
            <h2>
              {completionRate.toFixed(1)}%
            </h2>
          </div>

          <div>
            <p>In Progress</p>
            <h2>{inProgressTrips.length}</h2>
          </div>

          <div>
            <p>Cancelled</p>
            <h2>{cancelledTrips.length}</h2>
          </div>

          <div>
            <p>Total Cost</p>
            <h2>{formatCurrency(totalCost)}</h2>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Trip History
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Recent trips assigned to this driver.
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px" }}>
                  Trip No.
                </th>

                <th style={{ padding: "12px" }}>
                  Date
                </th>

                <th style={{ padding: "12px" }}>
                  Route
                </th>

                <th style={{ padding: "12px" }}>
                  Distance
                </th>

                <th style={{ padding: "12px" }}>
                  Revenue
                </th>

                <th style={{ padding: "12px" }}>
                  Profit
                </th>

                <th style={{ padding: "12px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {driverTrips.slice(0, 20).map((trip) => (
                <tr
                  key={trip.id}
                  style={{
                    borderBottom:
                      "1px solid #f0f0f0",
                  }}
                >
                  <td style={{ padding: "14px 12px" }}>
                    <strong>{trip.tripNumber}</strong>
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    {trip.date}
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    {trip.origin}
                    <span
                      style={{
                        margin: "0 6px",
                        color: "#9ca3af",
                      }}
                    >
                      →
                    </span>
                    {trip.destination}
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    {trip.distanceKm.toLocaleString()} km
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    {formatCurrency(trip.revenue)}
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    {formatCurrency(getProfit(trip))}
                  </td>

                  <td style={{ padding: "14px 12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 9px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          trip.status === "Completed"
                            ? "#dcfce7"
                            : trip.status ===
                              "In Progress"
                            ? "#dbeafe"
                            : trip.status ===
                              "Cancelled"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          trip.status === "Completed"
                            ? "#166534"
                            : trip.status ===
                              "In Progress"
                            ? "#1d4ed8"
                            : trip.status ===
                              "Cancelled"
                            ? "#b91c1c"
                            : "#92400e",
                      }}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}

              {driverTrips.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No trips found for this driver.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DriverDetailsPage;