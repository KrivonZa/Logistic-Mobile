import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/libs/context/AuthContext";
import { Alert } from "react-native";

export default function StackLayout() {
  const { logout } = useAuth();

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
      <Stack.Screen
        name="index"
        options={{
          title: "Thông tin cá nhân",
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất không?", [
                  { text: "Hủy", style: "cancel" },
                  { text: "Đăng xuất", onPress: logout },
                ]);
              }}
              style={{ marginRight: 12 }}
            >
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="edit" options={{ title: "Chỉnh sửa thông tin" }} />
    </Stack>
  );
}
