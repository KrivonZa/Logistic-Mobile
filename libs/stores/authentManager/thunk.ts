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

      const allowedRoles = ["Customer", "Driver"];
      if (!token || !role || !allowedRoles.includes(role)) {
        return rejectWithValue("Bạn không có quyền truy cập vào ứng dụng này");
      }

      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("role", role);

      return response.data;
    } catch (error) {
      return rejectWithValue("Email hoặc mật khẩu không đúng.");
    }
  }
);
