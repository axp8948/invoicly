import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  // Initialize with sample data if no existing data in localStorage
  const getInitialInvoices = () => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        invoiceNumber: "INV-001",
        date: "2024/01/15",
        company: "Acme Ltd Drone Company",
        amount: 250.00,
        status: "Paid"
      },
      {
        id: 2,
        invoiceNumber: "INV-002", 
        date: "2024/01/16",
        company: "Beta Ltd Drone Company",
        amount: 300.00,
        status: "Pending"
      },
      {
        id: 3,
        invoiceNumber: "INV-003",
        date: "2024/01/17", 
        company: "Gamma Ltd Drone Company",
        amount: 450.00,
        status: "Pending"
      }
    ];
  };

  const [invoices, setInvoices] = useState(getInitialInvoices);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Generate next invoice number
  const generateInvoiceNumber = () => {
    const maxNum = invoices.reduce((max, invoice) => {
      const num = parseInt(invoice.invoiceNumber.replace('INV-', ''));
      return num > max ? num : max;
    }, 0);
    return `INV-${String(maxNum + 1).padStart(3, '0')}`;
  };

  // Add new invoice
  const addInvoice = (invoiceData) => {
    const newInvoice = {
      id: Date.now(), // Simple ID generation
      invoiceNumber: generateInvoiceNumber(),
      date: invoiceData.date,
      company: invoiceData.company,
      amount: parseFloat(invoiceData.amount),
      status: invoiceData.status === "Y" ? "Paid" : "Pending"
    };
    
    setInvoices(prev => [newInvoice, ...prev]); // Add to beginning of array
    return newInvoice;
  };

  // Update existing invoice
  const updateInvoice = (id, updatedData) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...updatedData }
          : invoice
      )
    );
  };

  // Delete invoice
  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  // Get invoice by ID
  const getInvoiceById = (id) => {
    return invoices.find(invoice => invoice.id === parseInt(id));
  };

  const value = {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    generateInvoiceNumber
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}; 