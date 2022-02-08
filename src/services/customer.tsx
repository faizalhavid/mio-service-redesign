import { API } from "../commons/urls";
import { CustomerProfile } from "../contexts/AuthContext";
import AxiosClient from "./axios-client";

export const postCustomer = (data: CustomerProfile) =>
  AxiosClient.post(API.REGISTER, data);

export const getCustomer = (customerId: any) =>
  AxiosClient.get(`${API.GET_CUSTOMER}/${customerId}`);
