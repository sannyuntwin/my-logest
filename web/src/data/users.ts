export type UserStatus = "Active" | "Inactive" | "Locked";

export type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  employeeId: string | null;
  roleId: string;
  branchId: string | null;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
};

export const users: User[] = [
  {
    id: "USR-001",
    username: "admin",
    fullName: "System Administrator",
    email: "admin@tms-demo.com",
    employeeId: "EMP-006",
    roleId: "ROLE-001",
    branchId: null,
    status: "Active",
    lastLogin: "2026-10-05 09:15",
    createdAt: "2026-01-05",
  },
  {
    id: "USR-002",
    username: "somchai.manager",
    fullName: "Somchai Manager",
    email: "somchai.manager@tms-demo.com",
    employeeId: "EMP-006",
    roleId: "ROLE-002",
    branchId: "BR-001",
    status: "Active",
    lastLogin: "2026-10-05 08:42",
    createdAt: "2026-01-10",
  },
  {
    id: "USR-003",
    username: "krit.dispatch",
    fullName: "Krit Chai",
    email: "krit.dispatch@tms-demo.com",
    employeeId: "EMP-005",
    roleId: "ROLE-003",
    branchId: "BR-001",
    status: "Active",
    lastLogin: "2026-10-05 07:58",
    createdAt: "2026-02-01",
  },
  {
    id: "USR-004",
    username: "somchai.driver",
    fullName: "Somchai Prasert",
    email: "somchai.driver@tms-demo.com",
    employeeId: "EMP-001",
    roleId: "ROLE-004",
    branchId: "BR-001",
    status: "Active",
    lastLogin: "2026-10-04 18:22",
    createdAt: "2026-02-05",
  },
  {
    id: "USR-005",
    username: "anan.driver",
    fullName: "Anan Suksan",
    email: "anan.driver@tms-demo.com",
    employeeId: "EMP-002",
    roleId: "ROLE-004",
    branchId: "BR-001",
    status: "Active",
    lastLogin: "2026-10-04 17:45",
    createdAt: "2026-02-10",
  },
  {
    id: "USR-006",
    username: "wichai.driver",
    fullName: "Wichai Boonmee",
    email: "wichai.driver@tms-demo.com",
    employeeId: "EMP-003",
    roleId: "ROLE-004",
    branchId: "BR-002",
    status: "Active",
    lastLogin: "2026-10-03 19:10",
    createdAt: "2026-03-01",
  },
  {
    id: "USR-007",
    username: "narin.driver",
    fullName: "Narin Kham",
    email: "narin.driver@tms-demo.com",
    employeeId: "EMP-004",
    roleId: "ROLE-004",
    branchId: "BR-003",
    status: "Active",
    lastLogin: "2026-10-05 06:55",
    createdAt: "2026-03-05",
  },
  {
    id: "USR-008",
    username: "old.dispatch",
    fullName: "Former Dispatcher",
    email: "former.dispatch@tms-demo.com",
    employeeId: null,
    roleId: "ROLE-003",
    branchId: "BR-001",
    status: "Inactive",
    lastLogin: "2026-07-15 10:30",
    createdAt: "2026-01-20",
  },
];