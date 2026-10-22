
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Identify requests that require customer authentication.
function isCustomerRequest(url: string) {
  return (
    url.startsWith("/customer") ||
    url === "/orders" ||
    url.startsWith("/orders/")
  );
}

// Attach the appropriate token to each request.
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const customerRequest = isCustomerRequest(url);

    const token = customerRequest
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

// Handle unauthorized responses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const customerRequest = isCustomerRequest(url);

      if (customerRequest) {
        localStorage.removeItem("customer");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = "/";
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        window.location.href = "/admin";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
