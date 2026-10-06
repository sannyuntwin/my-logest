import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function PaymentDetailsPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const payment = payments.find(
    (item) => item.id === paymentId
  );

  const relatedPayments = useMemo(() => {
    if (!payment) {
      return [];
    }

    return payments.filter(
      (item) =>
        item.invoiceId === payment.invoiceId
    );
  }, [payment]);

  if (!payment) {
    return (
      <div>
        <h1>Payment Details</h1>

        <div className="card">
          <h2>Payment not found</h2>

          <p style={{ color: "#6b7280" }}>
            The requested payment could not be found.
          </p>

          <Link to="/finance/payments">
            <button>Back to Payments</button>
          </Link>
        </div>
      </div>
    );
  }

  const invoice = invoices.find(
    (item) => item.id === payment.invoiceId
  );

  const customer = customers.find(
    (item) => item.id === payment.customerId
  );

  const invoiceBalance = invoice
    ? invoice.totalAmount - invoice.paidAmount
    : 0;

  const completedPayments = relatedPayments
    .filter(
      (item) => item.status === "Completed"
    )
    .reduce(
      (sum, item) => sum + item.amount,
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
          <button
            onClick={() => navigate(-1)}
            style={{ marginBottom: 12 }}
          >
            ← Back
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <h1 style={{ margin: 0 }}>
              {payment.paymentNumber}
            </h1>

            <span
              className={`status ${statusClass(
                payment.status
              )}`}
            >
              {payment.status}
            </span>
          </div>

          <p style={{ color: "#6b7280" }}>
            Payment transaction details
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          {invoice && (
            <Link
              to={`/finance/invoices/${invoice.id}`}
            >
              <button>View Invoice</button>
            </Link>
          )}

          <button
            onClick={() =>
              alert("Print Receipt - demo only")
            }
          >
            Print Receipt
          </button>

          <button
            onClick={() =>
              alert("Edit Payment - demo only")
            }
          >
            Edit Payment
          </button>
        </div>
      </div>

      {/* Payment KPI */}
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
          <p>Payment Amount</p>

          <h2>
            {formatCurrency(payment.amount)}
          </h2>
        </div>

        <div className="card">
          <p>Payment Method</p>

          <h2>
            {payment.paymentMethod}
          </h2>
        </div>

        <div className="card">
          <p>Payment Date</p>

          <h2>{payment.paymentDate}</h2>
        </div>

        <div className="card">
          <p>Invoice Balance</p>

          <h2>
            {formatCurrency(invoiceBalance)}
          </h2>
        </div>
      </div>

      {/* Payment Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Transaction */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Payment Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <p>Payment Number</p>

              <strong>
                {payment.paymentNumber}
              </strong>
            </div>

            <div>
              <p>Payment Date</p>

              <strong>
                {payment.paymentDate}
              </strong>
            </div>

            <div>
              <p>Payment Method</p>

              <strong>
                {payment.paymentMethod}
              </strong>
            </div>

            <div>
              <p>Status</p>

              <span
                className={`status ${statusClass(
                  payment.status
                )}`}
              >
                {payment.status}
              </span>
            </div>

            <div>
              <p>Reference Number</p>

              <strong>
                {payment.referenceNumber}
              </strong>
            </div>

            <div>
              <p>Amount</p>

              <strong>
                {formatCurrency(
                  payment.amount
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Customer
          </h2>

          {customer ? (
            <>
              <p>Customer</p>

              <Link
                to={`/customers/${customer.id}`}
              >
                <strong>
                  {customer.name}
                </strong>
              </Link>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <div>
                  <p>Customer Code</p>

                  <strong>
                    {customer.customerCode}
                  </strong>
                </div>

                <div>
                  <p>Contact Person</p>

                  <strong>
                    {customer.contactPerson}
                  </strong>
                </div>

                <div>
                  <p>Phone</p>

                  <strong>
                    {customer.phone}
                  </strong>
                </div>

                <div>
                  <p>Email</p>

                  <strong>
                    {customer.email}
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <p>Customer not found.</p>
          )}
        </div>
      </div>

      {/* Invoice Relationship */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Related Invoice
        </h2>

        {invoice ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Invoice Number</p>

              <Link
                to={`/finance/invoices/${invoice.id}`}
              >
                <strong>
                  {invoice.invoiceNumber}
                </strong>
              </Link>
            </div>

            <div>
              <p>Invoice Total</p>

              <strong>
                {formatCurrency(
                  invoice.totalAmount
                )}
              </strong>
            </div>

            <div>
              <p>Invoice Paid</p>

              <strong>
                {formatCurrency(
                  invoice.paidAmount
                )}
              </strong>
            </div>

            <div>
              <p>Outstanding</p>

              <strong>
                {formatCurrency(
                  invoiceBalance
                )}
              </strong>
            </div>
          </div>
        ) : (
          <p>No invoice linked.</p>
        )}
      </div>

      {/* Payment History */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ marginBottom: 8 }}>
          Invoice Payment History
        </h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: 20,
          }}
        >
          All payment transactions associated
          with this invoice.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <p>Total Transactions</p>
            <h2>
              {relatedPayments.length}
            </h2>
          </div>

          <div>
            <p>Completed Payments</p>
            <h2>
              {formatCurrency(
                completedPayments
              )}
            </h2>
          </div>

          <div>
            <p>Invoice Total</p>
            <h2>
              {invoice
                ? formatCurrency(
                    invoice.totalAmount
                  )
                : "-"}
            </h2>
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
                <th>Payment</th>
                <th>Date</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {relatedPayments.map(
                (item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {
                          item.paymentNumber
                        }
                      </strong>
                    </td>

                    <td>
                      {item.paymentDate}
                    </td>

                    <td>
                      {item.paymentMethod}
                    </td>

                    <td>
                      {item.referenceNumber}
                    </td>

                    <td>
                      {formatCurrency(
                        item.amount
                      )}
                    </td>

                    <td>
                      <span
                        className={`status ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>
          Notes
        </h2>

        <p
          style={{
            color: payment.notes
              ? "#111827"
              : "#9ca3af",
          }}
        >
          {payment.notes ||
            "No notes for this payment."}
        </p>
      </div>
    </div>
  );
}
