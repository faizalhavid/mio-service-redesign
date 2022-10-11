import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getInitialState } from '../commons/initial-state';
import {
  Order,
  OrderStatus,
  PaginatedOrder,
  SubOrder,
  UpdateOrderStatusRequest,
} from '../commons/types';
import { API } from '../commons/urls';
import { RootState } from '../reducers';
import AxiosClient from '../services/axios-client';
import { createAsyncSlice } from './create-async-slice';

export const getUpcomingOrdersAsync = createAsyncThunk(
  'order/upcoming',
  async (data?: { orderId: string; subOrderId: string; limit: number }) => {
    const res = await AxiosClient.get(`${API.GET_ALL_ORDERS}/upcoming`, {
      params: data,
    });
    return res.data;
  }
);

export const getPastOrdersAsync = createAsyncThunk(
  'order/past',
  async (data?: { orderId: string; subOrderId: string; limit: number }) => {
    const res = await AxiosClient.get(`${API.GET_ALL_ORDERS}/past`, {
      params: data,
    });
    return res.data;
  }
);

export const getOrderDetailsAsync = createAsyncThunk(
  'order/getOrderDetails',
  async (data: { orderId: string; subOrderId: string }) => {
    const res = await AxiosClient.get(
      `${API.GET_ORDER_DETAILS}/${data.orderId}/detail/${data.subOrderId}`
    );
    return res.data;
  }
);

export const createOrderFromLeadAsync = createAsyncThunk(
  'order/create',
  async (data: { leadId: string }) => {
    const res = await AxiosClient.post(`${API.CREATE_ORDER_FROM_LEAD}`, {
      leadId: data.leadId,
    });
    return res.data;
  }
);

export const cancelOrderAsync = createAsyncThunk(
  'order/cancel',
  async (data: { orderId: string; type: string; subOrderId: string; dateTime: string }) => {
    const res = await AxiosClient.post(`${API.CANCEL_ORDER}/${data.orderId}/cancel`, {
      type: data.type,
      subOrderId: data.subOrderId,
      dateTime: data.dateTime,
    });
    return res.data;
  }
);
export const rescheduleOrderAsync = createAsyncThunk(
  'order/reschedule',
  async (data: { orderId: string; type: string; subOrderId: string; dateTime: string }) => {
    const res = await AxiosClient.post(`${API.CANCEL_ORDER}/${data.orderId}/reschedule`, {
      type: data.type,
      subOrderId: data.subOrderId,
      dateTime: data.dateTime,
    });
    return res.data;
  }
);

export const udpateJobStatusAsync = createAsyncThunk(
  'order/status',
  async (data: UpdateOrderStatusRequest) => {
    console.log(data);
    const res = await AxiosClient.put(
      `${API.UPDATE_ORDER_STATUS}/${data.orderId}/suborder/${data.subOrderId}/update`,
      data
    );
    return res.data;
  }
);

// Slice

export const upcomingOrdersSlice = createAsyncSlice({
  name: 'order/upcoming',
  initialState: getInitialState<PaginatedOrder>(),
  reducers: {},
  thunks: [getUpcomingOrdersAsync],
});

export const pastOrdersSlice = createAsyncSlice({
  name: 'order/past',
  initialState: getInitialState<PaginatedOrder>(),
  reducers: {
    updatePastOrders: (state, { payload }: PayloadAction<{ orders: Order[] }>) => {
      state.member.data = [...state.member.data, ...payload.orders];
    },
  },
  thunks: [getPastOrdersAsync],
});

export const orderDetailsSlice = createAsyncSlice({
  name: 'order/details',
  initialState: getInitialState<SubOrder>(),
  reducers: {
    resetOrderDetails: (state) => {
      state.member = {} as SubOrder;
    },
  },
  thunks: [getOrderDetailsAsync],
});

export const createOrderSlice = createAsyncSlice({
  name: 'order/create',
  initialState: getInitialState<Order>(),
  reducers: {},
  thunks: [createOrderFromLeadAsync],
});

export const cancelOrderSlice = createAsyncSlice({
  name: 'order/cancel',
  initialState: getInitialState<OrderStatus>(),
  reducers: {},
  thunks: [cancelOrderAsync],
});

export const rescheduleOrderSlice = createAsyncSlice({
  name: 'order/reschedule',
  initialState: getInitialState<OrderStatus>(),
  reducers: {},
  thunks: [rescheduleOrderAsync],
});

export const jobStatusSlice = createAsyncSlice({
  name: 'order/status',
  initialState: getInitialState(),
  reducers: {},
  thunks: [udpateJobStatusAsync],
});

export const firstOrderSlice = createAsyncSlice({
  name: 'order/firstorder',
  initialState: getInitialState<Order>(),
  reducers: {
    setFirstOrder: (state, { payload }: PayloadAction<{ order: Order }>) => {
      state.member = { ...payload.order };
    },
  },
  thunks: [],
});

// Action

export const { setFirstOrder } = firstOrderSlice.actions;
export const { resetOrderDetails } = orderDetailsSlice.actions;

// Selectors

export const selectFirstOrder = (state: RootState) => state.firstOrder;
export const selectUpcomingOrders = (state: RootState) => state.upcomingOrders;
export const selectPastOrders = (state: RootState) => state.pastOrders;
export const selectOrderDetails = (state: RootState) => state.orderDetails;
export const selectCreateOrder = (state: RootState) => state.createOrder;
export const selectCancelOrder = (state: RootState) => state.cancelOrder;
export const selectRescheduleOrder = (state: RootState) => state.rescheduleOrder;
export const selectJobStatus = (state: RootState) => state.jobStatus;
