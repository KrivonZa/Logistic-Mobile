import { Stack } from "expo-router";
import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";

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
      <Stack.Screen name="index" options={{ title: "Các tin nhắn" }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Tin nhắn",
          headerTitleAlign: "left",
          header: () => <ChatHeader />,
        }}
      />
    </Stack>
  );
}
