import api from "@/libs/hooks/axiosInstance";

export const managePackage = {
  getPackageIdleByCustomer: (params: {
    page: number;
    limit: number;
    routeID: string;
  }) => api.get(`/package-handler/idle`, { params }),
  getPackageByID: (req: string) => api.get(`/package-handler/${req}`),
  createPackage: (formData: FormData) =>
    api.post(`/package-handler`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
