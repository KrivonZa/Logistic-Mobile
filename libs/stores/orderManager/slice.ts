import { createSlice } from "@reduxjs/toolkit";
import { createOrderDelivery, getCreatedOrderDelivery } from "./thunk";
import { orderDelivery } from "@/libs/types/order";

type stateType = {
  loading: boolean;
  orderDeliveries: orderDelivery[] | [];
};

const initialState: stateType = {
  loading: false,
  orderDeliveries: [],
};

export const manageOrderDeliverySlice = createSlice({
  name: "manageOrderDelivery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrderDelivery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrderDelivery.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCreatedOrderDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCreatedOrderDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDeliveries = action.payload.data;
      })
      .addCase(getCreatedOrderDelivery.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageOrderDeliveryReducer,
  actions: manageOrderDeliveryActions,
} = manageOrderDeliverySlice;
