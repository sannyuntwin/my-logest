import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { employees } from "../../data/employees";
import { branches } from "../../data/branches";
import { vehicles } from "../../data/vehicles";
import { generateTrips } from "../../data/generateTrips";

function DriversPage() {
  const drivers = useMemo(
    () => employees.filter((employee) => employee.role === "Driver"),
    []
  );

  const trips = useMemo(() => generateTrips(500), []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [branch, setBranch] = useState("all");

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        driver.name.toLowerCase().includes(searchText) ||
        driver.employeeCode.toLowerCase().includes(searchText) ||
        driver.phone.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" || driver.status === status;

      const matchesBranch =
        branch === "all" || driver.branchId === branch;

      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [drivers, search, status, branch]);

  const getBranchName = (branchId: string) => {
    return (
      branches.find((item) => item.id === branchId)?.name ??
      "Unknown Branch"
    );
  };

  const getAssignedVehicle = (driverId: string) => {
    return vehicles.find((vehicle) => vehicle.driverId === driverId);
  };

  const getDriverTrips = (driverId: string) => {
    return trips.filter((trip) => trip.driverId === driverId);
  };

  const getCompletedTrips = (driverId: string) => {
    return getDriverTrips(driverId).filter(
      (trip) => trip.status === "Completed"
    ).length;
  };

  const totalDrivers = drivers.length;

  const activeDrivers = drivers.filter(
    (driver) => driver.status === "Active"
  ).length;

  const inactiveDrivers = drivers.filter(
    (driver) => driver.status === "Inactive"
  ).length;

  const assignedDrivers = drivers.filter((driver) =>
    vehicles.some((vehicle) => vehicle.driverId === driver.id)
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setBranch("all");
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
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Drivers
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Manage drivers, assignments, and driving activity.
          </p>
        </div>

        <button
          onClick={() => alert("Create Driver will be connected later.")}
          style={{
            border: "none",
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Driver
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <p>Total Drivers</p>
          <h2>{totalDrivers}</h2>
        </div>

        <div className="card">
          <p>Active</p>
          <h2>{activeDrivers}</h2>
        </div>

        <div className="card">
          <p>Inactive</p>
          <h2>{inactiveDrivers}</h2>
        </div>

        <div className="card">
          <p>Assigned Vehicle</p>
          <h2>{assignedDrivers}</h2>
        </div>
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
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Search
            </label>

            <input
              type="text"
              placeholder="Name, employee code, phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Branch
            </label>

            <select
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Branches</option>

              {branches.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            style={{
              padding: "10px 14px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Drivers Table */}
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
              Driver List
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {filteredDrivers.length} driver
              {filteredDrivers.length !== 1 ? "s" : ""}
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
                <th style={{ padding: "12px" }}>Driver</th>
                <th style={{ padding: "12px" }}>Employee Code</th>
                <th style={{ padding: "12px" }}>Branch</th>
                <th style={{ padding: "12px" }}>Phone</th>
                <th style={{ padding: "12px" }}>Vehicle</th>
                <th style={{ padding: "12px" }}>Trips</th>
                <th style={{ padding: "12px" }}>Completed</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((driver) => {
                const vehicle = getAssignedVehicle(driver.id);
                const driverTrips = getDriverTrips(driver.id);
                const completedTrips = getCompletedTrips(driver.id);

                return (
                  <tr
                    key={driver.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ fontWeight: 600 }}>
                        {driver.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginTop: "3px",
                        }}
                      >
                        {driver.id}
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {driver.employeeCode}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {getBranchName(driver.branchId)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {driver.phone}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {vehicle ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {vehicle.plateNumber}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                            }}
                          >
                            {vehicle.vehicleType}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {driverTrips.length}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {completedTrips}
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
                            driver.status === "Active"
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            driver.status === "Active"
                              ? "#166534"
                              : "#6b7280",
                        }}
                      >
                        {driver.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <Link
                        to={`/drivers/${driver.id}`}
                        style={{
                          color: "#2563eb",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredDrivers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No drivers found.
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

export default DriversPage;