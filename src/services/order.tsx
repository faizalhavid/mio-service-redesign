import { API } from "../commons/urls";
import AxiosClient from "./axios-client";

export const getAppointments = () => AxiosClient.get(API.GET_APPOINTMENTS);
export const getServices = () => AxiosClient.get(API.GET_SERVICES);
export const postLead = (data: any) => AxiosClient.post(API.POST_LEAD, data);
export const putLead = (data: any) =>
  AxiosClient.put(`${API.PUT_LEAD}/${data.leadId}`, data);
export const getLead = (leadId: string) =>
  AxiosClient.get(`${API.GET_LEAD}/${leadId}`);
export const getServiceCost = (data: any) =>
  AxiosClient.post(API.GET_SERVICE_COST, data);
export const getSavedCards = (customerId: string) =>
  AxiosClient.get(`${API.GET_SAVED_CARDS}/${customerId}`);
export const saveCard = (customerId: string, data: any) =>
  AxiosClient.post(`${API.SAVE_CARD}/${customerId}`, data);
export const createOrderFromLead = (leadId: string) =>
  AxiosClient.post(`${API.CREATE_ORDER_FROM_LEAD}`, { leadId });
export const getAllOrders = (
  type: string,
  orderId?: string,
  subOrderId?: string,
  limit?: number
) =>
  AxiosClient.get(`${API.GET_ALL_ORDERS}/${type}`, {
    params: { orderId, subOrderId, limit },
  });
export const getOrderDetails = (orderId: string, subOrderId: string) =>
  AxiosClient.get(`${API.GET_ORDER_DETAILS}/${orderId}/detail/${subOrderId}`);
export const validateCoupon = (code: string) =>
  AxiosClient.get(`${API.VALIDATE_COUPON}/${code}`);
