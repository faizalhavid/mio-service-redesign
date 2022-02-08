import axios from "axios";
import { BASE_URL } from "../commons/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AxiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

AxiosClient.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem("idToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default AxiosClient;
