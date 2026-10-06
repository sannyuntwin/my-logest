import { Link, useNavigate, useParams } from "react-router-dom";

import { routePlans } from "../../data/routes";
import { workOrders } from "../../data/workOrders";
import { customerOrders } from "../../data/customerOrders";
import { customers } from "../../data/customers";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { generateTrips } from "../../data/generateTrips";

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "status completed";
    case "In Progress":
      return "status in-progress";
    case "Ready":
      return "status ready";
    case "Planned":
      return "status planned";
    case "Cancelled":
      return "status cancelled";
    case "Arrived":
      return "status arrived";
    default:
      return "status pending";
  }
}

export default function RouteDetailsPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const route = routePlans.find((item) => item.id === routeId);

  if (!route) {
    return (
      <div className="page">
        <div className="card">
          <h2>Route not found</h2>
          <p>
            The route you are looking for does not exist in the demo data.
          </p>

          <button onClick={() => navigate("/operations/routes")}>
            Back to Route Planning
          </button>
        </div>
      </div>
    );
  }

  const workOrder = workOrders.find(
    (item) => item.id === route.workOrderId
  );

  const customerOrder = customerOrders.find(
    (item) => item.id === route.customerOrderId
  );

  const customer = customers.find(
    (item) => item.id === route.customerId
  );

  const vehicle = vehicles.find(
    (item) => item.id === route.vehicleId
  );

  const driver = employees.find(
    (item) => item.id === route.driverId
  );

  const trips = generateTrips(500);

  const trip = workOrder?.tripId
    ? trips.find((item) => item.id === workOrder.tripId)
    : undefined;

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div>
          <button
            onClick={() => navigate("/operations/routes")}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              color: "#2563eb",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            ← Back to Route Planning
          </button>

          <h1 style={{ margin: 0 }}>{route.routeNumber}</h1>

          <p style={{ color: "#6b7280", marginTop: 8 }}>
            Route plan for {route.date}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <span className={statusClass(route.status)}>
            {route.status}
          </span>

          <button
            onClick={() => alert("Edit Route - demo only")}
          >
            Edit Route
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Date</p>
          <h2>{route.date}</h2>
        </div>

        <div className="card">
          <p>Distance</p>
          <h2>{route.distanceKm} km</h2>
        </div>

        <div className="card">
          <p>Estimated Duration</p>
          <h2>{route.estimatedDurationMinutes} min</h2>
        </div>

        <div className="card">
          <p>Vehicle</p>
          <h2>
            {vehicle ? vehicle.plateNumber : "Unassigned"}
          </h2>
        </div>

        <div className="card">
          <p>Driver</p>
          <h2>
            {driver ? driver.name : "Unassigned"}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          {/* Route Summary */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2>Route Summary</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <p>Origin</p>
                <strong>{route.origin}</strong>
              </div>

              <div>
                <p>Destination</p>
                <strong>{route.destination}</strong>
              </div>

              <div>
                <p>Distance</p>
                <strong>{route.distanceKm} km</strong>
              </div>

              <div>
                <p>Estimated Duration</p>
                <strong>
                  {route.estimatedDurationMinutes} minutes
                </strong>
              </div>
            </div>
          </div>

          {/* Stop Timeline */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2>Route Stops</h2>

            <div style={{ marginTop: 24 }}>
              {route.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr",
                    gap: 16,
                    position: "relative",
                    paddingBottom:
                      index === route.stops.length - 1
                        ? 0
                        : 28,
                  }}
                >
                  {/* Timeline */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {index !== route.stops.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 18,
                          bottom: -28,
                          width: 2,
                          background: "#e5e7eb",
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                          stop.status === "Completed"
                            ? "#dcfce7"
                            : "#eff6ff",
                        color:
                          stop.status === "Completed"
                            ? "#166534"
                            : "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    >
                      {stop.sequence}
                    </div>
                  </div>

                  {/* Stop Details */}
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <strong>{stop.type}</strong>

                        <div
                          style={{
                            color: "#111827",
                            marginTop: 5,
                          }}
                        >
                          {stop.location}
                        </div>
                      </div>

                      <span className={statusClass(stop.status)}>
                        {stop.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(3, 1fr)",
                        gap: 12,
                        color: "#6b7280",
                        fontSize: 14,
                      }}
                    >
                      <div>
                        <div>Contact</div>
                        <strong
                          style={{ color: "#111827" }}
                        >
                          {stop.contactName}
                        </strong>
                      </div>

                      <div>
                        <div>Planned Arrival</div>
                        <strong
                          style={{ color: "#111827" }}
                        >
                          {stop.plannedArrival}
                        </strong>
                      </div>

                      <div>
                        <div>Actual Arrival</div>
                        <strong
                          style={{ color: "#111827" }}
                        >
                          {stop.actualArrival ?? "Not arrived"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h2>Notes</h2>

            <p style={{ marginTop: 16, color: "#4b5563" }}>
              {route.notes || "No notes available."}
            </p>
          </div>
        </div>

        {/* Right */}
        <div>
          {/* Resources */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2>Assigned Resources</h2>

            <div style={{ marginTop: 20 }}>
              <p>Vehicle</p>

              {vehicle ? (
                <Link to={`/fleet/vehicles/${vehicle.id}`}>
                  <strong>{vehicle.plateNumber}</strong>
                </Link>
              ) : (
                <strong>Unassigned</strong>
              )}

              {vehicle && (
                <p style={{ marginTop: 4 }}>
                  {vehicle.brand} {vehicle.model}
                </p>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Driver</p>

              {driver ? (
                <Link to={`/drivers/${driver.id}`}>
                  <strong>{driver.name}</strong>
                </Link>
              ) : (
                <strong>Unassigned</strong>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Trip</p>

              {trip ? (
                <Link to={`/operations/trips/${trip.id}`}>
                  <strong>{trip.tripNumber}</strong>
                </Link>
              ) : (
                <strong>No trip assigned</strong>
              )}
            </div>
          </div>

          {/* Related Records */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2>Related Records</h2>

            <div style={{ marginTop: 20 }}>
              <p>Work Order</p>

              {workOrder ? (
                <Link
                  to={`/operations/work-orders/${workOrder.id}`}
                >
                  <strong>
                    {workOrder.workOrderNumber}
                  </strong>
                </Link>
              ) : (
                <strong>Not found</strong>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Customer Order</p>

              {customerOrder ? (
                <Link
                  to={`/customers/orders/${customerOrder.id}`}
                >
                  <strong>
                    {customerOrder.orderNumber}
                  </strong>
                </Link>
              ) : (
                <strong>Not found</strong>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Customer</p>

              {customer ? (
                <Link to={`/customers/${customer.id}`}>
                  <strong>{customer.name}</strong>
                </Link>
              ) : (
                <strong>Not found</strong>
              )}
            </div>
          </div>

          {/* Route Information */}
          <div className="card">
            <h2>Route Information</h2>

            <div style={{ marginTop: 20 }}>
              <p>Route ID</p>
              <strong>{route.id}</strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Route Number</p>
              <strong>{route.routeNumber}</strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Status</p>
              <span className={statusClass(route.status)}>
                {route.status}
              </span>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Number of Stops</p>
              <strong>{route.stops.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
