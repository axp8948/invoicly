import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import EditInvoice from "./pages/EditInvoice";
import CreateInvoice from "./pages/CreateInvoice";
import { InvoiceProvider } from "./context/InvoiceContext";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <InvoiceProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* protected */}
          <Route
            element={
              <RequireAuth>
                <InvoiceProvider>
                  <Outlet />
                </InvoiceProvider>
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/edit-invoice" element={<EditInvoice />} />
          </Route>
        </Route>
      </Routes>
    </InvoiceProvider>
  );
}
