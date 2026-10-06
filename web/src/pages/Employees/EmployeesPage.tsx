import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { employees } from "../../data/employees";
import { branches } from "../../data/branches";

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [branch, setBranch] = useState("all");

  const filteredEmployees = useMemo(() => {
    const searchText = search.toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchText) ||
        employee.employeeCode.toLowerCase().includes(searchText) ||
        employee.phone.toLowerCase().includes(searchText);

      const matchesRole =
        role === "all" || employee.role === role;

      const matchesStatus =
        status === "all" || employee.status === status;

      const matchesBranch =
        branch === "all" || employee.branchId === branch;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesBranch
      );
    });
  }, [search, role, status, branch]);

  const getBranchName = (branchId: string) => {
    return (
      branches.find((item) => item.id === branchId)?.name ??
      "Unknown Branch"
    );
  };

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const drivers = employees.filter(
    (employee) => employee.role === "Driver"
  ).length;

  const dispatchers = employees.filter(
    (employee) => employee.role === "Dispatcher"
  ).length;

  const managers = employees.filter(
    (employee) => employee.role === "Manager"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setBranch("all");
  };

  const getRoleStyle = (employeeRole: string) => {
    switch (employeeRole) {
      case "Driver":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "Dispatcher":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "Manager":
        return {
          background: "#ede9fe",
          color: "#6d28d9",
        };

      case "Admin":
        return {
          background: "#fce7f3",
          color: "#be185d",
        };

      default:
        return {
          background: "#f3f4f6",
          color: "#6b7280",
        };
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Employees
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            Manage employees, roles, branches, and employment status.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Create Employee will be connected later.")
          }
          style={{
            border: "none",
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Employee
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <p>Total</p>
          <h2>{totalEmployees}</h2>
        </div>

        <div className="card">
          <p>Active</p>
          <h2>{activeEmployees}</h2>
        </div>

        <div className="card">
          <p>Inactive</p>
          <h2>{inactiveEmployees}</h2>
        </div>

        <div className="card">
          <p>Drivers</p>
          <h2>{drivers}</h2>
        </div>

        <div className="card">
          <p>Dispatchers</p>
          <h2>{dispatchers}</h2>
        </div>

        <div className="card">
          <p>Managers</p>
          <h2>{managers}</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr auto",
            gap: "12px",
            alignItems: "end",
          }}
        >
          {/* Search */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Search
            </label>

            <input
              type="text"
              placeholder="Name, employee code, phone..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Role
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Roles</option>
              <option value="Driver">Driver</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Branch
            </label>

            <select
              value={branch}
              onChange={(event) =>
                setBranch(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
              }}
            >
              <option value="all">All Branches</option>

              {branches.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={resetFilters}
            style={{
              padding: "10px 14px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Employee List
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {filteredEmployees.length} employee
              {filteredEmployees.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid #e5e7eb",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px" }}>
                  Employee
                </th>

                <th style={{ padding: "12px" }}>
                  Employee Code
                </th>

                <th style={{ padding: "12px" }}>
                  Role
                </th>

                <th style={{ padding: "12px" }}>
                  Branch
                </th>

                <th style={{ padding: "12px" }}>
                  Phone
                </th>

                <th style={{ padding: "12px" }}>
                  Status
                </th>

                <th style={{ padding: "12px" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => {
                const roleStyle = getRoleStyle(
                  employee.role
                );

                return (
                  <tr
                    key={employee.id}
                    style={{
                      borderBottom:
                        "1px solid #f0f0f0",
                    }}
                  >
                    <td style={{ padding: "14px 12px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {employee.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginTop: "3px",
                        }}
                      >
                        {employee.id}
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {employee.employeeCode}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            roleStyle.background,
                          color: roleStyle.color,
                        }}
                      >
                        {employee.role}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {getBranchName(employee.branchId)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {employee.phone}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            employee.status ===
                            "Active"
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            employee.status ===
                            "Active"
                              ? "#166534"
                              : "#6b7280",
                        }}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <Link
                        to={`/employees/${employee.id}`}
                        style={{
                          color: "#2563eb",
                          textDecoration:
                            "none",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No employees found.
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

export default EmployeesPage;
