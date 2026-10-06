export type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  role: "Driver" | "Dispatcher" | "Manager" | "Admin";
  branchId: string;
  phone: string;
  status: "Active" | "Inactive";
};

export const employees: Employee[] = [
  {
    id: "EMP-001",
    employeeCode: "DRV-001",
    name: "Somchai Prasert",
    role: "Driver",
    branchId: "BR-001",
    phone: "081-234-5678",
    status: "Active",
  },
  {
    id: "EMP-002",
    employeeCode: "DRV-002",
    name: "Anan Suksan",
    role: "Driver",
    branchId: "BR-001",
    phone: "082-345-6789",
    status: "Active",
  },
  {
    id: "EMP-003",
    employeeCode: "DRV-003",
    name: "Wichai Boonmee",
    role: "Driver",
    branchId: "BR-002",
    phone: "083-456-7890",
    status: "Active",
  },
  {
    id: "EMP-004",
    employeeCode: "DRV-004",
    name: "Narin Kham",
    role: "Driver",
    branchId: "BR-003",
    phone: "084-567-8901",
    status: "Active",
  },
  {
    id: "EMP-005",
    employeeCode: "DSP-001",
    name: "Krit Chai",
    role: "Dispatcher",
    branchId: "BR-001",
    phone: "085-678-9012",
    status: "Active",
  },
  {
    id: "EMP-006",
    employeeCode: "MGR-001",
    name: "Somchai Manager",
    role: "Manager",
    branchId: "BR-001",
    phone: "086-789-0123",
    status: "Active",
  },
];