
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";
import { getOrder } from "../services/adminOrder";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

interface OrderItem {
  id: string | number;
  product?: {
    name?: string;
  } | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string | number;
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
  notes?: string | null;
  items: OrderItem[];
  total: number;
}

const formatCurrency = (value: number) =>
  `₱${(Number(value) || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}

function getStatusStyle(status: string) {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return {
        className:
          "border-emerald-400/25 bg-emerald-500/10 text-emerald-300 print:border-green-600 print:bg-white print:text-green-700",
        icon: CheckCircle2,
      };
    case "REJECTED":
      return {
        className:
          "border-rose-400/25 bg-rose-500/10 text-rose-300 print:border-red-600 print:bg-white print:text-red-700",
        icon: XCircle,
      };
    default:
      return {
        className:
          "border-amber-400/25 bg-amber-500/10 text-amber-300 print:border-amber-600 print:bg-white print:text-amber-700",
        icon: ShieldCheck,
      };
  }
}

export default function OrderInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const data = await getOrder(id);

        if (active) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to load invoice:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  function printInvoice() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#090A12] text-slate-300">
        <LoaderCircle
          size={38}
          className="animate-spin text-violet-400"
        />
        <p className="text-sm">Loading invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#090A12] p-5 text-slate-100 sm:p-8">
        <Card className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-300">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-xl font-bold text-white">
            Invoice Unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            We couldn't load this invoice. It may not exist, or there may
            be a problem connecting to the server.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const status = getStatusStyle(order.status);
  const StatusIcon = status.icon;
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.total) || 0;

  return (
    <div className="min-h-screen bg-[#090A12] px-4 py-5 text-slate-100 sm:px-6 sm:py-8 print:bg-white print:p-0 print:text-black">
      {/* Page heading and actions */}
      <div className="print:hidden">
        <PageHeader
          title="Customer Invoice"
          subtitle="Review order details and print a customer sales invoice."
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <button
            type="button"
            onClick={printInvoice}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-blue-500"
          >
            <Printer size={17} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <Card className="invoice-document mx-auto max-w-5xl !overflow-visible !p-0 print:!border-0 print:!bg-white print:!p-0 print:!shadow-none print:!backdrop-blur-none">
        {/* Invoice header */}
        <div className="invoice-header relative overflow-hidden rounded-t-2xl border-b border-violet-400/15 bg-gradient-to-r from-[#171326] via-[#111827] to-[#0B1120] p-6 sm:p-9 print:rounded-none print:border-b-2 print:border-gray-300 print:bg-white print:p-0 print:pb-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl print:hidden" />

          <div className="relative flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 print:border-gray-300 print:bg-white print:text-gray-800">
                  <ShoppingBag size={25} />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl print:text-black">
                    KEYVERSE
                  </h1>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300 print:text-gray-600">
                    Keyboard Store
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-400 print:text-gray-600">
                Inventory Management System
              </p>
              <p className="mt-1 text-sm text-slate-400 print:text-gray-600">
                Customer Sales Invoice
              </p>
            </div>

            <div className="sm:min-w-56 sm:text-right">
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-300 print:border-gray-300 print:bg-white print:text-gray-700">
                <FileText size={14} />
                Invoice
              </div>

              <p className="text-xs uppercase tracking-wider text-slate-500 print:text-gray-500">
                Reference Number
              </p>
              <p className="mt-1 break-all text-lg font-bold text-white print:text-black">
                {order.reference || `ORDER-${order.id}`}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 sm:justify-end print:text-gray-600">
                <CalendarDays size={15} />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-9 print:space-y-6 print:p-0 print:pt-6">
          {/* Customer information */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 print:grid-cols-2 print:gap-8">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 print:rounded-none print:border-gray-300 print:bg-white print:p-4">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-300 print:text-gray-800">
                <UserRound size={17} />
                Bill To
              </h2>

              <p className="text-lg font-bold text-white print:text-black">
                {order.customerName || "Customer"}
              </p>

              <div className="mt-4 space-y-3 text-sm text-slate-400 print:text-gray-700">
                <p className="flex items-start gap-2 break-all">
                  <Mail size={16} className="mt-0.5 shrink-0 text-slate-500 print:text-gray-600" />
                  <span>{order.email || "No email provided"}</span>
                </p>

                <p className="flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 shrink-0 text-slate-500 print:text-gray-600" />
                  <span>{order.phone || "No phone provided"}</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 print:rounded-none print:border-gray-300 print:bg-white print:p-4">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-300 print:text-gray-800">
                <MapPin size={17} />
                Billing Address
              </h2>

              <div className="space-y-2 text-sm leading-6 text-slate-400 print:text-gray-700">
                <p className="font-semibold text-slate-200 print:text-black">
                  {order.address || "No address provided"}
                </p>
                <p>
                  {[order.city, order.province]
                    .filter(Boolean)
                    .join(", ") || "Location not provided"}
                </p>
                {order.zip && <p>Postal Code: {order.zip}</p>}
              </div>
            </div>
          </section>

          {/* Ordered items */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Package size={20} className="text-violet-300 print:text-gray-700" />
              <h2 className="text-lg font-bold text-white print:text-black">
                Ordered Products
              </h2>
              <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-400 print:border-gray-300 print:bg-white print:text-gray-600">
                {items.length} item{items.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] print:overflow-visible print:rounded-none print:border-gray-300">
              <table className="w-full min-w-[540px] text-sm print:min-w-0">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400 print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">
                      Product
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Unit Price
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06] print:divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-400 print:text-gray-600"
                      >
                        No ordered products found.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const quantity = Number(item.quantity) || 0;
                      const price = Number(item.price) || 0;

                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-4 font-medium text-slate-200 print:text-black">
                            {item.product?.name || "Product"}
                          </td>
                          <td className="px-4 py-4 text-center text-slate-400 print:text-gray-700">
                            {quantity}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums text-slate-400 print:text-gray-700">
                            {formatCurrency(price)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums text-slate-200 print:text-black">
                            {formatCurrency(price * quantity)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals */}
          <section className="flex justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 print:rounded-none print:border-gray-300 print:bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4 text-sm print:border-gray-200">
                <span className="text-slate-400 print:text-gray-700">
                  Subtotal
                </span>
                <span className="font-semibold tabular-nums text-slate-200 print:text-black">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4">
                <span className="text-base font-bold text-white print:text-black">
                  Total
                </span>
                <span className="text-2xl font-black tabular-nums text-violet-300 print:text-black">
                  {formatCurrency(total)}
                </span>
              </div>

              <p className="mt-3 text-right text-xs text-slate-500 print:text-gray-500">
                Amount in Philippine Peso (PHP)
              </p>
            </div>
          </section>

          {/* Status and notes */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 print:grid-cols-2 print:gap-8">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 print:rounded-none print:border-gray-300 print:bg-white">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
                Order Status
              </h2>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${status.className}`}
              >
                <StatusIcon size={17} />
                {order.status || "PENDING"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 print:rounded-none print:border-gray-300 print:bg-white">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
                Customer Notes
              </h2>

              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300 print:text-gray-700">
                {order.notes?.trim() || "No notes provided."}
              </p>
            </div>
          </section>

          {/* Invoice footer */}
          <footer className="border-t border-white/[0.08] pt-6 text-center print:border-gray-300">
            <div className="mb-2 flex items-center justify-center gap-2 text-violet-300 print:text-gray-800">
              <CheckCircle2 size={17} />
              <p className="font-semibold">
                Thank you for shopping with KEYVERSE!
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500 print:text-gray-600">
              This invoice summarizes the order details recorded by the
              store. Please retain it for your records.
            </p>
          </footer>
        </div>
      </Card>

      {/* Print-only styling */}
      <style>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          html,
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          .invoice-document,
          .invoice-document * {
            visibility: visible;
          }

          .invoice-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            color: black !important;
          }

          .invoice-header {
            break-inside: avoid;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          thead {
            display: table-header-group;
          }

          tr,
          th,
          td {
            break-inside: avoid;
          }

          h1,
          h2,
          h3 {
            break-after: avoid;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
