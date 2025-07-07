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

export interface Driver {
  driverID: string;
  accountID: string;
  fullName: string;
  phoneNumber: string;
  licenseNumber: string;
}

export interface Vehicle {
  vehicleID: string;
  vehicleNumber: string;
  vehicleImage: string;
  loadCapacity: number;
}

export interface Trip {
  tripID: string;
  status: string;
  dueTime: string;
  startTime?: string | null;
  endTime?: string | null;
  createdAt: string;
  driver?: Driver | null;
  vehicle?: Vehicle | null;
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
  trip?: Trip | null;
}
