import api from "@/libs/hooks/axiosInstance";
import { createOrder } from "@/libs/types/order";

export const manageOrder = {
  createOrder: (req: createOrder) => api.post(`/delivery-order`, req),
  getCreatedOrder: (params: any) =>
    api.get("/delivery-order/created", { params }),
  getOrderDetail: (req: string) => api.get(`/delivery-order/order/${req}`),
};
