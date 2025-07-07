import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useAppDispatch } from "@/libs/stores";
import { getCreatedOrderDelivery } from "@/libs/stores/orderManager/thunk";
import { useOrder } from "@/libs/hooks/useOrder";
import { useRouter } from "expo-router";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: undefined },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Chưa thanh toán", value: "unpaid" },
  { label: "Đã thanh toán", value: "paid" },
  { label: "Đã lên lịch", value: "scheduled" },
  { label: "Đang giao", value: "in_progress" },
  { label: "Đã giao", value: "delivered" },
  { label: "Từ chối", value: "reject" },
  { label: "Đã hủy", value: "canceled" },
];

export default function OrderScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, orderDeliveries, page, total } = useOrder();
  const limit = 10;

  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      getCreatedOrderDelivery({ page: 1, limit, isLoadMore: false, status })
    );
  }, [status]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      getCreatedOrderDelivery({ page: 1, limit, isLoadMore: false, status })
    );
    setRefreshing(false);
  };

  const loadMore = () => {
    if (orderDeliveries.length >= total || loading) return;
    dispatch(
      getCreatedOrderDelivery({
        page: page + 1,
        limit,
        isLoadMore: true,
        status,
      })
    );
  };

  const renderItem = ({ item }: any) => {
    const packageData = item.Package || {};
    const imageUri = packageData.packageImage;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/(order)/${item.orderID}`)}
        className="bg-white mx-4 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-200"
      >
        <View className="flex-row">
          <View className="w-32 h-32">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <Text className="text-gray-400 text-sm text-center px-2">
                  Không có ảnh
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 p-3 justify-between">
            <View className="flex-row justify-between items-start">
              <Text
                numberOfLines={1}
                className="text-base font-semibold text-gray-800 flex-1 pr-2"
              >
                #{item.orderID.slice(0, 10)}...
              </Text>
              <Text
                className={`text-xs font-medium rounded-full px-2 py-1 ${
                  item.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : item.status === "in_progress"
                    ? "bg-blue-100 text-blue-600"
                    : item.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : item.status === "unpaid"
                    ? "bg-orange-100 text-orange-600"
                    : item.status === "paid"
                    ? "bg-emerald-100 text-emerald-600"
                    : item.status === "scheduled"
                    ? "bg-indigo-100 text-indigo-600"
                    : item.status === "reject" || item.status === "canceled"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {(() => {
                  switch (item.status) {
                    case "pending":
                      return "Đang chờ";
                    case "unpaid":
                      return "Chưa thanh toán";
                    case "paid":
                      return "Đã thanh toán";
                    case "scheduled":
                      return "Đã lên lịch";
                    case "in_progress":
                      return "Đang giao";
                    case "delivered":
                      return "Đã giao";
                    case "reject":
                      return "Bị từ chối";
                    case "canceled":
                      return "Đã hủy";
                    default:
                      return item.status;
                  }
                })()}
              </Text>
            </View>

            <View className="mt-1">
              <Text className="text-sm text-gray-500">
                Ghi chú đơn:{" "}
                <Text className="text-gray-700 font-medium">
                  {item.payloadNote || "Không có"}
                </Text>
              </Text>

              {packageData.note ? (
                <Text className="text-sm text-gray-500">
                  Ghi chú kiện:{" "}
                  <Text className="text-gray-700 font-medium">
                    {packageData.note}
                  </Text>
                </Text>
              ) : null}

              <Text className="text-sm text-gray-500">
                Khối lượng:{" "}
                <Text className="text-gray-700 font-medium">
                  {packageData.packageWeight
                    ? `${packageData.packageWeight}g`
                    : "Không rõ"}
                </Text>
              </Text>

              <Text className="text-sm text-gray-500">
                Ngày tạo:{" "}
                <Text className="text-gray-700 font-medium">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </Text>

              <Text className="text-sm text-gray-500">
                Giá:{" "}
                <Text className="text-blue-600 font-semibold">
                  {item.price.toLocaleString()}đ
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-gray-100 pt-4 pb-20">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          alignItems: "center",
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value ?? "all"}
            onPress={() => setStatus(option.value)}
            className={`px-3 py-3 mr-2 rounded-full border ${
              status === option.value
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              numberOfLines={1}
              className={`text-base font-medium truncate ${
                status === option.value ? "text-white" : "text-gray-700"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
      ) : (
        <FlatList
          data={orderDeliveries}
          keyExtractor={(item) => item.orderID}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 4,
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={() =>
            loading ? <ActivityIndicator size="small" color="#3b82f6" /> : null
          }
          ListEmptyComponent={() => (
            <View className="items-center mt-20">
              <Text className="text-gray-400 text-base">
                Không có đơn hàng nào.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
