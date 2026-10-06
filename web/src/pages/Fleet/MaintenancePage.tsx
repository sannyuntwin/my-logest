import { useMemo, useState } from "react";
import { maintenanceRecords } from "../../data/maintenance";
import { vehicles } from "../../data/vehicles";

type MaintenanceStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

function MaintenancePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    MaintenanceStatus | "all"
  >("all");

  const [type, setType] = useState("all");

  const getVehicle = (vehicleId: string) => {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );
  };

  const filteredRecords = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return maintenanceRecords.filter((record) => {
      const vehicle = getVehicle(record.vehicleId);

      const matchesSearch =
        !keyword ||
        record.id.toLowerCase().includes(keyword) ||
        record.description.toLowerCase().includes(keyword) ||
        record.serviceProvider.toLowerCase().includes(keyword) ||
        vehicle?.plateNumber.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "all" ||
        record.status === status;

      const matchesType =
        type === "all" ||
        record.type === type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [search, status, type]);

  const totalRecords = maintenanceRecords.length;

  const scheduledCount = maintenanceRecords.filter(
    (record) => record.status === "Scheduled"
  ).length;

  const inProgressCount = maintenanceRecords.filter(
    (record) => record.status === "In Progress"
  ).length;

  const completedCount = maintenanceRecords.filter(
    (record) => record.status === "Completed"
  ).length;

  const totalCost = maintenanceRecords.reduce(
    (sum, record) => sum + record.cost,
    0
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setType("all");
  };

  const getStatusStyle = (
    recordStatus: MaintenanceStatus
  ) => {
    switch (recordStatus) {
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

      case "Scheduled":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      default:
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };
    }
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
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Maintenance
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Track vehicle maintenance, repairs, inspections,
            and service costs.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Create Maintenance Record will be implemented next."
            )
          }
          style={{
            height: "40px",
            padding: "0 16px",
            border: "none",
            borderRadius: "7px",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Maintenance
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            Total Records
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
            }}
          >
            {totalRecords}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            Scheduled
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#92400e",
            }}
          >
            {scheduledCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            In Progress
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            {inProgressCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            Completed
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#166534",
            }}
          >
            {completedCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            Maintenance Cost
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            ฿{totalCost.toLocaleString()}
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
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "12px",
          }}
        >
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search vehicle, service, description..."
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | MaintenanceStatus
                  | "all"
              )
            }
            style={inputStyle}
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            style={inputStyle}
          >
            <option value="all">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Repair">Repair</option>
            <option value="Inspection">Inspection</option>
            <option value="Tire">Tire</option>
            <option value="Other">Other</option>
          </select>

          <button
            onClick={resetFilters}
            style={{
              height: "40px",
              padding: "0 14px",
              border: "1px solid #d1d5db",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Maintenance Table */}
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
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Maintenance Records
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredRecords.length} record
            {filteredRecords.length !== 1 ? "s" : ""} found
          </p>
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
                <th style={thStyle}>Record</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Scheduled</th>
                <th style={thStyle}>Mileage</th>
                <th style={thStyle}>Cost</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => {
                const vehicle = getVehicle(record.vehicleId);
                const statusStyle = getStatusStyle(
                  record.status
                );

                return (
                  <tr key={record.id}>
                    <td style={tdStyle}>
                      <strong>{record.id}</strong>
                    </td>

                    <td style={tdStyle}>
                      {vehicle?.plateNumber ??
                        record.vehicleId}
                    </td>

                    <td style={tdStyle}>
                      {record.type}
                    </td>

                    <td style={tdStyle}>
                      {record.description}
                    </td>

                    <td style={tdStyle}>
                      {record.scheduledDate}
                    </td>

                    <td style={tdStyle}>
                      {record.mileage.toLocaleString()} km
                    </td>

                    <td style={tdStyle}>
                      ฿{record.cost.toLocaleString()}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            statusStyle.background,
                          color: statusStyle.color,
                        }}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          alert(
                            `Viewing ${record.id}`
                          )
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#2563eb",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No maintenance records found.
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

export default MaintenancePage;