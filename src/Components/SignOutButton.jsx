import React, { useState } from "react";
import {
  LogOut,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const SignOutButton = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        title={sidebarOpen ? undefined : "Sign out"}
        aria-label="Sign out"
        aria-busy={loading}
        className={`
          relative flex w-full items-center overflow-hidden
          rounded-xl border
          transition-all duration-200 ease-out
          
          ${
            sidebarOpen
              ? `
                min-h-[44px]
                gap-3
                px-3.5
                py-2.5
                text-left
              `
              : `
                h-10
                w-10
                justify-center
                px-0
              `
          }

          ${
            loading
              ? `
                cursor-wait
                border-slate-200
                bg-slate-50
                text-slate-400
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-500
              `
              : `
                border-transparent
                text-slate-500
                hover:border-red-100
                hover:bg-red-50
                hover:text-red-600
                dark:text-slate-400
                dark:hover:border-red-950
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              `
          }

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500/60
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white
          dark:focus-visible:ring-offset-slate-950

          disabled:pointer-events-none
        `}
      >
        {/* Icon container */}
        <span
          className={`
            flex shrink-0 items-center justify-center
            rounded-lg
            transition-all duration-200
            ${
              sidebarOpen
                ? "h-8 w-8"
                : "h-8 w-8"
            }
            ${
              loading
                ? "bg-slate-100 dark:bg-slate-800"
                : `
                  bg-slate-100
                  text-slate-500
                  group-hover:bg-red-100
                  group-hover:text-red-600
                  dark:bg-slate-800
                  dark:text-slate-400
                  dark:group-hover:bg-red-950/50
                  dark:group-hover:text-red-400
                `
            }
          `}
        >
          {loading ? (
            <Loader2
              size={16}
              strokeWidth={2}
              className="animate-spin"
            />
          ) : (
            <LogOut
              size={16}
              strokeWidth={2}
              className="
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />
          )}
        </span>

        {/* Text */}
        {sidebarOpen && (
          <span className="min-w-0 flex-1">
            <span
              className={`
                block text-sm font-medium
                ${
                  loading
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-700 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400"
                }
              `}
            >
              {loading ? "Signing out..." : "Sign out"}
            </span>

            {!loading && (
              <span className="mt-0.5 block text-[11px] text-slate-400 dark:text-slate-500">
                End your current session
              </span>
            )}
          </span>
        )}

        {/* Arrow */}
        {sidebarOpen && !loading && (
          <ChevronRight
            size={16}
            strokeWidth={1.8}
            className="
              shrink-0
              text-slate-300
              transition-all duration-200
              group-hover:translate-x-0.5
              group-hover:text-red-400
              dark:text-slate-600
              dark:group-hover:text-red-400
            "
          />
        )}
      </button>

      {/* Collapsed sidebar tooltip */}
      {!sidebarOpen && (
        <div
          className="
            pointer-events-none
            absolute
            left-full
            top-1/2
            z-50
            ml-3
            -translate-y-1/2
            translate-x-1
            whitespace-nowrap
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-xs
            font-medium
            text-slate-700
            opacity-0
            shadow-lg
            transition-all
            duration-200
            group-hover:translate-x-0
            group-hover:opacity-100
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-200
          "
        >
          Sign out

          {/* Tooltip arrow */}
          <span
            className="
              absolute
              right-full
              top-1/2
              -mr-px
              h-2
              w-2
              -translate-y-1/2
              rotate-45
              border-b
              border-l
              border-slate-200
              bg-white
              dark:border-slate-800
              dark:bg-slate-900
            "
          />
        </div>
      )}
    </div>
  );
};

export default SignOutButton;
