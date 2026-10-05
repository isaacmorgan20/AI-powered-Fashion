import React from "react";
import {
 Inbox,
 Users,
 ShoppingBag,
 BarChart3,
 ShoppingCart,
 Megaphone,
 Settings,
 HelpCircle,
 ChevronLeft,
 ChevronRight,
 Bot,
 X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, Badge, Button } from "../ui";
import { useSettings } from "../../hooks/useSettings";
import useAuthStore from "../../Store/AuthStore";

const SideBar = ({
 sidebarOpen,
 setSidebarOpen,
 mobileMenuOpen,
 setMobileMenuOpen,
 onCloseMobile,
 inboxCount = 0,
}) => {
 const { settings } = useSettings();
 const { user } = useAuthStore();

 // On desktop (lg:), follow sidebarOpen. On mobile/tablet (< lg), the drawer is fully expanded when open.
 const isExpanded = sidebarOpen || mobileMenuOpen;

 const businessName =
 settings?.general?.businessName || "ThreadOS";
 const businessCategory =
 settings?.general?.businessCategory || "FASHION";

 const initials = businessName?.charAt(0)?.toUpperCase() || "T";

 const userName = user?.displayName || user?.email?.split("@")[0] || "User";
 const userRole = "Administrator";

 const navItems = [
 {
 to: "/",
 label: "Inbox",
 description: "Conversations",
 icon: Inbox,
 badge: inboxCount,
 },
 {
 to: "/customers",
 label: "Customers",
 description: "Profiles & history",
 icon: Users,
 },
 {
 to: "/products",
 label: "Products",
 description: "Catalog & inventory",
 icon: ShoppingBag,
 },
 {
 to: "/analytics",
 label: "Analytics",
 description: "Performance insights",
 icon: BarChart3,
 },

 {
 to: "/settings",
 label: "Settings",
 description: "AI & preferences",
 icon: Settings,
 },
 ];

 const supportItems = [
 {
 to: "/help",
 label: "Help & Docs",
 description: "Guides & support",
 icon: HelpCircle,
 },
 ];

 return (
 <aside
 className={`
 fixed inset-y-0 left-0 z-50 flex h-full max-h-screen flex-col
 border-r bg-sidebar-bg
 w-72 max-w-[85vw] sm:w-80 shadow-2xl
 transition-transform duration-300 ease-in-out
 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
 lg:relative lg:inset-auto lg:z-40 lg:h-screen lg:shrink-0 lg:shadow-none
 lg:translate-x-0 lg:transition-[width]
 ${sidebarOpen ? "lg:w-64" : "lg:w-20"}
 `}
 aria-label="Main navigation"
 >
 {/* =====================================================
 BRAND HEADER
 ====================================================== */}
 <div
 className={`
 relative flex h-16 shrink-0 items-center
 border-b border-sidebar-border
 ${isExpanded ? "justify-between px-4" : "justify-center px-2"}
 `}
 >
 {isExpanded ? (
 <div className="min-w-0 flex items-center gap-3">
 <div
 className="
 flex h-9 w-9 shrink-0 items-center justify-center
 rounded-xl
 bg-primary text-primary-foreground
 font-bold text-sm
 shadow-sm
 "
 >
 {initials}
 </div>
 <div className="min-w-0">
 <h1 className="truncate text-sm font-semibold text-sidebar-text">
 {businessName}
 </h1>
 <span className="inline-flex items-center gap-1.5 mt-1">
 <span className="relative flex h-1.5 w-1.5">
 <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
 </span>
 <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-text-muted">
 Live
 </span>
 </span>
 </div>
 </div>
 ) : (
 <div
 className="
 relative flex h-10 w-10 items-center justify-center
 rounded-xl bg-primary text-primary-foreground
 font-bold text-sm shadow-sm
 "
 title={businessName}
 aria-label={businessName}
 >
 {initials}
 <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-sidebar-bg bg-success" aria-label="Online" />
 </div>
 )}

 <div className="flex items-center gap-1">
 {isExpanded && (
 <span className="hidden sm:inline-flex items-center gap-1 text-gray-100 px-1 text-xs font-bold uppercase tracking-tighter">
 {businessCategory}
 </span>
 )}

 {/* Mobile close drawer button */}
 <button
 type="button"
 onClick={() => onCloseMobile?.()}
 className="p-1.5 rounded-lg text-sidebar-text-muted hover:text-sidebar-text hover:bg-gray-800 lg:hidden cursor-pointer transition"
 aria-label="Close sidebar"
 >
 <X size={18} />
 </button>
 </div>
 </div>

 {/* =====================================================
 NAVIGATION
 ====================================================== */}
 <nav
 className="
 min-h-0 flex-1 overflow-y-auto
 px-3
 scrollbar-thin
 "
 aria-label="Main navigation"
 >
 {sidebarOpen && (
 <div className="flex items-center px-1">
 <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-sidebar-text-muted">
 Workspace
 </span>
 <div className="ml-2 h-px flex-1 bg-gray-700" />
 </div>
 )}

 <div className="space-y-1">
 {navItems.map((item) => {
 const Icon = item.icon;

 return (
 <NavLink
 key={item.to}
 to={item.to}
 end={item.to === "/"}
 title={!sidebarOpen ? item.label : undefined}
 className={({ isActive }) => `
 group relative flex rounded-lg
 transition-all duration-200
 focus-visible:outline-none
 focus-visible:ring-2
 focus-visible:ring-primary/20
 focus-visible:ring-offset-2
 focus-visible:ring-offset-sidebar-bg

 ${sidebarOpen
 ? "items-center gap-3 px-2.5 py-2.5"
 : "items-center justify-center px-1 py-2"
 }

 ${isActive
 ? "bg-primary/10 text-primary shadow-sm"
 : `
 text-sidebar-text-muted
 hover:bg-gray-800
 hover:text-sidebar-text
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
 bg-primary
 "
 aria-hidden="true"
 />
 )}

 {/* Icon */}
 <div
 className={`
 relative flex h-10 w-10 shrink-0
 items-center justify-center
 rounded-lg
 transition-all duration-200

 ${isActive
 ? "bg-primary text-primary-foreground shadow-sm"
 : "text-sidebar-text-muted group-hover:bg-gray-600 group-hover:text-sidebar-text"
 }

 ${!isActive
 ? "group-hover:scale-[1.02]"
 : "scale-[1.01]"
 }
 `}
 >
 <Icon size={15} strokeWidth={isActive ? 2.25 : 1.9} />

 {/* Badge for collapsed state */}
 {item.badge && item.badge > 0 && !sidebarOpen && (
 <span
 className={`
 absolute -right-1 -top-1
 flex h-5 min-w-5 items-center justify-center
 rounded-full border-2 border-sidebar-bg px-1
 text-[10px] font-bold text-primary-foreground
 bg-primary
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
 truncate text-sm
 transition-colors duration-200
 ${isActive
 ? "font-semibold text-sidebar-text"
 : "font-medium text-sidebar-text-muted group-hover:text-sidebar-text"
 }
 `}
 >
 {item.label}
 </span>

 {item.badge && item.badge > 0 && (
 <Badge variant="default" className="ml-auto">
 {item.badge > 99 ? "99+" : item.badge}
 </Badge>
 )}
 </div>

 <span className="mt-0.5 block truncate text-[11px] font-medium text-sidebar-text-muted">
 {item.description}
 </span>
 </div>
 )}

 {/* Hover arrow */}
 {sidebarOpen && (
 <ChevronRight
 size={10}
 className={`
 shrink-0
 text-sidebar-text-muted
 opacity-0
 transition-all duration-200
 group-hover:translate-x-0.5
 group-hover:opacity-100
 ${isActive ? "opacity-60 text-primary" : ""}
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
 <div className="m-1 flex items-center gap-2 px-1">
 <div className="h-px flex-1 bg-gray-600" />

 {sidebarOpen && (
 <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-sidebar-text-muted">
 Support
 </span>
 )}

 <div className="h-px flex-1 bg-gray-600" />
 </div>

 {supportItems.map((item) => {
 const Icon = item.icon;

 return (
 <NavLink
 key={item.to}
 to={item.to}
 title={!sidebarOpen ? item.label : undefined}
 className={({ isActive }) => `
 group relative flex rounded-lg
 transition-all duration-200
 focus-visible:outline-none
 focus-visible:ring-2
 focus-visible:ring-primary/20
 focus-visible:ring-offset-2
 focus-visible:ring-offset-sidebar-bg

 ${sidebarOpen
 ? "items-center gap-3 px-2.5 py-2.5"
 : "items-center justify-center px-1 py-2"
 }

 ${isActive
 ? "bg-primary/10 text-primary shadow-sm"
 : `
 text-sidebar-text-muted
 hover:bg-gray-800
 hover:text-sidebar-text
 `
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
 bg-primary
 "
 aria-hidden="true"
 />
 )}

 <div
 className={`
 relative flex h-10 w-10 shrink-0
 items-center justify-center
 rounded-lg
 transition-all duration-200

 ${isActive
 ? "bg-primary text-primary-foreground shadow-sm"
 : "text-sidebar-text-muted group-hover:bg-gray-600 group-hover:text-sidebar-text"
 }

 ${!isActive
 ? "group-hover:scale-[1.02]"
 : "scale-[1.01]"
 }
 `}
 >
 <Icon size={15} strokeWidth={isActive ? 2.25 : 1.9} />
 </div>

 {sidebarOpen && (
 <div className="min-w-0 flex-1">
 <div className={`
 truncate text-sm
 transition-colors duration-200
 ${isActive
 ? "font-semibold text-sidebar-text"
 : "font-medium text-sidebar-text-muted group-hover:text-sidebar-text"
 }
 `}
 >
 {item.label}
 </div>

 <span className="mt-0.5 block truncate text-[11px] font-medium text-sidebar-text-muted">
 {item.description}
 </span>
 </div>
 )}

 {sidebarOpen && (
 <ChevronRight
 size={14}
 className={`
 shrink-0
 text-sidebar-text-muted
 opacity-0
 transition-all duration-200
 group-hover:translate-x-0.5
 group-hover:opacity-100
 ${isActive ? "opacity-60 text-primary" : ""}
 `}
 />
 )}
 </>
 )}
 </NavLink>
 );
 })}
 </nav>



 {/* =====================================================
 USER / ACCOUNT
 ====================================================== */}
 <div
 className="
 shrink-0
 border-t border-sidebar-border
 p-3
 "
 >
 {sidebarOpen ? (
 <div className="rounded-lg p-2">
 <div className="flex items-center gap-3">
 <Avatar
 name={userName}
 size="md"
 online
 className="shrink-0"
 />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-semibold text-sidebar-text">
 {userName}
 </p>
 <div className="mt-0.5 flex items-center gap-1.5">
 <span className="relative flex h-1.5 w-1.5">
 <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
 </span>
 <span className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-sidebar-text-muted">
 {userRole}
 </span>
 </div>
 </div>

 </div>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-2">
 <div className="group relative flex h-10 w-10 cursor-default items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg" title={`${businessName} — ${userRole}`} aria-label={`${businessName} — ${userRole}`}>
 <Avatar name={userName} size="md" online className="shrink-0" />
 </div>
 <Button
 variant="ghost"
 size="icon"
 className="text-sidebar-text-muted hover:text-sidebar-text"
 aria-label="Sign out"
 >
 <ChevronRight size={16} strokeWidth={2} />
 </Button>
 </div>
 )}
 </div>

 {/* =====================================================
 COLLAPSE / EXPAND BUTTON
 ====================================================== */}
 <button
 type="button"
 onClick={() => setSidebarOpen((current) => !current)}
 aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
 title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
 className="
 absolute -right-2.5 top-1/2 -translate-y-1/2 z-50
 hidden md:hidden lg:flex
 h-8 w-8 items-center justify-center
 rounded-full
 border border-border-light
 bg-surface-primary
 text-sidebar-text-muted
 shadow-sm
 transition-all duration-200
 hover:scale-105
 hover:border-primary/20
 hover:bg-surface-muted
 hover:text-primary
 hover:shadow-md
 focus-visible:outline-none
 focus-visible:ring-2
 focus-visible:ring-primary/20
 focus-visible:ring-offset-2
 focus-visible:ring-offset-sidebar-bg

 "
 >
 {sidebarOpen ? (
 <ChevronLeft size={16} strokeWidth={2.2} />
 ) : (
 <ChevronRight size={16} strokeWidth={2.2} />
 )}
 </button>
 </aside>
 );
};

export default SideBar;
