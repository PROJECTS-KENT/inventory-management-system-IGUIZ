import api from "./api";

export async function getUsers() {
  const response = await api.get("/users");
  return response.data.users;
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
}) {
  const response = await api.post("/users", user);
  return response.data.user;
}

export async function toggleUserStatus(id: string) {
  const response = await api.put(`/users/${id}/toggle-status`);
  return response.data.user;
}

export async function changeUserRole(id: string) {
  const response = await api.put(`/users/${id}/change-role`);
  return response.data.user;
}