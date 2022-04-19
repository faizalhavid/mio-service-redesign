import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CustomerProfile } from "../contexts/AuthContext";
import { RootState } from "../reducers";
import { CommonState, HouseInfoRequest } from "../commons/types";
import { createAsyncSlice } from "./create-async-slice";
import AxiosClient from "../services/axios-client";
import { API } from "../commons/urls";

export const registerCustomerAsync = createAsyncThunk(
  "customer/register",
  async (data: CustomerProfile) => {
    const res = await AxiosClient.post(API.REGISTER, data);
    return res.data;
  }
);

export const getCustomerByIdAsync = createAsyncThunk(
  "customer/getCustomerById",
  async (id: string | null) => {
    const res = await AxiosClient.get(`${API.GET_CUSTOMER}/${id}`);
    return res.data;
  }
);

export const putCustomerAsync = createAsyncThunk(
  "customer/putCustomer",
  async (data: CustomerProfile) => {
    const res = await AxiosClient.put(
      `${API.PUT_CUSTOMER}/${data.customerId}`,
      data
    );
    return res.data;
  }
);

export const getHouseInfoAsync = createAsyncThunk(
  "customer/getHouseInfo",
  async (data: HouseInfoRequest) => {
    const res = await AxiosClient.post(API.GET_HOUSE_INFO, data);
    return res.data;
  }
);

// Types

export const customerSlice = createAsyncSlice<CustomerProfile>({
  name: "customer",
  reducers: {
    setCustomerState: (
      state,
      { payload }: PayloadAction<CommonState<CustomerProfile>>
    ) => {
      state.error = payload.error;
      state.uiState = payload.uiState;
    },
  },
  thunks: [registerCustomerAsync, getCustomerByIdAsync, putCustomerAsync],
});

export const houseInfoSlice = createAsyncSlice<CustomerProfile>({
  name: "houseInfo",
  reducers: {},
  thunks: [getHouseInfoAsync],
});

// Actions
export const { setCustomerState } = customerSlice.actions;

// Selectors
export const selectCustomer = (state: RootState) => state.customer;
