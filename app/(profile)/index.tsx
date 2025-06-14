import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const user = {
    fullName: "Đặng Văn Lâm",
    email: "lam@example.com",
    phone: "0987654321",
    gender: "Nam",
    birthday: "1995-03-15",
    address:
      "123 Nguyễn Văn Cừ, Phường 5, Quận 5, Thành phố Hồ Chí Minh, Việt Nam, Chung cư ABC, Tầng 10, Căn hộ 101.",
    avatarUrl: "https://i.pravatar.cc/150",
  };

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-5 pb-6 items-center border-b border-gray-100 bg-white">
        <View className="relative mb-4">
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-32 h-32 rounded-full border-4 border-primary"
          />
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white shadow"
            onPress={() => console.log("Edit avatar")}
          >
            <MaterialIcons name="camera-alt" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-label mb-1">
          {user.fullName}
        </Text>
        <Text className="text-base text-gray-500">Thông tin cá nhân</Text>
      </View>

      <View className="px-5 py-6">
        <TouchableOpacity
          className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full shadow-sm"
          onPress={() => console.log("Edit user info")}
        >
          <MaterialIcons name="edit" size={20} color={"#005cb8"} />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-label mb-5">
          Chi tiết tài khoản
        </Text>

        <View className="flex-row items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
          <MaterialIcons name="email" size={24} color={"#005cb8"} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-semibold text-gray-700">Email</Text>
            <Text className="text-base text-label">{user.email}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
          <MaterialIcons name="phone" size={24} color={"#005cb8"} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-semibold text-gray-700">
              Số điện thoại
            </Text>
            <Text className="text-base text-label">{user.phone}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
          <MaterialIcons name="person" size={24} color={"#005cb8"} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-semibold text-gray-700">
              Giới tính
            </Text>
            <Text className="text-base text-label">{user.gender}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
          <MaterialIcons name="cake" size={24} color={"#005cb8"} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-semibold text-gray-700">
              Ngày sinh
            </Text>
            <Text className="text-base text-label">{user.birthday}</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
          <MaterialIcons
            name="location-on"
            size={24}
            color={"#005cb8"}
            className="mr-4"
          />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700">Địa chỉ</Text>
            <Text className="text-base text-label">{user.address}</Text>
          </View>
        </View>

        <View className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-base font-semibold text-blue-700 mb-2">
            Lưu ý quan trọng:
          </Text>
          <Text className="text-sm text-blue-600">
            Mọi thông tin cá nhân của bạn đều được bảo mật. Vui lòng liên hệ bộ
            phận hỗ trợ nếu có bất kỳ thắc mắc nào.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
