
import api from "../../services/api";

export async function trackOrder(reference: string) {
  const res = await api.get(
    `/orders/track/${encodeURIComponent(reference)}`
  );

  return res.data;
}
