import React from "react";
import { View, Text, Image } from "react-native";

interface Props {
  message: {
    content: string;
    createdAt: string;
    senderName: string;
  };
  isSentByUser: boolean;
  isSameSenderAsPrevious?: boolean;
  isLastInGroup?: boolean;
}

export default function MessageItem({
  message,
  isSentByUser,
  isSameSenderAsPrevious,
  isLastInGroup,
}: Props) {
  return (
    <View>
      {/* Tên người gửi nếu là người nhận và không trùng người gửi trước đó */}
      {!isSentByUser && !isSameSenderAsPrevious && (
        <View className="flex-row justify-start ml-12">
          <Text className="text-sm text-gray-600">{message.senderName}</Text>
        </View>
      )}

      <View
        className={`flex-row items-end ${
          isSentByUser ? "justify-end" : "justify-start"
        } ${isSameSenderAsPrevious ? "mt-1" : "mt-2"}`}
      >
        {/* Nếu là người nhận, đặt avatar hoặc placeholder */}
        {!isSentByUser && (
          <View className="w-8 h-8 mr-2">
            {isLastInGroup ? (
              <Image
                source={{ uri: "https://i.pravatar.cc/40" }}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <View className="w-8 h-8" />
            )}
          </View>
        )}

        {/* Bubble */}
        <View
          className={`max-w-[70%] min-w-[30%] px-3 py-2 rounded-2xl ${
            isSentByUser ? "bg-primary" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-base ${
              isSentByUser ? "text-white" : "text-black"
            }`}
          >
            {message.content}
          </Text>

          {isLastInGroup && (
            <Text
              className={`text-[10px] mt-1 text-left ${
                isSentByUser ? "text-white/70" : "text-gray-600"
              }`}
            >
              {message.createdAt.slice(11)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
