
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, getOrders } from "../services/account";

const STORE_BACKGROUND =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function Profile() {
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const profile = await getProfile();

        if (!active) return;
        setCustomer(profile);

        try {
          const customerOrders = await getOrders();
          if (active) setOrders(customerOrders);
        } catch (error) {
          console.error("Failed to load orders:", error);
          if (active) setOrdersError(true);
        }
      } catch (error) {
        console.error("Failed to load customer profile:", error);

        if (active) {
          toast.error("Unable to load your profile. Please sign in again.");
          navigate("/store", { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [navigate]);

  function logout() {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("cart");

    toast.success("You have signed out.");
    navigate("/store", { replace: true });
    window.location.reload();
  }

  const formatPrice = (amount: number) =>
    `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusStyle = (status: string) => {
    const value = String(status || "").toLowerCase();

    if (["delivered", "completed", "paid"].includes(value)) {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (["cancelled", "canceled", "failed"].includes(value)) {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    if (["pending", "processing", "shipped"].includes(value)) {
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    return "border-white/10 bg-white/5 text-slate-300";
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 bg-cover bg-center px-6 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(7,10,24,.93), rgba(7,10,24,.96)), url("${STORE_BACKGROUND}")`,
        }}
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
          <p className="mt-4 text-sm text-slate-300">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const initial = String(customer.name || customer.email || "C")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className="relative min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(7,10,24,.88) 0%,
            rgba(10,13,29,.94) 45%,
            rgba(7,10,24,.98) 100%
          ),
          url("${STORE_BACKGROUND}")
        `,
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-32 top-96 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/store" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1m3 0h1M8 15h8" />
              </svg>
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight">
                KEY<span className="text-violet-400">VERSE</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Your setup starts here
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/store"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-white/5"
            >
              ← Back to Store
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        {/* Page heading */}
        <section className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
            Your personal space
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            My Account<span className="text-violet-400">.</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Manage your profile and keep track of your keyboard orders.
          </p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.65fr]">
          {/* Customer profile */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="h-24 bg-gradient-to-r from-violet-700/70 via-purple-600/50 to-blue-700/70" />

            <div className="px-6 pb-7">
              <div className="-mt-11 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-violet-500 to-blue-600 text-3xl font-black shadow-xl shadow-violet-950/40">
                {initial}
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Customer profile
              </p>
              <h2 className="mt-2 break-words text-2xl font-extrabold">
                {customer.name || "Welcome"}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-400">
                {customer.email}
              </p>

              <div className="my-6 border-t border-white/10" />

              <div className="space-y-5">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
                    Full name
                  </p>
                  <p className="break-words text-sm font-medium text-slate-200">
                    {customer.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
                    Email address
                  </p>
                  <p className="break-all text-sm font-medium text-slate-200">
                    {customer.email || "Not provided"}
                  </p>
                </div>
              </div>

              <Link
                to="/customer/profile/edit"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-bold shadow-lg shadow-violet-950/20 transition hover:brightness-110"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m14 5 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z" />
                </svg>
                Edit Profile
              </Link>
            </div>
          </section>

          {/* Order history */}
          <section className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                  Your purchases
                </p>
                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  Order History
                </h2>
              </div>

              <div className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 text-lg font-extrabold text-violet-300">
                {orders.length}
              </div>
            </div>

            {ordersError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center">
                <p className="font-semibold text-red-300">
                  Could not load your orders
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Your profile is available, but your order history couldn't
                  be retrieved.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl">
                  ♧
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  No orders just yet
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Your keyboard purchases will appear here once you place an
                  order.
                </p>
                <Link
                  to="/store"
                  className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-bold transition hover:brightness-110"
                >
                  Explore Keyboards
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-xl border border-white/10 bg-slate-950/45 p-5 transition hover:border-violet-400/30 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Order reference
                        </p>
                        <h3 className="mt-1 break-all font-bold text-white">
                          {order.reference}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(order.status)}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </div>

                    <div className="my-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4">
                      <div>
                        <p className="text-xs text-slate-500">Order total</p>
                        <p className="mt-1 text-lg font-extrabold text-violet-300">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Order date</p>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Items in this order
                      </p>

                      <div className="space-y-3">
                        {(order.items || []).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-4 text-sm"
                          >
                            <span className="min-w-0 break-words text-slate-300">
                              {item.product?.name || "Product"}
                            </span>
                            <span className="shrink-0 font-semibold text-slate-400">
                              × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/customer/orders/${order.id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/5 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/10"
                    >
                      View Order Details
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-16 border-t border-white/10 py-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-300">
            KEY<span className="text-violet-400">VERSE</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Your account. Your orders. Your setup.
          </p>
        </footer>
      </main>
    </div>
  );
}
