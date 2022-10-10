import { PayloadAction } from "@reduxjs/toolkit";
import { getInitialState } from "../commons/initial-state";
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

// Actions
export const { setRefreshNeeded } = refreshNeededSlice.actions;

// Selectors
export const selectRefreshNeeded = (state: RootState) => state.refreshNeeded;
