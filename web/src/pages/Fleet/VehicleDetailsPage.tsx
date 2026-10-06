import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { vehicles } from "../../data/vehicles";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";
import { generateTrips } from "../../data/generateTrips";

function VehicleDetailsPage() {
  const { vehicleId } = useParams();

  const vehicle = vehicles.find(
    (item) => item.id === vehicleId
  );

  const trips = useMemo(() => {
    const allTrips = generateTrips(500);

    return allTrips
      .filter((trip) => trip.vehicleId === vehicleId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div>
        <h1 style={{ margin: 0 }}>Vehicle Not Found</h1>

        <p style={{ color: "#6b7280" }}>
          The requested vehicle does not exist.
        </p>

        <Link
          to="/fleet/vehicles"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Vehicles
        </Link>
      </div>
    );
  }

  const branch = branches.find(
    (item) => item.id === vehicle.branchId
  );

  const driver = employees.find(
    (item) => item.id === vehicle.driverId
  );

  const completedTrips = trips.filter(
    (trip) => trip.status === "Completed"
  ).length;

  const totalRevenue = trips.reduce(
    (sum, trip) => sum + trip.revenue,
    0
  );

  const getStatusStyle = () => {
    if (vehicle.status === "Active") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (vehicle.status === "Maintenance") {
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

  const statusStyle = getStatusStyle();

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "5px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
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
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <Link
            to="/fleet/vehicles"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            ← Vehicles
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {vehicle.plateNumber}
            </h1>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                background: statusStyle.background,
                color: statusStyle.color,
              }}
            >
              {vehicle.status}
            </span>
          </div>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            {vehicle.brand} {vehicle.model} · {vehicle.vehicleType}
          </p>
        </div>

        <button
          onClick={() =>
            alert(`Edit vehicle ${vehicle.id} will be implemented next.`)
          }
          style={{
            height: "40px",
            padding: "0 16px",
            border: "1px solid #d1d5db",
            borderRadius: "7px",
            background: "#ffffff",
            color: "#374151",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Edit Vehicle
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Current Mileage</div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {vehicle.mileage.toLocaleString()} km
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Total Trips</div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {trips.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Completed Trips</div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#166534",
            }}
          >
            {completedTrips}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Trip Revenue</div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#2563eb",
            }}
          >
            ฿{totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Vehicle Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <div style={labelStyle}>Vehicle ID</div>
              <div style={valueStyle}>{vehicle.id}</div>
            </div>

            <div>
              <div style={labelStyle}>Plate Number</div>
              <div style={valueStyle}>{vehicle.plateNumber}</div>
            </div>

            <div>
              <div style={labelStyle}>Vehicle Type</div>
              <div style={valueStyle}>{vehicle.vehicleType}</div>
            </div>

            <div>
              <div style={labelStyle}>Brand</div>
              <div style={valueStyle}>{vehicle.brand}</div>
            </div>

            <div>
              <div style={labelStyle}>Model</div>
              <div style={valueStyle}>{vehicle.model}</div>
            </div>

            <div>
              <div style={labelStyle}>Mileage</div>
              <div style={valueStyle}>
                {vehicle.mileage.toLocaleString()} km
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Assignment
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <div style={labelStyle}>Branch</div>
              <div style={valueStyle}>
                {branch?.name ?? vehicle.branchId}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Branch ID</div>
              <div style={valueStyle}>{vehicle.branchId}</div>
            </div>

            <div>
              <div style={labelStyle}>Assigned Driver</div>
              <div style={valueStyle}>
                {driver?.name ?? vehicle.driverId}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Driver ID</div>
              <div style={valueStyle}>{vehicle.driverId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip History */}
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
            Trip History
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Recent trips assigned to this vehicle.
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
                <th style={thStyle}>Trip No.</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.slice(0, 20).map((trip) => (
                <tr key={trip.id}>
                  <td style={tdStyle}>
                    <strong>{trip.tripNumber}</strong>
                  </td>

                  <td style={tdStyle}>
                    {trip.date}
                  </td>

                  <td style={tdStyle}>
                    {trip.origin} → {trip.destination}
                  </td>

                  <td style={tdStyle}>
                    {trip.distanceKm.toLocaleString()} km
                  </td>

                  <td style={tdStyle}>
                    ฿{trip.revenue.toLocaleString()}
                  </td>

                  <td style={tdStyle}>
                    {trip.status}
                  </td>
                </tr>
              ))}

              {trips.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No trips found for this vehicle.
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

export default VehicleDetailsPage;

