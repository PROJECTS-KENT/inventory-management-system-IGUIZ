
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../services/account";

const STORE_BACKGROUND =
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=85";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const customer = await getProfile();

        if (!active) return;

        setForm({
          name: customer.name || "",
          email: customer.email || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);

        if (active) {
          toast.error("Unable to load your profile.");
          navigate("/customer/profile", { replace: true });
        }
      } finally {
        if (active) setLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const updatedCustomer = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
      });

      // Keep locally stored customer information in sync.
      const savedCustomer = {
        ...JSON.parse(localStorage.getItem("customer") || "{}"),
        ...updatedCustomer,
        name: updatedCustomer?.name ?? form.name.trim(),
        email: updatedCustomer?.email ?? form.email.trim(),
      };

      localStorage.setItem("customer", JSON.stringify(savedCustomer));

      toast.success("Your profile has been updated!");
      navigate("/customer/profile", { replace: true });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20";

  if (loadingProfile) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 bg-cover bg-center px-6 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(7,10,24,.93), rgba(7,10,24,.96)), url("${STORE_BACKGROUND}")`,
        }}
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
          <p className="mt-4 text-sm text-slate-300">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(7,10,24,.88) 0%,
            rgba(10,13,29,.94) 45%,
            rgba(7,10,24,.98) 100%
          ),
          url("${STORE_BACKGROUND}")
        `,
      }}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-32 top-96 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/store" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1m3 0h1M8 15h8" />
              </svg>
            </div>

            <div>
              <span className="block text-lg font-extrabold tracking-tight">
                KEY<span className="text-violet-400">VERSE</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Your setup starts here
              </span>
            </div>
          </Link>

          <Link
            to="/customer/profile"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:bg-white/5"
          >
            ← Back to My Account
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        {/* Page heading */}
        <section className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
            Account settings
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Edit Profile<span className="text-violet-400">.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Keep your account information up to date. Your changes will be
            saved to your KEYVERSE profile.
          </p>
        </section>

        {/* Edit form */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />

          <div className="p-6 sm:p-9">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path d="m14 5 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z" />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update the details associated with your account.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-200"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClasses}
                  maxLength={100}
                  required
                  disabled={loading}
                />

                <p className="mt-2 text-xs text-slate-500">
                  This is the name displayed on your customer profile.
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-200"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={inputClasses}
                  maxLength={254}
                  required
                  disabled={loading}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Make sure your email address is correct.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/customer/profile"
                  className="flex items-center justify-center rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Your profile information is managed through your customer account.
        </p>

        <footer className="mt-12 border-t border-white/10 py-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-300">
            KEY<span className="text-violet-400">VERSE</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Your account. Your setup. Your style.
          </p>
        </footer>
      </main>
    </div>
  );
}
