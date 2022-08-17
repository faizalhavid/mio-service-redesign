import { PayloadAction } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
import { Address } from "../contexts/AuthContext";
import { RootState } from "../reducers";
import { createAsyncSlice } from "./create-async-slice";

export const refreshNeededSlice = createAsyncSlice({
  name: "refresh-needed",
  initialState: getInitialState<{ [key: string]: boolean }>(),
  reducers: {
    setRefreshNeeded: (
      state,
      { payload }: PayloadAction<{ data: { [key: string]: boolean } }>
    ) => {
      state.member = { ...payload.data };
    },
  },
  thunks: [],
});

export const selectedAddressSlice = createAsyncSlice({
  name: "selected-address",
  initialState: getInitialState<Address>(),
  reducers: {
    setSelectedAddress: (state, { payload }: PayloadAction<Address>) => {
      state.member = payload;
    },
  },
  thunks: [],
});

// Actions
export const { setRefreshNeeded } = refreshNeededSlice.actions;
export const { setSelectedAddress } = selectedAddressSlice.actions;

// Selectors
export const selectRefreshNeeded = (state: RootState) => state.refreshNeeded;
export const selectSelectedAddress = (state: RootState) =>
  state.selectedAddress;
