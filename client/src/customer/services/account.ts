import api from "../../services/api";

function authHeader() {
  const token = localStorage.getItem("customerToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getProfile() {
  const res = await api.get(
    "/customer/me",
    authHeader()
  );

  return res.data;
}

export async function updateProfile(data: any) {
  const res = await api.put(
    "/customer/profile",
    data,
    authHeader()
  );

  return res.data;
}

export async function getOrders() {
  const res = await api.get(
    "/customer/orders",
    authHeader()
  );

  return res.data;
}

// ===============================
// NEW
// ===============================

export async function getOrder(id: string) {
  const res = await api.get(
    `/customer/orders/${id}`,
    authHeader()
  );

  return res.data;
}