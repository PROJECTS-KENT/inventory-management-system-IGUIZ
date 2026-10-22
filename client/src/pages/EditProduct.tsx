
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../services/product";
import { getCategories } from "../services/category";
import { getSuppliers } from "../services/supplier";
import toast from "react-hot-toast";
import { ArrowLeft, LoaderCircle, Save, RotateCcw } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: string;
  quantity: string;
  categoryId: string;
  supplierId: string;
}

const initialForm: ProductForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: "",
  supplierId: "",
};

const inputClass =
  "w-full rounded-xl border border-white/[0.10] bg-[#0B0C15] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!id) {
        toast.error("Product ID is missing.");
        navigate("/products", { replace: true });
        return;
      }

      setLoading(true);

      try {
        const [product, cats, sups] = await Promise.all([
          getProduct(id),
          getCategories(),
          getSuppliers(),
        ]);

        if (!active) return;

        setCategories(cats);
        setSuppliers(sups);

        setForm({
          name: product.name ?? "",
          sku: product.sku ?? "",
          description: product.description ?? "",
          price: String(product.price ?? ""),
          quantity: String(product.quantity ?? ""),
          categoryId: product.categoryId ?? "",
          supplierId: product.supplierId ?? "",
        });
      } catch (error) {
        console.error("Failed to load product:", error);

        if (active) {
          toast.error("Failed to load product details.");
          navigate("/products", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!id) {
    toast.error("Unable to identify the product.");
    return;
  }

  if (saving) return;

  const name = form.name.trim();
  const sku = form.sku.trim();
  const price = Number(form.price);
  const quantity = Number(form.quantity);

  if (!name || !sku) {
    toast.error("Product name and SKU are required.");
    return;
  }

  if (
    form.price.trim() === "" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    toast.error("Enter a valid non-negative price.");
    return;
  }

  if (
    form.quantity.trim() === "" ||
    !Number.isFinite(quantity) ||
    quantity < 0 ||
    !Number.isInteger(quantity)
  ) {
    toast.error("Quantity must be a non-negative whole number.");
    return;
  }

  if (!form.categoryId || !form.supplierId) {
    toast.error("Please select a category and supplier.");
    return;
  }

  const productData = new FormData();
  productData.append("name", name);
  productData.append("sku", sku);
  productData.append("description", form.description.trim());
  productData.append("price", String(price));
  productData.append("quantity", String(quantity));
  productData.append("categoryId", form.categoryId);
  productData.append("supplierId", form.supplierId);

  setSaving(true);

  try {
    await updateProduct(id, productData);

    toast.success("Product updated successfully!");
    navigate("/products");
  } catch (error) {
    console.error("Failed to update product:", error);
    toast.error("Update failed. Please check your entries and try again.");
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#090A12] text-slate-300">
        <LoaderCircle className="h-9 w-9 animate-spin text-violet-400" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Edit Product"
        subtitle="Update product information, pricing, stock, and supplier details."
      />

      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <Card>
          <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <Save size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Product Information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Update the fields below and save your changes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Product Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter product name"
                  autoComplete="off"
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label htmlFor="sku" className={labelClass}>
                  SKU *
                </label>
                <input
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter SKU"
                  autoComplete="off"
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`${inputClass} min-h-28 resize-y`}
                placeholder="Describe this product..."
                rows={4}
                maxLength={2000}
              />
              <p className="mt-1 text-right text-xs text-slate-600">
                {form.description.length}/2000
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (PHP) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-violet-300">
                    ₱
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className={labelClass}>
                  Stock Quantity *
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="categoryId" className={labelClass}>
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="supplierId" className={labelClass}>
                  Supplier *
                </label>
                <select
                  id="supplierId"
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/products")}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

        <p className="mt-5 text-center text-xs text-slate-600">
          KEYVERSE ADMIN CONSOLE · Product Management
        </p>
      </div>
    </div>
  );
}
