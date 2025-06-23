import api from "@/libs/hooks/axiosInstance";
import { Login, Register } from "@/libs/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
  register: (req: Register) => api.post(`/auth/register-customer`, req),
};
