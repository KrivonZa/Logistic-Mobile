import { createSlice } from "@reduxjs/toolkit";
import { findNearest, getRouteByID } from "./thunk";
import { RouteWithWaypoints } from "@/libs/types/route";

type stateType = {
  loading: boolean;
  routes: RouteWithWaypoints[];
  routeDetail: RouteWithWaypoints | null;
};

const initialState: stateType = {
  loading: false,
  routes: [],
  routeDetail: null,
};

export const manageRouteSlice = createSlice({
  name: "manageRoute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findNearest.pending, (state) => {
        state.loading = true;
      })
      .addCase(findNearest.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload.data;
      })
      .addCase(findNearest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRouteByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRouteByID.fulfilled, (state, action) => {
        state.loading = false;
        state.routeDetail = action.payload.data;
      })
      .addCase(getRouteByID.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageRouteReducer, actions: manageRouteActions } =
  manageRouteSlice;
