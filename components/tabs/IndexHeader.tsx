import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HomeHeader = () => {
  return (
    <View className="flex-row justify-between items-center px-4 py-2 pt-10 bg-subtle">
      {/* Bên trái: Avatar + Tên */}
      <View className="flex-row items-center space-x-2">
        <Image
          source={{ uri: "https://i.pravatar.cc/40" }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="text-lg font-semibold">Kevin</Text>
      </View>

      {/* Bên phải: Icons */}
      <View className="flex-row items-center gap-x-4">
        <Link href="/(notification)" asChild>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <Link href="/(chat)" asChild>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default HomeHeader;
