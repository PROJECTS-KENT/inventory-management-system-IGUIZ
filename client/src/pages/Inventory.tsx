
import { useEffect, useState } from "react";
import { getTransactions } from "../services/inventory";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import {
  History,
  Download,
  FileSpreadsheet,
  FileText,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  RefreshCw,
  Boxes,
  Activity,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  remarks: string;
  createdAt: string;
  product: {
    name: string;
    sku: string;
  };
  user?: {
    name: string;
  };
}

export default function Inventory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      setLoadError(false);

      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);
      setLoadError(true);
      toast.error("Failed to load inventory history.");
    } finally {
      setLoading(false);
    }
  }

  const isStockIn = (type: string) =>
    type === "IN" || type === "STOCK_IN";

  const filteredTransactions = transactions.filter((transaction) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (transaction.product?.name || "").toLowerCase().includes(query) ||
      (transaction.product?.sku || "").toLowerCase().includes(query) ||
      (transaction.user?.name || "").toLowerCase().includes(query) ||
      (transaction.remarks || "").toLowerCase().includes(query);

    const matchesType =
      typeFilter === "ALL" ||
      (typeFilter === "IN" && isStockIn(transaction.type)) ||
      (typeFilter === "OUT" && !isStockIn(transaction.type));

    return matchesSearch && matchesType;
  });

  const stockInCount = transactions.filter((transaction) =>
    isStockIn(transaction.type)
  ).length;

  const stockOutCount = transactions.filter(
    (transaction) => !isStockIn(transaction.type)
  ).length;

  const totalUnitsMoved = transactions.reduce(
    (total, transaction) => total + transaction.quantity,
    0
  );

  function exportToExcel() {
    if (filteredTransactions.length === 0) {
      toast.error("There are no transactions to export.");
      return;
    }

    const rows = filteredTransactions.map((transaction) => ({
      Date: new Date(transaction.createdAt).toLocaleString(),
      Product: transaction.product?.name || "-",
      SKU: transaction.product?.sku || "-",
      Type: transaction.type,
      Quantity: transaction.quantity,
      User: transaction.user?.name || "-",
      Remarks: transaction.remarks || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 22 },
      { wch: 28 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 22 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Inventory_History.xlsx");
    toast.success("Excel report exported!");
  }

  function exportToPDF() {
    if (filteredTransactions.length === 0) {
      toast.error("There are no transactions to export.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setTextColor(109, 40, 217);
    doc.setFontSize(18);
    doc.text("KEYVERSE", 14, 16);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text("Inventory History Report", 14, 25);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      32
    );
    doc.text(
      `Transactions: ${filteredTransactions.length}`,
      14,
      38
    );

    autoTable(doc, {
      startY: 44,
      head: [[
        "Date",
        "Product",
        "SKU",
        "Type",
        "Qty",
        "User",
        "Remarks",
      ]],
      body: filteredTransactions.map((transaction) => [
        new Date(transaction.createdAt).toLocaleString(),
        transaction.product?.name || "-",
        transaction.product?.sku || "-",
        transaction.type,
        transaction.quantity,
        transaction.user?.name || "-",
        transaction.remarks || "-",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [91, 33, 182],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 243, 255],
      },
      margin: {
        left: 14,
        right: 14,
      },
    });

    doc.save("Inventory_History.pdf");
    toast.success("PDF report exported!");
  }

  return (
    <div className="min-h-screen bg-[#090A12] p-4 text-slate-100 sm:p-6 lg:p-8">
      <PageHeader
        title="Inventory History"
        subtitle="Monitor stock movements and review every inventory transaction."
      />

      {/* Page introduction */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            KEYVERSE / INVENTORY / HISTORY
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Stock Movement Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review incoming and outgoing inventory activity.
          </p>
        </div>

        <button
          onClick={loadTransactions}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh History
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">
                Total Transactions
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {transactions.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                All recorded movements
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <History size={22} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Stock In</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {stockInCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Incoming transactions
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <ArrowDownToLine size={22} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Stock Out</p>
              <p className="mt-2 text-3xl font-bold text-rose-300">
                {stockOutCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Outgoing transactions
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
              <ArrowUpFromLine size={22} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Units Moved</p>
              <p className="mt-2 text-3xl font-bold text-sky-300">
                {totalUnitsMoved.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Sum of transaction quantities
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <Activity size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction table */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-lg font-bold text-white">
              Transaction History
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTransactions.length} matching record
              {filteredTransactions.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, SKU, user..."
                className="w-full rounded-xl border border-white/10 bg-[#0B0C15] py-2.5 pl-9 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-400/50 sm:w-64"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#0B0C15] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-400/50"
              aria-label="Filter by transaction type"
            >
              <option value="ALL">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>
        </div>

        {/* Export actions */}
        <div className="flex flex-wrap gap-3 border-b border-white/[0.07] bg-white/[0.015] px-5 py-4 sm:px-6">
          <button
            onClick={exportToExcel}
            disabled={loading || filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/[0.15] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSpreadsheet size={17} />
            Export Excel
            <Download size={14} />
          </button>

          <button
            onClick={exportToPDF}
            disabled={loading || filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/[0.15] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileText size={17} />
            Export PDF
            <Download size={14} />
          </button>

          <p className="flex items-center gap-2 text-xs text-slate-500 sm:ml-auto sm:self-center">
            <CalendarDays size={15} />
            Reports use the currently filtered records.
          </p>
        </div>

        {loadError ? (
          <div className="px-4 py-16 text-center">
            <AlertCircle
              size={32}
              className="mx-auto mb-3 text-rose-300"
            />
            <h3 className="font-semibold text-white">
              Unable to load inventory history
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Please check your connection and try again.
            </p>
            <button
              onClick={loadTransactions}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading transactions...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
              <Boxes size={26} />
            </div>
            <h3 className="mt-4 font-semibold text-white">
              No transactions found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or transaction filter.
            </p>
            {(search || typeFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                }}
                className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05]"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#191827] text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Date & Time</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4 text-center">SKU</th>
                  <th className="px-5 py-4 text-center">Movement</th>
                  <th className="px-5 py-4 text-center">Quantity</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Remarks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {filteredTransactions.map((transaction) => {
                  const stockIn = isStockIn(transaction.type);

                  return (
                    <tr
                      key={transaction.id}
                      className="transition hover:bg-violet-400/[0.035]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-slate-300">
                          {new Date(
                            transaction.createdAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            transaction.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {transaction.product?.name || "Unknown Product"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-xs text-slate-300">
                          {transaction.product?.sku || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            stockIn
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-rose-400/20 bg-rose-400/10 text-rose-300"
                          }`}
                        >
                          {stockIn ? (
                            <ArrowDownToLine size={13} />
                          ) : (
                            <ArrowUpFromLine size={13} />
                          )}
                          {stockIn ? "STOCK IN" : "STOCK OUT"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`font-bold ${
                            stockIn ? "text-emerald-300" : "text-rose-300"
                          }`}
                        >
                          {stockIn ? "+" : "−"}
                          {transaction.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {transaction.user?.name || "—"}
                      </td>

                      <td className="max-w-[220px] px-5 py-4 text-slate-400">
                        <p className="truncate" title={transaction.remarks || ""}>
                          {transaction.remarks || "No remarks"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !loadError && filteredTransactions.length > 0 && (
          <div className="flex flex-wrap justify-between gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-slate-500 sm:px-6">
            <span>
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </span>
            <span>KEYVERSE Inventory Records</span>
          </div>
        )}
      </Card>

      <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-slate-600">
        KEYVERSE ADMIN CONSOLE · INVENTORY HISTORY
      </footer>
    </div>
  );
}
