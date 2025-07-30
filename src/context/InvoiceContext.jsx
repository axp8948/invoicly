import { createContext, useContext, useEffect, useState } from "react";
import invoiceService from "../appwrite/invoiceServices";
import authService from "../appwrite/auth";

const InvoiceContext = createContext();

export function useInvoices() {
  return useContext(InvoiceContext);
}

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        const result = await invoiceService.getInvoices(user.$id);
        setInvoices(result.documents);
      }
    })();
  }, []);

  const createInvoice = async (data) => {
    const user = await authService.getCurrentUser();
    const newInvoice = await invoiceService.createInvoice({
      ...data,
      userId: user.$id
    });
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const deleteInvoice = async (id) => {
    await invoiceService.deleteInvoice(id);
    setInvoices((prev) => prev.filter((inv) => inv.$id !== id));
  };

  const updateInvoice = async (id, data) => {
    const updated = await invoiceService.updateInvoice(id, data);
    setInvoices((prev) =>
      prev.map((inv) => (inv.$id === id ? updated : inv))
    );
  };

  return (
    <InvoiceContext.Provider value={{ invoices, createInvoice, deleteInvoice, updateInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}
