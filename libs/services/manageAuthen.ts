import api from "@/libs/hooks/axiosInstance";
import { Login } from "@/libs/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
};
