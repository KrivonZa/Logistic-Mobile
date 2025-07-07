import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  name: string;
  avatar: string;
}

const ChatHeader = ({ name, avatar }: Props) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center px-4 py-2 pt-10 bg-primary">
      <View className="flex-row items-center gap-x-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: avatar }}
          className="w-10 h-10 rounded-full ml-2"
        />
        <Text className="text-lg font-semibold text-white">{name}</Text>
      </View>

      <View className="flex-row items-center gap-x-4">
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="information-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
