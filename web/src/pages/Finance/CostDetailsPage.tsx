import { Link, useParams } from "react-router-dom";

import { costs } from "../../data/costs";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { generateTrips } from "../../data/generateTrips";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function CostDetailsPage() {
  const { costId } = useParams();

  const cost = costs.find(
    (item) => item.id === costId
  );

  if (!cost) {
    return (
      <div className="card">
        <h2>Cost Not Found</h2>

        <p style={{ color: "#6b7280" }}>
          The requested cost record does not exist.
        </p>

        <Link to="/finance/costs">
          <button>Back to Costs</button>
        </Link>
      </div>
    );
  }

  const vehicle = vehicles.find(
    (item) => item.id === cost.vehicleId
  );

  const driver = employees.find(
    (item) => item.id === cost.driverId
  );

  const trips = generateTrips(500);

  const trip = cost.tripId
    ? trips.find(
        (item) => item.id === cost.tripId
      )
    : undefined;

  return (
    <div>
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
          <div style={{ marginBottom: 8 }}>
            <Link to="/finance/costs">
              ← Back to Costs
            </Link>
          </div>

          <h1>{cost.costNumber}</h1>

          <p style={{ color: "#6b7280" }}>
            Cost transaction details
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span
            className={`status ${statusClass(
              cost.status
            )}`}
          >
            {cost.status}
          </span>

          <button
            onClick={() =>
              window.print()
            }
          >
            Print
          </button>

          <button
            onClick={() =>
              alert("Edit Cost - demo only")
            }
          >
            Edit
          </button>
        </div>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Cost Amount</p>

          <h2>
            {formatCurrency(cost.amount)}
          </h2>
        </div>

        <div className="card">
          <p>Category</p>

          <h2>{cost.category}</h2>
        </div>

        <div className="card">
          <p>Date</p>

          <h2>{cost.date}</h2>
        </div>

        <div className="card">
          <p>Status</p>

          <h2>{cost.status}</h2>
        </div>
      </div>

      {/* Cost Information */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Cost Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          <div>
            <p>Cost Number</p>

            <strong>
              {cost.costNumber}
            </strong>
          </div>

          <div>
            <p>Date</p>

            <strong>{cost.date}</strong>
          </div>

          <div>
            <p>Category</p>

            <strong>{cost.category}</strong>
          </div>

          <div>
            <p>Status</p>

            <span
              className={`status ${statusClass(
                cost.status
              )}`}
            >
              {cost.status}
            </span>
          </div>

          <div>
            <p>Description</p>

            <strong>
              {cost.description}
            </strong>
          </div>

          <div>
            <p>Amount</p>

            <strong>
              {formatCurrency(cost.amount)}
            </strong>
          </div>

          <div>
            <p>Vendor</p>

            <strong>{cost.vendor}</strong>
          </div>

          <div>
            <p>Reference Number</p>

            <strong>
              {cost.referenceNumber}
            </strong>
          </div>
        </div>
      </div>

      {/* Vehicle */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Vehicle</h2>

          {vehicle && (
            <Link
              to={`/fleet/vehicles/${vehicle.id}`}
            >
              <button>View Vehicle</button>
            </Link>
          )}
        </div>

        {vehicle ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Plate Number</p>

              <strong>
                {vehicle.plateNumber}
              </strong>
            </div>

            <div>
              <p>Vehicle Type</p>

              <strong>
                {vehicle.vehicleType}
              </strong>
            </div>

            <div>
              <p>Brand / Model</p>

              <strong>
                {vehicle.brand}{" "}
                {vehicle.model}
              </strong>
            </div>

            <div>
              <p>Status</p>

              <strong>
                {vehicle.status}
              </strong>
            </div>

            <div>
              <p>Current Mileage</p>

              <strong>
                {vehicle.mileage.toLocaleString()} km
              </strong>
            </div>
          </div>
        ) : (
          <p style={{ color: "#6b7280" }}>
            No vehicle linked to this cost.
          </p>
        )}
      </div>

      {/* Driver */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Driver</h2>

          {driver && (
            <Link
              to={`/drivers/${driver.id}`}
            >
              <button>View Driver</button>
            </Link>
          )}
        </div>

        {driver ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Name</p>

              <strong>{driver.name}</strong>
            </div>

            <div>
              <p>Employee Code</p>

              <strong>
                {driver.employeeCode}
              </strong>
            </div>

            <div>
              <p>Role</p>

              <strong>{driver.role}</strong>
            </div>

            <div>
              <p>Phone</p>

              <strong>{driver.phone}</strong>
            </div>

            <div>
              <p>Status</p>

              <strong>{driver.status}</strong>
            </div>
          </div>
        ) : (
          <p style={{ color: "#6b7280" }}>
            No driver linked to this cost.
          </p>
        )}
      </div>

      {/* Related Trip */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Related Trip</h2>

          {trip && (
            <Link
              to={`/operations/trips/${trip.id}`}
            >
              <button>View Trip</button>
            </Link>
          )}
        </div>

        {trip ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Trip</p>

              <strong>
                {trip.tripNumber}
              </strong>
            </div>

            <div>
              <p>Date</p>

              <strong>{trip.date}</strong>
            </div>

            <div>
              <p>Status</p>

              <strong>{trip.status}</strong>
            </div>

            <div>
              <p>Origin</p>

              <strong>{trip.origin}</strong>
            </div>

            <div>
              <p>Destination</p>

              <strong>
                {trip.destination}
              </strong>
            </div>

            <div>
              <p>Distance</p>

              <strong>
                {trip.distanceKm.toLocaleString()} km
              </strong>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 20,
              background: "#f9fafb",
              borderRadius: 8,
              color: "#6b7280",
            }}
          >
            This cost is not linked to a
            transportation trip.
          </div>
        )}
      </div>

      {/* Financial Classification */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Financial Classification
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          <div>
            <p>Cost Category</p>

            <strong>{cost.category}</strong>
          </div>

          <div>
            <p>Vendor</p>

            <strong>{cost.vendor}</strong>
          </div>

          <div>
            <p>Payment Status</p>

            <span
              className={`status ${statusClass(
                cost.status
              )}`}
            >
              {cost.status}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>
          Notes
        </h2>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          {cost.notes || "No notes available."}
        </p>
      </div>
    </div>
  );
}
