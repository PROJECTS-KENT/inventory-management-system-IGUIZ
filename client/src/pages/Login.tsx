
import { Link } from "react-router-dom";
import { googleLogin } from "../services/customerAuth";

const LOGIN_BACKGROUND =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function Login() {
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
      <Link
        to="/store"
        className="absolute left-5 top-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 transition hover:text-white sm:left-8 sm:top-8"
      >
        ← Back to Store
      </Link>

      <main className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/store" className="inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-xl shadow-violet-500/25">
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
              <span className="block text-2xl font-black">
                KEY<span className="text-violet-400">VERSE</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Your setup starts here
              </span>
            </div>
          </Link>
        </div>

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
              Secure Access
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Sign in to <span className="text-violet-400">KEYVERSE</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Continue with Google to access your account.
            </p>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.12 13.22l7.98 6.19C13 13.72 18.1 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.9 46.98 24.55Z" />
              <path fill="#FBBC05" d="M11.1 28.59A14.4 14.4 0 0 1 10.34 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.52 3.12 10.78l7.98-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-5.9 0-11-4.22-12.9-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Administrators will be directed to the admin dashboard.
            Customers will be directed to the store.
          </p>
        </div>

        <p className="mt-7 text-center text-xs tracking-wide text-slate-500">
          KEYVERSE <span className="mx-1 text-violet-500">✦</span>
          Find your feel. Build your setup.
        </p>
      </main>
    </div>
  );
}
