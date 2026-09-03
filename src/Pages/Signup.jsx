import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Store,
  ArrowRight,
  AlertCircle,
  Check,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const Signup = () => {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
    if (!formData.businessName.trim()) {
      return "Please enter your business or store name.";
    }

    if (!formData.name.trim()) {
      return "Please enter your name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.password) {
      return "Please create a password.";
    }

    if (formData.password.length < 8) {
      return "Your password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!agreeToTerms) {
      return "Please agree to the terms and conditions.";
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

      await register({
        businessName: formData.businessName.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordLength = formData.password.length;

  const passwordStrength =
    passwordLength === 0
      ? "none"
      : passwordLength < 8
      ? "weak"
      : passwordLength < 12
      ? "basic"
      : passwordLength < 16
      ? "good"
      : "strong";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        {/* =========================================================
            LEFT SIDE — BRAND EXPERIENCE
        ========================================================== */}
        <aside className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-[52%] lg:flex-col">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />

            <div className="absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="absolute left-1/2 top-[45%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
          </div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex min-h-screen flex-col">
            {/* Brand */}
            <div className="px-10 pt-10 xl:px-14">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-950/30">
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

            {/* Main */}
            <div className="flex flex-1 items-center px-10 py-16 xl:px-14">
              <div className="w-full max-w-xl">
                {/* Eyebrow */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 backdrop-blur-sm">
                  <Sparkles
                    size={13}
                    className="text-violet-300"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-300">
                    Start selling smarter
                  </span>
                </div>

                {/* Main heading */}
                <h2 className="max-w-xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-white xl:text-5xl">
                  Build a better
                  <br />
                  customer experience
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                    from one workspace.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                  Bring your customer conversations, products,
                  customers, AI assistant, and business insights
                  together in one intelligent workspace.
                </p>

                {/* Product features */}
                <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                  <FeatureCard
                    icon={MessageSquare}
                    title="Inbox"
                    description="All conversations"
                  />

                  <FeatureCard
                    icon={ShoppingBag}
                    title="Products"
                    description="Your catalog"
                  />

                  <FeatureCard
                    icon={BarChart3}
                    title="Insights"
                    description="Business data"
                  />
                </div>

                {/* Highlight */}
                <div className="mt-8 flex max-w-lg items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <Zap
                      size={16}
                      className="text-violet-300"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Designed for growing sellers
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                      Spend less time managing messages and more
                      time growing your business.
                    </p>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-8 flex items-center gap-3">
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
                      Your business stays protected behind secure authentication.
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
            RIGHT SIDE — SIGNUP FORM
        ========================================================== */}
        <main className="flex min-h-screen w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[48%] lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-8 lg:hidden">
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

            {/* Header */}
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
                <Store
                  size={18}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Seller portal
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[34px]">
                Create your account
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create your seller workspace and start managing
                your customer experience.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
                  <AlertCircle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                    We couldn't create your account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
              noValidate
            >
              {/* Business */}
              <FormInput
                id="businessName"
                name="businessName"
                label="Business or store name"
                icon={Store}
                type="text"
                autoComplete="organization"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Morgan Fashion"
                disabled={loading}
              />

              {/* Name */}
              <FormInput
                id="name"
                name="name"
                label="Your name"
                icon={User}
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                disabled={loading}
              />

              {/* Email */}
              <FormInput
                id="email"
                name="email"
                label="Email address"
                icon={Mail}
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@yourbusiness.com"
                disabled={loading}
              />

              {/* Password */}
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                disabled={loading}
              />

              {/* Password strength */}
              <div className="space-y-2 px-1">
                <div className="flex items-center gap-1.5">
                  <PasswordBar
                    active={passwordLength >= 8}
                    strength={passwordStrength}
                  />

                  <PasswordBar
                    active={passwordLength >= 12}
                    strength={passwordStrength}
                  />

                  <PasswordBar
                    active={passwordLength >= 16}
                    strength={passwordStrength}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400">
                    Use 8 or more characters
                  </p>

                  {passwordLength > 0 && (
                    <p
                      className={`text-[10px] font-semibold ${
                        passwordStrength === "weak"
                          ? "text-red-500"
                          : passwordStrength === "basic"
                          ? "text-amber-500"
                          : passwordStrength === "good"
                          ? "text-blue-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {passwordStrength === "weak"
                        ? "Too short"
                        : passwordStrength === "basic"
                        ? "Basic"
                        : passwordStrength === "good"
                        ? "Good"
                        : passwordStrength === "strong"
                        ? "Strong"
                        : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm password */}
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password again"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                disabled={loading}
              />

              {/* Match state */}
              {formData.confirmPassword && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-semibold ${
                    formData.password === formData.confirmPassword
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      formData.password === formData.confirmPassword
                        ? "bg-emerald-100 dark:bg-emerald-500/10"
                        : "bg-red-100 dark:bg-red-500/10"
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <Check size={11} />
                    ) : (
                      <span className="text-[10px]">!</span>
                    )}
                  </div>

                  {formData.password === formData.confirmPassword
                    ? "Your passwords match."
                    : "Your passwords do not match."}
                </div>
              )}

              {/* Terms */}
              <label className="group flex cursor-pointer items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(event) =>
                    setAgreeToTerms(event.target.checked)
                  }
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-violet-600 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
                />

                <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-semibold text-slate-800 transition-colors hover:text-violet-600 hover:underline dark:text-slate-200 dark:hover:text-violet-400"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-semibold text-slate-800 transition-colors hover:text-violet-600 hover:underline dark:text-slate-200 dark:hover:text-violet-400"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/15 focus:outline-none focus:ring-4 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/20 dark:border-t-slate-900" />

                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create seller account</span>

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Existing account */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Already have an account?
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <Link
              to="/login"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Sign in to your account

              <ArrowRight
                size={15}
                className="text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-500"
              />
            </Link>

            {/* Security card */}
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
                    Secure account creation
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                    Your seller workspace is protected by secure authentication.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <SecurityItem text="Private workspace" />
                <SecurityItem text="Protected access" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 text-center">
              <p className="text-[10px] leading-5 text-slate-400">
                By creating an account, you agree to use ThreadOS
                responsibly and keep your account credentials secure.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   FORM INPUT
========================================================= */

const FormInput = ({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  autoCapitalize,
  spellCheck,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="group relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-violet-500"
        />

        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700 dark:focus:border-violet-500 dark:disabled:bg-slate-900/60"
        />
      </div>
    </div>
  );
};

/* =========================================================
   PASSWORD INPUT
========================================================= */

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="group relative">
        <Lock
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-violet-500"
        />

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700 dark:focus:border-violet-500 dark:disabled:bg-slate-900/60"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((current) => !current)
          }
          disabled={disabled}
          aria-label={
            showPassword
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
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
  );
};

/* =========================================================
   PASSWORD BAR
========================================================= */

const PasswordBar = ({ active, strength }) => {
  const getColor = () => {
    if (!active) {
      return "bg-slate-200 dark:bg-slate-800";
    }

    if (strength === "weak") {
      return "bg-red-500";
    }

    if (strength === "basic") {
      return "bg-amber-500";
    }

    if (strength === "good") {
      return "bg-blue-500";
    }

    return "bg-emerald-500";
  };

  return (
    <div
      className={`h-1 flex-1 rounded-full transition-all duration-300 ${getColor()}`}
    />
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
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]">
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

export default Signup;
