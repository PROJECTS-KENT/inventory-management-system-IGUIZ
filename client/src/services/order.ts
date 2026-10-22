
import api from "./api";

const API = "/orders";

export async function createOrder(data: any) {
  const response = await api.post(API, data);
  return response.data;
}

export async function getOrders() {
  const response = await api.get(API);
  return response.data;
}

export async function getOrder(id: string) {
  const response = await api.get(`${API}/${id}`);
  return response.data;
}

export async function approveOrder(id: string) {
  const response = await api.patch(`${API}/${id}/approve`);
  return response.data;
}

export async function rejectOrder(id: string) {
  const response = await api.patch(`${API}/${id}/reject`);
  return response.data;
}
