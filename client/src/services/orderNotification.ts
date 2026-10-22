import axios from "axios";

const API = "http://localhost:5000/api/orders";

export async function getUnreadOrders() {
  const res = await axios.get(
    `${API}/notifications/unread`
  );

  return res.data.count;
}

export async function clearUnreadOrders() {
  await axios.patch(
    `${API}/notifications/viewed`
  );
}