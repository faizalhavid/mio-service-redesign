import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
import { Card } from "../commons/types";
import { API } from "../commons/urls";
import { RootState } from "../reducers";
import AxiosClient from "../services/axios-client";
import { createAsyncSlice } from "./create-async-slice";

export const getSavedCardsAsync = createAsyncThunk(
  "card/all",
  async (data: { customerId: string }) => {
    const res = await AxiosClient.get(
      `${API.GET_SAVED_CARDS}/${data.customerId}`
    );
    return res.data;
  }
);

export const saveCardAsync = createAsyncThunk(
  "card/save",
  async (data: { customerId: string; data: any }) => {
    const res = await AxiosClient.post(
      `${API.SAVE_CARD}/${data.customerId}`,
      data.data
    );
    return res.data;
  }
);

// Slice

export const savedCardsSlice = createAsyncSlice({
  name: "card/all",
  initialState: getInitialState<Card>(),
  reducers: {},
  thunks: [getSavedCardsAsync],
});

export const saveCardSlice = createAsyncSlice({
  name: "card/save",
  initialState: getInitialState<any>(),
  reducers: {},
  thunks: [saveCardAsync],
});

// Selectors

export const selectCards = (state: RootState) => state.cards;
export const selectSaveCard = (state: RootState) => state.saveCard;
