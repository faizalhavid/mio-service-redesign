export interface HouseInfo {
  bedrooms: string;
  bathrooms: string;
  stories: string;
  builtArea: number;
  lotSize: number;
  lotSizeUnit: string;
  builtAreaUnit: string;
  swimmingPool: boolean;
  swimmingPoolSize: number;
  swimmingPoolSizeUnit: string;
  swimmingPoolType: string;
  type: string;
  rmId: string;
  totalrooms: string;
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
  pricePerMonth: number;
  selected?: boolean;
  bathrooms: number;
  bedrooms: number;
  duration: number;
  pricePerWeek: number;
  pricePerOnetime: number;
  pricePer2Weeks: number;
  rangeMin?: number;
  rangeMax?: number;
  pricePerQuarterly?: number;
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

export interface MetaData {
  createdAt: Date;
  modifiedAt: Date;
  notes: any[];
}

export interface CreditCard {
  qbCardId?: any;
  cardIdLastUpdated?: any;
  ChargeResponse?: any;
}

export interface Flags {
  orderStatus: string;
}

export interface PromoCode {}

export interface Flags2 {
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
  rangeId: number;
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
  servicePrice: ServicePrice;
  chargeResponse: ChargeResponse;
  serviceNotes: string[];
  appointmentInfo: AppointmentInfo;
}

export interface LeadDetails {
  leadId: string;
  customerProfile: CustomerProfile;
  metaData: MetaData;
  creditCard: CreditCard;
  flags: Flags;
  promoCode: PromoCode;
  subOrders: SubOrder[];
}