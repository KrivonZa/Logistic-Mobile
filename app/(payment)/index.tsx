import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/libs/context/AuthContext";

interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  weight: number;
  dimensions: string;
}

interface Company {
  name: string;
  address?: string;
  phone?: string;
}

interface Params {
  item_id?: string;
  selected_company?: string;
}

const allItems: Item[] = [
  {
    id: "SP001",
    name: "Tủ lạnh Samsung Inverter",
    description: "Tủ lạnh 2 cánh, dung tích 300L, tiết kiệm điện năng.",
    image:
      "https://cdn.nguyenkimmall.com/images/detailed/666/10046329-tu-lanh-samsung-inverter-380l-rt38k50822c-sv-2.jpg",
    price: 12500000,
    weight: 70,
    dimensions: "60x65x170",
  },
  {
    id: "SP002",
    name: "Máy giặt Electrolux 9kg",
    description: "Máy giặt lồng ngang, công nghệ UltraMix, giặt sạch hiệu quả.",
    image:
      "https://th.bing.com/th/id/R.3644ab582d4e8112fb23d0ebdd2d0e12?rik=3v14%2fsWDST4qVA&riu=http%3a%2f%2fdienlanhbavinh.com%2fwp-content%2fuploads%2f2018%2f12%2fIMG_20180526_2151221.jpg&ehk=1zvMH88OFvoTe%2boDRYGxGtqBXyBuDTlBWyZL2zAP2XE%3d&risl=&pid=ImgRaw&r=0",
    price: 8900000,
    weight: 65,
    dimensions: "60x55x85",
  },
  {
    id: "SP003",
    name: "Laptop Dell XPS 15",
    description: "Laptop cao cấp với màn hình 4K sắc nét, RAM 16GB, SSD 512GB.",
    image:
      "https://th.bing.com/th/id/OIP.hSos162cCyBM6uVNiOFmFQHaE8?rs=1&pid=ImgDetMain",
    price: 35000000,
    weight: 1.8,
    dimensions: "35.7x23.5x1.8",
  },
];

type Navigation = ReturnType<typeof useNavigation>;

export default function CheckoutScreen() {
  const navigation = useNavigation<Navigation>();
  const params = useLocalSearchParams<Params>();
  const { item_id, selected_company } = params;
  const { companyID, companyName } = useAuth();
  console.log(companyID, companyName);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCompanyInfo, setSelectedCompanyInfo] =
    useState<Company | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [deliveryDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(14, 30, 0, 0);
    return now;
  });

  useEffect(() => {
    if (item_id) {
      const foundItem = allItems.find((item) => item.id === item_id);
      setSelectedItem(foundItem || null);
    }
    if (selected_company) {
      try {
        setSelectedCompanyInfo(JSON.parse(selected_company) as Company);
      } catch (e) {
        console.error("Failed to parse selected_company:", e);
      }
    }
  }, [item_id, selected_company]);

  const handleProceedToPayment = () => {
    if (
      !selectedItem ||
      !selectedCompanyInfo ||
      !recipientName ||
      !recipientPhone ||
      !recipientAddress
    ) {
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin và chọn hàng/nhà xe."
      );
      return;
    }

    const shippingFee = selectedItem.weight * 5000 + 20000;
    const totalAmount = selectedItem.price + shippingFee;

    router.push({
      pathname: "/(payment)",
      params: {
        item_id: selectedItem.id,
        selected_company: JSON.stringify(selectedCompanyInfo),
        recipientName,
        recipientPhone,
        recipientAddress,
        deliveryDate: deliveryDate.toISOString(),
        totalAmount: totalAmount.toString(),
      },
    });
  };

  if (!selectedItem) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600 text-lg">
          Đang tải thông tin hàng hóa...
        </Text>
      </View>
    );
  }

  const shippingFee = selectedItem.weight * 5000 + 20000;
  const formattedShippingFee = shippingFee.toLocaleString("vi-VN") + " VNĐ";
  const formattedItemPrice =
    selectedItem.price.toLocaleString("vi-VN") + " VNĐ";
  const totalAmount = selectedItem.price + shippingFee;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Chi tiết hàng hóa
            </Text>
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: selectedItem.image }}
                className="w-20 h-20 rounded-md mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-label">
                  {selectedItem.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  Mã: {selectedItem.id}
                </Text>
                <Text className="text-base font-bold text-blue-600 mt-1">
                  {formattedItemPrice}
                </Text>
              </View>
            </View>
            <View className="border-t border-gray-200 pt-3">
              <Text className="text-base text-gray-700">
                Khối lượng: {selectedItem.weight} kg
              </Text>
              <Text className="text-base text-gray-700">
                Kích Measure: {selectedItem.dimensions} cm
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Nhà xe vận chuyển
            </Text>
            {selectedCompanyInfo ? (
              <View>
                <Text className="text-lg font-semibold text-blue-700 mb-1">
                  {selectedCompanyInfo.name}
                </Text>
                <Text className="text-base text-gray-600">
                  Địa chỉ: {selectedCompanyInfo.address || "Đang cập nhật"}
                </Text>
                <Text className="text-base text-gray-600">
                  Điện thoại: {selectedCompanyInfo.phone || "Đang cập nhật"}
                </Text>
              </View>
            ) : (
              <Text className="text-base text-red-500">
                Chưa chọn nhà xe. Vui lòng quay lại chọn nhà xe.
              </Text>
            )}
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Thông tin người nhận hàng
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-3 text-base"
              placeholder="Tên người nhận"
              value={recipientName}
              onChangeText={setRecipientName}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-3 text-base"
              placeholder="Số điện thoại người nhận"
              keyboardType="phone-pad"
              value={recipientPhone}
              onChangeText={setRecipientPhone}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 text-base"
              placeholder="Địa chỉ nhận hàng chi tiết"
              multiline
              numberOfLines={3}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
            />
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Giờ nhận hàng mong muốn
            </Text>
            <View className="border border-gray-300 rounded-md p-3 flex-row items-center justify-between bg-gray-50">
              <Text className="text-base text-gray-700 font-semibold">
                {deliveryDate.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                - 14:30
              </Text>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#6b7280"
              />
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Tổng kết đơn hàng
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-base-unit text-gray-700">
                Giá trị hàng hóa:
              </Text>
              <Text className="text-base-unit font-semibold text-gray-800">
                {formattedItemPrice}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-base-unit text-gray-700">
                Phí vận chuyển (ước tính):
              </Text>
              <Text className="text-base-unit font-semibold text-gray-800">
                {formattedShippingFee}
              </Text>
            </View>
            <View className="border-t border-gray-200 mt-2 pt-2 flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">
                Tổng cộng:
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleProceedToPayment}
            className="bg-green-600 py-4 rounded-lg flex-row items-center justify-center mb-6"
          >
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={24}
              color="#fff"
            />
            <Text className="text-white text-xl font-bold ml-2">
              Tiếp tục thanh toán
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
