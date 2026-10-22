const API =
  "http://localhost:5000/api/customer/auth";

export function googleLogin() {
  window.location.href = `${API}/google`;
}