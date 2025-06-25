import axios, { AxiosError, AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthContext {
  setUser: (user: any) => void;
  router: {
    push: (path: string) => void;
  };
}

let authContext: AuthContext | null = null;

export const setAuthContext = (context: AuthContext) => {
  authContext = context;
};

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}`,
});

// ✅ Gắn token vào request nếu có
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("[Auth Debug] Token expired, logging out...");

      if (authContext) {
        authContext.setUser(null);
        authContext.router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
