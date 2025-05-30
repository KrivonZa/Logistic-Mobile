import React from "react";
import { View, Text } from "react-native";

interface Props {
  title: string;
}

export default function TimeHeader({ title }: Props) {
  return (
    <View className="items-center my-2">
      <Text className="text-sm text-gray-400">{title}</Text>
    </View>
  );
}
