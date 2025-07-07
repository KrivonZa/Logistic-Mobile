import { createSlice } from "@reduxjs/toolkit";
import { updateAccount } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageAccountSlice = createSlice({
  name: "manageAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAccount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAccountReducer, actions: manageAccountActions } =
  manageAccountSlice;
