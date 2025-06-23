import api from "@/libs/hooks/axiosInstance";
import { FindNearestWaypointsRequest } from "@/libs/types/route";

export const manageRoute = {
  findNearest: (req: FindNearestWaypointsRequest) =>
    api.post(`/delivery-order/nearest-waypoints`, req),
  getRouteByID: (req: string) => api.get(`/route-planning/route/${req}`),
};
