
import { useEffect, useState } from "react";
import { getProducts } from "../services/product";
import { stockIn, stockOut } from "../services/inventory";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import toast from "react-hot-toast";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Boxes,
  Package,
  FileText,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity?: number;
}

export default function StockTransaction() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    type: "IN",
    quantity: "",
    remarks: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);

      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  const selectedProduct = products.find(
    (product) => product.id === form.productId
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const quantity = Number(form.quantity);

    if (!form.productId) {
      toast.error("Please select a product.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be a whole number greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      if (form.type === "IN") {
        await stockIn(form.productId, quantity, form.remarks);
      } else {
        await stockOut(form.productId, quantity, form.remarks);
      }

      toast.success("Inventory updated successfully!");

      setForm({
        productId: "",
        type: "IN",
        quantity: "",
        remarks: "",
      });

      await loadProducts();
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Check the available stock and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0B0C15] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-300";

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Stock Transaction"
        subtitle="Record incoming stock and outgoing inventory movements."
      />

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          KEYVERSE / INVENTORY / TRANSACTIONS
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Manage Stock Movement
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a product, select the movement type, and enter the quantity.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-5 lg:grid-cols-3">
        {/* Transaction form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                <ArrowLeftRight size={22} />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Transaction Details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Fields marked with * are required.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product */}
              <div>
                <label htmlFor="productId" className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <Package size={16} className="text-violet-300" />
                    Select Product <span className="text-rose-400">*</span>
                  </span>
                </label>

                <select
                  id="productId"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={loadingProducts || submitting}
                >
                  <option value="" className="bg-[#151522]">
                    {loadingProducts
                      ? "Loading products..."
                      : "Choose a product"}
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      className="bg-[#151522]"
                    >
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>

                {!loadingProducts && products.length === 0 && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-amber-300">
                    <AlertCircle size={14} />
                    No products found. Add a product before recording stock.
                  </p>
                )}
              </div>

              {/* Selected product summary */}
              {selectedProduct && (
                <div className="flex items-center gap-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                    <Boxes size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {selectedProduct.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      SKU: {selectedProduct.sku}
                    </p>
                  </div>

                  {selectedProduct.quantity !== undefined && (
                    <div className="ml-auto text-right">
                      <p className="text-xs text-slate-500">Current stock</p>
                      <p className="mt-1 font-bold text-violet-300">
                        {selectedProduct.quantity}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Transaction type */}
              <div>
                <label className={labelClass}>
                  Transaction Type <span className="text-rose-400">*</span>
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        type: "IN",
                      }))
                    }
                    disabled={submitting}
                    aria-pressed={form.type === "IN"}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      form.type === "IN"
                        ? "border-emerald-400/40 bg-emerald-400/[0.08] ring-1 ring-emerald-400/20"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      <ArrowDownToLine size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-white">Stock In</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Add units to inventory
                      </p>
                    </div>

                    {form.type === "IN" && (
                      <CheckCircle2
                        size={18}
                        className="ml-auto text-emerald-300"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        type: "OUT",
                      }))
                    }
                    disabled={submitting}
                    aria-pressed={form.type === "OUT"}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      form.type === "OUT"
                        ? "border-rose-400/40 bg-rose-400/[0.08] ring-1 ring-rose-400/20"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
                      <ArrowUpFromLine size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-white">Stock Out</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Remove units from inventory
                      </p>
                    </div>

                    {form.type === "OUT" && (
                      <CheckCircle2
                        size={18}
                        className="ml-auto text-rose-300"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className={labelClass}>
                  Quantity <span className="text-rose-400">*</span>
                </label>

                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={submitting}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Enter a whole number greater than zero.
                </p>
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <FileText size={16} className="text-violet-300" />
                    Remarks
                    <span className="font-normal text-slate-600">
                      (Optional)
                    </span>
                  </span>
                </label>

                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Reason for this stock movement..."
                  value={form.remarks}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className={`${inputClass} resize-y`}
                  disabled={submitting}
                />

                <p className="mt-1 text-right text-xs text-slate-600">
                  {form.remarks.length}/500
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingProducts ||
                  products.length === 0
                }
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${
                  form.type === "IN"
                    ? "border-emerald-400/20 bg-gradient-to-r from-emerald-700 to-emerald-600"
                    : "border-rose-400/20 bg-gradient-to-r from-rose-700 to-rose-600"
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Submit {form.type === "IN" ? "Stock In" : "Stock Out"}
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Information panel */}
        <div className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                <Boxes size={20} />
              </div>
              <h3 className="font-bold text-white">Inventory Overview</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <span className="text-sm text-slate-400">
                  Available Products
                </span>
                <span className="font-bold text-white">
                  {loadingProducts ? "—" : products.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <span className="text-sm text-slate-400">Movement Type</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    form.type === "IN"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-rose-400/10 text-rose-300"
                  }`}
                >
                  {form.type === "IN" ? "INCOMING" : "OUTGOING"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={loadProducts}
              disabled={loadingProducts || submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loadingProducts ? "animate-spin" : ""}
              />
              Refresh Products
            </button>
          </Card>

          <Card>
            <h3 className="font-bold text-white">Transaction Guide</h3>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <ArrowDownToLine size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Stock In
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use when receiving new inventory or adding units back into
                    stock.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-400/10 text-rose-300">
                  <ArrowUpFromLine size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-300">
                    Stock Out
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use when units leave inventory. Make sure the quantity is
                    available before submitting.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-slate-600">
        KEYVERSE ADMIN CONSOLE · STOCK TRANSACTIONS
      </footer>
    </div>
  );
}
