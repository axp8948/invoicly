// Required Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import authService from "../appwrite/auth";
import InvoiceCharts from "../components/InvoiceChartComponent";

// Dashboard Begins
export default function Dashboard() {
  const navigate = useNavigate();
  const { invoices, deleteInvoice, createInvoice, updateInvoice } = useInvoices();
  const [statusFilter, setStatusFilter] = useState('All');
  const [overdueDays, setOverdueDays] = useState(() => {
    const saved = localStorage.getItem('overdueDays');
    return saved ? parseInt(saved) : 30;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // appwrite logic
  const handleLogout = async () => {
    try {
      const response = await authService.logout()
      if (response) {
        console.log("Logout Successful")
        navigate("/login")
      }
    } catch (error) {
      console.log("Error While Logging Out: ", error)
    }
  };

  const handleCreateInvoice = () => {
    navigate("/create-invoice");
  };

  const handleEditInvoice = (invoiceId) => {
    navigate(`/edit-invoice?id=${invoiceId}`);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId);
    }
  };


  // How to create CSV file using JavaScript
  // Credit: https://dev.to/hat52/creating-and-downloading-a-csv-file-using-pure-javascript-a-step-by-step-guide-4ogg


  // Tutorial on how to create CSV File: https://gist.github.com/dhunmoon/d743b327c673b589e7acfcbc5633ff4b?
  const handleExport = () => {
    const headers = ["Invoice #", "Date", "Company", "Amount", "Status"];

    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      new Date(inv.date).toLocaleDateString(),
      inv.company,
      inv.amount.toFixed(2),
      inv.status,
    ]);


    const csvContent =
      [headers, ...rows]
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\n");

    // Create a downloadable blob and click it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    setShowReport(prev => !prev);
  };


  // Helper function to determine if an invoice is overdue
  // Date in JS, Credit: StackOverflow https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
  const isOverdue = (invoice) => {
    if (invoice.status === 'Paid') return false;
    const invoiceDate = new Date(invoice.date);
    const today = new Date();
    const daysDiff = Math.floor((today - invoiceDate) / (1000 * 60 * 60 * 24));
    return daysDiff > overdueDays; // Use configurable overdue threshold
  };

  // Filter invoices based on selected status
  const filteredInvoices = statusFilter === 'All'
    ? invoices
    : statusFilter === 'Overdue'
      ? invoices.filter(invoice => isOverdue(invoice))
      : invoices.filter(invoice => invoice.status === statusFilter);

  const handleFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
  };

  const handleOverdueDaysChange = (newDays) => {
    setOverdueDays(newDays);
    localStorage.setItem('overdueDays', newDays.toString());
  };

  const getStatusBadge = (invoice) => {
    if (invoice.status === "Paid") {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
          Paid
        </span>
      );
    } else if (isOverdue(invoice)) {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
          Overdue
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-lime-300">Invoicly</span> Dashboard
              </h1>
              <p className="text-white/80 mt-2">Manage your invoices and track payments</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreateInvoice}
              className="px-6 py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all flex items-center gap-2"
            >
              {/* Plus Icon Credit: Heroicons https://heroicons.com/outline */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

              Create Invoice
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all"
              onClick={handleExport}>
              Export Data
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all"
              onClick={handleGenerateReport}>
              Generate Report
            </button>


            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all flex items-center gap-2"
            >

              {/* Settings Icon Credit: HeroIcon https://heroicons.com/outline */}

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6">
          <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Dashboard Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/60 hover:text-white"
              >

                {/* X Icon Credit: HeroIcons , https://heroicons.com/outline */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Overdue Threshold (Days)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={overdueDays}
                    onChange={(e) => handleOverdueDaysChange(parseInt(e.target.value) || 30)}
                    className="w-24 px-3 py-2 bg-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                  <span className="text-white/80 text-sm">
                    days after invoice date
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Invoices unpaid for more than {overdueDays} days will be marked as overdue
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Quick Presets
                </label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map((days) => (
                    <button
                      key={days}
                      onClick={() => handleOverdueDaysChange(days)}
                      className={`px-3 py-1 text-sm rounded-md transition-all ${overdueDays === days
                        ? 'bg-lime-400 text-white'
                        : 'bg-white/20 text-white/80 hover:bg-white/30'
                        }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Common business payment terms
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggled Charts */}
      {showReport && (
        <InvoiceCharts onClose={() => setShowReport(false)} />
      )}

      {/* Invoice Status Filter */}
      <div className="mb-6">
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-white">Filter Invoices</h3>
            <div className="flex gap-2">
              {['All', 'Pending', 'Paid', 'Overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${statusFilter === status
                    ? 'bg-lime-400 text-white'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                >
                  {status}
                  {status === 'All' && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                      {invoices.length}
                    </span>
                  )}
                  {status === 'Overdue' && (
                    <span className="ml-2 text-xs bg-red-500/30 px-2 py-1 rounded-full text-red-300">
                      {invoices.filter(inv => isOverdue(inv)).length}
                    </span>
                  )}
                  {(status === 'Pending' || status === 'Paid') && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                      {invoices.filter(inv => inv.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {statusFilter !== 'All' && (
            <div className="mt-4 text-sm text-white/80">
              Showing {filteredInvoices.length} {statusFilter.toLowerCase()} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-lime-300">
              {invoices.length}
            </h3>
            <p className="text-white/80">Total Invoices</p>
          </div>
        </div>
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-300">
              ${invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </h3>
            <p className="text-white/80">Paid Amount</p>
          </div>
        </div>
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-300">
              ${invoices.filter(inv => inv.status === "Pending" && !isOverdue(inv)).reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </h3>
            <p className="text-white/80">Pending Amount</p>
          </div>
        </div>
        <div className="bg-slate-800/90 p-6 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-300">
              ${invoices.filter(inv => isOverdue(inv)).reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </h3>
            <p className="text-white/80">Overdue Amount</p>
          </div>
        </div>
      </div>

      {/* Invoice Table (continued) */}
      {/* How to create a table in web pages
      Credit: GeeksforGeeks https://www.geeksforgeeks.org/html/html-tables/ */}
      <div className="bg-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.$id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-white/80">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white/80">{invoice.company}</td>
                  <td className="px-6 py-4 text-white font-medium">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditInvoice(invoice.$id)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-md transition-all mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(invoice.$id)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded-md transition-all border border-red-500/30"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
