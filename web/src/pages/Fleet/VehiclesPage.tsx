import { useMemo, useState } from "react";
import { vehicles } from "../../data/vehicles";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";



import { Link } from "react-router-dom";

type VehicleStatus = "Active" | "Inactive" | "Maintenance";

function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [vehicleType, setVehicleType] = useState("all");
  const [branch, setBranch] = useState("all");

  const getBranchName = (branchId: string) => {
    const branchItem = branches.find((item) => item.id === branchId);
    return branchItem?.name ?? branchId;
  };

  const getDriverName = (driverId: string) => {
    const driver = employees.find((item) => item.id === driverId);
    return driver?.name ?? driverId;
  };

  const vehicleTypes = useMemo(() => {
    return [...new Set(vehicles.map((vehicle) => vehicle.vehicleType))];
  }, []);

  const filteredVehicles = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !keyword ||
        vehicle.plateNumber.toLowerCase().includes(keyword) ||
        vehicle.brand.toLowerCase().includes(keyword) ||
        vehicle.model.toLowerCase().includes(keyword) ||
        vehicle.vehicleType.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "all" || vehicle.status === status;

      const matchesType =
        vehicleType === "all" ||
        vehicle.vehicleType === vehicleType;

      const matchesBranch =
        branch === "all" ||
        vehicle.branchId === branch;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesBranch
      );
    });
  }, [search, status, vehicleType, branch]);

  const totalVehicles = vehicles.length;

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Active"
  ).length;

  const inactiveVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Inactive"
  ).length;

  const maintenanceVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Maintenance"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setVehicleType("all");
    setBranch("all");
  };

  const getStatusStyle = (vehicleStatus: VehicleStatus) => {
    if (vehicleStatus === "Active") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (vehicleStatus === "Maintenance") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      background: "#fee2e2",
      color: "#991b1b",
    };
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
  };

  const inputStyle: React.CSSProperties = {
    height: "40px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    padding: "0 12px",
    fontSize: "14px",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "13px 16px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      {/* Page Header */}
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
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Vehicles
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Manage your transportation fleet and vehicle assignments.
          </p>
        </div>

            <Link
  to="/fleet/vehicles/new"
  style={{
    height: "40px",
    padding: "0 16px",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  }}
>
  + Add Vehicle
</Link>

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
        <div style={cardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Total Vehicles
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {totalVehicles}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Active
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#166534",
            }}
          >
            {activeVehicles}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Maintenance
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#92400e",
            }}
          >
            {maintenanceVehicles}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Inactive
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#991b1b",
            }}
          >
            {inactiveVehicles}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plate, brand, model..."
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as VehicleStatus | "all")
            }
            style={inputStyle}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value)}
            style={inputStyle}
          >
            <option value="all">All Types</option>

            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            style={inputStyle}
          >
            <option value="all">All Branches</option>

            {branches.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            style={{
              height: "40px",
              padding: "0 14px",
              border: "1px solid #d1d5db",
              borderRadius: "7px",
              background: "white",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Vehicle Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Vehicle Fleet
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Branch</th>
                <th style={thStyle}>Driver</th>
                <th style={thStyle}>Mileage</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicles.map((vehicle) => {
                const statusStyle = getStatusStyle(vehicle.status);

                return (
                  <tr key={vehicle.id}>
                    <td style={tdStyle}>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        >
                          {vehicle.plateNumber}
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          {vehicle.brand} {vehicle.model}
                        </div>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {vehicle.vehicleType}
                    </td>

                    <td style={tdStyle}>
                      {getBranchName(vehicle.branchId)}
                    </td>

                    <td style={tdStyle}>
                      {getDriverName(vehicle.driverId)}
                    </td>

                    <td style={tdStyle}>
                      {vehicle.mileage.toLocaleString()} km
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: statusStyle.background,
                          color: statusStyle.color,
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <Link
                            to={`/fleet/vehicles/${vehicle.id}`}
                            style={{
                                color: "#2563eb",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: 600,
                            }}
                            >
                            View
                        </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredVehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    No vehicles found.
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

export default VehiclesPage;
