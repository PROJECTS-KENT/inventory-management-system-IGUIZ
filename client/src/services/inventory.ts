
import api from "./api";

export async function getTransactions() {
  const res = await api.get("/inventory/history");
  const data = res.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.transactions)) {
    return data.transactions;
  }

  console.error("Unexpected inventory history response:", data);
  throw new Error("Inventory history response is not an array");
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
