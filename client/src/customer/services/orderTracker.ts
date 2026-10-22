import axios from "axios";

const API = "http://localhost:5000/api/orders";

export async function trackOrder(reference: string) {
  const res = await axios.get(`${API}/track/${reference}`);
  return res.data;
}