
import api from "./api";

export async function getTransactions() {
  const res = await api.get("/inventory/history");
  return res.data;
}

export async function stockIn(
  productId: string,
  quantity: number,
  remarks: string
) {
  const res = await api.post("/inventory/stock-in", {
    productId,
    quantity,
    remarks,
  });

  return res.data;
}

export async function stockOut(
  productId: string,
  quantity: number,
  remarks: string
) {
  const res = await api.post("/inventory/stock-out", {
    productId,
    quantity,
    remarks,
  });

  return res.data;
}
