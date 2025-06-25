import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { parseJwt } from "@/libs/utils/auth";
import { router, usePathname } from "expo-router";
import api from "@/libs/hooks/axiosInstance";
import { User } from "@/libs/types/account";

interface AuthContextType {
  token: string | null;
  role: "Customer" | "Driver" | null;
  isLoading: boolean;
  logout: () => void;
  reloadAuth: () => Promise<void>;
  user: User | null;

  companyID: string | null;
  companyName: string | null;
  setCompany: (id: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  isLoading: true,
  logout: () => {},
  reloadAuth: async () => {},
  user: null,

  companyID: null,
  companyName: null,
  setCompany: async () => {},
});

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useContext(AuthContext).user;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"Customer" | "Driver" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const load = useCallback(async () => {
    setIsLoading(true);

    const storedToken = await SecureStore.getItemAsync("authToken");
    const storedRole = await SecureStore.getItemAsync("role");

    if (storedToken) {
      const payload = parseJwt(storedToken);
      const now = Math.floor(Date.now() / 1000);

      if (payload?.exp && payload.exp > now) {
        setToken(storedToken);
        setRole(storedRole as "Customer" | "Driver");

        try {
          const res = await api.get<User>("/account");

          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          await logout();
        }
      } else {
        await logout();
      }
    } else {
      await logout();
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [pathname]);

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("role");

    setToken(null);
    setRole(null);
    setUser(null);
    setCompanyID(null);
    setCompanyName(null);

    router.replace("/(auth)/login");
  };

  const setCompany = async (id: string, name: string) => {
    setCompanyID(id);
    setCompanyName(name);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isLoading,
        logout,
        reloadAuth: load,
        user,
        companyID,
        companyName,
        setCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
