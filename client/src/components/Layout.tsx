
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  History,
  Boxes,
  Truck,
  LogOut,
  ArrowLeftRight,
  Users,
  FileText,
  ClipboardList,
  ShoppingCart,
  Keyboard,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import {
  getUnreadOrders,
  clearUnreadOrders,
} from "../services/orderNotification";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name") || "Administrator";

  const [unread, setUnread] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const count = await getUnreadOrders();

        if (active) {
          setUnread(Number(count) || 0);
        }
      } catch (error) {
        console.error("Failed to load order notifications:", error);
      }
    }

    void loadNotifications();

    const interval = setInterval(() => {
      void loadNotifications();
    }, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  async function openOrders() {
    setMobileMenuOpen(false);

    try {
      await clearUnreadOrders();
      setUnread(0);
    } catch (error) {
      console.error("Failed to clear order notifications:", error);
    }

    navigate("/orders");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    toast.success("Logged out successfully!");
    navigate("/admin", { replace: true });
  }

  const isActive = (path: string) => {
    if (path === "/products") {
      return (
        location.pathname === "/products" ||
        location.pathname.startsWith("/products/")
      ) && location.pathname !== "/products/new";
    }

    if (path === "/inventory") {
      return location.pathname === "/inventory";
    }

    if (path === "/inventory/transaction") {
      return location.pathname === "/inventory/transaction";
    }

    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    const active = isActive(path);

    return [
      "group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200",
      active
        ? "border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-blue-500/[0.06] text-white shadow-[inset_3px_0_0_0_#A78BFA]"
        : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white",
    ].join(" ");
  };

  const ordersActive = location.pathname === "/orders";

  const navigation = (
    <>
      <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
        Workspace
      </div>

      <Link to="/dashboard" className={linkClass("/dashboard")}>
        <LayoutDashboard size={18} />
        <span className="flex-1">Dashboard</span>
        {isActive("/dashboard") && (
          <ChevronRight size={15} className="text-violet-300" />
        )}
      </Link>

      <Link to="/products" className={linkClass("/products")}>
        <Package size={18} />
        <span className="flex-1">Products</span>
        {isActive("/products") && (
          <ChevronRight size={15} className="text-violet-300" />
        )}
      </Link>

      <Link to="/products/new" className={linkClass("/products/new")}>
        <PlusCircle size={18} />
        <span>Add Product</span>
      </Link>

      <Link to="/inventory" className={linkClass("/inventory")}>
        <History size={18} />
        <span>Inventory History</span>
      </Link>

      <Link
        to="/inventory/transaction"
        className={linkClass("/inventory/transaction")}
      >
        <ArrowLeftRight size={18} />
        <span>Stock Transaction</span>
      </Link>

      {role === "ADMIN" && (
        <>
          <div className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
            Management
          </div>

          <Link to="/categories" className={linkClass("/categories")}>
            <Boxes size={18} />
            <span>Categories</span>
          </Link>

          <Link to="/suppliers" className={linkClass("/suppliers")}>
            <Truck size={18} />
            <span>Suppliers</span>
          </Link>

          <Link to="/users" className={linkClass("/users")}>
            <Users size={18} />
            <span>Users</span>
          </Link>

          <button
            type="button"
            onClick={openOrders}
            className={[
              "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200",
              ordersActive
                ? "border-violet-400/20 bg-violet-500/15 text-white shadow-[inset_3px_0_0_0_#A78BFA]"
                : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={18} />
              Customer Orders
            </span>

            {unread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-rose-950/30">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
        </>
      )}

      <div className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
        Insights
      </div>

      <Link to="/reports" className={linkClass("/reports")}>
        <FileText size={18} />
        <span>Reports</span>
      </Link>

      <Link to="/activity" className={linkClass("/activity")}>
        <ClipboardList size={18} />
        <span>Activity Logs</span>
      </Link>
    </>
  );

  const sidebar = (
    <aside className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0D0E18] p-4 sm:p-5">
      <Link
        to="/dashboard"
        className="mb-8 flex shrink-0 items-center gap-3 px-2 pt-2"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-300 shadow-lg shadow-violet-950/20">
          <Keyboard size={23} />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            KEY<span className="text-violet-400">VERSE</span>
          </h1>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Admin Console
          </p>
        </div>
      </Link>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1">
        {navigation}
      </nav>

      <div className="mt-4 shrink-0 border-t border-white/[0.07] pt-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-200">
              {userName}
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-300">
              {role || "Admin"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3 text-sm font-semibold text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-200"
        >
          <LogOut size={17} />
          Logout
        </button>

        <p className="mt-4 text-center text-[9px] tracking-wider text-slate-700">
          KEYVERSE © ADMIN SYSTEM
        </p>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#090A12] text-slate-100">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 md:block">
        {sidebar}
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 left-0 flex max-w-[85vw] shadow-2xl shadow-black/50">
            {sidebar}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-slate-300"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-x-hidden bg-[#090A12]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#090A12]/90 px-4 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08]"
          >
            <Menu size={19} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <Keyboard size={19} className="text-violet-300" />
            <span className="font-extrabold tracking-tight text-white">
              KEY<span className="text-violet-400">VERSE</span>
            </span>
          </Link>

          <div className="w-9" />
        </header>

        <Outlet />
      </main>
    </div>
  );
}
