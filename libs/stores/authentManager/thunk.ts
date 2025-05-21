import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/libs/services/manageAuthen";
import { Login } from "@/libs/types/account";
import * as SecureStore from "expo-secure-store";

export const login = createAsyncThunk(
  "auth/login",
  async (req: Login, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.login(req);
      const token = response.data?.data.access_token;
      const role = response.data?.data.role;
      if (token && role) {
        await SecureStore.setItemAsync("authToken", token);
        await SecureStore.setItemAsync("role", role);
      }
      return response.data;
    } catch (error) {
      console.log("API error:", error);
      return rejectWithValue(error);
    }
  }
);
