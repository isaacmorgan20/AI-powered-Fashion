import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore";

const SignOutButton = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      title="Sign out"
      className={`
        flex
        items-center
        justify-center
        rounded-lg
        text-gray-500
        transition-colors
        hover:bg-gray-100
        hover:text-red-600
        dark:text-gray-400
        dark:hover:bg-gray-800
        dark:hover:text-red-400
        ${
          sidebarOpen
            ? "h-9 w-9 shrink-0"
            : "h-8 w-8 bg-white shadow-sm dark:bg-gray-900"
        }
      `}
      aria-label="Sign out"
    >
      <LogOut size={17} strokeWidth={1.8} />
    </button>
  );
};

export default SignOutButton;