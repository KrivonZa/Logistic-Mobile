import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/libs/context/AuthContext";

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white pt-8 px-6">
      <View className="flex-col items-center mb-10">
        <Image
          source={{
            uri: user?.account.avatar,
          }}
          style={{ width: 150, height: 150 }}
          className="border-2 border-primary rounded-full"
        />
        <Text className="text-3xl font-bold text-label mt-5">
          {user?.account.fullName}
        </Text>
        <Text className="text-base text-label">{user?.account.email}</Text>

        {/* <TouchableOpacity className="bg-secondary px-12 py-4 rounded-full shadow-md">
          <Text className="text-white text-center font-bold text-xl">
            Nâng cấp <Text className="font-extrabold">PREMIUM</Text>
          </Text>
        </TouchableOpacity> */}
      </View>

      <View className="flex-col gap-y-4 pb-32">
        <Link href="/(profile)" asChild>
          <TouchableOpacity className="bg-gray-100 px-5 py-4 rounded-2xl shadow-sm">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons
                  name="person-outline"
                  size={28}
                  color="#2A2A2A"
                />
                <Text className="text-xl font-medium text-label">
                  Thông tin cá nhân
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/(chat)" asChild>
          <TouchableOpacity className="bg-gray-100 px-5 py-4 rounded-2xl shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons
                  name="messenger-outline"
                  size={28}
                  color="#2A2A2A"
                />
                <Text className="text-xl font-medium text-label">Tin nhắn</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/(notification)" asChild>
          <TouchableOpacity className="bg-gray-100 px-5 py-4 rounded-2xl shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons
                  name="notifications-none"
                  size={28}
                  color="#2A2A2A"
                />
                <Text className="text-xl font-medium text-label">
                  Thông báo
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          className="bg-gray-100 px-5 py-4 rounded-2xl shadow-sm mt-4"
          onPress={() => {
            Alert.alert(
              "Xác nhận Đăng xuất",
              "Bạn có chắc muốn đăng xuất khỏi tài khoản không?",
              [
                { text: "Hủy", style: "cancel" },
                { text: "Đăng xuất", onPress: logout, style: "destructive" },
              ]
            );
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-4">
              <MaterialIcons name="logout" size={28} color="#D32F2F" />
              <Text className="text-xl font-medium text-red-600">
                Đăng xuất
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
