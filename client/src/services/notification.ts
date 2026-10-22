import axios from "axios";

const API = "http://localhost:5000/orders";

export async function getUnreadOrders() {
  const res = await axios.get(
    `${API}/notifications/unread`
  );

  return res.data.count;
}

export async function markNotificationsRead() {
  await axios.patch(
    `${API}/notifications/viewed`
  );
}