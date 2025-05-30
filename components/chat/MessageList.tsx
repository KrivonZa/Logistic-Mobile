import React, { useMemo } from "react";
import { FlatList, View, Image, Text } from "react-native";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import customParseFormat from "dayjs/plugin/customParseFormat";

import MessageItem from "./MessageItem";
import DateHeader from "./DateHeader";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(customParseFormat);

const weekdayMap: Record<string, string> = {
  Mon: "T2",
  Tue: "T3",
  Wed: "T4",
  Thu: "T5",
  Fri: "T6",
  Sat: "T7",
  Sun: "CN",
};

type MessageType = {
  messageID: string;
  senderID: string;
  content: string;
  senderName: string;
  createdAt: string;
  isSameSenderAsPrevious?: boolean;
  isLastInGroup?: boolean;
};

type ListItem =
  | { type: "dateHeader"; id: string; title: string }
  | { type: "timeHeader"; id: string; title: string }
  | { type: "message"; data: MessageType };

interface Props {
  messages: MessageType[];
  myUserID: string | null;
  flatListRef: React.RefObject<any>;
}

export default function MessageList({
  messages,
  myUserID,
  flatListRef,
}: Props) {
  const now = dayjs();

  const flatListData: ListItem[] = useMemo(() => {
    const groupedMessages = messages.reduce((acc, msg) => {
      const time = dayjs(msg.createdAt, "DD-MM-YYYY HH:mm", true);
      console.log(time, msg.createdAt);
      const dateKey = time.format("DD-MM-YYYY");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {} as Record<string, MessageType[]>);

    let flatData: ListItem[] = [];

    Object.entries(groupedMessages)
      .sort(
        ([dateA], [dateB]) =>
          dayjs(dateA, "DD-MM-YYYY").valueOf() -
          dayjs(dateB, "DD-MM-YYYY").valueOf()
      )
      .forEach(([date, msgs]) => {
        const sortedMsgs = msgs.sort(
          (a, b) =>
            dayjs(a.createdAt, "DD-MM-YYYY HH:mm").valueOf() -
            dayjs(b.createdAt, "DD-MM-YYYY HH:mm").valueOf()
        );

        let lastMessageTime: dayjs.Dayjs | null = null;
        let lastSenderID: string | null = null;

        sortedMsgs.forEach((msg, idx) => {
          const msgTime = dayjs(msg.createdAt, "DD-MM-YYYY HH:mm");

          if (idx === 0) {
            const daysDiff = now.diff(msgTime, "day");
            let dayTitle = "";

            if (msgTime.isToday()) {
              dayTitle = "Hôm nay";
            } else if (msgTime.isYesterday()) {
              dayTitle = "Hôm qua";
            } else if (daysDiff <= 7) {
              const dayEng = msgTime.format("ddd");
              dayTitle = weekdayMap[dayEng] || dayEng;
            } else {
              dayTitle = msgTime.format("DD-MM-YYYY");
            }

            flatData.push({
              type: "dateHeader",
              id: `header-${msg.messageID}`,
              title: `${dayTitle} ${msgTime.format("HH:mm")}`,
            });
          } else if (
            lastMessageTime === null ||
            msgTime.diff(lastMessageTime, "minute") > 30
          ) {
            flatData.push({
              type: "timeHeader",
              id: `timeHeader-${msg.messageID}`,
              title: msgTime.format("HH:mm"),
            });
          }

          const isSameSenderAsPrevious =
            lastSenderID === msg.senderID &&
            lastMessageTime !== null &&
            msgTime.diff(lastMessageTime, "minute") <= 30;
          const nextMsg = sortedMsgs[idx + 1];
          const nextMsgTime = nextMsg
            ? dayjs(nextMsg.createdAt, "DD-MM-YYYY HH:mm")
            : null;
          const isLastInGroup =
            !nextMsg ||
            nextMsg.senderID !== msg.senderID ||
            (nextMsgTime ? nextMsgTime.diff(msgTime, "minute") > 30 : false);

          flatData.push({
            type: "message",
            data: {
              ...msg,
              isSameSenderAsPrevious,
              isLastInGroup,
            },
          });

          lastMessageTime = msgTime;
          lastSenderID = msg.senderID;
        });
      });

    return flatData.reverse();
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      data={flatListData}
      keyExtractor={(item) =>
        item.type === "message" ? item.data.messageID : item.id
      }
      inverted
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-end",
        paddingBottom: 20,
      }}
      renderItem={({ item }) => {
        if (item.type === "dateHeader" || item.type === "timeHeader") {
          return <DateHeader title={item.title} />;
        }
        return (
          <MessageItem
            message={item.data}
            isSentByUser={item.data.senderID === myUserID}
            isSameSenderAsPrevious={item.data.isSameSenderAsPrevious}
            isLastInGroup={item.data.isLastInGroup}
          />
        );
      }}
    />
  );
}
