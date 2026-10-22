
import { API_BASE_URL, SERVER_URL } from "../../services/api";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/order";
import toast from "react-hot-toast";

const backgroundImage =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#090c19]/80 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15";

const labelClass =
  "mb-2 block text-sm font-medium text-gray-300";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const customer = JSON.parse(
    localStorage.getItem("customer") || "null"
  );

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: customer?.name || "",
    email: customer?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });

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

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!localStorage.getItem("customerToken")) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      window.location.href =
        `${API_BASE_URL}/customer/auth/google`;
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder({
        ...form,
        total,
        items: cart.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/thank-you/${order.reference}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
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
              KEY<span className="text-violet-400">VERSE</span>
              <span className="ml-2 align-top text-xs font-medium tracking-normal text-gray-500">
                STORE
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                to="/cart"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-gray-300 transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
              >
                ← Back to Cart
              </Link>

              <Link
                to="/customer/profile"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
              >
                My Profile
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          {/* Heading */}
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-violet-400">
              Almost yours
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Secure <span className="text-violet-400">Checkout.</span>
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-gray-400">
              Enter your delivery details and review your keyboard
              order before placing it.
            </p>

            {/* Checkout progress */}
            <div className="mt-8 flex max-w-lg items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold">
                1
              </div>
              <span className="text-sm font-semibold text-white">
                Delivery details
              </span>

              <div className="h-px flex-1 bg-white/15" />

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-gray-400">
                2
              </div>
              <span className="text-sm text-gray-400">
                Review
              </span>
            </div>
          </div>

          {cart.length === 0 ? (
            <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.045] px-6 py-16 text-center backdrop-blur-2xl sm:px-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl">
                🛒
              </div>

              <h2 className="text-2xl font-bold">
                Nothing to check out yet
              </h2>

              <p className="mt-3 text-gray-400">
                Your cart is empty. Find your next keyboard in our store.
              </p>

              <Link
                to="/store"
                className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-bold transition hover:brightness-110"
              >
                Browse Keyboards →
              </Link>
            </section>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_410px]">
                {/* Delivery form */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">
                        Delivery Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-400">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={labelClass} htmlFor="customerName">
                        Full Name <span className="text-violet-400">*</span>
                      </label>
                      <input
                        id="customerName"
                        name="customerName"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={form.customerName}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass} htmlFor="email">
                          Email Address{" "}
                          <span className="text-violet-400">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="phone">
                          Phone Number{" "}
                          <span className="text-violet-400">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="09XX XXX XXXX"
                          value={form.phone}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="mb-5 text-base font-bold text-white">
                        Shipping Address
                      </h3>

                      <div className="space-y-5">
                        <div>
                          <label className={labelClass} htmlFor="address">
                            Complete Address{" "}
                            <span className="text-violet-400">*</span>
                          </label>
                          <input
                            id="address"
                            name="address"
                            autoComplete="street-address"
                            placeholder="House no., street, barangay"
                            value={form.address}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className={labelClass} htmlFor="city">
                              City / Municipality{" "}
                              <span className="text-violet-400">*</span>
                            </label>
                            <input
                              id="city"
                              name="city"
                              autoComplete="address-level2"
                              placeholder="Enter city"
                              value={form.city}
                              onChange={handleChange}
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label className={labelClass} htmlFor="province">
                              Province{" "}
                              <span className="text-violet-400">*</span>
                            </label>
                            <input
                              id="province"
                              name="province"
                              autoComplete="address-level1"
                              placeholder="Enter province"
                              value={form.province}
                              onChange={handleChange}
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:max-w-xs">
                          <label className={labelClass} htmlFor="zip">
                            ZIP Code{" "}
                            <span className="text-violet-400">*</span>
                          </label>
                          <input
                            id="zip"
                            name="zip"
                            autoComplete="postal-code"
                            placeholder="Postal code"
                            value={form.zip}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <label className={labelClass} htmlFor="notes">
                        Delivery Notes{" "}
                        <span className="font-normal text-gray-500">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        placeholder="Landmarks, delivery instructions, or other details..."
                        value={form.notes}
                        onChange={handleChange}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
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

                    <div>
                      <p className="text-sm font-semibold text-gray-200">
                        Your information
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Check that your contact and delivery details are
                        correct before placing your order.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Order summary */}
                <aside className="lg:sticky lg:top-6">
                  <div className="overflow-hidden rounded-2xl border border-violet-400/20 bg-[#101323]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                    <div className="border-b border-white/10 px-6 py-5">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                        Your selection
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">
                        Order Summary
                      </h2>
                      <p className="mt-1 text-sm text-gray-400">
                        {cart.reduce(
                          (sum: number, item: any) =>
                            sum + item.quantity,
                          0
                        )}{" "}
                        item(s) in your order
                      </p>
                    </div>

                    <div className="space-y-5 px-6 py-6">
                      <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                        {cart.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                              <img
                                src={`${SERVER_URL}/uploads/products/${item.image}`}
                                alt={item.name}
                                className="h-full w-full object-contain p-1"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                                {item.quantity}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-semibold text-gray-100">
                                {item.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {formatPrice(Number(item.price))} each
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold text-gray-200">
                              {formatPrice(
                                Number(item.price) * item.quantity
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 pt-5">
                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-medium text-gray-200">
                            {formatPrice(total)}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-between gap-4 text-sm">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-right text-xs text-gray-500">
                            Confirmed separately
                          </span>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-5">
                          <p className="text-sm text-gray-400">
                            Order total
                          </p>
                          <p className="mt-1 text-3xl font-black tracking-tight text-violet-300">
                            {formatPrice(total)}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-gray-500">
                            Shipping charges are not included in this
                            displayed total.
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="3"
                                opacity="0.25"
                              />
                              <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
                            Placing Order...
                          </>
                        ) : (
                          <>
                            Place Order
                            <span>→</span>
                          </>
                        )}
                      </button>

                      <Link
                        to="/cart"
                        className="block text-center text-sm text-gray-400 transition hover:text-violet-300"
                      >
                        ← Return to cart
                      </Link>

                      <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-gray-500">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="h-4 w-4 text-emerald-400"
                          aria-hidden="true"
                        >
                          <path
                            d="m5 12 4 4L19 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Review your details before submitting
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </form>
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
