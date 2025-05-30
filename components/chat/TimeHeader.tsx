import React from "react";
import { View, Text } from "react-native";

interface Props {
  title: string;
}

export default function TimeHeader({ title }: Props) {
  return (
    <View className="items-center my-1">
      <Text className="text-[10px] text-gray-400">{title}</Text>
    </View>
  );
}
