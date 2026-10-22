
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

interface DashboardProduct {
  id?: string | number;
  name: string;
  quantity?: number;
  sold?: number;
  price?: number;
}

interface DashboardOrder {
  id: string | number;
  orderNumber?: string;
  reference?: string;
  customerName?: string;
  customer?: {
    name?: string;
  };
  user?: {
    name?: string;
  };
  status?: string;
  createdAt?: string;
  total?: number;
  totalAmount?: number;
}

interface DashboardActivity {
  id: string | number;
  action: string;
  details?: string;
  createdAt: string;
  user?: {
    name?: string;
  };
}

interface DashboardTransaction {
  id: string | number;
  type: string;
  quantity: number;
  remarks?: string | null;
  product?: {
    name?: string;
  } | null;
}

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalUsers: number;
  totalInventory: number;
  inventoryValue: number;
  lowStockCount: number;
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalSales?: number;
  todaySales?: number;
  recentOrders: DashboardOrder[];
  lowStockProducts: DashboardProduct[];
  recentTransactions: DashboardTransaction[];
  recentActivities: DashboardActivity[];
  categoryChart: {
    name: string;
    value: number;
  }[];
  movementChart: {
    name: string;
    quantity: number;
  }[];
  bestSelling: {
    name: string;
    sold: number;
  }[];
  mostStockedProduct: DashboardProduct | null;
  lowestStockProduct: DashboardProduct | null;
  latestProduct: DashboardProduct | null;
  totalActivities: number;
}

