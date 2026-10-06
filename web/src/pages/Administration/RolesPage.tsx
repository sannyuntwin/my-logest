import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        role.name.toLowerCase().includes(searchText) ||
        role.code.toLowerCase().includes(searchText) ||
        role.description
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        role.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalRoles = roles.length;

  const activeRoles = roles.filter(
    (role) => role.status === "Active"
  ).length;

  const inactiveRoles = roles.filter(
    (role) => role.status === "Inactive"
  ).length;

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
          <h1 style={{ marginBottom: 6 }}>
            Roles & Permissions
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            Manage user roles and access permissions.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Role - demo only")
          }
        >
          + Create Role
        </button>
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
          <p>Total Roles</p>
          <h2>{totalRoles}</h2>
        </div>

        <div className="card">
          <p>Active Roles</p>
          <h2>{activeRoles}</h2>
        </div>

        <div className="card">
          <p>Inactive Roles</p>
          <h2>{inactiveRoles}</h2>
        </div>

        <div className="card">
          <p>Total Permissions</p>
          <h2>{permissions.length}</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 12,
        }}
      >
        <input
          placeholder="Search role..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Role Table */}
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <h2>System Roles</h2>

          <p
            style={{
              color: "#6b7280",
              marginTop: 6,
            }}
          >
            {filteredRoles.length} role
            {filteredRoles.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Role</th>
                <th>Description</th>
                <th>Users</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoles.map((role) => {
                const roleUsers = users.filter(
                  (user) => user.roleId === role.id
                );

                const rolePermissions =
                  rolePermissionMap[role.id] ?? [];

                return (
                  <tr key={role.id}>
                    <td>
                      <strong>{role.name}</strong>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          marginTop: 4,
                        }}
                      >
                        {role.code}
                      </div>
                    </td>

                    <td
                      style={{
                        maxWidth: 360,
                      }}
                    >
                      {role.description}
                    </td>

                    <td>
                      {roleUsers.length}
                    </td>

                    <td>
                      {rolePermissions.length}
                    </td>

                    <td>
                      <span
                        className={statusClass(
                          role.status
                        )}
                      >
                        {role.status}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/administration/roles/${role.id}`}
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

        {filteredRoles.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No roles found.
          </div>
        )}
      </div>
    </div>
  );
}