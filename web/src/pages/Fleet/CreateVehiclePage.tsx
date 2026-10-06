import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";

function CreateVehiclePage() {
  const navigate = useNavigate();

  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("6-Wheel Truck");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [branchId, setBranchId] = useState(
    branches[0]?.id ?? ""
  );
  const [driverId, setDriverId] = useState(
    employees[0]?.id ?? ""
  );
  const [status, setStatus] = useState<
    "Active" | "Inactive" | "Maintenance"
  >("Active");
  const [mileage, setMileage] = useState("0");

  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!plateNumber.trim()) {
      setError("Plate number is required.");
      return;
    }

    if (!brand.trim()) {
      setError("Brand is required.");
      return;
    }

    if (!model.trim()) {
      setError("Model is required.");
      return;
    }

    const mileageNumber = Number(mileage);

    if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
      setError("Mileage must be a valid positive number.");
      return;
    }

    const newVehicle = {
      id: `VH-${String(vehicles.length + 1).padStart(3, "0")}`,
      plateNumber: plateNumber.trim(),
      vehicleType,
      brand: brand.trim(),
      model: model.trim(),
      branchId,
      driverId,
      status,
      mileage: mileageNumber,
    };

    vehicles.push(newVehicle);

    navigate("/fleet/vehicles");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#ffffff",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/fleet/vehicles")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            color: "#6b7280",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ← Vehicles
        </button>

        <h1
          style={{
            margin: "10px 0 6px",
            fontSize: "26px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Add Vehicle
        </h1>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Register a new vehicle in your fleet.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
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
              <label style={labelStyle}>
                Plate Number *
              </label>

              <input
                value={plateNumber}
                onChange={(event) =>
                  setPlateNumber(event.target.value)
                }
                placeholder="e.g. 1กข-1234"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Vehicle Type *
              </label>

              <select
                value={vehicleType}
                onChange={(event) =>
                  setVehicleType(event.target.value)
                }
                style={inputStyle}
              >
                <option value="4-Wheel Truck">
                  4-Wheel Truck
                </option>

                <option value="6-Wheel Truck">
                  6-Wheel Truck
                </option>

                <option value="10-Wheel Truck">
                  10-Wheel Truck
                </option>

                <option value="Trailer">
                  Trailer
                </option>

                <option value="Pickup">
                  Pickup
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Brand *
              </label>

              <input
                value={brand}
                onChange={(event) =>
                  setBrand(event.target.value)
                }
                placeholder="e.g. Isuzu"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Model *
              </label>

              <input
                value={model}
                onChange={(event) =>
                  setModel(event.target.value)
                }
                placeholder="e.g. NPR"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Mileage (km)
              </label>

              <input
                type="number"
                min="0"
                value={mileage}
                onChange={(event) =>
                  setMileage(event.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Status *
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "Active"
                      | "Inactive"
                      | "Maintenance"
                  )
                }
                style={inputStyle}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">
                  Maintenance
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
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
              <label style={labelStyle}>
                Branch *
              </label>

              <select
                value={branchId}
                onChange={(event) =>
                  setBranchId(event.target.value)
                }
                style={inputStyle}
              >
                {branches.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Assigned Driver *
              </label>

              <select
                value={driverId}
                onChange={(event) =>
                  setDriverId(event.target.value)
                }
                style={inputStyle}
              >
                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 14px",
              borderRadius: "7px",
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: "14px",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/fleet/vehicles")}
            style={{
              height: "42px",
              padding: "0 18px",
              border: "1px solid #d1d5db",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              height: "42px",
              padding: "0 20px",
              border: "none",
              borderRadius: "7px",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Create Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateVehiclePage;
