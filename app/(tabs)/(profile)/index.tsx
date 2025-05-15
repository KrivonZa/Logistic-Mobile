import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView className="py-6 px-6">
      <View className="flex-col items-center gap-y-5 mb-10">
        <Image
          source={{
            uri: "https://www.google.com/favicon.ico",
          }}
          style={{ width: 150, height: 150 }}
          className="border-2 border-subtle rounded-full"
        />
        <Text className="text-2xl font-bold">Đặng Văn Lâm</Text>
      </View>

      <View className="flex-col gap-y-6">
        {/* Thông tin cá nhân */}
        <TouchableOpacity>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-x-4">
              <MaterialIcons name="person" size={32} color="#00b3d6" />
              <Text className="text-lg font-semibold">Thông tin cá nhân</Text>
            </View>
            <MaterialIcons name="chevron-right" size={32} color="#00b3d6" />
          </View>
        </TouchableOpacity>

        {/* Cài đặt */}
        <Link href="/setting" asChild>
          <TouchableOpacity>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-x-4">
                <MaterialIcons name="settings" size={32} color="#00b3d6" />
                <Text className="text-lg font-semibold">Cài đặt</Text>
              </View>
              <MaterialIcons name="chevron-right" size={32} color="#00b3d6" />
            </View>
          </TouchableOpacity>
        </Link>

        {/* Đăng xuất */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-x-4">
            <MaterialIcons name="logout" size={20} color="#03045e" />
            <Text>Đăng xuất</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#03045e" />
        </View>
      </View>
    </ScrollView>
  );
}
