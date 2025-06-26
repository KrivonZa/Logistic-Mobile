import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageOrder } from "@/libs/services/manageOrder";
import { createOrder } from "@/libs/types/order";

export const createOrderDelivery = createAsyncThunk(
  "order/create",
  async (req: createOrder, { rejectWithValue }) => {
    try {
      const response = await manageOrder.createOrder(req);
      return response.data;
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getCreatedOrderDelivery = createAsyncThunk(
  "getOrder/created",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getCreatedOrder();
      return response.data;
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
