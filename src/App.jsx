import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import EditInvoice from "./pages/EditInvoice";
import CreateInvoice from "./pages/CreateInvoice";
import { InvoiceProvider } from "./context/InvoiceContext";

export default function App() {
  return (
    <InvoiceProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-invoice" element={<EditInvoice />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
        </Route>
      </Routes>
    </InvoiceProvider>
  );
}
