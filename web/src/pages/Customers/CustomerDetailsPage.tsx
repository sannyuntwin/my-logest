import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { customers } from "../../data/customers";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";
import { generateTrips } from "../../data/generateTrips";
import { getProfit } from "../../data/tripUtils";

function CustomerDetailsPage() {
  const { customerId } = useParams();

  const customer = customers.find(
    (item) => item.id === customerId
  );

  const trips = useMemo(() => generateTrips(500), []);

  if (!customer) {
    return (
      <div className="card">
        <h2>Customer Not Found</h2>

        <p style={{ color: "#6b7280" }}>
          The customer you are looking for does not exist.
        </p>

        <Link
          to="/customers"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const branch = branches.find(
    (item) => item.id === customer.branchId
  );

  const customerTrips = trips.filter(
    (trip) => trip.customerId === customer.id
  );

  const completedTrips = customerTrips.filter(
    (trip) => trip.status === "Completed"
  );

  const inProgressTrips = customerTrips.filter(
    (trip) => trip.status === "In Progress"
  );

  const cancelledTrips = customerTrips.filter(
    (trip) => trip.status === "Cancelled"
  );

  const totalRevenue = customerTrips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const totalCost = customerTrips.reduce(
    (sum, trip) =>
      sum +
      trip.fuelCost +
      trip.tollCost +
      trip.otherCost,
    0
  );

  const totalProfit = customerTrips.reduce(
    (sum, trip) => sum + getProfit(trip),
    0
  );

  const totalDistance = customerTrips.reduce(
    (sum, trip) => sum + trip.distanceKm,
    0
  );

  const completionRate =
    customerTrips.length > 0
      ? (completedTrips.length / customerTrips.length) * 100
      : 0;

  const formatCurrency = (value: number) =>
    `฿${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const getDriverName = (driverId: string) => {
    return (
      employees.find(
        (employee) => employee.id === driverId
      )?.name ?? "Unknown Driver"
    );
  };

  const getVehiclePlate = (vehicleId: string) => {
    return (
      vehicles.find(
        (vehicle) => vehicle.id === vehicleId
      )?.plateNumber ?? "Unknown Vehicle"
    );
  };

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
            to="/customers"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Customers
          </Link>

          <h1
            style={{
              margin: "10px 0 4px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {customer.name}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            {customer.customerCode} · {customer.id}
          </p>
        </div>

        <button
          onClick={() =>
            alert("Customer editing will be connected later.")
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
          Edit Customer
        </button>
      </div>

      {/* Customer Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Contact */}
        <div className="card">
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "18px",
            }}
          >
            Customer Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              rowGap: "14px",
            }}
          >
            <span style={{ color: "#6b7280" }}>
              Customer Code
            </span>
            <strong>{customer.customerCode}</strong>

            <span style={{ color: "#6b7280" }}>
              Customer Name
            </span>
            <strong>{customer.name}</strong>

            <span style={{ color: "#6b7280" }}>
              Contact Person
            </span>
            <strong>{customer.contactPerson}</strong>

            <span style={{ color: "#6b7280" }}>
              Phone
            </span>
            <strong>{customer.phone}</strong>

            <span style={{ color: "#6b7280" }}>
              Email
            </span>
            <strong>{customer.email}</strong>

            <span style={{ color: "#6b7280" }}>
              Address
            </span>
            <strong>{customer.address}</strong>

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
                    customer.status === "Active"
                      ? "#dcfce7"
                      : "#f3f4f6",
                  color:
                    customer.status === "Active"
                      ? "#166534"
                      : "#6b7280",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {customer.status}
              </span>
            </span>
          </div>
        </div>

        {/* Transportation Summary */}
        <div className="card">
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "18px",
            }}
          >
            Transportation Summary
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div>
              <p>Total Trips</p>
              <h2>{customerTrips.length}</h2>
            </div>

            <div>
              <p>Completed</p>
              <h2>{completedTrips.length}</h2>
            </div>

            <div>
              <p>Distance</p>
              <h2>
                {totalDistance.toLocaleString()} km
              </h2>
            </div>

            <div>
              <p>Completion Rate</p>
              <h2>
                {completionRate.toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <p>Revenue</p>
          <h2>{formatCurrency(totalRevenue)}</h2>
        </div>

        <div className="card">
          <p>Cost</p>
          <h2>{formatCurrency(totalCost)}</h2>
        </div>

        <div className="card">
          <p>Profit</p>
          <h2>{formatCurrency(totalProfit)}</h2>
        </div>

        <div className="card">
          <p>In Progress</p>
          <h2>{inProgressTrips.length}</h2>
        </div>
      </div>

      {/* Status Summary */}
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
          Trip Status
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <div>
            <p>Completed</p>
            <h2>{completedTrips.length}</h2>
          </div>

          <div>
            <p>In Progress</p>
            <h2>{inProgressTrips.length}</h2>
          </div>

          <div>
            <p>Cancelled</p>
            <h2>{cancelledTrips.length}</h2>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="card">
        <div style={{ marginBottom: "16px" }}>
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
            Transportation trips for this customer.
          </p>
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
                  borderBottom:
                    "1px solid #e5e7eb",
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
                  Vehicle
                </th>

                <th style={{ padding: "12px" }}>
                  Driver
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
              {customerTrips
                .slice(0, 20)
                .map((trip) => (
                  <tr
                    key={trip.id}
                    style={{
                      borderBottom:
                        "1px solid #f0f0f0",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      <strong>
                        {trip.tripNumber}
                      </strong>
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {trip.date}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
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

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {getVehiclePlate(
                        trip.vehicleId
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {getDriverName(
                        trip.driverId
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {formatCurrency(
                        trip.revenue
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {formatCurrency(
                        getProfit(trip)
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            trip.status ===
                            "Completed"
                              ? "#dcfce7"
                              : trip.status ===
                                "In Progress"
                              ? "#dbeafe"
                              : trip.status ===
                                "Cancelled"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            trip.status ===
                            "Completed"
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

              {customerTrips.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No trips found for this customer.
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

export default CustomerDetailsPage;