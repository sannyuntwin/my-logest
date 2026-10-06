import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { generateTrips } from "../../data/generateTrips";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { customers } from "../../data/customers";

const trips = generateTrips(500);

type ExecutionStatus =
  | "Planned"
  | "Departed"
  | "At Pickup"
  | "Pickup Completed"
  | "At Delivery"
  | "Completed";

type ExecutionState = {
  status: ExecutionStatus;
  departureTime: string | null;
  pickupArrivalTime: string | null;
  pickupCompletedTime: string | null;
  deliveryArrivalTime: string | null;
  completedTime: string | null;
  actualDistanceKm: number;
  actualFuelCost: number;
  actualTollCost: number;
  actualOtherCost: number;
};

const STORAGE_KEY = "tms_trip_execution";

function getExecutionMap(): Record<string, ExecutionState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);
  } catch {
    return {};
  }
}

function saveExecutionMap(
  map: Record<string, ExecutionState>
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(map)
  );
}

function getDefaultExecution(
  trip: (typeof trips)[number]
): ExecutionState {
  return {
    status:
      trip.status === "Completed"
        ? "Completed"
        : trip.status === "In Progress"
          ? "Departed"
          : "Planned",

    departureTime: null,
    pickupArrivalTime: null,
    pickupCompletedTime: null,
    deliveryArrivalTime: null,
    completedTime: null,

    actualDistanceKm: trip.distanceKm,
    actualFuelCost: trip.fuelCost,
    actualTollCost: trip.tollCost,
    actualOtherCost: trip.otherCost,
  };
}

function formatTime(value: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Date(value).toLocaleString();
}

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "status completed";

    case "Departed":
    case "At Pickup":
    case "Pickup Completed":
    case "At Delivery":
      return "status in-progress";

    case "Planned":
      return "status planned";

    default:
      return "status pending";
  }
}

