import { createSlice } from "@reduxjs/toolkit";
import { getTripByDriver, getTripByID, updateTrip } from "./thunk";
import { TripWithFullInfo } from "@/libs/types/trip";

type stateType = {
  loading: boolean;
  trips: TripWithFullInfo[];
  tripDetail: TripWithFullInfo | null;
  total: number;
};

const initialState: stateType = {
  loading: false,
  trips: [],
  tripDetail: null,
  total: 0,
};

export const manageTripSlice = createSlice({
  name: "manageTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTripByDriver.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTripByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.trips = action.payload.data;
      })
      .addCase(getTripByDriver.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTripByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTripByID.fulfilled, (state, action) => {
        state.loading = false;
        state.tripDetail = action.payload.data;
      })
      .addCase(getTripByID.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTrip.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageTripReducer, actions: manageTripActions } =
  manageTripSlice;
