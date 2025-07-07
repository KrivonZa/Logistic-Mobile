import { useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { socket } from "@/libs/thirdParty/socket/socket";
import { conversation } from "@/libs/stores/chatManager/thunk";
import { useChat } from "@/libs/hooks/useChat";
import { useAppDispatch } from "@/libs/stores";
import { clearConversation } from "@/libs/stores/chatManager/slice";
import { useAuth } from "@/libs/context/AuthContext";
import { Conversations } from "@/libs/types/chat";

export default function ConversationListScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, conversations } = useChat();
  const { user } = useAuth();

  const handlePress = (item: Conversations) => {
    const { conversationID, senderID, receiverID } = item;
    router.push({
      pathname: "/(chat)/[id]",
      params: { id: conversationID, senderID, receiverID },
    });
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(conversation());
      return () => {
        dispatch(clearConversation());
      };
    }, [])
  );

  useEffect(() => {
    socket?.connect();

    socket?.on("conversation_updated", () => {
      dispatch(conversation());
    });

    return () => {
      socket?.off("conversation_updated");
      socket?.disconnect();
    };
  }, []);

  const getAvatar = (item: Conversations) =>
    item.senderID === user?.account.accountID
      ? item.avatarReceiver
      : item.avatarSender;

  const getDisplayName = (item: Conversations) =>
    item.senderID === user?.account.accountID
      ? item.receiverName
      : item.senderName;

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversationID}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() => handlePress(item)}
          >
            <Image
              source={{ uri: getAvatar(item) }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold">
                {getDisplayName(item)}
              </Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                {item.content}
              </Text>
            </View>
            <Text className="text-xs text-gray-400 ml-2">{item.createdAt}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-400 text-base">
              Không có đoạn chat nào.
            </Text>
          </View>
        }
      />
    </View>
  );
}
