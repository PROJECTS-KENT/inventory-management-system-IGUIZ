import axios from "axios";
import { API_BASE_URL } from "../services/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const isCustomerRequest =
      config.url?.includes("/customer/") ||
      config.url?.includes("/auth/google");

    const token = isCustomerRequest
      ? localStorage.getItem("customerToken")
      : localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;