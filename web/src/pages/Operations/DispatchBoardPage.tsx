import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { workOrders } from "../../data/workOrders";
import { customers } from "../../data/customers";
import { vehicles } from "../../data/vehicles";
import { employees } from "../../data/employees";
import { routePlans } from "../../data/routes";

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "status completed";
    case "In Progress":
      return "status in-progress";
    case "Assigned":
      return "status ready";
    case "Pending":
      return "status pending";
    case "Cancelled":
      return "status cancelled";
    default:
      return "status planned";
  }
}

function priorityClass(priority: string) {
  switch (priority) {
    case "Urgent":
      return "priority urgent";
    case "High":
      return "priority high";
    case "Normal":
      return "priority normal";
    default:
      return "priority low";
  }
}

export default function DispatchBoardPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const dispatchJobs = useMemo(() => {
    return workOrders.filter((workOrder) => {
      const customer = customers.find(
        (item) => item.id === workOrder.customerId
      );

      const vehicle = vehicles.find(
        (item) => item.id === workOrder.vehicleId
      );

      const driver = employees.find(
        (item) => item.id === workOrder.driverId
      );

      const route = routePlans.find(
        (item) => item.workOrderId === workOrder.id
      );

      const searchText = `
        ${workOrder.workOrderNumber}
        ${customer?.name ?? ""}
        ${workOrder.pickupLocation}
        ${workOrder.deliveryLocation}
        ${vehicle?.plateNumber ?? ""}
        ${driver?.name ?? ""}
        ${route?.routeNumber ?? ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        workOrder.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        workOrder.priority === priorityFilter;

      const matchesDate =
        !dateFilter ||
        workOrder.requestedDate === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDate
      );
    });
  }, [search, statusFilter, priorityFilter, dateFilter]);

  const totalJobs = dispatchJobs.length;

  const unassignedJobs = dispatchJobs.filter(
    (item) => !item.vehicleId || !item.driverId
  ).length;

  const assignedJobs = dispatchJobs.filter(
    (item) =>
      item.vehicleId &&
      item.driverId &&
      item.status === "Assigned"
  ).length;

  const inProgressJobs = dispatchJobs.filter(
    (item) => item.status === "In Progress"
  ).length;

  const completedJobs = dispatchJobs.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div className="page">
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
          <h1 style={{ margin: 0 }}>Dispatch Board</h1>

          <p
            style={{
              marginTop: 8,
              color: "#6b7280",
            }}
          >
            Assign and monitor transportation jobs.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Dispatch Job - demo only")
          }
        >
          + Create Dispatch Job
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card">
          <p>Total Jobs</p>
          <h2>{totalJobs}</h2>
        </div>

        <div className="card">
          <p>Unassigned</p>
          <h2>{unassignedJobs}</h2>
        </div>

        <div className="card">
          <p>Assigned</p>
          <h2>{assignedJobs}</h2>
        </div>

        <div className="card">
          <p>In Progress</p>
          <h2>{inProgressJobs}</h2>
        </div>

        <div className="card">
          <p>Completed</p>
          <h2>{completedJobs}</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search work order, customer, route..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            minWidth: 280,
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(event) =>
            setDateFilter(event.target.value)
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        />

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setPriorityFilter("All");
            setDateFilter("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Dispatch Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Dispatch Jobs</h2>

            <p
              style={{
                marginTop: 6,
                color: "#6b7280",
              }}
            >
              {dispatchJobs.length} jobs displayed
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1100,
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={{ padding: "12px 8px" }}>
                  Work Order
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Customer
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Route
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Vehicle
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Driver
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Priority
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Status
                </th>

                <th style={{ padding: "12px 8px" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {dispatchJobs.map((workOrder) => {
                const customer = customers.find(
                  (item) =>
                    item.id === workOrder.customerId
                );

                const vehicle = vehicles.find(
                  (item) =>
                    item.id === workOrder.vehicleId
                );

                const driver = employees.find(
                  (item) =>
                    item.id === workOrder.driverId
                );

                const route = routePlans.find(
                  (item) =>
                    item.workOrderId === workOrder.id
                );

                return (
                  <tr
                    key={workOrder.id}
                    style={{
                      borderBottom:
                        "1px solid #f1f5f9",
                    }}
                  >
                    <td style={{ padding: "14px 8px" }}>
                      <Link
                        to={`/operations/work-orders/${workOrder.id}`}
                      >
                        <strong>
                          {workOrder.workOrderNumber}
                        </strong>
                      </Link>

                      <div
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          marginTop: 4,
                        }}
                      >
                        {workOrder.requestedDate}
                      </div>
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      {customer?.name ?? "Unknown"}
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      {route ? (
                        <Link
                          to={`/operations/routes/${route.id}`}
                        >
                          {route.routeNumber}
                        </Link>
                      ) : (
                        <span>Not planned</span>
                      )}

                      <div
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          marginTop: 4,
                        }}
                      >
                        {workOrder.pickupLocation}
                        {" → "}
                        {workOrder.deliveryLocation}
                      </div>
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      {vehicle ? (
                        <Link
                          to={`/fleet/vehicles/${vehicle.id}`}
                        >
                          {vehicle.plateNumber}
                        </Link>
                      ) : (
                        <span
                          style={{
                            color: "#dc2626",
                            fontWeight: 600,
                          }}
                        >
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      {driver ? (
                        <Link
                          to={`/drivers/${driver.id}`}
                        >
                          {driver.name}
                        </Link>
                      ) : (
                        <span
                          style={{
                            color: "#dc2626",
                            fontWeight: 600,
                          }}
                        >
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      <span
                        className={priorityClass(
                          workOrder.priority
                        )}
                      >
                        {workOrder.priority}
                      </span>
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      <span
                        className={statusClass(
                          workOrder.status
                        )}
                      >
                        {workOrder.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <Link
                          to={`/operations/work-orders/${workOrder.id}`}
                        >
                          <button>View</button>
                        </Link>

                        {(!workOrder.vehicleId ||
                          !workOrder.driverId) && (
                          <Link
                            to={`/operations/dispatch/${workOrder.id}/assign`}
                            >
                            <button>Assign</button>
                            </Link>
                                                    )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {dispatchJobs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No dispatch jobs found.
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