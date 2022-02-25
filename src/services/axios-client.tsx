import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config } from "react-native-config";

const AxiosClient = axios.create({
  baseURL: "https://homeservices-dev-ab7f9.firebaseapp.com/api/v1",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

AxiosClient.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem("TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
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
