import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Address, CustomerProfile } from '../contexts/AuthContext';
import { RootState } from '../reducers';
import {
  DeleteAddressRequest,
  FormattedAddress,
  HouseInfoAddressRequest,
  HouseInfoRequest,
  UiStateType,
} from '../commons/types';
import { createAsyncSlice } from './create-async-slice';
import AxiosClient from '../services/axios-client';
import { API } from '../commons/urls';
import { getInitialState } from '../commons/initial-state';

export const registerCustomerAsync = createAsyncThunk(
  'customer/register',
  async (data: CustomerProfile) => {
    const res = await AxiosClient.post(API.REGISTER, data);
    return res.data;
  }
);

export const getCustomerByIdAsync = createAsyncThunk(
  'customer/getCustomerById',
  async (id: string | null) => {
    const res = await AxiosClient.get(`${API.GET_CUSTOMER}/${id}`);
    return res.data;
  }
);

export const getCustomerExistsAsync = createAsyncThunk(
  'customer/getCustomerExists',
  async (id: string | null) => {
    const res = await AxiosClient.post(`${API.CUSTOMER_EXISTS}/${id}`);
    return res.data;
  }
);

export const putCustomerAsync = createAsyncThunk(
  'customer/putCustomer',
  async (data: CustomerProfile) => {
    const res = await AxiosClient.put(`${API.PUT_CUSTOMER}/${data.customerId}`, data);
    return res.data;
  }
);

export const updateAddressAsync = createAsyncThunk(
  'address/put',
  async (data: HouseInfoAddressRequest, { rejectWithValue }) => {
    const res = await AxiosClient.put(`${API.PUT_ADDRESS}/${data.serviceAccountId}`, data);
    if (res.data.status !== 'success') {
      return rejectWithValue({
        error: res.data.result || res.data.message,
      });
    }
    return res.data;
  }
);

export const deleteAddressAsync = createAsyncThunk(
  'address/delete',
  async (data: DeleteAddressRequest) => {
    const res = await AxiosClient.delete(
      `${API.DELETE_ADDRESS}/${data.serviceAccountId}/${data.propertyId}`
    );
    return res.data;
  }
);

export const getHouseInfoAsync = createAsyncThunk('houseInfo', async (data: HouseInfoRequest) => {
  const res = await AxiosClient.post(API.GET_HOUSE_INFO, data);
  return res.data;
});

export const deleteCustomerAsync = createAsyncThunk(
  'customer/delete',
  async (id?: string | null) => {
    const res = await AxiosClient.delete(
      id ? `${API.DELETE_CUSTOMER}/${id}` : `${API.DELETE_CUSTOMER}`
    );
    return res.data;
  }
);

// Types

export const customerSlice = createAsyncSlice({
  name: 'customer',
  initialState: getInitialState<CustomerProfile>(),
  reducers: {
    setCustomerState: (
      state,
      { payload }: PayloadAction<{ uiState: UiStateType; error?: any }>
    ) => {
      state.error = payload.error;
      state.uiState = payload.uiState;
    },
    resetCustomerState: (state) => {
      state.member = {} as CustomerProfile;
    },
  },
  thunks: [registerCustomerAsync, getCustomerByIdAsync, putCustomerAsync],
});

export const addressSlice = createAsyncSlice({
  name: 'address',
  initialState: getInitialState<Address>(),
  reducers: {},
  thunks: [updateAddressAsync, deleteAddressAsync],
});

export const houseInfoSlice = createAsyncSlice({
  name: 'houseInfo',
  initialState: getInitialState<FormattedAddress>(),
  reducers: {},
  thunks: [getHouseInfoAsync],
});

export const deleteCustomerSlice = createAsyncSlice({
  name: 'deleteCustomer',
  initialState: getInitialState<any>(),
  reducers: {},
  thunks: [deleteCustomerAsync],
});

// Actions
export const { setCustomerState, resetCustomerState } = customerSlice.actions;

// Selectors
export const selectAddress = (state: RootState) => state.addresses;
export const selectCustomer = (state: RootState) => state.customer;
export const selectHouseInfo = (state: RootState) => state.houseInfo;
export const selectDeleteCustomer = (state: RootState) => state.deleteCustomer;
