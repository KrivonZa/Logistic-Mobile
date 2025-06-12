import React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

interface BusTrip {
  id: string;
  operator: string;
  logo: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

const { width } = Dimensions.get("window");

export default function ResultScreen() {
  const { fromLocation, toLocation } = useLocalSearchParams();
  const router = useRouter();

  const dummyBusTrips: BusTrip[] = [
    {
      id: "1",
      operator: "Phương Trang",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsM9tWv0skH1wZ9S6ZcI4lPRAF1I-N2E5bRA&s",
      departureTime: "09:30 AM",
      arrivalTime: "02:30 PM",
      price: 265000,
      availableSeats: 25,
    },
    {
      id: "2",
      operator: "Thành Bưởi",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHf8-VhJeSV2SdtLEsmNLxNv3xBjLWkpK_bg&s",
      departureTime: "10:00 AM",
      arrivalTime: "03:00 PM",
      price: 280000,
      availableSeats: 20,
    },
  ];

  const renderBusTripItem = ({ item }: { item: BusTrip }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200 flex-row items-center"
      onPress={() =>
        router.push({
          pathname: `/(company)/${item.id}`,
          params: { title: item.operator },
        })
      }
    >
      <Image
        source={{ uri: item.logo }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          resizeMode: "contain",
          marginRight: 12,
        }}
      />
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary mb-1">
          {item.operator}
        </Text>
        <Text className="text-sm font-semibold text-accent">
          Giá vé từ: {item.price.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

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

      <FlatList
        data={dummyBusTrips}
        renderItem={renderBusTripItem}
        keyExtractor={(item) => item.id}
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
