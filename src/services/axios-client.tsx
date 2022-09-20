import axios from "axios";
import { ENV } from "../commons/environment";
import { StorageHelper } from "./storage-helper";

const AxiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

AxiosClient.interceptors.request.use(async (config: any) => {
  const token = await StorageHelper.getValue("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AxiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.log("responseError", error);
//     console.log("responseError1", error.response.status);
//     if (error.status === 401) {
//       navigate("Login");
//     }
//   }
// );

export default AxiosClient;
