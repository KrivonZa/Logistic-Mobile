import React from "react";
import { Text, View, StatusBar, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import isAuth from "@/components/isAuth";

const DetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    title = "",
    description = "",
    time = "Không xác định",
    iconName = "info",
    iconColor = "#607D8B",
  } = params as {
    title?: string;
    description?: string;
    time?: string;
    iconName?: keyof typeof MaterialIcons.glyphMap;
    iconColor?: string;
  };

  if (!title) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <MaterialIcons
          name="sentiment-dissatisfied"
          size={48}
          color="#9CA3AF"
        />
        <Text className="mt-4 text-lg text-gray-600 text-center">
          Không tìm thấy thông tin chi tiết thông báo này.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary py-3 px-6 rounded-lg shadow-md"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-base">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="m-4 p-5 bg-white rounded-lg shadow-md border border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name={iconName} size={36} color={iconColor} />
          <Text className="ml-3 text-2xl font-bold text-label flex-1">
            {title}
          </Text>
        </View>

        <View className="border-t border-gray-200 pt-4 mt-4">
          <Text className="text-gray-700 text-base leading-6 mb-4">
            {description}
          </Text>
          <Text className="text-gray-500 text-sm text-right font-medium">
            Thời gian: {time}
          </Text>
        </View>
      </View>

      <View className="p-4 mt-auto">
        <TouchableOpacity className="w-full bg-secondary py-4 rounded-lg items-center justify-center shadow-lg">
          <Text className="text-white text-lg font-semibold">
            Xem chi tiết đơn hàng
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default isAuth(DetailScreen, ["Customer", "Driver"]);
