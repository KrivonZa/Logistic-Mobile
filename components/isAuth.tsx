import { useEffect, useState } from "react";
import { useAuth } from "@/libs/context/AuthContext";
import { Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function isAuth(Component: any, allowedRoles: string[] = []) {
  return function IsAuth(props: any) {
    const { role, isLoading } = useAuth();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (isLoading) return;

      if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
        Alert.alert(
          "Tài khoản không hợp lệ",
          "Bạn không có quyền truy cập vào phần này"
        );
        router.replace("/(auth)/login");
      } else {
        setAuthorized(true);
      }
    }, [role, isLoading]);

    if (isLoading || !authorized) return <ActivityIndicator />;
    return <Component {...props} />;
  };
}
