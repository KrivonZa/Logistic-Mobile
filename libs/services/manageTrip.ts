import api from "@/libs/hooks/axiosInstance";
import { UpdateTrip } from "@/libs/types/trip";

export const manageTrip = {
  getTripByDriver: ({
    driverID,
    page = 1,
    limit = 10,
    status,
    dueDate,
  }: {
    driverID: string;
    page?: number;
    limit?: number;
    status?: string;
    dueDate?: string;
  }) =>
    api.get(`/trip/driver/${driverID}`, {
      params: { page, limit, status, dueDate },
    }),
  getTripByID: (req: string) => api.get(`/trip/${req}`),
  updatedTrip: (formData: FormData) => {
    const tripID = formData.get("tripID");
    return api.patch(`/trip/${tripID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
