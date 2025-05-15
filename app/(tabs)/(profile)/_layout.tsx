import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Thông tin cá nhân" }} />
      <Stack.Screen name="setting" options={{ title: "Cài đặt" }} />
    </Stack>
  );
}
