import { createSlice } from "@reduxjs/toolkit";
import { conversation, message } from "./thunk";
import { Conversations, Message } from "@/libs/types/chat";
import dayjs from "dayjs";

type stateType = {
  loading: boolean;
  conversations: Conversations[];
  messages: Message[];
};

const initialState: stateType = {
  loading: false,
  conversations: [],
  messages: [],
};

export const manageChatSlice = createSlice({
  name: "manageChat",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },

    clearConversation: (state) => {
      state.conversations = [];
    },
    addMessageToLocal: (state, action) => {
      const formattedPayload = {
        ...action.payload,
        createdAt: dayjs(action.payload.createdAt).format("DD-MM-YYYY HH:mm"),
      };
      state.messages = [...state.messages, formattedPayload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(conversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(conversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data;
      })
      .addCase(conversation.rejected, (state) => {
        state.loading = false;
      })

      .addCase(message.pending, (state) => {
        state.loading = true;
      })
      .addCase(message.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data;
      })
      .addCase(message.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageChatReducer, actions: manageChatActions } =
  manageChatSlice;

export const { clearMessages, clearConversation, addMessageToLocal } =
  manageChatActions;
