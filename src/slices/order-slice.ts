import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
import { CommonState, Order, PaginatedOrder, SubOrder } from "../commons/types";
import { API } from "../commons/urls";
import { RootState } from "../reducers";
import AxiosClient from "../services/axios-client";
import { createAsyncSlice } from "./create-async-slice";

export const getUpcomingOrdersAsync = createAsyncThunk(
  "order/upcoming",
  async (data?: { orderId: string; subOrderId: string; limit: number }) => {
    const res = await AxiosClient.get(`${API.GET_ALL_ORDERS}/upcoming`, {
      params: data,
    });
    return res.data;
  }
);

export const getPastOrdersAsync = createAsyncThunk(
  "order/past",
  async (data?: { orderId: string; subOrderId: string; limit: number }) => {
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

export const createOrderFromLeadAsync = createAsyncThunk(
  "order/create",
  async (data: { leadId: string }) => {
    const res = await AxiosClient.post(`${API.CREATE_ORDER_FROM_LEAD}`, {
      leadId: data.leadId,
    });
    return res.data;
  }
);

// Slice

export const upcomingOrdersSlice = createAsyncSlice({
  name: "order/upcoming",
  initialState: getInitialState<PaginatedOrder>(),
  reducers: {
    updateUpcomingOrders: (
      state,
      { payload }: PayloadAction<{ orders: Order[] }>
    ) => {
      state.member.data = [...state.member.data, ...payload.orders];
    },
  },
  thunks: [getUpcomingOrdersAsync],
});

export const pastOrdersSlice = createAsyncSlice({
  name: "order/past",
  initialState: getInitialState<PaginatedOrder>(),
  reducers: {
    updatePastOrders: (
      state,
      { payload }: PayloadAction<{ orders: Order[] }>
    ) => {
      state.member.data = [...state.member.data, ...payload.orders];
    },
  },
  thunks: [getPastOrdersAsync],
});

export const orderDetailsSlice = createAsyncSlice({
  name: "order/details",
  initialState: getInitialState<SubOrder>(),
  reducers: {},
  thunks: [getOrderDetailsAsync],
});

export const createOrderSlice = createAsyncSlice({
  name: "order/create",
  initialState: getInitialState<Order>(),
  reducers: {},
  thunks: [createOrderFromLeadAsync],
});

// Action

export const { updateUpcomingOrders } = upcomingOrdersSlice.actions;

// Selectors

export const selectUpcomingOrders = (state: RootState) => state.upcomingOrders;
export const selectPastOrders = (state: RootState) => state.pastOrders;
export const selectOrderDetails = (state: RootState) => state.orderDetails;
export const selectCreateOrder = (state: RootState) => state.createOrder;
