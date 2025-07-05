import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageTrip } from "@/libs/services/manageTrip";
import { UpdateTrip } from "@/libs/types/trip";

export const getTripByDriver = createAsyncThunk(
  "trip/driver",
  async (
    req: {
      driverID: string;
      page?: number;
      limit?: number;
      status?: string;
      dueDate?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageTrip.getTripByDriver({
        driverID: req.driverID,
        page: req.page ?? 1,
        limit: req.limit ?? 10,
        status: req.status,
        dueDate: req.dueDate,
      });
      return response.data;
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getTripByID = createAsyncThunk(
  "trip/detail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageTrip.getTripByID(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const updateTrip = createAsyncThunk(
  "trip/update",
  async (req: FormData, { rejectWithValue }) => {
    try {
      const response = await manageTrip.updatedTrip(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
