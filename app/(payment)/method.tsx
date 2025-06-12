import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PaymentMethodScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      title: "Chọn phương thức thanh toán",
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: "#005cb8" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [navigation]);

  const handleChoosePaymentMethod = (method) => {
    const {
      item_id,
      selected_company,
      recipientName,
      recipientPhone,
      recipientAddress,
      deliveryDate,
      totalAmount,
    } = params;

    console.log("Xác nhận đơn hàng với phương thức:", method);
    console.log("Chi tiết đơn hàng:", {
      item_id,
      selected_company: selected_company ? JSON.parse(selected_company) : null,
      recipientName,
      recipientPhone,
      recipientAddress,
      deliveryDate,
      totalAmount,
      paymentMethod: method,
    });

    Alert.alert(
      "Xác nhận thanh toán",
      `Bạn đã chọn phương thức: ${
        method === "bank_transfer"
          ? "Chuyển khoản Ngân hàng"
          : "Thanh toán trực tiếp"
      }. Đơn hàng sẽ được xử lý.`,
      [
        {
          text: "OK",
          onPress: () => {
            router.push("/(payment)/paid");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Vui lòng chọn phương thức thanh toán
        </Text>

        <TouchableOpacity
          className="bg-white rounded-lg shadow-md p-5 mb-5 flex-row items-center border border-blue-200"
          onPress={() => handleChoosePaymentMethod("bank_transfer")}
        >
          <MaterialCommunityIcons
            name="bank-transfer"
            size={40}
            color="#2563eb"
          />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-blue-700 mb-1">
              Chuyển khoản Ngân hàng
            </Text>
            <Text className="text-base text-gray-600">
              Chuyển khoản qua số tài khoản ngân hàng của chúng tôi.
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              (Thông tin tài khoản sẽ được hiển thị sau khi xác nhận)
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#6b7280"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-lg shadow-md p-5 mb-5 flex-row items-center border border-green-200"
          onPress={() => handleChoosePaymentMethod("cash_on_delivery")}
        >
          <MaterialCommunityIcons
            name="cash-multiple"
            size={40}
            color="#16a34a"
          />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-green-700 mb-1">
              Thanh toán trực tiếp
            </Text>
            <Text className="text-base text-gray-600">
              Thanh toán tiền mặt hoặc chuyển khoản khi nhận hàng.
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#6b7280"
          />
        </TouchableOpacity>

        <View className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Text className="text-base text-gray-700 text-center">
            Sau khi chọn phương thức, đơn hàng của bạn sẽ được gửi đi để xử lý.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
