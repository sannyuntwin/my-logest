export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "ASSIGN"
  | "EXECUTE"
  | "APPROVE"
  | "PAYMENT";

export type AuditEntity =
  | "User"
  | "Employee"
  | "Customer"
  | "Customer Order"
  | "Work Order"
  | "Route"
  | "Trip"
  | "Vehicle"
  | "Maintenance"
  | "Fuel"
  | "Revenue"
  | "Cost"
  | "Invoice"
  | "Payment"
  | "System";

export type AuditLog = {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string | null;
  description: string;
  ipAddress: string;
};

export const auditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    timestamp: "2026-10-05 09:15:22",
    userId: "USR-001",
    action: "LOGIN",
    entity: "System",
    entityId: null,
    description: "System Administrator logged into the TMS.",
    ipAddress: "192.168.1.10",
  },
  {
    id: "AUD-002",
    timestamp: "2026-10-05 08:45:10",
    userId: "USR-002",
    action: "LOGIN",
    entity: "System",
    entityId: null,
    description: "Operations Manager logged into the TMS.",
    ipAddress: "192.168.1.21",
  },
  {
    id: "AUD-003",
    timestamp: "2026-10-05 08:50:31",
    userId: "USR-002",
    action: "UPDATE",
    entity: "Work Order",
    entityId: "WO-004",
    description: "Updated work order assignment information.",
    ipAddress: "192.168.1.21",
  },
  {
    id: "AUD-004",
    timestamp: "2026-10-05 08:55:42",
    userId: "USR-003",
    action: "ASSIGN",
    entity: "Work Order",
    entityId: "WO-004",
    description:
      "Assigned vehicle VH-004 and driver EMP-004 to work order WO-004.",
    ipAddress: "192.168.1.35",
  },
  {
    id: "AUD-005",
    timestamp: "2026-10-05 09:02:18",
    userId: "USR-003",
    action: "UPDATE",
    entity: "Route",
    entityId: "ROUTE-004",
    description: "Updated route planning information.",
    ipAddress: "192.168.1.35",
  },
  {
    id: "AUD-006",
    timestamp: "2026-10-05 09:10:05",
    userId: "USR-004",
    action: "EXECUTE",
    entity: "Trip",
    entityId: "TRIP-0001",
    description: "Started trip execution for TRIP-0001.",
    ipAddress: "192.168.1.41",
  },
  {
    id: "AUD-007",
    timestamp: "2026-10-05 09:35:14",
    userId: "USR-004",
    action: "UPDATE",
    entity: "Trip",
    entityId: "TRIP-0001",
    description: "Updated trip execution status to Pickup Completed.",
    ipAddress: "192.168.1.41",
  },
  {
    id: "AUD-008",
    timestamp: "2026-10-04 16:20:33",
    userId: "USR-005",
    action: "UPDATE",
    entity: "Vehicle",
    entityId: "VH-002",
    description: "Updated vehicle mileage information.",
    ipAddress: "192.168.1.42",
  },
  {
    id: "AUD-009",
    timestamp: "2026-10-04 14:12:45",
    userId: "USR-002",
    action: "CREATE",
    entity: "Customer",
    entityId: "CUS-005",
    description: "Created a new customer record.",
    ipAddress: "192.168.1.21",
  },
  {
    id: "AUD-010",
    timestamp: "2026-10-04 13:45:21",
    userId: "USR-003",
    action: "CREATE",
    entity: "Customer Order",
    entityId: "ORD-005",
    description: "Created a new customer transportation order.",
    ipAddress: "192.168.1.35",
  },
  {
    id: "AUD-011",
    timestamp: "2026-10-03 11:30:18",
    userId: "USR-006",
    action: "UPDATE",
    entity: "Maintenance",
    entityId: "MNT-003",
    description: "Updated maintenance status to In Progress.",
    ipAddress: "192.168.1.43",
  },
  {
    id: "AUD-012",
    timestamp: "2026-10-03 10:22:09",
    userId: "USR-002",
    action: "APPROVE",
    entity: "Cost",
    entityId: "COST-007",
    description: "Approved vehicle maintenance cost.",
    ipAddress: "192.168.1.21",
  },
  {
    id: "AUD-013",
    timestamp: "2026-10-02 15:42:51",
    userId: "USR-005",
    action: "CREATE",
    entity: "Fuel",
    entityId: "FUEL-008",
    description: "Created a new fuel transaction.",
    ipAddress: "192.168.1.42",
  },
  {
    id: "AUD-014",
    timestamp: "2026-10-02 14:18:36",
    userId: "USR-005",
    action: "PAYMENT",
    entity: "Payment",
    entityId: "PAY-004",
    description: "Recorded a customer payment.",
    ipAddress: "192.168.1.42",
  },
  {
    id: "AUD-015",
    timestamp: "2026-10-01 16:05:12",
    userId: "USR-001",
    action: "CREATE",
    entity: "User",
    entityId: "USR-008",
    description: "Created a new system user account.",
    ipAddress: "192.168.1.10",
  },
  {
    id: "AUD-016",
    timestamp: "2026-10-01 15:40:27",
    userId: "USR-001",
    action: "UPDATE",
    entity: "User",
    entityId: "USR-008",
    description: "Changed user account status to Inactive.",
    ipAddress: "192.168.1.10",
  },
  {
    id: "AUD-017",
    timestamp: "2026-09-30 17:25:44",
    userId: "USR-001",
    action: "UPDATE",
    entity: "Vehicle",
    entityId: "VH-003",
    description: "Updated vehicle status to Maintenance.",
    ipAddress: "192.168.1.10",
  },
  {
    id: "AUD-018",
    timestamp: "2026-09-30 16:10:08",
    userId: "USR-002",
    action: "APPROVE",
    entity: "Invoice",
    entityId: "INV-004",
    description: "Issued customer invoice INV-004.",
    ipAddress: "192.168.1.21",
  },
  {
    id: "AUD-019",
    timestamp: "2026-09-29 13:20:15",
    userId: "USR-003",
    action: "CREATE",
    entity: "Work Order",
    entityId: "WO-006",
    description: "Created a new work order from customer order ORD-006.",
    ipAddress: "192.168.1.35",
  },
  {
    id: "AUD-020",
    timestamp: "2026-09-29 09:05:37",
    userId: "USR-007",
    action: "LOGIN",
    entity: "System",
    entityId: null,
    description: "Driver logged into the TMS.",
    ipAddress: "192.168.1.44",
  },
];