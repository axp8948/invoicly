// src/components/InvoiceCharts.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useInvoices } from '../context/InvoiceContext';

export default function InvoiceCharts({ onClose }) {
  const { invoices } = useInvoices();

  const overdueDays = parseInt(localStorage.getItem('overdueDays'), 10) || 30;
  const today = new Date();

  // Sum amounts per status
  const statusAmounts = invoices.reduce(
    (acc, inv) => {
      const amt = inv.amount;
      if (inv.status === 'Paid') {
        acc.Paid += amt;
      } else {
        const daysDiff = Math.floor(
          (today - new Date(inv.date)) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > overdueDays) acc.Overdue += amt;
        else acc.Pending += amt;
      }
      return acc;
    },
    { Paid: 0, Pending: 0, Overdue: 0 }
  );

  // Build data and filter zeros
  const pieData = [
    { name: 'Paid',    value: statusAmounts.Paid    },
    { name: 'Pending', value: statusAmounts.Pending },
    { name: 'Overdue', value: statusAmounts.Overdue },
  ].filter(d => d.value > 0);

  const COLORS = ['#4ade80', '#fde68a', '#f87171'];

  // Label inside slice
  const renderLabel = ({ name, value }) => `${name}: $${value.toFixed(2)}`;

  return (
    <div className="relative bg-slate-800/90 p-6 rounded-2xl shadow-xl mb-6">
      {/* Close × */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white text-2xl hover:text-red-400"
      >
        ×
      </button>

      <h3 className="text-white text-lg mb-4">Invoice Status Distribution</h3>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart margin={{ top: 20, bottom: 20 }}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={80}
            labelLine={false}
            label={renderLabel}
          >
            {pieData.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