export default function TripExecutionPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const trip = trips.find(
    (item) => item.id === tripId
  );

  const [execution, setExecution] = useState<ExecutionState>(
    () => {
      if (!trip) {
        return {
          status: "Planned",
          departureTime: null,
          pickupArrivalTime: null,
          pickupCompletedTime: null,
          deliveryArrivalTime: null,
          completedTime: null,
          actualDistanceKm: 0,
          actualFuelCost: 0,
          actualTollCost: 0,
          actualOtherCost: 0,
        };
      }

      const map = getExecutionMap();

      return (
        map[trip.id] ??
        getDefaultExecution(trip)
      );
    }
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

  const currentTrip = trip;

  const vehicle = vehicles.find(
    (item) => item.id === trip.vehicleId
  );

  const driver = employees.find(
    (item) => item.id === trip.driverId
  );

  const customer = customers.find(
    (item) => item.id === trip.customerId
  );

  const actualTotalCost =
    execution.actualFuelCost +
    execution.actualTollCost +
    execution.actualOtherCost;

  const actualProfit =
    trip.revenue - actualTotalCost;

  function updateExecution(
    changes: Partial<ExecutionState>
  ) {
    const updated = {
      ...execution,
      ...changes,
    };

    setExecution(updated);

    const map = getExecutionMap();

    map[currentTrip.id] = updated;

    saveExecutionMap(map);
  }

  function recordEvent(
    status: ExecutionStatus,
    field: keyof ExecutionState
  ) {
    const now = new Date().toISOString();

    updateExecution({
      status,
      [field]: now,
    } as Partial<ExecutionState>);
  }

  function handleStartTrip() {
    recordEvent(
      "Departed",
      "departureTime"
    );
  }

  function handleArrivePickup() {
    recordEvent(
      "At Pickup",
      "pickupArrivalTime"
    );
  }

  function handlePickupCompleted() {
    recordEvent(
      "Pickup Completed",
      "pickupCompletedTime"
    );
  }

  function handleArriveDelivery() {
    recordEvent(
      "At Delivery",
      "deliveryArrivalTime"
    );
  }

  function handleCompleteTrip() {
    recordEvent(
      "Completed",
      "completedTime"
    );
  }

  const timeline = [
    {
      title: "Trip Planned",
      description:
        "Trip has been created and is ready for execution.",
      completed: true,
      time: null,
    },
    {
      title: "Departed",
      description:
        "Vehicle has departed from the origin.",
      completed:
        execution.status !== "Planned",
      time: execution.departureTime,
    },
    {
      title: "Arrived at Pickup",
      description:
        "Vehicle arrived at the pickup location.",
      completed:
        execution.pickupArrivalTime !== null,
      time: execution.pickupArrivalTime,
    },
    {
      title: "Pickup Completed",
      description:
        "Cargo has been collected.",
      completed:
        execution.pickupCompletedTime !== null,
      time: execution.pickupCompletedTime,
    },
    {
      title: "Arrived at Delivery",
      description:
        "Vehicle arrived at the delivery location.",
      completed:
        execution.deliveryArrivalTime !== null,
      time: execution.deliveryArrivalTime,
    },
    {
      title: "Trip Completed",
      description:
        "Delivery has been completed and the trip is closed.",
      completed:
        execution.completedTime !== null,
      time: execution.completedTime,
    },
  ];

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
              navigate(
                `/operations/trips/${trip.id}`
              )
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
            ← Back to Trip
          </button>

          <h1 style={{ margin: 0 }}>
            Trip Execution
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            {trip.tripNumber} — operational execution
          </p>
        </div>

        <span
          className={statusClass(
            execution.status
          )}
        >
          {execution.status}
        </span>
      </div>

      {/* Trip Summary */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          <div>
            <p>Customer</p>

            {customer ? (
              <Link
                to={`/customers/${customer.id}`}
              >
                <strong>
                  {customer.name}
                </strong>
              </Link>
            ) : (
              <strong>Unknown</strong>
            )}
          </div>

          <div>
            <p>Vehicle</p>

            {vehicle ? (
              <Link
                to={`/fleet/vehicles/${vehicle.id}`}
              >
                <strong>
                  {vehicle.plateNumber}
                </strong>
              </Link>
            ) : (
              <strong>Unknown</strong>
            )}
          </div>

          <div>
            <p>Driver</p>

            {driver ? (
              <Link
                to={`/drivers/${driver.id}`}
              >
                <strong>
                  {driver.name}
                </strong>
              </Link>
            ) : (
              <strong>Unknown</strong>
            )}
          </div>

          <div>
            <p>Trip Date</p>
            <strong>{trip.date}</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.5fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          {/* Execution Timeline */}
          <div
            className="card"
            style={{ marginBottom: 24 }}
          >
            <h2>Execution Timeline</h2>

            <div style={{ marginTop: 24 }}>
              {timeline.map(
                (event, index) => (
                  <div
                    key={event.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "36px 1fr",
                      gap: 16,
                      position: "relative",
                      paddingBottom:
                        index ===
                        timeline.length - 1
                          ? 0
                          : 28,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "center",
                        position:
                          "relative",
                      }}
                    >
                      {index !==
                        timeline.length - 1 && (
                        <div
                          style={{
                            position:
                              "absolute",
                            top: 30,
                            bottom: -28,
                            width: 2,
                            background:
                              event.completed
                                ? "#86efac"
                                : "#e5e7eb",
                          }}
                        />
                      )}

                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius:
                            "50%",
                          background:
                            event.completed
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            event.completed
                              ? "#166534"
                              : "#9ca3af",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      >
                        {event.completed
                          ? "✓"
                          : index + 1}
                      </div>
                    </div>

                    <div>
                      <strong>
                        {event.title}
                      </strong>

                      <p
                        style={{
                          margin:
                            "5px 0",
                          color:
                            "#6b7280",
                        }}
                      >
                        {
                          event.description
                        }
                      </p>

                      <small
                        style={{
                          color:
                            "#6b7280",
                        }}
                      >
                        {formatTime(
                          event.time
                        )}
                      </small>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Route */}
          <div
            className="card"
            style={{ marginBottom: 24 }}
          >
            <h2>Trip Route</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr auto 1fr",
                gap: 20,
                alignItems:
                  "center",
                marginTop: 24,
              }}
            >
              <div>
                <p>Pickup</p>
                <strong>
                  {trip.origin}
                </strong>
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
                <p>Delivery</p>
                <strong>
                  {trip.destination}
                </strong>
              </div>
            </div>
          </div>

          {/* Actual Metrics */}
          <div className="card">
            <h2>Actual Trip Metrics</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <label>
                  Actual Distance (km)
                </label>

                <input
                  type="number"
                  value={
                    execution.actualDistanceKm
                  }
                  onChange={(event) =>
                    updateExecution({
                      actualDistanceKm:
                        Number(
                          event.target.value
                        ),
                    })
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                    border:
                      "1px solid #d1d5db",
                    borderRadius: 8,
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              <div>
                <label>
                  Actual Fuel Cost
                </label>

                <input
                  type="number"
                  value={
                    execution.actualFuelCost
                  }
                  onChange={(event) =>
                    updateExecution({
                      actualFuelCost:
                        Number(
                          event.target.value
                        ),
                    })
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                    border:
                      "1px solid #d1d5db",
                    borderRadius: 8,
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              <div>
                <label>
                  Actual Toll Cost
                </label>

                <input
                  type="number"
                  value={
                    execution.actualTollCost
                  }
                  onChange={(event) =>
                    updateExecution({
                      actualTollCost:
                        Number(
                          event.target.value
                        ),
                    })
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                    border:
                      "1px solid #d1d5db",
                    borderRadius: 8,
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              <div>
                <label>
                  Actual Other Cost
                </label>

                <input
                  type="number"
                  value={
                    execution.actualOtherCost
                  }
                  onChange={(event) =>
                    updateExecution({
                      actualOtherCost:
                        Number(
                          event.target.value
                        ),
                    })
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                    border:
                      "1px solid #d1d5db",
                    borderRadius: 8,
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          {/* Current Action */}
          <div
            className="card"
            style={{ marginBottom: 24 }}
          >
            <h2>Execution Action</h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: 8,
              }}
            >
              Update the trip as it progresses.
            </p>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 20,
              }}
            >
              {execution.status ===
                "Planned" && (
                <button
                  onClick={handleStartTrip}
                >
                  Start Trip
                </button>
              )}

              {execution.status ===
                "Departed" && (
                <button
                  onClick={
                    handleArrivePickup
                  }
                >
                  Arrive at Pickup
                </button>
              )}

              {execution.status ===
                "At Pickup" && (
                <button
                  onClick={
                    handlePickupCompleted
                  }
                >
                  Complete Pickup
                </button>
              )}

              {execution.status ===
                "Pickup Completed" && (
                <button
                  onClick={
                    handleArriveDelivery
                  }
                >
                  Arrive at Delivery
                </button>
              )}

              {execution.status ===
                "At Delivery" && (
                <button
                  onClick={
                    handleCompleteTrip
                  }
                >
                  Complete Trip
                </button>
              )}

              {execution.status ===
                "Completed" && (
                <div
                  style={{
                    padding: 14,
                    background:
                      "#dcfce7",
                    color:
                      "#166534",
                    borderRadius: 8,
                    textAlign:
                      "center",
                    fontWeight: 600,
                  }}
                >
                  Trip completed
                </div>
              )}
            </div>
          </div>

          {/* Financial */}
          <div
            className="card"
            style={{ marginBottom: 24 }}
          >
            <h2>Actual Financial Result</h2>

            <div style={{ marginTop: 20 }}>
              <p>Revenue</p>
              <h2>
                ฿
                {trip.revenue.toLocaleString()}
              </h2>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Actual Cost</p>
              <h2>
                ฿
                {actualTotalCost.toLocaleString()}
              </h2>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Actual Profit</p>
              <h2>
                ฿
                {actualProfit.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Event Times */}
          <div className="card">
            <h2>Event Times</h2>

            <div style={{ marginTop: 20 }}>
              <p>Departure</p>
              <strong>
                {formatTime(
                  execution.departureTime
                )}
              </strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Pickup Arrival</p>
              <strong>
                {formatTime(
                  execution.pickupArrivalTime
                )}
              </strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Pickup Completed</p>
              <strong>
                {formatTime(
                  execution.pickupCompletedTime
                )}
              </strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Delivery Arrival</p>
              <strong>
                {formatTime(
                  execution.deliveryArrivalTime
                )}
              </strong>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>Completed</p>
              <strong>
                {formatTime(
                  execution.completedTime
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}