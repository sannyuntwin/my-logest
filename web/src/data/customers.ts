export type CustomerStatus = "Active" | "Inactive";

export type Customer = {
  id: string;
  customerCode: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  branchId: string;
  status: CustomerStatus;
};

export const customers: Customer[] = [
  {
    id: "CUS-001",
    customerCode: "CUST-001",
    name: "ABC Manufacturing Co., Ltd.",
    contactPerson: "Somsak Chai",
    phone: "02-123-4567",
    email: "contact@abcmanufacturing.com",
    address: "Bang Na, Bangkok",
    branchId: "BR-001",
    status: "Active",
  },
  {
    id: "CUS-002",
    customerCode: "CUST-002",
    name: "Thai Retail Distribution",
    contactPerson: "Nok Srisuk",
    phone: "02-234-5678",
    email: "operations@thairetail.com",
    address: "Rangsit, Pathum Thani",
    branchId: "BR-001",
    status: "Active",
  },
  {
    id: "CUS-003",
    customerCode: "CUST-003",
    name: "Siam Food Products",
    contactPerson: "Prasert Wong",
    phone: "02-345-6789",
    email: "logistics@siamfood.com",
    address: "Samut Prakan",
    branchId: "BR-002",
    status: "Active",
  },
  {
    id: "CUS-004",
    customerCode: "CUST-004",
    name: "Eastern Electronics",
    contactPerson: "Kanya Som",
    phone: "02-456-7890",
    email: "transport@easternelectronics.com",
    address: "Chonburi",
    branchId: "BR-003",
    status: "Active",
  },
  {
    id: "CUS-005",
    customerCode: "CUST-005",
    name: "Bangkok Construction Supply",
    contactPerson: "Wirot Kan",
    phone: "02-567-8901",
    email: "delivery@bcsupply.com",
    address: "Lat Krabang, Bangkok",
    branchId: "BR-001",
    status: "Active",
  },
  {
    id: "CUS-006",
    customerCode: "CUST-006",
    name: "Metro Home Products",
    contactPerson: "Suda Pram",
    phone: "02-678-9012",
    email: "logistics@metrohome.com",
    address: "Nonthaburi",
    branchId: "BR-001",
    status: "Inactive",
  },
];