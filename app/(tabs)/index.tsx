import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const storedRole = await SecureStore.getItemAsync("role");
      setToken(storedToken);
      setRole(storedRole);
    };

    fetchAuthData();
  }, []);

  return (
    <View className="px-10 flex-1 justify-center items-center">
      <Text className="text-4xl text-center mb-4">
        Whereas disregard and contempt for human rights have resulted
      </Text>
      <Text className="text-lg">Token: {token ?? "Không có"}</Text>
      <Text className="text-lg">Role: {role ?? "Không có"}</Text>
    </View>
  );
}
