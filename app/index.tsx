import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("role");

      // Nếu đã đăng nhập, redirect đến khu vực tương ứng
      if (storedToken) {
        if (role === "Customer") {
          router.replace("/(tabs)");
        } else if (role === "Driver") {
          router.replace("/(driver)");
        }
      } else {
      }
    };

    checkTokenAndNavigate();
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      className="bg-primary"
    >
      <Image
        source={require("@/assets/images/transparent-icon.png")}
        style={{ width: 200, height: 200, resizeMode: "contain" }}
      />
    </View>
  );
}
