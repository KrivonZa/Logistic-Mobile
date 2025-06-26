import { createAsyncThunk } from "@reduxjs/toolkit";
import { managePackage } from "@/libs/services/managePackage";

export const getPackageIdleByCustomer = createAsyncThunk(
  "getPackageIdleByCustomer",
  async (
    req: { page: number; limit: number; routeID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await managePackage.getPackageIdleByCustomer(req);
      return { page: req.page, data: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getAllPackageByCustomer = createAsyncThunk(
  "getAllPackageByCustomer",
  async (
    req: { page: number; limit: number; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await managePackage.getAllPackageByCustomer(req);
      return { page: req.page, data: response.data.data };
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
      const response = await managePackage.getPackageByID(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const createPackage = createAsyncThunk(
  "package/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await managePackage.createPackage(formData);
      return response.data;
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
