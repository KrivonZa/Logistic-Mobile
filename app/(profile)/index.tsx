import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const user = {
    fullName: "Đặng Văn Lâm",
    email: "lam@example.com",
    phone: "0987654321",
    gender: "Nam",
    birthday: "1995-03-15",
    joinDate: "2022-01-10",
    address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    avatarUrl: "https://i.pravatar.cc/150",
  };

  const infoItems = [
    { label: "Email", value: user.email },
    { label: "Số điện thoại", value: user.phone },
    { label: "Giới tính", value: user.gender },
    { label: "Ngày sinh", value: user.birthday },
    { label: "Ngày tham gia", value: user.joinDate },
    { label: "Địa chỉ", value: user.address },
  ];

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      {/* Avatar Section */}
      <View className="items-center mb-8">
        <View className="relative">
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-36 h-36 rounded-full border-4 border-white shadow-md"
          />
          <TouchableOpacity className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow">
            <MaterialIcons name="edit" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
        <Text className="mt-4 text-2xl font-bold text-gray-800">{user.fullName}</Text>
        <Text className="text-base text-gray-500">Thông tin cá nhân</Text>
      </View>

      {/* Information Section */}
      <View className="bg-primary rounded-2xl px-5 py-6 shadow-md">
        <TouchableOpacity className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
          <MaterialIcons name="edit" size={20} color="#2563EB" />
        </TouchableOpacity>

        {infoItems.map((item, index) => (
          <View key={index} className="mb-4 border-b border-white/20 pb-3">
            <Text className="text-white/80 text-sm font-semibold">{item.label}</Text>
            <Text className="text-white text-base font-medium">{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
