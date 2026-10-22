
import { API_BASE_URL } from "../../services/api";

interface Props {
  children: React.ReactNode;
}

export default function CustomerProtectedRoute({
  children,
}: Props) {
  const token = localStorage.getItem("customerToken");

  if (!token) {
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname
    );

    window.location.href = `${API_BASE_URL}/customer/auth/google`;

    return null;
  }

  return <>{children}</>;
}
