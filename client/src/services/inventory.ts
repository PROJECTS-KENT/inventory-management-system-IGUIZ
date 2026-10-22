import api from "./api";

export async function stockIn(
  productId: string,
  quantity: number,
  remarks: string
) {
  const response = await api.post("/inventory/stock-in", {
    productId,
    quantity,
    remarks,
  });

  return response.data;
}

export async function stockOut(
  productId: string,
  quantity: number,
  remarks: string
) {
  const response = await api.post("/inventory/stock-out", {
    productId,
    quantity,
    remarks,
  });

  return response.data;
}

export async function getTransactions() {
  const response = await api.get("/inventory/history");
  return response.data.transactions;
}