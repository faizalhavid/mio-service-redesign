import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
import { API } from "../commons/urls";
import { RootState } from "../reducers";
import AxiosClient from "../services/axios-client";
import { createAsyncSlice } from "./create-async-slice";

export const validateCouponAsync = createAsyncThunk(
  "coupon/validate",
  async (data: { code: string; leadId: string }) => {
    const res = await AxiosClient.get(
      `${API.VALIDATE_COUPON}/${data.code}?leadId=${data.leadId}`
    );
    return res.data;
  }
);

// Slice

export const validateCouponSlice = createAsyncSlice({
  name: "coupon/validate",
  initialState: getInitialState<any>(),
  reducers: {
    resetValidateCoupon: (state) => {
      state.member = {};
    },
  },
  thunks: [validateCouponAsync],
});

// Actions
export const { resetValidateCoupon } = validateCouponSlice.actions;

// Selectors

export const selectValidateCoupon = (state: RootState) => state.validateCopuon;
