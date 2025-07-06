import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageRating } from "@/libs/services/manageRating";
import { Rating } from "@/libs/types/rating";

export const createRating = createAsyncThunk(
  "rating/create",
  async (req: Rating, { rejectWithValue }) => {
    try {
      const response = await manageRating.createRating(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
