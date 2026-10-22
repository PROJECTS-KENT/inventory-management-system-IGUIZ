
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrders,
  approveOrder,
  rejectOrder,
} from "../services/adminOrder";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Mail,
  Phone,
  UserRound,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  reference: string;
  createdAt: string;
  status: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  items: OrderItem[];
  total: number;
}

function formatCurrency(value: number) {
  return `PHP ${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}

function getStatusStyles(status: string) {
  switch (status) {
    case "APPROVED":
      return {
        badge:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
        dot: "bg-emerald-400",
        icon: CheckCircle2,
      };

    case "REJECTED":
      return {
        badge: "border-rose-400/20 bg-rose-500/10 text-rose-300",
        dot: "bg-rose-400",
        icon: XCircle,
      };

    default:
      return {
        badge: "border-amber-400/20 bg-amber-500/10 text-amber-300",
        dot: "bg-amber-400",
        icon: Clock,
      };
  }
}

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    const result = await Swal.fire({
      title: "Approve Order?",
      text: "Stock will automatically be deducted.",
      icon: "question",
      background: "#151522",
      color: "#F1F5F9",
      iconColor: "#A78BFA",
      showCancelButton: true,
      confirmButtonText: "Approve Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#475569",
      customClass: {
        popup: "rounded-2xl border border-violet-400/20",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(id);

      await approveOrder(id);

      toast.success("Order approved successfully!");
      await loadOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Unable to approve order."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    const result = await Swal.fire({
      title: "Reject Order?",
      text: "Are you sure you want to reject this customer order?",
      icon: "warning",
      background: "#151522",
      color: "#F1F5F9",
      iconColor: "#FB7185",
      showCancelButton: true,
      confirmButtonText: "Reject Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#E11D48",
      cancelButtonColor: "#475569",
      customClass: {
        popup: "rounded-2xl border border-violet-400/20",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(id);

      await rejectOrder(id);

      toast.success("Order rejected.");
      await loadOrders();
    } catch (error) {
      console.error(error);
      toast.error("Unable to reject order.");
    } finally {
      setProcessingId(null);
    }
  }

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const approvedCount = orders.filter(
    (order) => order.status === "APPROVED"
  ).length;

  const rejectedCount = orders.filter(
    (order) => order.status === "REJECTED"
  ).length;

  const query = search.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    const matchesSearch =
      !query ||
      String(order.reference ?? "").toLowerCase().includes(query) ||
      String(order.customerName ?? "").toLowerCase().includes(query) ||
      String(order.email ?? "").toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Customer Orders"
        subtitle="Review customer purchases, manage order approvals, and track order status."
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Total Orders</p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {orders.length}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                All customer orders
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <ShoppingCart size={23} className="text-violet-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <h2 className="mt-2 text-3xl font-bold text-amber-300">
                {pendingCount}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Awaiting your decision
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10">
              <Clock size={23} className="text-amber-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Approved</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-300">
                {approvedCount}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Approved orders
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
              <CheckCircle2 size={23} className="text-emerald-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Rejected</p>
              <h2 className="mt-2 text-3xl font-bold text-rose-300">
                {rejectedCount}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Rejected orders
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10">
              <XCircle size={23} className="text-rose-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Order Management
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              View order details, check products, and process pending orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Orders
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label
              htmlFor="order-search"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Search orders
            </label>

            <div className="relative">
              <ShoppingCart
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="order-search"
                type="text"
                placeholder="Reference, customer, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
          </div>

          <div className="w-full lg:w-56">
            <label
              htmlFor="order-status"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Filter by status
            </label>

            <select
              id="order-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C14] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="border-b border-white/[0.08] px-5 py-3 sm:px-6">
          <p className="text-xs text-slate-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {loading ? (
            <div className="py-16 text-center">
              <LoaderCircle
                size={30}
                className="mx-auto animate-spin text-violet-400"
              />
              <p className="mt-3 text-sm text-slate-400">
                Loading customer orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#10111A] px-4 py-16 text-center">
              {orders.length === 0 ? (
                <Package
                  size={32}
                  className="mx-auto text-slate-600"
                />
              ) : (
                <AlertCircle
                  size={32}
                  className="mx-auto text-slate-600"
                />
              )}

              <h3 className="mt-4 font-semibold text-slate-200">
                {orders.length === 0
                  ? "No customer orders yet"
                  : "No matching orders"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {orders.length === 0
                  ? "New customer orders will appear here."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusStyle = getStatusStyles(order.status);
              const StatusIcon = statusStyle.icon;
              const isProcessing = processingId === order.id;
              const items: OrderItem[] = Array.isArray(order.items)
                ? order.items
                : [];

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10111A] transition-colors hover:border-violet-400/20"
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-white/[0.08] bg-gradient-to-r from-violet-500/[0.06] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                          <ShoppingCart
                            size={20}
                            className="text-violet-300"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Order Reference
                          </p>
                          <h3 className="mt-1 break-all text-lg font-bold text-white sm:text-xl">
                            {order.reference}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${statusStyle.badge}`}
                    >
                      <StatusIcon size={15} />
                      {order.status}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Customer and Delivery */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                          <UserRound
                            size={17}
                            className="text-violet-300"
                          />
                          Customer Information
                        </h4>

                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="mt-1 break-words text-slate-200">
                              {order.customerName || "Not provided"}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Mail
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-500"
                            />
                            <span className="break-all text-slate-300">
                              {order.email || "Not provided"}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <Phone
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-500"
                            />
                            <span className="break-words text-slate-300">
                              {order.phone || "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                          <MapPin
                            size={17}
                            className="text-violet-300"
                          />
                          Delivery Address
                        </h4>

                        <div className="space-y-2 text-sm text-slate-300">
                          <p className="break-words">
                            {order.address || "Address not provided"}
                          </p>
                          <p className="break-words">
                            {[order.city, order.province]
                              .filter(Boolean)
                              .join(", ") || "Location not provided"}
                          </p>
                          {order.zip && (
                            <p className="text-slate-400">
                              Postal code: {order.zip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mt-6">
                      <div className="mb-4 flex items-center gap-2">
                        <Package
                          size={18}
                          className="text-violet-300"
                        />
                        <h4 className="font-semibold text-white">
                          Ordered Products
                        </h4>
                        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-slate-400">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                        <table className="min-w-full divide-y divide-white/[0.08]">
                          <thead className="bg-[#171624]">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Product
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Price
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Total
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-white/[0.06] bg-[#0D0E16]">
                            {items.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                  No product details available.
                                </td>
                              </tr>
                            ) : (
                              items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="transition-colors hover:bg-violet-500/[0.04]"
                                >
                                  <td className="max-w-[240px] px-4 py-3 text-sm font-medium text-slate-200">
                                    {item.product?.name || "Unknown product"}
                                  </td>

                                  <td className="px-4 py-3 text-center text-sm text-slate-300">
                                    {item.quantity}
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-400">
                                    {formatCurrency(item.price)}
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-200">
                                    {formatCurrency(
                                      Number(item.price) *
                                        Number(item.quantity)
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Total and Actions */}
                    <div className="mt-6 flex flex-col gap-5 border-t border-white/[0.08] pt-5 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          Order Total
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {formatCurrency(order.total)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/orders/${order.id}/invoice`)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-500/20"
                        >
                          <FileText size={16} />
                          Invoice
                          <ArrowRight size={14} />
                        </button>

                        {order.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => void handleApprove(order.id)}
                              disabled={processingId !== null}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleReject(order.id)}
                              disabled={processingId !== null}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <XCircle size={16} />
                              )}
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {order.status !== "PENDING" && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck size={14} />
                        This order has already been processed. Approval and
                        rejection actions are no longer available.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
