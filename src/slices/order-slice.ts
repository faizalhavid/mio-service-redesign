import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CommonState, Order } from "../commons/types";
import { API } from "../commons/urls";
import { RootState } from "../reducers";
import AxiosClient from "../services/axios-client";
import { createAsyncSlice } from "./create-async-slice";

export const getUpcomingOrdersAsync = createAsyncThunk(
  "order/upcoming",
  async (data: { orderId: string; subOrderId: string; limit: number }) => {
    const res = await AxiosClient.get(`${API.GET_ALL_ORDERS}/upcoming`, {
      params: data,
    });
    return res.data;
  }
);

export const getPastOrdersAsync = createAsyncThunk(
  "order/past",
  async (data: { orderId: string; subOrderId: string; limit: number }) => {
    const res = await AxiosClient.get(`${API.GET_ALL_ORDERS}/past`, {
      params: data,
    });
    return res.data;
  }
);

export const getOrderDetailsAsync = createAsyncThunk(
  "order/getOrderDetails",
  async (data: { orderId: string; subOrderId: string }) => {
    const res = await AxiosClient.get(
      `${API.GET_ORDER_DETAILS}/${data.orderId}/detail/${data.subOrderId}`
    );
    return res.data;
  }
);

// Slice

export const upcomingOrdersSlice = createAsyncSlice<Order>({
  name: "order/upcoming",
  reducers: {
    updateUpcomingOrders: (
      state,
      { payload }: PayloadAction<CommonState<Order>>
    ) => {
      state.collection = [...state.collection, ...payload.collection];
    },
  },
  thunks: [getUpcomingOrdersAsync],
});

export const pastOrdersSlice = createAsyncSlice<Order>({
  name: "order/past",
  reducers: {
    updatePastOrders: (
      state,
      { payload }: PayloadAction<CommonState<Order>>
    ) => {
      state.collection = payload.collection;
    },
  },
  thunks: [getUpcomingOrdersAsync],
});

export const orderDetailsSlice = createAsyncSlice<Order>({
  name: "order/details",
  reducers: {},
  thunks: [getOrderDetailsAsync],
});

// Action

export const { updateUpcomingOrders } = upcomingOrdersSlice.actions;

// Selectors

export const selectCustomer = (state: RootState) => state.customer;
