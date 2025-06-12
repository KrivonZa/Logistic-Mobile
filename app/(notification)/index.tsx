import React from "react";
import {
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Notification {
  id: string;
  type: "payment" | "shipping" | "confirmation" | "general";
  title: string;
  description: string;
  time: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

export default function NotificationScreen() {
  const router = useRouter();

  const dummyNotifications: Notification[] = [
    {
      id: "1",
      type: "payment",
      title: "Thanh toán thành công",
      description:
        "Đơn hàng #DH123456 đã được thanh toán thành công vào lúc 14:15 ngày 10/06/2025. Cảm ơn quý khách!",
      time: "10/06/2025 14:15",
      iconName: "check-circle",
      iconColor: "#4CAF50",
    },
    {
      id: "2",
      type: "shipping",
      title: "Đang vận chuyển",
      description:
        "Đơn hàng #DH123456 của bạn đang trên đường giao. Dự kiến sẽ đến vào ngày 12/06/2025.",
      time: "10/06/2025 16:00",
      iconName: "local-shipping",
      iconColor: "#2196F3",
    },
    {
      id: "3",
      type: "confirmation",
      title: "Đã xác nhận đơn hàng",
      description:
        "Đơn hàng #DH123456 đã được xác nhận và đang chờ xử lý. Chúng tôi sẽ thông báo khi đơn hàng được gửi đi.",
      time: "10/06/2025 10:30",
      iconName: "assignment-turned-in",
      iconColor: "#FFC107",
    },
    {
      id: "4",
      type: "general",
      title: "Cập nhật chuyến đi của bạn",
      description:
        "Chuyến xe #TX789 đã khởi hành từ Dĩ An đúng giờ. Vui lòng chuẩn bị để nhận hàng tại điểm đến.",
      time: "10/06/2025 08:00",
      iconName: "info",
      iconColor: "#607D8B",
    },
    {
      id: "5",
      type: "shipping",
      title: "Giao hàng thành công",
      description:
        "Đơn hàng #DH789012 đã được giao thành công cho bạn vào lúc 09:00 ngày 09/06/2025.",
      time: "09/06/2025 09:00",
      iconName: "delivery-dining",
      iconColor: "#4CAF50",
    },
    {
      id: "6",
      type: "general",
      title: "Thông báo bảo trì hệ thống",
      description:
        "Hệ thống sẽ tạm dừng hoạt động từ 01:00 đến 03:00 sáng ngày 11/06/2025 để bảo trì. Mong quý khách thông cảm!",
      time: "10/06/2025 23:00",
      iconName: "build-circle",
      iconColor: "#EF5350",
    },
  ];

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 mx-4 shadow-sm border border-gray-100 flex-row items-start"
      onPress={() => {
        router.push({
          pathname: "/(notification)/detail",
          params: {
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            time: item.time,
            iconName: item.iconName.toString(), // đảm bảo là string
            iconColor: item.iconColor,
          },
        });
      }}
    >
      <View className="mr-3 mt-1">
        <MaterialIcons name={item.iconName} size={28} color={item.iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-label mb-1">{item.title}</Text>
        <Text className="text-gray-600 text-sm mb-2 leading-5">
          {item.description}
        </Text>
        <Text className="text-gray-500 text-xs text-right">{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <FlatList
        data={dummyNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons name="notifications-off" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-lg text-gray-500 text-center">
              Bạn chưa có thông báo nào.
            </Text>
          </View>
        }
      />
    </View>
  );
}
