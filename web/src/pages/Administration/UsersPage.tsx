import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { users } from "../../data/users";
import { roles } from "../../data/roles";
import { branches } from "../../data/branches";
import { employees } from "../../data/employees";

function getRoleName(roleId: string) {
  return roles.find((role) => role.id === roleId)?.name ?? "Unknown";
}

function getBranchName(branchId: string | null) {
  if (!branchId) {
    return "All Branches";
  }

  return (
    branches.find((branch) => branch.id === branchId)?.name ??
    "Unknown"
  );
}

function getEmployeeName(employeeId: string | null) {
  if (!employeeId) {
    return "—";
  }

  return (
    employees.find((employee) => employee.id === employeeId)?.name ??
    "Unknown"
  );
}

function statusClass(status: string) {
  return `status ${status.toLowerCase()}`;
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.username.toLowerCase().includes(searchText) ||
        user.fullName.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        user.roleId === roleFilter;

      const matchesBranch =
        branchFilter === "All" ||
        user.branchId === branchFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesBranch
      );
    });
  }, [
    search,
    statusFilter,
    roleFilter,
    branchFilter,
  ]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const lockedUsers = users.filter(
    (user) => user.status === "Locked"
  ).length;

  return (
    <div>
      {/* Page Header */}
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
            Users
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            Manage TMS user accounts and access.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create User - demo only")
          }
        >
          + Create User
        </button>
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
          <p>Total Users</p>
          <h2>{totalUsers}</h2>
        </div>

        <div className="card">
          <p>Active Users</p>
          <h2>{activeUsers}</h2>
        </div>

        <div className="card">
          <p>Inactive Users</p>
          <h2>{inactiveUsers}</h2>
        </div>

        <div className="card">
          <p>Locked Users</p>
          <h2>{lockedUsers}</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <input
          placeholder="Search username, name, or email..."
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
          <option value="Locked">Locked</option>
        </select>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
        >
          <option value="All">All Roles</option>

          {roles.map((role) => (
            <option
              key={role.id}
              value={role.id}
            >
              {role.name}
            </option>
          ))}
        </select>

        <select
          value={branchFilter}
          onChange={(event) =>
            setBranchFilter(event.target.value)
          }
        >
          <option value="All">All Branches</option>

          {branches.map((branch) => (
            <option
              key={branch.id}
              value={branch.id}
            >
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* User Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2>User Accounts</h2>

            <p
              style={{
                marginTop: 6,
                color: "#6b7280",
              }}
            >
              {filteredUsers.length} user
              {filteredUsers.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
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
                <th>Username</th>
                <th>User</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.username}
                    </strong>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginTop: 4,
                      }}
                    >
                      {user.email}
                    </div>
                  </td>

                  <td>{user.fullName}</td>

                  <td>
                    {getEmployeeName(
                      user.employeeId
                    )}
                  </td>

                  <td>
                    {getRoleName(user.roleId)}
                  </td>

                  <td>
                    {getBranchName(
                      user.branchId
                    )}
                  </td>

                  <td>
                    {user.lastLogin ?? "Never"}
                  </td>

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
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
