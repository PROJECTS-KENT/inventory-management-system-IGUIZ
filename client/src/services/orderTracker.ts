import axios from "axios";

const API = "http://localhost:5000/orders";

export async function trackOrder(reference: string) {
  const res = await axios.get(
    `${API}/reference/${reference}`
  );

  return res.data;
}