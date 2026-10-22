import api from "./api";

function authHeader() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getDashboard() {
  const response = await api.get(
    "/dashboard",
    authHeader()
  );

  return response.data.dashboard;
}