import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const ChatHeader = () => {
  const router = useRouter(); // hook điều hướng

  return (
    <View className="flex-row justify-between items-center px-4 py-2 pt-10 bg-subtle">
      {/* Bên trái: Mũi tên Back + Avatar + Tên */}
      <View className="flex-row items-center gap-x-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/40" }}
          className="w-10 h-10 rounded-full ml-2"
        />
        <Text className="text-lg font-semibold text-white">Kevin</Text>
      </View>

      {/* Bên phải: Icons */}
      <View className="flex-row items-center gap-x-4">
        <Link href="/(notification)" asChild>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <Link href="/(chat)" asChild>
          <TouchableOpacity>
            <Ionicons
              name="information-circle"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default ChatHeader;
