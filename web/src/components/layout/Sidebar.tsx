
import { NavLink } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
  icon: string;
};

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: "▦",
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        label: "Trips",
        path: "/operations/trips",
        icon: "↔",
      },
      {
        label: "Work Orders",
        path: "/operations/work-orders",
        icon: "▤",
      },
      {
        label: "Route Planning",
        path: "/operations/routes",
        icon: "⌖",
      },
      {
        label: "Dispatch Board",
        path: "/operations/dispatch",
        icon: "◫",
      },
    ],
  },
  {
    title: "FLEET",
    items: [
      {
        label: "Vehicles",
        path: "/fleet/vehicles",
        icon: "▰",
      },
      {
        label: "Vehicle Types",
        path: "/fleet/types",
        icon: "▱",
      },
      {
        label: "Maintenance",
        path: "/fleet/maintenance",
        icon: "⚒",
      },
      {
        label: "Fuel",
        path: "/fleet/fuel",
        icon: "⛽",
      },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      {
        label: "Drivers",
        path: "/drivers",
        icon: "♙",
      },
      {
        label: "Employees",
        path: "/employees",
        icon: "♙",
      },
    ],
  },
  {
    title: "CUSTOMERS",
    items: [
      {
        label: "Customers",
        path: "/customers",
        icon: "♙",
      },
      {
        label: "Customer Orders",
        path: "/customers/orders",
        icon: "▤",
      },
    ],
  },
  {
    title: "FINANCE",
    items: [
      {
        label: "Revenue",
        path: "/finance/revenue",
        icon: "฿",
      },
      {
        label: "Costs",
        path: "/finance/costs",
        icon: "−",
      },
      {
        label: "Invoices",
        path: "/finance/invoices",
        icon: "▤",
      },
      {
        label: "Payments",
        path: "/finance/payments",
        icon: "✓",
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        label: "Reports",
        path: "/reports",
        icon: "▥",
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Users",
        path: "/administration/users",
        icon: "♙",
      },
      {
        label: "Roles & Permissions",
        path: "/administration/roles",
        icon: "⚿",
      },
      {
        label: "Audit Logs",
        path: "/administration/audit-logs",
        icon: "≡",
      },
    ],
  },
];

function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        height: "100vh",
        background: "#111827",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}

      <div
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            TMS
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              marginTop: "2px",
            }}
          >
            Transportation Management
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        style={{
          padding: "16px 12px",
        }}
      >
        {menuSections.map((section) => (
          <div
            key={section.title}
            style={{
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#6b7280",
                padding:
                  "0 12px 8px",
                letterSpacing: "0.08em",
              }}
            >
              {section.title}
            </div>

            {section.items.map(
              (item: MenuItem) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding:
                      "10px 12px",
                    marginBottom: "3px",
                    borderRadius: "7px",
                    color: isActive
                      ? "white"
                      : "#9ca3af",
                    background:
                      isActive
                        ? "#2563eb"
                        : "transparent",
                    textDecoration:
                      "none",
                    fontSize: "14px",
                    fontWeight:
                      isActive
                        ? 600
                        : 400,
                  })}
                >
                  <span
                    style={{
                      width: "20px",
                      textAlign:
                        "center",
                    }}
                  >
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              )
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
