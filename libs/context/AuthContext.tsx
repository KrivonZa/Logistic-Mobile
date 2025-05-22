// AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { parseJwt } from "@/libs/utils/auth";
import { router } from "expo-router";

type AuthContextType = {
  role: string | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  reloadAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  token: null,
  isLoading: true,
  logout: () => {},
  reloadAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const storedToken = await SecureStore.getItemAsync("authToken");
    const storedRole = await SecureStore.getItemAsync("role");

    if (storedToken) {
      const payload = parseJwt(storedToken);
      const now = Math.floor(Date.now() / 1000);
      if (payload?.exp && payload.exp > now) {
        setToken(storedToken);
        setRole(storedRole || null);
      } else {
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("role");
        setToken(null);
        setRole(null);
      }
    } else {
      setToken(null);
      setRole(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("role");
    setToken(null);
    setRole(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{ role, token, isLoading, logout, reloadAuth: load }}
    >
      {children}
    </AuthContext.Provider>
  );
};
