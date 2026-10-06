import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { customerOrders } from "../../data/customerOrders";
import { customers } from "../../data/customers";

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

function CustomerOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredOrders = useMemo(() => {
    return customerOrders.filter((order) => {
      const customerData = customers.find(
        (item) => item.id === order.customerId
      );

      const searchText = search.toLowerCase();

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchText) ||
        order.pickupLocation.toLowerCase().includes(searchText) ||
        order.deliveryLocation.toLowerCase().includes(searchText) ||
        order.cargoDescription.toLowerCase().includes(searchText) ||
        customerData?.name.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" || order.status === status;

      const matchesCustomer =
        customer === "all" || order.customerId === customer;

      const matchesDateFrom =
        !dateFrom || order.orderDate >= dateFrom;

      const matchesDateTo =
        !dateTo || order.orderDate <= dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [search, status, customer, dateFrom, dateTo]);

  const totalOrders = filteredOrders.length;

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = filteredOrders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const inProgressOrders = filteredOrders.filter(
    (order) => order.status === "In Progress"
  ).length;

  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = filteredOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.revenue, 0);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCustomer("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div>
      {/* Page Header */}
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
            Customer Orders
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Manage customer transportation orders and delivery requests.
          </p>
        </div>

        <button
          onClick={() => alert("Create Customer Order")}
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
          + Create Order
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
          ["Total Orders", totalOrders],
          ["Pending", pendingOrders],
          ["Confirmed", confirmedOrders],
          ["In Progress", inProgressOrders],
          ["Delivered", deliveredOrders],
          [
            "Revenue",
            `฿${totalRevenue.toLocaleString()}`,
          ],
        ].map(([title, value]) => (
          <div className="card" key={String(title)}>
            <p>{title}</p>

            <h2>
              {value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
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
              placeholder="Order no, customer, location..."
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
              <option value="all">All Customers</option>

              {customers.map((item) => (
                <option key={item.id} value={item.id}>
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
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              Orders
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              {filteredOrders.length} orders found
            </p>
          </div>
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
                  borderBottom: "1px solid #e5e7eb",
                  textAlign: "left",
                }}
              >
                <th style={thStyle}>Order No.</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>Requested</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Trip</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const customerData = customers.find(
                  (item) => item.id === order.customerId
                );

                const statusStyle = getStatusStyle(
                  order.status
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
                        {order.orderNumber}
                      </strong>
                    </td>

                    <td style={tdStyle}>
                      {order.orderDate}
                    </td>

                    <td style={tdStyle}>
                      {customerData?.name ?? "-"}
                    </td>

                    <td style={tdStyle}>
                      <div>
                        <strong>
                          {order.pickupLocation}
                        </strong>

                        <div
                          style={{
                            color: "#6b7280",
                            marginTop: "3px",
                          }}
                        >
                          ↓ {order.deliveryLocation}
                        </div>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {order.requestedDate}
                    </td>

                    <td style={tdStyle}>
                      {order.weightKg.toLocaleString()} kg
                    </td>

                    <td style={tdStyle}>
                      ฿{order.revenue.toLocaleString()}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusStyle,
                          padding: "5px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {order.tripId ? (
                        <span
                          style={{
                            color: "#2563eb",
                            fontWeight: 600,
                          }}
                        >
                          {order.tripId}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "#9ca3af",
                          }}
                        >
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <Link
                        to={`/customers/orders/${order.id}`}
                        style={{
                          color: "#2563eb",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
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
            No customer orders found.
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

export default CustomerOrdersPage;