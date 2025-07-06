import api from "@/libs/hooks/axiosInstance";

export const managePackage = {
  getPackageIdleByCustomer: (params: {
    page: number;
    limit: number;
    routeID: string;
  }) => api.get(`/package-handler/idle`, { params }),
  getAllPackageByCustomer: (params: {
    page: number;
    limit: number;
    status?: string;
  }) => api.get(`/package-handler`, { params }),
  getPackageByID: (req: string) => api.get(`/package-handler/${req}`),
  createPackage: (formData: FormData) =>
    api.post(`/package-handler`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updatedPackage: (formData: FormData) => {
    const packageID = formData.get("packageID");
    return api.patch(`/package-handler/${packageID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
