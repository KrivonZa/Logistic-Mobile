import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function StackLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#005cb8",
        },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Chi tiết đơn" }} />
      <Stack.Screen name="update" options={{ title: "Cập nhật hình ảnh" }} />
    </Stack>
  );
}
