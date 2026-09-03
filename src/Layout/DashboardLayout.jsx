import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar";
import { useConversations } from "../hooks/useConversations";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { conversations, loading } = useConversations();

  const conversationCount = loading ? 0 : conversations.length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} inboxCount={conversationCount} />

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}

      <main className="min-h-0 min-w-0 flex-1 overflow-hidden"><Outlet /></main>
    </div>
  );
};

export default DashboardLayout;