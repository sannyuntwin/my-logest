export type RoleStatus = "Active" | "Inactive";

export type Role = {
  id: string;
  code: string;
  name: string;
  description: string;
  status: RoleStatus;
};

export const roles: Role[] = [
  {
    id: "ROLE-001",
    code: "ADMIN",
    name: "System Administrator",
    description:
      "Full access to the TMS including system configuration, users, roles, permissions, and operational modules.",
    status: "Active",
  },
  {
    id: "ROLE-002",
    code: "MANAGER",
    name: "Operations Manager",
    description:
      "Access to operational, fleet, customer, finance, and reporting information.",
    status: "Active",
  },
  {
    id: "ROLE-003",
    code: "DISPATCHER",
    name: "Dispatcher",
    description:
      "Manage customer orders, work orders, route planning, dispatch, and trip operations.",
    status: "Active",
  },
  {
    id: "ROLE-004",
    code: "DRIVER",
    name: "Driver",
    description:
      "Access assigned trips, trip execution, delivery information, and proof of delivery.",
    status: "Active",
  },
  {
    id: "ROLE-005",
    code: "FINANCE",
    name: "Finance Officer",
    description:
      "Manage revenue, costs, invoices, payments, and financial reports.",
    status: "Active",
  },
  {
    id: "ROLE-006",
    code: "FLEET_MANAGER",
    name: "Fleet Manager",
    description:
      "Manage vehicles, vehicle types, maintenance, fuel, and fleet-related information.",
    status: "Active",
  },
  {
    id: "ROLE-007",
    code: "REPORT_VIEWER",
    name: "Report Viewer",
    description:
      "Read-only access to dashboards and reports.",
    status: "Active",
  },
];