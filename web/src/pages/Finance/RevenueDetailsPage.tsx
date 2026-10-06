import { Link, useParams } from "react-router-dom";

import { revenues } from "../../data/revenues";
import { customers } from "../../data/customers";
import { customerOrders } from "../../data/customerOrders";
import { invoices } from "../../data/invoices";
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

export default function RevenueDetailsPage() {
  const { revenueId } = useParams();

  const revenue = revenues.find(
    (item) => item.id === revenueId
  );

  if (!revenue) {
    return (
      <div className="card">
        <h2>Revenue Not Found</h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          The requested revenue record does not exist.
        </p>

        <Link to="/finance/revenue">
          <button>Back to Revenue</button>
        </Link>
      </div>
    );
  }

  const customer = customers.find(
    (item) => item.id === revenue.customerId
  );

  const order = revenue.orderId
    ? customerOrders.find(
        (item) => item.id === revenue.orderId
      )
    : undefined;

  const invoice = revenue.invoiceId
    ? invoices.find(
        (item) => item.id === revenue.invoiceId
      )
    : undefined;

  const trips = generateTrips(500);

  const trip = revenue.tripId
    ? trips.find(
        (item) => item.id === revenue.tripId
      )
    : undefined;

  const outstanding =
    invoice
      ? invoice.totalAmount -
        invoice.paidAmount
      : revenue.totalAmount;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <Link to="/finance/revenue">
              ← Back to Revenue
            </Link>
          </div>

          <h1>
            {revenue.revenueNumber}
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Revenue transaction details
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span
            className={`status ${statusClass(
              revenue.status
            )}`}
          >
            {revenue.status}
          </span>

          {revenue.invoiceId && (
            <Link
              to={`/finance/invoices/${revenue.invoiceId}`}
            >
              <button>
                View Invoice
              </button>
            </Link>
          )}

          <button
            onClick={() =>
              window.print()
            }
          >
            Print
          </button>

          <button
            onClick={() =>
              alert(
                "Edit Revenue - demo only"
              )
            }
          >
            Edit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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
          <p>Revenue</p>

          <h2>
            {formatCurrency(
              revenue.amount
            )}
          </h2>
        </div>

        <div className="card">
          <p>VAT</p>

          <h2>
            {formatCurrency(
              revenue.taxAmount
            )}
          </h2>
        </div>

        <div className="card">
          <p>Total</p>

          <h2>
            {formatCurrency(
              revenue.totalAmount
            )}
          </h2>
        </div>

        <div className="card">
          <p>Outstanding</p>

          <h2>
            {formatCurrency(
              outstanding
            )}
          </h2>
        </div>
      </div>

      {/* Revenue Information */}
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
          Revenue Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          <div>
            <p>Revenue Number</p>

            <strong>
              {revenue.revenueNumber}
            </strong>
          </div>

          <div>
            <p>Date</p>

            <strong>
              {revenue.date}
            </strong>
          </div>

          <div>
            <p>Status</p>

            <span
              className={`status ${statusClass(
                revenue.status
              )}`}
            >
              {revenue.status}
            </span>
          </div>

          <div>
            <p>Description</p>

            <strong>
              {revenue.description}
            </strong>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Customer</h2>

          {customer && (
            <Link
              to={`/customers/${customer.id}`}
            >
              <button>
                View Customer
              </button>
            </Link>
          )}
        </div>

        {customer ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Customer</p>

              <strong>
                {customer.name}
              </strong>
            </div>

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

            <div>
              <p>Address</p>

              <strong>
                {customer.address}
              </strong>
            </div>
          </div>
        ) : (
          <p>Customer information not found.</p>
        )}
      </div>

      {/* Financial Breakdown */}
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
          Financial Breakdown
        </h2>

        <div
          style={{
            maxWidth: 500,
            marginLeft: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              padding: "12px 0",
            }}
          >
            <span>
              Revenue
            </span>

            <strong>
              {formatCurrency(
                revenue.amount
              )}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              padding: "12px 0",
            }}
          >
            <span>
              {/* VAT ({revenue.taxRate ?? 7}%) */}
              VAT (7%)
            </span>

            <strong>
              {formatCurrency(
                revenue.taxAmount
              )}
            </strong>
          </div>

          <div
            style={{
              borderTop:
                "1px solid #e5e7eb",
              marginTop: 8,
              paddingTop: 16,
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >
            <strong>
              Total
            </strong>

            <strong>
              {formatCurrency(
                revenue.totalAmount
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Related Customer Order */}
      {order && (
        <div
          className="card"
          style={{
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2>
              Customer Order
            </h2>

            <Link
              to={`/customers/orders/${order.id}`}
            >
              <button>
                View Order
              </button>
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Order Number</p>

              <strong>
                {order.orderNumber}
              </strong>
            </div>

            <div>
              <p>Status</p>

              <strong>
                {order.status}
              </strong>
            </div>

            <div>
              <p>Pickup</p>

              <strong>
                {order.pickupLocation}
              </strong>
            </div>

            <div>
              <p>Delivery</p>

              <strong>
                {order.deliveryLocation}
              </strong>
            </div>

            <div>
              <p>Cargo</p>

              <strong>
                {order.cargoDescription}
              </strong>
            </div>

            <div>
              <p>Weight</p>

              <strong>
                {order.weightKg.toLocaleString()} kg
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Related Trip */}
      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Transportation Trip</h2>

          {trip && (
            <Link
              to={`/operations/trips/${trip.id}`}
            >
              <button>
                View Trip
              </button>
            </Link>
          )}
        </div>

        {trip ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Trip</p>

              <strong>
                {trip.tripNumber}
              </strong>
            </div>

            <div>
              <p>Date</p>

              <strong>
                {trip.date}
              </strong>
            </div>

            <div>
              <p>Status</p>

              <strong>
                {trip.status}
              </strong>
            </div>

            <div>
              <p>Origin</p>

              <strong>
                {trip.origin}
              </strong>
            </div>

            <div>
              <p>Destination</p>

              <strong>
                {trip.destination}
              </strong>
            </div>

            <div>
              <p>Distance</p>

              <strong>
                {trip.distanceKm.toLocaleString()} km
              </strong>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 20,
              background: "#f9fafb",
              borderRadius: 8,
              color: "#6b7280",
            }}
          >
            This revenue transaction has
            not been linked to a completed
            transportation trip yet.
          </div>
        )}
      </div>

      {/* Invoice */}
      {invoice && (
        <div
          className="card"
          style={{
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2>
              Invoice
            </h2>

            <Link
              to={`/finance/invoices/${invoice.id}`}
            >
              <button>
                View Invoice
              </button>
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Invoice</p>

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

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <p>Invoice Total</p>

              <h3>
                {formatCurrency(
                  invoice.totalAmount
                )}
              </h3>
            </div>

            <div>
              <p>Paid</p>

              <h3>
                {formatCurrency(
                  invoice.paidAmount
                )}
              </h3>
            </div>

            <div>
              <p>Outstanding</p>

              <h3>
                {formatCurrency(
                  outstanding
                )}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Accounting Flow */}
      <div className="card">
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Revenue Flow
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: 16,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 150,
            }}
          >
            <strong>
              Customer Order
            </strong>

            <p
              style={{
                marginTop: 6,
              }}
            >
              {order?.orderNumber ??
                "Not linked"}
            </p>
          </div>

          <span>→</span>

          <div
            style={{
              padding: 16,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 150,
            }}
          >
            <strong>
              Trip
            </strong>

            <p
              style={{
                marginTop: 6,
              }}
            >
              {trip?.tripNumber ??
                "Not created"}
            </p>
          </div>

          <span>→</span>

          <div
            style={{
              padding: 16,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 150,
            }}
          >
            <strong>
              Revenue
            </strong>

            <p
              style={{
                marginTop: 6,
              }}
            >
              {formatCurrency(
                revenue.totalAmount
              )}
            </p>
          </div>

          <span>→</span>

          <div
            style={{
              padding: 16,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 150,
            }}
          >
            <strong>
              Invoice
            </strong>

            <p
              style={{
                marginTop: 6,
              }}
            >
              {invoice?.invoiceNumber ??
                "Not created"}
            </p>
          </div>

          <span>→</span>

          <div
            style={{
              padding: 16,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 150,
            }}
          >
            <strong>
              Payment
            </strong>

            <p
              style={{
                marginTop: 6,
              }}
            >
              {invoice &&
              invoice.paidAmount > 0
                ? "Received"
                : "Outstanding"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
