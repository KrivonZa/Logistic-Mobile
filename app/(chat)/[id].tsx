import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import debounce from "lodash/debounce";

import { useAppDispatch } from "@/libs/stores";
import {
  clearMessages,
  addMessageToLocal,
} from "@/libs/stores/chatManager/slice";
import { message } from "@/libs/stores/chatManager/thunk";
import { socket } from "@/libs/thirdParty/socket/socket";
import { useChat } from "@/libs/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import MessageList from "@/components/chat/MessageList";
import * as SecureStore from "expo-secure-store";

export default function MessageScreen() {
  const dispatch = useAppDispatch();
  const { id, senderID, receiverID } = useLocalSearchParams();
  const { messages } = useChat();

  const [input, setInput] = useState("");
  const [myUserID, setMyUserID] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const actualReceiverID = myUserID === senderID ? receiverID : senderID;

  const handleTyping = useRef(
    debounce(() => {
      if (myUserID && actualReceiverID) {
        socket.emit("typing", {
          conversationID: id,
          senderID: myUserID,
          receiverID: actualReceiverID,
        });
      }
    }, 1000)
  ).current;

  // Get user ID from SecureStore
  useEffect(() => {
    (async () => {
      const accountID = await SecureStore.getItemAsync("accountID");
      setMyUserID(accountID);
    })();
  }, []);

  // Fetch messages on focus
  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      dispatch(message(`${id}`));
      return () => dispatch(clearMessages());
    }, [id])
  );

  // Socket room join/leave
  useEffect(() => {
    if (!id) return;

    socket.emit("join_room", { conversationID: id });
    return () => {
      socket.emit("leave_room", { conversationID: id });
    };
  }, [id]);

  // Join user room
  useEffect(() => {
    if (myUserID) {
      socket.emit("join_user_room", { userID: myUserID });
    }
  }, [myUserID]);

  // Init socket listeners
  useEffect(() => {
    socket.connect();

    const handleReceiveMessage = (newMessage: any) => {
      dispatch(addMessageToLocal(newMessage));
    };

    const handleTypingReceived = (data: any) => {
      if (data?.conversationID === id && data.senderID !== myUserID) {
        setIsTyping(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsTyping(false), 2500);
      }
    };

    const handleConversationUpdated = (data: any) => {
      if (data?.conversationID === id) {
        dispatch(message(`${id}`));
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTypingReceived);
    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTypingReceived);
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [id, myUserID]);

  const handleSend = () => {
    if (!input.trim() || !myUserID || !actualReceiverID) return;

    socket.emit("send_message", {
      conversationID: id,
      senderID: myUserID,
      receiverID: actualReceiverID,
      content: input.trim(),
    });

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View className="flex-1 p-4">
        <MessageList
          messages={messages}
          myUserID={myUserID}
          flatListRef={flatListRef}
        />

        <View className="pt-1 mt-1">
          <Text
            className={`text-gray-400 italic pb-1 ${
              isTyping ? "opacity-100" : "opacity-0"
            }`}
          >
            Đang nhập...
          </Text>

          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base"
              placeholder="Nhắn tin"
              value={input}
              onChangeText={(text) => {
                setInput(text);
                handleTyping();
              }}
              numberOfLines={3}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity onPress={handleSend} className="ml-2">
              <Ionicons name="send" size={24} color="#005cb8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
