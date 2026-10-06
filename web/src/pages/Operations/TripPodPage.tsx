import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { generateTrips } from "../../data/generateTrips";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { customers } from "../../data/customers";

type PodStatus = "Pending" | "Delivered" | "Partial" | "Failed";

type PodRecord = {
  tripId: string;
  status: PodStatus;
  receiverName: string;
  receiverPhone: string;
  deliveredAt: string;
  notes: string;
  attachmentName: string;
};

const STORAGE_KEY = "tms_trip_pod";

function getSavedPods(): PodRecord[] {
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

function savePods(pods: PodRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pods));
}

export default function TripPodPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const trips = generateTrips(500);
  const trip = trips.find((item) => item.id === tripId);

  const [savedPods, setSavedPods] = useState<PodRecord[]>(getSavedPods);

  const existingPod = savedPods.find(
    (pod) => pod.tripId === tripId
  );

  const [status, setStatus] = useState<PodStatus>(
    existingPod?.status ?? "Pending"
  );

  const [receiverName, setReceiverName] = useState(
    existingPod?.receiverName ?? ""
  );

  const [receiverPhone, setReceiverPhone] = useState(
    existingPod?.receiverPhone ?? ""
  );

  const [deliveredAt, setDeliveredAt] = useState(
    existingPod?.deliveredAt ??
      new Date().toISOString().slice(0, 16)
  );

  const [notes, setNotes] = useState(
    existingPod?.notes ?? ""
  );

  const [attachmentName, setAttachmentName] = useState(
    existingPod?.attachmentName ?? ""
  );

  if (!trip) {
    return (
      <div>
        <h1>Proof of Delivery</h1>

        <div className="card">
          <h2>Trip not found</h2>

          <p>
            The requested trip could not be found in the demo data.
          </p>

          <Link to="/operations/trips">
            <button>Back to Trips</button>
          </Link>
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

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAttachmentName(file.name);
  }

  function handleSave() {
    if (status !== "Pending" && !receiverName.trim()) {
      alert("Please enter the receiver name.");
      return;
    }

    const newPod: PodRecord = {
      tripId: currentTrip.id,
      status,
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      deliveredAt,
      notes: notes.trim(),
      attachmentName,
    };

    const updatedPods = [
      ...savedPods.filter(
        (pod) => pod.tripId !== currentTrip.id
      ),
      newPod,
    ];

    savePods(updatedPods);
    setSavedPods(updatedPods);

    alert("Proof of Delivery saved successfully.");
  }

  function handleDelete() {
    const updatedPods = savedPods.filter(
      (pod) => pod.tripId !== currentTrip.id
    );

    savePods(updatedPods);
    setSavedPods(updatedPods);

    setStatus("Pending");
    setReceiverName("");
    setReceiverPhone("");
    setDeliveredAt(
      new Date().toISOString().slice(0, 16)
    );
    setNotes("");
    setAttachmentName("");

    alert("Proof of Delivery removed.");
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <button onClick={() => navigate(-1)}>
              ← Back
            </button>

            <span className={`status ${status.toLowerCase()}`}>
              {status}
            </span>
          </div>

          <h1>Proof of Delivery</h1>

          <p style={{ color: "#6b7280" }}>
            Trip {trip.tripNumber}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Link to={`/operations/trips/${trip.id}`}>
            <button>Trip Details</button>
          </Link>

          <button onClick={handleSave}>
            Save POD
          </button>
        </div>
      </div>

      {/* Trip Summary */}
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
          <p>Trip</p>
          <h2>{trip.tripNumber}</h2>
        </div>

        <div className="card">
          <p>Customer</p>
          <h2>{customer?.name ?? trip.customerId}</h2>
        </div>

        <div className="card">
          <p>Vehicle</p>
          <h2>
            {vehicle?.plateNumber ?? trip.vehicleId}
          </h2>
        </div>

        <div className="card">
          <p>Driver</p>
          <h2>
            {driver?.name ?? trip.driverId}
          </h2>
        </div>
      </div>

      {/* Route */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>
          Delivery Route
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr auto 1fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <p>Pickup</p>
            <strong>{trip.origin}</strong>
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#9ca3af",
            }}
          >
            →
          </div>

          <div>
            <p>Delivery</p>
            <strong>{trip.destination}</strong>
          </div>
        </div>
      </div>

      {/* POD Form */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: 24,
        }}
      >
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Delivery Confirmation
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label>Delivery Status</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as PodStatus
                  )
                }
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                }}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Partial">
                  Partial
                </option>

                <option value="Failed">
                  Failed
                </option>
              </select>
            </div>

            <div>
              <label>Delivery Date & Time</label>

              <input
                type="datetime-local"
                value={deliveredAt}
                onChange={(event) =>
                  setDeliveredAt(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label>Receiver Name</label>

              <input
                type="text"
                placeholder="Enter receiver name"
                value={receiverName}
                onChange={(event) =>
                  setReceiverName(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label>Receiver Phone</label>

              <input
                type="text"
                placeholder="Enter receiver phone"
                value={receiverPhone}
                onChange={(event) =>
                  setReceiverPhone(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Delivery Notes</label>

            <textarea
              rows={5}
              placeholder="Enter delivery notes..."
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Delivery Document</label>

            <input
              type="file"
              onChange={handleFileChange}
              style={{
                display: "block",
                marginTop: 8,
              }}
            />

            {attachmentName && (
              <p
                style={{
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
                Attached: {attachmentName}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
            }}
          >
            <button onClick={handleSave}>
              Save Proof of Delivery
            </button>

            {existingPod && (
              <button
                onClick={handleDelete}
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                }}
              >
                Remove POD
              </button>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ marginBottom: 16 }}>
              Delivery Information
            </h2>

            <p>Customer</p>
            <strong>
              {customer?.name ?? trip.customerId}
            </strong>

            <p style={{ marginTop: 16 }}>
              Destination
            </p>
            <strong>{trip.destination}</strong>

            <p style={{ marginTop: 16 }}>
              Distance
            </p>
            <strong>
              {trip.distanceKm.toLocaleString()} km
            </strong>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>
              POD Status
            </h2>

            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {status}
            </div>

            <p style={{ color: "#6b7280" }}>
              {status === "Delivered"
                ? "Delivery has been confirmed."
                : status === "Partial"
                ? "Only part of the shipment was delivered."
                : status === "Failed"
                ? "Delivery could not be completed."
                : "Delivery confirmation is still pending."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
