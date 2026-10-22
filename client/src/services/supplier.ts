import api from "./api";

export async function getSuppliers() {
  const response = await api.get("/suppliers");
  return response.data.suppliers;
}

export async function createSupplier(name: string) {
  const response = await api.post("/suppliers", {
    name,
  });

  return response.data.supplier;
}

export async function updateSupplier(
  id: string,
  name: string
) {
  const response = await api.put(`/suppliers/${id}`, {
    name,
  });

  return response.data.supplier;
}

export async function deleteSupplier(id: string) {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
}