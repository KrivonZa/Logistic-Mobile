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
import { useLocalSearchParams } from "expo-router";

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

  const dummyBusTrips: BusTrip[] = [
    {
      id: "1",
      operator: "FUTA Bus Lines",
      logo: "https://cdn.futabus.vn/img/img_logo.png",
      departureTime: "08:00 AM",
      arrivalTime: "01:00 PM",
      price: 250000,
      availableSeats: 30,
    },
    {
      id: "2",
      operator: "Phương Trang",
      logo: "https://futabus.vn/assets/images/phuongtrang_logo.svg",
      departureTime: "09:30 AM",
      arrivalTime: "02:30 PM",
      price: 265000,
      availableSeats: 25,
    },
    {
      id: "3",
      operator: "Thành Bưởi",
      logo: "https://thanhbuoibus.com/img/logo.png",
      departureTime: "10:00 AM",
      arrivalTime: "03:00 PM",
      price: 280000,
      availableSeats: 20,
    },
    {
      id: "4",
      operator: "Xe khách chất lượng cao",
      logo: "https://via.placeholder.com/50/FF712C/FFFFFF?text=XKC",
      departureTime: "11:00 AM",
      arrivalTime: "04:00 PM",
      price: 240000,
      availableSeats: 40,
    },
    {
      id: "5",
      operator: "Tuyến đường vàng",
      logo: "https://via.placeholder.com/50/005cb8/FFFFFF?text=TDV",
      departureTime: "12:00 PM",
      arrivalTime: "05:00 PM",
      price: 270000,
      availableSeats: 15,
    },
  ];

  const renderBusTripItem = ({ item }: { item: BusTrip }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 shadow-md border border-gray-100 flex-row items-center">
      <Image
        source={{ uri: item.logo }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          marginRight: 12,
          resizeMode: "contain",
        }}
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-bold text-primary">
            {item.operator}
          </Text>
          <Text className="text-base font-semibold text-accent">
            {item.price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
        <View className="flex-row items-center mb-0.5">
          <MaterialIcons name="schedule" size={16} color="#6B7280" />
          <Text className="ml-2 text-label text-sm">
            Giờ đi: {item.departureTime}
          </Text>
        </View>
        <View className="flex-row items-center mb-0.5">
          <MaterialIcons name="timelapse" size={16} color="#6B7280" />
          <Text className="ml-2 text-label text-sm">
            Giờ đến: {item.arrivalTime}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="event-seat" size={16} color="#6B7280" />
          <Text className="ml-2 text-label text-sm">
            Ghế trống: {item.availableSeats}
          </Text>
        </View>
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
