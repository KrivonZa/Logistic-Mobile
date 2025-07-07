import { createSlice } from "@reduxjs/toolkit";
import {
  createOrderDelivery,
  getCreatedOrderDelivery,
  detailOrderDelivery,
} from "./thunk";
import { OrderDelivery } from "@/libs/types/order";

type stateType = {
  loading: boolean;
  orderDeliveries: OrderDelivery[];
  page: number;
  total: number;
  detailOrder: OrderDelivery | null;
};

const initialState: stateType = {
  loading: false,
  orderDeliveries: [],
  page: 1,
  total: 0,
  detailOrder: null,
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
        const { data, page, total, isLoadMore } = action.payload;

        if (isLoadMore) {
          state.orderDeliveries = [...state.orderDeliveries, ...data];
        } else {
          state.orderDeliveries = data;
        }

        state.page = page;
        state.total = total;
      })
      .addCase(getCreatedOrderDelivery.rejected, (state) => {
        state.loading = false;
      })
      .addCase(detailOrderDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(detailOrderDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.detailOrder = action.payload.data;
      })
      .addCase(detailOrderDelivery.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageOrderDeliveryReducer,
  actions: manageOrderDeliveryActions,
} = manageOrderDeliverySlice;
