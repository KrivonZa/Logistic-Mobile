import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
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
          title: "Tìm chuyến xe",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="two-point"
        options={{
          title: "Tìm chuyến xe",
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: "Kết quả",
          headerTitleAlign: "left",
        }}
      />
    </Stack>
  );
}
