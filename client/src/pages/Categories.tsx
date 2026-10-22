
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/category";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Tags,
  Trash2,
  Hash,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(query)
      )
    );
  }, [search, categories]);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setCreating(true);
      await createCategory(categoryName);

      toast.success("Category added successfully!");
      setName("");
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create category.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete Category?",
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
      await deleteCategory(id);

      toast.success("Category deleted successfully!");
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#090A12] text-slate-100">
      <PageHeader
        title="Categories"
        subtitle="Organize your inventory with clear, manageable product categories."
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                {categories.length}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Categories in your inventory
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <Tags className="text-violet-300" size={24} />
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
                {filteredCategories.length}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Categories matching your search
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Search className="text-blue-300" size={23} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        {/* Section heading */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Category Management
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Add new categories or manage existing ones.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label
            htmlFor="category-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search categories
          </label>

          <div className="relative max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="category-search"
              type="text"
              placeholder="Search by category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C14] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

        {/* Add Category */}
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-violet-400/15 bg-violet-500/[0.04] p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
              <Plus size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-white">Add New Category</h3>
              <p className="text-xs text-slate-400">
                Enter a name for your new product category.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="e.g. Electronics, Accessories..."
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
              {creating ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>

        {/* Table heading */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">All Categories</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"} shown
            </p>
          </div>

          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400">
            CATEGORY LIST
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="min-w-full divide-y divide-white/[0.08]">
            <thead className="bg-[#171624]">
              <tr>
                <th className="w-20 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category Name
                </th>
                <th className="w-32 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                      Loading categories...
                    </p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-14 text-center">
                    {search.trim() ? (
                      <>
                        <Search
                          size={28}
                          className="mx-auto text-slate-600"
                        />
                        <p className="mt-3 font-medium text-slate-300">
                          No matching categories
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
                          No categories found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Add your first category using the form above.
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
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
                          <Hash size={17} className="text-violet-300" />
                        </div>
                        <span className="font-medium text-slate-200">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId !== null}
                        aria-label={`Delete ${category.name}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/15 bg-red-500/[0.08] px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === category.id ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {deletingId === category.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>
            Deleting a category may be restricted if products are assigned to
            it, depending on your backend rules.
          </p>
        </div>
      </Card>
    </div>
  );
}
