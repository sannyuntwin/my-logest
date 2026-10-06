import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { routePlans } from "../../data/routes";
import { customers } from "../../data/customers";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "In Progress":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };

    case "Ready":
      return {
        background: "#e0e7ff",
        color: "#4338ca",
      };

    case "Planned":
      return {
        background: "#f3f4f6",
        color: "#374151",
      };

    case "Cancelled":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };

    default:
      return {
        background: "#f3f4f6",
        color: "#374151",
      };
  }
}

function RoutePlanningPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRoutes = useMemo(() => {
    return routePlans.filter((route) => {
      const customer = customers.find(
        (item) => item.id === route.customerId
      );

      const vehicle = vehicles.find(
        (item) => item.id === route.vehicleId
      );

      const driver = employees.find(
        (item) => item.id === route.driverId
      );

      const searchText = search.toLowerCase();

      const matchesSearch =
        route.routeNumber
          .toLowerCase()
          .includes(searchText) ||
        route.origin
          .toLowerCase()
          .includes(searchText) ||
        route.destination
          .toLowerCase()
          .includes(searchText) ||
        customer?.name
          .toLowerCase()
          .includes(searchText) ||
        vehicle?.plateNumber
          .toLowerCase()
          .includes(searchText) ||
        driver?.name
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "all" ||
        route.status === status;

      const matchesDateFrom =
        !dateFrom ||
        route.date >= dateFrom;

      const matchesDateTo =
        !dateTo ||
        route.date <= dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    search,
    status,
    dateFrom,
    dateTo,
  ]);

  const totalRoutes = filteredRoutes.length;

  const plannedRoutes = filteredRoutes.filter(
    (route) => route.status === "Planned"
  ).length;

  const readyRoutes = filteredRoutes.filter(
    (route) => route.status === "Ready"
  ).length;

  const activeRoutes = filteredRoutes.filter(
    (route) => route.status === "In Progress"
  ).length;

  const completedRoutes = filteredRoutes.filter(
    (route) => route.status === "Completed"
  ).length;

  const totalDistance = filteredRoutes.reduce(
    (sum, route) => sum + route.distanceKm,
    0
  );

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            Route Planning
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Plan transportation routes, stops and estimated travel times.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Route Plan")
          }
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "11px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Create Route
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(6, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          ["Total Routes", totalRoutes],
          ["Planned", plannedRoutes],
          ["Ready", readyRoutes],
          ["In Progress", activeRoutes],
          ["Completed", completedRoutes],
          [
            "Distance",
            `${totalDistance.toLocaleString()} km`,
          ],
        ].map(([title, value]) => (
          <div
            className="card"
            key={String(title)}
          >
            <p>{title}</p>
            <h2>{value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div>
            <label>Search</label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Route, location, customer..."
              style={inputStyle}
            />
          </div>

          <div>
            <label>Status</label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              style={inputStyle}
            >
              <option value="all">
                All Status
              </option>

              <option value="Planned">
                Planned
              </option>

              <option value="Ready">
                Ready
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label>Date From</label>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                setDateFrom(event.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Date To</label>

            <input
              type="date"
              value={dateTo}
              onChange={(event) =>
                setDateTo(event.target.value)
              }
              style={inputStyle}
            />
          </div>

          <button
            onClick={resetFilters}
            style={{
              height: "40px",
              padding: "0 14px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Route Table */}
      <div className="card">
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            Route Plans
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredRoutes.length} routes found
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
                <th style={thStyle}>
                  Route
                </th>

                <th style={thStyle}>
                  Date
                </th>

                <th style={thStyle}>
                  Customer
                </th>

                <th style={thStyle}>
                  Route
                </th>

                <th style={thStyle}>
                  Distance
                </th>

                <th style={thStyle}>
                  ETA
                </th>

                <th style={thStyle}>
                  Vehicle
                </th>

                <th style={thStyle}>
                  Driver
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRoutes.map((route) => {
                const customer =
                  customers.find(
                    (item) =>
                      item.id ===
                      route.customerId
                  );

                const vehicle =
                  vehicles.find(
                    (item) =>
                      item.id ===
                      route.vehicleId
                  );

                const driver =
                  employees.find(
                    (item) =>
                      item.id ===
                      route.driverId
                  );

                const statusStyle =
                  getStatusStyle(
                    route.status
                  );

                const hours = Math.floor(
                  route.estimatedDurationMinutes /
                    60
                );

                const minutes =
                  route.estimatedDurationMinutes %
                  60;

                const duration =
                  hours > 0
                    ? `${hours}h ${minutes}m`
                    : `${minutes}m`;

                return (
                  <tr
                    key={route.id}
                    style={{
                      borderBottom:
                        "1px solid #f1f5f9",
                    }}
                  >
                    <td style={tdStyle}>
                      <strong>
                        {route.routeNumber}
                      </strong>

                      <div
                        style={{
                          color: "#9ca3af",
                          fontSize: "12px",
                          marginTop: "3px",
                        }}
                      >
                        {
                          route.stops.length
                        }{" "}
                        stops
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {route.date}
                    </td>

                    <td style={tdStyle}>
                      {customer?.name ??
                        "-"}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {route.origin}
                      </strong>

                      <div
                        style={{
                          color: "#6b7280",
                          marginTop: "3px",
                        }}
                      >
                        ↓{" "}
                        {route.destination}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {route.distanceKm} km
                    </td>

                    <td style={tdStyle}>
                      {duration}
                    </td>

                    <td style={tdStyle}>
                      {vehicle
                        ? vehicle.plateNumber
                        : "Unassigned"}
                    </td>

                    <td style={tdStyle}>
                      {driver
                        ? driver.name
                        : "Unassigned"}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusStyle,
                          padding:
                            "5px 9px",
                          borderRadius:
                            "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {route.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <Link
                        to={`/operations/routes/${route.id}`}
                        style={linkStyle}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRoutes.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            No route plans found.
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  marginTop: "6px",
  padding: "0 10px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  boxSizing: "border-box",
  background: "white",
};

const thStyle: React.CSSProperties = {
  padding: "12px 10px",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 10px",
  verticalAlign: "top",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600,
};

export default RoutePlanningPage;