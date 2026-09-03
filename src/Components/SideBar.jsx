import React from "react";
import {
  Inbox,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import { useSettings } from "../hooks/useSettings";

const SideBar = ({
  sidebarOpen,
  setSidebarOpen,
  inboxCount = 0,
}) => {
  const { settings } = useSettings();

  const businessName =
    settings?.general?.businessName || "ThreadOS AI";

  const businessCategory =
    settings?.general?.businessCategory || "FASHION";

  const navItems = [
    {
      to: "/",
      label: "Inbox",
      description: "Conversations",
      icon: Inbox,
      color: "social",
      badge: inboxCount,
    },
    {
      to: "/customers",
      label: "Customers",
      description: "Profiles & history",
      icon: Users,
      color: "rose",
    },
    {
      to: "/products",
      label: "Products",
      description: "Catalog & inventory",
      icon: ShoppingBag,
      color: "order",
    },
    {
      to: "/analytics",
      label: "Analytics",
      description: "Performance insights",
      icon: BarChart3,
      color: "info",
    },
    {
      to: "/settings",
      label: "Settings",
      description: "AI & preferences",
      icon: Settings,
      color: "ai",
    },
  ];

  const colorStyles = {
    social: {
      icon: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
      active:
        "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
      activeIcon:
        "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25",
      hover:
        "group-hover:bg-pink-100 group-hover:text-pink-700 dark:group-hover:bg-pink-500/15 dark:group-hover:text-pink-300",
      badge: "bg-pink-500",
    },

    rose: {
      icon: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      active:
        "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
      activeIcon:
        "bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25",
      hover:
        "group-hover:bg-rose-100 group-hover:text-rose-700 dark:group-hover:bg-rose-500/15 dark:group-hover:text-rose-300",
      badge: "bg-rose-500",
    },

    order: {
      icon: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      active:
        "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
      activeIcon:
        "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25",
      hover:
        "group-hover:bg-orange-100 group-hover:text-orange-700 dark:group-hover:bg-orange-500/15 dark:group-hover:text-orange-300",
      badge: "bg-orange-500",
    },

    info: {
      icon: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
      active:
        "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
      activeIcon:
        "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25",
      hover:
        "group-hover:bg-sky-100 group-hover:text-sky-700 dark:group-hover:bg-sky-500/15 dark:group-hover:text-sky-300",
      badge: "bg-sky-500",
    },

    ai: {
      icon: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      active:
        "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
      activeIcon:
        "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25",
      hover:
        "group-hover:bg-violet-100 group-hover:text-violet-700 dark:group-hover:bg-violet-500/15 dark:group-hover:text-violet-300",
      badge: "bg-violet-500",
    },
  };

  const getColorStyle = (color) =>
    colorStyles[color] || colorStyles.ai;

  const initials =
    businessName?.charAt(0)?.toUpperCase() || "T";

  return (
    <aside
      className={`
        relative z-40 flex h-screen shrink-0 flex-col overflow-visible
        border-r border-slate-200/80
        bg-white
        transition-[width] duration-300 ease-in-out
        dark:border-slate-800
        dark:bg-slate-950
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* =====================================================
          BRAND HEADER
      ====================================================== */}

      <div
        className={`
          relative flex h-[76px] shrink-0 items-center
          border-b border-slate-200/80
          dark:border-slate-800
          ${
            sidebarOpen
              ? "justify-between px-5"
              : "justify-center px-3"
          }
        `}
      >
        {/* subtle top glow */}
        <div
          className="
            pointer-events-none absolute inset-x-0 top-0 h-px
            bg-gradient-to-r
            from-transparent via-violet-400/60 to-transparent
          "
        />

        {sidebarOpen ? (
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-500
                  text-sm font-bold text-white
                  shadow-lg shadow-violet-500/20
                "
              >
                {initials}
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    truncate text-[15px] font-bold tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  {businessName}
                </h1>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className="
                      relative flex h-1.5 w-1.5
                      rounded-full bg-emerald-500
                    "
                  >
                    <span
                      className="
                        absolute inset-0 rounded-full
                        bg-emerald-400 opacity-60
                        animate-ping
                      "
                    />
                  </span>

                  <span
                    className="
                      text-[10px] font-medium uppercase
                      tracking-wider text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-500
              text-sm font-bold text-white
              shadow-lg shadow-violet-500/25
            "
            title={businessName}
            aria-label={businessName}
          >
            {initials}

            <span
              className="
                absolute -right-0.5 -top-0.5 h-2.5 w-2.5
                rounded-full border-2 border-white
                bg-emerald-500
                dark:border-slate-950
              "
              aria-label="Online"
            />
          </div>
        )}

        {sidebarOpen && (
          <div
            className="
              hidden rounded-full
              border border-violet-100
              bg-violet-50
              px-2.5 py-1
              text-[9px] font-bold uppercase tracking-widest
              text-violet-600
              sm:block
              dark:border-violet-500/20
              dark:bg-violet-500/10
              dark:text-violet-400
            "
          >
            {businessCategory}
          </div>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          min-h-0 flex-1 overflow-y-auto
          px-3 py-5
          scrollbar-thin
          scrollbar-thumb-slate-200
          dark:scrollbar-thumb-slate-800
        "
        aria-label="Main navigation"
      >
        {sidebarOpen && (
          <div className="mb-3 flex items-center px-2">
            <span
              className="
                text-[10px] font-bold uppercase
                tracking-[0.14em]
                text-slate-400
                dark:text-slate-500
              "
            >
              Workspace
            </span>

            <div className="ml-2 h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>
        )}

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const colors = getColorStyle(item.color);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) => `
                  group relative flex rounded-2xl
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-violet-500
                  focus-visible:ring-offset-2
                  dark:focus-visible:ring-offset-slate-950

                  ${
                    sidebarOpen
                      ? "items-center gap-3 px-2.5 py-2.5"
                      : "items-center justify-center px-2 py-3"
                  }

                  ${
                    isActive
                      ? `${colors.active} shadow-sm`
                      : `
                        text-slate-500
                        hover:bg-slate-50
                        hover:text-slate-900
                        dark:text-slate-400
                        dark:hover:bg-slate-900
                        dark:hover:text-white
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span
                        className="
                          absolute left-0 top-1/2
                          h-8 w-1
                          -translate-y-1/2
                          rounded-r-full
                          bg-gradient-to-b
                          from-violet-500 to-indigo-500
                        "
                        aria-hidden="true"
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`
                        relative flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl
                        transition-all duration-200

                        ${
                          isActive
                            ? colors.activeIcon
                            : `${colors.icon} ${colors.hover}`
                        }

                        ${
                          !isActive
                            ? "group-hover:scale-[1.03]"
                            : "scale-[1.02]"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.25 : 1.9}
                      />

                      {/* Inbox unread indicator */}
                      {item.badge > 0 && !sidebarOpen && (
                        <span
                          className={`
                            absolute -right-1 -top-1
                            flex h-[17px] min-w-[17px]
                            items-center justify-center
                            rounded-full
                            border-2 border-white
                            px-1
                            text-[8px] font-bold text-white
                            dark:border-slate-950
                            ${colors.badge}
                          `}
                          aria-label={`${item.badge} unread`}
                        >
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </div>

                    {/* Expanded content */}
                    {sidebarOpen && (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              truncate text-[13px]
                              transition-colors duration-200
                              ${
                                isActive
                                  ? "font-semibold text-slate-900 dark:text-white"
                                  : "font-medium text-slate-600 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                              }
                            `}
                          >
                            {item.label}
                          </span>

                          {item.badge > 0 && (
                            <span
                              className={`
                                ml-auto flex h-5 min-w-5
                                items-center justify-center
                                rounded-full px-1.5
                                text-[9px] font-bold text-white
                                shadow-sm
                                ${colors.badge}
                              `}
                              aria-label={`${item.badge} unread messages`}
                            >
                              {item.badge > 99 ? "99+" : item.badge}
                            </span>
                          )}
                        </div>

                        <span
                          className="
                            mt-0.5 block truncate
                            text-[11px] font-medium
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {item.description}
                        </span>
                      </div>
                    )}

                    {/* Hover arrow */}
                    {sidebarOpen && (
                      <ChevronRight
                        size={14}
                        className={`
                          shrink-0
                          text-slate-300
                          opacity-0
                          transition-all duration-200
                          group-hover:translate-x-0.5
                          group-hover:opacity-100
                          dark:text-slate-600
                          ${
                            isActive
                              ? "opacity-60 text-violet-400"
                              : ""
                          }
                        `}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* =====================================================
            SUPPORT
        ====================================================== */}

        <div className="my-5 flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />

          {sidebarOpen && (
            <span
              className="
                text-[9px] font-bold uppercase
                tracking-[0.14em]
                text-slate-400
                dark:text-slate-600
              "
            >
              Support
            </span>
          )}

          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <NavLink
          to="/help"
          title={!sidebarOpen ? "Help & Docs" : undefined}
          className={({ isActive }) => `
            group relative flex rounded-2xl
            transition-all duration-200
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-violet-500
            focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-slate-950

            ${
              sidebarOpen
                ? "items-center gap-3 px-2.5 py-2.5"
                : "items-center justify-center px-2 py-3"
            }

            ${
              isActive
                ? "bg-violet-50 text-violet-700 shadow-sm dark:bg-violet-500/10 dark:text-violet-300"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
            }
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="
                    absolute left-0 top-1/2
                    h-8 w-1
                    -translate-y-1/2
                    rounded-r-full
                    bg-gradient-to-b
                    from-violet-500 to-indigo-500
                  "
                />
              )}

              <div
                className={`
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-violet-500/10 dark:group-hover:text-violet-400"
                  }
                `}
              >
                <HelpCircle
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.9}
                />
              </div>

              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <div
                    className={`
                      truncate text-[13px] font-semibold
                      ${
                        isActive
                          ? "text-violet-700 dark:text-violet-300"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    `}
                  >
                    Help & Docs
                  </div>

                  <div
                    className="
                      mt-0.5 truncate
                      text-[11px] font-medium
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Guides & support
                  </div>
                </div>
              )}

              {sidebarOpen && (
                <ChevronRight
                  size={14}
                  className="
                    text-slate-300
                    opacity-0
                    transition-all duration-200
                    group-hover:translate-x-0.5
                    group-hover:opacity-100
                    dark:text-slate-600
                  "
                />
              )}
            </>
          )}
        </NavLink>
      </nav>


     
{/* =====================================================
    USER / ACCOUNT
====================================================== */}

<div
  className="
    shrink-0
    border-t border-slate-200/80
    bg-white
    p-3
    dark:border-slate-800
    dark:bg-slate-950
  "
>
  {sidebarOpen ? (
    /* =================================================
       EXPANDED ACCOUNT
    ================================================== */
    <div
      className="
        rounded-2xl
        border border-slate-200/80
        bg-slate-50/70
        p-2
        transition-all duration-200
        hover:border-slate-300
        hover:bg-white
        hover:shadow-sm
        dark:border-slate-800
        dark:bg-slate-900/60
        dark:hover:border-slate-700
        dark:hover:bg-slate-900
      "
    >
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-gradient-to-br
              from-violet-600
              via-indigo-600
              to-pink-500
              text-sm font-bold
              text-white
              shadow-md
              shadow-violet-500/20
            "
          >
            {initials}
          </div>

          {/* Online indicator */}
          <span
            className="
              absolute -bottom-0.5 -right-0.5
              h-3 w-3
              rounded-full
              border-2 border-slate-50
              bg-emerald-500
              dark:border-slate-900
            "
            aria-label="Online"
          />
        </div>

        {/* Account information */}
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-[13px]
              font-semibold
              leading-5
              text-slate-900
              dark:text-white
            "
          >
            Isaac Morgan
          </p>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className="
                inline-flex h-1.5 w-1.5
                rounded-full
                bg-emerald-500
              "
            />

            <span
              className="
                truncate
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-slate-400
                dark:text-slate-500
              "
            >
              Administrator
            </span>
          </div>
        </div>

        {/* Sign out */}
        <div className="shrink-0">
          <SignOutButton sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  ) : (
    /* =================================================
       COLLAPSED ACCOUNT
    ================================================== */
    <div className="flex flex-col items-center gap-2">
      {/* Avatar */}
      <div
        className="
          group relative
          flex h-10 w-10
          cursor-default
          items-center justify-center
          rounded-xl
          bg-gradient-to-br
          from-violet-600
          via-indigo-600
          to-pink-500
          text-sm font-bold
          text-white
          shadow-md
          shadow-violet-500/20
          transition-all duration-200
          hover:scale-105
          hover:shadow-lg
          hover:shadow-violet-500/25
        "
        title={`${businessName} — Administrator`}
        aria-label={`${businessName} — Administrator`}
      >
        {initials}

        {/* Online indicator */}
        <span
          className="
            absolute -bottom-0.5 -right-0.5
            h-3 w-3
            rounded-full
            border-2 border-white
            bg-emerald-500
            dark:border-slate-950
          "
          aria-label="Online"
        />

        {/* Account tooltip */}
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
            opacity-0
            shadow-lg
            transition-all duration-200
            group-hover:translate-x-0
            group-hover:opacity-100
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <p
            className="
              text-xs
              font-semibold
              text-slate-800
              dark:text-white
            "
          >
            Isaac Morgan
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              font-medium
              uppercase
              tracking-wider
              text-slate-400
              dark:text-slate-500
            "
          >
            Administrator
          </p>

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
      </div>

      {/* Sign out */}
      <div className="flex items-center justify-center">
        <SignOutButton sidebarOpen={sidebarOpen} />
      </div>
    </div>
  )}
</div>



      {/* =====================================================
          COLLAPSE / EXPAND BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setSidebarOpen((current) => !current)
        }
        aria-label={
          sidebarOpen
            ? "Collapse sidebar"
            : "Expand sidebar"
        }
        title={
          sidebarOpen
            ? "Collapse sidebar"
            : "Expand sidebar"
        }
        className="
          absolute -right-3 top-[72px] z-50
          flex h-7 w-7
          items-center justify-center
          rounded-full
          border border-slate-200
          bg-white
          text-slate-500
          shadow-md
          shadow-slate-900/10
          transition-all duration-200
          hover:scale-105
          hover:border-violet-200
          hover:bg-violet-50
          hover:text-violet-600
          hover:shadow-lg
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-violet-500
          focus-visible:ring-offset-2
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-400
          dark:hover:border-violet-500/30
          dark:hover:bg-violet-500/10
          dark:hover:text-violet-400
          dark:focus-visible:ring-offset-slate-950
        "
      >
        {sidebarOpen ? (
          <ChevronLeft size={14} strokeWidth={2.2} />
        ) : (
          <ChevronRight size={14} strokeWidth={2.2} />
        )}
      </button>
    </aside>
  );
};

export default SideBar;