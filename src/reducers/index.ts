import { combineReducers } from "@reduxjs/toolkit";
import { customerSlice, houseInfoSlice } from "../slices/customer-slice";

const rootReducer = combineReducers({
  customer: customerSlice.reducer,
  houseInfo: houseInfoSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
