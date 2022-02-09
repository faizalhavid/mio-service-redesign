import { HouseInfoRequest } from "../commons/types";
import { API } from "../commons/urls";
import { CustomerProfile } from "../contexts/AuthContext";
import AxiosClient from "./axios-client";

export const postCustomer = (data: CustomerProfile) =>
  AxiosClient.post(API.REGISTER, data);

export const getCustomer = (customerId: any) =>
  AxiosClient.get(`${API.GET_CUSTOMER}/${customerId}`);

export const putCustomer = (data: CustomerProfile) =>
  AxiosClient.put(`${API.PUT_CUSTOMER}/${data.customerId}`, data);

export const getHouseInfo = (data: HouseInfoRequest) =>
  AxiosClient.post(API.GET_HOUSE_INFO, data);
