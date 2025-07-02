import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#005cb8",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            bottom: 15,
            left: 10,
            right: 10,
            borderRadius: 30,
            elevation: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            marginHorizontal: 20,
          },
          default: {
            position: "absolute",
            bottom: 15,
            left: 10,
            right: 10,
            borderRadius: 30,
            elevation: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            marginHorizontal: 20,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          headerStyle: {
            backgroundColor: "#005cb8",
          },
          headerShown: true,
          headerTitle: "Tất cả đơn",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          title: "Tất cả đơn",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="receipt.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="package"
        options={{
          title: "Tất cả kiện hàng",
          headerStyle: {
            backgroundColor: "#005cb8",
          },
          headerShown: true,
          headerTitle: "Tất cả kiện hàng",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shippingbox.fill" color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                router.push("/(package)/create");
              }}
              style={{ marginRight: 12 }}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerStyle: {
            backgroundColor: "#005cb8",
          },
          headerShown: true,
          headerTitle: "Cá nhân",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          title: "Cá nhân",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
