import { useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/libs/stores";
import { detailOrderDelivery } from "@/libs/stores/orderManager/thunk";
import { useOrder } from "@/libs/hooks/useOrder";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, detailOrder } = useOrder();

  useEffect(() => {
    if (id) dispatch(detailOrderDelivery(id));
  }, [id]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "unpaid":
        return "Chưa thanh toán";
      case "in_progress":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "reject":
        return "Bị từ chối";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "unpaid":
        return "text-orange-500";
      case "in_progress":
        return "text-blue-500";
      case "delivered":
        return "text-green-600";
      case "reject":
      case "canceled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading || !detailOrder) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const transaction = detailOrder.transaction;
  const showPaymentButton =
    detailOrder.status === "unpaid" &&
    (!transaction || transaction.status !== "PAID");

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">
      {/* Tiêu đề */}
      <Text className="text-xl font-bold text-gray-800 mb-3">
        Chi tiết đơn hàng #{detailOrder.orderID.slice(0, 8)}...
      </Text>

      {/* Trạng thái + ngày */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 mb-1">
          Trạng thái:{" "}
          <Text
            className={`font-semibold ${getStatusColor(detailOrder.status)}`}
          >
            {getStatusLabel(detailOrder.status)}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Ngày tạo:{" "}
          <Text className="font-medium text-gray-800">
            {new Date(detailOrder.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </Text>
      </View>

      {/* Nút thanh toán nếu cần */}
      {showPaymentButton && transaction?.checkoutUrl && (
        <TouchableOpacity
          className="bg-blue-600 px-4 py-3 rounded-xl mb-4"
          onPress={() =>
            router.push({
              pathname: "/(payment)/paid",
              params: {
                checkoutUrl: transaction.checkoutUrl,
                orderID: detailOrder.orderID,
              },
            })
          }
        >
          <Text className="text-white text-center font-semibold">
            Thanh toán ngay
          </Text>
        </TouchableOpacity>
      )}

      {/* Người gửi */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Người gửi
        </Text>
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: detailOrder.customer.avatar }}
            className="w-12 h-12 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">
              {detailOrder.customer.fullName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {detailOrder.customer.phoneNumber}
            </Text>
            <Text className="text-gray-500 text-sm">
              {detailOrder.customer.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Gói hàng */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Gói hàng
        </Text>
        <Text className="text-sm text-gray-600">
          Tên:{" "}
          <Text className="font-medium text-gray-800">
            {detailOrder.package.packageName}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Ghi chú:{" "}
          <Text className="text-gray-700 font-medium">
            {detailOrder.package.note || "Không có"}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Khối lượng:{" "}
          <Text className="text-gray-700 font-medium">
            {detailOrder.package.packageWeight}kg
          </Text>
        </Text>
        {detailOrder.package.packageImage && (
          <Image
            source={{ uri: detailOrder.package.packageImage }}
            className="w-full h-40 mt-3 rounded-lg"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Tuyến đường */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Tuyến đường
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Tuyến:{" "}
          <Text className="text-gray-800 font-medium">
            {detailOrder.route.routeName}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Điểm nhận:{" "}
          <Text className="text-gray-800">
            {detailOrder.pickUpPoint.location}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Điểm trả:{" "}
          <Text className="text-gray-800">
            {detailOrder.dropDownPoint.location}
          </Text>
        </Text>
      </View>

      {/* Ghi chú đơn hàng nếu có */}
      {detailOrder.payloadNote && (
        <View className="bg-white p-4 rounded-xl shadow mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Ghi chú đơn hàng
          </Text>
          <Text className="text-sm text-gray-700">
            {detailOrder.payloadNote}
          </Text>
        </View>
      )}

      {/* Hình ảnh giao nhận nếu có */}
      {(detailOrder.pickUpImage || detailOrder.dropDownImage) && (
        <View className="bg-white p-4 rounded-xl shadow mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Hình ảnh giao nhận
          </Text>
          {detailOrder.pickUpImage ? (
            <View className="mb-2">
              <Text className="text-sm text-gray-600 mb-1">Điểm nhận:</Text>
              <Image
                source={{ uri: detailOrder.pickUpImage }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
            </View>
          ) : null}
          {detailOrder.dropDownImage ? (
            <View>
              <Text className="text-sm text-gray-600 mb-1">Điểm trả:</Text>
              <Image
                source={{ uri: detailOrder.dropDownImage }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
            </View>
          ) : null}
        </View>
      )}

      {/* Thông tin thanh toán nếu có */}
      {transaction && (
        <View className="bg-white p-4 rounded-xl shadow mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Thông tin thanh toán
          </Text>
          <Text className="text-sm text-gray-600">
            Phương thức:{" "}
            <Text className="text-gray-800 font-medium">
              {transaction.method}
            </Text>
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Trạng thái:{" "}
            <Text className="text-gray-800 font-medium">
              {transaction.status}
            </Text>
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Thời gian:{" "}
            <Text className="text-gray-800 font-medium">
              {new Date(transaction.createdAt).toLocaleString("vi-VN")}
            </Text>
          </Text>
        </View>
      )}

      {/* Giá */}
      <View className="bg-white p-4 rounded-xl shadow mb-8">
        <Text className="text-sm text-gray-600">
          Tổng giá:{" "}
          <Text className="text-blue-600 font-semibold text-lg">
            {detailOrder.price.toLocaleString()}đ
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
