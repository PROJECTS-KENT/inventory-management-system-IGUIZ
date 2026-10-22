import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "../services/account";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function finishLogin() {
      console.log("========== GoogleSuccess ==========");

      const params = new URLSearchParams(location.search);

      const token = params.get("token");

      console.log("Token from URL:", token);

      if (!token) {
        navigate("/");
        return;
      }

      // Save JWT
      localStorage.setItem("customerToken", token);

      try {
        // Fetch customer profile
        const customer = await getProfile();

        console.log("Customer:", customer);

        localStorage.setItem(
          "customer",
          JSON.stringify(customer)
        );

        const redirect =
          localStorage.getItem("redirectAfterLogin");

        console.log("Redirect value:", redirect);

        if (redirect) {
          localStorage.removeItem(
            "redirectAfterLogin"
          );

          navigate(redirect, {
            replace: true,
          });
        } else {
  navigate("/store", {
    replace: true,
  });
}
      } catch (err) {
        console.error(err);
        navigate("/", {
          replace: true,
        });
      }
    }

    finishLogin();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
}