import {
  AsyncThunk,
  createSlice,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { CommonState } from "../commons/types";

export const createAsyncSlice = <
  T,
  Reducers extends SliceCaseReducers<CommonState<T>>
>({
  name = "",
  initialState,
  reducers,
  thunks,
}: {
  name: string;
  initialState: CommonState<T>;
  reducers: ValidateSliceCaseReducers<CommonState<T>, Reducers>;
  thunks: AsyncThunk<any, any, any>[];
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      ...reducers,
    },
    extraReducers: (builder) => {
      for (let thunk of thunks) {
        builder
          .addCase(thunk.pending, (state, action) => {
            state.uiState = "IN_PROGRESS";
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.uiState = "SUCCESS";
            if (Array.isArray(action.payload)) {
              state.collection = action.payload;
            } else {
              state.member = action.payload;
            }
          })
          .addCase(thunk.rejected, (state, { payload }) => {
            state.uiState = "FAILED";
            state.error = payload;
          });
      }
    },
  });
};
