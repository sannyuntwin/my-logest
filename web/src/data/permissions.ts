export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "execute"
  | "approve"
  | "assign"
  | "export";

export type Permission = {
  id: string;
  code: string;
  module: string;
  action: PermissionAction;
  description: string;
};

export const permissions: Permission[] = [
  // Dashboard
  {
    id: "PERM-001",
    code: "dashboard.view",
    module: "Dashboard",
    action: "view",
    description: "View the main dashboard.",
  },

  // Trips
  {
    id: "PERM-002",
    code: "trips.view",
    module: "Trips",
    action: "view",
    description: "View trips.",
  },
  {
    id: "PERM-003",
    code: "trips.create",
    module: "Trips",
    action: "create",
    description: "Create new trips.",
  },
  {
    id: "PERM-004",
    code: "trips.edit",
    module: "Trips",
    action: "edit",
    description: "Edit trip information.",
  },
  {
    id: "PERM-005",
    code: "trips.delete",
    module: "Trips",
    action: "delete",
    description: "Delete trips.",
  },
  {
    id: "PERM-006",
    code: "trips.execute",
    module: "Trips",
    action: "execute",
    description: "Execute and update trip progress.",
  },

  // Work Orders
  {
    id: "PERM-007",
    code: "work_orders.view",
    module: "Work Orders",
    action: "view",
    description: "View work orders.",
  },
  {
    id: "PERM-008",
    code: "work_orders.create",
    module: "Work Orders",
    action: "create",
    description: "Create work orders.",
  },
  {
    id: "PERM-009",
    code: "work_orders.edit",
    module: "Work Orders",
    action: "edit",
    description: "Edit work orders.",
  },
  {
    id: "PERM-010",
    code: "work_orders.assign",
    module: "Work Orders",
    action: "assign",
    description: "Assign vehicles and drivers to work orders.",
  },

  // Route Planning
  {
    id: "PERM-011",
    code: "routes.view",
    module: "Route Planning",
    action: "view",
    description: "View route plans.",
  },
  {
    id: "PERM-012",
    code: "routes.create",
    module: "Route Planning",
    action: "create",
    description: "Create route plans.",
  },
  {
    id: "PERM-013",
    code: "routes.edit",
    module: "Route Planning",
    action: "edit",
    description: "Edit route plans.",
  },

  // Dispatch
  {
    id: "PERM-014",
    code: "dispatch.view",
    module: "Dispatch",
    action: "view",
    description: "View the dispatch board.",
  },
  {
    id: "PERM-015",
    code: "dispatch.assign",
    module: "Dispatch",
    action: "assign",
    description: "Assign work orders to vehicles and drivers.",
  },

  // Vehicles
  {
    id: "PERM-016",
    code: "vehicles.view",
    module: "Vehicles",
    action: "view",
    description: "View vehicles.",
  },
  {
    id: "PERM-017",
    code: "vehicles.create",
    module: "Vehicles",
    action: "create",
    description: "Create vehicles.",
  },
  {
    id: "PERM-018",
    code: "vehicles.edit",
    module: "Vehicles",
    action: "edit",
    description: "Edit vehicle information.",
  },
  {
    id: "PERM-019",
    code: "vehicles.delete",
    module: "Vehicles",
    action: "delete",
    description: "Delete vehicles.",
  },

  // Vehicle Types
  {
    id: "PERM-020",
    code: "vehicle_types.view",
    module: "Vehicle Types",
    action: "view",
    description: "View vehicle types.",
  },
  {
    id: "PERM-021",
    code: "vehicle_types.create",
    module: "Vehicle Types",
    action: "create",
    description: "Create vehicle types.",
  },
  {
    id: "PERM-022",
    code: "vehicle_types.edit",
    module: "Vehicle Types",
    action: "edit",
    description: "Edit vehicle types.",
  },

  // Maintenance
  {
    id: "PERM-023",
    code: "maintenance.view",
    module: "Maintenance",
    action: "view",
    description: "View maintenance records.",
  },
  {
    id: "PERM-024",
    code: "maintenance.create",
    module: "Maintenance",
    action: "create",
    description: "Create maintenance records.",
  },
  {
    id: "PERM-025",
    code: "maintenance.edit",
    module: "Maintenance",
    action: "edit",
    description: "Edit maintenance records.",
  },

  // Fuel
  {
    id: "PERM-026",
    code: "fuel.view",
    module: "Fuel",
    action: "view",
    description: "View fuel transactions.",
  },
  {
    id: "PERM-027",
    code: "fuel.create",
    module: "Fuel",
    action: "create",
    description: "Create fuel transactions.",
  },

  // Drivers
  {
    id: "PERM-028",
    code: "drivers.view",
    module: "Drivers",
    action: "view",
    description: "View drivers.",
  },
  {
    id: "PERM-029",
    code: "drivers.edit",
    module: "Drivers",
    action: "edit",
    description: "Edit driver information.",
  },

  // Employees
  {
    id: "PERM-030",
    code: "employees.view",
    module: "Employees",
    action: "view",
    description: "View employees.",
  },
  {
    id: "PERM-031",
    code: "employees.create",
    module: "Employees",
    action: "create",
    description: "Create employees.",
  },
  {
    id: "PERM-032",
    code: "employees.edit",
    module: "Employees",
    action: "edit",
    description: "Edit employee information.",
  },

  // Customers
  {
    id: "PERM-033",
    code: "customers.view",
    module: "Customers",
    action: "view",
    description: "View customers.",
  },
  {
    id: "PERM-034",
    code: "customers.create",
    module: "Customers",
    action: "create",
    description: "Create customers.",
  },
  {
    id: "PERM-035",
    code: "customers.edit",
    module: "Customers",
    action: "edit",
    description: "Edit customer information.",
  },

  // Customer Orders
  {
    id: "PERM-036",
    code: "customer_orders.view",
    module: "Customer Orders",
    action: "view",
    description: "View customer orders.",
  },
  {
    id: "PERM-037",
    code: "customer_orders.create",
    module: "Customer Orders",
    action: "create",
    description: "Create customer orders.",
  },
  {
    id: "PERM-038",
    code: "customer_orders.edit",
    module: "Customer Orders",
    action: "edit",
    description: "Edit customer orders.",
  },

  // Revenue
  {
    id: "PERM-039",
    code: "revenue.view",
    module: "Revenue",
    action: "view",
    description: "View revenue records.",
  },
  {
    id: "PERM-040",
    code: "revenue.create",
    module: "Revenue",
    action: "create",
    description: "Create revenue records.",
  },
  {
    id: "PERM-041",
    code: "revenue.edit",
    module: "Revenue",
    action: "edit",
    description: "Edit revenue records.",
  },

  // Costs
  {
    id: "PERM-042",
    code: "costs.view",
    module: "Costs",
    action: "view",
    description: "View cost records.",
  },
  {
    id: "PERM-043",
    code: "costs.create",
    module: "Costs",
    action: "create",
    description: "Create cost records.",
  },
  {
    id: "PERM-044",
    code: "costs.edit",
    module: "Costs",
    action: "edit",
    description: "Edit cost records.",
  },
  {
    id: "PERM-045",
    code: "costs.approve",
    module: "Costs",
    action: "approve",
    description: "Approve cost records.",
  },

  // Invoices
  {
    id: "PERM-046",
    code: "invoices.view",
    module: "Invoices",
    action: "view",
    description: "View invoices.",
  },
  {
    id: "PERM-047",
    code: "invoices.create",
    module: "Invoices",
    action: "create",
    description: "Create invoices.",
  },
  {
    id: "PERM-048",
    code: "invoices.edit",
    module: "Invoices",
    action: "edit",
    description: "Edit invoices.",
  },
  {
    id: "PERM-049",
    code: "invoices.approve",
    module: "Invoices",
    action: "approve",
    description: "Approve and issue invoices.",
  },

  // Payments
  {
    id: "PERM-050",
    code: "payments.view",
    module: "Payments",
    action: "view",
    description: "View payments.",
  },
  {
    id: "PERM-051",
    code: "payments.create",
    module: "Payments",
    action: "create",
    description: "Record payments.",
  },
  {
    id: "PERM-052",
    code: "payments.edit",
    module: "Payments",
    action: "edit",
    description: "Edit payment records.",
  },

  // Profitability
  {
    id: "PERM-053",
    code: "profitability.view",
    module: "Profitability",
    action: "view",
    description: "View profitability information.",
  },
  {
    id: "PERM-054",
    code: "profitability.export",
    module: "Profitability",
    action: "export",
    description: "Export profitability reports.",
  },

  // Reports
  {
    id: "PERM-055",
    code: "reports.view",
    module: "Reports",
    action: "view",
    description: "View reports.",
  },
  {
    id: "PERM-056",
    code: "reports.export",
    module: "Reports",
    action: "export",
    description: "Export reports.",
  },

  // Users
  {
    id: "PERM-057",
    code: "users.view",
    module: "Users",
    action: "view",
    description: "View system users.",
  },
  {
    id: "PERM-058",
    code: "users.create",
    module: "Users",
    action: "create",
    description: "Create system users.",
  },
  {
    id: "PERM-059",
    code: "users.edit",
    module: "Users",
    action: "edit",
    description: "Edit system users.",
  },
  {
    id: "PERM-060",
    code: "users.delete",
    module: "Users",
    action: "delete",
    description: "Delete system users.",
  },

  // Roles & Permissions
  {
    id: "PERM-061",
    code: "roles.view",
    module: "Roles & Permissions",
    action: "view",
    description: "View roles and permissions.",
  },
  {
    id: "PERM-062",
    code: "roles.create",
    module: "Roles & Permissions",
    action: "create",
    description: "Create roles.",
  },
  {
    id: "PERM-063",
    code: "roles.edit",
    module: "Roles & Permissions",
    action: "edit",
    description: "Edit roles and permissions.",
  },

  // Audit Logs
  {
    id: "PERM-064",
    code: "audit_logs.view",
    module: "Audit Logs",
    action: "view",
    description: "View system audit logs.",
  },
];