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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const Signup = () => {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);  // store action


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
        businessName: formData.businessName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="flex min-h-screen">

        {/* =================================================
            LEFT SIDE — BRAND
        ================================================== */}

        <div className="hidden w-1/2 bg-gray-900 lg:flex lg:flex-col lg:justify-between">

          <div className="p-10">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-gray-100">
                T
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  ThreadOS AI
                </h1>

                <p className="text-xs text-gray-400">
                  Customer Experience Platform
                </p>
              </div>

            </div>
          </div>

          <div className="px-10 pb-16">

            <p className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white">
              Build a better customer experience for your business.
            </p>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-400">
              Bring your customer conversations, products,
              AI assistant and team into one workspace.
            </p>

            <div className="mt-8 space-y-3">

              <Feature text="One unified customer inbox" />

              <Feature text="AI-powered customer support" />

              <Feature text="Customer and product management" />

              <Feature text="Connect your customer channels" />

            </div>

          </div>

          <div className="px-10 pb-8">
            <p className="text-[10px] text-gray-500">
              © {new Date().getFullYear()} ThreadOS AI
            </p>
          </div>

        </div>

        {/* =================================================
            RIGHT SIDE — SIGN UP
        ================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile brand */}

            <div className="mb-8 lg:hidden">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                  T
                </div>

                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ThreadOS AI
                  </h1>

                  <p className="text-xs text-gray-400">
                    Customer Experience Platform
                  </p>
                </div>

              </div>

            </div>

            {/* Header */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Seller portal
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create your seller account and set up your
                business workspace.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">

                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >

              {/* Business name */}

              <div>

                <label
                  htmlFor="businessName"
                  className="mb-2 block text-xs font-medium text-gray-700"
                >
                  Business or store name
                </label>

                <div className="relative">

                  <Store
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your store name"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />

                </div>

              </div>

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-gray-700"
                >
                  Your name
                </label>

                <div className="relative">

                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@yourbusiness.com"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-11 text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-gray-700"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter your password again"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-11 text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* Terms */}

              <label className="flex cursor-pointer items-start gap-2.5 pt-1">

                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(event) =>
                    setAgreeToTerms(
                      event.target.checked
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 dark:text-gray-100 focus:ring-gray-200"
                />

                <span className="text-xs leading-5 text-gray-500">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
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
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} />
                  </>
                )}

              </button>

            </form>

            {/* Login link */}

            <div className="mt-7 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">

              <p className="text-xs text-gray-500">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                >
                  Sign in
                </Link>
              </p>

            </div>

            {/* Security note */}

            <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-gray-400">

              <Lock size={11} />

              Secure seller account creation

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   FEATURE
========================================================= */

const Feature = ({ text }) => {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-700">

        <Check
          size={11}
          className="text-gray-300"
        />

      </div>

      <p className="text-xs text-gray-400">
        {text}
      </p>

    </div>
  );
};

export default Signup;