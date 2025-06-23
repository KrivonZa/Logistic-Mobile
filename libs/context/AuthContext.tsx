import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { parseJwt } from "@/libs/utils/auth";
import { router } from "expo-router";

type AuthContextType = {
  role: string | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  reloadAuth: () => Promise<void>;

  companyID: string | null;
  companyName: string | null;
  setCompany: (id: string, name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  token: null,
  isLoading: true,
  logout: () => {},
  reloadAuth: async () => {},

  companyID: null,
  companyName: null,
  setCompany: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);

    const storedToken = await SecureStore.getItemAsync("authToken");
    const storedRole = await SecureStore.getItemAsync("role");
    const storedCompanyID = await SecureStore.getItemAsync("companyID");
    const storedCompanyName = await SecureStore.getItemAsync("companyName");

    if (storedToken) {
      const payload = parseJwt(storedToken);
      const now = Math.floor(Date.now() / 1000);
      if (payload?.exp && payload.exp > now) {
        setToken(storedToken);
        setRole(storedRole || null);
        setCompanyID(storedCompanyID || null);
        setCompanyName(storedCompanyName || null);
      } else {
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("role");
        await SecureStore.deleteItemAsync("companyID");
        await SecureStore.deleteItemAsync("companyName");
        setToken(null);
        setRole(null);
        setCompanyID(null);
        setCompanyName(null);
      }
    } else {
      setToken(null);
      setRole(null);
      setCompanyID(null);
      setCompanyName(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("companyID");
    await SecureStore.deleteItemAsync("companyName");
    setToken(null);
    setRole(null);
    setCompanyID(null);
    setCompanyName(null);
    router.replace("/(auth)/login");
  };

  const setCompany = async (id: string, name: string) => {
    await SecureStore.setItemAsync("companyID", id);
    await SecureStore.setItemAsync("companyName", name);
    setCompanyID(id);
    setCompanyName(name);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        isLoading,
        logout,
        reloadAuth: load,
        companyID,
        companyName,
        setCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
