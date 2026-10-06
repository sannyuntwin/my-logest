import { Link, useParams } from "react-router-dom";

import { workOrders } from "../../data/workOrders";
import { customerOrders } from "../../data/customerOrders";
import { customers } from "../../data/customers";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";
import { generateTrips } from "../../data/generateTrips";
import { getProfit, getTotalCost } from "../../data/tripUtils";

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return { background: "#dcfce7", color: "#166534" };

    case "In Progress":
      return { background: "#dbeafe", color: "#1d4ed8" };

    case "Assigned":
      return { background: "#e0e7ff", color: "#4338ca" };

    case "Pending":
      return { background: "#fef3c7", color: "#92400e" };

    case "Cancelled":
      return { background: "#fee2e2", color: "#b91c1c" };

    default:
      return { background: "#f3f4f6", color: "#374151" };
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Urgent":
      return { background: "#fee2e2", color: "#b91c1c" };

    case "High":
      return { background: "#ffedd5", color: "#c2410c" };

    case "Low":
      return { background: "#ecfdf5", color: "#047857" };

    default:
      return { background: "#f3f4f6", color: "#374151" };
  }
}

function WorkOrderDetailsPage() {
  const { workOrderId } = useParams();

  const workOrder = workOrders.find(
    (item) => item.id === workOrderId
  );

  if (!workOrder) {
    return (
      <div className="card">
        <h2>Work Order Not Found</h2>

        <p style={{ color: "#6b7280" }}>
          The work order you are looking for does not exist.
        </p>

        <Link
          to="/operations/work-orders"
          style={linkStyle}
        >
          ← Back to Work Orders
        </Link>
      </div>
    );
  }

  const customer = customers.find(
    (item) => item.id === workOrder.customerId
  );

  const customerOrder = customerOrders.find(
    (item) => item.id === workOrder.customerOrderId
  );

  const vehicle = workOrder.vehicleId
    ? vehicles.find(
        (item) => item.id === workOrder.vehicleId
      )
    : undefined;

  const driver = workOrder.driverId
    ? employees.find(
        (item) => item.id === workOrder.driverId
      )
    : undefined;

  const trips = generateTrips(500);

  const trip = workOrder.tripId
    ? trips.find(
        (item) => item.id === workOrder.tripId
      )
    : undefined;

  const statusStyle = getStatusStyle(
    workOrder.status
  );

  const priorityStyle = getPriorityStyle(
    workOrder.priority
  );

  const tripCost = trip
    ? getTotalCost(trip)
    : 0;

  const tripProfit = trip
    ? getProfit(trip)
    : 0;

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
            to="/operations/work-orders"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Work Orders
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <h1 style={{ margin: 0 }}>
              {workOrder.workOrderNumber}
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
              {workOrder.status}
            </span>

            <span
              style={{
                ...priorityStyle,
                padding: "6px 11px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {workOrder.priority}
            </span>
          </div>

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
            }}
          >
            Transportation work order
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() =>
              alert(
                `Edit ${workOrder.workOrderNumber}`
              )
            }
            style={secondaryButtonStyle}
          >
            Edit
          </button>

          {!workOrder.tripId &&
            workOrder.status !== "Cancelled" && (
              <button
                onClick={() =>
                  alert(
                    `Create trip for ${workOrder.workOrderNumber}`
                  )
                }
                style={primaryButtonStyle}
              >
                Create Trip
              </button>
            )}
        </div>
      </div>

      {/* KPI Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <InfoCard
          label="Requested Date"
          value={workOrder.requestedDate}
        />

        <InfoCard
          label="Cargo Weight"
          value={`${workOrder.weightKg.toLocaleString()} kg`}
        />

        <InfoCard
          label="Vehicle"
          value={
            vehicle?.plateNumber ??
            "Unassigned"
          }
        />

        <InfoCard
          label="Driver"
          value={
            driver?.name ?? "Unassigned"
          }
        />

        <InfoCard
          label="Trip"
          value={
            workOrder.tripId ??
            "Not Created"
          }
        />
      </div>

      {/* Customer + Order */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            Customer
          </h2>

          <InfoRow
            label="Customer"
            value={customer?.name ?? "-"}
          />

          <InfoRow
            label="Customer Code"
            value={
              customer?.customerCode ?? "-"
            }
          />

          <InfoRow
            label="Contact Person"
            value={
              customer?.contactPerson ?? "-"
            }
          />

          <InfoRow
            label="Phone"
            value={customer?.phone ?? "-"}
          />

          {customer && (
            <Link
              to={`/customers/${customer.id}`}
              style={{
                ...linkStyle,
                display: "inline-block",
                marginTop: "12px",
              }}
            >
              View Customer →
            </Link>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            Customer Order
          </h2>

          <InfoRow
            label="Order Number"
            value={
              customerOrder?.orderNumber ?? "-"
            }
          />

          <InfoRow
            label="Order Date"
            value={
              customerOrder?.orderDate ?? "-"
            }
          />

          <InfoRow
            label="Requested Date"
            value={
              customerOrder?.requestedDate ?? "-"
            }
          />

          <InfoRow
            label="Revenue"
            value={
              customerOrder
                ? `฿${customerOrder.revenue.toLocaleString()}`
                : "-"
            }
          />

          {customerOrder && (
            <Link
              to={`/customers/orders/${customerOrder.id}`}
              style={{
                ...linkStyle,
                display: "inline-block",
                marginTop: "12px",
              }}
            >
              View Customer Order →
            </Link>
          )}
        </div>
      </div>

      {/* Route */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h2 style={{ marginTop: 0 }}>
          Transportation Route
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 80px 1fr",
            gap: "20px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <LocationBox
            label="Pickup"
            value={
              workOrder.pickupLocation
            }
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "28px",
              color: "#2563eb",
            }}
          >
            →
          </div>

          <LocationBox
            label="Delivery"
            value={
              workOrder.deliveryLocation
            }
          />
        </div>
      </div>

      {/* Assignment */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h2 style={{ marginTop: 0 }}>
          Resource Assignment
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <AssignmentCard
            title="Vehicle"
            value={
              vehicle?.plateNumber ??
              "Unassigned"
            }
            subtitle={
              vehicle
                ? `${vehicle.brand} ${vehicle.model}`
                : "No vehicle assigned"
            }
            link={
              vehicle
                ? `/fleet/vehicles/${vehicle.id}`
                : undefined
            }
          />

          <AssignmentCard
            title="Driver"
            value={
              driver?.name ??
              "Unassigned"
            }
            subtitle={
              driver
                ? `${driver.employeeCode} · ${driver.phone}`
                : "No driver assigned"
            }
            link={
              driver
                ? `/drivers/${driver.id}`
                : undefined
            }
          />

          <AssignmentCard
            title="Trip"
            value={
              trip?.tripNumber ??
              workOrder.tripId ??
              "Not Created"
            }
            subtitle={
              trip
                ? `${trip.date} · ${trip.status}`
                : "No trip created"
            }
            link={
              trip
                ? "/operations/trips"
                : undefined
            }
          />
        </div>
      </div>

      {/* Trip Financials */}
      {trip && (
        <div
          className="card"
          style={{ marginBottom: "20px" }}
        >
          <h2 style={{ marginTop: 0 }}>
            Trip Financial Summary
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <InfoCard
              label="Revenue"
              value={`฿${trip.revenue.toLocaleString()}`}
            />

            <InfoCard
              label="Trip Cost"
              value={`฿${tripCost.toLocaleString()}`}
            />

            <InfoCard
              label="Profit"
              value={`฿${tripProfit.toLocaleString()}`}
            />

            <InfoCard
              label="Distance"
              value={`${trip.distanceKm.toLocaleString()} km`}
            />
          </div>
        </div>
      )}

      {/* Job Information */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h2 style={{ marginTop: 0 }}>
          Work Order Information
        </h2>

        <InfoRow
          label="Work Order Number"
          value={workOrder.workOrderNumber}
        />

        <InfoRow
          label="Cargo"
          value={
            workOrder.cargoDescription
          }
        />

        <InfoRow
          label="Weight"
          value={`${workOrder.weightKg.toLocaleString()} kg`}
        />

        <InfoRow
          label="Priority"
          value={workOrder.priority}
        />

        <InfoRow
          label="Status"
          value={workOrder.status}
        />

        <InfoRow
          label="Assigned Date"
          value={
            workOrder.assignedDate ??
            "Not assigned"
          }
        />
      </div>

      {/* Notes */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>
          Notes
        </h2>

        <p
          style={{
            margin: 0,
            color: workOrder.notes
              ? "#374151"
              : "#9ca3af",
          }}
        >
          {workOrder.notes ||
            "No notes for this work order."}
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
        borderBottom:
          "1px solid #f1f5f9",
      }}
    >
      <span
        style={{
          color: "#6b7280",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#374151",
          textAlign: "right",
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

function AssignmentCard({
  title,
  value,
  subtitle,
  link,
}: {
  title: string;
  value: string;
  subtitle: string;
  link?: string;
}) {
  const content = (
    <>
      <div
        style={{
          color: "#6b7280",
          fontSize: "13px",
          marginBottom: "7px",
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: "block",
          color: "#111827",
          marginBottom: "5px",
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        {subtitle}
      </span>
    </>
  );

  if (link) {
    return (
      <Link
        to={link}
        style={{
          background: "#f9fafb",
          padding: "18px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "block",
          border: "1px solid #f1f5f9",
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "18px",
        borderRadius: "8px",
        border: "1px solid #f1f5f9",
      }}
    >
      {content}
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600,
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "white",
  borderRadius: "7px",
  padding: "9px 15px",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "white",
  color: "#374151",
  borderRadius: "7px",
  padding: "9px 15px",
  fontWeight: 600,
  cursor: "pointer",
};

export default WorkOrderDetailsPage;
