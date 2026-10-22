
import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  toggleUserStatus,
} from "../services/user";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import toast from "react-hot-toast";
import {
  Search,
  UserPlus,
  Users as UsersIcon,
  ShieldCheck,
  Mail,
  UserRound,
  LoaderCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  isActive: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.name.trim().length === 0) {
      toast.error("Full name is required.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setCreating(true);

     await createUser({
  ...form,
  name: form.name.trim(),
  email: form.email.trim(),
  role: "ADMIN",
});

      toast.success("Admin account created successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Admin account");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      setTogglingId(id);

      await toggleUserStatus(id);
      toast.success("User status updated");

      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  }

  const query = search.trim().toLowerCase();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );

  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.length - activeUsers;

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Users"
        subtitle="Manage administrator accounts, access status, and administrative permissions."
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Administrators
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {users.length}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Registered admin accounts
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <UsersIcon size={24} className="text-violet-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Active Accounts
              </p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-300">
                {activeUsers}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Accounts currently enabled
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
              <UserCheck size={24} className="text-emerald-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Inactive Accounts
              </p>
              <h2 className="mt-2 text-3xl font-bold text-rose-300">
                {inactiveUsers}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Accounts currently disabled
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10">
              <UserX size={24} className="text-rose-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* Create Admin */}
      <Card className="mb-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
            <UserPlus size={22} className="text-violet-300" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Create Admin Account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Register a new administrator for the KEYVERSE console.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="admin-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-name"
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-violet-300"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters. Keep administrator credentials
                private.
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/[0.08] pt-5">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {creating ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <UserPlus size={17} />
              )}
              {creating ? "Creating Account..." : "Create Admin"}
            </button>
          </div>
        </form>
      </Card>

      {/* User List */}
      <Card className="!p-0">
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Administrator Accounts
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Review accounts and manage access status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="border-y border-white/[0.08] bg-white/[0.02] px-5 py-4 sm:px-6">
          <label
            htmlFor="admin-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search administrators
          </label>

          <div className="relative max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="admin-search"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} accounts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.08]">
            <thead className="bg-[#171624]">
              <tr>
                <th className="w-16 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                  Administrator
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                  Email
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06] bg-[#10111A]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <LoaderCircle
                      size={26}
                      className="mx-auto animate-spin text-violet-400"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      Loading administrator accounts...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <Search size={28} className="mx-auto text-slate-600" />
                    <p className="mt-3 font-medium text-slate-300">
                      No administrators found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or create an admin account above.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-violet-500/[0.04]"
                  >
                    <td className="px-4 py-4 text-center sm:px-5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-slate-400">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-sm font-semibold text-violet-200">
                          {user.name.trim().charAt(0).toUpperCase() || "A"}
                        </div>

                        <span className="whitespace-nowrap font-medium text-slate-200">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-400 sm:px-5">
                      {user.email}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/15 bg-amber-500/[0.08] px-3 py-1 text-xs font-semibold text-amber-300">
                        <ShieldCheck size={13} />
                        ADMIN
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-300"
                            : "border-rose-400/15 bg-rose-500/[0.08] text-rose-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          }`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => void handleToggle(user.id)}
                        disabled={togglingId !== null}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.isActive
                            ? "border-rose-400/20 bg-rose-500/[0.08] text-rose-300 hover:bg-rose-500/[0.16]"
                            : "border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-300 hover:bg-emerald-500/[0.16]"
                        }`}
                      >
                        {togglingId === user.id ? (
                          <LoaderCircle
                            size={14}
                            className="animate-spin"
                          />
                        ) : user.isActive ? (
                          <UserX size={14} />
                        ) : (
                          <UserCheck size={14} />
                        )}

                        {togglingId === user.id
                          ? "Updating..."
                          : user.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 border-t border-white/[0.08] px-5 py-4 text-xs leading-5 text-slate-500 sm:px-6">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-violet-400" />
          <p>
            Administrator accounts can access privileged features. Only create
            accounts for people who need administrative access.
          </p>
        </div>
      </Card>
    </div>
  );
}
