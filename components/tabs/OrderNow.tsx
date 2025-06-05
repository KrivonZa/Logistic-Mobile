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
    productName: "The pair of sneakers",
    from: "San Diego",
    to: "New York",
    status: "On way",
    price: 660000,
  },
  {
    id: "X83475839213ZZ",
    productName: "Fresh mango boxes",
    from: "Can Tho",
    to: "Ho Chi Minh City",
    status: "Delivered",
    price: 120000,
  },
  {
    id: "A1122334455VN",
    productName: "Laptop ASUS ROG",
    from: "Hanoi",
    to: "Da Nang",
    status: "Pending",
    price: 18500000,
  },
  {
    id: "P9988776655US",
    productName: "Medical supplies",
    from: "Los Angeles",
    to: "Chicago",
    status: "On way",
    price: 2000000,
  },
  {
    id: "F6655443322DE",
    productName: "German Tools Kit",
    from: "Berlin",
    to: "Paris",
    status: "Returned",
    price: 850000,
  },
];

type OrderCardProps = {
  item: Order;
};

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-6 shadow-lg shadow-tertiary flex-row items-start border-2 border-primary">
      {/* Placeholder to icon xe tải (lớn hơn) */}
      <View className="w-20 h-20 rounded-full border border-secondary bg-gray-100 justify-center items-center mr-4">
        <Image
          source={require("@/assets/images/icons/tracking.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item.productName}
        </Text>
        <Text className="text-xs text-gray-400 mb-2">{item.id}</Text>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-500">Từ:</Text>
            <Text className="text-sm text-gray-700 font-medium">
              {item.from}
            </Text>

            <View className="w-0.5 h-3 bg-indigo-300 mx-2 my-0.5" />

            <Text className="text-xs text-gray-500">Đến:</Text>
            <Text className="text-sm text-gray-700 font-medium">{item.to}</Text>
          </View>

          <View className="items-end">
            <Text className="text-xs text-gray-500">Trạng thái:</Text>
            <Text className="text-sm font-medium text-indigo-600">
              {item.status}
            </Text>

            <Text className="text-xs text-gray-500 mt-2">Giá:</Text>
            <Text className="text-sm font-semibold text-green-600">
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
    <View className="flex-1 p-4 pb-24">
      <Text className="text-lg font-bold text-gray-800 mb-6">
        Đơn hàng hiện tại của bạn
      </Text>
      <FlatList
        scrollEnabled={false}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className="bg-primary mx-auto py-4 items-center rounded-full shadow-lg shadow-tertiary"
        style={{ width: width * 0.7 }}
      >
        <Text className="text-lg font-semibold text-white">
          Tất cả đơn hàng
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderNow;
