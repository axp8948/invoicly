import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceCompanyName, setCompanyName] = useState("");
  const [invoiceAmount, setAmount] = useState("");
  const [invoicePayStatus, setPayStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  //Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Here invoice data would typically be sent to backend, but for now just simulating delay and redirect
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Invoice created");
      //navigate("/dashboard"); //may need to add back in once dashboard is implemented...to be tested
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6"
      >
        <input
          type="text"
          placeholder="Invoice Number"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          required
        />

        <input
          type="date"
          placeholder=""
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
          min="0" // Prevent negative values
          step="0.01" // Allow up to 2 decimal places
          placeholder="Amount"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={invoiceAmount}
          onChange={(e) => {
            const value = e.target.value;
            // Validate input to allow only numbers and up to 2 decimal places
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
          checked={invoicePayStatus === "Y"}
          onChange={(e) => setPayStatus(e.target.checked ? "Y" : "N")}
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
        <>
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
        </>
      </form>
    </div>
  );
}
