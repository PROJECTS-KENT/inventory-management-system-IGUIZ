import axios from "axios";

const API = "http://localhost:5000/api/products";

export async function getProducts() {
  const res = await axios.get(API);

  return res.data.products;
}