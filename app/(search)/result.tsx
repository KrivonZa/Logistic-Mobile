import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRoute } from "@/libs/hooks/useRoute";
import type { RouteWithWaypoints } from "@/libs/types/route";

export default function ResultScreen() {
  const { fromLocation, toLocation } = useLocalSearchParams();
  const router = useRouter();
  const { routes } = useRoute();

  const renderBusRouteItem = ({ item }: { item: RouteWithWaypoints }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200 flex-row items-center"
      onPress={() =>
        router.push({
          pathname: `/(company)`,
          params: {
            title: item.Company.Account.fullName ?? "Không tên",
            routeID: item.routeID,
          },
        })
      }
    >
      <Image
        source={{
          uri:
            item.Company.Account.avatar ||
            "https://via.placeholder.com/50x50.png?text=No+Avatar",
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          resizeMode: "cover",
          marginRight: 12,
        }}
      />
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary mb-1">
          {item.Company.Account.fullName || "Không rõ tài xế"}
        </Text>
        <Text className="text-sm text-accent">
          {item.Company.address || "Chưa có địa chỉ"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="p-4 bg-primary border-b border-gray-200 shadow-sm">
        <Text className="text-xl font-bold text-white mb-4">
          Kết quả tìm kiếm
        </Text>

        <View className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 mb-3 shadow-md border border-gray-100">
          <MaterialIcons name="my-location" size={20} color="#005cb8" />
          <Text className="flex-1 ml-3 text-label text-base font-semibold">
            {fromLocation || "Chưa xác định"}
          </Text>
        </View>

        <View className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 mb-4 shadow-md border border-gray-100">
          <MaterialIcons name="location-on" size={20} color="#FF712C" />
          <Text className="flex-1 ml-3 text-label text-base font-semibold">
            {toLocation || "Chưa xác định"}
          </Text>
        </View>
      </View>

      {/* Danh sách chuyến */}
      <FlatList
        data={routes}
        renderItem={renderBusRouteItem}
        keyExtractor={(item) => item.routeID}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons
              name="sentiment-dissatisfied"
              size={48}
              color="#6B7280"
            />
            <Text className="mt-4 text-lg text-label text-center">
              Không tìm thấy chuyến xe nào phù hợp.
            </Text>
          </View>
        }
      />
    </View>
  );
}
