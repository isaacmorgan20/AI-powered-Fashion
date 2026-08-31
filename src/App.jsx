import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./Layout/DashboardLayout";
import ProtectedRoute from "./Components/ProtectedRoute";

import Inbox from "./Pages/Inbox";
import Customers from "./Pages/Customers";
import Products from "./Pages/Products";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import Help from "./Components/Help";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import useAuthStore from "./Store/AuthStore";
import { useAppearance } from "./hooks/useAppearance";


const App = () => {
  const listenToAuth = useAuthStore((state) => state.listenToAuth);
  useAppearance();

  useEffect(() => {
    listenToAuth();
  }, [listenToAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Inbox />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>

        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;