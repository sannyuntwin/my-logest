import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { costs } from "../../data/costs";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: string) {
  return status
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function CostsPage() {
  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [vehicleFilter, setVehicleFilter] =
    useState("All");

  const filteredCosts = useMemo(() => {
    return costs.filter((cost) => {
      const vehicle = vehicles.find(
        (item) =>
          item.id === cost.vehicleId
      );

      const driver = employees.find(
        (item) =>
          item.id === cost.driverId
      );

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        cost.costNumber
          .toLowerCase()
          .includes(searchText) ||
        cost.description
          .toLowerCase()
          .includes(searchText) ||
        cost.vendor
          .toLowerCase()
          .includes(searchText) ||
        (vehicle?.plateNumber
          .toLowerCase()
          .includes(searchText) ??
          false) ||
        (driver?.name
          .toLowerCase()
          .includes(searchText) ??
          false);

      const matchesCategory =
        categoryFilter === "All" ||
        cost.category ===
          categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        cost.status === statusFilter;

      const matchesVehicle =
        vehicleFilter === "All" ||
        cost.vehicleId ===
          vehicleFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesVehicle
      );
    });
  }, [
    search,
    categoryFilter,
    statusFilter,
    vehicleFilter,
  ]);

  const activeCosts = costs.filter(
    (cost) => cost.status !== "Cancelled"
  );

  const totalCost = activeCosts.reduce(
    (sum, cost) =>
      sum + cost.amount,
    0
  );

  const paidCost = costs
    .filter(
      (cost) => cost.status === "Paid"
    )
    .reduce(
      (sum, cost) =>
        sum + cost.amount,
      0
    );

  const pendingCost = costs
    .filter(
      (cost) =>
        cost.status === "Pending"
    )
    .reduce(
      (sum, cost) =>
        sum + cost.amount,
      0
    );

  const approvedCost = costs
    .filter(
      (cost) =>
        cost.status === "Approved"
    )
    .reduce(
      (sum, cost) =>
        sum + cost.amount,
      0
    );

  const fuelCost = activeCosts
    .filter(
      (cost) =>
        cost.category === "Fuel"
    )
    .reduce(
      (sum, cost) =>
        sum + cost.amount,
      0
    );

  const maintenanceCost =
    activeCosts
      .filter(
        (cost) =>
          cost.category ===
          "Maintenance"
      )
      .reduce(
        (sum, cost) =>
          sum + cost.amount,
        0
      );

  const tollCost = activeCosts
    .filter(
      (cost) =>
        cost.category === "Toll"
    )
    .reduce(
      (sum, cost) =>
        sum + cost.amount,
      0
    );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Costs</h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Track and manage transportation
            operating costs.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Create Cost - demo only"
            )
          }
        >
          + Create Cost
        </button>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Total Cost</p>

          <h2>
            {formatCurrency(totalCost)}
          </h2>
        </div>

        <div className="card">
          <p>Paid</p>

          <h2>
            {formatCurrency(paidCost)}
          </h2>
        </div>

        <div className="card">
          <p>Pending</p>

          <h2>
            {formatCurrency(
              pendingCost
            )}
          </h2>
        </div>

        <div className="card">
          <p>Approved</p>

          <h2>
            {formatCurrency(
              approvedCost
            )}
          </h2>
        </div>

        <div className="card">
          <p>Transactions</p>

          <h2>{costs.length}</h2>
        </div>
      </div>

      {/* Cost Categories */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Cost Breakdown
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
            <p>Fuel</p>

            <h2>
              {formatCurrency(fuelCost)}
            </h2>
          </div>

          <div>
            <p>Maintenance</p>

            <h2>
              {formatCurrency(
                maintenanceCost
              )}
            </h2>
          </div>

          <div>
            <p>Toll</p>

            <h2>
              {formatCurrency(tollCost)}
            </h2>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label>Search</label>

            <input
              type="text"
              placeholder="Search cost, vendor, vehicle..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing:
                  "border-box",
              }}
            />
          </div>

          <div>
            <label>Category</label>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Categories
              </option>

              <option value="Fuel">
                Fuel
              </option>

              <option value="Toll">
                Toll
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

              <option value="Driver">
                Driver
              </option>

              <option value="Vehicle">
                Vehicle
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label>Vehicle</label>

            <select
              value={vehicleFilter}
              onChange={(event) =>
                setVehicleFilter(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
              }}
            >
              <option value="All">
                All Vehicles
              </option>

              {vehicles.map(
                (vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.plateNumber}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <h2>Cost Transactions</h2>

          <p>
            {filteredCosts.length} records
          </p>
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Cost</th>
                <th>Date</th>
                <th>Category</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCosts.map(
                (cost) => {
                  const vehicle =
                    vehicles.find(
                      (item) =>
                        item.id ===
                        cost.vehicleId
                    );

                  const driver =
                    employees.find(
                      (item) =>
                        item.id ===
                        cost.driverId
                    );

                  return (
                    <tr
                      key={cost.id}
                    >
                      <td>
                        <strong>
                          {
                            cost.costNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {cost.date}
                      </td>

                      <td>
                        {cost.category}
                      </td>

                      <td>
                        {vehicle ? (
                          <Link
                            to={`/fleet/vehicles/${vehicle.id}`}
                          >
                            {
                              vehicle.plateNumber
                            }
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {driver?.name ??
                          "-"}
                      </td>

                      <td>
                        {cost.description}
                      </td>

                      <td>
                        {cost.vendor}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            cost.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status ${statusClass(
                            cost.status
                          )}`}
                        >
                          {cost.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/finance/costs/${cost.id}`}
                        >
                          <button>
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {filteredCosts.length ===
          0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#6b7280",
            }}
          >
            No cost records found.
          </div>
        )}
      </div>
    </div>
  );
}