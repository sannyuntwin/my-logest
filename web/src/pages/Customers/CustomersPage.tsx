import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { customers } from "../../data/customers";
import { branches } from "../../data/branches";
import { generateTrips } from "../../data/generateTrips";

function CustomersPage() {
  const trips = useMemo(() => generateTrips(500), []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [branch, setBranch] = useState("all");

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.customerCode
          .toLowerCase()
          .includes(searchText) ||
        customer.contactPerson
          .toLowerCase()
          .includes(searchText) ||
        customer.phone.includes(searchText);

      const matchesStatus =
        status === "all" || customer.status === status;

      const matchesBranch =
        branch === "all" ||
        customer.branchId === branch;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBranch
      );
    });
  }, [search, status, branch]);

  const getBranchName = (branchId: string) => {
    return (
      branches.find((item) => item.id === branchId)?.name ??
      "Unknown Branch"
    );
  };

  const getCustomerTrips = (customerId: string) => {
    return trips.filter(
      (trip) => trip.customerId === customerId
    );
  };

  const totalTrips = trips.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setBranch("all");
  };

  const formatCurrency = (value: number) =>
    `฿${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

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
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Customers
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Manage customers and their transportation activity.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Customer will be connected later.")
          }
          style={{
            border: "none",
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Customer
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
        <div className="card">
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="card">
          <p>Active</p>
          <h2>{activeCustomers}</h2>
        </div>

        <div className="card">
          <p>Inactive</p>
          <h2>{inactiveCustomers}</h2>
        </div>

        <div className="card">
          <p>Total Trips</p>
          <h2>{totalTrips}</h2>
        </div>
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
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Search
            </label>

            <input
              type="text"
              placeholder="Customer, code, contact, phone..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Branch
            </label>

            <select
              value={branch}
              onChange={(event) =>
                setBranch(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Branches</option>

              {branches.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            style={{
              padding: "10px 14px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="card">
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
            }}
          >
            Customer List
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1
              ? "s"
              : ""}
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
                <th style={{ padding: "12px" }}>
                  Customer
                </th>

                <th style={{ padding: "12px" }}>
                  Contact
                </th>

                <th style={{ padding: "12px" }}>
                  Branch
                </th>

                <th style={{ padding: "12px" }}>
                  Phone
                </th>

                <th style={{ padding: "12px" }}>
                  Trips
                </th>

                <th style={{ padding: "12px" }}>
                  Revenue
                </th>

                <th style={{ padding: "12px" }}>
                  Status
                </th>

                <th style={{ padding: "12px" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => {
                const customerTrips =
                  getCustomerTrips(customer.id);

                const revenue = customerTrips.reduce(
                  (sum, trip) =>
                    sum + trip.revenue,
                  0
                );

                return (
                  <tr
                    key={customer.id}
                    style={{
                      borderBottom:
                        "1px solid #f0f0f0",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {customer.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginTop: "3px",
                        }}
                      >
                        {customer.customerCode}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {customer.contactPerson}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {getBranchName(
                        customer.branchId
                      )}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {customer.phone}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {customerTrips.length}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      {formatCurrency(revenue)}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            customer.status ===
                            "Active"
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            customer.status ===
                            "Active"
                              ? "#166534"
                              : "#6b7280",
                        }}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                      }}
                    >
                      <Link
                        to={`/customers/${customer.id}`}
                        style={{
                          color: "#2563eb",
                          textDecoration:
                            "none",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No customers found.
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

export default CustomersPage;