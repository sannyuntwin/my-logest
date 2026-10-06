import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { workOrders } from "../../data/workOrders";
import { customers } from "../../data/customers";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { routePlans } from "../../data/routes";

type DispatchAssignment = {
  workOrderId: string;
  vehicleId: string;
  driverId: string;
  assignedDate: string;
};

const STORAGE_KEY = "tms_dispatch_assignments";

function getAssignments(): DispatchAssignment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveAssignments(assignments: DispatchAssignment[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(assignments)
  );
}

export default function DispatchAssignmentPage() {
  const { workOrderId } = useParams();
  const navigate = useNavigate();

  const workOrder = workOrders.find(
    (item) => item.id === workOrderId
  );

  const customer = workOrder
    ? customers.find(
        (item) => item.id === workOrder.customerId
      )
    : undefined;

  const route = workOrder
    ? routePlans.find(
        (item) => item.workOrderId === workOrder.id
      )
    : undefined;

  const existingAssignment = workOrder
    ? getAssignments().find(
        (item) => item.workOrderId === workOrder.id
      )
    : undefined;

  const [vehicleId, setVehicleId] = useState(
    existingAssignment?.vehicleId ??
      workOrder?.vehicleId ??
      ""
  );

  const [driverId, setDriverId] = useState(
    existingAssignment?.driverId ??
      workOrder?.driverId ??
      ""
  );

  const [assignedDate, setAssignedDate] = useState(
    existingAssignment?.assignedDate ??
      workOrder?.requestedDate ??
      ""
  );

  const [error, setError] = useState("");

  const availableVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) => vehicle.status === "Active"
    );
  }, []);

  const availableDrivers = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.role === "Driver" &&
        employee.status === "Active"
    );
  }, []);

  if (!workOrder) {
    return (
      <div className="page">
        <div className="card">
          <h2>Work Order Not Found</h2>

          <p style={{ color: "#6b7280" }}>
            The work order does not exist in the demo data.
          </p>

          <button
            onClick={() =>
              navigate("/operations/dispatch")
            }
          >
            Back to Dispatch Board
          </button>
        </div>
      </div>
    );
  }

  const currentWorkOrder = workOrder;

  function handleSave() {
    setError("");

    if (!vehicleId) {
      setError("Please select a vehicle.");
      return;
    }

    if (!driverId) {
      setError("Please select a driver.");
      return;
    }

    if (!assignedDate) {
      setError("Please select an assignment date.");
      return;
    }

    const assignments = getAssignments();

    const newAssignment: DispatchAssignment = {
      workOrderId: currentWorkOrder.id,
      vehicleId,
      driverId,
      assignedDate,
    };

    const existingIndex = assignments.findIndex(
      (item) => item.workOrderId === currentWorkOrder.id
    );

    if (existingIndex >= 0) {
      assignments[existingIndex] = newAssignment;
    } else {
      assignments.push(newAssignment);
    }

    saveAssignments(assignments);

    alert("Dispatch assignment saved successfully.");

    navigate("/operations/dispatch");
  }

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === vehicleId
  );

  const selectedDriver = employees.find(
    (employee) => employee.id === driverId
  );

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() =>
            navigate("/operations/dispatch")
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
          ← Back to Dispatch Board
        </button>

        <h1 style={{ margin: 0 }}>
          Assign Dispatch Resources
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: 8,
          }}
        >
          Assign a vehicle and driver to this transportation
          job.
        </p>
      </div>

      {/* Work Order Summary */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Work Order</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div>
            <p>Work Order</p>

            <Link
              to={`/operations/work-orders/${workOrder.id}`}
            >
              <strong>
                {workOrder.workOrderNumber}
              </strong>
            </Link>
          </div>

          <div>
            <p>Customer</p>
            <strong>
              {customer?.name ?? "Unknown"}
            </strong>
          </div>

          <div>
            <p>Requested Date</p>
            <strong>{workOrder.requestedDate}</strong>
          </div>

          <div>
            <p>Priority</p>
            <strong>{workOrder.priority}</strong>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Route</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div>
            <p>Pickup</p>
            <strong>
              {workOrder.pickupLocation}
            </strong>
          </div>

          <div>
            <p>Delivery</p>
            <strong>
              {workOrder.deliveryLocation}
            </strong>
          </div>

          <div>
            <p>Route Plan</p>

            {route ? (
              <Link
                to={`/operations/routes/${route.id}`}
              >
                <strong>{route.routeNumber}</strong>
              </Link>
            ) : (
              <strong>Not planned</strong>
            )}
          </div>
        </div>
      </div>

      {/* Assignment */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Resource Assignment</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          {/* Vehicle */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Vehicle
            </label>

            <select
              value={vehicleId}
              onChange={(event) =>
                setVehicleId(event.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
              }}
            >
              <option value="">
                Select vehicle
              </option>

              {availableVehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.plateNumber} —{" "}
                  {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>

            {selectedVehicle && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 8,
                }}
              >
                <strong>
                  {selectedVehicle.plateNumber}
                </strong>

                <div
                  style={{
                    color: "#6b7280",
                    marginTop: 4,
                  }}
                >
                  {selectedVehicle.vehicleType}
                  {" • "}
                  {selectedVehicle.mileage.toLocaleString()} km
                </div>
              </div>
            )}
          </div>

          {/* Driver */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Driver
            </label>

            <select
              value={driverId}
              onChange={(event) =>
                setDriverId(event.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
              }}
            >
              <option value="">
                Select driver
              </option>

              {availableDrivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.name} — {driver.employeeCode}
                </option>
              ))}
            </select>

            {selectedDriver && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 8,
                }}
              >
                <strong>
                  {selectedDriver.name}
                </strong>

                <div
                  style={{
                    color: "#6b7280",
                    marginTop: 4,
                  }}
                >
                  {selectedDriver.employeeCode}
                  {" • "}
                  {selectedDriver.phone}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Date */}
        <div style={{ marginTop: 24 }}>
          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Assignment Date
          </label>

          <input
            type="date"
            value={assignedDate}
            onChange={(event) =>
              setAssignedDate(event.target.value)
            }
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <button
          onClick={() =>
            navigate("/operations/dispatch")
          }
        >
          Cancel
        </button>

        <button onClick={handleSave}>
          Save Assignment
        </button>
      </div>
    </div>
  );
}