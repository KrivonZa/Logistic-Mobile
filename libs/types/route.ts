export interface LocationDto {
  latitude: number;
  longitude: number;
}

export interface FindNearestWaypointsRequest {
  currentLocation: LocationDto;
  dropOffLocation: LocationDto;
  maxDistance: number;
}

export interface Company {
  waypointID: string;
  geoLocation: string;
  location: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface Waypoints {
  waypointID: string;
  geoLocation: string;
  location: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  accountID: string;
  fullName: string | null;
  avatar: string | null;
}

export interface Companys {
  companyID: string;
  address: string | null;
  accountID: string | null;
  Account: Account;
}

export interface RouteWithWaypoints {
  routeID: string;
  companyID: string | null;
  routeName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  Company: Companys;
  Waypoint: Waypoints[];
}
