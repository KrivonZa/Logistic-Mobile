import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
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
      <Stack.Screen name="index" options={{ title: "Thông báo" }} />
      <Stack.Screen name="detail" options={{ title: "Chi tiết" }} />
    </Stack>
  );
}
