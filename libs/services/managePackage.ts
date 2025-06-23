import api from "@/libs/hooks/axiosInstance";

export const managePackage = {
  getPackageByCustomer: () => api.get(`/package-handler`),
  getPackageByID: (req: string) => api.get(`/package-handler/${req}`),
};
