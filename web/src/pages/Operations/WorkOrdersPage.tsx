import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { workOrders } from "../../data/workOrders";
import { customers } from "../../data/customers";
import { employees } from "../../data/employees";
import { vehicles } from "../../data/vehicles";

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "In Progress":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };

    case "Assigned":
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

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Urgent":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };

    case "High":
      return {
        background: "#ffedd5",
        color: "#c2410c",
      };

    case "Normal":
      return {
        background: "#f3f4f6",
        color: "#374151",
      };

    case "Low":
      return {
        background: "#ecfdf5",
        color: "#047857",
      };

    default:
      return {
        background: "#f3f4f6",
        color: "#374151",
      };
  }
}

function WorkOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredOrders = useMemo(() => {
    return workOrders.filter((order) => {
      const customerData = customers.find(
        (item) => item.id === order.customerId
      );

      const vehicleData = vehicles.find(
        (item) => item.id === order.vehicleId
      );

      const driverData = employees.find(
        (item) => item.id === order.driverId
      );

      const searchText = search.toLowerCase();

      const matchesSearch =
        order.workOrderNumber
          .toLowerCase()
          .includes(searchText) ||
        order.pickupLocation
          .toLowerCase()
          .includes(searchText) ||
        order.deliveryLocation
          .toLowerCase()
          .includes(searchText) ||
        order.cargoDescription
          .toLowerCase()
          .includes(searchText) ||
        customerData?.name
          .toLowerCase()
          .includes(searchText) ||
        vehicleData?.plateNumber
          .toLowerCase()
          .includes(searchText) ||
        driverData?.name
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "all" ||
        order.status === status;

      const matchesPriority =
        priority === "all" ||
        order.priority === priority;

      const matchesCustomer =
        customer === "all" ||
        order.customerId === customer;

      const matchesDateFrom =
        !dateFrom ||
        order.requestedDate >= dateFrom;

      const matchesDateTo =
        !dateTo ||
        order.requestedDate <= dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCustomer &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    search,
    status,
    priority,
    customer,
    dateFrom,
    dateTo,
  ]);

  const totalOrders = filteredOrders.length;

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const assignedOrders = filteredOrders.filter(
    (order) => order.status === "Assigned"
  ).length;

  const inProgressOrders = filteredOrders.filter(
    (order) => order.status === "In Progress"
  ).length;

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "Completed"
  ).length;

  const unassignedOrders = filteredOrders.filter(
    (order) =>
      !order.vehicleId || !order.driverId
  ).length;

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCustomer("all");
    setDateFrom("");
    setDateTo("");
  }

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
          <h1 style={{ margin: 0, fontSize: "28px" }}>
            Work Orders
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Manage transportation jobs from order to execution.
          </p>
        </div>

        <button
          onClick={() => alert("Create Work Order")}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "11px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Create Work Order
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          ["Total", totalOrders],
          ["Pending", pendingOrders],
          ["Assigned", assignedOrders],
          ["In Progress", inProgressOrders],
          ["Completed", completedOrders],
          ["Unassigned", unassignedOrders],
        ].map(([title, value]) => (
          <div className="card" key={String(title)}>
            <p>{title}</p>
            <h2>{value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{ marginBottom: "24px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div>
            <label>Search</label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="WO, customer, route, vehicle..."
              style={inputStyle}
            />
          </div>

          <div>
            <label>Customer</label>

            <select
              value={customer}
              onChange={(event) =>
                setCustomer(event.target.value)
              }
              style={inputStyle}
            >
              <option value="all">
                All Customers
              </option>

              {customers.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Status</label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              style={inputStyle}
            >
              <option value="all">
                All Status
              </option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label>Priority</label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              style={inputStyle}
            >
              <option value="all">
                All Priority
              </option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label>Date From</label>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                setDateFrom(event.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Date To</label>

            <input
              type="date"
              value={dateTo}
              onChange={(event) =>
                setDateTo(event.target.value)
              }
              style={inputStyle}
            />
          </div>

          <button
            onClick={resetFilters}
            style={{
              height: "40px",
              padding: "0 14px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>
            Work Orders
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredOrders.length} work orders found
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid #e5e7eb",
                  textAlign: "left",
                }}
              >
                <th style={thStyle}>
                  Work Order
                </th>
                <th style={thStyle}>
                  Customer
                </th>
                <th style={thStyle}>
                  Route
                </th>
                <th style={thStyle}>
                  Requested
                </th>
                <th style={thStyle}>
                  Vehicle
                </th>
                <th style={thStyle}>
                  Driver
                </th>
                <th style={thStyle}>
                  Priority
                </th>
                <th style={thStyle}>
                  Status
                </th>
                <th style={thStyle}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const customerData =
                  customers.find(
                    (item) =>
                      item.id ===
                      order.customerId
                  );

                const vehicleData =
                  vehicles.find(
                    (item) =>
                      item.id ===
                      order.vehicleId
                  );

                const driverData =
                  employees.find(
                    (item) =>
                      item.id ===
                      order.driverId
                  );

                const statusStyle =
                  getStatusStyle(order.status);

                const priorityStyle =
                  getPriorityStyle(
                    order.priority
                  );

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom:
                        "1px solid #f1f5f9",
                    }}
                  >
                    <td style={tdStyle}>
                      <strong>
                        {order.workOrderNumber}
                      </strong>

                      <div
                        style={{
                          color: "#9ca3af",
                          fontSize: "12px",
                          marginTop: "3px",
                        }}
                      >
                        {order.cargoDescription}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {customerData?.name ??
                        "-"}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {order.pickupLocation}
                      </strong>

                      <div
                        style={{
                          color: "#6b7280",
                          marginTop: "3px",
                        }}
                      >
                        ↓{" "}
                        {order.deliveryLocation}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {order.requestedDate}
                    </td>

                    <td style={tdStyle}>
                      {vehicleData ? (
                        <Link
                          to={`/fleet/vehicles/${vehicleData.id}`}
                          style={linkStyle}
                        >
                          {
                            vehicleData.plateNumber
                          }
                        </Link>
                      ) : (
                        <span
                          style={{
                            color: "#9ca3af",
                          }}
                        >
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td style={tdStyle}>
                      {driverData ? (
                        <Link
                          to={`/drivers/${driverData.id}`}
                          style={linkStyle}
                        >
                          {driverData.name}
                        </Link>
                      ) : (
                        <span
                          style={{
                            color: "#9ca3af",
                          }}
                        >
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...priorityStyle,
                          padding:
                            "5px 9px",
                          borderRadius:
                            "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {order.priority}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusStyle,
                          padding:
                            "5px 9px",
                          borderRadius:
                            "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <Link
                        to={`/operations/work-orders/${order.id}`}
                        style={linkStyle}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            No work orders found.
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  marginTop: "6px",
  padding: "0 10px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  boxSizing: "border-box",
  background: "white",
};

const thStyle: React.CSSProperties = {
  padding: "12px 10px",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 10px",
  verticalAlign: "top",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600,
};

export default WorkOrdersPage;