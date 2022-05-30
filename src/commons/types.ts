import * as uiStates from "../commons/ui-states";
export interface HouseInfo {
  bedrooms?: number;
  bathrooms?: number;
  stories?: string;
  builtArea?: number;
  lotSize?: number;
  lotSizeUnit?: string;
  builtAreaUnit?: string;
  swimmingPool?: boolean;
  swimmingPoolSize?: number;
  swimmingPoolSizeUnit?: string;
  swimmingPoolType?: string;
  pestType?: string[];
  type?: string;
  rmId?: string;
  totalrooms?: string;
}

export interface FormattedAddress {
  street: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  formattedAddress: string;
  googlePlaceId: string;
  verified: boolean;
  houseInfo: HouseInfo;
}

export type HouseInfoAddressRequest = {
  city: string;
  state: string;
  street: string;
  zip: string;
  suite?: string;
};

export type HouseInfoRequest = {
  nva: string;
  addresses: HouseInfoAddressRequest[];
};

export interface PriceMap {
  selected?: boolean;
  bathrooms: number;
  bedrooms: number;
  duration: number;
  plan: string;
  pricePerWeek: string;
  pricePer2Weeks: string;
  pricePerMonth: string;
  pricePerOnetime: string;
  rangeMin?: number;
  rangeMax?: number;
  serviceId: string;
  pricePerQuarterly: string;
}

export interface ServiceTask {
  displayName: string;
  description: string;
  imageURI?: any;
  taskId: string;
  isBasic: boolean;
}

export interface CustomerJourneyTexts {
  quotePageTitle: string;
  appointmentPageTitle: string;
}

export interface Service {
  description: string;
  priceMap: PriceMap[];
  serviceTasks: ServiceTask[];
  title: string;
  calculatedPricePerVisit: number;
  customerJourneyTexts: CustomerJourneyTexts;
  imageURI: string;
  calculatedPricePerMonth: number;
  imageURIAlt: string;
  providerDescription: string;
  serviceId: string;
  imageURIRound: string;
  dashboardTextBody: string;
  successImageURI: string;
  dashboardTextTitle: string;
}

// Order

export type Order = {
  orderId: string;
  subOrderId: string;
  appointmentDateTime: string;
  serviceId: string;
};

export type GroupedOrder = {
  month: string;
  data: Order[];
};

// Lead

export interface CustomerProfile {
  customerId?: any;
  eaCustomerId?: any;
  firstName?: any;
  lastName?: any;
  nva?: any;
  addresses: any[];
  phoneNumbers: any[];
}

export interface CreditCard {
  qbCardId?: any;
  cardIdLastUpdated?: any;
  ChargeResponse?: any;
}

export interface Flags {
  orderStatus: string;
}

export interface PromoCode {
  id: string;
}

export interface Flags2 {
  plan: string;
  isRecurring: boolean;
  isCompleted: boolean;
  paymentStatus: string;
  refundStatus: string;
  isRefund: boolean;
  recurringDuration: string;
}

export interface ServicePrice {
  cost: number;
  discount: number;
  tax: number;
  total: number;
}

export interface ChargeResponse {
  chargeId?: any;
  amount?: any;
  dateTime: string;
  status?: any;
  failedReason?: any;
}

export interface ProviderProfile {
  eaProviderId?: any;
  servicePersonName?: any;
}

export interface SelectedRange {
  rangeId?: number;
  rangeStart?: any;
  rangeEnd?: any;
}

export interface AppointmentInfo {
  appointmentDateTime?: any;
  providerProfile: ProviderProfile;
  selectedRange: SelectedRange;
  duration: number;
  startDateTime?: any;
  endDateTime?: any;
}

export interface SubOrder {
  subOrderId: string;
  serviceId: string;
  selectedAddons: any[];
  flags: Flags2;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  servicePrice: ServicePrice;
  chargeResponse: ChargeResponse;
  serviceNotes: string[];
  serviceImages: string[];
  appointmentInfo: AppointmentInfo;
}

export type LeadDetails = {
  leadId: string;
  customerProfile: CustomerProfile;
  creditCard: CreditCard;
  flags: Flags;
  promoCode: PromoCode;
  subOrders: SubOrder[];
};

// State

export type UiStateType = typeof uiStates[keyof typeof uiStates];
export interface CommonState<T> {
  collection: T[];
  member: T;
  uiState: UiStateType;
  error: any;
}

export interface PaginatedOrder {
  data: Order[];
  total: number;
  message: any;
}

export interface Option {
  label: string;
  code: string;
}

export interface PlanOption {
  label: string;
  cost: number;
  selected: boolean;
}

export type SaveCardType = {
  name: string;
  number: string;
  expiry: string;
  expMonth: string;
  expYear: string;
  cvc: string;
};

export type CvcVerification = {
  result: string;
  date: Date;
};

export type ZeroDollarVerification = {
  status: string;
};

export type Card = {
  id: string;
  number: string;
  name: string;
  created: Date;
  updated: Date;
  entityVersion: string;
  cvcVerification: CvcVerification;
  cardType: string;
  entityId: string;
  entityType: string;
  numberSHA512: string;
  status: string;
  zeroDollarVerification: ZeroDollarVerification;
  expMonth: string;
  expYear: string;
  default: boolean;
  isBusiness: boolean;
  isLevel3Eligible: boolean;
};
