import axios from "axios";

const API = "http://localhost:5000/api/orders";

export async function getOrders() {
  const res = await axios.get(API);
  return res.data.orders;
}

export async function getOrder(id: string) {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
}

export async function approveOrder(id: string) {
  const res = await axios.patch(`${API}/${id}/approve`);
  return res.data;
}

export async function rejectOrder(id: string) {
  const res = await axios.patch(`${API}/${id}/reject`);
  return res.data;
}