function money(value: number | undefined | null): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function dateLabel(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateTimeLabel(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type Accent = "violet" | "blue" | "cyan" | "emerald" | "amber" | "rose";

const accentStyles: Record<Accent, { icon: string; glow: string }> = {
  violet: {
    icon: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    glow: "from-violet-500/15",
  },
  blue: {
    icon: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    glow: "from-blue-500/15",
  },
  cyan: {
    icon: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    glow: "from-cyan-500/15",
  },
  emerald: {
    icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    glow: "from-emerald-500/15",
  },
  amber: {
    icon: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    glow: "from-amber-500/15",
  },
  rose: {
    icon: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    glow: "from-rose-500/15",
  },
};

function StatCard({
  label,
  value,
  icon,
  accent,
  detail,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent: Accent;
  detail?: string;
}) {
  const styles = accentStyles[accent];

  return (
    <Card className="group relative overflow-hidden">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-70 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>

          {detail && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {detail}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>

      <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`h-full w-1/3 rounded-full bg-gradient-to-r ${
            accent === "violet"
              ? "from-violet-500 to-purple-300"
              : accent === "blue"
                ? "from-blue-500 to-cyan-300"
                : accent === "cyan"
                  ? "from-cyan-500 to-blue-300"
                  : accent === "emerald"
                    ? "from-emerald-500 to-teal-300"
                    : accent === "amber"
                      ? "from-amber-500 to-yellow-300"
                      : "from-rose-500 to-pink-300"
          }`}
        />
      </div>
    </Card>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
          {eyebrow}
        </p>
      )}

      <h2 className="text-base font-bold text-white sm:text-lg">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-5 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "UNKNOWN").toUpperCase();

  const styles: Record<string, string> = {
    PENDING: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    APPROVED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    COMPLETED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    REJECTED: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    CANCELLED: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    PROCESSING: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    UNKNOWN: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${
        styles[normalized] || styles.UNKNOWN
      }`}
    >
      {normalized}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.09] bg-white/[0.015] px-5 py-10 text-center">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/[0.07] text-xl text-violet-300">
        ◇
      </span>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

function MetricHighlight({
  label,
  name,
  value,
  icon,
  accent,
}: {
  label: string;
  name?: string;
  value?: number;
  icon: string;
  accent: Accent;
}) {
  const styles = accentStyles[accent];

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-200">
          {name || "No data available"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {value !== undefined && value !== null
            ? `${value.toLocaleString()} units`
            : "Waiting for product data"}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName = localStorage.getItem("name") || "Administrator";
  const role = localStorage.getItem("role") || "ADMIN";

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDashboard();
      setDashboard(response as DashboardData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboard();

        if (active) {
          setDashboard(response as DashboardData);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);

        if (active) {
          setError("Unable to load dashboard data. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#090A12] px-4 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-violet-400/15 border-t-violet-400" />
            <span className="text-xl text-violet-300">◇</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Loading dashboard
          </p>

          <p className="text-xs text-slate-600">
            Synchronizing inventory data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Your inventory and store operations at a glance."
        />

        <Card className="mx-auto max-w-2xl border-rose-400/20">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-2xl text-rose-300">
              !
            </div>

            <h2 className="text-lg font-bold text-white">
              Dashboard unavailable
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              {error || "No dashboard data is available right now."}
            </p>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-6 rounded-xl border border-violet-400/30 bg-violet-500/15 px-5 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
            >
              Retry loading
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const categoryData = dashboard.categoryChart || [];
  const movementData = dashboard.movementChart || [];
  const bestSelling = dashboard.bestSelling || [];
  const recentOrders = dashboard.recentOrders || [];
  const lowStockProducts = dashboard.lowStockProducts || [];
  const recentActivities = dashboard.recentActivities || [];
  const recentTransactions = dashboard.recentTransactions || [];

  const highestSelling = Math.max(
    ...bestSelling.map((product) => Number(product.sold) || 0),
    1
  );

  const tooltipStyle = {
    backgroundColor: "#151523",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: "12px",
    color: "#E2E8F0",
    fontSize: "12px",
  };

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Your inventory, sales, and store operations at a glance."
      />

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Welcome back,</p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            {userName}
            <span className="ml-2 text-violet-400">✦</span>
          </h2>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200">
              {role} ACCESS
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/products";
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
        >
          <span className="text-lg">＋</span>
          View Products
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-violet-400" />
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">
          System Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={dashboard.totalProducts.toLocaleString()}
          icon="▣"
          accent="violet"
          detail="Products registered in the catalog"
        />

        <StatCard
          label="Categories"
          value={dashboard.totalCategories.toLocaleString()}
          icon="◫"
          accent="blue"
          detail="Product categories"
        />

        <StatCard
          label="Suppliers"
          value={dashboard.totalSuppliers.toLocaleString()}
          icon="⇄"
          accent="cyan"
          detail="Registered suppliers"
        />

        <StatCard
          label="Users"
          value={dashboard.totalUsers.toLocaleString()}
          icon="♙"
          accent="emerald"
          detail="System user accounts"
        />

        <StatCard
          label="Inventory Units"
          value={dashboard.totalInventory.toLocaleString()}
          icon="▤"
          accent="blue"
          detail="Total units currently in stock"
        />

        <StatCard
          label="Inventory Value"
          value={money(dashboard.inventoryValue)}
          icon="₱"
          accent="emerald"
          detail="Estimated value of current stock"
        />

        <StatCard
          label="Low Stock Items"
          value={dashboard.lowStockCount.toLocaleString()}
          icon="!"
          accent="amber"
          detail="Items requiring stock attention"
        />

        <StatCard
          label="Activity Logs"
          value={dashboard.totalActivities.toLocaleString()}
          icon="◷"
          accent="rose"
          detail="Recorded system activities"
        />
      </div>

      <div className="mb-5 mt-10 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-blue-400" />
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">
          Order Management
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={dashboard.totalOrders.toLocaleString()}
          icon="▣"
          accent="violet"
          detail="All customer orders"
        />

        <StatCard
          label="Pending"
          value={dashboard.pendingOrders.toLocaleString()}
          icon="◷"
          accent="amber"
          detail="Awaiting review"
        />

        <StatCard
          label="Approved"
          value={dashboard.approvedOrders.toLocaleString()}
          icon="✓"
          accent="emerald"
          detail="Approved orders"
        />

        <StatCard
          label="Rejected"
          value={dashboard.rejectedOrders.toLocaleString()}
          icon="×"
          accent="rose"
          detail="Rejected orders"
        />
      </div>

      {(dashboard.totalSales !== undefined ||
        dashboard.todaySales !== undefined) && (
        <>
          <div className="mb-5 mt-10 flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">
              Sales Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dashboard.totalSales !== undefined && (
              <StatCard
                label="Total Sales"
                value={money(dashboard.totalSales)}
                icon="₱"
                accent="emerald"
                detail="Total recorded sales"
              />
            )}

            {dashboard.todaySales !== undefined && (
              <StatCard
                label="Today's Sales"
                value={money(dashboard.todaySales)}
                icon="↗"
                accent="cyan"
                detail="Sales recorded today"
              />
            )}
          </div>
        </>
      )}

      <div className="mb-5 mt-10">
        <SectionTitle
          eyebrow="Visual analytics"
          title="Inventory Analytics"
          description="Explore category distribution and stock movement at a glance."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="min-w-0">
          <SectionTitle
            title="Products by Category"
            description="Distribution across your product categories."
          />

          {categoryData.length === 0 ? (
            <EmptyState message="No category analytics available yet." />
          ) : (
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius="72%"
                    innerRadius="42%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Products",
                    ]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      color: "#94A3B8",
                      fontSize: "11px",
                      paddingTop: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="min-w-0">
          <SectionTitle
            title="Stock Movement"
            description="Quantity movement recorded over time."
          />

          {movementData.length === 0 ? (
            <EmptyState message="No stock movement analytics available yet." />
          ) : (
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={movementData}
                  margin={{ top: 10, right: 8, left: -18, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke="rgba(148,163,184,0.1)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(139,92,246,0.08)" }}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      color: "#94A3B8",
                      fontSize: "11px",
                      paddingTop: "10px",
                    }}
                  />

                  <Bar
                    dataKey="quantity"
                    name="Quantity"
                    fill="#8B5CF6"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="mb-5 mt-10">
        <SectionTitle
          eyebrow="Inventory health"
          title="Stock Monitoring"
          description="Review low-stock alerts and important product inventory details."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <SectionTitle
              title="Low Stock Alerts"
              description="Products that may need replenishment."
            />

            <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              {lowStockProducts.length} items
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <EmptyState message="No low-stock products to display." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[380px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Quantity
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr
                      key={product.id ?? `${product.name}-${index}`}
                      className="border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.025]"
                    >
                      <td className="max-w-[180px] truncate px-3 py-4 font-medium text-slate-200">
                        {product.name}
                      </td>

                      <td className="px-3 py-4 text-right font-bold tabular-nums text-amber-300">
                        {Number(product.quantity ?? 0).toLocaleString()}
                      </td>

                      <td className="px-3 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-2 py-1 text-[10px] font-semibold text-amber-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Low stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="min-w-0">
          <SectionTitle
            title="Product Stock Highlights"
            description="Highest, lowest, and most recently added products."
          />

          <div className="space-y-3">
            <MetricHighlight
              label="Highest Stock"
              name={dashboard.mostStockedProduct?.name}
              value={dashboard.mostStockedProduct?.quantity}
              icon="↑"
              accent="emerald"
            />

            <MetricHighlight
              label="Lowest Stock"
              name={dashboard.lowestStockProduct?.name}
              value={dashboard.lowestStockProduct?.quantity}
              icon="↓"
              accent="amber"
            />

            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                ✦
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                  Latest Product
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                  {dashboard.latestProduct?.name || "No product available"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Most recently added to the catalog
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-5 mt-10">
        <SectionTitle
          eyebrow="Store performance"
          title="Orders & Best Sellers"
          description="Keep an eye on recent customer orders and popular products."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="min-w-0 overflow-hidden">
          <SectionTitle
            title="Recent Orders"
            description="The latest customer orders received."
          />

          {recentOrders.length === 0 ? (
            <EmptyState message="No recent orders available." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3 font-semibold">Order</th>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.025]"
                    >
                      <td className="whitespace-nowrap px-3 py-4 font-semibold text-violet-300">
                        {order.orderNumber ||
                          order.reference ||
                          `#${order.id}`}
                      </td>

                      <td className="max-w-[130px] truncate px-3 py-4 text-slate-300">
                        {order.customer?.name ||
                          order.customerName ||
                          order.user?.name ||
                          "Customer"}
                      </td>

                      <td className="px-3 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-400">
                        {dateLabel(order.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-right font-semibold tabular-nums text-slate-200">
                        {money(order.total ?? order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="min-w-0">
          <SectionTitle
            title="Best-Selling Products"
            description="Products ranked by quantity sold."
          />

          {bestSelling.length === 0 ? (
            <EmptyState message="No best-selling product data available yet." />
          ) : (
            <div className="space-y-5">
              {bestSelling.map((item, index) => {
                const sold = Number(item.sold) || 0;
                const percentage = Math.min(
                  100,
                  Math.max(0, (sold / highestSelling) * 100)
                );

                return (
                  <div key={`${item.name}-${index}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                            index === 0
                              ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                              : "border-white/[0.07] bg-white/[0.03] text-slate-400"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="truncate text-sm font-medium text-slate-200">
                          {item.name}
                        </span>
                      </div>

                      <span className="shrink-0 text-sm font-bold tabular-nums text-violet-300">
                        {sold.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-slate-500">
                          sold
                        </span>
                      </span>
                    </div>

                    <div className="ml-11 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="mb-5 mt-10">
        <SectionTitle
          eyebrow="Audit trail"
          title="Activity & Transactions"
          description="Keep track of recent user actions and inventory changes."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="min-w-0">
          <SectionTitle
            title="Recent Activity"
            description="Latest recorded administrative actions."
          />

          {recentActivities.length === 0 ? (
            <EmptyState message="No recent activity recorded." />
          ) : (
            <div className="space-y-5">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300">
                    ◷
                  </div>

                  <div className="min-w-0 flex-1 border-b border-white/[0.06] pb-4 last:border-0">
                    <p className="break-words font-semibold text-slate-200">
                      {activity.action}
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                      {activity.details || "No additional details"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {activity.user?.name || "Unknown user"} ·{" "}
                      {dateTimeLabel(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <SectionTitle
            title="Recent Inventory Transactions"
            description="Latest stock-in and stock-out records."
          />

          {recentTransactions.length === 0 ? (
            <EmptyState message="No inventory transactions recorded." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Quantity
                    </th>
                    <th className="px-3 py-3 font-semibold">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.025]"
                    >
                      <td className="max-w-[170px] truncate px-3 py-4 font-medium text-slate-200">
                        {transaction.product?.name || "Deleted product"}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            transaction.type === "IN"
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-rose-400/20 bg-rose-400/10 text-rose-300"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-right font-bold tabular-nums text-slate-200">
                        {Number(transaction.quantity).toLocaleString()}
                      </td>

                      <td className="max-w-[140px] truncate px-3 py-4 text-xs text-slate-400">
                        {transaction.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <footer className="mt-10 border-t border-white/[0.07] py-5 text-center text-xs text-slate-600">
        KEYVERSE ADMIN CONSOLE · Inventory & Store Overview
      </footer>
    </div>
  );
}
