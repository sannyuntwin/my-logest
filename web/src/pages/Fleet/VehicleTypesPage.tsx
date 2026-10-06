import { useMemo, useState } from "react";
import { vehicleTypes } from "../../data/vehicleTypes";

type Status = "Active" | "Inactive";

function VehicleTypesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");

  const filteredTypes = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return vehicleTypes.filter((type) => {
      const matchesSearch =
        !keyword ||
        type.name.toLowerCase().includes(keyword) ||
        type.description.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "all" || type.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const activeCount = vehicleTypes.filter(
    (type) => type.status === "Active"
  ).length;

  const inactiveCount = vehicleTypes.filter(
    (type) => type.status === "Inactive"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
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
  };

  const getStatusStyle = (typeStatus: Status) => {
    if (typeStatus === "Active") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    return {
      background: "#fee2e2",
      color: "#991b1b",
    };
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
            Vehicle Types
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Manage vehicle categories, capacities, and configurations.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Vehicle Type will be implemented next.")
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
          + Add Vehicle Type
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
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
            Total Types
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {vehicleTypes.length}
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
            {activeCount}
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
            {inactiveCount}
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
            gridTemplateColumns: "2fr 1fr auto",
            gap: "12px",
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vehicle type..."
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as Status | "all")
            }
            style={inputStyle}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

      {/* Table */}
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
            Vehicle Type Master
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredTypes.length} type
            {filteredTypes.length !== 1 ? "s" : ""} found
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
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Vehicle Type</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Capacity</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTypes.map((type) => {
                const statusStyle = getStatusStyle(type.status);

                return (
                  <tr key={type.id}>
                    <td style={tdStyle}>
                      {type.id}
                    </td>

                    <td style={tdStyle}>
                      <strong>{type.name}</strong>
                    </td>

                    <td style={tdStyle}>
                      {type.description}
                    </td>

                    <td style={tdStyle}>
                      {type.capacityTons} tons
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
                        {type.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          alert(
                            `Edit ${type.name} will be implemented next.`
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
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No vehicle types found.
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

export default VehicleTypesPage;