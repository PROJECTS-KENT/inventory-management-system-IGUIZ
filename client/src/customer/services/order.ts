import api from "../../services/api";

function authHeader() {
  const token = localStorage.getItem("customerToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function createOrder(data: any) {
  const response = await api.post(
    "/orders",
    data,
    authHeader()
  );

  return response.data;
}

export async function getOrders() {
  const response = await api.get(
    "/customer/orders",
    authHeader()
  );

    return response.data.orders;
}

export async function getOrder(id: string) {
  const response = await api.get(
    `/customer/orders/${id}`,
    authHeader()
  );

  return response.data;
}

export async function approveOrder(id: string) {
  const response = await api.patch(
    `/orders/${id}/approve`,
    {},
    authHeader()
  );

  return response.data;
}

export async function rejectOrder(id: string) {
  const response = await api.patch(
    `/orders/${id}/reject`,
    {},
    authHeader()
  );

  return response.data;
}