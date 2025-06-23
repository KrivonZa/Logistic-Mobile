import { createAsyncThunk } from "@reduxjs/toolkit";
import { managePackage } from "@/libs/services/managePackage";

export const getPackageByCustomer = createAsyncThunk(
  "getPackageByCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await managePackage.getPackageByCustomer();
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getPackageByID = createAsyncThunk(
  "getPackageByID",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await managePackage.getPackageByCustomer();
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
