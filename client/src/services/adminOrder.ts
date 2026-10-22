
import api from "./api";

export async function getOrders() {
  const res = await api.get("/orders");
  return res.data.orders;
}

export async function getOrder(id: string) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

export async function approveOrder(id: string) {
  const res = await api.patch(`/orders/${id}/approve`);
  return res.data;
}

export async function rejectOrder(id: string) {
  const res = await api.patch(`/orders/${id}/reject`);
  return res.data;
}
