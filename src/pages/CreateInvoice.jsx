import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";

export default function CreateInvoice() {
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceCompanyName, setCompanyName] = useState("");
  const [invoiceAmount, setAmount] = useState("");
  const [invoicePayStatus, setPayStatus] = useState("Pending"); // Use "Pending" or "Paid"
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { createInvoice } = useInvoices(); // <- FIXED

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
       const invoiceNumber = "INV-" + Date.now();
      const newInvoice = await createInvoice({
        invoiceNumber,
        date: invoiceDate,
        company: invoiceCompanyName,
        amount: parseFloat(invoiceAmount),
        status: invoicePayStatus
      });

      setSuccessMessage(`Invoice created successfully!`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error creating invoice", err);
      alert("Failed to create invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          Create <span className="text-lime-300">Invoice</span>
        </h2>

        <input
          type="date"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Company Name"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={invoiceCompanyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={invoiceAmount}
          
          // Regex Source: StackOverflow
          // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers?
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
              setAmount(value);
            }
          }}
          required
        />

        <input
          type="checkbox"
          id="paidStatus"
          className="mr-2 accent-lime-400"
          checked={invoicePayStatus === "Paid"}
          onChange={(e) => setPayStatus(e.target.checked ? "Paid" : "Pending")}
        />
        <label htmlFor="paidStatus" className="text-white align-middle">
          Paid?
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Invoice"}
        </button>

        {successMessage && (
          <div className="p-4 rounded-md text-sm bg-green-500/20 border border-green-500/30 text-green-300">
            {successMessage}
          </div>
        )}

        <button
          type="button"
          className="w-full py-3 mt-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition-all"
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>
      </form>
    </div>
  );
}
