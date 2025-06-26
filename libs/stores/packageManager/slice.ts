import { createSlice } from "@reduxjs/toolkit";
import {
  getPackageIdleByCustomer,
  getAllPackageByCustomer,
  getPackageByID,
  createPackage,
} from "./thunk";
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
  reducers: {
    resetPackages(state) {
      state.packages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPackageIdleByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageIdleByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const { page, data } = action.payload;
        if (page === 1) {
          state.packages = data.data;
        } else {
          state.packages = [...state.packages, ...data.data];
        }
      })
      .addCase(getPackageIdleByCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllPackageByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPackageByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const { page, data } = action.payload;
        if (page === 1) {
          state.packages = data.data;
        } else {
          state.packages = [...state.packages, ...data.data];
        }
      })
      .addCase(getAllPackageByCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPackageByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageByID.fulfilled, (state, action) => {
        state.loading = false;
        state.packageDetail = action.payload.data;
      })
      .addCase(getPackageByID.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPackage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPackage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: managePackageReducer, actions: managePackageActions } =
  managePackageSlice;
