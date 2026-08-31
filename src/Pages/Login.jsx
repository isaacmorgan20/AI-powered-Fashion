import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const Login = () => {
  const login = useAuthStore((state) => state.login);  // store action
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

      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* =================================================
            LEFT SIDE — BRAND
        ================================================== */}

        <div className="hidden w-1/2 bg-gray-900 lg:flex lg:flex-col lg:justify-between">
          <div className="p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-900">
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
              Manage every customer conversation
              from one place.
            </p>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-400">
              Connect your customer channels, automate
              repetitive enquiries with AI, and give your
              team one unified workspace.
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your customer experience workspace
            </div>
          </div>

          <div className="px-10 pb-8">
            <p className="text-[10px] text-gray-500">
              © {new Date().getFullYear()} ThreadOS AI
            </p>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE — LOGIN
        ================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile brand */}

            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                  T
                </div>

                <div>
                  <h1 className="text-lg font-bold text-gray-900">
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

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign in to manage your customer
                conversations and business.
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
              className="mt-8 space-y-5"
            >
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
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sign up */}

            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Create a seller account
                </Link>
              </p>
            </div>

            {/* Security note */}

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <Lock size={11} />
              Secure seller access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;