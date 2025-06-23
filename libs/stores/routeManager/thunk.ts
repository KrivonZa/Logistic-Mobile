import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageRoute } from "@/libs/services/manageRoute";
import { FindNearestWaypointsRequest } from "@/libs/types/route";

export const findNearest = createAsyncThunk(
  "findNearest",
  async (req: FindNearestWaypointsRequest, { rejectWithValue }) => {
    try {
      const response = await manageRoute.findNearest(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getRouteByID = createAsyncThunk(
  "getRouteByID",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageRoute.getRouteByID(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
