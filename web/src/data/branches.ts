export type BranchStatus = "Active" | "Inactive";

export type Branch = {
  id: string;
  branchCode: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  managerName: string;
  status: BranchStatus;
};

export const branches: Branch[] = [
  {
    id: "BR-001",
    branchCode: "BKK-001",
    name: "Bangkok Main Branch",
    address: "Bang Na-Trat Road",
    city: "Bangkok",
    province: "Bangkok",
    phone: "02-100-1001",
    managerName: "Somchai Manager",
    status: "Active",
  },
  {
    id: "BR-002",
    branchCode: "SPK-001",
    name: "Samut Prakan Branch",
    address: "Theparak Road",
    city: "Samut Prakan",
    province: "Samut Prakan",
    phone: "02-200-2002",
    managerName: "Wichai Boonmee",
    status: "Active",
  },
  {
    id: "BR-003",
    branchCode: "CBI-001",
    name: "Chonburi Branch",
    address: "Sukhumvit Road",
    city: "Chonburi",
    province: "Chonburi",
    phone: "038-300-3003",
    managerName: "Narin Kham",
    status: "Active",
  },
  {
    id: "BR-004",
    branchCode: "AYA-001",
    name: "Ayutthaya Branch",
    address: "Phahonyothin Road",
    city: "Ayutthaya",
    province: "Phra Nakhon Si Ayutthaya",
    phone: "035-400-4004",
    managerName: "Krit Chai",
    status: "Inactive",
  },
];