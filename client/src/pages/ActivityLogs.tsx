
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  FileSearch,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getActivityLogs } from "../services/activity";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

interface ActivityLog {
  id: string | number;
  action: string;
  details: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
}

type ActionFilter = "ALL" | "CREATE" | "UPDATE" | "DELETE" | "STOCK" | "OTHER";

function getActionStyle(action: string) {
  const normalized = action.toUpperCase();

  if (normalized.includes("CREATE")) {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (normalized.includes("UPDATE")) {
    return "border-amber-400/20 bg-amber-500/10 text-amber-300";
  }

  if (normalized.includes("DELETE")) {
    return "border-rose-400/20 bg-rose-500/10 text-rose-300";
  }

  if (normalized.includes("STOCK")) {
    return "border-sky-400/20 bg-sky-500/10 text-sky-300";
  }

  return "border-violet-400/20 bg-violet-500/10 text-violet-300";
}

function matchesActionFilter(action: string, filter: ActionFilter) {
  const normalized = action.toUpperCase();

  if (filter === "ALL") return true;
  if (filter === "CREATE") return normalized.includes("CREATE");
  if (filter === "UPDATE") return normalized.includes("UPDATE");
  if (filter === "DELETE") return normalized.includes("DELETE");
  if (filter === "STOCK") return normalized.includes("STOCK");

  return !["CREATE", "UPDATE", "DELETE", "STOCK"].some((keyword) =>
    normalized.includes(keyword)
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    void loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    setError(false);

    try {
      const data = await getActivityLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const userName = log.user?.name ?? "Unknown user";
      const userRole = log.user?.role ?? "Unknown role";
      const action = log.action ?? "";
      const details = log.details ?? "";

      const matchesSearch =
        !query ||
        userName.toLowerCase().includes(query) ||
        userRole.toLowerCase().includes(query) ||
        action.toLowerCase().includes(query) ||
        details.toLowerCase().includes(query);

      return matchesSearch && matchesActionFilter(action, actionFilter);
    });
  }, [logs, search, actionFilter]);

  const createCount = logs.filter((log) =>
    log.action.toUpperCase().includes("CREATE")
  ).length;

  const updateCount = logs.filter((log) =>
    log.action.toUpperCase().includes("UPDATE")
  ).length;

  const stockCount = logs.filter((log) =>
    log.action.toUpperCase().includes("STOCK")
  ).length;

  const filterOptions: { label: string; value: ActionFilter }[] = [
    { label: "All Activities", value: "ALL" },
    { label: "Create", value: "CREATE" },
    { label: "Update", value: "UPDATE" },
    { label: "Delete", value: "DELETE" },
    { label: "Stock", value: "STOCK" },
    { label: "Other", value: "OTHER" },
  ];

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Activity Logs"
        subtitle="Audit trail of system activity, user actions, and inventory changes."
      />

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Total Activities</p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {loading ? "—" : logs.length.toLocaleString()}
              </h2>
            </div>
            <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-3 text-violet-300">
              <Activity size={22} />
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Created</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-300">
                {loading ? "—" : createCount.toLocaleString()}
              </h2>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-300">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Updated</p>
              <h2 className="mt-2 text-3xl font-bold text-amber-300">
                {loading ? "—" : updateCount.toLocaleString()}
              </h2>
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-300">
              <Database size={22} />
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Stock Activities</p>
              <h2 className="mt-2 text-3xl font-bold text-sky-300">
                {loading ? "—" : stockCount.toLocaleString()}
              </h2>
            </div>
            <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-300">
              <ShieldCheck size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* Activity table */}
      <Card className="!p-0">
        <div className="border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileSearch size={20} className="text-violet-300" />
                <h2 className="text-lg font-bold text-white">
                  System Audit Trail
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Review recorded actions and the users who performed them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadLogs()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Logs
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user, role, action, or details..."
                className="w-full rounded-xl border border-white/10 bg-[#0B0C15] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = actionFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActionFilter(option.value)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                        : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredLogs.length.toLocaleString()} of{" "}
              {logs.length.toLocaleString()} activities
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Audit records
            </span>
          </div>
        </div>

        {error && (
          <div className="m-5 flex flex-wrap items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-500/[0.07] p-4 text-sm text-rose-300">
            <AlertCircle size={18} className="shrink-0" />
            <span className="flex-1">
              Could not load activity logs. Check your connection and try
              again.
            </span>
            <button
              type="button"
              onClick={() => void loadLogs()}
              className="font-semibold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-[#0C0D17] text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">
                  Date & Time
                </th>
                <th className="px-5 py-4 text-left font-semibold">
                  User
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Role
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Action
                </th>
                <th className="px-5 py-4 text-left font-semibold">
                  Details
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <RefreshCw
                      size={24}
                      className="mx-auto mb-3 animate-spin text-violet-300"
                    />
                    <p className="text-slate-400">
                      Loading activity logs...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <AlertCircle
                      size={25}
                      className="mx-auto mb-3 text-rose-300"
                    />
                    <p className="text-slate-300">
                      Activity logs could not be loaded.
                    </p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                      <FileSearch size={22} className="text-slate-500" />
                    </div>
                    <p className="font-medium text-slate-300">
                      No activity logs found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or action filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition hover:bg-violet-500/[0.035]"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-slate-500"
                        />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                          <UserRound size={17} />
                        </div>
                        <span className="font-medium text-slate-200">
                          {log.user?.name ?? "Unknown user"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                        {log.user?.role ?? "Unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getActionStyle(log.action ?? "")}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {log.action || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="max-w-md px-5 py-4 leading-6 text-slate-400">
                      <span className="break-words">
                        {log.details || "No additional details"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] bg-white/[0.015] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Clock size={14} />
            Dates and times use your browser's local time zone.
          </span>
          <span>KEYVERSE / AUDIT CONSOLE</span>
        </div>
      </Card>
    </div>
  );
}
