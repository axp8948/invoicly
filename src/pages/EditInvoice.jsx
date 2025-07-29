import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'

export default function EditInvoice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const invoiceId = searchParams.get('id')
  const { getInvoiceById, updateInvoice } = useInvoices()

  const [company, setCompany] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('Pending')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  // Load invoice data when component mounts
  useEffect(() => {
    if (invoiceId) {
      const invoice = getInvoiceById(parseInt(invoiceId))
      if (invoice) {
        setCompany(invoice.company)
        setAmount(invoice.amount.toString())
        setDate(invoice.date)
        setStatus(invoice.status)
        setInvoiceNumber(invoice.invoiceNumber)
      } else {
        setMessage('Invoice not found')
      }
    }
  }, [invoiceId, getInvoiceById])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update invoice using context
      updateInvoice(parseInt(invoiceId), {
        company,
        amount: parseFloat(amount),
        date,
        status
      })

      setMessage('Invoice updated successfully!')
      
      // Navigate back to dashboard after delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      setMessage('Failed to update invoice. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          Edit <span className="text-lime-300">Invoice</span> {invoiceNumber}
        </h2>

        <input
          type="date"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Company Name"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending" className="bg-slate-800">Pending</option>
          <option value="Paid" className="bg-slate-800">Paid</option>
        </select>

        <button
          type="submit"
          className={`w-full py-3 font-semibold rounded-md transition-all ${
            isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-lime-400 hover:bg-lime-300'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Update Invoice'}
        </button>

        {message && (
          <div className={`p-4 rounded-md text-sm ${
            message.includes('successfully') 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-lime-300 hover:underline transition"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  )
}
// Tej
