import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { invoices } from "../../data/invoices";
import { customers } from "../../data/customers";
import { customerOrders } from "../../data/customerOrders";
import { generateTrips } from "../../data/generateTrips";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const invoice = invoices.find(
    (item) => item.id === invoiceId
  );

  const trips = useMemo(() => generateTrips(500), []);

  if (!invoice) {
    return (
      <div>
        <h1>Invoice Details</h1>

        <div className="card">
          <h2>Invoice not found</h2>

          <p style={{ color: "#6b7280" }}>
            The requested invoice could not be found.
          </p>

          <Link to="/finance/invoices">
            <button>Back to Invoices</button>
          </Link>
        </div>
      </div>
    );
  }

  const customer = customers.find(
    (item) => item.id === invoice.customerId
  );

  const order = customerOrders.find(
    (item) => item.id === invoice.orderId
  );

  const trip = trips.find(
    (item) => item.id === invoice.tripId
  );

  const outstanding =
    invoice.totalAmount - invoice.paidAmount;

  const paymentPercentage =
    invoice.totalAmount > 0
      ? Math.min(
          (invoice.paidAmount /
            invoice.totalAmount) *
            100,
          100
        )
      : 0;

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
              {invoice.invoiceNumber}
            </h1>

            <span
              className={`status ${statusClass(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>

          <p style={{ color: "#6b7280" }}>
            Invoice details and payment information
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() =>
              alert("Print Invoice - demo only")
            }
          >
            Print
          </button>

          <button
            onClick={() =>
              alert("Download PDF - demo only")
            }
          >
            Download PDF
          </button>

          <button
            onClick={() =>
              alert("Edit Invoice - demo only")
            }
          >
            Edit Invoice
          </button>
        </div>
      </div>

      {/* Financial Summary */}
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
          <p>Subtotal</p>
          <h2>
            {formatCurrency(invoice.subtotal)}
          </h2>
        </div>

        <div className="card">
          <p>VAT ({invoice.taxRate}%)</p>
          <h2>
            {formatCurrency(invoice.taxAmount)}
          </h2>
        </div>

        <div className="card">
          <p>Total Amount</p>
          <h2>
            {formatCurrency(invoice.totalAmount)}
          </h2>
        </div>

        <div className="card">
          <p>Outstanding</p>
          <h2>
            {formatCurrency(outstanding)}
          </h2>
        </div>
      </div>

      {/* Invoice + Customer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Invoice Information */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Invoice Information
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
              <p>Invoice Number</p>
              <strong>
                {invoice.invoiceNumber}
              </strong>
            </div>

            <div>
              <p>Invoice Date</p>
              <strong>
                {invoice.invoiceDate}
              </strong>
            </div>

            <div>
              <p>Due Date</p>
              <strong>
                {invoice.dueDate}
              </strong>
            </div>

            <div>
              <p>Status</p>
              <span
                className={`status ${statusClass(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <p>Description</p>
            <strong>
              {invoice.description}
            </strong>
          </div>
        </div>

        {/* Customer Information */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Customer
          </h2>

          {customer ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <p>Customer</p>

                <Link
                  to={`/customers/${customer.id}`}
                >
                  <strong>
                    {customer.name}
                  </strong>
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 20,
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

              <div style={{ marginTop: 20 }}>
                <p>Address</p>
                <strong>
                  {customer.address}
                </strong>
              </div>
            </>
          ) : (
            <p>Customer not found.</p>
          )}
        </div>
      </div>

      {/* Billing Breakdown */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Billing Breakdown
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                }}
              >
                Description
              </th>

              <th
                style={{
                  textAlign: "right",
                  padding: 12,
                }}
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: 12 }}>
                Transportation Service
              </td>

              <td
                style={{
                  padding: 12,
                  textAlign: "right",
                }}
              >
                {formatCurrency(
                  invoice.subtotal
                )}
              </td>
            </tr>

            <tr>
              <td style={{ padding: 12 }}>
                VAT {invoice.taxRate}%
              </td>

              <td
                style={{
                  padding: 12,
                  textAlign: "right",
                }}
              >
                {formatCurrency(
                  invoice.taxAmount
                )}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: 12,
                  fontWeight: 700,
                }}
              >
                Total
              </td>

              <td
                style={{
                  padding: 12,
                  textAlign: "right",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {formatCurrency(
                  invoice.totalAmount
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment */}
      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Payment Summary</h2>

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          <div>
            <p>Invoice Total</p>
            <h2>
              {formatCurrency(
                invoice.totalAmount
              )}
            </h2>
          </div>

          <div>
            <p>Paid Amount</p>
            <h2>
              {formatCurrency(
                invoice.paidAmount
              )}
            </h2>
          </div>

          <div>
            <p>Outstanding</p>
            <h2>
              {formatCurrency(outstanding)}
            </h2>
          </div>
        </div>

        {/* Payment Progress */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 8,
            }}
          >
            <span>Payment Progress</span>

            <strong>
              {paymentPercentage.toFixed(0)}%
            </strong>
          </div>

          <div
            style={{
              height: 10,
              background: "#e5e7eb",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${paymentPercentage}%`,
                height: "100%",
                background: "#16a34a",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      </div>

      {/* Related Records */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Customer Order */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Customer Order
          </h2>

          {order ? (
            <>
              <p>Order Number</p>

              <Link
                to={`/customers/orders/${order.id}`}
              >
                <strong>
                  {order.orderNumber}
                </strong>
              </Link>

              <p style={{ marginTop: 16 }}>
                Order Date
              </p>

              <strong>
                {order.orderDate}
              </strong>

              <p style={{ marginTop: 16 }}>
                Route
              </p>

              <strong>
                {order.pickupLocation}
                {" → "}
                {order.deliveryLocation}
              </strong>

              <p style={{ marginTop: 16 }}>
                Order Status
              </p>

              <span
                className={`status ${statusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </>
          ) : (
            <p>No customer order linked.</p>
          )}
        </div>

        {/* Trip */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>
            Transportation Trip
          </h2>

          {trip ? (
            <>
              <p>Trip Number</p>

              <Link
                to={`/operations/trips/${trip.id}`}
              >
                <strong>
                  {trip.tripNumber}
                </strong>
              </Link>

              <p style={{ marginTop: 16 }}>
                Route
              </p>

              <strong>
                {trip.origin}
                {" → "}
                {trip.destination}
              </strong>

              <p style={{ marginTop: 16 }}>
                Distance
              </p>

              <strong>
                {trip.distanceKm} km
              </strong>

              <p style={{ marginTop: 16 }}>
                Trip Status
              </p>

              <span
                className={`status ${statusClass(
                  trip.status
                )}`}
              >
                {trip.status}
              </span>
            </>
          ) : (
            <p>
              No transportation trip linked.
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>
          Notes
        </h2>

        <p
          style={{
            color: invoice.notes
              ? "#111827"
              : "#9ca3af",
          }}
        >
          {invoice.notes ||
            "No notes for this invoice."}
        </p>
      </div>
    </div>
  );
}