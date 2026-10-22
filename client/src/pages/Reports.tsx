
import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Package,
  Printer,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Wallet,
  Boxes,
} from "lucide-react";
import { getProducts } from "../services/product";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api, { SERVER_URL } from "../services/api";

interface Product {
  id: number | string;
  name: string;
  image?: string | null;
  price: number;
  quantity: number;
  category?: { name: string } | null;
  supplier?: { name: string } | null;
}

interface TopProduct {
  product: string;
  orders: number;
  sold: number;
}

interface Analytics {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  totalRevenue: number;
  topProducts: TopProduct[];
}

const formatCurrency = (value: number) =>
  `₱${(Number(value) || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatNumber = (value: number) =>
  (Number(value) || 0).toLocaleString("en-PH");

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(false);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    void loadProducts();
    void loadAnalytics();
  }, []);

  async function loadProducts() {
    setLoadingProducts(true);
    setProductsError(false);

    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProductsError(true);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadAnalytics() {
    setLoadingAnalytics(true);
    setAnalyticsError(false);

    try {
      const response = await api.get("/reports/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setAnalyticsError(true);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const totalProducts = filteredProducts.length;

  const totalStock = filteredProducts.reduce(
    (sum, product) => sum + (Number(product.quantity) || 0),
    0
  );

  const totalValue = filteredProducts.reduce(
    (sum, product) =>
      sum +
      (Number(product.price) || 0) *
        (Number(product.quantity) || 0),
    0
  );

  function exportExcel() {
    const data = filteredProducts.map((product) => ({
      Product: product.name,
      Category: product.category?.name ?? "Uncategorized",
      Supplier: product.supplier?.name ?? "No supplier",
      Price: Number(product.price) || 0,
      Stock: Number(product.quantity) || 0,
      Total:
        (Number(product.price) || 0) *
        (Number(product.quantity) || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 20 },
      { wch: 22 },
      { wch: 16 },
      { wch: 12 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Inventory Report"
    );

    XLSX.writeFile(workbook, "Inventory_Report.xlsx");
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("KEYVERSE - Inventory Report", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      25
    );
    doc.text(
      `Products: ${totalProducts} | Total stock: ${totalStock} | Inventory value: ${formatCurrency(totalValue)}`,
      14,
      31
    );

    autoTable(doc, {
      startY: 38,
      head: [[
        "#",
        "Product",
        "Category",
        "Supplier",
        "Price",
        "Stock",
        "Total",
      ]],
      body: filteredProducts.map((product, index) => [
        index + 1,
        product.name,
        product.category?.name ?? "Uncategorized",
        product.supplier?.name ?? "No supplier",
        formatCurrency(product.price),
        product.quantity,
        formatCurrency(
          (Number(product.price) || 0) *
            (Number(product.quantity) || 0)
        ),
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [91, 55, 170],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 243, 255],
      },
    });

    doc.save("Inventory_Report.pdf");
  }

  function printReport() {
    window.print();
  }

  const revenueCards = [
    {
      label: "Revenue Today",
      value: analytics?.todayRevenue,
      icon: CalendarDays,
      accent: "text-emerald-300",
      glow: "bg-emerald-500/10",
      border: "border-emerald-400/20",
    },
    {
      label: "This Week",
      value: analytics?.weekRevenue,
      icon: TrendingUp,
      accent: "text-sky-300",
      glow: "bg-sky-500/10",
      border: "border-sky-400/20",
    },
    {
      label: "This Month",
      value: analytics?.monthRevenue,
      icon: Activity,
      accent: "text-violet-300",
      glow: "bg-violet-500/10",
      border: "border-violet-400/20",
    },
    {
      label: "This Year",
      value: analytics?.yearRevenue,
      icon: Wallet,
      accent: "text-amber-300",
      glow: "bg-amber-500/10",
      border: "border-amber-400/20",
    },
    {
      label: "Total Revenue",
      value: analytics?.totalRevenue,
      icon: ShoppingBag,
      accent: "text-fuchsia-300",
      glow: "bg-fuchsia-500/10",
      border: "border-fuchsia-400/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Monitor revenue performance, analyze ordered products, and review your inventory."
      />

      {/* Revenue Analytics */}
      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Revenue Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Revenue summaries from your analytics service
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAnalytics()}
            disabled={loadingAnalytics}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loadingAnalytics ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {analyticsError && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
            <AlertCircle size={18} className="shrink-0" />
            <div className="flex-1">
              Could not load revenue analytics. Check your connection and
              try again.
            </div>
            <button
              type="button"
              onClick={() => void loadAnalytics()}
              className="font-semibold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {revenueCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className={`relative overflow-hidden !p-5 ${item.border}`}
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${item.glow}`}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white">
                      {loadingAnalytics
                        ? "Loading..."
                        : analytics
                          ? formatCurrency(Number(item.value) || 0)
                          : "—"}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border border-white/[0.06] p-3 ${item.glow} ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Top Ordered Products */}
      <section className="mb-8">
        <Card className="!p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-violet-300" />
                <h2 className="text-lg font-bold text-white">
                  Top Ordered Products
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Best-performing products based on order activity
              </p>
            </div>

            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              {analytics?.topProducts?.length ?? 0} products
            </span>
          </div>

          {loadingAnalytics ? (
            <div className="flex items-center justify-center gap-3 p-10 text-slate-400">
              <RefreshCw size={18} className="animate-spin" />
              Loading product analytics...
            </div>
          ) : analyticsError ? (
            <div className="p-10 text-center text-sm text-slate-400">
              Top ordered products are unavailable right now.
            </div>
          ) : !analytics?.topProducts?.length ? (
            <div className="p-10 text-center">
              <ShoppingBag
                size={32}
                className="mx-auto mb-3 text-slate-600"
              />
              <p className="font-medium text-slate-300">
                No order analytics available yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Product order statistics will appear here when available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">
                      Product
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Orders
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Units Sold
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {analytics.topProducts.map((item, index) => (
                    <tr
                      key={`${item.product}-${index}`}
                      className="transition hover:bg-violet-500/[0.04]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/10 text-xs font-bold text-violet-300">
                            {index + 1}
                          </span>
                          <span className="font-medium text-slate-200">
                            {item.product}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-slate-300">
                        {formatNumber(item.orders)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300">
                          {formatNumber(item.sold)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Inventory Summary */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">
            Inventory Summary
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Summary based on the products matching your search
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="relative flex min-h-36 items-center justify-between overflow-hidden !p-5">
            <div>
              <p className="text-sm text-slate-400">Total Products</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {loadingProducts ? "—" : formatNumber(totalProducts)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Matching inventory items
              </p>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sky-300">
              <Package size={25} />
            </div>
          </Card>

          <Card className="relative flex min-h-36 items-center justify-between overflow-hidden !p-5">
            <div>
              <p className="text-sm text-slate-400">Total Stock</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {loadingProducts ? "—" : formatNumber(totalStock)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Units currently in stock
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-300">
              <Boxes size={25} />
            </div>
          </Card>

          <Card className="relative flex min-h-36 items-center justify-between overflow-hidden !p-5">
            <div className="min-w-0">
              <p className="text-sm text-slate-400">Inventory Value</p>
              <h3 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
                {loadingProducts ? "—" : formatCurrency(totalValue)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Price multiplied by stock quantity
              </p>
            </div>
            <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-fuchsia-300">
              <Wallet size={25} />
            </div>
          </Card>
        </div>
      </section>

      {/* Inventory Report */}
      <section>
        <Card className="!p-0">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Inventory Report
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, review, export, or print your current inventory.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search product name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C15] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportExcel}
                  disabled={loadingProducts || filteredProducts.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FileSpreadsheet size={17} />
                  Export Excel
                  <Download size={14} />
                </button>

                <button
                  type="button"
                  onClick={exportPDF}
                  disabled={loadingProducts || filteredProducts.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FileText size={17} />
                  Export PDF
                </button>

                <button
                  type="button"
                  onClick={printReport}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                >
                  <Printer size={17} />
                  Print Report
                </button>

                <button
                  type="button"
                  onClick={() => void loadProducts()}
                  disabled={loadingProducts}
                  aria-label="Refresh inventory"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={loadingProducts ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {loadingProducts
                  ? "Loading inventory..."
                  : `Showing ${filteredProducts.length} of ${products.length} products`}
              </span>
              <span>Currency: PHP (₱)</span>
            </div>
          </div>

          {productsError && (
            <div className="m-5 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">
                Could not load inventory products.
              </span>
              <button
                type="button"
                onClick={() => void loadProducts()}
                className="font-semibold underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-[#0C0D17] text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="w-14 px-4 py-4 text-center font-semibold">#</th>
                  <th className="px-4 py-4 text-center font-semibold">Image</th>
                  <th className="px-4 py-4 text-left font-semibold">Product</th>
                  <th className="px-4 py-4 text-center font-semibold">Category</th>
                  <th className="px-4 py-4 text-center font-semibold">Supplier</th>
                  <th className="px-4 py-4 text-right font-semibold">Price</th>
                  <th className="px-4 py-4 text-center font-semibold">Stock</th>
                  <th className="px-4 py-4 text-right font-semibold">Total Value</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {loadingProducts ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <RefreshCw
                        size={24}
                        className="mx-auto mb-3 animate-spin text-violet-300"
                      />
                      <p className="text-slate-400">Loading inventory...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                        <Search size={22} className="text-slate-500" />
                      </div>
                      <p className="font-medium text-slate-300">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or refresh your inventory.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => {
                    const quantity = Number(product.quantity) || 0;
                    const price = Number(product.price) || 0;
                    const inventoryValue = price * quantity;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-violet-500/[0.035]"
                      >
                        <td className="px-4 py-4 text-center text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                            {product.image ? (
                              <img
                                src={`${SERVER_URL}/uploads/products/${product.image}`}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon
                                size={19}
                                className="text-slate-600"
                              />
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-200">
                            {product.name}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center text-slate-400">
                          {product.category?.name ?? "Uncategorized"}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-400">
                          {product.supplier?.name ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-right tabular-nums text-slate-300">
                          {formatCurrency(price)}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex min-w-12 justify-center rounded-full border px-3 py-1 text-xs font-bold ${
                              quantity <= 5
                                ? "border-rose-400/20 bg-rose-500/10 text-rose-300"
                                : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                            }`}
                          >
                            {formatNumber(quantity)}
                          </span>
                          {quantity <= 5 && (
                            <p className="mt-1 text-[10px] text-rose-300/80">
                              Low stock
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold tabular-nums text-violet-300">
                          {formatCurrency(inventoryValue)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/[0.08] bg-white/[0.015] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500">
              Inventory totals reflect the currently filtered products.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 size={15} className="text-emerald-300" />
              <span>
                {loadingProducts
                  ? "Calculating..."
                  : `${formatNumber(totalStock)} units · ${formatCurrency(totalValue)}`}
              </span>
            </div>
          </div>
        </Card>
      </section>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          body * {
            visibility: hidden;
          }

          #root, #root * {
            visibility: visible;
          }

          #root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          aside,
          button,
          input,
          .no-print {
            display: none !important;
          }

          table {
            color: black !important;
          }

          th, td {
            border-color: #ddd !important;
          }

          .bg-\\[\\#090A12\\] {
            background: white !important;
          }

          .text-white,
          .text-slate-100,
          .text-slate-200,
          .text-slate-300,
          .text-slate-400 {
            color: black !important;
          }

          .rounded-2xl {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
