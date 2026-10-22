
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function ThankYou() {
  const { reference } = useParams();
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    if (!reference) return;

    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070816] px-4 py-12 text-white sm:px-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#080a1b]/95 via-[#10102b]/85 to-[#070816]/95" />

      {/* Ambient glow */}
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#101225]/80 shadow-[0_0_80px_rgba(99,102,241,0.12)] backdrop-blur-2xl">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

          <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
            {/* Success icon */}
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_35px_rgba(52,211,153,0.15)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-10 w-10 text-emerald-400"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-violet-300">
              KEYVERSE / Order Confirmed
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Thank You<span className="text-violet-400">!</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Your keyboard order has been placed successfully. We appreciate
              your purchase and will keep you updated on its progress.
            </p>

            {/* Order reference */}
            <div className="mt-9 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-5 sm:p-7">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-violet-300"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="3"
                    width="16"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 8h8M8 12h8M8 16h4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
                YOUR ORDER REFERENCE
              </div>

              <p className="mt-4 break-all text-2xl font-black tracking-wider text-white sm:text-3xl">
                {reference || "Unavailable"}
              </p>

              <button
                type="button"
                onClick={copyReference}
                disabled={!reference}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <span aria-hidden="true">✓</span>
                    Reference Copied
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect
                        x="8"
                        y="8"
                        width="12"
                        height="12"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                    Copy Reference
                  </>
                )}
              </button>
            </div>

            {/* Important information */}
            <div className="mt-7 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-5 text-left sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M12 11v5m0-8h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2 className="font-bold text-amber-200">
                  What happens next?
                </h2>
              </div>

              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  Keep your order reference so you can check its status later.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  Our staff will review your order and confirm stock
                  availability.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  We may contact you using the phone number you provided.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  You can use your reference number to track your order.
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                to="/track-order"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-900/25 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-700/20"
              >
                Track My Order
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/store"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span aria-hidden="true">⌘</span>
                Continue Shopping
              </Link>
            </div>

            <p className="mt-9 text-xs tracking-wide text-slate-500">
              BUILT FOR YOUR NEXT KEYSTROKE.
              <span className="mx-2 text-violet-400">•</span>
              KEYVERSE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
