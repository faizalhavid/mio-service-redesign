import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerProfile } from "../contexts/AuthContext";
import {
  getCustomer,
  getHouseInfo,
  postCustomer,
  putCustomer,
} from "../services/customer";
import * as uiStates from "../commons/ui-states";
import { RootState } from "../reducers";
import { HouseInfoRequest } from "../commons/types";
import { createAsyncSlice } from "./create-async-slice";

export const registerCustomerAsync = createAsyncThunk(
  "customer/register",
  async (data: CustomerProfile) => {
    const res = await postCustomer(data);
    return res.data;
  }
);

export const getCustomerByIdAsync = createAsyncThunk(
  "customer/getCustomerById",
  async (id: string | null) => {
    const res = await getCustomer(id);
    return res.data;
  }
);

export const putCustomerAsync = createAsyncThunk(
  "customer/putCustomer",
  async (data: CustomerProfile) => {
    const res = await putCustomer(data);
    return res.data;
  }
);

export const getHouseInfoAsync = createAsyncThunk(
  "customer/getHouseInfo",
  async (data: HouseInfoRequest) => {
    const res = await getHouseInfo(data);
    return res.data;
  }
);

// Types

export type UiStateType = typeof uiStates[keyof typeof uiStates];

type CustomerState = {
  customer?: CustomerProfile;
  uiState?: UiStateType;
  error?: any;
};

const initialState: CustomerState = {
  customer: {} as CustomerProfile,
  uiState: "INIT",
  error: null,
};

export const customerSlice = createAsyncSlice<CustomerProfile>({
  name: "customer",
  reducers: {
    setCustomerState: (state, { payload }: PayloadAction<CustomerState>) => {
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

// Slice action creators
export const { setCustomerState } = customerSlice.actions;

export const selectCustomer = (state: RootState) => state.customer;

// export default customerSlice.reducer;
