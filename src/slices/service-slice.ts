import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
import { CommonState, PriceMap, Service } from "../commons/types";
import { API } from "../commons/urls";
import { RootState } from "../reducers";
import AxiosClient from "../services/axios-client";
import { createAsyncSlice } from "./create-async-slice";

export const getServicesAsync = createAsyncThunk("service/all", async () => {
  const res = await AxiosClient.get(API.GET_SERVICES);
  return res.data;
});

export const getServiceCostAsync = createAsyncThunk(
  "service/cost",
  async (data: any) => {
    const res = await AxiosClient.post(API.GET_SERVICE_COST, data);
    return res.data;
  }
);

// Slice

export const allServicesSlice = createAsyncSlice({
  name: "service/all",
  initialState: getInitialState<Service>(),
  reducers: {},
  thunks: [getServicesAsync],
});

export const serviceCostSlice = createAsyncSlice({
  name: "service/cost",
  initialState: getInitialState<PriceMap>(),
  reducers: {},
  thunks: [getServiceCostAsync],
});

// Actions

// Selectors

export const selectServices = (state: RootState) => state.services;
export const selectServiceCost = (state: RootState) => state.serviceCost;
