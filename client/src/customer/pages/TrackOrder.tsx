
import { useState } from "react";
import { Link } from "react-router-dom";
import { trackOrder } from "../services/orderTracker";

export default function TrackOrder() {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!reference.trim()) {
      setError("Please enter your order reference number.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await trackOrder(
        reference.trim().toUpperCase()
      );
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't find that order. Check your reference number and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function statusStyles(status: string) {
    switch (status) {
      case "APPROVED":
        return {
          badge:
            "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
          dot: "bg-emerald-400",
          message:
            "Your order has been approved. Our team is preparing the next steps.",
        };

      case "REJECTED":
        return {
          badge: "border-red-400/30 bg-red-400/10 text-red-300",
          dot: "bg-red-400",
          message:
            "This order was rejected. Please contact our team if you need assistance.",
        };

      default:
        return {
          badge:
            "border-amber-400/30 bg-amber-400/10 text-amber-200",
          dot: "bg-amber-400",
          message:
            "Your order is awaiting review and confirmation by our team.",
        };
    }
  }

  const formatPrice = (value: number) =>
    `₱${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070816] px-4 py-10 text-white sm:px-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#080a1b]/95 via-[#10102b]/85 to-[#070816]/95" />

      <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute -right-32 top-96 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />

      <main className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm font-black tracking-[0.25em] text-white transition hover:text-violet-300"
          >
            <span className="text-violet-400">K</span>
            KEYVERSE
          </Link>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
            Order Tracking
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Where's Your Order
            <span className="text-violet-400">?</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Enter your order reference to view its current status,
            delivery details, and purchased items.
          </p>
        </header>

        {/* Search panel */}
        <section className="rounded-3xl border border-white/10 bg-[#101225]/80 p-5 shadow-[0_0_60px_rgba(99,102,241,0.09)] backdrop-blur-2xl sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h2 className="font-bold text-white">
                Find your order
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Example: ORD-SLD9ZK
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter order reference..."
                aria-label="Order reference number"
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-[#080a18]/80 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 font-bold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Searching...
                </>
              ) : (
                <>
                  Track Order
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Your reference number can be found on your order confirmation
            page.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-5 text-sm text-red-200"
          >
            <span className="text-lg" aria-hidden="true">
              !
            </span>
            <div>
              <p className="font-bold">Unable to find order</p>
              <p className="mt-1 leading-6 text-red-200/75">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Order details */}
        {order && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#101225]/85 shadow-[0_0_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl">
            <div className="h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

            <div className="p-5 sm:p-8">
              {/* Reference and status */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Order Reference
                  </p>

                  <h2 className="mt-2 break-all text-2xl font-black tracking-wide sm:text-3xl">
                    {order.reference}
                  </h2>

                  <p className="mt-3 text-sm text-slate-400">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {(() => {
                  const styles = statusStyles(order.status);

                  return (
                    <div
                      className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide ${styles.badge}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${styles.dot}`}
                      />
                      {order.status}
                    </div>
                  );
                })()}
              </div>

              {/* Status message */}
              <div className="mt-7 flex gap-4 rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
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

                <div>
                  <h3 className="font-bold text-white">
                    Order status update
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {statusStyles(order.status).message}
                  </p>
                </div>
              </div>

              {/* Customer and delivery details */}
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M4 21v-2a8 8 0 0 1 16 0v2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold">Customer Details</h3>
                  </div>

                  <p className="break-words font-semibold text-slate-200">
                    {order.customerName}
                  </p>
                  <p className="mt-2 break-all text-sm text-slate-400">
                    {order.email}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {order.phone}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold">Delivery Address</h3>
                  </div>

                  <p className="text-slate-200">{order.address}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {order.city}, {order.province}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {order.zip}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-9">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">
                    Ordered Items
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                    {order.items?.length || 0}{" "}
                    {(order.items?.length || 0) === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                  <table className="w-full min-w-[440px] text-sm">
                    <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 text-left font-semibold">
                          Product
                        </th>
                        <th className="px-5 py-4 text-center font-semibold">
                          Qty
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Unit Price
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Subtotal
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items?.map((item: any) => (
                        <tr
                          key={item.id}
                          className="border-t border-white/[0.07] transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-200">
                              {item.product?.name || "Product"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-center text-slate-300">
                            {item.quantity}
                          </td>
                          <td className="px-5 py-4 text-right text-slate-300">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-white">
                            {formatPrice(
                              Number(item.price) * Number(item.quantity)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.08] to-blue-500/[0.08] p-5 sm:p-6">
                <div>
                  <p className="text-sm text-slate-400">
                    Order Total
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Philippine pesos (PHP)
                  </p>
                </div>

                <p className="text-2xl font-black text-white sm:text-3xl">
                  {formatPrice(order.total)}
                </p>
              </div>

              {/* Footer actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/store"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 font-bold text-white transition hover:from-violet-500 hover:to-blue-500"
                >
                  Continue Shopping <span aria-hidden="true">→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setOrder(null);
                    setReference("");
                    setError("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!order && !loading && !error && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
              <span aria-hidden="true">⌕</span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-200">
              Your order details will appear here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Enter the reference number from your order confirmation
              to see your latest order information.
            </p>

            <Link
              to="/store"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition hover:text-violet-200"
            >
              Browse the store <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        <footer className="py-10 text-center text-xs tracking-[0.18em] text-slate-600">
          BUILT FOR YOUR NEXT KEYSTROKE.
          <span className="mx-2 text-violet-400">•</span>
          KEYVERSE
        </footer>
      </main>
    </div>
  );
}
