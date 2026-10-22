
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setAuthorized(false);
          setChecking(false);
        }
        return;
      }

      try {
        await api.get("/auth/me");

        if (!cancelled) {
          setAuthorized(true);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("name");
          setAuthorized(false);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Verifying your session...</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
