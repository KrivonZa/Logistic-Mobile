export type TripWithFullInfo = {
  tripID: string;
  routeID: string;
  vehicleID: string;
  driverID: string;
  assignedBy: string;
  deliveryOrderID: string;
  dueTime: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;

  driver: {
    driverID: string;
    licenseNumber: string;
    licenseExpiry: string;
    phoneNumber: string;
    licenseLevel: string;
    identityNumber: string;
    updatedAt: string;
    Account: {
      accountID: string;
      fullName: string;
      avatar: string;
      email: string;
      status: string;
    };
  };

  vehicle: {
    vehicleID: string;
    vehicleNumber: string;
    vehicleImage: string;
    loadCapacity: number;
    status: string;
    updatedAt: string;
  };

  route: {
    routeID: string;
    routeName: string;
    createdAt: string;
    updatedAt: string;
  };

  deliveryOrder: {
    orderID: string;
    customerID: string;
    routeID: string;
    packageID: string;
    pickUpPointID: string;
    dropDownPointID: string;
    price: number;
    companyID: string;
    pickUpImage: string | null;
    dropDownImage: string | null;
    payloadNote: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;

    Package: {
      packageID: string;
      packageName: string;
      packageImage: string;
      packageWeight: number;
      note: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
    };

    Customer: {
      customerID: string;
      phoneNumber: string;
      address: string;
      updatedAt: string;
      Account: {
        accountID: string;
        fullName: string;
        avatar: string | null;
        email: string;
        status: string;
      };
    };

    Waypoint_DeliveryOrder_pickUpPointIDToWaypoint: {
      waypointID: string;
      location: string;
      index: number;
    };

    Waypoint_DeliveryOrder_dropDownPointIDToWaypoint: {
      waypointID: string;
      location: string;
      index: number;
    };
  };
};

export interface UpdateTrip {
  tripID: string;
  status: string;
}
