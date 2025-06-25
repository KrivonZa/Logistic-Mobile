export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  address: string;
}

export interface Account {
  accountID: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: "Customer" | "Driver";
}

export interface CustomerDetail {
  accountID: string;
  customerID: string;
  phoneNumber: string;
  address: string;
  updatedAt: string;
}

export interface DriverDetail {
  accountID: string;
  driverID: string;
  phoneNumber: string;
  identityNumber: string;
  licenseNumber: string;
  licenseLevel: string;
  licenseExpiry: string;
  companyID: string;
  companyName: string;
  updatedAt: string;
}

export interface User {
  account: Account & {
    detail: CustomerDetail | DriverDetail;
  };
}
