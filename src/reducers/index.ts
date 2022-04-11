import { combineReducers } from "@reduxjs/toolkit";
import { customerSlice, houseInfoSlice } from "../slices/customer-slice";
import {
  orderDetailsSlice,
  pastOrdersSlice,
  upcomingOrdersSlice,
} from "../slices/order-slice";

const rootReducer = combineReducers({
  customer: customerSlice.reducer,
  houseInfo: houseInfoSlice.reducer,
  upcomingOrders: upcomingOrdersSlice.reducer,
  pastOrders: pastOrdersSlice.reducer,
  orderDetails: orderDetailsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
