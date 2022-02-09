import { API } from "../commons/urls";
import AxiosClient from "./axios-client";

export const getServices = () => AxiosClient.get(API.GET_SERVICES);
export const postLead = (data: any) => AxiosClient.post(API.POST_LEAD, data);
export const putLead = (data: any) =>
  AxiosClient.post(`${API.POST_LEAD}/${data.leadId}`, data);
