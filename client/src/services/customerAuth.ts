
import { API_BASE_URL } from "./api";

export function googleLogin() {
  window.location.href = `${API_BASE_URL}/customer/auth/google`;
}
