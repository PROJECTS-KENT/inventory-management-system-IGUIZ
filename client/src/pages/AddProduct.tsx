
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../services/product";
import { getCategories } from "../services/category";
import { getSuppliers } from "../services/supplier";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import toast from "react-hot-toast";
import {
  PackagePlus,
  ImagePlus,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Boxes,
  Truck,
  Tag,
  PhilippinePeso,
  Package,
  FileText,
  X,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    supplierId: "",
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoadingOptions(true);

        const [cats, sups] = await Promise.all([
          getCategories(),
          getSuppliers(),
        ]);

        if (active) {
          setCategories(cats);
          setSuppliers(sups);
        }
      } catch (error) {
        console.error("Failed to load categories and suppliers:", error);
        if (active) {
          toast.error("Failed to load categories and suppliers.");
        }
      } finally {
        if (active) {
          setLoadingOptions(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    const nextPreview = URL.createObjectURL(file);

    setPreview(nextPreview);
    setImage(file);
  }

  function removeImage() {
    setImage(null);
    setPreview("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Price must be zero or greater.");
      return;
    }

    if (
      form.quantity.trim() === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      toast.error("Quantity must be a non-negative whole number.");
      return;
    }

    if (!form.categoryId || !form.supplierId) {
      toast.error("Please select a category and supplier.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("sku", form.sku.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("categoryId", form.categoryId);
      formData.append("supplierId", form.supplierId);

      if (image) {
        formData.append("image", image);
      }

      await createProduct(formData);

      toast.success("Product created successfully!");
      navigate("/products", { replace: true });
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0B0C15] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300";

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Add New Product"
        subtitle="Expand your KEYVERSE collection with a new inventory item."
      />

      {/* Breadcrumb / intro */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            KEYVERSE / INVENTORY / NEW PRODUCT
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Product Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Complete the information below to add a product.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white sm:self-auto"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
          {/* Main form */}
          <div className="space-y-5 xl:col-span-2">
            <Card>
              <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                  <PackagePlus size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Product name, SKU, and description
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    <Package size={15} className="text-violet-300" />
                    Product Name <span className="text-rose-400">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Mechanical Keyboard"
                    className={inputClass}
                    maxLength={150}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sku" className={labelClass}>
                    <Tag size={15} className="text-violet-300" />
                    SKU <span className="text-rose-400">*</span>
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="e.g. KEY-001"
                    className={inputClass}
                    maxLength={100}
                    required
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Enter the unique stock-keeping unit for this product.
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    <FileText size={15} className="text-violet-300" />
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product, features, or specifications..."
                    className={`${inputClass} resize-y`}
                    maxLength={2000}
                  />

                  <p className="mt-1 text-right text-xs text-slate-600">
                    {form.description.length}/2000
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                  <PhilippinePeso size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Pricing & Stock
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Set the selling price and available quantity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price (₱) <span className="text-rose-400">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      ₱
                    </span>
                    <input
                      id="price"
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className={labelClass}>
                    Quantity <span className="text-rose-400">*</span>
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3">
                <p className="text-xs leading-5 text-slate-400">
                  <span className="font-semibold text-amber-300">
                    Stock tip:
                  </span>{" "}
                  Products with 5 units or fewer will be flagged as low stock
                  on your dashboard.
                </p>
              </div>
            </Card>

            <Card>
              <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Boxes size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Category & Supplier
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Organize the product within your inventory
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="categoryId" className={labelClass}>
                    <Boxes size={15} className="text-cyan-300" />
                    Category <span className="text-rose-400">*</span>
                  </label>

                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    disabled={loadingOptions}
                  >
                    <option value="" className="bg-[#151522]">
                      {loadingOptions
                        ? "Loading categories..."
                        : "Select Category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className="bg-[#151522]"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!loadingOptions && categories.length === 0 && (
                    <p className="mt-2 text-xs text-amber-300">
                      No categories available. Add a category first.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="supplierId" className={labelClass}>
                    <Truck size={15} className="text-cyan-300" />
                    Supplier <span className="text-rose-400">*</span>
                  </label>

                  <select
                    id="supplierId"
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    disabled={loadingOptions}
                  >
                    <option value="" className="bg-[#151522]">
                      {loadingOptions
                        ? "Loading suppliers..."
                        : "Select Supplier"}
                    </option>

                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                        className="bg-[#151522]"
                      >
                        {supplier.name}
                      </option>
                    ))}
                  </select>

                  {!loadingOptions && suppliers.length === 0 && (
                    <p className="mt-2 text-xs text-amber-300">
                      No suppliers available. Add a supplier first.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Image upload and actions */}
          <div className="space-y-5">
            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300">
                  <ImagePlus size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Product Image
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Upload a product photo
                  </p>
                </div>
              </div>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0B0C15]">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="aspect-square w-full object-contain p-3"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/20 bg-[#090A12]/90 text-rose-300 transition hover:bg-rose-500/20"
                    aria-label="Remove selected image"
                    title="Remove image"
                  >
                    <X size={18} />
                  </button>

                  <div className="border-t border-white/[0.08] px-3 py-3">
                    <p className="truncate text-xs font-medium text-slate-300">
                      {image?.name}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {image
                        ? `${(image.size / 1024 / 1024).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-400/25 bg-violet-400/[0.03] px-4 py-10 text-center transition hover:border-violet-400/50 hover:bg-violet-400/[0.06]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                    <Upload size={24} />
                  </div>

                  <span className="mt-4 text-sm font-semibold text-slate-200">
                    Click to upload image
                  </span>

                  <span className="mt-2 text-xs text-slate-500">
                    PNG, JPG, WEBP or GIF
                  </span>

                  <span className="mt-1 text-xs text-slate-600">
                    Maximum size: 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {preview && (
                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04]">
                  <Upload size={16} />
                  Choose another image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Choose a clear image so your product is easy to identify in
                the inventory.
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-white">Ready to create?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Check your product details before saving it to the inventory.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingOptions ||
                    categories.length === 0 ||
                    suppliers.length === 0
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={18} />
                  {loading ? "Creating Product..." : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <ArrowLeft size={17} />
                  Cancel
                </button>
              </div>

              <p className="mt-4 text-center text-[10px] leading-5 text-slate-600">
                Required fields are marked with{" "}
                <span className="text-rose-400">*</span>
              </p>
            </Card>
          </div>
        </div>
      </form>

      <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-slate-600">
        KEYVERSE ADMIN CONSOLE · PRODUCT CREATION
      </footer>
    </div>
  );
}
