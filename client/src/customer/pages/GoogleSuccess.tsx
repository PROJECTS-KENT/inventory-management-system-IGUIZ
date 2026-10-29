
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "../services/account";
import api from "../../api/axios";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function finishLogin() {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const type = params.get("type");

      if (!token || !type) {
        navigate("/", { replace: true });
        return;
      }

      if (type === "ADMIN") {
        // Clear any previous customer session.
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customer");

        localStorage.setItem("token", token);

        try {
          const response = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data?.user;

          if (user?.role !== "ADMIN") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("name");
            navigate("/", { replace: true });
            return;
          }

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", user.role);
          localStorage.setItem("name", user.name || "");

          navigate("/dashboard", { replace: true });
          return;
        } catch (error) {
          console.error("Admin Google login failed:", error);

          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("name");

          navigate("/login", { replace: true });
          return;
        }
      }

      if (type !== "CUSTOMER") {
        navigate("/", { replace: true });
        return;
      }

      // Clear any previous admin session.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("name");

      localStorage.setItem("customerToken", token);

      try {
        const customer = await getProfile();

        localStorage.setItem("customer", JSON.stringify(customer));

        const redirect = localStorage.getItem("redirectAfterLogin");

        if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirect, { replace: true });
        } else {
          localStorage.removeItem("redirectAfterLogin");
          navigate("/store", { replace: true });
        }
      } catch (error) {
        console.error("Customer Google login failed:", error);

        localStorage.removeItem("customerToken");
        localStorage.removeItem("customer");

        navigate("/", { replace: true });
      }
    }

    void finishLogin();
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Signing you in...
    </div>
  );
}
