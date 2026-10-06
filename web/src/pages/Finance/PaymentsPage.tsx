import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { payments } from "../../data/payments";
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

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [methodFilter, setMethodFilter] =
    useState("All");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const invoice = invoices.find(
        (item) => item.id === payment.invoiceId
      );

      const customer = customers.find(
        (item) => item.id === payment.customerId
      );

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        payment.paymentNumber
          .toLowerCase()
          .includes(searchText) ||
        payment.referenceNumber
          .toLowerCase()
          .includes(searchText) ||
        (invoice?.invoiceNumber
          .toLowerCase()
          .includes(searchText) ??
          false) ||
        (customer?.name
          .toLowerCase()
          .includes(searchText) ??
          false);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" ||
        payment.paymentMethod ===
          methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    search,
    statusFilter,
    methodFilter,
  ]);

  const totalPayments = payments.length;

  const completedPayments =
    payments.filter(
      (payment) =>
        payment.status === "Completed"
    ).length;

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status === "Pending"
    ).length;

  const failedPayments =
    payments.filter(
      (payment) =>
        payment.status === "Failed"
    ).length;

  const completedAmount =
    payments
      .filter(
        (payment) =>
          payment.status === "Completed"
      )
      .reduce(
        (sum, payment) =>
          sum + payment.amount,
        0
      );

  const pendingAmount =
    payments
      .filter(
        (payment) =>
          payment.status === "Pending"
      )
      .reduce(
        (sum, payment) =>
          sum + payment.amount,
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
          <h1>Payments</h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Manage customer payments and
            payment transactions.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Record Payment - demo only"
            )
          }
        >
          + Record Payment
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
          <p>Total Payments</p>
          <h2>{totalPayments}</h2>
        </div>

        <div className="card">
          <p>Completed</p>
          <h2>{completedPayments}</h2>
        </div>

        <div className="card">
          <p>Pending</p>
          <h2>{pendingPayments}</h2>
        </div>

        <div className="card">
          <p>Failed</p>
          <h2>{failedPayments}</h2>
        </div>

        <div className="card">
          <p>Completed Amount</p>
          <h2>
            {formatCurrency(
              completedAmount
            )}
          </h2>
        </div>
      </div>

      {/* Amount Summary */}
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
              "1fr 1fr",
            gap: 24,
          }}
        >
          <div>
            <p>Completed Payments</p>

            <h2>
              {formatCurrency(
                completedAmount
              )}
            </h2>
          </div>

          <div>
            <p>Pending Payments</p>

            <h2>
              {formatCurrency(
                pendingAmount
              )}
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
              "2fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label>Search</label>

            <input
              type="text"
              placeholder="Search payment, invoice, customer..."
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

              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Failed">
                Failed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label>Payment Method</label>

            <select
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(
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
                All Methods
              </option>

              <option value="Bank Transfer">
                Bank Transfer
              </option>

              <option value="Cash">
                Cash
              </option>

              <option value="Credit Card">
                Credit Card
              </option>

              <option value="PromptPay">
                PromptPay
              </option>

              <option value="Cheque">
                Cheque
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="card">
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <h2>Payment Transactions</h2>

          <p>
            {filteredPayments.length} payments
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
                <th>Payment</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Invoice</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map(
                (payment) => {
                  const invoice =
                    invoices.find(
                      (item) =>
                        item.id ===
                        payment.invoiceId
                    );

                  const customer =
                    customers.find(
                      (item) =>
                        item.id ===
                        payment.customerId
                    );

                  return (
                    <tr
                      key={payment.id}
                    >
                      <td>
                        <strong>
                          {
                            payment.paymentNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {payment.paymentDate}
                      </td>

                      <td>
                        {customer?.name ??
                          payment.customerId}
                      </td>

                      <td>
                        {invoice ? (
                          <Link
                            to={`/finance/invoices/${invoice.id}`}
                          >
                            {
                              invoice.invoiceNumber
                            }
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {payment.paymentMethod}
                      </td>

                      <td>
                        {payment.referenceNumber}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            payment.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status ${statusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/finance/payments/${payment.id}`}
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

        {filteredPayments.length ===
          0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#6b7280",
            }}
          >
            No payments found.
          </div>
        )}
      </div>
    </div>
  );
}
