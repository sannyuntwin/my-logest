import { branches } from "../data/branches";
import { customers } from "../data/customers";
import { employees } from "../data/employees";
import { vehicles } from "../data/vehicles";

type FilterBarProps = {
  dateFrom: string;
  dateTo: string;
  selectedBranch: string;
  selectedVehicle: string;
  selectedDriver: string;
  selectedCustomer: string;

  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  setSelectedBranch: (value: string) => void;
  setSelectedVehicle: (value: string) => void;
  setSelectedDriver: (value: string) => void;
  setSelectedCustomer: (value: string) => void;

  resetFilters: () => void;
};

function FilterBar({
  dateFrom,
  dateTo,
  selectedBranch,
  selectedVehicle,
  selectedDriver,
  selectedCustomer,
  setDateFrom,
  setDateTo,
  setSelectedBranch,
  setSelectedVehicle,
  setSelectedDriver,
  setSelectedCustomer,
  resetFilters,
}: FilterBarProps) {
  return (
    <div
      className="card"
      style={{
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
          }}
        >
          Filters
        </h2>

        <button
          onClick={resetFilters}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "8px 12px",
            color: "#2563eb",
            fontWeight: 600,
          }}
        >
          Reset Filters
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(6, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        {/* Date From */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Date From
          </label>

          <input
            type="date"
            value={dateFrom}
            onChange={(event) =>
              setDateFrom(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Date To */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Date To
          </label>

          <input
            type="date"
            value={dateTo}
            onChange={(event) =>
              setDateTo(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Branch */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Branch
          </label>

          <select
            value={selectedBranch}
            onChange={(event) =>
              setSelectedBranch(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          >
            <option value="all">
              All Branches
            </option>

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

        {/* Vehicle */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Vehicle
          </label>

          <select
            value={selectedVehicle}
            onChange={(event) =>
              setSelectedVehicle(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          >
            <option value="all">
              All Vehicles
            </option>

            {vehicles.map((vehicle) => (
              <option
                key={vehicle.id}
                value={vehicle.id}
              >
                {vehicle.plateNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Driver */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Driver
          </label>

          <select
            value={selectedDriver}
            onChange={(event) =>
              setSelectedDriver(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          >
            <option value="all">
              All Drivers
            </option>

            {employees
              .filter(
                (employee) =>
                  employee.role === "Driver"
              )
              .map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}
          </select>
        </div>

        {/* Customer */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Customer
          </label>

          <select
            value={selectedCustomer}
            onChange={(event) =>
              setSelectedCustomer(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              boxSizing: "border-box",
            }}
          >
            <option value="all">
              All Customers
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;