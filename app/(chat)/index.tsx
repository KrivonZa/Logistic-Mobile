import { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { socket } from "@/libs/thirdParty/socket/socket";

import { conversation } from "@/libs/stores/chatManager/thunk";
import { Conversations } from "@/libs/types/chat";
import { useChat } from "@/libs/hooks/useChat";
import { useAppDispatch } from "@/libs/stores";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { clearConversation } from "@/libs/stores/chatManager/slice";

export default function ConversationListScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, conversations } = useChat();

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
    socket.connect();

    socket.on("conversation_updated", () => {
      // Gọi lại API để cập nhật danh sách hội thoại
      dispatch(conversation());
    });

    return () => {
      socket.off("conversation_updated");
      socket.disconnect();
    };
  }, []);

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
              source={{
                uri: "https://img.freepik.com/free-photo/close-up-upset-american-black-person_23-2148749582.jpg?semt=ais_hybrid&w=740",
              }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold">{item.senderName}</Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                {item.content}
              </Text>
            </View>
            <Text className="text-xs text-gray-400 ml-2">{item.createdAt}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
