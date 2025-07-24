import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditInvoice() {
  const navigate = useNavigate()

  const [clientName, setClientName] = useState('John Doe')
  const [itemDescription, setItemDescription] = useState('Web design services')
  const [amount, setAmount] = useState(1200)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulated success
      setMessage('Invoice updated successfully!')
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
          Edit <span className="text-lime-300">Invoice</span>
        </h2>

        <input
          type="text"
          placeholder="Client Name"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />

        <textarea
          placeholder="Item Description"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="number"
          placeholder="Amount"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

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
