import { createSlice } from "@reduxjs/toolkit";
import { getPackageByCustomer, getPackageByID } from "./thunk";
import { Package } from "@/libs/types/package";

type stateType = {
  loading: boolean;
  packages: Package[];
  packageDetail: Package | null;
};

const initialState: stateType = {
  loading: false,
  packages: [],
  packageDetail: null,
};

export const managePackageSlice = createSlice({
  name: "managePackage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPackageByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data.data;
      })
      .addCase(getPackageByCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPackageByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageByID.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data;
      })
      .addCase(getPackageByID.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: managePackageReducer, actions: managePackageActions } =
  managePackageSlice;
