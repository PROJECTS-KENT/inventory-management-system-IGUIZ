import { API_BASE_URL, SERVER_URL } from "../../services/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts } from "../services/customer";
import { useCart } from "../context/CartContext";

const STORE_BACKGROUND =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function Store() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const customer = localStorage.getItem("customer");
  const customerToken = localStorage.getItem("customerToken");
  const isSignedIn = Boolean(customer && customerToken);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load keyboards.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category?.name === category);
    }

    setFiltered(result);
  }, [search, category, products]);

  const categories = [
    "All",
    ...new Set(
      products.map((p) => p.category?.name).filter(Boolean)
    ),
  ];

  function handleAddToCart(product: any) {
    if (!isSignedIn) {
      toast("Sign in with Google to add keyboards to your cart.");

      localStorage.setItem("redirectAfterLogin", "/store");
      window.location.href = `${API_BASE_URL}/customer/auth/google`;

      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  }

  function logout() {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("cart");

    toast.success("You have signed out.");
    navigate("/store", { replace: true });
    window.location.reload();
  }

  const selectClasses =
    "w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div
      className="relative min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(7, 10, 24, 0.88) 0%,
            rgba(10, 13, 29, 0.94) 45%,
            rgba(7, 10, 24, 0.98) 100%
          ),
          url("${STORE_BACKGROUND}")
        `,
      }}
    >
      {/* Ambient background glow */}
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

          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => navigate("/customer/profile")}
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5 sm:px-4"
                >
                  My Account
                </button>

                <button
                  onClick={logout}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 sm:px-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  localStorage.setItem("redirectAfterLogin", "/store");
                  window.location.href = `${API_BASE_URL}/customer/auth/google`;
                }}
                className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-3 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 sm:px-4"
              >
                Sign In with Google
              </button>
            )}

            <Link
              to="/login"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-400/30 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-xl transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white sm:px-4 sm:text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-violet-300"
                aria-hidden="true"
              >
                <path
                  d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Sign in as Admin</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-bold shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/20"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              Cart
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
                {cart.length}
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        {/* Hero section */}
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-950/20 via-transparent to-blue-950/20" />

          <div className="relative max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              Find your next favorite
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Every keystroke.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                Your signature.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover keyboards that match your style, elevate your setup,
              and make every keystroke count.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("keyboard-catalog")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-bold shadow-xl shadow-violet-900/30 transition hover:-translate-y-1 hover:shadow-violet-500/20"
            >
              Explore Keyboards
              <span aria-hidden="true">↓</span>
            </button>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
              <span>✦ Curated keyboard collection</span>
              <span>✦ Find your perfect setup</span>
            </div>
          </div>
        </section>

        {/* Product catalog */}
        <section id="keyboard-catalog" className="scroll-mt-28">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                The collection
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Explore Keyboards
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Find the right keyboard for you.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {filtered.length}{" "}
              {filtered.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Search and category filter */}
          <div className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/65 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:grid-cols-2">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                aria-label="Search keyboards"
                placeholder="Search keyboards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClasses}
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Products */}
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 py-20 text-center backdrop-blur">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
              <p className="mt-4 text-sm text-slate-400">
                Finding your next keyboard...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-20 text-center backdrop-blur">
              <p className="text-4xl">⌕</p>
              <h3 className="mt-4 text-xl font-bold">No keyboards found</h3>
              <p className="mt-2 text-sm text-slate-400">
                Try another search or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-6 rounded-xl border border-violet-400/30 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/10"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-950/30"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-blue-500/10 opacity-0 transition group-hover:opacity-100" />

                   <img
  src={
    product.image?.startsWith("https://") ||
    product.image?.startsWith("http://")
      ? product.image
      : product.image
        ? `${SERVER_URL}/uploads/products/${product.image}`
        : undefined
  }
  alt={product.name}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
  className="h-56 w-full object-contain p-5 transition duration-500 group-hover:scale-105"
/>

                    <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-slate-950/75 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur">
                      {product.brand || "Keyboard"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.category?.name && (
                        <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-300">
                          {product.category.name}
                        </span>
                      )}

                      {product.connection && (
                        <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-300">
                          {product.connection}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-violet-200">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-end justify-between gap-2">
                        <span className="text-xs text-slate-400">Price</span>
                        <span className="text-xl font-extrabold tracking-tight text-white">
                          <span className="mr-1 text-sm font-semibold text-violet-400">
                            ₱
                          </span>
                          {Number(product.price).toLocaleString("en-PH")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/20 transition hover:brightness-110 active:scale-[0.98]"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/10 py-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-300">
            KEY<span className="text-violet-400">VERSE</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Find your feel. Build your setup. Enjoy every keystroke.
          </p>
        </footer>
      </main>
    </div>
  );
}