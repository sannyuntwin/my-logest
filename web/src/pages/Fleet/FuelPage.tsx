import { useMemo, useState } from "react";
import { fuelTransactions } from "../../data/fuel";
import { vehicles } from "../../data/vehicles";

function FuelPage() {
  const [search, setSearch] = useState("");
  const [vehicleId, setVehicleId] = useState("all");
  const [fuelType, setFuelType] = useState("all");

  const getVehicle = (id: string) => {
    return vehicles.find((vehicle) => vehicle.id === id);
  };

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return fuelTransactions.filter((transaction) => {
      const vehicle = getVehicle(transaction.vehicleId);

      const matchesSearch =
        !keyword ||
        transaction.id.toLowerCase().includes(keyword) ||
        transaction.fuelStation
          .toLowerCase()
          .includes(keyword) ||
        vehicle?.plateNumber
          .toLowerCase()
          .includes(keyword);

      const matchesVehicle =
        vehicleId === "all" ||
        transaction.vehicleId === vehicleId;

      const matchesFuelType =
        fuelType === "all" ||
        transaction.fuelType === fuelType;

      return (
        matchesSearch &&
        matchesVehicle &&
        matchesFuelType
      );
    });
  }, [search, vehicleId, fuelType]);

  const totalTransactions = fuelTransactions.length;

  const totalLiters = fuelTransactions.reduce(
    (sum, transaction) => sum + transaction.liters,
    0
  );

  const totalCost = fuelTransactions.reduce(
    (sum, transaction) => sum + transaction.totalCost,
    0
  );

  const averagePrice =
    totalLiters > 0
      ? totalCost / totalLiters
      : 0;

  const resetFilters = () => {
    setSearch("");
    setVehicleId("all");
    setFuelType("all");
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
  };

  const inputStyle: React.CSSProperties = {
    height: "40px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    padding: "0 12px",
    fontSize: "14px",
    background: "#ffffff",
    boxSizing: "border-box",
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
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Fuel Management
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Track fuel consumption, fuel costs, and vehicle
            refueling activity.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Create Fuel Transaction will be implemented next."
            )
          }
          style={{
            height: "40px",
            padding: "0 16px",
            border: "none",
            borderRadius: "7px",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Fuel Transaction
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
          <div
            style={{
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Transactions
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
            }}
          >
            {totalTransactions}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Fuel Consumed
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {totalLiters.toLocaleString()} L
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Total Fuel Cost
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#2563eb",
            }}
          >
            ฿{totalCost.toLocaleString()}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Avg. Price / Liter
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "25px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            ฿{averagePrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "12px",
          }}
        >
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search vehicle or fuel station..."
            style={inputStyle}
          />

          <select
            value={vehicleId}
            onChange={(event) =>
              setVehicleId(event.target.value)
            }
            style={inputStyle}
          >
            <option value="all">All Vehicles</option>

            {vehicles.map((vehicle) => (
              <option
                key={vehicle.id}
                value={vehicle.id}
              >
                {vehicle.plateNumber}
              </option>
            ))}
          </select>

          <select
            value={fuelType}
            onChange={(event) =>
              setFuelType(event.target.value)
            }
            style={inputStyle}
          >
            <option value="all">All Fuel Types</option>
            <option value="Diesel">Diesel</option>
            <option value="Gasoline">Gasoline</option>
            <option value="EV Charging">
              EV Charging
            </option>
          </select>

          <button
            onClick={resetFilters}
            style={{
              height: "40px",
              padding: "0 14px",
              border: "1px solid #d1d5db",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Fuel Table */}
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
            Fuel Transactions
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1
              ? "s"
              : ""}{" "}
            found
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
                <th style={thStyle}>Transaction</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Fuel</th>
                <th style={thStyle}>Liters</th>
                <th style={thStyle}>Price/L</th>
                <th style={thStyle}>Total Cost</th>
                <th style={thStyle}>Mileage</th>
                <th style={thStyle}>Station</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map(
                (transaction) => {
                  const vehicle = getVehicle(
                    transaction.vehicleId
                  );

                  return (
                    <tr key={transaction.id}>
                      <td style={tdStyle}>
                        <strong>
                          {transaction.id}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {transaction.date}
                      </td>

                      <td style={tdStyle}>
                        {vehicle?.plateNumber ??
                          transaction.vehicleId}
                      </td>

                      <td style={tdStyle}>
                        {transaction.fuelType}
                      </td>

                      <td style={tdStyle}>
                        {transaction.liters.toLocaleString()} L
                      </td>

                      <td style={tdStyle}>
                        ฿
                        {transaction.pricePerLiter.toFixed(
                          2
                        )}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          ฿
                          {transaction.totalCost.toLocaleString()}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {transaction.mileage.toLocaleString()} km
                      </td>

                      <td style={tdStyle}>
                        {transaction.fuelStation}
                      </td>
                    </tr>
                  );
                }
              )}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No fuel transactions found.
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

export default FuelPage;