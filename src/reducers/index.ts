import { combineReducers } from "@reduxjs/toolkit";
import { saveCardSlice, savedCardsSlice } from "../slices/card-slice";
import { validateCouponSlice } from "../slices/coupon-slice";
import {
  addressSlice,
  customerSlice,
  houseInfoSlice,
} from "../slices/customer-slice";
import { leadSlice } from "../slices/lead-slice";
import {
  cancelOrderSlice,
  createOrderSlice,
  firstOrderSlice,
  orderDetailsSlice,
  pastOrdersSlice,
  rescheduleOrderSlice,
  upcomingOrdersSlice,
} from "../slices/order-slice";
import {
  allServicesSlice,
  selectedServicesSlice,
  serviceCostSlice,
} from "../slices/service-slice";
import {
  refreshNeededSlice,
  selectedAddressSlice,
} from "../slices/shared-slice";
import { invitedUsersSlice, inviteNewUserSlice } from "../slices/invite-slice";

const rootReducer = combineReducers({
  customer: customerSlice.reducer,
  refreshNeeded: refreshNeededSlice.reducer,
  selectedAddress: selectedAddressSlice.reducer,
  addresses: addressSlice.reducer,
  invitedUsers: invitedUsersSlice.reducer,
  inviteNewUser: inviteNewUserSlice.reducer,
  houseInfo: houseInfoSlice.reducer,
  firstOrder: firstOrderSlice.reducer,
  upcomingOrders: upcomingOrdersSlice.reducer,
  pastOrders: pastOrdersSlice.reducer,
  createOrder: createOrderSlice.reducer,
  orderDetails: orderDetailsSlice.reducer,
  cancelOrder: cancelOrderSlice.reducer,
  rescheduleOrder: rescheduleOrderSlice.reducer,
  services: allServicesSlice.reducer,
  selectedServices: selectedServicesSlice.reducer,
  serviceCost: serviceCostSlice.reducer,
  validateCopuon: validateCouponSlice.reducer,
  cards: savedCardsSlice.reducer,
  saveCard: saveCardSlice.reducer,
  lead: leadSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
