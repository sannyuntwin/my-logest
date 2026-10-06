import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { invoices } from "../../data/invoices";
import { customers } from "../../data/customers";

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

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [customerFilter, setCustomerFilter] =
    useState("All");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const customer = customers.find(
        (item) => item.id === invoice.customerId
      );

      const searchText = search.toLowerCase();

      const matchesSearch =
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchText) ||
        invoice.description
          .toLowerCase()
          .includes(searchText) ||
        (customer?.name
          .toLowerCase()
          .includes(searchText) ??
          false);

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status === statusFilter;

      const matchesCustomer =
        customerFilter === "All" ||
        invoice.customerId === customerFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer
      );
    });
  }, [search, statusFilter, customerFilter]);

  const totalInvoices = invoices.length;

  const issuedInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "Issued"
  ).length;

  const paidInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "Paid"
  ).length;

  const overdueInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "Overdue"
  ).length;

  const totalAmount = invoices.reduce(
    (sum, invoice) =>
      sum + invoice.totalAmount,
    0
  );

  const totalPaid = invoices.reduce(
    (sum, invoice) =>
      sum + invoice.paidAmount,
    0
  );

  const outstandingAmount =
    invoices
      .filter(
        (invoice) =>
          invoice.status !== "Cancelled"
      )
      .reduce(
        (sum, invoice) =>
          sum +
          (invoice.totalAmount -
            invoice.paidAmount),
        0
      );

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
          <h1>Invoices</h1>

          <p style={{ color: "#6b7280" }}>
            Manage customer invoices and
            outstanding balances.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Create Invoice - demo only"
            )
          }
        >
          + Create Invoice
        </button>
      </div>

      {/* KPI Cards */}
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
          <p>Total Invoices</p>
          <h2>{totalInvoices}</h2>
        </div>

        <div className="card">
          <p>Issued</p>
          <h2>{issuedInvoices}</h2>
        </div>

        <div className="card">
          <p>Paid</p>
          <h2>{paidInvoices}</h2>
        </div>

        <div className="card">
          <p>Overdue</p>
          <h2>{overdueInvoices}</h2>
        </div>

        <div className="card">
          <p>Outstanding</p>
          <h2>
            {formatCurrency(
              outstandingAmount
            )}
          </h2>
        </div>
      </div>

      {/* Financial Summary */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          <div>
            <p>Total Invoiced</p>
            <h2>
              {formatCurrency(totalAmount)}
            </h2>
          </div>

          <div>
            <p>Total Paid</p>
            <h2>
              {formatCurrency(totalPaid)}
            </h2>
          </div>

          <div>
            <p>Outstanding Balance</p>
            <h2>
              {formatCurrency(
                outstandingAmount
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label>Search</label>

            <input
              type="text"
              placeholder="Search invoice, customer..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
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

              <option value="Draft">
                Draft
              </option>

              <option value="Issued">
                Issued
              </option>

              <option value="Partially Paid">
                Partially Paid
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Overdue">
                Overdue
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label>Customer</label>

            <select
              value={customerFilter}
              onChange={(event) =>
                setCustomerFilter(
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

      {/* Invoice Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2>Invoice List</h2>

            <p>
              {filteredInvoices.length} invoices
            </p>
          </div>
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
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map(
                (invoice) => {
                  const customer =
                    customers.find(
                      (item) =>
                        item.id ===
                        invoice.customerId
                    );

                  const balance =
                    invoice.totalAmount -
                    invoice.paidAmount;

                  return (
                    <tr
                      key={invoice.id}
                    >
                      <td>
                        <strong>
                          {
                            invoice.invoiceNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {invoice.invoiceDate}
                      </td>

                      <td>
                        {customer?.name ??
                          invoice.customerId}
                      </td>

                      <td>
                        {invoice.dueDate}
                      </td>

                      <td>
                        {formatCurrency(
                          invoice.totalAmount
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          invoice.paidAmount
                        )}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            balance
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status ${statusClass(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/finance/invoices/${invoice.id}`}
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

        {filteredInvoices.length ===
          0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#6b7280",
            }}
          >
            No invoices found.
          </div>
        )}
      </div>
    </div>
  );
}
