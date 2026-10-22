
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_BASE_URL, SERVER_URL } from "../../services/api";

const backgroundImage =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const customer = localStorage.getItem("customer");
  const customerToken = localStorage.getItem("customerToken");

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    `₱${Number(price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  function proceedCheckout() {
    if (!customerToken) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      window.location.href =
        `${API_BASE_URL}/customer/auth/google`;
      return;
    }

    navigate("/checkout");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      <div className="fixed inset-0 bg-[#070914]/90" />
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-blue-950/30" />

      {/* Decorative glow */}
      <div className="pointer-events-none fixed -left-40 top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative z-10">
        {/* Navigation */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Link
              to="/store"
              className="text-2xl font-black tracking-[0.2em] sm:text-3xl"
            >
              KEY
              <span className="text-violet-400">VERSE</span>
              <span className="ml-2 align-top text-xs font-medium tracking-normal text-gray-500">
                STORE
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                to="/store"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-gray-300 transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
              >
                ← Continue Shopping
              </Link>

              <Link
                to="/track-order"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-gray-300 transition hover:border-blue-400/50 hover:bg-white/5 hover:text-white"
              >
                Track Order
              </Link>

              {customer && (
                <Link
                  to="/customer/profile"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110"
                >
                  My Profile
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          {/* Page heading */}
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-violet-400">
              Your collection
            </p>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Shopping <span className="text-violet-400">Cart.</span>
                </h1>

                <p className="mt-3 text-gray-400">
                  Your next favorite keyboard is one step away.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Items in cart
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {cart.reduce(
                    (sum: number, item: any) =>
                      sum + item.quantity,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            /* Empty cart */
            <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.045] px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-10 w-10 text-violet-300"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-gray-400">
                Your dream setup starts here. Explore our collection
                and find the keyboard that fits your style.
              </p>

              <Link
                to="/store"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Explore Keyboards →
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_390px]">
              {/* Cart items */}
              <section className="space-y-4">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Your Items
                  </h2>
                  <span className="text-sm text-gray-500">
                    {cart.length} product{cart.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {cart.map((item: any) => (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:border-violet-400/25 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      {/* Product image */}
                      <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-32 sm:w-32">
                        <img
                          src={`${SERVER_URL}/uploads/products/${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Product information */}
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-400">
                          {item.brand || "KEYVERSE"}
                        </p>

                        <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                          {item.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.connection && (
                            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                              {item.connection}
                            </span>
                          )}
                        </div>

                        <p className="mt-4 text-lg font-bold text-violet-300">
                          {formatPrice(item.price)}
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            / unit
                          </span>
                        </p>
                      </div>

                      {/* Quantity and subtotal */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 sm:min-w-[180px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-1.5">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-lg text-gray-300 transition hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"
                          >
                            −
                          </button>

                          <span className="min-w-6 text-center font-bold tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-lg font-semibold text-white transition hover:brightness-110"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Subtotal
                          </p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {formatPrice(
                              Number(item.price) * item.quantity
                            )}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="mt-3 text-xs font-semibold text-rose-400 transition hover:text-rose-300"
                          >
                            Remove item
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-400 transition hover:text-violet-300"
                >
                  <span>←</span> Add more keyboards
                </Link>
              </section>

              {/* Order summary */}
              <aside className="lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-2xl border border-violet-400/20 bg-[#101323]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                  <div className="border-b border-white/10 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                      Almost yours
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4 px-6 py-6">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-400">
                        Items subtotal
                      </span>
                      <span className="font-medium text-gray-200">
                        {formatPrice(total)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-500">
                        Calculated at checkout
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            Estimated total
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PHP · Shipping not included
                          </p>
                        </div>

                        <p className="text-2xl font-black tracking-tight text-violet-300 sm:text-3xl">
                          {formatPrice(total)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={proceedCheckout}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-900/30"
                    >
                      Proceed to Checkout
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    {!customerToken && (
                      <p className="text-center text-xs leading-5 text-gray-500">
                        You'll sign in with Google before checkout.
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-gray-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-emerald-400"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="11"
                          rx="2"
                        />
                        <path
                          d="M8 10V7a4 4 0 0 1 8 0v3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Secure checkout experience
                    </div>
                  </div>
                </div>

                <p className="mt-4 px-2 text-center text-xs leading-5 text-gray-500">
                  Product availability and final delivery costs may be
                  confirmed during checkout.
                </p>
              </aside>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-center text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
            <p>
              © {new Date().getFullYear()} KEYVERSE. Built for your setup.
            </p>
            <Link
              to="/store"
              className="transition hover:text-violet-300"
            >
              Back to Store
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
