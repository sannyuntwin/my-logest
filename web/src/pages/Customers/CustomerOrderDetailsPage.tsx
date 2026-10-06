import { Link, useParams } from "react-router-dom";

import { customerOrders } from "../../data/customerOrders";
import { customers } from "../../data/customers";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";
import { generateTrips } from "../../data/generateTrips";
import { getProfit, getTotalCost } from "../../data/tripUtils";

function getStatusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "In Progress":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };

    case "Confirmed":
      return {
        background: "#e0e7ff",
        color: "#4338ca",
      };

    case "Pending":
      return {
        background: "#fef3c7",
        color: "#92400e",
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

function CustomerOrderDetailsPage() {
  const { orderId } = useParams();

  const order = customerOrders.find(
    (item) => item.id === orderId
  );

  if (!order) {
    return (
      <div className="card">
        <h2>Order Not Found</h2>

        <p style={{ color: "#6b7280" }}>
          The customer order you are looking for does not exist.
        </p>

        <Link
          to="/customers/orders"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Customer Orders
        </Link>
      </div>
    );
  }

  const customer = customers.find(
    (item) => item.id === order.customerId
  );

  const trips = generateTrips(500);

  const trip = order.tripId
    ? trips.find((item) => item.id === order.tripId)
    : undefined;

  const vehicle = trip
    ? vehicles.find((item) => item.id === trip.vehicleId)
    : undefined;

  const driver = trip
    ? employees.find((item) => item.id === trip.driverId)
    : undefined;

  const statusStyle = getStatusStyle(order.status);

  const tripCost = trip ? getTotalCost(trip) : 0;
  const tripProfit = trip ? getProfit(trip) : 0;

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
            to="/customers/orders"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Customer Orders
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <h1 style={{ margin: 0 }}>
              {order.orderNumber}
            </h1>

            <span
              style={{
                ...statusStyle,
                padding: "6px 11px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {order.status}
            </span>
          </div>

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
            }}
          >
            Customer transportation order
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => alert(`Edit ${order.orderNumber}`)}
            style={secondaryButtonStyle}
          >
            Edit
          </button>

          {!order.tripId &&
            order.status !== "Cancelled" && (
              <button
                onClick={() =>
                  alert(
                    `Create trip for ${order.orderNumber}`
                  )
                }
                style={primaryButtonStyle}
              >
                Create Trip
              </button>
            )}
        </div>
      </div>

      {/* Order Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <p>Order Revenue</p>
          <h2>
            ฿{order.revenue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <p>Cargo Weight</p>
          <h2>
            {order.weightKg.toLocaleString()} kg
          </h2>
        </div>

        <div className="card">
          <p>Quantity</p>
          <h2>{order.quantity}</h2>
        </div>

        <div className="card">
          <p>Trip</p>
          <h2>
            {order.tripId ?? "Not Assigned"}
          </h2>
        </div>
      </div>

      {/* Main Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Customer */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            Customer Information
          </h2>

          <InfoRow
            label="Customer"
            value={customer?.name ?? "-"}
          />

          <InfoRow
            label="Customer Code"
            value={customer?.customerCode ?? "-"}
          />

          <InfoRow
            label="Contact Person"
            value={customer?.contactPerson ?? "-"}
          />

          <InfoRow
            label="Phone"
            value={customer?.phone ?? "-"}
          />

          <InfoRow
            label="Email"
            value={customer?.email ?? "-"}
          />

          {customer && (
            <Link
              to={`/customers/${customer.id}`}
              style={{
                display: "inline-block",
                marginTop: "12px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              View Customer →
            </Link>
          )}
        </div>

        {/* Order Information */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            Order Information
          </h2>

          <InfoRow
            label="Order Number"
            value={order.orderNumber}
          />

          <InfoRow
            label="Order Date"
            value={order.orderDate}
          />

          <InfoRow
            label="Requested Date"
            value={order.requestedDate}
          />

          <InfoRow
            label="Cargo"
            value={order.cargoDescription}
          />

          <InfoRow
            label="Quantity"
            value={String(order.quantity)}
          />

          <InfoRow
            label="Weight"
            value={`${order.weightKg.toLocaleString()} kg`}
          />
        </div>
      </div>

      {/* Transportation Route */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>
          Transportation Route
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 1fr",
            alignItems: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <LocationBox
            label="Pickup Location"
            value={order.pickupLocation}
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "26px",
              color: "#2563eb",
            }}
          >
            →
          </div>

          <LocationBox
            label="Delivery Location"
            value={order.deliveryLocation}
          />
        </div>
      </div>

      {/* Trip Assignment */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>
          Trip Assignment
        </h2>

        {!trip ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              background: "#f9fafb",
              borderRadius: "8px",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              🚚
            </div>

            <strong
              style={{
                display: "block",
                color: "#374151",
                marginBottom: "5px",
              }}
            >
              No Trip Assigned
            </strong>

            <span>
              This order has not been assigned to a trip yet.
            </span>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              <InfoCard
                label="Trip Number"
                value={trip.tripNumber}
              />

              <InfoCard
                label="Trip Date"
                value={trip.date}
              />

              <InfoCard
                label="Vehicle"
                value={
                  vehicle?.plateNumber ?? "-"
                }
              />

              <InfoCard
                label="Driver"
                value={driver?.name ?? "-"}
              />
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <Link
                to={`/operations/trips`}
                style={secondaryButtonStyle}
              >
                View Trips
              </Link>

              {vehicle && (
                <Link
                  to={`/fleet/vehicles/${vehicle.id}`}
                  style={secondaryButtonStyle}
                >
                  View Vehicle
                </Link>
              )}

              {driver && (
                <Link
                  to={`/drivers/${driver.id}`}
                  style={secondaryButtonStyle}
                >
                  View Driver
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Financial Information */}
      {trip && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>
            Trip Financial Summary
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <InfoCard
              label="Trip Revenue"
              value={`฿${trip.revenue.toLocaleString()}`}
            />

            <InfoCard
              label="Trip Cost"
              value={`฿${tripCost.toLocaleString()}`}
            />

            <InfoCard
              label="Trip Profit"
              value={`฿${tripProfit.toLocaleString()}`}
            />

            <InfoCard
              label="Distance"
              value={`${trip.distanceKm.toLocaleString()} km`}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>
          Notes
        </h2>

        <p
          style={{
            margin: 0,
            color: order.notes
              ? "#374151"
              : "#9ca3af",
          }}
        >
          {order.notes || "No notes for this order."}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "11px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span style={{ color: "#6b7280" }}>
        {label}
      </span>

      <strong
        style={{
          textAlign: "right",
          color: "#374151",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: "13px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

function LocationBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "18px",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: "12px",
          fontWeight: 600,
          marginBottom: "8px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "white",
  borderRadius: "7px",
  padding: "9px 15px",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "white",
  color: "#374151",
  borderRadius: "7px",
  padding: "9px 15px",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

export default CustomerOrderDetailsPage;
