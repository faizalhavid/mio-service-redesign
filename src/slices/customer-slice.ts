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

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerState: (state, { payload }: PayloadAction<CustomerState>) => {
      state.error = payload.error;
      state.uiState = payload.uiState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCustomerAsync.pending, (state, action) => {
        state.uiState = "IN_PROGRESS";
      })
      .addCase(
        registerCustomerAsync.fulfilled,
        (state, { payload }: PayloadAction<CustomerProfile>) => {
          state.uiState = "SUCCESS";
          state.customer = payload;
        }
      )
      .addCase(registerCustomerAsync.rejected, (state, { payload }) => {
        state.uiState = "FAILED";
        state.error = payload;
      })
      .addCase(getCustomerByIdAsync.pending, (state, action) => {
        state.uiState = "IN_PROGRESS";
      })
      .addCase(
        getCustomerByIdAsync.fulfilled,
        (state, { payload }: PayloadAction<CustomerProfile>) => {
          state.uiState = "SUCCESS";
          state.customer = payload;
        }
      )
      .addCase(getCustomerByIdAsync.rejected, (state, { payload }) => {
        state.uiState = "FAILED";
        state.error = payload;
      })
      .addCase(putCustomerAsync.pending, (state, action) => {
        state.uiState = "IN_PROGRESS";
      })
      .addCase(
        putCustomerAsync.fulfilled,
        (state, { payload }: PayloadAction<CustomerProfile>) => {
          state.uiState = "SUCCESS";
          state.customer = payload;
        }
      )
      .addCase(putCustomerAsync.rejected, (state, { payload }) => {
        state.uiState = "FAILED";
        state.error = payload;
      });
  },
});

export const houseInfoSlice = createSlice({
  name: "houseInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHouseInfoAsync.pending, (state, action) => {
        state.uiState = "IN_PROGRESS";
      })
      .addCase(
        getHouseInfoAsync.fulfilled,
        (state, { payload }: PayloadAction<CustomerProfile>) => {
          state.uiState = "SUCCESS";
          state.customer = payload;
        }
      )
      .addCase(getHouseInfoAsync.rejected, (state, { payload }) => {
        state.uiState = "FAILED";
        state.error = payload;
      });
  },
});

// Slice action creators
export const { setCustomerState } = customerSlice.actions;

export const selectCustomer = (state: RootState) => state.customer;

// export default customerSlice.reducer;
