import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useInvoices();
  const [statusFilter, setStatusFilter] = useState('All');
  const [overdueDays, setOverdueDays] = useState(() => {
    const saved = localStorage.getItem('overdueDays');
    return saved ? parseInt(saved) : 30;
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate("/login");
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

  // Helper function to determine if an invoice is overdue
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Invoice
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all">
              Export Data
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all">
              Generate Report
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                      className={`px-3 py-1 text-sm rounded-md transition-all ${
                        overdueDays === days
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
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    statusFilter === status
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

      {/* Invoice Table */}
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
                <tr key={invoice.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-white/80">{invoice.date}</td>
                  <td className="px-6 py-4 text-white/80">{invoice.company}</td>
                  <td className="px-6 py-4 text-white font-medium">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditInvoice(invoice.id)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-md transition-all mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteInvoice(invoice.id)}
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

      {/* Empty State Message (if no invoices) */}
      {filteredInvoices.length === 0 && invoices.length > 0 && (
        <div className="bg-slate-800/90 p-12 rounded-2xl shadow-xl text-center">
          <div className="text-white/60 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No {statusFilter.toLowerCase()} invoices</h3>
          <p className="text-white/80 mb-6">Try selecting a different filter or create a new invoice</p>
          <button
            onClick={() => handleFilterChange('All')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition-all mr-4"
          >
            Show All Invoices
          </button>
          <button
            onClick={handleCreateInvoice}
            className="px-6 py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all"
          >
            Create Invoice
          </button>
        </div>
      )}
      
      {invoices.length === 0 && (
        <div className="bg-slate-800/90 p-12 rounded-2xl shadow-xl text-center">
          <div className="text-white/60 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No invoices yet</h3>
          <p className="text-white/80 mb-6">Get started by creating your first invoice</p>
          <button
            onClick={handleCreateInvoice}
            className="px-6 py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all"
          >
            Create Your First Invoice
          </button>
        </div>
      )}
    </div>
  );
}