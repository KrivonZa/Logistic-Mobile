import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch } from "@/libs/stores";
import { getCreatedOrderDelivery } from "@/libs/stores/orderManager/thunk";
import { useOrder } from "@/libs/hooks/useOrder";
import { useRouter } from "expo-router";

export default function OrderScreen() {
  const dispatch = useAppDispatch();
  const { loading, orderDeliveries } = useOrder();
  const router = useRouter();

  useEffect(() => {
    dispatch(getCreatedOrderDelivery());
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 mx-3 shadow-md"
        onPress={() => router.push(`/order/${item.orderID}`)}
      >
        <View className="flex-row gap-3">
          <Image
            source={{ uri: item.pickUpImage }}
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={{ uri: item.dropDownImage }}
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
          <View className="flex-1 justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              Đơn hàng #{item.orderID.slice(0, 6)}...
            </Text>
            <Text className="text-sm text-gray-500">
              Ghi chú: {item.payloadNote || "Không có"}
            </Text>
            <Text className="text-sm text-gray-600">
              Trạng thái:{" "}
              <Text
                className={
                  item.status === "pending"
                    ? "text-yellow-500"
                    : item.status === "delivered"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {item.status}
              </Text>
            </Text>
            <Text className="text-sm text-gray-500">
              Ngày tạo: 
            </Text>
            <Text className="text-base font-bold text-blue-600 mt-1">
              Giá: {item.price.toLocaleString()}đ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 pt-4">
      <Text className="text-2xl font-bold text-center text-primary mb-4">
        Tất cả đơn hàng
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
      ) : (
        <FlatList
          data={orderDeliveries}
          keyExtractor={(item) => item.orderID}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
