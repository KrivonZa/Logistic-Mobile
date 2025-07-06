import { createSlice } from "@reduxjs/toolkit";
import { createRating } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageRatingSlice = createSlice({
  name: "manageRating",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createRating.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageRatingReducer, actions: manageRatingActions } =
  manageRatingSlice;
