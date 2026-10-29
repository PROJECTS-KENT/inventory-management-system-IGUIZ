import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../services/api";

const LOGIN_BACKGROUND =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.user;

      if (user?.role !== "ADMIN") {
        toast.error("This account is not authorized for admin access.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE_URL}/customer/auth/google`;
  }

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center px-4 py-10 text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            135deg,
            rgba(7, 10, 24, 0.94),
            rgba(15, 12, 35, 0.91),
            rgba(7, 10, 24, 0.97)
          ),
          url("${LOGIN_BACKGROUND}")
        `,
      }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Back to store */}
      <Link
        to="/store"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-violet-400/40 hover:text-white sm:left-8 sm:top-8"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h12" />
        </svg>
        Back to Store
      </Link>

      <main className="relative z-10 w-full max-w-md">
        {/* KEYVERSE branding */}
        <div className="mb-8 text-center">
          <Link to="/store" className="group inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-xl shadow-violet-500/25 transition group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1m3 0h1M8 15h8" />
              </svg>
            </div>

            <div className="text-left">
              <span className="block text-2xl font-black tracking-tight">
                KEY<span className="text-violet-400">VERSE</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Your setup starts here
              </span>
            </div>
          </Link>
        </div>

        {/* Unified login card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7 text-violet-300"
                aria-hidden="true"
              >
                <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
              Welcome to KEYVERSE
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Sign in to{" "}
              <span className="text-violet-400">KEYVERSE</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to manage your account or explore our store.
            </p>
          </div>

          {/* Admin email/password login */}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Username
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  autoComplete="username"
                  required
                  className={`${inputClasses} pl-12`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-7">
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>

                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={`${inputClasses} pl-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-slate-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Customer Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.5-.1-3-.4-4.4H24v8.3h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.9 6-15.3Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.4A20 20 0 0 0 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.8 27.7a12 12 0 0 1 0-7.4v-5.4H5.9a20 20 0 0 0 0 18.2l6.9-5.4Z"
              />
              <path
                fill="#EA4335"
                d="M24 12.1c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.4c1.6-4.7 6-8.2 11.2-8.2Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-violet-400"
              aria-hidden="true"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Admins use email and password. Customers use Google.
          </div>
        </div>

        <p className="mt-7 text-center text-xs tracking-wide text-slate-500">
          KEYVERSE <span className="mx-1 text-violet-500">•</span>
          Find your feel. Build your setup.
        </p>
      </main>
    </div>
  );
}