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
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getCreatedOrderDelivery = createAsyncThunk(
  "getOrder/created",
  async (
    {
      page = 1,
      limit = 10,
      isLoadMore = false,
      status,
    }: { page?: number; limit?: number; isLoadMore?: boolean; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageOrder.getCreatedOrder({
        page,
        limit,
        status,
      });
      return {
        data: response.data.data,
        page: response.data.page,
        total: response.data.total,
        isLoadMore,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const detailOrderDelivery = createAsyncThunk(
  "order/detail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrderDetail(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
