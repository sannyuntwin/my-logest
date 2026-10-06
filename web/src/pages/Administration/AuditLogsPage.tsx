import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { auditLogs } from "../../data/auditLogs";
import { users } from "../../data/users";

function actionClass(action: string) {
  switch (action) {
    case "CREATE":
      return "status completed";

    case "UPDATE":
      return "status in-progress";

    case "DELETE":
      return "status cancelled";

    case "LOGIN":
      return "status ready";

    case "LOGOUT":
      return "status pending";

    case "ASSIGN":
      return "status planned";

    case "EXECUTE":
      return "status arrived";

    case "APPROVE":
      return "status completed";

    case "PAYMENT":
      return "status completed";

    default:
      return "status pending";
  }
}

function getUserName(userId: string) {
  const user = users.find(
    (item) => item.id === userId
  );

  return user
    ? user.fullName
    : "Unknown User";
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] =
    useState("All");
  const [entityFilter, setEntityFilter] =
    useState("All");
  const [userFilter, setUserFilter] =
    useState("All");

  const actions = useMemo(
    () =>
      Array.from(
        new Set(
          auditLogs.map(
            (log) => log.action
          )
        )
      ),
    []
  );

  const entities = useMemo(
    () =>
      Array.from(
        new Set(
          auditLogs.map(
            (log) => log.entity
          )
        )
      ),
    []
  );

  const filteredLogs = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    return auditLogs.filter((log) => {
      const userName =
        getUserName(log.userId);

      const matchesSearch =
        !keyword ||
        log.id
          .toLowerCase()
          .includes(keyword) ||
        log.description
          .toLowerCase()
          .includes(keyword) ||
        log.entity
          .toLowerCase()
          .includes(keyword) ||
        log.entityId
          ?.toLowerCase()
          .includes(keyword) ||
        userName
          .toLowerCase()
          .includes(keyword);

      const matchesAction =
        actionFilter === "All" ||
        log.action === actionFilter;

      const matchesEntity =
        entityFilter === "All" ||
        log.entity === entityFilter;

      const matchesUser =
        userFilter === "All" ||
        log.userId === userFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesEntity &&
        matchesUser
      );
    });
  }, [
    search,
    actionFilter,
    entityFilter,
    userFilter,
  ]);

  const loginCount = auditLogs.filter(
    (log) => log.action === "LOGIN"
  ).length;

  const updateCount = auditLogs.filter(
    (log) => log.action === "UPDATE"
  ).length;

  const assignmentCount =
    auditLogs.filter(
      (log) => log.action === "ASSIGN"
    ).length;

  const approvalCount =
    auditLogs.filter(
      (log) => log.action === "APPROVE"
    ).length;

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
          <h1
            style={{
              marginBottom: 6,
            }}
          >
            Audit Logs
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            Track important activities and
            changes performed in the TMS.
          </p>
        </div>
      </div>

      {/* KPI */}
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
          <p>Total Events</p>
          <h2>{auditLogs.length}</h2>
        </div>

        <div className="card">
          <p>Logins</p>
          <h2>{loginCount}</h2>
        </div>

        <div className="card">
          <p>Updates</p>
          <h2>{updateCount}</h2>
        </div>

        <div className="card">
          <p>Assignments</p>
          <h2>{assignmentCount}</h2>
        </div>

        <div className="card">
          <p>Approvals</p>
          <h2>{approvalCount}</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="Search logs, user, entity, description..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          <select
            value={actionFilter}
            onChange={(event) =>
              setActionFilter(
                event.target.value
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <option value="All">
              All Actions
            </option>

            {actions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            ))}
          </select>

          <select
            value={entityFilter}
            onChange={(event) =>
              setEntityFilter(
                event.target.value
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <option value="All">
              All Entities
            </option>

            {entities.map((entity) => (
              <option
                key={entity}
                value={entity}
              >
                {entity}
              </option>
            ))}
          </select>

          <select
            value={userFilter}
            onChange={(event) =>
              setUserFilter(
                event.target.value
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <option value="All">
              All Users
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.fullName}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Showing {filteredLogs.length} of{" "}
            {auditLogs.length} events
          </span>

          <button
            onClick={() => {
              setSearch("");
              setActionFilter("All");
              setEntityFilter("All");
              setUserFilter("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Audit table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2>Activity History</h2>

            <p
              style={{
                marginTop: 6,
                color: "#6b7280",
              }}
            >
              System activity recorded by the
              TMS.
            </p>
          </div>

          <button
            onClick={() =>
              alert(
                "Export Audit Logs - demo only"
              )
            }
          >
            Export Logs
          </button>
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
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td
                    style={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {log.timestamp}
                  </td>

                  <td>
                    <Link
                      to={`/administration/users/${log.userId}`}
                    >
                      {getUserName(
                        log.userId
                      )}
                    </Link>
                  </td>

                  <td>
                    <span
                      className={actionClass(
                        log.action
                      )}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td>{log.entity}</td>

                  <td>
                    {log.entityId ?? "—"}
                  </td>

                  <td
                    style={{
                      minWidth: 320,
                    }}
                  >
                    {log.description}
                  </td>

                  <td>
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No audit logs match the current
            filters.
          </div>
        )}
      </div>

      {/* Demo architecture note */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#eff6ff",
          borderRadius: 8,
          border:
            "1px solid #bfdbfe",
        }}
      >
        <strong>
          Demo Data Notice
        </strong>

        <p
          style={{
            margin:
              "6px 0 0",
            color: "#374151",
            fontSize: 14,
          }}
        >
          These audit logs are currently
          static demo data. In the production
          TMS, audit events should be generated
          automatically by the backend whenever
          users log in, create, update, delete,
          assign, execute, approve, or record
          payments.
        </p>
      </div>
    </div>
  );
}