import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageChat } from "@/libs/services/manageChat";
import { Login } from "@/libs/types/account";
import * as SecureStore from "expo-secure-store";

export const conversation = createAsyncThunk(
  "chat/conversation",
  async (_, { rejectWithValue }) => {
    try {
      const accountID = await SecureStore.getItemAsync("accountID");
      if (!accountID) {
        return rejectWithValue("Thiếu thông tin đăng nhập");
      }
      const response = await manageChat.conversations(accountID);
      return response.data;
    } catch (error) {
      return rejectWithValue("Không thể tải danh sách cuộc trò chuyện");
    }
  }
);

export const message = createAsyncThunk(
  "chat",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageChat.messages(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("No good");
    }
  }
);
