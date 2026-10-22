
import api from "./api";

export async function getProducts(search = "") {
  const response = await api.get("/products", {
    params: {
      search,
    },
  });

  return response.data.products;
}

export async function createProduct(formData: FormData) {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.product;
}

export async function getProductPerformance(id: string) {
  const response = await api.get(`/products/${id}/performance`);

  return response.data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}

export async function getProduct(id: string) {
  const response = await api.get(`/products/${id}`);

  return response.data.product;
}

export async function updateProduct(
  id: string,
  formData: FormData
) {
  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.product;
}
