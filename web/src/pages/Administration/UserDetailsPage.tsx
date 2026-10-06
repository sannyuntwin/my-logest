import { Link, useParams } from "react-router-dom";

import { users } from "../../data/users";
import { roles } from "../../data/roles";
import { permissions } from "../../data/permissions";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";
import { auditLogs } from "../../data/auditLogs";

function statusClass(status: string) {
  return `status ${status.toLowerCase()}`;
}

export default function UserDetailsPage() {
  const { userId } = useParams();

  const user = users.find(
    (item) => item.id === userId
  );

  if (!user) {
    return (
      <div>
        <h1>User Not Found</h1>

        <p style={{ color: "#6b7280" }}>
          The requested user does not exist.
        </p>

        <Link to="/administration/users">
          ← Back to Users
        </Link>
      </div>
    );
  }

  const role = roles.find(
    (item) => item.id === user.roleId
  );

  const branch = branches.find(
    (item) => item.id === user.branchId
  );

  const employee = employees.find(
    (item) => item.id === user.employeeId
  );

  const userAuditLogs = auditLogs.filter(
    (log) => log.userId === user.id
  );

  /*
   * Demo permission mapping.
   *
   * In the production version this relationship
   * will come from the database:
   *
   * User → Role → Role Permissions → Permissions
   */
  const rolePermissionMap: Record<
    string,
    string[]
  > = {
    "ROLE-001": permissions.map(
      (permission) => permission.code
    ),

    "ROLE-002": [
      "dashboard.view",
      "trips.view",
      "trips.create",
      "trips.edit",
      "work_orders.view",
      "work_orders.create",
      "work_orders.edit",
      "work_orders.assign",
      "routes.view",
      "routes.create",
      "routes.edit",
      "dispatch.view",
      "dispatch.assign",
      "vehicles.view",
      "maintenance.view",
      "fuel.view",
      "drivers.view",
      "employees.view",
      "customers.view",
      "customers.create",
      "customers.edit",
      "customer_orders.view",
      "customer_orders.create",
      "customer_orders.edit",
      "revenue.view",
      "costs.view",
      "costs.approve",
      "invoices.view",
      "invoices.approve",
      "payments.view",
      "profitability.view",
      "profitability.export",
      "reports.view",
      "reports.export",
    ],

    "ROLE-003": [
      "dashboard.view",
      "trips.view",
      "trips.create",
      "trips.edit",
      "work_orders.view",
      "work_orders.create",
      "work_orders.edit",
      "work_orders.assign",
      "routes.view",
      "routes.create",
      "routes.edit",
      "dispatch.view",
      "dispatch.assign",
      "vehicles.view",
      "drivers.view",
      "employees.view",
      "customers.view",
      "customer_orders.view",
      "customer_orders.create",
      "customer_orders.edit",
    ],

    "ROLE-004": [
      "dashboard.view",
      "trips.view",
      "trips.execute",
      "routes.view",
      "drivers.view",
      "customers.view",
    ],

    "ROLE-005": [
      "dashboard.view",
      "revenue.view",
      "revenue.create",
      "revenue.edit",
      "costs.view",
      "costs.create",
      "costs.edit",
      "costs.approve",
      "invoices.view",
      "invoices.create",
      "invoices.edit",
      "invoices.approve",
      "payments.view",
      "payments.create",
      "payments.edit",
      "profitability.view",
      "profitability.export",
      "reports.view",
      "reports.export",
    ],

    "ROLE-006": [
      "dashboard.view",
      "vehicles.view",
      "vehicles.create",
      "vehicles.edit",
      "vehicles.delete",
      "vehicle_types.view",
      "vehicle_types.create",
      "vehicle_types.edit",
      "maintenance.view",
      "maintenance.create",
      "maintenance.edit",
      "fuel.view",
      "fuel.create",
      "drivers.view",
      "employees.view",
      "reports.view",
      "reports.export",
    ],

    "ROLE-007": [
      "dashboard.view",
      "trips.view",
      "vehicles.view",
      "drivers.view",
      "customers.view",
      "revenue.view",
      "costs.view",
      "invoices.view",
      "payments.view",
      "profitability.view",
      "reports.view",
      "reports.export",
    ],
  };

  const userPermissionCodes =
    rolePermissionMap[user.roleId] ?? [];

  const userPermissions = permissions.filter(
    (permission) =>
      userPermissionCodes.includes(
        permission.code
      )
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/administration/users">
          ← Back to Users
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <div>
            <h1 style={{ marginBottom: 6 }}>
              {user.fullName}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              @{user.username}
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
              className={statusClass(
                user.status
              )}
            >
              {user.status}
            </span>

            <button
              onClick={() =>
                alert("Edit User - demo only")
              }
            >
              Edit User
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
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
          <p>Username</p>
          <h2>{user.username}</h2>
        </div>

        <div className="card">
          <p>Role</p>
          <h2>
            {role?.name ?? "Unknown"}
          </h2>
        </div>

        <div className="card">
          <p>Branch</p>
          <h2>
            {branch?.name ?? "All Branches"}
          </h2>
        </div>

        <div className="card">
          <p>Audit Events</p>
          <h2>
            {userAuditLogs.length}
          </h2>
        </div>
      </div>

      {/* Account Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.2fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="card">
          <h2>Account Information</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 16,
              marginTop: 20,
            }}
          >
            <div>
              <p>Username</p>
              <strong>{user.username}</strong>
            </div>

            <div>
              <p>Email</p>
              <strong>{user.email}</strong>
            </div>

            <div>
              <p>Status</p>
              <span
                className={statusClass(
                  user.status
                )}
              >
                {user.status}
              </span>
            </div>

            <div>
              <p>Created At</p>
              <strong>{user.createdAt}</strong>
            </div>

            <div>
              <p>Last Login</p>
              <strong>
                {user.lastLogin ?? "Never"}
              </strong>
            </div>

            <div>
              <p>User ID</p>
              <strong>{user.id}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Employee Assignment</h2>

          <div style={{ marginTop: 20 }}>
            <p>Employee</p>

            {employee ? (
              <>
                <h3>{employee.name}</h3>

                <p>
                  {employee.employeeCode}
                </p>

                <p>
                  Role: {employee.role}
                </p>

                <p>
                  Phone: {employee.phone}
                </p>

                <Link
                  to={`/employees/${employee.id}`}
                >
                  View Employee
                </Link>
              </>
            ) : (
              <p>
                This user is not linked to an
                employee.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Role & Branch */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="card">
          <h2>Role</h2>

          <div style={{ marginTop: 16 }}>
            <h3>
              {role?.name ?? "Unknown"}
            </h3>

            <p>
              {role?.description ??
                "No role description."}
            </p>

            <p>
              <strong>Code:</strong>{" "}
              {role?.code ?? "—"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {role?.status ?? "—"}
            </p>

            <Link to="/administration/roles">
              Manage Roles & Permissions
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>Branch</h2>

          <div style={{ marginTop: 16 }}>
            {branch ? (
              <>
                <h3>{branch.name}</h3>

                <p>
                  {branch.branchCode}
                </p>

                <p>
                  {branch.address}
                </p>

                <p>
                  {branch.city},{" "}
                  {branch.province}
                </p>

                <p>
                  Phone: {branch.phone}
                </p>
              </>
            ) : (
              <p>
                This user has access across
                branches.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <h2>Permissions</h2>

        <p
          style={{
            color: "#6b7280",
            marginTop: 6,
          }}
        >
          Permissions inherited from the user's
          role.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginTop: 20,
          }}
        >
          {userPermissions.map(
            (permission) => (
              <div
                key={permission.id}
                style={{
                  padding: 14,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              >
                <strong>
                  {permission.code}
                </strong>

                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                  }}
                >
                  {permission.description}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="card">
        <h2>Recent Activity</h2>

        <div
          style={{
            overflowX: "auto",
            marginTop: 16,
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
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>

            <tbody>
              {userAuditLogs.map(
                (log) => (
                  <tr key={log.id}>
                    <td>
                      {log.timestamp}
                    </td>

                    <td>
                      <strong>
                        {log.action}
                      </strong>
                    </td>

                    <td>
                      {log.entity}
                    </td>

                    <td>
                      {log.entityId ?? "—"}
                    </td>

                    <td>
                      {log.description}
                    </td>

                    <td>
                      {log.ipAddress}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {userAuditLogs.length === 0 && (
          <p
            style={{
              color: "#6b7280",
              marginTop: 20,
            }}
          >
            No activity recorded for this
            user.
          </p>
        )}
      </div>
    </div>
  );
}