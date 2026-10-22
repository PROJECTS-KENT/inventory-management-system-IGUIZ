
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

    window.location.href =
      "http://localhost:5000/api/customer/auth/google";

    return null;
  }

  return <>{children}</>;
}
