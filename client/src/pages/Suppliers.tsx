
import { useEffect, useState } from "react";
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
} from "../services/supplier";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Truck,
  Trash2,
  Hash,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(query)
      )
    );
  }, [search, suppliers]);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const supplierName = name.trim();

    if (!supplierName) {
      toast.error("Supplier name is required.");
      return;
    }

    try {
      setCreating(true);
      await createSupplier(supplierName);

      toast.success("Supplier added successfully!");
      setName("");
      await loadSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create supplier.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete Supplier?",
      text: "This action cannot be undone.",
      icon: "warning",
      background: "#151522",
      color: "#F1F5F9",
      iconColor: "#A78BFA",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl border border-violet-400/20",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteSupplier(id);

      toast.success("Supplier deleted successfully!");
      await loadSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete supplier.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Suppliers"
        subtitle="Manage supplier records and keep your inventory supply network organized."
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Suppliers
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                {suppliers.length}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Registered suppliers
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <Truck size={24} className="text-violet-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Search Results
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                {filteredSuppliers.length}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Suppliers matching your search
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Search size={23} className="text-blue-300" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        {/* Section Heading */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Supplier Management
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Add suppliers or manage your existing records.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSuppliers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label
            htmlFor="supplier-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search suppliers
          </label>

          <div className="relative max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="supplier-search"
              type="text"
              placeholder="Search by supplier name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

        {/* Add Supplier */}
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-violet-400/15 bg-violet-500/[0.04] p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
              <Plus size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-white">Add New Supplier</h3>
              <p className="text-xs text-slate-400">
                Enter the name of the supplier you want to register.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="e.g. ABC Trading..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              disabled={creating}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B0C14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Plus size={17} />
              )}
              {creating ? "Adding..." : "Add Supplier"}
            </button>
          </div>
        </form>

        {/* Table Heading */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">All Suppliers</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredSuppliers.length}{" "}
              {filteredSuppliers.length === 1 ? "supplier" : "suppliers"} shown
            </p>
          </div>

          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400">
            SUPPLIER LIST
          </span>
        </div>

        {/* Suppliers Table */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="min-w-full divide-y divide-white/[0.08]">
            <thead className="bg-[#171624]">
              <tr>
                <th className="w-20 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  #
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Supplier Name
                </th>

                <th className="w-36 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06] bg-[#10111A]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-14 text-center">
                    <LoaderCircle
                      size={25}
                      className="mx-auto animate-spin text-violet-400"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      Loading suppliers...
                    </p>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-14 text-center">
                    {search.trim() ? (
                      <>
                        <Search
                          size={28}
                          className="mx-auto text-slate-600"
                        />
                        <p className="mt-3 font-medium text-slate-300">
                          No matching suppliers
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try a different search term.
                        </p>
                      </>
                    ) : (
                      <>
                        <AlertCircle
                          size={28}
                          className="mx-auto text-slate-600"
                        />
                        <p className="mt-3 font-medium text-slate-300">
                          No suppliers found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Add your first supplier using the form above.
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className="transition-colors hover:bg-violet-500/[0.05]"
                  >
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-slate-400">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/10">
                          <Truck size={17} className="text-violet-300" />
                        </div>

                        <span className="font-medium text-slate-200">
                          {supplier.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(supplier.id)}
                        disabled={deletingId !== null}
                        aria-label={`Delete ${supplier.name}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/15 bg-red-500/[0.08] px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === supplier.id ? (
                          <LoaderCircle
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {deletingId === supplier.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
          <Hash size={14} className="mt-0.5 shrink-0" />
          <p>
            Supplier deletion may be restricted when existing products or
            records reference that supplier, depending on your backend rules.
          </p>
        </div>
      </Card>
    </div>
  );
}
