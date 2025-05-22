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
  const { logout } = useAuth();

  return (
    <ScrollView className="py-6 px-6">
      <View className="flex-col items-center gap-y-5 mb-10">
        <Image
          source={{
            uri: "https://img.freepik.com/free-photo/close-up-upset-american-black-person_23-2148749582.jpg?semt=ais_hybrid&w=740",
          }}
          style={{ width: 150, height: 150 }}
          className="border-2 border-subtle rounded-full"
        />
        <Text className="text-2xl font-bold">Ông da đen</Text>

        {/* Nâng cấp lên PRO */}
        <TouchableOpacity className="bg-secondary px-10 py-4 rounded-full">
          <Text className="text-white text-center font-medium text-lg">
            Nâng cấp <Text className="font-semibold">PREMIUM</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-col gap-y-4">
        {/* Thông tin cá nhân */}
        <Link href="/(profile)" asChild>
          <TouchableOpacity className="bg-zinc-200 px-4 py-3 rounded-full">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons name="person" size={26} color="#9CA3AF" />
                <Text className="text-lg font-medium">Thông tin cá nhân</Text>
              </View>
              <MaterialIcons name="chevron-right" size={26} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </Link>

        {/* Cài đặt */}
        <Link href="/(profile)/setting" asChild>
          <TouchableOpacity className="bg-zinc-200 px-4 py-3 rounded-full">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons name="settings" size={26} color="#9CA3AF" />
                <Text className="text-lg font-medium">Cài đặt</Text>
              </View>
              <MaterialIcons name="chevron-right" size={26} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </Link>

        {/* Đăng xuất */}
        <TouchableOpacity
          className="bg-zinc-200 px-4 py-3 rounded-full"
          onPress={() => {
            Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất không?", [
              { text: "Hủy", style: "cancel" },
              { text: "Đăng xuất", onPress: logout },
            ]);
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-4">
              <MaterialIcons name="logout" size={26} color="#9CA3AF" />
              <Text className="text-lg font-medium">Đăng xuất</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
