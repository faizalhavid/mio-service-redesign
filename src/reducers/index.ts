import { combineReducers } from "@reduxjs/toolkit";
import { saveCardSlice, savedCardsSlice } from "../slices/card-slice";
import { validateCouponSlice } from "../slices/coupon-slice";
import { customerSlice, houseInfoSlice } from "../slices/customer-slice";
import { leadSlice } from "../slices/lead-slice";
import {
  createOrderSlice,
  orderDetailsSlice,
  pastOrdersSlice,
  upcomingOrdersSlice,
} from "../slices/order-slice";
import { allServicesSlice, serviceCostSlice } from "../slices/service-slice";

const rootReducer = combineReducers({
  customer: customerSlice.reducer,
  houseInfo: houseInfoSlice.reducer,
  upcomingOrders: upcomingOrdersSlice.reducer,
  pastOrders: pastOrdersSlice.reducer,
  createOrder: createOrderSlice.reducer,
  orderDetails: orderDetailsSlice.reducer,
  services: allServicesSlice.reducer,
  serviceCost: serviceCostSlice.reducer,
  validateCopuon: validateCouponSlice.reducer,
  cards: savedCardsSlice.reducer,
  saveCard: saveCardSlice.reducer,
  lead: leadSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
