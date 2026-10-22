
import api from "./api";

export async function trackOrder(reference: string) {
  const res = await api.get(
    `/orders/reference/${encodeURIComponent(reference)}`
  );

  return res.data;
}
