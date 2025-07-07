import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/libs/services/manageAuthen";
import { Login, Register } from "@/libs/types/account";
import * as SecureStore from "expo-secure-store";
import { parseJwt } from "@/libs/utils/auth";

export const register = createAsyncThunk(
  "auth/register",
  async (req: Register, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.register(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Đăng ký không thành công.");
    }
  }
);
