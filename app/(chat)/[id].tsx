import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import debounce from "lodash/debounce";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import { useAppDispatch } from "@/libs/stores";
import {
  clearMessages,
  addMessageToLocal,
} from "@/libs/stores/chatManager/slice";
import { message } from "@/libs/stores/chatManager/thunk";
import { getSocket } from "@/libs/thirdParty/socket/socket";
import { useChat } from "@/libs/hooks/useChat";

import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import isAuth from "@/components/isAuth";

import dayjs from "dayjs";

const MessageScreen = () => {
  const dispatch = useAppDispatch();
  const { id, senderID, receiverID } = useLocalSearchParams();
  const { messages } = useChat();

  const [input, setInput] = useState("");
  const [myUserID, setMyUserID] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList<any>>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const actualReceiverID = myUserID === senderID ? receiverID : senderID;

  const handleTyping = useRef(
    debounce(async () => {
      if (myUserID && actualReceiverID) {
        const socket = await getSocket();
        socket.emit("typing", {
          conversationID: id,
          senderID: myUserID,
          receiverID: actualReceiverID,
        });
      }
    }, 1000)
  ).current;

  useEffect(() => {
    (async () => {
      const accountID = await SecureStore.getItemAsync("accountID");
      setMyUserID(accountID);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      dispatch(message(`${id}`));
      return () => dispatch(clearMessages());
    }, [id])
  );

  useEffect(() => {
    if (!id || !myUserID) return;
    let socketRef: any;

    const setupSocket = async () => {
      const socket = await getSocket();
      socketRef = socket;

      socket.emit("join_room", { conversationID: id });
      socket.emit("join_user_room", { userID: myUserID });

      const handleReceiveMessage = (newMessage: any) => {
        const fixedMessage = {
          ...newMessage,
          createdAt: dayjs(newMessage.createdAt).format("DD-MM-YYYY HH:mm"),
        };
        dispatch(addMessageToLocal(fixedMessage));

        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
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
    };

    setupSocket();

    return () => {
      if (socketRef) {
        socketRef.off("receive_message");
        socketRef.off("typing");
        socketRef.off("conversation_updated");
      }
    };
  }, [id, myUserID]);

  const handleSend = async () => {
    if (!input.trim() || !myUserID || !actualReceiverID) return;

    const socket = await getSocket();
    socket.emit("send_message", {
      conversationID: id,
      receiverID: actualReceiverID,
      content: input.trim(),
    });

    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const firstMessage = messages?.[0];
  const isCurrentUserSender = firstMessage?.senderID === myUserID;

  const chattingWithName = isCurrentUserSender
    ? firstMessage?.receiverName
    : firstMessage?.senderName;

  const chattingWithAvatar = isCurrentUserSender
    ? firstMessage?.avatarReceiver
    : firstMessage?.avatarSender;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ChatHeader
        name={chattingWithName || "Người dùng"}
        avatar={chattingWithAvatar || "https://i.pravatar.cc/40"}
      />
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
};

export default isAuth(MessageScreen, ["Customer", "Driver"]);
