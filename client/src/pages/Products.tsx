
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../services/product";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Package,
  Eye,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { SERVER_URL } from "../services/api";

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  image?: string;
  price: number;
  quantity: number;
  category: {
    name: string;
  };
  supplier: {
    name: string;
  };
}

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getProducts(search);

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [search]);

  async function refreshProducts() {
    try {
      setLoading(true);
      setLoadError(false);

      const data = await getProducts(search);
      setProducts(data);
    } catch (error) {
      console.error("Failed to refresh products:", error);
      setLoadError(true);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      background: "#151522",
      color: "#F8FAFC",
      iconColor: "#F87171",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl border border-white/10",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      await refreshProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product.");
    }
  }

  const lowStockCount = products.filter(
    (product) => product.quantity <= 5
  ).length;

  const inventoryUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Product Inventory"
        subtitle="Manage your keyboard collection, pricing, suppliers, and stock levels."
      />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            KEYVERSE / INVENTORY
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Product Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, review, and manage your products.
          </p>
        </div>

        <button
          onClick={() => navigate("/products/new")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Products Found</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {products.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <Package size={21} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Units in Listed Stock</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {inventoryUnits.toLocaleString()}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <Boxes size={21} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Low-Stock Products</p>
              <p className="mt-2 text-3xl font-bold text-rose-300">
                {lowStockCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                5 units or fewer
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
              <AlertTriangle size={21} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-white">All Products</h2>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? `Search results for "${search}"`
                : "Your current product catalog"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0C15] py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <button
              onClick={refreshProducts}
              disabled={loading}
              title="Refresh products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] px-4 py-3">
          <span className="text-sm text-slate-400">
            Listed inventory value
          </span>
          <span className="text-lg font-bold text-violet-300">
            ₱
            {inventoryValue.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {loadError ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.04] px-4 py-12 text-center">
            <AlertTriangle
              size={32}
              className="mx-auto mb-3 text-rose-300"
            />
            <h3 className="font-semibold text-white">
              Unable to load products
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Check your connection and try again.
            </p>
            <button
              onClick={refreshProducts}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
              <Package size={30} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white">
              No products found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              {search
                ? "Try a different search term or clear your search."
                : "Your catalog is empty. Add your first product to get started."}
            </p>

            {search ? (
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05]"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => navigate("/products/new")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus size={16} />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[#191827] text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="w-14 px-4 py-4 text-center">#</th>
                  <th className="px-4 py-4 text-center">Image</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4 text-center">SKU</th>
                  <th className="px-4 py-4 text-center">Category</th>
                  <th className="px-4 py-4 text-center">Supplier</th>
                  <th className="px-4 py-4 text-right">Price</th>
                  <th className="px-4 py-4 text-center">Stock</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-violet-400/[0.035]"
                  >
                    <td className="px-4 py-4 text-center text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      {product.image ? (
                        <img
                          src={`${SERVER_URL}/uploads/products/${product.image}`}
                          alt={product.name}
                          className="mx-auto h-14 w-14 rounded-xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-600">
                          <Package size={22} />
                        </div>
                      )}
                    </td>

                    <td className="max-w-[200px] px-4 py-4">
                      <p className="truncate font-semibold text-white">
                        {product.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Product #{index + 1}
                      </p>
                    </td>

                    <td className="max-w-[180px] px-4 py-4">
                      <p className="truncate text-slate-400">
                        {product.description || "No description"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-xs text-slate-300">
                        {product.sku}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center text-slate-300">
                      {product.category?.name || "—"}
                    </td>

                    <td className="px-4 py-4 text-center text-slate-300">
                      {product.supplier?.name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-white">
                      ₱
                      {product.price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-semibold ${
                          product.quantity <= 5
                            ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.quantity <= 5
                              ? "bg-rose-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        {product.quantity <= 5
                          ? `Low (${product.quantity})`
                          : `${product.quantity} pcs`}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/products/${product.id}`)
                          }
                          title="View product"
                          aria-label={`View ${product.name}`}
                          className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-2 text-sky-300 transition hover:bg-sky-400/20"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/products/edit/${product.id}`)
                          }
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-2 text-amber-300 transition hover:bg-amber-400/20"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-2 text-rose-300 transition hover:bg-rose-400/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !loadError && products.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {products.length} product
              {products.length === 1 ? "" : "s"}
            </span>
            <span>Stock alert threshold: 5 units</span>
          </div>
        )}
      </Card>

      <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-slate-600">
        KEYVERSE ADMIN CONSOLE · PRODUCT INVENTORY
      </footer>
    </div>
  );
}
