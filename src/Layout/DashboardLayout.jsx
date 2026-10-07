import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/layout/Sidebar";
import TopBar from "../Components/layout/TopBar";
import { useConversations } from "../hooks/useConversations";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { conversations, loading } = useConversations();
    const location = useLocation();

    // Sidebar badge shows only unread (new) conversations, not the total
    const conversationCount = loading
        ? 0
        : conversations.filter((conversation) => Number(conversation.unread || 0) > 0).length;

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mobileMenuOpen]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
            {/* Mobile backdrop overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                />
            )}

            {/* =====================================================
 SIDEBAR
 ====================================================== */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                onCloseMobile={() => setMobileMenuOpen(false)}
                inboxCount={conversationCount}
            />

            {/* =====================================================
 MAIN APPLICATION AREA
 ====================================================== */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <TopBar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    onMobileMenuOpen={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
