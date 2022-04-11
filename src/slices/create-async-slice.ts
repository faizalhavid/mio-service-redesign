import {
  AsyncThunk,
  createSlice,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import * as uiStates from "../commons/ui-states";

type UiStateType = typeof uiStates[keyof typeof uiStates];
interface CommonState<T> {
  collection?: T[];
  member?: T;
  uiState?: UiStateType;
  error?: any;
}

export const createAsyncSlice = <T>({
  name = "",
  reducers,
  thunks,
}: {
  name: string;
  reducers: ValidateSliceCaseReducers<
    CommonState<T>,
    SliceCaseReducers<CommonState<T>>
  >;
  thunks: AsyncThunk<any, any, any>[];
}) => {
  const initialState: CommonState<T> = {
    collection: [],
    member: {} as T,
    uiState: "INIT",
    error: null,
  };

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
  }) as Slice<CommonState<T>, SliceCaseReducers<CommonState<T>>, typeof name>;
};
