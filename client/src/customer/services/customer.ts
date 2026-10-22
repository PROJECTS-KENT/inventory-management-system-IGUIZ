
import api from "../../services/api";

export async function getProducts() {
  const res = await api.get("/products");
  return res.data.products;
}
