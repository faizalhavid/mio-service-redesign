import { CommonState } from "./types";

export const getInitialState = <T>() => {
  const initialState: CommonState<T> = {
    collection: [],
    member: {} as T,
    uiState: "INIT",
    error: null,
  };
  return initialState;
};
