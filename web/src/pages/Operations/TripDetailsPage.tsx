import { Link, useNavigate, useParams } from "react-router-dom";

import { generateTrips } from "../../data/generateTrips";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { customers } from "../../data/customers";
import { getProfit, getTotalCost } from "../../data/tripUtils";

const trips = generateTrips(500);

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "status completed";
    case "In Progress":
      return "status in-progress";
    case "Planned":
      return "status planned";
    case "Cancelled":
      return "status cancelled";
    default:
      return "status pending";
  }
}

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const trip = trips.find(
    (item) => item.id === tripId
  );

  if (!trip) {
    return (
      <div className="page">
        <div className="card">
          <h2>Trip not found</h2>

          <p style={{ color: "#6b7280" }}>
            The requested trip does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/operations/trips")
            }
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  const vehicle = vehicles.find(
    (item) => item.id === trip.vehicleId
  );

  const driver = employees.find(
    (item) => item.id === trip.driverId
  );

  const customer = customers.find(
    (item) => item.id === trip.customerId
  );

  const totalCost = getTotalCost(trip);
  const profit = getProfit(trip);

  return (
    <div className="page">
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
          <button
            onClick={() =>
              navigate("/operations/trips")
            }
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              color: "#2563eb",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            ← Back to Trips
          </button>

          <h1 style={{ margin: 0 }}>
            {trip.tripNumber}
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            Trip execution details
          </p>
        </div>

        <div
        style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
        }}
        >
        <span className={statusClass(trip.status)}>
            {trip.status}
        </span>

        <Link
            to={`/operations/trips/${trip.id}/execute`}
        >
            <button>Execute Trip</button>
        </Link>

        <Link
        to={`/operations/trips/${trip.id}/pod`}
        >
            <button>Proof of Delivery</button>
        </Link>

        <button
            onClick={() =>
            alert("Edit Trip - demo only")
            }
        >
            Edit Trip
        </button>
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Date</p>
          <h2>{trip.date}</h2>
        </div>

        <div className="card">
          <p>Distance</p>
          <h2>{trip.distanceKm} km</h2>
        </div>

        <div className="card">
          <p>Revenue</p>
          <h2>
            ฿{trip.revenue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <p>Total Cost</p>
          <h2>
            ฿{totalCost.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <p>Profit</p>
          <h2>
            ฿{profit.toLocaleString()}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Main */}
        <div>
          {/* Route */}
          <div
            className="card"
            style={{
              marginBottom: 24,
            }}
          >
            <h2>Trip Route</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr auto 1fr",
                gap: 20,
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <div>
                <p>Origin</p>
                <h3>
                  {trip.origin}
                </h3>
              </div>

              <div
                style={{
                  fontSize: 24,
                  color: "#2563eb",
                }}
              >
                →
              </div>

              <div>
                <p>Destination</p>
                <h3>
                  {trip.destination}
                </h3>
              </div>
            </div>
          </div>

          {/* Execution */}
          <div
            className="card"
            style={{
              marginBottom: 24,
            }}
          >
            <h2>Trip Execution</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <p>Trip Number</p>
                <strong>
                  {trip.tripNumber}
                </strong>
              </div>

              <div>
                <p>Status</p>

                <span
                  className={statusClass(
                    trip.status
                  )}
                >
                  {trip.status}
                </span>
              </div>

              <div>
                <p>Trip Date</p>
                <strong>
                  {trip.date}
                </strong>
              </div>

              <div>
                <p>Distance</p>
                <strong>
                  {trip.distanceKm} km
                </strong>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="card">
            <h2>Financial Summary</h2>

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: 20,
              }}
            >
              <div>
                <p>Revenue</p>
                <strong>
                  ฿
                  {trip.revenue.toLocaleString()}
                </strong>
              </div>

              <div>
                <p>Fuel Cost</p>
                <strong>
                  ฿
                  {trip.fuelCost.toLocaleString()}
                </strong>
              </div>

              <div>
                <p>Toll Cost</p>
                <strong>
                  ฿
                  {trip.tollCost.toLocaleString()}
                </strong>
              </div>

              <div>
                <p>Other Cost</p>
                <strong>
                  ฿
                  {trip.otherCost.toLocaleString()}
                </strong>
              </div>

              <div>
                <p>Total Cost</p>
                <strong>
                  ฿
                  {totalCost.toLocaleString()}
                </strong>
              </div>

              <div>
                <p>Profit</p>
                <strong>
                  ฿
                  {profit.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Vehicle */}
          <div
            className="card"
            style={{
              marginBottom: 24,
            }}
          >
            <h2>Vehicle</h2>

            {vehicle ? (
              <div style={{ marginTop: 20 }}>
                <Link
                  to={`/fleet/vehicles/${vehicle.id}`}
                >
                  <h3>
                    {vehicle.plateNumber}
                  </h3>
                </Link>

                <p>
                  {vehicle.brand}{" "}
                  {vehicle.model}
                </p>

                <p>
                  {vehicle.vehicleType}
                </p>

                <p>
                  Mileage:{" "}
                  {vehicle.mileage.toLocaleString()} km
                </p>
              </div>
            ) : (
              <p>Vehicle not found.</p>
            )}
          </div>

          {/* Driver */}
          <div
            className="card"
            style={{
              marginBottom: 24,
            }}
          >
            <h2>Driver</h2>

            {driver ? (
              <div style={{ marginTop: 20 }}>
                <Link
                  to={`/drivers/${driver.id}`}
                >
                  <h3>{driver.name}</h3>
                </Link>

                <p>
                  {driver.employeeCode}
                </p>

                <p>
                  {driver.phone}
                </p>

                <p>
                  Branch:{" "}
                  {driver.branchId}
                </p>
              </div>
            ) : (
              <p>Driver not found.</p>
            )}
          </div>

          {/* Customer */}
          <div className="card">
            <h2>Customer</h2>

            {customer ? (
              <div style={{ marginTop: 20 }}>
                <Link
                  to={`/customers/${customer.id}`}
                >
                  <h3>
                    {customer.name}
                  </h3>
                </Link>

                <p>
                  {customer.contactPerson}
                </p>

                <p>
                  {customer.phone}
                </p>

                <p>
                  {customer.address}
                </p>
              </div>
            ) : (
              <p>Customer not found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}