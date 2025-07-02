export interface createOrder {
  routeID: string;
  companyID: string;
  pickUpPointID: string;
  dropDownPointID: string;
  packageID: string;
  price: number;
  payloadNote: string;
}

export interface Waypoint {
  location: string;
}

export interface Route {
  routeName: string;
}

export interface Package {
  packageID: string;
  packageWeight: number | string;
  note: string;
  packageImage: string;
  packageName: string;
}

export interface Customer {
  address: string;
  avatar: string;
  fullName: string;
  phoneNumber: string;
}

export interface Transaction {
  amount: string;
  checkoutUrl: string;
  createdAt: string;
  method: string;
  qrCode: string;
  status: string;
}

export interface OrderDelivery {
  orderID: string;
  customerID: string;
  customer: Customer;
  routeID: string;
  route: Route;
  packageID: string;
  package: Package;
  pickUpPointID: string;
  pickUpPoint: Waypoint;
  dropDownPointID: string;
  dropDownPoint: Waypoint;
  price: number;
  companyID: string;
  pickUpImage?: string;
  dropDownImage?: string;
  payloadNote?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  transaction?: Transaction | null;
}
