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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignOutButton";

const SideBar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    {
      to: "/",
      label: "Inbox",
      description: "Conversations",
      icon: Inbox,
      badge: 3,
    },
    {
      to: "/customers",
      label: "Customers",
      description: "Profile and history",
      icon: Users,
    },
    {
      to: "/products",
      label: "Products",
      description: "Product catalog & stock",
      icon: ShoppingBag,
    },
    {
      to: "/analytics",
      label: "Analytics",
      description: "Performance",
      icon: BarChart3,
    },
    {
      to: "/settings",
      label: "Settings",
      description: "AI & policies",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        relative
        z-40
        flex
        h-screen
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-gray-200
        bg-white
        transition-[width]
        duration-300
        ease-in-out
        dark:border-gray-800
        dark:bg-gray-900
        ${
          sidebarOpen
            ? "w-64"
            : "w-20"
        }
      `}
    >
      {/* =====================================================
          BRAND
      ====================================================== */}

      <div
        className={`
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-gray-200
          dark:border-gray-800
          ${
            sidebarOpen
              ? "justify-between px-5"
              : "justify-center"
          }
        `}
      >
        {sidebarOpen ? (
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              ThreadOS AI
            </h1>

            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span>Live</span>

              <span className="text-gray-300 dark:text-gray-700">
                •
              </span>

              <span>FASHION</span>
            </div>
          </div>
        ) : (
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-gray-900
              text-sm
              font-bold
              text-white
              dark:bg-white
              dark:text-gray-900
            "
            title="ThreadOS AI"
          >
            T
          </div>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        {sidebarOpen && (
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>
        )}

        {/* Main navigation */}

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                title={
                  sidebarOpen
                    ? undefined
                    : item.label
                }
                className={({ isActive }) => `
                  relative
                  flex
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    sidebarOpen
                      ? "items-start gap-3 px-3 py-2.5"
                      : "items-center justify-center px-2 py-3"
                  }
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}

                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gray-900 dark:bg-white" />
                    )}

                    {/* Icon */}

                    <div
                      className={`
                        flex
                        shrink-0
                        items-center
                        justify-center
                        ${
                          sidebarOpen
                            ? "mt-0.5"
                            : ""
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Expanded content */}

                    {sidebarOpen && (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              truncate
                              text-sm
                              ${
                                isActive
                                  ? "font-semibold"
                                  : "font-medium"
                              }
                            `}
                          >
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-semibold text-white dark:bg-white dark:text-gray-900">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <span className="mt-0.5 block truncate text-xs text-gray-400">
                          {item.description}
                        </span>
                      </div>
                    )}

                    {/* Collapsed inbox badge */}

                    {!sidebarOpen &&
                      item.badge && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[8px] font-semibold text-white dark:bg-white dark:text-gray-900">
                          {item.badge}
                        </span>
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

        <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

        {sidebarOpen && (
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Support
          </p>
        )}

        <NavLink
          to="/help"
          title={
            sidebarOpen
              ? undefined
              : "Help & Docs"
          }
          className={({ isActive }) => `
            relative
            flex
            rounded-xl
            transition-all
            duration-200
            ${
              sidebarOpen
                ? "items-start gap-3 px-3 py-2.5"
                : "items-center justify-center px-2 py-3"
            }
            ${
              isActive
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white"
            }
          `}
        >
          {({ isActive }) => (
            <>
              {/* Active indicator */}

              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gray-900 dark:bg-white" />
              )}

              {/* Icon */}

              <div
                className={`
                  flex
                  shrink-0
                  items-center
                  justify-center
                  ${
                    sidebarOpen
                      ? "mt-0.5"
                      : ""
                  }
                `}
              >
                <HelpCircle
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              {/* Expanded content */}

              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <span
                    className={`
                      block
                      truncate
                      text-sm
                      ${
                        isActive
                          ? "font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    Help & Docs
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-gray-400">
                    Guides and support
                  </span>
                </div>
              )}
            </>
          )}
        </NavLink>
      </nav>

      {/* =====================================================
          USER
      ====================================================== */}

      <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
              IM
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Isaac Morgan
              </p>

              <div className="flex items-center gap-1.5">
                <Circle
                  size={7}
                  fill="currentColor"
                  className="text-green-500"
                />

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
                
              </div>
              
            </div>
            <SignOutButton />
          </div>
        ) : (
          <div
            className="flex justify-center py-2"
            title="Isaac Morgan — Admin"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
                IM
              </div>
              <SignOutButton />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
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
          setSidebarOpen(
            (current) => !current
          )
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
          absolute
          -right-3
          top-20
          z-50
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-gray-200
          bg-white
          text-gray-500
          shadow-md
          transition
          hover:bg-gray-50
          hover:text-gray-900
          dark:border-gray-700
          dark:bg-gray-900
          dark:text-gray-300
          dark:hover:bg-gray-800
        "
      >
        {sidebarOpen ? (
          <ChevronLeft size={15} />
        ) : (
          <ChevronRight size={15} />
        )}
      </button>
    </aside>
  );
};

export default SideBar;