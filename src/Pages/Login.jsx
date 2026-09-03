import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.password) {
      return "Please enter your password.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err?.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        {/* =========================================================
            LEFT SIDE — BRAND / PRODUCT EXPERIENCE
        ========================================================== */}
        <aside className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-[52%] lg:flex-col">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
          </div>

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex min-h-screen flex-col">
            {/* Brand */}
            <div className="px-10 pt-10 xl:px-14">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30">
                  <span className="text-lg font-bold text-white">
                    T
                  </span>
                </div>

                <div>
                  <h1 className="text-base font-bold tracking-tight text-white">
                    ThreadOS AI
                  </h1>

                  <p className="text-[11px] font-medium text-slate-400">
                    Customer Experience Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 items-center px-10 py-16 xl:px-14">
              <div className="w-full max-w-xl">
                {/* Eyebrow */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                  <Sparkles size={13} className="text-violet-300" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Built for modern sellers
                  </span>
                </div>

                {/* Heading */}
                <h2 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white xl:text-5xl">
                  Your customers.
                  <br />
                  Your conversations.
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                    One intelligent workspace.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                  Manage customer conversations, automate repetitive
                  questions, organize orders, and turn more conversations
                  into sales with ThreadOS AI.
                </p>

                {/* Feature cards */}
                <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
                  <FeatureCard
                    icon={MessageSquare}
                    title="Inbox"
                    description="All conversations"
                  />

                  <FeatureCard
                    icon={ShoppingBag}
                    title="Products"
                    description="Manage your catalog"
                  />

                  <FeatureCard
                    icon={BarChart3}
                    title="Insights"
                    description="Track performance"
                  />
                </div>

                {/* Trust statement */}
                <div className="mt-10 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                    <ShieldCheck
                      size={17}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Secure seller workspace
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Built to keep your business access protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 pb-8 xl:px-14">
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
                <p className="text-[10px] font-medium text-slate-500">
                  © {new Date().getFullYear()} ThreadOS AI
                </p>

                <p className="text-[10px] text-slate-600">
                  Customer Experience Platform
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================================================
            RIGHT SIDE — LOGIN
        ========================================================== */}
        <main className="flex min-h-screen w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[48%] lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                  <span className="text-lg font-bold text-white">
                    T
                  </span>
                </div>

                <div>
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    ThreadOS AI
                  </h1>

                  <p className="text-[11px] font-medium text-slate-400">
                    Customer Experience Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Login heading */}
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
                <Lock
                  size={18}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                Seller portal
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white sm:text-[34px]">
                Welcome back
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Sign in to your ThreadOS workspace and continue
                managing your customer experience.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/10">
                  <AlertCircle
                    size={15}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                    Sign in unsuccessful
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@yourbusiness.com"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700 dark:focus:border-violet-500 dark:disabled:bg-slate-900/60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="group relative">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700 dark:focus:border-violet-500 dark:disabled:bg-slate-900/60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/15 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:shadow-white/5 dark:hover:bg-slate-100 dark:focus:ring-white/10"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/20 dark:border-t-slate-900" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to ThreadOS</span>

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                New to ThreadOS?
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Sign up */}
            <Link
              to="/signup"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Create a seller account

              <ArrowRight
                size={15}
                className="text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-500"
              />
            </Link>

            {/* Security / benefits */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Secure seller access
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                    Your account is protected by secure authentication.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <SecurityItem text="Private workspace" />
                <SecurityItem text="Protected account" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[10px] leading-5 text-slate-400">
                By continuing, you agree to use ThreadOS responsibly
                and keep your account credentials secure.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
        <Icon
          size={15}
          className="text-slate-300 transition-colors group-hover:text-violet-300"
        />
      </div>

      <p className="text-xs font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-500">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   SECURITY ITEM
========================================================= */

const SecurityItem = ({ text }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
        <Check
          size={11}
          className="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {text}
      </span>
    </div>
  );
};

export default Login;
