import { Link, useParams } from "react-router-dom";

import { roles } from "../../data/roles";
import { permissions } from "../../data/permissions";
import { users } from "../../data/users";

const rolePermissionMap: Record<string, string[]> = {
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

function statusClass(status: string) {
  return `status ${status.toLowerCase()}`;
}

export default function RoleDetailsPage() {
  const { roleId } = useParams();

  const role = roles.find(
    (item) => item.id === roleId
  );

  if (!role) {
    return (
      <div>
        <h1>Role Not Found</h1>

        <p style={{ color: "#6b7280" }}>
          The requested role does not exist.
        </p>

        <Link to="/administration/roles">
          ← Back to Roles
        </Link>
      </div>
    );
  }

  const roleUsers = users.filter(
    (user) => user.roleId === role.id
  );

  const rolePermissionCodes =
    rolePermissionMap[role.id] ?? [];

  const rolePermissions = permissions.filter(
    (permission) =>
      rolePermissionCodes.includes(
        permission.code
      )
  );

  const permissionsByModule =
    rolePermissions.reduce(
      (groups, permission) => {
        if (!groups[permission.module]) {
          groups[permission.module] = [];
        }

        groups[permission.module].push(
          permission
        );

        return groups;
      },
      {} as Record<
        string,
        typeof permissions
      >
    );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/administration/roles">
          ← Back to Roles & Permissions
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
              {role.name}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              {role.code}
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
                role.status
              )}
            >
              {role.status}
            </span>

            <button
              onClick={() =>
                alert("Edit Role - demo only")
              }
            >
              Edit Role
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
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
          <p>Role</p>
          <h2>{role.code}</h2>
        </div>

        <div className="card">
          <p>Assigned Users</p>
          <h2>{roleUsers.length}</h2>
        </div>

        <div className="card">
          <p>Permissions</p>
          <h2>{rolePermissions.length}</h2>
        </div>

        <div className="card">
          <p>Modules</p>
          <h2>
            {Object.keys(
              permissionsByModule
            ).length}
          </h2>
        </div>
      </div>

      {/* Description */}
      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <h2>Role Information</h2>

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
            <p>Role Name</p>
            <strong>{role.name}</strong>
          </div>

          <div>
            <p>Role Code</p>
            <strong>{role.code}</strong>
          </div>

          <div>
            <p>Status</p>
            <span
              className={statusClass(
                role.status
              )}
            >
              {role.status}
            </span>
          </div>

          <div>
            <p>Description</p>
            <strong>
              {role.description}
            </strong>
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
          Permissions assigned to this role,
          grouped by module.
        </p>

        <div style={{ marginTop: 20 }}>
          {Object.entries(
            permissionsByModule
          ).map(
            ([moduleName, modulePermissions]) => (
              <div
                key={moduleName}
                style={{
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3>{moduleName}</h3>

                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                    }}
                  >
                    {
                      modulePermissions.length
                    }{" "}
                    permission
                    {modulePermissions.length !==
                    1
                      ? "s"
                      : ""}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {modulePermissions.map(
                    (permission) => (
                      <div
                        key={permission.id}
                        style={{
                          border:
                            "1px solid #e5e7eb",
                          borderRadius: 8,
                          padding: 12,
                        }}
                      >
                        <strong>
                          {permission.code}
                        </strong>

                        <p
                          style={{
                            fontSize: 12,
                            color:
                              "#6b7280",
                            marginTop: 6,
                          }}
                        >
                          {
                            permission.description
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {rolePermissions.length === 0 && (
          <p
            style={{
              color: "#6b7280",
              marginTop: 20,
            }}
          >
            No permissions assigned to this
            role.
          </p>
        )}
      </div>

      {/* Assigned Users */}
      <div className="card">
        <h2>Assigned Users</h2>

        <p
          style={{
            color: "#6b7280",
            marginTop: 6,
          }}
        >
          Users currently assigned to this role.
        </p>

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
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {roleUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.username}
                    </strong>
                  </td>

                  <td>{user.fullName}</td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={statusClass(
                        user.status
                      )}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/administration/users/${user.id}`}
                    >
                      View User
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {roleUsers.length === 0 && (
          <p
            style={{
              color: "#6b7280",
              marginTop: 20,
            }}
          >
            No users are currently assigned
            to this role.
          </p>
        )}
      </div>
    </div>
  );
}