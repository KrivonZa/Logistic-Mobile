export interface createOrder {
  routeID: string;
  companyID: string;
  pickUpPointID: string;
  dropDownPointID: string;
  packageID: string;
  price: number;
  payloadNote: string;
}

export interface orderDelivery {
  orderID: string;
  customerID: string;
  routeID: string;
  packageID: string;
  pickUpPointID: string;
  dropDownPointID: string;
  price: number;
  companyID: string;
  pickUpImage: string;
  dropDownImage: string;
  payloadNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
