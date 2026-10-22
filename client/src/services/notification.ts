
import api from "./api";

export async function getUnreadOrders() {
  const res = await api.get("/orders/notifications/unread");
  return res.data.count;
}

export async function markNotificationsRead() {
  await api.patch("/orders/notifications/viewed");
}
