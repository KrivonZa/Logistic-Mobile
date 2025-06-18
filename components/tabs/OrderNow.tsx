import React from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type Order = {
  id: string;
  productName: string;
  from: string;
  to: string;
  status: string;
  price: number;
};

const orders: Order[] = [
  {
    id: "W94235675472RD",
    productName: "Giày sneaker nam",
    from: "Kho San Diego",
    to: "New York",
    status: "On way",
    price: 660000,
  },
  {
    id: "X83475839213ZZ",
    productName: "Xoài tươi",
    from: "Cần Thơ",
    to: "TP.HCM",
    status: "Delivered",
    price: 120000,
  },
  {
    id: "A1122334455VN",
    productName: "Laptop ASUS ROG",
    from: "Hà Nội",
    to: "Đà Nẵng",
    status: "Pending",
    price: 18500000,
  },
  {
    id: "P9988776655US",
    productName: "Thiết bị y tế",
    from: "Los Angeles",
    to: "Chicago",
    status: "On way",
    price: 2000000,
  },
  {
    id: "F6655443322DE",
    productName: "Bộ dụng cụ Đức",
    from: "Berlin",
    to: "Paris",
    status: "Returned",
    price: 850000,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "On way":
      return "text-green-600";
    case "Delivered":
      return "text-gray-500";
    case "Pending":
      return "text-yellow-500";
    case "Returned":
      return "text-red-500";
    default:
      return "text-gray-700";
  }
};

type OrderCardProps = {
  item: Order;
};

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200 flex-row">
      <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mr-4">
        <Image
          source={require("@/assets/images/icons/truck.png")}
          style={{ width: 40, height: 40, resizeMode: "contain" }}
        />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-base mb-1">
          {item.productName}
        </Text>
        <Text className="text-xs text-gray-400 mb-2">Mã đơn: {item.id}</Text>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-500">Từ</Text>
            <Text className="text-sm font-medium text-gray-700">
              {item.from}
            </Text>
            <Text className="text-xs text-gray-500 mt-2">Đến</Text>
            <Text className="text-sm font-medium text-gray-700">
              {item.to}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-xs text-gray-500">Trạng thái</Text>
            <Text className={`text-sm font-semibold ${getStatusColor(item.status)}`}>
              {item.status}
            </Text>

            <Text className="text-xs text-gray-500 mt-2">Cước phí</Text>
            <Text className="text-sm font-semibold text-green-700">
              {item.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const OrderNow: React.FC = () => {
  return (
    <View className="flex-1 p-4 pb-24 bg-gray-50">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Đơn cần giao hôm nay
      </Text>

      <FlatList
        scrollEnabled={false}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className="bg-primary mx-auto py-4 items-center rounded-full shadow-lg mt-6"
        style={{ width: width * 0.7 }}
      >
        <Text className="text-lg font-semibold text-white">Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderNow;
