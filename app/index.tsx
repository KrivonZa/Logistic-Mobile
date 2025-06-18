import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("role");
      if (storedToken) {
        if (role === "Customer") {
          router.push("/(tabs)");
        } else if (role === "Driver") {
          router.push("/(driver)");
        }
      } else {
        router.replace("/(auth)");
      }
    };
    const timeout = setTimeout(() => {
      setReady(true);
      checkTokenAndNavigate();
    }, 0);

    return () => clearTimeout(timeout);
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
